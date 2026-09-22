"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Utensils,
  UserRound,
} from "lucide-react";
import { useDashboardRole } from "@/hooks/useDashboardRole";
import { useRouter } from "next/navigation";

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
    );
  }

  if (!hasAccess) {
    return null;
  }


  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full">
        {/* Tab Navigation */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-md">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                        ? "bg-white text-black shadow-lg"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Admin Portal
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-2xl">
            Data Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-white/50 sm:text-base">
            Manage trainers, meals, and exercises from one central portal.
          </p>
        </div>

        {/* Active Tab Content */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-8">
          {activeTab === "trainers" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                  <UserRound size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Trainers</h2>
                  <p className="text-sm text-white/50">
                    Upload and manage trainer information.
                  </p>
                </div>
              </div>

              <TrainerUploadForm />
            </div>
          )}

          {activeTab === "meals" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                  <Utensils size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Meals</h2>
                  <p className="text-sm text-white/50">
                    Upload and manage meal information.
                  </p>
                </div>
              </div>

              <MealUploadForm />
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                  <Dumbbell size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Exercises</h2>
                  <p className="text-sm text-white/50">
                    Upload and manage exercise information.
                  </p>
                </div>
              </div>

              <ExerciseUploadForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}