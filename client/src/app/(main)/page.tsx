"use client";

import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CoachesBanner from "@/components/home/CoachesBanner";
import MeetTrainers from "@/components/home/MeetTrainers";
import PricingSection from "@/components/home/PricingSection";
import TrainerCalloutBanner from "@/components/home/TrainerCalloutBanner";
import ContactInfoForm from "@/components/home/ContactInfoForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <WhyChooseUs />
      <CoachesBanner />
      <MeetTrainers />
      <PricingSection />
      <TrainerCalloutBanner />
      <ContactInfoForm />
    </main>
  );
}
