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
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export interface InvoiceData {
  _id?: string;
  invoiceNumber?: string;
  transactionId?: string;
  date?: string;
  amount?: number;
  paymentMethod?: string;
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

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: InvoiceData | null;
  athleteName?: string;
  athleteEmail?: string;
  athletePhone?: string;
  assignedBranch?: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  transaction,
  athleteName,
  athleteEmail,
  athletePhone,
  assignedBranch = "Gulshan-2 Flagship Branch",
}: InvoiceModalProps) {
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  const clientName =
    transaction.userName || athleteName || "Valued Athlete Member";
  const clientEmail = transaction.userEmail || athleteEmail || "athlete@fitora.club";
  const clientPhone = transaction.userPhone || athletePhone || "+880 1700-000000";
  const planTitle = transaction.planName || "Pro Athlete Pass";
  const cycle =
    transaction.billingCycle === "yearly" || transaction.billingCycle === "annual"
      ? "Annual Membership (12 Months)"
      : "Monthly Membership (30 Days)";
  const amountBDT = transaction.amount || 5880;
  const subtotal = amountBDT;
  const vatAmount = 0; // Tax exempted athletic wellness pass
  const totalAmount = subtotal + vatAmount;

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoiceNum);
    setCopied(true);
    toast.success("Invoice number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
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
              paymentMethod: transaction.paymentMethod,
              transactionId: transaction.transactionId,
              status: "PAID",
            },
          },
          null,
          2,
        ),
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${invoiceNum}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Invoice receipt downloaded!");
  };

  return (
    <>
      {/* ── Print Specific Styles (A4 Paper Optimization) ── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice-container,
          #printable-invoice-container * {
            visibility: visible;
          }
          #printable-invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-light {
            background: white !important;
            color: #000000 !important;
            border-color: #e5e7eb !important;
            box-shadow: none !important;
          }
          .print-light text,
          .print-light p,
          .print-light span,
          .print-light h1,
          .print-light h2,
          .print-light h3,
          .print-light h4,
          .print-light td,
          .print-light th {
            color: #000000 !important;
          }
          .print-light-table-header {
            background-color: #f3f4f6 !important;
            color: #000000 !important;
          }
          .print-light-card {
            border: 1px solid #d1d5db !important;
            background: #fafafa !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* ── Modal Backdrop ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-3xl my-8 bg-neutral-950 border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Action Toolbar (Hidden during physical print) */}
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Payment Confirmed
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight">
                  {invoiceNum}
                </h2>
                <div className="text-xs text-white/60 space-y-0.5">
                  <p>
                    Date: <span className="font-semibold text-white">{issueDate}</span>
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
                      {transaction.paymentMethod || "bKash"}
                    </strong>
                  </p>
                  <p className="font-mono text-white/70">
                    Trx ID: {transaction.transactionId || "TRX-VERIFIED-AUTO"}
                  </p>
                  <p className="text-white/50">All-Branch Turnstile Access: Active</p>
                </div>
              </div>
            </div>

            {/* Line Item Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-neutral-900/80 print-light-table-header text-[10px] uppercase tracking-wider text-white/60">
                    <th className="px-4 sm:px-6 py-3 font-bold">Item & Description</th>
                    <th className="px-4 sm:px-6 py-3 font-bold">Billing Cycle</th>
                    <th className="px-4 sm:px-6 py-3 font-bold text-right">Price</th>
                    <th className="px-4 sm:px-6 py-3 font-bold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-white uppercase tracking-tight text-sm">
                        {planTitle} Membership Pass
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        24/7 all-branch access, AI workout routine generator & nutrition tracking.
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
                  Cryptographically settled and verified on Fitora membership registry.
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
                This is a computer-generated tax invoice and requires no physical signature.
              </p>
              <p className="font-mono uppercase">
                FITORA SECURE TRANSACTION ID: {transaction.transactionId || "TRX-OK"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
