"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CoachesBanner() {
  return (
    <section
      id="coaches"
      className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: 2 Rounded Coach Photos from Public Folder */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-xl group">
            <img
              src="/coache1.jpg.jpeg"
              alt="Fitness Coach Mentor 1"
              className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-xl group">
            <img
              src="/choach2.jpg.jpeg"
              alt="Fitness Coach Mentor 2"
              className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Side: Mentor Text & Signature White Pill Button */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs sm:text-sm font-extrabold text-gray-400 tracking-widest uppercase">
            Are you looking for a Mentor?
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            Coaches
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Get personalized guidance from certified master fitness coaches
            across Bangladesh. Our mentors craft custom training & recovery
            regimes tailored specifically to your body goals.
          </p>

          <div className="pt-2">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2.5 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              <span>Explore More</span>
              <span className="bg-black text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
