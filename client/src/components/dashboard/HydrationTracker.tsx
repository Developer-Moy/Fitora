"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, RotateCcw, Trophy } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import toast from "react-hot-toast";

/** Utility for clean tailwind class merging */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Types for local storage structure */
interface HydrationData {
    date: string;
    intake: number;
    goal: number;
}

interface Particle {
    id: number;
    scale: number;
    x: number;
    y: number;
    colorClass: string;
}

const STORAGE_KEY = "hydration_tracker_data";
const DEFAULT_GOAL = 3500;
const ADD_AMOUNT = 250;

/** Utility to get local YYYY-MM-DD */
const getLocalToday = () => {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
};

export default function HydrationTracker() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [intake, setIntake] = useState(0);
    const [goal, setGoal] = useState(DEFAULT_GOAL);

    // UI states
    const [hasCelebrated, setHasCelebrated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [confirmReset, setConfirmReset] = useState(false);

    // Derived state
    const isCompleted = isLoaded && intake >= goal;
    const progressPercentage = isLoaded ? Math.min(intake / goal, 1) : 0;

    // UI Display derived state
    const remainingAmount = Math.max(goal - intake, 0);
    const remainingGlasses = Math.ceil(remainingAmount / ADD_AMOUNT);
    const displayIntakeL = intake / 1000;
    const displayGoalL = goal / 1000;
    const displayPercentage = Math.round(progressPercentage * 100);

    /**
     * Extracted persistence handler.
     */
    const persistData = useCallback((date: string, newIntake: number, newGoal: number) => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date, intake: newIntake, goal: newGoal })
        );
        setIntake(newIntake);
        setGoal(newGoal);
    }, []);

    /**
     * Celebration particle generator. 
     */
    const triggerCelebration = useCallback(() => {
        const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            scale: Math.random() * 0.5 + 0.5,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200 - 50,
            colorClass: i % 2 === 0 ? "bg-emerald-400" : "bg-rose-400"
        }));

        setParticles(newParticles);
        setShowConfetti(true);
        setHasCelebrated(true);

        // Auto-cleanup confetti
        setTimeout(() => setShowConfetti(false), 3000);
    }, []);

    // Initialization & Validation
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            await Promise.resolve();
            if (!isMounted) return;

            const today = getLocalToday();
            const storedData = localStorage.getItem(STORAGE_KEY);

            let initialIntake = 0;
            let initialGoal = DEFAULT_GOAL;
            let initialCelebrated = false;

            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData) as HydrationData;
                    if (parsed.date === today) {
                        initialIntake = parsed.intake;
                        initialGoal = parsed.goal || DEFAULT_GOAL;
                        if (initialIntake >= initialGoal) {
                            initialCelebrated = true; // Already finished today previously
                        }
                    } else {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, intake: 0, goal: DEFAULT_GOAL }));
                    }
                } catch (error) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, intake: 0, goal: DEFAULT_GOAL }));
                }
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, intake: 0, goal: DEFAULT_GOAL }));
            }

            setIntake(initialIntake);
            setGoal(initialGoal);
            setHasCelebrated(initialCelebrated);
            setIsLoaded(true);
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleAddWater = useCallback(() => {
        if (!isLoaded || isCompleted) return;

        const today = getLocalToday();
        const newIntake = intake + ADD_AMOUNT;

        persistData(today, newIntake, goal);
        setConfirmReset(false);

        if (newIntake >= goal && !hasCelebrated) {
            triggerCelebration();
            toast.success("🎉 Daily hydration goal completed! Great job!", { duration: 4000 });
        } else {
            toast.success(`+${ADD_AMOUNT}ml logged (${newIntake}ml / ${goal}ml) 💧`, { id: "water-intake" });
        }
    }, [isLoaded, isCompleted, intake, goal, hasCelebrated, persistData, triggerCelebration]);

    const executeReset = useCallback(() => {
        const today = getLocalToday();
        persistData(today, 0, goal);
        setHasCelebrated(false);
        setConfirmReset(false);
        setShowConfetti(false);
        toast("Hydration tracker reset to 0ml", { icon: "🔄", id: "water-reset" });
    }, [goal, persistData]);

    // Cancel reset confirmation if not interacted with
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (confirmReset) {
            timer = setTimeout(() => setConfirmReset(false), 4000); // slightly longer to allow reading Yes/No
        }
        return () => clearTimeout(timer);
    }, [confirmReset]);

    // SVG Configuration
    const ringRadius = 85;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const strokeDashoffset = ringCircumference - progressPercentage * ringCircumference;

    return (
        <section className="relative w-full max-w-md lg:max-w-3xl mx-auto group my-15">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-[3rem] -z-10 transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

            <div className="bg-slate-900/85 border border-slate-700/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12 items-center lg:items-stretch text-center shadow-lg relative overflow-hidden">

                {/* Left Column (Desktop) */}
                <div className="w-full flex flex-col">
                    {/* Header Area */}
                    <div className="w-full flex justify-between items-start mb-8 lg:mb-12">
                        <div className="flex flex-col items-start gap-0.5">
                            <h2 className="text-slate-100 font-medium text-lg flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-emerald-400" />
                                Hydration
                            </h2>
                            <span className="text-sm text-slate-500 font-medium ml-7">Today</span>
                        </div>

                        {/* Reset Button (Absolute on Desktop to sit top-right) */}
                        <div className="flex items-center h-8 lg:absolute lg:top-10 lg:right-10 lg:z-10">
                            <AnimatePresence mode="wait">
                                {!confirmReset ? (
                                    <motion.button
                                        key="reset-btn"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => setConfirmReset(true)}
                                        disabled={!isLoaded}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                                            "bg-slate-950/70 text-slate-500 border-slate-700/70 hover:text-slate-300 hover:border-slate-600",
                                            !isLoaded && "opacity-50 cursor-not-allowed"
                                        )}
                                        aria-label="Reset hydration"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="confirm-btns"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                    >
                                        <button
                                            onClick={executeReset}
                                            className="px-3 py-1.5 rounded-xl text-sm font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all duration-200"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setConfirmReset(false)}
                                            className="px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-950/70 text-slate-400 border border-slate-700/70 hover:text-slate-300 hover:border-slate-600 transition-all duration-200"
                                        >
                                            No
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Progress Ring Area */}
                    <div className="relative flex justify-center items-center mb-6 lg:mb-0 w-full">
                        {/* Confetti Particle System */}
                        <AnimatePresence>
                            {showConfetti && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                                    {particles.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                            animate={{
                                                opacity: 0,
                                                scale: p.scale,
                                                x: p.x,
                                                y: p.y,
                                            }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={cn(
                                                "absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                                                p.colorClass
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>

                        <svg width="220" height="220" className="transform -rotate-90">
                            {/* Background Track */}
                            <circle
                                cx="110"
                                cy="110"
                                r={ringRadius}
                                fill="transparent"
                                strokeWidth="16"
                                className="stroke-slate-950/70"
                            />

                            {/* Progress Stroke */}
                            <motion.circle
                                cx="110"
                                cy="110"
                                r={ringRadius}
                                fill="transparent"
                                strokeWidth="16"
                                strokeLinecap="round"
                                className="stroke-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                initial={{ strokeDasharray: ringCircumference, strokeDashoffset: ringCircumference }}
                                animate={{
                                    strokeDashoffset: isLoaded ? strokeDashoffset : ringCircumference
                                }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </svg>

                        {/* Inner Ring Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {!isLoaded ? (
                                <div className="flex flex-col items-center gap-2 animate-pulse">
                                    <div className="w-16 h-8 bg-slate-800 rounded-md"></div>
                                    <div className="w-12 h-4 bg-slate-800 rounded-md"></div>
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        key={displayPercentage}
                                        initial={{ scale: 0.9, opacity: 0.8 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-5xl font-bold text-slate-100 tracking-tight flex items-start"
                                    >
                                        {displayPercentage}
                                        <span className="text-2xl text-slate-400 ml-0.5 mt-1">%</span>
                                    </motion.div>
                                    <div className="text-sm font-medium text-slate-500 mt-1">
                                        Complete
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Desktop) */}
                <div className="w-full flex flex-col items-center justify-center lg:mt-6 lg:pt-18">
                    {/* Outer Liters Display */}
                    <div className="mb-8 flex items-baseline justify-center gap-1.5 transition-opacity duration-300" style={{ opacity: isLoaded ? 1 : 0 }}>
                        <span className="text-xl font-semibold text-slate-100">{displayIntakeL} L</span>
                        <span className="text-slate-500 text-sm mx-0.5">/</span>
                        <span className="text-lg font-medium text-slate-400">{displayGoalL} L</span>
                    </div>

                    {/* Action Button & Subtext Area */}
                    <div className="min-h-22 flex flex-col items-center justify-start w-full">
                        <AnimatePresence mode="wait">
                            {isLoaded && isCompleted ? (
                                <motion.div
                                    key="completed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-medium">
                                        <Trophy className="w-5 h-5" />
                                        Goal Completed
                                    </div>

                                    <div className="text-sm font-medium text-emerald-400/70">
                                        All done for today! 🎉
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="add-water"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center w-full"
                                >
                                    <button
                                        onClick={handleAddWater}
                                        disabled={!isLoaded}
                                        className={cn(
                                            "flex items-center justify-center gap-2 w-full max-w-50 py-3.5 rounded-2xl font-semibold transition-all duration-300",
                                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                            "hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
                                            "active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                        )}
                                        aria-label="Add 250 milliliters of water"
                                    >
                                        <FaGlassWaterDroplet className="w-4 h-5" />
                                        +250ml Glass
                                    </button>

                                    <div className="text-sm font-medium text-slate-500 mt-3">
                                        {remainingGlasses}{" "}
                                        {remainingGlasses === 1 ? "glass" : "glasses"} remaining
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    );
}