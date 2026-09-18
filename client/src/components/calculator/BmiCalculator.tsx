"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { saveBmiHistory } from "@/services/bmiService";
import FitoraPillButton from "../ui/FitoraPillButton";

interface BmiCalculatorProps {
  onBmiChange?: (bmi: number) => void;
}

const BmiCalculator = ({ onBmiChange }: BmiCalculatorProps) => {
  const [weight, setWeight] = useState(65); // stored in kg
  const [height, setHeight] = useState(170); // stored in cm
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [isSaving, setIsSaving] = useState(false);

  // Health calculation inputs
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<"male" | "female">("male");

  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "active" | "veryActive"
  >("moderate");

  const heightInMeters = height / 100;

  const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

  useEffect(() => {
    onBmiChange?.(bmi);
  }, [bmi, onBmiChange]);

  const handleSaveBmi = async () => {
    setIsSaving(true);

    try {
      // 1. Save BMI history
      const success = await saveBmiHistory({
        heightCm: Math.round(height),
        weightKg: Number(weight.toFixed(1)),
        bmiScore: bmi,
        statusCategory: bmiStatus,
        age,
        gender,
        bmr: Math.round(bmr),
        tdee,
        activityLevel,
      });

      if (!success) {
        toast.error("Please login to save your BMI record.");
        return;
      }

      // 2. Sync health metrics to User profile
      const token =
        localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token");

      if (!token) {
        toast.error("Please login to sync your health metrics.");
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/users/profile/health-metrics`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age,
          gender,
          height: Math.round(height),
          weight: Number(weight.toFixed(1)),
          bmr: Math.round(bmr),
          tdee,
          activityLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to sync health metrics");
      }

      toast.success("BMI and health metrics saved successfully!");
    } catch (error) {
      console.error("Health metrics sync error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save health metrics.",
      );
    } finally {
      setIsSaving(false);
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

  // BMI Gauge Needle Angle
  const bmiNeedleAngle = Math.max(-90, Math.min(90, (bmi / 40) * 180 - 90));

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // Activity multipliers for TDEE
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

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

  // FITORA Signature Dynamic Monochrome Status Theme
  const getStatusTheme = () => {
    switch (bmiStatus) {
      case "Underweight":
        return {
          cardBg: "bg-neutral-200 text-black shadow-md border-gray-300",
          barBg: "bg-neutral-300",
          textColor: "text-gray-300",
          subTextColor: "text-black/80",
          dotColor: "text-gray-400",

          // Speedometer colors
          gaugeColor: "rgba(0,0,0,0.45)",
          needleColor: "bg-black",
          centerColor: "bg-black",
        };

      case "Healthy":
        return {
          cardBg:
            "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.25)] border-white",
          barBg: "bg-white",
          textColor: "text-white",
          subTextColor: "text-black/90",
          dotColor: "text-white",

          // Speedometer colors
          gaugeColor: "rgba(0,0,0,0.35)",
          needleColor: "bg-black",
          centerColor: "bg-black",
        };

      case "Overweight":
        return {
          cardBg: "bg-neutral-800 text-white shadow-md border-white/20",
          barBg: "bg-neutral-400",
          textColor: "text-gray-300",
          subTextColor: "text-gray-300",
          dotColor: "text-gray-400",

          // Speedometer colors
          gaugeColor: "rgba(255,255,255,0.25)",
          needleColor: "bg-white",
          centerColor: "bg-white",
        };

      case "Obesity":
      default:
        return {
          cardBg: "bg-black text-white shadow-xl border-2 border-white/80",
          barBg: "bg-white",
          textColor: "text-white",
          subTextColor: "text-gray-300",
          dotColor: "text-white",

          // Speedometer colors
          gaugeColor: "rgba(255,255,255,0.35)",
          needleColor: "bg-white",
          centerColor: "bg-white",
        };
    }
  };

  const statusTheme = getStatusTheme();

  return (
    <div className="flex w-full flex-col gap-4 select-none">
      {/* BMI Result + Speedometer Card */}
      <div
        className={`rounded-2xl border px-4 py-4 transition-all duration-500 ${statusTheme.cardBg}`}
      >
        <div className="grid grid-cols-2 items-center gap-3">
          {/* Left - BMI Result */}
          <div className="text-center">
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

          {/* Right - Precision Engineered Speedometer Gauge */}
          <div className="relative mx-auto w-full max-w-42.5 flex flex-col items-center">
            <svg
              viewBox="0 0 170 98"
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <filter
                  id="bmiGaugeGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Guide Arc — Perfect Semicircle (R=65) */}
              <path
                d="M 20 85 A 65 65 0 0 1 150 85"
                fill="none"
                stroke="currentColor"
                strokeOpacity={
                  bmiStatus === "Healthy" || bmiStatus === "Underweight"
                    ? "0.12"
                    : "0.2"
                }
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* 4 Precision Colored Segments on the EXACT Same Circle */}
              {/* Seg 1: Underweight (< 18.5) */}
              <path
                d="M 20 85 A 65 65 0 0 1 150 85"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={bmiStatus === "Underweight" ? "8.5" : "5.5"}
                strokeOpacity={bmiStatus === "Underweight" ? "1" : "0.35"}
                strokeDasharray="92.44 204.20"
                strokeDashoffset="0"
                strokeLinecap="round"
                filter={
                  bmiStatus === "Underweight" ? "url(#bmiGaugeGlow)" : undefined
                }
                className="transition-all duration-300"
              />

              {/* Seg 2: Healthy (18.5 - 24.9) */}
              <path
                d="M 20 85 A 65 65 0 0 1 150 85"
                fill="none"
                stroke="#10b981"
                strokeWidth={bmiStatus === "Healthy" ? "8.5" : "5.5"}
                strokeOpacity={bmiStatus === "Healthy" ? "1" : "0.35"}
                strokeDasharray="29.18 204.20"
                strokeDashoffset="-96.44"
                strokeLinecap="round"
                filter={
                  bmiStatus === "Healthy" ? "url(#bmiGaugeGlow)" : undefined
                }
                className="transition-all duration-300"
              />

              {/* Seg 3: Overweight (25.0 - 29.9) */}
              <path
                d="M 20 85 A 65 65 0 0 1 150 85"
                fill="none"
                stroke="#f59e0b"
                strokeWidth={bmiStatus === "Overweight" ? "8.5" : "5.5"}
                strokeOpacity={bmiStatus === "Overweight" ? "1" : "0.35"}
                strokeDasharray="21.53 204.20"
                strokeDashoffset="-129.63"
                strokeLinecap="round"
                filter={
                  bmiStatus === "Overweight" ? "url(#bmiGaugeGlow)" : undefined
                }
                className="transition-all duration-300"
              />

              {/* Seg 4: Obesity (>= 30.0) */}
              <path
                d="M 20 85 A 65 65 0 0 1 150 85"
                fill="none"
                stroke="#ef4444"
                strokeWidth={bmiStatus === "Obesity" ? "8.5" : "5.5"}
                strokeOpacity={bmiStatus === "Obesity" ? "1" : "0.35"}
                strokeDasharray="47.05 204.20"
                strokeDashoffset="-155.15"
                strokeLinecap="round"
                filter={
                  bmiStatus === "Obesity" ? "url(#bmiGaugeGlow)" : undefined
                }
                className="transition-all duration-300"
              />

              {/* Major Threshold Value Markers */}
              <text
                x="76.5"
                y="10"
                textAnchor="middle"
                fontSize="6.5"
                fontWeight="900"
                fill="currentColor"
                opacity="0.75"
              >
                18.5
              </text>
              <text
                x="114.5"
                y="15"
                textAnchor="middle"
                fontSize="6.5"
                fontWeight="900"
                fill="currentColor"
                opacity="0.75"
              >
                25
              </text>
              <text
                x="139"
                y="31"
                textAnchor="middle"
                fontSize="6.5"
                fontWeight="900"
                fill="currentColor"
                opacity="0.75"
              >
                30
              </text>

              {/* Min & Max Labels */}
              <text
                x="12"
                y="93"
                textAnchor="middle"
                fontSize="6"
                fontWeight="800"
                fill="currentColor"
                opacity="0.5"
              >
                15
              </text>
              <text
                x="158"
                y="93"
                textAnchor="middle"
                fontSize="6"
                fontWeight="800"
                fill="currentColor"
                opacity="0.5"
              >
                40
              </text>

              {/* Animated Precision Tapered Needle */}
              <motion.g
                style={{ transformOrigin: "85px 85px" }}
                animate={{ rotate: bmiNeedleAngle }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 13,
                  mass: 0.8,
                }}
              >
                {/* Needle Blade */}
                <polygon
                  points="83.6,85 86.4,85 85.5,28 84.5,28"
                  fill={
                    bmiStatus === "Healthy" || bmiStatus === "Underweight"
                      ? "#000000"
                      : "#ffffff"
                  }
                />
                {/* Needle Tip Jewel */}
                <circle
                  cx="85"
                  cy="28"
                  r="2.2"
                  fill={
                    bmiStatus === "Underweight"
                      ? "#0ea5e9"
                      : bmiStatus === "Healthy"
                        ? "#10b981"
                        : bmiStatus === "Overweight"
                          ? "#f59e0b"
                          : "#ef4444"
                  }
                />
                {/* Pivot Hub Outer Ring */}
                <circle
                  cx="85"
                  cy="85"
                  r="6.5"
                  fill={
                    bmiStatus === "Healthy" || bmiStatus === "Underweight"
                      ? "#000000"
                      : "#ffffff"
                  }
                  stroke={
                    bmiStatus === "Healthy" || bmiStatus === "Underweight"
                      ? "#e5e5e5"
                      : "#262626"
                  }
                  strokeWidth="1.5"
                />
                {/* Pivot Hub Inner Jewel */}
                <circle
                  cx="85"
                  cy="85"
                  r="2.5"
                  fill={
                    bmiStatus === "Underweight"
                      ? "#0ea5e9"
                      : bmiStatus === "Healthy"
                        ? "#10b981"
                        : bmiStatus === "Overweight"
                          ? "#f59e0b"
                          : "#ef4444"
                  }
                />
              </motion.g>
            </svg>
          </div>
        </div>
      </div>

      {/* Health Calculation Controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Age */}
        <div>
          <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-wider text-white">
            {" "}
            Age{" "}
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= 1 && value <= 120) {
                setAge(value);
              }
            }}
            className="w-full rounded-xl border border-white/20 bg-black px-3 py-2.5 text-sm font-bold text-white outline-none transition focus:border-white"
          />
        </div>
        {/* Gender */}
        <div>
          <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-wider text-white">
            {" "}
            Gender{" "}
          </label>
          <select
            value={gender}
            onChange={(event) =>
              setGender(event.target.value as "male" | "female")
            }
            className="w-full rounded-xl border border-white/20 bg-black px-3 py-2.5 text-sm font-bold text-white outline-none transition focus:border-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        {/* Activity Level */}{" "}
        <div>
          <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-wider text-white">
            {" "}
            Activity Level{" "}
          </label>
          <select
            value={activityLevel}
            onChange={(event) =>
              setActivityLevel(
                event.target.value as
                  | "sedentary"
                  | "light"
                  | "moderate"
                  | "active"
                  | "veryActive",
              )
            }
            className="w-full rounded-xl border border-white/20 bg-black px-3 py-2.5 text-sm font-bold text-white outline-none transition focus:border-white"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
            <option value="veryActive">Extra Active</option>
          </select>
        </div>
      </div>

      {/* BMR + TDEE Information */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
            {" "}
            BMR{" "}
          </p>
          <p className="mt-1 text-lg font-black text-white">
            {" "}
            {Math.round(bmr)}
            <span className="ml-1 text-[10px] font-bold text-gray-500">
              {" "}
              kcal/day{" "}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
            {" "}
            TDEE{" "}
          </p>
          <p className="mt-1 text-lg font-black text-white">
            {" "}
            {tdee}
            <span className="ml-1 text-[10px] font-bold text-gray-500">
              {" "}
              kcal/day{" "}
            </span>
          </p>
        </div>
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
          <FitoraPillButton
            variant="white"
            size="md"
            onClick={handleSaveBmi}
            loading={isSaving}
            disabled={isSaving}
            className="w-full"
          >
            Save BMI to Profile
          </FitoraPillButton>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;
