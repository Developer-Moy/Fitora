"use client";

import React, { useState } from "react";
import TrainerUploadForm from "@/components/dashboard/data-management/TrainerUploadForm";
import MealUploadForm from "@/components/dashboard/data-management/MealUploadForm";
import ExerciseUploadForm from "@/components/dashboard/data-management/ExerciseUploadForm";

/**
 * @task Frontend Dev 3: Data Management Page Layout
 * - Create a 3-tab navigation system (Trainers, Meals, Exercises).
 * - Only render this page for `master_admin` and `branch_admin` (use existing auth hooks).
 * - Add styling matching the Fitora Pure Black & White theme.
 */
export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<"trainers" | "meals" | "exercises">("trainers");

  // DEV 3: Add Role protection logic here

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Data Management Portal</h1>
      
      {/* DEV 3: Build the Tab Navigation UI here */}
      <div className="flex space-x-4 mb-8">
        <button onClick={() => setActiveTab("trainers")}>Trainers</button>
        <button onClick={() => setActiveTab("meals")}>Meals</button>
        <button onClick={() => setActiveTab("exercises")}>Exercises</button>
      </div>

      {/* Render Active Form */}
      <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
        {activeTab === "trainers" && <TrainerUploadForm />}
        {activeTab === "meals" && <MealUploadForm />}
        {activeTab === "exercises" && <ExerciseUploadForm />}
      </div>
    </div>
  );
}
