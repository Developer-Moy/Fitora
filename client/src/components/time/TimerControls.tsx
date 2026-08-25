"use client";

import React from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Timer, ClipboardList } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  seconds: number;
  currentSet: number;
  totalSets: number;
  soundEnabled: boolean;
  targetSeconds: number | null;
  onStartPause: () => void;
  onStop: () => void;
  onNextSet: () => void;
  onToggleSound: () => void;
  onSetTarget: (amount: number) => void;
  onQuickLog: () => void;
}

const QUICK_TARGETS = [30, 60, 90] as const;

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  seconds,
  currentSet,
  totalSets,
  soundEnabled,
  targetSeconds,
  onStartPause,
  onStop,
  onNextSet,
  onToggleSound,
  onSetTarget,
  onQuickLog,
}) => {
  // Remaining seconds when a target is active
  const remaining = targetSeconds !== null ? Math.max(0, targetSeconds - seconds) : null;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* ── Quick target duration chips ── */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1 mr-0.5">
          <Timer className="w-3.5 h-3.5 text-white" /> Rest Target
        </span>
        {QUICK_TARGETS.map((amount) => {
          const isActive = targetSeconds === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => onSetTarget(amount)}
              title={isActive ? "Click to clear rest target" : `Set ${amount}s rest countdown`}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 cursor-pointer overflow-hidden ${
                isActive
                  ? "bg-white text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.3)]"
                  : "bg-[#181c24] hover:bg-[#1f2430] text-zinc-400 hover:text-zinc-200 border-[#252b38] hover:border-zinc-600"
              }`}
            >
              {/* Fill bar when active and running */}
              {isActive && targetSeconds && seconds > 0 && (
                <span
                  className="absolute inset-0 bg-black/15 origin-left transition-none"
                  style={{ transform: `scaleX(${Math.min(1, seconds / targetSeconds)})` }}
                />
              )}
              <span className="relative z-10">
                {isActive && remaining !== null
                  ? remaining === 0
                    ? "Done!"
                    : `${remaining}s`
                  : `${amount}s`}
              </span>
            </button>
          );
        })}
        {targetSeconds !== null && (
          <span className="text-[10px] text-white font-mono animate-pulse ml-1 bg-white/10 border border-white/20 px-2 py-0.5 rounded-full">
            {remaining === 0 ? "⏰ Done!" : `${remaining}s remaining`}
          </span>
        )}
      </div>

      {/* Thin separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2a303c]/60 to-transparent" />

      {/* ── Main controls row ── */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
        {/* Stop Button */}
        <button
          type="button"
          onClick={onStop}
          className="bg-[#181a1f] hover:bg-[#22262e] text-zinc-300 hover:text-white border border-[#2b313d] rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Stop</span>
        </button>

        {/* Start / Pause Button */}
        <button
          type="button"
          onClick={onStartPause}
          className={`rounded-xl px-6 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 transform active:scale-95 flex items-center gap-2 text-black shadow-lg cursor-pointer ${
            isRunning
              ? "bg-zinc-200 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              : "bg-white hover:bg-gray-100 shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-black" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>
                {seconds > 0
                  ? "Resume"
                  : targetSeconds
                  ? `Start ${targetSeconds}s Rest`
                  : "Start Set"}
              </span>
            </>
          )}
        </button>

        {/* Adaptive action: Log Set only when clock is at 00, else Next Set */}
        {seconds !== 0 && currentSet < totalSets ? (
          <button
            type="button"
            onClick={onNextSet}
            className="bg-[#181a1f] hover:bg-[#22262e] text-white border border-white/20 hover:border-white/40 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Complete current set & start next"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Next Set</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onQuickLog}
            className="bg-[#181a1f] hover:bg-[#22262e] text-white border border-white/20 hover:border-white/40 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Log weight & reps for the current set"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Log Set</span>
          </button>
        )}

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="bg-[#181a1f] hover:bg-[#22262e] text-zinc-400 hover:text-white border border-[#2b313d] rounded-xl p-2 sm:p-2.5 transition cursor-pointer"
          title={soundEnabled ? "Mute sound cues" : "Unmute sound cues"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>
      </div>
    </div>
  );
};
