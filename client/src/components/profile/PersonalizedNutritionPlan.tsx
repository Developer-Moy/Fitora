"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Utensils, ArrowUpRight, Lock, Crown, Copy, Check } from "lucide-react";
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
  );
}
