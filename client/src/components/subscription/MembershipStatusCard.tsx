"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarClock,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  MembershipData,
  RemainingTime,
  calculateRemainingTime,
  calculateProgressPercentage,
  formatRemainingTime,
  getMembershipStatus,
  isFreePlan,
  resolveExpiryDate,
  resolveStartDate,
  getPlanBadgeColor,
  STATUS_CONFIG,
} from "@/lib/membershipUtils";
import type { MembershipStatus } from "@/lib/membershipUtils";

export interface MembershipStatusCardProps {
  membership: MembershipData;
  onRenew?: () => void;
  className?: string;
}

const STATUS_ICONS: Record<MembershipStatus, React.ReactNode> = {
  active: <ShieldCheck className="w-3 h-3" />,
  "expiring-soon": <AlertTriangle className="w-3 h-3" />,
  expired: <ShieldAlert className="w-3 h-3" />,
};

const PROGRESS_COLOR_CLASS: Record<MembershipStatus, string> = {
  active: "bg-white",
  "expiring-soon": "bg-white",
  expired: "bg-white/40",
};

const COUNTDOWN_TEXT_CLASS: Record<MembershipStatus, string> = {
  active: "text-white",
  "expiring-soon": "text-white",
  expired: "text-white/60",
};

const CARD_BORDER_CLASS: Record<MembershipStatus, string> = {
  active: "border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]",
  "expiring-soon": "border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]",
  expired: "border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]",
};

const GLOW_COLOR_CLASS: Record<MembershipStatus, string> = {
  active: "bg-white",
  "expiring-soon": "bg-white",
  expired: "bg-white",
};

export default function MembershipStatusCard({
  membership,
  onRenew,
  className = "",
}: MembershipStatusCardProps) {
  const isFree = isFreePlan(membership.planName);

  const expiry = useMemo(() => resolveExpiryDate(membership), [membership]);
  const start = useMemo(
    () => resolveStartDate(membership.startDate, expiry),
    [membership, expiry],
  );

  // Real-time ticker. Only runs for memberships that have an expiry date.
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!expiry) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiry]);

  const remaining: RemainingTime = useMemo(
    () =>
      isFree
        ? ({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalMs: 0,
            isExpired: true,
            isExpiringSoon: false,
          } as RemainingTime)
        : calculateRemainingTime(expiry, now),
    [isFree, expiry, now],
  );

  const status: MembershipStatus = isFree
    ? "active"
    : getMembershipStatus(expiry, now);

  const progress = isFree ? 0 : calculateProgressPercentage(start, expiry, now);

  const statusCfg = STATUS_CONFIG[status];
  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";
  const startLabel = formatDate(start);
  const expiryLabel = formatDate(expiry);

  return (
    <div
      className={`w-full bg-black border rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden h-full flex flex-col justify-between ${
        isFree ? "border-white/10" : CARD_BORDER_CLASS[status]
      } ${className}`}
    >
      {/* Ambient glow accent */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isFree ? "bg-white" : GLOW_COLOR_CLASS[status]
        }`}
      />

      <div className="relative z-10 space-y-4 flex flex-col justify-between h-full">
        {/* Header: title + status badge */}
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-white/60" />
            <h2 className="text-base font-extrabold uppercase tracking-wide text-white font-sans">
              Membership
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${
              isFree
                ? "bg-white/10 text-white/60 border-white/20"
                : statusCfg.colorClass
            }`}
          >
            {isFree ? (
              <Zap className="w-3 h-3 text-white/60" />
            ) : (
              STATUS_ICONS[status]
            )}
            {isFree ? "Free" : statusCfg.label}
          </span>
        </div>

        {/* Plan name badge */}
        <div>
          <span
            className={`text-sm sm:text-base font-black uppercase tracking-tight px-4 py-1.5 rounded-full ${getPlanBadgeColor(membership.planName)}`}
          >
            {membership.planName}
          </span>
          {membership.planName && !isFree && (
            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-white/50">
              Premium Plan
            </span>
          )}
        </div>

        {/* Free plan state */}
        {isFree && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-white/60 max-w-md">
              You are currently on the Standard Free Pass. Enjoy essential
              turnstile access and AI routines, or upgrade to unlock the full
              branch network and premium recovery zones.
            </p>

            {onRenew && (
              <button
                type="button"
                onClick={onRenew}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all shadow-xl cursor-pointer"
              >
                <span>Upgrade To Pro</span>
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </button>
            )}
          </div>
        )}

        {/* Paid plan: countdown + progress + expiry */}
        {!isFree && (
          <div className="space-y-5 pt-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 font-bold">
                Your membership expires in
              </p>
              <p
                className={`mt-1 text-xl sm:text-2xl font-black font-mono tracking-tight ${COUNTDOWN_TEXT_CLASS[status]}`}
              >
                {remaining.isExpired
                  ? "Membership Expired"
                  : formatRemainingTime(remaining)}
              </p>
            </div>

            {/* Progress bar — represents REMAINING membership time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>
                  {remaining.isExpired
                    ? "Membership fully depleted"
                    : status === "expiring-soon"
                      ? "Expires very soon"
                      : "Time remaining"}
                </span>
                <span className="font-mono font-black text-white/80">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden bg-white/10">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${PROGRESS_COLOR_CLASS[status]}`}
                  style={{
                    width: remaining.isExpired ? "100%" : `${progress}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>Start: {startLabel}</span>
                <span>End: {expiryLabel}</span>
              </div>
            </div>

            {/* Expiry date + renew action */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Calendar className="w-3.5 h-3.5 text-white/50" />
                <span>Expires:</span>
                <strong className="text-white font-medium">
                  {expiryLabel}
                </strong>
              </div>

              {remaining.isExpired ? (
                <button
                  type="button"
                  onClick={onRenew}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all shadow-lg cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Renew Now</span>
                </button>
              ) : status === "expiring-soon" ? (
                <button
                  type="button"
                  onClick={onRenew}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all shadow-lg cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renew Now</span>
                </button>
              ) : onRenew ? (
                <button
                  type="button"
                  onClick={onRenew}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white/70 border border-white/15 font-bold text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                >
                  <span>Manage Plan</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
