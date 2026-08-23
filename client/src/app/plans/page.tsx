"use client";

import React, { useState } from "react";
import PlanCard from "@/components/PlanCard";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Flame,
    Crown,
    User,
    X,
    CreditCard,
    Lock,
    CheckCircle2,
    Dumbbell,
} from "lucide-react";

export default function PlansPage() {
    const [isAnnual, setIsAnnual] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({ name: "", price: "" });

    // User Tier State
    const [userTier, setUserTier] = useState<string>("Free Tier");

    // Modal Form State
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
                "Unlimited AI Model Switching",
            ],
            accentColor: "cyan" as const,
        },
    ];

    const handleSelectPlan = (name: string, price: string) => {
        if (price === "0.00" || price === "0") {
            toast.success("Free Tier active by default.");
            return;
        }
        setSelectedPlan({ name, price });
        setIsModalOpen(true);
    };

    // Format Card Number (adds spaces every 4 digits)
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
        setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
    };

    // Format Expiry Date (MM/YY)
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (val.length >= 3) {
            setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
        } else {
            setExpiry(val);
        }
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!cardNumber || !expiry || !cvc || !nameOnCard) {
            toast.error("Please fill in all payment details.");
            return;
        }

        setIsProcessing(true);

        // Simulate Payment Processing API
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            toast.success(`Payment Successful! You are now ${selectedPlan.name}.`);

            setTimeout(() => {
                setUserTier(selectedPlan.name);
                setIsSuccess(false);
                setIsModalOpen(false);
                setCardNumber("");
                setExpiry("");
                setCvc("");
                setNameOnCard("");
            }, 1500);
        }, 2000);
    };

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

            {/* Background Ambient Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
                <div className="absolute top-[5%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#E11D48]/10 blur-[160px]" />
                <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-[#00F2FE]/10 blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">

                {/* Profile Status Header */}
                <div className="w-full max-w-xl mb-10 p-4 rounded-2xl border border-[#1E293B] bg-[#0A1220]/80 backdrop-blur-xl flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8]">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-[#94A3B8] font-medium">
                                Logged in User
                            </p>
                            <h4 className="text-sm font-bold text-[#F4F7F2]">
                                Athlete Account
                            </h4>
                        </div>
                    </div>

                    {/* Glowing Member Status Badge */}
                    {userTier !== "Free Tier" ? (
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF004D]/20 to-[#00F2FE]/20 border border-[#00F2FE]/50 shadow-[0_0_20px_rgba(0,242,254,0.4)] animate-pulse">
                            <Crown className="w-4 h-4 text-[#00F2FE]" />
                            <span className="text-xs font-black uppercase text-[#F4F7F2] tracking-wider">
                                {userTier} MEMBER
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-[#64748B] bg-[#1E293B] px-3 py-1 rounded-full">
                            FREE TIER
                        </span>
                    )}
                </div>

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E11D48]/40 bg-[#E11D48]/10 text-xs font-bold text-[#FF004D] uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-current" />
                        <span>FITORA MEMBERSHIP TIERS</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-[#F4F7F2]">
                        LEVEL UP YOUR <span className="text-[#E11D48]">PERFORMANCE</span>
                    </h1>

                    {/* Billing Switch */}
                    <div className="pt-6 flex items-center justify-center gap-4">
                        <span
                            className={`text-xs font-bold uppercase ${!isAnnual ? "text-[#F4F7F2]" : "text-[#64748B]"
                                }`}
                        >
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-16 h-8 rounded-full bg-[#0A1220] border border-[#1E293B] p-1 cursor-pointer"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 32 : 0 }}
                                className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF004D] to-[#E11D48]"
                            />
                        </button>
                        <span
                            className={`text-xs font-bold uppercase ${isAnnual ? "text-[#F4F7F2]" : "text-[#64748B]"
                                }`}
                        >
                            Annual (Save 20%)
                        </span>
                    </div>
                </motion.div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
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
                            onSelect={handleSelectPlan}
                            isCurrentPlan={userTier === plan.name}
                        />
                    ))}
                </div>

                {/* Security Footer */}
                <div className="mt-12 flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#36D399]" />
                    <span>Instant Member Status Activation & Instant Access</span>
                </div>

            </div>

            {/* Stripe Checkout Overlay Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-[#050B14]/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="relative z-10 w-full max-w-lg rounded-3xl border border-[#1E293B] bg-[#0A1220]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-[#000000]/80 overflow-hidden"
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#E11D48]/20 blur-3xl pointer-events-none" />

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-5 right-5 text-[#64748B] hover:text-[#F4F7F2] p-2 rounded-full hover:bg-[#1E293B]/50 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {isSuccess ? (
                                <div className="py-12 flex flex-col items-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-[#00E6A8]/20 border border-[#00E6A8]/40 flex items-center justify-center text-[#00E6A8] shadow-[0_0_30px_rgba(0,230,168,0.3)] animate-bounce">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase text-[#F4F7F2] tracking-wider">
                                        PAYMENT SUCCESSFUL!
                                    </h3>
                                    <p className="text-sm text-[#94A3B8] max-w-xs">
                                        Your membership status is upgraded to{" "}
                                        <span className="text-[#00F2FE] font-bold">
                                            {selectedPlan.name}
                                        </span>
                                        .
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF004D] to-[#E11D48] flex items-center justify-center shadow-lg shadow-[#E11D48]/30">
                                            <Dumbbell className="w-5 h-5 text-[#050B14]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black uppercase text-[#F4F7F2] tracking-wider">
                                                CHECKOUT
                                            </h2>
                                            <p className="text-xs text-[#94A3B8]">
                                                Secured by Stripe Express Encryption
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#060D18] border border-[#1E293B] mb-6 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-bold uppercase text-[#FF004D] tracking-wider">
                                                Selected Tier
                                            </span>
                                            <h4 className="text-base font-black text-[#F4F7F2]">
                                                {selectedPlan.name} ({isAnnual ? "Annual" : "Monthly"})
                                            </h4>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-[#F4F7F2]">
                                                ${selectedPlan.price}
                                            </div>
                                            <span className="text-[10px] text-[#64748B]">
                                                / month
                                            </span>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                                NAME ON CARD
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Alex Mercer"
                                                value={nameOnCard}
                                                onChange={(e) => setNameOnCard(e.target.value)}
                                                className="w-full h-11 px-4 mt-1 rounded-xl bg-[#060D18] border border-[#1E293B] text-sm text-[#F4F7F2] placeholder-[#475569] focus:outline-none focus:border-[#E11D48] transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                                CARD NUMBER
                                            </label>
                                            <div className="relative flex items-center mt-1">
                                                <CreditCard className="absolute left-4 w-4 h-4 text-[#64748B]" />
                                                <input
                                                    type="text"
                                                    placeholder="4242 •••• •••• 4242"
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#060D18] border border-[#1E293B] text-sm text-[#F4F7F2] placeholder-[#475569] focus:outline-none focus:border-[#E11D48] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                                    EXPIRY DATE
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={handleExpiryChange}
                                                    className="w-full h-11 px-4 mt-1 rounded-xl bg-[#060D18] border border-[#1E293B] text-sm text-[#F4F7F2] placeholder-[#475569] focus:outline-none focus:border-[#E11D48] transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                                    CVC CODE
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="123"
                                                    maxLength={4}
                                                    value={cvc}
                                                    onChange={(e) =>
                                                        setCvc(e.target.value.replace(/\D/g, ""))
                                                    }
                                                    className="w-full h-11 px-4 mt-1 rounded-xl bg-[#060D18] border border-[#1E293B] text-sm text-[#F4F7F2] placeholder-[#475569] focus:outline-none focus:border-[#E11D48] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full h-12 mt-4 rounded-xl font-black text-xs tracking-widest uppercase bg-gradient-to-r from-[#FF004D] to-[#E11D48] text-[#050B14] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(225,29,72,0.4)] hover:shadow-[0_0_35px_rgba(225,29,72,0.6)] transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-[#050B14] border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    <span>PAY ${selectedPlan.price} & UPGRADE</span>
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#64748B] font-medium">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#36D399]" />
                                        <span>256-bit SSL Encrypted Mock Checkout</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}