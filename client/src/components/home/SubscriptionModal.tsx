"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Lock,
  CreditCard,
} from "lucide-react";
import { PlanItem } from "@/components/home/PricingSection";
import toast from "react-hot-toast";
import {
  getAuthSession,
  saveAuthSession,
  updateSessionAfterPayment,
} from "@/services/authService";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanItem | null;
  isAnnual: boolean;
  onSuccess: (plan: PlanItem, isAnnual: boolean, paymentMethod: string) => void;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  plan,
  isAnnual,
  onSuccess,
}: SubscriptionModalProps) {
  const { data: authSession } = useSession();
  const [paymentMethod, setPaymentMethod] = useState<
    "bkash" | "nagad" | "card"
  >("bkash");
  const [phone, setPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(false);

  if (!isOpen || !plan) return null;

  const totalPrice = isAnnual ? plan.annualPrice * 12 : plan.monthlyPrice;
  const savings = isAnnual ? (plan.monthlyPrice - plan.annualPrice) * 12 : 0;
  const priceBDT = totalPrice * 120;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    let resolvedCardExpiry = cardExpiry;
    let resolvedCardCvc = cardCvc;
    let resolvedCardName = cardName.trim();

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!phone || phone.length < 11) {
        toast.error("Please enter a valid 11-digit mobile number.");
        return;
      }
    } else if (paymentMethod === "card") {
      const cleanCard = cardNumber.replace(/\D/g, "");
      if (cleanCard.length < 12) {
        toast.error(
          "Please enter a valid card number (at least 12-16 digits).",
        );
        return;
      }
      if (!resolvedCardExpiry || resolvedCardExpiry.length < 4) {
        resolvedCardExpiry = "12/28";
        setCardExpiry("12/28");
      }
      if (!resolvedCardCvc || resolvedCardCvc.length < 3) {
        resolvedCardCvc = "424";
        setCardCvc("424");
      }
      if (!resolvedCardName) {
        resolvedCardName = "Pro Athlete";
        setCardName("Pro Athlete");
      }
    }

    setIsProcessing(true);

    try {
      const { token, user } = getAuthSession();
      const currentUser = authSession?.user || user;
      const gatewayFormatted =
        paymentMethod === "bkash"
          ? "bKash"
          : paymentMethod === "nagad"
            ? "Nagad"
            : "Card";

      const cleanDigits = cardNumber.replace(/\D/g, "");
      const last4 = cleanDigits.slice(-4) || "4242";
      const accountNumber =
        paymentMethod === "card" ? `Card **** ${last4}` : phone;

      const transactionId =
        paymentMethod === "card"
          ? trxId || `CARD-${Date.now().toString().slice(-6)}`
          : trxId;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const resolvedUserId = currentUser?.id || (currentUser as any)?._id || "";
      const resolvedEmail =
        currentUser?.email ||
        (typeof window !== "undefined"
          ? localStorage.getItem("fitora_user_email") || ""
          : "");

      const queryParams = new URLSearchParams();
      if (resolvedUserId) queryParams.set("userId", resolvedUserId);
      if (resolvedEmail) queryParams.set("email", resolvedEmail);
      const queryStr = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const res = await fetch(`${API_URL}/payments/checkout${queryStr}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.planKey || plan.name,
          billingCycle: isAnnual ? "yearly" : "monthly",
          amountBDT: priceBDT,
          gateway: gatewayFormatted,
          accountNumber,
          transactionId,
          userId: resolvedUserId,
          userEmail: resolvedEmail,
          userName:
            paymentMethod === "card" && resolvedCardName
              ? resolvedCardName
              : currentUser?.name || "Valued Athlete",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || data?.error || "Payment verification failed.",
        );
      }

      const returnedUser = data?.data?.user;
      const returnedToken = data?.data?.token || token;
      const finalRole = returnedUser?.role || "premium_user";
      const finalPlan = returnedUser?.plan || plan.planKey || plan.name;
      const expiryDate =
        returnedUser?.subscriptionExpiryDate ||
        returnedUser?.membershipExpiresAt;

      // Ensure local user session is updated so Navbar immediately shows PRO badge
      const updatedUserObj: any = {
        ...(currentUser || {}),
        id:
          returnedUser?.id ||
          returnedUser?._id ||
          (currentUser as any)?.id ||
          "user_" + Date.now(),
        name:
          returnedUser?.name ||
          currentUser?.name ||
          resolvedCardName ||
          "Valued Athlete",
        email:
          returnedUser?.email ||
          currentUser?.email ||
          resolvedEmail ||
          "athlete@fitora.com",
        plan: finalPlan,
        role: finalRole,
        subscriptionExpiryDate: expiryDate,
        membershipExpiresAt: expiryDate,
      };

      saveAuthSession(returnedToken || "fitora_active_token", updatedUserObj);

      // Immediately upgrade user session to premium_user and active plan
      await updateSessionAfterPayment(finalPlan, {
        role: finalRole,
        subscriptionExpiryDate: expiryDate,
        membershipExpiresAt: expiryDate,
      });

      setIsProcessing(false);
      onSuccess(plan, isAnnual, gatewayFormatted);
    } catch (err: any) {
      console.error("[SubscriptionModal Checkout Error]:", err);
      toast.error(
        err.message || "Payment processing failed. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  const handleCardContinue = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCardLoading) return;

    try {
      setIsCardLoading(true);

      const { token, user } = getAuthSession();
      const currentUser = authSession?.user || user;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          planId: plan.id,
          planKey: plan.planKey,
          planName: plan.name,
          isAnnual,
          customerEmail: currentUser?.email,
          userId: currentUser?.id || (currentUser as any)?._id,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data?.data?.url) {
        const errorMsg =
          data?.message ||
          data?.error ||
          "Failed to initialize Stripe checkout session. Please try again.";
        toast.error(errorMsg);
        setIsCardLoading(false);
        return;
      }

      // Redirect directly to Stripe-hosted Checkout page
      window.location.href = data.data.url;
    } catch (err: any) {
      console.error("[Stripe Checkout Redirect Error]:", err);
      toast.error("Network error. Could not connect to payment gateway.");
      setIsCardLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl bg-neutral-950 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.95)] text-white select-none overflow-hidden max-h-[96vh]">
        {/* Absolute Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* ── Mobile Compact Header Strip (Visible only on < md) ── */}
        <div className="block md:hidden mb-3 pr-8">
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-black uppercase text-white tracking-tight">
                  {plan.name}
                </h3>
              </div>
              <span className="text-[10px] text-white/50 block">
                {isAnnual ? "Annual (Save 20%)" : "Monthly Plan"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-white block leading-none">
                ${totalPrice}
                <span className="text-[10px] text-white/50 font-normal">
                  /{isAnnual ? "yr" : "mo"}
                </span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block">
                ≈ ৳{priceBDT.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Desktop & Tablet 2-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
          {/* ── Left Column: Plan Summary & Perks (Desktop/Tablet) ── */}
          <div className="hidden md:flex md:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-4 lg:p-5 flex-col justify-between h-full space-y-3.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {isAnnual ? "Annual Plan (Save 20%)" : "Monthly Plan"}
                </span>
              </div>
              <h3 className="text-lg lg:text-xl font-black uppercase tracking-tight text-white">
                {plan.name}
              </h3>
              <p className="text-[11px] text-white/60 mt-0.5 line-clamp-2">
                {plan.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="py-2.5 px-3.5 rounded-xl bg-black/60 border border-white/10">
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Total Amount Due
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl lg:text-3xl font-black text-white leading-none">
                  ${totalPrice}
                </span>
                <span className="text-[11px] text-white/50">
                  /{isAnnual ? "yr" : "mo"}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold ml-auto">
                  ≈ ৳{priceBDT.toLocaleString()}
                </span>
              </div>
              {isAnnual && savings > 0 && (
                <div className="mt-0.5 text-[9px] font-bold text-emerald-400">
                  🎉 You save ${savings} with annual billing
                </div>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="space-y-1 text-[11px] text-white/75">
              {plan.features.slice(0, 3).map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[9px] text-white/40 pt-1 border-t border-white/10">
              <ShieldCheck className="w-3 h-3 text-white/50" />
              <span>256-Bit SSL Encrypted &bull; Instant Activation</span>
            </div>
          </div>

          {/* ── Right Column: Gateway & Payment Form ── */}
          <div className="md:col-span-7">
            <form onSubmit={handlePayment} className="space-y-3 sm:space-y-3.5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  Choose Payment Gateway
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      paymentMethod === "bkash"
                        ? "bg-white text-black border-white shadow-lg font-black"
                        : "bg-neutral-900 text-white/70 border-white/10 hover:border-white/30 font-semibold"
                    }`}
                  >
                    <span className="text-xs font-bold">bKash</span>
                    <span className="text-[8px] sm:text-[9px] opacity-70">
                      Mobile Wallet
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      paymentMethod === "nagad"
                        ? "bg-white text-black border-white shadow-lg font-black"
                        : "bg-neutral-900 text-white/70 border-white/10 hover:border-white/30 font-semibold"
                    }`}
                  >
                    <span className="text-xs font-bold">Nagad</span>
                    <span className="text-[8px] sm:text-[9px] opacity-70">
                      Instant Pay
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-white text-black border-white shadow-lg font-black"
                        : "bg-neutral-900 text-white/70 border-white/10 hover:border-white/30 font-semibold"
                    }`}
                  >
                    <span className="text-xs font-bold">Card</span>
                    <span className="text-[8px] sm:text-[9px] opacity-70">
                      Visa / Master
                    </span>
                  </button>
                </div>
              </div>

              {/* Gateway Specific Content */}
              {paymentMethod === "bkash" || paymentMethod === "nagad" ? (
                <>
                  <div className="space-y-2 p-2.5 sm:p-3 bg-neutral-900/70 border border-white/10 rounded-xl">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                        {paymentMethod === "bkash" ? "bKash" : "Nagad"} Mobile
                        Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                        Transaction ID / Reference (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TRX983421"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  {/* bKash / Nagad Action Buttons */}
                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/3 py-2 sm:py-2.5 rounded-full bg-neutral-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-2/3 py-2 sm:py-2.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xl disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 stroke-[2.5]" />
                          <span>Pay & Activate ${totalPrice}</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Pure Black & White Luxury Card Payment UI */
                <>
                  <div className="space-y-2 p-2.5 sm:p-3 bg-neutral-900/70 border border-white/10 rounded-xl">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white font-mono tracking-wider"
                        />
                        <CreditCard className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white font-mono text-center tracking-wider"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                          CVC / CVV *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvc}
                          onChange={(e) =>
                            setCardCvc(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white font-mono text-center tracking-widest"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/3 py-2 sm:py-2.5 rounded-full bg-neutral-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-2/3 py-2 sm:py-2.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xl disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 stroke-[2.5]" />
                          <span>Pay & Activate ${totalPrice}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Optional Stripe Hosted Link */}
                  <div className="text-center pt-0.5">
                    <button
                      type="button"
                      onClick={handleCardContinue}
                      disabled={isCardLoading}
                      className="text-[9px] sm:text-[10px] text-white/40 hover:text-white/80 transition-colors underline cursor-pointer"
                    >
                      {isCardLoading
                        ? "Redirecting to Stripe..."
                        : "Prefer Stripe hosted checkout page? Click here"}
                    </button>
                  </div>
                </>
              )}

              {/* Mobile Security Footer */}
              <div className="flex md:hidden items-center justify-center gap-1 text-[9px] text-white/40 pt-0.5">
                <ShieldCheck className="w-3 h-3 text-white/50" />
                <span>256-Bit SSL Encrypted &bull; Instant Activation</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
