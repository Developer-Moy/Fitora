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
  Loader2,
  CreditCard,
  QrCode,
  Flame,
  Clock,
  CheckCircle,
  Trash2,
  Sparkles,
  TrendingUp,
  X,
  Plus,
  ArrowUpRight,
  Utensils,
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

interface FitnessGoalResponse {
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
}

type SubmenuTab = "overview" | "workouts" | "nutrition" | "billing";

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
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 px-5 py-3.5 flex items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-white shrink-0 animate-pulse" />
        <p className="text-sm text-white font-medium">
          🎉 <span className="font-bold">Free Premium Trial Active</span> —{" "}
          <span className="font-mono font-bold text-white">{timeLeft}</span>{" "}
          remaining. Enjoy all Pro athlete perks, QR turnstile access, and macro
          tracking!
        </p>
      </div>
      <Link
        href="/#pricing"
        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors shrink-0"
      >
        <span>Upgrade Now</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
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
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [saving, setSaving] = useState(false);

  const detectBrand = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    return "Card";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = form.cardNumber.replace(/\D/g, "");
    if (cleanNum.length < 13) {
      toast.error("Enter a valid card number");
      return;
    }
    const m = parseInt(form.expiryMonth, 10);
    const y = parseInt(form.expiryYear, 10);
    if (!m || m < 1 || m > 12) {
      toast.error("Valid month: 1–12");
      return;
    }
    if (!y || y < new Date().getFullYear()) {
      toast.error("Valid expiry year required");
      return;
    }
    setSaving(true);
    try {
      const res = await saveCardApi({
        last4: cleanNum.slice(-4),
        brand: detectBrand(cleanNum),
        expiryMonth: String(m).padStart(2, "0"),
        expiryYear: String(y),
        cardHolder: form.cardHolder.trim() || "Card Holder",
      });
      if (res.success) {
        toast.success(
          "💳 Card saved successfully! 2 bonus months unlocked on your next monthly purchase.",
        );
        onSaved();
        onClose();
      } else {
        toast.error(res.message || "Failed to save card");
      }
    } catch {
      toast.error("Network error saving card");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-neutral-950 p-6 space-y-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-white" /> Save Payment Card
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Save your credit/debit card for fast 1-click renewals.{" "}
            <span className="text-white font-semibold">
              Get 2 bonus months FREE
            </span>{" "}
            when you renew!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-white/60 mb-1">
              Card Number
            </label>
            <input
              required
              maxLength={19}
              value={form.cardNumber}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  cardNumber: e.target.value
                    .replace(/\D/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim(),
                }))
              }
              placeholder="4242 •••• •••• 4242"
              className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-white/60 mb-1">
              Cardholder Name
            </label>
            <input
              required
              value={form.cardHolder}
              onChange={(e) =>
                setForm((p) => ({ ...p, cardHolder: e.target.value }))
              }
              placeholder="e.g. John Doe"
              className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-white/60 mb-1">
                Expiry Month
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
                placeholder="MM (e.g. 08)"
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-white/60 mb-1">
                Expiry Year
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
                placeholder="YYYY (e.g. 2028)"
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl py-2.5 text-sm font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {saving ? "Saving…" : "Save Card & Unlock +2 Bonus Months"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: authSession } = useSession();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // ── Core User State ──
  const [backendUser, setBackendUser] = useState<AuthUser | null>(() =>
    typeof window !== "undefined" ? getAuthSession().user : null,
  );
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuTab>("overview");

  // ── Data State ──
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
  const [fitnessGoalData, setFitnessGoalData] =
    useState<FitnessGoalResponse | null>(null);
  const [fitnessGoalLoading, setFitnessGoalLoading] = useState(true);

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

  // ── Derived Identifiers ──
  // ── Active Identity Reconciliation ──
  // If the user is logged in via authSession, prioritize authSession's active credentials.
  // Stale cached backendUser from a previous session must never override the currently active session!
  const activeAuthEmail =
    authSession?.user?.email ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_user_email") || ""
      : "");

  const isBackendMatching =
    backendUser &&
    activeAuthEmail &&
    backendUser.email?.toLowerCase().trim() ===
      activeAuthEmail.toLowerCase().trim();

  const effectiveUser = isBackendMatching
    ? backendUser
    : backendUser && !activeAuthEmail
      ? backendUser
      : null;

  const resolvedUserId =
    effectiveUser?.id ||
    effectiveUser?._id ||
    authSession?.user?.id ||
    (typeof window !== "undefined"
      ? (localStorage.getItem("fitora_user_email") ?? undefined)
      : undefined);

  const userEmail =
    activeAuthEmail || effectiveUser?.email || "athlete@fitora.com";
  const userName =
    effectiveUser?.name ||
    authSession?.user?.name ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fitora_user_name") || ""
      : "") ||
    "Athlete";
  const userInitial = userName.charAt(0).toUpperCase() || "A";
  const userPlan = effectiveUser?.plan || "Free Pass";
  const isPremium =
    userPlan !== "Free Pass" && !userPlan.toLowerCase().includes("free");

  const [avatarError, setAvatarError] = useState(false);
  const userAvatar =
    effectiveUser?.avatarUrl ||
    effectiveUser?.image ||
    (authSession?.user as any)?.image ||
    (authSession?.user as any)?.avatarUrl ||
    (typeof window !== "undefined"
      ? (() => {
          try {
            const u = JSON.parse(localStorage.getItem("fitora_user") || "{}");
            if (
              !activeAuthEmail ||
              (u.email &&
                u.email.toLowerCase().trim() ===
                  activeAuthEmail.toLowerCase().trim())
            ) {
              return u.avatarUrl || u.image || "";
            }
            return "";
          } catch {
            return "";
          }
        })()
      : "");

  useEffect(() => {
    setAvatarError(false);
  }, [userAvatar]);

  // ── Fetch User Profile from Backend ──
  const fetchUser = useCallback(async () => {
    const session = getAuthSession();
    const targetEmail =
      authSession?.user?.email ||
      (typeof window !== "undefined"
        ? localStorage.getItem("fitora_user_email") || ""
        : "") ||
      session.user?.email ||
      backendUser?.email;

    const targetUserId =
      authSession?.user?.id ||
      session.user?.id ||
      session.user?._id ||
      backendUser?.id ||
      backendUser?._id;

    if (!targetUserId && !targetEmail && !session.token) return;

    const res = await getCurrentUserApi({
      userId: targetUserId,
      email: targetEmail,
      name: authSession?.user?.name || session.user?.name,
      image: (authSession?.user as any)?.image || session.user?.avatarUrl,
      avatarUrl: (authSession?.user as any)?.image || session.user?.avatarUrl,
    });

    if (res.success && res.user) {
      setBackendUser(res.user);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("fitora_user", JSON.stringify(res.user));
          if (res.user.email) {
            localStorage.setItem("fitora_user_email", res.user.email);
          }
          if (res.user.name) {
            localStorage.setItem("fitora_user_name", res.user.name);
          }
          if (res.user.role) {
            localStorage.setItem("fitora_user_role", res.user.role);
            localStorage.setItem("fitora_active_role", res.user.role);
          }
          if (res.user.plan) {
            localStorage.setItem("fitora_user_plan", res.user.plan);
          }
        } catch {}
      }
    }
  }, [
    authSession?.user?.id,
    authSession?.user?.email,
    authSession?.user?.name,
  ]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const sync = () => {
      const s = getAuthSession();
      if (s.user) setBackendUser(s.user);
    };
    window.addEventListener(AUTH_SESSION_UPDATED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_SESSION_UPDATED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // ── QR Code Generation ──
  useEffect(() => {
    const qrValue =
      backendUser?.qrCodeId || `FITORA-${backendUser?.email || "member"}`;
    if (typeof window === "undefined") return;
    setQrDataUrl(
      `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrValue)}&size=200x200&bgcolor=000000&color=ffffff&margin=10`,
    );
  }, [backendUser?.qrCodeId, backendUser?.email]);

  // ── Load All Dynamic Profile Data ──
  useEffect(() => {
    if (!resolvedUserId) return;
    let cancelled = false;

    const loadData = async () => {
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
      setFitnessGoalLoading(true);

      const [
        workoutsRes,
        mealsRes,
        mealChartsRes,
        paymentsRes,
        bmiRes,
        streakRes,
        goalRes,
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
        fetch(`${apiUrl}/goals/${encodeURIComponent(String(resolvedUserId))}`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
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

      if (
        goalRes.status === "fulfilled" &&
        goalRes.value?.success &&
        goalRes.value?.data
      ) {
        setFitnessGoalData(goalRes.value.data);
      } else {
        setFitnessGoalData(null);
      }
      setFitnessGoalLoading(false);
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [resolvedUserId, userEmail]);

  // ── Membership Expiry Banner Evaluation ──
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

  // ── Event Listener for Workout Log Sync ──
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
    toast.success("Logged out successfully. Keep training, Champion! 👋");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  };

  const handleDeleteBmi = async (id: string) => {
    const ok = await deleteBmiHistory(id);
    if (ok) {
      setBmiHistory((prev) => prev.filter((h) => h._id !== id));
      toast.success("Calculation record removed");
    } else toast.error("Failed to delete record");
  };

  const handleDeleteCard = async () => {
    if (!confirm("Remove this saved card from your account?")) return;
    const res = await deleteSavedCardApi();
    if (res.success) {
      toast.success("Card removed successfully");
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
      activeSubscriptionData?.planName || effectiveUser?.plan || "Free Pass";
    const startDate =
      activeSubscriptionData?.startDate || effectiveUser?.createdAt || null;
    const expiryDate =
      activeSubscriptionData?.expiryDate ||
      effectiveUser?.subscriptionExpiryDate ||
      effectiveUser?.membershipExpiresAt ||
      null;
    if (isFreePlan(planName))
      return { planName, startDate: null, expiryDate: null };
    if (expiryDate) return { planName, startDate, expiryDate };
    const fb = new Date();
    fb.setDate(fb.getDate() + 30);
    return { planName, startDate: startDate || new Date(), expiryDate: fb };
  })();

  const currentGoalKey =
    effectiveUser?.fitnessGoal ||
    mealChart?.goals?.fitnessGoal ||
    "Bulking & Muscle Gain";

  // ── Dynamic Weight & Goal Progress Calculations ──
  const currentWeight = Number(effectiveUser?.weight || 0);
  const targetWeight = Number(
    effectiveUser?.targetWeight || fitnessGoalData?.goal?.targetWeight || 0,
  );
  const weightDifference = Math.abs(currentWeight - targetWeight);
  const isWeightLoss = currentWeight > targetWeight;
  const isGoalReached =
    currentWeight > 0 && targetWeight > 0 && currentWeight === targetWeight;

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

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black py-6 sm:py-8 px-3 sm:px-6 select-none">
      <div className="w-11/12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* ── Expiry / Action Alert Banner ── */}
        {membershipBannerData && (
          <MembershipExpiryBanner
            status={membershipBannerData.status}
            planName={membershipBannerData.planName}
            daysRemaining={membershipBannerData.daysRemaining}
            expiryDate={membershipBannerData.expiryDate}
            onAction={handleOpenRenew}
          />
        )}

        {/* ── 3-Day Free Trial Countdown Banner ── */}
        {backendUser?.isTrialActive && backendUser.trialExpiresAt && (
          <TrialCountdownBanner trialExpiresAt={backendUser.trialExpiresAt} />
        )}

        {/* ── Athlete Profile Header (No Dashboard Route, Clean Profile Only) ── */}
        <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col md:flex-row md:items-center md:justify-between gap-5 h-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/25 flex items-center justify-center text-2xl font-black overflow-hidden shrink-0 shadow-inner">
              {userAvatar && !avatarError ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white">{userInitial}</span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  {userName}
                </h1>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${
                    isPremium
                      ? "bg-white text-black border-white"
                      : "bg-white/10 text-white/70 border-white/20"
                  }`}
                >
                  {userPlan}
                </span>
                {effectiveUser?.isTrialActive && (
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pro Trial
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-white/40" /> {userEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/40" />{" "}
                  {effectiveUser?.assignedBranch ||
                    "Dhaka • Gulshan-2 Branch (Flagship)"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/profile/edit"
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-black hover:bg-white transition-all cursor-pointer shadow-sm"
            >
              <span>Edit Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ── Submenu Navigation (Clean Sections, No All Overview) ── */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
          {[
            {
              key: "overview",
              label: "Overview & Biometrics",
              icon: <User className="w-4 h-4" />,
            },
            {
              key: "workouts",
              label: "Workouts & Gym Pass",
              icon: <Dumbbell className="w-4 h-4" />,
            },
            {
              key: "nutrition",
              label: "Nutrition & Meal Plan",
              icon: <Utensils className="w-4 h-4" />,
            },
            {
              key: "billing",
              label: "Billing & Cards",
              icon: <CreditCard className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubmenu(tab.key as SubmenuTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeSubmenu === tab.key
                  ? "bg-white text-black border-white shadow-lg scale-[1.01]"
                  : "bg-black text-white/60 border-white/15 hover:border-white/40 hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SUBMENU 1: OVERVIEW & BIOMETRICS
           ══════════════════════════════════════════════════════════════════════ */}
        {activeSubmenu === "overview" && (
          <div className="space-y-6">
            {/* Row 1: 3-Column Cockpit Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
              {/* Card 1: Membership Status Card */}
              <div className="h-auto">
                <MembershipStatusCard
                  membership={resolvedMembership}
                  onRenew={handleOpenRenew}
                />
              </div>

              {/* Card 2: Personal Details & Biometrics */}
              <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-auto space-y-5">
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
                      <span className="text-white/60 shrink-0">Email</span>
                      <span className="text-white font-semibold truncate text-right">
                        {userEmail}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 shrink-0">Phone</span>
                      <span className="text-white font-semibold truncate text-right">
                        {effectiveUser?.phone || "Not linked"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 shrink-0">Gender</span>
                      <span className="text-white font-semibold truncate text-right capitalize">
                        {effectiveUser?.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 shrink-0">
                        Body Weight
                      </span>
                      <span className="text-white font-semibold truncate text-right">
                        {effectiveUser?.weight
                          ? `${effectiveUser.weight} kg`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 shrink-0">Height</span>
                      <span className="text-white font-semibold truncate text-right">
                        {effectiveUser?.height
                          ? `${effectiveUser.height} cm`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 shrink-0">
                        Activity Level
                      </span>
                      <span className="text-white font-semibold truncate text-right">
                        {effectiveUser?.activityLevel ||
                          "Moderate (3-4 days/week)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 shrink-0">
                        Daily Water Target
                      </span>
                      <span className="text-white font-semibold truncate text-right">
                        {effectiveUser?.hydrationTargetLiters
                          ? `${effectiveUser.hydrationTargetLiters} L / Day`
                          : "3.0 L / Day"}
                      </span>
                    </div>
                  </div>
                </div>

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

              {/* Card 3: Consistency Streak */}
              <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-auto space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-white" />
                      <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                        Consistency Streak
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                      Live Score
                    </span>
                  </div>

                  {activityStreakLoading ? (
                    <div className="py-6 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-black text-white">
                          {activityStreak?.currentStreak ??
                            effectiveUser?.attendanceStreakDays ??
                            0}
                        </span>
                        <span className="text-sm font-semibold uppercase text-white/60">
                          Consecutive Days
                        </span>
                      </div>

                      <p className="text-xs text-white/60 leading-relaxed">
                        {activityStreak?.longestStreak != null &&
                        activityStreak.longestStreak > 0
                          ? `Personal record: ${activityStreak.longestStreak} days uninterrupted training streak.`
                          : "Check in via the gym turnstile or log a workout session to build your streak!"}
                      </p>

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between text-xs text-white/70">
                        <span>Consistency Rating</span>
                        <span className="font-mono font-bold text-white">
                          {(activityStreak?.currentStreak ?? 0) > 5
                            ? "Elite Athlete ⚡"
                            : "Active Member"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/15">
                  <Link
                    href="/stopwatch"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer shadow-lg group"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Start Live Workout Session</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 2: 2-Column Grid (Weight Progress + Calculation History) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              {/* Weight Progress & Milestone (5 cols on lg) */}
              <div className="lg:col-span-5 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-auto space-y-4">
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

                  <div className="space-y-2">
                    <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-neutral-900">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-700"
                        style={{ width: `${weightProgress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-bold text-white/50 font-mono">
                      <span>
                        Current:{" "}
                        {currentWeight > 0 ? `${currentWeight} kg` : "--"}
                      </span>
                      <span>
                        Target: {targetWeight > 0 ? `${targetWeight} kg` : "--"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-neutral-950 p-3.5">
                    {isGoalReached ? (
                      <>
                        <p className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Goal Reached 🎉</span>
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          Outstanding! You reached your target body weight.
                        </p>
                      </>
                    ) : targetWeight > 0 ? (
                      <>
                        <p className="text-xs font-black uppercase text-white">
                          {weightDifference.toFixed(1)} kg{" "}
                          {isWeightLoss
                            ? "remaining to shed"
                            : "remaining to gain"}
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          Stay disciplined with nutrition and workout routines.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-black uppercase text-white/70">
                          No Target Goal Set
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          Set your target body weight in the calculator to track
                          daily progress.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15">
                  <Link
                    href="/calculator"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer shadow-lg group"
                  >
                    <span>Adjust Target Weight</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Calculation History Table (7 cols on lg) */}
              <div className="lg:col-span-7 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-auto space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/60" />
                      <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                        Calculation History
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 font-medium">
                        {bmiHistory.length} Records Saved
                      </span>
                      <Link
                        href="/calculator"
                        className="text-xs px-2.5 py-0.5 rounded-full border border-white/20 text-white/70 hover:text-black hover:bg-white transition-all cursor-pointer"
                      >
                        + New
                      </Link>
                    </div>
                  </div>

                  {bmiLoading ? (
                    <div className="py-8 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                    </div>
                  ) : bmiHistory.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                      <TrendingUp className="w-8 h-8 text-white/20" />
                      <h3 className="text-sm font-black uppercase text-white">
                        No Calculation History
                      </h3>
                      <p className="text-xs text-white/50 max-w-xs">
                        Your saved BMI, BMR, and TDEE calculations will appear
                        here.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-white/40 border-b border-white/10 uppercase tracking-wider text-[10px]">
                            <th className="py-2 pr-3">Date</th>
                            <th className="py-2 pr-3">BMI</th>
                            <th className="py-2 pr-3">Weight</th>
                            <th className="py-2 pr-3">BMR</th>
                            <th className="py-2 pr-3">TDEE</th>
                            <th className="py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bmiHistory.slice(0, 5).map((b) => (
                            <tr
                              key={b._id}
                              className="border-b border-white/5 text-white/70 hover:text-white transition-colors"
                            >
                              <td className="py-2 pr-3">
                                {new Date(b.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </td>
                              <td className="py-2 pr-3 font-mono font-bold text-white">
                                {b.bmi.toFixed(1)}
                              </td>
                              <td className="py-2 pr-3">{b.weight} kg</td>
                              <td className="py-2 pr-3">
                                {Math.round(b.bmr)} kcal
                              </td>
                              <td className="py-2 pr-3">
                                {Math.round(b.tdee)} kcal
                              </td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => handleDeleteBmi(b._id)}
                                  className="text-white/30 hover:text-red-400 transition-colors p-1 cursor-pointer"
                                  aria-label="Delete calculation"
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

                <div className="pt-3 border-t border-white/15">
                  <Link
                    href="/calculator"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer shadow-lg group"
                  >
                    <span>Open Full BMI & Macro Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SUBMENU 2: WORKOUTS & GYM PASS
           ══════════════════════════════════════════════════════════════════════ */}
        {activeSubmenu === "workouts" && (
          <div className="space-y-6">
            {/* Row 1: 365-Day Heatmap (8 cols) + Digital Gym Pass (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              <div className="lg:col-span-8 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] h-auto">
                <ActivityHeatmap
                  userId={resolvedUserId ? String(resolvedUserId) : undefined}
                />
              </div>

              <div className="lg:col-span-4 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between space-y-4 h-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-white" />
                      <h3 className="text-sm font-extrabold uppercase text-white tracking-wide">
                        Digital Gym Pass
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono">
                      {userPlan}
                    </span>
                  </div>

                  <div className="flex justify-center p-2">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Gym turnstile entry QR"
                        className="w-40 h-40 rounded-xl border border-white/20 bg-white p-1.5 shadow-md"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-xl border border-white/20 flex items-center justify-center bg-white/5">
                        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-xs font-mono text-white/60 tracking-wider">
                      {backendUser?.qrCodeId ||
                        `FITORA-${resolvedUserId ? String(resolvedUserId).slice(-6) : "PASS"}`}
                    </p>
                    <p className="text-[11px] text-white/40">
                      Scan at turnstile for instant contactless gym entry
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15 text-center">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Turnstile Sync
                    Active (64 Branches)
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Gym & Workout History */}
            <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] space-y-5 h-auto">
              <div className="flex items-center justify-between border-b border-white/20 pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <Dumbbell className="w-5 h-5 text-white" />
                  <div>
                    <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wide">
                      Gym & Workout History
                    </h2>
                    <p className="text-xs text-white/50">
                      Track logged workout sets, repetitions, weights, and rest
                      intervals
                    </p>
                  </div>
                </div>
                <Link
                  href="/stopwatch"
                  className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Start Stopwatch HUD</span>
                </Link>
              </div>

              {isLoadingWorkouts ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white/40" />
                </div>
              ) : workoutLogs.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <Dumbbell className="w-10 h-10 text-white/20" />
                  <h3 className="text-base font-black uppercase text-white">
                    No Workouts Logged Yet
                  </h3>
                  <p className="text-xs text-white/50 max-w-sm">
                    Your training history is currently clear. Fire up the Live
                    Workout Stopwatch to record your sets!
                  </p>
                  <Link
                    href="/stopwatch"
                    className="mt-2 inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Start First Session</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workoutLogs.slice(0, 6).map((log) => (
                    <div
                      key={log._id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between space-y-3 hover:border-white/25 transition-all h-auto"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {log.exerciseName || "General Workout"}
                          </h4>
                          <span className="text-[10px] font-mono text-white/40 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-white/60" />
                            {log.durationMinutes
                              ? `${log.durationMinutes}m`
                              : "—"}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/40 mt-1">
                          {new Date(
                            log.date || log.createdAt || Date.now(),
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span className="font-bold uppercase text-[10px] tracking-wider text-white/60">
                            {log.setsCount
                              ? `${log.setsCount} Sets`
                              : "Completed"}
                            {log.repsCount ? ` • ${log.repsCount} Reps` : ""}
                          </span>
                          {log.weight && log.weight > 0 ? (
                            <span className="font-mono font-bold text-white">
                              {log.weight} kg
                            </span>
                          ) : null}
                        </div>
                        {log.notes && (
                          <p className="text-[11px] text-white/50 bg-black px-2.5 py-1.5 rounded-lg border border-white/5 truncate">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SUBMENU 3: NUTRITION & MEAL PLAN (2-COLUMN GRID)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeSubmenu === "nutrition" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
            <div className="h-auto">
              <PersonalizedNutritionPlan
                user={backendUser}
                planName={activeSubscriptionData?.planName || backendUser?.plan}
                fitnessGoal={currentGoalKey}
                onUpgradeClick={handleOpenRenew}
              />
            </div>

            <div className="h-auto">
              <SavedMealPlan
                dailyPlanMeals={dailyPlanMeals}
                isLoadingDailyPlan={isLoadingDailyPlan}
                targetCalories={bmiHistory?.[0]?.tdee || 2400}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SUBMENU 4: BILLING & CARDS (2-COLUMN GRID)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeSubmenu === "billing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            <div className="lg:col-span-7 h-auto">
              <BillingSection />
            </div>

            <div className="lg:col-span-5 bg-black border border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between space-y-4 h-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white" />
                    <h3 className="text-base font-extrabold uppercase text-white tracking-wide">
                      Saved Payment Card
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    +2 Bonus Mos
                  </span>
                </div>

                {backendUser?.hasSavedCard && backendUser.savedCard ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/15 bg-white/5 p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{backendUser.savedCard.brand}</span>
                          <span className="font-mono">
                            •••• {backendUser.savedCard.last4}
                          </span>
                        </p>
                        <p className="text-xs text-white/50">
                          {backendUser.savedCard.cardHolder} · Exp{" "}
                          {backendUser.savedCard.expiryMonth}/
                          {backendUser.savedCard.expiryYear}
                        </p>
                        <p className="text-[10px] text-white/30">
                          Saved on{" "}
                          {new Date(
                            backendUser.savedCard.savedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteCard}
                        className="text-white/40 hover:text-red-400 transition-colors p-2 cursor-pointer"
                        aria-label="Remove card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Bonus retention applied: 2 bonus months unlocked on your
                        next subscription renewal!
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                      No card saved yet.{" "}
                      <span className="text-white font-bold">
                        Save your card now and get 2 bonus months FREE
                      </span>{" "}
                      automatically added to your account on your next
                      subscription purchase!
                    </p>
                    <button
                      onClick={() => setShowSaveCardModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Save a Card & Get Bonus
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/15 text-center">
                <p className="text-[11px] text-white/40">
                  Secured with 256-bit TLS encryption & PCI-DSS compliance
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Membership Renewal / Upgrade Modal ── */}
      {isRenewModalOpen && renewPlan && (
        <SubscriptionModal
          plan={renewPlan}
          isOpen={isRenewModalOpen}
          isAnnual={false}
          onClose={() => setIsRenewModalOpen(false)}
          onSuccess={() => {
            setIsRenewModalOpen(false);
            toast.success("🎉 Membership updated successfully!");
            setTimeout(() => window.location.reload(), 800);
          }}
        />
      )}

      {/* ── Save Card Modal ── */}
      {showSaveCardModal && (
        <SaveCardModal
          onClose={() => setShowSaveCardModal(false)}
          onSaved={fetchUser}
        />
      )}
    </div>
  );
}
