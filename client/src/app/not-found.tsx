"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Home, Activity, Clock } from "lucide-react";

export default function NotFound() {
  return (
    <main className="h-screen max-h-screen w-full overflow-hidden bg-black text-white flex flex-col justify-between p-6 sm:p-10 select-none relative font-sans">
      {/* Monochrome Ambient Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── Top Header Bar ── */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.svg"
            alt="Fitora logo"
            className="w-7 h-7 object-contain filter brightness-0 invert"
          />
          <span className="font-black text-base tracking-wider uppercase">
            FITORA
          </span>
        </Link>
      </div>

      {/* ── Center Unique Hero Arena (Locked Single Screen) ── */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-6 my-auto">
        {/* Giant Outlined 404 Display */}
        <div className="relative flex items-center justify-center">
          <span className="text-8xl sm:text-[10rem] font-black uppercase leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/70 to-white/10 font-sans">
            404
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Lost Your Routine?
          </h1>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-medium">
            You've strayed outside the training zone. The page you requested has
            been moved or doesn't exist in FITORA's engine.
          </p>
        </div>

        {/* Action Buttons (Compact Signature Pill CTAs) */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl active:scale-95 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-black" />
            <span>RETURN HOME</span>
            <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 bg-neutral-900 border border-white/20 hover:bg-neutral-800 text-white font-bold text-xs px-4.5 py-2.5 rounded-full transition-all duration-300 active:scale-95 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>GO BACK</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Quick Station Navigation Pills ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-center gap-3">
        <Link
          href="/calculator"
          className="flex-1 group flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-white/10 hover:border-white/30 transition-all text-left"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-white shrink-0" />
            <div>
              <h3 className="text-xs font-black uppercase text-white tracking-wider">
                BMI Calculator
              </h3>
              <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
                Body & Macro Engine
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </Link>

        <Link
          href="/stopwatch"
          className="flex-1 group flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-white/10 hover:border-white/30 transition-all text-left"
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-white shrink-0" />
            <div>
              <h3 className="text-xs font-black uppercase text-white tracking-wider">
                Gym Stopwatch
              </h3>
              <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
                Workout & Rest Timer
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </main>
  );
}
