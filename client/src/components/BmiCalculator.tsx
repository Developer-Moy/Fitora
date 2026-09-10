"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookmarkCheck } from "lucide-react";
import { saveBmiHistory } from "@/services/bmiService";

interface BmiCalculatorProps {
  onBmiChange?: (bmi: number) => void;
}

const BmiCalculator = ({ onBmiChange }: BmiCalculatorProps) => {
  const [weight, setWeight] = useState(65); // stored in kg
  const [height, setHeight] = useState(170); // stored in cm
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [isSaving, setIsSaving] = useState(false);

  const heightInMeters = height / 100;

  const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

  useEffect(() => {
    onBmiChange?.(bmi);
  }, [bmi, onBmiChange]);

  const handleSaveBmi = async () => {
    setIsSaving(true);
    const success = await saveBmiHistory({
      heightCm: Math.round(height),
      weightKg: Number(weight.toFixed(1)),
      bmiScore: bmi,
      statusCategory: bmiStatus,
    });
    setIsSaving(false);
    if (success) {
      toast.success("BMI score saved to your profile history!");
    } else {
      toast.error("Please login to save your BMI record.");
    }
  };

  const getBmiStatus = () => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const bmiStatus = getBmiStatus();

  const bmiProgress = Math.min((bmi / 40) * 100, 100);

  // Height feet & inches calculation
  const totalInches = Math.max(20, Math.round(height / 2.54));
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  // Weight lbs calculation
  const displayWeightLbs = Math.round(weight * 2.20462);

  // Slider progress percentages
  const weightProgress =
    weightUnit === "kg"
      ? Math.min(100, Math.max(0, ((weight - 20) / (300 - 20)) * 100))
      : Math.min(
          100,
          Math.max(0, ((displayWeightLbs - 44) / (660 - 44)) * 100),
        );

  const heightProgress =
    heightUnit === "cm"
      ? Math.min(100, Math.max(0, ((height - 50) / (250 - 50)) * 100))
      : Math.min(100, Math.max(0, ((totalInches - 20) / (98 - 20)) * 100));

  // 100% FITORA Signature Dynamic Monochrome Status Theme (Restored)
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
          cardBg:
            "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.25)] border-white",
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
    <div className="flex w-full flex-col gap-4 select-none">
      {/* Dynamic Status Output Card (Restored previous background style) */}
      <div
        className={`rounded-2xl border px-4 py-3.5 sm:py-4 text-center transition-all duration-500 ${statusTheme.cardBg}`}
      >
        <p
          className={`text-[9px] font-black uppercase tracking-[0.2em] ${statusTheme.subTextColor}`}
        >
          Your BMI
        </p>

        <p className="mt-1 text-3xl sm:text-4xl font-black leading-none tracking-tight font-sans">
          {bmi}
        </p>

        <p
          className={`mt-1.5 text-xs font-black uppercase tracking-widest ${statusTheme.subTextColor}`}
        >
          {bmiStatus}
        </p>
      </div>

      {/* Information Row */}
      <div className="space-y-1.5 text-[12px] leading-tight text-gray-400 font-medium px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`mt-0.5 shrink-0 ${statusTheme.dotColor}`}>●</span>
            <span>
              BMI Score:{" "}
              <strong className="text-white font-bold">{bmi} kg/m²</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mt-0.5 shrink-0 text-gray-500">●</span>
            <span className="text-[11px] text-gray-400">
              Category:{" "}
              <strong className={`font-extrabold ${statusTheme.textColor}`}>
                {bmiStatus}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sliders Container */}
      <div className="space-y-4 pt-1">
        {/* Weight Slider & Unit Switch */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
                Weight
              </span>
              {/* KG / LBS Toggle Switch */}
              <div className="flex items-center gap-0.5 bg-black border border-white/20 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    weightUnit === "kg"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("lbs")}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    weightUnit === "lbs"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>

            <span className="text-xs font-bold text-gray-300 font-mono">
              {weightUnit === "kg"
                ? `${Math.round(weight)} kg`
                : `${displayWeightLbs} lbs`}
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
            {weightUnit === "kg" ? (
              <input
                type="range"
                min="20"
                max="300"
                step="1"
                value={Math.round(weight)}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            ) : (
              <input
                type="range"
                min="44"
                max="660"
                step="1"
                value={displayWeightLbs}
                onChange={(event) =>
                  setWeight(
                    Number((Number(event.target.value) / 2.20462).toFixed(1)),
                  )
                }
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            )}
          </div>
        </div>

        {/* Height Slider & Unit Switch */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
                Height
              </span>
              {/* CM / FT.IN Toggle Switch */}
              <div className="flex items-center gap-0.5 bg-black border border-white/20 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setHeightUnit("cm")}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    heightUnit === "cm"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit("ft")}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    heightUnit === "ft"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  FT.IN
                </button>
              </div>
            </div>

            <span className="text-xs font-bold text-gray-300 font-mono">
              {heightUnit === "cm"
                ? `${Math.round(height)} cm`
                : `${feet}′ ${inches}″ (${Math.round(height)} cm)`}
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
            {heightUnit === "cm" ? (
              <input
                type="range"
                min="50"
                max="250"
                step="1"
                value={Math.round(height)}
                onChange={(event) => setHeight(Number(event.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            ) : (
              <input
                type="range"
                min="20"
                max="98"
                step="1"
                value={totalInches}
                onChange={(event) =>
                  setHeight(Math.round(Number(event.target.value) * 2.54))
                }
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            )}
          </div>
        </div>

        {/* Dynamic Monochrome BMI Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              BMI Scale Progress
            </span>
            <span className="text-xs font-bold text-gray-300 font-mono">
              {bmi} ·{" "}
              <span className="text-white font-black uppercase font-sans">
                {bmiStatus}
              </span>
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusTheme.barBg}`}
              style={{ width: `${bmiProgress}%` }}
            />
          </div>
        </div>

        {/* Save BMI to Profile Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveBmi}
            disabled={isSaving}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all cursor-pointer shadow-xl active:scale-[0.98] disabled:opacity-60 uppercase tracking-wide"
          >
            <BookmarkCheck className="w-4 h-4 text-black" />
            <span>{isSaving ? "Saving..." : "Save BMI to Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;
