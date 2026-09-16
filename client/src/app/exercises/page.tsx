"use client";

import ExerciseTracker from "@/components/exercises/ExerciseTracker";
import React from "react";

export default function ExercisesPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white pt-2 sm:pt-4 pb-16 select-none font-sans">
      <ExerciseTracker />
    </div>
  );
}
