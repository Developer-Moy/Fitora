"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Suppress browser extension (e.g. Bitdefender TrafficLight bis_skin_checked) DOM mutation hydration warnings in Dev mode
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorStr = args
      .map((arg) => {
        try {
          if (typeof arg === "string") return arg;
          if (typeof arg === "object") return JSON.stringify(arg);
          return String(arg);
        } catch {
          return "";
        }
      })
      .join(" ");

    if (
      errorStr.includes("bis_skin_checked") ||
      errorStr.includes("bis_register") ||
      errorStr.includes("__processed_") ||
      (errorStr.includes("hydration-mismatch") && errorStr.includes("bis_"))
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      )}
      {children}
    </>
  );
}
