// ─────────────────────────────────────────────────────────────────────────────
// SECTION: BMI & Nutrition Calculator Section
// DEVELOPER: Simanto Paul
// TASK: Full-width BMI calculator with height/weight sliders and macro result gauges
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import BmiCalculator from "../BmiCalculator";

export default function CalculatorSection() {
  const tdee = 2200;

  const macros = [
    {
      name: "Protein",
      value: 165,
      target: 200,
      unit: "g",
    },
    {
      name: "Carbs",
      value: 250,
      target: 300,
      unit: "g",
    },
    {
      name: "Fats",
      value: 65,
      target: 80,
      unit: "g",
    },
  ];

  return (
    <section
      id="calculator"
      className="w-full border-t border-white/[0.06] px-6 py-16 md:px-10"
    >
      <div className="w-full">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Calculate Your Metrics
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/50 md:text-base">
            Calculate your BMI, daily calorie needs, and macronutrient goals.
          </p>
        </div>

        <div className="grid w-full gap-6 lg:grid-cols-2">
          
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <BmiCalculator />
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <h3 className="mb-6 text-xl font-semibold text-white">
              Nutrition Overview
            </h3>

            <div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
              <p className="text-sm text-white/50">
                Estimated Daily Calories (TDEE)
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">
                  {tdee.toLocaleString()}
                </span>

                <span className="mb-1 text-sm text-white/40">
                  kcal/day
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {macros.map((macro) => {
                const percentage = Math.min(
                  (macro.value / macro.target) * 100,
                  100
                );

                return (
                  <div key={macro.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {macro.name}
                      </span>

                      <span className="text-xs text-white/40">
                        {macro.value}
                        {macro.unit} / {macro.target}
                        {macro.unit}
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/calculator"
              className="mt-8 block w-full rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Go to Full Calculator
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
