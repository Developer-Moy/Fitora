"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import {
  DashboardRoleProvider,
  useDashboardRole,
} from "@/hooks/useDashboardRole";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/dashboard/login";

  const { isAuthenticated, isLoading, role } = useDashboardRole();
  const isStaffAdmin = role === "master_admin" || role === "branch_admin";

  useEffect(() => {
    if (isLoginPage || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/dashboard/login");
      return;
    }

    if (!isStaffAdmin) {
      router.replace("/");
    }
  }, [isLoginPage, isLoading, isAuthenticated, isStaffAdmin, router]);

  // If on dedicated dashboard login page, render full screen without sidebar/navbar
  if (isLoginPage) {
    return <main className="min-h-screen bg-black text-white">{children}</main>;
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

  if (!isAuthenticated || !isStaffAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-4 select-none">
        <ShieldAlert className="w-14 h-14 text-rose-500" />
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Access Restricted
          </h1>
          <p className="text-xs text-white/60 max-w-md">
            The FITORA Administrative Dashboard is strictly reserved for Master
            Admin and Branch Admins. Athletes and members cannot access this
            console.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-black text-xs uppercase hover:bg-gray-100 transition shadow-lg cursor-pointer"
        >
          Return to FITORA Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased select-none flex flex-col">
      {/* Top Navbar with brand, inline navigation links, compact search, and profile dropdown */}
      <DashboardNavbar />

      {/* Main Content Wrapper - Full width and spacious for data */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 max-w-[1700px] w-full mx-auto space-y-3 sm:space-y-4">
        {children}
      </main>
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
