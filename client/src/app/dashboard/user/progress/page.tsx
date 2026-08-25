"use client";

import { TrendingUp, Award, Flame, Scale, ArrowUpRight } from "lucide-react";

export default function UserProgressPage() {
  const metrics = [
    {
      label: "CURRENT WEIGHT",
      value: "74.5 KG",
      goal: "TARGET: 72 KG",
      change: "-2.5 KG THIS MONTH",
    },
    {
      label: "BODY FAT %",
      value: "14.2 %",
      goal: "TARGET: 12 %",
      change: "-1.8% REDUCTION",
    },
    {
      label: "MUSCLE MASS",
      value: "38.6 KG",
      goal: "TARGET: 40 KG",
      change: "+1.2 KG GAIN",
    },
    {
      label: "BENCH PRESS PR",
      value: "105 KG",
      goal: "TARGET: 115 KG",
      change: "+5 KG NEW RECORD",
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
              FITNESS ANALYTICS
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            PROGRESS & METRICS
          </h1>
          <p className="mt-1.5 text-xs text-white/50 font-medium max-w-xl">
            Track body composition changes, strength growth, and personal record
            metrics over time.
          </p>
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-gray-100 transition shadow-xl cursor-pointer"
        >
          <span>LOG NEW MEASUREMENT</span>
          <ArrowUpRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-neutral-950 p-5 space-y-3 transition hover:border-white/30 shadow-xl"
          >
            <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">
              {item.label}
            </span>
            <div className="text-3xl font-black text-white">{item.value}</div>
            <div className="flex items-center justify-between text-[10px] font-bold text-white/60 pt-2 border-t border-white/5">
              <span>{item.goal}</span>
              <span className="text-white">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weight & Body Fat Chart Section */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-white">
              WEIGHT & BODY COMPOSITION TREND
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Last 30 Days Telemetry
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-white" />
        </div>

        <div className="h-48 flex items-end gap-3 border-b border-white/10 pb-2">
          {[78, 77.5, 77.2, 76.8, 76.2, 75.8, 75.2, 74.8, 74.5].map(
            (val, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <span className="text-[9px] font-bold text-white/50 opacity-0 group-hover:opacity-100 transition">
                  {val}kg
                </span>
                <div
                  className="w-full bg-white/80 rounded-t group-hover:bg-white transition"
                  style={{ height: `${(val / 80) * 100}%` }}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
