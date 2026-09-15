"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <main
      className={`flex-1 ${
        isDashboard || isAuthPage ? "" : "pt-16 sm:pt-20"
      }`}
    >
      {children}
    </main>
  );
}
