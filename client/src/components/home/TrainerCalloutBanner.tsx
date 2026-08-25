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
  title = "Need a Personal Trainer?",
  phoneLabel = "Call:",
  phoneNumber = "+880 1700-000000",
  phoneLink = "tel:+8801700000000",
  buttonText = "BOOK A SESSION",
  buttonHref = "/dashboard/user/workout",
  backgroundImage = "/trainer-banner-bg.jpg",
  className = "",
}: TrainerCalloutBannerProps) {
  return (
    <section
      aria-label="Fitness Trainer Callout"
      className={`relative w-full overflow-hidden bg-black text-white min-h-[260px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] flex items-center ${className}`}
    >
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[75%] md:w-[65%] lg:w-[58%] xl:w-[52%] h-full flex justify-end pointer-events-none z-0">
        <img
          src={backgroundImage}
          alt="Fitness Trainer with battle ropes"
          className="h-full w-full object-cover sm:object-contain object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 sm:via-black/20 to-transparent" />
      </div>

      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl flex flex-col items-start text-left space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {title}
          </h2>

          <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-black tracking-tight">
            <span className="text-white/40 uppercase font-black">
              {phoneLabel}
            </span>
            <a
              href={phoneLink}
              className="text-white hover:text-gray-300 transition-colors inline-flex items-center gap-2 group"
            >
              <span>{phoneNumber}</span>
              <Phone className="w-5 h-5 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </a>
          </div>

          <div className="pt-2">
            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-gray-100 transition shadow-xl cursor-pointer"
            >
              {buttonText}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 z-10" />
    </section>
  );
}

export { TrainerCalloutBanner };
