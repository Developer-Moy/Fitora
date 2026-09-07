"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
  X,
  Calendar,
} from "lucide-react";

export type MembershipBannerStatus =
  | "expiring_soon"
  | "expired"
  | "no_membership";

export type MembershipBannerVariant = "light" | "dark";

export interface MembershipExpiryBannerProps {
  /**
   * Membership lifecycle status
   * - "expiring_soon": Plan is expiring within a few days
   * - "expired": Plan has already lapsed
   * - "no_membership": User is currently on the free pass or has no active tier
   * @default "expiring_soon"
   */
  status?: MembershipBannerStatus;

  /**
   * Visual theme variant.
   * - "light": High-contrast white background with black typography and borders (FITORA default)
   * - "dark": Stealth black background with crisp white typography and subtle borders
   * @default "light"
   */
  variant?: MembershipBannerVariant;


  planName?: string;

  expiryDate?: string;

  daysRemaining?: number;

  title?: string;

  message?: string;

  badgeText?: string;

  actionLabel?: string;


  actionHref?: string;

  onAction?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;

  secondaryActionLabel?: string;

  secondaryActionHref?: string;

  onSecondaryAction?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;

  dismissible?: boolean;


  onDismiss?: () => void;

  className?: string;

  icon?: React.ReactNode;
}

interface StatusConfig {
  defaultTitle: string;
  defaultBadge: string;
  defaultMessage: string;
  defaultActionLabel: string;
  icon: React.ReactNode;
}

export default function MembershipExpiryBanner({
  status = "expiring_soon",
  variant = "light",
  planName,
  expiryDate,
  daysRemaining,
  title,
  message,
  badgeText,
  actionLabel,
  actionHref = "/dashboard?tab=upgrade",
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  dismissible = true,
  onDismiss,
  className = "",
  icon,
}: MembershipExpiryBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Configuration defaults mapped strictly to monochrome states
  const statusConfigs: Record<MembershipBannerStatus, StatusConfig> = {
    expiring_soon: {
      defaultTitle: planName
        ? `${planName} Expiring Soon`
        : "Membership Expiring Soon",
      defaultBadge:
        daysRemaining !== undefined
          ? `${daysRemaining} Day${daysRemaining === 1 ? "" : "s"} Left`
          : "Expiring Soon",
      defaultMessage:
        daysRemaining !== undefined
          ? `Your membership plan will expire in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"
          }${expiryDate ? ` on ${expiryDate}` : ""
          }. Renew now to maintain uninterrupted access to gym facilities, workout logs, and personalized meal charts.`
          : `Your membership is approaching its renewal date${expiryDate ? ` on ${expiryDate}` : ""
          }. Renew now to prevent interruption to your training schedule.`,
      defaultActionLabel: "Renew Membership",
      icon: <Clock className="w-5 h-5 stroke-[2.2]" />,
    },
    expired: {
      defaultTitle: planName
        ? `${planName} Expired`
        : "Membership Expired",
      defaultBadge: "Expired",
      defaultMessage: `Your membership access has lapsed${expiryDate ? ` as of ${expiryDate}` : ""
        }. Reactivate your subscription today to regain full athlete privileges, trainer bookings, and branch check-ins.`,
      defaultActionLabel: "Reactivate Plan",
      icon: <AlertTriangle className="w-5 h-5 stroke-[2.2]" />,
    },
    no_membership: {
      defaultTitle: "No Active Membership",
      defaultBadge: "Free Account",
      defaultMessage:
        "You are currently on the Free Member tier. Upgrade to a FITORA Athlete Pass to unlock unlimited gym access, custom fitness tracking, and premium facilities.",
      defaultActionLabel: "Upgrade Plan",
      icon: <CreditCard className="w-5 h-5 stroke-[2.2]" />,
    },
  };

  const currentConfig = statusConfigs[status];
  const renderedTitle = title ?? currentConfig.defaultTitle;
  const renderedMessage = message ?? currentConfig.defaultMessage;
  const renderedBadge = badgeText ?? currentConfig.defaultBadge;
  const renderedActionLabel =
    actionLabel ?? currentConfig.defaultActionLabel;
  const renderedIcon = icon ?? currentConfig.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const isLight = variant === "light";

  return (
    <AnimatePresence>
      <motion.aside
        role="alert"
        aria-live="polite"
        aria-label={renderedTitle}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, height: 0, marginTop: 0, marginBottom: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`w-full rounded-2xl transition-all select-none relative overflow-hidden ${isLight
            ? "bg-white text-black border border-black/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            : "bg-black text-white border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          } ${className}`}
      >
        {/* Subtle decorative edge accent (monochrome high-contrast bar) */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${isLight ? "bg-black" : "bg-white"
            }`}
          aria-hidden="true"
        />

        <div className="p-5 sm:p-6 pl-6 sm:pl-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left Column: Icon + Core Content */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Status Icon Badge */}
            <div
              className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${isLight
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-white"
                }`}
              aria-hidden="true"
            >
              {renderedIcon}
            </div>

            {/* Information Block */}
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Header Row: Title & Badges */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3
                  className={`text-base sm:text-lg font-black uppercase tracking-tight font-sans ${isLight ? "text-black" : "text-white"
                    }`}
                >
                  {renderedTitle}
                </h3>

                {/* Status Pill Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isLight
                      ? "bg-black text-white"
                      : "bg-white text-black"
                    }`}
                >
                  {renderedBadge}
                </span>

                {/* Optional Metadata Pill: Plan Name */}
                {planName && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isLight
                        ? "border-black/20 text-black/80 bg-black/5"
                        : "border-white/20 text-white/80 bg-white/5"
                      }`}
                  >
                    {planName}
                  </span>
                )}
              </div>

              {/* Message Description */}
              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed max-w-3xl ${isLight ? "text-neutral-700" : "text-neutral-300"
                  }`}
              >
                {renderedMessage}
              </p>

              {/* Optional Expiry Metadata Chip */}
              {expiryDate && status !== "no_membership" && (
                <div
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold pt-1 ${isLight ? "text-neutral-600" : "text-neutral-400"
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <span>
                    {status === "expired" ? "Expired on" : "Renewal deadline"}:{" "}
                    <strong
                      className={isLight ? "text-black" : "text-white"}
                    >
                      {expiryDate}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: CTA Actions & Dismiss */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap pt-2 md:pt-0 self-start md:self-center">
            {/* Secondary Action (if supplied) */}
            {secondaryActionLabel && (
              <>
                {secondaryActionHref ? (
                  <Link
                    href={secondaryActionHref}
                    onClick={onSecondaryAction}
                    className={`inline-flex items-center justify-center font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border transition-all cursor-pointer ${isLight
                        ? "border-black/20 text-black hover:border-black hover:bg-black/5"
                        : "border-white/25 text-white hover:border-white hover:bg-white/10"
                      }`}
                  >
                    <span>{secondaryActionLabel}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className={`inline-flex items-center justify-center font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border transition-all cursor-pointer ${isLight
                        ? "border-black/20 text-black hover:border-black hover:bg-black/5"
                        : "border-white/25 text-white hover:border-white hover:bg-white/10"
                      }`}
                  >
                    <span>{secondaryActionLabel}</span>
                  </button>
                )}
              </>
            )}

            {/* Primary Action CTA */}
            {actionHref ? (
              <Link
                href={actionHref}
                onClick={onAction}
                className={`inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md group ${isLight
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-neutral-200"
                  }`}
              >
                <span>{renderedActionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className={`inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md group ${isLight
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-neutral-200"
                  }`}
              >
                <span>{renderedActionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            )}

            {/* Dismiss Button */}
            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className={`p-2 rounded-full transition-all cursor-pointer ${isLight
                    ? "text-neutral-500 hover:text-black hover:bg-black/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <X className="w-4 h-4 stroke-2" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
