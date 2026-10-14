"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Clock,
  Target,
  ArrowUpRight,
  Dumbbell,
  Play,
  Trash2,
} from "lucide-react";
import type { SavedFavoriteExercise } from "@/services/exerciseService";

interface FavoriteExercisesListProps {
  favorites: SavedFavoriteExercise[];
  isLoading: boolean;
  onRemoveFavorite?: (exerciseId: string) => void;
}

export default function FavoriteExercisesList({
  favorites,
  isLoading,
  onRemoveFavorite,
}: FavoriteExercisesListProps) {
  const defaultFallback =
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-md shrink-0">
            <Heart className="w-3.5 h-3.5 fill-black" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
              Favorite Exercises
              <span className="text-[10px] font-extrabold bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/15">
                {favorites.length}
              </span>
            </h3>
            <p className="text-[11px] text-white/50 mt-0.5">
              Saved regular routines connected to your profile database
            </p>
          </div>
        </div>

        <Link
          href="/exercises"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition"
        >
          <span>Explore All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-10 text-center">
          <p className="text-xs text-white/50 animate-pulse font-bold">
            Loading your favorite exercises...
          </p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 border border-dashed border-white/10 rounded-xl">
          <Dumbbell className="w-8 h-8 text-white/20" />
          <p className="text-xs text-white/50 max-w-xs">
            No favorite exercises saved yet. Mark exercises with ❤️ on the Exercise page to find them here easily!
          </p>
          <Link
            href="/exercises"
            className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition shadow-md"
          >
            <span>Browse Exercises</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {favorites.map((exercise) => {
            const ytThumbnail = exercise.videoId
              ? `https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`
              : null;
            const imgSrc = ytThumbnail || exercise.image || defaultFallback;

            return (
              <div
                key={exercise.exerciseId || exercise._id}
                className="group relative rounded-xl border border-white/10 bg-white/3 p-3 flex gap-3 hover:border-white/25 transition overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                  <Image
                    src={imgSrc}
                    alt={exercise.name}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-black uppercase text-white/50 tracking-wider truncate">
                        {exercise.category}
                      </span>
                      {onRemoveFavorite && (
                        <button
                          type="button"
                          onClick={() => onRemoveFavorite(exercise.exerciseId || exercise._id)}
                          className="text-white/30 hover:text-red-400 transition p-0.5"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <h4 className="text-xs font-black uppercase text-white truncate group-hover:text-white transition">
                      {exercise.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/60 pt-1">
                    <span className="flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-white/40" />
                      {exercise.duration}
                    </span>
                    <Link
                      href="/exercises"
                      className="inline-flex items-center gap-1 text-[9px] font-black text-white hover:underline"
                    >
                      <span>TRAIN</span>
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
