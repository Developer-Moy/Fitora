"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Dumbbell,
  Clock,
  Utensils,
  Activity,
  ArrowUpRight,
  LogOut,
  Edit3,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Droplets,
  Award,
  Loader2,
  Trash2,
  ChevronRight,
  History,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  clearAuthSession,
  logoutUser,
  getCurrentUserApi,
  AuthUser,
  AUTH_SESSION_UPDATED,
} from "@/services/authService";
import {
  uploadToImgBB,
  readFileAsDataURL,
} from "@/services/imageUploadService";
import { getWorkoutLogs } from "@/services/workoutService";
import type { WorkoutLog } from "@/types/workout";
import MealCard from "@/components/meals/MealCard";
import {
  getDailyMealPlan,
  SavedMealPlanItem,
} from "@/services/dailyMealPlanService";
import { deleteBmiHistory, fetchBmiHistory } from "@/services/bmiService";
import { fetchMealCharts, type MealChart } from "@/services/mealChartService";
import BillingSection from "@/components/profile/BillingSection";
import PersonalizedNutritionPlan, {
  MEAL_SUGGESTIONS_BY_GOAL,
} from "@/components/profile/PersonalizedNutritionPlan";
import SubscriptionModal from "@/components/home/SubscriptionModal";
import MembershipStatusCard from "@/components/subscription/MembershipStatusCard";
import { FITORA_PLANS, PlanItem } from "@/components/home/PricingSection";
import { type MembershipData, isFreePlan } from "@/lib/membershipUtils";
import MembershipExpiryBanner from "@/components/MembershipExpiryBanner";

interface BMIHistory {
  _id: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  createdAt: string;
}

// Removed DEFAULT_WORKOUT_HISTORY

export default function ProfilePage() {
  const router = useRouter();
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dailyPlanMeals, setDailyPlanMeals] = useState<SavedMealPlanItem[]>([]);
  const [isLoadingDailyPlan, setIsLoadingDailyPlan] = useState<boolean>(true);


  const [fitnessGoalData, setFitnessGoalData] = useState<{
    goal: {
      _id: string;
      goalType?: string;
      targetWeight: number;
      weeklyWorkoutFrequency: number;
    };
    activeStreak: number;
    totalVolumeLifted: number;
    milestone?: {
      achieved: boolean;
      current: number | null;
    };
  } | null>(null);

  const [fitnessGoalLoading, setFitnessGoalLoading] = useState(true);

  const [history, setHistory] = useState<BMIHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // Membership Expiry Banner Live State
  const [membershipBannerData, setMembershipBannerData] = useState<{
    status: "expiring_soon" | "expired" | "no_membership";
    planName: string;
    daysRemaining?: number;
    expiryDate?: string;
  } | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] =
    useState<boolean>(true);

  // Edit Modal State

  useEffect(() => {
    setIsMounted(true);

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

  // ── Authoritative Backend Membership Check ──
  useEffect(() => {
    let isCancelled = false;

    const checkMembershipStatus = async () => {
      // 1. Get logged-in user identification from existing authentication/session
      const targetUserId =
        authSession?.user?.id || localUser?.id || localUser?._id;
      const targetEmail =
        authSession?.user?.email ||
        localUser?.email ||
        (typeof window !== "undefined"
          ? (localStorage.getItem("fitora_user_email") ?? undefined)
          : undefined);

      if (!targetUserId && !targetEmail) {
        if (!isCancelled) {
          setIsCheckingMembership(false);
          setMembershipBannerData(null);
        }
        return;
      }

      setIsCheckingMembership(true);

      try {
        // 2. Fetch authoritative user & membership data directly from backend database
        const res = await getCurrentUserApi({
          userId: targetUserId,
          email: targetEmail,
        });

        if (isCancelled) return;

        // Error Handling: If request fails, gracefully do NOT show a false expired banner
        if (!res.success || !res.user) {
          setMembershipBannerData(null);
          setIsCheckingMembership(false);
          return;
        }

        const backendUser = res.user;
        const currentPlan = backendUser.plan || localUser?.plan || "Free Pass";
        const rawExpiry = backendUser.membershipExpiresAt;

        const isFreeTier =
          !currentPlan ||
          currentPlan === "Free Pass" ||
          currentPlan === "FREE MEMBER" ||
          currentPlan.toLowerCase() === "free";

        // State C: No active membership / Free tier without valid expiry
        if (isFreeTier || !rawExpiry) {
          setMembershipBannerData({
            status: "no_membership",
            planName: currentPlan,
          });
          setIsCheckingMembership(false);
          return;
        }

        const expiryDateObj = new Date(rawExpiry);
        const expiryTime = expiryDateObj.getTime();
        const now = Date.now();

        // If stored date is invalid
        if (isNaN(expiryTime)) {
          setMembershipBannerData({
            status: "expired",
            planName: currentPlan,
          });
          setIsCheckingMembership(false);
          return;
        }

        const formattedExpiry = expiryDateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const diffMs = expiryTime - now;

        if (diffMs <= 0) {
          // State C: Expired in the past (or today already elapsed)
          setMembershipBannerData({
            status: "expired",
            planName: currentPlan,
            expiryDate: formattedExpiry,
          });
        } else {
          // Future expiration: evaluate 7-day boundary
          const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
          if (diffMs <= SEVEN_DAYS_MS) {
            // State B: Expiring soon (within next 7 days: 0 < diffMs <= 7 days)
            const daysRemaining = Math.max(
              1,
              Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
            );
            setMembershipBannerData({
              status: "expiring_soon",
              planName: currentPlan,
              daysRemaining,
              expiryDate: formattedExpiry,
            });
          } else {
            // State A: Active membership (> 7 days remaining) -> Do NOT show banner
            setMembershipBannerData(null);
          }
        }
      } catch (err) {
        console.error("Failed to check user membership status:", err);
        // Error handling: gracefully avoid breaking profile page or showing false alert
        if (!isCancelled) {
          setMembershipBannerData(null);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingMembership(false);
        }
      }
    };

    checkMembershipStatus();

    return () => {
      isCancelled = true;
    };
  }, [
    authSession?.user?.id,
    authSession?.user?.email,
    localUser?.id,
    localUser?._id,
    localUser?.email,
  ]);

  useEffect(() => {
    const fetchBMIHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError("");

        const userId = (localUser?.id || localUser?._id) as string | undefined;
        const historyData = await fetchBmiHistory(userId);
        setHistory(historyData);
      } catch (error) {
        console.error("BMI history fetch error:", error);
        setHistoryError("Failed to load your calculation history.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchBMIHistory();
  }, [localUser?.id, localUser?._id]);

  const handleDeleteHistory = async (id: string) => {
    try {
      const success = await deleteBmiHistory(id);

      if (!success) {
        toast.error("Failed to delete history.");
        return;
      }

      setHistory((prev) => prev.filter((item) => item._id !== id));

      toast.success("Calculation history deleted successfully.");
    } catch (error) {
      console.error("Delete BMI history error:", error);
      toast.error("Failed to delete history.");
    }
  };

  const activeUser = { ...authSession?.user, ...localUser };
  const userName = activeUser?.name || "Athlete Member";
  const userEmail = activeUser?.email || "athlete@fitora.com";
  const userInitial = userName.charAt(0).toUpperCase() || "A";
  const userRole = (activeUser as any)?.role || "athlete";
  const userAvatar =
    localUser?.avatarUrl ||
    (activeUser as any)?.image ||
    (activeUser as any)?.avatarUrl ||
    "";
  const isMasterAdmin =
    userRole === "master_admin" ||
    userEmail.toLowerCase().includes("master@fitora.com");
  const isBranchAdmin =
    userRole === "branch_admin" ||
    userEmail.toLowerCase().includes("admin@fitora");

  const resolvedUserId =
    authSession?.user?.id ||
    localUser?.id ||
    localUser?._id ||
    (typeof window !== "undefined"
      ? (localStorage.getItem("fitora_user_email") ?? undefined)
      : undefined);

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeSubscriptionData, setActiveSubscriptionData] =
    useState<any>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewPlan, setRenewPlan] = useState<PlanItem | null>(null);

  const [mealChart, setMealChart] = useState<MealChart | null>(null);

  // Resolve the user's membership record for the dedicated status card (100% dynamic)
  const resolvedMembership = useMemo<MembershipData>(() => {
    const planName =
      activeSubscriptionData?.planName || localUser?.plan || "Free Pass";
    const startDate =
      activeSubscriptionData?.startDate || localUser?.createdAt || null;
    const expiryDate =
      activeSubscriptionData?.expiryDate ||
      localUser?.subscriptionExpiryDate ||
      localUser?.membershipExpiresAt ||
      null;

    // Free user -> keep free pass with no expiry
    if (isFreePlan(planName)) {
      return { planName, startDate: null, expiryDate: null };
    }

    // Real paid membership with known expiry -> use it directly
    if (expiryDate) {
      return { planName, startDate, expiryDate };
    }

    // Paid plan without explicit expiry in DB -> calculate dynamic 30-day window
    const now = new Date();
    const fallbackExpiry = new Date(now);
    fallbackExpiry.setDate(fallbackExpiry.getDate() + 30);
    return {
      planName,
      startDate: startDate || now,
      expiryDate: fallbackExpiry,
    };
  }, [activeSubscriptionData, localUser]);

  const currentGoalKey =
    mealChart?.goals?.fitnessGoal ||
    localUser?.fitnessGoal ||
    localUser?.plan ||
    "Bulking & Muscle Gain";

  const goalData =
    MEAL_SUGGESTIONS_BY_GOAL[currentGoalKey] ||
    MEAL_SUGGESTIONS_BY_GOAL["Bulking & Muscle Gain"];

  useEffect(() => {
    const targetId = resolvedUserId || "guest_user";

    const fetchData = async () => {
      setIsLoadingDailyPlan(true);
      setIsLoadingWorkouts(true);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("fitora_token") ||
            localStorage.getItem("fitora_auth_token")
            : null;
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [dailyPlanRes, workoutsRes, mealChartsRes, paymentsRes] =
          await Promise.all([
            getDailyMealPlan(targetId),
            getWorkoutLogs(targetId, 20).catch(() => ({ logs: [] })),
            fetchMealCharts(targetId).catch(() => []),
            fetch(
              `${apiUrl}/payments/me?userId=${encodeURIComponent(targetId)}&email=${encodeURIComponent(userEmail)}`,
              { headers },
            )
              .then((r) => (r.ok ? r.json() : { data: { payments: [] } }))
              .catch(() => ({ data: { payments: [] } })),
          ]);

        if (dailyPlanRes.success && dailyPlanRes.data) {
          setDailyPlanMeals(dailyPlanRes.data);
        }
        if (workoutsRes && workoutsRes.logs) {
          setWorkoutLogs(workoutsRes.logs);
        }
        if (mealChartsRes && mealChartsRes.length > 0) {
          setMealChart(mealChartsRes[0]);
        }
        if (paymentsRes?.data?.payments) {
          setTransactions(paymentsRes.data.payments);
        }
        if (paymentsRes?.data?.activeSubscription) {
          setActiveSubscriptionData(paymentsRes.data.activeSubscription);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setIsLoadingDailyPlan(false);
        setIsLoadingWorkouts(false);
      }
    };

    fetchData();
  }, [resolvedUserId, userEmail]);



  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch { }
    toast.success("Logged out successfully. See you soon, Champion!");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  };

  const handleOpenRenewModal = () => {
    const currentPlanKey =
      activeSubscriptionData?.planName || localUser?.plan || "Pro Athlete";
    const foundPlan =
      FITORA_PLANS.find(
        (p) =>
          p.name.toLowerCase() === currentPlanKey.toLowerCase() ||
          p.planKey.toLowerCase() === currentPlanKey.toLowerCase() ||
          p.id.toLowerCase() === currentPlanKey.toLowerCase(),
      ) || FITORA_PLANS[1];
    setRenewPlan(foundPlan);
    setIsRenewModalOpen(true);
  };

  const handleSubscriptionSuccess = (
    plan: PlanItem,
    isAnnual: boolean,
    paymentMethod: string,
  ) => {
    setIsRenewModalOpen(false);
    toast.success(`🎉 Membership plan ${plan.name} updated successfully!`);
    // Refetch or reload to update local auth & subscriptions
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  if (!isMounted) return null;



  useEffect(() => {
    let cancelled = false;

    const fetchFitnessGoal = async () => {
      const targetUserId =
        authSession?.user?.id ||
        localUser?.id ||
        localUser?._id;

      if (!targetUserId) {
        setFitnessGoalLoading(false);
        return;
      }

      try {
        setFitnessGoalLoading(true);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000/api";

        const response = await fetch(
          `${apiUrl}/goals/${encodeURIComponent(targetUserId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (cancelled) return;

        if (response.status === 404) {
          setFitnessGoalData(null);
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load fitness goal"
          );
        }

        setFitnessGoalData(result.data);
      } catch (error) {
        console.error("Failed to fetch fitness goal:", error);

        if (!cancelled) {
          setFitnessGoalData(null);
        }
      } finally {
        if (!cancelled) {
          setFitnessGoalLoading(false);
        }
      }
    };

    fetchFitnessGoal();

    return () => {
      cancelled = true;
    };
  }, [
    authSession?.user?.id,
    localUser?.id,
    localUser?._id,
  ]);



  // Dynamic progress calculation

  const currentWeight = Number(localUser?.weight || 0);
  const targetWeight = Number(
    fitnessGoalData?.goal?.targetWeight || 0
  );

  const activeStreak = Number(
    fitnessGoalData?.activeStreak || 0
  );

  const weeklyWorkoutFrequency = Number(
    fitnessGoalData?.goal?.weeklyWorkoutFrequency || 0
  );

  const goalType =
    fitnessGoalData?.goal?.goalType ||
    localUser?.fitnessGoal ||
    "Fitness Goal";

  const weightDifference = Math.abs(
    currentWeight - targetWeight
  );

  // Progress toward target weight.
  // This keeps the existing UI behavior but makes it API-driven.
  const weightProgress =
    currentWeight > 0 && targetWeight > 0
      ? Math.min(
        100,
        Math.max(
          0,
          100 -
          (weightDifference /
            Math.max(currentWeight, targetWeight)) *
          100
        )
      )
      : 0;

  const isGoalReached =
    currentWeight > 0 &&
    targetWeight > 0 &&
    currentWeight === targetWeight;

  const isWeightLoss = currentWeight > targetWeight;


  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black py-12 sm:py-16 px-6 sm:px-10 lg:px-16 select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ── Page Header (Homepage Style) ── */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            Athlete Profile
          </h1>
          <p
            className="text-white/80 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Track your progress, update your details, and unlock your full
            athletic potential.
          </p>
        </div>

        {/* ── Membership Status Banner ── */}
        {!isCheckingMembership && membershipBannerData && (
          <MembershipExpiryBanner
            status={membershipBannerData.status}
            planName={membershipBannerData.planName}
            daysRemaining={membershipBannerData.daysRemaining}
            expiryDate={membershipBannerData.expiryDate}
            actionHref="/#pricing"
            onAction={handleOpenRenewModal}
          />
        )}

        {/* ── 1. Athlete Header Card ── */}
        <div className="bg-black border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Subtle gradient overlay effect from homepage cards */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-50" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
            {/* Left: Avatar with Upload Overlay & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Profile Avatar with Camera Trigger */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black border-2 border-white/20 overflow-hidden flex items-center justify-center text-white font-black text-4xl shadow-xl">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>

                {/* Camera Upload Button */}
              </div>

              {/* Identity & Membership Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                    {userName}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black shadow-md">
                    {isMasterAdmin
                      ? "MASTER ADMIN"
                      : isBranchAdmin
                        ? "BRANCH ADMIN"
                        : localUser?.plan || "FREE MEMBER"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/60 font-medium">
                  {localUser?.bio || "Fitora Certified Athlete Member"}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/60 flex-wrap pt-1">
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <Mail className="w-3.5 h-3.5" />
                    {userEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-white/80" />
                    {localUser?.assignedBranch || "Gulshan-2 Flagship"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <Link
                href="/profile/edit"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer shadow-xl"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-black text-white border border-white/20 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer shadow-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 1.5. Dedicated Membership Status Card ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
              Your Membership Plan
            </h2>
          </div>

          <MembershipStatusCard
            membership={resolvedMembership}
            onRenew={handleOpenRenewModal}
          />
        </div>

        {/* ── 2. Information Sections (Personal & Physical Profile Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Personal & Contact Information */}
          <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white/60" />
                <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Personal Details
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Full Name</span>
                <span className="text-white font-bold">{userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Email Address</span>
                <span className="text-white font-semibold">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Phone Number</span>
                <span className="text-white font-semibold">
                  {localUser?.phone || "+880 1700-000000"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Gender</span>
                <span className="text-white font-semibold">
                  {localUser?.gender || "Male"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Preferred Branch</span>
                <span className="text-white font-semibold">
                  {localUser?.assignedBranch || "Gulshan-2 Flagship Branch"}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Physical & Fitness Metrics */}
          <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-white/60" />
                <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Fitness & Physical Profile
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Self-Reported
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Primary Goal</span>
                <span className="text-white font-bold uppercase">
                  {localUser?.fitnessGoal ||
                    localUser?.plan ||
                    "Bulking & Muscle Gain"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Body Weight</span>
                <span className="text-white font-semibold">
                  {localUser?.weight || "74"} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Height</span>
                <span className="text-white font-semibold">
                  {localUser?.height || "178"} cm
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Activity Level</span>
                <span className="text-white font-semibold">
                  {localUser?.activityLevel || "4-5 Days / Week"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Daily Water Target</span>
                <span className="text-white font-semibold">
                  {goalData.hydration}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Gym & Workout History Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <History className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                Gym & Workout History
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60 font-medium hidden sm:inline">
                {workoutLogs.length} Logged Sessions
              </span>
              <Link
                href="/stopwatch"
                className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start New Session</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {/* Dynamic Rendering: Show workouts if they exist, otherwise show Empty State */}
            {isLoadingWorkouts ? (
              <div className="bg-black border border-white/20 rounded-2xl p-8 flex justify-center text-white/50 text-sm">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading
                workouts...
              </div>
            ) : workoutLogs && workoutLogs.length > 0 ? (
              workoutLogs.map((log) => (
                <div
                  key={log._id || Math.random().toString()}
                  className="bg-black border border-white/20 hover:border-white/30 rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-extrabold uppercase text-white">
                          {log.exerciseName || "Workout"}
                        </h3>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        {log.date
                          ? new Date(log.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "Recently"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-white/80">
                      <span className="inline-flex items-center gap-1 bg-black border border-white/20 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-white/60" />
                        {log.durationMinutes} min
                      </span>
                      {log.weight && log.weight > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-black border border-white/20 px-3 py-1.5 rounded-full text-white">
                          <Dumbbell className="w-3.5 h-3.5 text-white" />
                          {log.weight} kg
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                      Stats ({log.setsCount} Sets, {log.repsCount} Reps)
                    </p>
                    {log.notes && (
                      <div className="flex items-center gap-2 text-xs text-white/80 bg-black px-3 py-2 rounded-xl border border-white/5">
                        <span className="truncate">{log.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              /* Empty State for Workouts */
              <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <Dumbbell className="w-10 h-10 text-white/20" />
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black uppercase text-white">
                    No Workouts Logged
                  </h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    Your gym history is currently empty. Start your first
                    session using the stopwatch to track your progress!
                  </p>
                </div>
                <Link
                  href="/stopwatch"
                  className="mt-2 group inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-xl hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Clock className="w-4 h-4" />
                  <span>Start First Session</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. BMI, BMR & TDEE Calculation History ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />

              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  Calculation History
                </h2>

                <p className="text-xs text-white/60 mt-1">
                  Your previous BMI, BMR and TDEE calculations
                </p>
              </div>
            </div>
          </div>

          {historyLoading ? (
            <div className="bg-black border border-white/20 rounded-2xl p-10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-white/60" />
            </div>
          ) : historyError ? (
            <div className="bg-black border border-red-500/20 rounded-2xl p-6 text-center">
              <p className="text-sm text-red-400">{historyError}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3">
              <TrendingUp className="w-10 h-10 text-white/20" />

              <h3 className="text-base sm:text-lg font-black uppercase text-white">
                No Calculation History
              </h3>

              <p className="text-xs text-white/60 max-w-sm">
                Your BMI, BMR and TDEE calculation history will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-black border border-white/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                      <th className="px-5 py-4 font-bold">Date</th>

                      <th className="px-5 py-4 font-bold">Weight</th>

                      <th className="px-5 py-4 font-bold">BMI</th>

                      <th className="px-5 py-4 font-bold">BMR</th>

                      <th className="px-5 py-4 font-bold">TDEE</th>

                      <th className="px-5 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-white/70">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-white">
                          {item.weight} kg
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-black text-white">
                            {item.bmi.toFixed(1)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-white/70">
                          {item.bmr} kcal
                        </td>

                        <td className="px-5 py-4 text-sm text-white/70">
                          {item.tdee} kcal
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteHistory(item._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200/30 text-red-200 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* weight progress */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Weight Progress
            </span>

            <span className="text-xs font-black text-white">
              {fitnessGoalLoading
                ? "..."
                : `${Math.round(weightProgress)}%`}
            </span>
          </div>

          <div className="h-4 w-full overflow-hidden rounded-full border border-white/5 bg-neutral-900">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{
                width: `${weightProgress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-[10px] font-bold text-white/40">
              {currentWeight > 0 ? `${currentWeight} kg` : "--"}
            </span>

            <span className="text-[10px] font-bold text-white/40">
              {targetWeight > 0 ? `${targetWeight} kg` : "--"}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-neutral-900 p-4">
            {isGoalReached ? (
              <>
                <p className="text-xs font-black uppercase text-white">
                  Goal Reached 🎉
                </p>

                <p className="mt-1 text-[10px] text-white/40">
                  Congratulations! You reached your target weight.
                </p>
              </>
            ) : targetWeight > 0 ? (
              <>
                <p className="text-xs font-black uppercase text-white">
                  {weightDifference.toFixed(1)} kg{" "}
                  {isWeightLoss ? "remaining to lose" : "remaining to gain"}
                </p>

                <p className="mt-1 text-[10px] text-white/40">
                  Keep training consistently to reach your target.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-black uppercase text-white">
                  No Active Goal
                </p>

                <p className="mt-1 text-[10px] text-white/40">
                  Set a fitness goal to start tracking your progress.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── 5. Billing & Transactions ── */}
        <BillingSection />

        {/* ── 6. Meal Suggestion According to Profile ── */}
        <PersonalizedNutritionPlan
          user={localUser}
          planName={activeSubscriptionData?.planName || localUser?.plan}
          fitnessGoal={mealChart?.goals?.fitnessGoal || localUser?.fitnessGoal}
          onUpgradeClick={handleOpenRenewModal}
        />

        {/* ── 4.5. My Saved Daily Meal Plan Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  Saved Daily Meal Plan
                </h2>
                <p className="text-xs text-white/60">
                  Meals saved directly to your account
                </p>
              </div>
            </div>

            <Link
              href="/meals"
              className="inline-flex items-center gap-1 text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              <span>Add More Meals</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingDailyPlan ? (
            <div className="bg-black border border-white/20 rounded-2xl p-8 flex items-center justify-center text-white/60">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading Daily Meal Plan...
              </span>
            </div>
          ) : dailyPlanMeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyPlanMeals.map((item) => (
                <MealCard
                  key={item._id}
                  id={item.mealId || item._id}
                  name={item.name}
                  ingredients={item.ingredients}
                  calories={item.calories}
                  description={item.description}
                  img={item.img}
                />
              ))}
            </div>
          ) : (
            <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <Utensils className="w-10 h-10 text-white/20" />
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black uppercase text-white">
                  No Meals Saved Yet
                </h3>
                <p className="text-xs text-white/60 max-w-sm mx-auto">
                  Your daily meal plan is empty. Browse recipes and click "Add
                  to Daily Plan" to save meals here!
                </p>
              </div>
              <Link
                href="/meals"
                className="mt-2 inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-xl"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Recipes</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Membership Renewal / Upgrade Modal ── */}
        {renewPlan && (
          <SubscriptionModal
            isOpen={isRenewModalOpen}
            onClose={() => setIsRenewModalOpen(false)}
            plan={renewPlan}
            isAnnual={false}
            onSuccess={handleSubscriptionSuccess}
          />
        )}

        {/* ── 7. Admin Management Access (If Admin) ── */}
        {(isMasterAdmin || isBranchAdmin) && (
          <div className="bg-black border border-white/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <h3 className="text-sm font-black uppercase text-white">
                  Elevated Staff Dashboard
                </h3>
              </div>
              <p className="text-xs text-white/60">
                Authorized staff portal for branches, athlete rosters, and
                leads.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all shrink-0 shadow-lg"
            >
              <span>Open Dashboard</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
