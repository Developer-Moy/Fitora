"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";
import { PlanItem } from "@/components/home/PricingSection";
import toast from "react-hot-toast";

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
  const [paymentMethod, setPaymentMethod] = useState<
    "bkash" | "nagad" | "card"
  >("bkash");
  const [phone, setPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const totalPrice = isAnnual ? plan.annualPrice * 12 : plan.monthlyPrice;
  const savings = isAnnual ? (plan.monthlyPrice - plan.annualPrice) * 12 : 0;
  const priceBDT = totalPrice * 120;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!phone || phone.length < 11) {
        toast.error("Please enter a valid 11-digit mobile number.");
        return;
      }
    } else {
      if (!cardNumber || cardNumber.length < 16) {
        toast.error("Please enter a valid 16-digit card number.");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment verification
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(plan, isAnnual, paymentMethod.toUpperCase());
    }, 1200);
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
                    <span className="text-[8px] sm:text-[9px] opacity-70">Mobile Wallet</span>
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
                    <span className="text-[8px] sm:text-[9px] opacity-70">Instant Pay</span>
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
                    <span className="text-[8px] sm:text-[9px] opacity-70">Visa / Master</span>
                  </button>
                </div>
              </div>

              {/* Gateway Specific Input Fields */}
              {paymentMethod === "bkash" || paymentMethod === "nagad" ? (
                <div className="space-y-2 p-2.5 sm:p-3 bg-neutral-900/70 border border-white/10 rounded-xl">
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                      {paymentMethod === "bkash" ? "bKash" : "Nagad"} Mobile Number *
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
              ) : (
                <div className="space-y-2 p-2.5 sm:p-3 bg-neutral-900/70 border border-white/10 rounded-xl">
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        maxLength={5}
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                        CVV *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 sm:py-2 bg-black border border-white/20 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
