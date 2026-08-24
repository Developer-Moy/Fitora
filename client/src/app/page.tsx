<<<<<<< HEAD
"use client";

import HeroSection from "@/components/home/HeroSection";
import AiTrainerSection from "@/components/home/AiTrainerSection";
import GymTimerSection from "@/components/home/GymTimerSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import MealChartSection from "@/components/home/MealChartSection";
import Advertisement from "@/sections/Advertisement";

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

      {/* Section 5: Premium Meal Chart & Ads — Simanto Poddar */}
      <MealChartSection />

      <Advertisement />

=======

import PricingAndReviews from "@/components/home/PricingAndReviews";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* ── Top Section: Hero & AI Trainer ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Hero Banner & Gym Card */}
        <div className="lg:col-span-7 space-y-6">
         
        </div>

       
        
      </section>

      {/* ── Mid Section: Calculators & Tools (Simanto Paul's BMI Calculator) ── */}
      <section className="grid grid-cols-1 gap-6 items-start pt-4 border-t border-white/8">
        
        <div className="md:col-span-6 lg:col-span-5">
          <PricingAndReviews />
        </div>
      </section>
>>>>>>> 81ade7d (JOIN TODAY Pricing & YOUR OPINIONS Reviews Slider)
    </main>
  );
}

