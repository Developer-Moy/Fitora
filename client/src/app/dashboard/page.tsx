"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboardRole, DashboardRole } from "@/hooks/useDashboardRole";
import {
  REVENUE_MONTHLY_CHART,
  INITIAL_CHECKINS,
} from "@/data/dashboardData";
import {
  fetchPlatformStats,
  type PlatformStats,
  type CheckInRecord,
  type PaymentGatewayBreakdown,
  type PackageSalesBreakdown,
} from "@/services/dashboardService";
import UserManagementTable from "@/components/dashboard/UserManagementTable";
import BranchManagementView from "@/components/dashboard/BranchManagementView";
import MemberDashboardView from "@/components/dashboard/MemberDashboardView";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Shield,
  Crown,
  User,
  Activity,
  QrCode,
  CreditCard,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function MasterDashboardPage() {
  const {
    role,
    setRole,
    assignedBranch,
    setAssignedBranch,
    userName,
    userEmail,
    isMasterAdmin,
    isBranchAdmin,
    isPremium,
    isFreeUser,
  } = useDashboardRole();

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as string | null;

  const [activeTab, setActiveTab] = useState<string>("overview");

  // ── Dynamic Platform Stats ───────────────────────────────────────────────
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(INITIAL_CHECKINS);
  const [gatewayBreakdown, setGatewayBreakdown] = useState<PaymentGatewayBreakdown[]>([]);
  const [packageBreakdown, setPackageBreakdown] = useState<PackageSalesBreakdown[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadPlatformStats = useCallback(async () => {
    if (role !== "master_admin" && role !== "branch_admin") return;
    setStatsLoading(true);
    const data = await fetchPlatformStats();
    if (data) {
      setPlatformStats(data.platformStats);
      if (data.recentCheckIns?.length > 0) setCheckIns(data.recentCheckIns);
      if (data.paymentGatewayBreakdown?.length > 0) setGatewayBreakdown(data.paymentGatewayBreakdown);
      if (data.packageSalesBreakdown?.length > 0) setPackageBreakdown(data.packageSalesBreakdown);
    }
    setStatsLoading(false);
  }, [role]);

  useEffect(() => {
    loadPlatformStats();
  }, [loadPlatformStats]);

  const [checkinPage, setCheckinPage] = useState<number>(1);
  const checkinsPerPage = 4;
  const totalCheckinPages = Math.ceil(checkIns.length / checkinsPerPage) || 1;
  const paginatedCheckins = checkIns.slice(
    (checkinPage - 1) * checkinsPerPage,
    checkinPage * checkinsPerPage,
  );

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);


  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. MEMBER VIEW (Free User & Premium User)
      ───────────────────────────────────────────────────────────── */}
      {(role === "premium_user" || role === "free_user") && (
        <>
          {activeTab === "branches" ? (
            <BranchManagementView currentRole={role} />
          ) : (
            <MemberDashboardView
              isPremium={role === "premium_user"}
              userName={userName}
              userEmail={userEmail}
              assignedBranch={assignedBranch}
              onUpgradeToPremium={() => setRole("premium_user")}
            />
          )}
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. ADMIN VIEW (Master Admin & Branch Admin)
      ───────────────────────────────────────────────────────────── */}
      {(role === "master_admin" || role === "branch_admin") && (
        <div className="space-y-8">
          {/* TAB 1: FINANCIAL & GROWTH OVERVIEW / REVENUE */}
          {(activeTab === "overview" || activeTab === "revenue") && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* 4 Core Financial KPIs (Luxury Monochrome with Green / Red numbers only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
                    <span>
                      {isMasterAdmin
                        ? "Total Platform Revenue"
                        : "Branch Revenue"}
                    </span>
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ৳{platformStats
                        ? (isMasterAdmin
                            ? platformStats.totalRevenueBDT
                            : platformStats.mrrBDT
                          ).toLocaleString("en-IN")
                        : isMasterAdmin ? "84,50,000" : "6,80,000"}
                    </span>
                  </div>
                  {/* Growth delta: ONLY Green or Red for numbers */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    <span>+{platformStats?.revenueGrowthPercent ?? 18.5}% Growth (Quarterly)</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
                    <span>Monthly Recurring (MRR)</span>
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ৳{platformStats
                        ? platformStats.mrrBDT.toLocaleString("en-IN")
                        : isMasterAdmin ? "14,20,000" : "1,95,000"}
                    </span>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    <span>+8.2% vs last month</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
                    <span>
                      {isMasterAdmin
                        ? "Total Active Members"
                        : "Branch Members"}
                    </span>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {platformStats
                        ? (isMasterAdmin
                            ? platformStats.totalMembers
                            : platformStats.activeMembersToday
                          ).toLocaleString()
                        : isMasterAdmin ? "4,850" : "480"}
                    </span>
                    <span className="text-xs font-black text-white/40 ml-2 uppercase">
                      Athletes
                    </span>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    <span>+{platformStats?.membersGrowthPercent ?? 12.3}% New Signups</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
                    <span>Free ➔ Pro Conversion</span>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {platformStats?.conversionRatePercent ?? 24.8}%
                    </span>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    <span>+3.5% Conversion Boost</span>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue Progression Chart (Monochrome Luxury Theme) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-base uppercase tracking-tight text-white">
                      Monthly Financial Progression (2025)
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Revenue volume vs Net Operational Margin across all
                      branches.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-white" />
                      <span className="text-white">Revenue (BDT)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-neutral-600" />
                      <span className="text-white/60">Net Profit</span>
                    </div>
                  </div>
                </div>

                {/* Custom Monochrome Chart */}
                <div className="grid grid-cols-6 gap-3 pt-4 items-end min-h-[220px]">
                  {REVENUE_MONTHLY_CHART.map((item, idx) => {
                    const heightPercent = Math.round(
                      (item.revenue / 1500000) * 100,
                    );
                    const profitPercent = Math.round(
                      (item.netProfit / 1500000) * 100,
                    );

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        <span className="text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          ৳{(item.revenue / 100000).toFixed(1)}L
                        </span>
                        <div className="w-full max-w-[48px] flex items-end gap-1 h-[160px] bg-neutral-900 p-1.5 rounded-2xl border border-white/5">
                          <div
                            className="w-1/2 bg-white rounded-xl transition-all duration-500"
                            style={{ height: `${heightPercent}%` }}
                            title={`Revenue: ৳${item.revenue.toLocaleString()}`}
                          />
                          <div
                            className="w-1/2 bg-neutral-600 rounded-xl transition-all duration-500"
                            style={{ height: `${profitPercent}%` }}
                            title={`Net Profit: ৳${item.netProfit.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs font-black text-white/50 uppercase">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT (CRUD & LIVE EDIT MODAL) */}
          {activeTab === "users" && (
            <UserManagementTable
              currentRole={role}
              assignedBranch={assignedBranch}
            />
          )}

          {/* TAB 3: 64 NATIONWIDE BRANCHES */}
          {activeTab === "branches" && isMasterAdmin && (
            <BranchManagementView currentRole={role} />
          )}

          {/* TAB 4: LIVE ATTENDANCE FEED & QR SCANNER */}
          {activeTab === "attendance" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight text-white">
                    Live Turnstile & QR Attendance Telemetry
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Real-time digital entry pass sync across 64 active branches.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <div className="divide-y divide-white/10 text-xs">
                {paginatedCheckins.map((chk) => (
                  <div
                    key={chk.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-xs">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-black text-sm text-white">
                          {chk.userName}
                        </span>
                        <span className="text-xs text-white/50 block">
                          {chk.branchName} &bull; via {chk.method}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          chk.status === "Verified Entry"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : chk.status === "Day Pass Logged"
                              ? "bg-white/10 text-white border border-white/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {chk.status}
                      </span>
                      <span className="text-[10px] text-white/40 font-semibold block">
                        {chk.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Pagination Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs select-none">
                <span className="text-neutral-400 font-medium">
                  Showing{" "}
                  <strong className="text-white font-bold">
                    {(checkinPage - 1) * checkinsPerPage + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-white font-bold">
                    {Math.min(
                      checkinPage * checkinsPerPage,
                      checkIns.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-white font-bold">
                    {checkIns.length}
                  </strong>{" "}
                  check-ins
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCheckinPage((p) => Math.max(1, p - 1))}
                    disabled={checkinPage === 1}
                    className="p-1.5 rounded-xl bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 rounded-xl bg-neutral-900 border border-white/10 text-xs font-bold text-white">
                    {checkinPage} / {totalCheckinPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCheckinPage((p) => Math.min(totalCheckinPages, p + 1))
                    }
                    disabled={checkinPage === totalCheckinPages}
                    className="p-1.5 rounded-xl bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BKASH & NAGAD GATEWAYS */}
          {activeTab === "payments" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-6">
              <div>
                <h3 className="font-black text-base uppercase tracking-tight text-white">
                  Payment Gateway Performance (Bangladesh)
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Direct bKash Merchant API & Nagad Payment Gateway settlement
                  breakdown.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {(gatewayBreakdown.length > 0
                  ? gatewayBreakdown
                  : [
                      { name: "bKash Direct", percentage: 62, amountBDT: 5239000, color: "#E2136E" },
                      { name: "Nagad Gateway", percentage: 26, amountBDT: 2197000, color: "#F7941D" },
                      { name: "Visa / Mastercard", percentage: 12, amountBDT: 1014000, color: "#00579F" },
                    ]
                ).map((gw, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-neutral-900 border border-white/5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-black uppercase">
                      <span className="text-white text-sm">{gw.name}</span>
                      <span className="text-white/60">
                        {gw.percentage}% of Volume &bull; ৳
                        {(gw.amountBDT / 100000).toFixed(2)} Lakh
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-neutral-950 overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${gw.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MEMBERSHIP PACKAGES */}
          {activeTab === "packages" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-6">
              <div>
                <h3 className="font-black text-base uppercase tracking-tight text-white">
                  Membership Tiers & Subscriber Distribution
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Breakdown across Free Trial, Basic Pass, Pro Athlete, and VIP
                  Ultimate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(packageBreakdown.length > 0
                  ? packageBreakdown
                  : [
                      { name: "Free Tier (Trial)", members: 3200, priceBDT: 0, share: "66%" },
                      { name: "Basic Pass", members: 680, priceBDT: 2500, share: "14%" },
                      { name: "Pro Athlete (AI Suite)", members: 820, priceBDT: 4900, share: "17%" },
                      { name: "VIP Ultimate (All-Branch)", members: 150, priceBDT: 9900, share: "3%" },
                    ]
                ).map((pkg, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-3"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2.5 py-0.5 rounded-full">
                      {pkg.share} Share
                    </span>
                    <h4 className="font-black text-lg text-white uppercase tracking-tight">
                      {pkg.name}
                    </h4>
                    <div className="text-3xl font-black text-white tracking-tight">
                      {pkg.priceBDT > 0
                        ? `৳${pkg.priceBDT.toLocaleString()}`
                        : "Free"}
                      <span className="text-xs text-white/40 font-normal uppercase">
                        /mo
                      </span>
                    </div>
                    <div className="text-xs font-black uppercase text-emerald-400">
                      {pkg.members} Active Subscribers
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PLATFORM & SYSTEM TELEMETRY */}
          {activeTab === "ai-telemetry" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60">
                <Activity className="w-4 h-4 text-white" />
                FITORA Nationwide Turnstiles & Cloud Infrastructure Telemetry
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Platform Uptime:{" "}
                <span className="text-emerald-400">99.98% Operational</span>
              </h3>
              <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
                Real-time cloud health metrics, turnstile gate synchronization,
                and database transaction throughput across 64 branch hubs
                nationwide.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10">
                  <span className="text-xs text-white/50 font-black uppercase tracking-wider">
                    Daily Active Syncs
                  </span>
                  <span className="block text-3xl font-black text-white mt-1">
                    14,280
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10">
                  <span className="text-xs text-white/50 font-black uppercase tracking-wider">
                    Turnstile Scans Processed
                  </span>
                  <span className="block text-3xl font-black text-white mt-1">
                    8,920
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10">
                  <span className="text-xs text-white/50 font-black uppercase tracking-wider">
                    API Response Latency
                  </span>
                  <span className="block text-3xl font-black text-emerald-400 mt-1">
                    42 ms
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
