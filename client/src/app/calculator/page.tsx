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
  Droplets,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import BmiCalculator from "@/components/BmiCalculator";
import { calculateBmr } from "@/utils/calculateBmr";
import { calculateTdee } from "@/utils/calculateTdee";
import { calculateTimeline } from "@/utils/calculateTimeline";
import { calculateNutritionApi } from "@/services/nutritionService";
import MacroAdjuster from "@/components/calculator/MacroAdjuster";
import AthleteHealthAssessmentCard from "@/components/calculator/AthleteHealthAssessmentCard";

type Gender = "male" | "female";
type Goal = "bulking" | "cutting" | "maintenance";
type CalculatorTab = "bmi" | "nutrition" | "goals";

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
  const [targetWeight, setTargetWeight] = useState(60);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [activeTab, setActiveTab] = useState<CalculatorTab>("bmi");
  const [bmi, setBmi] = useState(0);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const [isSavingHydration, setIsSavingHydration] = useState(false);
  const [hydrationSaved, setHydrationSaved] = useState(false);
  const [isSavingTargetWeight, setIsSavingTargetWeight] = useState(false);
  const [targetWeightSaved, setTargetWeightSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverMacros, setServerMacros] = useState<{
    tdee: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [customMacroPercentages, setCustomMacroPercentages] = useState({
    protein: 30,
    carbs: 40,
    fats: 30,
  });

  // Sync with backend nutrition API when inputs change
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const result = await calculateNutritionApi({
        age,
        gender,
        height,
        weight,
        activityLevel,
      });
      if (result) setServerMacros(result);
    }, 600);
    return () => clearTimeout(timeout);
  }, [age, gender, height, weight, activityLevel]);

  const bmr = useMemo(() => {
    return calculateBmr(age, gender, weight, height);
  }, [age, gender, height, weight]);

  const tdee = useMemo(() => {
    return calculateTdee(bmr, activityLevel);
  }, [bmr, activityLevel]);

  const timeline = useMemo(() => {
    if (!targetWeight || targetWeight === weight) {
      return null;
    }

    return calculateTimeline({
      currentWeight: weight,
      targetWeight,
      dailyCalorieChange:
        goal === "bulking" ? 500 : goal === "cutting" ? -500 : 0,
    });
  }, [weight, targetWeight, goal]);

  const hydrationTargetLiters = useMemo(() => {
    const baseHydration = weight * 0.033;

    let activityBonus = 0.5;

    if (activityLevel >= 1.725) {
      activityBonus = 1.0;
    } else if (activityLevel >= 1.55) {
      activityBonus = 0.75;
    }

    return Number((baseHydration + activityBonus).toFixed(2));
  }, [weight, activityLevel]);

  const syncHealthMetrics = async () => {
    try {
      if (typeof window === "undefined") return;

      const token =
        localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token");

      if (!token) return;

      const rawApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const apiBase = rawApiUrl.endsWith("/api")
        ? rawApiUrl
        : `${rawApiUrl}/api`;

      const response = await fetch(
        `${apiBase}/dashboard/profile/health-metrics`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to sync health metrics");
      }

      const result = await response.json();

      const storedUser = localStorage.getItem("fitora_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        localStorage.setItem(
          "fitora_user",
          JSON.stringify({
            ...user,
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
          }),
        );
      }

      return result;
    } catch (error) {
      console.error("Health metrics sync failed:", error);
    }
  };

  const handleSaveHydration = async () => {
    try {
      if (typeof window === "undefined") return;

      const token =
        localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token");

      if (!token) {
        toast.error("Please login to save your hydration target.");
        return;
      }

      setIsSavingHydration(true);
      setHydrationSaved(false);

      const rawApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const apiBase = rawApiUrl.endsWith("/api")
        ? rawApiUrl
        : `${rawApiUrl}/api`;

      const response = await fetch(
        `${apiBase}/users/profile/hydration-target`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hydrationTargetLiters,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save hydration target.");
      }

      // Keep local user data in sync
      const storedUser = localStorage.getItem("fitora_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        localStorage.setItem(
          "fitora_user",
          JSON.stringify({
            ...user,
            hydrationTargetLiters,
          }),
        );
      }

      setHydrationSaved(true);

      toast.success("Hydration target saved to your profile!");
    } catch (error) {
      console.error("Hydration target save failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save hydration target.",
      );
    } finally {
      setIsSavingHydration(false);
    }
  };

  const handleSaveTargetWeight = async () => {
    try {
      if (typeof window === "undefined") return;

      const token =
        localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token");

      if (!token) {
        toast.error("Please login to save your target weight.");
        return;
      }

      setIsSavingTargetWeight(true);
      setTargetWeightSaved(false);

      const rawApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const apiBase = rawApiUrl.endsWith("/api")
        ? rawApiUrl
        : `${rawApiUrl}/api`;

      const response = await fetch(`${apiBase}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetWeight,
          weight,
          fitnessGoal: goal,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save target weight.");
      }

      // Also try syncing goal if userId exists
      let userId = "";
      const storedUser = localStorage.getItem("fitora_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.id || user._id) userId = user.id || user._id;
        localStorage.setItem(
          "fitora_user",
          JSON.stringify({
            ...user,
            targetWeight,
            weight,
            fitnessGoal: goal,
          }),
        );
      }

      if (userId) {
        try {
          await fetch(`${apiBase}/goals`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              targetWeight,
              currentValue: weight,
              targetValue: targetWeight,
              goalType: goal,
              bmr: Math.round(bmr),
              tdee: Math.round(tdee),
              targetCalories: Math.round(targetCalories),
              macros,
            }),
          });
        } catch {
          // Non-critical goal sync
        }
      }

      setTargetWeightSaved(true);
      toast.success("Target weight saved to your profile!");
    } catch (error) {
      console.error("Target weight save failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save target weight.",
      );
    } finally {
      setIsSavingTargetWeight(false);
    }
  };

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

  const defaultMacroPercentages = useMemo(() => {
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

  useEffect(() => {
    setCustomMacroPercentages(defaultMacroPercentages);
  }, [defaultMacroPercentages]);

  const macroPercentages = isPremium
    ? customMacroPercentages
    : defaultMacroPercentages;

  // Prefer server-verified macros, fall back to client-side calculation
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const userStr = localStorage.getItem("fitora_user");

      if (!userStr) {
        setIsPremium(false);
        return;
      }

      const user = JSON.parse(userStr);

      const plan = String(
        user?.plan ||
          user?.tier ||
          user?.subscription?.plan ||
          user?.subscription?.tier ||
          "",
      ).toLowerCase();

      const premiumPlans = ["premium", "pro", "athlete", "paid"];

      setIsPremium(premiumPlans.includes(plan));
    } catch (error) {
      console.error("Premium status check failed:", error);
      setIsPremium(false);
    }
  }, []);

  const handleMacroChange = (
    macro: "protein" | "carbs" | "fats",
    value: number,
  ) => {
    if (!isPremium) return;

    setCustomMacroPercentages((current) => {
      const next = {
        ...current,
        [macro]: value,
      };

      const total = next.protein + next.carbs + next.fats;

      if (total === 100) {
        return next;
      }

      return next;
    });
  };

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

  const validateCalculatorInput = (): boolean => {
    setError(null);

    if (age < 10 || age > 100) {
      setError("Age must be between 10 and 100 years.");
      return false;
    }

    if (height < 50 || height > 250) {
      setError("Height must be between 50 and 250 cm.");
      return false;
    }

    if (weight < 20 || weight > 300) {
      setError("Weight must be between 20 and 300 kg.");
      return false;
    }

    if (activityLevel <= 0) {
      setError("Please select a valid activity level.");
      return false;
    }

    return true;
  };

  const handleSaveHistory = async () => {
    if (!validateCalculatorInput()) {
      return;
    }

    setIsSavingHistory(true);
    setError(null);
    await syncHealthMetrics();

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const endpoint = apiUrl.endsWith("/api")
        ? `${apiUrl}/bmi/history`
        : `${apiUrl}/api/bmi/history`;

      let userId = "guest_user";
      let token = "";
      if (typeof window !== "undefined") {
        try {
          token =
            localStorage.getItem("fitora_token") ||
            localStorage.getItem("fitora_auth_token") ||
            "";
          const userStr = localStorage.getItem("fitora_user");
          if (userStr) {
            const u = JSON.parse(userStr);
            if (u.id || u._id) userId = u.id || u._id;
          }
        } catch {}
      }

      const calculatedBmi =
        bmi > 0
          ? bmi
          : Number((weight / ((height / 100) * (height / 100))).toFixed(1));

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId,
          age,
          gender,
          height,
          weight,
          activityLevel,
          bmi: calculatedBmi,
          bmr,
          tdee,
          targetCalories,
          macros,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save calculation history.");
      }

      toast.success("Calculation history saved successfully!");
    } catch (error) {
      console.error("Save history error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your history.",
      );

      toast.error("Failed to save your health metrics.");
    } finally {
      setIsSavingHistory(false);
    }
  };

  const handleExport = async () => {
    const metrics = `FITORA ATHLETE HEALTH ASSESSMENT
Goal: ${goalLabel}
Age: ${age} | Gender: ${gender}
Height: ${height} cm | Weight: ${weight} kg
Activity: ${activityDescription}

BMI: ${bmi.toFixed(1)}
BMR: ${Math.round(bmr)} kcal/day
TDEE: ${Math.round(tdee)} kcal/day
Target Calories: ${Math.round(targetCalories)} kcal/day

Macros:
Protein: ${macros.protein}g (${macroPercentages.protein}%)
Carbs: ${macros.carbs}g (${macroPercentages.carbs}%)
Fats: ${macros.fats}g (${macroPercentages.fats}%)`;

    try {
      await navigator.clipboard.writeText(metrics);

      toast.success("Assessment copied. Opening print preview...");

      setTimeout(() => {
        window.print();
      }, 400);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export assessment.");
    }
  };

  return (
    <div className="w-full bg-black text-white selection:bg-white selection:text-black">
      <div className="mx-auto w-10/12 max-w-7xl pt-3 sm:pt-4">
        <div className="mx-auto flex max-w-2xl rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("bmi")}
            className={`flex-1 rounded-full px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "bmi"
                ? "bg-white text-black shadow-lg"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            BMI Calculator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("nutrition")}
            className={`flex-1 rounded-full px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "nutrition"
                ? "bg-white text-black shadow-lg"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            BMR & Daily Calories
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("goals")}
            className={`flex-1 rounded-full px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "goals"
                ? "bg-white text-black shadow-lg"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            Body Goals & Hydration
          </button>
        </div>
      </div>

      {/* =====================================================
          SECTION 1: HERO / BMI HEADER & CALCULATOR
      ====================================================== */}
      {activeTab === "bmi" && (
        <section className="bg-black px-4 pt-3 sm:pt-4 pb-8 text-white sm:px-6 lg:pt-3 lg:pb-10 select-none ">
          <div className="mx-auto w-11/12 max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* LEFT — BMI INFORMATION */}
              <div className="flex flex-col justify-between lg:col-span-6 space-y-4">
                {/* Header */}
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-4xl font-black font-sans uppercase tracking-tight text-white select-none">
                    Understand Your <br />
                    <span className="text-gray-400 font-normal">
                      BMI & Body Composition.
                    </span>
                  </h1>

                  <p
                    className="max-w-md text-gray-300 text-[11px] xs:text-xs sm:text-[13px] leading-[1.6] font-medium"
                    style={{ fontStyle: "italic" }}
                  >
                    BMI calculates your body mass relative to height. Use your
                    result alongside TDEE to plan your daily calories and
                    fitness targets.
                  </p>
                </div>

                {/* Full Color Image Banner (Positioned in the Middle, Object-Top to avoid cutting head) */}
                <div className="group relative h-40 sm:h-48 lg:h-52 my-auto overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80"
                    alt="BMI fitness banner"
                    className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105 brightness-100 contrast-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/20 bg-black/75 px-3 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-md">
                      BMI & NUTRITION ENGINE
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white drop-shadow">
                      Measure. Understand. Transform.
                    </p>

                    <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                      <ShieldCheck className="w-3 h-3 text-white" />
                      <span>WHO Standard Scale</span>
                    </div>
                  </div>
                </div>

                {/* BMI Categories & Info Cards (Detailed BMI Text) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="rounded-xl border border-white/15 bg-black p-2.5 space-y-0.5 text-center">
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

                  <div className="rounded-xl border border-white/15 bg-black p-2.5 space-y-0.5 text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      Normal Weight
                    </p>
                    <p className="text-xs font-black text-white">18.5 — 24.9</p>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-black p-2.5 space-y-0.5 text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      Overweight
                    </p>
                    <p className="text-xs font-black text-white">25.0 — 29.9</p>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-black p-2.5 space-y-0.5 text-center">
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
                <div className="mb-3 space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                    01 / INTERACTIVE SLIDERS
                  </span>

                  <h2 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-white">
                    Calculate Your BMI.
                  </h2>
                </div>

                <div className="flex-1 rounded-2xl bg-black border border-white/15 p-4 sm:p-5 shadow-2xl">
                  <BmiCalculator onBmiChange={setBmi} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SECTION 2: USER INFORMATION & MACRO BREAKDOWN (COMPACT & TIGHT)
      ====================================================== */}
      {activeTab === "nutrition" && (
        <section className="bg-black px-4 pt-3 sm:pt-4 pb-8 sm:px-6 lg:pb-10 select-none">
          <div className="mx-auto w-11/12 max-w-7xl">
            <div className="grid gap-5 lg:gap-6 lg:grid-cols-12 lg:items-start">
              {/* =================================================
                LEFT — PERSONAL INFORMATION FORM (40/60 Ratio: 40% Width)
            ================================================= */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-black border border-white/15 p-4 sm:p-5 space-y-3 shadow-2xl">
                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Header */}
                  <div className="space-y-0.5 border-b border-white/10 pb-2.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                      01 / PERSONAL PROFILE
                    </span>

                    <h2 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-white">
                      Tell Us{" "}
                      <span className="text-gray-400 font-normal">
                        About You.
                      </span>
                    </h2>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-2.5">
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
                        placeholder="e.g. 25"
                        onChange={(event) => {
                          setAge(Number(event.target.value));
                          setError(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-neutral-300 text-black placeholder:text-neutral-500 placeholder:font-medium text-xs font-bold outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
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
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-neutral-300 text-black text-xs font-bold outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
                      >
                        <option value="male" className="bg-white text-black">
                          Male
                        </option>
                        <option value="female" className="bg-white text-black">
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
                        placeholder="e.g. 175"
                        onChange={(event) => {
                          setHeight(Number(event.target.value));
                          setError(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-neutral-300 text-black placeholder:text-neutral-500 placeholder:font-medium text-xs font-bold outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
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
                        placeholder="e.g. 70"
                        onChange={(event) => {
                          setWeight(Number(event.target.value));
                          setError(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-neutral-300 text-black placeholder:text-neutral-500 placeholder:font-medium text-xs font-bold outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
                      />
                    </div>

                    {/* Target Weight */}
                    <div className="space-y-1">
                      <label
                        htmlFor="targetWeight"
                        className="block text-[9px] font-black uppercase tracking-widest text-gray-300"
                      >
                        Target Weight (KG)
                      </label>

                      <input
                        id="targetWeight"
                        type="number"
                        min="20"
                        max="300"
                        value={targetWeight}
                        placeholder="e.g. 65"
                        onChange={(event) => {
                          setTargetWeight(Number(event.target.value));
                          setError(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-neutral-300 text-black placeholder:text-neutral-500 placeholder:font-medium text-xs font-bold outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
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
                        onChange={(event) => {
                          setActivityLevel(Number(event.target.value));
                          setError(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-neutral-300 text-black text-xs font-bold outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
                      >
                        <option value={1.2} className="bg-white text-black">
                          Sedentary (Little/no exercise)
                        </option>
                        <option value={1.375} className="bg-white text-black">
                          Lightly Active (1–3 days/wk)
                        </option>
                        <option value={1.55} className="bg-white text-black">
                          Moderately Active (3–5 days/wk)
                        </option>
                        <option value={1.725} className="bg-white text-black">
                          Very Active (6–7 days/wk)
                        </option>
                        <option value={1.9} className="bg-white text-black">
                          Extremely Active (Physical Job)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Goal Selector Pill Buttons (Compact) */}
                  <div className="pt-2.5 border-t border-white/10 space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 block">
                      Choose Your Goal
                    </span>

                    <div className="space-y-1.5">
                      {goalOptions.map((item) => {
                        const isActive = goal === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setGoal(item.value)}
                            className={`flex w-full items-center justify-between p-2 sm:px-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                              isActive
                                ? "border-white bg-white text-black shadow-lg"
                                : "border-white/15 bg-black text-white hover:border-white/40 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black transition-colors ${
                                  isActive
                                    ? "bg-black text-white"
                                    : "bg-white/10 text-white"
                                }`}
                              >
                                {item.icon}
                              </span>

                              <span className="text-xs font-bold uppercase tracking-wider">
                                {item.label}
                              </span>
                            </div>

                            <span
                              className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                isActive
                                  ? "bg-black text-white font-black"
                                  : "bg-white/10 text-white"
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
              <div className="lg:col-span-7 space-y-3.5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-1.5">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                      02 / ENERGY & CALORIE TARGETS
                    </span>

                    <h2 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-white">
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
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* BMR Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black p-4 sm:p-5 text-white shadow-2xl">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[8px] font-black uppercase tracking-widest text-gray-300">
                          <Flame className="w-3 h-3 text-white" />
                          BMR (Basal Rate)
                        </span>

                        <motion.p
                          key={bmr}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white font-sans"
                        >
                          {bmr}{" "}
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            kcal/day
                          </span>
                        </motion.p>
                      </div>

                      <span className="text-sm font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        01
                      </span>
                    </div>

                    <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/10">
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
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black p-4 sm:p-5 text-white shadow-2xl">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[8px] font-black uppercase tracking-widest text-gray-300">
                          <Dumbbell className="w-3 h-3 text-white" />
                          TDEE (Expenditure)
                        </span>

                        <motion.p
                          key={tdee}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white font-sans"
                        >
                          {tdee}{" "}
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            kcal/day
                          </span>
                        </motion.p>
                      </div>

                      <span className="text-sm font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        02
                      </span>
                    </div>

                    <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/10">
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
                  className="rounded-2xl border border-white/15 bg-black p-4 sm:p-5 text-white shadow-2xl"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                        TARGET CALORIES
                      </span>

                      <motion.p
                        key={targetCalories}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans"
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

                    <div className="bg-white text-black font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg shrink-0">
                      {goal === "bulking"
                        ? "+500 KCAL (SURPLUS)"
                        : goal === "cutting"
                          ? "-500 KCAL (DEFICIT)"
                          : "MAINTENANCE (TDEE)"}
                    </div>
                  </div>
                </motion.div>

                {/* Macro Distribution Box */}
                <div className="rounded-2xl border border-white/15 bg-black p-4 sm:p-5 text-white shadow-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1.5 pb-2 border-b border-white/10">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                        03 / MACRONUTRIENT DISTRIBUTION
                      </span>

                      <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                        Macro Distribution
                      </h3>
                    </div>

                    <p className="text-[11px] text-gray-400 font-medium">
                      Daily protein, carbs and fats for your goal
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Protein */}
                    <div>
                      <div className="mb-1 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase text-white">
                            Protein
                          </p>
                          <p className="text-[8px] font-bold text-gray-400">
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

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
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
                      <div className="mb-1 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase text-white">
                            Carbs
                          </p>
                          <p className="text-[8px] font-bold text-gray-400">
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

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
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
                      <div className="mb-1 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase text-white">
                            Fats
                          </p>
                          <p className="text-[8px] font-bold text-gray-400">
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

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
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

                {/* Save & Export Actions Directly Under Calorie & Macro Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {/* Save History */}
                  <button
                    type="button"
                    onClick={handleSaveHistory}
                    disabled={isSavingHistory}
                    className="group inline-flex items-center justify-between w-full bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-[1.01] active:scale-[0.99] font-extrabold text-xs px-4 py-2.5 rounded-full transition-all duration-300 shadow-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      {isSavingHistory
                        ? "SAVING HISTORY..."
                        : "SAVE CALCULATION HISTORY"}
                    </span>

                    <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </button>

                  {/* Export */}
                  <button
                    type="button"
                    onClick={handleExport}
                    className="group inline-flex items-center justify-between w-full bg-black text-white border border-white/20 hover:border-white hover:bg-white/10 hover:scale-[1.01] active:scale-[0.99] font-extrabold text-xs px-4 py-2.5 rounded-full transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    <span>EXPORT METRICS & SUMMARY</span>

                    <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pro Athlete Macro Adjuster */}
            <div className="mt-4">
              <div className="mb-2">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                  04 / PRO ATHLETE MACRO ADJUSTER
                </span>

                <h2 className="mt-0.5 text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                  Pro Athlete{" "}
                  <span className="font-normal text-gray-400">
                    Macro Control.
                  </span>
                </h2>
              </div>

              <MacroAdjuster
                isPremium={isPremium}
                protein={macroPercentages.protein}
                carbs={macroPercentages.carbs}
                fats={macroPercentages.fats}
                onChange={handleMacroChange}
              />

              {/* Contextual Save Action for Custom Macros */}
              <div className="mt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-white">
                <p className="text-[11px] text-gray-400 font-medium">
                  Customized macro ratios apply to all your nutritional targets
                  and history.
                </p>
                <button
                  type="button"
                  onClick={handleSaveHistory}
                  disabled={isSavingHistory}
                  className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-4 py-2 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <span>
                    {isSavingHistory ? "Saving..." : "Save Custom Macros"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Full-Width Nutrition Tip Box */}
            <div className="mt-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center p-4 sm:p-5 gap-3.5 shadow-2xl text-white"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-lg">
                  <Utensils className="w-4 h-4 text-black" />
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
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SECTION 3: BODY GOALS & HYDRATION ARCHITECTURE
      ====================================================== */}
      {activeTab === "goals" && (
        <section className="bg-black px-4 pt-3 sm:pt-4 pb-8 sm:px-6 lg:pb-10 select-none">
          <div className="mx-auto w-11/12 max-w-7xl space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                  BODY TRANSFORMATION & HYDRATION ARCHITECTURE
                </span>
                <h1 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white">
                  Body Goals &{" "}
                  <span className="text-gray-400 font-normal">
                    Hydration Target.
                  </span>
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  Current: {weight} kg → Target: {targetWeight} kg
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-gray-400 backdrop-blur-md">
                  Goal: {goalLabel}
                </span>
              </div>
            </div>

            {/* 2-Column Grid: Timeline on Left, Hydration on Right */}
            <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
              {/* Left Column: Target Weight Timeline Projection */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/15 bg-black p-4 sm:p-5 text-white shadow-2xl space-y-3.5">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                        01 / TARGET PROJECTION
                      </span>
                      <h3 className="mt-0.5 text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                        Target Weight{" "}
                        <span className="font-normal text-gray-400">
                          Timeline.
                        </span>
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                      500 KCAL {goal === "cutting" ? "DEFICIT" : "SURPLUS"}
                    </span>
                  </div>

                  {/* Target Weight Quick Input & Save to Profile */}
                  <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <label
                        htmlFor="goals-target-weight"
                        className="text-[9px] font-black uppercase tracking-widest text-gray-300 flex items-center gap-1.5"
                      >
                        <Target className="w-3.5 h-3.5 text-white" />
                        Target Weight:
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          id="goals-target-weight"
                          type="number"
                          min="20"
                          max="300"
                          value={targetWeight}
                          onChange={(e) => {
                            setTargetWeight(Number(e.target.value));
                            setTargetWeightSaved(false);
                          }}
                          placeholder="65"
                          className="w-18 px-2.5 py-1 text-center rounded-xl bg-white border-2 border-neutral-300 text-black placeholder:text-neutral-500 placeholder:font-medium font-black text-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
                        />
                        <span className="text-xs font-bold text-gray-400">
                          KG
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveTargetWeight}
                      disabled={isSavingTargetWeight}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-extrabold text-black transition-all duration-300 hover:bg-neutral-100 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 shadow-md cursor-pointer shrink-0"
                    >
                      <span>
                        {isSavingTargetWeight
                          ? "SAVING..."
                          : targetWeightSaved
                            ? "✓ SAVED TO PROFILE"
                            : "SAVE TO PROFILE"}
                      </span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2.5 grid-cols-3">
                    {/* Current Weight */}
                    <div className="rounded-xl border border-white/15 bg-black p-2.5 sm:p-3 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                        Current
                      </p>
                      <p className="mt-0.5 text-lg sm:text-xl font-black text-white">
                        {weight}
                        <span className="ml-1 text-[10px] text-gray-500">
                          kg
                        </span>
                      </p>
                    </div>

                    {/* Target Weight */}
                    <div className="rounded-xl border border-white/15 bg-black p-2.5 sm:p-3 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                        Target
                      </p>
                      <p className="mt-0.5 text-lg sm:text-xl font-black text-white">
                        {targetWeight}
                        <span className="ml-1 text-[10px] text-gray-500">
                          kg
                        </span>
                      </p>
                    </div>

                    {/* Estimated Weeks */}
                    <div className="rounded-xl border border-white bg-white p-2.5 sm:p-3 text-black text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                        Estimated
                      </p>
                      <p className="mt-0.5 text-lg sm:text-xl font-black">
                        {timeline?.weeks ?? 0}
                        <span className="ml-1 text-[10px]">wks</span>
                      </p>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500">
                        Progress Projection
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">
                        {Math.abs(weight - targetWeight).toFixed(1)} kg{" "}
                        {weight > targetWeight ? "reduction" : "gain"}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Projection Message */}
                <div className="rounded-xl border border-white/15 bg-white/5 p-3 sm:p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-white">
                        {timeline && timeline.weeks > 0
                          ? `Projected: ${timeline.weeks} Weeks`
                          : "Target Achieved / Set a New Goal"}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                        {timeline && timeline.weeks > 0
                          ? `At 500 kcal daily ${goal === "cutting" ? "deficit" : "surplus"}, estimated to reach ${targetWeight} kg in ${timeline.weeks} weeks.`
                          : "Your target weight matches your current weight. Adjust your target weight above to project a transformation timeline."}
                      </p>
                      <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-gray-500">
                        Safe & Sustainable Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Automated Hydration Target */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/15 bg-black p-4 sm:p-5 text-white shadow-2xl space-y-3.5">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                        02 / HYDRATION TARGET
                      </span>
                      <h3 className="mt-0.5 text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                        Daily Water{" "}
                        <span className="font-normal text-gray-400">
                          Recommendation.
                        </span>
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                      AUTO CALCULATED
                    </span>
                  </div>

                  <div className="mt-3.5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500">
                        Daily Recommended Water
                      </p>
                      <motion.p
                        key={hydrationTargetLiters}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-0.5 text-3xl sm:text-4xl font-black tracking-tight text-white"
                      >
                        {hydrationTargetLiters.toFixed(1)}
                        <span className="ml-2 text-xs sm:text-sm font-bold text-gray-400">
                          Liters / Day
                        </span>
                      </motion.p>
                      <p className="mt-1 text-[10px] leading-relaxed text-gray-400">
                        Calculated from your weight ({weight} kg) & activity.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveHydration}
                      disabled={isSavingHydration}
                      className="inline-flex items-center justify-between gap-2.5 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-black transition-all duration-300 hover:bg-neutral-100 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg cursor-pointer"
                    >
                      <span>
                        {isSavingHydration
                          ? "SAVING..."
                          : hydrationSaved
                            ? "✓ SAVED TO PROFILE"
                            : "SAVE TO PROFILE"}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Hydration Breakdown Pills */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                        Base Need
                      </p>
                      <p className="mt-0.5 text-sm sm:text-base font-black text-white">
                        {(weight * 0.033).toFixed(2)} L
                      </p>
                      <p className="text-[8px] text-gray-500">
                        33ml / kg body weight
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                        Activity Bonus
                      </p>
                      <p className="mt-0.5 text-sm sm:text-base font-black text-white">
                        +
                        {activityLevel >= 1.725
                          ? "1.00"
                          : activityLevel >= 1.55
                            ? "0.75"
                            : "0.50"}{" "}
                        L
                      </p>
                      <p className="text-[8px] text-gray-500">
                        Sweat & workout recovery
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-3 sm:p-3.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Droplets className="w-3.5 h-3.5 text-black" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] leading-relaxed text-gray-400">
                    Optimal hydration accelerates nutrient transport, waste
                    removal, and muscular strength.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Full-Width Section: Athlete Health Assessment Card */}
            <div id="athlete-report-section" className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                    03 / PERFORMANCE REPORT
                  </span>
                  <h2 className="mt-0.5 text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                    Athlete Health{" "}
                    <span className="font-normal text-gray-400">
                      Assessment.
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                    PDF & Print Ready
                  </span>
                </div>
              </div>

              <AthleteHealthAssessmentCard
                age={age}
                gender={gender}
                height={height}
                weight={weight}
                bmi={bmi}
                bmr={bmr}
                tdee={tdee}
                targetCalories={targetCalories}
                goal={goal}
                macros={macros}
                macroPercentages={macroPercentages}
              />

              {/* Action Buttons for Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleExport}
                  className="group inline-flex items-center justify-between w-full bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.99] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xl cursor-pointer"
                >
                  <span>EXPORT METRICS & PRINT ASSESSMENT</span>
                  <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveHistory}
                  disabled={isSavingHistory}
                  className="group inline-flex items-center justify-between w-full bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.99] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {isSavingHistory
                      ? "SAVING HISTORY..."
                      : "SAVE CALCULATION HISTORY"}
                  </span>
                  <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
