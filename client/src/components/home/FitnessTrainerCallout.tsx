"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";

export default function FitnessTrainerCallout() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-6 sm:px-10 lg:px-16 bg-black text-white select-none overflow-hidden border-b border-white/10">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-50 contrast-125 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side: Callout Text */}
        <div className="space-y-3 text-center md:text-left">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Need a Fitness Trainer?
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-base sm:text-xl font-extrabold text-gray-300">
            <PhoneCall className="w-5 h-5 text-white" />
            <span>Call: +91-999999-9999</span>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div>
          <Link
            href="/plans"
            className="inline-block px-8 py-4 rounded-xl bg-white text-black font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-2xl active:scale-95 cursor-pointer"
          >
            PURCHASE NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
