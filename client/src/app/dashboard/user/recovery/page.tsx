"use client";

import React from "react";
import { HeartPulse, Moon, Zap, Activity } from "lucide-react";
import toast from "react-hot-toast";

export default function RecoveryPage() {
  const handleLogSleep = () => {
    toast.success("Sleep & Recovery metrics updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-neutral-950 border border-white/10 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border border-white/15 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 bg-neutral-900">
            <HeartPulse className="w-3.5 h-3.5 text-white" /> RECOVERY INTELLIGENCE
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            MUSCLE RECOVERY & SLEEP METRICS
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Track Heart Rate Variability (HRV), sleep duration, and CNS readiness.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogSleep}
          className="px-5 py-3 rounded-full bg-white text-black font-extrabold text-xs shadow-xl hover:bg-gray-100 transition cursor-pointer"
        >
          SYNC WEARABLE
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recovery Score */}
        <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white/50">READINESS SCORE</span>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">92%</span>
            <span className="text-[9px] text-white font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20">OPTIMAL</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Central nervous system fully recovered. Prime condition for heavy compound pressing.
          </p>
        </div>

        {/* Sleep Score */}
        <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white/50">SLEEP QUALITY</span>
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">8H 15M</span>
            <span className="text-[9px] text-white font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20">94% EFFICIENCY</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            2h 10m REM and 1h 45m Deep Sleep logged via smart telemetry tracker.
          </p>
        </div>

        {/* Fatigue Index */}
        <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white/50">MUSCLE FATIGUE</span>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">LOW</span>
            <span className="text-[9px] text-white font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20">READY</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Glute and hamstring muscular soreness resolved. 0% strain registered.
          </p>
        </div>
      </div>
    </div>
  );
}
