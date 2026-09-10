"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Flame, Calendar, Dumbbell, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { getWorkoutLogs } from "@/services/workoutService";
import { getAuthSession } from "@/services/authService";
import type { WorkoutLog } from "@/types/workout";

interface ActivityHeatmapProps {
  userId?: string;
  initialLogs?: WorkoutLog[];
  className?: string;
}

interface DayData {
  date: Date;
  dateKey: string;
  count: number;
  isFuture: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
  month: number;
  dayOfMonth: number;
  year: number;
  workouts: WorkoutLog[];
}

interface WeekData {
  days: DayData[];
  firstDayDate: Date;
  isNewMonth?: boolean;
}

interface TooltipState {
  visible: boolean;
  dateStr: string;
  count: number;
  x: number;
  y: number;
  workouts: WorkoutLog[];
}

// Format Date object to local YYYY-MM-DD string without UTC shifting
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Format Date to friendly readable string: e.g. "September 10, 2026"
function formatReadableDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Convert a workout log's date or createdAt to local YYYY-MM-DD
function getWorkoutDateKey(log: WorkoutLog): string | null {
  const raw = log.date || log.createdAt;
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return formatDateKey(d);
}

// Monochrome Intensity Levels:
// 0: very subtle dark/gray square
// 1: light gray
// 2: brighter gray
// 3: near-white
// 4+: white / strongest glow
function getMonochromeIntensityClasses(count: number, isFuture: boolean): string {
  if (isFuture) {
    return "bg-white/[0.02] border border-white/[0.04] opacity-25 cursor-default";
  }
  if (count === 0) {
    return "bg-white/[0.05] border border-white/[0.08] hover:border-white/40 hover:bg-white/[0.09]";
  }
  if (count === 1) {
    return "bg-white/30 border border-white/40 shadow-[0_0_5px_rgba(255,255,255,0.12)] hover:bg-white/40";
  }
  if (count === 2) {
    return "bg-white/55 border border-white/65 shadow-[0_0_8px_rgba(255,255,255,0.25)] hover:bg-white/70";
  }
  if (count === 3) {
    return "bg-white/80 border border-white shadow-[0_0_12px_rgba(255,255,255,0.45)] hover:bg-white/90";
  }
  // 4 or more
  return "bg-white border border-white shadow-[0_0_16px_rgba(255,255,255,0.85)] hover:shadow-[0_0_20px_rgba(255,255,255,1)]";
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function ActivityHeatmap({
  userId,
  initialLogs,
  className = "",
}: ActivityHeatmapProps) {
  const [fetchedLogs, setFetchedLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(!initialLogs);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    dateStr: "",
    count: 0,
    x: 0,
    y: 0,
    workouts: [],
  });
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [selectedYear, setSelectedYear] = useState<number>(() =>
    new Date().getFullYear(),
  );

  const logs = initialLogs ?? fetchedLogs;

  // Extract available years from workout history + current year (like GitHub)
  const availableYears = useMemo(() => {
    const currentYr = new Date().getFullYear();
    const set = new Set<number>();
    set.add(currentYr);
    set.add(currentYr - 1);
    for (const log of logs) {
      const raw = log.date || log.createdAt;
      if (raw) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          set.add(d.getFullYear());
        }
      }
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [logs]);

  // Resolve target user ID
  const effectiveUserId = useMemo(() => {
    if (userId) return userId;
    if (typeof window !== "undefined") {
      const sessionUser = getAuthSession().user;
      return (
        sessionUser?.id ||
        sessionUser?._id ||
        localStorage.getItem("fitora_user_email") ||
        "guest_user"
      );
    }
    return "guest_user";
  }, [userId]);

  // Fetch logs if not provided in initialLogs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getWorkoutLogs(effectiveUserId, 500);
      setFetchedLogs(Array.isArray(result.logs) ? result.logs : []);
    } catch (err) {
      console.error("[ActivityHeatmap] Failed to fetch workout logs:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load activity heatmap records.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    if (initialLogs) return;
    let isCancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getWorkoutLogs(effectiveUserId, 500);
        if (!isCancelled) {
          setFetchedLogs(Array.isArray(result.logs) ? result.logs : []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("[ActivityHeatmap] Failed to fetch workout logs:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load activity heatmap records.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [initialLogs, effectiveUserId]);

  // Group workout logs by date
  const workoutsByDate = useMemo(() => {
    const map = new Map<string, WorkoutLog[]>();
    for (const log of logs) {
      const key = getWorkoutDateKey(log);
      if (key) {
        const existing = map.get(key) || [];
        existing.push(log);
        map.set(key, existing);
      }
    }
    return map;
  }, [logs]);

  // Generate GitHub-style 52-53 weeks for selectedYear
  const { weeks, monthLabels, totalWorkoutsInYear, activeDaysInYear } =
    useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayKey = formatDateKey(today);

      // Start date: Monday of the week containing Jan 1 of selectedYear
      const jan1 = new Date(selectedYear, 0, 1);
      const jan1Weekday = (jan1.getDay() + 6) % 7; // Mon = 0, Sun = 6
      const startDate = new Date(selectedYear, 0, 1 - jan1Weekday);

      // End date: Sunday of the week containing Dec 31 of selectedYear
      const dec31 = new Date(selectedYear, 11, 31);
      const dec31Weekday = (dec31.getDay() + 6) % 7;
      const endSunday = new Date(selectedYear, 11, 31 + (6 - dec31Weekday));

      const diffMs = endSunday.getTime() - startDate.getTime();
      const totalWeeks = Math.max(52, Math.round(diffMs / (7 * 86400000)));

      const generatedWeeks: WeekData[] = [];
      const monthPositions: { label: string; weekIndex: number }[] = [];
      let lastMonth = -1;

      let workoutCountSum = 0;
      let activeDaysCount = 0;

      const cursor = new Date(startDate);

      for (let w = 0; w < totalWeeks; w++) {
        const weekDays: DayData[] = [];
        const weekFirstDate = new Date(cursor);

        for (let d = 0; d < 7; d++) {
          const dayDate = new Date(cursor);
          const key = formatDateKey(dayDate);
          const isFuture = dayDate.getTime() > today.getTime();
          const isToday = key === todayKey;
          const isSelectedYear = dayDate.getFullYear() === selectedYear;

          const dayWorkouts = workoutsByDate.get(key) || [];
          const count = dayWorkouts.length;

          if (!isFuture && isSelectedYear && count > 0) {
            workoutCountSum += count;
            activeDaysCount += 1;
          }

          weekDays.push({
            date: dayDate,
            dateKey: key,
            count: isSelectedYear ? count : 0,
            isFuture: isFuture || !isSelectedYear,
            isToday,
            dayOfWeek: d,
            month: dayDate.getMonth(),
            dayOfMonth: dayDate.getDate(),
            year: dayDate.getFullYear(),
            workouts: isSelectedYear ? dayWorkouts : [],
          });

          // Check for month label placement on the 1st of a month or when month changes
          if (
            isSelectedYear &&
            dayDate.getMonth() !== lastMonth &&
            dayDate.getDate() <= 7
          ) {
            monthPositions.push({
              label: MONTH_NAMES[dayDate.getMonth()],
              weekIndex: w,
            });
            lastMonth = dayDate.getMonth();
          }

          cursor.setDate(cursor.getDate() + 1);
        }

        const isNewMonth =
          w > 0 &&
          weekDays.some(
            (d) => d.dayOfMonth === 1 && d.year === selectedYear,
          );

        generatedWeeks.push({
          days: weekDays,
          firstDayDate: weekFirstDate,
          isNewMonth,
        });
      }

      // Filter month labels so they don't visually overlap (at least 3 weeks apart)
      const dedupedMonthLabels: { label: string; weekIndex: number }[] = [];
      for (let i = 0; i < monthPositions.length; i++) {
        const current = monthPositions[i];
        const prev = dedupedMonthLabels[dedupedMonthLabels.length - 1];
        if (!prev || current.weekIndex - prev.weekIndex >= 3) {
          dedupedMonthLabels.push(current);
        }
      }

      return {
        weeks: generatedWeeks,
        monthLabels: dedupedMonthLabels,
        totalWorkoutsInYear: workoutCountSum,
        activeDaysInYear: activeDaysCount,
      };
    }, [workoutsByDate, selectedYear]);

  // Calculate current consistency streak strictly from real data
  const consistencyStreak = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = formatDateKey(today);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);

    const todayCount = (workoutsByDate.get(todayKey) || []).length;
    const yesterdayCount = (workoutsByDate.get(yesterdayKey) || []).length;

    // If neither today nor yesterday has a workout, current streak is broken (0)
    if (todayCount === 0 && yesterdayCount === 0) {
      return 0;
    }

    let streak = 0;
    const checkDate = new Date(today);

    // If worked out today, count starts from today and continues backwards
    if (todayCount > 0) {
      while (true) {
        const key = formatDateKey(checkDate);
        const dayCount = (workoutsByDate.get(key) || []).length;
        if (dayCount > 0) {
          streak += 1;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // Today has 0 workouts so far, but yesterday was active -> streak is alive!
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const key = formatDateKey(checkDate);
        const dayCount = (workoutsByDate.get(key) || []).length;
        if (dayCount > 0) {
          streak += 1;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return streak;
  }, [workoutsByDate]);

  // Contextual streak encouragement text
  const streakMessage = useMemo(() => {
    const today = new Date();
    const todayKey = formatDateKey(today);
    const workedOutToday = (workoutsByDate.get(todayKey) || []).length > 0;

    if (consistencyStreak === 0) {
      return "Start your streak with a session today!";
    }
    if (workedOutToday) {
      return "Streak extended today — Keep it going! 🔥";
    }
    return "Log a workout today to keep your streak alive!";
  }, [consistencyStreak, workoutsByDate]);

  // Tooltip interaction handlers
  const handleCellMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, day: DayData) => {
      if (day.isFuture) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        dateStr: formatReadableDate(day.date),
        count: day.count,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
        workouts: day.workouts,
      });
    },
    [],
  );

  const handleCellMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleCellClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, day: DayData) => {
      if (day.isFuture) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        dateStr: formatReadableDate(day.date),
        count: day.count,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
        workouts: day.workouts,
      });
    },
    [],
  );

  return (
    <div
      className={`bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all space-y-5 ${className}`}
    >
      {/* ── Top Header / Streak Badge ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-white font-sans">
                Workout Activity
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80 font-mono">
                {selectedYear}
              </span>
            </div>
            <p className="text-xs text-white/60">
              {streakMessage}
            </p>
          </div>
        </div>

        {/* Dynamic Consistency Streak Badge */}
        <div className="flex items-center gap-2.5 self-start sm:self-center bg-white/[0.07] hover:bg-white/[0.1] border border-white/20 rounded-xl px-3.5 py-2 transition-all">
          <Flame
            className={`w-5 h-5 ${
              consistencyStreak > 0
                ? "text-white fill-white animate-pulse"
                : "text-white/40"
            }`}
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 leading-none">
              Consistency Streak
            </span>
            <span className="text-base font-black text-white font-mono tracking-tight leading-tight">
              {consistencyStreak} {consistencyStreak === 1 ? "Day" : "Days"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center justify-between gap-3 bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchLogs}
            className="inline-flex items-center gap-1 text-white font-bold underline hover:no-underline cursor-pointer text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* ── Main Heatmap Grid with Right-Side Year List (GitHub Style) ── */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="space-y-2 py-6 animate-pulse">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>Loading activity heatmap...</span>
            <div className="w-24 h-3 bg-white/10 rounded" />
          </div>
          <div className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
          {/* Scrollable Heatmap Grid Area */}
          <div className="flex-1 min-w-0 w-full overflow-hidden">
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="inline-block min-w-max select-none">
                {/* Month Labels Row */}
                <div className="flex text-[11px] font-semibold text-white/50 mb-1.5 h-4 pl-7">
                {weeks.map((week, wIdx) => {
                  const labelObj = monthLabels.find(
                    (m) => m.weekIndex === wIdx,
                  );
                  return (
                    <div
                      key={`month-label-${wIdx}`}
                      className={`w-3.5 mr-1 text-left relative ${
                        week.isNewMonth ? "ml-2.5" : ""
                      }`}
                    >
                      {labelObj && (
                        <span className="absolute left-0 top-0 whitespace-nowrap">
                          {labelObj.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grid with Weekday Labels on the left and 7 rows of days */}
              <div className="flex gap-1">
                {/* Weekday indicator labels */}
                <div className="flex flex-col justify-between text-[9px] font-bold uppercase tracking-wider text-white/40 pr-1.5 py-0.5 select-none w-6 text-right">
                  <span className="h-3.5 leading-[14px]">Mon</span>
                  <span className="h-3.5 leading-[14px] opacity-0">Tue</span>
                  <span className="h-3.5 leading-[14px]">Wed</span>
                  <span className="h-3.5 leading-[14px] opacity-0">Thu</span>
                  <span className="h-3.5 leading-[14px]">Fri</span>
                  <span className="h-3.5 leading-[14px] opacity-0">Sat</span>
                  <span className="h-3.5 leading-[14px] opacity-0">Sun</span>
                </div>

                {/* 53 Columns of Weeks */}
                {weeks.map((week, wIdx) => (
                  <div
                    key={`week-${wIdx}`}
                    className={`flex flex-col gap-1 ${
                      week.isNewMonth ? "ml-2.5" : ""
                    }`}
                  >
                    {week.days.map((day) => {
                      const intensityClass = getMonochromeIntensityClasses(
                        day.count,
                        day.isFuture,
                      );
                      const isTodayBorder = day.isToday
                        ? "ring-1 ring-white ring-offset-1 ring-offset-black"
                        : "";

                      return (
                        <button
                          key={day.dateKey}
                          type="button"
                          aria-label={`${formatReadableDate(day.date)}: ${day.count} workouts`}
                          onMouseEnter={(e) => handleCellMouseEnter(e, day)}
                          onMouseLeave={handleCellMouseLeave}
                          onClick={(e) => handleCellClick(e, day)}
                          disabled={day.isFuture}
                          className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-150 relative cursor-pointer ${intensityClass} ${isTodayBorder}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Empty State Callout ── */}
          {!isLoading && logs.length === 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-white/[0.02] p-4 rounded-xl border border-white/10">
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-wider text-white">
                  Start Your Fitness Journey
                </p>
                <p className="text-[11px] text-white/60">
                  Track your first workout session to light up your activity heatmap.
                </p>
              </div>
              <Link
                href="/stopwatch"
                className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start Session</span>
              </Link>
            </div>
          )}
          </div>

          {/* Right-Side Year List (GitHub Style) */}
          <div className="flex lg:flex-col gap-1 shrink-0 w-full lg:w-20 pt-1 lg:border-l lg:border-white/10 lg:pl-4 overflow-x-auto pb-1 lg:pb-0 select-none">
            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all text-center lg:text-left cursor-pointer ${
                  selectedYear === yr
                    ? "bg-white text-black font-extrabold shadow-md"
                    : "text-white/50 hover:text-white hover:bg-white/10 font-semibold"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer: Stats Summary & Monochrome Intensity Legend ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-white/60">
        {/* Real Summary Metrics */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-white/60" />
            <span className="font-semibold text-white">
              {totalWorkoutsInYear}
            </span>
            <span>workouts in {selectedYear}</span>
          </div>
          <span className="text-white/20 hidden sm:inline">&bull;</span>
          <div>
            <span className="font-semibold text-white">
              {activeDaysInYear}
            </span>
            <span> active days</span>
          </div>
        </div>

        {/* Monochrome Heatmap Legend */}
        <div className="flex items-center gap-2 self-end sm:self-auto select-none">
          <span className="text-[11px] text-white/50">Less</span>
          <div className="flex items-center gap-1">
            <span
              title="0 workouts"
              className="w-3 h-3 rounded-[2px] bg-white/[0.05] border border-white/[0.08]"
            />
            <span
              title="1 workout"
              className="w-3 h-3 rounded-[2px] bg-white/30 border border-white/40"
            />
            <span
              title="2 workouts"
              className="w-3 h-3 rounded-[2px] bg-white/55 border border-white/65"
            />
            <span
              title="3 workouts"
              className="w-3 h-3 rounded-[2px] bg-white/80 border border-white"
            />
            <span
              title="4+ workouts"
              className="w-3 h-3 rounded-[2px] bg-white border border-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            />
          </div>
          <span className="text-[11px] text-white/50">More</span>
        </div>
      </div>

      {/* ── Floating Hover Tooltip (Rendered via Portal to prevent section height shifts) ── */}
      {isMounted &&
        tooltip.visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: "translate(-50%, -100%)",
            }}
            className="pointer-events-none z-[99999] transition-all duration-75"
          >
            <div className="bg-neutral-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl px-3 py-1.5 shadow-2xl space-y-0.5 min-w-[120px] text-center">
              <p className="text-[10px] font-medium text-white/60 tracking-tight">
                {tooltip.dateStr}
              </p>
              <p className="text-xs font-black text-white">
                {tooltip.count === 0
                  ? "No workouts"
                  : tooltip.count === 1
                    ? "1 workout"
                    : `${tooltip.count} workouts`}
              </p>
              {tooltip.workouts.length > 0 && (
                <p className="text-[10px] text-white/80 truncate max-w-[190px] pt-0.5 border-t border-white/10">
                  {tooltip.workouts
                    .map((w) => w.exerciseName || "Workout")
                    .slice(0, 2)
                    .join(", ")}
                  {tooltip.workouts.length > 2
                    ? ` +${tooltip.workouts.length - 2}`
                    : ""}
                </p>
              )}
              {/* Subtle Downward Pointer Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white/20" />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
