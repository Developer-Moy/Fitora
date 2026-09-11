"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Zap,
  ArrowUpRight,
} from "lucide-react";

interface MembershipCountdownProps {
  planName: string;
  expiryDate?: string | Date | null;
  startDate?: string | Date | null;
  onRenewClick?: () => void;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  progressPercent: number;
}

export default function MembershipCountdown({
  planName,
  expiryDate,
  startDate,
  onRenewClick,
  className = "",
}: MembershipCountdownProps) {
  const isFreePlan =
    !planName ||
    planName.toLowerCase() === "free pass" ||
    planName.toLowerCase() === "free" ||
    planName.toLowerCase() === "free member";

  // Server-provided expiry date is the source of truth.
  // No fake 30-day fallback.
  const resolvedExpiry = useMemo(() => {
    if (isFreePlan) return null;

    if (!expiryDate) return null;

    const date = new Date(expiryDate);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }, [expiryDate, isFreePlan]);

  // Server-provided start date.
  // If startDate is missing/invalid, keep it null instead of
  // assuming a fake 30-day membership duration.
  const resolvedStart = useMemo(() => {
    if (!startDate) return null;

    const date = new Date(startDate);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }, [startDate]);

  // Real-time ticker
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!resolvedExpiry) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [resolvedExpiry]);

  const timeRemaining: TimeRemaining = useMemo(() => {
    if (!resolvedExpiry) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        isExpired: false,
        isExpiringSoon: false,
        progressPercent: 0,
      };
    }

    const expiryTime = resolvedExpiry.getTime();
    const startTime = resolvedStart?.getTime() ?? null;

    const diff = expiryTime - now;

    // Membership has expired.
    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        isExpired: true,
        isExpiringSoon: false,
        progressPercent: 0,
      };
    }

    const totalDuration = startTime !== null ? expiryTime - startTime : 0;

    const isExpiringSoon = diff < 3 * 24 * 60 * 60 * 1000;

    // If there is no valid start date, we cannot calculate
    // an accurate elapsed-duration percentage.
    const progressPercent =
      diff <= 0
        ? 0
        : totalDuration > 0
          ? Math.min(
              Math.max(
                ((now - (resolvedStart?.getTime() ?? now)) / totalDuration) *
                  100,
                0,
              ),
              100,
            )
          : 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: diff,
      isExpired: false,
      isExpiringSoon,
      progressPercent,
    };
  }, [resolvedExpiry, resolvedStart, now]);

  // Format Helper
  const pad = (num: number) => String(num).padStart(2, "0");

  if (isFreePlan) {
    return (
      <div
        className={`bg-neutral-950/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />

              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Membership Tier
              </p>
            </div>

            <h3 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
              <span>Standard Free Pass</span>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold lowercase">
                no expiry
              </span>
            </h3>

            <p className="text-xs text-white/60 max-w-md">
              Unlock unlimited AI gym routines, all-branch turnstile access, and
              automated nutrition macro tracking by upgrading to Pro.
            </p>
          </div>

          {onRenewClick && (
            <button
              onClick={onRenewClick}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0 cursor-pointer"
            >
              <span>Upgrade To Pro</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Paid plan with missing/invalid expiry.
  // Do NOT create a fake expiry date.
  if (!resolvedExpiry) {
    return (
      <div
        className={`bg-black/90 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md ${className}`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 bg-amber-500" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-white/60" />

              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Membership Validity
              </p>
            </div>

            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              {planName}
            </h3>

            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />

              <span className="text-sm font-semibold">
                No valid subscription expiry available.
              </span>
            </div>

            <p className="text-xs text-white/50 max-w-md">
              Your membership expiry date could not be verified. Please refresh
              your membership data or contact support.
            </p>
          </div>

          {onRenewClick && (
            <button
              onClick={onRenewClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Membership</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active / Expiring / Expired Pro/VIP plan
  return (
    <div
      className={`bg-black/90 border border-white/15 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Background Ambience Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-10 bg-white" />

      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-white/60" />

          <h4 className="text-xs font-black uppercase tracking-widest text-white/80">
            Membership Validity & Countdown
          </h4>
        </div>

        {/* Status Pill Badge: ONLY Active is green, all others monochrome */}
        {timeRemaining.isExpired ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/5 text-white/50 border border-white/10">
            <ShieldAlert className="w-3 h-3" />
            Expired
          </span>
        ) : timeRemaining.isExpiringSoon ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
            <AlertTriangle className="w-3 h-3" />
            Expiring Soon ({timeRemaining.days}d {timeRemaining.hours}h left)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-3 h-3" />
            Active Member ({timeRemaining.days} Days Left)
          </span>
        )}
      </div>

      {/* Countdown Clock Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 my-5 relative z-10">
        {/* Days */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {timeRemaining.isExpired ? "00" : pad(timeRemaining.days)}
          </span>

          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {timeRemaining.isExpired ? "00" : pad(timeRemaining.hours)}
          </span>

          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {timeRemaining.isExpired ? "00" : pad(timeRemaining.minutes)}
          </span>

          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">
            Mins
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {timeRemaining.isExpired ? "00" : pad(timeRemaining.seconds)}
          </span>

          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">
            Secs
          </span>
        </div>
      </div>

      {/* Progress Track & Details */}
      <div className="space-y-3 relative z-10">
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out rounded-full bg-white"
            style={{
              width: `${timeRemaining.progressPercent}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-white/60">
          <span>
            Expires:{" "}
            <strong className="text-white font-medium">
              {resolvedExpiry.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </span>

          <div className="flex items-center gap-3">
            {timeRemaining.isExpired ? (
              <span className="text-white/60 font-semibold">
                Your pass has expired.
              </span>
            ) : timeRemaining.isExpiringSoon ? (
              <span className="text-white font-semibold">
                Renew now to maintain streak & QR access!
              </span>
            ) : (
              <span className="text-white/60">
                {timeRemaining.days} days remaining
              </span>
            )}

            {(timeRemaining.isExpiringSoon ||
              timeRemaining.isExpired ||
              onRenewClick) &&
              onRenewClick && (
                <button
                  onClick={onRenewClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition-all bg-white text-black hover:bg-neutral-200 shadow-md"
                >
                  <RefreshCw className="w-3 h-3" />

                  <span>
                    {timeRemaining.isExpired ? "Renew Now" : "Extend Pass"}
                  </span>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
