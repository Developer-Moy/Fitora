"use client";
import { Award, Dumbbell, Calendar, CheckCircle2, Flame, Mail, Scale, Target, Trophy, TrendingDown, User, } from "lucide-react";

const achievements = [
    {
        title: "First Workout Logged",
        description: "Completed your first workout",
        icon: "💪",
        unlocked: true,
    },
    {
        title: "100k KG LIfted",
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
        description: "Started your fitness journey and reached your first milestone.",
    },

];


export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Your Profile
          </p>

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
                {/* Avatar */}
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
            <p className="mt-1 text-2xl font-bold">70 KG</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <TrendingDown className="h-5 w-5" />
            </div>

            <p className="text-sm text-slate-400">Weight Lost</p>
            <p className="mt-1 text-2xl font-bold">10 KG</p>
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
            <p className="mt-1 text-2xl font-bold">12 Days</p>
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

                <h2 className="mt-2 text-4xl font-bold">12</h2>

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

         {/* Goal History */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold">Goal History</h2>
            <p className="mt-1 text-sm text-slate-400">
              Track your previous target weight milestones.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3.75 top-2 h-[calc(100%-16px)] w-px bg-slate-700" />

            <div className="space-y-8">
              {goalHistory.map((goal, index) => (
                <div key={goal.date} className="relative flex gap-5">
                  {/* Timeline icon */}
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
    </main>
    )
};