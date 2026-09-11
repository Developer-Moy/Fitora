"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  ArrowUpRight,
  Lock,
  Crown,
  Copy,
  Check,
  Sun,
  Flame,
  Moon,
  Sparkles,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  AuthUser,
  AUTH_SESSION_UPDATED,
} from "@/services/authService";
import { isFreePlan } from "@/lib/membershipUtils";

// Meal Plan Suggestions tailored by Fitness Goal
export const MEAL_SUGGESTIONS_BY_GOAL: Record<
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

export interface MealItem {
  type: string;
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  ingredients: string[];
  description: string;
}

export interface PersonalizedNutritionPlanProps {
  user?: AuthUser | null;
  planName?: string;
  fitnessGoal?: string;
  onUpgradeClick?: () => void;
  className?: string;
}

export default function PersonalizedNutritionPlan({
  user: propUser,
  planName: propPlanName,
  fitnessGoal: propFitnessGoal,
  onUpgradeClick,
  className = "",
}: PersonalizedNutritionPlanProps) {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(propUser || null);
  const [copiedMealIndex, setCopiedMealIndex] = useState<number | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"tabbed" | "all">("tabbed");

  useEffect(() => {
    const syncLocalUser = () => {
      const session = getAuthSession();
      if (session.user) {
        setLocalUser(session.user);
      }
    };

    syncLocalUser();
    window.addEventListener(AUTH_SESSION_UPDATED, syncLocalUser);
    return () => {
      window.removeEventListener(AUTH_SESSION_UPDATED, syncLocalUser);
    };
  }, []);

  // Handle direct recipe copy to clipboard
  const handleCopyMeal = (meal: MealItem, index: number) => {
    const textToCopy = `FITORA NUTRITION SUGGESTION (${meal.type})\nMeal: ${meal.name}\nMacros: ${meal.calories} kcal | ${meal.protein} Protein | ${meal.carbs} Carbs | ${meal.fats} Fats\nIngredients: ${meal.ingredients.join(", ")}\nPrep note: ${meal.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMealIndex(index);
    toast.success(`${meal.name} recipe & macros copied to clipboard!`);
    setTimeout(() => setCopiedMealIndex(null), 2000);
  };

  // Determine active session & claims
  const authSessionUser = authSession?.user as
    | {
        id?: string;
        email?: string;
        role?: string;
        plan?: string;
        fitnessGoal?: string;
      }
    | undefined;

  const sessionToken =
    typeof window !== "undefined"
      ? localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token")
      : null;

  const isAuthenticated = Boolean(
    propUser?.id ||
    propUser?._id ||
    propUser?.email ||
    localUser?.id ||
    localUser?._id ||
    localUser?.email ||
    authSessionUser?.id ||
    authSessionUser?.email ||
    sessionToken,
  );

  const userRole = (
    propUser?.role ||
    localUser?.role ||
    authSessionUser?.role ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_active_role") ||
        localStorage.getItem("fitora_user_role")
      : "") ||
    ""
  ).toLowerCase();

  const isPrivilegedRole =
    userRole === "master_admin" ||
    userRole === "branch_admin" ||
    userRole === "admin" ||
    userRole === "premium_user";

  const effectivePlanName =
    propPlanName ||
    propUser?.plan ||
    localUser?.plan ||
    authSessionUser?.plan ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_user_plan")
      : "") ||
    "Free Pass";

  const isFree = isFreePlan(effectivePlanName) && !isPrivilegedRole;

  const currentGoalKey =
    propFitnessGoal ||
    propUser?.fitnessGoal ||
    localUser?.fitnessGoal ||
    authSessionUser?.fitnessGoal ||
    effectivePlanName ||
    "Bulking & Muscle Gain";

  const goalData =
    MEAL_SUGGESTIONS_BY_GOAL[currentGoalKey] ||
    MEAL_SUGGESTIONS_BY_GOAL["Bulking & Muscle Gain"];

  // Hydration safety: While mounting on client, prevent flash of paid content
  if (!isMounted && !propUser) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                Personalized Nutrition Plan
              </h2>
              <p className="text-xs text-white/60">
                Custom meal recommendations tailored for your fitness goals
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-8 text-center text-white/40 animate-pulse">
          Loading nutrition recommendations...
        </div>
      </div>
    );
  }

  // ── State A: Unauthenticated User (Locked Banner) ──
  if (!isAuthenticated) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                Personalized Nutrition Plan
              </h2>
              <p className="text-xs text-white/60">
                Custom meal recommendations tailored for your fitness goals
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

        <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-8 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  Authentication Required
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
                  Personalized Nutrition Plan Locked
                </h3>
                <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                  Sign in to your FITORA account and select a membership plan to
                  unlock custom daily calorie targets, precision macro
                  breakdowns, and curated athletic meal plans.
                </p>
              </div>
            </div>

            <Link
              href="/login?redirect=/profile"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all shadow-xl shrink-0 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── State B: Authenticated FREE User (Upgrade Banner) ──
  if (isFree) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                Personalized Nutrition Plan
              </h2>
              <p className="text-xs text-white/60">
                Custom meal recommendations tailored for your fitness goals
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

        <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-8 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  Free Member Tier
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
                  Upgrade to Access Custom Nutrition
                </h3>
                <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                  You are currently on the{" "}
                  <strong className="text-white font-bold">
                    Standard Free Pass
                  </strong>
                  . Upgrade to{" "}
                  <strong className="text-white font-bold">Pro Athlete</strong>{" "}
                  or{" "}
                  <strong className="text-white font-bold">VIP Ultimate</strong>{" "}
                  to unlock automated macro targets, goal-tailored nutrition
                  recommendations, and 1-click recipe exports.
                </p>
              </div>
            </div>

            {onUpgradeClick ? (
              <button
                type="button"
                onClick={onUpgradeClick}
                className="group inline-flex items-center gap-2.5 bg-white text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all shadow-xl shrink-0 cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </button>
            ) : (
              <Link
                href="/#pricing"
                className="group inline-flex items-center gap-2.5 bg-white text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all shadow-xl shrink-0 cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── State C: Authenticated NON-FREE User (Original Nutrition Plan) ──
  return (
    <div className={`space-y-4 ${className}`}>
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

        {/* Meal Selector & View Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          {/* Meal Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {goalData.meals.map((m, idx) => {
              const isSelected =
                selectedMealIndex === idx && viewMode === "tabbed";
              const mealIcon =
                idx === 0 ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : idx === 1 ? (
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                );

              const shortLabel =
                idx === 0 ? "Breakfast" : idx === 1 ? "Lunch" : "Dinner";

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedMealIndex(idx);
                    setViewMode("tabbed");
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {mealIcon}
                  <span>{shortLabel}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-black/10 text-black font-bold"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {m.calories} kcal
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <button
            type="button"
            onClick={() =>
              setViewMode((prev) => (prev === "tabbed" ? "all" : "tabbed"))
            }
            className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer shrink-0 ml-auto sm:ml-0"
          >
            <Layers className="w-3.5 h-3.5 text-white/80" />
            <span>
              {viewMode === "tabbed" ? "View All 3 Meals" : "Tabbed View"}
            </span>
          </button>
        </div>

        {/* ── View 1: Focused Tabbed Meal Card (Default) ── */}
        {viewMode === "tabbed" &&
          (() => {
            const meal = goalData.meals[selectedMealIndex] || goalData.meals[0];
            const mealIcon =
              selectedMealIndex === 0 ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : selectedMealIndex === 1 ? (
                <Flame className="w-4 h-4 text-orange-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-300" />
              );

            return (
              <div className="space-y-4">
                {/* Active Meal Hero Card */}
                <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-black uppercase tracking-wider border border-white/10">
                        {mealIcon}
                        {meal.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-black shadow-md">
                        {meal.calories} kcal
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyMeal(meal, selectedMealIndex)}
                      className="inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-extrabold text-xs px-4 py-2 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer shrink-0"
                    >
                      {copiedMealIndex === selectedMealIndex ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-extrabold">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Recipe & Macros</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                      {meal.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {meal.description}
                    </p>
                  </div>

                  {/* Macro Split Boxes */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] font-bold text-white/60 block uppercase">
                        Protein
                      </span>
                      <span className="text-sm font-black text-white">
                        {meal.protein}
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] font-bold text-white/60 block uppercase">
                        Carbs
                      </span>
                      <span className="text-sm font-black text-white">
                        {meal.carbs}
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] font-bold text-white/60 block uppercase">
                        Fats
                      </span>
                      <span className="text-sm font-black text-white">
                        {meal.fats}
                      </span>
                    </div>
                  </div>

                  {/* Ingredients 2-Column Grid */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white/60">
                        Ingredients & Portions
                      </span>
                      <span className="text-[10px] text-white/40">
                        {meal.ingredients.length} items
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {meal.ingredients.map((ing, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/90"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                          <span className="leading-tight">{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Day at a Glance Quick-Select Strip */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/50 block">
                    Quick Switch Meal
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {goalData.meals.map((m, idx) => {
                      const isActive = idx === selectedMealIndex;
                      const label =
                        idx === 0
                          ? "Breakfast"
                          : idx === 1
                            ? "Lunch"
                            : "Dinner";
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedMealIndex(idx)}
                          className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? "bg-white/15 border-white text-white shadow-md"
                              : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wide">
                              {label}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-white/10">
                              {m.calories}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-white/90 truncate">
                            {m.name}
                          </p>
                          <p className="text-[9px] text-white/50 mt-0.5">
                            P: {m.protein} • C: {m.carbs}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

        {/* ── View 2: Stacked All Meals (Non-Cramped 1-Column) ── */}
        {viewMode === "all" && (
          <div className="space-y-4 pt-1">
            {goalData.meals.map((meal, index) => {
              const mealIcon =
                index === 0 ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : index === 1 ? (
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                );

              return (
                <div
                  key={index}
                  className="bg-black border border-white/20 hover:border-white/30 rounded-2xl p-5 space-y-3.5 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-wider">
                        {mealIcon}
                        {meal.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-black">
                        {meal.calories} kcal
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyMeal(meal, index)}
                      className="inline-flex items-center justify-center gap-1.5 bg-white text-black font-extrabold text-xs px-3.5 py-1.5 rounded-full hover:bg-neutral-100 transition-all cursor-pointer self-start sm:self-auto"
                    >
                      {copiedMealIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-extrabold text-[11px]">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">Copy Recipe</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      {meal.name}
                    </h4>
                    <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                      {meal.description}
                    </p>
                  </div>

                  {/* Macro Split Badge */}
                  <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                    <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      Protein: {meal.protein}
                    </span>
                    <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      Carbs: {meal.carbs}
                    </span>
                    <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      Fats: {meal.fats}
                    </span>
                  </div>

                  {/* Ingredients */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {meal.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white/80"
                      >
                        <span className="w-1 h-1 rounded-full bg-white/70 shrink-0" />
                        <span>{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
