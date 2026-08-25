"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowUpRight } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Boundary caught error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden font-sans">
      {/* Monochrome Ambient Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Headline & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Something Went Wrong.
          </h1>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
            An unexpected error occurred while processing your request. Don't
            worry, your workout session data is safe.
          </p>
        </div>

        {/* Action Buttons (Signature Pill CTAs) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="group inline-flex items-center gap-2.5 bg-white text-black font-extrabold text-xs px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5 text-black" />
            <span>TRY AGAIN</span>
            <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900 border border-white/20 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-3 rounded-full transition-all duration-300 active:scale-95 cursor-pointer w-full sm:w-auto justify-center shadow-md"
          >
            <Home className="w-3.5 h-3.5" />
            <span>GO HOME</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
