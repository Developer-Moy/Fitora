"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "BASIC PASS",
      price: isAnnual ? "19" : "25",
      period: "/month",
      description:
        "Essential gym access for fitness starters & casual trainers.",
      features: [
        "Access to Gym Floor & Cardio Zone",
        "Free Locker & Shower Access",
        "Basic Workout Routine Guide",
        "Standard Support",
      ],
      isPopular: false,
      buttonText: "CHOOSE PLAN",
    },
    {
      name: "PRO ATHLETE",
      price: isAnnual ? "39" : "49",
      period: "/month",
      description:
        "Complete fitness package with AI coach studio & full access.",
      features: [
        "Unlimited 24/7 All-Branch Access",
        "AI Coach Studio & Meal Planner",
        "Free Personal Trainer Consultation",
        "Sauna & Recovery Zone Access",
        "Group Fitness & Yoga Classes",
      ],
      isPopular: true,
      buttonText: "JOIN PRO TODAY",
    },
    {
      name: "VIP ULTIMATE",
      price: isAnnual ? "79" : "99",
      period: "/month",
      description: "Dedicated 1-on-1 coaching, custom nutrition & VIP perks.",
      features: [
        "Dedicated 1-on-1 Personal Trainer",
        "Custom Weekly Nutrition & Meal Plan",
        "Priority VIP Lounge & Spa",
        "Biometric Health & Recovery Tracking",
        "24/7 Unlimited AI & Expert Support",
      ],
      isPopular: false,
      buttonText: "GET VIP ACCESS",
    },
  ];

  return (
    <section
      id="pricing"
      data-section="plans"
      className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-white text-black select-none border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
            PRICING PLAN
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-black select-none">
            Join Today & Shape Your Body
          </h2>
          <p
            className="text-gray-600 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Choose the perfect membership tier tailored to your fitness goals
            across all 64 branches in Bangladesh.
          </p>

          {/* Toggle Monthly / Annual */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer ${
                !isAnnual ? "text-black font-extrabold" : "text-gray-500"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-gray-200 p-1 cursor-pointer transition-colors"
              aria-label="Toggle Annual Billing"
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer ${
                isAnnual ? "text-black font-extrabold" : "text-gray-500"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual{" "}
              <span className="text-gray-500 font-normal">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 ${
                plan.isPopular
                  ? "bg-black text-white border-black shadow-2xl scale-105 z-10"
                  : "bg-gray-50 text-black border-gray-200 hover:border-gray-400"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-gray-300 shadow-sm">
                  MOST POPULAR
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-black tracking-wider uppercase ${
                      plan.isPopular ? "text-white" : "text-black"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      plan.isPopular ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    ${plan.price}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      plan.isPopular ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <div
                  className={`w-full h-[1px] ${
                    plan.isPopular ? "bg-white/20" : "bg-gray-200"
                  }`}
                />

                {/* Feature List */}
                <ul className="space-y-3 pt-2">
                  {plan.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-3 text-xs sm:text-sm font-medium"
                    >
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          plan.isPopular ? "text-white" : "text-black"
                        }`}
                      />
                      <span
                        className={
                          plan.isPopular ? "text-gray-200" : "text-gray-700"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/plans"
                  className={`group inline-flex items-center justify-between w-full gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-xl cursor-pointer ${
                    plan.isPopular
                      ? "bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-black text-white border border-white/25 hover:bg-neutral-900 hover:border-white/60 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md ${
                      plan.isPopular
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-4 font-medium">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>Flexible Cancel Anytime &mdash; All 64 Branches Included</span>
        </div>
      </div>
    </section>
  );
}
