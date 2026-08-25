"use client";

import { Camera, Sparkles, Video, CheckCircle2 } from "lucide-react";

export default function UserFormCoachPage() {
  return (
    <div className="space-y-8 select-none font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            AI VISION ANALYSIS
          </p>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          AI FORM COACH & TECHNIQUE AUDITOR
        </h1>
        <p className="mt-1 text-xs text-white/50">
          Upload or capture your exercise video for computer-vision movement
          tracking and biomechanical analysis.
        </p>
      </div>

      {/* Video Upload Dropzone */}
      <div className="rounded-3xl border-2 border-dashed border-white/20 bg-neutral-950 p-12 text-center space-y-4 hover:border-white/40 transition cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
          <Camera className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-white">
            UPLOAD EXERCISE VIDEO OR RECORD LIVE
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-md mx-auto">
            Supports MP4, MOV, or WEBM up to 100MB. AI will analyze joint angle
            trajectory and spine alignment.
          </p>
        </div>

        <button
          type="button"
          className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-gray-100 transition shadow-xl cursor-pointer"
        >
          SELECT VIDEO FILE
        </button>
      </div>

      {/* Biomechanical Checks */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          AI BIOMECHANICAL FORM CHECKS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
            <span className="text-[9px] font-bold text-white/40 uppercase">
              SQUAT DEPTH
            </span>
            <div className="text-sm font-black text-white">PARALLEL (92°)</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
            <span className="text-[9px] font-bold text-white/40 uppercase">
              SPINE ALIGNMENT
            </span>
            <div className="text-sm font-black text-white">
              NEUTRAL (100% PASS)
            </div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
            <span className="text-[9px] font-bold text-white/40 uppercase">
              KNEE VALGUS
            </span>
            <div className="text-sm font-black text-white">ZERO DRIFT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
