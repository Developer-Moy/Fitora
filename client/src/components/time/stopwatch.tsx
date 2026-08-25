"use client";

import React, { useState, useEffect } from "react";
import { GymTimer } from "@/components/time";
import toast from "react-hot-toast";
import {
  Maximize2,
  Minimize2,
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

export default function StopwatchPage({ showSetHistory = true }: { showSetHistory?: boolean }) {
  const [exercises, setExercises] = useState(POPULAR_EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customExercise, setCustomExercise] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [targetSets] = useState(5);

  // Keep isFullscreen in sync when user presses Esc or browser exits fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      toast("Entered Fullscreen — press Esc to exit", { icon: "⛶", id: "fullscreen" });
    } else {
      document.exitFullscreen?.().catch(() => {});
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
  <div className="min-h-screen w-full rounded-2xl  bg-[#090a0d] text-white flex flex-col overflow-x-hidden selection:bg-white selection:text-black ">

    <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

      {/* Exercise Switcher */}
      <section className="w-full max-w-4xl mx-auto mb-4 sm:mb-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">

          <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-white shrink-0" />

            <span>Current Exercise:</span>

            <strong className="text-white font-bold text-xs sm:text-sm ml-1 truncate">
              {selectedExercise}
            </strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomInput((p) => !p)}
              className="self-start sm:self-auto text-xs text-white hover:text-gray-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Custom
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition cursor-pointer
                bg-[#12141a] hover:bg-[#1a1e28] text-zinc-400 hover:text-white border-[#232836] hover:border-white/40"
            >
              {isFullscreen ? (
                <><Minimize2 className="w-3.5 h-3.5 text-white" /><span className="hidden sm:inline">Exit Full</span></>
              ) : (
                <><Maximize2 className="w-3.5 h-3.5 text-zinc-400" /><span className="hidden sm:inline">Fullscreen</span></>
              )}
            </button>
          </div>
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
              className="w-full min-w-0 bg-[#12141a] border border-[#232836] rounded-xl px-3 py-2 sm:py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/70"
              autoFocus
            />

            <button
              type="submit"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black text-xs font-bold px-5 py-2 sm:py-1.5 rounded-xl cursor-pointer"
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
                    ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]"
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
          showSetHistory={showSetHistory}
        />
      </section>

    </main>
  </div>
);
}
