"use client";

import React, { useState } from "react";
import TrainerUploadForm from "@/components/dashboard/data-management/TrainerUploadForm";
import MealUploadForm from "@/components/dashboard/data-management/MealUploadForm";
import ExerciseUploadForm from "@/components/dashboard/data-management/ExerciseUploadForm";
import { useDashboardRole } from "@/hooks/useDashboardRole";


type Tab = "trainers" | "meals" | "exercises";

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("trainers");

  const { isMasterAdmin, isBranchAdmin, isLoading } = useDashboardRole();

  const hasAccess = isMasterAdmin || isBranchAdmin;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-white/50">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }


  const tabs: { id: Tab; label: string }[] = [
    {
      id: "trainers",
      label: "Trainers",
    },
    {
      id: "meals",
      label: "Meals",
    },
    {
      id: "exercises",
      label: "Exercises",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Data Management Portal</h1>
      
      {/* DEV 3: Build the Tab Navigation UI here */}
      <div className="flex space-x-4 mb-8">
        {tabs.map((tab) => (
          <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>{tab.label}</button>
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
