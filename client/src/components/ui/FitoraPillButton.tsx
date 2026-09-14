"use client";

import React from "react";

type FitoraPillButtonProps = {
  variant: "black" | "white";
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
};

export function FitoraPillButton({
  variant,
  children,
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className = "",
  "aria-label": ariaLabel,
}: FitoraPillButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center gap-2 font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all duration-300 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const variants: Record<"black" | "white", string> = {
    black:
      "bg-neutral-950 border border-white/15 text-white hover:border-white/40",
    white:
      "bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] shadow-xl",
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
