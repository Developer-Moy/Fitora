"use client";

import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CoachesBanner from "@/components/home/CoachesBanner";
import MeetTrainers from "@/components/home/MeetTrainers";
import PricingSection from "@/components/home/PricingSection";
import TrainerCalloutBanner from "@/components/home/TrainerCalloutBanner";
import ContactInfoForm from "@/components/home/ContactInfoForm";

// ─────────────────────────────────────────────────────────────────────────────
// FITORA HOME PAGE — / (main)/page.tsx
// Sections included:
// 1. HeroSection (Hero Banner + Stats Counter Strip)
// 2. WhyChooseUs (Why Choose Fitora? — White BG)
// 3. CoachesBanner (Coaches / Are you looking for a Mentor? — Black BG, Text White)
// 4. MeetTrainers (Meet Our Trainers 6-Photo Grid — White BG, Text Black)
// 5. PricingSection (JOIN TODAY — Membership Pricing Plans)
// 6. TrainerCalloutBanner (Need a Fitness Trainer? Callout Banner)
// 7. ContactInfoForm (We are here for help you! To Shape Your Body.)
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Section 1: Hero Banner & Stats Counter Strip */}
      <HeroSection />

      {/* Section 2: Why Choose Fitora (White BG) */}
      <WhyChooseUs />

      {/* Section 3: Coaches Mentor Banner (Black BG, Text White) */}
      <CoachesBanner />

      {/* Section 4: Meet Our Trainers 6-Photo Grid (White BG, Text Black) */}
      <MeetTrainers />

      {/* Section 5: Membership Pricing Plans */}
      <PricingSection />

      {/* Section 6: Need a Fitness Trainer Callout Banner */}
      <TrainerCalloutBanner />

      {/* Section 7: Contact & Consult Form */}
      <ContactInfoForm />

    </main>
  );
}
