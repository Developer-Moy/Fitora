"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, Calendar, CheckCircle2, Receipt, ArrowUpRight } from "lucide-react";

interface Transaction {
  _id: string;
  date: string;
  transactionId: string;
  paymentMethod: "bKash" | "Nagad" | "Card";
  amount: number;
  status: "Completed";
}

interface BillingPaymentHistoryProps {
  userPlan?: string;
  transactions?: Transaction[];
}

export default function BillingPaymentHistory({
  userPlan = "Free Pass",
  transactions = [],
}: BillingPaymentHistoryProps) {
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "VIP Ultimate":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
      case "Pro Athlete":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "Basic Pass":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      default:
        return "bg-white/10 text-white/80";
    }
  };

  return (
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
              </span>
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

            <Link
              href="/dashboard?tab=upgrade"
              className="inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer shadow-xl"
            >
              <span>{userPlan === "Free Pass" ? "Upgrade Plan" : "Manage Plan"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
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
      </div>
    </div>
  );
}
