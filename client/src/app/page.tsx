"use client";

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

      {/* Section 4: Why choose section — Simanto Paul */}
      <WhyChooseUs />

    </main>
  );
}

