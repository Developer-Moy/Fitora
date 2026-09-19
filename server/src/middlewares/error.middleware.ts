import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.js";

/**
 * Global Error Handling Middleware
 * ------------------------------------------------------------------
 * A single funnel that converts ANY error thrown or passed to `next()`
 * anywhere in the request lifecycle into the standard Fitora error
 * envelope produced by `errorResponse()`:
 *
 *   { success: false, message: string, error: string, statusCode: number }
 *
 * In development an additional `stack` key is attached so local debugging
 * keeps the full trace, while production responses stay free of stack
 * traces and internal implementation details.
 *
 * Design notes:
 *   - No new response shape is introduced; the existing Fitora structure
 *     is reused for every branch, including unknown/500 errors.
 *   - Better Auth, OAuth provider configuration and JWT verification are
 *     NOT modified. This middleware only normalises outgoing errors.
 *   - Detection is string/shape based (`error.name`, `error.code`,
 *     message matching) rather than importing provider internals, so it
 *     works regardless of which layer surfaced the failure.
 */

/* ------------------------------------------------------------------ */
/* Public error type                                                   */
/* ------------------------------------------------------------------ */

/**
 * Operational error that a controller or service can throw to request a
 * specific HTTP status without hand-rolling a response.
 *
 * @example
 *   throw new AppError("Goal not found", 404, "GOAL_NOT_FOUND");
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  /** Marks the error as expected/operational vs. an unexpected crash. */
  public readonly isOperational: boolean = true;

  constructor(message: string, statusCode = 500, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace?.(this, AppError);
  }
}

/* ------------------------------------------------------------------ */
/* Internal normalised shape                                           */
/* ------------------------------------------------------------------ */

interface NormalizedError {
  statusCode: number;
  /** Short code surfaced as the `error` field of the envelope. */
  errorCode: string;
  /** Human readable message surfaced as the `message` field. */
  message: string;
  /** Full detail for the server log (never sent to the client verbatim). */
  logDetail: string;
  /** Whether the error is an expected operational failure. */
  isOperational: boolean;
}

/** Narrow an unknown thrown value into a shape we can inspect. */
interface ErrorLike {
  name?: string;
  message?: string;
  code?: string | number;
  status?: number | string;
  statusCode?: number | string;
  type?: string;
  errors?: Record<string, { message?: string; path?: string }>;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  stack?: string;
  response?: { status?: number; data?: unknown };
  error?: unknown;
  $metadata?: { httpStatusCode?: number };
}

/** Treat non-object thrown values defensively - TS errors are `unknown`. */
const asErrorLike = (error: unknown): ErrorLike =>
  (typeof error === "object" && error !== null ? error : {}) as ErrorLike;

/** Pull a usable message out of an arbitrary thrown value. */
const readMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) return error.trim();
  const like = asErrorLike(error);
  if (typeof like.message === "string" && like.message.trim())
    return like.message.trim();
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

/** Case-insensitive check that a haystack contains any needle. */
const matchesAny = (haystack: string, needles: string[]): boolean => {
  const lower = haystack.toLowerCase();
  return needles.some((needle) => lower.includes(needle.toLowerCase()));
};

/* ------------------------------------------------------------------ */
/* 1. Mongoose / MongoDB errors                                        */
/* ------------------------------------------------------------------ */

const MONGO_DUPLICATE_KEY_CODE = 11000;

/**
 * Mongoose `ValidationError` -> 400
 * Aggregates every failed path into one readable message so the client
 * can show precisely which fields were rejected.
 */
const normalizeValidationError = (like: ErrorLike): NormalizedError => {
  const fields = like.errors ?? {};
  const details = Object.entries(fields)
    .map(([path, detail]) => {
      const message = detail?.message || "is invalid";
      // Mongoose messages usually already start with the path
      // (e.g. "Path `email` is required.").
      return message.startsWith(path) ? message : `${path}: ${message}`;
    })
    .filter(Boolean);

  const message =
    details.length > 0
      ? `Validation failed: ${details.join("; ")}`
      : "Validation failed: the submitted data is invalid.";

  return {
    statusCode: 400,
    errorCode: "VALIDATION_ERROR",
    message,
    logDetail: `Mongoose ValidationError on [${Object.keys(fields).join(", ")}]`,
    isOperational: true,
  };
};

/**
 * Mongoose `CastError` -> 400
 * e.g. an ObjectId route param that is not a valid ObjectId.
 */
const normalizeCastError = (like: ErrorLike): NormalizedError => {
  const path = typeof like.path === "string" ? like.path : "value";
  const value =
    like.value === undefined || like.value === null ? "" : String(like.value);

  return {
    statusCode: 400,
    errorCode: "INVALID_IDENTIFIER",
    message: `Invalid ${path}${value ? `: '${value}'` : ""}. Please provide a valid identifier.`,
    logDetail: `Mongoose CastError on field '${path}'`,
    isOperational: true,
  };
};

/**
 * MongoDB duplicate key (E11000) -> 409
 * Covers both the raw driver error and Mongoose's wrapped form.
 */
const normalizeDuplicateKeyError = (like: ErrorLike): NormalizedError => {
  const duplicated = Object.keys(like.keyValue ?? {});
  const label = duplicated.length > 0 ? duplicated.join(", ") : "unique field";

  return {
    statusCode: 409,
    errorCode: "DUPLICATE_KEY_ERROR",
    message: `A record with this ${label} already exists.`,
    logDetail: `MongoDB duplicate key on [${label}]`,
    isOperational: true,
  };
};

/* ------------------------------------------------------------------ */
/* 2. Authentication (JWT) errors                                      */
/* ------------------------------------------------------------------ */

/**
 * jsonwebtoken error names are stable public API, so matching on them is
 * safe and avoids a brittle deep import.
 */
const JWT_ERROR_NAMES = new Set([
  "JsonWebTokenError",
  "TokenExpiredError",
  "NotBeforeError",
]);

/**
 * Map jsonwebtoken failures onto the three required 401 cases.
 *
 * `auth.middleware.ts` already intercepts the common paths, so reaching
 * this branch typically means a token error escaped from a controller or
 * a downstream token consumer - the response must still be a clean 401
 * rather than a leaked 500.
 */
const normalizeJwtError = (like: ErrorLike): NormalizedError => {
  const name = like.name ?? "";
  const raw = readMessage(like, "");

  // (a) Expired token.
  if (name === "TokenExpiredError" || matchesAny(raw, ["jwt expired"])) {
    return {
      statusCode: 401,
      errorCode: "TOKEN_EXPIRED",
      message: "Your session has expired. Please sign in again.",
      logDetail: `JWT expired (${raw || "jwt expired"})`,
      isOperational: true,
    };
  }

  // (b) Token not yet valid - treat as invalid.
  if (name === "NotBeforeError" || matchesAny(raw, ["not active"])) {
    return {
      statusCode: 401,
      errorCode: "TOKEN_INVALID",
      message: "Invalid authorization token. Please sign in again.",
      logDetail: `JWT not yet active (${raw || "jwt not active"})`,
      isOperational: true,
    };
  }

  // (c) No token supplied at all.
  if (
    matchesAny(raw, [
      "jwt must be provided",
      "no token",
      "token is required",
      "token missing",
      "authorization token is required",
    ])
  ) {
    return {
      statusCode: 401,
      errorCode: "TOKEN_MISSING",
      message: "Authorization token is required.",
      logDetail: `JWT missing (${raw || "no token supplied"})`,
      isOperational: true,
    };
  }

  // (d) Malformed / bad signature / any other verification failure.
  return {
    statusCode: 401,
    errorCode: "TOKEN_INVALID",
    message: "Invalid authorization token. Please sign in again.",
    logDetail: `JWT failed verification (${raw || name || "unknown"})`,
    isOperational: true,
  };
};

/* ------------------------------------------------------------------ */
/* 3. OAuth / Better Auth errors                                       */
/* ------------------------------------------------------------------ */

/** The user dismissed or denied the provider consent screen. */
const OAUTH_CANCELLED_PATTERNS = [
  "access_denied",
  "access denied",
  "user denied",
  "denied access",
  "cancelled",
  "canceled",
  "user_cancelled",
  "popup closed",
  "popup_closed_by_user",
  "closed by user",
  "aborted",
  "dismissed",
];

/** The OAuth handshake / callback itself failed. */
const OAUTH_CALLBACK_FAILED_PATTERNS = [
  "oauth",
  "callback",
  "redirect_uri",
  "redirect uri",
  "state mismatch",
  "invalid state",
  "invalid_grant",
  "code_verifier",
  "authorization code",
  "invalid code",
  "token endpoint",
  "token exchange",
  "client_secret",
  "invalid_client",
  "authentication failed",
  "sign in failed",
  "signin failed",
  "login failed",
  "failed to sign",
  "provider error",
  "bad_oauth_state",
];

/** The provider returned a profile without an email address. */
const OAUTH_MISSING_EMAIL_PATTERNS = [
  "email not found",
  "email is missing",
  "missing email",
  "no email",
  "email is required",
  "without an email",
  "email_not_found",
  "email address is required",
];

/**
 * Detect whether an error originated from an OAuth / social sign-in flow.
 * String-based detection keeps this decoupled from Better Auth internals,
 * so the provider config is never touched.
 */
const isOAuthRelatedError = (like: ErrorLike, raw: string): boolean => {
  const name = like.name ?? "";
  if (matchesAny(name, ["APIError", "BetterAuthError", "AuthError"]))
    return true;
  return matchesAny(raw, ["better-auth", "better auth", "betterfetch"]);
};

/**
 * Normalise login failures from OAuth providers (e.g. Google) and Better
 * Auth into user-facing 401s. Covers:
 *   - the user cancelling / dismissing the consent screen
 *   - a failed OAuth callback or code exchange
 *   - an OAuth account that returned no email address
 */
const normalizeOAuthError = (like: ErrorLike, raw: string): NormalizedError => {
  // Fold every identifying field into one searchable string.
  const haystack = [raw, like.type, like.code, like.error]
    .filter(Boolean)
    .map(String)
    .join(" ");

  // (a) The provider returned no email address. Checked FIRST because a
  //     missing-email error often also mentions "oauth" or "callback".
  if (matchesAny(haystack, OAUTH_MISSING_EMAIL_PATTERNS)) {
    return {
      statusCode: 401,
      errorCode: "OAUTH_EMAIL_MISSING",
      message:
        "We could not retrieve an email address from your provider account. Please use another sign-in method or contact support.",
      logDetail: `OAuth account missing email (${raw})`,
      isOperational: true,
    };
  }

  // (b) The user cancelled / dismissed the provider consent screen.
  if (matchesAny(haystack, OAUTH_CANCELLED_PATTERNS)) {
    return {
      statusCode: 401,
      errorCode: "OAUTH_LOGIN_CANCELLED",
      message: "Sign-in was cancelled. You can try again at any time.",
      logDetail: `OAuth login cancelled/dismissed (${raw})`,
      isOperational: true,
    };
  }

  // (c) Any other OAuth failure: callback error, state mismatch, exchange.
  if (
    matchesAny(haystack, OAUTH_CALLBACK_FAILED_PATTERNS) ||
    isOAuthRelatedError(like, raw)
  ) {
    return {
      statusCode: 401,
      errorCode: "OAUTH_CALLBACK_FAILED",
      message:
        "We could not complete your Google sign-in. Please try again or use email and password.",
      logDetail: `OAuth callback/sign-in failure (${raw})`,
      isOperational: true,
    };
  }

  // (d) Fallback so no auth-flavoured error escapes unnormalised.
  return {
    statusCode: 401,
    errorCode: "OAUTH_LOGIN_FAILED",
    message: "Sign-in failed. Please try again.",
    logDetail: `Unclassified auth/OAuth failure (${raw})`,
    isOperational: true,
  };
};

/* ------------------------------------------------------------------ */
/* 4. Upstream / infrastructure errors                                 */
/* ------------------------------------------------------------------ */

/** Timeouts raised by an HTTP client or driver layer. */
const TIMEOUT_PATTERNS = ["etimedout", "timeout", "timed out"];

/** Mongo / Mongoose connectivity failures that should be reported as 503. */
const MONGO_CONNECTION_PATTERNS = [
  "mongooseerror",
  "mongoserverclosederror",
  "mongonetworkerror",
  "mongonotconnectederror",
  "topology was destroyed",
  "buffering timed out",
  "connection refused",
  "failed to connect",
];

/**
 * Errors surfaced by third-party SDKs that already carry an HTTP status
 * (Stripe, Gemini, fetch-based clients). Only 4xx statuses are trusted as
 * safe to echo; 5xx upstream failures collapse into a 502.
 */
const normalizeUpstreamError = (like: ErrorLike): NormalizedError | null => {
  const explicit =
    like.$metadata?.httpStatusCode ??
    (typeof like.status === "number" ? like.status : undefined) ??
    (typeof like.statusCode === "number" ? like.statusCode : undefined) ??
    like.response?.status;

  if (typeof explicit !== "number" || Number.isNaN(explicit)) return null;

  const raw = readMessage(like, "Request failed");
  const isStripe = typeof like.type === "string" && like.type.includes("Stripe");

  if (explicit >= 400 && explicit < 500) {
    return {
      statusCode: explicit,
      errorCode: isStripe ? "UPSTREAM_REQUEST_FAILED" : "BAD_REQUEST",
      message: raw,
      logDetail: `Upstream client error ${explicit} (${raw})`,
      isOperational: true,
    };
  }

  if (explicit >= 500) {
    return {
      statusCode: 502,
      errorCode: "UPSTREAM_SERVICE_ERROR",
      message:
        "An upstream service is temporarily unavailable. Please try again shortly.",
      logDetail: `Upstream server error ${explicit} (${raw})`,
      isOperational: true,
    };
  }

  return null;
};

/* ------------------------------------------------------------------ */
/* Normalisation engine                                                */
/* ------------------------------------------------------------------ */

/**
 * Map any thrown value onto the internal normalised shape.
 * Order matters: the most specific detectors run first.
 */
export const normalizeError = (error: unknown): NormalizedError => {
  // 0. Explicit operational error thrown deliberately by our own code.
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      logDetail: error.message,
      isOperational: true,
    };
  }

  const like = asErrorLike(error);
  const name = like.name ?? "";
  const code = like.code !== undefined ? String(like.code) : "";
  const raw = readMessage(error, "");

  /* ---- Mongoose: ValidationError -> 400 ------------------------- */
  if (name === "ValidationError") {
    return normalizeValidationError(like);
  }

  /* ---- Mongoose: CastError -> 400 ------------------------------- */
  if (name === "CastError") {
    return normalizeCastError(like);
  }

  /* ---- MongoDB: duplicate key -> 409 ---------------------------- */
  // Matches the raw driver code, the wrapped driver code, or the
  // "E11000 duplicate key" message form.
  if (
    code === String(MONGO_DUPLICATE_KEY_CODE) ||
    matchesAny(raw, ["e11000", "duplicate key"])
  ) {
    return normalizeDuplicateKeyError(like);
  }

  /* ---- Authentication: JWT -> 401 ------------------------------- */
  // Checked before the generic branches because jsonwebtoken names and
  // messages are unambiguous.
  if (
    JWT_ERROR_NAMES.has(name) ||
    matchesAny(raw, [
      "jwt expired",
      "jwt malformed",
      "jwt must be provided",
      "jsonwebtoken",
      "invalid token",
      "invalid signature",
      "authorization token is required",
    ])
  ) {
    return normalizeJwtError(like);
  }

  /* ---- OAuth / Better Auth -> 401 ------------------------------- */
  if (
    isOAuthRelatedError(like, raw) ||
    matchesAny(raw, [...OAUTH_CANCELLED_PATTERNS, "oauth"])
  ) {
    return normalizeOAuthError(like, raw);
  }

  /* ---- Body parser: malformed JSON -> 400 ----------------------- */
  if (
    name === "SyntaxError" &&
    matchesAny(raw, ["json", "unexpected token", "position"])
  ) {
    return {
      statusCode: 400,
      errorCode: "INVALID_JSON",
      message: "Malformed JSON payload. Please check the request body.",
      logDetail: `Body parser SyntaxError (${raw})`,
      isOperational: true,
    };
  }

  /* ---- Body parser: payload too large -> 413 -------------------- */
  if (
    String(like.type ?? "") === "entity.too.large" ||
    matchesAny(raw, ["entity too large", "payload too large"])
  ) {
    return {
      statusCode: 413,
      errorCode: "PAYLOAD_TOO_LARGE",
      message: "The uploaded payload is too large.",
      logDetail: `Payload rejected: ${raw}`,
      isOperational: true,
    };
  }

  /* ---- Infrastructure: DB unavailable -> 503 -------------------- */
  if (matchesAny(name, MONGO_CONNECTION_PATTERNS) || code === "ECONNREFUSED") {
    return {
      statusCode: 503,
      errorCode: "SERVICE_UNAVAILABLE",
      message:
        "The service is temporarily unavailable. Please try again shortly.",
      logDetail: `Database/infrastructure unavailable (${raw || name})`,
      isOperational: false,
    };
  }

  /* ---- Infrastructure: timeout -> 504 --------------------------- */
  if (code === "ETIMEDOUT" || matchesAny(raw, TIMEOUT_PATTERNS)) {
    return {
      statusCode: 504,
      errorCode: "GATEWAY_TIMEOUT",
      message: "The request timed out. Please try again.",
      logDetail: `Upstream timeout (${raw || name})`,
      isOperational: true,
    };
  }

  /* ---- Third-party SDK errors carrying an HTTP status ----------- */
  const upstream = normalizeUpstreamError(like);
  if (upstream) return upstream;

  /* ---- Explicit HTTP status already attached to the error ------- */
  const attachedStatus =
    typeof like.statusCode === "number"
      ? like.statusCode
      : typeof like.status === "number"
        ? like.status
        : undefined;

  if (
    attachedStatus !== undefined &&
    attachedStatus >= 400 &&
    attachedStatus < 600
  ) {
    const isServerSide = attachedStatus >= 500;
    return {
      statusCode: attachedStatus,
      errorCode: isServerSide ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST",
      message: isServerSide ? "Internal server error." : raw || "Bad request.",
      logDetail: raw || `Error with attached status ${attachedStatus}`,
      isOperational: !isServerSide,
    };
  }

  /* ---- Unknown / unexpected -> safe 500 ------------------------- */
  return {
    statusCode: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Internal server error.",
    logDetail: raw || name || "Unknown error",
    isOperational: false,
  };
};

/* ------------------------------------------------------------------ */
/* Not-found handler                                                   */
/* ------------------------------------------------------------------ */

/**
 * Terminal middleware for unmatched routes.
 *
 * Registered AFTER all routes but BEFORE `errorHandler`, so an unknown URL
 * returns the standard Fitora envelope instead of Express's default HTML
 * page (which also leaks the framework's version banner).
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  return res
    .status(404)
    .json(
      errorResponse(
        `Route not found: ${req.method} ${req.originalUrl}`,
        "ROUTE_NOT_FOUND",
        404,
      ),
    );
};

/* ------------------------------------------------------------------ */
/* Global error handler                                                */
/* ------------------------------------------------------------------ */

/**
 * Global error handler.
 *
 * Must keep the four-argument signature so Express recognises it as an
 * error-handling middleware, and must be registered LAST.
 */
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const normalized = normalizeError(error);
  const isProduction = process.env.NODE_ENV === "production";

  // Headers already flushed: we can no longer change the status or body.
  // Delegating to Express lets it close the connection cleanly.
  if (res.headersSent) {
    return next(error instanceof Error ? error : new Error(String(error)));
  }

  // Full diagnostic detail stays server-side.
  const logPayload = {
    name: asErrorLike(error).name ?? "Error",
    detail: normalized.logDetail,
    method: req.method,
    url: req.originalUrl,
    statusCode: normalized.statusCode,
    errorCode: normalized.errorCode,
    isOperational: normalized.isOperational,
    ip: req.ip,
  };

  if (normalized.isOperational) {
    // Expected failures: one concise warn line, no stack noise.
    console.warn(
      `[Error Handler] ${req.method} ${req.originalUrl} -> ${normalized.statusCode} ${normalized.errorCode}: ${normalized.logDetail}`,
    );
  } else {
    // Unexpected failures: full structured context + stack for triage.
    console.error(
      "[Error Handler] Unhandled error:",
      logPayload,
      error instanceof Error && error.stack ? `\n${error.stack}` : "",
    );
  }

  // In production an unexpected 5xx must never echo the real message
  // (it can contain connection strings, internal paths, provider detail).
  const redact = isProduction && !normalized.isOperational;

  const payload: Record<string, unknown> = {
    ...errorResponse(
      redact ? "Internal server error." : normalized.message,
      redact ? "INTERNAL_SERVER_ERROR" : normalized.errorCode,
      normalized.statusCode,
    ),
  };

  // Preserve the project's existing local debugging behaviour: the stack
  // is attached ONLY outside production, and only as an additive key so
  // existing clients keep seeing the exact same envelope fields.
  if (!isProduction && error instanceof Error && error.stack) {
    payload.stack = error.stack;
  }

  res.status(normalized.statusCode).json(payload);
};

export default errorHandler;
