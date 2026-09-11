"use client";

import BranchManagementView from "@/components/dashboard/BranchManagementView";
import UserManagementTable from "@/components/dashboard/UserManagementTable";
import { useDashboardRole } from "@/hooks/useDashboardRole";
import {
  fetchBranchCheckins,
  fetchBranchOccupancy,
  fetchBranchOverview,
} from "@/services/branchService";
import { exportToCSV } from "@/utils/csvExporter";
import {
  fetchMasterRevenue,
  fetchPlatformStats,
  type CheckInRecord,
  type GatewayRevenue,
  type MasterRevenue,
  type MonthlyRevenue,
  type PackageSalesBreakdown,
  type PaymentGatewayBreakdown,
  type PlatformStats,
  type PlanRevenue,
  type RevenueSummary,
} from "@/services/dashboardService";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CreditCard,
  DollarSign,
  Download,
  LayoutDashboard,
  QrCode,
  Search,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function MasterDashboardPage() {
  const {
    role,
    setRole,
    assignedBranch,
    userName,
    userEmail,
    userPlan,
    isPremium,
    isMasterAdmin,
  } = useDashboardRole();

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as string | null;

  const [activeTab, setActiveTab] = useState<string>("overview");

  // ── Dynamic Platform Stats ───────────────────────────────────────────────
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(
    null,
  );
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [gatewayBreakdown, setGatewayBreakdown] = useState<
    PaymentGatewayBreakdown[]
  >([]);
  const [packageBreakdown, setPackageBreakdown] = useState<
    PackageSalesBreakdown[]
  >([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Live Master Revenue Aggregation Dashboard (master_admin only) ────────
  const [masterRevenue, setMasterRevenue] = useState<MasterRevenue | null>(
    null,
  );
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState("");

  const loadMasterRevenue = useCallback(async () => {
    if (role !== "master_admin") {
      setMasterRevenue(null);
      return;
    }
    setRevenueLoading(true);
    setRevenueError("");
    const data = await fetchMasterRevenue();
    console.log(data, "data");
    if (data) {
      setMasterRevenue(data);
    } else {
      setMasterRevenue(null);
      setRevenueError(
        "Could not load live revenue analytics. Showing last synced figures.",
      );
    }
    setRevenueLoading(false);
  }, [role]);

  const loadPlatformStats = useCallback(async () => {
    if (role !== "master_admin" && role !== "branch_admin") return;
    setStatsLoading(true);
    const data = await fetchPlatformStats();
    if (data) {
      setPlatformStats(data.platformStats);
      if (data.recentCheckIns?.length > 0) setCheckIns(data.recentCheckIns);
      if (data.paymentGatewayBreakdown?.length > 0)
        setGatewayBreakdown(data.paymentGatewayBreakdown);
      if (data.packageSalesBreakdown?.length > 0)
        setPackageBreakdown(data.packageSalesBreakdown);
    }
    setStatsLoading(false);
  }, [role]);

  useEffect(() => {
    loadPlatformStats();
    loadMasterRevenue();
  }, [loadPlatformStats, loadMasterRevenue]);

  const [checkinPage, setCheckinPage] = useState<number>(1);
  const [selectedBranchName, setSelectedBranchName] = useState(
    assignedBranch || "",
  );
  const [occupancyData, setOccupancyData] = useState<Awaited<
    ReturnType<typeof fetchBranchOccupancy>
  > | null>(null);
  const [attendanceData, setAttendanceData] = useState<Awaited<
    ReturnType<typeof fetchBranchCheckins>
  > | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");
  const [checkinSearchInput, setCheckinSearchInput] = useState("");
  const [checkinSearchQuery, setCheckinSearchQuery] = useState("");

  const loadAttendance = useCallback(
    async (search?: string) => {
      if (activeTab !== "attendance" && activeTab !== "overview") return;
      try {
        setAttendanceLoading(true);
        setAttendanceError("");

        const branches = await fetchBranchOverview();
        const branch =
          branches.find((item) => {
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
          fetchBranchCheckins(
            branch._id,
            search !== undefined ? search : checkinSearchQuery,
          ),
        ]);

        setSelectedBranchName(branch.name);
        setOccupancyData(occupancy);
        setAttendanceData(attendance);
      } catch (error) {
        setOccupancyData(null);
        setAttendanceData(null);
        setAttendanceError(
          error instanceof Error
            ? error.message
            : "Could not load branch attendance right now.",
        );
      } finally {
        setAttendanceLoading(false);
      }
    },
    [activeTab, assignedBranch, checkinSearchQuery],
  );

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const handleCheckinSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = checkinSearchInput.trim();
    setCheckinSearchQuery(trimmed);
    setCheckinPage(1);
    loadAttendance(trimmed);
  };

  const handleClearCheckinSearch = () => {
    setCheckinSearchInput("");
    setCheckinSearchQuery("");
    setCheckinPage(1);
    loadAttendance("");
  };

  const checkinsPerPage = 4;
  const displayCheckins = attendanceData?.checkins ?? [];
  const totalTrackedToday = displayCheckins.length;
  const totalCheckinPages = Math.ceil(totalTrackedToday / checkinsPerPage) || 1;
  const paginatedCheckins = displayCheckins.slice(
    (checkinPage - 1) * checkinsPerPage,
    checkinPage * checkinsPerPage,
  );

  // ── Export Today's check-ins as CSV ───────────────────────────────────────
  const exportCheckInsCSV = () => {
    const escapeCSV = (value: unknown): string => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = displayCheckins.map((checkin) => {
      const parsedDate = checkin.checkInTime
        ? new Date(checkin.checkInTime)
        : null;
      const validDate =
        parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;

      return [
        checkin.memberName,
        validDate
          ? validDate.toLocaleDateString()
          : (attendanceData?.date ?? ""),
        checkin.branchName,
        validDate
          ? validDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : (checkin.checkInTime ?? ""),
      ]
        .map(escapeCSV)
        .join(",");
    });

    const csvContent = [
      ["Member Name", "Date", "Branch", "Check-in Time"]
        .map(escapeCSV)
        .join(","),
      ...rows,
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fitora-check-in-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Export Attendance as CSV (reusable utility) ───────────────────────────
  const exportAttendanceCSV = () => {
    if (displayCheckins.length === 0) return;

    const attendanceRows = displayCheckins.map((checkin) => {
      const parsedDate = checkin.checkInTime
        ? new Date(checkin.checkInTime)
        : null;
      const validDate =
        parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;

      return {
        "Member Name": checkin.memberName,
        Date: validDate
          ? validDate.toLocaleDateString()
          : (attendanceData?.date ?? ""),
        Branch: checkin.branchName,
        Status: checkin.status === "checked_in" ? "Checked In" : "Checked Out",
        Source: checkin.source,
        "Check-in Time": validDate
          ? validDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : (checkin.checkInTime ?? ""),
      };
    });

    const today = new Date();
    const datePart =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");
    const filename = `fitora-attendance-${datePart}.csv`;

    exportToCSV(attendanceRows, filename);
  };

  // ── Export Monthly Revenue as CSV (reusable utility) ──────────────────────
  const exportMonthlyRevenueCSV = () => {
    if (monthlyRevenueChart.length === 0) return;

    const revenueRows = monthlyRevenueChart.map((item) => ({
      Month: item.month,
      "Revenue (BDT)": item.revenue,
      Payments: item.payments,
    }));

    const today = new Date();
    const datePart =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");
    const filename = `fitora-monthly-revenue-${datePart}.csv`;

    exportToCSV(revenueRows, filename);
  };

  // ── Live Master Revenue derived values (master_admin) ─────────────────────
  const revenueSummary: RevenueSummary = masterRevenue?.summary ?? {
    totalRevenueBDT: 0,
    successfulPayments: 0,
    averagePaymentBDT: 0,
  };
  const gateways: GatewayRevenue[] = masterRevenue?.gatewayRevenue ?? [];
  const plans: PlanRevenue[] = masterRevenue?.planRevenue ?? [];

  const planRevenueList: PlanRevenue[] = [
    "Basic Pass",
    "Pro Athlete",
    "VIP Ultimate",
  ].map((planName) => {
    const found = plans.find((item) => item.planName === planName);
    return {
      planName,
      totalRevenueBDT: found?.totalRevenueBDT ?? 0,
      subscriptions: found?.subscriptions ?? 0,
    };
  });

  const revenueByMonth: Record<string, number> = {};
  const apiMonthly: MonthlyRevenue[] = masterRevenue?.monthlyRevenue ?? [];
  for (const item of apiMonthly) {
    revenueByMonth[item.month] =
      (revenueByMonth[item.month] ?? 0) + item.revenueBDT;
  }
  const MONTHS_IN_ORDER = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyRevenueChart = MONTHS_IN_ORDER.map((month) => ({
    month,
    revenue: revenueByMonth[month] ?? 0,
    payments: apiMonthly.find((item) => item.month === month)?.payments ?? 0,
    netProfit: 0, // single-series chart: keep revenue bars only
  }));

  const monthlyMaxRevenue = Math.max(
    1,
    ...monthlyRevenueChart.map((item) => item.revenue),
  );

  const gatewayList: PaymentGatewayBreakdown[] = (() => {
    if (gateways.length === 0) return [];
    const total = gateways.reduce((sum, item) => sum + item.revenueBDT, 0) || 1;
    return gateways.map((item) => ({
      name: item.gateway,
      percentage: Math.round((item.revenueBDT / total) * 100),
      amountBDT: item.revenueBDT,
      color: "#ffffff",
    }));
  })();

  useEffect(() => {
    if (tabParam) {
      if (
        tabParam === "revenue" ||
        tabParam === "payments" ||
        tabParam === "packages" ||
        tabParam === "finances"
      ) {
        setActiveTab("finances");
      } else if (tabParam === "athletes") {
        setActiveTab("users");
      } else if (tabParam === "attendance" || tabParam === "entry-pass") {
        setActiveTab("overview");
      } else {
        setActiveTab(tabParam);
      }
    } else {
      setActiveTab("overview");
    }
  }, [tabParam]);

  const renderMonthlyRevenueChart = () => (
    <div className="p-4 sm:p-5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-white">
            Monthly Revenue Progression
          </h3>
          <p className="text-[11px] text-white/50 mt-0.5">
            Live revenue volume across all branches (Calendar Year).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span className="text-white text-[11px]">Revenue (BDT)</span>
          </div>
          <button
            type="button"
            onClick={exportMonthlyRevenueCSV}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </button>
        </div>
      </div>

      {revenueLoading && (
        <div className="w-full text-xs font-black uppercase tracking-widest text-white/40 animate-pulse">
          Loading revenue analytics...
        </div>
      )}
      <div className="grid grid-cols-12 gap-1.5 pt-2 items-end min-h-[160px]">
        {monthlyRevenueChart.map((item, idx) => {
          const hasData = item.revenue > 0;
          const heightPercent = Math.round(
            (item.revenue / monthlyMaxRevenue) * 100,
          );

          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-1.5 h-full justify-end group"
            >
              <span className="text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                ৳{(item.revenue / 100000).toFixed(1)}L
              </span>
              <div className="w-full max-w-[20px] flex items-end gap-1 h-[110px] bg-white/5 p-0.5 rounded-xl border border-white/10">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${hasData ? "bg-white" : "bg-white/10"}`}
                  style={{
                    height: hasData ? `${Math.max(heightPercent, 4)}%` : "8%",
                  }}
                  title={
                    hasData
                      ? `Revenue: ৳${item.revenue.toLocaleString()} (${item.payments} payments)`
                      : `${item.month}: No revenue`
                  }
                />
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300 select-none">
      {/* ADMIN VIEW (Master Admin & Branch Admin Only) */}
      {(role === "master_admin" || role === "branch_admin") && (
        <div className="space-y-4">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {(activeTab === "overview" || activeTab === "attendance") && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Live Revenue API status banner (master_admin only) */}
              {isMasterAdmin && revenueLoading && (
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 animate-pulse">
                  <Zap className="w-4 h-4 text-white" />
                  Loading live revenue analytics from MongoDB...
                </div>
              )}
              {isMasterAdmin && revenueError && (
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400/90">
                  <CircleAlert className="w-4 h-4 text-amber-400" />
                  {revenueError}
                </div>
              )}
              {/* 4 Core Financial KPIs (Luxury Monochrome with Green / Red numbers only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                    <span>
                      {isMasterAdmin
                        ? "Total Platform Revenue"
                        : "Branch Revenue"}
                    </span>
                    <DollarSign className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      ৳
                      {isMasterAdmin && masterRevenue
                        ? revenueSummary.totalRevenueBDT.toLocaleString("en-IN")
                        : platformStats
                          ? (isMasterAdmin
                              ? platformStats.totalRevenueBDT
                              : platformStats.mrrBDT
                            ).toLocaleString("en-IN")
                          : "0"}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>
                      +{platformStats?.revenueGrowthPercent ?? 0}% Growth
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                    <span>
                      {isMasterAdmin
                        ? "Successful Payments"
                        : "Monthly Recurring (MRR)"}
                    </span>
                    <CreditCard className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {isMasterAdmin && masterRevenue
                        ? revenueSummary.successfulPayments.toLocaleString()
                        : `৳${(platformStats?.mrrBDT ?? 0).toLocaleString("en-IN")}`}
                      {isMasterAdmin && masterRevenue && (
                        <span className="text-[10px] font-black text-white/40 ml-1.5 uppercase">
                          Paid
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>
                      +{platformStats?.revenueGrowthPercent ?? 0}% vs last month
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                    <span>
                      {isMasterAdmin ? "Average Payment" : "Branch Members"}
                    </span>
                    <Users className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {isMasterAdmin && masterRevenue ? (
                        <>
                          ৳
                          {revenueSummary.averagePaymentBDT.toLocaleString(
                            "en-IN",
                          )}
                          <span className="text-[10px] font-black text-white/40 ml-1 uppercase">
                            /txn
                          </span>
                        </>
                      ) : platformStats ? (
                        (isMasterAdmin
                          ? platformStats.totalMembers
                          : platformStats.activeMembersToday
                        ).toLocaleString()
                      ) : (
                        "0"
                      )}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>
                      +{platformStats?.membersGrowthPercent ?? 0}% New
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                    <span>Free ➔ Pro Conversion</span>
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {platformStats?.conversionRatePercent ?? 24.8}%
                    </span>
                  </div>
                  <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>+3.5% Boost</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side: Monthly Revenue Chart (7 cols) + Live Attendance Feed (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7">
                  {renderMonthlyRevenueChart()}
                </div>

                {/* Live Attendance Feed & Occupancy (Side column) */}
                <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-tight text-white">
                        Attendance & Occupancy
                      </h3>
                      <p className="text-[11px] text-white/50">
                        {selectedBranchName ||
                          assignedBranch ||
                          "Assigned branch"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={exportAttendanceCSV}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                        title="Export CSV"
                      >
                        <Download className="w-3 h-3" />
                        CSV
                      </button>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Activity className="w-3 h-3 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>

                  {attendanceError && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{attendanceError}</span>
                    </div>
                  )}

                  {attendanceLoading ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-6 text-xs text-white/60 text-center">
                      Loading live occupancy & check-ins...
                    </div>
                  ) : occupancyData ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">
                          {occupancyData.currentOccupancy} /{" "}
                          {occupancyData.memberCapacity} active members
                        </span>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-400">
                          {occupancyData.status} (
                          {occupancyData.occupancyPercent}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${occupancyData.isAtCapacity ? "bg-rose-500" : "bg-emerald-400"}`}
                          style={{
                            width: `${Math.min(occupancyData.occupancyPercent, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/50 pt-0.5">
                        <span>
                          {occupancyData.availableSpots} spots available
                        </span>
                        <span>{occupancyData.branchName}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Today's Check-ins List (Internal Scrollable) */}
                  <div className="space-y-2">
                    {/* Search Check-ins Form */}
                    <form
                      onSubmit={handleCheckinSearch}
                      className="relative flex items-center"
                    >
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                      <input
                        type="text"
                        value={checkinSearchInput}
                        onChange={(e) => setCheckinSearchInput(e.target.value)}
                        placeholder="Search attendee by name or QR..."
                        className={`w-full pl-7 ${checkinSearchInput || checkinSearchQuery ? "pr-28" : "pr-18"} py-1 bg-black border border-white/15 rounded-full text-[11px] font-medium text-white placeholder:text-white/40 outline-none focus:border-white transition-all`}
                      />
                      <div className="absolute right-0.5 flex items-center gap-1">
                        {(checkinSearchInput || checkinSearchQuery) && (
                          <button
                            type="button"
                            onClick={handleClearCheckinSearch}
                            className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 font-black text-[9px] uppercase transition cursor-pointer border border-white/10"
                            title="Clear search"
                          >
                            Clear
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-2.5 py-0.5 rounded-full bg-white text-black font-black text-[9px] uppercase hover:bg-gray-200 transition cursor-pointer shadow"
                        >
                          Search
                        </button>
                      </div>
                    </form>

                    <div className="flex items-center justify-between text-[11px] font-bold text-white/60 pt-0.5">
                      <span>Today&apos;s Check-ins ({totalTrackedToday})</span>
                      {paginatedCheckins.length > 0 && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setCheckinPage((p) => Math.max(1, p - 1))
                            }
                            disabled={checkinPage === 1}
                            className="rounded-lg border border-white/15 bg-white/5 p-1 text-white disabled:pointer-events-none disabled:opacity-30 hover:bg-white hover:text-black transition-colors cursor-pointer"
                            title="Previous"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <span className="text-[10px] font-bold text-white px-1">
                            {checkinPage}/{totalCheckinPages}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCheckinPage((p) =>
                                Math.min(totalCheckinPages, p + 1),
                              )
                            }
                            disabled={checkinPage === totalCheckinPages}
                            className="rounded-lg border border-white/15 bg-white/5 p-1 text-white disabled:pointer-events-none disabled:opacity-30 hover:bg-white hover:text-black transition-colors cursor-pointer"
                            title="Next"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {paginatedCheckins.length === 0 ? (
                      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-4 text-xs text-white/50 text-center">
                        No live check-ins available today.
                      </div>
                    ) : (
                      <div className="max-h-[175px] overflow-y-auto divide-y divide-white/5 text-xs pr-1">
                        {paginatedCheckins.map((checkin) => (
                          <div
                            key={checkin._id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shrink-0">
                                <QrCode className="h-3.5 w-3.5" />
                              </div>
                              <div className="truncate max-w-[150px] sm:max-w-[190px]">
                                <span className="font-bold text-white text-xs block truncate">
                                  {checkin.memberName}
                                </span>
                                <span className="text-[10px] text-white/50 block truncate">
                                  {checkin.branchName} &bull; {checkin.source}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                                  checkin.status === "checked_in"
                                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                    : "border border-white/20 bg-white/10 text-white"
                                }`}
                              >
                                {checkin.status === "checked_in" ? "In" : "Out"}
                              </span>
                              <span className="block text-[9px] font-semibold text-white/40 mt-0.5">
                                {new Date(
                                  checkin.checkInTime,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
            <BranchManagementView />
          )}

          {/* TAB 4: FINANCIAL ANALYTICS & SETTLEMENTS */}
          {(activeTab === "finances" ||
            activeTab === "revenue" ||
            activeTab === "payments" ||
            activeTab === "packages") && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Live Revenue API status banner (master_admin only) */}
              {isMasterAdmin && revenueLoading && (
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 animate-pulse">
                  <Zap className="w-4 h-4 text-white" />
                  Loading live revenue analytics from MongoDB...
                </div>
              )}
              {isMasterAdmin && revenueError && (
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400/90">
                  <CircleAlert className="w-4 h-4 text-amber-400" />
                  {revenueError}
                </div>
              )}

              {/* Monthly Revenue Progression Chart */}
              {renderMonthlyRevenueChart()}

              {/* Side-by-Side: Gateway Breakdown (5 cols) + Membership Tiers (7 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-white">
                      Payment Gateways (Bangladesh)
                    </h3>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      bKash Merchant API & Nagad settlement volume.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {(isMasterAdmin && gatewayList.length > 0
                      ? gatewayList
                      : gatewayBreakdown
                    ).map((gw, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-black uppercase">
                          <span className="text-white text-xs">{gw.name}</span>
                          <span className="text-white/60">
                            {gw.percentage}% &bull; ৳
                            {(gw.amountBDT / 100000).toFixed(2)} Lakh
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
                          <div
                            className="h-full rounded-full bg-white transition-all duration-500"
                            style={{ width: `${gw.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {(isMasterAdmin ? gatewayList : gatewayBreakdown).length ===
                      0 &&
                      !revenueLoading && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/50">
                          No completed payments recorded yet.
                        </div>
                      )}
                  </div>
                </div>

                <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-white">
                      Membership Tiers & Subscriber Distribution
                    </h3>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {isMasterAdmin
                        ? "Live subscription revenue and subscriber counts."
                        : "Breakdown across Free, Basic, Pro, and VIP."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(isMasterAdmin && masterRevenue
                      ? planRevenueList.map((plan) => ({
                          name: plan.planName,
                          members: plan.subscriptions,
                          priceBDT: plan.totalRevenueBDT,
                          share:
                            planRevenueList.reduce(
                              (total, p) => total + p.totalRevenueBDT,
                              0,
                            ) > 0
                              ? `${Math.round(
                                  (plan.totalRevenueBDT /
                                    planRevenueList.reduce(
                                      (total, p) => total + p.totalRevenueBDT,
                                      0,
                                    )) *
                                    100,
                                )}%`
                              : "0%",
                        }))
                      : packageBreakdown.length > 0
                        ? packageBreakdown
                        : [
                            {
                              name: "Free Pass",
                              members: 0,
                              priceBDT: 0,
                              share: "0%",
                            },
                            {
                              name: "Basic Pass",
                              members: 0,
                              priceBDT: 2500,
                              share: "0%",
                            },
                            {
                              name: "Pro Athlete",
                              members: 0,
                              priceBDT: 4900,
                              share: "0%",
                            },
                            {
                              name: "VIP Ultimate",
                              members: 0,
                              priceBDT: 9900,
                              share: "0%",
                            },
                          ]
                    ).map((pkg, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black border border-white/15 space-y-1.5 shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xs text-white uppercase tracking-tight">
                            {pkg.name}
                          </h4>
                          <span className="text-[9px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded-full">
                            {pkg.share}
                          </span>
                        </div>
                        <div className="text-xl font-black text-white tracking-tight">
                          {pkg.priceBDT > 0
                            ? `৳${pkg.priceBDT.toLocaleString()}`
                            : "৳0"}
                          <span className="text-[10px] text-white/40 font-normal uppercase">
                            {isMasterAdmin && masterRevenue ? " Rev" : " /mo"}
                          </span>
                        </div>
                        <div className="text-[10px] font-black uppercase text-emerald-400">
                          {pkg.members}{" "}
                          {isMasterAdmin && masterRevenue
                            ? "Subscriptions"
                            : "Subscribers"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PLATFORM & SYSTEM TELEMETRY */}
          {activeTab === "ai-telemetry" && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60">
                <Activity className="w-3.5 h-3.5 text-white" />
                FITORA Nationwide Turnstiles & Cloud Infrastructure Telemetry
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                Platform Uptime:{" "}
                <span className="text-emerald-400">99.98% Operational</span>
              </h3>
              <p className="text-[11px] text-white/60 leading-relaxed max-w-2xl">
                Real-time cloud health metrics, turnstile gate synchronization,
                and database transaction throughput across 64 branch hubs
                nationwide.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[11px] text-white/50 font-black uppercase tracking-wider">
                    Daily Active Syncs
                  </span>
                  <span className="block text-2xl font-black text-white mt-1">
                    14,280
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[11px] text-white/50 font-black uppercase tracking-wider">
                    Turnstile Scans Processed
                  </span>
                  <span className="block text-2xl font-black text-white mt-1">
                    8,920
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[11px] text-white/50 font-black uppercase tracking-wider">
                    API Response Latency
                  </span>
                  <span className="block text-2xl font-black text-emerald-400 mt-1">
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
