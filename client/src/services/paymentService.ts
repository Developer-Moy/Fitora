// client/src/services/paymentService.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    });

    if (!res.ok) throw new Error("Payment checkout failed");

    return res.json();
};

export const fetchMyPaymentsApi = async (token: string) => {
    const res = await fetch(`${BASE_URL}/payments/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch payments");

    return res.json();
};