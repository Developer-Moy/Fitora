"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Utensils,
  ArrowUpRight,
  CheckCircle,
  Flame,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import BmiCalculator from "@/components/BmiCalculator";

type Gender = "male" | "female";
type Goal = "bulking" | "cutting" | "maintenance";

const goalOptions: {
  value: Goal;
  label: string;
  calories: string;
  icon: string;
}[] = [
  {
    value: "bulking",
    label: "Bulking",
    calories: "+500 kcal",
    icon: "↑",
  },
  {
    value: "cutting",
    label: "Cutting",
    calories: "-500 kcal",
    icon: "↓",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    calories: "TDEE",
    icon: "↔",
  },
];

export default function CalculatorPage() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [toast, setToast] = useState("");

  const bmr = useMemo(() => {
    const value =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    return Math.max(Math.round(value), 0);
  }, [age, gender, height, weight]);

  const tdee = useMemo(() => {
    return Math.max(Math.round(bmr * activityLevel), 0);
  }, [bmr, activityLevel]);

  const targetCalories = useMemo(() => {
    switch (goal) {
      case "bulking":
        return tdee + 500;

      case "cutting":
        return Math.max(tdee - 500, 0);

      case "maintenance":
      default:
        return tdee;
    }
  }, [tdee, goal]);

  const macroPercentages = useMemo(() => {
    switch (goal) {
      case "bulking":
        return {
          protein: 30,
          carbs: 45,
          fats: 25,
        };

      case "cutting":
        return {
          protein: 35,
          carbs: 35,
          fats: 30,
        };

      case "maintenance":
      default:
        return {
          protein: 30,
          carbs: 40,
          fats: 30,
        };
    }
  }, [goal]);

  const macros = useMemo(() => {
    const proteinCalories = targetCalories * (macroPercentages.protein / 100);
    const carbsCalories = targetCalories * (macroPercentages.carbs / 100);
    const fatsCalories = targetCalories * (macroPercentages.fats / 100);

    return {
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbsCalories / 4),
      fats: Math.round(fatsCalories / 9),
    };
  }, [targetCalories, macroPercentages]);

  const maxMacro = Math.max(macros.protein, macros.carbs, macros.fats, 1);

  const activityDescription = useMemo(() => {
    switch (activityLevel) {
      case 1.2:
        return "Little or no regular exercise";

      case 1.375:
        return "Light exercise 1–3 days per week";

      case 1.55:
        return "Moderate exercise 3–5 days per week";

      case 1.725:
        return "Hard exercise 6–7 days per week";

      case 1.9:
        return "Very intense exercise or physical job";

      default:
        return "Custom activity level";
    }
  }, [activityLevel]);

  const nutritionTip = useMemo(() => {
    switch (goal) {
      case "bulking":
        return {
          title: "Focus On Lean Surplus & Protein Timing",
          description:
            "Aim for a consistent daily surplus of ~500 kcal. Distribute your protein across 4–5 meals to optimize muscle protein synthesis without excessive fat gain.",
        };

      case "cutting":
        return {
          title: "Prioritize High Protein & Fiber Volume",
          description:
            "A high-protein intake protects lean muscle during a caloric deficit. Eat high-volume, low-calorie foods to manage hunger while dropping fat.",
        };

      case "maintenance":
      default:
        return {
          title: "Focus On Energy Balance & Performance",
          description:
            "Maintenance calories allow you to slowly recompose your body—building strength while keeping body fat stable. Focus on workout intensity.",
        };
    }
  }, [goal]);

  const goalLabel = useMemo(() => {
    switch (goal) {
      case "bulking":
        return "Bulking";

      case "cutting":
        return "Cutting";

      default:
        return "Maintenance";
    }
  }, [goal]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleExport = async () => {
    const metrics = `FITORA NUTRITION & BMI REPORT
Goal: ${goalLabel}
Age: ${age} | Gender: ${gender}
Height: ${height} cm | Weight: ${weight} kg
Activity: ${activityDescription}

BMR: ${bmr} kcal/day
TDEE: ${tdee} kcal/day
Target Calories: ${targetCalories} kcal/day

Macros:
- Protein: ${macros.protein}g (${macroPercentages.protein}%)
- Carbs: ${macros.carbs}g (${macroPercentages.carbs}%)
- Fats: ${macros.fats}g (${macroPercentages.fats}%)`;

    try {
      await navigator.clipboard.writeText(metrics);
      setToast("Metrics copied to clipboard!");
    } catch {
      setToast("Failed to copy metrics.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* =====================================================
          SECTION 1: HERO / BMI HEADER & CALCULATOR
      ====================================================== */}
      <section className="bg-black px-4 pt-6 sm:pt-10 pb-12 text-white sm:px-6 lg:pt-8 lg:pb-16 select-none border-b border-white/10">
        <div className="mx-auto w-11/12 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* LEFT — BMI INFORMATION */}
            <div className="flex flex-col justify-between lg:col-span-6 space-y-5">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
                  Understand Your <br />
                  <span className="text-gray-400 font-normal">
                    BMI & Body Composition.
                  </span>
                </h1>

                <p
                  className="max-w-md text-gray-300 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
                  style={{ fontStyle: "italic" }}
                >
                  BMI calculates your body mass relative to height. Use your
                  result alongside TDEE to plan your daily calories and fitness
                  targets.
                </p>
              </div>

              {/* Full Color Image Banner (Positioned in the Middle, Object-Top to avoid cutting head) */}
              <div className="group relative h-[220px] sm:h-[260px] lg:h-[270px] my-auto overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80"
                  alt="BMI fitness banner"
                  className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105 brightness-100 contrast-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute left-5 top-5">
                  <span className="rounded-full border border-white/20 bg-black/75 px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-md">
                    BMI & NUTRITION ENGINE
                  </span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow">
                    Measure. Understand. Transform.
                  </p>

                  <div className="flex items-center gap-1 text-[9px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    <span>WHO Standard Scale</span>
                  </div>
                </div>
              </div>

              {/* BMI Categories & Info Cards (Detailed BMI Text) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-neutral-950 p-3 space-y-0.5 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Underweight
                  </p>
                  <p className="text-xs font-black text-white">
                    &lt; 18.5{" "}
                    <span className="text-[8px] font-normal text-gray-400">
                      kg/m²
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-950 p-3 space-y-0.5 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Normal Weight
                  </p>
                  <p className="text-xs font-black text-white">18.5 — 24.9</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-950 p-3 space-y-0.5 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Overweight
                  </p>
                  <p className="text-xs font-black text-white">25.0 — 29.9</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-950 p-3 space-y-0.5 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Obese Class
                  </p>
                  <p className="text-xs font-black text-white">
                    &ge; 30.0{" "}
                    <span className="text-[8px] font-normal text-gray-400">
                      kg/m²
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — BMI CALCULATOR */}
            <div className="flex flex-col lg:col-span-6">
              <div className="mb-4 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                  01 / INTERACTIVE SLIDERS
                </span>

                <h2 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white">
                  Calculate Your BMI.
                </h2>
              </div>

              <div className="flex-1 rounded-3xl bg-neutral-950 border border-white/15 p-5 sm:p-6 shadow-xl">
                <BmiCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 2: USER INFORMATION & MACRO BREAKDOWN (COMPACT & TIGHT)
      ====================================================== */}
      <section className="bg-black px-4 py-12 sm:px-6 lg:py-16 select-none border-t border-white/10">
        <div className="mx-auto w-11/12 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* =================================================
                LEFT — PERSONAL INFORMATION FORM (40/60 Ratio: 40% Width)
            ================================================= */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-neutral-950 border border-white/15 p-5 sm:p-6 space-y-4 shadow-xl">
                {/* Header */}
                <div className="space-y-1 border-b border-white/10 pb-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                    02 / PERSONAL PROFILE
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white">
                    Tell Us{" "}
                    <span className="text-gray-400 font-normal">
                      About You.
                    </span>
                  </h2>
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                  {/* Age */}
                  <div className="space-y-1">
                    <label
                      htmlFor="age"
                      className="block text-[9px] font-black uppercase tracking-widest text-gray-300"
                    >
                      Age (Years)
                    </label>
                    <input
                      id="age"
                      type="number"
                      min="10"
                      max="100"
                      value={age}
                      onChange={(event) => setAge(Number(event.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-bold outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label
                      htmlFor="gender"
                      className="block text-[9px] font-black uppercase tracking-widest text-gray-300"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(event) =>
                        setGender(event.target.value as Gender)
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-bold outline-none cursor-pointer focus:border-white"
                    >
                      <option
                        value="male"
                        className="bg-neutral-950 text-white"
                      >
                        Male
                      </option>
                      <option
                        value="female"
                        className="bg-neutral-950 text-white"
                      >
                        Female
                      </option>
                    </select>
                  </div>

                  {/* Height */}
                  <div className="space-y-1">
                    <label
                      htmlFor="height"
                      className="block text-[9px] font-black uppercase tracking-widest text-gray-300"
                    >
                      Height (CM)
                    </label>
                    <input
                      id="height"
                      type="number"
                      min="50"
                      max="250"
                      value={height}
                      onChange={(event) =>
                        setHeight(Number(event.target.value))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-bold outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-1">
                    <label
                      htmlFor="weight"
                      className="block text-[9px] font-black uppercase tracking-widest text-gray-300"
                    >
                      Weight (KG)
                    </label>
                    <input
                      id="weight"
                      type="number"
                      min="20"
                      max="300"
                      value={weight}
                      onChange={(event) =>
                        setWeight(Number(event.target.value))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-bold outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Activity */}
                  <div className="space-y-1">
                    <label
                      htmlFor="activity"
                      className="block text-[9px] font-black uppercase tracking-widest text-gray-300"
                    >
                      Activity Level
                    </label>
                    <select
                      id="activity"
                      value={activityLevel}
                      onChange={(event) =>
                        setActivityLevel(Number(event.target.value))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-bold outline-none cursor-pointer focus:border-white"
                    >
                      <option value={1.2} className="bg-neutral-950 text-white">
                        Sedentary (Little/no exercise)
                      </option>
                      <option
                        value={1.375}
                        className="bg-neutral-950 text-white"
                      >
                        Lightly Active (1–3 days/wk)
                      </option>
                      <option
                        value={1.55}
                        className="bg-neutral-950 text-white"
                      >
                        Moderately Active (3–5 days/wk)
                      </option>
                      <option
                        value={1.725}
                        className="bg-neutral-950 text-white"
                      >
                        Very Active (6–7 days/wk)
                      </option>
                      <option value={1.9} className="bg-neutral-950 text-white">
                        Extremely Active (Physical Job)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Goal Selector Pill Buttons (Compact) */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 block">
                    Choose Your Goal
                  </span>

                  <div className="space-y-2">
                    {goalOptions.map((item) => {
                      const isActive = goal === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setGoal(item.value)}
                          className={`flex w-full items-center justify-between p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "border-white bg-white text-black shadow-lg"
                              : "border-white/15 bg-neutral-900 text-white hover:border-white/30 hover:bg-neutral-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black transition-colors ${
                                isActive
                                  ? "bg-black text-white"
                                  : "bg-neutral-800 text-white"
                              }`}
                            >
                              {item.icon}
                            </span>

                            <span className="text-xs font-bold uppercase tracking-wider">
                              {item.label}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-black text-white font-black"
                                : "bg-neutral-800 text-gray-300"
                            }`}
                          >
                            {item.calories}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT — NUTRITION & MACRO RESULTS (40/60 Ratio: 60% Width)
            ================================================= */}
            <div className="lg:col-span-7 space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                    03 / NUTRITION & ENERGY TARGETS
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white">
                    Your Daily{" "}
                    <span className="text-gray-400 font-normal">
                      Breakdown.
                    </span>
                  </h2>
                </div>

                <p className="text-[11px] text-gray-500 max-w-xs font-medium">
                  Results auto-calculate via Mifflin-St Jeor equation.
                </p>
              </div>

              {/* BMR & TDEE Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* BMR Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-5 text-white shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[8px] font-black uppercase tracking-widest text-gray-300">
                        <Flame className="w-3 h-3 text-white" />
                        BMR (Basal Rate)
                      </span>

                      <motion.p
                        key={bmr}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white font-sans"
                      >
                        {bmr}{" "}
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          kcal/day
                        </span>
                      </motion.p>
                    </div>

                    <span className="text-base font-black text-gray-500 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      01
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      animate={{
                        width: `${Math.min((bmr / 3000) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* TDEE Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-5 text-white shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[8px] font-black uppercase tracking-widest text-gray-300">
                        <Dumbbell className="w-3 h-3 text-white" />
                        TDEE (Expenditure)
                      </span>

                      <motion.p
                        key={tdee}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white font-sans"
                      >
                        {tdee}{" "}
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          kcal/day
                        </span>
                      </motion.p>
                    </div>

                    <span className="text-base font-black text-gray-500 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      02
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gray-400"
                      animate={{
                        width: `${Math.min((tdee / 4000) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Target Calories Banner */}
              <motion.div
                key={targetCalories}
                initial={{ opacity: 0.6, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/10 bg-neutral-950 p-5 sm:p-6 text-white shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                      TARGET CALORIES
                    </span>

                    <motion.p
                      key={targetCalories}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans"
                    >
                      {targetCalories}{" "}
                      <span className="text-xs font-bold text-gray-400">
                        kcal / day
                      </span>
                    </motion.p>

                    <p className="text-[11px] font-semibold text-gray-400">
                      Optimal target for {goalLabel.toLowerCase()} progress
                    </p>
                  </div>

                  <div className="bg-white text-black font-black text-xs px-4 py-2 rounded-full shadow-lg shrink-0">
                    {goal === "bulking"
                      ? "+500 KCAL (SURPLUS)"
                      : goal === "cutting"
                        ? "-500 KCAL (DEFICIT)"
                        : "MAINTENANCE (TDEE)"}
                  </div>
                </div>
              </motion.div>

              {/* Macro Distribution Box */}
              <div className="rounded-3xl border border-white/10 bg-neutral-950 p-5 sm:p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                      NUTRITION BREAKDOWN
                    </span>

                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      Macro Distribution
                    </h3>
                  </div>

                  <p className="text-[11px] text-gray-400 font-medium">
                    Daily protein, carbs and fats for your goal
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Protein */}
                  <div>
                    <div className="mb-1.5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase text-white">
                          Protein
                        </p>
                        <p className="text-[9px] font-bold text-gray-400">
                          Muscle Repair & Support
                        </p>
                      </div>
                      <motion.p
                        key={macros.protein}
                        className="text-xs font-black text-white"
                      >
                        {macros.protein}g · {macroPercentages.protein}%
                      </motion.p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        animate={{
                          width: `${(macros.protein / maxMacro) * 100}%`,
                        }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="mb-1.5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase text-white">
                          Carbs
                        </p>
                        <p className="text-[9px] font-bold text-gray-400">
                          Training & Daily Energy
                        </p>
                      </div>
                      <motion.p
                        key={macros.carbs}
                        className="text-xs font-black text-white"
                      >
                        {macros.carbs}g · {macroPercentages.carbs}%
                      </motion.p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gray-400"
                        animate={{
                          width: `${(macros.carbs / maxMacro) * 100}%`,
                        }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="mb-1.5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase text-white">
                          Fats
                        </p>
                        <p className="text-[9px] font-bold text-gray-400">
                          Hormone & Organ Fuel
                        </p>
                      </div>
                      <motion.p
                        key={macros.fats}
                        className="text-xs font-black text-white"
                      >
                        {macros.fats}g · {macroPercentages.fats}%
                      </motion.p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gray-500"
                        animate={{
                          width: `${(macros.fats / maxMacro) * 100}%`,
                        }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FULL-WIDTH BOTTOM SUMMARY BAR (Nutrition Tip & Export CTA)
          ================================================= */}
          <div className="mt-8 space-y-4 w-full">
            {/* Full-Width Nutrition Tip Box */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 flex items-center p-5 sm:p-6 gap-4 shadow-xl text-white"
            >
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 shadow-lg">
                <Utensils className="w-5 h-5 text-black" />
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 block">
                  NUTRITION TIP
                </span>

                <h3 className="text-xs sm:text-sm font-black uppercase text-white tracking-wide">
                  {nutritionTip.title}
                </h3>

                <p className="text-[11px] sm:text-xs leading-relaxed text-gray-300 font-medium">
                  {nutritionTip.description}
                </p>
              </div>
            </motion.div>

            {/* Full-Width Export Button Signature Pill */}
            <button
              type="button"
              onClick={handleExport}
              className="group inline-flex items-center justify-between w-full bg-white text-black border border-white hover:bg-neutral-200 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <span>EXPORT METRICS & SUMMARY</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          TOAST NOTIFICATION
      ====================================================== */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 15, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white border border-white/20 px-5 py-3 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-2xl backdrop-blur-xl flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toast}</span>
        </motion.div>
      )}
    </div>
  );
}
