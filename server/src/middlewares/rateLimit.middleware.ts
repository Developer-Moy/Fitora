import { Request, Response, NextFunction } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { errorResponse } from "../utils/apiResponse.js";

/**
 * Reusable Rate Limiting Middleware
 * ---------------------------------------------------------------------------
 * Protects the production API from brute-force, credential-stuffing, scraping
 * and general abuse by capping requests per client IP inside a fixed window.
 *
 * Design notes:
 *  - Keys are derived with `ipKeyGenerator` so IPv6 clients are grouped by
 *    subnet (avoids a single client cycling through an address block to bypass
 *    the limiter).
 *  - Responses reuse the project-wide `errorResponse()` shape so the frontend
 *    handles a 429 exactly like every other API error.
 *  - Standard `RateLimit-*` headers are emitted (not the legacy `X-RateLimit-*`)
 *    so clients can back off gracefully.
 *  - Only mounted in `server.ts` against specific paths; Socket.IO and
 *    health-check endpoints are deliberately left unmetered.
 */

interface RateLimitOptions {
  /** Rolling window length in milliseconds. */
  windowMs: number;
  /** Maximum number of requests permitted per key within the window. */
  max: number;
  /** Client-facing message returned on the 429 response. */
  message: string;
  /** Short machine-readable code returned in the `error` field. */
  errorCode: string;
  /** Optional extra predicate for requests that must never be metered. */
  shouldSkip?: (req: Request) => boolean;
}

/**
 * Route prefixes that must stay reachable regardless of rate limiting.
 * Health/uptime probes are polled frequently by infrastructure and monitoring,
 * so metering them would produce false outages.
 */
const EXEMPT_PATHS = ["/api/health", "/health"];

/**
 * Returns true when the request targets an exempt (unmetered) endpoint.
 */
export const isExemptPath = (req: Request): boolean => {
  const path = (req.originalUrl || req.url || "").split("?")[0];
  return EXEMPT_PATHS.includes(path);
};

/**
 * Returns true when the request targets the authentication namespace.
 * Auth routes carry their own stricter limiter, so the general API limiter
 * must skip them to avoid double-counting and to keep the two budgets
 * independent (a busy API session must not lock a user out of signing in).
 */
export const isAuthPath = (req: Request): boolean => {
  const path = (req.originalUrl || req.url || "").split("?")[0];
  return path === "/api/auth" || path.startsWith("/api/auth/");
};

/**
 * Builds a configured express-rate-limit handler that replies with the
 * project's standard error envelope.
 */
const createLimiter = ({
  windowMs,
  max,
  message,
  errorCode,
  shouldSkip,
}: RateLimitOptions) =>
  rateLimit({
    windowMs,
    limit: max,
    // Use the shared in-memory store; sufficient for a single-instance API.
    standardHeaders: "draft-7",
    legacyHeaders: false,
    // Skip CORS preflight requests and health checks so browser OPTIONS checks
    // and infrastructure probes never consume a client's request budget.
    skip: (req: Request) =>
      req.method === "OPTIONS" || isExemptPath(req) || shouldSkip?.(req) === true,
    keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? ""),
    handler: (req: Request, res: Response, _next: NextFunction) => {
      return res.status(429).json(errorResponse(message, errorCode, 429));
    },
  });

/**
 * General API limiter.
 * Applied to every `/api/*` route EXCEPT `/api/auth` (which has its own
 * stricter budget): 100 requests per IP per 15 minutes.
 */
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
  errorCode: "TOO_MANY_REQUESTS",
  // Hand auth traffic over to `authLimiter` exclusively.
  shouldSkip: isAuthPath,
});

/**
 * Authentication limiter.
 * Applied ONLY to credential-issuing auth routes (`/api/auth`): 5 requests per
 * IP per 15 minutes, to blunt brute-force and credential-stuffing attempts.
 *
 * `skipSuccessfulRequests` means a legitimate user signing in is not penalised
 * — only failed attempts burn the quota.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: (req: Request) => req.method === "OPTIONS" || isExemptPath(req),
  keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? ""),
  handler: (req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(429)
      .json(
        errorResponse(
          "Too many authentication attempts. Please try again later.",
          "TOO_MANY_AUTH_ATTEMPTS",
          429,
        ),
      );
  },
});

export default { apiLimiter, authLimiter };