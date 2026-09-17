"use client";

import TermsAndConditions from "@/components/Legal/Terms&Conditions";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
        
        {/* Glassmorphism Page Header */}
        <div className="mb-12 p-8 sm:p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/8 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-white/40"></span>
              Legal Information
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-md">
              Terms &amp; Conditions
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl font-medium">
              Review our terms below. These rules ensure a safe and secure experience for all Fitora athletes.
            </p>
          </div>
        </div>

        {/* 2-Column Grid Wrapper for the Content */}
        <div className="
          [&>div]:grid [&>div]:grid-cols-1 lg:[&>div]:grid-cols-2 [&>div]:gap-6 lg:[&>div]:gap-8 [&>div]:items-stretch
          [&>div>div]:mt-0! 
          lg:[&>div>div:first-child]:col-span-2 [&>div>div:first-child]:mb-4
          
          [&_div.border]:relative [&_div.border]:overflow-hidden [&_div.border]:flex [&_div.border]:flex-col [&_div.border]:h-full
          [&_div.border]:bg-white/5 [&_div.border]:backdrop-blur-md 
          [&_div.border]:border-white/10 [&_div.border]:shadow-[0_8px_30px_rgb(0,0,0,0.5)]
          [&_div.border]:transition-all [&_div.border]:duration-300
          
          [&_div.border:hover]:bg-white/8 [&_div.border:hover]:border-white/20
          
          [&_div.border]:before:absolute [&_div.border]:before:inset-x-0 [&_div.border]:before:top-0 [&_div.border]:before:h-px
          [&_div.border]:before:bg-linear-to-r [&_div.border]:before:from-transparent [&_div.border]:before:via-white/20 [&_div.border]:before:to-transparent
        ">
          <TermsAndConditions />
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-center">
          <p className="text-[11px] font-bold tracking-widest uppercase text-white/25">
            © {new Date().getFullYear()} Fitora. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
