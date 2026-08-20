"use client";

import BmiCalculator from "@/components/BmiCalculator";

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0e] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Health & Fitness
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            BMI Calculator
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
            Calculate your Body Mass Index using your weight and height,
            and get an instant health status.
          </p>
        </div>

        {/* Calculator */}
        <section className="mx-auto max-w-3xl rounded-2xl border border-[#303136] bg-white/[0.02] p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div className="mb-5 flex items-center gap-3 border-b border-[#303136] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ed173b]/10">
              <span className="text-lg">⚖️</span>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Check Your BMI
              </h2>

              <p className="text-xs text-gray-500">
                Adjust the sliders to calculate your result
              </p>
            </div>
          </div>

          <BmiCalculator />
        </section>

        {/* Info Cards */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#ed173b]" />

            <h3 className="text-sm font-semibold text-white">
              Quick
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Get your BMI result instantly.
            </p>
          </div>

          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-yellow-400" />

            <h3 className="text-sm font-semibold text-white">
              Simple
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Easy sliders make calculation simple.
            </p>
          </div>

          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-emerald-400" />

            <h3 className="text-sm font-semibold text-white">
              Personalized
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Results are based on your inputs.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}