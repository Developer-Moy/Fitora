// client/src/services/paymentService.ts

import type { AuthUser } from "@/services/authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * A single payment / invoice record as returned by GET /api/payments/me.
 * Field names are kept flexible so both the backend response and
 * locally-derived (AuthUser) data can be mapped onto the same shape.
 */
export interface Payment {
  _id?: string;
  id?: string;
  invoiceNumber?: string;
  date: string;
  plan: string;
  amount: number;
  gateway: string;
  status: string;
  transactionId?: string;
  billingCycle?: string;
  description?: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  payments?: Payment[];
  message?: string;
}

/** Map a plan key to its BDT monthly price (matches server seed values). */
export const PLAN_MONTHLY_BDT: Record<string, number> = {
  "Free Pass": 0,
  "Basic Pass": 2500,
  "Pro Athlete": 4900,
  "VIP Ultimate": 9900,
};

/** Map a plan key to a display billing cycle label. */
const BILLING_LABEL: Record<string, string> = {
  "Free Pass": "Free Trial",
  "Basic Pass": "Monthly",
  "Pro Athlete": "Monthly",
  "VIP Ultimate": "Monthly",
};

/**
 * Derive a payment record for the current authenticated user from the
 * locally-cached AuthUser session. This acts as a graceful fallback when the
 * dedicated `/payments/me` endpoint is not available, instead of hardcoding
 * static/mock data.
 */
export function derivePaymentFromUser(user: AuthUser | null): Payment | null {
  if (!user) return null;

  const plan = user.plan || "Free Pass";
  const amount = user.totalPaidBDT ?? PLAN_MONTHLY_BDT[plan] ?? 0;
  // Only show a row when there's actual billing information to display.
  if (amount <= 0) return null;

  const rawGateway = user.paymentMethod || "None";
  const gateway =
    rawGateway === "Card"
      ? "Stripe"
      : rawGateway === "bKash"
        ? "bKash"
        : rawGateway === "Nagad"
          ? "Nagad"
          : rawGateway || "N/A";

  const dateStr = user.createdAt || user.joinedDate || new Date().toISOString();

  return {
    _id: user.id || user._id || `payment_${String(Math.random()).slice(2, 10)}`,
    invoiceNumber: `FIT-INV-${String(dateStr)
      .slice(0, 10)
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase()}`,
    date: dateStr,
    plan,
    amount,
    gateway,
    status: "Paid",
    transactionId: user.qrCodeId || `TRX-${String(Math.random()).slice(2, 12)}`,
    billingCycle: BILLING_LABEL[plan] || "One-time",
    description: `${plan} membership payment`,
  };
}

export const checkoutPaymentApi = async (
  payload:
    | {
        planId?: string;
        planName?: string;
        amountBDT?: number;
        gateway?: string;
        accountNumber?: string;
        transactionId?: string;
        billingCycle?: string;
        userId?: string;
        userEmail?: string;
      }
    | string,
  token?: string,
) => {
  const body = typeof payload === "string" ? { planId: payload } : payload;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/payments/checkout`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || json?.error || "Payment checkout failed");
  }

  return json;
};

/**
 * Fetch the authenticated user's payment history from GET /api/payments/me.
 * Handles token resolution, query params, and returns unified payload.
 */
export const fetchMyPaymentsApi = async (
  token?: string,
): Promise<
  PaymentHistoryResponse & { data?: any; activeSubscription?: any }
> => {
  try {
    let resolvedToken = token;
    if (!resolvedToken && typeof window !== "undefined") {
      resolvedToken =
        localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token") ||
        undefined;
    }

    const headers: Record<string, string> = {};
    if (resolvedToken) {
      headers.Authorization = `Bearer ${resolvedToken}`;
    }

    let queryParams = "";
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("fitora_user_email");
      const userStr = localStorage.getItem("fitora_user");
      let userId: string | undefined;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          userId = parsed?._id || parsed?.id;
        } catch {}
      }
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);
      if (email) params.set("email", email);
      const str = params.toString();
      if (str) queryParams = `?${str}`;
    }

    const res = await fetch(`${BASE_URL}/payments/me${queryParams}`, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: json?.message || json?.error || "Failed to fetch payments",
        payments: [],
      };
    }

    const rawPayments =
      json?.data?.payments ||
      json?.payments ||
      (Array.isArray(json?.data) ? json.data : []);

    const payments: Payment[] = Array.isArray(rawPayments)
      ? rawPayments.map((p: any) => ({
          _id: p._id || p.id || p.transactionId,
          id: p.id || p._id,
          invoiceNumber: p.invoiceNumber,
          date: p.date || p.createdAt,
          plan: p.plan || p.planName || "Pro Athlete",
          amount: p.amount || p.amountBDT || 0,
          gateway: p.gateway || p.paymentMethod || "Card",
          status: p.status || "Completed",
          transactionId: p.transactionId,
          billingCycle: p.billingCycle || "monthly",
          description:
            p.description ||
            `${p.plan || p.planName || "Pro Athlete"} Membership`,
        }))
      : [];

    return {
      success: true,
      data: json?.data || { payments },
      payments,
      activeSubscription:
        json?.data?.activeSubscription || json?.activeSubscription || null,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Could not reach payment server",
      payments: [],
    };
  }
};

/**
 * Toggle auto-renew preference for authenticated user
 */
export const toggleAutoRenewApi = async (token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/payments/toggle-auto-renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to toggle auto-renewal",
    };
  }
};

/**
 * Change or upgrade membership plan for authenticated user
 */
export const changeMembershipPlanApi = async (
  token: string,
  newPlanId: string,
  billingCycle: string = "monthly",
) => {
  try {
    const res = await fetch(`${BASE_URL}/payments/change-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPlanId, billingCycle }),
    });
    const json = await res.json();
    return json;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to change membership plan",
    };
  }
};
