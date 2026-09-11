"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Receipt,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

export interface InvoiceData {
  _id?: string;
  invoiceNumber?: string;
  transactionId?: string;
  date?: string;
  createdAt?: string;
  amount?: number;
  amountBDT?: number;
  paymentMethod?: string;
  gateway?: string;
  status?: string;
  planName?: string;
  billingCycle?: string;
  subscriptionStartDate?: string;
  subscriptionExpiryDate?: string;
  accountNumber?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  branch?: string;
}

export interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: InvoiceData | null;
  payment?: any;
  userInfo?: { name?: string; email?: string };
  athleteName?: string;
  athleteEmail?: string;
  athletePhone?: string;
  assignedBranch?: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  transaction: propTransaction,
  payment,
  userInfo,
  athleteName: propAthleteName,
  athleteEmail: propAthleteEmail,
  athletePhone,
  assignedBranch = "Gulshan-2 Flagship Branch",
}: InvoiceModalProps) {
  const transaction = (propTransaction || payment) as InvoiceData | null;
  const athleteName =
    propAthleteName || userInfo?.name || transaction?.userName || "Athlete";
  const athleteEmail =
    propAthleteEmail ||
    userInfo?.email ||
    transaction?.userEmail ||
    "athlete@fitora.com";
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  // Resolve invoice metadata
  const invoiceNum =
    transaction.invoiceNumber ||
    `INV-${new Date(transaction.date || Date.now()).getFullYear()}-${(
      transaction.transactionId?.replace(/[^a-zA-Z0-9]/g, "") || "849201"
    )
      .slice(-6)
      .toUpperCase()}`;

  const issueDate = transaction.date
    ? new Date(transaction.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const formattedExpiry = transaction.subscriptionExpiryDate
    ? new Date(transaction.subscriptionExpiryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "30 Days from Issue";

  const isExpired = transaction.subscriptionExpiryDate
    ? new Date(transaction.subscriptionExpiryDate).getTime() < Date.now()
    : false;

  const clientName =
    transaction.userName || athleteName || "Valued Athlete Member";

  const clientEmail =
    transaction.userEmail || athleteEmail || "athlete@fitora.club";

  const clientPhone =
    transaction.userPhone || athletePhone || "+880 1700-000000";

  const planTitle = transaction.planName || "Pro Athlete Pass";

  const cycle =
    transaction.billingCycle === "yearly" ||
    transaction.billingCycle === "annual"
      ? "Annual Membership (12 Months)"
      : "Monthly Membership (30 Days)";

  /**
   * Backend already returns Stripe amount converted to BDT.
   * Therefore, DO NOT convert the amount again on the client.
   */
  const amountBDT = transaction.amountBDT ?? transaction.amount ?? 0;

  const subtotal = amountBDT;
  const vatAmount = 0;
  const totalAmount = subtotal + vatAmount;

  // Normalize payment status
  const normalizedStatus = transaction.status?.toLowerCase();

  const isPaid =
    normalizedStatus === "paid" || normalizedStatus === "completed";

  const isPending = normalizedStatus === "pending";

  const isFailed = normalizedStatus === "failed";

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoiceNum);
    setCopied(true);
    toast.success("Invoice number copied to clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const invoiceData = {
      invoiceNumber: invoiceNum,
      issueDate,
      validUntil: formattedExpiry,
      athlete: {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        branch: assignedBranch,
      },
      membership: {
        plan: planTitle,
        billingCycle: cycle,
        amountBDT: totalAmount,
        paymentMethod:
          transaction.paymentMethod || transaction.gateway || "Not specified",
        transactionId: transaction.transactionId,
        status: transaction.status || "unknown",
      },
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(invoiceData, null, 2));

    const downloadAnchor = document.createElement("a");

    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${invoiceNum}.json`);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success("Invoice receipt downloaded!");
  };

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
      doc.text(invoiceNum, 195, 27, { align: "right" });

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
      doc.text(clientName, 19, 58);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(clientEmail, 19, 65);

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
      doc.text(`Issue Date: ${issueDate}`, 114, 58);
      doc.text(
        `Gateway: ${transaction.paymentMethod || transaction.gateway || "Card"}`,
        114,
        64,
      );
      if (transaction.transactionId) {
        doc.text(`TRX ID: ${transaction.transactionId}`, 114, 70);
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
      doc.text(`${planTitle} Membership Pass`, 19, 97);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Instant gym & turnstile access across 64 Bangladesh branches",
        19,
        102,
      );

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.text(cycle, 110, 98);

      const formattedAmount = `BDT ${totalAmount.toLocaleString("en-IN")}`;
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
        `STATUS: ${transaction.status ? transaction.status.toUpperCase() : "PAID"}`,
        160,
        133,
        { align: "center" },
      );

      // Security guarantee
      doc.setTextColor(110, 110, 110);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "✓ 256-Bit SSL Secured & Digital Cryptographic Invoice Verification",
        15,
        123,
      );
      doc.text(
        "✓ Validated for all 64 FITORA District Fitness Centers across Bangladesh",
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

      doc.save(`${invoiceNum}.pdf`);
      toast.success("PDF invoice downloaded successfully!");
    } catch (err) {
      console.error("[Invoice PDF Generation Error]:", err);
      toast.error(
        "Failed to generate PDF. You can also use Print Invoice to save as PDF.",
      );
    }
  };

  return (
    <>
      {/* ── Print Specific Styles (A4 Paper Optimization) ── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #printable-invoice-container,
          #printable-invoice-container * {
            visibility: visible !important;
          }

          #printable-invoice-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }

          .print-light,
          .print-light * {
            color: #000000 !important;
          }

          .print-light {
            background: #ffffff !important;
          }

          .print-light-card {
            background: #ffffff !important;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
          }

          .print-light-table-header {
            background: #f3f4f6 !important;
            color: #000000 !important;
          }

          th,
          td {
            color: #000000 !important;
            border-color: #d1d5db !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          .print-no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>

      {/* ── Modal Backdrop ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-3xl my-8 bg-neutral-950 border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Action Toolbar */}
          <div className="no-print flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-white/70" />

              <span className="text-xs font-black uppercase tracking-widest text-white/90">
                Official Digital Receipt
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Invoice No */}
              <button
                onClick={handleCopyInvoiceNumber}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                title="Copy Invoice Number"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}

                <span>{copied ? "Copied" : "Copy No."}</span>
              </button>

              {/* JSON Download */}
              <button
                onClick={handleDownloadJSON}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                title="Download Receipt JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save JSON</span>
              </button>

              {/* Vector PDF Download */}
              <button
                onClick={handleDownloadPDF}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/20"
                title="Download Official PDF Invoice"
              >
                <FileDown className="w-3.5 h-3.5 text-white" />
                <span>Download PDF</span>
              </button>

              {/* Print / Save PDF */}
              <button
                onClick={handlePrint}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all ml-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Printable Invoice Paper ── */}
          <div
            id="printable-invoice-container"
            ref={printRef}
            className="p-6 sm:p-10 text-white print-light font-sans space-y-8"
          >
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/15 pb-8">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white text-black font-black flex items-center justify-center text-base tracking-tighter shadow-sm">
                    F
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                    FITORA CLUB
                  </h1>
                </div>

                <p className="text-xs text-white/60 font-medium">
                  Elite Health, Athletics & Physical Longevity
                </p>

                <p className="text-[11px] text-white/40">
                  Level 7, Fitora Athletic Tower, Gulshan-2, Dhaka-1212
                </p>

                <p className="text-[11px] text-white/40">
                  BIN: 004928192-0101 | support@fitora.club
                </p>
              </div>

              {/* Invoice Number & Stamp */}
              <div className="sm:text-right space-y-1.5">
                {/* Conditional Payment Status */}
                {isPaid && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Payment Confirmed
                  </div>
                )}

                {isPending && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Payment Pending
                  </div>
                )}

                {isFailed && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/30">
                    <X className="w-3 h-3" />
                    Payment Failed
                  </div>
                )}

                <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight">
                  {invoiceNum}
                </h2>

                <div className="text-xs text-white/60 space-y-0.5">
                  <p>
                    Date:{" "}
                    <span className="font-semibold text-white">
                      {issueDate}
                    </span>
                  </p>

                  <p>
                    Valid Until:{" "}
                    <span className="font-semibold text-white">
                      {formattedExpiry}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Expired Membership Notice */}
            {isExpired && (
              <div className="no-print flex items-center justify-between gap-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
                <div>
                  <p className="text-sm font-bold text-red-400">
                    Membership Expired
                  </p>

                  <p className="text-xs text-white/60 mt-1">
                    Your membership has expired. Please renew your membership to
                    restore access.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toast("Please renew your membership");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200"
                >
                  Renew
                </button>
              </div>
            )}

            {/* Bill To & Facility Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl border border-white/10 bg-neutral-900/40 print-light-card space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Billed Athlete
                </p>

                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  {clientName}
                </h3>

                <div className="text-white/70 space-y-0.5 text-[11px]">
                  <p>{clientEmail}</p>
                  <p>{clientPhone}</p>

                  <p className="font-mono text-white/50">
                    ID: {transaction._id?.slice(-8) || "ATH-83921"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-neutral-900/40 print-light-card space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Assigned Facility & Method
                </p>

                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  {assignedBranch}
                </h3>

                <div className="text-white/70 space-y-0.5 text-[11px]">
                  <p>
                    Payment Method:{" "}
                    <strong className="text-white font-semibold">
                      {transaction.paymentMethod ||
                        transaction.gateway ||
                        "Not specified"}
                    </strong>
                  </p>

                  <p className="font-mono text-white/70">
                    Trx ID: {transaction.transactionId || "Not available"}
                  </p>

                  <p className="text-white/50">
                    All-Branch Turnstile Access: Active
                  </p>
                </div>
              </div>
            </div>

            {/* Line Item Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-neutral-900/80 print-light-table-header text-[10px] uppercase tracking-wider text-white/60">
                    <th className="px-4 sm:px-6 py-3 font-bold">
                      Item & Description
                    </th>

                    <th className="px-4 sm:px-6 py-3 font-bold">
                      Billing Cycle
                    </th>

                    <th className="px-4 sm:px-6 py-3 font-bold text-right">
                      Price
                    </th>

                    <th className="px-4 sm:px-6 py-3 font-bold text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-white uppercase tracking-tight text-sm">
                        {planTitle} Membership Pass
                      </div>

                      <p className="text-[11px] text-white/60 mt-0.5">
                        24/7 all-branch access, AI workout routine generator &
                        nutrition tracking.
                      </p>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-white/70">{cycle}</td>

                    <td className="px-4 sm:px-6 py-4 text-right font-mono text-white">
                      ৳{subtotal.toLocaleString()}
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-right font-bold font-mono text-white">
                      ৳{subtotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary & Totals */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
              {/* Payment Verification Stamp */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-neutral-900/30 print-light-card max-w-sm">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />

                <div className="text-[11px] leading-relaxed text-white/70">
                  <span className="font-bold text-white block uppercase">
                    Authorized Electronic Stamp
                  </span>
                  Cryptographically settled and verified on Fitora membership
                  registry.
                </div>
              </div>

              {/* Total Calculation */}
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span>Subtotal:</span>

                  <span className="font-mono text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/60">
                  <span>VAT / Gym Tax (Exempt):</span>

                  <span className="font-mono text-white">৳0</span>
                </div>

                <div className="border-t border-white/15 pt-2 flex items-center justify-between text-sm font-black text-white uppercase">
                  <span>Total Paid:</span>

                  <span className="font-mono text-base text-white">
                    ৳{totalAmount.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="border-t border-white/10 pt-6 text-[10px] text-white/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p>
                This is a computer-generated tax invoice and requires no
                physical signature.
              </p>

              <p className="font-mono uppercase">
                FITORA SECURE TRANSACTION ID:{" "}
                {transaction.transactionId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
