"use client";

type FitoraSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export function FitoraSpinner({ size = "md", className = "" }: FitoraSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sizeMap[size]} border-white/20 border-t-white rounded-full animate-spin ${className}`}
    />
  );
}
