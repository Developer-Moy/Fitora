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
  phoneNumber = "+880 1700-000000",
  phoneLink = "tel:+8801700000000",
  buttonText = "BOOK A SESSION",
  buttonHref = "/exercises",
  backgroundImage = "/trainer-banner-bg.jpg",
  className = "",
}: TrainerCalloutBannerProps) {
  return (
    <section
      aria-label="Fitness Trainer Callout"
      className={`relative w-full overflow-hidden bg-black text-white min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center border-y border-white/10 ${className}`}
    >
      {/* Background Image Container */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] h-full flex justify-end pointer-events-none z-0">
        <img
          src={backgroundImage}
          alt="Fitness Trainer"
          className="h-full w-full object-cover sm:object-cover object-right"
        />
        {/* Smooth Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 sm:via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/80 sm:hidden" />
      </div>

      {/* Subtle Ambient Glow */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl flex flex-col items-start text-left space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-lg leading-relaxed">
              Accelerate your transformation with dedicated personal trainers.
              Get custom hypertrophy routines, strict form correction, and
              tailored nutrition plans across all 64 branches.
            </p>
          </div>

          {/* Trainer Key Metrics Strip */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-white">
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block leading-none">
                105+
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Expert Coaches
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block leading-none">
                98.6%
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Success Rate
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block leading-none">
                4.9 / 5.0
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Athlete Rating
              </span>
            </div>
          </div>

          {/* Action Row: Book Session Button + Call Number */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <Link
              href={buttonHref}
              className="group inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>{buttonText}</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>

            <div className="flex items-center gap-2 text-base sm:text-lg font-black tracking-tight">
              <span className="text-white/40 uppercase font-bold text-xs sm:text-sm">
                {phoneLabel}
              </span>
              <a
                href={phoneLink}
                className="text-white hover:text-gray-300 transition-colors inline-flex items-center gap-2 group"
              >
                <span>{phoneNumber}</span>
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { TrainerCalloutBanner };
