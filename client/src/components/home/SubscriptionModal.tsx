"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
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
  // Convert USD to approximate BDT for local payment display
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-white select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black shadow-lg">
              <Sparkles className="w-5 h-5 fill-black stroke-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black uppercase tracking-tight">
                  {plan.name}
                </h3>
                {plan.badge && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-black">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">
                {isAnnual ? "Annual Membership (Save 20%)" : "Monthly Membership"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Summary Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/60 block">Total Payable</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-white">
                ${totalPrice}
              </span>
              <span className="text-xs text-white/50">
                / {isAnnual ? "year" : "month"}
              </span>
              <span className="text-[11px] text-emerald-400 font-bold ml-2">
                (≈ ৳{priceBDT.toLocaleString()})
              </span>
            </div>
          </div>
          {isAnnual && savings > 0 && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Save ${savings}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handlePayment} className="space-y-5">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("bkash")}
                className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "bkash"
                    ? "bg-white text-black border-white shadow-lg font-black"
                    : "bg-neutral-900 text-white/70 border-white/10 hover:border-white/30 font-semibold"
                }`}
              >
                <span className="text-xs">bKash</span>
                <span className="text-[10px] opacity-70">Mobile Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("nagad")}
                className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "nagad"
                    ? "bg-white text-black border-white shadow-lg font-black"
                    : "bg-neutral-900 text-white/70 border-white/10 hover:border-white/30 font-semibold"
                }`}
              >
                <span className="text-xs">Nagad</span>
                <span className="text-[10px] opacity-70">Instant Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-white text-black border-white shadow-lg font-black"
                    : "bg-neutral-900 text-white/70 border-white/10 hover:border-white/30 font-semibold"
                }`}
              >
                <span className="text-xs">Card</span>
                <span className="text-[10px] opacity-70">Visa / Master</span>
              </button>
            </div>
          </div>

          {/* Dynamic Form Inputs */}
          {paymentMethod === "bkash" || paymentMethod === "nagad" ? (
            <div className="space-y-3 p-4 bg-neutral-900/60 border border-white/10 rounded-2xl animate-in fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  {paymentMethod === "bkash" ? "bKash" : "Nagad"} Account Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/20 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  Transaction ID / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRX8934JKS2"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/20 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-neutral-900/60 border border-white/10 rounded-2xl animate-in fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/20 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                    Expiry (MM/YY) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-white/20 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                    CVV *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="123"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-white/20 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Feature Highlights Reminder */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase text-white/40 block">
              What&apos;s Included in {plan.name}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-white/70">
              {plan.features.slice(0, 4).map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-full bg-neutral-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-2/3 py-3 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Pay & Activate ${totalPrice}</span>
                </>
              )}
            </button>
          </div>

          {/* Security Guarantee Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/40 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-white/50" />
            <span>256-Bit SSL Secured Payment &bull; Instant Activation</span>
          </div>
        </form>
      </div>
    </div>
  );
}
