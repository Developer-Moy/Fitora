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
      {
        name: "Overview",
        href: "/dashboard/admin/overview",
        icon: LayoutDashboard,
      },
      { name: "User Management", href: "/dashboard/admin/users", icon: Users },
    ],
  },
  {
    category: "OPERATIONS",
    links: [
      {
        name: "Branch Network",
        href: "/dashboard/admin/branches",
        icon: Building2,
      },
      {
        name: "AI Model Control",
        href: "/dashboard/admin/ai-model",
        icon: BrainCircuit,
      },
    ],
  },
  {
    category: "CONFIGURATION",
    links: [
      {
        name: "Admin Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
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
          ${
            isMobileOpen
              ? "translate-x-0 w-64 shadow-2xl shadow-black"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Header / Brand Logo */}
        <div className="relative flex h-16 items-center border-b border-white/10">
          <Link
            href="/"
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300 group ${
              isCollapsed && !isMobileOpen
                ? "w-full justify-center"
                : "w-full px-4"
            }`}
            onClick={handleNavClick}
          >
            <img
              src="/logo.svg"
              alt="Fitora logo"
              className="w-8 h-8 shrink-0 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
            />

            <div
              className={`flex flex-col whitespace-nowrap transition-opacity duration-200 ${
                showDetails
                  ? "opacity-100"
                  : "opacity-0 w-0 overflow-hidden pointer-events-none"
              }`}
            >
              <span className="text-white font-black text-lg tracking-wider uppercase leading-none font-sans">
                FITORA
              </span>
              <span className="text-[8px] text-gray-400 font-bold tracking-[0.25em] uppercase mt-0.5">
                GYM & AI
              </span>
            </div>
          </Link>

          {/* Toggle Expand/Collapse Button */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-neutral-900 text-white/70 hover:text-white hover:border-white shadow-md transition-all duration-200 z-10 cursor-pointer ${
              isCollapsed
                ? "absolute right-0 translate-x-1/2"
                : "absolute right-3"
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
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
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 ${
            isCollapsed && !isMobileOpen ? "px-2" : "px-3"
          }`}
        >
          {activeNavItems.map((group) => (
            <div key={group.category} className="space-y-1">
              <p
                className={`px-3 text-[10px] font-black tracking-widest text-white/40 uppercase whitespace-nowrap transition-opacity duration-200 ${
                  showDetails
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden pointer-events-none"
                }`}
              >
                {group.category}
              </p>

              {group.links.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isCollapsedMode = isCollapsed && !isMobileOpen;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    title={isCollapsedMode ? item.name : undefined}
                    className={`group relative flex items-center transition-all duration-200 ${
                      isActive
                        ? "bg-white text-black font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        : "text-white/70 hover:bg-neutral-900 hover:text-white"
                    } ${
                      isCollapsedMode
                        ? "justify-center items-center h-10 w-10 mx-auto rounded-xl"
                        : "gap-3 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider"
                    }`}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? "text-black"
                            : "text-white/60 group-hover:text-white"
                        }`}
                      />
                    </div>

                    {showDetails && (
                      <>
                        <span className="flex-1 truncate whitespace-nowrap">
                          {item.name}
                        </span>

                        {item.isAi && (
                          <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black text-white border border-white/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
                            AI
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer Account Info Card */}
        <div
          className={`border-t border-white/10 ${
            isCollapsed && !isMobileOpen ? "p-2 flex justify-center" : "p-3"
          }`}
        >
          <div
            className={`flex items-center gap-3 rounded-2xl transition-all duration-200 ${
              isCollapsed && !isMobileOpen
                ? "justify-center"
                : "p-2.5 bg-neutral-900 border border-white/15 shadow-xl"
            }`}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/30 bg-neutral-950 shadow-md">
              <img
                src="/coache1.jpg.jpeg"
                alt="Master Admin Profile"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-black" />
            </div>

            <div
              className={`flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
                showDetails
                  ? "opacity-100"
                  : "opacity-0 w-0 overflow-hidden pointer-events-none"
              }`}
            >
              <p className="truncate text-xs font-black uppercase tracking-wider text-white">
                {isAdminDashboard ? "MASTER ADMIN" : "PRO ATHLETE"}
              </p>
              <p className="truncate text-[9px] text-white/50 font-bold tracking-wider uppercase mt-0.5">
                {isAdminDashboard ? "admin@fitora.com" : "PRO MEMBER"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
