"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface TimeDisplayProps {
  seconds: number;
  currentSet: number;
  totalSets: number;
  progressPercent: number;
  formatTime: (sec: number) => string;
  onPrevSet: () => void;
  onNextSet: () => void;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  seconds,
  currentSet,
  totalSets,
  progressPercent,
  formatTime,
  onPrevSet,
  onNextSet,
}) => {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, progressPercent)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-[240px] h-[240px] xs:w-[270px] xs:h-[270px] sm:w-[310px] sm:h-[310px] my-2">
      {/* Glowing Circular Progress Ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 250 250"
      >
        {/* Background track circle */}
        <circle
          cx="125"
          cy="125"
          r={radius}
          className="stroke-[#093521]/60"
          strokeWidth="10"
          fill="transparent"
        />
        {/* Active glowing green progress circle */}
        <circle
          cx="125"
          cy="125"
          r={radius}
          className="stroke-[#00e676] transition-all duration-500 ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter:
              "drop-shadow(0 0 10px #00e676) drop-shadow(0 0 20px rgba(0,230,118,0.4))",
          }}
        />
      </svg>

      {/* Center Digital Stopwatch Readout */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main Digits */}
        <div className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
          {formatTime(seconds)}
        </div>

        {/* Set Indicator */}
        <div className="flex items-center gap-2 mt-1.5">
          <button
            type="button"
            onClick={onPrevSet}
            className="text-zinc-500 hover:text-white p-0.5 rounded transition cursor-pointer"
            title="Previous set"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="text-sm sm:text-base font-medium text-zinc-300 tracking-wide font-mono">
            {`Set: ${currentSet}/${totalSets}`}
          </span>

          <button
            type="button"
            onClick={onNextSet}
            className="text-zinc-500 hover:text-white p-0.5 rounded transition cursor-pointer"
            title="Next set"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
