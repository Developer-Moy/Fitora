/**
 * Membership utilities
 *
 * Framework-agnostic, pure helpers for membership status calculation,
 * remaining-time formatting, and progress percentage. These have no React
 * dependency so they can be reused from any component or service layer,
 * making the membership logic easy to swap for real API data later.
 */

/** Threshold (in ms) under which a non-expired membership is "expiring soon". */
export const EXPIRING_SOON_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;

export type MembershipStatus = "active" | "expiring-soon" | "expired";

export interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Total remaining milliseconds (always >= 0). */
  totalMs: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface MembershipData {
  planName: string;
  startDate: Date | string | null;
  expiryDate: Date | string | null;
}

/**
 * TEMPORARY fallback membership record.
 *
 * Used only when the client has no live membership data from the backend
 * (e.g. offline / demo mode) and the user is on a paid tier. This is clearly
 * isolated so it can be replaced with real API data later without ripple
 * effects across the codebase.
 */
export const TEMP_MEMBERSHIP: MembershipData = {
  planName: "Premium",
  startDate: new Date("2026-09-01T00:00:00"),
  expiryDate: new Date("2026-10-01T00:00:00"),
};

/** Safe Date coercion. Returns `null` for empty / invalid input. */
export const toDate = (
  value: Date | string | number | null | undefined,
): Date | null => {
  if (value == null) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const isFreePlan = (planName: string): boolean => {
  if (!planName) return true;
  const p = planName.toLowerCase();
  return p === "free pass" || p === "free" || p === "free member";
};

/**
 * Resolve the effective expiry Date for a membership.
 * Returns `null` for free plans (no expiry). For paid plans with no explicit
 * expiry, falls back to +30 days from now so the UI still demonstrates.
 */
export const resolveExpiryDate = (
  data: MembershipData,
  now: number = Date.now(),
): Date | null => {
  const expiry = toDate(data.expiryDate);
  if (expiry) return expiry;
  if (isFreePlan(data.planName)) return null;
  const fallback = new Date(now);
  fallback.setDate(fallback.getDate() + 30);
  return fallback;
};

/**
 * Resolve the effective start Date.
 * Falls back to (expiry - 30 days) when a start date is unavailable, so the
 * progress bar always has a valid total duration to compare against.
 */
export const resolveStartDate = (
  startDate: Date | string | null,
  expiry: Date | null,
): Date | null => {
  const s = toDate(startDate);
  if (s) return s;
  if (!expiry) return null;
  const fallback = new Date(expiry.getTime());
  fallback.setDate(fallback.getDate() - 30);
  return fallback;
};

/** Determine the dynamic membership status from the expiry date. */
export const getMembershipStatus = (
  expiryDate: Date | null,
  now: number = Date.now(),
): MembershipStatus => {
  if (!expiryDate) return "expired";
  const diff = expiryDate.getTime() - now;
  if (diff <= 0) return "expired";
  if (diff < EXPIRING_SOON_THRESHOLD_MS) return "expiring-soon";
  return "active";
};

/**
 * Calculate the remaining time for a membership.
 * Always returns non-negative values; clamps to zero when expired.
 */
export const calculateRemainingTime = (
  expiryDate: Date | null,
  now: number = Date.now(),
): RemainingTime => {
  const expiredBase = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    isExpired: true,
    isExpiringSoon: false,
  };

  if (!expiryDate) return expiredBase;

  const diff = expiryDate.getTime() - now;
  if (diff <= 0) return expiredBase;

  return {
    days: Math.floor(diff / MS_PER_DAY),
    hours: Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((diff % MS_PER_MINUTE) / 1000),
    totalMs: diff,
    isExpired: false,
    isExpiringSoon: diff < EXPIRING_SOON_THRESHOLD_MS,
  };
};

/**
 * Calculate the remaining-time percentage (0–100).
 *
 * Progress represents REMAINING membership time — the bar depletes as the
 * membership nears expiry and reaches 0% when fully expired. This maps
 * intuitively to the countdown and the visual "time running out" cue.
 */
export const calculateProgressPercentage = (
  startDate: Date | string | null,
  expiryDate: Date | string | null,
  now: number = Date.now(),
): number => {
  const exp = toDate(expiryDate);
  if (!exp) return 0;

  const start =
    toDate(startDate) ??
    resolveStartDate(startDate, exp) ??
    new Date(exp.getTime() - 30 * MS_PER_DAY);
  const totalDuration = Math.max(1, exp.getTime() - start.getTime());
  const remaining = Math.max(0, exp.getTime() - now);
  return Math.max(0, Math.min(100, (remaining / totalDuration) * 100));
};

/** Human-readable remaining time, e.g. "29 Days, 18 Hours Left". */
export const formatRemainingTime = (time: RemainingTime): string => {
  if (time.isExpired) return "Membership Expired";

  const plural = (value: number, unit: string) =>
    `${value} ${unit}${value !== 1 ? "s" : ""}`;

  if (time.days > 0) {
    return `${plural(time.days, "Day")}, ${plural(time.hours, "Hour")} Left`;
  }
  if (time.hours > 0) {
    return `${plural(time.hours, "Hour")}, ${plural(time.minutes, "Minute")} Left`;
  }
  return `${plural(time.minutes, "Minute")}, ${plural(time.seconds, "Second")} Left`;
};

/** Status → (label, badge style, icon name) mapping for the status badge. */
export const STATUS_CONFIG: Record<MembershipStatus, {
  label: string;
  colorClass: string;
}> = {
  active: {
    label: "Active",
    colorClass:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  "expiring-soon": {
    label: "Expiring Soon",
    colorClass:
      "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse",
  },
  expired: {
    label: "Expired",
    colorClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
};

/** Color mapping for the per-plan name badge (mirrors BillingPaymentHistory). */
export const getPlanBadgeColor = (plan: string): string => {
  const p = plan.toLowerCase();
  if (p.includes("vip"))
    return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]";
  if (p.includes("pro"))
    return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]";
  if (p.includes("basic"))
    return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]";
  if (p.includes("premium"))
    return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,82,247,0.3)]";
  return "bg-white/10 text-white/80";
};
