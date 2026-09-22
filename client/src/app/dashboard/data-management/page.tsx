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

      {/* Chrome-style Tab Navigation */}
      <div className="relative flex items-end mb-4 h-12">
        {tabs.map((tab) =>
          activeTab === tab.key ? (
            // Active tab — appears "on top" (Chrome style): elevated, connected to content
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative z-10 px-6 py-3 rounded-t-2xl rounded-b-none text-sm font-semibold text-black bg-white border-x-2 border-t-2 border-b-0 border-transparent shadow-xl"
              style={{
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "white",
              }}
            >
              {tab.label}
              {/* Bottom connector triangle — active tab merges into content area */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-transparent" />
            </button>
          ) : (
            // Inactive tab — recessed, lower appearance
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative z-10 px-6 py-3 rounded-t-2xl rounded-b-none text-sm font-semibold text-white/50 hover:text-white/70 hover:bg-white/[0.04] border-2 border-transparent transition-all"
            >
              {tab.label}
            </button>
          ),
        )}

        {/* Tab bar rail — horizontal line that active tab overlaps */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
      </div>

      {/* Render Active Form */}
      <div className="relative pt-1">
        {/* Content area starts right under the active tab — no gap between tabs and content */}
        <div className="border border-white/10 rounded-b-2xl rounded-t-none bg-white/5 backdrop-blur-md">
          <div className="p-6">
            {activeTab === "trainers" && <TrainerUploadForm />}
            {activeTab === "meals" && <MealUploadForm />}
            {activeTab === "exercises" && <ExerciseUploadForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
