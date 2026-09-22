"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Utensils,
  UserRound,
} from "lucide-react";

import TrainerUploadForm from "@/components/dashboard/data-management/TrainerUploadForm";
import MealUploadForm from "@/components/dashboard/data-management/MealUploadForm";
import ExerciseUploadForm from "@/components/dashboard/data-management/ExerciseUploadForm";

/**
 * @task Frontend Dev 3: Data Management Page Layout
 * - Create a 3-tab navigation system (Trainers, Meals, Exercises).
 * - Only render this page for `master_admin` and `branch_admin` (use existing auth hooks).
 * - Add styling matching the Fitora Pure Black & White theme.
 */

type DataTab = "trainers" | "meals" | "exercises";

const tabs = [
  {
    id: "trainers" as const,
    label: "Trainers",
    icon: UserRound,
  },
  {
    id: "meals" as const,
    label: "Meals",
    icon: Utensils,
  },
  {
    id: "exercises" as const,
    label: "Exercises",
    icon: Dumbbell,
  },
];

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<DataTab>("trainers");

  // DEV 3: Role protection will be added in the next commit.

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Admin Portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Data Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-white/50 sm:text-base">
            Manage trainers, meals, and exercises from one central portal.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center">
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