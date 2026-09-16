"use client";

import React from "react";
import { Check } from "lucide-react";
import type { PlanItem } from "@/components/home/PricingSection";

interface PlanCardProps {
  plan: PlanItem;
  isAnnual: boolean;
  onSelect: (plan: PlanItem) => void;
  /** CTA shows a spinner + locks while the selection is being processed. */
  pending?: boolean;
}

/**
 * Reusable Fitora pricing card (luxury monochrome glass).
 * Purely presentational — pricing data comes from the single shared
 * FITORA_PLANS source, and CTA behaviour is owned by the parent page.
 */
export default function PlanCard({
  plan,
  isAnnual,
  onSelect,
  pending = false,
}: PlanCardProps) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const yearlySavings = (plan.monthlyPrice - plan.annualPrice) * 12;
  const isPopular = plan.isPopular;

  return (
    <div
      className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ease-out ${
        isPopular
          ? "bg-white text-black border border-white scale-105 z-10 shadow-[0_25px_60px_rgba(0,0,0,0.55),0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-2 hover:shadow-[0_35px_80px_rgba(255,255,255,0.18),0_15px_35px_rgba(0,0,0,0.45)]"
          : "bg-white/[0.04] text-white border border-white/10 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.45)] hover:-translate-y-2 hover:border-white/25 hover:bg-white/[0.07] hover:shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
          {plan.badge || "MOST POPULAR"}
        </span>
      )}

      <div className="space-y-6">
        {/* Plan Name + Description */}
        <div>
          <h3
            className={`text-lg font-black tracking-wider uppercase ${
              isPopular ? "text-black" : "text-white"
            }`}
          >
            {plan.name}
          </h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isPopular ? "text-black/70" : "text-white/60"
            }`}
          >
            {plan.description}
          </p>
        </div>

        {/* Price Block — updates instantly with the billing toggle */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl sm:text-5xl font-black tracking-tight ${
                isPopular ? "text-black" : "text-white"
              }`}
            >
              ${price}
            </span>
            <span
              className={`text-xs font-semibold ${
                isPopular ? "text-black/60" : "text-white/50"
              }`}
            >
              {plan.period}
            </span>
          </div>
          {isAnnual ? (
            <p
              className={`text-[11px] font-semibold ${
                isPopular ? "text-black/70" : "text-white/60"
              }`}
            >
              ${plan.annualPrice * 12}/year (Save ${yearlySavings})
            </p>
          ) : (
            <p
              className={`text-[11px] font-medium ${
                isPopular ? "text-black/50" : "text-white/40"
              }`}
            >
              Billed monthly &mdash; cancel anytime
            </p>
          )}
        </div>

        <div className={`w-full h-[1px] ${isPopular ? "bg-black/10" : "bg-white/10"}`} />

        {/* Feature List */}
        <ul className="space-y-3 pt-1">
          {plan.features.map((feat, fIdx) => (
            <li
              key={fIdx}
              className="flex items-center gap-3 text-xs sm:text-sm font-medium"
            >
              <Check
                className={`w-4 h-4 shrink-0 ${
                  isPopular ? "text-black" : "text-white"
                }`}
              />
              <span className={isPopular ? "text-black/80" : "text-white/75"}>
                {feat}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-8">
        <button
          type="button"
          onClick={() => onSelect(plan)}
          disabled={pending}
          aria-busy={pending}
          className={`group/btn inline-flex items-center justify-between w-full gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            isPopular
              ? "bg-black text-white hover:bg-neutral-900 shadow-md"
              : "bg-white text-black border border-white hover:bg-neutral-100 shadow-lg"
          }`}
        >
          <span>
            {pending ? "Preparing checkout…" : plan.buttonText}
          </span>
          {pending ? (
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center bg-black/10"
              aria-hidden="true"
            >
              <span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
            </span>
          ) : (
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-transform duration-300 group-hover/btn:translate-x-0.5 ${
                isPopular ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              &rarr;
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
