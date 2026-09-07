"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getAuthSession, saveAuthSession } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface VerifiedPaymentData {
  planName: string;
  billingCycle: "monthly" | "annual";
  amount: number;
  currency: string;
  paymentMethod: string;
  paidAt?: string;
  membershipExpiresAt?: string | null;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const { data: authSession, isPending: isAuthPending } = useSession();
  const [localAuth, setLocalAuth] = useState<{ token: string | null; user: any } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<VerifiedPaymentData | null>(null);

  useEffect(() => {
    setLocalAuth(getAuthSession());
  }, []);

  const verifyPaymentSession = useCallback(async () => {
    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage("No payment session identifier was found in this request.");
      return;
    }

    // Wait until auth session check finishes
    if (isAuthPending) {
      return;
    }

    const currentUser = authSession?.user || localAuth?.user;
    const token = localAuth?.token;

    // 1. Check whether the user is currently logged in
    if (!currentUser) {
      setIsLoading(false);
      setErrorMessage(
        "Please log in with your account credentials to view your verified payment details.",
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // 2. Get the logged-in user's existing data
      const userEmail = currentUser.email || "";
      const userId = currentUser.id || (currentUser as any)._id || "";

      const query = new URLSearchParams({
        session_id: sessionId,
      });
      if (userEmail) query.set("email", userEmail);
      if (userId) query.set("userId", String(userId));

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 3. Request server-side Stripe verification
      const res = await fetch(
        `${API_URL}/payments/verify-session?${query.toString()}`,
        {
          method: "GET",
          headers,
          credentials: "include",
        },
      );

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        setErrorMessage(
          "Please log in with your account credentials to view your verified payment details.",
        );
        setIsLoading(false);
        return;
      }

      if (res.status === 403) {
        setErrorMessage(
          "You do not have permission to view this payment session.",
        );
        setIsLoading(false);
        return;
      }

      if (!res.ok || !json?.success || !json?.data) {
        const message =
          json?.message ||
          "Your payment may still be processing. Please wait a moment and try again.";
        setErrorMessage(message);
        setIsLoading(false);
        return;
      }

      // 4. Set verified payment data
      setPaymentData(json.data);

      // 5. Update local session roles/plan
      try {
        localStorage.setItem("fitora_active_role", "premium_user");
        localStorage.setItem("fitora_user_plan", json.data.planName);
        if (localAuth?.user) {
          saveAuthSession(localAuth.token || "", {
            ...localAuth.user,
            plan: json.data.planName,
            role: "premium_user",
          });
        }
      } catch {}

      setIsLoading(false);
    } catch (err: any) {
      console.error("[Payment Verification Client Error]:", err);
      setErrorMessage(
        "Could not connect to payment verification gateway. Please check your network and try again.",
      );
      setIsLoading(false);
    }
  }, [sessionId, isAuthPending, authSession, localAuth]);

  useEffect(() => {
    verifyPaymentSession();
  }, [verifyPaymentSession]);

  // ── 1. LOADING STATE ──
  if (isLoading || isAuthPending) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-neutral-950 border border-white/10 rounded-3xl text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-white animate-spin" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
            Verifying your payment...
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
            Please wait while we confirm your transaction with Stripe and activate your membership pass.
          </p>
        </div>
      </div>
    );
  }

  // ── 2. ERROR / PROCESSING STATE ──
  if (errorMessage || !paymentData) {
    const isLoginError = errorMessage?.toLowerCase().includes("log in");
    const redirectUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/payment/success?session_id=${sessionId || ""}`;

    return (
      <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-neutral-950 border border-white/10 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
            We couldn't verify your payment yet.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            {errorMessage ||
              "Your payment may still be processing. Please wait a moment and try again."}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          {isLoginError ? (
            <button
              type="button"
              onClick={() => router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
            >
              Log In to Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => verifyPaymentSession()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
            >
              Try Again
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Format valid until date
  let formattedExpiry = "Active";
  if (paymentData.membershipExpiresAt) {
    const d = new Date(paymentData.membershipExpiresAt);
    if (!isNaN(d.getTime())) {
      formattedExpiry = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  // ── 3. VERIFIED SUCCESS STATE ──
  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-neutral-950 border border-white/10 rounded-3xl text-center space-y-6 shadow-2xl animate-in fade-in duration-200">
      {/* Success Icon */}
      <div className="w-16 h-16 mx-auto rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-white" />
      </div>

      {/* Main Success Heading */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
          Payment Successful
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 font-medium">
          Your payment was completed successfully and your membership is active.
        </p>
      </div>

      {/* Verified Membership Summary Card */}
      <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 text-left space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-xs uppercase font-bold text-neutral-400">Plan</span>
          <span className="text-sm font-black uppercase text-white tracking-wide">
            {paymentData.planName}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-xs uppercase font-bold text-neutral-400">Billing Cycle</span>
          <span className="text-xs font-bold uppercase text-white">
            {paymentData.billingCycle === "annual" ? "Annual (Billed Yearly)" : "Monthly"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-xs uppercase font-bold text-neutral-400">Amount Paid</span>
          <span className="text-sm font-black text-white">
            ${paymentData.amount} {paymentData.currency.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-xs uppercase font-bold text-neutral-400">Payment Method</span>
          <span className="text-xs font-bold uppercase text-white">
            {paymentData.paymentMethod}
          </span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs uppercase font-bold text-neutral-400">Membership Valid Until</span>
          <span className="text-xs font-bold text-white">
            {formattedExpiry}
          </span>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full sm:w-2/3 py-3 px-6 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xl"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href="/"
          className="w-full sm:w-1/3 py-3 px-4 rounded-full bg-neutral-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-lg mx-auto p-8 bg-neutral-950 border border-white/10 rounded-3xl text-center space-y-4 shadow-2xl">
            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider">
              Loading payment status...
            </p>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}
