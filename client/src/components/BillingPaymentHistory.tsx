"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, Calendar, CheckCircle2, Receipt, ArrowUpRight } from "lucide-react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Receipt,
  ArrowUpRight,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import MembershipCountdown from "@/components/subscription/MembershipCountdown";

interface Transaction {
export interface Transaction {
  _id: string;
  date: string;
  transactionId: string;
  paymentMethod: "bKash" | "Nagad" | "Card";
  paymentMethod: "bKash" | "Nagad" | "Card" | "Bank Transfer" | string;
  amount: number;
  status: "Completed";
  status: "Completed" | "paid" | string;
  planName?: string;
  billingCycle?: string;
  invoiceNumber?: string;
  subscriptionStartDate?: string;
  subscriptionExpiryDate?: string;
  accountNumber?: string;
  userName?: string;
  userEmail?: string;
}

interface BillingPaymentHistoryProps {
export interface BillingPaymentHistoryProps {
  userPlan?: string;
  transactions?: Transaction[];
  expiryDate?: string | Date | null;
  startDate?: string | Date | null;
  onRenewPlan?: () => void;
  onViewInvoice?: (transaction: Transaction) => void;
}

export default function BillingPaymentHistory({
  userPlan = "Free Pass",
  transactions = [],
  expiryDate,
  startDate,
  onRenewPlan,
  onViewInvoice,
}: BillingPaymentHistoryProps) {
  const [showModal, setShowModal] = useState(false);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "VIP Ultimate":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]";
      case "Pro Athlete":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]";
      case "Basic Pass":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]";
      default:
        return "bg-white/10 text-white/80";
    }
  };

  const handleManagePlan = (e: React.MouseEvent) => {
    if (userPlan !== "Free Pass") {
      e.preventDefault();
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1000);
    }
  };
  // Derive latest expiry date from transactions if not explicitly passed
  const latestTx = transactions[0];
  const effectiveExpiry =
    expiryDate || latestTx?.subscriptionExpiryDate || null;
  const effectiveStart =
    startDate || latestTx?.subscriptionStartDate || latestTx?.date || null;

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);
  return (
    <div className="space-y-6">
      {/* ── 1. Live Countdown & Expiry Tracker ── */}
      <MembershipCountdown
        planName={userPlan}
        expiryDate={effectiveExpiry}
        startDate={effectiveStart}
        onRenewClick={onRenewPlan}
      />

  return (
    <>
      <div className="space-y-6">
        {/* Active Plan Card */}
        <div className="bg-black border border-white/20 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-white/60" />
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wide">
                Active Membership Plan
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              Active
            </span>
      {/* ── 2. Active Plan Overview Card ── */}
      <div className="bg-black border border-white/15 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-white/70" />
            <h2 className="text-base sm:text-lg font-extrabold uppercase text-white tracking-wide">
              Active Subscription Details
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {userPlan === "Free Pass" ? "Standard" : "Verified Pro"}
          </span>
        </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">
                Current Plan
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-base sm:text-lg font-black uppercase tracking-tight px-4 py-2 rounded-full ${getPlanBadgeColor(userPlan)}`}
                >
                  {userPlan}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1.5">
            <p className="text-xs text-white/50 uppercase tracking-wider font-bold">
              Current Tier
            </p>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm sm:text-base font-black uppercase tracking-tight px-4 py-1.5 rounded-full ${getPlanBadgeColor(
                  userPlan,
                )}`}
              >
                {userPlan}
              </span>
              {userPlan !== "Free Pass" && (
                <span className="text-xs text-white/60 font-mono">
                  {latestTx?.billingCycle === "yearly"
                    ? "Annual Membership (Billed Yearly)"
                    : "Monthly Membership"}
                </span>
              </div>
              )}
            </div>
          </div>

            <div className="flex items-center gap-4">
              {userPlan !== "Free Pass" && (
                <div className="text-right">
                  <p className="text-xs text-white/60 uppercase tracking-wider font-bold">
                    Renews On
                  </p>
                  <p className="text-sm text-white font-semibold mt-1">
                    Oct 6, 2026
                  </p>
                </div>
              )}
          <div className="flex items-center gap-4">
            {userPlan !== "Free Pass" && effectiveExpiry && (
              <div className="text-right">
                <p className="text-xs text-white/50 uppercase tracking-wider font-bold">
                  Valid Through
                </p>
                <p className="text-sm text-white font-semibold mt-0.5">
                  {new Date(effectiveExpiry).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

            {onRenewPlan ? (
              <button
                type="button"
                onClick={onRenewPlan}
                className="inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer shadow-lg"
              >
                <span>{userPlan === "Free Pass" ? "Upgrade Plan" : "Renew / Change"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href="/dashboard?tab=upgrade"
                onClick={handleManagePlan}
                className="inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer shadow-xl"
                href="/#pricing"
                className="inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer shadow-lg"
              >
                <span>{userPlan === "Free Pass" ? "Upgrade Plan" : "Manage Plan"}</span>
                <span>{userPlan === "Free Pass" ? "Upgrade Plan" : "Change Plan"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>

        {/* Transaction History */}
        <div className="bg-black border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-white/20 px-6 sm:px-7 py-5">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-white/60" />
              <h2 className="text-lg font-extrabold uppercase text-white tracking-wide">
                Payment History
              </h2>
            </div>
            <span className="text-xs text-white/60 font-medium">
              {transactions.length} Transaction{transactions.length !== 1 ? "s" : ""}
            </span>
      {/* ── 3. Unified Transaction & Invoice History ── */}
      <div className="bg-black border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 sm:px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-white/70" />
            <h2 className="text-base sm:text-lg font-extrabold uppercase text-white tracking-wide">
              Payment & Invoice History
            </h2>
          </div>

          {transactions.length === 0 ? (
            /* Empty State */
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
              <Receipt className="w-12 h-12 text-white/20" />
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black uppercase text-white">
                  No Transaction History Found
                </h3>
                <p className="text-xs text-white/60 max-w-sm mx-auto">
                  Your payment history is currently empty. Transactions will appear
                  here once you upgrade your membership plan.
                </p>
              </div>
            </div>
          ) : (
            /* Transaction Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                    <th className="px-5 sm:px-6 py-4 font-bold">Date</th>
                    <th className="px-5 sm:px-6 py-4 font-bold">Transaction ID</th>
                    <th className="px-5 sm:px-6 py-4 font-bold">Payment Method</th>
                    <th className="px-5 sm:px-6 py-4 font-bold">Amount</th>
                    <th className="px-5 sm:px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 sm:px-6 py-4 text-sm text-white/70">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-white/40" />
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 text-sm font-mono text-white/80">
                        {transaction.transactionId}
                      </td>
                      <td className="px-5 sm:px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-full">
                          <CreditCard className="w-3 h-3" />
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 text-sm font-bold text-white">
                        ৳{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-5 sm:px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <span className="text-xs text-white/50 font-medium">
            {transactions.length} Record{transactions.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-black border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-black uppercase text-white">
                You already have VIP plan
        {transactions.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
            <Receipt className="w-12 h-12 text-white/20" />
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black uppercase text-white">
                No Transaction History Found
              </h3>
              <p className="text-sm text-white/60">
                You're currently on the {userPlan} membership
              <p className="text-xs text-white/60 max-w-sm mx-auto">
                Your payment history is currently empty. Transactions and digital
                invoices will appear here once you upgrade your membership plan.
              </p>
            </div>
            {onRenewPlan && (
              <button
                onClick={onRenewPlan}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Choose Membership Plan</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
        ) : (
          /* Transaction Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50 bg-white/[0.02]">
                  <th className="px-5 sm:px-6 py-4 font-bold">Date</th>
                  <th className="px-5 sm:px-6 py-4 font-bold">Plan</th>
                  <th className="px-5 sm:px-6 py-4 font-bold">Transaction ID</th>
                  <th className="px-5 sm:px-6 py-4 font-bold">Method</th>
                  <th className="px-5 sm:px-6 py-4 font-bold">Amount</th>
                  <th className="px-5 sm:px-6 py-4 font-bold">Status</th>
                  <th className="px-5 sm:px-6 py-4 font-bold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 sm:px-6 py-4 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-sm font-semibold text-white">
                      {transaction.planName || userPlan}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-xs font-mono text-white/80">
                      {transaction.transactionId}
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-full">
                        <CreditCard className="w-3 h-3" />
                        {transaction.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-sm font-bold text-white">
                      ৳{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-right">
                      {onViewInvoice ? (
                        <button
                          type="button"
                          onClick={() => onViewInvoice(transaction)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
                          title="View & Download Digital Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      ) : (
                        <span className="text-xs text-white/40 font-mono">
                          {transaction.invoiceNumber || "Available"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

