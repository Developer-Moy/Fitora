"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface TimeDisplayProps {
  seconds: number;
  currentSet: number;
  totalSets: number;
  progressPercent: number;
  targetSeconds?: number | null;
  isRunning?: boolean;
  formatTime: (sec: number) => string;
  onPrevSet: () => void;
  onNextSet: () => void;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  seconds,
  currentSet,
  totalSets,
  progressPercent,
  targetSeconds = null,
  isRunning = false,
  formatTime,
  onPrevSet,
  onNextSet,
}) => {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, progressPercent)) / 100) * circumference;

  // Countdown mode when a rest target is active
  const isCountdownMode = targetSeconds !== null && targetSeconds !== undefined;
  const remaining = isCountdownMode ? Math.max(0, targetSeconds - seconds) : null;
  const isWarning = remaining !== null && remaining <= 10 && remaining > 0;
  const isDone = remaining === 0 && isCountdownMode;

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Dynamic ring colors (pure monochrome)
  // Idle/stopped = dim gray, running = bright white
  const ringStroke = isCountdownMode
    ? isWarning || isDone
      ? "#ffffff"
      : "#d4d4d4"
    : isRunning
    ? "#ffffff"
    : "#52525b";

  const trackColor = "#262626";

  return (
    <div className="relative flex items-center justify-center w-[240px] h-[240px] xs:w-[270px] xs:h-[270px] sm:w-[310px] sm:h-[310px] my-2">
      {/* Glowing Circular Progress Ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 250 250"
      >
        {/* Solid black interior */}
        <circle
          cx="125"
          cy="125"
          r={radius + 5}
          fill="#000000"
        />
        {/* Background track circle */}
        <circle
          cx="125"
          cy="125"
          r={radius}
          stroke={trackColor}
          strokeOpacity="0.65"
          strokeWidth="10"
          fill="transparent"
        />
        {/* Active glowing progress circle */}
        <circle
          cx="125"
          cy="125"
          r={radius}
          stroke={ringStroke}
          className="transition-all duration-500 ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center Digital Readout */}
      <div className="relative z-10 flex flex-col items-center justify-center select-none px-6 sm:px-8 py-8">
        {isCountdownMode ? (
          // ── REST COUNTDOWN DISPLAY ──
          <>
            <span
              className={`text-[11px] font-bold uppercase tracking-widest mb-0.5 ${
                isWarning || isDone ? "text-white" : "text-zinc-300"
              }`}
            >
              {isDone ? "Rest Complete" : "Rest Countdown"}
            </span>

            <div
              className={`text-4xl xs:text-5xl sm:text-6xl font-extrabold font-mono tracking-tight transition-colors ${
                isWarning || isDone
                  ? "text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.65)]"
                  : "text-zinc-200 drop-shadow-[0_0_18px_rgba(255,255,255,0.4)]"
              } ${isWarning ? "animate-pulse" : ""}`}
            >
              {formatCountdown(remaining ?? 0)}
            </div>

            <span
              className={`text-[11px] mt-1.5 font-mono ${
                isWarning
                  ? "text-white font-bold animate-pulse"
                  : isDone
                  ? "text-white font-bold"
                  : "text-zinc-400"
              }`}
            >
              {isDone ? "⏰ Next set ready!" : isWarning ? "⚡ Almost time!" : `${targetSeconds}s target`}
            </span>
          </>
        ) : (
          // ── NORMAL ACTIVE SET STOPWATCH ──
          <>
            <div className="whitespace-nowrap tabular-nums text-3xl xs:text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
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
          </>
        )}
      </div>
    </div>
  );
};
