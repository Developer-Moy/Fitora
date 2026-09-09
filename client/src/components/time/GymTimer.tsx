"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Dumbbell,
  Flame,
  Timer as TimerIcon,
  RotateCcw,
  Trash2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { createWorkoutLog } from "@/services/workoutService";
import {
  completeStopwatchSession,
  fetchStopwatchPresets,
  fetchRestPresets,
  createRestPreset,
  deleteRestPreset,
  fetchRecentSessions,
  syncDailyGymTime,
  resetDailyGymTime,
  type CustomRestPreset,
} from "@/services/stopwatchService";
import type { CreateWorkoutLogPayload } from "@/types/workout";
import { GymSessionCard } from "./GymSessionCard";
import { TimeDisplay } from "./TimeDisplay";
import { TimerControls } from "./TimerControls";
import QuickSetLogger from "./QuickSetLogger";

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
    Array<{
      set: number;
      duration: number;
      timestamp: string;
      weight?: number;
      reps?: number;
    }>
  >([]);
  // null = free-running stopwatch, number = target duration in seconds
  const [targetSeconds, setTargetSeconds] = useState<number | null>(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [quickTargets, setQuickTargets] = useState<number[]>([]);

  const [restPresets, setRestPresets] = useState<CustomRestPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDuration, setNewPresetDuration] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [presetSavedId, setPresetSavedId] = useState<string | null>(null);

  // Staged weight/reps from the Quick Set Logger — committed to history on Next Set / Stop
  const [pendingLog, setPendingLog] = useState<{
    weight: number;
    reps: number;
  } | null>(null);

  const { data: authSession } = useSession();
  const [localUserId, setLocalUserId] = useState<string | undefined>(undefined);

  const audioContextRef = useRef<AudioContext | null>(null);
  const chimePlayedRef = useRef<Set<number>>(new Set());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  const resumeAudioContext = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
  }, [getAudioContext]);

  const playChime = useCallback(
    (freq: number, duration = 0.12, type: OscillatorType = "sine") => {
      if (!soundEnabled) return;
      resumeAudioContext().catch(() => {});
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + duration,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // ignore
      }
    },
    [soundEnabled, resumeAudioContext, getAudioContext],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("fitora_user");
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.id || u._id) {
            setLocalUserId(u.id || u._id);
            return;
          }
        }
        const email = localStorage.getItem("fitora_user_email");
        if (email) setLocalUserId(email);
      } catch {}
    }
  }, []);

  const authUserId = authSession?.user?.id || localUserId;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAnnouncedRef = useRef<number | null>(null);
  const minuteAlertedRef = useRef<number>(0);

  const getTodayKey = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return `fitora_daily_gym_time_${today}`;
  }, []);

  // Total Gym Time for today (starts at 0, loaded from localStorage after mount to avoid SSR/hydration mismatch)
  const [totalGymSeconds, setTotalGymSeconds] = useState<number>(0);

  // Current session duration (active + rest time since last Stop) used for the workout log
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const isSavingLogRef = useRef<boolean>(false);

  useEffect(() => {
    // Initial local fallback
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`fitora_daily_gym_time_${today}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        // eslint-disable-next-line
        if (!isNaN(parsed)) setTotalGymSeconds(parsed);
      }
    } catch {
      // ignore
    }

    // Load dynamic recent sessions and today's accumulated gym time from MongoDB
    fetchRecentSessions(20)
      .then((res) => {
        if (res) {
          setIsSynced(true);
          if (res.todayGymSeconds > 0) {
            setTotalGymSeconds(res.todayGymSeconds);
          }
          if (res.sessions && res.sessions.length > 0) {
            const todayStr = new Date().toISOString().slice(0, 10);
            const todays = res.sessions.filter(
              (s) => s.completedAt && s.completedAt.slice(0, 10) === todayStr,
            );
            if (todays.length > 0) {
              const mapped = todays.map((s, idx) => ({
                set: s.setsCount || todays.length - idx,
                duration:
                  s.durationSeconds ||
                  Math.round((s.durationMinutes || 0) * 60),
                timestamp: new Date(s.completedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                weight: s.weightKg,
                reps: s.repsCount,
              }));
              setCompletedSets(mapped);
            }
          }
        }
      })
      .catch(() => {
        setIsSynced(false);
      });

    // Load quick presets
    fetchStopwatchPresets()
      .then((res) => {
        if (res && res.length > 0) {
          const targets = res
            .filter((p) => p.restDuration && p.restDuration > 0)
            .map((p) => p.restDuration)
            .sort((a, b) => a - b);
          if (targets.length > 0) {
            setQuickTargets(Array.from(new Set(targets)).slice(0, 4));
          }
        }
      })
      .catch(() => {});

    // Detect premium status from localStorage
    if (typeof window !== "undefined") {
      const role =
        localStorage.getItem("fitora_active_role") ||
        localStorage.getItem("fitora_user_role") ||
        "";
      const premium = role === "premium_user";
      setIsPremium(premium);
      if (premium) {
        setIsLoadingPresets(true);
        fetchRestPresets()
          .then((res) => {
            setRestPresets(res);
            const presetDurations = res
              .map((p) => p.duration)
              .filter((d) => d > 0);
            if (presetDurations.length > 0) {
              setQuickTargets((prev) => {
                const merged = new Set([...prev, ...presetDurations]);
                return Array.from(merged)
                  .sort((a, b) => a - b)
                  .slice(0, 6);
              });
            }
          })
          .catch(() => {})
          .finally(() => setIsLoadingPresets(false));
      }
    }
  }, []);

  // Save today's accumulated gym time to localStorage and MongoDB
  const saveDailyGymTime = useCallback(
    (secs: number) => {
      try {
        localStorage.setItem(getTodayKey(), secs.toString());
      } catch {
        // ignore
      }
      // Best-effort live sync to MongoDB
      syncDailyGymTime(secs).catch(() => {});
    },
    [getTodayKey],
  );

  // Synthesized Web Audio beep generator
  const triggerAudioFeedback = useCallback(
    (freq = 880, type: OscillatorType = "sine", duration = 0.12) => {
      if (!soundEnabled || typeof window === "undefined") return;
      resumeAudioContext().catch(() => {});
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + duration,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // AudioContext not permitted yet
      }
    },
    [soundEnabled, resumeAudioContext, getAudioContext],
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
    [soundEnabled],
  );

  // Main active timer interval (runs when user clicks Start)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Track current session duration (active + rest time)
        setSessionSeconds((prev) => prev + 1);

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

  // Inform the user at each completed minute of the active stopwatch (1 min, 2 min, ...)
  useEffect(() => {
    if (
      isRunning &&
      targetSeconds === null &&
      seconds > 0 &&
      seconds % 60 === 0
    ) {
      const minutes = seconds / 60;
      if (minuteAlertedRef.current < minutes) {
        minuteAlertedRef.current = minutes;
        speakVoiceAlert(
          minutes === 1 ? "1 minute completed" : `${minutes} minutes completed`,
        );
        toast.success(
          minutes === 1
            ? "⏱️ 1 minute completed! Keep going!"
            : `⏱️ ${minutes} minutes completed! Keep going!`,
          {
            icon: "💪",
            id: "minute-milestone",
            duration: 4000,
          },
        );
      }
    }
    if (seconds < 60) minuteAlertedRef.current = 0;
    // eslint-disable-next-line
  }, [seconds, isRunning, targetSeconds]);

  // Target-duration countdown warning cues & final alarm
  useEffect(() => {
    if (targetSeconds === null || !isRunning) return;

    const remaining = targetSeconds - seconds;

    // Distinct chimes at 3, 2, 1 seconds left
    if (remaining > 0 && remaining <= 3) {
      if (!chimePlayedRef.current.has(remaining)) {
        chimePlayedRef.current.add(remaining);
        const freq = remaining === 3 ? 523 : remaining === 2 ? 659 : 784;
        playChime(freq, 0.15);
      }
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
      // eslint-disable-next-line
      setIsRunning(false);
      setTargetSeconds(null);

      // Completion chime at 0 (once per session)
      if (!chimePlayedRef.current.has(0)) {
        chimePlayedRef.current.add(0);
        playChime(1047, 0.2);
        setTimeout(() => playChime(1319, 0.35), 180);
      }

      // Voice alert when rest timer hits zero (once per session)
      if (voiceAnnouncedRef.current !== 0) {
        voiceAnnouncedRef.current = 0;
        speakVoiceAlert("Rest Over, start next set!");
      }

      // Multi-beep completion alarm
      if (soundEnabled && typeof window !== "undefined") {
        try {
          const ctx = getAudioContext();
          if (ctx) {
            [0, 0.16, 0.32, 0.48].forEach((offset, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(
                i < 3 ? 880 : 1200,
                ctx.currentTime + offset,
              );
              gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
              gain.gain.exponentialRampToValueAtTime(
                0.0001,
                ctx.currentTime + offset + 0.14,
              );
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

      // Rest time is not a set — do not log an entry here
      toast.success(`⏰ Rest over — start your next set!`, {
        duration: 4000,
        id: "target-alarm",
      });
      setSeconds(0);
    }
    // eslint-disable-next-line
  }, [
    seconds,
    targetSeconds,
    isRunning,
    playChime,
    getAudioContext,
    soundEnabled,
  ]);

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
      toast.success(seconds > 0 ? "Timer resumed" : "Timer started", {
        id: "timer-status",
      });
    } else {
      setIsRunning(false);
      toast("Timer paused", { icon: "⏸️", id: "timer-status" });
    }
  }, [isRunning, seconds, triggerAudioFeedback]);

  // Persist the completed session to MongoDB via POST /api/workouts/log
  const persistWorkoutLog = useCallback(
    async (snapshot: {
      sets: Array<{ weight?: number; reps?: number }>;
      timedSeconds: number;
      totalSessionSeconds: number;
    }) => {
      const { sets, timedSeconds, totalSessionSeconds } = snapshot;

      const setsCount =
        sets.length > 0 ? sets.length : timedSeconds > 0 ? 1 : 0;
      if (setsCount === 0 || isSavingLogRef.current) return;

      const totalReps = sets.reduce((acc, s) => acc + (s.reps ?? 0), 0);
      const maxWeight = sets.reduce(
        (max, s) => Math.max(max, s.weight ?? 0),
        0,
      );
      const loggedSetsNotes = sets
        .filter((s) => s.weight !== undefined && s.reps !== undefined)
        .map((s) => `${s.weight}kg×${s.reps}`)
        .join(", ");

      const payload: CreateWorkoutLogPayload = {
        exerciseName,
        setsCount,
        repsCount: totalReps > 0 ? totalReps : 1,
        weight: maxWeight,
        durationMinutes: Math.round(totalSessionSeconds / 60),
        notes: loggedSetsNotes || "Timed session — weight/reps not tracked",
        date: new Date().toISOString(),
        ...(authUserId ? { userId: authUserId } : {}),
      };

      isSavingLogRef.current = true;
      const loadingToastId = "workout-log-save";
      toast.loading("Saving workout...", { id: loadingToastId });
      try {
        await createWorkoutLog(payload);
        // Also mark session complete in stopwatch API for calorie tracking and persistence in MongoDB
        await completeStopwatchSession({
          workoutType: exerciseName,
          durationMinutes: Math.max(
            0.1,
            Number((totalSessionSeconds / 60).toFixed(2)),
          ),
          durationSeconds: totalSessionSeconds,
          setsCount,
          repsCount: totalReps > 0 ? totalReps : undefined,
          weightKg: maxWeight > 0 ? maxWeight : undefined,
          notes: loggedSetsNotes,
        }).catch(() => {});
        setIsSynced(true);
        toast.success("Workout saved to your history 💪", {
          id: loadingToastId,
          duration: 4000,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save workout log",
          { id: loadingToastId, duration: 5000 },
        );
      } finally {
        isSavingLogRef.current = false;
      }
    },
    [authUserId, exerciseName],
  );

  const handleStop = useCallback(() => {
    triggerAudioFeedback(350);
    setIsRunning(false);
    setTargetSeconds(null);
    voiceAnnouncedRef.current = null;
    chimePlayedRef.current.clear();

    // Rest time is not exercise — only genuine logged/timed sets count
    const wasRestMode = targetSeconds !== null;

    // Flush the staged quick-log (if any) into history before saving
    let setsForSave = completedSets;
    if (pendingLog) {
      setsForSave = [
        ...completedSets,
        {
          set: currentSet,
          duration: seconds,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          weight: pendingLog.weight,
          reps: pendingLog.reps,
        },
      ];
      setCompletedSets(setsForSave);
      setPendingLog(null);
    }

    // Session complete -> persist to MongoDB exactly once
    void persistWorkoutLog({
      sets: setsForSave,
      timedSeconds: wasRestMode ? 0 : seconds,
      totalSessionSeconds: sessionSeconds,
    });
    setSessionSeconds(0);

    if (!wasRestMode && seconds > 0) {
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
      if (setsForSave === completedSets) {
        setCompletedSets((prev) => [newEntry, ...prev]);
      }
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
  }, [
    completedSets,
    currentSet,
    onSetComplete,
    pendingLog,
    persistWorkoutLog,
    seconds,
    sessionSeconds,
    targetSeconds,
    totalGymSeconds,
    triggerAudioFeedback,
  ]);

  const handleNextSet = () => {
    triggerAudioFeedback(950);
    const wasRestMode = targetSeconds !== null;
    setTargetSeconds(null);
    voiceAnnouncedRef.current = null;
    chimePlayedRef.current.clear();

    // Commit the staged quick-log (if any) into history now
    if (pendingLog) {
      setCompletedSets((prev) => [
        ...prev,
        {
          set: currentSet,
          duration: seconds,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          weight: pendingLog.weight,
          reps: pendingLog.reps,
        },
      ]);
      toast.success(
        `Set ${currentSet} added to history — ${pendingLog.weight}kg × ${pendingLog.reps}`,
      );
      setPendingLog(null);
    } else if (!wasRestMode && seconds > 0) {
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
          currentSet + 1,
        )}`,
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
      toast.success("🎉 All target sets completed! Great workout!", {
        duration: 4000,
      });
    }
    setSeconds(0);
    setIsRunning(false);
  };

  // Quick Set Logger: stage weight/reps for the current set (added to history on Next Set / Stop)
  const handleQuickLogSave = ({
    weight,
    reps,
  }: {
    weight: number;
    reps: number;
  }) => {
    setPendingLog({ weight, reps });
    setIsLoggerOpen(false);
    toast.success(
      `${weight}kg × ${reps} ready for Set ${currentSet} — click Next Set to add to history`,
      { icon: "🏋️", id: "quick-log-save", duration: 4000 },
    );
  };

  const handleResetDailyGymTime = async () => {
    setTotalGymSeconds(0);
    saveDailyGymTime(0);
    try {
      await resetDailyGymTime();
    } catch {}
    toast.success("Today's gym time reset to 00:00:00 (Synced with DB)", {
      id: "reset-day",
    });
  };

  // Set a target duration; clicking the same target again clears it (toggle)
  const handleSetTarget = (amount: number) => {
    const isDeselecting = targetSeconds === amount;
    setTargetSeconds(isDeselecting ? null : amount);
    setSeconds(0);
    setIsRunning(false);
    voiceAnnouncedRef.current = null;
    chimePlayedRef.current.clear();
    if (isDeselecting) {
      toast("Rest target cleared", { icon: "⏱️", id: "set-target" });
    } else {
      toast(`Rest target set: ${amount}s — press Start`, {
        icon: "⏱️",
        id: "set-target",
      });
    }
  };

  const handleClearHistory = () => {
    if (completedSets.length === 0) return;
    setCompletedSets([]);
    toast.success("Logged sets history cleared", { id: "clear-history" });
  };

  const handleSaveRestPreset = async () => {
    const name = newPresetName.trim();
    const duration = parseInt(newPresetDuration, 10);
    if (!name) {
      toast.error("Please enter a preset name", { id: "preset-error" });
      return;
    }
    if (isNaN(duration) || duration < 1 || duration > 3600) {
      toast.error("Duration must be between 1 and 3600 seconds", {
        id: "preset-error",
      });
      return;
    }
    const created = await createRestPreset({ name, duration });
    if (created) {
      setRestPresets((prev) => [created, ...prev]);
      setNewPresetName("");
      setNewPresetDuration("");
      setPresetSavedId(created._id);
      setTimeout(() => setPresetSavedId(null), 2000);
      toast.success(`Rest preset "${name}" saved`, { id: "preset-save" });
    } else {
      const role =
        localStorage.getItem("fitora_active_role") ||
        localStorage.getItem("fitora_user_role") ||
        "";
      if (role !== "premium_user") {
        toast.error("Upgrade to Premium to save rest presets", {
          id: "preset-error",
        });
      } else {
        toast.error("Failed to save preset", { id: "preset-error" });
      }
    }
  };

  const handleDeleteRestPreset = async (id: string) => {
    const preset = restPresets.find((p) => p._id === id);
    const ok = await deleteRestPreset(id);
    if (ok) {
      setRestPresets((prev) => prev.filter((p) => p._id !== id));
      if (preset) {
        setQuickTargets((prev) => prev.filter((d) => d !== preset.duration));
      }
      toast.success("Preset removed", { id: "preset-delete" });
    } else {
      toast.error("Failed to delete preset", { id: "preset-error" });
    }
  };

  const handleUsePreset = (duration: number) => {
    setTargetSeconds(duration);
    setSeconds(0);
    setIsRunning(false);
    voiceAnnouncedRef.current = null;
    chimePlayedRef.current.clear();
    toast.success(`Rest target set: ${duration}s — press Start`, {
      icon: "⏱️",
      id: "set-target",
    });
  };

  const handleToggleSync = async () => {
    if (!isSynced) {
      setIsSynced(true);
      const ok = await syncDailyGymTime(totalGymSeconds);
      if (ok) {
        toast.success("Realtime Sync connected to MongoDB", {
          id: "sync-status",
        });
      } else {
        toast.success("Realtime Sync active", { id: "sync-status" });
      }
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

  // Keyboard Shortcuts: Space = Start/Pause, Escape = Stop (disabled while Quick Set Logger is open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isLoggerOpen
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
  }, [handleStartPause, handleStop, isLoggerOpen]);

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
            completedSets.length,
        )
      : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main HUD Card */}
      <div className="relative w-full max-w-4xl px-2 sm:px-4 py-4 sm:py-6 flex flex-col items-center">
        {/* Ambient Backlight Glow — only visible while timer is running */}
        {isRunning && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[180px] sm:w-[400px] sm:h-[260px] rounded-full blur-3xl pointer-events-none transition-all duration-700 bg-white/15 scale-110" />
        )}

        {/* Inner Card Container */}
        <div className="relative z-20 w-full flex flex-col justify-between min-h-[220px] p-4 sm:p-6 md:p-7">
          {/* Center Area: Exercise label + Time Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest mb-1 flex items-center gap-1.5 px-1 py-1">
              <Dumbbell className="w-3.5 h-3.5 text-white" />
              <span className="truncate max-w-[200px] sm:max-w-none">
                {exerciseName}
              </span>
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
            quickTargets={quickTargets}
            onStartPause={handleStartPause}
            onStop={handleStop}
            onNextSet={handleNextSet}
            onToggleSound={handleToggleSound}
            onSetTarget={handleSetTarget}
            onQuickLog={() => setIsLoggerOpen(true)}
          />
        </div>
      </div>

      {/* Auxiliary Settings & Quick Controls */}
      <div className="w-full max-w-4xl px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Set Configuration */}
        <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 flex flex-col justify-between shadow-md">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Dumbbell className="w-4 h-4 text-white" /> Target Sets ({totalSets}
            )
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
              <span className="font-mono font-bold text-white text-sm px-1">
                {totalSets}
              </span>
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
              <Flame className="w-4 h-4 text-white" /> Today&apos;s Workout
              Stats
            </span>
            <button
              type="button"
              onClick={handleResetDailyGymTime}
              className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 transition cursor-pointer"
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
              <span className="font-mono font-bold text-white text-sm">
                {avgSetDurationSecs > 0 ? `${avgSetDurationSecs}s` : "--"}
              </span>
            </div>
            <div className="bg-[#181a1f] p-2 rounded-xl border border-[#242832]">
              <span className="text-zinc-500 block text-[10px]">EST. KCAL</span>
              <span className="font-mono font-bold text-white text-sm">
                {Math.round((totalGymSeconds / 60) * 6.5)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Rest Presets */}
      <div className="w-full max-w-4xl px-2 sm:px-4 mt-4">
        <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 shadow-md">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            {isPremium ? (
              <>
                <TimerIcon className="w-4 h-4 text-white" /> Custom Rest Presets
              </>
            ) : (
              <>
                <TimerIcon className="w-4 h-4 text-white" /> Rest Presets
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-700 rounded-full px-2 py-0.5">
                  Premium
                </span>
              </>
            )}
          </div>

          {isPremium ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Preset name (e.g. Heavy Set)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="flex-1 min-w-0 bg-[#181a1f] border border-[#2a303d] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-white font-medium"
                />
                <input
                  type="number"
                  placeholder="Seconds"
                  min={1}
                  max={3600}
                  value={newPresetDuration}
                  onChange={(e) => setNewPresetDuration(e.target.value)}
                  className="w-full sm:w-24 bg-[#181a1f] border border-[#2a303d] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-white font-mono font-medium"
                />
                <button
                  type="button"
                  onClick={handleSaveRestPreset}
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black text-xs font-black px-5 py-2 rounded-xl transition cursor-pointer shadow-lg uppercase"
                >
                  Save
                </button>
              </div>

              {isLoadingPresets ? (
                <div className="text-xs text-zinc-500">Loading presets...</div>
              ) : restPresets.length === 0 ? (
                <div className="text-xs text-zinc-500">
                  No custom rest presets yet. Add your first above.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {restPresets.map((p) => (
                    <div
                      key={p._id}
                      className={`inline-flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        presetSavedId === p._id
                          ? "bg-white text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.3)]"
                          : "bg-[#181a1f] text-zinc-300 border-[#252b38] hover:border-zinc-600"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleUsePreset(p.duration)}
                        className="cursor-pointer"
                      >
                        <span className="font-semibold">{p.name}</span>
                        <span className="ml-1.5 font-mono opacity-80">
                          {p.duration}s
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRestPreset(p._id)}
                        className="text-zinc-500 hover:text-white transition cursor-pointer"
                        title="Delete preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#181a1f] border border-[#2a303d] rounded-xl px-4 py-3">
              <p className="text-xs text-zinc-400 font-medium">
                Unlock unlimited custom rest presets and sync them across all
                your devices.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-white text-black text-xs font-black px-4 py-2 rounded-full transition cursor-pointer shadow-lg uppercase shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Premium</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Completed Sets History Log — only shown on full /stopwatch route */}
      {showSetHistory && completedSets.length > 0 && (
        <div className="w-full max-w-4xl px-2 sm:px-4 mt-6">
          <div className="bg-[#121417]/80 border border-[#222831] rounded-2xl p-4 shadow-lg">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <TimerIcon className="w-4 h-4 text-white" /> Today&apos;s Logged
                Sets
              </span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[11px] text-zinc-500 hover:text-white flex items-center gap-1 transition cursor-pointer"
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
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center font-bold text-[10px]">
                      {item.set}
                    </span>
                    <span className="font-medium text-white">
                      Set {item.set}
                    </span>
                    {item.weight !== undefined && item.reps !== undefined && (
                      <span className="rounded-full bg-white/10 border border-white/20 text-white px-2 py-0.5 font-mono text-[10px] font-semibold">
                        {item.weight}kg × {item.reps}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 font-mono text-zinc-300 flex-wrap">
                    <span>
                      Duration:{" "}
                      <strong className="text-white">
                        {formatTime(item.duration)}
                      </strong>
                    </span>
                    <span className="text-zinc-500">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Quick Set Logger Modal */}
      <QuickSetLogger
        isOpen={isLoggerOpen}
        exerciseName={exerciseName}
        currentSet={currentSet}
        totalSets={totalSets}
        onClose={() => setIsLoggerOpen(false)}
        onSave={handleQuickLogSave}
      />
    </div>
  );
}
