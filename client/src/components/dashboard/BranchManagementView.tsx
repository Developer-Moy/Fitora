"use client";

import React, { useState } from "react";
import {
  INITIAL_BRANCHES,
  BANGLADESH_DIVISIONS,
  BranchInfo,
} from "@/data/dashboardData";
import {
  Building2,
  Users,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Shield,
  Activity,
  CheckCircle2,
  Search,
  Filter,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface BranchManagementViewProps {
  currentRole: string;
}

export default function BranchManagementView({
  currentRole,
}: BranchManagementViewProps) {
  const [branches, setBranches] = useState<BranchInfo[]>(INITIAL_BRANCHES);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  const filteredBranches = branches.filter((branch) => {
    const matchesDivision =
      selectedDivision === "all" || branch.division === selectedDivision;
    const matchesSearch =
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.adminName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage) || 1;
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalMembers = branches.reduce((acc, b) => acc + b.totalMembers, 0);
  const totalRevenue = branches.reduce(
    (acc, b) => acc + b.monthlyRevenueBDT,
    0,
  );
  const activeNowTotal = branches.reduce((acc, b) => acc + b.activeNow, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Telemetry Stats (Monochrome with Green numbers only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
            <span>Active Network</span>
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              64
            </span>
            <span className="text-xs font-bold text-white/50 uppercase">
              Districts Covered
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Nationwide standard gym footprint
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
            <span>Live Workout Footfall</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="pt-2 flex items-baseline gap-2">
            {/* Green number for live active users */}
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {activeNowTotal}
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase">
              Athletes Active Now
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Real-time biometric & QR check-ins
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/50">
            <span>Total Branch Revenue</span>
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ৳{(totalRevenue / 100000).toFixed(1)}L
            </span>
            <span className="text-xs font-bold text-white/50 uppercase">
              Monthly Volume
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Combined membership & coaching fees
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branch name, district, admin..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/15 rounded-full text-xs font-medium text-white placeholder:text-white/40 outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-white/40 shrink-0" />
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-white cursor-pointer uppercase"
          >
            <option value="all">All Divisions (Bangladesh)</option>
            {BANGLADESH_DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedBranches.map((branch) => {
          const occupancyPercent = Math.round(
            (branch.totalMembers / branch.maxCapacity) * 100,
          );

          return (
            <div
              key={branch.id}
              className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Branch Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2.5 py-0.5 rounded-full">
                      {branch.id}
                    </span>
                    <h4 className="font-black text-base uppercase tracking-tight text-white mt-2 leading-tight">
                      {branch.name}
                    </h4>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span className="leading-snug">{branch.address}</span>
                </div>

                {/* Capacity Meter */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase">
                    <span className="text-white/40 text-[10px] tracking-wider">
                      Capacity Load
                    </span>
                    <span className="text-white text-xs">
                      {branch.totalMembers} / {branch.maxCapacity} (
                      {occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-white/5">
                    <span className="block text-[9px] text-white/40 font-black uppercase tracking-widest">
                      Active
                    </span>
                    <span className="font-black text-sm text-emerald-400">
                      {branch.activeNow}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-white/5">
                    <span className="block text-[9px] text-white/40 font-black uppercase tracking-widest">
                      Equipments
                    </span>
                    <span className="font-black text-sm text-white">
                      {branch.equipmentCount}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-white/5">
                    <span className="block text-[9px] text-white/40 font-black uppercase tracking-widest">
                      Trainers
                    </span>
                    <span className="font-black text-sm text-white">
                      {branch.trainersCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Branch Admin Contact Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[9px] text-white/40 font-black uppercase tracking-widest">
                    Branch Admin
                  </span>
                  <span className="font-bold text-white">
                    {branch.adminName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] text-white/40 font-black uppercase tracking-widest">
                    Monthly Revenue
                  </span>
                  <span className="font-black text-xs text-white">
                    ৳{branch.monthlyRevenueBDT.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer Controls */}
      {filteredBranches.length > 0 && (
        <div className="p-5 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
          <div className="text-neutral-400 font-medium">
            Showing{" "}
            <strong className="text-white font-bold">
              {(currentPage - 1) * itemsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-white font-bold">
              {Math.min(currentPage * itemsPerPage, filteredBranches.length)}
            </strong>{" "}
            of{" "}
            <strong className="text-white font-bold">
              {filteredBranches.length}
            </strong>{" "}
            branches
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2 text-neutral-400">
              <span className="text-[11px] font-semibold">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-neutral-900 border border-white/15 rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer focus:border-white"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                      currentPage === pageNum
                        ? "bg-white text-black font-extrabold shadow-md"
                        : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
