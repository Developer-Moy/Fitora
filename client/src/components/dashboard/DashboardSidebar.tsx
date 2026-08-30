"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useDashboardRole } from "@/hooks/useDashboardRole";
import {
  LayoutDashboard,
  Users,
  Building2,
  QrCode,
  TrendingUp,
  CreditCard,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Zap,
  LucideIcon,
  Shield,
  Crown,
  User,
  Dumbbell,
  Utensils,
  Target,
  Layers,
  Circle,
  ChevronsUpDown,
  HeartPulse,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavSubItem {
  name: string;
  href: string;
  tabKey: string;
  icon?: LucideIcon;
  masterOnly?: boolean;
}

interface NavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  tabKey?: string;
  masterOnly?: boolean;
  subItems?: NavSubItem[];
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const adminNavGroups: NavGroup[] = [
  {
    category: "CORE",
    items: [
      {
        name: "Executive Overview",
        href: "/dashboard?tab=overview",
        icon: LayoutDashboard,
        tabKey: "overview",
      },
    ],
  },
  {
    category: "OPERATIONS",
    items: [
      {
        name: "Gym Management",
        icon: Building2,
        subItems: [
          {
            name: "User Management",
            href: "/dashboard?tab=users",
            tabKey: "users",
            icon: Users,
          },
          {
            name: "64 Branches Directory",
            href: "/dashboard?tab=branches",
            tabKey: "branches",
            icon: Building2,
            masterOnly: true,
          },
          {
            name: "Live QR Attendance",
            href: "/dashboard?tab=attendance",
            tabKey: "attendance",
            icon: QrCode,
          },
        ],
      },
      {
        name: "Finance & Growth",
        icon: TrendingUp,
        subItems: [
          {
            name: "Income & MRR Growth",
            href: "/dashboard?tab=revenue",
            tabKey: "revenue",
            icon: TrendingUp,
          },
          {
            name: "bKash & Nagad Gateways",
            href: "/dashboard?tab=payments",
            tabKey: "payments",
            icon: CreditCard,
          },
          {
            name: "Membership Packages",
            href: "/dashboard?tab=packages",
            tabKey: "packages",
            icon: Layers,
          },
        ],
      },
    ],
  },
  {
    category: "SYSTEM & TELEMETRY",
    items: [
      {
        name: "Platform Telemetry",
        href: "/dashboard?tab=ai-telemetry",
        icon: Activity,
        tabKey: "ai-telemetry",
      },
    ],
  },
];

const memberNavGroups: NavGroup[] = [
  {
    category: "CORE",
    items: [
      {
        name: "Member Dashboard",
        href: "/dashboard?tab=overview",
        icon: LayoutDashboard,
        tabKey: "overview",
      },
    ],
  },
  {
    category: "FITNESS & LIFESTYLE",
    items: [
      {
        name: "Training Routine",
        icon: Dumbbell,
        subItems: [
          {
            name: "Digital QR Pass",
            href: "/dashboard?tab=entry-pass",
            tabKey: "entry-pass",
            icon: QrCode,
          },
          {
            name: "Workout Session Log",
            href: "/dashboard?tab=workout-log",
            tabKey: "workout-log",
            icon: Dumbbell,
          },
          {
            name: "Nutrition & Hydration",
            href: "/dashboard?tab=nutrition-log",
            tabKey: "nutrition-log",
            icon: Utensils,
          },
          {
            name: "PR Goals & Records",
            href: "/dashboard?tab=goals-log",
            tabKey: "goals-log",
            icon: Target,
          },
        ],
      },
      {
        name: "Personal Training Studio",
        href: "/dashboard?tab=ai-coach",
        icon: HeartPulse,
        tabKey: "ai-coach",
      },
      {
        name: "64 Gyms Directory",
        href: "/dashboard?tab=branches",
        icon: Building2,
        tabKey: "branches",
      },
    ],
  },
  {
    category: "ACCOUNT & SETTINGS",
    items: [
      {
        name: "Profile & Settings",
        href: "/dashboard?tab=profile",
        icon: User,
        tabKey: "profile",
      },
      {
        name: "Upgrade to Pro Athlete",
        href: "/dashboard?tab=upgrade",
        icon: Crown,
        tabKey: "upgrade",
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
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const { role, setRole, userName, isMasterAdmin, isBranchAdmin } =
    useDashboardRole();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Accordion State: Track which parent menus are open
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      "Gym Management": true,
      "Finance & Growth": true,
      "Training Routine": true,
    },
  );

  const toggleAccordion = (name: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenAccordions((prev) => ({ ...prev, [name]: true }));
    } else {
      setOpenAccordions((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  };

  const handleNavClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const showDetails = !isCollapsed || isMobileOpen;
  const navGroups =
    isMasterAdmin || isBranchAdmin ? adminNavGroups : memberNavGroups;

  // Auto-expand accordion when a child item is active
  useEffect(() => {
    navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems?.some((sub) => sub.tabKey === currentTab)) {
          setOpenAccordions((prev) => ({ ...prev, [item.name]: true }));
        }
      });
    });
  }, [currentTab, navGroups]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Aside Sidebar Container — Strict Homepage Luxury Dark Theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-white/10 bg-neutral-950 text-white transition-all duration-300 ease-in-out select-none ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Brand Logo Container */}
        <div className="relative flex h-16 sm:h-20 w-full items-center border-b border-white/10">
          {isCollapsed && !isMobileOpen ? (
            <div className="w-full h-full flex items-center justify-center">
              <Link
                href="/"
                onClick={handleNavClick}
                className="flex items-center justify-center group"
                title="FITORA - GYM & AI"
              >
                <img
                  src="/logo.svg"
                  alt="Fitora logo"
                  className="w-8 h-8 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
                />
              </Link>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between px-4">
              <Link
                href="/"
                onClick={handleNavClick}
                className="flex items-center gap-3 group"
                title="FITORA - GYM & AI"
              >
                <img
                  src="/logo.svg"
                  alt="Fitora logo"
                  className="w-8 h-8 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-white font-black text-lg tracking-wider uppercase leading-none font-sans whitespace-nowrap">
                    FITORA
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold tracking-[0.25em] uppercase whitespace-nowrap mt-0.5">
                    GYM & FITNESS
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex h-8 w-8 rounded-full border border-white/15 bg-neutral-900 text-white/70 hover:text-white hover:bg-neutral-800 items-center justify-center transition cursor-pointer"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsMobileOpen(false)}
                className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Floating Collapse Toggle on border when collapsed */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-neutral-900 text-white/80 hover:text-white hover:bg-white hover:text-black shadow-2xl transition z-50 cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6 scrollbar-thin ${
            isCollapsed && !isMobileOpen ? "px-0" : "px-3"
          }`}
        >
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {showDetails && (
                <p className="px-3 text-[10px] font-bold tracking-widest text-neutral-400 uppercase whitespace-nowrap mb-1">
                  {group.category}
                </p>
              )}

              {group.items.map((item) => {
                if (item.masterOnly && !isMasterAdmin) return null;

                const Icon = item.icon;
                const hasSubItems = Boolean(
                  item.subItems && item.subItems.length > 0,
                );
                const isSubItemActive =
                  hasSubItems &&
                  item.subItems?.some((sub) => sub.tabKey === currentTab);
                const isDirectActive =
                  !hasSubItems &&
                  pathname === "/dashboard" &&
                  currentTab === item.tabKey;
                const isOpen = openAccordions[item.name] ?? false;

                // ── CASE 1: ACCORDION ITEM WITH SUB-MENUS ──
                if (hasSubItems) {
                  return (
                    <div key={item.name} className="space-y-1">
                      {/* Parent Accordion Trigger Button */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.name)}
                        title={
                          isCollapsed && !isMobileOpen ? item.name : undefined
                        }
                        className={`w-full group relative flex items-center transition-all duration-200 cursor-pointer ${
                          isSubItemActive
                            ? "text-white font-bold bg-white/5"
                            : "text-neutral-300 hover:bg-neutral-900 hover:text-white font-medium"
                        } ${
                          isCollapsed && !isMobileOpen
                            ? "justify-center h-10 w-10 mx-auto rounded-full"
                            : "gap-3 rounded-xl px-3 py-2 text-[13px] justify-between"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                            <Icon
                              className={`h-4.5 w-4.5 transition-colors ${
                                isSubItemActive
                                  ? "text-white"
                                  : "text-neutral-400 group-hover:text-white"
                              }`}
                            />
                          </div>

                          {showDetails && (
                            <span className="truncate whitespace-nowrap text-left font-semibold">
                              {item.name}
                            </span>
                          )}
                        </div>

                        {showDetails && (
                          <div className="text-neutral-400 group-hover:text-white transition-transform">
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </button>

                      {/* Sub-Menu Drawer Items (Rendered when open and expanded) */}
                      {showDetails && isOpen && (
                        <div className="ml-4 pl-3.5 py-1 space-y-1 border-l border-white/15 my-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          {item.subItems?.map((sub) => {
                            if (sub.masterOnly && !isMasterAdmin) return null;
                            const isChildActive = currentTab === sub.tabKey;
                            const SubIcon = sub.icon;

                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={handleNavClick}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                  isChildActive
                                    ? "bg-white text-black font-bold shadow-md"
                                    : "text-neutral-300 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {SubIcon ? (
                                  <SubIcon
                                    className={`w-4 h-4 shrink-0 ${isChildActive ? "text-black" : "text-neutral-400"}`}
                                  />
                                ) : (
                                  <Circle
                                    className={`w-1.5 h-1.5 shrink-0 ${isChildActive ? "fill-black text-black" : "text-neutral-500"}`}
                                  />
                                )}
                                <span className="truncate">{sub.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // ── CASE 2: DIRECT LINK ITEM (NO SUB-MENUS) ──
                return (
                  <Link
                    key={item.name}
                    href={item.href || "/dashboard"}
                    onClick={handleNavClick}
                    title={isCollapsed && !isMobileOpen ? item.name : undefined}
                    className={`group relative flex items-center transition-all duration-200 ${
                      isDirectActive
                        ? "bg-white text-black font-bold shadow-lg"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-white font-medium"
                    } ${
                      isCollapsed && !isMobileOpen
                        ? "justify-center h-10 w-10 mx-auto rounded-full p-0"
                        : "gap-3 rounded-xl px-3 py-2.5 text-[13px]"
                    }`}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon
                        className={`h-4.5 w-4.5 transition-colors ${
                          isDirectActive
                            ? "text-black"
                            : "text-neutral-400 group-hover:text-white"
                        }`}
                      />
                    </div>

                    {showDetails && (
                      <span className="flex-1 truncate whitespace-nowrap font-semibold">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Info Card & Role Switcher */}
        <div
          className={`relative border-t border-white/10 ${
            isCollapsed && !isMobileOpen
              ? "p-0 py-3 flex justify-center"
              : "p-3"
          }`}
        >
          {/* Role Switcher Popover Menu */}
          {showRoleMenu && (
            <div
              className={`absolute bottom-full mb-2 bg-neutral-900 border border-white/15 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                isCollapsed && !isMobileOpen ? "left-2 w-56" : "left-3 right-3"
              }`}
            >
              <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-between">
                <span>Switch Preview Role</span>
                <button
                  type="button"
                  onClick={() => setShowRoleMenu(false)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setRole("master_admin");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    role === "master_admin"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Master Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("branch_admin");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    role === "branch_admin"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Branch Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("premium_user");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    role === "premium_user"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>Premium Athlete</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("free_user");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    role === "free_user"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Free Member</span>
                </button>

                <div className="pt-2 mt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("fitora_auth_session");
                        localStorage.removeItem("fitora_active_role");
                        localStorage.removeItem("fitora_active_branch");
                      }
                      setShowRoleMenu(false);
                      window.location.href = "/dashboard/login";
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Profile Card / Trigger */}
          <button
            type="button"
            onClick={() => setShowRoleMenu((prev) => !prev)}
            className={`w-full flex items-center transition-all duration-200 cursor-pointer ${
              isCollapsed && !isMobileOpen
                ? "justify-center"
                : "gap-3 p-2.5 rounded-2xl bg-neutral-900 border border-white/10 hover:border-white/30 text-left"
            }`}
            title="Click to Switch Role Preview"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black font-black text-xs">
              {userName.charAt(0)}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
            </div>

            {showDetails && (
              <>
                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  <p className="truncate text-xs font-bold text-white tracking-wide">
                    {userName.split(" ")[0]}
                  </p>
                  <p className="truncate text-[10px] font-medium text-neutral-400 tracking-wider uppercase flex items-center gap-1">
                    <span>{role.replace("_", " ")}</span>
                  </p>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-neutral-400" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
