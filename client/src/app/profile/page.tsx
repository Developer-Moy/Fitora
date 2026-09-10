"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Dumbbell,
  Clock,
  ArrowUpRight,
  LogOut,
  Edit3,
  ShieldCheck,
  Loader2,
  Trash2,
  History,
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  Zap,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  fetchUserActivityStreakApi,
  type UserActivityStreakData,
} from "@/services/activityService";
import {
  getAuthSession,
  logoutUser,
  getCurrentUserApi,
  AuthUser,
  AUTH_SESSION_UPDATED,
} from "@/services/authService";
import { getWorkoutLogs } from "@/services/workoutService";
import type { WorkoutLog } from "@/types/workout";
import SavedMealPlan from "@/components/profile/SavedMealPlan";
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
import ActivityHeatmap from "@/components/profile/ActivityHeatmap";
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
  const [localUser, setLocalUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      return getAuthSession().user;
    }
    return null;
  });
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [dailyPlanMeals, setDailyPlanMeals] = useState<SavedMealPlanItem[]>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const u = getAuthSession().user;
          const uid =
            u?.id || u?._id || localStorage.getItem("fitora_user_email") || "";
          if (uid) {
            const cached = localStorage.getItem(`fitora_daily_meals_${uid}`);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed)) return parsed;
            }
          }
        } catch {}
      }
      return [];
    },
  );
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

  // User Activity & Consistency Streak State
  const [activityStreak, setActivityStreak] =
    useState<UserActivityStreakData | null>(null);
  const [activityStreakLoading, setActivityStreakLoading] =
    useState<boolean>(true);

  // Edit Modal State

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

  // ── Authoritative Backend Activity & Consistency Streak Fetch ──
  useEffect(() => {
    let isCancelled = false;

    const loadActivityStreak = async () => {
      const targetUserId =
        authSession?.user?.id || localUser?.id || localUser?._id;
      const targetEmail = authSession?.user?.email || localUser?.email;

      try {
        setActivityStreakLoading(true);
        const data = await fetchUserActivityStreakApi(
          targetUserId ? String(targetUserId) : undefined,
          targetEmail ? String(targetEmail) : undefined,
        );
        if (!isCancelled) {
          setActivityStreak(data);
        }
      } catch (err) {
        console.error("Failed to load activity streak:", err);
      } finally {
        if (!isCancelled) {
          setActivityStreakLoading(false);
        }
      }
    };

    loadActivityStreak();

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
  const userRole =
    ((activeUser as Record<string, unknown>)?.role as string) || "athlete";
  const userAvatar =
    localUser?.avatarUrl ||
    ((activeUser as Record<string, unknown>)?.image as string) ||
    ((activeUser as Record<string, unknown>)?.avatarUrl as string) ||
    "";
  const isMasterAdmin =
    userRole === "master_admin" ||
    userEmail.toLowerCase().includes("master@fitora.com");
  const isBranchAdmin =
    userRole === "branch_admin" ||
    userEmail.toLowerCase().includes("admin@fitora");

  const storedAuthUser =
    typeof window !== "undefined" ? getAuthSession().user : null;
  const resolvedUserId =
    authSession?.user?.id ||
    localUser?.id ||
    localUser?._id ||
    storedAuthUser?.id ||
    storedAuthUser?._id ||
    (typeof window !== "undefined"
      ? (localStorage.getItem("fitora_user_email") ?? undefined)
      : undefined);

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [activeSubscriptionData, setActiveSubscriptionData] = useState<{
    planName?: string;
    startDate?: string | Date;
    expiryDate?: string | Date;
    [key: string]: unknown;
  } | null>(null);
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
    let isCancelled = false;
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
            getDailyMealPlan(targetId).catch(() => ({
              success: false,
              data: [],
            })),
            getWorkoutLogs(targetId, 20).catch(() => ({ logs: [] })),
            fetchMealCharts(targetId).catch(() => []),
            fetch(
              `${apiUrl}/payments/me?userId=${encodeURIComponent(targetId)}&email=${encodeURIComponent(userEmail)}`,
              { headers },
            )
              .then((r) => (r.ok ? r.json() : { data: { payments: [] } }))
              .catch(() => ({ data: { payments: [] } })),
          ]);

        if (isCancelled) return;

        let fetchedMeals: SavedMealPlanItem[] = [];
        if (dailyPlanRes.success && Array.isArray(dailyPlanRes.data)) {
          fetchedMeals = dailyPlanRes.data;
        }

        // Dual fallback: If targetId was user ID and returned empty, but userEmail exists, check if meals were saved under userEmail
        if (
          fetchedMeals.length === 0 &&
          userEmail &&
          userEmail !== targetId &&
          userEmail !== "athlete@fitora.com"
        ) {
          try {
            const emailRes = await getDailyMealPlan(userEmail);
            if (
              emailRes.success &&
              Array.isArray(emailRes.data) &&
              emailRes.data.length > 0
            ) {
              fetchedMeals = emailRes.data;
            }
          } catch {}
        }

        if (isCancelled) return;

        if (fetchedMeals.length > 0) {
          setDailyPlanMeals(fetchedMeals);
          if (
            typeof window !== "undefined" &&
            targetId &&
            targetId !== "guest_user"
          ) {
            try {
              localStorage.setItem(
                `fitora_daily_meals_${targetId}`,
                JSON.stringify(fetchedMeals),
              );
            } catch {}
          }
        } else if (dailyPlanRes.success) {
          setDailyPlanMeals([]);
          if (
            typeof window !== "undefined" &&
            targetId &&
            targetId !== "guest_user"
          ) {
            try {
              localStorage.removeItem(`fitora_daily_meals_${targetId}`);
            } catch {}
          }
        }

        if (workoutsRes && workoutsRes.logs) {
          setWorkoutLogs(workoutsRes.logs);
        }
        if (mealChartsRes && mealChartsRes.length > 0) {
          setMealChart(mealChartsRes[0]);
        }
        if (paymentsRes?.data?.activeSubscription) {
          setActiveSubscriptionData(paymentsRes.data.activeSubscription);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        if (!isCancelled) {
          setIsLoadingDailyPlan(false);
          setIsLoadingWorkouts(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [resolvedUserId, userEmail]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
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

  useEffect(() => {
    let cancelled = false;

    const fetchFitnessGoal = async () => {
      const targetUserId =
        authSession?.user?.id || localUser?.id || localUser?._id;

      if (!targetUserId) {
        setFitnessGoalLoading(false);
        return;
      }

      try {
        setFitnessGoalLoading(true);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        const response = await fetch(
          `${apiUrl}/goals/${encodeURIComponent(targetUserId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (cancelled) return;

        if (response.status === 404) {
          setFitnessGoalData(null);
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load fitness goal");
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
  }, [authSession?.user?.id, localUser?.id, localUser?._id]);

  // Dynamic progress calculation

  const currentWeight = Number(localUser?.weight || 0);
  const targetWeight = Number(fitnessGoalData?.goal?.targetWeight || 0);

  const activeStreak = Number(fitnessGoalData?.activeStreak || 0);

  const weeklyWorkoutFrequency = Number(
    fitnessGoalData?.goal?.weeklyWorkoutFrequency || 0,
  );

  const goalType =
    fitnessGoalData?.goal?.goalType || localUser?.fitnessGoal || "Fitness Goal";

  const weightDifference = Math.abs(currentWeight - targetWeight);

  // Progress toward target weight.
  // This keeps the existing UI behavior but makes it API-driven.
  const weightProgress =
    currentWeight > 0 && targetWeight > 0
      ? Math.min(
          100,
          Math.max(
            0,
            100 -
              (weightDifference / Math.max(currentWeight, targetWeight)) * 100,
          ),
        )
      : 0;

  const isGoalReached =
    currentWeight > 0 && targetWeight > 0 && currentWeight === targetWeight;

  const isWeightLoss = currentWeight > targetWeight;

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black py-6 sm:py-8 px-3 sm:px-6 select-none">
      <div className="w-11/12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* ── Page Header (Homepage Style) ── */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            Athlete Profile
          </h1>
          <p
            className="text-white/70 text-xs sm:text-sm leading-relaxed font-medium"
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

        {/* ── Row 1: Top Athlete Cockpit (3-Column Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {/* Card 1: Membership Status Card */}
          <div className="h-full">
            <MembershipStatusCard
              membership={resolvedMembership}
              onRenew={handleOpenRenewModal}
            />
          </div>

          {/* Card 2: Personal Details */}
          <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-full space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-white/60" />
                  <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                    Personal Details
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Full Name</span>
                  <span className="text-white font-bold truncate text-right">
                    {userName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Email Address</span>
                  <span
                    className="text-white font-semibold truncate text-right max-w-[180px] sm:max-w-[200px]"
                    title={userEmail}
                  >
                    {userEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Phone Number</span>
                  <span className="text-white font-semibold truncate text-right">
                    {localUser?.phone || "+880 1700-000000"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Gender</span>
                  <span className="text-white font-semibold truncate text-right">
                    {localUser?.gender || "Male"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">
                    Preferred Branch
                  </span>
                  <span
                    className="text-white font-semibold truncate text-right max-w-[170px] sm:max-w-[190px]"
                    title={
                      localUser?.assignedBranch || "Gulshan-2 Flagship Branch"
                    }
                  >
                    {localUser?.assignedBranch || "Gulshan-2 Flagship Branch"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Edit Profile & Sign Out */}
            <div className="pt-4 border-t border-white/15 flex items-center gap-2.5">
              <Link
                href="/profile/edit"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white text-black border border-white font-bold text-xs px-3.5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all cursor-pointer shadow-lg"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 bg-black text-white border border-white/20 font-bold text-xs px-3.5 py-2.5 rounded-full hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer shadow-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Card 3: Fitness & Physical Profile */}
          <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-full space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-white/60" />
                  <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                    Fitness Profile
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Self-Reported
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Primary Goal</span>
                  <span
                    className="text-white font-bold uppercase truncate text-right max-w-[170px]"
                    title={
                      localUser?.fitnessGoal ||
                      localUser?.plan ||
                      "Bulking & Muscle Gain"
                    }
                  >
                    {localUser?.fitnessGoal ||
                      localUser?.plan ||
                      "Bulking & Muscle Gain"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Body Weight</span>
                  <span className="text-white font-semibold truncate text-right">
                    {localUser?.weight || "74"} kg
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Height</span>
                  <span className="text-white font-semibold truncate text-right">
                    {localUser?.height || "178"} cm
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">Activity Level</span>
                  <span className="text-white font-semibold truncate text-right">
                    {localUser?.activityLevel || "4-5 Days / Week"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/60 shrink-0">
                    Daily Water Target
                  </span>
                  <span className="text-white font-semibold truncate text-right">
                    {goalData.hydration}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button: Recalculate */}
            <div className="pt-4 border-t border-white/15">
              <Link
                href="/calculator"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer shadow-lg group"
              >
                <span>Recalculate Metrics</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Row 2: Health Metrics & Calculation History (2-Column Grid) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Weight & Goal Progress Card (5 cols on lg) */}
          <div className="lg:col-span-5 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-white/60" />
                  <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                    Weight Progress
                  </h2>
                </div>
                <span className="text-xs font-black text-white px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 font-mono">
                  {fitnessGoalLoading
                    ? "..."
                    : `${Math.round(weightProgress)}%`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-neutral-900">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{
                      width: `${weightProgress}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-bold text-white/50 font-mono">
                  <span>
                    Current: {currentWeight > 0 ? `${currentWeight} kg` : "--"}
                  </span>
                  <span>
                    Target: {targetWeight > 0 ? `${targetWeight} kg` : "--"}
                  </span>
                </div>
              </div>

              {/* Milestone Status Box */}
              <div className="rounded-xl border border-white/10 bg-neutral-950 p-3.5">
                {isGoalReached ? (
                  <>
                    <p className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Goal Reached 🎉</span>
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Congratulations! You reached your target weight.
                    </p>
                  </>
                ) : targetWeight > 0 ? (
                  <>
                    <p className="text-xs font-black uppercase text-white">
                      {weightDifference.toFixed(1)} kg{" "}
                      {isWeightLoss ? "remaining to lose" : "remaining to gain"}
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Keep training consistently to reach your target weight.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-black uppercase text-white/70">
                      No Active Goal Set
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Set a target weight in the calculator to track your
                      progress.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/15">
              <Link
                href="/calculator?tab=goals"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer shadow-lg group"
              >
                <span>Adjust Target Weight</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Calculation History Table (7 cols on lg) */}
          <div className="lg:col-span-7 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                    Calculation History
                  </h2>
                </div>
                <span className="text-xs text-white/50 font-medium">
                  {history.length} Records Saved
                </span>
              </div>

              {historyLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                </div>
              ) : historyError ? (
                <div className="p-4 border border-red-500/20 rounded-xl text-center">
                  <p className="text-xs text-red-400">{historyError}</p>
                </div>
              ) : history.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                  <TrendingUp className="w-8 h-8 text-white/20" />
                  <h3 className="text-sm font-black uppercase text-white">
                    No Calculation History
                  </h3>
                  <p className="text-xs text-white/50 max-w-xs">
                    Your BMI, BMR and TDEE calculations will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[190px] overflow-y-auto scrollbar-thin">
                  <table className="w-full min-w-[450px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50">
                        <th className="py-2.5 px-3 font-bold">Date</th>
                        <th className="py-2.5 px-3 font-bold">Weight</th>
                        <th className="py-2.5 px-3 font-bold">BMI</th>
                        <th className="py-2.5 px-3 font-bold">BMR</th>
                        <th className="py-2.5 px-3 font-bold">TDEE</th>
                        <th className="py-2.5 px-3 font-bold text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="py-2.5 px-3 text-white/70">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            {item.weight} kg
                          </td>
                          <td className="py-2.5 px-3 font-black text-white">
                            {item.bmi.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-white/70">
                            {item.bmr}
                          </td>
                          <td className="py-2.5 px-3 text-white/70">
                            {item.tdee}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteHistory(item._id)}
                              className="inline-flex items-center justify-center p-1 rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/15 flex justify-end">
              <Link
                href="/calculator"
                className="text-xs font-bold text-white/70 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Open Calculator</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Activity Heatmap: 12-Month Training Consistency & Streaks ── */}
        <ActivityHeatmap userId={resolvedUserId || "guest_user"} />

        {/* ── Row 3: Gym & Workout History (3-Column Grid) ── */}
        {/* ── Row 3: Live Workout Consistency Streak & Milestone Badges ── */}
        <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] space-y-5">
          <div className="flex items-center justify-between border-b border-white/15 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold uppercase text-white tracking-wide flex items-center gap-2">
                  <span>Workout Consistency Streak</span>
                  {activityStreak?.todayActive && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full lowercase">
                      active today
                    </span>
                  )}
                </h2>
                <p className="text-xs text-white/60">
                  Dynamic telemetry tracked across logged workouts, stopwatch
                  sessions & check-ins
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white text-black font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-lg">
                <Flame className="w-4 h-4 fill-black" />
                <span>
                  {activityStreak?.currentStreak ?? 0} Days Active Streak
                </span>
              </span>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-white/10 bg-neutral-950 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Current Streak
              </p>
              <p className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1.5">
                <span>{activityStreak?.currentStreak ?? 0}</span>
                <span className="text-xs text-white/50 font-sans">days</span>
              </p>
              <p className="text-[10px] text-white/60">
                {activityStreak?.todayActive
                  ? "Streak extended today"
                  : "Log today to maintain"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-neutral-950 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Best Record
              </p>
              <p className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1.5">
                <span>{activityStreak?.longestStreak ?? 0}</span>
                <span className="text-xs text-white/50 font-sans">days</span>
              </p>
              <p className="text-[10px] text-white/60">
                Personal all-time best
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-neutral-950 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Total Active Days
              </p>
              <p className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1.5">
                <span>{activityStreak?.totalActiveDays ?? 0}</span>
                <span className="text-xs text-white/50 font-sans">days</span>
              </p>
              <p className="text-[10px] text-white/60">
                {activityStreak?.totalWorkouts ?? 0} workouts logged
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-neutral-950 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                30-Day Consistency
              </p>
              <p className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1.5">
                <span>{activityStreak?.consistencyScore ?? 0}%</span>
              </p>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${activityStreak?.consistencyScore ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestone Badges Strip */}
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-white/60" />
                <span>Consistency Milestones</span>
              </span>
              {activityStreak?.nextMilestone && (
                <span className="text-xs text-white/60 font-medium">
                  Next:{" "}
                  <span className="text-white font-bold">
                    {activityStreak.nextMilestone.name}
                  </span>{" "}
                  ({activityStreak.nextMilestone.daysLeft} days away)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {activityStreak?.milestones?.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    milestone.achieved
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : "bg-neutral-950 text-white/40 border-white/10"
                  }`}
                  title={`${milestone.name}: ${milestone.targetDays} Days`}
                >
                  <span>{milestone.icon}</span>
                  <span>{milestone.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      milestone.achieved
                        ? "bg-black/15 text-black font-black"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {milestone.targetDays}d
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 4: Gym & Workout History (3-Column Grid) ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dynamic Rendering: Show workouts if they exist, otherwise show Empty State */}
            {isLoadingWorkouts ? (
              <div className="col-span-full bg-black border border-white/20 rounded-2xl p-8 flex justify-center text-white/50 text-sm">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading
                workouts...
              </div>
            ) : workoutLogs && workoutLogs.length > 0 ? (
              workoutLogs.map((log, idx) => (
                <div
                  key={log._id || `workout-log-${idx}`}
                  className="bg-black border border-white/20 hover:border-white/30 rounded-2xl p-4 sm:p-5 transition-all space-y-3.5 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-2 border-b border-white/15 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold uppercase text-white truncate">
                        {log.exerciseName || "Workout"}
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shrink-0">
                        <Clock className="w-3 h-3 text-white/60" />
                        {log.durationMinutes}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>
                        {log.date
                          ? new Date(log.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recently"}
                      </span>
                      {log.weight && log.weight > 0 ? (
                        <span className="font-semibold text-white/80">
                          {log.weight} kg
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                      {log.setsCount} Sets &bull; {log.repsCount} Reps
                    </p>
                    {log.notes && (
                      <div className="flex items-center gap-2 text-xs text-white/80 bg-neutral-950 px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="truncate">{log.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              /* Empty State for Workouts */
              <div className="col-span-full bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
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
        <SavedMealPlan
          dailyPlanMeals={dailyPlanMeals}
          isLoadingDailyPlan={isLoadingDailyPlan}
          targetCalories={
            history?.[0]?.tdee || (localUser as any)?.tdee || 2400
          }
        />

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
      </div>
    </div>
  );
}
