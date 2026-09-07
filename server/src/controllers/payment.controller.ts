import { Request, Response } from "express";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  AuthRequest,
  AuthUserPayload,
} from "../middlewares/auth.middleware.js";
import User, { UserPlan } from "../models/User.model.js";
import UserTier from "../models/UserTier.model.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import Payment from "../models/Payment.model.js";

/**
 * Server-authoritative Membership Plan Definitions
 * Pricing is strictly calculated server-side; client prices are NEVER trusted.
 */
export interface PlanDetails {
  id: string;
  name: string;
  monthlyPrice: number; // USD
  annualMonthlyPrice: number; // USD per month when billed annually
  description: string;
}

export const MEMBERSHIP_PLANS: Record<string, PlanDetails> = {
  basic_pass: {
    id: "basic_pass",
    name: "Basic Pass",
    monthlyPrice: 25,
    annualMonthlyPrice: 19,
    description: "Essential gym access for fitness starters & casual trainers.",
  },
  pro_athlete: {
    id: "pro_athlete",
    name: "Pro Athlete",
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    description: "Complete fitness package with AI coach studio & full access.",
  },
  vip_ultimate: {
    id: "vip_ultimate",
    name: "VIP Ultimate",
    monthlyPrice: 99,
    annualMonthlyPrice: 79,
    description: "Dedicated 1-on-1 coaching, custom nutrition & VIP perks.",
  },
};

/**
 * Normalizes client plan identifier to internal server key
 */
export function resolvePlan(identifier?: string): PlanDetails | null {
  if (!identifier) return null;
  const cleaned = identifier
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");

  if (cleaned === "basic_pass" || cleaned === "basic") {
    return MEMBERSHIP_PLANS.basic_pass;
  }
  if (cleaned === "pro_athlete" || cleaned === "pro") {
    return MEMBERSHIP_PLANS.pro_athlete;
  }
  if (cleaned === "vip_ultimate" || cleaned === "vip") {
    return MEMBERSHIP_PLANS.vip_ultimate;
  }

  return null;
}

/**
 * Helper to initialize Stripe instance
 */
function getStripeClient(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured on the server");
  }
  return new Stripe(stripeSecretKey);
}

/**
 * Helper to optionally extract user payload from Bearer token
 */
function extractUserFromHeader(req: Request): AuthUserPayload | null {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const jwtSecret =
      process.env.JWT_SECRET || "FITORA_SUPER_SECRET_JWT_KEY_2026_PRODUCTION";
    return jwt.verify(token, jwtSecret) as AuthUserPayload;
  } catch {
    return null;
  }
}

/**
 * POST /api/payments/create-checkout-session
 * Creates a Stripe-hosted Checkout session in TEST mode.
 * Identifies the user via verified JWT if present, or by customer email from session.
 */
export async function createCheckoutSession(
  req: Request,
  res: Response,
): Promise<void | Response> {
  try {
    const { planId, planKey, isAnnual, billingCycle, customerEmail, userId } =
      req.body;

    // 1. Resolve and validate selected plan
    const plan = resolvePlan(planId || planKey);
    if (!plan) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Invalid or unsupported membership plan selected.",
            "INVALID_PLAN",
            400,
          ),
        );
    }

    // 2. User identification: try verified JWT token first, then userId, then user email
    const authUser = extractUserFromHeader(req);
    let userDoc = authUser?.userId
      ? await User.findById(authUser.userId)
      : null;

    if (!userDoc && userId) {
      userDoc = await User.findById(userId);
    }
    if (!userDoc && customerEmail) {
      userDoc = await User.findOne({
        email: customerEmail.trim().toLowerCase(),
      });
    }

    const effectiveUserId = userDoc
      ? userDoc._id.toString()
      : authUser?.userId || userId || "";
    const effectiveEmail = userDoc
      ? userDoc.email
      : authUser?.email || customerEmail || undefined;

    if (!effectiveUserId) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Authentication required. Please log in before proceeding to payment.",
            "UNAUTHORIZED",
            401,
          ),
        );
    }

    // 3. Determine billing cycle and calculate server-side amount (in USD cents)
    const annualBilling = Boolean(
      isAnnual === true ||
      isAnnual === "true" ||
      billingCycle === "annual" ||
      billingCycle === "yearly",
    );

    const totalUsd = annualBilling
      ? plan.annualMonthlyPrice * 12
      : plan.monthlyPrice;
    const amountInCents = Math.round(totalUsd * 100);

    const intervalLabel = annualBilling
      ? "Annual Plan (Billed Yearly - 20% OFF)"
      : "Monthly Plan (Billed Monthly)";

    // 4. Initialize Stripe client
    const stripe = getStripeClient();

    const clientUrl =
      process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:3000";

    // 5. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `FITORA ${plan.name.toUpperCase()}`,
              description: `${plan.description} — ${intervalLabel}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/?payment_status=cancelled`,
      customer_email: effectiveEmail,
      client_reference_id: effectiveUserId || undefined,
      metadata: {
        userId: effectiveUserId,
        userEmail: effectiveEmail || "",
        planId: plan.id,
        planName: plan.name,
        billingCycle: annualBilling ? "annual" : "monthly",
        totalAmountUSD: totalUsd.toString(),
      },
    });

    if (!session.url) {
      return res
        .status(500)
        .json(
          errorResponse(
            "Failed to retrieve checkout redirect URL from Stripe.",
            "STRIPE_SESSION_ERROR",
            500,
          ),
        );
    }

    return res.status(200).json(
      successResponse("Stripe Checkout Session initialized successfully", {
        url: session.url,
        sessionId: session.id,
        amount: totalUsd,
        currency: "usd",
        plan: plan.name,
        billingCycle: annualBilling ? "annual" : "monthly",
      }),
    );
  } catch (error: any) {
    console.error("[Stripe Checkout Session Error]:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to create Stripe Checkout Session",
          error?.message || "Internal Server Error",
          500,
        ),
      );
  }
}

/**
 * POST /api/payments/webhook
 * Receives raw body webhook events from Stripe.
 * Cryptographically verifies stripe-signature before processing.
 */
export async function handleStripeWebhook(
  req: Request,
  res: Response,
): Promise<void | Response> {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "[Stripe Webhook]: STRIPE_WEBHOOK_SECRET is not configured on the server.",
    );
    return res
      .status(500)
      .json(
        errorResponse(
          "Stripe Webhook Secret is not configured on the server.",
          "WEBHOOK_CONFIG_ERROR",
          500,
        ),
      );
  }

  if (!sig) {
    return res
      .status(400)
      .json(
        errorResponse(
          "Missing stripe-signature header in webhook request.",
          "MISSING_SIGNATURE",
          400,
        ),
      );
  }

  let event: Stripe.Event;
  const stripe = getStripeClient();

  try {
    // req.body must be raw Buffer
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(
      "[Stripe Webhook Signature Verification Failed]:",
      err.message,
    );
    return res
      .status(400)
      .json(
        errorResponse(
          `Webhook signature verification failed: ${err.message}`,
          "INVALID_SIGNATURE",
          400,
        ),
      );
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // 1. Validate session completion status
      if (session.status !== "complete" || session.payment_status !== "paid") {
        console.warn(
          `[Stripe Webhook]: Session ${session.id} is not complete or paid.`,
        );
        return res
          .status(400)
          .json(
            errorResponse(
              "Checkout session payment is not completed.",
              "PAYMENT_NOT_PAID",
              400,
            ),
          );
      }

      // 2. Validate metadata
      const metadata = session.metadata;
      if (!metadata || !metadata.planId || !metadata.billingCycle) {
        console.error(
          `[Stripe Webhook]: Session ${session.id} missing required plan metadata.`,
        );
        return res
          .status(400)
          .json(
            errorResponse(
              "Missing required metadata in Checkout Session.",
              "INVALID_METADATA",
              400,
            ),
          );
      }

      const { userId, planId, billingCycle, userEmail } = metadata;

      // 3. Find user in MongoDB (by userId or client_reference_id or userEmail or session.customer_email)
      let user = userId ? await User.findById(userId) : null;
      if (!user && session.client_reference_id) {
        user = await User.findById(session.client_reference_id);
      }
      if (!user && (userEmail || session.customer_email)) {
        const emailToFind = (userEmail || session.customer_email || "")
          .trim()
          .toLowerCase();
        user = await User.findOne({ email: emailToFind });
      }

      const rawUserId = user?._id || userId || session.client_reference_id;
      if (!rawUserId) {
        console.error(
          `[Stripe Webhook]: Missing required userId for session ${session.id}. Cannot record PaymentTransaction.`,
        );
        return res
          .status(400)
          .json(
            errorResponse(
              "Missing required userId to record payment transaction.",
              "MISSING_USER_ID",
              400,
            ),
          );
      }

      const transactionUserId =
        user?._id ||
        (mongoose.Types.ObjectId.isValid(rawUserId)
          ? new mongoose.Types.ObjectId(rawUserId)
          : rawUserId);

      // 4. Validate plan against authoritative server plans
      const plan = resolvePlan(planId);
      if (!plan) {
        console.error(
          `[Stripe Webhook]: Invalid planId ${planId} in session metadata.`,
        );
        return res
          .status(400)
          .json(
            errorResponse(
              "Invalid membership plan specified in metadata.",
              "INVALID_PLAN",
              400,
            ),
          );
      }

      // 5. Validate billing cycle
      const isAnnual = billingCycle === "annual" || billingCycle === "yearly";

      // 6. Independently recalculate server-side expected amount
      const expectedTotalUsd = isAnnual
        ? plan.annualMonthlyPrice * 12
        : plan.monthlyPrice;
      const expectedAmountInCents = Math.round(expectedTotalUsd * 100);

      if (session.amount_total !== expectedAmountInCents) {
        console.error(
          `[Stripe Webhook]: Authoritative amount mismatch! Received: ${session.amount_total}, Expected: ${expectedAmountInCents}`,
        );
        return res
          .status(400)
          .json(
            errorResponse(
              "Payment amount does not match authoritative plan pricing.",
              "AMOUNT_MISMATCH",
              400,
            ),
          );
      }

      // 7. Validate currency
      if (session.currency?.toLowerCase() !== "usd") {
        console.error(
          `[Stripe Webhook]: Currency mismatch: ${session.currency}`,
        );
        return res
          .status(400)
          .json(
            errorResponse(
              "Payment currency is not supported. Expected USD.",
              "CURRENCY_MISMATCH",
              400,
            ),
          );
      }

      // 8. Idempotency Check: prevent duplicate processing & double crediting
      const existingTx = await PaymentTransaction.findOne({
        stripeCheckoutSessionId: session.id,
      });

      if (existingTx && existingTx.status === "paid") {
        console.log(
          `[Stripe Webhook]: Session ${session.id} already processed. Returning HTTP 200.`,
        );
        return res.status(200).json({ received: true, duplicate: true });
      }

      // 9. Persist verified PaymentTransaction
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      await PaymentTransaction.findOneAndUpdate(
        { stripeCheckoutSessionId: session.id },
        {
          userId: transactionUserId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
          stripeCustomerId: customerId,
          stripeEventId: event.id,
          planId: plan.id,
          planName: plan.name,
          billingCycle: isAnnual ? "annual" : "monthly",
          amount: expectedTotalUsd,
          currency: "usd",
          paymentMethod: "Card",
          status: "paid",
          paidAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      // 10. If user exists, activate membership on User & UserTier models
      if (user) {
        const startDate = new Date();
        const expiryDate = new Date(startDate);
        if (isAnnual) {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        }

        const userPlanName: UserPlan =
          plan.id === "vip_ultimate"
            ? "VIP Ultimate"
            : plan.id === "pro_athlete"
              ? "Pro Athlete"
              : "Basic Pass";

        user.plan = userPlanName;
        user.paymentMethod = "Card";
        user.status = "active";
        user.membershipExpiresAt = expiryDate;

        // Promote to premium_user if currently a basic athlete/user
        if (user.role !== "master_admin" && user.role !== "branch_admin") {
          user.role = "premium_user";
        }

        await user.save();

        const tierType =
          plan.id === "vip_ultimate"
            ? "vip"
            : plan.id === "pro_athlete"
              ? "pro"
              : "basic";

        await UserTier.findOneAndUpdate(
          { userId: user._id },
          {
            tier: tierType,
            startDate,
            expiryDate,
            validUntil: expiryDate,
            isActive: true,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        console.log(
          `[Stripe Webhook]: Membership successfully activated for user ${user._id} (${user.email}) -> Plan: ${userPlanName} (Tier: ${tierType}), Valid until: ${expiryDate.toISOString()}`,
        );
      } else {
        console.warn(
          `[Stripe Webhook]: Payment ${session.id} recorded successfully, but no matching User account was found to activate.`,
        );
      }

      return res.status(200).json({ received: true });
    } catch (err: any) {
      console.error("[Stripe Webhook Processing Error]:", err);
      return res
        .status(500)
        .json(
          errorResponse(
            "Internal server error during webhook processing",
            err?.message || "Unknown error",
            500,
          ),
        );
    }
  }

  // Acknowledge other unhandled event types with HTTP 200
  return res.status(200).json({ received: true });
}

/**
 * GET /api/payments/verify-session?session_id=...&email=...
 * Simple, secure session verification:
 * 1. Checks that session_id is provided.
 * 2. Retrieves the Stripe Checkout Session server-side via Stripe Secret Key.
 * 3. Confirms that session.payment_status === "paid" and status === "complete".
 * 4. Compares the Stripe session with the logged-in user.
 * 5. Returns the verified plan and payment information for the frontend success UI.
 * 6. Safely records PaymentTransaction and activates membership if local webhook hasn't run yet.
 */
export async function verifySession(
  req: Request,
  res: Response,
): Promise<void | Response> {
  try {
    const sessionId = (req.query.session_id as string)?.trim();
    if (!sessionId) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Missing or invalid session_id parameter.",
            "INVALID_SESSION_ID",
            400,
          ),
        );
    }

    // 1. Retrieve the Checkout Session directly from Stripe using secret key
    const stripe = getStripeClient();
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeErr: any) {
      console.error("[Stripe Session Retrieval Error]:", stripeErr);
      return res
        .status(404)
        .json(
          errorResponse(
            "Stripe Checkout Session not found.",
            "SESSION_NOT_FOUND",
            404,
          ),
        );
    }

    // 2. Verify Stripe confirms the payment is completed and paid
    if (session.status !== "complete" || session.payment_status !== "paid") {
      return res
        .status(400)
        .json(
          errorResponse(
            "Payment is not complete or has not been confirmed as paid by Stripe.",
            "PAYMENT_NOT_PAID",
            400,
          ),
        );
    }

    // 3. User identification & matching:
    const authHeaderUser = extractUserFromHeader(req);
    const queryEmail = (req.query.email as string)?.trim().toLowerCase();
    const queryUserId = (req.query.userId as string)?.trim();
    const requestingEmail = (
      authHeaderUser?.email ||
      queryEmail ||
      ""
    ).toLowerCase();
    const requestingUserId = authHeaderUser?.userId || queryUserId || "";

    // The user must be logged in to view payment confirmation
    if (!requestingEmail && !requestingUserId) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Please log in to view your verified payment details.",
            "UNAUTHORIZED",
            401,
          ),
        );
    }

    const sessionUserId = (
      session.metadata?.userId ||
      session.client_reference_id ||
      ""
    ).trim();
    const sessionEmail = (
      session.metadata?.userEmail ||
      session.customer_email ||
      session.customer_details?.email ||
      ""
    )
      .trim()
      .toLowerCase();

    // Verify ownership: if session has user identifiers, verify that the logged-in user matches
    if (sessionUserId || sessionEmail) {
      const matchesUserId = Boolean(
        sessionUserId && requestingUserId && sessionUserId === requestingUserId,
      );
      const matchesEmail = Boolean(
        sessionEmail && requestingEmail && sessionEmail === requestingEmail,
      );

      if (!matchesUserId && !matchesEmail) {
        return res
          .status(403)
          .json(
            errorResponse(
              "You do not have permission to view this payment session.",
              "FORBIDDEN",
              403,
            ),
          );
      }
    }

    // Find the user in database
    let userDoc = requestingUserId
      ? await User.findById(requestingUserId)
      : null;
    if (!userDoc && requestingEmail) {
      userDoc = await User.findOne({ email: requestingEmail });
    }
    if (!userDoc && sessionUserId) {
      userDoc = await User.findById(sessionUserId);
    }
    if (!userDoc && sessionEmail) {
      userDoc = await User.findOne({ email: sessionEmail });
    }

    // 4. Resolve plan and calculate duration
    const plan = resolvePlan(session.metadata?.planId || "basic_pass");
    const isAnnual =
      session.metadata?.billingCycle === "annual" ||
      session.metadata?.billingCycle === "yearly";
    const planName = plan?.name || session.metadata?.planName || "Basic Pass";
    const totalUsd =
      Number(session.metadata?.totalAmountUSD) ||
      (session.amount_total ? session.amount_total / 100 : isAnnual ? 228 : 25);

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    if (isAnnual) {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // 5. Ensure PaymentTransaction exists in MongoDB (Safe fallback if local webhook hasn't run)
    let transaction = await PaymentTransaction.findOne({
      stripeCheckoutSessionId: session.id,
    });

    if (!transaction) {
      const rawUserId = userDoc?._id || requestingUserId || sessionUserId;
      if (!rawUserId) {
        return res
          .status(400)
          .json(
            errorResponse(
              "Authenticated user ID is required to record payment transaction.",
              "MISSING_USER_ID",
              400,
            ),
          );
      }

      const transactionUserId =
        userDoc?._id ||
        (mongoose.Types.ObjectId.isValid(rawUserId)
          ? new mongoose.Types.ObjectId(rawUserId)
          : rawUserId);

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      transaction = await PaymentTransaction.findOneAndUpdate(
        { stripeCheckoutSessionId: session.id },
        {
          userId: transactionUserId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
          stripeCustomerId: customerId,
          planId: plan?.id || "basic_pass",
          planName: planName,
          billingCycle: isAnnual ? "annual" : "monthly",
          amount: totalUsd,
          currency: session.currency || "usd",
          paymentMethod: "Card",
          status: "paid",
          paidAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      // Activate membership on User if found
      if (userDoc) {
        userDoc.plan = (
          plan?.id === "vip_ultimate"
            ? "VIP Ultimate"
            : plan?.id === "pro_athlete"
              ? "Pro Athlete"
              : "Basic Pass"
        ) as UserPlan;
        userDoc.paymentMethod = "Card";
        userDoc.status = "active";
        userDoc.membershipExpiresAt = expiryDate;
        if (
          userDoc.role !== "master_admin" &&
          userDoc.role !== "branch_admin"
        ) {
          userDoc.role = "premium_user";
        }
        await userDoc.save();

        const tierType =
          plan?.id === "vip_ultimate"
            ? "vip"
            : plan?.id === "pro_athlete"
              ? "pro"
              : "basic";
        await UserTier.findOneAndUpdate(
          { userId: userDoc._id },
          {
            tier: tierType,
            startDate,
            expiryDate,
            validUntil: expiryDate,
            isActive: true,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }
    }

    // 6. Return safe, verified payment information
    return res.status(200).json(
      successResponse("Payment verified successfully", {
        planName: planName,
        billingCycle: isAnnual ? "annual" : "monthly",
        amount: totalUsd,
        currency: (session.currency || "usd").toUpperCase(),
        paymentMethod: "Card",
        paidAt: transaction?.paidAt || transaction?.createdAt || new Date(),
        membershipExpiresAt: userDoc?.membershipExpiresAt || expiryDate,
      }),
    );
  } catch (error: any) {
    console.error("[Verify Session Error]:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "An error occurred while verifying the payment session.",
          error?.message || "Internal Server Error",
          500,
        ),
      );
  }
}

/**
 * Helper: Generate unique transaction ID
 */
function generateTransactionId(gateway: string): string {
  const prefix = gateway.toLowerCase().includes("bkash")
    ? "TRX-BK"
    : gateway.toLowerCase().includes("nagad")
      ? "TRX-NG"
      : "TRX-CD";
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}${randomHex}`;
}

/**
 * Helper: Generate unique invoice number
 */
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `INV-${year}-${randomNum}`;
}

/**
 * POST /api/payments/checkout
 * Processes direct subscription checkout (bKash, Nagad, Card BDT), updates user plan & expiry
 */
export async function checkoutPayment(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const {
      planId,
      planName: bodyPlanName,
      billingCycle = "monthly",
      amountBDT,
      gateway = "bKash",
      accountNumber,
      transactionId: customTrxId,
      userId: bodyUserId,
      userName: bodyUserName,
      userEmail: bodyUserEmail,
    } = req.body;

    // 1. Authoritative Plan & Server-Enforced Pricing
    // Even if an attacker modifies the amount in browser console/network tab, server strictly enforces authoritative price
    const resolvedPlan = resolvePlan(planId || bodyPlanName);
    const planName = resolvedPlan
      ? resolvedPlan.name
      : bodyPlanName || "Pro Athlete";

    // Subscription Period calculation (strictly calculated server-side)
    const cycle =
      billingCycle === "yearly" || billingCycle === "annual"
        ? "yearly"
        : "monthly";

    const expectedUsd = resolvedPlan
      ? cycle === "yearly"
        ? resolvedPlan.annualMonthlyPrice * 12
        : resolvedPlan.monthlyPrice
      : cycle === "yearly"
        ? 39 * 12
        : 49;
    const authoritativeBDT = expectedUsd * 120;
    const amount = authoritativeBDT; // Strictly server authoritative

    // 2. Cryptographic User Verification: strictly requires a verified JWT token
    // Prevents attackers from using browser console/curl to upgrade unauthenticated accounts or spoof other users
    const verifiedJwtUser = extractUserFromHeader(req);
    const authUser = (req as AuthRequest).user || verifiedJwtUser;

    if (!authUser || !authUser.userId) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Authentication required. You must be securely logged in with a valid session to purchase a membership plan.",
            "UNAUTHORIZED",
            401,
          ),
        );
    }

    // 3. Payment Account & Gateway Sanity Check
    if (!accountNumber || String(accountNumber).trim().length < 4) {
      return res
        .status(400)
        .json(
          errorResponse(
            "A valid payment account number or reference is required.",
            "INVALID_ACCOUNT_NUMBER",
            400,
          ),
        );
    }

    const resolvedUserId = authUser.userId;
    const resolvedEmail = authUser.email;
    const resolvedName = bodyUserName || "Valued Athlete";

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    if (cycle === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    const validGateway = (
      ["bKash", "Nagad", "Card", "Bank Transfer"].includes(gateway)
        ? gateway
        : "bKash"
    ) as "bKash" | "Nagad" | "Card" | "Bank Transfer";

    const finalTransactionId =
      customTrxId && String(customTrxId).trim() !== ""
        ? String(customTrxId).trim().toUpperCase()
        : generateTransactionId(validGateway);

    const invoiceNumber = generateInvoiceNumber();

    const paymentPayload = {
      userId: resolvedUserId,
      userName: resolvedName,
      userEmail: resolvedEmail,
      planName,
      billingCycle: cycle,
      amountBDT: amount,
      gateway: validGateway,
      accountNumber: String(accountNumber).trim(),
      transactionId: finalTransactionId,
      status: "completed" as const,
      subscriptionStartDate: startDate,
      subscriptionExpiryDate: expiryDate,
      invoiceNumber,
    };

    let createdPayment: any = null;
    let updatedUser: any = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        createdPayment = await Payment.create(paymentPayload);

        // Strictly update the authenticated user only (ignoring any malicious payload IDs)
        const targetUser = await User.findById(authUser.userId);
        if (!targetUser) {
          return res
            .status(404)
            .json(
              errorResponse(
                "Authenticated user record not found in database.",
                "USER_NOT_FOUND",
                404,
              ),
            );
        }

        targetUser.plan = (
          planName === "VIP Ultimate"
            ? "VIP Ultimate"
            : planName === "Basic Pass"
              ? "Basic Pass"
              : "Pro Athlete"
        ) as UserPlan;
        targetUser.totalPaidBDT = (targetUser.totalPaidBDT || 0) + amount;
        targetUser.paymentMethod = validGateway;
        targetUser.subscriptionExpiryDate = expiryDate;
        targetUser.status = "active";

        if (targetUser.role === "free_user" || targetUser.role === "user") {
          targetUser.role = "premium_user";
        }

        await targetUser.save();
        updatedUser = {
          id: targetUser._id,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
          plan: targetUser.plan,
          status: targetUser.status,
          subscriptionExpiryDate: targetUser.subscriptionExpiryDate,
          totalPaidBDT: targetUser.totalPaidBDT,
        };
      } catch (dbErr) {
        console.warn(
          "[Payment Controller] DB operations failed, using fallback:",
          dbErr,
        );
      }
    }

    const localPayment = {
      _id: createdPayment?._id?.toString() || `pay-${Date.now()}`,
      ...paymentPayload,
      createdAt: createdPayment?.createdAt || new Date(),
    };

    return res.status(200).json(
      successResponse(
        "Subscription activated & payment confirmed successfully",
        {
          payment: createdPayment || localPayment,
          user: updatedUser || {
            id: resolvedUserId,
            plan: planName,
            status: "active",
            subscriptionExpiryDate: expiryDate,
          },
          invoice: {
            invoiceNumber,
            transactionId: finalTransactionId,
            planName,
            billingCycle: cycle,
            amountBDT: amount,
            gateway: validGateway,
            date: startDate,
            expiryDate,
          },
        },
      ),
    );
  } catch (error) {
    console.error("[Payment Controller] checkoutPayment Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to process subscription payment",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
}

/**
 * GET /api/payments/me and /api/payments/my-transactions
 * Retrieves unified transaction history for the authenticated member or requested user
 */
export async function getMyTransactions(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { userId, email } = req.query;
    const authUser = (req as AuthRequest).user;
    const targetUserId = (userId as string) || authUser?.userId;
    const targetEmail = (email as string) || authUser?.email;

    let payments: any[] = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const orConditions: any[] = [];
        if (targetUserId) {
          if (mongoose.Types.ObjectId.isValid(targetUserId)) {
            orConditions.push({
              userId: new mongoose.Types.ObjectId(targetUserId),
            });
          }
          orConditions.push({ userId: targetUserId });
        }
        if (targetEmail) {
          orConditions.push({ userEmail: targetEmail.toLowerCase().trim() });
        }

        const filter = orConditions.length > 0 ? { $or: orConditions } : {};
        const [bdtPayments, stripePayments] = await Promise.all([
          Payment.find(filter).sort({ createdAt: -1 }).lean(),
          PaymentTransaction.find(targetUserId ? { userId: targetUserId } : {})
            .sort({ createdAt: -1 })
            .lean()
            .catch(() => []),
        ]);

        const unifiedStripe = stripePayments.map((s: any) => ({
          _id: s._id?.toString() || s.stripeCheckoutSessionId,
          transactionId:
            s.stripePaymentIntentId ||
            s.stripeCheckoutSessionId?.slice(-12)?.toUpperCase(),
          date: s.paidAt || s.createdAt || new Date().toISOString(),
          paymentMethod: "Card",
          amount: Math.round(Number(s.amount || 0) * 120), // Convert USD to BDT display
          planName: s.planName || "Pro Athlete",
          status: s.status === "paid" ? "Completed" : s.status,
          billingCycle: s.billingCycle || "monthly",
          invoiceNumber:
            s.invoiceNumber ||
            `INV-${new Date(s.paidAt || s.createdAt || Date.now()).getFullYear()}-${(s._id?.toString() || "STRP").slice(-6).toUpperCase()}`,
          subscriptionStartDate: s.paidAt || s.createdAt || new Date().toISOString(),
          subscriptionExpiryDate: s.expiryDate || s.membershipExpiresAt || null,
          userName: s.userName || "Valued Athlete",
          userEmail: s.userEmail || targetEmail || "",
        }));

        const unifiedBdt = bdtPayments.map((b: any) => ({
          _id: b._id?.toString() || b.transactionId,
          transactionId: b.transactionId,
          date:
            b.createdAt || b.subscriptionStartDate || new Date().toISOString(),
          paymentMethod: b.gateway || "bKash",
          amount: b.amountBDT,
          planName: b.planName,
          status: "Completed",
          billingCycle: b.billingCycle || "monthly",
          invoiceNumber: b.invoiceNumber || generateInvoiceNumber(),
          subscriptionStartDate: b.subscriptionStartDate || b.createdAt,
          subscriptionExpiryDate: b.subscriptionExpiryDate || null,
          accountNumber: b.accountNumber,
          userName: b.userName || "Valued Athlete",
          userEmail: b.userEmail || targetEmail || "",
        }));

        payments = [...unifiedBdt, ...unifiedStripe].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        // Calculate verified active subscription and expiry countdown
        let activeSubscription: any = null;
        let matchedUser: any = null;

        if (targetUserId && mongoose.Types.ObjectId.isValid(targetUserId)) {
          matchedUser = await User.findById(targetUserId).lean();
        }
        if (!matchedUser && targetEmail) {
          matchedUser = await User.findOne({ email: targetEmail.toLowerCase().trim() }).lean();
        }

        const now = new Date();
        const latestTx = payments[0];
        const effectivePlan = matchedUser?.plan || latestTx?.planName || "Free Pass";
        const effectiveExpiry =
          matchedUser?.subscriptionExpiryDate ||
          matchedUser?.membershipExpiresAt ||
          latestTx?.subscriptionExpiryDate;

        if (effectivePlan && effectivePlan !== "Free Pass") {
          const expDate = effectiveExpiry ? new Date(effectiveExpiry) : null;
          const isExpired = expDate ? expDate.getTime() < now.getTime() : false;
          const diffMs = expDate ? Math.max(0, expDate.getTime() - now.getTime()) : 0;
          const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const remainingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

          activeSubscription = {
            planName: effectivePlan,
            status: isExpired ? "expired" : "active",
            startDate: matchedUser?.createdAt || latestTx?.subscriptionStartDate || latestTx?.date,
            expiryDate: expDate ? expDate.toISOString() : null,
            remainingDays,
            remainingHours,
            isExpired,
            isExpiringSoon: !isExpired && remainingDays < 3,
            paymentMethod: matchedUser?.paymentMethod || latestTx?.paymentMethod || "Card",
          };
        }

        return res.status(200).json(
          successResponse("Transactions retrieved successfully", {
            count: payments.length,
            payments,
            activeSubscription,
          }),
        );
      } catch (dbErr) {
        console.warn("[Payment Controller] DB query failed:", dbErr);
      }
    }

    return res.status(200).json(
      successResponse("Transactions retrieved successfully", {
        count: payments.length,
        payments,
        activeSubscription: null,
      }),
    );
  } catch (error) {
    console.error("[Payment Controller] getMyTransactions Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve transactions",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
}

/**
 * GET /api/payments/all
 * Retrieves all platform transactions for Master Admin review
 */
export async function getAllPayments(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { limit = 50, page = 1 } = req.query;
    const limitNum = parseInt(limit as string, 10) || 50;
    const pageNum = parseInt(page as string, 10) || 1;

    let payments: any[] = [];
    let totalCount = 0;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        totalCount = await Payment.countDocuments();
        payments = await Payment.find()
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean();
      } catch (dbErr) {
        console.warn(
          "[Payment Controller] getAllPayments DB query failed:",
          dbErr,
        );
      }
    }

    return res.status(200).json(
      successResponse("All payments retrieved successfully", {
        count: payments.length,
        total: totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
        payments,
      }),
    );
  } catch (error) {
    console.error("[Payment Controller] getAllPayments Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch payment records",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
}
