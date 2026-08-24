"use client";

import HeroSection from "@/components/home/HeroSection";
import AiTrainerSection from "@/components/home/AiTrainerSection";
import GymTimerSection from "@/components/home/GymTimerSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import MealChartSection from "@/components/home/MealChartSection";
import Advertisement from "@/sections/Advertisement";
import WhyChooseUs from "@/components/home/WhyChooseUs";

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

      {/* Section 4: Why choose section — Simanto Paul */}
      <WhyChooseUs />

      {/* Section 2: AI Trainer Chat — Moloy Paul */}
      <AiTrainerSection />

      {/* Section 3: Gym Timer & Workout Preview — Puskor Roy */}
      <GymTimerSection />

      {/* Section 5: Premium Meal Chart & Ads — Simanto Poddar */}
      <MealChartSection />

      <Advertisement />

    </main>
  );
}

