// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Premium Meal Chart & Nutrition Section
// DEVELOPER: Simanto Poddar
// TASK: Full-width meal chart showcase with macro badges, rotating ad banner at bottom
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import Link from 'next/link';
import { FaArrowRight, FaChartPie, FaFire } from 'react-icons/fa6';

// Sample preview data expanding to 4 cards for a 2x2 layout inspired by the reference
const PREVIEW_MEAL_CHARTS = [
  {
    id: 1,
    title: 'Protein-Focused Plan',
    category: 'Protein',
    colorTheme: 'border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.15)]',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    items: [
      { name: 'Lean Chicken', value: '35g' },
      { name: 'Greek Yogurt', value: '20g' },
      { name: 'Almonds', value: '6g' },
    ],
    calories: '450 kcal',
  },
  {
    id: 2,
    title: 'Balanced Carbs & Energy',
    category: 'Carbs',
    colorTheme: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)]',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    items: [
      { name: 'Brown Rice', value: '43g' },
      { name: 'Sweet Potato', value: '09g' },
      { name: 'Oats', value: '05g' },
    ],
    calories: '520 kcal',
  },
  {
    id: 3,
    title: 'Complex Carbs & Fiber',
    category: 'Carbs',
    colorTheme: 'border-yellow-600/40 bg-yellow-600/10 text-yellow-300 shadow-[0_0_18px_rgba(202,138,4,0.15)]',
    badgeColor: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    items: [
      { name: 'Quinoa', value: '15g' },
      { name: 'Whole Wheat', value: '10g' },
      { name: 'Micro-nutrients', value: 'Value' },
    ],
    calories: '390 kcal',
  },
  {
    id: 4,
    title: 'Healthy Fats & Recovery',
    category: 'Fats',
    colorTheme: 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.15)]',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    items: [
      { name: 'Avocado', value: '5.2g' },
      { name: 'Olive Oil', value: '1.0g' },
      { name: 'Micro-nutrients', value: 'Value' },
    ],
    calories: '480 kcal',
  },
];

export default function MealChartSection() {
  const currentCalories = 1650;
  const targetCalories = 2200;
  const progressPercentage = Math.round((currentCalories / targetCalories) * 100);

  return (
    <section id="meal-chart" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FaChartPie size={12} />
            <span>Nutritional Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Fuel Your Performance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Macro and ingredient distributions tailored by your AI assistant.
          </p>
        </div>

        {/* View Full Meal Plans CTA Link */}
        <Link
          href="/dashboard/user/nutrition"
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-5 py-3 text-xs font-black uppercase tracking-wider text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:bg-cyan-500/25 hover:border-cyan-400 active:scale-95"
        >
          <span>View Full Meal Plans</span>
          <FaArrowRight size={14} />
        </Link>
      </div>

      {/* Daily Caloric Goal Progress Bar */}
      <div className="mb-8 rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2 text-xs sm:text-sm font-semibold">
          <span className="text-slate-300 flex items-center gap-2">
            <FaFire className="text-rose-400" /> Daily Caloric Goal Progress
          </span>
          <span className="text-cyan-300 font-bold">
            {currentCalories} / {targetCalories} kcal ({progressPercentage}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-linear-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* 2x2 Grid Layout for 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PREVIEW_MEAL_CHARTS.map((chart) => (
          <div
            key={chart.id}
            className={`relative rounded-3xl border p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${chart.colorTheme}`}
          >
            {/* Card Top Title & Badge */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold tracking-tight text-slate-100">
                {chart.title}
              </h3>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${chart.badgeColor}`}>
                {chart.category}
              </span>
            </div>

            {/* Ingredient Breakdown List */}
            <div className="space-y-2.5 mb-5">
              {chart.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="font-bold text-slate-100">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Footer / Calories info */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <FaFire className="text-rose-400" size={12} />
                Energy
              </span>
              <span className="font-extrabold text-slate-100 tracking-wide">
                {chart.calories}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


{/* TODO: Simanto Poddar — Build full-width meal chart section */ }
{/* Show a horizontal row of 3 MealChartCard preview cards (sample data) */ }
{/* Add a "View Full Meal Plans" CTA linking to /dashboard/user/nutrition */ }


{/* Add a rotating gym ad banner strip at the bottom of this section */ } {/*   <-- Postponed as per updated schedule. */ }
