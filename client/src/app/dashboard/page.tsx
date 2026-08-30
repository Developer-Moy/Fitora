"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/services/authService";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const { user } = getAuthSession();
    if (
      user?.role === "master_admin" ||
      user?.role === "branch_admin" ||
      user?.role === "admin"
    ) {
      router.replace("/dashboard/admin/overview");
    } else {
      router.replace("/dashboard/user/ai-coach");
    }
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <p className="text-xs text-white/50 font-medium">
          Entering FITORA Dashboard...
        </p>
      </div>
    </div>
  );
}
