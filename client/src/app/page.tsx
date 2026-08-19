import AiTrainerChat from "@/components/AiTrainerChat";
import BmiCalculator from "@/components/BmiCalculator";
import Banner from "@/components/homepage/banner/Banner";

export default function Home() {
  return (
    <>
      <div>
        <Banner />
      </div>

      <main className="min-h-screen bg-black text-white px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
        {/* ── Top Section: Hero & AI Trainer ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Hero Banner & Gym Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 pt-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
                Train with a plan.
                <br />
                <span className="text-red-500">Recover with data.</span>
              </h1>
              <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
                <span className="text-red-400 font-medium">Fitora:</span> Our ultimate data-driven fitness, nutrition, and recovery coach. We turn every workout into insights and data.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950/60 transition-all duration-200">
                  Start Now
                </button>
                <button className="px-6 py-3 rounded-xl border border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 font-semibold text-sm transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>

            {/* Featured Gym Media Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-56 sm:h-64 group">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                alt="Gym Training Equipment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                  Featured Equipment
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Courtesy Equipment & Dumbbell Zone
                </h3>
              </div>
            </div>
          </div>

          {/* Right Side: AI Trainer Chat Widget (Positioned Top Right) */}
          <div className="lg:col-span-5 flex justify-end">
            <AiTrainerChat />
          </div>
        </section>

        {/* ── Mid Section: Calculators & Tools (Simanto Paul's BMI Calculator) ── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4 border-t border-white/[0.08]">
          <div className="md:col-span-6 lg:col-span-5">
            <BmiCalculator />
          </div>
        </section>
      </main>
    </>
"use client";

import HeroSection from "@/components/home/HeroSection";
import AiTrainerSection from "@/components/home/AiTrainerSection";
import GymTimerSection from "@/components/home/GymTimerSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import MealChartSection from "@/components/home/MealChartSection";

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE — /
// Layout: Full-width sections stacked vertically (no side-by-side grid layout)
//
// SECTION MAP:
// 1. HeroSection        → Alfaaz Ahmed
// 2. AiTrainerSection   → Moloy Paul
// 3. GymTimerSection    → Puskor Roy
// 4. CalculatorSection  → Simanto Paul
// 5. MealChartSection   → Simanto Poddar
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">

      {/* Section 1: Hero Banner — Alfaaz Ahmed */}
      <HeroSection />

      {/* Section 2: AI Trainer Chat — Moloy Paul */}
      <AiTrainerSection />

      {/* Section 3: Gym Timer & Workout Preview — Puskor Roy */}
      <GymTimerSection />

      {/* Section 4: BMI & Nutrition Calculator — Simanto Paul */}
      <CalculatorSection />

      {/* Section 5: Premium Meal Chart & Ads — Simanto Poddar */} {/*  Ads  <-- Postponed as per updated schedule. */}
      <MealChartSection />

    </main>
  );
}
