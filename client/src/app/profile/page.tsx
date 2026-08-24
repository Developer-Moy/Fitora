"use client";

import { useState } from "react";
import {
  Award,
  Dumbbell,
  Calendar,
  CheckCircle2,
  Flame,
  Mail,
  Scale,
  Target,
  Trophy,
  TrendingDown,
  User,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import WorkoutHistory from "@/components/profile/WorkoutHistory";

const achievements = [
  {
    title: "First Workout Logged",
    description: "Completed your first workout",
    icon: "💪",
    unlocked: true,
  },
  {
    title: "100k KG Lifted",
    description: "Lifted a total of 100000 KG",
    icon: Dumbbell,
    unlocked: true,
  },
  {
    title: "Streak Champion",
    description: "Maintained a 10+ day streak",
    icon: Award,
    unlocked: true,
  },
  {
    title: "Goal Crusher",
    description: "Completed your first goal",
    icon: Target,
    unlocked: true,
  },
  {
    title: "Consistency King",
    description: "Stay active for 30 days",
    icon: "👑",
    unlocked: false,
  },
  {
    title: "Fitness Legend",
    description: "Complete 100 workouts",
    icon: Trophy,
    unlocked: false,
  },
];

const goalHistory = [
  {
    date: "August 15, 2026",
    target: "70 KG",
    status: "Completed",
    description: "Successfully reached your 70 KG target.",
  },
  {
    date: "July 28, 2026",
    target: "72 KG",
    status: "Completed",
    description: "Reached the target weight ahead of schedule.",
  },
  {
    date: "July 10, 2026",
    target: "75 KG",
    status: "Completed",
    description: "Successfully completed your weight-loss milestone.",
  },
  {
    date: "June 20, 2026",
    target: "80 KG",
    status: "Completed",
    description:
      "Started your fitness journey and reached your first milestone.",
  },
];

// Replace this mock data with API/database data when available.
const weightData = [
  { day: "Jul 25", weight: 77.8 },
  { day: "Jul 27", weight: 77.4 },
  { day: "Jul 29", weight: 77.1 },
  { day: "Jul 31", weight: 76.8 },
  { day: "Aug 02", weight: 76.4 },
  { day: "Aug 04", weight: 76.2 },
  { day: "Aug 06", weight: 75.9 },
  { day: "Aug 08", weight: 75.5 },
  { day: "Aug 10", weight: 75.1 },
  { day: "Aug 12", weight: 74.7 },
  { day: "Aug 14", weight: 74.3 },
  { day: "Aug 16", weight: 73.9 },
  { day: "Aug 18", weight: 73.4 },
  { day: "Aug 20", weight: 72.8 },
  { day: "Aug 23", weight: 72.2 },
];

const streakData = [
  { day: "Jul 25", streak: 1 },
  { day: "Jul 27", streak: 3 },
  { day: "Jul 29", streak: 5 },
  { day: "Jul 31", streak: 7 },
  { day: "Aug 02", streak: 9 },
  { day: "Aug 04", streak: 11 },
  { day: "Aug 06", streak: 12 },
  { day: "Aug 08", streak: 12 },
  { day: "Aug 10", streak: 12 },
  { day: "Aug 12", streak: 12 },
  { day: "Aug 14", streak: 12 },
  { day: "Aug 16", streak: 12 },
  { day: "Aug 18", streak: 12 },
  { day: "Aug 20", streak: 12 },
  { day: "Aug 23", streak: 12 },
];

export default function ProfilePage() {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [targetWeight, setTargetWeight] = useState(70);
  const [weeklyWorkoutFrequency, setWeeklyWorkoutFrequency] = useState(4);

  const latestWeight = weightData[weightData.length - 1].weight;
  const startingWeight = weightData[0].weight;
  const weightLost = Math.max(0, startingWeight - latestWeight);
  const currentStreak = streakData[streakData.length - 1].streak;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">Your Profile</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, Salauddin 👋
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Track your progress, achievements and fitness journey.
          </p>
        </div>

        {/* Profile Header Card */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="h-28 bg-linear-to-r from-blue-600/30 via-indigo-500/20 to-purple-600/30" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800 shadow-xl">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">Salauddin</h2>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400">
                      <Award className="h-3.5 w-3.5" />
                      PRO Member
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4" />
                    salauddin@gmail.com
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="h-4 w-4" />
                Member since June 2026
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Target className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Current Goal</p>
            <p className="mt-1 text-2xl font-bold">{targetWeight} KG</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Weight Lost</p>
            <p className="mt-1 text-2xl font-bold">
              {weightLost.toFixed(1)} KG
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Trophy className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Achievements</p>
            <p className="mt-1 text-2xl font-bold">4</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Active Streak</p>
            <p className="mt-1 text-2xl font-bold">{currentStreak} Days</p>
          </div>
        </section>

        {/* Progress Charts */}
        <section className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">30-Day Weight Progress</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your weight trend over the last 30 days.
                </p>
              </div>
              <Scale className="hidden h-6 w-6 shrink-0 text-blue-400 sm:block" />
            </div>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightData}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.12)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={18}
                  />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                    formatter={(value: any) => [`${value} KG`, "Weight"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Streak Continuity</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Track how consistently you have stayed active.
                </p>
              </div>
              <Flame className="hidden h-6 w-6 shrink-0 text-orange-400 sm:block" />
            </div>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={streakData}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.12)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={18}
                  />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, "dataMax + 2"]}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={34}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                    formatter={(value: any) => [`${value} days`, "Streak"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="streak"
                    stroke="#fb923c"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Goal + Workout Settings */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Fitness Goals</h2>
              <p className="mt-1 text-sm text-slate-400">
                Target: {targetWeight} KG · {weeklyWorkoutFrequency} workouts
                per week
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsGoalModalOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500 sm:w-auto"
            >
              <Target className="h-4 w-4" />
              Update Goals
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Streak */}
          <section className="rounded-2xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 to-slate-900 p-6 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-400">
                  Active Streak
                </p>
                <h2 className="mt-2 text-4xl font-bold">{currentStreak}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Days Active Streak
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">
                🔥
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-400">Next milestone</span>
                <span className="font-medium text-orange-400">18 days</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-2/3 rounded-full bg-orange-500" />
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Keep going! You are only 6 days away from your next streak
              milestone.
            </p>
          </section>

          {/* Achievements */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Earned Achievements</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your milestones and accomplishments
                </p>
              </div>
              <Award className="h-6 w-6 text-blue-400" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className={`rounded-xl border p-4 transition ${
                    achievement.unlocked
                      ? "border-slate-700 bg-slate-800/50"
                      : "border-slate-800 bg-slate-950/40 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-2xl">
                      {typeof achievement.icon === "string" ? (
                        achievement.icon
                      ) : (
                        <achievement.icon className="h-6 w-6 text-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {achievement.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {achievement.description}
                      </p>
                    </div>

                    {achievement.unlocked && (
                      <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Workout History (from /api/workouts/log) */}
        <WorkoutHistory />

        {/* Goal History */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold">Goal History</h2>
            <p className="mt-1 text-sm text-slate-400">
              Track your previous target weight milestones.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-3.75 top-2 h-[calc(100%-16px)] w-px bg-slate-700" />

            <div className="space-y-8">
              {goalHistory.map((goal) => (
                <div key={goal.date} className="relative flex gap-5">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs text-slate-500">{goal.date}</p>

                        <div className="mt-1 flex items-center gap-2">
                          <Scale className="h-4 w-4 text-blue-400" />
                          <h3 className="font-semibold">
                            Target Weight: {goal.target}
                          </h3>
                        </div>
                      </div>

                      <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                        {goal.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* GoalSetter Modal */}
      {isGoalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goal-setter-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsGoalModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="goal-setter-title" className="text-xl font-bold">
                  Goal Setter
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update your weight and weekly workout goals.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Target body weight (KG)
                </span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  step="0.1"
                  value={targetWeight}
                  onChange={(event) =>
                    setTargetWeight(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Weekly workout frequency
                </span>
                <select
                  value={weeklyWorkoutFrequency}
                  onChange={(event) =>
                    setWeeklyWorkoutFrequency(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency} {frequency === 1 ? "workout" : "workouts"} per
                      week
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
