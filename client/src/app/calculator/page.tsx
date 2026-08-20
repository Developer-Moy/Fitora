"use client";

import { useEffect, useMemo, useState } from "react";
import BmiCalculator from "@/components/BmiCalculator";

type Gender = "male" | "female";
type Goal = "weight-loss" | "muscle-gain";

export default function CalculatorPage() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [goal, setGoal] = useState<Goal>("weight-loss");

  const [toast, setToast] = useState("");

  /* =========================
     BMR Calculation
  ========================= */

  const bmr = useMemo(() => {
    const value =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    return Math.round(value);
  }, [age, gender, height, weight]);


  const tdee = useMemo(() => {
    return Math.round(bmr * activityLevel);
  }, [bmr, activityLevel]);


  const targetCalories = useMemo(() => {
    if (goal === "weight-loss") {
      return Math.round(tdee * 0.8);
    }

    return Math.round(tdee * 1.1);
  }, [tdee, goal]);


  const macroPercentages = useMemo(() => {
    if (goal === "weight-loss") {
      return {
        protein: 35,
        carbs: 35,
        fats: 30,
      };
    }

    return {
      protein: 30,
      carbs: 45,
      fats: 25,
    };
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


  const nutritionTip = useMemo(() => {
    if (goal === "weight-loss") {
      return {
        title: "Weight Loss Focus",
        description:
          "Maintain a moderate calorie deficit while keeping protein high to support muscle retention.",
      };
    }

    return {
      title: "Muscle Gain Focus",
      description:
        "A small calorie surplus with enough protein and carbohydrates can support muscle growth and training performance.",
    };
  }, [goal]);


  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);


  const handleExport = async () => {
    const metrics = `Fitora Nutrition Metrics

Goal: ${
      goal === "weight-loss" ? "Weight Loss" : "Muscle Gain"
    }

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


        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#ed173b]" />

            <h3 className="text-sm font-semibold text-white">
              Quick
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              Get your BMI result instantly.
            </p>
          </div>

          <div className="rounded-xl border border-[#303136] bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-yellow-400" />

            <h3 className="text-sm font-semibold text-white">
              Simple
            </h3>

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
                onChange={(event) =>
                  setAge(Number(event.target.value))
                }
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
                onChange={(event) =>
                  setHeight(Number(event.target.value))
                }
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
                onChange={(event) =>
                  setWeight(Number(event.target.value))
                }
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              />
            </div>

            {/* Activity */}

            <div>
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

            {/* Goal */}

            <div>
              <label
                htmlFor="goal"
                className="mb-2 block text-xs font-medium text-gray-300"
              >
                Fitness Goal
              </label>

              <select
                id="goal"
                value={goal}
                onChange={(event) =>
                  setGoal(event.target.value as Goal)
                }
                className="w-full rounded-lg border border-[#303136] bg-[#111214] px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400"
              >
                <option value="weight-loss">
                  Weight Loss
                </option>

                <option value="muscle-gain">
                  Muscle Gain
                </option>
              </select>
            </div>
          </div>
        </section>


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
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (bmr / 3000) * 100,
                      100
                    )}%`,
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
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (tdee / 4000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>


          <div className="mt-4 rounded-2xl border border-[#303136] bg-white/[0.02] p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Target Calories
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {targetCalories}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  kcal / day for{" "}
                  {goal === "weight-loss"
                    ? "weight loss"
                    : "muscle gain"}
                </p>
              </div>

              <div className="rounded-full bg-[#ed173b]/10 px-3 py-1.5 text-xs font-semibold text-[#ed173b]">
                {goal === "weight-loss"
                  ? "-20%"
                  : "+10%"}
              </div>
            </div>
          </div>


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

                  <span className="text-sm font-semibold text-gray-300">
                    {macros.protein}g · {macroPercentages.protein}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-[#ed173b] transition-all duration-500"
                    style={{
                      width: `${
                        (macros.protein / maxMacro) * 100
                      }%`,
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

                  <span className="text-sm font-semibold text-gray-300">
                    {macros.carbs}g · {macroPercentages.carbs}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{
                      width: `${
                        (macros.carbs / maxMacro) * 100
                      }%`,
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

                  <span className="text-sm font-semibold text-gray-300">
                    {macros.fats}g · {macroPercentages.fats}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{
                      width: `${
                        (macros.fats / maxMacro) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>


          <div className="mt-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">

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
          </div>


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


      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-[#303136] bg-[#111214] px-5 py-3 text-sm font-medium text-white shadow-2xl">
          <span className="mr-2 text-emerald-400">
            ✓
          </span>

          {toast}
        </div>
      )}
    </main>
  );
}