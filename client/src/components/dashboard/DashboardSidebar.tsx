"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Dumbbell,
    Calendar,
    BookOpen,
    TrendingUp,
    Target,
    HeartPulse,
    Utensils,
    Bot,
    Camera,
    ChevronLeft,
    ChevronRight,
    X,
    Zap,
    LucideIcon,
} from "lucide-react";

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

export default function DashboardSidebar({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
}: SidebarProps) {
    const pathname = usePathname();

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
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* HTML Aside Sidebar Container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out select-none
          bg-[#FFFFFF] dark:bg-[#121814] 
          border-[#DCE3DA] dark:border-[#283229]
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen
                        ? "translate-x-0 w-64"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Header / Brand Logo */}
                <div className="relative flex h-16 items-center border-b border-[#DCE3DA] dark:border-[#283229]">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed && !isMobileOpen
                                ? "w-full justify-center"
                                : "w-full px-4"
                            }`}
                        onClick={handleNavClick}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B8F34A] text-[#0B0F0D]">
                            <Zap className="h-5 w-5 fill-[#0B0F0D]" />
                        </div>

                        <span
                            className={`text-xl font-extrabold tracking-tight text-[#172019] dark:text-[#F4F7F2] whitespace-nowrap transition-opacity duration-200 ${showDetails
                                    ? "opacity-100"
                                    : "opacity-0 w-0 overflow-hidden pointer-events-none"
                                }`}
                        >
                            FITORA<span className="text-[#B8F34A]">.</span>
                        </span>
                    </Link>

                    {/* Floating Toggle Button directly on border line */}
                    <button
                        onClick={() => setIsCollapsed((prev) => !prev)}
                        className={`hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF] dark:bg-[#192119] text-[#536057] dark:text-[#A8B2AA] hover:text-[#172019] dark:hover:text-[#F4F7F2] shadow-sm transition-all duration-200 z-10 ${isCollapsed
                                ? "absolute right-0 translate-x-1/2"
                                : "absolute right-3"
                            }`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="flex lg:hidden absolute right-3 h-8 w-8 items-center justify-center rounded-lg text-[#536057] dark:text-[#A8B2AA]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Navigation Body */}
                <div
                    className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6 scrollbar-thin ${isCollapsed && !isMobileOpen ? "px-0" : "px-3"
                        }`}
                >
                    {navItems.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1">
                            <p
                                className={`px-3 text-[10px] font-bold tracking-wider text-[#7A857C] dark:text-[#737D76] uppercase whitespace-nowrap transition-opacity duration-200 ${showDetails
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
                                                ? "bg-[#B8F34A]/15 text-[#172019] dark:text-[#B8F34A]"
                                                : "text-[#536057] dark:text-[#A8B2AA] hover:bg-[#EEF2EC] dark:hover:bg-[#192119] hover:text-[#172019] dark:hover:text-[#F4F7F2]"
                                            } ${isCollapsed && !isMobileOpen
                                                ? "justify-center h-10 w-10 mx-auto rounded-xl"
                                                : "gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold"
                                            }`}
                                    >
                                        {/* Active Bar Indicator */}
                                        {isActive && (
                                            <span
                                                className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#B8F34A] ${isCollapsed && !isMobileOpen ? "-left-3" : ""
                                                    }`}
                                            />
                                        )}

                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                                            <Icon
                                                className={`h-5 w-5 transition-colors ${isActive
                                                        ? item.isAi
                                                            ? "text-[#A78BFA]"
                                                            : "text-[#172019] dark:text-[#B8F34A]"
                                                        : item.isAi
                                                            ? "text-[#A78BFA] group-hover:text-[#A78BFA]"
                                                            : "text-[#536057] dark:text-[#A8B2AA] group-hover:text-[#172019] dark:group-hover:text-[#F4F7F2]"
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
                                                className={`ml-auto rounded-md bg-[#A78BFA]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#A78BFA] border border-[#A78BFA]/30 whitespace-nowrap transition-opacity duration-200 ${showDetails
                                                        ? "opacity-100"
                                                        : "opacity-0 w-0 overflow-hidden pointer-events-none"
                                                    }`}
                                            >
                                                AI
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer User Info Card */}
                <div
                    className={`border-t border-[#DCE3DA] dark:border-[#283229] ${isCollapsed && !isMobileOpen ? "p-0 py-3 flex justify-center" : "p-3"
                        }`}
                >
                    <div
                        className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${isCollapsed && !isMobileOpen
                                ? "justify-center"
                                : "p-2 bg-[#EEF2EC] dark:bg-[#192119]"
                            }`}
                    >
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#B8F34A] text-[#0B0F0D] font-bold text-sm">
                            U
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#36D399] ring-2 ring-[#FFFFFF] dark:ring-[#121814]" />
                        </div>

                        <div
                            className={`flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${showDetails
                                    ? "opacity-100"
                                    : "opacity-0 w-0 overflow-hidden pointer-events-none"
                                }`}
                        >
                            <p className="truncate text-sm font-bold text-[#172019] dark:text-[#F4F7F2]">
                                User
                            </p>
                            <p className="truncate text-xs text-[#7A857C] dark:text-[#737D76]">
                                Athlete Mode
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}