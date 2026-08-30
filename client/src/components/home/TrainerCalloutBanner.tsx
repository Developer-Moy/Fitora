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
      className={`relative w-full overflow-hidden bg-black text-white min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex items-center border-y border-white/10 ${className}`}
    >
      {/* Background Image Container */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] h-full flex justify-end pointer-events-none z-0">
        <img
          src={backgroundImage}
          alt="Fitness Trainer"
          className="h-full w-full object-cover sm:object-cover object-right"
        />
        {/* Smooth Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 sm:via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 sm:hidden" />
      </div>

      {/* Subtle Ambient Glow */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl flex flex-col items-start text-left space-y-5"
        >
          <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            {title}
          </h2>

          <div className="flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            <span className="text-white/40 uppercase font-bold">
              {phoneLabel}
            </span>
            <a
              href={phoneLink}
              className="text-white hover:text-gray-300 transition-colors inline-flex items-center gap-2 group"
            >
              <span>{phoneNumber}</span>
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" />
            </a>
          </div>

          <div className="pt-2">
            <Link
              href={buttonHref}
              className="group inline-flex items-center gap-3 bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <span>{buttonText}</span>
              <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { TrainerCalloutBanner };
