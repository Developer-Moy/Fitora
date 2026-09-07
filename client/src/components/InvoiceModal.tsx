"use client";

import React, { useRef } from "react";
import { X, Printer, ShieldCheck, Calendar, CreditCard } from "lucide-react";
import type { Payment } from "@/services/paymentService";

interface InvoiceModalProps {
  payment: Payment;
  userInfo: { name: string; email: string };
  isOpen: boolean;
  onClose: () => void;
}

/**
 * InvoiceModal — reusable Fitora invoice/print modal.
 * Renders a clean, printer-friendly invoice for a single payment record.
 */
export default function InvoiceModal({
  payment,
  userInfo,
  isOpen,
  onClose,
}: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !payment) return null;

  /** Currency helper consistent with the app ("৳" + en-IN grouping). */
  const formatBDT = (n: number) => `৳${(n || 0).toLocaleString("en-IN")}`;

  const formatDate = (raw: string) => {
    const d = raw ? new Date(raw) : new Date();
    if (isNaN(d.getTime())) {
      return new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const invoiceNumber = payment.invoiceNumber || `FIT-INV-${String(payment.date)
    .slice(0, 10)
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase()}`;

  /** Trigger the browser print dialog — the whole modal region prints. */
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Fitora Invoice ${invoiceNumber}`;
    if (typeof window !== "undefined") {
      window.print();
    }
    document.title = originalTitle;
  };

  return (
    <div
      className="print-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="print-modal-card relative w-full max-w-3xl bg-neutral-950 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.95)] text-white select-none overflow-hidden max-h-[94vh] overflow-y-auto">
        {/* Close (screen only — hidden in print) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer print-hide"
          aria-label="Close Invoice"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Invoice Document (print target) ── */}
        <div
          ref={printRef}
          className="print-area text-white"
          id={`invoice-${invoiceNumber}`}
        >
          {/* Masthead */}
          <div className="flex items-start justify-between gap-4 flex-wrap pt-2 pr-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black uppercase tracking-tight text-white">
                  Fitora
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black print:border print:border-black">
                  Invoice
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5">
                Fitora Tower, Gulshan-2, Dhaka 1212 &bull; 64 Branches
              </p>
            </div>
            <div className="text-right shrink-0 pr-10">
              <p className="text-xs font-black text-white uppercase tracking-wider">
                {invoiceNumber}
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                {formatDate(payment.date)}
              </p>
            </div>
          </div>

          {/* Bill To / Meta */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                Billed To
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {userInfo.name || "Fitora Member"}
              </p>
              <p className="text-xs text-white/60">
                {userInfo.email || ""}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                Payment Summary
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {payment.plan} Membership
              </p>
              <p className="text-[11px] text-white/50">
                {payment.billingCycle || "One-time"} &bull;{" "}
                <span className="inline-flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {payment.gateway}
                </span>
              </p>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/50">
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-3 text-sm text-white/80">
                    {payment.description || `${payment.plan} membership payment`}
                    {payment.transactionId ? (
                      <span className="block text-[10px] text-white/40">
                        TXN: {payment.transactionId}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 px-3 text-sm font-bold text-white text-right">
                    {formatBDT(payment.amount)}
                  </td>
                  <td className="py-3 px-3 text-sm font-black text-white text-right">
                    {formatBDT(payment.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="mt-5 flex items-end justify-between flex-wrap gap-3">
            <div className="space-y-1.5 text-[10px] text-white/50">
              <p className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                256-Bit SSL Secured &bull; Verified Payment
              </p>
              <p className="inline-flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {formatDate(payment.date)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 min-w-[200px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Amount Paid (BDT)
                </span>
                <span className="text-xl font-black text-white tracking-tight">
                  {formatBDT(payment.amount)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider mt-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {payment.status}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-0 pb-2 border-t border-white/10 text-center text-[9px] text-white/40">
            Thank you for choosing Fitora &bull; For support email support@fitora.com
            &bull; All fees are in Bangladeshi Taka (BDT)
          </div>
        </div>

        {/* ── Action Buttons (screen only) ── */}
        <div className="flex gap-2.5 items-center justify-end pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-neutral-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer print-hide"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer shadow-xl print-hide"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}