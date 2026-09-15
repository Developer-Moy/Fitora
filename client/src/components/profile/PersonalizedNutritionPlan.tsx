"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Utensils,
  ArrowUpRight,
  Lock,
  Crown,
  Copy,
  Check,
  Sun,
  Flame,
  Moon,
  Sparkles,
  Layers,
  RefreshCw,
  Zap,
  Droplets,
  CheckCircle2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  AuthUser,
  AUTH_SESSION_UPDATED,
} from "@/services/authService";
import { isFreePlan } from "@/lib/membershipUtils";
import {
  PersonalizedPlanData,
  MealTargetItem,
  fetchPersonalizedNutritionPlan,
  generatePersonalizedNutritionPlanApi,
  regeneratePersonalizedNutritionPlanApi,
} from "@/services/personalizedNutritionPlanService";
import FitoraSpinner from "@/components/ui/FitoraSpinner";

export interface PersonalizedNutritionPlanProps {
  user?: AuthUser | null;
  planName?: string;
  fitnessGoal?: string;
  onUpgradeClick?: () => void;
  className?: string;
}

export default function PersonalizedNutritionPlan({
  user: propUser,
  planName: propPlanName,
  fitnessGoal: propFitnessGoal,
  onUpgradeClick,
  className = "",
}: PersonalizedNutritionPlanProps) {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(propUser || null);

  // Nutrition Plan State
  const [savedPlan, setSavedPlan] = useState<PersonalizedPlanData | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(true);

  // UI Interactive States
  const [selectedMealKey, setSelectedMealKey] = useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast");
  const [viewMode, setViewMode] = useState<"tabbed" | "all">("tabbed");
  const [copiedTargetType, setCopiedTargetType] = useState<string | null>(null);

  // Simulated AI Generation Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiStepIndex, setAiStepIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Synchronize local session user on auth updates
  useEffect(() => {
    const syncLocalUser = () => {
      const session = getAuthSession();
      if (session.user) {
        setLocalUser(session.user);
      }
    };

    syncLocalUser();
    window.addEventListener(AUTH_SESSION_UPDATED, syncLocalUser);
    return () => {
      window.removeEventListener(AUTH_SESSION_UPDATED, syncLocalUser);
    };
  }, []);

  // Determine active session & claims
  const authSessionUser = authSession?.user as
    | {
        id?: string;
        email?: string;
        role?: string;
        plan?: string;
        fitnessGoal?: string;
      }
    | undefined;

  const sessionToken =
    typeof window !== "undefined"
      ? localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token")
      : null;

  const effectiveUserId =
    propUser?.id ||
    propUser?._id ||
    localUser?.id ||
    localUser?._id ||
    authSessionUser?.id ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_user_email") || ""
      : "");

  const isAuthenticated = Boolean(
    propUser?.id ||
      propUser?._id ||
      propUser?.email ||
      localUser?.id ||
      localUser?._id ||
      localUser?.email ||
      authSessionUser?.id ||
      authSessionUser?.email ||
      sessionToken
  );

  const userRole = (
    propUser?.role ||
    localUser?.role ||
    authSessionUser?.role ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_active_role") ||
        localStorage.getItem("fitora_user_role")
      : "") ||
    ""
  ).toLowerCase();

  const isPrivilegedRole =
    userRole === "master_admin" ||
    userRole === "branch_admin" ||
    userRole === "admin" ||
    userRole === "premium_user";

  const effectivePlanName =
    propPlanName ||
    propUser?.plan ||
    localUser?.plan ||
    authSessionUser?.plan ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_user_plan")
      : "") ||
    "Free Pass";

  const isFree = isFreePlan(effectivePlanName) && !isPrivilegedRole;

  const currentGoalKey =
    propFitnessGoal ||
    propUser?.fitnessGoal ||
    localUser?.fitnessGoal ||
    authSessionUser?.fitnessGoal ||
    "Bulking & Muscle Gain";

  // ── Fetch Existing Saved Plan ──
  const loadSavedPlan = useCallback(async () => {
    if (!isAuthenticated || isFree || !effectiveUserId) {
      setIsLoadingPlan(false);
      return;
    }

    setIsLoadingPlan(true);
    try {
      const plan = await fetchPersonalizedNutritionPlan(
        String(effectiveUserId)
      );
      setSavedPlan(plan);
    } catch (error) {
      console.error("Failed to load nutrition plan", error);
    } finally {
      setIsLoadingPlan(false);
    }
  }, [isAuthenticated, isFree, effectiveUserId]);

  useEffect(() => {
    if (isMounted) {
      loadSavedPlan();
    }
  }, [isMounted, loadSavedPlan]);

  // ── Simulated AI Steps Definition ──
  const aiSteps = [
    {
      title: "Analyzing athlete telemetry & biometrics...",
      detail: `Evaluating BMI category & resting metabolic rate`,
    },
    {
      title: "Calibrating target caloric balance...",
      detail: `Optimizing daily energy baseline for ${currentGoalKey}`,
    },
    {
      title: "Synthesizing macronutrient ratios...",
      detail: "Configuring protein, complex carb, and dietary fat splits",
    },
    {
      title: "Partitioning Breakfast, Lunch & Dinner targets...",
      detail: "Structuring numerical meal targets and timing windows",
    },
    {
      title: "Finalizing targets...",
      detail: "Persisting personalized nutrition targets to profile",
    },
  ];

  // ── Trigger Simulated AI Generation ──
  const handleStartGeneration = async (isRegenerate: boolean = false) => {
    setIsAiModalOpen(true);
    setIsGenerating(true);
    setAiStepIndex(0);

    const apiPromise = isRegenerate
      ? regeneratePersonalizedNutritionPlanApi({
          userId: String(effectiveUserId),
          fitnessGoal: currentGoalKey,
        })
      : generatePersonalizedNutritionPlanApi({
          userId: String(effectiveUserId),
          fitnessGoal: currentGoalKey,
        });

    const runStep = (step: number) => {
      if (step < aiSteps.length) {
        setAiStepIndex(step);
        setTimeout(() => runStep(step + 1), 480);
      }
    };

    runStep(1);

    try {
      const [generatedPlan] = await Promise.all([
        apiPromise,
        new Promise((resolve) => setTimeout(resolve, 2400)),
      ]);

      if (generatedPlan) {
        setSavedPlan(generatedPlan);
        toast.success(
          isRegenerate
            ? "✨ Nutrition targets recalibrated!"
            : "✨ Nutrition targets calibrated successfully!"
        );
      } else {
        toast.error("Failed to generate plan. Please try again.");
      }
    } catch {
      toast.error("Network error during plan calibration.");
    } finally {
      setIsGenerating(false);
      setIsAiModalOpen(false);
    }
  };

  // ── Clipboard Copy Helper ──
  const handleCopyTargets = (
    type: "daily" | "breakfast" | "lunch" | "dinner"
  ) => {
    if (!savedPlan) return;

    let textToCopy = "";

    if (type === "daily") {
      textToCopy =
        `FITORA DAILY TARGETS (${savedPlan.biometricsSnapshot.fitnessGoal})\n` +
        `• Calories: ${savedPlan.dailyTargets.totalCalories} kcal\n` +
        `• Protein: ${savedPlan.dailyTargets.proteinGrams}g\n` +
        `• Carbs: ${savedPlan.dailyTargets.carbsGrams}g\n` +
        `• Fats: ${savedPlan.dailyTargets.fatGrams}g\n` +
        `• Water: ${savedPlan.dailyTargets.hydrationLiters}L`;
    } else {
      const meal = savedPlan.mealTargets[type];
      textToCopy =
        `FITORA ${meal.title.toUpperCase()}\n` +
        `• Calories: ${meal.calorieTarget} kcal\n` +
        `• Protein: ${meal.proteinGrams}g\n` +
        `• Carbs: ${meal.carbsGrams}g\n` +
        `• Fats: ${meal.fatGrams}g\n` +
        `• Timing: ${meal.timingAdvice}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedTargetType(type);
    toast.success("Targets copied to clipboard!");
    setTimeout(() => setCopiedTargetType(null), 2000);
  };

  // ── Hydration Safety Loading Placeholder ──
  if (!isMounted && !propUser) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Personalized Nutrition Plan
          </h2>
        </div>
        <div className="bg-black border border-white/20 rounded-2xl p-6 text-center text-white/40 animate-pulse text-xs">
          Loading nutrition engine...
        </div>
      </div>
    );
  }

  // ── State A: Unauthenticated User ──
  if (!isAuthenticated) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Personalized Nutrition Plan
          </h2>
        </div>

        <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black uppercase text-white">
                  Nutrition Plan Locked
                </h3>
                <p className="text-xs text-white/60 max-w-md">
                  Sign in to unlock personalized daily calorie and macro
                  targets.
                </p>
              </div>
            </div>

            <Link
              href="/login?redirect=/profile"
              className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all shrink-0 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── State B: Authenticated FREE User (Upgrade Paywall Banner) ──
  if (isFree) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Personalized Nutrition Plan
          </h2>
        </div>

        <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  Free Member Tier
                </span>
                <h3 className="text-base sm:text-lg font-black uppercase text-white">
                  Upgrade for Custom Nutrition Targets
                </h3>
                <p className="text-xs text-white/60 max-w-md">
                  Upgrade to Pro Athlete or VIP to unlock automated BMI-driven
                  calorie targets and structured meal macro splits.
                </p>
              </div>
            </div>

            {onUpgradeClick ? (
              <button
                type="button"
                onClick={onUpgradeClick}
                className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all shrink-0 cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all shrink-0 cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── State C-1: Initial Loading State ──
  if (isLoadingPlan) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Personalized Nutrition Plan
          </h2>
        </div>

        <div className="bg-black border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-2.5">
          <FitoraSpinner className="w-6 h-6 text-white animate-spin" />
          <p className="text-xs text-white/40 font-mono uppercase tracking-wider">
            Loading nutrition targets...
          </p>
        </div>
      </div>
    );
  }

  // ── State C-2: No Plan Saved Yet (Generate CTA) ──
  if (!savedPlan) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Personalized Nutrition Plan
          </h2>
        </div>

        <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black uppercase text-white">
                  Calibrate Nutrition Targets
                </h3>
                <p className="text-xs text-white/60 max-w-md leading-relaxed">
                  Generate your custom daily calorie and meal macronutrient
                  targets calculated from your BMI and fitness goal (
                  <span className="text-white font-semibold">
                    {currentGoalKey}
                  </span>
                  ).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartGeneration(false)}
              className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Generate Targets</span>
            </button>
          </div>
        </div>

        {/* AI Generator Modal Overlay */}
        {renderAiModal()}
      </div>
    );
  }

  // ── State C-3: Plan Exists (Clean & Responsive Target Studio) ──
  const activeMeal = savedPlan.mealTargets[selectedMealKey];
  const isGoalDrifted =
    currentGoalKey &&
    savedPlan.biometricsSnapshot.fitnessGoal &&
    currentGoalKey.toLowerCase().trim() !==
      savedPlan.biometricsSnapshot.fitnessGoal.toLowerCase().trim();

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
              Personalized Nutrition Plan
            </h2>
            <p className="text-[11px] sm:text-xs text-white/60">
              <span className="text-white font-semibold">
                {savedPlan.biometricsSnapshot.fitnessGoal}
              </span>{" "}
              • BMI {savedPlan.biometricsSnapshot.bmi.toFixed(1)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleStartGeneration(true)}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3 h-3 text-white" />
          <span>Recalibrate</span>
        </button>
      </div>

      {/* Goal Drift Notice (Concise) */}
      {isGoalDrifted && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-2.5 px-3 flex items-center justify-between gap-2 text-xs text-white/80">
          <span className="truncate">
            Goal changed to <strong>{currentGoalKey}</strong>.
          </span>
          <button
            type="button"
            onClick={() => handleStartGeneration(true)}
            className="underline font-bold text-white shrink-0 cursor-pointer hover:text-neutral-300 text-[11px]"
          >
            Update
          </button>
        </div>
      )}

      {/* Main Target Container */}
      <div className="bg-black border border-white/20 rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        {/* Daily Macro Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-black border border-white/20 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-white/60 block uppercase">
              Calories
            </span>
            <span className="text-sm sm:text-base font-black text-white font-mono">
              {savedPlan.dailyTargets.totalCalories} kcal
            </span>
          </div>
          <div className="bg-black border border-white/20 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-white/60 block uppercase">
              Protein
            </span>
            <span className="text-sm sm:text-base font-black text-white font-mono">
              {savedPlan.dailyTargets.proteinGrams}g
            </span>
          </div>
          <div className="bg-black border border-white/20 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-white/60 block uppercase">
              Carbs
            </span>
            <span className="text-sm sm:text-base font-black text-white font-mono">
              {savedPlan.dailyTargets.carbsGrams}g
            </span>
          </div>
          <div className="bg-black border border-white/20 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-white/60 block uppercase">
              Fats
            </span>
            <span className="text-sm sm:text-base font-black text-white font-mono">
              {savedPlan.dailyTargets.fatGrams}g
            </span>
          </div>
        </div>

        {/* Sleek Caloric Distribution Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
            <span>Macro Distribution</span>
            <span>
              P {savedPlan.macroDistribution.proteinPct}% • C{" "}
              {savedPlan.macroDistribution.carbsPct}% • F{" "}
              {savedPlan.macroDistribution.fatPct}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${savedPlan.macroDistribution.proteinPct}%` }}
              className="bg-white h-full"
            />
            <div
              style={{ width: `${savedPlan.macroDistribution.carbsPct}%` }}
              className="bg-neutral-400 h-full"
            />
            <div
              style={{ width: `${savedPlan.macroDistribution.fatPct}%` }}
              className="bg-neutral-700 h-full"
            />
          </div>
        </div>

        {/* Meal Tabs & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-white/10">
          {/* Meal Tabs */}
          <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
            {(["breakfast", "lunch", "dinner"] as const).map((key) => {
              const isSelected =
                selectedMealKey === key && viewMode === "tabbed";
              const meal = savedPlan.mealTargets[key];
              const mealIcon =
                key === "breakfast" ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : key === "lunch" ? (
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                );

              const label =
                key === "breakfast"
                  ? "Breakfast"
                  : key === "lunch"
                  ? "Lunch"
                  : "Dinner";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedMealKey(key);
                    setViewMode("tabbed");
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-black shadow-md"
                      : "bg-white/5 text-white/70 hover:text-white border border-white/10"
                  }`}
                >
                  {mealIcon}
                  <span>{label}</span>
                  <span className="text-[10px] opacity-70 font-mono">
                    {meal.calorieTarget}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleCopyTargets("daily")}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              {copiedTargetType === "daily" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Daily</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode((prev) => (prev === "tabbed" ? "all" : "tabbed"))
              }
              className="flex items-center gap-1 text-[11px] font-bold text-white/60 hover:text-white transition-colors px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer shrink-0"
            >
              <Layers className="w-3 h-3 text-white/80" />
              <span>{viewMode === "tabbed" ? "All Meals" : "Tabbed"}</span>
            </button>
          </div>
        </div>

        {/* ── View 1: Focused Tabbed Card ── */}
        {viewMode === "tabbed" && (
          <div>{renderMealCard(activeMeal, selectedMealKey)}</div>
        )}

        {/* ── View 2: All Meals Stacked ── */}
        {viewMode === "all" && (
          <div className="space-y-3 pt-1">
            {(["breakfast", "lunch", "dinner"] as const).map((key) =>
              renderMealCard(savedPlan.mealTargets[key], key)
            )}
          </div>
        )}

        {/* Compact Daily Hydration Strip */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Target Hydration:{" "}
              <strong className="text-white">
                {savedPlan.dailyTargets.hydrationLiters} L / day
              </strong>
            </span>
          </span>
          <span className="text-[11px] text-white/40">
            {savedPlan.strategyNotes.summary}
          </span>
        </div>
      </div>

      {/* AI Generator Modal Overlay */}
      {renderAiModal()}
    </div>
  );

  // ── Render Individual Meal Target Card (Clean & Responsive) ──
  function renderMealCard(
    meal: MealTargetItem,
    key: "breakfast" | "lunch" | "dinner"
  ) {
    const mealIcon =
      key === "breakfast" ? (
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      ) : key === "lunch" ? (
        <Flame className="w-3.5 h-3.5 text-orange-400" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-indigo-300" />
      );

    return (
      <div
        key={key}
        className="bg-black border border-white/20 rounded-xl p-4 space-y-3 shadow-lg"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-wider">
              {mealIcon}
              {key}
            </span>
            <span className="text-xs font-black bg-white text-black px-2 py-0.5 rounded-full font-mono">
              {meal.calorieTarget} kcal
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopyTargets(key)}
            className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-[11px] px-3 py-1 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shrink-0"
          >
            {copiedTargetType === key ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Target</span>
              </>
            )}
          </button>
        </div>

        {/* Macros 3-Col Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-white/50 block uppercase">
              Protein
            </span>
            <span className="text-sm font-black text-white font-mono">
              {meal.proteinGrams}g
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-white/50 block uppercase">
              Carbs
            </span>
            <span className="text-sm font-black text-white font-mono">
              {meal.carbsGrams}g
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-white/50 block uppercase">
              Fats
            </span>
            <span className="text-sm font-black text-white font-mono">
              {meal.fatGrams}g
            </span>
          </div>
        </div>

        {/* Timing & Strategy (Concise) */}
        <div className="space-y-1 text-xs text-white/70">
          <p className="flex items-center gap-1.5 text-white/80 font-medium text-[11px]">
            <Clock className="w-3 h-3 text-white/40 shrink-0" />
            <span>{meal.timingAdvice}</span>
          </p>
          <p className="text-[11px] text-white/50">{meal.macroFocus}</p>
        </div>
      </div>
    );
  }

  // ── Render Simulated AI Progress Modal ──
  function renderAiModal() {
    if (!isAiModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-neutral-950 border border-white/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white">
                Metabolic Engine Calibrating
              </h3>
              <p className="text-xs text-white/50">
                Synthesizing targets for {currentGoalKey}
              </p>
            </div>
          </div>

          {/* Progressive Telemetry Steps */}
          <div className="space-y-2">
            {aiSteps.map((step, idx) => {
              const isCompleted = idx < aiStepIndex;
              const isCurrent = idx === aiStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-all ${
                    isCompleted
                      ? "bg-white/5 border-white/15 text-white"
                      : isCurrent
                      ? "bg-white/10 border-white text-white"
                      : "bg-transparent border-transparent text-white/30"
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <FitoraSpinner className="w-3.5 h-3.5 text-white animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" />
                    )}
                  </div>

                  <span
                    className={`truncate ${
                      isCurrent
                        ? "font-bold text-white"
                        : isCompleted
                        ? "text-white/80"
                        : "text-white/30"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-400 rounded-full"
                style={{
                  width: `${((aiStepIndex + 1) / aiSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
