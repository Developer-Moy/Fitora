const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";
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
export function derivePaymentFromUser(
  user: AuthUser | null,
): Payment | null {
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
    _id:
      user.id ||
      user._id ||
      `payment_${String(Math.random()).slice(2, 10)}`,
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
  planId: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
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
  const body =
    typeof payload === "string"
      ? { planId: payload }
      : payload;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}/payments/checkout`,
    {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message ||
        json?.error ||
        "Payment checkout failed",
    );
  }

  return json;
};

/**
 * Fetch the authenticated user's payment history from GET /api/payments/me.
 * Returns a typed response; on any network/server error the boolean flag
 * is set to false with an explanatory message.
 */
export const fetchMyPaymentsApi = async (
  token: string,
): Promise<PaymentHistoryResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/payments/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Failed to fetch payments" };
    }

    const data = await res.json();
    // Standard response shape is { success, data: { payments: [...] } }
    const payments: Payment[] | undefined =
      data?.data?.payments || data?.payments || data?.data;

    return {
      success: true,
      payments: Array.isArray(payments) ? payments : [],
    };
  } catch {
    return { success: false, message: "Could not reach payment server" };
  }
};
export const fetchMyPaymentsApi = async (token?: string) => {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}/payments/me`,
    {
      method: "GET",
      headers,
      credentials: "include",
    },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message ||
        json?.error ||
        "Failed to fetch payments",
    );
  }

  return json;
};