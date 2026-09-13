"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FitoraSpinner from "./FitoraSpinner";

export interface FitoraPillButtonProps {
  children: React.ReactNode;
  variant?: "black" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  title?: string;
}

export default function FitoraPillButton({
  children,
  variant = "black",
  size = "md",
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  showIcon = true,
  className = "",
  type = "button",
  target,
  rel,
  title,
}: FitoraPillButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs gap-2",
    md: "px-5 py-2.5 text-xs sm:text-sm gap-2.5",
    lg: "px-6 py-3.5 text-sm sm:text-base gap-3",
  }[size];

  const badgeSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  }[size];

  const iconSizeClasses = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  }[size];

  const isBlack = variant === "black";

  const baseStyles =
    "group inline-flex items-center justify-center font-extrabold uppercase tracking-wider rounded-full transition-all duration-300 shadow-xl cursor-pointer select-none leading-none";

  const variantStyles = isBlack
    ? "bg-black text-white border border-white/25 hover:bg-black hover:border-white/60 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.97]"
    : "bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97]";

  const badgeStyles = isBlack
    ? "bg-white text-black group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md"
    : "bg-black text-white group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md";

  const disabledStyles =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100";

  const combinedClasses =
    `${baseStyles} ${sizeClasses} ${variantStyles} ${disabledStyles} ${className}`.trim();

  const renderedIcon = icon || (
    <ArrowUpRight className={`${iconSizeClasses} stroke-[2.5]`} />
  );

  const content = (
    <>
      <span className="truncate">{children}</span>

      {showIcon && (
        <span
          className={`${badgeSizeClasses} rounded-full flex items-center justify-center shrink-0 ${badgeStyles}`}
          aria-hidden="true"
        >
          {loading ? (
            <FitoraSpinner size="sm" />
          ) : (
            renderedIcon
          )}
        </span>
      )}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={combinedClasses}
        target={target}
        rel={rel}
        title={title}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      title={title}
    >
      {content}
    </button>
  );
}