// ─────────────────────────────────────────────────────────────────────────────
// SECTION: BMI & Nutrition Calculator Section
// DEVELOPER: Simanto Paul
// TASK: Full-width BMI calculator with height/weight sliders and macro result gauges
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import BmiCalculator from "../BmiCalculator";

export default function CalculatorSection() {

  return (
    <section
      id="calculator"
      className="w-full border-t border-white/[0.06] px-6 py-16 md:px-10"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Calculate Your Metrics
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/50 md:text-base">
            Calculate your BMI, daily calorie needs, and macronutrient goals.
          </p>
        </div>

        {/* Calculator Content */}
        <div className="grid w-full gap-6 lg:grid-cols-2">
          {/* BMI Calculator */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <BmiCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
