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

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl sm:flex-row lg:flex-col">
      {/* BMI Result Card */}
      <div className="min-h-51 w-full rounded-xl border border-[#303136] bg-[#191a1c] p-3 sm:w-1/2 lg:w-full">
        <div className="rounded-lg bg-gradient-to-br from-[#ed173b] to-[#c9082d] px-3 py-4 text-center text-white shadow-md">
          <p className="text-sm font-semibold">
            BMI:
          </p>

          <p className="mt-1 text-2xl font-bold leading-none">
            {bmi}
          </p>

          <p className="mt-1 text-sm font-semibold">
            ({bmiStatus})
          </p>
        </div>

        <div className="my-2 h-0.5 rounded-full bg-yellow-400" />

        <div className="space-y-2 text-[8px] leading-tight text-gray-400">
          <div className="flex items-start gap-1.5">
            <span className="mt-0.5 shrink-0 text-red-400">
              ●
            </span>

            <span>
              BMI: {bmi} kg/m²
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <span className="mt-0.5 shrink-0 text-yellow-400">
              ●
            </span>

            <span>
              BMI is one measurement and should be
              interpreted with age and other factors.
            </span>
          </div>
        </div>
      </div>

      {/* Slider Card */}
      <div className="min-h-51 w-full rounded-xl border border-[#303136] bg-[#191a1c] p-3 sm:w-1/2 lg:w-full">
        <div className="mb-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] text-white">
              Weight
            </span>

            <span className="text-[8px] text-gray-500">
              {weight} kg
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="300"
            value={weight}
            onChange={(event) =>
              setWeight(Number(event.target.value))
            }
            className="h-0.75 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-emerald-400"
          />
        </div>

        <div className="mb-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] text-white">
              Height
            </span>

            <span className="text-[8px] text-gray-500">
              {height} cm
            </span>
          </div>

          <input
            type="range"
            min="50"
            max="250"
            value={height}
            onChange={(event) =>
              setHeight(Number(event.target.value))
            }
            className="h-0.75 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-red-400"
          />
        </div>

        <div className="mb-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] text-white">
              BMI
            </span>

            <span className="text-[8px] text-gray-500">
              {bmi}
            </span>
          </div>

          <div className="h-0.75 w-full rounded-full bg-gray-700">
            <div
              className="h-0.75 rounded-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${bmiProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] text-white">
              Status
            </span>

            <span className="text-[8px] text-gray-500">
              {bmiStatus}
            </span>
          </div>

          <div className="h-0.75 w-full rounded-full bg-gray-700">
            <div
              className="h-0.75 rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${bmiProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;