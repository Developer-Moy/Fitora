"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Dumbbell,
  Clock,
  Utensils,
  Activity,
  ArrowUpRight,
  LogOut,
  Edit3,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Droplets,
  Award,
  Loader2,
  Trash2,
  Copy,
  ChevronRight,
  Check,
  History,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  clearAuthSession,
  logoutUser,
  AuthUser,
} from "@/services/authService";
import {
  uploadToImgBB,
  readFileAsDataURL,
} from "@/services/imageUploadService";
import { getWorkoutLogs } from "@/services/workoutService";
import type { WorkoutLog } from "@/types/workout";
import MealCard from "@/components/meals/MealCard";
import {
  getDailyMealPlan,
  SavedMealPlanItem,
} from "@/services/dailyMealPlanService";
import { deleteBmiHistory } from "@/services/bmiService";
import { fetchMealCharts, type MealChart } from "@/services/mealChartService";

interface BMIHistory {
  _id: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  createdAt: string;
}

// Removed DEFAULT_WORKOUT_HISTORY

// Meal Plan Suggestions tailored by Fitness Goal
const MEAL_SUGGESTIONS_BY_GOAL: Record<
  string,
  {
    targetCalories: string;
    protein: string;
    carbs: string;
    fats: string;
    hydration: string;
    advice: string;
    meals: {
      type: string;
      name: string;
      calories: number;
      protein: string;
      carbs: string;
      fats: string;
      ingredients: string[];
      description: string;
    }[];
  }
> = {
  "Bulking & Muscle Gain": {
    targetCalories: "2,950 kcal",
    protein: "185g",
    carbs: "360g",
    fats: "80g",
    hydration: "3.8 L",
    advice:
      "Maintain a 400-500 kcal surplus with nutrient-dense complex carbohydrates, lean red meat, poultry, and healthy dietary fats.",
    meals: [
      {
        type: "Breakfast (Power Start)",
        name: "Double Oatmeal with Whey & Peanut Butter Bowl",
        calories: 720,
        protein: "48g",
        carbs: "85g",
        fats: "22g",
        ingredients: [
          "100g Rolled Oats",
          "1.5 Scoops Whey Isolate",
          "2 Tbsp Natural Peanut Butter",
          "1 Sliced Banana",
          "200ml Almond Milk",
        ],
        description:
          "High glycemic carb replenish combined with slow digesting fats for prolonged morning anabolism.",
      },
      {
        type: "Lunch (Post-Workout Recovery)",
        name: "Grilled Steak Bowl with Brown Rice & Avocado",
        calories: 860,
        protein: "55g",
        carbs: "90g",
        fats: "28g",
        ingredients: [
          "200g Lean Beef Sirloin",
          "250g Cooked Brown Rice",
          "1/2 Fresh Avocado",
          "1 Cup Steamed Broccoli",
          "1 Tbsp Olive Oil Drizzle",
        ],
        description:
          "Natural creatine from sirloin paired with nutrient-rich brown rice and monounsaturated healthy fats.",
      },
      {
        type: "Dinner (Overnight Recovery)",
        name: "Baked Atlantic Salmon with Sweet Potatoes & Asparagus",
        calories: 780,
        protein: "52g",
        carbs: "75g",
        fats: "26g",
        ingredients: [
          "220g Atlantic Salmon Fillet",
          "300g Roasted Sweet Potatoes",
          "150g Grilled Asparagus",
          "Lemon Herb Seasoning",
        ],
        description:
          "Rich in Omega-3 fatty acids to reduce joint inflammation and support deep REM hormone production.",
      },
    ],
  },
  "Fat Loss & Cutting": {
    targetCalories: "1,950 kcal",
    protein: "175g",
    carbs: "140g",
    fats: "50g",
    hydration: "4.0 L",
    advice:
      "Maintain a 400-500 kcal deficit while keeping protein high at 2.2g per kg of bodyweight to preserve lean muscle tissue.",
    meals: [
      {
        type: "Breakfast (High Protein)",
        name: "Egg White Veggie Scramble with Avocado Toast",
        calories: 420,
        protein: "38g",
        carbs: "28g",
        fats: "14g",
        ingredients: [
          "6 Egg Whites + 1 Whole Egg",
          "1 Cup Baby Spinach & Diced Bell Peppers",
          "1 Slice Whole Grain Sourdough",
          "30g Sliced Avocado",
        ],
        description:
          "Satiating low-calorie breakfast with high volume greens and quality amino acids.",
      },
      {
        type: "Lunch (Lean Fuel)",
        name: "Herb Grilled Chicken Breast with Quinoa Salad",
        calories: 560,
        protein: "54g",
        carbs: "45g",
        fats: "12g",
        ingredients: [
          "220g Skinless Chicken Breast",
          "120g Cooked Quinoa",
          "Cucumber, Cherry Tomatoes & Red Onion",
          "Fresh Lemon & Herb Vinaigrette",
        ],
        description:
          "Ultra-lean protein delivery with complete amino profile quinoa and micronutrient dense salad.",
      },
      {
        type: "Dinner (Low-Carb Satiety)",
        name: "Seared White Fish with Cauliflower Mash & Green Beans",
        calories: 480,
        protein: "46g",
        carbs: "22g",
        fats: "16g",
        ingredients: [
          "240g White Cod or Tilapia Fillet",
          "200g Steamed & Mashed Cauliflower with Garlic",
          "150g Sautéed Green Beans in Olive Oil",
        ],
        description:
          "High volume, very low calorie dinner to eliminate late night cravings while accelerating fat oxidation.",
      },
    ],
  },
  "Strength & Conditioning": {
    targetCalories: "2,550 kcal",
    protein: "180g",
    carbs: "270g",
    fats: "70g",
    hydration: "3.5 L",
    advice:
      "Balanced performance nutrition optimizing glycogen replenishment and central nervous system recovery.",
    meals: [
      {
        type: "Breakfast (Power Fuel)",
        name: "Protein Pancakes with Greek Yogurt & Mixed Berries",
        calories: 590,
        protein: "45g",
        carbs: "72g",
        fats: "12g",
        ingredients: [
          "Oat Flour & Egg White Batter",
          "1 Scoop Whey Isolate",
          "150g Non-fat Greek Yogurt",
          "1/2 Cup Fresh Blueberries & Honey",
        ],
        description:
          "Sustained energy release ideal for intense athletic lifting and cardiovascular sessions.",
      },
      {
        type: "Lunch (Athletic Plate)",
        name: "Lean Turkey Breast Wrap with Hummus & Roasted Veggies",
        calories: 680,
        protein: "52g",
        carbs: "70g",
        fats: "18g",
        ingredients: [
          "200g Roasted Turkey Breast",
          "Large Whole Wheat Tortilla",
          "2 Tbsp Garlic Hummus",
          "Roasted Zucchini, Peppers & Spinach",
        ],
        description:
          "Balanced glycemic index meal ensuring stable insulin levels throughout training windows.",
      },
      {
        type: "Dinner (Recovery)",
        name: "Grilled Flank Steak with Basmati Rice & Grilled Corn",
        calories: 740,
        protein: "50g",
        carbs: "68g",
        fats: "22g",
        ingredients: [
          "190g Grilled Flank Steak",
          "180g Steamed Basmati Rice",
          "Grilled Sweet Corn Cob",
          "Side Garden Salad",
        ],
        description:
          "Packed with zinc, iron, and B-vitamins to accelerate muscular rebuilding and power regeneration.",
      },
    ],
  },
  Maintenance: {
    targetCalories: "2,350 kcal",
    protein: "160g",
    carbs: "240g",
    fats: "65g",
    hydration: "3.2 L",
    advice:
      "Maintain homeostatic caloric equilibrium while cycling nutrient timing around daily workout routines.",
    meals: [
      {
        type: "Breakfast",
        name: "Avocado & Poached Eggs on Toasted Rye",
        calories: 520,
        protein: "26g",
        carbs: "42g",
        fats: "24g",
        ingredients: [
          "2 Whole Poached Eggs",
          "2 Slices Toasted Rye Bread",
          "1/2 Mashed Avocado with Chili Flakes",
          "Handful of Arugula",
        ],
        description:
          "Nutritious balance of wholesome fats, complex carbohydrates, and clean proteins.",
      },
      {
        type: "Lunch",
        name: "Mediterranean Chicken Bowl with Couscous",
        calories: 680,
        protein: "48g",
        carbs: "65g",
        fats: "18g",
        ingredients: [
          "180g Marinated Chicken Thighs",
          "150g Whole Wheat Couscous",
          "Kalamata Olives, Cucumbers & Feta Cheese",
          "Tzatziki Sauce",
        ],
        description:
          "Delicious heart-healthy meal full of polyphenols and high biological value protein.",
      },
      {
        type: "Dinner",
        name: "Teriyaki Tofu or Salmon Stir-Fry with Jasmine Rice",
        calories: 620,
        protein: "42g",
        carbs: "70g",
        fats: "16g",
        ingredients: [
          "200g Fresh Salmon or Firm Organic Tofu",
          "180g Steamed Jasmine Rice",
          "Snap Peas, Carrots, & Broccoli",
          "Low-Sodium Teriyaki Glaze",
        ],
        description:
          "Light yet deeply nourishing dinner optimized for effortless metabolic digestion.",
      },
    ],
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [copiedMealIndex, setCopiedMealIndex] = useState<number | null>(null);
  const [dailyPlanMeals, setDailyPlanMeals] = useState<SavedMealPlanItem[]>([]);
  const [isLoadingDailyPlan, setIsLoadingDailyPlan] = useState<boolean>(true);

  const [history, setHistory] = useState<BMIHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // Edit Modal State

  useEffect(() => {
    setIsMounted(true);
    const session = getAuthSession();
    if (session.user) {
      setLocalUser(session.user);
    }
  }, []);

  useEffect(() => {
    const fetchBMIHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bmi/history`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch BMI history");
        }

        const data = await response.json();

        console.log("BMI HISTORY API RESPONSE:", data);

        const historyData = Array.isArray(data?.data?.history)
          ? data.data.history
          : [];

        setHistory(historyData);
      } catch (error) {
        console.error("BMI history fetch error:", error);
        setHistoryError("Failed to load your calculation history.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchBMIHistory();
  }, []);

  const handleDeleteHistory = async (id: string) => {
    try {
      const success = await deleteBmiHistory(id);

      if (!success) {
        toast.error("Failed to delete history.");
        return;
      }

      setHistory((prev) => prev.filter((item) => item._id !== id));

      toast.success("Calculation history deleted successfully.");
    } catch (error) {
      console.error("Delete BMI history error:", error);
      toast.error("Failed to delete history.");
    }
  };

  const activeUser = { ...authSession?.user, ...localUser };
  const userName = activeUser?.name || "Athlete Member";
  const userEmail = activeUser?.email || "athlete@fitora.com";
  const userInitial = userName.charAt(0).toUpperCase() || "A";
  const userRole = (activeUser as any)?.role || "athlete";
  const userAvatar =
    localUser?.avatarUrl ||
    (activeUser as any)?.image ||
    (activeUser as any)?.avatarUrl ||
    "";
  const isMasterAdmin =
    userRole === "master_admin" ||
    userEmail.toLowerCase().includes("master@fitora.com");
  const isBranchAdmin =
    userRole === "branch_admin" ||
    userEmail.toLowerCase().includes("admin@fitora");

  const resolvedUserId =
    authSession?.user?.id ||
    localUser?.id ||
    localUser?._id ||
    (typeof window !== "undefined"
      ? (localStorage.getItem("fitora_user_email") ?? undefined)
      : undefined);

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);

  const [mealChart, setMealChart] = useState<MealChart | null>(null);

  const currentGoalKey =
    mealChart?.goals?.fitnessGoal ||
    localUser?.fitnessGoal ||
    localUser?.plan ||
    "Bulking & Muscle Gain";

  const goalData =
    MEAL_SUGGESTIONS_BY_GOAL[currentGoalKey] ||
    MEAL_SUGGESTIONS_BY_GOAL["Bulking & Muscle Gain"];

  useEffect(() => {
    if (!resolvedUserId) {
      setIsLoadingDailyPlan(false);
      setIsLoadingWorkouts(false);
      return;
    }

    const fetchData = async () => {
      setIsLoadingDailyPlan(true);
      setIsLoadingWorkouts(true);
      try {
        const [dailyPlanRes, workoutsRes, mealChartsRes] = await Promise.all([
          getDailyMealPlan(resolvedUserId),
          getWorkoutLogs(resolvedUserId, 20).catch(() => ({ logs: [] })),
          fetchMealCharts(resolvedUserId).catch(() => []),
        ]);

        if (dailyPlanRes.success && dailyPlanRes.data) {
          setDailyPlanMeals(dailyPlanRes.data);
        }
        if (workoutsRes && workoutsRes.logs) {
          setWorkoutLogs(workoutsRes.logs);
        }
        if (mealChartsRes && mealChartsRes.length > 0) {
          setMealChart(mealChartsRes[0]);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setIsLoadingDailyPlan(false);
        setIsLoadingWorkouts(false);
      }
    };

    fetchData();
  }, [resolvedUserId]);

  // Handle direct file selection & upload (Local Preview + ImgBB Cloud Sync)
  const handleCopyMeal = (meal: any, index: number) => {
    const textToCopy = `FITORA NUTRITION SUGGESTION (${meal.type})\nMeal: ${meal.name}\nMacros: ${meal.calories} kcal | ${meal.protein} Protein | ${meal.carbs} Carbs | ${meal.fats} Fats\nIngredients: ${meal.ingredients.join(", ")}\nPrep note: ${meal.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMealIndex(index);
    toast.success(`${meal.name} recipe & macros copied to clipboard!`);
    setTimeout(() => setCopiedMealIndex(null), 2000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch { }
    toast.success("Logged out successfully. See you soon, Champion!");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black py-12 sm:py-16 px-6 sm:px-10 lg:px-16 select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ── Page Header (Homepage Style) ── */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            Athlete Profile
          </h1>
          <p
            className="text-white/80 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Track your progress, update your details, and unlock your full
            athletic potential.
          </p>
        </div>

        {/* ── 1. Athlete Header Card ── */}
        <div className="bg-black border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Subtle gradient overlay effect from homepage cards */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-50" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
            {/* Left: Avatar with Upload Overlay & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Profile Avatar with Camera Trigger */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black border-2 border-white/20 overflow-hidden flex items-center justify-center text-white font-black text-4xl shadow-xl">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>

                {/* Camera Upload Button */}
              </div>

              {/* Identity & Membership Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                    {userName}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black shadow-md">
                    {isMasterAdmin
                      ? "MASTER ADMIN"
                      : isBranchAdmin
                        ? "BRANCH ADMIN"
                        : "PRO ATHLETE"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/60 font-medium">
                  {localUser?.bio || "Fitora Certified Athlete Member"}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/60 flex-wrap pt-1">
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <Mail className="w-3.5 h-3.5" />
                    {userEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-white/80" />
                    {localUser?.assignedBranch || "Gulshan-2 Flagship"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <Link
                href="/profile/edit"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer shadow-xl"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-black text-white border border-white/20 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer shadow-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Information Sections (Personal & Physical Profile Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Personal & Contact Information */}
          <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white/60" />
                <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Personal Details
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Full Name</span>
                <span className="text-white font-bold">{userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Email Address</span>
                <span className="text-white font-semibold">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Phone Number</span>
                <span className="text-white font-semibold">
                  {localUser?.phone || "+880 1700-000000"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Gender</span>
                <span className="text-white font-semibold">
                  {localUser?.gender || "Male"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Preferred Branch</span>
                <span className="text-white font-semibold">
                  {localUser?.assignedBranch || "Gulshan-2 Flagship Branch"}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Physical & Fitness Metrics */}
          <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-white/60" />
                <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Fitness & Physical Profile
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Self-Reported
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Primary Goal</span>
                <span className="text-white font-bold uppercase">
                  {localUser?.fitnessGoal ||
                    localUser?.plan ||
                    "Bulking & Muscle Gain"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Body Weight</span>
                <span className="text-white font-semibold">
                  {localUser?.weight || "74"} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Height</span>
                <span className="text-white font-semibold">
                  {localUser?.height || "178"} cm
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Activity Level</span>
                <span className="text-white font-semibold">
                  {localUser?.activityLevel || "4-5 Days / Week"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Daily Water Target</span>
                <span className="text-white font-semibold">
                  {goalData.hydration}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Gym & Workout History Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <History className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                Gym & Workout History
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60 font-medium hidden sm:inline">
                {workoutLogs.length} Logged Sessions
              </span>
              <Link
                href="/stopwatch"
                className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start New Session</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {/* Dynamic Rendering: Show workouts if they exist, otherwise show Empty State */}
            {isLoadingWorkouts ? (
              <div className="bg-black border border-white/20 rounded-2xl p-8 flex justify-center text-white/50 text-sm">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading
                workouts...
              </div>
            ) : workoutLogs && workoutLogs.length > 0 ? (
              workoutLogs.map((log) => (
                <div
                  key={log._id || Math.random().toString()}
                  className="bg-black border border-white/20 hover:border-white/30 rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-extrabold uppercase text-white">
                          {log.exerciseName || "Workout"}
                        </h3>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        {log.date
                          ? new Date(log.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "Recently"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-white/80">
                      <span className="inline-flex items-center gap-1 bg-black border border-white/20 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-white/60" />
                        {log.durationMinutes} min
                      </span>
                      {log.weight && log.weight > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-black border border-white/20 px-3 py-1.5 rounded-full text-white">
                          <Dumbbell className="w-3.5 h-3.5 text-white" />
                          {log.weight} kg
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                      Stats ({log.setsCount} Sets, {log.repsCount} Reps)
                    </p>
                    {log.notes && (
                      <div className="flex items-center gap-2 text-xs text-white/80 bg-black px-3 py-2 rounded-xl border border-white/5">
                        <span className="truncate">{log.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              /* Empty State for Workouts */
              <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <Dumbbell className="w-10 h-10 text-white/20" />
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black uppercase text-white">
                    No Workouts Logged
                  </h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    Your gym history is currently empty. Start your first
                    session using the stopwatch to track your progress!
                  </p>
                </div>
                <Link
                  href="/stopwatch"
                  className="mt-2 group inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-xl hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Clock className="w-4 h-4" />
                  <span>Start First Session</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. BMI, BMR & TDEE Calculation History ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />

              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  Calculation History
                </h2>

                <p className="text-xs text-white/60 mt-1">
                  Your previous BMI, BMR and TDEE calculations
                </p>
              </div>
            </div>
          </div>

          {historyLoading ? (
            <div className="bg-black border border-white/20 rounded-2xl p-10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-white/60" />
            </div>
          ) : historyError ? (
            <div className="bg-black border border-red-500/20 rounded-2xl p-6 text-center">
              <p className="text-sm text-red-400">{historyError}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3">
              <TrendingUp className="w-10 h-10 text-white/20" />

              <h3 className="text-base sm:text-lg font-black uppercase text-white">
                No Calculation History
              </h3>

              <p className="text-xs text-white/60 max-w-sm">
                Your BMI, BMR and TDEE calculation history will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-black border border-white/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                      <th className="px-5 py-4 font-bold">Date</th>

                      <th className="px-5 py-4 font-bold">Weight</th>

                      <th className="px-5 py-4 font-bold">BMI</th>

                      <th className="px-5 py-4 font-bold">BMR</th>

                      <th className="px-5 py-4 font-bold">TDEE</th>

                      <th className="px-5 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-white/70">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-white">
                          {item.weight} kg
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-black text-white">
                            {item.bmi.toFixed(1)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-white/70">
                          {item.bmr} kcal
                        </td>

                        <td className="px-5 py-4 text-sm text-white/70">
                          {item.tdee} kcal
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteHistory(item._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200/30 text-red-200 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── 5. Meal Suggestion According to Profile ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  Personalized Nutrition Plan
                </h2>
                <p className="text-xs text-white/60">
                  Custom meal recommendations tailored for{" "}
                  <strong className="text-white uppercase font-bold">
                    {currentGoalKey}
                  </strong>
                </p>
              </div>
            </div>

            <Link
              href="/meals"
              className="inline-flex items-center gap-1 text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              <span>Explore All Recipes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Nutrition Macro Target Banner */}
          <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  Daily Macro Target ({currentGoalKey})
                </span>
                <p className="text-xs sm:text-sm text-white/80">
                  {goalData.advice}
                </p>
              </div>

              {/* Macro Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto shrink-0">
                <div className="bg-black border border-white/20 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-white/60 block uppercase">
                    Calories
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.targetCalories}
                  </span>
                </div>
                <div className="bg-black border border-white/20 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-white/60 block uppercase">
                    Protein
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.protein}
                  </span>
                </div>
                <div className="bg-black border border-white/20 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-white/60 block uppercase">
                    Carbs
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.carbs}
                  </span>
                </div>
                <div className="bg-black border border-white/20 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-white/60 block uppercase">
                    Fats
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.fats}
                  </span>
                </div>
              </div>
            </div>

            {/* Curated Daily Meal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              {goalData.meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-black border border-white/20 hover:border-white/25 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                        {meal.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-black">
                        {meal.calories} kcal
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-white leading-snug">
                        {meal.name}
                      </h4>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">
                        {meal.description}
                      </p>
                    </div>

                    {/* Macro Split Badge */}
                    <div className="flex items-center gap-2 text-[11px] font-bold text-white/80">
                      <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                        P: {meal.protein}
                      </span>
                      <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                        C: {meal.carbs}
                      </span>
                      <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                        F: {meal.fats}
                      </span>
                    </div>

                    {/* Ingredients List */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                        Ingredients:
                      </span>
                      <ul className="text-xs text-white/60 space-y-0.5 list-disc list-inside">
                        {meal.ingredients.map((ing, i) => (
                          <li key={i} className="truncate">
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Copy Recipe Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyMeal(meal, index)}
                    className="group w-full flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    {copiedMealIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                        <span className="text-emerald-600 font-extrabold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Copy Recipe & Macros</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4.5. My Saved Daily Meal Plan Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  Saved Daily Meal Plan
                </h2>
                <p className="text-xs text-white/60">
                  Meals saved directly to your account
                </p>
              </div>
            </div>

            <Link
              href="/meals"
              className="inline-flex items-center gap-1 text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              <span>Add More Meals</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingDailyPlan ? (
            <div className="bg-black border border-white/20 rounded-2xl p-8 flex items-center justify-center text-white/60">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading Daily Meal Plan...
              </span>
            </div>
          ) : dailyPlanMeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyPlanMeals.map((item) => (
                <MealCard
                  key={item._id}
                  id={item.mealId || item._id}
                  name={item.name}
                  ingredients={item.ingredients}
                  calories={item.calories}
                  description={item.description}
                  img={item.img}
                />
              ))}
            </div>
          ) : (
            <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <Utensils className="w-10 h-10 text-white/20" />
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black uppercase text-white">
                  No Meals Saved Yet
                </h3>
                <p className="text-xs text-white/60 max-w-sm mx-auto">
                  Your daily meal plan is empty. Browse recipes and click "Add
                  to Daily Plan" to save meals here!
                </p>
              </div>
              <Link
                href="/meals"
                className="mt-2 inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-xl"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Recipes</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── 5. Admin Management Access (If Admin) ── */}
        {(isMasterAdmin || isBranchAdmin) && (
          <div className="bg-black border border-white/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <h3 className="text-sm font-black uppercase text-white">
                  Elevated Staff Dashboard
                </h3>
              </div>
              <p className="text-xs text-white/60">
                Authorized staff portal for branches, athlete rosters, and
                leads.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all shrink-0 shadow-lg"
            >
              <span>Open Dashboard</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
