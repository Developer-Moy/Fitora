"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, Clock, Dumbbell, Flame, RefreshCw, Repeat, Weight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getWorkoutLogs } from "@/services/workoutService";
import type { WorkoutLog, WorkoutLogSummary } from "@/types/workout";

const formatLogDate = (value?: string) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatLogTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function WorkoutHistory() {
  const { data: authSession } = useSession();
  const authUserId = authSession?.user?.id;

  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [summary, setSummary] = useState<WorkoutLogSummary | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await getWorkoutLogs(authUserId);
        if (cancelled) return;
        setLogs(result.logs);
        setSummary(result.summary);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load workout history");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [authUserId, refreshKey]);

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {/* Section Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Dumbbell className="h-5 w-5 text-green-400" />
            Workout History
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Your gym sessions saved from the stopwatch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {summary && summary.totalWorkouts > 0 && (
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
              {summary.totalWorkouts} sessions • {summary.totalDurationMinutes} min total
            </span>
          )}
          <button
            type="button"
            onClick={() => handleRefresh()}
            title="Refresh workout history"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/50 text-slate-400 transition hover:border-slate-600 hover:text-white cursor-pointer active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[132px] animate-pulse rounded-xl border border-slate-800 bg-slate-950/50"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-10 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => handleRefresh()}
            className="rounded-xl bg-red-500/10 border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 cursor-pointer active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && logs.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-12 text-center">
          <Dumbbell className="h-8 w-8 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No workouts logged yet</p>
          <p className="max-w-xs text-xs text-slate-500">
            Complete a session on the stopwatch page — press Stop when you finish and it will
            appear here automatically.
          </p>
        </div>
      )}

      {/* Logs Grid */}
      {!isLoading && !error && logs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {logs.map((log) => (
            <article
              key={log._id ?? `${log.exerciseName}-${log.date}`}
              className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700"
            >
              {/* Exercise + Date */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-semibold text-white">{log.exerciseName}</h3>
                <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                  #{log.setsCount} sets
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatLogDate(log.date)}
                {formatLogTime(log.date) && (
                  <span className="text-slate-600">• {formatLogTime(log.date)}</span>
                )}
              </p>

              {/* Metrics */}
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-1 py-2">
                  <dt className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                    <Clock className="h-3 w-3" /> Time
                  </dt>
                  <dd className="mt-0.5 text-sm font-bold text-white">
                    {log.durationMinutes ?? 0}m
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-1 py-2">
                  <dt className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                    <Repeat className="h-3 w-3" /> Reps
                  </dt>
                  <dd className="mt-0.5 text-sm font-bold text-white">{log.repsCount}</dd>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-1 py-2">
                  <dt className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                    <Weight className="h-3 w-3" /> Max KG
                  </dt>
                  <dd className="mt-0.5 text-sm font-bold text-white">{log.weight ?? 0}</dd>
                </div>
              </dl>

              {(log.caloriesBurned ?? 0) > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-orange-400/90">
                  <Flame className="h-3.5 w-3.5" />
                  ~{log.caloriesBurned} kcal burned
                </p>
              )}

              {log.notes && (
                <p className="mt-2 line-clamp-2 text-xs text-slate-500" title={log.notes}>
                  {log.notes}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
