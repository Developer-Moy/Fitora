"use client";

import React from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  seconds: number;
  currentSet: number;
  totalSets: number;
  soundEnabled: boolean;
  onStartPause: () => void;
  onStop: () => void;
  onNextSet: () => void;
  onToggleSound: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  seconds,
  currentSet,
  totalSets,
  soundEnabled,
  onStartPause,
  onStop,
  onNextSet,
  onToggleSound,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
      {/* Stop Button */}
      <button
        type="button"
        onClick={onStop}
        className="bg-[#241317] hover:bg-[#34161c] text-[#ff4d6d] border border-[#521c25] rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,77,109,0.1)] cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Stop</span>
      </button>

      {/* Start / Pause Button (Hero Red Button from reference design) */}
      <button
        type="button"
        onClick={onStartPause}
        className={`rounded-xl px-6 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 transform active:scale-95 flex items-center gap-2 text-white shadow-lg cursor-pointer ${
          isRunning
            ? "bg-[#d90429] hover:bg-[#ef233c] shadow-[0_0_20px_rgba(217,4,41,0.5)]"
            : "bg-[#e61e38] hover:bg-[#ff2b47] shadow-[0_0_25px_rgba(230,30,56,0.6)]"
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white" />
            <span>{seconds > 0 ? "Resume" : "Start"}</span>
          </>
        )}
      </button>

      {/* Next Set Quick Action */}
      {currentSet < totalSets && (
        <button
          type="button"
          onClick={onNextSet}
          className="bg-[#132219] hover:bg-[#1a3325] text-emerald-400 border border-emerald-700/50 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="Complete current set & start next"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Next Set</span>
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
  );
};
