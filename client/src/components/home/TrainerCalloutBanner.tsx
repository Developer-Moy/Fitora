"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

interface TrainerCalloutBannerProps {
  title?: string;
  phoneLabel?: string;
  phoneNumber?: string;
  phoneLink?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundImage?: string;
  className?: string;
}

export default function TrainerCalloutBanner({
  title = "Need a Fitness Trainer?",
  phoneLabel = "Call:",
  phoneNumber = "+91-999999-9999",
  phoneLink = "tel:+919999999999",
  buttonText = "PURCHASE NOW",
  buttonHref = "/plans",
  backgroundImage = "/trainer-banner-bg.jpg",
  className = "",
}: TrainerCalloutBannerProps) {
  return (
    <section
      aria-label="Fitness Trainer Callout"
      className={`relative w-full overflow-hidden bg-black text-white min-h-[260px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] flex items-center ${className}`}
    >
      {/* Right-aligned Full Image Container with object-contain on wide screens to preserve 100% of the athlete */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[75%] md:w-[65%] lg:w-[58%] xl:w-[52%] h-full flex justify-end pointer-events-none z-0">
        <img
          src={backgroundImage}
          alt="Fitness Trainer with battle ropes"
          className="h-full w-full object-cover sm:object-contain object-right"
        />
        {/* Smooth gradient blend into pure black on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 sm:via-black/10 to-transparent" />
      </div>

      {/* Atmospheric Ambient Glow */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 md:py-16 lg:px-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl flex flex-col items-start text-left"
        >
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
            {title}
          </h2>

          {/* Contact / Phone Line */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2.5 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-[#ff0036] font-extrabold drop-shadow-[0_0_12px_rgba(255,0,54,0.4)]">
              {phoneLabel}
            </span>
            <a
              href={phoneLink}
              className="text-white hover:text-red-200 transition-colors duration-200 inline-flex items-center gap-2 group"
            >
              <span>{phoneNumber}</span>
              <Phone className="w-5 h-5 text-[#ff0036] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </a>
          </div>

          {/* CTA Button Box */}
          <div className="mt-6 sm:mt-8 relative group">
            {/* Subtle red accent outline offset layer */}
            <div className="absolute -inset-1 rounded-sm bg-gradient-to-r from-red-600 to-rose-600 opacity-30 blur-sm group-hover:opacity-70 group-hover:blur-md transition-all duration-300" />
            
            <Link
              href={buttonHref}
              className="relative inline-flex items-center justify-center px-7 py-3 sm:px-9 sm:py-3.5 bg-[#ff0036] hover:bg-[#e00030] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,0,54,0.45)] hover:shadow-[0_6px_30px_rgba(255,0,54,0.65)]"
            >
              {buttonText}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom subtle border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
    </section>
  );
}

export { TrainerCalloutBanner };
