import { Request, Response } from "express";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { AuthUserPayload } from "../middlewares/auth.middleware.js";

/**
 * Server-authoritative Membership Plan Definitions
 * Pricing is strictly calculated server-side; client prices are NEVER trusted.
 */
export interface PlanDetails {
  id: string;
  name: string;
  monthlyPrice: number;       // USD
  annualMonthlyPrice: number; // USD per month when billed annually
  description: string;
}

export const MEMBERSHIP_PLANS: Record<string, PlanDetails> = {
  basic_pass: {
    id: "basic_pass",
    name: "FITORA BASIC PASS",
    monthlyPrice: 25,
    annualMonthlyPrice: 19,
    description: "Essential gym access for fitness starters & casual trainers.",
  },
  pro_athlete: {
    id: "pro_athlete",
    name: "FITORA PRO ATHLETE",
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    description: "Complete fitness package with AI coach studio & full access.",
  },
  vip_ultimate: {
    id: "vip_ultimate",
    name: "FITORA VIP ULTIMATE",
    monthlyPrice: 99,
    annualMonthlyPrice: 79,
    description: "Dedicated 1-on-1 coaching, custom nutrition & VIP perks.",
  },
};

/**
 * Normalizes client plan identifier to internal server key
 */
function resolvePlan(identifier?: string): PlanDetails | null {
  if (!identifier) return null;
  const cleaned = identifier.toLowerCase().trim().replace(/[\s-]+/g, "_");

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
 */
export async function createCheckoutSession(
  req: Request,
  res: Response,
): Promise<void | Response> {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res
        .status(500)
        .json(
          errorResponse(
            "Stripe Secret Key is missing in server environment configuration.",
            "STRIPE_CONFIG_ERROR",
            500,
          ),
        );
    }

    const { planId, planKey, isAnnual, billingCycle, customerEmail } = req.body;

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

    // 2. Determine billing cycle and calculate server-side amount (in USD cents)
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

    // 3. Optional user context from token or body
    const user = extractUserFromHeader(req);
    const emailForReceipt = user?.email || customerEmail || undefined;

    // 4. Initialize Stripe client
    const stripe = new Stripe(stripeSecretKey);

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
              name: plan.name,
              description: `${plan.description} — ${intervalLabel}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/?session_id={CHECKOUT_SESSION_ID}&payment_status=success`,
      cancel_url: `${clientUrl}/?payment_status=cancelled`,
      customer_email: emailForReceipt,
      metadata: {
        planId: plan.id,
        planName: plan.name,
        billingCycle: annualBilling ? "annual" : "monthly",
        totalAmountUSD: totalUsd.toString(),
        userId: user?.userId || "",
        userEmail: emailForReceipt || "",
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
    console.error("[Stripe Controller Error]:", error);
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
