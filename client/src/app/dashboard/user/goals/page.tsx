"use client";

import { Target, CheckCircle2, Plus, Flag } from "lucide-react";

export default function UserGoalsPage() {
  const goals = [
    {
      id: 1,
      title: "REACH 12% BODY FAT BY OCT 2026",
      category: "BODY COMPOSITION",
      progress: 75,
      deadline: "35 DAYS REMAINING",
    },
    {
      id: 2,
      title: "BENCH PRESS 110 KG 1RM",
      category: "STRENGTH MILESTONE",
      progress: 88,
      deadline: "20 DAYS REMAINING",
    },
    {
      id: 3,
      title: "COMPLETE 20 WORKOUT SESSIONS THIS MONTH",
      category: "CONSISTENCY",
      progress: 90,
      deadline: "6 DAYS REMAINING",
    },
  ];

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              TARGET MILESTONES
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            FITNESS GOALS
          </h1>
          <p className="mt-1.5 text-xs text-white/50 font-medium max-w-xl">
            Set high-performance fitness objectives, track target deadlines, and
            celebrate milestones.
          </p>
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-gray-100 transition shadow-xl cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>CREATE NEW GOAL</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 transition hover:border-white/30 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase">
                  {goal.category}
                </span>
                <span className="text-xs font-bold text-white/40">
                  {goal.deadline}
                </span>
              </div>
              <span className="text-sm font-black text-white">
                {goal.progress}% COMPLETE
              </span>
            </div>

            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              {goal.title}
            </h2>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
