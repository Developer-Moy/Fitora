"use client";

import {
  fetchPublicBranches,
  type BranchInfo,
} from "@/services/dashboardService";

const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];
import {
  Activity,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Filter,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Fixed capacity (in people) for every gym branch.
const TOTAL_CAPACITY = 400;

export default function BranchManagementView() {
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  // Fetch branches from backend API dynamically
  const loadBranches = useCallback(
    async (search?: string, division?: string) => {
      setIsLoading(true);
      const searchVal = search !== undefined ? search : searchQuery;
      const divisionVal = division !== undefined ? division : selectedDivision;
      const result = await fetchPublicBranches({
        search: searchVal ? searchVal.trim() : undefined,
        division: divisionVal !== "all" ? divisionVal : undefined,
      });
      if (result) {
        setBranches(result as any);
      }
      setIsLoading(false);
    },
    [searchQuery, selectedDivision],
  );

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchInput.trim();
    setSearchQuery(trimmed);
    setCurrentPage(1);
    loadBranches(trimmed, selectedDivision);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    loadBranches("", selectedDivision);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setCurrentPage(1);
    loadBranches(searchQuery, division);
  };

  const totalPages = Math.ceil(branches.length / itemsPerPage) || 1;
  const paginatedBranches = branches.slice(
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
    <div className="space-y-3 animate-in fade-in duration-200">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2 text-white/40">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Loading branches from backend...
            </span>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          {/* Top Telemetry Stats (Monochrome with Green numbers only) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                <span>Active Network</span>
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="pt-1 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {branches.length > 0 ? branches.length : 64}
                </span>
                <span className="text-[11px] font-bold text-white/50 uppercase">
                  Districts
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Nationwide standard gym footprint
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                <span>Live Footfall</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              </div>
              <div className="pt-1 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  {activeNowTotal}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase">
                  Athletes Active Now
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Real-time biometric & QR check-ins
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
                <span>Total Branch Revenue</span>
                <CreditCard className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="pt-1 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ৳{(totalRevenue / 100000).toFixed(1)}L
                </span>
                <span className="text-[11px] font-bold text-white/50 uppercase">
                  Monthly
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Combined membership & coaching fees
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            {/* Search Box with Search & Clear Buttons */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full sm:w-80 flex items-center"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search branch, district, admin..."
                className={`w-full pl-8 ${searchInput || searchQuery ? "pr-32" : "pr-20"} py-1.5 bg-black border border-white/15 rounded-full text-xs font-medium text-white placeholder:text-white/40 outline-none focus:border-white transition-all`}
              />
              <div className="absolute right-1 flex items-center gap-1">
                {(searchInput || searchQuery) && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 font-black text-[10px] uppercase transition cursor-pointer border border-white/10"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-0.5 rounded-full bg-white text-black font-black text-[10px] uppercase hover:bg-gray-200 transition cursor-pointer shadow"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-white/40 shrink-0" />
              <select
                value={selectedDivision}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 bg-black border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-white cursor-pointer uppercase"
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
          {paginatedBranches.length === 0 ? (
            <div className="py-12 text-center text-white/40 uppercase font-bold text-xs bg-black border border-white/10 rounded-2xl">
              No matching branches found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {paginatedBranches.map((branch) => {
                const occupancyPercent = Math.round(
                  (branch.totalMembers / branch.maxCapacity) * 100,
                );

                // Occupancy warning based on the branch's fixed capacity (400 people).
                const currentOccupancy = branch.totalMembers || 0;
                const occupancyPercentage =
                  (currentOccupancy / TOTAL_CAPACITY) * 100;
                const isNearCapacity = occupancyPercentage >= 90;

                return (
                  <div
                    key={branch.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-black border border-white/15 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      {/* Branch Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded-full">
                            {branch.id}
                          </span>
                          <h4 className="font-black text-sm uppercase tracking-tight text-white mt-1.5 leading-tight">
                            {branch.name}
                          </h4>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          ACTIVE
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-[11px] text-white/60">
                        <MapPin className="w-3 h-3 text-white/40 shrink-0 mt-0.5" />
                        <span className="leading-snug truncate">
                          {branch.address}
                        </span>
                      </div>

                      {/* Capacity Meter */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold uppercase">
                          <span className="text-white/40 text-[9px] tracking-wider">
                            Capacity
                          </span>
                          <span className="text-white text-[11px]">
                            {branch.totalMembers} / {branch.maxCapacity} (
                            {occupancyPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/10">
                          <div
                            className="h-full rounded-full bg-white transition-all duration-500"
                            style={{
                              width: `${Math.min(occupancyPercent, 100)}%`,
                            }}
                          />
                        </div>

                        {isNearCapacity && (
                          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-rose-400">
                            <CircleAlert className="w-2.5 h-2.5" />
                            Near Capacity (&gt;90%)
                          </div>
                        )}
                      </div>

                      {/* Metrics Row */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="block text-[8px] text-white/40 font-black uppercase tracking-widest">
                            Active
                          </span>
                          <span className="font-black text-xs text-emerald-400">
                            {branch.activeNow}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="block text-[8px] text-white/40 font-black uppercase tracking-widest">
                            Equip
                          </span>
                          <span className="font-black text-xs text-white">
                            {branch.equipmentCount}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="block text-[8px] text-white/40 font-black uppercase tracking-widest">
                            Trainers
                          </span>
                          <span className="font-black text-xs text-white">
                            {branch.trainersCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Branch Admin Contact Footer */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[8px] text-white/40 font-black uppercase tracking-widest">
                          Admin
                        </span>
                        <span className="font-bold text-white text-xs truncate max-w-[120px] block">
                          {branch.adminName}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[8px] text-white/40 font-black uppercase tracking-widest">
                          Monthly Rev
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
          )}

          {/* Pagination Footer Controls */}
          {branches.length > 0 && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-black border border-white/15 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
              <div className="text-neutral-400 font-medium text-[11px]">
                Showing{" "}
                <strong className="text-white font-bold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-white font-bold">
                  {Math.min(currentPage * itemsPerPage, branches.length)}
                </strong>{" "}
                of{" "}
                <strong className="text-white font-bold">
                  {branches.length}
                </strong>{" "}
                branches
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-1 text-neutral-400">
                  <span className="text-[10px] font-semibold">Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-black border border-white/15 rounded px-1.5 py-0.5 text-xs text-white outline-none cursor-pointer focus:border-white"
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
                  className="p-1 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                          currentPage === pageNum
                            ? "bg-white text-black font-extrabold shadow-md"
                            : "bg-black border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
