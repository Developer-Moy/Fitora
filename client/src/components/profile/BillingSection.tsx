"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Printer,
  FileText,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import {
  fetchMyPaymentsApi,
  derivePaymentFromUser,
  type Payment,
} from "@/services/paymentService";
import { getAuthSession } from "@/services/authService";
import InvoiceModal from "@/components/InvoiceModal";

/**
 * Payment status → badge style mapping.
 * Kept central so every row uses the same colour language.
 */
const STATUS_BADGE: Record<string, string> = {
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Failed: "bg-red-500/15 text-red-400 border-red-500/25",
  Refunded: "bg-sky-500/15 text-sky-400 border-sky-500/25",
};

/** BDT currency string consistent with the rest of the app. */
const formatBDT = (n: number) => `৳${(n || 0).toLocaleString("en-IN")}`;

/** Date formatting consistent with the profile page ("Feb 10, 2025"). */
const formatDate = (raw?: string) => {
  const d = raw ? new Date(raw) : new Date();
  if (isNaN(d.getTime())) {
    return "--";
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BillingSection() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invoice modal state — the selected payment drives the modal content.
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const session = getAuthSession();
    const tok = session?.token || "";
    const user = session?.user || null;

    const loadPayments = async () => {
      setLoading(true);
      setError("");

      if (user) {
        setUserInfo({ name: user.name || "", email: user.email || "" });
      }

      // 1) Try the dedicated payment history API when a token exists.
      if (tok) {
        const res = await fetchMyPaymentsApi(tok);
        if (res.success && res.payments && res.payments.length > 0) {
          setPayments(res.payments);
          setLoading(false);
          return;
        }
      }

      // 2) Fallback: derive a payment record from the logged-in user's
      //    session (plan, totalPaidBDT, paymentMethod) instead of
      //    hardcoding mock data.
      const derived = derivePaymentFromUser(user);
      if (derived) {
        setPayments([derived]);
      } else {
        setPayments([]);
      }

      setLoading(false);
    };

    loadPayments();
  }, []);

  const openInvoice = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const closeInvoice = () => {
    setModalOpen(false);
    // Small delay prevents the fade-out from showing stale content.
    setTimeout(() => setSelectedPayment(null), 150);
  };

  const handlePrint = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
    // Wait a frame for the modal to render, then trigger print.
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.print();
      }
    }, 300);
  };

  return (
    <div className="space-y-4">
      {/* ── Section title ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
              Billing &amp; Transactions
            </h2>
            <p className="text-xs text-white/60">
              All your previous payments and invoices
            </p>
          </div>
        </div>
        <span className="text-xs text-white/60 font-medium hidden sm:inline">
          {payments.length} Transaction{payments.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* ── Loading state ── */}
      {loading ? (
        <div className="bg-black border border-white/20 rounded-2xl p-10 flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-white/60" />
        </div>
      ) : error ? (
        <div className="bg-black border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : payments.length === 0 ? (
        /* ── Empty state ── */
        <div className="bg-black border border-white/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <FileText className="w-10 h-10 text-white/20" />
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black uppercase text-white">
              No Billing History
            </h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              Your membership payments and invoices will appear here once you
              upgrade your plan.
            </p>
          </div>
          <Link
            href="/#pricing"
            className="mt-2 inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-xl"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Upgrade Membership</span>
          </Link>
        </div>
      ) : (
        /* ── Billing history table ── */
        <div className="bg-black border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] sm:text-xs uppercase tracking-wider text-white/50">
                  <th className="px-4 sm:px-5 py-4 font-bold">Date</th>
                  <th className="px-4 sm:px-5 py-4 font-bold">Plan</th>
                  <th className="px-4 sm:px-5 py-4 font-bold">Amount</th>
                  <th className="px-4 sm:px-5 py-4 font-bold">Gateway</th>
                  <th className="px-4 sm:px-5 py-4 font-bold">Status</th>
                  <th className="px-4 sm:px-5 py-4 font-bold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => {
                  const statusKey =
                    typeof payment.status === "string" ? payment.status : "Paid";
                  const badgeCls =
                    STATUS_BADGE[statusKey] ||
                    "bg-neutral-900 text-white/70 border-white/20";

                  return (
                    <tr
                      key={payment._id || `${payment.invoiceNumber}-${idx}`}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-4 text-xs sm:text-sm text-white/70 whitespace-nowrap">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm font-semibold text-white whitespace-nowrap">
                        {payment.plan}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm font-black text-white whitespace-nowrap">
                        {formatBDT(payment.amount)}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/70 whitespace-nowrap">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              payment.gateway === "bKash"
                                ? "bg-pink-500"
                                : payment.gateway === "Nagad"
                                  ? "bg-orange-400"
                                  : "bg-white/50"
                            }`}
                          />
                          {payment.gateway}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeCls}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusKey}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => openInvoice(payment)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all text-[10px] sm:text-xs font-bold cursor-pointer"
                          >
                            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden md:inline">View Invoice</span>
                            <span className="md:hidden">Invoice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePrint(payment)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black border border-white hover:bg-neutral-100 transition-all text-[10px] sm:text-xs font-black cursor-pointer shadow-md"
                          >
                            <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Invoice Modal ── */}
      <InvoiceModal
        payment={selectedPayment as Payment}
        userInfo={userInfo}
        isOpen={modalOpen && !!selectedPayment}
        onClose={closeInvoice}
      />
    </div>
  );
}