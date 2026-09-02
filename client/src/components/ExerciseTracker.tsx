"use client";

import { useMemo, useState, useEffect } from "react";
import { fetchExercises, type APIExercise } from "@/services/exerciseService";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Play,
  Search,
  Target,
  X,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

type Exercise = {
  id: string;
  name: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  equipment: string;
  muscle: string;
  description: string;
  tips: string[];
  videoId: string;
  image: string;
};

const categories = [
  "ALL",
  "CHEST",
  "BACK",
  "LEGS",
  "ARMS",
  "SHOULDERS",
  "CORE",
  "GLUTES",
  "FULL BODY",
  "CARDIO",
  "MOBILITY",
  "FUNCTIONAL",
];

export default function ExercisePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    async function loadExercises() {
      setIsLoading(true);
      const data = await fetchExercises();
      if (data) {
        const mapped = data.map((d) => ({
          id: d._id,
          name: d.name,
          category: (d.primaryMuscles[0] || "FUNCTIONAL").toUpperCase(),
          difficulty: d.difficulty.toUpperCase() as any,
          duration: "10 MIN", // Default or fetch if available
          equipment: d.equipment.toUpperCase(),
          muscle: (d.primaryMuscles[0] || "").toUpperCase(),
          description: d.instructions[0] || "",
          tips: d.instructions,
          videoId: d.videoUrl ? d.videoUrl.split("v=")[1] || d.videoUrl.split("/").pop() || "" : "",
          image: d.gifUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
        }));
        setExercises(mapped);
      }
      setIsLoading(false);
    }
    loadExercises();
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesCategory =
        activeCategory === "ALL" || exercise.category === activeCategory;

      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);

  const paginatedExercises = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExercises.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExercises, currentPage]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* =====================================================
          EXERCISE LIBRARY HEADER (ULTRA MINIMAL & COMPACT WITH PUBLIC BG)
      ====================================================== */}
      <section
        id="exercise-library"
        className="relative pt-6 pb-2 overflow-hidden border-b border-white/10 select-none"
      >
        {/* Background Image from public folder */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.35] contrast-110 z-0 transition-all duration-300"
          style={{
            backgroundImage: "url('/trainer-banner-bg-wide.jpg')",
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Top Title & Search Bar Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">
                  EXERCISE LIBRARY
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
                All Exercises & PR Studio
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="SEARCH EXERCISES..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-neutral-900 border border-white/15 rounded-full py-2.5 pl-11 pr-5 text-xs font-bold tracking-wider text-white placeholder:text-gray-400 outline-none focus:border-white transition shadow-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto py-8 scrollbar-hide">
            {categories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap px-5 py-3 rounded-full text-[10px] font-black tracking-wider transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-white text-black border border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]"
                      : "bg-neutral-900 border border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* 3x3 Exercise Grid (9 Cards Per Page) */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/50">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading exercise library...</p>
            </div>
          ) : paginatedExercises.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedExercises.map((exercise, index) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                    onClick={() => setSelectedExercise(exercise)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-12 pb-4 select-none">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(p - 1, 1));
                      document
                        .getElementById("exercise-library")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-xs font-bold text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  {/* Page Number Buttons */}
                  <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            document
                              .getElementById("exercise-library")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-full text-xs font-extrabold transition cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-white text-black font-black shadow-lg scale-105"
                              : "bg-neutral-900 text-gray-400 hover:text-white border border-white/10 hover:border-white/30"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                      document
                        .getElementById("exercise-library")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-xs font-bold text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center border border-white/10 rounded-2xl">
              <p className="text-white/40 text-sm font-bold uppercase tracking-wider">
                No exercises found
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          EXERCISE MODAL
      ====================================================== */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </main>
  );
}

/* ============================================================
   EXERCISE CARD
============================================================ */

function ExerciseCard({
  exercise,
  index,
  onClick,
}: {
  exercise: Exercise;
  index: number;
  onClick: () => void;
}) {
  const validCategoryImages: Record<string, string> = {
    CHEST:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
    BACK: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    LEGS: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80",
    ARMS: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    SHOULDERS:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
    CORE: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
    GLUTES:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80",
    "FULL BODY":
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    CARDIO:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1000&q=80",
    MOBILITY:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
    FUNCTIONAL:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
  };

  const defaultFallback =
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80";
  const initialImg =
    exercise.image || validCategoryImages[exercise.category] || defaultFallback;
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <article
      onClick={onClick}
      className="group relative h-[280px] sm:h-[310px] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-xl select-none"
    >
      {/* Image */}
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        onError={() => {
          if (imgSrc !== defaultFallback) {
            setImgSrc(defaultFallback);
          }
        }}
        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700 brightness-105 contrast-105"
      />

      {/* Subtle Gradient Overlay for High Contrast Text Reading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      {/* Number */}
      <div className="absolute top-4 left-4">
        <span className="bg-white text-black px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Play */}
      <div className="absolute top-4 right-4">
        <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full border border-white/20 bg-black/60 text-[9px] font-bold tracking-wider">
            {exercise.category}
          </span>

          <span className="px-2.5 py-0.5 rounded-full border border-white/20 bg-black/60 text-[9px] font-bold tracking-wider">
            {exercise.difficulty}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight line-clamp-1">
          {exercise.name}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-[10px] font-bold">
            <span className="flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" />
              {exercise.duration}
            </span>

            <span className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5" />
              {exercise.equipment}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white hover:underline">
            TECHNIQUE
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
}

{
  /* EXERCISE MODAL */
}

function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed inset-0 z-[100]
        bg-black/90 backdrop-blur-xl
        flex items-center justify-center
        p-0 sm:p-4 md:p-6
        pt-16 sm:pt-20 lg:pt-24
        select-none
      "
      onClick={onClose}
    >
      <div
        className="
          relative w-full h-full sm:h-auto sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-[88vh]
          max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-5xl
          overflow-y-auto overscroll-contain
          bg-neutral-950 border border-white/15
          rounded-none sm:rounded-3xl
          shadow-[0_0_50px_rgba(0,0,0,0.9)]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Mobile Sticky Header */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 sm:hidden">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="px-2.5 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wider shrink-0">
              {exercise.category}
            </span>
            <span className="text-xs font-black truncate text-white uppercase tracking-wider">
              {exercise.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop & Tablet Close Button */}
        <button
          onClick={onClose}
          className="
            hidden sm:flex absolute z-50
            top-4 right-4 sm:top-5 sm:right-5 lg:top-6 lg:right-6
            w-9 h-9 sm:w-10 sm:h-10 rounded-full
            bg-white text-black flex items-center justify-center
            hover:bg-gray-200 transition-all duration-300 shadow-xl cursor-pointer
          "
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-14 lg:pt-16">
          {/* ========================================================
              RESPONSIVE 50/50 LAYOUT: VIDEO + METADATA (LEFT) & TITLE + TIPS (RIGHT)
          ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN (50% Width) - Video Player & 3 Metadata Info Boxes */}
            <div className="space-y-4">
              {/* YouTube Video Player */}
              <div className="relative w-full aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-black border border-white/10 shadow-2xl">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0`}
                  title={`${exercise.name} exercise tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* 3 Metadata Cards (Duration, Equipment, Target) under Video */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                <InfoBox
                  icon={<Clock3 />}
                  label="DURATION"
                  value={exercise.duration}
                />
                <InfoBox
                  icon={<Dumbbell />}
                  label="EQUIPMENT"
                  value={exercise.equipment}
                />
                <InfoBox
                  icon={<Target />}
                  label="TARGET"
                  value={exercise.muscle}
                />
              </div>
            </div>

            {/* RIGHT COLUMN (50% Width) - Badges, Exercise Title, Description, Technique Tips & CTA */}
            <div className="space-y-5">
              {/* Category & Difficulty Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wider">
                  {exercise.category}
                </span>
                <span className="px-3 py-1 rounded-full border border-white/20 text-white/60 text-[9px] font-black uppercase tracking-wider">
                  {exercise.difficulty}
                </span>
              </div>

              {/* Exercise Title & Description */}
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-4xl font-black uppercase tracking-tight leading-[0.95] text-white">
                  {exercise.name}
                </h2>

                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mt-3">
                  {exercise.description}
                </p>
              </div>

              {/* Key Technique Tips Box */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    KEY TECHNIQUE TIPS
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {exercise.tips.map((tip, index) => (
                    <div
                      key={tip}
                      className="flex items-start gap-3 border-b border-white/5 pb-2.5 last:border-none"
                    >
                      <span className="shrink-0 text-white/30 text-xs font-black pt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-xs text-white/75 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Exercise CTA Button */}
              <button
                type="button"
                onClick={() => {
                  toast.success(
                    `Starting ${exercise.name} session! Head over to Gym Stopwatch to log sets.`,
                    { duration: 4000 },
                  );
                  onClose();
                }}
                className="group w-full inline-flex items-center justify-center gap-2.5 bg-white text-black font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <span>START THIS EXERCISE</span>
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4">
      <div className="text-white/35 mb-3">
        <span className="w-4 h-4 block [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      </div>

      <p className="text-[8px] font-bold tracking-[0.2em] text-white/30">
        {label}
      </p>

      <p className="text-[10px] sm:text-xs font-black uppercase mt-1">
        {value}
      </p>
    </div>
  );
}
