"use client";

import React from "react";
import ExerciseTracker from "@/components/ExerciseTracker";

export default function ExercisesPage() {
  return (
    <main className="w-full min-h-screen bg-black text-white pt-20 sm:pt-24 lg:pt-28 pb-16 select-none font-sans border-t border-white/10">
      <ExerciseTracker />
    </main>
  );
}
