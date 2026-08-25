"use client";

import React from "react";
import Link from "next/link";
import { PhoneCall, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TrainerCalloutBanner() {
  return (
    <div className="w-full bg-white">
      <section className="relative w-full bg-black text-white rounded-t-[3rem] rounded-b-[3rem] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden select-none border-t border-b border-white/10 shadow-2xl">
        {/* Background Image Overlay with Dim Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/trainer-banner-bg-wide.jpg"
            alt="Gym Trainer Banner Background"
            className="w-full h-full object-cover filter brightness-[0.25] contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Ambient Glow Orbs */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none z-1" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none z-1" />

        {/* Main Content Grid */}
        <div className="relative z-10 w-full mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4 text-left"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Need a Fitness Trainer?
            </h2>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-lg">
                <PhoneCall className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                +880 1700-000000
              </span>
            </div>
          </motion.div>

          {/* Right Signature Pill CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 lg:flex lg:justify-end"
          >
            <Link
              href="#contact"
              className="group inline-flex items-center gap-3 bg-white text-black font-extrabold text-sm sm:text-base px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              <span>PURCHASE NOW</span>
              <span className="bg-black text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </Link>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
