"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function MeetTrainers() {
  const trainers = [
    {
      name: "Marcus Vance",
      role: "Head Strength Coach",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "David Miller",
      role: "Bodybuilding Specialist",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Alex Rivera",
      role: "Powerlifting Coach",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Jason Statham",
      role: "CrossFit & Conditioning",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Mobility & Recovery Specialist",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Michael Sterling",
      role: "Certified Master Trainer",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section
      id="trainers"
      className="w-full py-20 px-6 sm:px-10 lg:px-16 bg-white text-black select-none border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto space-y-20">

        {/* ─── Part 1: Are You Looking for a Mentor? / Coaches Banner ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: 2 Rounded Coach Photos */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Female Fitness Mentor"
                className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=600&q=80"
                alt="Male Fitness Mentor"
                className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Side: Mentor Text & Signature Pill Button */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs sm:text-sm font-extrabold text-gray-500 tracking-widest uppercase">
              Are you looking for a Mentor?
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none">
              Coaches
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Get personalized guidance from certified master fitness coaches across Bangladesh. Our mentors craft custom training & recovery regimes tailored specifically to your body goals.
            </p>

            <div className="pt-2">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2.5 bg-black text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl"
              >
                <span>Explore More</span>
                <span className="bg-white text-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Part 2: Meet Our Trainers Photo Grid (6 Trainers) ─── */}
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              Meet Our Trainers
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Certified experts dedicated to helping you unlock your full athletic potential.
            </p>
          </div>

          {/* 6 Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer, index) => (
              <div
                key={index}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-md"
              >
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Trainer Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">
                    {trainer.name}
                  </h4>
                  <p className="text-xs font-semibold text-gray-300">
                    {trainer.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
