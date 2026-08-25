"use client";

import {
  BrainCircuit,
  Cpu,
  Sparkles,
  Activity,
  ShieldAlert,
} from "lucide-react";

export default function AdminAiModelPage() {
  return (
    <div className="space-y-8 select-none font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            SYSTEM TELEMETRY
          </p>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          AI MODEL CONTROL & LATENCY MONITOR
        </h1>
        <p className="mt-1 text-xs text-white/50">
          Monitor token consumption, prompt latency, safety guardrails, and
          model deployment states.
        </p>
      </div>

      {/* Model Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5 space-y-2 shadow-xl">
          <span className="text-[9px] font-bold text-white/40 uppercase">
            PRIMARY MODEL
          </span>
          <div className="text-xl font-black text-white">GEMINI 1.5 PRO</div>
          <span className="text-[9px] font-black text-white uppercase px-2 py-0.5 rounded-full bg-white/10 inline-block">
            100% HEALTH
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5 space-y-2 shadow-xl">
          <span className="text-[9px] font-bold text-white/40 uppercase">
            AVERAGE LATENCY
          </span>
          <div className="text-xl font-black text-white">420 MS</div>
          <span className="text-[9px] font-black text-white uppercase px-2 py-0.5 rounded-full bg-white/10 inline-block">
            OPTIMAL SPEED
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5 space-y-2 shadow-xl">
          <span className="text-[9px] font-bold text-white/40 uppercase">
            DAILY TOKENS USED
          </span>
          <div className="text-xl font-black text-white">2.4M / 10M</div>
          <span className="text-[9px] font-black text-white uppercase px-2 py-0.5 rounded-full bg-white/10 inline-block">
            24% CAPACITY
          </span>
        </div>
      </div>
    </div>
  );
}
