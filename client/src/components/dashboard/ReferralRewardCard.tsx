"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Gift,
  Users,
} from "lucide-react";
import FitoraPillButton from "@/components/ui/FitoraPillButton";

interface ReferralRewardCardProps {
  referralCount?: number;
  successfulReferrals?: number;
  rewardPoints?: number;
  referralCode?: string;
}

export default function ReferralRewardCard({
  referralCount = 4,
  successfulReferrals = 2,
  rewardPoints = 500,
  referralCode = "FITORA500",
}: ReferralRewardCardProps) {
  const [copied, setCopied] = useState(false);

  const referralGoal = 5;
  const progress = Math.min(
    (successfulReferrals / referralGoal) * 100,
    100
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy referral code:", error);
    }
  };

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-[#171717] p-5 sm:p-6 text-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
            <Gift className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              FITORA REWARDS
            </p>

            <h3 className="mt-1 text-lg font-black uppercase tracking-tight">
              Referral Rewards
            </h3>
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <ArrowUpRight className="h-4 w-4 text-white/60" />
        </div>
      </div>

      {/* Reward Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-white/40">
            <Users className="h-4 w-4" />

            <span className="text-[9px] font-bold uppercase tracking-widest">
              Referrals
            </span>
          </div>

          <p className="mt-3 text-2xl font-black">
            {referralCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
            Rewards
          </p>

          <p className="mt-3 text-2xl font-black">
            {rewardPoints}
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-widest text-white/30">
            Points
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Referral Progress
          </p>

          <p className="text-xs font-bold text-white/70">
            {successfulReferrals}/{referralGoal}
          </p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-[10px] text-white/35">
          {successfulReferrals >= referralGoal
            ? "Reward milestone reached."
            : `${referralGoal - successfulReferrals} more successful referral${
                referralGoal - successfulReferrals === 1 ? "" : "s"
              } to unlock your next reward.`}
        </p>
      </div>

      {/* Referral Code */}
      <div className="mt-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
          Your Referral Code
        </p>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black p-2">
          <div className="flex-1 px-3">
            <p className="text-sm font-black tracking-[0.2em] text-white">
              {referralCode}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black transition hover:bg-white/90"
            aria-label="Copy referral code"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {copied && (
          <p className="mt-2 text-[10px] font-medium text-white/50">
            Referral code copied successfully.
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6">
        <FitoraPillButton
          type="button"
          variant="white"
          className="w-full justify-center"
        >
          INVITE FRIENDS ↗
        </FitoraPillButton>
      </div>
    </section>
  );
}
