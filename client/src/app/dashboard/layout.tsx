"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import {
  DashboardRoleProvider,
  useDashboardRole,
} from "@/hooks/useDashboardRole";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/dashboard/login";

  const { isAuthenticated, isLoading } = useDashboardRole();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // If on dedicated dashboard login page, render full screen without sidebar/navbar
  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-black text-white">{children}</main>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 select-none">
        <div className="w-9 h-9 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-white/50">
          Authenticating FITORA System...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased select-none">
      {/* Client Sidebar Component */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Wrapper */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Navbar Header — ONLY Search Bar & Notification Panel */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/90 backdrop-blur-md px-4 lg:px-8">
          {/* Left: Mobile Drawer Trigger & Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-neutral-900 text-white cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search athletes, branches, financials, telemetry..."
                className="w-full rounded-full border border-white/15 bg-neutral-900/90 py-2 pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          {/* Right: ONLY Notification Panel */}
          <div className="flex items-center gap-3">
            <NotificationDropdown />
          </div>
        </header>

        {/* Dynamic Page Content Injector */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardRoleProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardRoleProvider>
  );
}
