"use client";

import React, { useState, useEffect } from "react";
import { useDashboardRole } from "@/hooks/useDashboardRole";
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
  const { role, isAuthenticated, isLoading } = useDashboardRole();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Role protection — only master_admin and branch_admin can access
    }
  }, [isAuthenticated, isLoading, role]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
          <p className="text-sm text-white/60">Loading data management portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (role !== "master_admin" && role !== "branch_admin")) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5 max-w-md">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-white/60">
            You must be a Master Admin or Branch Admin to access the Data Management Portal.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "trainers", label: "Trainers" },
    { key: "meals", label: "Meals" },
    { key: "exercises", label: "Exercises" },
  ] as const;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Data Management Portal</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-white/[0.03] rounded-2xl border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              activeTab === tab.key
                ? "bg-white text-black border-white shadow-lg"
                : "bg-transparent text-white/50 hover:text-white hover:bg-white/[0.06] border-transparent hover:border-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
