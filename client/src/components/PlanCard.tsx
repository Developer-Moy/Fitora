"use client";

import React from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface PlanCardProps {
  name: string;
  monthlyPrice: number;
  badge?: string;
  features: string[];
  isPopular?: boolean;
  accentColor?: "gray" | "red" | "cyan";
  isAnnual: boolean;
}

export default function PlanCard({
  name,
  monthlyPrice,
  badge,
  features,
  isPopular = false,
  accentColor = "gray",
  isAnnual,
}: PlanCardProps) {
  // Calculate price based on toggle (20% discount for annual)
  const finalPrice = isAnnual
    ? (monthlyPrice * 0.8).toFixed(2)
    : monthlyPrice.toFixed(2);

  const handleSelectPlan = () => {
    toast.success(`${name} (${isAnnual ? "Annual" : "Monthly"}) Selected!`);
  };

  const isRedAccent = accentColor === "red";
  const isCyanAccent = accentColor === "cyan";

  const cardBorder = isPopular
    ? "border-[#E11D48]"
    : isCyanAccent
    ? "border-[#00F2FE]/40 hover:border-[#00F2FE]"
    : "border-[#1E293B]/80 hover:border-[#334155]";

  const buttonGradient = isRedAccent
    ? "bg-gradient-to-r from-[#FF004D] to-[#E11D48] text-[#050B14] shadow-[0_0_25px_rgba(225,29,72,0.4)] hover:shadow-[0_0_35px_rgba(225,29,72,0.6)]"
    : isCyanAccent
    ? "bg-gradient-to-r from-[#00D2FF] to-[#00E6A8] text-[#050B14] shadow-[0_0_25px_rgba(0,210,255,0.3)] hover:shadow-[0_0_35px_rgba(0,210,255,0.5)]"
    : "bg-[#1E293B] text-[#F4F7F2] hover:bg-[#2A3B54] border border-[#334155]";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full rounded-3xl border bg-[#0A1220]/80 backdrop-blur-2xl p-8 flex flex-col justify-between shadow-2xl ${cardBorder}`}
    >
      {/* Background Glow for Popular Tier */}
      {isPopular && (
        <div className="absolute -inset-0.5 bg-gradient-to-b from-[#E11D48]/30 via-[#E11D48]/5 to-transparent rounded-3xl blur-xl opacity-70 pointer-events-none" />
      )}

      <div>
        {/* Top Badge */}
        <div className="h-7 mb-4 flex items-center justify-between">
          {badge ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                isRedAccent
                  ? "bg-[#E11D48]/20 text-[#FF004D] border border-[#E11D48]/40"
                  : "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
              }`}
            >
              {isPopular && <Sparkles className="w-3 h-3" />}
              {badge}
            </span>
          ) : (
            <span />
          )}

          {isAnnual && monthlyPrice > 0 && (
            <span className="text-[10px] font-bold text-[#36D399] bg-[#36D399]/10 px-2 py-0.5 rounded-md border border-[#36D399]/30">
              Save 20%
            </span>
          )}
        </div>

        {/* Tier Title & Pricing */}
        <div className="mb-6 z-10">
          <h3 className="text-2xl font-black tracking-wider uppercase text-[#F4F7F2]">
            {name}
          </h3>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-5xl font-black text-[#F4F7F2]">
              ${finalPrice}
            </span>
            <span className="text-sm font-semibold text-[#94A3B8]">
              / month
            </span>
          </div>
          {isAnnual && monthlyPrice > 0 && (
            <p className="text-[11px] text-[#64748B] mt-1 font-medium">
              Billed annually (${(parseFloat(finalPrice) * 12).toFixed(2)}/yr)
            </p>
          )}
        </div>

        {/* Feature List */}
        <div className="border-t border-[#1E293B] pt-6 mb-8 z-10 space-y-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Includes:
          </p>
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-1 rounded-full shrink-0 ${
                    isRedAccent
                      ? "bg-[#E11D48]/20 text-[#FF004D]"
                      : isCyanAccent
                      ? "bg-[#00F2FE]/20 text-[#00F2FE]"
                      : "bg-[#1E293B] text-[#94A3B8]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#A8B2AA]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Select CTA Button */}
      <button
        onClick={handleSelectPlan}
        className={`relative z-10 w-full h-12 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${buttonGradient}`}
      >
        <span>Select Plan</span>
        <Zap className="w-3.5 h-3.5 fill-current" />
      </button>
    </motion.div>
  );
}