"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchPublicBranches,
  fetchMemberStats,
  updateUserProfileApi,
  updateUserHydrationTargetApi,
  type BranchInfo as APIBranchInfo,
  type MemberStatsResponse,
} from "@/services/dashboardService";
import { getWorkoutLogs } from "@/services/workoutService";
import type { WorkoutLog } from "@/types/workout";
import { sendAiChatApi } from "@/services/aiService";
import {
  Crown,
  Lock,
  Dumbbell,
  Utensils,
  QrCode,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  Clock,
  HeartPulse,
  CreditCard,
  Building2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Plus,
  Target,
  MessageSquare,
  Activity,
  Edit3,
  User,
  X,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAuthSession,
  getCurrentUserApi,
  updateSessionAfterPayment,
} from "@/services/authService";
import MembershipExpiryBanner from "@/components/MembershipExpiryBanner";

interface MemberDashboardViewProps {
  isPremium: boolean;
  userName: string;
  userEmail: string;
  userPlan: string;
  assignedBranch: string;
  userId: string;
  onUpgradeToPremium?: () => void;
}

export default function MemberDashboardView({
  isPremium,
  userName,
  userEmail,
  userPlan,
  assignedBranch,
  userId,
  onUpgradeToPremium,
}: MemberDashboardViewProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<
    "bKash" | "Nagad" | "Card"
  >("bKash");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Athlete Profile Edit State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(userName);
  const [profileEmail, setProfileEmail] = useState(userEmail);
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBranch, setProfileBranch] = useState(
    assignedBranch || "Gulshan Premium Branch",
  );
  const [profileGoal, setProfileGoal] = useState(
    "Muscle Hypertrophy & Strength",
  );
  const [profileWeight, setProfileWeight] = useState("");
  const [profileTargetWeight, setProfileTargetWeight] = useState("");
  const [profileQrCode, setProfileQrCode] = useState("FIT-VIP-PASS-ACTIVE");
  const [workoutLogsList, setWorkoutLogsList] = useState<WorkoutLog[]>([]);
  const [workoutLogsLoading, setWorkoutLogsLoading] = useState(false);
  const [userActiveGoals, setUserActiveGoals] = useState<any[]>([]);
  const [profileToast, setProfileToast] = useState<string | null>(null);
  const [branches, setBranches] = useState<APIBranchInfo[]>([]);
  const [memberStats, setMemberStats] = useState<MemberStatsResponse | null>(
    null,
  );
  const [statsLoading, setStatsLoading] = useState(true);

  const [healthMetrics, setHealthMetrics] = useState<{
    bmr: number | null;
    tdee: number | null;
  }>({
    bmr: null,
    tdee: null,
  });

  useEffect(() => {
    setProfileName(userName);
    setProfileEmail(userEmail);
    setProfileBranch(assignedBranch);
  }, [userName, userEmail, assignedBranch]);

  const [expiryBannerInfo, setExpiryBannerInfo] = useState<{
    status: "expiring_soon" | "expired" | "no_membership";
    daysRemaining: number;
    expiryDate?: string;
  } | null>(null);

  useEffect(() => {
    fetchPublicBranches().then((res) => {
      if (res && res.length > 0) setBranches(res as any);
    });

    setStatsLoading(true);
    fetchMemberStats().then((res) => {
      if (res) setMemberStats(res);
      setStatsLoading(false);
    });
  }, []);

  useEffect(() => {
    const session = getAuthSession();
    const expiry =
      session?.user?.subscriptionExpiryDate ||
      session?.user?.membershipExpiresAt;
    const isFree = !userPlan || userPlan.toLowerCase().includes("free");
    if (!isFree && expiry) {
      const expDate = new Date(expiry);
      const diffMs = expDate.getTime() - Date.now();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffMs <= 0) {
        setExpiryBannerInfo({
          status: "expired",
          daysRemaining: 0,
          expiryDate: expDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      } else if (days <= 3) {
        setExpiryBannerInfo({
          status: "expiring_soon",
          daysRemaining: Math.max(0, days),
          expiryDate: expDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
    }
  }, [userPlan]);

  // Interactive Modals for Features
  const [activeFeatureModal, setActiveFeatureModal] = useState<string | null>(
    null,
  );
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [aiChatQuery, setAiChatQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [goalId, setGoalId] = useState<string | null>(null);
  const [goalTargetWeight, setGoalTargetWeight] = useState("");
  const [weeklyWorkoutFrequency, setWeeklyWorkoutFrequency] = useState("3");

  const [goalUpdating, setGoalUpdating] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);
  const [goalSuccess, setGoalSuccess] = useState<string | null>(null);

  const [showFitnessGoalModal, setShowFitnessGoalModal] = useState(false);

  useEffect(() => {
    if (currentTab === "workout-log") setActiveFeatureModal("workout");
    else if (currentTab === "nutrition-log") setActiveFeatureModal("nutrition");
    else if (currentTab === "goals-log") setActiveFeatureModal("goals");
    else if (currentTab === "ai-coach") setActiveFeatureModal("ai");
    else if (currentTab === "upgrade") setShowPaymentModal(true);
    else if (currentTab === "profile" || currentTab === "settings")
      setIsProfileModalOpen(true);
    else setActiveFeatureModal(null);
  }, [currentTab]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await updateUserProfileApi({
        name: profileName,
        phone: profilePhone,
        assignedBranch: profileBranch,
        fitnessGoal: profileGoal,
        weight: profileWeight ? Number(profileWeight) : undefined,
        targetWeight: profileTargetWeight
          ? Number(profileTargetWeight)
          : undefined,
      });
      if (ok) {
        const session = getAuthSession();
        if (session?.user) {
          session.user.name = profileName;
          session.user.phone = profilePhone;
          session.user.assignedBranch = profileBranch;
          session.user.fitnessGoal = profileGoal;
          session.user.weight = profileWeight;
          session.user.targetWeight = profileTargetWeight;
          localStorage.setItem("fitora_auth_session", JSON.stringify(session));
        }
        setProfileToast("Athlete profile updated in database successfully!");
        toast.success("Athlete profile & preferences updated successfully!");
        setIsProfileModalOpen(false);
        setTimeout(() => setProfileToast(null), 3500);
      } else {
        toast.error("Could not update profile in database.");
      }
    } catch {
      toast.error("Network error while updating profile.");
    }
  };

  const handleSaveHydration = async () => {
    try {
      const liters = Math.round(((waterGlasses * 250) / 1000) * 100) / 100;
      await updateUserHydrationTargetApi(liters);
      toast.success(`Hydration target saved (${liters}L)`);
    } catch {
      toast.success("Hydration target updated!");
    }
    setActiveFeatureModal(null);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    await updateSessionAfterPayment("VIP Ultimate");
    toast.success("VIP Ultimate membership activated successfully!");
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(false);
      if (onUpgradeToPremium) onUpgradeToPremium();
    }, 2000);
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse(null);
    const result = await sendAiChatApi(
      `[Athlete at ${assignedBranch}] ${aiChatQuery}`,
      "coach",
    );
    setAiLoading(false);
    if (result.success && result.data?.responseText) {
      setAiResponse(result.data.responseText);
    } else {
      setAiResponse("AI coach is temporarily unavailable. Try again shortly.");
    }
  };

  const currentWeight = Number(profileWeight);
  const targetWeight = Number(goalTargetWeight);

  let weightProgress = 0;

  if (currentWeight > 0 && targetWeight > 0) {
    const difference = Math.abs(currentWeight - targetWeight);

    weightProgress = Math.max(
      0,
      Math.min(
        100,
        100 - (difference / Math.max(currentWeight, targetWeight)) * 100,
      ),
    );
  }

  const weightDifference = Math.abs(currentWeight - targetWeight);

  const isGoalReached =
    currentWeight > 0 && targetWeight > 0 && currentWeight === targetWeight;

  const isWeightLoss = currentWeight > targetWeight;
  const isWeightGain = currentWeight < targetWeight;

  // Update Goal Function
  const handleUpdateGoal = async () => {
    try {
      setGoalUpdating(true);
      setGoalError(null);
      setGoalSuccess(null);

      const targetWeight = Number(goalTargetWeight);
      const workoutFrequency = Number(weeklyWorkoutFrequency);

      if (!targetWeight || targetWeight <= 0) {
        setGoalError("Please enter a valid target weight.");
        return;
      }

      if (!workoutFrequency || workoutFrequency < 1 || workoutFrequency > 7) {
        setGoalError("Workout frequency must be between 1 and 7 days.");
        return;
      }

      let response;
      const rawApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const apiBase = rawApiUrl.endsWith("/api")
        ? rawApiUrl
        : `${rawApiUrl}/api`;

      if (goalId) {
        // Existing goal → update
        response = await fetch(`${apiBase}/goals/${goalId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetWeight,
            weeklyWorkoutFrequency: workoutFrequency,
          }),
        });
      } else {
        // No goal → create
        response = await fetch(`${apiBase}/goals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            targetWeight,
            weeklyWorkoutFrequency: workoutFrequency,
          }),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update fitness goal");
      }

      const updatedGoal = result.data;

      setGoalId(updatedGoal._id);
      setGoalTargetWeight(String(updatedGoal.targetWeight));
      setWeeklyWorkoutFrequency(String(updatedGoal.weeklyWorkoutFrequency));
      setProfileTargetWeight(String(updatedGoal.targetWeight));

      setGoalSuccess("Fitness goal updated successfully!");

      toast.success("Fitness goal updated successfully!");

      setTimeout(() => {
        setShowFitnessGoalModal(false);
        setGoalSuccess(null);
      }, 1200);
    } catch (error) {
      console.error("Failed to update fitness goal:", error);

      setGoalError(
        error instanceof Error
          ? error.message
          : "Failed to update fitness goal",
      );
    } finally {
      setGoalUpdating(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadUserData = async () => {
      try {
        const { token, user } = getAuthSession();

        if (!token && !user?.id && !user?._id && !user?.email) {
          return;
        }

        const result = await getCurrentUserApi({
          userId: user?.id || user?._id,
          email: user?.email,
        });

        if (cancelled || !result.success || !result.user) {
          return;
        }

        const u = result.user;
        if (u.name) setProfileName(u.name);
        if (u.email) setProfileEmail(u.email);
        if (u.phone) setProfilePhone(u.phone);
        if (u.assignedBranch) setProfileBranch(u.assignedBranch);
        if (u.fitnessGoal) setProfileGoal(u.fitnessGoal);
        if (u.weight) setProfileWeight(String(u.weight));
        if (u.targetWeight) setProfileTargetWeight(String(u.targetWeight));
        if (u.qrCodeId) setProfileQrCode(u.qrCodeId);

        if (
          typeof (u as any).hydrationTargetLiters === "number" &&
          (u as any).hydrationTargetLiters > 0
        ) {
          setWaterGlasses(
            Math.round(((u as any).hydrationTargetLiters * 1000) / 250),
          );
        }

        setHealthMetrics({
          bmr:
            typeof result.user.bmr === "number" && result.user.bmr > 0
              ? result.user.bmr
              : null,
          tdee:
            typeof result.user.tdee === "number" && result.user.tdee > 0
              ? result.user.tdee
              : null,
        });
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Dynamic Goal Fetch from MongoDB ──
  useEffect(() => {
    let cancelled = false;
    const loadGoal = async () => {
      try {
        const rawApiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const apiBase = rawApiUrl.endsWith("/api")
          ? rawApiUrl
          : `${rawApiUrl}/api`;
        const targetUserId = userId || userEmail;
        if (!targetUserId) return;

        const res = await fetch(
          `${apiBase}/goals/${encodeURIComponent(targetUserId)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data.success || !data.data) return;

        const g = data.data;
        if (g._id) setGoalId(g._id);
        if (g.targetWeight) {
          setGoalTargetWeight(String(g.targetWeight));
          setProfileTargetWeight(String(g.targetWeight));
        }
        if (g.weeklyWorkoutFrequency) {
          setWeeklyWorkoutFrequency(String(g.weeklyWorkoutFrequency));
        }
        if (g.goalType) {
          setProfileGoal(g.goalType);
        }
        setUserActiveGoals([g]);
      } catch (err) {
        console.error("Goal fetch error:", err);
      }
    };

    loadGoal();
    return () => {
      cancelled = true;
    };
  }, [userId, userEmail]);

  // ── Dynamic Workout Logs Fetch from MongoDB when modal opens ──
  useEffect(() => {
    if (activeFeatureModal === "workout") {
      setWorkoutLogsLoading(true);
      const targetUserId = userId || userEmail;
      getWorkoutLogs(targetUserId, 20)
        .then((res) => {
          setWorkoutLogsList(res.logs || []);
        })
        .catch(() => setWorkoutLogsList([]))
        .finally(() => setWorkoutLogsLoading(false));
    }
  }, [activeFeatureModal, userId, userEmail]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ── MEMBERSHIP EXPIRY NOTIFICATION BANNER ── */}
      {expiryBannerInfo && (
        <MembershipExpiryBanner
          status={expiryBannerInfo.status}
          planName={userPlan}
          daysRemaining={expiryBannerInfo.daysRemaining}
          expiryDate={expiryBannerInfo.expiryDate}
          onAction={() => setShowPaymentModal(true)}
        />
      )}

      {/* ── TOP HERO BANNER (HOMEPAGE LUXURY DARK) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              {isPremium ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-black">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  {userPlan || "VIP Pro Athlete Pass Active"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-white/20 text-white/70">
                  <Zap className="w-3.5 h-3.5" />
                  Free Tier Member Pass
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              Hello, {profileName}!
            </h1>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Assigned Home Branch:{" "}
              <span className="font-bold text-white underline">
                {profileBranch}
              </span>
              .{" "}
              {isPremium
                ? "Full nationwide access to 64 branches enabled."
                : "Upgrade to Pro for full Coaching Studio & all-branch entry."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-neutral-900 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 hover:border-white transition shadow-lg cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Athlete Profile</span>
            </button>

            {!isPremium && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition shadow-2xl cursor-pointer"
              >
                <span>Upgrade to Pro Athlete</span>
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {profileToast && (
        <div className="p-4 rounded-2xl bg-white text-black font-bold text-xs flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{profileToast}</span>
          </div>
          <button
            onClick={() => setProfileToast(null)}
            className="text-xs font-black uppercase text-black hover:opacity-60"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── DIGITAL GYM PASS & STATS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Digital Gym Entry QR Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-5 flex flex-col justify-between text-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white/50">
              <QrCode className="w-4 h-4 text-white" />
              Digital Gym Entry Pass
            </div>

            <div className="my-5 p-5 mx-auto max-w-[200px] rounded-2xl bg-white border-2 border-white shadow-2xl">
              {isPremium ? (
                <div className="space-y-2">
                  <div className="w-36 h-36 mx-auto bg-black p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                  <div className="text-[10px] font-black text-black tracking-widest uppercase">
                    {profileQrCode || "FIT-VIP-PASS-ACTIVE"}
                  </div>
                </div>
              ) : (
                <div className="w-36 h-36 mx-auto flex flex-col items-center justify-center space-y-2 text-neutral-400">
                  <Lock className="w-10 h-10 text-neutral-600" />
                  <span className="text-[11px] font-black text-black uppercase tracking-wider">
                    Locked for Free
                  </span>
                </div>
              )}
            </div>

            <h4 className="font-black text-sm uppercase tracking-tight text-white">
              {isPremium
                ? "Scan at Turnstile for Entry"
                : "Pro Membership Required"}
            </h4>
            <p className="text-xs text-white/50 mt-1">
              {isPremium
                ? "Valid across all 64 FITORA branches in Bangladesh"
                : "Upgrade to unlock seamless instant turnstile scanning nationwide"}
            </p>
          </div>

          {!isPremium && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3 rounded-full bg-white text-black font-black uppercase text-xs hover:bg-gray-100 transition cursor-pointer shadow-lg"
            >
              Unlock Entry Pass (৳4,900/mo)
            </button>
          )}
        </div>

        {/* Member Workout Stats Grid (Monochrome with Green numbers only) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
              <span>Monthly Workouts</span>
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                {statsLoading
                  ? "..."
                  : ((memberStats as any)?.workoutCount ??
                    memberStats?.workoutsThisMonth ??
                    0)}
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase">
                Active Streak
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Target: {memberStats?.targetWorkouts ?? 20} sessions / month
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
              <span>Calories Burned</span>
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                {statsLoading
                  ? "..."
                  : (
                      (memberStats as any)?.burnedCalories ??
                      memberStats?.caloriesBurned ??
                      0
                    ).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-white/50 uppercase">
                kcal
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Weekly avg:{" "}
              {Math.round(
                ((memberStats as any)?.burnedCalories ??
                  memberStats?.caloriesBurned ??
                  0) / 4,
              ).toLocaleString()}{" "}
              kcal
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
              <span>Check-in Streak</span>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400 tracking-tight">
                {statsLoading ? "..." : (memberStats?.streakDays ?? 0)}
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase">
                Days Streak
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Consistency score: {memberStats?.consistencyScore ?? 0}%
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
              <span>Personal Training Plan</span>
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                {isPremium ? "Active" : "Standard"}
              </span>
              <span className="text-xs font-bold text-white/50 uppercase">
                Hypertrophy Split
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Next routine: Chest & Triceps PR
            </p>
          </div>
        </div>
      </div>

      {/* ── BMR & TDEE HEALTH METRICS ── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-black uppercase tracking-tight text-white">
            Health & Energy Metrics
          </h3>

          <p className="mt-0.5 text-xs text-white/50">
            Your latest calculated metabolic health metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* BMR */}
          <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  Basal Metabolic Rate
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Resting energy estimate
                </p>
              </div>

              <Flame className="h-5 w-5 text-white" />
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-white">
                {healthMetrics.bmr ?? "--"}
              </span>

              <span className="pb-1 text-xs font-bold uppercase text-white/40">
                kcal/day
              </span>
            </div>
          </div>

          {/* TDEE */}
          <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  Total Daily Energy Expenditure
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Daily energy estimate
                </p>
              </div>

              <Activity className="h-5 w-5 text-white" />
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-white">
                {healthMetrics.tdee ?? "--"}
              </span>

              <span className="pb-1 text-xs font-bold uppercase text-white/40">
                kcal/day
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* My Fitness Goals */}
      <div className="mt-8 bg-neutral-950">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">My Fitness Goals</h2>
            <p className="text-sm text-white/50">
              Track your current weight and target weight
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setGoalError(null);
              setGoalSuccess(null);
              setShowFitnessGoalModal(true);
            }}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
          >
            Update Goal
          </button>
        </div>

        {/* Goal Card */}
        <div className="rounded-2xl border border-gray-200 bg-neutral-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Current Weight</p>
              <p className="text-3xl font-bold">{profileWeight} kg</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-white/50">Target Weight</p>
              <p className="text-3xl font-bold">
                {goalTargetWeight || "--"} kg
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(weightProgress)}%</span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-black">
              <div
                className="h-full rounded-full bg-gray-200 transition-all duration-500"
                style={{ width: `${weightProgress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-white/50">
            {isGoalReached
              ? "Goal reached!"
              : isWeightLoss
                ? `${weightDifference.toFixed(1)} kg left to lose`
                : isWeightGain
                  ? `${weightDifference.toFixed(1)} kg left to gain`
                  : ""}
          </div>

          <div className="mt-3 text-sm text-white/50">
            Weekly workout frequency:{" "}
            <span className="font-semibold text-white/50">
              {weeklyWorkoutFrequency} days / week
            </span>
          </div>
        </div>
      </div>

      {showFitnessGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-neutral-950 p-6">
            <h2 className="text-xl font-bold">Update Fitness Goal</h2>

            <div className="mt-6 space-y-4">
              {/* Target Weight */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Target Weight (kg)
                </label>

                <input
                  type="number"
                  value={goalTargetWeight}
                  onChange={(e) => setGoalTargetWeight(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              {/* Workout Frequency */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Weekly Workout Frequency
                </label>

                <select
                  value={weeklyWorkoutFrequency}
                  onChange={(e) => setWeeklyWorkoutFrequency(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3"
                  required
                >
                  <option value="1">1 day / week</option>
                  <option value="2">2 days / week</option>
                  <option value="3">3 days / week</option>
                  <option value="4">4 days / week</option>
                  <option value="5">5 days / week</option>
                  <option value="6">6 days / week</option>
                  <option value="7">7 days / week</option>
                </select>
              </div>

              {goalError && <p className="text-sm text-red-500">{goalError}</p>}

              {goalSuccess && (
                <p className="text-sm text-green-600">{goalSuccess}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFitnessGoalModal(false)}
                className="rounded-full border px-5 py-2.5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateGoal}
                disabled={goalUpdating}
                className="rounded-full bg-white px-5 py-2.5 text-black"
              >
                {goalUpdating ? "Updating..." : "Save Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURE MODULES & QUICK ACTIONS ── */}
      <div className="space-y-4">
        <h3 className="text-base font-black uppercase tracking-tight text-white">
          Training & Lifestyle Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: Workout Session */}
          <div
            onClick={() => setActiveFeatureModal("workout")}
            className="p-6 rounded-3xl bg-neutral-950 border border-white/10 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight text-white group-hover:underline transition">
                Workout Session Log
              </h4>
              <p className="text-xs text-white/50">
                4 sets Bench Press, 3 sets Incline DB recorded today
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
              <span>View Log</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: Nutrition & Hydration */}
          <div
            onClick={() => setActiveFeatureModal("nutrition")}
            className="p-6 rounded-3xl bg-neutral-950 border border-white/10 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight text-white group-hover:underline transition">
                Nutrition & Hydration
              </h4>
              <p className="text-xs text-white/50">
                {waterGlasses} / 8 Glasses Hydration target completed
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
              <span>Log Water</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Personal Coaching Studio */}
          <div
            onClick={() => setActiveFeatureModal("ai")}
            className="p-6 rounded-3xl bg-neutral-950 border border-white/10 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight text-white group-hover:underline transition">
                Coaching & Form Studio
              </h4>
              <p className="text-xs text-white/50">
                Personal training cues & structured hypertrophy plans
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
              <span>Open Studio</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 4: Goals & PRs */}
          <div
            onClick={() => setActiveFeatureModal("goals")}
            className="p-6 rounded-3xl bg-neutral-950 border border-white/10 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight text-white group-hover:underline transition">
                PR Goals & Milestones
              </h4>
              <p className="text-xs text-white/50">
                Bench Press 105kg PR &bull; Target: 110kg
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
              <span>View PRs</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: WORKOUT LOG ── */}
      {activeFeatureModal === "workout" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Today's Workout Log
              </h3>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs uppercase font-bold tracking-wider max-h-60 overflow-y-auto pr-1">
              {workoutLogsLoading ? (
                <div className="py-6 text-center text-white/40 font-bold uppercase animate-pulse">
                  Loading workouts from MongoDB...
                </div>
              ) : workoutLogsList.length > 0 ? (
                workoutLogsList.map((log, idx) => (
                  <div
                    key={log._id || idx}
                    className="p-4 rounded-2xl bg-neutral-900 border border-white/5 flex justify-between items-center"
                  >
                    <div>
                      <span className="text-white font-black block">
                        {log.exerciseName}
                      </span>
                      <span className="text-[10px] text-white/40 font-medium">
                        {log.caloriesBurned
                          ? `${log.caloriesBurned} kcal burned`
                          : "Logged session"}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-black">
                      {log.setsCount} sets x{" "}
                      {log.weight ? `${log.weight}kg` : `${log.repsCount} reps`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-white/40 font-bold uppercase">
                  No workouts logged yet. Start recording your sets in the
                  Exercise Tracker!
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveFeatureModal(null)}
              className="w-full py-3 rounded-full bg-white text-black font-black uppercase text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: NUTRITION & HYDRATION ── */}
      {activeFeatureModal === "nutrition" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Daily Hydration Target
              </h3>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="py-4">
              <span className="text-5xl font-black text-white">
                {waterGlasses}
              </span>
              <span className="text-xs font-bold text-white/50 block mt-1 uppercase">
                / 8 Glasses ({((waterGlasses * 250) / 1000).toFixed(1)}L Target)
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                className="w-12 h-12 rounded-full bg-neutral-900 text-xl font-black border border-white/15 hover:bg-white hover:text-black transition cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => setWaterGlasses((prev) => prev + 1)}
                className="px-6 py-3 rounded-full bg-white text-black font-black uppercase text-xs hover:bg-gray-100 transition shadow-lg cursor-pointer"
              >
                + Add Glass (250ml)
              </button>
            </div>
            <button
              onClick={handleSaveHydration}
              className="w-full py-3 rounded-full bg-neutral-900 border border-white/15 text-white font-black uppercase text-xs hover:bg-neutral-800 cursor-pointer"
            >
              Save Hydration Target
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: AI COACH ── */}
      {activeFeatureModal === "ai" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-white" />
                Personal Fitness & Form Coach
              </h3>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAiAsk} className="space-y-3">
              <textarea
                rows={3}
                value={aiChatQuery}
                onChange={(e) => setAiChatQuery(e.target.value)}
                placeholder="Ask training advice (e.g. How to break through my bench press plateau?)..."
                className="w-full p-4 rounded-2xl bg-neutral-900 border border-white/15 text-xs outline-none focus:border-white text-white resize-none"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-3 rounded-full bg-white text-black font-black uppercase text-xs hover:bg-gray-100 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {aiLoading ? "AI Thinking..." : "Get Training Guidance"}
              </button>
            </form>
            {aiLoading && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 text-xs text-white/50 animate-pulse">
                AI Coach is analyzing your query...
              </div>
            )}
            {aiResponse && !aiLoading && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/20 text-xs text-white leading-relaxed">
                <p className="font-black text-white mb-1 uppercase tracking-wider">
                  Coach Feedback:
                </p>
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: GOALS & PRS ── */}
      {activeFeatureModal === "goals" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Fitness Goals & Milestones
              </h3>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs uppercase font-bold">
              {userActiveGoals.length > 0 ? (
                userActiveGoals.map((g, idx) => {
                  const curr = Number(profileWeight) || 0;
                  const tgt = Number(g.targetWeight) || 0;
                  const prog =
                    curr > 0 && tgt > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (Math.min(curr, tgt) / Math.max(curr, tgt)) * 100,
                          ),
                        )
                      : Math.round(weightProgress);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-neutral-900 border border-white/5 space-y-1.5"
                    >
                      <div className="flex justify-between font-black">
                        <span>{g.goalType || "Target Weight"}</span>
                        <span className="text-emerald-400">
                          {curr > 0 ? `${curr}kg` : "Current"} /{" "}
                          {tgt > 0 ? `${tgt}kg Target` : "Set Goal"}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{ width: `${prog}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 space-y-1.5">
                  <div className="flex justify-between font-black">
                    <span>Target Weight Progress</span>
                    <span className="text-emerald-400">
                      {profileWeight ? `${profileWeight}kg` : "0kg"} /{" "}
                      {goalTargetWeight
                        ? `${goalTargetWeight}kg Target`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${weightProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveFeatureModal(null)}
              className="w-full py-3 rounded-full bg-white text-black font-black uppercase text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── PAYMENT & UPGRADE MODAL (HOMEPAGE LUXURY DARK) ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Upgrade to FITORA Pro Athlete
                </h3>
                <p className="text-xs text-white/50">
                  Full access to all 64 branches, AI coach studio, and custom
                  meal charts.
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-black text-lg text-white uppercase tracking-tight">
                  Payment Verified! Welcome to Pro!
                </h4>
                <p className="text-xs text-white/50">
                  Your account has been upgraded to Pro Athlete with all-branch
                  entry pass.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handlePayment}
                className="space-y-5 text-xs font-bold uppercase tracking-wider"
              >
                {/* Plan Summary */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-black text-sm text-white uppercase">
                      Pro Athlete Annual Pass
                    </span>
                    <p className="text-xs text-white/50">
                      Full AI Studio + 64 Gyms Nationwide Access
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">
                      ৳4,900
                    </span>
                    <span className="block text-[10px] text-white/40">
                      /month
                    </span>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div className="space-y-2">
                  <label className="block text-white/50">
                    Select Instant Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGateway("bKash")}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        selectedGateway === "bKash"
                          ? "border-white bg-white text-black font-black shadow-lg"
                          : "border-white/15 bg-neutral-900 text-white/60"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="font-black">bKash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedGateway("Nagad")}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        selectedGateway === "Nagad"
                          ? "border-white bg-white text-black font-black shadow-lg"
                          : "border-white/15 bg-neutral-900 text-white/60"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="font-black">Nagad</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedGateway("Card")}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        selectedGateway === "Card"
                          ? "border-white bg-white text-black font-black shadow-lg"
                          : "border-white/15 bg-neutral-900 text-white/60"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="font-black">Card</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-white text-black font-black hover:bg-gray-100 transition shadow-lg cursor-pointer uppercase"
                  >
                    Pay ৳4,900 via {selectedGateway}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── ATHLETE PROFILE & ACCOUNT SETTINGS MODAL ── */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-white" />
                  Athlete Profile & Settings
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Update personal details, home gym location, and fitness
                  targets.
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="space-y-4 text-xs font-bold uppercase tracking-wider"
            >
              {/* Full Name */}
              <div>
                <label className="block text-white/50 mb-1.5">
                  Athlete Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white lowercase font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white font-medium"
                    required
                  />
                </div>
              </div>

              {/* Home Gym Branch (From 64 branches) */}
              <div>
                <label className="block text-white/50 mb-1.5">
                  Assigned Home Gym Branch
                </label>
                <select
                  value={profileBranch}
                  onChange={(e) => setProfileBranch(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white cursor-pointer uppercase"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-white/50 mb-1.5">
                  Primary Fitness Objective
                </label>
                <select
                  value={profileGoal}
                  onChange={(e) => setProfileGoal(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white cursor-pointer uppercase"
                >
                  <option value="Muscle Hypertrophy & Strength">
                    Muscle Hypertrophy & Strength
                  </option>
                  <option value="Fat Loss & Calorie Burn">
                    Fat Loss & Conditioning
                  </option>
                  <option value="Powerlifting & Heavy Compound">
                    Powerlifting & Maximum Strength
                  </option>
                  <option value="Cardiovascular Endurance">
                    Endurance & Marathon Prep
                  </option>
                </select>
              </div>

              {/* Body Weight Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileWeight}
                    onChange={(e) => setProfileWeight(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileTargetWeight}
                    onChange={(e) => setProfileTargetWeight(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/15 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-black hover:bg-gray-100 transition shadow-lg cursor-pointer uppercase"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
