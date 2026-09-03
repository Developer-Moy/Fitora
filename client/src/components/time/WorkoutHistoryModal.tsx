"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  X,
  Search,
  Timer as TimerIcon,
  Trash2,
  Loader2,
  Calendar,
  Flame,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { getWorkoutLogs, deleteWorkoutLog } from "@/services/workoutService";
import type { WorkoutLog } from "@/types/workout";

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
}

export default function WorkoutHistoryModal({
  isOpen,
  onClose,
  userId,
  userEmail,
}: WorkoutHistoryModalProps) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "stopwatch" | "weighted">("all");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    getWorkoutLogs(userId, 200, userEmail)
      .then((res) => {
        if (isMounted && res && res.logs) {
          setLogs(res.logs);
        }
      })
      .catch(() => {
        if (isMounted) setLogs([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, userId, userEmail]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      const ok = await deleteWorkoutLog(id);
      if (ok) {
        setLogs((prev) => prev.filter((item) => item._id !== id));
        toast.success("Workout session removed from history");
      } else {
        toast.error("Failed to remove session");
      }
    } catch {
      toast.error("Failed to remove session");
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = log.exerciseName?.toLowerCase().includes(q);
      const matchNotes = log.notes?.toLowerCase().includes(q);
      if (!matchName && !matchNotes) return false;
    }
    if (filter === "stopwatch") {
      return log.notes?.toLowerCase().includes("stopwatch");
    }
    if (filter === "weighted") {
      return Number(log.weight) > 0;
    }
    return true;
  });

  const totalTime = logs.reduce(
    (acc, curr) => acc + (Number(curr.durationMinutes) || 0),
    0
  );
  const totalSets = logs.reduce(
    (acc, curr) => acc + (Number(curr.setsCount) || 0),
    0
  );
  const totalBurn = logs.reduce(
    (acc, curr) => acc + (Number(curr.caloriesBurned) || 0),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-neutral-950 border border-white/20 rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <History className="w-6 h-6 text-slate-300" />
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                    Gym & Workout History
                  </h2>
                </div>
                <p className="text-xs text-white/60">
                  Real-time auto-saved records of your stopwatch sets, weight volume, and calories.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-full transition cursor-pointer border border-white/20"
                  title="Open full profile dashboard"
                >
                  <span>Open in Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/15 transition-all cursor-pointer shrink-0"
                  aria-label="Close History Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Aggregate Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
              <div className="bg-black border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                  Total Workouts
                </span>
                <strong className="text-lg font-black text-white">
                  {logs.length}
                </strong>
              </div>
              <div className="bg-black border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                  Total Gym Time
                </span>
                <strong className="text-lg font-black text-white">
                  {totalTime} min
                </strong>
              </div>
              <div className="bg-black border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                  Total Sets
                </span>
                <strong className="text-lg font-black text-white">
                  {totalSets}
                </strong>
              </div>
              <div className="bg-black border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                  Total Burn
                </span>
                <strong className="text-lg font-black text-orange-400">
                  {totalBurn} kcal
                </strong>
              </div>
            </div>

            {/* Search and Filter Row */}
            <div className="flex items-center justify-between flex-wrap gap-2.5 shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by exercise name or weight..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black border border-white/15 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                />
              </div>
              <div className="flex items-center gap-1 bg-black border border-white/15 p-1 rounded-xl">
                {(["all", "stopwatch", "weighted"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                      filter === f
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {f === "all" ? "All" : f === "stopwatch" ? "Stopwatch Only" : "Weighted"}
                  </button>
                ))}
              </div>
            </div>

            {/* Workout Timeline List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[220px]">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center text-white/50 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading your workout records...
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="h-40 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2 text-white/50">
                  <History className="w-8 h-8 text-white/30" />
                  <p className="text-sm font-semibold text-white/70">
                    {search ? "No matching workouts found" : "No workout history recorded yet"}
                  </p>
                  <p className="text-xs text-white/40 max-w-sm">
                    {search
                      ? "Try searching for a different exercise or clear the filter."
                      : "Start the stopwatch and log your sets. They will auto-save right here in real time!"}
                  </p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const isStopwatch = log.notes?.toLowerCase().includes("stopwatch");
                  const displayDate = log.createdAt || log.date || new Date().toISOString();
                  const dateObj = new Date(displayDate);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent Workout";
                  const formattedTime = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={log._id || `${log.exerciseName}-${displayDate}`}
                      className="bg-black/70 border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm sm:text-base font-extrabold uppercase text-white tracking-wide truncate">
                            {log.exerciseName}
                          </strong>
                          {isStopwatch && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-white bg-white/15 border border-white/20 px-2 py-0.5 rounded-full">
                              <TimerIcon className="w-3 h-3 text-slate-300" />
                              Stopwatch
                            </span>
                          )}
                          <span className="text-[11px] text-white/40 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate} {formattedTime && `at ${formattedTime}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-mono text-white/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                            {log.durationMinutes ?? 1} min
                          </span>
                          {Number(log.weight) > 0 && (
                            <span className="font-mono text-white/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                              {log.weight} kg
                            </span>
                          )}
                          <span className="font-mono text-white/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                            {log.setsCount} sets × {log.repsCount} reps
                          </span>
                          {Number(log.caloriesBurned) > 0 && (
                            <span className="font-mono text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {log.caloriesBurned} kcal
                            </span>
                          )}
                        </div>

                        {log.notes && (
                          <p className="text-xs text-white/60 font-mono line-clamp-2">
                            {log.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDelete(log._id)}
                          title="Delete workout entry"
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
              <span>Showing {filteredLogs.length} of {logs.length} sessions</span>
              <button
                type="button"
                onClick={onClose}
                className="bg-white text-black font-bold text-xs px-5 py-2 rounded-full hover:bg-neutral-200 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
