"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
    return {
      protein: Math.round(
        (targetCalories * macroPercentages.protein) / 100 / 4
      ),
      carbs: Math.round(
        (targetCalories * macroPercentages.carbs) / 100 / 4
      ),
      fats: Math.round(
        (targetCalories * macroPercentages.fats) / 100 / 9
      ),
    };
  }, [targetCalories, macroPercentages]);

  const maxMacro = Math.max(
    macros.protein,
    macros.carbs,
    macros.fats,
    1
  );


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
        return "Select your activity level";
    }
  }, [activityLevel]);


  const nutritionTip = useMemo(() => {
    switch (goal) {
      case "bulking":
        return {
          title: "Bulking Focus",
          description:
            "A moderate calorie surplus with enough protein and carbohydrates can support muscle growth and training performance.",
        };

      case "cutting":
        return {
          title: "Cutting Focus",
          description:
            "A moderate calorie deficit with sufficient protein can support fat loss while helping maintain muscle.",
        };

      case "maintenance":
      default:
        return {
          title: "Maintenance Focus",
          description:
            "Keep your calorie intake close to your daily energy needs and maintain a balanced macro distribution.",
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
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);


  const handleExport = async () => {
    const metrics = `FITORA NUTRITION METRICS

Goal: ${goalLabel}

Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg

Activity:
${activityDescription}

BMR: ${bmr} kcal/day
TDEE: ${tdee} kcal/day
Target Calories: ${targetCalories} kcal/day

Protein: ${macros.protein}g (${macroPercentages.protein}%)
Carbs: ${macros.carbs}g (${macroPercentages.carbs}%)
Fats: ${macros.fats}g (${macroPercentages.fats}%)`;

    try {
      await navigator.clipboard.writeText(metrics);
      setToast("Metrics copied to clipboard!");
    } catch {
      setToast("Failed to copy metrics.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">

      <section className="bg-black px-4 py-16 text-white sm:px-6 lg:py-24">
        <div className="mx-auto w-11/12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
            {/* LEFT — BMI INFORMATION */}
            <div className="flex flex-col lg:col-span-6">
              {/* Header */}
              <div className="mb-6 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
                    Body Measurement
                  </p>

                  <h3 className="mt-2 text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-4xl">
                    Know Your
                    <br />
                    Numbers.
                  </h3>
                </div>

                <p className="max-w-[180px] pb-1 text-right text-[11px] leading-5 text-gray-500">
                  Understand your body better and make smarter decisions for
                  your fitness journey.
                </p>
              </div>

              {/* Image */}
              <div className="group relative h-[300px] overflow-hidden rounded-[28px] sm:h-[360px] lg:h-[390px]">
                <img
                  src="/gymbmi.jpeg"
                  alt="BMI fitness"
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                <div className="absolute left-5 top-5">
                  <span className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    BMI Calculator
                  </span>
                </div>

                <div className="absolute bottom-5 left-5">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-400">
                    Measure. Understand. Improve.
                  </p>
                </div>
              </div>

              {/* BMI Info */}
              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                      About BMI
                    </p>

                    <p className="mt-2 max-w-md text-xs leading-5 text-gray-500">
                      BMI compares your body weight with your height and gives
                      you a simple starting point for understanding your
                      overall fitness.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="border border-white/10 px-4 py-3">
                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                        Healthy
                      </p>

                      <p className="mt-1 text-sm font-black text-white">
                        18.5 — 24.9
                      </p>
                    </div>

                    <div className="border border-white/10 px-4 py-3">
                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                        Unit
                      </p>

                      <p className="mt-1 text-sm font-black text-white">
                        kg / m²
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why BMI */}
              <div className="mt-5 border-t border-white/10 pt-6">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                  Why It Matters
                </p>

                <h4 className="mt-2 text-lg font-black uppercase tracking-[-0.03em] text-white">
                  A Simple Look At Your Health
                </h4>

                <p className="mt-3 max-w-xl text-xs leading-6 text-gray-500">
                  Your BMI can give you a quick overview of how your weight
                  relates to your height. It can help you track changes and
                  understand your current fitness level.
                </p>
              </div>
            </div>

            {/* RIGHT — BMI CALCULATOR */}
            <div className="flex flex-col lg:col-span-6">
              <div className="mb-8">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                  01 / Body Measurement
                </p>

                <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-6xl">
                  Check Your BMI.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                  Adjust your height and weight to instantly calculate your
                  Body Mass Index.
                </p>
              </div>

              <div className="flex-1 rounded-[28px] bg-white p-5 shadow-2xl sm:p-8">
                <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-black">
                      BMI Calculator
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500">
                      Adjust the sliders to calculate your result
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[10px] font-black text-black">
                    01
                  </div>
                </div>

                <BmiCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          USER INFORMATION + RESULTS
      ====================================================== */}

      <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto w-11/12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* =================================================
                LEFT — PERSONAL INFORMATION
            ================================================= */}

            <div className="lg:col-span-4">
              <div className="rounded-[28px] bg-gray-100 p-6 sm:p-8">
                {/* Header */}
                <div className="mb-8">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                    02 / Personal Information
                  </p>

                  <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl">
                    Tell Us
                    <br />
                    About You.
                  </h2>

                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    Enter your information to calculate your daily calorie and
                    macronutrient requirements.
                  </p>
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                  {/* Age */}
                  <div>
                    <label
                      htmlFor="age"
                      className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em]"
                    >
                      Age
                    </label>

                    <input
                      id="age"
                      type="number"
                      min="10"
                      max="100"
                      value={age}
                      onChange={(event) => setAge(Number(event.target.value))}
                      className="w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 text-sm font-bold outline-none transition focus:border-gray-500"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em]"
                    >
                      Gender
                    </label>

                    <select
                      id="gender"
                      value={gender}
                      onChange={(event) =>
                        setGender(event.target.value as Gender)
                      }
                      className="w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 text-sm font-bold outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Height */}
                  <div>
                    <label
                      htmlFor="height"
                      className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em]"
                    >
                      Height / CM
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
                      className="w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 text-sm font-bold outline-none transition focus:border-gray-500"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label
                      htmlFor="weight"
                      className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em]"
                    >
                      Weight / KG
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
                      className="w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 text-sm font-bold outline-none transition focus:border-gray-500"
                    />
                  </div>

                  {/* Activity */}
                  <div>
                    <label
                      htmlFor="activity"
                      className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em]"
                    >
                      Activity Level
                    </label>

                    <select
                      id="activity"
                      value={activityLevel}
                      onChange={(event) =>
                        setActivityLevel(Number(event.target.value))
                      }
                      className="w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 text-sm font-bold outline-none"
                    >
                      <option value={1.2}>Sedentary</option>
                      <option value={1.375}>Lightly Active</option>
                      <option value={1.55}>Moderately Active</option>
                      <option value={1.725}>Very Active</option>
                      <option value={1.9}>Extremely Active</option>
                    </select>

                    <p className="mt-2 text-[10px] leading-4 text-gray-500">
                      {activityDescription}
                    </p>
                  </div>
                </div>

                {/* Goal */}
                <div className="mt-8 border-t border-black/10 pt-7">
                  <p className="text-xs font-black uppercase tracking-[0.18em]">
                    Choose Your Goal
                  </p>

                  <p className="mt-2 text-[10px] leading-4 text-gray-500">
                    Select a goal to adjust your calorie and macro targets.
                  </p>

                  <div className="mt-5 space-y-2">
                    {goalOptions.map((item) => {
                      const isActive = goal === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setGoal(item.value)}
                          className={`flex w-full items-center justify-between border-2 p-3 text-left transition-all duration-300 ${
                            isActive
                              ? "border-black bg-black text-white"
                              : "border-black/10 bg-white text-black hover:border-black"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-8 w-8 items-center justify-center text-sm font-black ${
                                isActive
                                  ? "bg-white text-black"
                                  : "bg-black text-white"
                              }`}
                            >
                              {item.icon}
                            </span>

                            <span className="text-[10px] font-black uppercase tracking-wide">
                              {item.label}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] font-black uppercase tracking-wider ${
                              isActive ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {item.calories}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="mt-8 border-t border-black/10 pt-6">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Current Activity
                  </p>

                  <p className="mt-2 text-xs font-bold text-black">
                    {activityDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT — RESULTS
            ================================================= */}

            <div className="lg:col-span-8">
              {/* Results Header */}
              <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                    03 / Your Results
                  </p>

                  <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl">
                    Know Your
                    <br />
                    <span className="text-gray-400">Numbers.</span>
                  </h2>
                </div>

                <p className="max-w-xs text-xs leading-5 text-gray-500">
                  Your results update automatically when you change your
                  information or fitness goal.
                </p>
              </div>

              {/* BMR + TDEE */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* BMR */}
                <div className="relative overflow-hidden border border-black/10 bg-[#111111] p-6 text-white sm:p-7">
                  <div className="absolute right-0 top-0 h-1 w-20 bg-white" />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
                        BMR
                      </p>

                      <motion.p
                        key={bmr}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl"
                      >
                        {bmr}
                      </motion.p>

                      <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                        kcal / day
                      </p>
                    </div>

                    <span className="text-2xl font-black text-gray-700">
                      01
                    </span>
                  </div>

                  <div className="mt-6 h-1.5 overflow-hidden bg-white/10">
                    <motion.div
                      className="h-full bg-white"
                      animate={{
                        width: `${Math.min((bmr / 3000) * 100, 100)}%`,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>

                {/* TDEE */}
                <div className="relative overflow-hidden border border-black/10 bg-[#111111] p-6 text-white sm:p-7">
                  <div className="absolute right-0 top-0 h-1 w-20 bg-gray-500" />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
                        TDEE
                      </p>

                      <motion.p
                        key={tdee}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl"
                      >
                        {tdee}
                      </motion.p>

                      <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                        maintenance kcal / day
                      </p>
                    </div>

                    <span className="text-2xl font-black text-gray-700">
                      02
                    </span>
                  </div>

                  <div className="mt-6 h-1.5 overflow-hidden bg-white/10">
                    <motion.div
                      className="h-full bg-gray-500"
                      animate={{
                        width: `${Math.min((tdee / 4000) * 100, 100)}%`,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Target Calories */}
              <motion.div
                key={targetCalories}
                initial={{ opacity: 0.6, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 border border-black/10 bg-black p-6 text-white sm:p-7"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
                      Target Calories
                    </p>

                    <motion.p
                      key={targetCalories}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className="mt-2 text-5xl font-black tracking-[-0.06em] sm:text-6xl"
                    >
                      {targetCalories}
                    </motion.p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                      kcal / day for {goalLabel.toLowerCase()}
                    </p>
                  </div>

                  <div className="border border-white/20 px-4 py-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em]">
                      {goal === "bulking"
                        ? "+500 KCAL"
                        : goal === "cutting"
                          ? "-500 KCAL"
                          : "TDEE"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Macro Distribution */}
              <div className="mt-4 border border-black/10 bg-[#111111] p-6 text-white sm:p-7">
                <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
                      Nutrition Breakdown
                    </p>

                    <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.03em] sm:text-2xl">
                      Macro Distribution
                    </h3>
                  </div>

                  <p className="max-w-xs text-[10px] leading-5 text-gray-500">
                    Daily protein, carbs and fats based on your selected goal.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Protein */}
                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase">
                          Protein
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-600">
                          Muscle support
                        </p>
                      </div>

                      <motion.p
                        key={macros.protein}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-black"
                      >
                        {macros.protein}g · {macroPercentages.protein}%
                      </motion.p>
                    </div>

                    <div className="h-2 overflow-hidden bg-white/10">
                      <motion.div
                        className="h-full bg-white"
                        animate={{
                          width: `${(macros.protein / maxMacro) * 100}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase">
                          Carbs
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-600">
                          Training energy
                        </p>
                      </div>

                      <motion.p
                        key={macros.carbs}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-black"
                      >
                        {macros.carbs}g · {macroPercentages.carbs}%
                      </motion.p>
                    </div>

                    <div className="h-2 overflow-hidden bg-white/10">
                      <motion.div
                        className="h-full bg-gray-500"
                        animate={{
                          width: `${(macros.carbs / maxMacro) * 100}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase">
                          Fats
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-600">
                          Essential fuel
                        </p>
                      </div>

                      <motion.p
                        key={macros.fats}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-black"
                      >
                        {macros.fats}g · {macroPercentages.fats}%
                      </motion.p>
                    </div>

                    <div className="h-2 overflow-hidden bg-white/10">
                      <motion.div
                        className="h-full bg-gray-300"
                        animate={{
                          width: `${(macros.fats / maxMacro) * 100}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Tip */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 grid overflow-hidden border border-black/10 sm:grid-cols-[100px_1fr]"
              >
                <div className="flex min-h-[110px] items-end bg-gray-100 p-5 text-black">
                  <span className="text-5xl font-black tracking-[-0.08em]">
                    03
                  </span>
                </div>

                <div className="bg-[#111111] p-6 text-white sm:p-7">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
                    Personalized Nutrition Tip
                  </p>

                  <h3 className="mt-2 text-xl font-black uppercase">
                    {nutritionTip.title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500">
                    {nutritionTip.description}
                  </p>
                </div>
              </motion.div>

              {/* Export */}
              <button
                type="button"
                onClick={handleExport}
                className="mt-4 flex w-full items-center justify-center gap-3 bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-gray-800 active:scale-[0.99]"
              >
                <span className="text-lg">↓</span>
                Export Metrics
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto w-11/12">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-200">
                Your Next Step
              </p>

              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-7xl text-white">
                Build
                <br />
                Your
                <br />
                <span className="text-gray-400">Body.</span>
              </h2>
            </div>

            <div>
              <p className="max-w-md text-sm leading-6 text-gray-300">
                Numbers are only the beginning. Stay consistent, follow your
                plan and keep working toward your fitness goals.
              </p>

              <button
                type="button"
                className="mt-7 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-gray-800"
              >
                Start Your Journey →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TOAST
      ====================================================== */}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 15, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-50 border-2 border-black bg-white px-6 py-4 text-xs font-black uppercase tracking-wide text-black shadow-2xl"
        >
          <span className="mr-2">✓</span>
          {toast}
        </motion.div>
      )}
    </main>
  );
}