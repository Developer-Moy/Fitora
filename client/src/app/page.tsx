"use client";

import MealChartSection from "@/components/home/MealChartSection";
import TrainersSection from "@/components/home/TrainersSection";
import Advertisement from "@/sections/Advertisement";
import ContactInfoForm from "@/components/home/ContactInfoForm";
import TrainerCalloutBanner from "@/components/home/TrainerCalloutBanner";

// ─────────────────────────────────────────────────────────────────────────────
// FITORA HOME PAGE — /
// Assembled Team Sections:
// - Simanto Poddar: MealChartSection, TrainersSection, Advertisement
// - Developer-Moy: ContactInfoForm, TrainerCalloutBanner
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Simanto Poddar Task: Premium Meal Chart Section */}
      <MealChartSection />

      {/* Simanto Poddar Task: Coaches & Trainers Section */}
      <TrainersSection />

     
      {/* Simanto Poddar Task: Fitness Product Advertisement */}
      <Advertisement />

       {/*puskor roy task: Fitness Trainer Callout Banner */}
      <TrainerCalloutBanner />


      {/* Developer-Moy Task: Consultation Contact Form */}
      <ContactInfoForm />

    </main>
  );
}
