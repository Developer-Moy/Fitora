"use client";

import PlanCard from "@/components/PlanCard";
import { motion } from "framer-motion";
import { Check, Flame, HelpCircle, Minus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function PlansPage() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plansData = [
        {
            name: "Free Plan",
            monthlyPrice: 0,
            features: [
                "Basic Workout Logging",
                "Limited AI Chat Access (5 queries/day)",
                "Standard Support",
                "Manual Routine Builder",
                "Community Feed Access",
            ],
            accentColor: "gray" as const,
        },
        {
            name: "Pro Plan",
            monthlyPrice: 19.99,
            badge: "Most Popular",
            features: [
                "Unlimited Workout Logs & Analytics",
                "Real-time AI Recovery Index & Readiness",
                "Ad-Free Premium Experience",
                "Multi-Provider AI Fallback Access",
                "Advanced Dynamic Workout Generator",
                "Macro & Nutrition Auto-Tracking",
            ],
            isPopular: true,
            accentColor: "red" as const,
        },
        {
            name: "VIP Elite Plan",
            monthlyPrice: 39.99,
            badge: "Maximum Performance",
            features: [
                "1-on-1 Dedicated AI Trainer Studio",
                "Personalized Custom Meal Plans",
                "Priority 24/7 Support & Live Guidance",
                "Biometric Wearable Sync (Apple/Garmin)",
                "Advanced Injury Prevention Matrix",
                "Unlimited AI Model Switching (Gemini/Groq/OpenAI)",
            ],
            accentColor: "cyan" as const,
        },
    ];

    const comparisonFeatures = [
        { name: "Workout Logging", free: "Basic", pro: "Unlimited", vip: "Unlimited + Biometrics" },
        { name: "AI Recovery Index", free: false, pro: true, vip: true },
        { name: "Dynamic AI Routines", free: false, pro: true, vip: true },
        { name: "Custom Nutrition Plans", free: false, pro: false, vip: true },
        { name: "Multi-AI Fallback Engine", free: false, pro: true, vip: true },
        { name: "1-on-1 AI Studio Coach", free: false, pro: false, vip: true },
        { name: "Support Level", free: "Standard", pro: "Priority", vip: "24/7 VIP Direct" },
    ];

    const faqs = [
        {
            q: "Can I upgrade or downgrade my tier at any time?",
            a: "Yes! You can instantly upgrade or switch your plan inside your account settings. Unused time on your previous tier will be automatically prorated.",
        },
        {
            q: "How does the 14-day free trial work?",
            a: "All paid plans come with a zero-risk 14-day trial. You won't be charged until the trial period ends, and you can cancel anytime with a single click.",
        },
        {
            q: "What AI models power the Fitora AI Engine?",
            a: "Fitora utilizes a high-availability multi-provider pipeline powered by Google Gemini Pro, Groq, and OpenAI models for ultra-fast, contextual training advice.",
        },
    ];

    return (
        <div className="relative min-h-[calc(100vh-3rem)] w-full bg-[#050B14] text-[#F4F7F2] overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#0A1220",
                        color: "#F4F7F2",
                        border: "1px solid #1E293B",
                    },
                }}
            />

            {/* Ambient Radial Background Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
                <div className="absolute top-[5%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#E11D48]/10 blur-[160px]" />
                <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-[#00F2FE]/10 blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E11D48]/40 bg-[#E11D48]/10 text-xs font-bold text-[#FF004D] uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-current" />
                        <span>FITORA MEMBERSHIP TIERS</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-[#F4F7F2]">
                        LEVEL UP YOUR <span className="text-[#E11D48]">PERFORMANCE</span>
                    </h1>
                    <p className="text-base sm:text-lg text-[#94A3B8]">
                        Select an AI-powered fitness plan designed to streamline workout logging, recovery tracking, and optimal strength gains.
                    </p>

                    {/* Billing Toggle Switch */}
                    <div className="pt-6 flex items-center justify-center gap-4">
                        <span className={`text-xs font-bold uppercase tracking-wider ${!isAnnual ? "text-[#F4F7F2]" : "text-[#64748B]"}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-16 h-8 rounded-full bg-[#0A1220] border border-[#1E293B] p-1 transition-colors duration-300 focus:outline-none cursor-pointer"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 32 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF004D] to-[#E11D48]"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isAnnual ? "text-[#F4F7F2]" : "text-[#64748B]"}`}>
                                Annual
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#36D399]/20 text-[#36D399] border border-[#36D399]/40 uppercase">
                                Save 20%
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* 3-Column Pricing Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-12 items-stretch"
                >
                    {plansData.map((plan, index) => (
                        <PlanCard
                            key={index}
                            name={plan.name}
                            monthlyPrice={plan.monthlyPrice}
                            badge={plan.badge}
                            features={plan.features}
                            isPopular={plan.isPopular}
                            accentColor={plan.accentColor}
                            isAnnual={isAnnual}
                        />
                    ))}
                </motion.div>

                {/* Trust Banner */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#36D399]" />
                        <span>14-Day Free Money-Back Guarantee</span>
                    </div>
                    <span>&bull;</span>
                    <div>Instant AI Activation</div>
                    <span>&bull;</span>
                    <div>Cancel or Change Anytime</div>
                </div>

                {/* Feature Comparison Matrix */}
                <div className="w-full max-w-5xl mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F4F7F2] tracking-tight">
                            Compare Plan Features
                        </h2>
                        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                            Detailed breakdown of everything included in our tiers.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#1E293B] bg-[#0A1220]/60 backdrop-blur-xl overflow-x-auto shadow-xl">
                        <table className="w-full text-left text-sm text-[#A8B2AA]">
                            <thead className="bg-[#060D18] border-b border-[#1E293B] text-xs uppercase tracking-wider text-[#F4F7F2]">
                                <tr>
                                    <th className="p-4 font-black">Features</th>
                                    <th className="p-4 font-black text-center">Free</th>
                                    <th className="p-4 font-black text-center text-[#FF004D]">Pro</th>
                                    <th className="p-4 font-black text-center text-[#00F2FE]">VIP Elite</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E293B]/60 font-medium">
                                {comparisonFeatures.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#1E293B]/20 transition-colors">
                                        <td className="p-4 text-[#F4F7F2] font-semibold">{row.name}</td>
                                        <td className="p-4 text-center">
                                            {typeof row.free === "boolean" ? (
                                                row.free ? <Check className="w-4 h-4 text-[#36D399] mx-auto" /> : <Minus className="w-4 h-4 text-[#475569] mx-auto" />
                                            ) : (
                                                row.free
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {typeof row.pro === "boolean" ? (
                                                row.pro ? <Check className="w-4 h-4 text-[#FF004D] mx-auto" /> : <Minus className="w-4 h-4 text-[#475569] mx-auto" />
                                            ) : (
                                                row.pro
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {typeof row.vip === "boolean" ? (
                                                row.vip ? <Check className="w-4 h-4 text-[#00F2FE] mx-auto" /> : <Minus className="w-4 h-4 text-[#475569] mx-auto" />
                                            ) : (
                                                row.vip
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="w-full max-w-4xl mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F4F7F2] tracking-tight">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl border border-[#1E293B] bg-[#0A1220]/60 backdrop-blur-xl"
                            >
                                <h3 className="text-base font-bold text-[#F4F7F2] flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-[#00F2FE]" />
                                    {faq.q}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}