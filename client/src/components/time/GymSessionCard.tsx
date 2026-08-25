"use client";

import React from "react";
import { Activity, ArrowUpRight, RotateCcw } from "lucide-react";

interface GymSessionCardProps {
  totalSeconds: number;
  isSynced: boolean;
  onToggleSync?: () => void;
  onClearGymTime?: () => void;
  formatGymTime: (sec: number) => string;
  variant?: "left" | "right";
}

export const GymSessionCard: React.FC<GymSessionCardProps> = ({
  totalSeconds,
  isSynced,
  onToggleSync,
  onClearGymTime,
  formatGymTime,
  variant = "left",
}) => {
  if (variant === "left") {
    return (
      <div className="bg-[#121212]/90 border border-white/15 rounded-2xl px-4 py-3 w-full shadow-inner backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">
            Total Gym Time
          </span>
          {onClearGymTime && (
            <button
              type="button"
              onClick={onClearGymTime}
              className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-0.5 transition cursor-pointer p-0.5 rounded"
              title="Reset total daily gym time"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
        <div className="md:text-2xl font-bold font-mono text-white tracking-wider mt-0.5">
          {formatGymTime(totalSeconds)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212]/90 border border-white/15 rounded-2xl px-4 py-3 w-full shadow-inner backdrop-blur-md flex flex-col gap-1.5">
      {/* Total Gym Time Row */}
      <div className="flex items-center gap-2 text-xs text-zinc-200 font-mono">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <div className="flex flex-col md:flex-row gap-0.5 w-full">
          <span className="text-zinc-400 font-sans text-[11px]">
            Total Gym Time:
          </span>
          <span className="font-bold text-white ml-auto font-mono">
            {formatGymTime(totalSeconds)}
          </span>
        </div>
      </div>

      {/* Realtime Sync Row */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>Realtime Sync</span>
        </div>
        <button
          type="button"
          onClick={onToggleSync}
          className="cursor-pointer hidden md:flex bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/40 rounded-full p-1 transition"
          title={isSynced ? "Live Cloud Synced" : "Offline Mode"}
        >
          <ArrowUpRight className="w-3 h-3 text-emerald-300" />
        </button>
      </div>
    </div>
  );
};
