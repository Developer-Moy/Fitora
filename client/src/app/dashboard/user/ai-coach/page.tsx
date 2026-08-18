"use client";

import React from "react";
import AiTrainerChat from "@/components/AiTrainerChat";
import { Sparkles, Bot, Cpu } from "lucide-react";

export default function AiCoachPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#141519] border border-white/[0.08] rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-950/60 border border-purple-800/40 text-purple-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Assistant Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            AI Fitness Coach & Realtime Assistant
          </h1>
          <p className="text-xs text-white/50">
            Ask questions about progressive overload, meal targets, form checks, and recovery routines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-emerald-400 font-semibold">
            <Cpu className="w-4 h-4" /> Gemini AI Connected
          </div>
        </div>
      </div>

      {/* Main AI Chat Container */}
      <div className="flex justify-center pt-2">
        <AiTrainerChat />
      </div>
    </div>
  );
}
