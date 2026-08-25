"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, ArrowUpRight } from "lucide-react";

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
      className={`relative w-full overflow-hidden bg-black text-white min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px] flex items-center ${className}`}
    >
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[position:80%_top] sm:bg-[position:85%_top] md:bg-[position:88%_top] lg:bg-[position:90%_top] transition-transform duration-700"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* Dark Vignette Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/70 to-transparent z-1" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-1" />
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none z-1" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl flex flex-col items-start text-left"
        >
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            {title}
          </h2>

          {/* Contact / Phone Line — White Text */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2.5 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-white font-extrabold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              {phoneLabel}
            </span>
            <a
              href={phoneLink}
              className="text-white hover:text-gray-200 transition-colors duration-200 inline-flex items-center gap-2 group"
            >
              <span>{phoneNumber}</span>
              <Phone className="w-5 h-5 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </a>
          </div>

          {/* CTA Button Box — White Pill Button with ArrowUpRight Badge */}
          <div className="mt-7 sm:mt-9">
            <Link
              href={buttonHref}
              className="group inline-flex items-center gap-2.5 bg-white text-black font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              <span>{buttonText}</span>
              <span className="bg-black text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
    </section>
  );
}

export { TrainerCalloutBanner };
