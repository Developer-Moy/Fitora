"use client";

import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import MealChartSection from "@/components/home/MealChartSection";
import TrainersSection from "@/components/home/TrainersSection";
import Advertisement from "@/sections/Advertisement";
import TrainerCalloutBanner from "@/components/home/TrainerCalloutBanner";
import PricingAndReviews from "@/components/home/PricingAndReviews";
import ContactInfoForm from "@/components/home/ContactInfoForm";

// ─────────────────────────────────────────────────────────────────────────────
// FITORA HOME PAGE — / (main)/page.tsx
// Assembled Team Sections:
// - Alfaaz Ahmed: HeroSection
// - Simanto Paul: WhyChooseUs
// - Puskor Roy: TrainerCalloutBanner
// - Simanto Poddar: MealChartSection, TrainersSection, Advertisement
// - Salauddin: PricingAndReviews
// - Developer-Moy: ContactInfoForm
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Alfaaz Ahmed Task: Hero Section */}
      <HeroSection />

      {/* Simanto Paul Task: Why Choose Us Section */}
      <WhyChooseUs />

      {/* Puskor Roy Task: Fitness Trainer Callout Banner */}
      <TrainerCalloutBanner />

      {/* Simanto Poddar Task: Premium Meal Chart Section */}
      <MealChartSection />

      {/* Simanto Poddar Task: Coaches & Trainers Section */}
      <TrainersSection />

      {/* Salauddin Task: JOIN TODAY Pricing & YOUR OPINIONS Reviews */}
      <PricingAndReviews />

      {/* Simanto Poddar Task: Fitness Product Advertisement */}
      <Advertisement />

      {/* Developer-Moy Task: Consultation Contact Form */}
      <ContactInfoForm />

    </main>
  );
}
