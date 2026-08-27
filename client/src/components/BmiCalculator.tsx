"use client";

import { useState } from "react";

const BmiCalculator = () => {
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(170);

  const heightInMeters = height / 100;

  const bmi = Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(1)
  );

  const getBmiStatus = () => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const bmiStatus = getBmiStatus();

  const bmiProgress = Math.min((bmi / 40) * 100, 100);

  // Slider progress
  const weightProgress = ((weight - 20) / (300 - 20)) * 100;
  const heightProgress = ((height - 50) / (250 - 50)) * 100;

  // BMI status background
  const bmiStatusBg =
    bmiStatus === "Underweight"
      ? "bg-gray-200"
      : bmiStatus === "Healthy"
        ? "bg-white"
        : bmiStatus === "Overweight"
          ? "bg-gray-300"
          : "bg-gray-400";

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col">

      <div className="min-h-48 w-full rounded-xl border border-white/10 bg-[#111111] p-3 sm:w-1/2 lg:w-full">
        {/* Result */}
        <div
          className={`rounded-lg border border-white/10 px-3 py-5 text-center text-black transition-colors duration-300 ${bmiStatusBg}`}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            Your BMI
          </p>

          <p className="mt-2 text-3xl font-black leading-none tracking-[-0.05em]">
            {bmi}
          </p>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
            {bmiStatus}
          </p>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-white/10" />

        {/* Information */}
        <div className="space-y-2 text-[12px] leading-tight text-gray-500">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-white">●</span>

            <span>
              BMI: <span className="text-gray-300">{bmi} kg/m²</span>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-gray-600">●</span>

            <span>
              BMI is one measurement and should be interpreted with age and
              other factors.
            </span>
          </div>
        </div>
      </div>

    
      <div className="min-h-[204px] w-full rounded-xl border border-white/10 bg-[#111111] p-4 sm:w-1/2 lg:w-full">
        {/* Weight */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              Weight
            </span>

            <span className="text-[8px] font-bold text-gray-500">
              {weight} kg
            </span>
          </div>

          {/* Custom Weight Slider */}
          <div className="relative h-4 w-full">
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/10" />

            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white transition-all duration-150"
              style={{
                width: `${weightProgress}%`,
              }}
            />

            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-150"
              style={{
                left: `${weightProgress}%`,
              }}
            />

            <input
              type="range"
              min="20"
              max="300"
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Height */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              Height
            </span>

            <span className="text-[8px] font-bold text-gray-500">
              {height} cm
            </span>
          </div>

          {/* Custom Height Slider */}
          <div className="relative h-4 w-full">
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/10" />

            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white transition-all duration-150"
              style={{
                width: `${heightProgress}%`,
              }}
            />

            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-150"
              style={{
                left: `${heightProgress}%`,
              }}
            />

            <input
              type="range"
              min="50"
              max="250"
              value={height}
              onChange={(event) => setHeight(Number(event.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* BMI Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              BMI
            </span>

            <span className="text-[8px] font-bold text-gray-500">
              {bmi}
            </span>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{
                width: `${bmiProgress}%`,
              }}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              Status
            </span>

            <span className="text-[8px] font-bold text-gray-500">
              {bmiStatus}
            </span>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gray-400 transition-all duration-300"
              style={{
                width: `${bmiProgress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;