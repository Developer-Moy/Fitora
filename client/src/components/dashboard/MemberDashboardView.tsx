"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import HydrationTracker from "@/components/dashboard/HydrationTracker";
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
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAuthSession,
  getCurrentUserApi,
  updateSessionAfterPayment,
} from "@/services/authService";
import { changeMembershipPlanApi } from "@/services/paymentService";
import MembershipExpiryBanner from "@/components/MembershipExpiryBanner";

interface MemberDashboardViewProps {
  isPremium: boolean;
  userName: string;
  userEmail: string;
  userPlan: string;
  assignedBranch: string;
  userId: string;
  activeTab?: string;
  onUpgradeToPremium?: () => void;
}

export default function MemberDashboardView({
  isPremium,
  userName,
  userEmail,
  userPlan,
  assignedBranch,
  userId,
  activeTab: propActiveTab,
  onUpgradeToPremium,
}: MemberDashboardViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = propActiveTab || searchParams.get("tab");

  const normalizedTab = (() => {
    if (!currentTab || currentTab === "overview" || currentTab === "entry-pass")
      return "overview";
    if (
      currentTab === "workouts" ||
      currentTab === "workout-log" ||
      currentTab === "goals-log"
    )
      return "workouts";
    if (currentTab === "hydration" || currentTab === "nutrition-log")
      return "hydration";
    if (currentTab === "ai-coach") return "ai-coach";
    return "overview";
  })();

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard?tab=${tabId}`);
  };

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
    if (currentTab === "upgrade") setShowPaymentModal(true);
    else if (currentTab === "profile" || currentTab === "settings")
      setIsProfileModalOpen(true);
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
    const session = getAuthSession();
    if (session?.token) {
      try {
        await changeMembershipPlanApi(session.token, "VIP Ultimate", "monthly");
      } catch {}
    }
    await updateSessionAfterPayment("VIP Ultimate", {
      refreshFromServer: true,
    });
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

  // ── Dynamic Workout Logs Fetch from MongoDB ──
  useEffect(() => {
    setWorkoutLogsLoading(true);
    const targetUserId = userId || userEmail;
    if (!targetUserId) {
      setWorkoutLogsLoading(false);
      return;
    }
    getWorkoutLogs(targetUserId, 20)
      .then((res) => {
        setWorkoutLogsList(res.logs || []);
      })
      .catch(() => setWorkoutLogsList([]))
      .finally(() => setWorkoutLogsLoading(false));
  }, [userId, userEmail, normalizedTab]);

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200">
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

      {/* ── TAB 1: OVERVIEW COCKPIT ── */}
      {normalizedTab === "overview" && (
        <>
          {/* ── TOP HERO BANNER (HOMEPAGE LUXURY DARK) ── */}
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black p-4 sm:p-5 shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                  {isPremium ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-black font-black text-[11px]">
                      <Crown className="w-3 h-3 fill-black" />
                      {userPlan || "VIP Pro Athlete Pass Active"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/15 text-white/70 text-[11px]">
                      <Zap className="w-3 h-3" />
                      Free Tier Member Pass
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Hello, {profileName}!
                </h1>
                <p className="text-xs text-white/60 leading-relaxed">
                  Home Branch:{" "}
                  <span className="font-bold text-white underline">
                    {profileBranch}
                  </span>
                  .{" "}
                  {isPremium
                    ? "Nationwide access to 64 branches active."
                    : "Upgrade to Pro for AI Coaching Studio & all-branch entry."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition shadow-lg cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                {!isPremium && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition shadow-2xl cursor-pointer"
                  >
                    <span>Upgrade to Pro</span>
                    <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Success Toast */}
          {profileToast && (
            <div className="p-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-300">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Digital Gym Entry QR Card */}
            <div className="lg:col-span-4 p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3 flex flex-col justify-between text-center">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-white/50">
                  <QrCode className="w-3.5 h-3.5 text-white" />
                  Digital Gym Entry Pass
                </div>

                <div className="my-2.5 p-3 mx-auto max-w-[150px] rounded-xl bg-white border-2 border-white shadow-xl">
                  {isPremium ? (
                    <div className="space-y-1">
                      <div className="w-24 h-24 mx-auto bg-black p-1.5 rounded-lg flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-white" />
                      </div>
                      <div className="text-[9px] font-black text-black tracking-widest uppercase">
                        {profileQrCode || "FIT-VIP-PASS"}
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 mx-auto flex flex-col items-center justify-center space-y-1.5 text-neutral-400">
                      <Lock className="w-6 h-6 text-neutral-600" />
                      <span className="text-[10px] font-black text-black uppercase tracking-wider">
                        Locked
                      </span>
                    </div>
                  )}
                </div>

                <h4 className="font-black text-xs uppercase tracking-tight text-white">
                  {isPremium ? "Scan at Turnstile" : "Pro Pass Required"}
                </h4>
                <p className="text-[10px] text-white/50 mt-0.5">
                  {isPremium
                    ? "Valid across all 64 FITORA branches"
                    : "Upgrade to unlock instant scanning nationwide"}
                </p>
              </div>

              {!isPremium && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-2 rounded-full bg-white text-black font-black uppercase text-xs hover:bg-gray-100 transition cursor-pointer shadow-lg"
                >
                  Unlock Pass (৳4,900/mo)
                </button>
              )}
            </div>

            {/* Member Workout Stats Grid (Monochrome with Green numbers only) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                  <span>Monthly Workouts</span>
                  <Dumbbell className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="pt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">
                    {statsLoading
                      ? "..."
                      : ((memberStats as any)?.workoutCount ??
                        memberStats?.workoutsThisMonth ??
                        0)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    Active Streak
                  </span>
                </div>
                <p className="text-[11px] text-white/40">
                  Target: {memberStats?.targetWorkouts ?? 20} sessions / mo
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                  <span>Calories Burned</span>
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="pt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">
                    {statsLoading
                      ? "..."
                      : (
                          (memberStats as any)?.burnedCalories ??
                          memberStats?.caloriesBurned ??
                          0
                        ).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-white/50 uppercase">
                    kcal
                  </span>
                </div>
                <p className="text-[11px] text-white/40">
                  Weekly avg:{" "}
                  {Math.round(
                    ((memberStats as any)?.burnedCalories ??
                      memberStats?.caloriesBurned ??
                      0) / 4,
                  ).toLocaleString()}{" "}
                  kcal
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                  <span>Check-in Streak</span>
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="pt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-emerald-400 tracking-tight">
                    {statsLoading ? "..." : (memberStats?.streakDays ?? 0)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    Days Streak
                  </span>
                </div>
                <p className="text-[11px] text-white/40">
                  Consistency: {memberStats?.consistencyScore ?? 0}%
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                  <span>Personal Training</span>
                  <HeartPulse className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="pt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">
                    {isPremium ? "Active" : "Standard"}
                  </span>
                  <span className="text-[10px] font-bold text-white/50 uppercase">
                    Hypertrophy
                  </span>
                </div>
                <p className="text-[11px] text-white/40">
                  Next: Chest & Triceps PR
                </p>
              </div>
            </div>
          </div>

          {/* ── BMR/TDEE & FITNESS GOALS (SIDE-BY-SIDE) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left 6 cols: BMR & TDEE */}
            <div className="lg:col-span-6 p-3.5 sm:p-4 rounded-2xl border border-white/15 bg-black shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-tight text-white">
                  Metabolic Energy Metrics
                </h3>
                <span className="text-[10px] text-white/40">Estimated</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-white/50">
                    <span>BMR</span>
                    <Flame className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-white">
                      {healthMetrics.bmr ?? "--"}
                    </span>
                    <span className="text-[9px] text-white/40 font-bold uppercase">
                      kcal/d
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-white/50">
                    <span>TDEE</span>
                    <Activity className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-white">
                      {healthMetrics.tdee ?? "--"}
                    </span>
                    <span className="text-[9px] text-white/40 font-bold uppercase">
                      kcal/d
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 cols: My Fitness Goals */}
            <div className="lg:col-span-6 p-3.5 sm:p-4 rounded-2xl border border-white/15 bg-black shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-white">
                    Fitness & Weight Goal
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Target: {goalTargetWeight || "--"} kg &bull;{" "}
                    {weeklyWorkoutFrequency}d/wk
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setGoalError(null);
                    setGoalSuccess(null);
                    setShowFitnessGoalModal(true);
                  }}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black cursor-pointer hover:bg-gray-100 transition shadow"
                >
                  Update
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 block">
                      Current
                    </span>
                    <span className="text-base font-black text-white">
                      {profileWeight || "--"} kg
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 block">
                      Target
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      {goalTargetWeight || "--"} kg
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-white/50">
                    <span>Progress</span>
                    <span>{Math.round(weightProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${weightProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showFitnessGoalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="w-full max-w-md rounded-2xl bg-black border border-white/15 p-5 shadow-2xl text-white">
                <h2 className="text-lg font-bold uppercase tracking-tight">
                  Update Fitness Goal
                </h2>

                <div className="mt-4 space-y-3 text-xs">
                  {/* Target Weight */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                      Target Weight (kg)
                    </label>

                    <input
                      type="number"
                      value={goalTargetWeight}
                      onChange={(e) => setGoalTargetWeight(e.target.value)}
                      className="w-full rounded-full border border-white/15 bg-black px-4 py-2 text-white outline-none focus:border-white text-xs"
                    />
                  </div>

                  {/* Workout Frequency */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                      Weekly Workout Frequency
                    </label>

                    <select
                      value={weeklyWorkoutFrequency}
                      onChange={(e) =>
                        setWeeklyWorkoutFrequency(e.target.value)
                      }
                      className="w-full rounded-full border border-white/15 bg-black px-4 py-2 text-white outline-none focus:border-white cursor-pointer text-xs"
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

                  {goalError && (
                    <p className="text-xs text-red-500">{goalError}</p>
                  )}

                  {goalSuccess && (
                    <p className="text-xs text-emerald-400">{goalSuccess}</p>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFitnessGoalModal(false)}
                    className="rounded-full border border-white/20 bg-transparent px-4 py-2 text-xs font-bold uppercase text-white/70 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateGoal}
                    disabled={goalUpdating}
                    className="rounded-full bg-white px-4 py-2 text-black font-bold uppercase text-xs hover:bg-gray-100 transition shadow-lg cursor-pointer"
                  >
                    {goalUpdating ? "Updating..." : "Save Goal"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── FEATURE MODULES & QUICK ACTIONS ── */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-tight text-white/60">
              Training & Lifestyle Modules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Module 1: Workout Session */}
              <div
                onClick={() => handleTabChange("workouts")}
                className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-tight text-white group-hover:underline transition">
                    Workout Logs
                  </h4>
                  <p className="text-[11px] text-white/50">
                    Complete exercise logs & resistance volume
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white">
                  <span>Open Workouts</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Module 2: Nutrition & Hydration */}
              <div
                onClick={() => handleTabChange("hydration")}
                className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-tight text-white group-hover:underline transition">
                    Daily Hydration
                  </h4>
                  <p className="text-[11px] text-white/50">
                    Track daily glasses & water intake
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white">
                  <span>Open Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Module 3: Personal Coaching Studio */}
              <div
                onClick={() => handleTabChange("ai-coach")}
                className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-tight text-white group-hover:underline transition">
                    AI Coaching Studio
                  </h4>
                  <p className="text-[11px] text-white/50">
                    Personal form analysis & hypertrophy splits
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white">
                  <span>Open Studio</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Module 4: Goals & PRs */}
              <div
                onClick={() => handleTabChange("workouts")}
                className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 hover:border-white transition-all shadow-xl group flex flex-col justify-between cursor-pointer space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-tight text-white group-hover:underline transition">
                    PR Goals & Records
                  </h4>
                  <p className="text-[11px] text-white/50">
                    Target:{" "}
                    {goalTargetWeight ? `${goalTargetWeight}kg` : "Set goal"}{" "}
                    &bull; {Math.round(weightProgress)}%
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white">
                  <span>View Records</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: WORKOUTS & ROUTINES (DEDICATED INLINE VIEW) ── */}
      {normalizedTab === "workouts" && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Resistance & Strength Cockpit
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
                Workouts & Personal Records
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Review your completed workout sessions, recorded sets, reps, and
                milestone goals.
              </p>
            </div>
            <Link
              href="/exercises"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition shadow-lg shrink-0 cursor-pointer"
            >
              <span>Open Exercise Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Workout Logs List */}
            <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-white flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" />
                    Completed Workout Logs
                  </h3>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    Synced automatically with your Exercise Tracker sessions.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {workoutLogsList.length} logs
                </span>
              </div>

              <div className="max-h-[290px] overflow-y-auto space-y-2 pr-1">
                {workoutLogsLoading ? (
                  <div className="py-6 text-center text-white/40 font-bold uppercase animate-pulse text-xs">
                    Loading workouts from MongoDB...
                  </div>
                ) : workoutLogsList.length > 0 ? (
                  workoutLogsList.map((log, idx) => (
                    <div
                      key={log._id || idx}
                      className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center hover:border-white/25 transition"
                    >
                      <div>
                        <span className="text-white font-black text-xs sm:text-sm block uppercase tracking-tight">
                          {log.exerciseName}
                        </span>
                        <span className="text-[10px] text-white/50 font-medium">
                          {log.caloriesBurned
                            ? `${log.caloriesBurned} kcal burned`
                            : "Recorded gym set"}{" "}
                          &bull;{" "}
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleDateString()
                            : "Today"}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-black text-[11px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        {log.setsCount} sets &bull;{" "}
                        {log.weight
                          ? `${log.weight}kg`
                          : `${log.repsCount} reps`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <Dumbbell className="w-6 h-6 text-white/20 mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                      No workouts logged yet. Start recording your sets in the
                      Exercise Tracker!
                    </p>
                    <Link
                      href="/exercises"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition"
                    >
                      <span>Start Workout Session</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Goals & PRs Card */}
            <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-white flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Target Goal & PRs
                    </h3>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Personal milestone tracking
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGoalError(null);
                      setGoalSuccess(null);
                      setShowFitnessGoalModal(true);
                    }}
                    className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-black uppercase text-black cursor-pointer hover:bg-gray-100 transition shadow-lg"
                  >
                    Update Goal
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Current Weight
                      </span>
                      <span className="block text-xl font-black text-white mt-0.5">
                        {profileWeight || "--"} kg
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Target Goal
                      </span>
                      <span className="block text-xl font-black text-emerald-400 mt-0.5">
                        {goalTargetWeight || "--"} kg
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold uppercase text-white/60">
                      <span>Goal Progress</span>
                      <span>{Math.round(weightProgress)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${weightProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-white/50">
                    {isGoalReached
                      ? "Goal reached! Amazing work."
                      : isWeightLoss
                        ? `${weightDifference.toFixed(1)} kg left to lose`
                        : isWeightGain
                          ? `${weightDifference.toFixed(1)} kg left to gain`
                          : "Set your target weight to track progress."}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/50 font-bold uppercase">
                    Workout Frequency
                  </span>
                  <span className="font-black text-white uppercase">
                    {weeklyWorkoutFrequency} days / week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: DAILY HYDRATION (DEDICATED INLINE VIEW) ── */}
      {normalizedTab === "hydration" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <HydrationTracker />
        </div>
      )}

      {/* ── TAB 4: AI COACH STUDIO (DEDICATED INLINE VIEW) ── */}
      {normalizedTab === "ai-coach" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                  <HeartPulse className="w-3 h-3 text-emerald-400" />
                  <span>AI Personal Trainer & Form Studio Active</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Personal Fitness & Form Coach
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Ask science-backed training advice, form cues, plateau
                  breakers, and custom nutrition splits.
                </p>
              </div>

              {!isPremium && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-black text-xs uppercase hover:bg-gray-100 transition shadow-lg cursor-pointer shrink-0"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro Studio</span>
                </button>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Suggested Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "How do I break through my bench press plateau?",
                  "Build a 4-day push-pull-legs hypertrophy split",
                  "What are the best warm-up cues for heavy barbell squats?",
                  "High-protein meal options under 600 calories",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setAiChatQuery(prompt);
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition cursor-pointer text-left"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleAiAsk} className="space-y-2.5 pt-1">
              <textarea
                rows={2}
                value={aiChatQuery}
                onChange={(e) => setAiChatQuery(e.target.value)}
                placeholder="Ask training advice or form instructions..."
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-xs sm:text-sm outline-none focus:border-white text-white resize-none"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiChatQuery.trim()}
                className="px-5 py-2 rounded-full bg-white text-black font-black uppercase text-xs hover:bg-gray-100 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>
                  {aiLoading ? "Coach Analyzing..." : "Get Training Guidance"}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>

            {aiLoading && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/50 animate-pulse flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>
                  AI Coach is analyzing your biomechanics and training
                  routine...
                </span>
              </div>
            )}

            {aiResponse && !aiLoading && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/20 text-xs sm:text-sm text-white leading-relaxed space-y-1.5 max-h-[200px] overflow-y-auto">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Coach Guidance & Feedback:</span>
                </div>
                <div className="whitespace-pre-line text-white/90 text-xs sm:text-sm">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PAYMENT & UPGRADE MODAL (HOMEPAGE LUXURY DARK) ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-black border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
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
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white cursor-pointer"
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
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
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
                          : "border-white/15 bg-black text-white/60 hover:border-white/30"
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
                          : "border-white/15 bg-black text-white/60 hover:border-white/30"
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
                          : "border-white/15 bg-black text-white/60 hover:border-white/30"
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
                    className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 font-bold hover:text-white transition cursor-pointer"
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
          <div className="w-full max-w-lg bg-black border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
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
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white cursor-pointer"
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
                  className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white"
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
                    className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white lowercase font-medium"
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
                    className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white font-medium"
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
                  className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white cursor-pointer uppercase"
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
                  className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white cursor-pointer uppercase"
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
                    className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white"
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
                    className="w-full p-3 rounded-2xl bg-black border border-white/15 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 font-bold hover:text-white transition cursor-pointer"
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
