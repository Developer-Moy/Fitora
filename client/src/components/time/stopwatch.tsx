"use client";

import React, { useState, useEffect, useRef } from "react";
import { GymTimer } from "@/components/time";
import toast from "react-hot-toast";
import {
  Maximize2,
  Minimize2,
  Zap,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { fetchExercises } from "@/services/exerciseService";
import {
  createCustomPreset,
  fetchUserPresets,
} from "@/services/stopwatchService";

export default function StopwatchPage({
  showSetHistory = true,
}: {
  showSetHistory?: boolean;
}) {
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customExercise, setCustomExercise] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [targetSets] = useState(5);

  useEffect(() => {
    async function init() {
      try {
        const [globalRes, userRes] = await Promise.all([
          fetchExercises(),
          fetchUserPresets().catch(() => []),
        ]);

        let combined = new Set<string>();
        if (globalRes && globalRes.length > 0) {
          globalRes.forEach((e) => combined.add(e.name));
        } else {
          ["Bench Press", "Squat", "Deadlift"].forEach((e) => combined.add(e));
        }

        if (userRes && userRes.length > 0) {
          userRes.forEach((p) => combined.add(p.name));
        }

        const names = Array.from(combined).sort();
        setExercises(names);
        if (names.length > 0) setSelectedExercise(names[0]);
      } catch {
        setExercises(["Bench Press", "Squat", "Deadlift"]);
      }
    }
    init();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep isFullscreen in sync when user presses Esc or browser exits fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      toast("Entered Fullscreen — press Esc to exit", {
        icon: "⛶",
        id: "fullscreen",
      });
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleSelectExercise = (name: string) => {
    setSelectedExercise(name);
    toast.success(`Exercise selected: ${name}`, { id: "exercise-select" });
  };

  const handleAddCustomExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customExercise.trim()) {
      const name = customExercise.trim();
      setExercises((prev) => (prev.includes(name) ? prev : [name, ...prev]));
      setSelectedExercise(name);
      setCustomExercise("");
      setShowCustomInput(false);
      toast.success(`Custom exercise added: ${name}`);
      // Persist as a simple custom preset on backend (best-effort)
      createCustomPreset({
        name,
        workDuration: 45,
        restDuration: 60,
        rounds: 3,
      }).catch(() => {});
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-black text-white flex flex-col overflow-x-hidden selection:bg-white selection:text-black">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Top Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2 pb-2">
          <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            HUD Workout Stopwatch
          </h1>
          <p
            className="text-gray-300 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Precision intervals, Tabata sets, and audio cues for high-intensity
            training.
          </p>
        </div>

        {/* Exercise Switcher Header */}
        <section className="w-full max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Current Exercise:
              </span>
              <strong className="text-white font-extrabold text-sm sm:text-base tracking-wide uppercase">
                {selectedExercise}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCustomInput((p) => !p)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white transition cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white transition cursor-pointer shadow-md"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-white" />
                    <span>Exit Full</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Custom Exercise Input Form */}
          {showCustomInput && (
            <form
              onSubmit={handleAddCustomExercise}
              className="flex flex-col sm:flex-row gap-2 pt-2 animate-in fade-in duration-200"
            >
              <input
                type="text"
                placeholder="Enter custom exercise name..."
                value={customExercise}
                onChange={(e) => setCustomExercise(e.target.value)}
                className="w-full min-w-0 bg-neutral-900 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-white font-medium"
                autoFocus
              />

              <button
                type="submit"
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black text-xs font-black px-6 py-2.5 rounded-full transition cursor-pointer shadow-lg uppercase"
              >
                Add Exercise
              </button>
            </form>
          )}

          {/* Exercise Chips Bar with 2-side Navigation Arrows */}
          <div className="relative flex items-center gap-2.5 w-full pt-1">
            {/* Left Scroll Navigation Button */}
            <button
              type="button"
              onClick={scrollLeft}
              className="shrink-0 w-8 h-8 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition shadow-lg cursor-pointer z-10"
              aria-label="Scroll exercises left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Exercise Chips */}
            <div
              ref={scrollRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x scroll-smooth flex-1"
            >
              {exercises.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleSelectExercise(ex)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    selectedExercise === ex
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]"
                      : "bg-neutral-900 hover:bg-neutral-800 text-gray-300 border-white/10 hover:border-white/30"
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Right Scroll Navigation Button */}
            <button
              type="button"
              onClick={scrollRight}
              className="shrink-0 w-8 h-8 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition shadow-lg cursor-pointer z-10"
              aria-label="Scroll exercises right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Timer Main Arena */}
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
