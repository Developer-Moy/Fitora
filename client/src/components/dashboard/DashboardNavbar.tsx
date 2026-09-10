"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  Activity,
  ChevronDown,
  Shield,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useDashboardRole, DashboardRole } from "@/hooks/useDashboardRole";
import NotificationDropdown from "./NotificationDropdown";

const isTabActive = (itemTabKey?: string, currentTab?: string) => {
  if (!itemTabKey) return false;
  const tab = currentTab || "overview";
  if (itemTabKey === tab) return true;
  if (
    itemTabKey === "overview" &&
    (tab === "attendance" || tab === "entry-pass")
  )
    return true;
  if (
    itemTabKey === "finances" &&
    (tab === "revenue" || tab === "payments" || tab === "packages")
  )
    return true;
  if (
    itemTabKey === "workouts" &&
    (tab === "workout-log" || tab === "goals-log")
  )
    return true;
  if (itemTabKey === "hydration" && tab === "nutrition-log") return true;
  if (itemTabKey === "users" && tab === "athletes") return true;
  return false;
};

export default function DashboardNavbar() {
  const {
    role,
    setRole,
    userName,
    userEmail,
    assignedBranch,
    isMasterAdmin,
    logout,
  } = useDashboardRole();

  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentTab]);

  const isAdmin = role === "master_admin" || role === "branch_admin";

  const adminNavItems = [
    {
      name: "Overview",
      href: "/dashboard?tab=overview",
      icon: LayoutDashboard,
      tabKey: "overview",
    },
    {
      name: "Users",
      href: "/dashboard?tab=users",
      icon: Users,
      tabKey: "users",
    },
    ...(isMasterAdmin
      ? [
          {
            name: "64 Branches",
            href: "/dashboard?tab=branches",
            icon: Building2,
            tabKey: "branches",
          },
        ]
      : []),
    {
      name: "Finances",
      href: "/dashboard?tab=finances",
      icon: TrendingUp,
      tabKey: "finances",
    },
    {
      name: "Telemetry",
      href: "/dashboard?tab=ai-telemetry",
      icon: Activity,
      tabKey: "ai-telemetry",
    },
  ];

  const navItems = adminNavItems;

  const roleLabelMap: Record<DashboardRole, string> = {
    master_admin: "Master Admin",
    branch_admin: "Branch Admin",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 sm:h-16 w-full max-w-[1700px] items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4">
        {/* ── Left: Brand & Mobile Trigger ── */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 group select-none shrink-0 cursor-pointer"
          >
            <img
              src="/logo.svg"
              alt="FITORA logo"
              className="w-8 h-8 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-white font-black text-lg sm:text-xl tracking-wider uppercase leading-none font-sans">
                FITORA
              </span>
              <span className="text-[9px] text-white/60 font-bold tracking-[0.25em] uppercase mt-0.5">
                GYM & AI
              </span>
            </div>
          </Link>
        </div>

        {/* ── Center: Desktop Navigation Links (Inline Pill Navigation) ── */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 transition-all duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isTabActive(item.tabKey, currentTab);
            return (
              <Link
                key={item.tabKey}
                href={item.href}
                title={item.name}
                className={`flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-white text-black font-black shadow-md shadow-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/10 font-bold"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Notifications & Profile ── */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <NotificationDropdown />

          {/* User Profile Dropdown */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition cursor-pointer"
              aria-label="User Profile and Role Switcher"
            >
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black font-black text-xs">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-black" />
              </div>

              <div className="hidden md:block text-left max-w-[110px] overflow-hidden">
                <p className="truncate text-xs font-bold text-white leading-tight">
                  {userName ? userName.split(" ")[0] : "Athlete"}
                </p>
                <p className="truncate text-[10px] font-semibold text-white/50 uppercase leading-tight">
                  {roleLabelMap[role]}
                </p>
              </div>

              <ChevronDown
                className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${
                  showProfileMenu ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Profile & Role Switcher Popover Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/20 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white">
                {/* User Info Header */}
                <div className="px-3 py-2.5 border-b border-white/10 space-y-1">
                  <p className="text-xs font-black text-white truncate">
                    {userName || "FITORA User"}
                  </p>
                  <p className="text-[10px] font-medium text-white/50 truncate">
                    {userEmail || "user@fitora.com"}
                  </p>
                  {assignedBranch && (
                    <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-white/70">
                      <Building2 className="w-3 h-3 text-white/50" />
                      <span className="truncate">{assignedBranch}</span>
                    </div>
                  )}
                </div>

                {/* Role Switcher Section */}
                <div className="py-2">
                  <div className="px-3 py-1 text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Switch Role Preview
                  </div>

                  <div className="space-y-0.5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRole("master_admin");
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        role === "master_admin"
                          ? "bg-white text-black"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Master Admin</span>
                      </div>
                      {role === "master_admin" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole("branch_admin");
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        role === "branch_admin"
                          ? "bg-white text-black"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Branch Admin</span>
                      </div>
                      {role === "branch_admin" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Log Out */}
                <div className="pt-1 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isTabActive(item.tabKey, currentTab);
              return (
                <Link
                  key={item.tabKey}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? "bg-white text-black font-black"
                      : "text-white/70 hover:bg-white/10 hover:text-white font-bold"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
