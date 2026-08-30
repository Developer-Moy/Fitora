"use client";

import React from "react";

export default function MeetTrainers() {
  const trainers = [
    {
      name: "Elena Rostova", // Female (Row 1, Col 1)
      role: "Strength & Conditioning Specialist",
      image: "/image3.jpg.jpeg",
    },
    {
      name: "David Miller", // Male (Row 1, Col 2)
      role: "Olympic Lifting Specialist",
      image: "/image2.jpg.jpeg",
    },
    {
      name: "Sophia Thorne", // Female (Row 1, Col 3)
      role: "Bodybuilding & Nutrition Coach",
      image: "/image1.jpg.jpeg",
    },
    {
      name: "Jason Statham", // Male (Row 2, Col 1)
      role: "Deadlift & Powerlifting Coach",
      image: "/image4.jpg.jpeg",
    },
    {
      name: "Maya Lin", // Female (Row 2, Col 2)
      role: "Mobility & Flexibility Specialist",
      image: "/image6.jpg.jpeg",
    },
    {
      name: "Chloe Bennet", // Female (Row 2, Col 3)
      role: "Certified Master Trainer",
      image: "/image7.jpg.jpeg",
    },
  ];

  return (
    <section
      id="trainers"
      className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2
            className="text-white tracking-tight select-none"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
              lineHeight: 1.1,
            }}
          >
            Meet Our Expert Trainers
          </h2>
          <p
            className="text-gray-300 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Certified experts dedicated to helping you unlock your full athletic
            potential.
          </p>
        </div>

        {/* 6 Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-xl"
            >
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

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
    </section>
  );
}
