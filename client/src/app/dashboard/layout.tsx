"use client";

import React, { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      {/* Client Sidebar Component */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Wrapper (Adjusts margin dynamically based on sidebar state) */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 lg:px-8 bg-[#0b0c0e]/80 backdrop-blur-md border-white/[0.08]">
          {/* Left Controls: Mobile Drawer Trigger & Search Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#141519] text-white hover:border-red-500/50"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Input Bar */}
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search workouts, exercises, metrics..."
                className="w-full rounded-xl border py-2 pl-10 pr-4 text-sm outline-none transition-all bg-[#141519] border-white/10 text-white placeholder-white/40 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Right Controls: Notifications */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#141519] text-white/60 hover:text-white hover:border-red-500/50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </button>
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