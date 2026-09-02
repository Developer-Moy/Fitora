"use client";

import { useEffect, useState } from "react";

interface BmiCalculatorProps {
  onBmiChange?: (bmi: number) => void;
}

const BmiCalculator = ({ onBmiChange }: BmiCalculatorProps) => {
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(170);

  const heightInMeters = height / 100;

  const bmi = Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(1)
  );

  useEffect(() => {
  onBmiChange?.(bmi);
}, [bmi, onBmiChange]);

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

  // 100% FITORA Signature Monochrome Grayscale Status Theme
  const getStatusTheme = () => {
    switch (bmiStatus) {
      case "Underweight":
        return {
          cardBg: "bg-neutral-200 text-black shadow-md border-gray-300",
          barBg: "bg-neutral-300",
          textColor: "text-gray-300",
          subTextColor: "text-black/80",
          dotColor: "text-gray-400",
        };
      case "Healthy":
        return {
          cardBg: "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.25)] border-white",
          barBg: "bg-white",
          textColor: "text-white",
          subTextColor: "text-black/90",
          dotColor: "text-white",
        };
      case "Overweight":
        return {
          cardBg: "bg-neutral-800 text-white shadow-md border-white/20",
          barBg: "bg-neutral-400",
          textColor: "text-gray-300",
          subTextColor: "text-gray-300",
          dotColor: "text-gray-400",
        };
      case "Obesity":
      default:
        return {
          cardBg: "bg-black text-white shadow-xl border-2 border-white/80",
          barBg: "bg-white",
          textColor: "text-white",
          subTextColor: "text-gray-300",
          dotColor: "text-white",
        };
    }
  };

  const statusTheme = getStatusTheme();

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row lg:flex-col select-none">

      {/* Result Box */}
      <div className="min-h-48 w-full rounded-2xl border border-white/10 bg-[#111111] p-4 sm:w-1/2 lg:w-full space-y-3">
        {/* Dynamic Monochrome Status Card */}
        <div
          className={`rounded-xl border px-4 py-5 text-center transition-all duration-500 ${statusTheme.cardBg}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusTheme.subTextColor}`}>
            Your BMI
          </p>

          <p className="mt-1.5 text-4xl font-black leading-none tracking-tight font-sans">
            {bmi}
          </p>

          <p className={`mt-2 text-xs font-black uppercase tracking-widest ${statusTheme.subTextColor}`}>
            {bmiStatus}
          </p>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-white/10" />

        {/* Information */}
        <div className="space-y-2 text-[12px] leading-tight text-gray-400 font-medium">
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 shrink-0 ${statusTheme.dotColor}`}>●</span>
            <span>
              BMI Score: <span className="font-bold text-white">{bmi} kg/m²</span>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-gray-500">●</span>
            <span className="text-[11px] text-gray-400">
              Category: <span className={`font-extrabold ${statusTheme.textColor}`}>{bmiStatus}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sliders Box */}
      <div className="min-h-[204px] w-full rounded-2xl border border-white/10 bg-[#111111] p-5 sm:w-1/2 lg:w-full space-y-5">
        {/* Weight Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              Weight
            </span>
            <span className="text-xs font-bold text-gray-300">
              {weight} kg
            </span>
          </div>

          <div className="relative h-4 w-full">
            <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/10" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white transition-all duration-150"
              style={{ width: `${weightProgress}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-150"
              style={{ left: `${weightProgress}%` }}
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

        {/* Height Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              Height
            </span>
            <span className="text-xs font-bold text-gray-300">
              {height} cm
            </span>
          </div>

          <div className="relative h-4 w-full">
            <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/10" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white transition-all duration-150"
              style={{ width: `${heightProgress}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-150"
              style={{ left: `${heightProgress}%` }}
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

        {/* Dynamic Monochrome BMI Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              BMI Scale Progress
            </span>
            <span className="text-xs font-bold text-gray-300">
              {bmi}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusTheme.barBg}`}
              style={{ width: `${bmiProgress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Status Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              Category Status
            </span>
            <span className={`text-xs font-black uppercase tracking-wider ${statusTheme.textColor}`}>
              {bmiStatus}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusTheme.barBg}`}
              style={{ width: `${bmiProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;