"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Play,
  Clock3,
  Dumbbell,
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  LogIn,
} from "lucide-react";
import type { SavedFavoriteExercise } from "@/services/exerciseService";

interface FavoriteExercisesSectionProps {
  favorites: SavedFavoriteExercise[];
  isLoading: boolean;
  isLoggedIn: boolean;
  onSelectExercise: (exercise: any) => void;
  onToggleFavorite: (exercise: any, e?: React.MouseEvent) => void;
  onViewAllInGrid: () => void;
}

export default function FavoriteExercisesSection({
  favorites,
  isLoading,
  isLoggedIn,
  onSelectExercise,
  onToggleFavorite,
  onViewAllInGrid,
}: FavoriteExercisesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const defaultFallback =
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80";

  return (
    <section className="mb-8 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Heart className="w-4 h-4 fill-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Favorite & Regular Exercises
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                {favorites.length}
              </span>
            </div>
            <p className="text-[11px] text-white/50 tracking-wide mt-0.5">
              Quick access to your go-to routines • Synced with your profile database
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onViewAllInGrid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition cursor-pointer"
            >
              <span>View In Full Grid</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {favorites.length > 3 && (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="w-7 h-7 rounded-full bg-neutral-900 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="w-7 h-7 rounded-full bg-neutral-900 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="h-44 rounded-2xl border border-white/10 bg-neutral-950/60 p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-bold text-white/50">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Loading your favorite exercises...</span>
          </div>
        </div>
      ) : favorites.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide snap-x scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {favorites.map((exercise) => {
            const ytThumbnail = exercise.videoId
              ? `https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`
              : null;
            const imgSrc = ytThumbnail || exercise.image || defaultFallback;

            return (
              <div
                key={exercise.exerciseId || exercise._id}
                onClick={() => onSelectExercise(exercise)}
                className="group relative shrink-0 w-64 sm:w-72 h-44 rounded-2xl bg-neutral-900 border border-white/15 hover:border-red-500/40 overflow-hidden shadow-lg transition-all duration-300 cursor-pointer snap-start flex flex-col justify-between"
              >
                {/* Background Image */}
                <Image
                  src={imgSrc}
                  alt={exercise.name}
                  fill
                  sizes="288px"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 pointer-events-none" />

                {/* Top Badges & Action */}
                <div className="relative z-10 p-3.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wider">
                    {exercise.category}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => onToggleFavorite(exercise, e)}
                    className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-[0_0_10px_rgba(239,68,68,0.5)] cursor-pointer"
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-3.5 space-y-1.5">
                  <h3 className="text-sm font-black uppercase text-white truncate group-hover:text-red-400 transition">
                    {exercise.name}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-white/70 pt-1 border-t border-white/10 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-3 h-3 text-white/40" />
                      {exercise.duration}
                    </span>

                    <span className="flex items-center gap-1 text-white/50 truncate max-w-[120px]">
                      <Target className="w-3 h-3 text-white/40" />
                      {exercise.muscle}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-white group-hover:translate-x-0.5 transition">
                      <span>START</span>
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !isLoggedIn ? (
        /* Guest prompt */
        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5 sm:p-6 text-center space-y-2.5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/15 mx-auto flex items-center justify-center text-white/60">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Save Your Favorite Regular Workouts
            </h3>
            <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
              Sign in to save your go-to exercises directly to your profile database so you can find and execute them in one click.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition cursor-pointer shadow-md mt-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In To Save Favorites</span>
          </Link>
        </div>
      ) : (
        /* Logged in with 0 favorites */
        <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-950/50 p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 mx-auto flex items-center justify-center text-red-500/80">
            <Heart className="w-5 h-5 fill-red-500/20" />
          </div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
            No Favorite Exercises Added Yet
          </h3>
          <p className="text-xs text-white/45 max-w-md mx-auto">
            Click the <Heart className="w-3 h-3 inline text-red-500 fill-red-500 mx-0.5" /> icon on any exercise card below to bookmark your regular training movements for instant access here!
          </p>
        </div>
      )}
    </section>
  );
}
