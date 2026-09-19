"use client";

import React from "react";
import { Activity, ArrowUpRight, RotateCcw } from "lucide-react";

interface GymSessionCardProps {
  totalSeconds: number;
  isSynced: boolean;
  isOffline?: boolean;
  pendingCount?: number;
  isSyncing?: boolean;
  onToggleSync?: () => void;
  onClearGymTime?: () => void;
  formatGymTime: (sec: number) => string;
  variant?: "left" | "right";
}

export const GymSessionCard: React.FC<GymSessionCardProps> = ({
  totalSeconds,
  isSynced,
  isOffline = false,
  pendingCount = 0,
  isSyncing = false,
  onToggleSync,
  onClearGymTime,
  formatGymTime,
  variant = "left",
}) => {
  if (variant === "left") {
    return (
      <div className="rounded-2xl px-4 py-3 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">
            Total Gym Time
          </span>
          {onClearGymTime && (
            <button
              type="button"
              onClick={onClearGymTime}
              className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-0.5 transition cursor-pointer p-0.5 rounded"
              title="Reset total daily gym time"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
        <div className="md:text-2xl font-bold font-mono text-white tracking-wider mt-0.5 flex items-baseline justify-between">
          <span>{formatGymTime(totalSeconds)}</span>
          {pendingCount > 0 && (
            <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {pendingCount} offline
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl px-4 py-3 w-full flex flex-col gap-1.5">
      {/* Total Gym Time Row */}
      <div className="flex items-center gap-2 text-xs text-zinc-200 font-mono">
        <span className="relative flex h-2.5 w-2.5">
          {isOffline ? (
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </>
          )}
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

      {/* Realtime / Offline Sync Row */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {isSyncing ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border border-white/30 border-t-white animate-spin" />
              <span className="text-white">Syncing to cloud...</span>
            </>
          ) : isOffline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-300 font-semibold">
                Offline {pendingCount > 0 ? `(${pendingCount} queued)` : "Mode"}
              </span>
            </>
          ) : pendingCount > 0 ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-300">
                {pendingCount} pending sync
              </span>
            </>
          ) : (
            <>
              <Activity className="w-3.5 h-3.5 animate-pulse text-white" />
              <span className="text-zinc-300">Realtime Sync</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleSync}
          className="cursor-pointer hidden md:flex bg-black hover:bg-white/10 border border-white/20 rounded-full p-1 transition"
          title={
            isOffline
              ? "Offline Mode — queueing locally"
              : isSyncing
                ? "Syncing in progress..."
                : isSynced
                  ? "Live Cloud Synced"
                  : "Manual Sync Trigger"
          }
        >
          <ArrowUpRight className="w-3 h-3 text-white" />
        </button>
      </div>
    </div>
  );
};
