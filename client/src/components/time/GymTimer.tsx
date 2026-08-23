"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Dumbbell, Flame, Timer as TimerIcon, RotateCcw, Trash2 } from "lucide-react";
import { GymSessionCard } from "./GymSessionCard";
import { TimeDisplay } from "./TimeDisplay";
import { TimerControls } from "./TimerControls";

export interface GymTimerProps {
  exerciseName?: string;
  defaultSets?: number;
  showSetHistory?: boolean;
  onSetComplete?: (stats: {
    set: number;
    duration: number;
    totalGymTime: number;
  }) => void;
}

export default function GymTimer({
  exerciseName = "Bench Press",
  defaultSets = 5,
  showSetHistory = true,
  onSetComplete,
}: GymTimerProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Active set stopwatch (starts at 00:00:00)
  const [seconds, setSeconds] = useState<number>(0);

  const [currentSet, setCurrentSet] = useState<number>(1);
  const [totalSets, setTotalSets] = useState<number>(defaultSets);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [completedSets, setCompletedSets] = useState<
    Array<{ set: number; duration: number; timestamp: string }>
  >([]);
  // null = free-running stopwatch, number = target duration in seconds
  const [targetSeconds, setTargetSeconds] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAnnouncedRef = useRef<number | null>(null);

  const getTodayKey = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return `fitora_daily_gym_time_${today}`;
  }, []);

  // Total Gym Time for today (starts at 0, loaded from localStorage after mount to avoid SSR/hydration mismatch)
  const [totalGymSeconds, setTotalGymSeconds] = useState<number>(0);

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`fitora_daily_gym_time_${today}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) setTotalGymSeconds(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save today's accumulated gym time
  const saveDailyGymTime = useCallback(
    (secs: number) => {
      try {
        localStorage.setItem(getTodayKey(), secs.toString());
      } catch {
        // ignore
      }
    },
    [getTodayKey]
  );

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

  // Browser speech synthesis voice alert (Web Speech API)
  const speakVoiceAlert = useCallback(
    (text: string) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis unavailable
      }
    },
    [soundEnabled]
  );

  // Main active timer interval (runs when user clicks Start)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Increment current active set stopwatch
        setSeconds((prevSec) => prevSec + 1);

        // Only count active exercise time toward Total Gym Time (exclude rest countdowns)
        if (targetSeconds === null) {
          setTotalGymSeconds((prevTotal) => {
            const nextTotal = prevTotal + 1;
            saveDailyGymTime(nextTotal);
            return nextTotal;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, targetSeconds, triggerAudioFeedback, saveDailyGymTime]);

  // Target-duration countdown warning cues & final alarm
  useEffect(() => {
    if (targetSeconds === null || !isRunning) return;

    const remaining = targetSeconds - seconds;

    // Warning beeps at 3, 2, 1 seconds left
    if (remaining > 0 && remaining <= 3) {
      triggerAudioFeedback(580, "sine", 0.08);
    }

    // Voice countdown at 3, 2, 1 seconds left (once per value)
    if (
      remaining > 0 &&
      remaining <= 3 &&
      voiceAnnouncedRef.current !== remaining
    ) {
      voiceAnnouncedRef.current = remaining;
      speakVoiceAlert(String(remaining));
    }

    // Target reached -> multi-beep alarm & auto-stop
    if (seconds >= targetSeconds) {
      setIsRunning(false);
      setTargetSeconds(null);

      // Voice alert when rest timer hits zero (once per session)
      if (voiceAnnouncedRef.current !== 0) {
        voiceAnnouncedRef.current = 0;
        speakVoiceAlert("Rest Over, start next set!");
      }

      // Multi-beep completion alarm
      if (soundEnabled && typeof window !== "undefined") {
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            [0, 0.16, 0.32, 0.48].forEach((offset, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(i < 3 ? 880 : 1200, ctx.currentTime + offset);
              gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.14);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(ctx.currentTime + offset);
              osc.stop(ctx.currentTime + offset + 0.14);
            });
          }
        } catch {
          // ignore
        }
      }

      // Log the completed set
      const formatted = formatTime(seconds);
      const newEntry = {
        set: currentSet,
        duration: seconds,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setCompletedSets((prev) => [newEntry, ...prev]);
      toast.success(`⏰ Time's up! Set ${currentSet} logged (${formatted})`, {
        duration: 4000,
        id: "target-alarm",
      });
      setSeconds(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, targetSeconds, isRunning]);

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

  const handleStartPause = useCallback(() => {
    triggerAudioFeedback(isRunning ? 440 : 880);
    if (!isRunning) {
      setIsRunning(true);
      toast.success(seconds > 0 ? "Timer resumed" : "Timer started", { id: "timer-status" });
    } else {
      setIsRunning(false);
      toast("Timer paused", { icon: "⏸️", id: "timer-status" });
    }
  }, [isRunning, seconds, triggerAudioFeedback]);

  const handleStop = useCallback(() => {
    triggerAudioFeedback(350);
    setIsRunning(false);
    setTargetSeconds(null);
    voiceAnnouncedRef.current = null;
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
  }, [currentSet, onSetComplete, seconds, totalGymSeconds, triggerAudioFeedback]);

  const handleNextSet = () => {
    triggerAudioFeedback(950);
    setTargetSeconds(null);
    voiceAnnouncedRef.current = null;
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
      toast.success(
        `Set ${currentSet} completed (${formatted})! Ready for Set ${Math.min(
          totalSets,
          currentSet + 1
        )}`
      );

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
    setIsRunning(false);
  };

  const handleResetDailyGymTime = () => {
    setTotalGymSeconds(0);
    saveDailyGymTime(0);
    toast.success("Today's gym time reset to 00:00:00", { id: "reset-day" });
  };

  // Set a target duration; clicking the same target again clears it (toggle)
  const handleSetTarget = (amount: number) => {
    const isDeselecting = targetSeconds === amount;
    setTargetSeconds(isDeselecting ? null : amount);
    setSeconds(0);
    setIsRunning(false);
    voiceAnnouncedRef.current = null;
    if (isDeselecting) {
      toast("Rest target cleared", { icon: "⏱️", id: "set-target" });
    } else {
      toast(`Rest target set: ${amount}s — press Start`, { icon: "⏱️", id: "set-target" });
    }
  };

  const handleClearHistory = () => {
    if (completedSets.length === 0) return;
    setCompletedSets([]);
    toast.success("Logged sets history cleared", { id: "clear-history" });
  };

  const handleToggleSync = () => {
    if (!isSynced) {
      setIsSynced(true);
      toast.success("Realtime Sync connected", { id: "sync-status" });
    } else {
      setIsSynced(false);
      toast("Offline mode active", { icon: "⚡", id: "sync-status" });
    }
  };

  const handleToggleSound = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      toast("Audio cues enabled", { icon: "🔔", id: "sound-status" });
    } else {
      setSoundEnabled(false);
      toast("Audio cues muted", { icon: "🔕", id: "sound-status" });
    }
  };

  // Keyboard Shortcuts: Space = Start/Pause, Escape = Stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      } else if (e.code === "Escape") {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleStartPause, handleStop]);

  // Progress calculation
  const progressPercent = targetSeconds
    ? Math.min(100, (seconds / targetSeconds) * 100)
    : seconds === 0
    ? 0
    : (seconds % 60) * (100 / 60);

  // Average set duration in seconds
  const avgSetDurationSecs =
    completedSets.length > 0
      ? Math.round(
          completedSets.reduce((acc, curr) => acc + curr.duration, 0) /
            completedSets.length
        )
      : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main HUD Card */}
      <div className="relative w-full max-w-4xl px-2 sm:px-4 py-4 sm:py-6 flex flex-col items-center">
        {/* Ambient Backlight Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[180px] sm:w-[400px] sm:h-[260px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isRunning
              ? targetSeconds
                ? "bg-amber-500/20 scale-110"
                : "bg-emerald-500/20 scale-110"
              : "bg-emerald-500/10 scale-95"
          }`}
        />

        {/* Inner Card Container */}
        <div className="relative z-20 w-full bg-[#121417]/95 backdrop-blur-xl border border-[#222831] rounded-3xl p-4 sm:p-6 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[220px]">
          {/* Center Area: Exercise label + Time Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-[11px] font-semibold text-emerald-400/90 uppercase tracking-widest mb-1 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/30 px-3.5 py-1 rounded-full">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[200px] sm:max-w-none">{exerciseName}</span>
            </div>
            <TimeDisplay
              seconds={seconds}
              currentSet={currentSet}
              totalSets={totalSets}
              progressPercent={progressPercent}
              targetSeconds={targetSeconds}
              isRunning={isRunning}
              formatTime={formatTime}
              onPrevSet={() => setCurrentSet((p) => Math.max(1, p - 1))}
              onNextSet={() => setCurrentSet((p) => Math.min(totalSets, p + 1))}
            />
          </div>

          {/* Side Info Cards: shown in a row below timer on mobile */}
          <div className="flex flex-row items-stretch justify-center gap-3 mt-4 md:hidden flex-wrap">
            <div className="flex-1 min-w-0">
              <GymSessionCard
                totalSeconds={totalGymSeconds}
                isSynced={isSynced}
                onClearGymTime={handleResetDailyGymTime}
                formatGymTime={formatGymTime}
                variant="left"
              />
            </div>
            <div className="flex-1 min-w-0">
              <GymSessionCard
                totalSeconds={totalGymSeconds}
                isSynced={isSynced}
                onToggleSync={handleToggleSync}
                formatGymTime={formatGymTime}
                variant="right"
              />
            </div>
          </div>

          {/* Desktop 3-column layout: side cards positioned in sides */}
          <div className="hidden md:grid grid-cols-12 gap-4 items-center absolute inset-x-7 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="col-span-3 flex justify-start pointer-events-auto">
              <GymSessionCard
                totalSeconds={totalGymSeconds}
                isSynced={isSynced}
                onClearGymTime={handleResetDailyGymTime}
                formatGymTime={formatGymTime}
                variant="left"
              />
            </div>
            <div className="col-span-6" />
            <div className="col-span-3 flex justify-end pointer-events-auto">
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

          {/* Bottom Action Controls */}
          <TimerControls
            isRunning={isRunning}
            seconds={seconds}
            currentSet={currentSet}
            totalSets={totalSets}
            soundEnabled={soundEnabled}
            targetSeconds={targetSeconds}
            onStartPause={handleStartPause}
            onStop={handleStop}
            onNextSet={handleNextSet}
            onToggleSound={handleToggleSound}
            onSetTarget={handleSetTarget}
          />
        </div>
      </div>

      {/* Auxiliary Settings & Quick Controls */}
      <div className="w-full max-w-4xl px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Set Configuration */}
        <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 flex flex-col justify-between shadow-md">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Target Sets ({totalSets})
          </div>
          <div className="flex items-center justify-between gap-2 bg-[#181a1f] border border-[#2a303d] rounded-xl px-3 py-2">
            <span className="text-xs text-zinc-400">Target Sets Goal:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTotalSets((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg bg-[#242730] hover:bg-[#2f3340] text-zinc-200 flex items-center justify-center text-sm font-bold cursor-pointer transition active:scale-95"
              >
                -
              </button>
              <span className="font-mono font-bold text-white text-sm px-1">{totalSets}</span>
              <button
                type="button"
                onClick={() => setTotalSets((p) => Math.min(20, p + 1))}
                className="w-7 h-7 rounded-lg bg-[#242730] hover:bg-[#2f3340] text-zinc-200 flex items-center justify-center text-sm font-bold cursor-pointer transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Workout Stats / Summary & Daily Reset */}
        <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 flex flex-col justify-between shadow-md">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" /> Today&apos;s Workout Stats
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
          <div className="grid grid-cols-3 gap-2 text-xs text-zinc-300">
            <div className="bg-[#181a1f] p-2 rounded-xl border border-[#242832]">
              <span className="text-zinc-500 block text-[10px]">SETS DONE</span>
              <span className="font-mono font-bold text-white text-sm">
                {completedSets.length}
              </span>
            </div>
            <div className="bg-[#181a1f] p-2 rounded-xl border border-[#242832]">
              <span className="text-zinc-500 block text-[10px]">AVG SET</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {avgSetDurationSecs > 0 ? `${avgSetDurationSecs}s` : "--"}
              </span>
            </div>
            <div className="bg-[#181a1f] p-2 rounded-xl border border-[#242832]">
              <span className="text-zinc-500 block text-[10px]">EST. KCAL</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {Math.round((totalGymSeconds / 60) * 6.5)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Sets History Log — only shown on full /stopwatch route */}
      {showSetHistory && completedSets.length > 0 && (
        <div className="w-full max-w-4xl px-2 sm:px-4 mt-6">
          <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 shadow-lg">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <TimerIcon className="w-4 h-4 text-emerald-400" /> Today&apos;s Logged Sets
              </span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[11px] text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                title="Clear all logged sets"
              >
                <Trash2 className="w-3 h-3" /> Clear History
              </button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {completedSets.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between flex-wrap gap-y-1 bg-[#181a1f] border border-[#242832] rounded-xl px-3 sm:px-4 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      {item.set}
                    </span>
                    <span className="font-medium text-white">Set {item.set}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 font-mono text-zinc-300 flex-wrap">
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
