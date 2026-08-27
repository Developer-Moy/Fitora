"use client";

import Link from "next/link";
import { FiAlertOctagon, FiArrowLeft, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-4xl shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <FiAlertOctagon />
        </div>

        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 via-rose-400 to-amber-400 tracking-wider mb-2">
          404
        </h1>

        <h2 className="text-2xl font-bold mb-3 text-white">Page Not Found</h2>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          The fitness page or resource you are looking for has been moved, deleted, or doesn't exist in our training catalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
          >
            <FiHome />
            <span>Return Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 bg-white/3 text-gray-300 font-semibold text-sm hover:bg-white/8 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
