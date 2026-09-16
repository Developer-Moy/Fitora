"use client";

import React from "react";
import Image from "next/image";

export interface FitoraSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  showLogo?: boolean;
}

export default function FitoraSpinner({
  size = "md",
  label,
  className = "",
  showLogo = true,
}: FitoraSpinnerProps) {
  // Dimensions per size tier
  const dimensions = {
    sm: {
      outer: "w-6 h-6 border-[1.5px]",
      inner: "w-4 h-4 border-[1.5px]",
      logo: "w-2.5 h-2.5",
      text: "text-[9px] tracking-wider px-2 py-0.5",
      container: "gap-1.5",
    },
    md: {
      outer: "w-11 h-11 border-2",
      inner: "w-7 h-7 border-2",
      logo: "w-4 h-4",
      text: "text-[10px] sm:text-xs tracking-widest px-3 py-1",
      container: "gap-2.5",
    },
    lg: {
      outer: "w-16 h-16 border-2",
      inner: "w-10 h-10 border-2",
      logo: "w-6 h-6",
      text: "text-xs font-black tracking-widest px-4 py-1.5",
      container: "gap-3.5",
    },
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${dimensions.container} ${className}`}
      role="status"
      aria-label={label || "Loading"}
    >
      {/* ── Signature Counter-Rotating Dual Rings with Official FITORA Logo ── */}
      <div className="relative flex items-center justify-center">
        {/* Outer Clockwise Ring */}
        <div
          className={`${dimensions.outer} rounded-full border-white/10 border-t-white animate-spin`}
          style={{ animationDuration: "1s" }}
        />

        {/* Inner Counter-Clockwise Precision Ring */}
        <div
          className={`absolute ${dimensions.inner} rounded-full border-white/25 border-b-white/90 animate-[spin_1.5s_linear_infinite_reverse] flex items-center justify-center`}
        />

        {/* Center Official FITORA Vector Brand Logo (/logo.svg) */}
        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/logo.svg"
              alt="FITORA emblem"
              width={24}
              height={24}
              className={`${dimensions.logo} object-contain filter brightness-0 invert animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]`}
            />
          </div>
        )}
      </div>

      {/* Optional Luxury Pill Badge Label */}
      {label && (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 font-black uppercase text-gray-200 backdrop-blur-md animate-pulse shadow-lg ${dimensions.text}`}
        >
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

