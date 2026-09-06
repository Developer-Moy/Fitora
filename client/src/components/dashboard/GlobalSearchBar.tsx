"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  Users,
  Building2,
  DollarSign,
  Activity,
  ArrowUpRight,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import {
  fetchGlobalSearch,
  SearchResultItem,
  SearchResponseData,
} from "@/services/searchService";

export default function GlobalSearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "athletes" | "branches" | "financials" | "telemetry"
  >("all");

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced Search API Call
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults(null);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const data = await fetchGlobalSearch(trimmed);
        setResults(data);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click Outside to Dismiss
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard Shortcuts (Escape to Close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectResult = (item: SearchResultItem) => {
    setIsOpen(false);
    if (item.path) {
      router.push(item.path);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setResults(null);
    setIsOpen(false);
  };

  const totalResults = results?.totalCount ?? 0;

  // Filter items based on activeCategory
  const athletes = results?.athletes || [];
  const branches = results?.branches || [];
  const financials = results?.financials || [];
  const telemetry = results?.telemetry || [];

  return (
    <div ref={containerRef} className="relative w-full max-w-lg z-40">
      {/* ── Search Input Field ── */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 pointer-events-none" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim().length > 0) setIsOpen(true);
          }}
          placeholder="Search athletes, branches, financials, telemetry..."
          className="w-full rounded-full border border-white/15 bg-neutral-900/90 py-2 pl-10 pr-10 text-xs font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-white focus:ring-1 focus:ring-white shadow-inner"
        />

        {/* Clear Button or Spinner */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white/60" />
          ) : searchQuery.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-3 h-3" />
            </button>
          ) : null}
        </div>
      </div>

      {/* ── Dropdown Results Panel ── */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-neutral-950/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-white animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] flex flex-col">
          {/* Header Bar */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-white/50 uppercase tracking-wider">
                Results for:
              </span>
              <span className="text-white font-mono truncate max-w-[140px] sm:max-w-[200px]">
                &quot;{searchQuery}&quot;
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-bold text-[10px]">
              {isLoading ? "Searching..." : `${totalResults} found`}
            </span>
          </div>

          {/* Category Filter Pills (if results found) */}
          {totalResults > 0 && !isLoading && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 overflow-x-auto text-[10px] font-bold uppercase no-scrollbar bg-neutral-900/40">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-white text-black font-black"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                All ({totalResults})
              </button>
              {athletes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("athletes")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeCategory === "athletes"
                      ? "bg-white text-black font-black"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Athletes ({athletes.length})
                </button>
              )}
              {branches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("branches")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeCategory === "branches"
                      ? "bg-white text-black font-black"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Branches ({branches.length})
                </button>
              )}
              {financials.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("financials")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeCategory === "financials"
                      ? "bg-white text-black font-black"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Financials ({financials.length})
                </button>
              )}
              {telemetry.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("telemetry")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeCategory === "telemetry"
                      ? "bg-white text-black font-black"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Telemetry ({telemetry.length})
                </button>
              )}
            </div>
          )}

          {/* Results Scroll Container */}
          <div className="overflow-y-auto p-2 space-y-3 flex-1">
            {isLoading ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-white/50" />
                <p className="text-xs text-white/50">
                  Scanning MongoDB database &amp; platform telemetry...
                </p>
              </div>
            ) : totalResults === 0 ? (
              /* Empty State */
              <div className="py-8 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  No Matching Results Found
                </h4>
                <p className="text-[11px] text-white/50 max-w-xs mx-auto">
                  Try searching with athlete names (e.g. Tanvir), branches (e.g.
                  Gulshan), revenue, bKash, or server health.
                </p>
              </div>
            ) : (
              /* Grouped Results */
              <div className="space-y-3">
                {/* 1. Athletes */}
                {(activeCategory === "all" || activeCategory === "athletes") &&
                  athletes.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Users className="w-3 h-3" />
                        <span>Athletes &amp; Users ({athletes.length})</span>
                      </div>
                      {athletes.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/15 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/40 shrink-0">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/50 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}

                {/* 2. Branches */}
                {(activeCategory === "all" || activeCategory === "branches") &&
                  branches.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Building2 className="w-3 h-3" />
                        <span>Gym Branches ({branches.length})</span>
                      </div>
                      {branches.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/15 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/40 shrink-0">
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/50 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}

                {/* 3. Financials */}
                {(activeCategory === "all" ||
                  activeCategory === "financials") &&
                  financials.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <DollarSign className="w-3 h-3" />
                        <span>Financials &amp; Packages ({financials.length})</span>
                      </div>
                      {financials.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/15 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/40 shrink-0">
                              <DollarSign className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {item.title}
                              </span>
                              <p className="text-[10px] text-white/50 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}

                {/* 4. Telemetry */}
                {(activeCategory === "all" ||
                  activeCategory === "telemetry") &&
                  telemetry.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Activity className="w-3 h-3" />
                        <span>System Telemetry ({telemetry.length})</span>
                      </div>
                      {telemetry.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/15 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/40 shrink-0">
                              <Zap className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {item.title}
                              </span>
                              <p className="text-[10px] text-white/50 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Footer Quick Hint */}
          <div className="px-3 py-2 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px] text-white/40">
            <span>Press ESC to close</span>
            <span className="font-mono">FITORA Global Index</span>
          </div>
        </div>
      )}
    </div>
  );
}
