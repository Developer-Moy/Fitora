"use client";

import React, { useState } from "react";
import { GymTimer } from "@/components/time";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Dumbbell,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Zap,
  Plus,
} from "lucide-react";

const POPULAR_EXERCISES = [
  "Bench Press",
  "Barbell Squat",
  "Deadlift",
  "Overhead Shoulder Press",
  "Pull-Ups",
  "Barbell Rows",
  "Incline Dumbbell Press",
  "Leg Press",
];

export default function StopwatchPage() {
  const [exercises, setExercises] = useState(POPULAR_EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customExercise, setCustomExercise] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [targetSets] = useState(5);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      toast("Entered Fullscreen", { icon: "⛶", id: "fullscreen" });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
        toast("Exited Fullscreen", { icon: "⛶", id: "fullscreen" });
      }
    }
  };

  const handleSelectExercise = (name: string) => {
    setSelectedExercise(name);
    toast.success(`Exercise selected: ${name}`, { id: "exercise-select" });
  };

  const handleAddCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (customExercise.trim()) {
      const name = customExercise.trim();
      setExercises((prev) => (prev.includes(name) ? prev : [name, ...prev]));
      setSelectedExercise(name);
      setCustomExercise("");
      setShowCustomInput(false);
      toast.success(`Custom exercise added: ${name}`);
    }
  };
return (
  <div className="min-h-screen w-full bg-[#0b0c0e] text-white flex flex-col overflow-x-hidden selection:bg-emerald-500 selection:text-black ">

    <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

      {/* Exercise Switcher */}
      <section className="w-full max-w-4xl mx-auto mb-4 sm:mb-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">

          <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />

            <span>Current Exercise:</span>

            <strong className="text-white font-bold text-xs sm:text-sm ml-1 truncate">
              {selectedExercise}
            </strong>
          </span>

          <button
            onClick={() => setShowCustomInput((p) => !p)}
            className="self-start sm:self-auto text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>

        {/* Custom Exercise */}
        {showCustomInput && (
          <form
            onSubmit={handleAddCustomExercise}
            className="flex flex-col sm:flex-row gap-2 mb-3"
          >
            <input
              type="text"
              placeholder="Enter exercise name..."
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              className="w-full min-w-0 bg-[#12141a] border border-emerald-700/50 rounded-xl px-3 py-2 sm:py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              autoFocus
            />

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-5 py-2 sm:py-1.5 rounded-xl cursor-pointer"
            >
              Set
            </button>
          </form>
        )}

        {/* Exercise Chips */}
        <div className="w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {exercises.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleSelectExercise(ex)}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-medium transition border cursor-pointer ${
                  selectedExercise === ex
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : "bg-[#12141a] hover:bg-[#191d26] text-zinc-400 border-[#232836]"
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timer */}
      <section className="w-full min-w-0">
        <GymTimer
          key={selectedExercise}
          exerciseName={selectedExercise}
          defaultSets={targetSets}
        />
      </section>

    </main>
  </div>
);
}
