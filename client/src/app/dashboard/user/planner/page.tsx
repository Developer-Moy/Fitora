"use client";

import { Calendar, Plus, CheckCircle2, Clock, Dumbbell } from "lucide-react";
import { useState } from "react";

export default function UserPlannerPage() {
  const [selectedDay, setSelectedDay] = useState("MONDAY");

  const days = [
    { name: "MON", full: "MONDAY", date: "AUG 26", workouts: 2 },
    { name: "TUE", full: "TUESDAY", date: "AUG 27", workouts: 1 },
    { name: "WED", full: "WEDNESDAY", date: "AUG 28", workouts: 2 },
    { name: "THU", full: "THURSDAY", date: "AUG 29", workouts: 0 },
    { name: "FRI", full: "FRIDAY", date: "AUG 30", workouts: 2 },
    { name: "SAT", full: "SATURDAY", date: "AUG 31", workouts: 1 },
    { name: "SUN", full: "SUNDAY", date: "SEP 01", workouts: 0 },
  ];

  const plannedItems = [
    {
      id: 1,
      title: "CHEST & TRICEPS HYPERTROPHY",
      time: "08:00 AM - 09:00 AM",
      type: "STRENGTH TRAINING",
      duration: "60 MIN",
      status: "SCHEDULED",
    },
    {
      id: 2,
      title: "EVENING CARDIO & CORE STABILITY",
      time: "06:30 PM - 07:15 PM",
      type: "CARDIO & CORE",
      duration: "45 MIN",
      status: "SCHEDULED",
    },
  ];

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              WORKOUT SCHEDULE
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            WEEKLY PLANNER
          </h1>
          <p className="mt-1.5 text-xs text-white/50 font-medium max-w-xl">
            Schedule your training sessions, set rest days, and organize your
            weekly workout calendar.
          </p>
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-gray-100 transition shadow-xl cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD NEW ROUTINE</span>
        </button>
      </div>

      {/* Days Filter Pills Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((day) => {
          const isActive = selectedDay === day.full;
          return (
            <button
              key={day.full}
              type="button"
              onClick={() => setSelectedDay(day.full)}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]"
                  : "bg-neutral-950 border-white/10 text-white hover:border-white/30"
              }`}
            >
              <div
                className={`text-[10px] font-black tracking-wider ${isActive ? "text-black/60" : "text-white/40"}`}
              >
                {day.name}
              </div>
              <div className="text-sm sm:text-base font-black my-1">
                {day.date.split(" ")[1]}
              </div>
              <div
                className={`text-[9px] font-extrabold ${isActive ? "text-black/80" : "text-white/60"}`}
              >
                {day.workouts > 0 ? `${day.workouts} WORKOUTS` : "REST"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Plan List */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-white" />
            <h2 className="text-base font-black uppercase tracking-wider text-white">
              {selectedDay} SCHEDULE
            </h2>
          </div>
          <span className="text-xs font-bold text-white/40 uppercase">
            2 Sessions Planned
          </span>
        </div>

        <div className="space-y-4">
          {plannedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-neutral-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-white/30"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-black uppercase">
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-white/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </span>
                </div>

                <h3 className="text-base font-black uppercase tracking-tight text-white">
                  {item.title}
                </h3>

                <p className="text-xs font-bold text-white/40">{item.time}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-white hover:bg-white hover:text-black transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-black hover:bg-gray-100 transition cursor-pointer"
                >
                  Start Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
