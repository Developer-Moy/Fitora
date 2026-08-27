"use client";

import { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#050B14] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <FiAlertTriangle />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2">
          Something Went Wrong
        </h2>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          An unexpected application error occurred while processing your request. Don't worry, your workout session data is safe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiRefreshCw className="animate-spin-slow" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 bg-white/3 text-gray-300 font-semibold text-sm hover:bg-white/8 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <FiHome />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
