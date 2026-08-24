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
    icon: "🏋️",
  },
  {
    value: "cutting",
    label: "Cutting",
    calories: "-500 kcal",
    icon: "🔥",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    calories: "TDEE",
    icon: "⚖️",
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

  // BMR
  const bmr = useMemo(() => {
    const value =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    return Math.round(value);
  }, [age, gender, height, weight]);

  // TDEE
  const tdee = useMemo(() => {
    return Math.round(bmr * activityLevel);
  }, [bmr, activityLevel]);

  // Goal-based calories
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

  // Goal-based macro ratios
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

  // Macros
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

  // Activity description
  const activityDescription = useMemo(() => {
    if (activityLevel === 1.2) {
      return "Little or no regular exercise";
    }

    if (activityLevel === 1.375) {
      return "Light exercise 1–3 days per week";
    }

    if (activityLevel === 1.55) {
      return "Moderate exercise 3–5 days per week";
    }

    if (activityLevel === 1.725) {
      return "Hard exercise 6–7 days per week";
    }

    return "Very intense exercise or physical job";
  }, [activityLevel]);

  // Nutrition tip
  const nutritionTip = useMemo(() => {
    if (goal === "bulking") {
      return {
        title: "Bulking Focus",
        description:
          "A moderate calorie surplus with enough protein and carbohydrates can support muscle growth and training performance.",
      };
    }

    if (goal === "cutting") {
      return {
        title: "Cutting Focus",
        description:
          "A moderate calorie deficit with sufficient protein can support fat loss while helping maintain muscle.",
      };
    }

    return {
      title: "Maintenance Focus",
      description:
        "Keep your calorie intake close to your daily energy needs and maintain a balanced macro distribution.",
    };
  }, [goal]);

  // Toast auto hide
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // Export metrics
  const handleExport = async () => {
    const goalLabel =
      goal === "bulking"
        ? "Bulking"
        : goal === "cutting"
          ? "Cutting"
          : "Maintenance";

    const metrics = `Fitora Nutrition Metrics

Goal: ${goalLabel}

Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg

Activity: ${activityDescription}

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
    <main className="min-h-screen bg-[#0b0c0e] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Health & Fitness
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Nutrition Calculator
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
            Calculate your BMI, BMR, TDEE and daily macronutrient
            requirements based on your fitness goal.
          </p>
        </div>

        {/* BMI Calculator */}
        <section className="mx-auto max-w-3xl rounded-2xl border border-[#303136] bg-white/[0.02] p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div className="mb-5 flex items-center gap-3 border-b border-[#303136] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ed173b]/10">
              <span className="text-lg">⚖️</span>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Check Your BMI
              </h2>

              <p className="text-xs text-gray-500">
                Adjust the sliders to calculate your result
              </p>
            </div>
          </div>

          <BmiCalculator />
        </section>

        {/* Quick Info */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#ed173b]" />

            <h3 className="text-sm font-semibold text-white">Quick</h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Get your BMI result instantly.
            </p>
          </div>

          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-yellow-400" />

            <h3 className="text-sm font-semibold text-white">Simple</h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Easy inputs make calculation simple.
            </p>
          </div>

          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-emerald-400" />

            <h3 className="text-sm font-semibold text-white">
              Personalized
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Results are based on your inputs.
            </p>
          </div>
        </div>

        {/* User Information */}
        <section className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[#303136] bg-white/[0.02] p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Your Information
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Enter your details to calculate your daily nutrition needs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="mb-2 block text-xs font-medium text-gray-300"
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
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-xs font-medium text-gray-300"
              >
                Gender
              </label>

              <select
                id="gender"
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value as Gender)
                }
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label
                htmlFor="height"
                className="mb-2 block text-xs font-medium text-gray-300"
              >
                Height (cm)
              </label>

              <input
                id="height"
                type="number"
                min="50"
                max="250"
                value={height}
                onChange={(event) => setHeight(Number(event.target.value))}
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              />
            </div>

            {/* Weight */}
            <div>
              <label
                htmlFor="weight"
                className="mb-2 block text-xs font-medium text-gray-300"
              >
                Weight (kg)
              </label>

              <input
                id="weight"
                type="number"
                min="20"
                max="300"
                value={weight}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              />
            </div>

            {/* Activity */}
            <div className="sm:col-span-2">
              <label
                htmlFor="activity"
                className="mb-2 block text-xs font-medium text-gray-300"
              >
                Activity Level
              </label>

              <select
                id="activity"
                value={activityLevel}
                onChange={(event) =>
                  setActivityLevel(Number(event.target.value))
                }
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              >
                <option value={1.2}>Sedentary</option>
                <option value={1.375}>Lightly Active</option>
                <option value={1.55}>Moderately Active</option>
                <option value={1.725}>Very Active</option>
                <option value={1.9}>Extremely Active</option>
              </select>

              <p className="mt-2 text-[10px] text-gray-500">
                {activityDescription}
              </p>
            </div>
          </div>

          {/* Goal Selector */}
          <div className="mt-5 border-t border-[#303136] pt-5">
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-300">
                Choose Your Goal
              </p>

              <p className="mt-1 text-[10px] text-gray-500">
                Select a goal to instantly adjust your calorie and macro
                targets.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {goalOptions.map((item) => {
                const isActive = goal === item.value;

                return (
                  <button
                    key={`calculator-goal-${item.value}`}
                    type="button"
                    onClick={() => setGoal(item.value)}
                    className={`relative overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 ${
                      isActive
                        ? "border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/5"
                        : "border-[#303136] bg-[#111214] hover:border-gray-500 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${
                          isActive
                            ? "bg-emerald-400/15"
                            : "bg-white/[0.04]"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            isActive ? "text-emerald-300" : "text-white"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-500">
                          {item.calories}
                        </p>
                      </div>

                      <div
                        className={`h-4 w-4 rounded-full border transition-all ${
                          isActive
                            ? "border-emerald-400 bg-emerald-400"
                            : "border-gray-600"
                        }`}
                      >
                        {isActive && (
                          <div className="m-[3px] h-1.5 w-1.5 rounded-full bg-[#0b0c0e]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto mt-6 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* BMR */}
            <div className="rounded-2xl border border-[#303136] bg-white/[0.02] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    BMR
                  </p>

                  <p className="mt-2 text-4xl font-bold text-white">
                    {bmr}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    kcal / day
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
                  🔥
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-yellow-400"
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
            <div className="rounded-2xl border border-[#303136] bg-white/[0.02] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    TDEE
                  </p>

                  <p className="mt-2 text-4xl font-bold text-white">
                    {tdee}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    maintenance kcal / day
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  ⚡
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-emerald-400"
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
            initial={{ opacity: 0.7, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-2xl border border-[#303136] bg-white/[0.02] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Target Calories
                </p>

                <motion.p
                  key={`target-calories-${targetCalories}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 text-3xl font-bold text-white"
                >
                  {targetCalories}
                </motion.p>

                <p className="mt-1 text-xs text-gray-500">
                  kcal / day for{" "}
                  {goal === "bulking"
                    ? "bulking"
                    : goal === "cutting"
                      ? "cutting"
                      : "maintenance"}
                </p>
              </div>

              <div className="rounded-full bg-[#ed173b]/10 px-3 py-1.5 text-xs font-semibold text-[#ed173b]">
                {goal === "bulking"
                  ? "+500"
                  : goal === "cutting"
                    ? "-500"
                    : "TDEE"}
              </div>
            </div>
          </motion.div>

          {/* Macro Distribution */}
          <div className="mt-4 rounded-2xl border border-[#303136] bg-white/[0.02] p-5">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Macro Distribution
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Daily protein, carbs and fats based on your selected goal.
              </p>
            </div>

            <div className="space-y-5">
              {/* Protein */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Protein
                  </span>

                  <motion.span
                    key={`protein-value-${macros.protein}`}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold text-gray-300"
                  >
                    {macros.protein}g · {macroPercentages.protein}%
                  </motion.span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    className="h-full rounded-full bg-[#ed173b]"
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
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Carbs
                  </span>

                  <motion.span
                    key={`carbs-value-${macros.carbs}`}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold text-gray-300"
                  >
                    {macros.carbs}g · {macroPercentages.carbs}%
                  </motion.span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    className="h-full rounded-full bg-yellow-400"
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
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Fats
                  </span>

                  <motion.span
                    key={`fats-value-${macros.fats}`}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold text-gray-300"
                  >
                    {macros.fats}g · {macroPercentages.fats}%
                  </motion.span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <motion.div
                    className="h-full rounded-full bg-emerald-400"
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5"
          >
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                💡
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  {nutritionTip.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  {nutritionTip.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ed173b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c9082d] active:scale-[0.99]"
          >
            <span>📋</span>
            Export Metrics
          </button>
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-[#303136] bg-[#111214] px-5 py-3 text-sm font-medium text-white shadow-2xl">
          <span className="mr-2 text-emerald-400">✓</span>
          {toast}
        </div>
      )}
    </main>
  );
}