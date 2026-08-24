"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Activity,
  Zap,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-black text-white transition-colors duration-300">
      {/* Decorative Background Glows (Pure Monochrome Neutral) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none z-0">
        <div className="absolute top-[-50px] left-[15%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute top-[50px] right-[10%] w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full bg-white/5 blur-[100px]" />
      </div>

      {/* --- HERO CONTENT MAIN SECTION --- */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* AI Badge Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs sm:text-sm font-semibold text-white">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Next-Gen Multi-Provider AI Fitness Engine</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] uppercase text-white">
                Train Smarter<span className="text-gray-400">.</span>
                <br />
                Recover Better<span className="text-gray-400">.</span>
                <br />
                <span className="text-white">
                  Get Stronger<span className="text-white">.</span>
                </span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-300 leading-relaxed pt-2">
                The all-in-one platform built for athletes and gym trainees. Fitora
                seamlessly unifies workout logging, dynamic planning, recovery
                tracking, and AI coaching:{" "}
                <span className="font-semibold text-white">
                  Plan &rarr; Train &rarr; Track &rarr; Recover &rarr; Improve
                </span>
                .
              </p>
            </div>

            {/* CTA Buttons (Pure Black & White) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-base bg-white hover:bg-gray-200 text-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </Link>

              <Link
                href="#ai-trainer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 shadow-sm"
              >
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Explore Features</span>
              </Link>
            </div>

            {/* Feature Indicators */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Multi-AI Fallback Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span>Real-time Workout Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-white" />
                <span>Smart Recovery Metrics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Card Container (Pure Black & White) */}
              <div className="relative rounded-2xl border border-white/15 bg-[#0E0F12] p-6 shadow-2xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        Today's Focus
                      </p>
                      <p className="text-sm sm:text-base font-bold text-white">
                        Upper Body Push (A)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white text-black">
                    READY
                  </span>
                </div>

                {/* Exercises */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white text-black font-black text-xs">
                        01
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">
                          Barbell Bench Press
                        </p>
                        <p className="text-[11px] text-gray-400">
                          3 Sets &bull; 8-10 Reps
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      80 kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 text-white font-black text-xs">
                        02
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">
                          Incline Dumbbell Press
                        </p>
                        <p className="text-[11px] text-gray-400">
                          3 Sets &bull; 10-12 Reps
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-300">
                      32 kg
                    </span>
                  </div>
                </div>

                {/* Recovery & AI Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-white/15 bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-300 font-semibold">
                        Recovery
                      </span>
                      <Activity className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-base sm:text-lg font-black text-white">
                      88%
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Optimal sleep & low fatigue
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-white/15 bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white font-bold">
                        AI Coach
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-300 line-clamp-2">
                      "Increase bench volume by +2.5kg today."
                    </p>
                  </div>
                </div>

                {/* Goal Progress */}
                <div className="pt-1">
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-gray-400">Weekly Goal Target</span>
                    <span className="font-mono text-white font-bold">
                      4 / 5 Workouts
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-white w-[80%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#0E0F12] border border-white/15 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 hidden sm:flex">
                <div className="p-1.5 rounded-lg bg-white/10 text-white">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    +12.5% Strength Gain
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Last 30 days overall
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM STRIP --- */}
      <div className="relative z-10 py-3 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p className="font-semibold text-white">Fitora AI Platform Engine</p>
          <span>
            Google Gemini &bull; Groq &bull; OpenAI Multi-AI Fallback
          </span>
        </div>
      </div>
    </section>
  );
}