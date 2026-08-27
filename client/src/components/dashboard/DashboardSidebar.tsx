"use client";

import {
  BookOpen,
  Bot,
  BrainCircuit,
  Building2,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Utensils,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  isAi?: boolean;
}

interface NavGroup {
  category: string;
  links: NavItem[];
}

const navItems: NavGroup[] = [
  {
    category: "MAIN MENU",
    links: [
      { name: "Workout", href: "/dashboard/user/workout", icon: Dumbbell },
      { name: "Planner", href: "/dashboard/user/planner", icon: Calendar },
      { name: "Exercises", href: "/dashboard/user/exercises", icon: BookOpen },
    ],
  },
  {
    category: "ANALYTICS & GOALS",
    links: [
      { name: "Progress", href: "/dashboard/user/progress", icon: TrendingUp },
      { name: "Goals", href: "/dashboard/user/goals", icon: Target },
      { name: "Recovery", href: "/dashboard/user/recovery", icon: HeartPulse },
      { name: "Nutrition", href: "/dashboard/user/nutrition", icon: Utensils },
    ],
  },
  {
    category: "AI SUITE",
    links: [
      {
        name: "AI Coach",
        href: "/dashboard/user/ai-coach",
        icon: Bot,
        isAi: true,
      },
      {
        name: "Form Coach",
        href: "/dashboard/user/form-coach",
        icon: Camera,
        isAi: true,
      },
    ],
  },
];

const adminNavItems: NavGroup[] = [
  {
    category: "CONTROL CENTER",
    links: [
      { name: "Overview", href: "/dashboard/admin/overview", icon: LayoutDashboard },
      { name: "User Management", href: "/dashboard/admin/users", icon: Users },
    ],
  },
  {
    category: "OPERATIONS",
    links: [
      { name: "Branch Network", href: "/dashboard/admin/branches", icon: Building2 },
      { name: "AI Model Control", href: "/dashboard/admin/ai-model", icon: BrainCircuit },
    ],
  },
  {
    category: "CONFIGURATION",
    links: [{ name: "Admin Settings", href: "/dashboard/admin/settings", icon: Settings }],
  },
];

export default function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.startsWith("/dashboard/admin");
  const activeNavItems = isAdminDashboard ? adminNavItems : navItems;

  const handleNavClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const showDetails = !isCollapsed || isMobileOpen;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* HTML Aside Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out select-none
          bg-[#0b0c0e] border-white/[0.08] text-white
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen
            ? "translate-x-0 w-64 shadow-2xl shadow-black"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Header / Brand Logo */}
        <div className="relative flex h-16 items-center border-b border-white/[0.08]">
          <Link
            href="/"
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed && !isMobileOpen
              ? "w-full justify-center"
              : "w-full px-5"
              }`}
            onClick={handleNavClick}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/40 shadow-lg shadow-red-950/40">
              <img
                src="/logo.svg"
                alt="Fitora logo"
                className="w-5 h-5 object-contain"
              />
            </div>

            <span
              className={`text-xl font-extrabold tracking-wider text-white whitespace-nowrap transition-opacity duration-200 ${showDetails
                ? "opacity-100"
                : "opacity-0 w-0 overflow-hidden pointer-events-none"
                }`}
            >
              FITORA<span className="text-red-500">.</span>
            </span>
          </Link>

          {/* Toggle Expand/Collapse Button */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[#141519] text-white/60 hover:text-white hover:border-red-500/50 shadow-md transition-all duration-200 z-10 ${isCollapsed
              ? "absolute right-0 translate-x-1/2"
              : "absolute right-3"
              }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-red-500" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex lg:hidden absolute right-3 h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 ${isCollapsed && !isMobileOpen ? "px-2" : "px-3"
            }`}
        >
          {activeNavItems.map((group) => (
            <div key={group.category} className="space-y-1">
              <p
                className={`px-3 text-[10px] font-extrabold tracking-widest text-white/40 uppercase whitespace-nowrap transition-opacity duration-200 ${showDetails
                  ? "opacity-100"
                  : "opacity-0 h-0 overflow-hidden pointer-events-none"
                  }`}
              >
                {group.category}
              </p>

              {group.links.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    title={isCollapsed && !isMobileOpen ? item.name : undefined}
                    className={`group relative flex items-center transition-all duration-200 ${isActive
                      ? "bg-red-600/15 text-red-500 font-bold border-l-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                      : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                      } ${isCollapsed && !isMobileOpen
                        ? "justify-center h-10 w-10 mx-auto rounded-xl"
                        : "gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold"
                      }`}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon
                        className={`h-5 w-5 transition-colors ${isActive
                          ? item.isAi
                            ? "text-purple-400"
                            : "text-red-500"
                          : item.isAi
                            ? "text-purple-400 group-hover:text-purple-300"
                            : "text-white/60 group-hover:text-white"
                          }`}
                      />
                    </div>

                    <span
                      className={`flex-1 truncate whitespace-nowrap transition-opacity duration-200 ${showDetails
                        ? "opacity-100"
                        : "opacity-0 w-0 overflow-hidden pointer-events-none"
                        }`}
                    >
                      {item.name}
                    </span>

                    {/* AI Feature Pill Badge */}
                    {item.isAi && (
                      <span
                        className={`ml-auto rounded-full bg-purple-950/50 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-800/40 flex items-center gap-1 transition-opacity duration-200 ${showDetails
                          ? "opacity-100"
                          : "opacity-0 w-0 overflow-hidden pointer-events-none"
                          }`}
                      >
                        <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer Account Info Card */}
        <div
          className={`border-t border-white/[0.08] ${isCollapsed && !isMobileOpen ? "p-2 flex justify-center" : "p-3"
            }`}
        >
          <div
            className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${isCollapsed && !isMobileOpen
              ? "justify-center"
              : "p-2.5 bg-[#141519] border border-white/[0.06]"
              }`}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-red-500 text-white font-bold text-sm shadow-md shadow-red-950/50">
              {isAdminDashboard ? "A" : "M"}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0b0c0e]" />
            </div>

            <div
              className={`flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${showDetails
                ? "opacity-100"
                : "opacity-0 w-0 overflow-hidden pointer-events-none"
                }`}
            >
              <p className="truncate text-sm font-bold text-white">
                {isAdminDashboard ? "Fitora Admin" : "Moloy Paul"}
              </p>
              <p className="truncate text-xs text-red-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {isAdminDashboard ? "Administrator" : "Pro Athlete"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}