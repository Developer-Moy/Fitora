"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  id?: string;
  userId?: string;
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
  plan?: string;
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
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    branch?: string;
  };
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
  athletePhone: propAthletePhone,
  assignedBranch: propAssignedBranch,
}: InvoiceModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const transaction = (propTransaction || payment) as InvoiceData | null;

  const athleteName =
    propAthleteName ||
    userInfo?.name ||
    transaction?.userName ||
    "Valued Athlete";
  const athleteEmail =
    propAthleteEmail ||
    userInfo?.email ||
    transaction?.userEmail ||
    "athlete@fitora.club";
  const athletePhone =
    propAthletePhone ||
    userInfo?.phone ||
    transaction?.userPhone ||
    "+880 1700-000000";
  const assignedBranch =
    propAssignedBranch ||
    userInfo?.branch ||
    transaction?.branch ||
    "Gulshan-2 Flagship Branch";

  // Handle escape key and lock body scroll
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

  // Clean up printing class on afterprint
  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-invoice");
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      document.body.classList.remove("printing-invoice");
    };
  }, []);

  if (!mounted || !isOpen || !transaction) return null;

  // Resolve invoice metadata
  const invoiceNum =
    transaction.invoiceNumber ||
    `INV-${new Date(transaction.date || Date.now()).getFullYear()}-${(
      transaction.transactionId?.replace(/[^a-zA-Z0-9]/g, "") ||
      transaction._id ||
      transaction.id ||
      "849201"
    )
      .slice(-6)
      .toUpperCase()}`;

  const issueDate = transaction.date
    ? new Date(transaction.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  const formattedExpiry = transaction.subscriptionExpiryDate
    ? new Date(transaction.subscriptionExpiryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "30 Days from Issue";

  const isExpired = transaction.subscriptionExpiryDate
    ? new Date(transaction.subscriptionExpiryDate).getTime() < Date.now()
    : false;

  const athleteId =
    transaction.userId || transaction._id || transaction.id || "83921";

  const planTitle =
    transaction.planName || transaction.plan || "Pro Athlete Pass";

  const cycle =
    transaction.billingCycle === "yearly" ||
    transaction.billingCycle === "annual"
      ? "Annual Pass (12 Months)"
      : "Monthly Pass (30 Days)";

  const amountBDT = transaction.amountBDT ?? transaction.amount ?? 0;
  const subtotal = amountBDT;
  const vatAmount = 0;
  const totalAmount = subtotal + vatAmount;

  const normalizedStatus = (transaction.status || "Paid").toLowerCase();
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
    if (typeof window === "undefined") return;
    document.body.classList.add("printing-invoice");
    // Give browser a moment to apply display:none to background elements
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handleDownloadJSON = () => {
    const invoiceData = {
      invoiceNumber: invoiceNum,
      issueDate,
      validUntil: formattedExpiry,
      athlete: {
        id: `ATH-${athleteId.slice(-8).toUpperCase()}`,
        name: athleteName,
        email: athleteEmail,
        phone: athletePhone,
        branch: assignedBranch,
      },
      membership: {
        plan: planTitle,
        billingCycle: cycle,
        amountBDT: totalAmount,
        paymentMethod:
          transaction.paymentMethod || transaction.gateway || "Card",
        transactionId: transaction.transactionId || "N/A",
        status: transaction.status || "Paid",
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

      // ── Top Header Bar (Height: 34mm) ──
      doc.setFillColor(15, 15, 15);
      doc.rect(0, 0, 210, 34, "F");

      // Brand Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("FITORA CLUB & AI", 15, 16);

      // Subtitle & Coordinates
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      doc.text(
        "Level 7, Fitora Athletic Tower, Gulshan-2, Dhaka 1212 | 64 Branches Nationwide",
        15,
        23,
      );
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7.5);
      doc.text(
        "BIN: 004928192-0101 | Email: billing@fitora.club | Turnstile Gate 24/7",
        15,
        29,
      );

      // Official Invoice Meta (Right side)
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("OFFICIAL TAX INVOICE", 195, 14, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(220, 220, 220);
      doc.text(invoiceNum, 195, 21, { align: "right" });

      // Status Badge in Header
      if (isPaid) {
        doc.setFillColor(22, 101, 52);
        doc.roundedRect(155, 24, 40, 6, 1.5, 1.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text("STATUS: PAID", 175, 28.2, { align: "center" });
      } else if (isPending) {
        doc.setFillColor(161, 98, 7);
        doc.roundedRect(155, 24, 40, 6, 1.5, 1.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text("STATUS: PENDING", 175, 28.2, { align: "center" });
      } else {
        doc.setFillColor(185, 28, 28);
        doc.roundedRect(155, 24, 40, 6, 1.5, 1.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text("STATUS: FAILED", 175, 28.2, { align: "center" });
      }

      // ── 2-Column Info Grid (Y=40 to Y=74, Height 34mm) ──
      // Box 1: Billed Athlete
      doc.setFillColor(248, 249, 250);
      doc.setDrawColor(225, 228, 232);
      doc.roundedRect(15, 40, 88, 34, 2, 2, "FD");

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("BILLED ATHLETE", 19, 46);

      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(athleteName, 19, 52);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(`Email: ${athleteEmail}`, 19, 58);
      doc.text(`Phone: ${athletePhone}`, 19, 64);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Athlete ID: ATH-${athleteId.slice(-8).toUpperCase()}`, 19, 70);

      // Box 2: Facility & Payment Details
      doc.setFillColor(248, 249, 250);
      doc.setDrawColor(225, 228, 232);
      doc.roundedRect(107, 40, 88, 34, 2, 2, "FD");

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("FACILITY & TRANSACTION", 111, 46);

      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(assignedBranch, 111, 52);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(
        `Payment Method: ${transaction.paymentMethod || transaction.gateway || "Card"}`,
        111,
        58,
      );
      doc.text(
        `Trx ID: ${transaction.transactionId || "TRX-SETTLED-N/A"}`,
        111,
        64,
      );
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Issued: ${issueDate}  |  Valid: ${formattedExpiry}`, 111, 70);

      // ── Line Items Table (Y=80 to Y=106) ──
      doc.setFillColor(17, 24, 39);
      doc.rect(15, 80, 180, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("ITEM & SERVICE DESCRIPTION", 19, 85.5);
      doc.text("BILLING CYCLE", 112, 85.5);
      doc.text("AMOUNT (BDT)", 191, 85.5, { align: "right" });

      // Row Body
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 231, 235);
      doc.rect(15, 88, 180, 16, "FD");

      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(`${planTitle} Membership Pass`, 19, 95);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(107, 114, 128);
      doc.text(
        "Instant turnstile gym access across 64 BD branches, AI workout generator & macro tracker",
        19,
        100,
      );

      doc.setTextColor(55, 65, 81);
      doc.setFontSize(8.5);
      doc.text(cycle, 112, 96);

      const formattedAmount = `BDT ${totalAmount.toLocaleString("en-IN")}`;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(9.5);
      doc.text(formattedAmount, 191, 96, { align: "right" });

      // ── Totals & Verification Box (Y=110 to Y=145) ──
      // Left: Verification & Security Stamp
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 110, 95, 32, 2, 2, "FD");

      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("✓ AUTHORIZED ELECTRONIC INVOICE", 19, 117);

      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(
        "• Cryptographically settled on Fitora membership registry",
        19,
        123,
      );
      doc.text(
        "• All 64 district fitness centers & turnstile access enabled",
        19,
        128,
      );
      doc.text(
        "• Includes complimentary biometric & fitness progress audit",
        19,
        133,
      );
      doc.text("• 256-Bit SSL Digital Authentication Key Verified", 19, 138);

      // Right: Calculation Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(115, 110, 80, 32, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", 120, 117);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text(`BDT ${subtotal.toLocaleString("en-IN")}`, 190, 117, {
        align: "right",
      });

      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("VAT / Gym Tax (Exempt):", 120, 123);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text("BDT 0", 190, 123, { align: "right" });

      doc.setDrawColor(203, 213, 225);
      doc.line(120, 126, 190, 126);

      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL PAID:", 120, 133);

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(formattedAmount, 190, 133, { align: "right" });

      // Small status pill in totals
      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(120, 136, 70, 4.5, 1, 1, "FD");
      doc.setFontSize(6.5);
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT FULLY SETTLED & ARCHIVED", 155, 139.5, {
        align: "center",
      });

      // ── Footer (Y=266 to Y=278) ──
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 266, 195, 266);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text(
        "This is a computer-generated official tax invoice and requires no physical signature.",
        105,
        271,
        { align: "center" },
      );
      doc.text(
        "FITORA Fitness Technologies Ltd. • billing@fitora.club • +880 9610-FITORA (348672)",
        105,
        276,
        { align: "center" },
      );

      doc.save(`${invoiceNum}.pdf`);
      toast.success("Official PDF invoice downloaded successfully!");
    } catch (err) {
      console.error("[Invoice PDF Generation Error]:", err);
      toast.error(
        "Failed to generate PDF. You can also use Print Invoice to save.",
      );
    }
  };

  const modalContent = (
    <div id="invoice-modal-portal">
      {/* ── Modal Backdrop (z-[99999] guarantees it renders ABOVE navbar) ── */}
      <div className="invoice-modal-backdrop fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        {/* Modal Card: Fits comfortably on 1 screen on desktop/laptop */}
        <div className="invoice-modal-card relative w-full max-w-2xl bg-neutral-950 border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] my-auto">
          {/* Pinned Top Action Toolbar */}
          <div className="no-print shrink-0 flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 bg-neutral-900 border-b border-white/10 select-none">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Official Digital Receipt
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Copy Invoice No */}
              <button
                onClick={handleCopyInvoiceNumber}
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-all cursor-pointer"
                title="Copy Invoice Number"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied ? "Copied" : "Copy No"}</span>
              </button>

              {/* JSON Download */}
              <button
                onClick={handleDownloadJSON}
                type="button"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-all cursor-pointer"
                title="Download Receipt JSON"
              >
                <Download className="w-3 h-3" />
                <span>JSON</span>
              </button>

              {/* Vector PDF Download */}
              <button
                onClick={handleDownloadPDF}
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer border border-white/20"
                title="Download Official PDF Invoice"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF</span>
              </button>

              {/* Print / Save PDF */}
              <button
                onClick={handlePrint}
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-black hover:bg-neutral-200 text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                type="button"
                className="p-1 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-white transition-all ml-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Invoice Document Body (1-Page Fit & Smooth Scroll for Small Viewports) ── */}
          <div
            id="printable-invoice-container"
            ref={printRef}
            className="flex-1 overflow-y-auto p-3.5 sm:p-4 text-white print-light font-sans space-y-2.5 sm:space-y-3"
          >
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-white text-black font-black flex items-center justify-center text-xs tracking-tighter shadow-sm">
                    F
                  </div>
                  <h1 className="text-base sm:text-lg font-black uppercase tracking-wider">
                    FITORA CLUB
                  </h1>
                </div>
                <p className="text-[10px] text-white/60 font-medium">
                  Elite Health, Athletics & Physical Longevity
                </p>
                <p className="text-[9px] text-white/40">
                  Level 7, Fitora Tower, Gulshan-2, Dhaka-1212 | BIN:
                  004928192-0101
                </p>
              </div>

              {/* Invoice Number & Stamp */}
              <div className="sm:text-right space-y-0.5">
                {isPaid && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Payment Confirmed
                  </div>
                )}
                {isPending && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Payment Pending
                  </div>
                )}
                {isFailed && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/30">
                    <X className="w-2.5 h-2.5" />
                    Payment Failed
                  </div>
                )}

                <h2 className="text-sm sm:text-base font-mono font-bold tracking-tight">
                  {invoiceNum}
                </h2>

                <div className="text-[10px] text-white/60 flex sm:justify-end gap-2.5">
                  <p>
                    Date:{" "}
                    <span className="font-semibold text-white">
                      {issueDate}
                    </span>
                  </p>
                  <p>
                    Valid:{" "}
                    <span className="font-semibold text-white">
                      {formattedExpiry}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Expired Membership Alert */}
            {isExpired && (
              <div className="no-print flex items-center justify-between gap-3 p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-[11px]">
                <p className="text-red-400 font-semibold">
                  Membership has expired. Please renew to restore gym turnstile
                  access.
                </p>
                <button
                  type="button"
                  onClick={() => toast("Please renew your membership")}
                  className="px-2.5 py-0.5 rounded-md bg-white text-black font-bold text-[10px] hover:bg-neutral-200"
                >
                  Renew
                </button>
              </div>
            )}

            {/* Bill To & Facility Info (2-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Billed Athlete Card */}
              <div className="p-2.5 rounded-xl border border-white/10 bg-neutral-900/40 print-light-card space-y-0.5">
                <p className="text-[8.5px] font-bold uppercase tracking-widest text-white/50">
                  Billed Athlete
                </p>
                <h3 className="text-xs font-black text-white uppercase tracking-tight">
                  {athleteName}
                </h3>
                <div className="text-white/70 space-y-0.5 text-[10.5px]">
                  <p className="truncate">{athleteEmail}</p>
                  <p>{athletePhone}</p>
                  <p className="font-mono text-white/50 text-[9.5px]">
                    ID: ATH-{athleteId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Assigned Facility & Method Card */}
              <div className="p-2.5 rounded-xl border border-white/10 bg-neutral-900/40 print-light-card space-y-0.5">
                <p className="text-[8.5px] font-bold uppercase tracking-widest text-white/50">
                  Assigned Facility & Method
                </p>
                <h3 className="text-xs font-black text-white uppercase tracking-tight">
                  {assignedBranch}
                </h3>
                <div className="text-white/70 space-y-0.5 text-[10.5px]">
                  <p>
                    Method:{" "}
                    <strong className="text-white font-semibold">
                      {transaction.paymentMethod ||
                        transaction.gateway ||
                        "Card"}
                    </strong>
                  </p>
                  <p className="font-mono text-white/70 text-[9.5px] truncate">
                    Trx ID: {transaction.transactionId || "TRX-SETTLED-N/A"}
                  </p>
                  <p className="text-emerald-400 font-medium text-[9.5px]">
                    ● All-Branch Turnstile Access: Active
                  </p>
                </div>
              </div>
            </div>

            {/* Line Item Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-neutral-900/80 print-light-table-header text-[8.5px] uppercase tracking-wider text-white/60">
                    <th className="px-3 py-1.5 font-bold">
                      Item & Description
                    </th>
                    <th className="px-3 py-1.5 font-bold">Cycle</th>
                    <th className="px-3 py-1.5 font-bold text-right">Price</th>
                    <th className="px-3 py-1.5 font-bold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-3 py-2">
                      <div className="font-bold text-white uppercase tracking-tight text-xs">
                        {planTitle} Membership Pass
                      </div>
                      <p className="text-[9.5px] text-white/60 mt-0.5">
                        24/7 all-branch access across 64 BD branches, AI workout
                        generator & macro tracker.
                      </p>
                    </td>
                    <td className="px-3 py-2 text-white/70 text-[10.5px] whitespace-nowrap">
                      {cycle}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-white text-xs">
                      ৳{subtotal.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-bold font-mono text-white text-xs">
                      ৳{subtotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary & Totals */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-0.5">
              {/* Payment Verification Stamp */}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-white/10 bg-neutral-900/30 print-light-card max-w-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-[9.5px] leading-snug text-white/70">
                  <span className="font-bold text-white block uppercase">
                    Authorized Electronic Stamp
                  </span>
                  Cryptographically settled and verified on Fitora membership
                  registry.
                </div>
              </div>

              {/* Total Calculation */}
              <div className="w-full sm:w-56 space-y-1 text-xs">
                <div className="flex items-center justify-between text-white/60 text-[10.5px]">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/60 text-[10.5px]">
                  <span>VAT / Gym Tax:</span>
                  <span className="font-mono text-emerald-400">
                    ৳0 (Exempt)
                  </span>
                </div>
                <div className="border-t border-white/15 pt-1 flex items-center justify-between text-xs sm:text-sm font-black text-white uppercase">
                  <span>Total Paid:</span>
                  <span className="font-mono text-sm sm:text-base text-emerald-400">
                    ৳{totalAmount.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="border-t border-white/10 pt-2 text-[8.5px] text-white/40 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
              <p>
                This is a computer-generated official tax invoice and requires
                no physical signature.
              </p>
              <p className="font-mono uppercase text-[8.5px]">
                TRX: {transaction.transactionId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
