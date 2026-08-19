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
    ShieldCheck
} from "lucide-react";

export default function HeroBanner() {
    return (
        <section className="relative min-h-[calc(100vh-3rem)] flex flex-col justify-between overflow-hidden bg-[#F6F8F5] dark:bg-[#0B0F0D] text-[#172019] dark:text-[#F4F7F2] transition-colors duration-300">

            {/* Decorative Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none z-0">
                <div className="absolute top-[-50px] left-[15%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-[#B8F34A]/25 dark:bg-[#B8F34A]/10 blur-[120px]" />
                <div className="absolute top-[50px] right-[10%] w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full bg-[#A78BFA]/20 dark:bg-[#A78BFA]/10 blur-[100px]" />
            </div>

            {/* --- HERO CONTENT MAIN SECTION --- */}
            <div className="relative z-10 flex-1 flex items-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">

                    {/* Left Column: Value Proposition & CTAs */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

                        {/* AI Badge Header */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#A78BFA]/40 bg-[#A78BFA]/10 text-xs sm:text-sm font-semibold text-[#A78BFA]">
                            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                            <span>Next-Gen Multi-Provider AI Fitness Engine</span>
                        </div>

                        {/* Main Headline */}
                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] uppercase text-[#172019] dark:text-[#F4F7F2]">
                                Train Smarter<span className="text-[#B8F34A]">.</span><br />
                                Recover Better<span className="text-[#B8F34A]">.</span><br />
                                <span className="text-[#172019] dark:text-[#F4F7F2]">
                                    Get Stronger<span className="text-[#B8F34A]">.</span>
                                </span>
                            </h1>

                            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-[#536057] dark:text-[#A8B2AA] leading-relaxed pt-2">
                                The all-in-one platform built for athletes and gym trainees. Fitora seamlessly unifies workout logging, dynamic planning, recovery tracking, and AI coaching: <span className="font-semibold text-[#172019] dark:text-[#F4F7F2]">Plan &rarr; Train &rarr; Track &rarr; Recover &rarr; Improve</span>.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-[#B8F34A] text-[#0B0F0D] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#B8F34A]/20 active:scale-95"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5 text-[#0B0F0D]" />
                            </Link>

                            <Link
                                href="#features"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base border border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF] dark:bg-[#192119] text-[#172019] dark:text-[#F4F7F2] flex items-center justify-center gap-2 hover:border-[#B8F34A] transition-all active:scale-95 shadow-sm"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                <span>Explore Features</span>
                            </Link>
                        </div>

                        {/* Feature Indicators */}
                        <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-[#536057] dark:text-[#737D76]">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#36D399]" />
                                <span>Multi-AI Fallback Engine</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#172019] dark:text-[#B8F34A]" />
                                <span>Real-time Workout Logs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#60A5FA]" />
                                <span>Smart Recovery Metrics</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Interactive Card Preview */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="relative w-full max-w-md lg:max-w-none">

                            {/* Card Container */}
                            <div className="relative rounded-2xl border border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF] dark:bg-[#121814] p-6 shadow-xl space-y-5">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-[#DCE3DA] dark:border-[#283229] pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#36D399] animate-pulse" />
                                        <div>
                                            <p className="text-[10px] text-[#536057] dark:text-[#737D76] uppercase tracking-wider font-bold">Today's Focus</p>
                                            <p className="text-sm sm:text-base font-bold text-[#172019] dark:text-[#F4F7F2]">Upper Body Push (A)</p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#B8F34A]/20 text-[#172019] dark:text-[#B8F34A] border border-[#B8F34A]/40">
                                        READY
                                    </span>
                                </div>

                                {/* Exercises (Fixed Text Contrast) */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#EEF2EC] dark:bg-[#192119] border border-[#DCE3DA] dark:border-[#283229]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#B8F34A] text-[#0B0F0D] font-black text-xs">
                                                01
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-[#172019] dark:text-[#F4F7F2]">Barbell Bench Press</p>
                                                <p className="text-[11px] text-[#536057] dark:text-[#A8B2AA]">3 Sets &bull; 8-10 Reps</p>
                                            </div>
                                        </div>
                                        {/* Fixed Color contrast for Light / Dark Mode */}
                                        <span className="text-xs font-mono font-bold text-[#172019] dark:text-[#B8F34A]">80 kg</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#EEF2EC] dark:bg-[#192119] border border-[#DCE3DA] dark:border-[#283229]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#DCE3DA] dark:bg-[#283229] text-[#172019] dark:text-[#F4F7F2] font-black text-xs">
                                                02
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-[#172019] dark:text-[#F4F7F2]">Incline Dumbbell Press</p>
                                                <p className="text-[11px] text-[#536057] dark:text-[#A8B2AA]">3 Sets &bull; 10-12 Reps</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-[#172019] dark:text-[#A8B2AA]">32 kg</span>
                                    </div>
                                </div>

                                {/* Recovery & AI Grid */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="p-3 rounded-xl border border-[#DCE3DA] dark:border-[#283229] bg-[#F6F8F5] dark:bg-[#0B0F0D]">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-[#536057] dark:text-[#A8B2AA] font-semibold">Recovery</span>
                                            <Activity className="w-3.5 h-3.5 text-[#36D399]" />
                                        </div>
                                        <p className="text-base sm:text-lg font-black text-[#172019] dark:text-[#36D399]">88%</p>
                                        <p className="text-[10px] text-[#536057] dark:text-[#737D76]">Optimal sleep & low fatigue</p>
                                    </div>

                                    <div className="p-3 rounded-xl border border-[#A78BFA]/40 bg-[#A78BFA]/10">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-[#A78BFA] font-bold">AI Coach</span>
                                            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                                        </div>
                                        <p className="text-[11px] font-semibold text-[#172019] dark:text-[#F4F7F2] line-clamp-2">
                                            "Increase bench volume by +2.5kg today."
                                        </p>
                                    </div>
                                </div>

                                {/* Goal Progress */}
                                <div className="pt-1">
                                    <div className="flex justify-between text-xs mb-1 font-semibold">
                                        <span className="text-[#536057] dark:text-[#A8B2AA]">Weekly Goal Target</span>
                                        <span className="font-mono text-[#172019] dark:text-[#B8F34A]">4 / 5 Workouts</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#EEF2EC] dark:bg-[#283229] overflow-hidden">
                                        <div className="h-full bg-[#B8F34A] w-[80%] rounded-full" />
                                    </div>
                                </div>

                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -left-4 bg-[#FFFFFF] dark:bg-[#192119] border border-[#DCE3DA] dark:border-[#283229] px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 hidden sm:flex">
                                <div className="p-1.5 rounded-lg bg-[#36D399]/20 text-[#36D399]">
                                    <TrendingUp className="w-4 h-4 text-[#36D399]" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#172019] dark:text-[#F4F7F2]">+12.5% Strength Gain</p>
                                    <p className="text-[10px] text-[#536057] dark:text-[#737D76]">Last 30 days overall</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* --- BOTTOM STRIP --- */}
            <div className="relative z-10 py-3 border-t border-[#DCE3DA] dark:border-[#283229] bg-[#FFFFFF]/60 dark:bg-[#121814]/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#536057] dark:text-[#737D76]">
                    <p className="font-medium">Fitora AI Platform Engine</p>
                    <span>Google Gemini &bull; Groq &bull; OpenAI Multi-AI Fallback</span>
                </div>
            </div>

        </section>
    );
}