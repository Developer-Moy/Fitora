"use client";

import React from "react";
import { HeartPulse, Moon, Zap, Activity, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function RecoveryPage() {
  const handleLogSleep = () => {
    toast.success("Sleep & Recovery metrics updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#141519] border border-white/[0.08] rounded-3xl">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <HeartPulse className="w-3.5 h-3.5" /> Recovery Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            Muscle Recovery & Sleep Metrics
          </h1>
          <p className="text-xs text-white/50">
            Track Heart Rate Variability (HRV), sleep score, and muscle readiness before your next workout.
          </p>
        </div>

        <button
          onClick={handleLogSleep}
          className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all"
        >
          Sync Fitness Wearable
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recovery Score */}
        <div className="bg-[#141519] border border-white/[0.08] rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Overall Readiness</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400">92%</span>
            <span className="text-xs text-emerald-400 font-semibold">Optimal</span>
          </div>
          <p className="text-xs text-white/50">
            Your nervous system is fully recovered. Ready for heavy compound lifts today.
          </p>
        </div>

        {/* Sleep Score */}
        <div className="bg-[#141519] border border-white/[0.08] rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Sleep Quality</span>
            <Moon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-400">8h 15m</span>
            <span className="text-xs text-blue-400 font-semibold">Deep Sleep: 2h 40m</span>
          </div>
          <p className="text-xs text-white/50">
            High REM sleep recorded. Growth hormone release optimal for muscle hypertrophy.
          </p>
        </div>

        {/* HRV Gauge */}
        <div className="bg-[#141519] border border-white/[0.08] rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">HRV Metric</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400">74 ms</span>
            <span className="text-xs text-amber-400 font-semibold">+6ms vs baseline</span>
          </div>
          <p className="text-xs text-white/50">
            Balanced autonomic nervous system. No signs of overtraining detected.
          </p>
        </div>
      </div>
    </div>
  );
}
