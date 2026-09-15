"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  updateSessionAfterPayment,
} from "@/services/authService";
import { FITORA_PLANS, type PlanItem } from "@/components/home/PricingSection";
import SubscriptionModal from "@/components/home/SubscriptionModal";
import toast from "react-hot-toast";
import PlanCard from "@/components/PlanCard";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);

  // Single shared source of truth for plans (same data as the homepage).
  const plans = FITORA_PLANS;

  // Auth state is resolved at click time (Better Auth session OR local
  // session) so the CTA always routes against the freshest session.
  const handlePlanSelect = (plan: PlanItem) => {
    const localSession = getAuthSession();
    const loggedIn = !!(session?.user || localSession?.user);

    if (!loggedIn) {
      router.push(
        `/register?plan=${plan.id}&billing=${isAnnual ? "annual" : "monthly"}`,
      );
      return;
    }
    setSelectedPlan(plan);
  };

  const handleSubscriptionSuccess = async (
    plan: PlanItem,
    isAnnualPlan: boolean,
    paymentMethod: string,
  ) => {
    await updateSessionAfterPayment(plan.name || plan.planKey, {
      role: "premium_user",
    });

    setSelectedPlan(null);
    toast.success(
      `🎉 Payment Successful via ${paymentMethod}! Welcome to ${plan.name} (${
        isAnnualPlan ? "Annual" : "Monthly"
      }) — You are now a FITORA PRO Member!`,
      { duration: 4000 },
    );
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden select-none">
      {/* Luxury ambient glows behind the glass cards */}
      <div className="absolute -top-32 -left-24 z-0 w-96 h-96 rounded-full bg-white/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 z-0 w-96 h-96 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 z-0 w-80 h-80 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-14 sm:py-20 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-white/40">
            PRICING PLAN
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Join Today &amp; Shape Your Body
          </h1>
          <p
            className="text-white/50 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Choose the perfect membership tier tailored to your fitness goals
            across all 64 branches in Bangladesh.
          </p>

          {/* Toggle Monthly / Annual — instantly updates all card prices */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              onClick={() => setIsAnnual(false)}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                !isAnnual ? "text-white font-extrabold" : "text-white/40 hover:text-white/70"
              }`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle Annual Billing"
              aria-pressed={isAnnual}
              className="relative w-14 h-7 rounded-full bg-white/15 border border-white/20 p-1 cursor-pointer transition-colors hover:bg-white/25"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span
              onClick={() => setIsAnnual(true)}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 ${
                isAnnual ? "text-white font-extrabold" : "text-white/40 hover:text-white/70"
              }`}
            >
              Annual
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-white uppercase tracking-wider border border-white/20">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards — 3-column desktop, stacked mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/40 pt-4 font-medium">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Flexible Cancel Anytime &mdash; All 64 Branches Included</span>
        </div>
      </div>

      {/* ── Existing Membership Checkout Modal (reused) ── */}
      <SubscriptionModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        isAnnual={isAnnual}
        onSuccess={handleSubscriptionSuccess}
      />
    </div>
  );
}
