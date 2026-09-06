// client/src/services/paymentService.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/payments/checkout`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Payment checkout failed");

  return res.json();
};

export const fetchMyPaymentsApi = async (token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/payments/me`, {
    headers,
  });

  if (!res.ok) throw new Error("Failed to fetch payments");

  return res.json();
};
