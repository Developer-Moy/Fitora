"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Printer,
  FileText,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchMyPaymentsApi,
  derivePaymentFromUser,
  toggleAutoRenewApi,
  changeMembershipPlanApi,
  type Payment,
} from "@/services/paymentService";
import {
  getAuthSession,
  saveAuthSession,
  AUTH_SESSION_UPDATED,
} from "@/services/authService";
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

  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    phone?: string;
    branch?: string;
  }>({
    name: "",
    email: "",
    phone: "",
    branch: "",
  });

  // Subscription management state
  const [currentPlan, setCurrentPlan] = useState<string>("Free Pass");
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isTogglingAutoRenew, setIsTogglingAutoRenew] =
    useState<boolean>(false);
  const [planModalOpen, setPlanModalOpen] = useState<boolean>(false);
  const [isChangingPlan, setIsChangingPlan] = useState<boolean>(false);

  useEffect(() => {
    const session = getAuthSession();
    const tok = session?.token || "";
    const user = session?.user || null;

    const loadPayments = async () => {
      setLoading(true);
      setError("");

      if (user) {
        setUserInfo({
          name: user.name || "",
          email: user.email || "",
          phone:
            (user as any).phone ||
            (user as any).phoneNumber ||
            "+880 1700-000000",
          branch:
            (user as any).assignedBranch ||
            (user as any).branch ||
            "Gulshan-2 Flagship Branch",
        });
        setCurrentPlan(user.plan || "Free Pass");
        setAutoRenew((user as any).autoRenew ?? true);
        setCancelAtPeriodEnd((user as any).cancelAtPeriodEnd ?? false);
        setExpiryDate(
          (user as any).subscriptionExpiryDate ||
            (user as any).membershipExpiresAt ||
            "",
        );
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

      // 2) Fallback: derive a payment record from the logged-in user's session
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

  const handleToggleAutoRenew = async () => {
    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      toast.error("Please login to manage your subscription");
      return;
    }

    setIsTogglingAutoRenew(true);
    try {
      const res = await toggleAutoRenewApi(token);
      if (res.success && res.data) {
        setAutoRenew(res.data.autoRenew);
        setCancelAtPeriodEnd(res.data.cancelAtPeriodEnd);
        toast.success(res.message || "Auto-renew status updated");

        if (session && session.user) {
          const updatedUser = {
            ...session.user,
            autoRenew: res.data.autoRenew,
            cancelAtPeriodEnd: res.data.cancelAtPeriodEnd,
          };
          saveAuthSession(token, updatedUser);
        }
      } else {
        toast.error(res.message || "Failed to update auto-renewal");
      }
    } catch {
      toast.error("Network error while updating auto-renewal");
    } finally {
      setIsTogglingAutoRenew(false);
    }
  };

  const handleChangePlan = async (planKey: string) => {
    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      toast.error("Please login to change plan");
      return;
    }

    setIsChangingPlan(true);
    try {
      const res = await changeMembershipPlanApi(token, planKey, "monthly");
      if (res.success && res.data?.user) {
        const u = res.data.user;
        setCurrentPlan(u.plan);
        setAutoRenew(u.autoRenew);
        setCancelAtPeriodEnd(u.cancelAtPeriodEnd);
        setExpiryDate(u.subscriptionExpiryDate || "");
        toast.success(res.message || "Plan updated successfully!");
        setPlanModalOpen(false);

        if (session && session.user) {
          const updatedUser = {
            ...session.user,
            plan: u.plan,
            role: u.role,
            autoRenew: u.autoRenew,
            cancelAtPeriodEnd: u.cancelAtPeriodEnd,
            subscriptionExpiryDate: u.subscriptionExpiryDate,
            membershipExpiresAt: u.membershipExpiresAt,
          };
          saveAuthSession(u.token || token, updatedUser);
        }
      } else {
        toast.error(res.message || "Failed to update membership plan");
      }
    } catch {
      toast.error("Network error while changing plan");
    } finally {
      setIsChangingPlan(false);
    }
  };

  const openInvoice = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const closeInvoice = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedPayment(null), 150);
  };

  const handlePrint = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        document.body.classList.add("printing-invoice");
        window.print();
      }
    }, 300);
  };

  const isPaidPlan = currentPlan !== "Free Pass" && currentPlan !== "";

  return (
    <div className="space-y-6">
      {/* ── Active Subscription Management Card ── */}
      <div className="rounded-2xl border border-white/20 bg-neutral-950 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-wider">
                {currentPlan}
              </span>

              {isPaidPlan && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                    cancelAtPeriodEnd
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cancelAtPeriodEnd
                        ? "bg-amber-400"
                        : "bg-emerald-400 animate-pulse"
                    }`}
                  />
                  {cancelAtPeriodEnd
                    ? "Canceling at Period End"
                    : "Auto-Renew Active"}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Membership &amp; Subscription Control
            </h3>

            <p className="text-xs text-white/60 max-w-xl">
              {isPaidPlan
                ? cancelAtPeriodEnd
                  ? `Your subscription is scheduled to end on ${formatDate(expiryDate)}. Your VIP and Pro perks remain 100% active until then.`
                  : `Your plan will automatically renew on ${formatDate(expiryDate)}. You can switch tiers or cancel renewal at any time with zero penalty.`
                : "You are currently on the Free Pass. Upgrade to a paid plan to unlock AI Coach Studio, custom rest presets, and advanced workout programs."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setPlanModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Plan</span>
            </button>

            {isPaidPlan && (
              <button
                type="button"
                onClick={handleToggleAutoRenew}
                disabled={isTogglingAutoRenew}
                className="px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:border-white/40 hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isTogglingAutoRenew ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : cancelAtPeriodEnd ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {cancelAtPeriodEnd
                    ? "Resume Auto-Renew"
                    : "Cancel Auto-Renew"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Plan Switcher Modal ── */}
      {planModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlanModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h4 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Switch Membership Plan
                </h4>
                <p className="text-xs text-white/50 mt-1">
                  Choose a new tier. Your benefits will be updated immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                className="text-white/40 hover:text-white text-sm font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: "basic_pass",
                  name: "Basic Pass",
                  price: "৳2,500/mo",
                  desc: "Essential gym access & casual workouts.",
                },
                {
                  id: "pro_athlete",
                  name: "Pro Athlete",
                  price: "৳4,900/mo",
                  desc: "AI coach studio, presets & full access.",
                },
                {
                  id: "vip_ultimate",
                  name: "VIP Ultimate",
                  price: "৳9,900/mo",
                  desc: "1-on-1 coaching & VIP master privileges.",
                },
              ].map((p) => {
                const isCurrent = currentPlan
                  .toLowerCase()
                  .includes(p.name.toLowerCase());
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                      isCurrent
                        ? "border-white bg-white/5"
                        : "border-white/15 bg-neutral-900/60 hover:border-white/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-black uppercase text-white">
                          {p.name}
                        </h5>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase bg-white text-black px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-base font-black text-white mt-1">
                        {p.price}
                      </p>
                      <p className="text-[11px] text-white/50 mt-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isCurrent || isChangingPlan}
                      onClick={() => handleChangePlan(p.id)}
                      className={`w-full py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? "bg-white/10 text-white/40 cursor-not-allowed"
                          : "bg-white text-black hover:bg-neutral-200"
                      }`}
                    >
                      {isChangingPlan ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isCurrent ? (
                        <span>Active Tier</span>
                      ) : (
                        <span>Select Plan</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
            className="group mt-2 inline-flex items-center gap-2.5 bg-white text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer shadow-xl"
          >
            <span>Upgrade Membership</span>
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </span>
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
                    typeof payment.status === "string"
                      ? payment.status
                      : "Paid";
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
                            <span className="hidden md:inline">
                              View Invoice
                            </span>
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
        athleteName={userInfo.name}
        athleteEmail={userInfo.email}
        athletePhone={userInfo.phone}
        assignedBranch={userInfo.branch}
        isOpen={modalOpen && !!selectedPayment}
        onClose={closeInvoice}
      />
    </div>
  );
}
