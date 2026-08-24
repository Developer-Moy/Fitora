"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function JoinTodayPricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <section
      id="pricing"
      className="w-full py-20 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header + Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Pricing Plan
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              JOIN TODAY
            </h2>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="p-1 rounded-full bg-white/10 border border-white/20 flex items-center gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Beginner Plan */}
          <div className="rounded-3xl bg-white text-black p-8 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <p className="text-xs font-extrabold text-gray-600 uppercase tracking-widest">
                Beginner Plan
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black">
                  {billingCycle === "monthly" ? "$10" : "$96"}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  / {billingCycle === "monthly" ? "Month" : "Year"}
                </span>
              </div>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-gray-800">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Free Gym Locker Access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Basic Fitness Equipment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Mobile App Workout Timer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Community Forum Support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-black hover:bg-gray-900 text-white font-extrabold text-xs uppercase tracking-wider text-center block transition-all active:scale-95"
            >
              Choose Plan
            </Link>
          </div>

          {/* Card 2: Premium Plan (Highlighted Dark Card) */}
          <div className="rounded-3xl bg-[#0E0F12] border-2 border-white text-white p-8 flex flex-col justify-between space-y-8 shadow-2xl relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-md">
              MOST POPULAR
            </span>

            <div className="space-y-4">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                Premium Plan
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black">
                  {billingCycle === "monthly" ? "$15" : "$144"}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  / {billingCycle === "monthly" ? "Month" : "Year"}
                </span>
              </div>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-gray-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>All Beginner Plan Features</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>AI Personal Trainer Studio</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Nutrition & Macro Meal Plans</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>24/7 Unlimited Gym Access</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-200 text-black font-black text-xs uppercase tracking-wider text-center block transition-all active:scale-95"
            >
              Choose Plan
            </Link>
          </div>

          {/* Card 3: Ultimate Plan */}
          <div className="rounded-3xl bg-white text-black p-8 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <p className="text-xs font-extrabold text-gray-600 uppercase tracking-widest">
                Ultimate Plan
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black">
                  {billingCycle === "monthly" ? "$20" : "$192"}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  / {billingCycle === "monthly" ? "Month" : "Year"}
                </span>
              </div>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-gray-800">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>All Premium Plan Features</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>1-on-1 Personal Master Coach</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Sauna & Spa Recovery Pass</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Custom Supplement Advice</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-black hover:bg-gray-900 text-white font-extrabold text-xs uppercase tracking-wider text-center block transition-all active:scale-95"
            >
              Choose Plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
