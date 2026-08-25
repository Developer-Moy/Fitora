"use client";

import {
  Dumbbell,
  Flame,
  Clock,
  Trophy,
  ArrowUpRight,
  Play,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function UserWorkoutDashboardPage() {
  const workoutStats = [
    {
      label: "TOTAL CALORIES BURNED",
      value: "14,850 KCAL",
      change: "+14% THIS WEEK",
      icon: Flame,
    },
    {
      label: "WORKOUT TIME",
      value: "42.5 HOURS",
      change: "18 SESSIONS COMPLETED",
      icon: Clock,
    },
    {
      label: "ACTIVE STREAK",
      value: "14 DAYS",
      change: "PERSONAL BEST STREAK",
      icon: Trophy,
    },
    {
      label: "TOTAL EXERCISES",
      value: "186 SETS",
      change: "98% TARGET MET",
      icon: Dumbbell,
    },
  ];

  const upcomingWorkouts = [
    {
      id: 1,
      title: "CHEST & TRICEPS HYPERTROPHY",
      duration: "45 MIN",
      intensity: "HIGH INTENSITY",
      exercises: "6 EXERCISES",
      completed: false,
    },
    {
      id: 2,
      title: "BACK & BICEPS STRENGTH BUILD",
      duration: "50 MIN",
      intensity: "INTERMEDIATE",
      exercises: "7 EXERCISES",
      completed: true,
    },
    {
      id: 3,
      title: "LEG DAY & CORE STABILITY",
      duration: "60 MIN",
      intensity: "ADVANCED",
      exercises: "8 EXERCISES",
      completed: false,
    },
  ];

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              FITORA ATHLETE DASHBOARD
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            WORKOUT TRACKER
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-white/60 max-w-xl">
            Track your weekly fitness progress, view scheduled workout routines,
            and monitor calorie expenditure in real-time.
          </p>
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-2.5 bg-white text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl cursor-pointer"
        >
          <span>START NEW SESSION</span>
          <Play className="w-3.5 h-3.5 fill-black stroke-none" />
        </button>
      </div>

      {/* Stats Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workoutStats.map(({ label, value, change, icon: StatIcon }) => (
          <div
            key={label}
            className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-neutral-900 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                {label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <StatIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl sm:text-3xl font-black text-white tracking-tight">
              {value}
            </p>
            <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-white/70">
              {change}
            </p>
          </div>
        ))}
      </section>

      {/* Main Content Grid: Upcoming Workouts & Weekly Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Workout Routine List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white" />
              <span>SCHEDULED ROUTINES</span>
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">
              3 ROUTINES TODAY
            </span>
          </div>

          <div className="space-y-3">
            {upcomingWorkouts.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition-all duration-300 hover:border-white/30 hover:bg-neutral-900 flex items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        item.completed
                          ? "bg-white text-black"
                          : "border border-white/20 text-white/60"
                      }`}
                    >
                      {item.completed ? "COMPLETED" : item.intensity}
                    </span>
                    <span className="text-[10px] font-bold text-white/40">
                      {item.duration}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white truncate">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/50">{item.exercises}</p>
                </div>

                <button
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    item.completed
                      ? "bg-white text-black"
                      : "border border-white/20 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Fitness Targets & AI Recommendation */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Recommendation Box */}
          <div className="rounded-2xl border border-white/15 bg-neutral-900 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                FITORA AI RECOMMENDATION
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-medium">
              Based on your 14-day streak, your recovery level is optimal at
              94%. Today is recommended for Upper Body Hypertrophy with 45-second
              rest intervals.
            </p>

            <button
              type="button"
              className="w-full py-3 rounded-full bg-white text-black text-xs font-extrabold uppercase tracking-wider hover:bg-gray-100 transition cursor-pointer"
            >
              LOAD RECOMMENDED ROUTINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}