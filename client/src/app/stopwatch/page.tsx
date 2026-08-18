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
      setSelectedExercise(name);
      setCustomExercise("");
      setShowCustomInput(false);
      toast.success(`Custom exercise added: ${name}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Header Bar */}
      <header className="border-b border-[#1b1f26] bg-[#0d0f14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#15181f] hover:bg-[#1f242e] text-zinc-400 hover:text-white border border-[#232936] transition flex items-center gap-1.5 text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Dumbbell className="w-4 h-4 text-black font-bold" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                  FITORA <span className="text-emerald-400 font-mono">STOPWATCH</span>
                </h1>
                <p className="text-[10px] text-zinc-400 font-mono">GYM PERFORMANCE HUD</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#15181f] hover:bg-[#1f242e] text-zinc-300 hover:text-white border border-[#232936] transition flex items-center gap-1.5 text-xs cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-zinc-400" />
              )}
              <span className="hidden sm:inline">
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8 max-w-6xl w-full mx-auto">
        {/* Exercise Switcher Chips */}
        <div className="w-full max-w-4xl px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Current Exercise:{" "}
              <strong className="text-white font-bold text-sm ml-1">
                {selectedExercise}
              </strong>
            </span>
            <button
              onClick={() => setShowCustomInput((p) => !p)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Custom
            </button>
          </div>

          {showCustomInput && (
            <form onSubmit={handleAddCustomExercise} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter exercise name (e.g. Bicep Curls)..."
                value={customExercise}
                onChange={(e) => setCustomExercise(e.target.value)}
                className="bg-[#12141a] border border-emerald-700/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 flex-1"
                autoFocus
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer"
              >
                Set
              </button>
            </form>
          )}

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {POPULAR_EXERCISES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleSelectExercise(ex)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition border cursor-pointer ${
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

        {/* The Exact HUD Gym Stopwatch Component starting from 00:00:00 */}
        <GymTimer
          key={selectedExercise}
          exerciseName={selectedExercise}
          defaultSets={targetSets}
        />
      </main>

      {/* Footer Info */}
      <footer className="border-t border-[#1b1f26] bg-[#0a0c10] py-3 text-center text-xs text-zinc-500 font-mono">
        <p>FITORA FITNESS SUITE • REAL-TIME STOPWATCH & SET TRACKER</p>
      </footer>
    </div>
  );
}
