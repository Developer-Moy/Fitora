"use client";

import { FiCoffee, FiZap, FiPieChart } from "react-icons/fi";

export interface MealChartCardProps {
  title?: string;
  caloriesTotal?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatsGrams?: number;
  category?: string;
}

export default function MealChartCard({
  title = "High Protein Muscle Fuel",
  caloriesTotal = 650,
  proteinGrams = 48,
  carbsGrams = 62,
  fatsGrams = 18,
  category = "Lunch / Recovery",
}: MealChartCardProps) {
  return (
    <div className="w-full bg-[#141416] border border-white/[0.08] rounded-2xl p-5 shadow-xl hover:border-white/20 transition-all duration-300 group">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <FiCoffee size={14} />
          <span>{category}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/30 px-2.5 py-1 rounded-full">
          <FiZap size={12} className="animate-pulse" />
          <span>{caloriesTotal} kcal</span>
        </div>
      </div>

      {/* Meal Title */}
      <div className="py-3">
        <h3 className="font-bold text-white text-base tracking-wide group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-white/40 mt-1">
          Optimized macro distribution for optimal muscle recovery and energy balance.
        </p>
      </div>

      {/* Macro Badges Grid */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        {/* Protein Badge */}
        <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl text-center">
          <span className="block text-[11px] text-emerald-300 font-medium uppercase tracking-wider">
            Protein
          </span>
          <span className="text-base font-extrabold text-white mt-0.5 block">
            {proteinGrams}g
          </span>
        </div>

        {/* Carbs Badge */}
        <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl text-center">
          <span className="block text-[11px] text-amber-300 font-medium uppercase tracking-wider">
            Carbs
          </span>
          <span className="text-base font-extrabold text-white mt-0.5 block">
            {carbsGrams}g
          </span>
        </div>

        {/* Fats Badge */}
        <div className="bg-blue-950/40 border border-blue-800/40 p-2.5 rounded-xl text-center">
          <span className="block text-[11px] text-blue-300 font-medium uppercase tracking-wider">
            Fats
          </span>
          <span className="text-base font-extrabold text-white mt-0.5 block">
            {fatsGrams}g
          </span>
        </div>
      </div>
    </div>
  );
}
