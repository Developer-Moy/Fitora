"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  Calendar,
  CreditCard,
  Download,
} from "lucide-react";
import type { Payment } from "@/services/paymentService";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

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

  const invoiceNumber =
    payment.invoiceNumber ||
    `FIT-INV-${String(payment.date)
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

  /** Generate and directly download high-resolution Vector PDF */
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header black bar
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 210, 36, "F");

      // Brand: FITORA GYM & AI
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("FITORA GYM & AI", 15, 18);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      doc.text(
        "Fitora Tower, Gulshan-2, Dhaka 1212 | 64 Branches Nationwide",
        15,
        27,
      );

      // Official Invoice Header (Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text("OFFICIAL INVOICE", 195, 18, { align: "right" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(220, 220, 220);
      doc.text(invoiceNumber, 195, 27, { align: "right" });

      // Customer Info Box
      doc.setFillColor(248, 248, 248);
      doc.setDrawColor(225, 225, 225);
      doc.roundedRect(15, 44, 85, 28, 2, 2, "FD");

      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("BILLED TO", 19, 51);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(userInfo.name || "Fitora Athlete", 19, 58);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(userInfo.email || "athlete@fitora.com", 19, 65);

      // Invoice Details Box
      doc.setFillColor(248, 248, 248);
      doc.setDrawColor(225, 225, 225);
      doc.roundedRect(110, 44, 85, 28, 2, 2, "FD");

      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("TRANSACTION DETAILS", 114, 51);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Issue Date: ${formatDate(payment.date)}`, 114, 58);
      doc.text(`Gateway: ${payment.gateway || "Card"}`, 114, 64);
      if (payment.transactionId) {
        doc.text(`TRX ID: ${payment.transactionId}`, 114, 70);
      }

      // Line items table header
      doc.setFillColor(0, 0, 0);
      doc.rect(15, 80, 180, 9, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("DESCRIPTION", 19, 86);
      doc.text("BILLING CYCLE", 110, 86);
      doc.text("AMOUNT (BDT)", 191, 86, { align: "right" });

      // Item row
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 230, 230);
      doc.rect(15, 89, 180, 16, "FD");

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${payment.plan} Membership Pass`, 19, 97);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        payment.description || "Instant gym & turnstile access nationwide",
        19,
        102,
      );

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.text(payment.billingCycle || "Monthly", 110, 98);

      const formattedAmount = `BDT ${(payment.amount || 0).toLocaleString("en-IN")}`;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(formattedAmount, 191, 98, { align: "right" });

      // Total block
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(125, 115, 70, 24, 2, 2, "F");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text("TOTAL PAID (BDT)", 130, 123);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(formattedAmount, 190, 125, { align: "right" });

      // Status indicator inside PDF
      doc.setFillColor(235, 255, 240);
      doc.setDrawColor(34, 197, 94);
      doc.roundedRect(130, 128, 60, 7, 2, 2, "FD");
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(
        `STATUS: ${payment.status ? payment.status.toUpperCase() : "PAID"}`,
        160,
        133,
        { align: "center" },
      );

      // Security guarantee
      doc.setTextColor(110, 110, 110);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "256-Bit SSL Secured & Digital Cryptographic Invoice Verification",
        15,
        123,
      );
      doc.text(
        "Validated for all 64 FITORA District Fitness Centers across Bangladesh",
        15,
        129,
      );

      // Bottom footer
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 260, 195, 260);

      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(
        "FITORA Fitness Technologies Ltd. - For billing queries, email: billing@fitora.com",
        105,
        266,
        { align: "center" },
      );
      doc.text(
        "Official Digital Tax Invoice - Generated dynamically via FITORA Central Billing Engine",
        105,
        272,
        { align: "center" },
      );

      doc.save(`${invoiceNumber}.pdf`);
      toast.success("PDF invoice downloaded successfully!");
    } catch (err) {
      console.error("[Invoice PDF Generation Error]:", err);
      toast.error(
        "Failed to generate PDF. You can also use Print Invoice to save as PDF.",
      );
    }
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
              <p className="text-xs text-white/60">{userInfo.email || ""}</p>
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
                    {payment.description ||
                      `${payment.plan} membership payment`}
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
            Thank you for choosing Fitora &bull; For support email
            support@fitora.com &bull; All fees are in Bangladeshi Taka (BDT)
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
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 border border-white/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer shadow-md print-hide"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
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
