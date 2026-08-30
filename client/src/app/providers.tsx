"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

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
