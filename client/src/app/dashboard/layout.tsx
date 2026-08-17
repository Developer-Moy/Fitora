"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    // Synchronize Dark Mode Class on Root Document Element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-[#F6F8F5] dark:bg-[#0B0F0D] text-[#172019] dark:text-[#F4F7F2] transition-colors duration-200">
            {/* Client Sidebar Component */}
            <DashboardSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Wrapper (Adjusts margin dynamically based on sidebar state) */}
            <div
                className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${isCollapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
            >
                {/* Top Navbar Header */}
                <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 lg:px-8 
          bg-[#FFFFFF]/80 dark:bg-[#0B0F0D]/80 backdrop-blur-md 
          border-[#DCE3DA] dark:border-[#283229]"
                >
                    {/* Left Controls: Mobile Drawer Trigger & Search Bar */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF] dark:bg-[#121814] text-[#172019] dark:text-[#F4F7F2]"
                            aria-label="Open Navigation Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Global Search Input Bar (Inspired by layout reference) */}
                        <div className="relative hidden sm:block w-64 md:w-80">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A857C] dark:text-[#737D76]" />
                            <input
                                type="text"
                                placeholder="Search workouts, exercises, metrics..."
                                className="w-full rounded-xl border py-2 pl-10 pr-4 text-sm outline-none transition-all
                  bg-[#F6F8F5] dark:bg-[#121814] 
                  border-[#DCE3DA] dark:border-[#283229]
                  text-[#172019] dark:text-[#F4F7F2]
                  placeholder-[#7A857C] dark:placeholder-[#737D76]
                  focus:border-[#B8F34A] focus:ring-1 focus:ring-[#B8F34A]"
                            />
                        </div>
                    </div>

                    {/* Right Controls: Notifications, Theme Switcher, & User Identity */}
                    <div className="flex items-center gap-3">
                        {/* Dark / Light Mode Toggle Button */}
                        <button
                            onClick={() => setIsDarkMode((prev) => !prev)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF] dark:bg-[#121814] text-[#536057] dark:text-[#A8B2AA] hover:text-[#172019] dark:hover:text-[#F4F7F2] transition-colors"
                            title="Switch Theme"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5 text-[#B8F34A]" />
                            ) : (
                                <Moon className="h-5 w-5 text-[#172019]" />
                            )}
                        </button>

                        {/* Notifications Button */}
                        <button
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF] dark:bg-[#121814] text-[#536057] dark:text-[#A8B2AA] hover:text-[#172019] dark:hover:text-[#F4F7F2] transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#B8F34A]" />
                        </button>

                        {/* User Profile Header Chip */}
                        <div className="flex items-center gap-3 border-l border-[#DCE3DA] dark:border-[#283229] pl-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B8F34A] font-bold text-[#0B0F0D] text-sm">
                                U
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold leading-tight text-[#172019] dark:text-[#F4F7F2]">
                                    User
                                </p>
                                <p className="text-xs text-[#7A857C] dark:text-[#737D76]">
                                    Athlete
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content Injector */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}