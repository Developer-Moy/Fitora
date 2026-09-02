"use client";

import BranchManagementView from "@/components/dashboard/BranchManagementView";
import MemberDashboardView from "@/components/dashboard/MemberDashboardView";
import UserManagementTable from "@/components/dashboard/UserManagementTable";
import {
  PACKAGE_SALES_BREAKDOWN,
  PAYMENT_GATEWAY_BREAKDOWN,
  REVENUE_MONTHLY_CHART,
} from "@/data/dashboardData";
import { useDashboardRole } from "@/hooks/useDashboardRole";
import {
  fetchBranchCheckins,
  fetchBranchOccupancy,
  fetchBranchOverview,
} from "@/services/branchService";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CreditCard,
  DollarSign,
  QrCode,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MasterDashboardPage() {
  const {
    role,
    setRole,
    assignedBranch,
    userName,
    userEmail,
    isMasterAdmin,
  } = useDashboardRole();

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as string | null;

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [checkinPage, setCheckinPage] = useState<number>(1);
  const [selectedBranchName, setSelectedBranchName] = useState(
    assignedBranch || "",
  );
  const [occupancyData, setOccupancyData] = useState<
    Awaited<ReturnType<typeof fetchBranchOccupancy>> | null
  >(null);
  const [attendanceData, setAttendanceData] = useState<
    Awaited<ReturnType<typeof fetchBranchCheckins>> | null
  >(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");
  const checkinsPerPage = 4;
  const displayCheckins = attendanceData?.checkins ?? [];
  const totalTrackedToday = displayCheckins.length;
  const totalCheckinPages =
    Math.ceil(totalTrackedToday / checkinsPerPage) || 1;
  const paginatedCheckins = displayCheckins.slice(
    (checkinPage - 1) * checkinsPerPage,
    checkinPage * checkinsPerPage,
  );

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (activeTab !== "attendance") return;

    let cancelled = false;

    const loadAttendance = async () => {
      try {
        setAttendanceLoading(true);
        setAttendanceError("");
        setCheckinPage(1);

        const branches = await fetchBranchOverview();
        const branch = branches.find((item) => {
          if (!assignedBranch) return false;

          const branchName = item.name.toLowerCase();
          const assignedName = assignedBranch.toLowerCase();

          return (
            branchName === assignedName ||
            branchName.includes(assignedName) ||
            assignedName.includes(branchName)
          );
        }) ?? branches[0];

        if (!branch) {
          throw new Error("No branch is available for attendance tracking");
        }

        const [occupancy, attendance] = await Promise.all([
          fetchBranchOccupancy(branch._id),
          fetchBranchCheckins(branch._id),
        ]);

        if (cancelled) return;
        setSelectedBranchName(branch.name);
        setOccupancyData(occupancy);
        setAttendanceData(attendance);
      } catch (error) {
        if (cancelled) return;
        setOccupancyData(null);
        setAttendanceData(null);
        setAttendanceError(
          error instanceof Error
            ? error.message
            : "Could not load branch attendance right now.",
        );
      } finally {
        if (!cancelled) setAttendanceLoading(false);
      }
    };

    loadAttendance();
    return () => {
      cancelled = true;
    };
  }, [activeTab, assignedBranch]);

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
                      ৳{isMasterAdmin ? "84,50,000" : "6,80,000"}
                    </span>
                  </div>
                  {/* Growth delta: ONLY Green or Red for numbers */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    <span>+18.5% Growth (Quarterly)</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
                    <span>Monthly Recurring (MRR)</span>
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ৳{isMasterAdmin ? "14,20,000" : "1,95,000"}
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
                      {isMasterAdmin ? "4,850" : "480"}
                    </span>
                    <span className="text-xs font-black text-white/40 ml-2 uppercase">
                      Athletes
                    </span>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    <span>+12.3% New Signups</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
                    <span>Free ➔ Pro Conversion</span>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      24.8%
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight text-white">
                    Member Check-in & Attendance
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {selectedBranchName || assignedBranch || "Assigned branch"} live attendance.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {attendanceError && (
                <div className="flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{attendanceError}</span>
                </div>
              )}

              {attendanceLoading ? (
                <div className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-8 text-sm text-white/60">
                  Loading live occupancy and check-ins...
                </div>
              ) : occupancyData ? (
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Current Occupancy
                      </span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-400">
                        {occupancyData.status}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black tracking-tight text-white">
                        {occupancyData.currentOccupancy}
                      </span>
                      <span className="text-xs font-bold uppercase text-white/40">
                        / {occupancyData.memberCapacity} members
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        <span>Capacity used</span>
                        <span>{occupancyData.occupancyPercent}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-neutral-950">
                        <div
                          className={`h-full rounded-full ${occupancyData.isAtCapacity ? "bg-rose-500" : "bg-emerald-400"}`}
                          style={{ width: `${Math.min(occupancyData.occupancyPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          Available
                        </div>
                        <div className="mt-1 text-lg font-black text-white">
                          {occupancyData.availableSpots}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          Active now
                        </div>
                        <div className="mt-1 text-lg font-black text-emerald-400">
                          {occupancyData.currentOccupancy}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      <Building2 className="h-3.5 w-3.5" /> Branch Summary
                    </div>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-white/50">Branch</span>
                      <span className="text-right font-medium text-white">
                        {occupancyData.branchName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-white/50">Capacity</span>
                      <span className="font-medium text-white">
                        {occupancyData.memberCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-white/50">Status</span>
                      <span className="font-medium text-white">
                        {occupancyData.isAtCapacity ? "Full" : "Open"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase tracking-tight text-white">
                    Today&apos;s Check-ins
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {totalTrackedToday} tracked
                  </span>
                </div>
                {paginatedCheckins.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-6 text-sm text-white/60">
                    No live check-ins available today.
                  </div>
                ) : (
                  <div className="divide-y divide-white/10 text-xs">
                    {paginatedCheckins.map((checkin) => (
                      <div
                        key={checkin._id}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                            <QrCode className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-black text-sm text-white">
                              {checkin.memberName}
                            </span>
                            <span className="block text-xs text-white/50">
                              {checkin.branchName} &bull; via {checkin.source}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${checkin.status === "checked_in"
                                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border border-white/20 bg-white/10 text-white"
                              }`}
                          >
                            {checkin.status === "checked_in"
                              ? "Checked In"
                              : "Checked Out"}
                          </span>
                          <span className="block text-[10px] font-semibold text-white/40">
                            {new Date(checkin.checkInTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {paginatedCheckins.length > 0 && (
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                    <span className="text-neutral-400">
                      Showing {((checkinPage - 1) * checkinsPerPage) + 1} to{" "}
                      {Math.min(checkinPage * checkinsPerPage, totalTrackedToday)} of{" "}
                      {totalTrackedToday}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCheckinPage((page) => Math.max(1, page - 1))
                        }
                        disabled={checkinPage === 1}
                        className="rounded-xl border border-white/15 bg-neutral-900 p-1.5 text-white disabled:pointer-events-none disabled:opacity-30"
                        title="Previous"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-1 font-bold text-white">
                        {checkinPage} / {totalCheckinPages}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCheckinPage((page) =>
                            Math.min(totalCheckinPages, page + 1),
                          )
                        }
                        disabled={checkinPage === totalCheckinPages}
                        className="rounded-xl border border-white/15 bg-neutral-900 p-1.5 text-white disabled:pointer-events-none disabled:opacity-30"
                        title="Next"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
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
                {PAYMENT_GATEWAY_BREAKDOWN.map((gw, idx) => (
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
                {PACKAGE_SALES_BREAKDOWN.map((pkg, idx) => (
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
