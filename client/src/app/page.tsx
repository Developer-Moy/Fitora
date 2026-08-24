"use client";

import HeroSection from "@/components/home/HeroSection";
import AiTrainerSection from "@/components/home/AiTrainerSection";
import GymTimerSection from "@/components/home/GymTimerSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import MealChartSection from "@/components/home/MealChartSection";
import ContactInfoForm from "@/components/home/ContactInfoForm";
import Advertisement from "@/sections/Advertisement";

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE — /
// Layout: Full-width sections stacked vertically
//
// SECTION MAP:
// 1. HeroSection        → Alfaaz Ahmed
// 2. AiTrainerSection   → Moloy Paul
// 3. GymTimerSection    → Puskor Roy
// 4. CalculatorSection  → Simanto Paul
// 5. MealChartSection   → Simanto Poddar
// 6. ContactInfoForm    → Developer-Moy (Leave Us Your Info Consultation)
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Section 1: Hero Banner */}
      <HeroSection />

      {/* Section 2: AI Trainer Chat */}
      <AiTrainerSection />

      {/* Section 3: Gym Timer & Workout Preview */}
      <GymTimerSection />

      {/* Section 4: BMI & Nutrition Calculator */}
      <CalculatorSection />

      {/* Section 5: Premium Meal Chart & Ads */}
      <MealChartSection />

      {/* Section 6: Consultation Contact Form */}
      <ContactInfoForm />

      <Advertisement />

    </main>
  );
}
