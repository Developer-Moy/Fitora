/**
 * Payment Business Service
 * Handles server-authoritative plan resolution, subscription calculations,
 * retention bonuses, and invoice serial generation.
 */

export interface PlanDetails {
  id: string;
  name: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
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
 * Generates formatted invoice number (e.g. INV-2026-834920)
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `INV-${year}-${randomNum}`;
}

/**
 * Calculates subscription expiry date, duration, and expiration status
 */
export function calculateSubscriptionDetails(
  startDate: Date,
  billingCycle: string,
) {
  const expiryDate = new Date(startDate);

  if (billingCycle === "yearly" || billingCycle === "annual") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }

  const now = new Date();
  const remainingMs = expiryDate.getTime() - now.getTime();
  const remainingDays = Math.max(
    0,
    Math.ceil(remainingMs / (1000 * 60 * 60 * 24)),
  );

  return {
    startDate,
    expiryDate,
    remainingDays,
    isExpired: remainingMs <= 0,
  };
}

/**
 * Retention Engine: If member saves their card on a monthly subscription,
 * award 2 bonus months free (90 days total for 1 month price).
 */
export function calculateRetentionExpiry(
  saveCard: boolean,
  billingCycle: string,
  effectiveStartDate: Date,
  standardExpiryDate: Date,
): { appliedExpiryDate: Date; bonusMonthsAwarded: number } {
  if (saveCard && (billingCycle === "monthly" || billingCycle === "month")) {
    return {
      appliedExpiryDate: new Date(
        effectiveStartDate.getTime() + 90 * 24 * 60 * 60 * 1000,
      ),
      bonusMonthsAwarded: 2,
    };
  }

  return {
    appliedExpiryDate: standardExpiryDate,
    bonusMonthsAwarded: 0,
  };
}
