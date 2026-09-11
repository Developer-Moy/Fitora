"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  User,
  Mail,
  MapPin,
  Dumbbell,
  LogOut,
  ShieldCheck,
  Loader2,
  CreditCard,
  QrCode,
  LayoutDashboard,
  Flame,
  Clock,
  CheckCircle,
  Trash2,
  Sparkles,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Phone,
  X,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
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
import { fetchBmiHistory, deleteBmiHistory } from "@/services/bmiService";
import { fetchMealCharts, type MealChart } from "@/services/mealChartService";
import BillingSection from "@/components/profile/BillingSection";
import PersonalizedNutritionPlan from "@/components/profile/PersonalizedNutritionPlan";
import SubscriptionModal from "@/components/home/SubscriptionModal";
import MembershipStatusCard from "@/components/subscription/MembershipStatusCard";
import ActivityHeatmap from "@/components/profile/ActivityHeatmap";
import { FITORA_PLANS, PlanItem } from "@/components/home/PricingSection";
import { type MembershipData, isFreePlan } from "@/lib/membershipUtils";
import MembershipExpiryBanner from "@/components/MembershipExpiryBanner";
import {
  fetchUserActivityStreakApi,
  type UserActivityStreakData,
} from "@/services/activityService";
import { saveCardApi, deleteSavedCardApi } from "@/services/dashboardService";

// ── Types ─────────────────────────────────────────────────────────────────────

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

type Tab = "overview" | "gympass" | "workouts" | "subscription";

// ── Trial Countdown Banner ────────────────────────────────────────────────────

function TrialCountdownBanner({ trialExpiresAt }: { trialExpiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(trialExpiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("expired");
        return;
      }
      const totalH = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      const d = Math.floor(totalH / 24);
      if (d > 0) setTimeLeft(`${d}d ${totalH % 24}h ${m}m`);
      else setTimeLeft(`${totalH}h ${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [trialExpiresAt]);

  if (timeLeft === "expired") return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 px-4 py-3 flex items-center gap-3">
      <Sparkles className="w-4 h-4 text-white shrink-0" />
      <p className="text-sm text-white font-medium">
        🎉 <span className="font-bold">Free Premium Trial</span> active —{" "}
        <span className="font-mono text-white">{timeLeft}</span> remaining.
        Explore all premium features!
      </p>
    </div>
  );
}

// ── Save Card Modal ────────────────────────────────────────────────────────────

function SaveCardModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    cardHolder: "",
    last4: "",
    brand: "Visa",
    expiryMonth: "",
    expiryYear: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.last4.length !== 4 || !/^\d{4}$/.test(form.last4)) {
      toast.error("Last 4 digits must be exactly 4 numbers");
      return;
    }
    setSaving(true);
    const res = await saveCardApi(form);
    setSaving(false);
    if (res.success) {
      toast.success("Card saved! You'll get 2 bonus months on next purchase.");
      onSaved();
      onClose();
    } else {
      toast.error(res.message || "Failed to save card");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-black border border-white/15 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Save Card
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <Sparkles className="inline w-4 h-4 mr-1 text-white" />
          Save your card and get{" "}
          <span className="text-white font-semibold">
            2 bonus months FREE
          </span>{" "}
          on your next monthly purchase (pay 1 month → get 3 months access)!
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Cardholder Name
            </label>
            <input
              required
              value={form.cardHolder}
              onChange={(e) =>
                setForm((p) => ({ ...p, cardHolder: e.target.value }))
              }
              placeholder="Name on card"
              className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Last 4 Digits
              </label>
              <input
                required
                maxLength={4}
                value={form.last4}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    last4: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="1234"
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Brand
              </label>
              <select
                value={form.brand}
                onChange={(e) =>
                  setForm((p) => ({ ...p, brand: e.target.value }))
                }
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40"
              >
                {["Visa", "Mastercard", "Amex", "Other"].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Expiry Month (MM)
              </label>
              <input
                required
                maxLength={2}
                value={form.expiryMonth}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    expiryMonth: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="12"
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Expiry Year (YYYY)
              </label>
              <input
                required
                maxLength={4}
                value={form.expiryYear}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    expiryYear: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="2028"
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl py-2.5 text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {saving ? "Saving…" : "Save Card & Unlock Bonus"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: authSession } = useSession();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // ── Core user state ──
  const [backendUser, setBackendUser] = useState<AuthUser | null>(() =>
    typeof window !== "undefined" ? getAuthSession().user : null,
  );
  const [userLoading, setUserLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // ── Data state ──
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [dailyPlanMeals, setDailyPlanMeals] = useState<SavedMealPlanItem[]>([]);
  const [isLoadingDailyPlan, setIsLoadingDailyPlan] = useState(true);
  const [bmiHistory, setBmiHistory] = useState<BMIHistory[]>([]);
  const [bmiLoading, setBmiLoading] = useState(true);
  const [mealChart, setMealChart] = useState<MealChart | null>(null);
  const [activityStreak, setActivityStreak] =
    useState<UserActivityStreakData | null>(null);
  const [activityStreakLoading, setActivityStreakLoading] = useState(true);
  const [activeSubscriptionData, setActiveSubscriptionData] = useState<{
    planName?: string;
    startDate?: string | Date;
    expiryDate?: string | Date;
    [key: string]: unknown;
  } | null>(null);
  const [membershipBannerData, setMembershipBannerData] = useState<{
    status: "expiring_soon" | "expired" | "no_membership";
    planName: string;
    daysRemaining?: number;
    expiryDate?: string;
  } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewPlan, setRenewPlan] = useState<PlanItem | null>(null);
  const [showSaveCardModal, setShowSaveCardModal] = useState(false);

  // ── Derived ──
  const resolvedUserId =
    authSession?.user?.id ||
    backendUser?.id ||
    backendUser?._id ||
    (typeof window !== "undefined"
      ? (localStorage.getItem("fitora_user_email") ?? undefined)
      : undefined);
  const userEmail =
    backendUser?.email || authSession?.user?.email || "athlete@fitora.com";
  const userName = backendUser?.name || authSession?.user?.name || "Athlete";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = backendUser?.role || "athlete";
  const userPlan = backendUser?.plan || "Free Pass";
  const isPremium =
    userPlan !== "Free Pass" && !userPlan.toLowerCase().includes("free");

  // ── Fetch user from backend ──
  const fetchUser = useCallback(async () => {
    setUserLoading(true);
    const res = await getCurrentUserApi({
      userId: authSession?.user?.id || backendUser?.id || backendUser?._id,
      email: authSession?.user?.email || backendUser?.email,
    });
    if (res.success && res.user) setBackendUser(res.user);
    setUserLoading(false);
  }, [authSession?.user?.id, authSession?.user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const sync = () => {
      const s = getAuthSession();
      if (s.user) setBackendUser(s.user);
    };
    window.addEventListener(AUTH_SESSION_UPDATED, sync);
    return () => window.removeEventListener(AUTH_SESSION_UPDATED, sync);
  }, []);

  // ── QR Code generation ──
  useEffect(() => {
    const qrValue =
      backendUser?.qrCodeId || `FITORA-${backendUser?.email || "member"}`;
    if (typeof window === "undefined") return;
    // Simple QR via API
    setQrDataUrl(
      `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrValue)}&size=200x200&bgcolor=000000&color=ffffff&margin=10`,
    );
  }, [backendUser?.qrCodeId, backendUser?.email]);

  // ── Load all data ──
  useEffect(() => {
    if (!resolvedUserId) return;
    let cancelled = false;

    const load = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("fitora_token") ||
            localStorage.getItem("fitora_auth_token")
          : null;
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      setIsLoadingWorkouts(true);
      setIsLoadingDailyPlan(true);
      setBmiLoading(true);
      setActivityStreakLoading(true);

      const [
        workoutsRes,
        mealsRes,
        mealChartsRes,
        paymentsRes,
        bmiRes,
        streakRes,
      ] = await Promise.allSettled([
        getWorkoutLogs(String(resolvedUserId), 30).catch(() => ({ logs: [] })),
        getDailyMealPlan(String(resolvedUserId)).catch(() => ({
          success: false,
          data: [],
        })),
        fetchMealCharts(String(resolvedUserId)).catch(() => []),
        fetch(
          `${apiUrl}/payments/me?userId=${encodeURIComponent(String(resolvedUserId))}&email=${encodeURIComponent(userEmail)}`,
          { headers },
        )
          .then((r) => (r.ok ? r.json() : { data: { payments: [] } }))
          .catch(() => ({ data: { payments: [] } })),
        fetchBmiHistory(String(resolvedUserId)).catch(() => []),
        fetchUserActivityStreakApi(String(resolvedUserId), userEmail).catch(
          () => null,
        ),
      ]);

      if (cancelled) return;

      if (workoutsRes.status === "fulfilled")
        setWorkoutLogs(workoutsRes.value?.logs || []);
      setIsLoadingWorkouts(false);

      if (mealsRes.status === "fulfilled") {
        const d = mealsRes.value;
        setDailyPlanMeals(d.success && Array.isArray(d.data) ? d.data : []);
      }
      setIsLoadingDailyPlan(false);

      if (
        mealChartsRes.status === "fulfilled" &&
        (mealChartsRes.value as MealChart[])?.length > 0
      )
        setMealChart((mealChartsRes.value as MealChart[])[0]);

      if (paymentsRes.status === "fulfilled") {
        const p = paymentsRes.value as any;
        if (p?.data?.activeSubscription)
          setActiveSubscriptionData(p.data.activeSubscription);
      }

      if (bmiRes.status === "fulfilled")
        setBmiHistory(
          Array.isArray(bmiRes.value) ? (bmiRes.value as BMIHistory[]) : [],
        );
      setBmiLoading(false);

      if (streakRes.status === "fulfilled")
        setActivityStreak(streakRes.value as UserActivityStreakData);
      setActivityStreakLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [resolvedUserId, userEmail]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Membership banner ──
  useEffect(() => {
    const plan = backendUser?.plan || "Free Pass";
    const rawExpiry =
      backendUser?.membershipExpiresAt || backendUser?.subscriptionExpiryDate;
    const freeTier =
      !plan || plan === "Free Pass" || plan.toLowerCase().includes("free");
    if (freeTier || !rawExpiry) {
      setMembershipBannerData({ status: "no_membership", planName: plan });
      return;
    }
    const exp = new Date(String(rawExpiry)).getTime();
    const now = Date.now();
    const diff = exp - now;
    const formatted = new Date(String(rawExpiry)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (diff <= 0)
      setMembershipBannerData({
        status: "expired",
        planName: plan,
        expiryDate: formatted,
      });
    else if (diff <= 7 * 86_400_000)
      setMembershipBannerData({
        status: "expiring_soon",
        planName: plan,
        daysRemaining: Math.max(1, Math.ceil(diff / 86_400_000)),
        expiryDate: formatted,
      });
    else setMembershipBannerData(null);
  }, [
    backendUser?.plan,
    backendUser?.membershipExpiresAt,
    backendUser?.subscriptionExpiryDate,
  ]);

  // ── Workout event sync ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      if (!resolvedUserId) return;
      getWorkoutLogs(String(resolvedUserId), 30)
        .then((r) => setWorkoutLogs(r?.logs || []))
        .catch(() => {});
    };
    window.addEventListener("fitora-workout-logged", handler);
    return () => window.removeEventListener("fitora-workout-logged", handler);
  }, [resolvedUserId]);

  // ── Handlers ──
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    toast.success("Logged out. See you soon! 👋");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  };

  const handleDeleteBmi = async (id: string) => {
    const ok = await deleteBmiHistory(id);
    if (ok) {
      setBmiHistory((prev) => prev.filter((h) => h._id !== id));
      toast.success("BMI record deleted");
    } else toast.error("Failed to delete");
  };

  const handleDeleteCard = async () => {
    if (!confirm("Remove saved card?")) return;
    const res = await deleteSavedCardApi();
    if (res.success) {
      toast.success("Card removed");
      await fetchUser();
    } else toast.error(res.message || "Failed to remove card");
  };

  const handleOpenRenew = () => {
    const key =
      activeSubscriptionData?.planName || backendUser?.plan || "Pro Athlete";
    const found =
      FITORA_PLANS.find(
        (p) =>
          p.name.toLowerCase() === key.toLowerCase() ||
          p.planKey.toLowerCase() === key.toLowerCase(),
      ) || FITORA_PLANS[1];
    setRenewPlan(found);
    setIsRenewModalOpen(true);
  };

  const resolvedMembership: MembershipData = (() => {
    const planName =
      activeSubscriptionData?.planName || backendUser?.plan || "Free Pass";
    const startDate =
      activeSubscriptionData?.startDate || backendUser?.createdAt || null;
    const expiryDate =
      activeSubscriptionData?.expiryDate ||
      backendUser?.subscriptionExpiryDate ||
      backendUser?.membershipExpiresAt ||
      null;
    if (isFreePlan(planName))
      return { planName, startDate: null, expiryDate: null };
    if (expiryDate) return { planName, startDate, expiryDate };
    const fb = new Date();
    fb.setDate(fb.getDate() + 30);
    return { planName, startDate: startDate || new Date(), expiryDate: fb };
  })();

  const currentGoalKey =
    mealChart?.goals?.fitnessGoal ||
    backendUser?.fitnessGoal ||
    "Bulking & Muscle Gain";

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: "gympass",
      label: "Gym Pass & QR",
      icon: <QrCode className="w-4 h-4" />,
    },
    {
      key: "workouts",
      label: "Workouts & Nutrition",
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      key: "subscription",
      label: "Subscription & Card",
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {membershipBannerData && (
        <MembershipExpiryBanner
          status={membershipBannerData.status}
          planName={membershipBannerData.planName}
          daysRemaining={membershipBannerData.daysRemaining}
          expiryDate={membershipBannerData.expiryDate}
          onAction={handleOpenRenew}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Trial banner */}
        {backendUser?.isTrialActive && backendUser.trialExpiresAt && (
          <TrialCountdownBanner trialExpiresAt={backendUser.trialExpiresAt} />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black overflow-hidden">
              {backendUser?.avatarUrl ? (
                <img
                  src={backendUser.avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{userName}</h1>
              <p className="text-sm text-white/50 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {userEmail}
              </p>
              {backendUser?.assignedBranch && (
                <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {backendUser.assignedBranch}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-3 py-1 rounded-full border font-semibold ${isPremium ? "border-white/30 text-white bg-white/10" : "border-white/10 text-white/50"}`}
            >
              {userPlan}
            </span>
            {(userRole === "master_admin" || userRole === "branch_admin") && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/10 scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.key ? "bg-white text-black" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">
                  Activity Streak
                </h3>
              </div>
              {activityStreakLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              ) : (
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white">
                    {activityStreak?.currentStreak ??
                      backendUser?.attendanceStreakDays ??
                      0}
                    <span className="text-base font-normal text-white/40 ml-1">
                      days
                    </span>
                  </p>
                  {activityStreak?.longestStreak != null && (
                    <p className="text-xs text-white/40">
                      Best: {activityStreak.longestStreak} days
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">
                  Hydration Target
                </h3>
              </div>
              <p className="text-4xl font-black text-white">
                {backendUser?.hydrationTargetLiters ?? 3.5}
                <span className="text-base font-normal text-white/40 ml-1">
                  L / day
                </span>
              </p>
              <p className="text-xs text-white/40">
                Daily goal from your health profile
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Quick Info</h3>
              </div>
              <div className="space-y-2 text-sm">
                {backendUser?.phone && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{backendUser.phone}</span>
                  </div>
                )}
                {backendUser?.fitnessGoal && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>{backendUser.fitnessGoal}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/60">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="capitalize">
                    {userRole.replace("_", " ")}
                  </span>
                </div>
                {backendUser?.totalPaidBDT != null &&
                  backendUser.totalPaidBDT > 0 && (
                    <div className="flex items-center gap-2 text-white/60">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        Total paid: ৳{backendUser.totalPaidBDT.toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <ActivityHeatmap
                userId={resolvedUserId ? String(resolvedUserId) : undefined}
              />
            </div>
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-semibold text-white">
                    BMI History
                  </h3>
                </div>
                <Link
                  href="/bmi-calculator"
                  className="text-xs px-3 py-1 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  + New Calc
                </Link>
              </div>
              {bmiLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              ) : bmiHistory.length === 0 ? (
                <p className="text-sm text-white/40">
                  No BMI calculations yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-white/30 border-b border-white/5">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">BMI</th>
                        <th className="py-2 pr-4">Weight</th>
                        <th className="py-2 pr-4">BMR</th>
                        <th className="py-2 pr-4">TDEE</th>
                        <th className="py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {bmiHistory.slice(0, 10).map((b) => (
                        <tr
                          key={b._id}
                          className="border-b border-white/5 text-white/60"
                        >
                          <td className="py-1.5 pr-4">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-1.5 pr-4 font-mono">
                            {b.bmi.toFixed(1)}
                          </td>
                          <td className="py-1.5 pr-4">{b.weight} kg</td>
                          <td className="py-1.5 pr-4">
                            {Math.round(b.bmr)} kcal
                          </td>
                          <td className="py-1.5 pr-4">
                            {Math.round(b.tdee)} kcal
                          </td>
                          <td className="py-1.5">
                            <button
                              onClick={() => handleDeleteBmi(b._id)}
                              className="text-white/30 hover:text-white/70 transition-colors"
                              aria-label="Delete"
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
          </div>
        )}

        {/* ── TAB 2: GYM PASS & QR ── */}
        {activeTab === "gympass" && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">
                    Fitora
                  </p>
                  <p className="text-lg font-black text-white">Member Pass</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${isPremium ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-white/40"}`}
                >
                  {userPlan}
                </span>
              </div>
              <div className="flex justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Gym entry QR code"
                    className="w-44 h-44 rounded-xl border border-white/10"
                  />
                ) : (
                  <div className="w-44 h-44 rounded-xl border border-white/10 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                  </div>
                )}
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-white/40">{userEmail}</p>
                {backendUser?.assignedBranch && (
                  <p className="text-xs text-white/30 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> {backendUser.assignedBranch}
                  </p>
                )}
              </div>
              {backendUser?.qrCodeId && (
                <div className="text-center">
                  <p className="text-xs font-mono text-white/30 tracking-wider">
                    {backendUser.qrCodeId}
                  </p>
                </div>
              )}
              {(backendUser?.membershipExpiresAt ||
                backendUser?.subscriptionExpiryDate) && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-white/40">
                  <Calendar className="w-3.5 h-3.5" />
                  Valid until:{" "}
                  {new Date(
                    String(
                      backendUser.membershipExpiresAt ||
                        backendUser.subscriptionExpiryDate,
                    ),
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-white/30 text-center max-w-xs">
              Show this QR code at the gym entrance for contactless check-in.
              The code is linked to your account.
            </p>
            {!activityStreakLoading && (
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Flame className="w-4 h-4 text-white" />
                <span>
                  Current streak:{" "}
                  <strong className="text-white">
                    {activityStreak?.currentStreak ??
                      backendUser?.attendanceStreakDays ??
                      0}
                  </strong>{" "}
                  days
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: WORKOUTS & NUTRITION ── */}
        {activeTab === "workouts" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-semibold text-white">
                    Workout History
                  </h3>
                </div>
                <Link
                  href="/workouts"
                  className="text-xs px-3 py-1 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  + Log Workout
                </Link>
              </div>
              {isLoadingWorkouts ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              ) : workoutLogs.length === 0 ? (
                <p className="text-sm text-white/40">
                  No workouts logged yet. Start your first session!
                </p>
              ) : (
                <div className="space-y-2">
                  {workoutLogs.slice(0, 10).map((log) => (
                    <div
                      key={log._id}
                      className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {log.exerciseName || "Workout"}
                        </p>
                        <p className="text-xs text-white/40">
                          {new Date(
                            log.date || log.createdAt || Date.now(),
                          ).toLocaleDateString()}
                          {log.durationMinutes
                            ? ` · ${log.durationMinutes} min`
                            : ""}
                          {log.caloriesBurned
                            ? ` · ${log.caloriesBurned} kcal`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-white/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          {log.durationMinutes
                            ? `${log.durationMinutes}m`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <PersonalizedNutritionPlan
              user={backendUser}
              fitnessGoal={currentGoalKey}
            />
            {isLoadingDailyPlan ? (
              <Loader2 className="w-5 h-5 animate-spin text-white/40" />
            ) : (
              <SavedMealPlan
                meals={dailyPlanMeals}
                isLoading={isLoadingDailyPlan}
              />
            )}
          </div>
        )}

        {/* ── TAB 4: SUBSCRIPTION & CARD ── */}
        {activeTab === "subscription" && (
          <div className="space-y-5">
            {!backendUser?.isTrialActive && !isPremium && (
              <div className="rounded-xl border border-white/15 bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Upgrade to Premium
                  </p>
                  <p className="text-xs text-white/50">
                    Save your card and buy 1 month → get{" "}
                    <span className="text-white font-semibold">
                      3 months total
                    </span>{" "}
                    (2 bonus months FREE)!
                  </p>
                </div>
                <button
                  onClick={handleOpenRenew}
                  className="shrink-0 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            )}
            <MembershipStatusCard
              membership={resolvedMembership}
              onRenew={handleOpenRenew}
            />
            <BillingSection />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Saved Card</h3>
              </div>
              {backendUser?.hasSavedCard && backendUser.savedCard ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">
                        {backendUser.savedCard.brand} ····{" "}
                        {backendUser.savedCard.last4}
                      </p>
                      <p className="text-xs text-white/40">
                        {backendUser.savedCard.cardHolder} · Exp{" "}
                        {backendUser.savedCard.expiryMonth}/
                        {backendUser.savedCard.expiryYear}
                      </p>
                      <p className="text-xs text-white/30">
                        Saved{" "}
                        {new Date(
                          backendUser.savedCard.savedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteCard}
                      className="text-white/30 hover:text-white/70 transition-colors p-2"
                      aria-label="Remove card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {backendUser.bonusMonthsAwarded != null &&
                    backendUser.bonusMonthsAwarded > 0 && (
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                        <span>
                          {backendUser.bonusMonthsAwarded} bonus month
                          {backendUser.bonusMonthsAwarded > 1 ? "s" : ""}{" "}
                          already awarded 🎉
                        </span>
                      </div>
                    )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-white/40">
                    No card saved yet.{" "}
                    <span className="text-white">
                      Save now and get 2 bonus months FREE
                    </span>{" "}
                    on your next monthly subscription purchase!
                  </p>
                  <button
                    onClick={() => setShowSaveCardModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-white/60 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Save a Card
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isRenewModalOpen && renewPlan && (
        <SubscriptionModal
          plan={renewPlan}
          isOpen={isRenewModalOpen}
          isAnnual={false}
          onClose={() => setIsRenewModalOpen(false)}
          onSuccess={() => {
            setIsRenewModalOpen(false);
            toast.success("🎉 Membership updated!");
            setTimeout(() => window.location.reload(), 800);
          }}
        />
      )}
      {showSaveCardModal && (
        <SaveCardModal
          onClose={() => setShowSaveCardModal(false)}
          onSaved={fetchUser}
        />
      )}
    </div>
  );
}
