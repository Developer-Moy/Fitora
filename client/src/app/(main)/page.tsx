"use client";

import Home from "../page";

<<<<<<< Updated upstream
export default function MainPage() {
  return <Home />;
=======
// ─────────────────────────────────────────────────────────────────────────────
// FITORA HOME PAGE — / (main)/page.tsx
// Sections included:
// 1. HeroSection (Hero Banner + Stats Counter Strip)
// 2. WhyChooseUs (Why Choose Fitora?)
// 3. PricingSection (JOIN TODAY — Membership Pricing Plans)
// 4. TrainerCalloutBanner (Need a Fitness Trainer? Callout Banner)
// 5. ContactInfoForm (We are here for help you! To Shape Your Body.)
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Section 1: Hero Banner & Stats Counter Strip */}
      <HeroSection />

      {/* Section 2: Why Choose Fitora */}
      <WhyChooseUs />

      {/* Section 3: Membership Pricing Plans */}
      <PricingSection />


      {/* Section 4: Need a Fitness Trainer Callout Banner */}
      <TrainerCalloutBanner />

      {/* Section 5: Contact & Consult Form */}
      <ContactInfoForm />
    </main>
  );
>>>>>>> Stashed changes
}
