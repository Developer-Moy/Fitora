"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowUpRight,
  Loader2,
  Utensils,
  Copy,
  Check,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";
import MealCard from "@/components/meals/MealCard";
import type { SavedMealPlanItem } from "@/services/dailyMealPlanService";

export interface SavedMealPlanProps {
  dailyPlanMeals?: SavedMealPlanItem[];
  isLoadingDailyPlan?: boolean;
  meals?: SavedMealPlanItem[];
  isLoading?: boolean;
}

const TARGET_CALORIES = 2950; // it will dynamically change in the future based on user profile settings, but for now it's hardcoded to 2950 kcal

export default function SavedMealPlan({
  dailyPlanMeals,
  isLoadingDailyPlan,
  meals,
  isLoading,
}: SavedMealPlanProps) {
  const items = dailyPlanMeals ?? meals ?? [];
  const loading = isLoadingDailyPlan ?? isLoading ?? false;
  const [isCopied, setIsCopied] = useState(false);

  // ── Calorie Progress Calculations (Target: 2950 kcal) ──
  const totalCalories = Math.round(
    items.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0)
  );
  const percentage = Math.round((totalCalories / TARGET_CALORIES) * 100);
  const progressWidth = Math.min(
    Math.max((totalCalories / TARGET_CALORIES) * 100, 0),
    100
  );

  const calorieStatusText =
    totalCalories < TARGET_CALORIES
      ? `${TARGET_CALORIES - totalCalories} kcal remaining`
      : totalCalories === TARGET_CALORIES
      ? "Goal reached"
      : `${totalCalories - TARGET_CALORIES} kcal over target`;

  const handleCopyGroceryList = async () => {
    // 1. Collect all ingredients from the saved meals and remove duplicates
    const seen = new Set<string>();
    const uniqueIngredients: string[] = [];

    for (const meal of items) {
      if (!Array.isArray(meal.ingredients)) continue;

      for (const rawIngredient of meal.ingredients) {
        if (typeof rawIngredient !== "string") continue;
        const trimmed = rawIngredient.trim();
        if (!trimmed) continue;

        const normalized = trimmed.toLowerCase();
        if (!seen.has(normalized)) {
          seen.add(normalized);
          uniqueIngredients.push(trimmed);
        }
      }
    }

    // 2. Safely handle empty ingredients edge case
    if (uniqueIngredients.length === 0) {
      toast.error("No ingredients available to copy.");
      return;
    }

    // 3. Combine into one ingredient per line
    const groceryListText = uniqueIngredients.join("\n");

    // 4. Copy to clipboard with browser fallback
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(groceryListText);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = groceryListText;
        textarea.style.position = "fixed";
        textarea.style.left = "-999999px";
        textarea.style.top = "-999999px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!success) {
          throw new Error("Copy command failed");
        }
      } else {
        throw new Error("Clipboard API unavailable");
      }

      setIsCopied(true);
      toast.success("Grocery list copied successfully!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy grocery list:", err);
      toast.error("Failed to copy grocery list.");
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Section Header ── */}
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

      {/* ── Main Content (Loading / Cards Grid / Empty State) ── */}
      {loading ? (
        <div className="bg-black border border-white/20 rounded-2xl p-8 flex items-center justify-center text-white/60">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Loading Daily Meal Plan...
          </span>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
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
              Your daily meal plan is empty. Browse recipes and click
              &quot;Add to Daily Plan&quot; to save meals here!
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

      {/* ── Copy Grocery List Action Button ── */}
      {!loading && (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={handleCopyGroceryList}
            className="inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{isCopied ? "Grocery List Copied!" : "Copy Grocery List"}</span>
          </button>
        </div>
      )}

      {/* ── 2950 kcal Daily Calorie Progress Bar ── */}
      {!loading && (
        <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                Daily Calorie Progress
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs sm:text-sm font-black text-white">
                {totalCalories} / {TARGET_CALORIES} kcal
              </span>
              <span className="text-xs font-bold text-white/50">
                ({percentage}%)
              </span>
            </div>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-neutral-900">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="font-semibold text-white/80">
              {calorieStatusText}
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Target: 2950 kcal
            </span>
          </div>
        </div>
      )}
    </div>
  );
}