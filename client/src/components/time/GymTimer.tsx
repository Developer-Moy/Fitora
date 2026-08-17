"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Dumbbell, Flame, Timer as TimerIcon, RotateCcw } from "lucide-react";
import { GymSessionCard } from "./GymSessionCard";
import { TimeDisplay } from "./TimeDisplay";
import { TimerControls } from "./TimerControls";

export interface GymTimerProps {
  exerciseName?: string;
  defaultSets?: number;
  onSetComplete?: (stats: {
    set: number;
    duration: number;
    totalGymTime: number;
  }) => void;
}

export default function GymTimer({
  exerciseName = "Bench Press",
  defaultSets = 5,
  onSetComplete,
}: GymTimerProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Active set stopwatch (starts at 00:00:00)
  const [seconds, setSeconds] = useState<number>(0);

  // Total Gym Time for today (starts at 00:00:00, loaded from localStorage for today's full day)
  const [totalGymSeconds, setTotalGymSeconds] = useState<number>(0);

  const [currentSet, setCurrentSet] = useState<number>(1);
  const [totalSets, setTotalSets] = useState<number>(defaultSets);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [completedSets, setCompletedSets] = useState<
    Array<{ set: number; duration: number; timestamp: string }>
  >([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Storage key for today's full day gym time
  const getTodayKey = () => {
    const today = new Date().toISOString().slice(0, 10);
    return `fitora_daily_gym_time_${today}`;
  };

  // Load today's accumulated gym time on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getTodayKey());
      if (saved) {
        setTotalGymSeconds(parseInt(saved, 10) || 0);
      }
    } catch {
      // localStorage not accessible
    }
  }, []);

  // Save today's accumulated gym time
  const saveDailyGymTime = useCallback((secs: number) => {
    try {
      localStorage.setItem(getTodayKey(), secs.toString());
    } catch {
      // ignore
    }
  }, []);

  // Synthesized Web Audio beep generator
  const triggerAudioFeedback = useCallback(
    (freq = 880, type: OscillatorType = "sine", duration = 0.12) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // AudioContext not permitted yet
      }
    },
    [soundEnabled]
  );

  // Main active timer interval (runs when user clicks Start)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Increment total daily gym time
        setTotalGymSeconds((prevTotal) => {
          const nextTotal = prevTotal + 1;
          saveDailyGymTime(nextTotal);
          return nextTotal;
        });

        // Increment current active set stopwatch
        setSeconds((prevSec) => prevSec + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, triggerAudioFeedback, saveDailyGymTime]);

  // Formatter for HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Formatter for total gym time e.g. 1:35:10 or 0:00:00
  const formatGymTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    triggerAudioFeedback(isRunning ? 440 : 880);
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Timer started", { id: "timer-status" });
      } else {
        toast("Timer paused", { icon: "⏸️", id: "timer-status" });
      }
      return next;
    });
  };

  const handleStop = () => {
    triggerAudioFeedback(350);
    setIsRunning(false);
    if (seconds > 0) {
      // Log completed set
      const formatted = formatTime(seconds);
      const newEntry = {
        set: currentSet,
        duration: seconds,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setCompletedSets((prev) => [newEntry, ...prev]);
      toast.success(`Set ${currentSet} saved (${formatted})`);

      if (onSetComplete) {
        onSetComplete({
          set: currentSet,
          duration: seconds,
          totalGymTime: totalGymSeconds,
        });
      }
    } else {
      toast("Stopwatch reset to 00:00:00", { icon: "🔄", id: "stop-reset" });
    }
    setSeconds(0);
  };

  const handleNextSet = () => {
    triggerAudioFeedback(950);
    if (seconds > 0) {
      const formatted = formatTime(seconds);
      const newEntry = {
        set: currentSet,
        duration: seconds,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setCompletedSets((prev) => [newEntry, ...prev]);
      toast.success(`Set ${currentSet} completed (${formatted})! Ready for Set ${Math.min(totalSets, currentSet + 1)}`);

      if (onSetComplete) {
        onSetComplete({
          set: currentSet,
          duration: seconds,
          totalGymTime: totalGymSeconds,
        });
      }
    }
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
    } else {
      toast.success("🎉 All target sets completed! Great workout!", { duration: 4000 });
    }
    setSeconds(0);
    setIsRunning(true);
  };

  const handleResetDailyGymTime = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-xs text-white">Reset today&apos;s full gym time?</span>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => {
              setTotalGymSeconds(0);
              saveDailyGymTime(0);
              toast.dismiss(t.id);
              toast.success("Today's gym time reset to 00:00:00");
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-lg"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, id: "confirm-reset-day" });
  };

  const handleToggleSync = () => {
    setIsSynced((p) => {
      const next = !p;
      if (next) {
        toast.success("Realtime Sync connected", { id: "sync-status" });
      } else {
        toast("Offline mode active", { icon: "⚡", id: "sync-status" });
      }
      return next;
    });
  };

  const handleToggleSound = () => {
    setSoundEnabled((p) => {
      const next = !p;
      if (next) {
        toast("Audio cues enabled", { icon: "🔔", id: "sound-status" });
      } else {
        toast("Audio cues muted", { icon: "🔕", id: "sound-status" });
      }
      return next;
    });
  };

  // Circular progress calculation (60s loop)
  const progressPercent =
    seconds === 0 ? 0 : (seconds % 60) * (100 / 60);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main HUD Card */}
      <div className="relative w-full max-w-4xl px-4 py-8 flex flex-col items-center">
        {/* Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[220px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Inner Card Container */}
        <div className="relative z-20 w-full bg-[#121417]/95 backdrop-blur-xl border border-[#222831] rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[220px]">
          {/* Top Section: Left Widget | Center Digits | Right Widget */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left Box: Total Gym Time */}
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <GymSessionCard
                totalSeconds={totalGymSeconds}
                isSynced={isSynced}
                formatGymTime={formatGymTime}
                variant="left"
              />
            </div>

            {/* Center Area: Big Digital Stopwatch Readout + Circular Progress Ring */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <TimeDisplay
                seconds={seconds}
                currentSet={currentSet}
                totalSets={totalSets}
                progressPercent={progressPercent}
                formatTime={formatTime}
                onPrevSet={() => setCurrentSet((p) => Math.max(1, p - 1))}
                onNextSet={() => setCurrentSet((p) => Math.min(totalSets, p + 1))}
              />
            </div>

            {/* Right Box: Total Gym Time + Realtime Sync */}
            <div className="md:col-span-3 flex justify-center md:justify-end">
              <GymSessionCard
                totalSeconds={totalGymSeconds}
                isSynced={isSynced}
                onToggleSync={handleToggleSync}
                formatGymTime={formatGymTime}
                variant="right"
              />
            </div>
          </div>

          {/* Thin Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2a303c] to-transparent my-4" />

          {/* Bottom Action Controls: Stop, Start/Pause, Next Set, Sound */}
          <TimerControls
            isRunning={isRunning}
            seconds={seconds}
            currentSet={currentSet}
            totalSets={totalSets}
            soundEnabled={soundEnabled}
            onStartPause={handleStartPause}
            onStop={handleStop}
            onNextSet={handleNextSet}
            onToggleSound={handleToggleSound}
          />
        </div>
      </div>

      {/* Auxiliary Settings & Quick Controls */}
      <div className="w-full max-w-4xl px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Set Configuration */}
        <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Target Sets ({totalSets})
          </div>
          <div className="flex items-center justify-between gap-2 bg-[#181a1f] border border-[#2a303d] rounded-xl px-3 py-1.5">
            <span className="text-xs text-zinc-400">Sets Goal:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTotalSets((p) => Math.max(1, p - 1))}
                className="w-6 h-6 rounded bg-[#242730] hover:bg-[#2f3340] text-zinc-200 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                -
              </button>
              <span className="font-mono font-bold text-white text-sm">{totalSets}</span>
              <button
                type="button"
                onClick={() => setTotalSets((p) => Math.min(20, p + 1))}
                className="w-6 h-6 rounded bg-[#242730] hover:bg-[#2f3340] text-zinc-200 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Workout Stats / Summary & Daily Reset */}
        <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" /> Today&apos;s Full Workout
            </span>
            <button
              type="button"
              onClick={handleResetDailyGymTime}
              className="text-[10px] text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
              title="Reset today's total gym time"
            >
              <RotateCcw className="w-3 h-3" /> Reset Day
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <div>
              <span className="text-zinc-500 block text-[10px]">SETS DONE</span>
              <span className="font-mono font-bold text-white text-sm">
                {completedSets.length} Sets
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">TOTAL EST. KCAL</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {Math.round((totalGymSeconds / 60) * 6.5)} kcal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Sets History Log */}
      {completedSets.length > 0 && (
        <div className="w-full max-w-4xl px-4 mt-6">
          <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <TimerIcon className="w-4 h-4 text-emerald-400" /> Today&apos;s Logged Sets (Part by Part)
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {completedSets.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#181a1f] border border-[#242832] rounded-xl px-4 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      {item.set}
                    </span>
                    <span className="font-medium text-white">Set {item.set}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-zinc-300">
                    <span>
                      Duration: <strong className="text-white">{formatTime(item.duration)}</strong>
                    </span>
                    <span className="text-zinc-500">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
