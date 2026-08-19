"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaDumbbell,
    FaShieldHalved,
    FaWandMagicSparkles,
    FaEye,
    FaEyeSlash
} from "react-icons/fa6";

import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

const FITNESS_GOALS = [
    { id: "weight_loss", label: "Weight Loss", desc: "Burn fat & lean out" },
    { id: "muscle_gain", label: "Muscle Gain", desc: "Build size & strength" },
    { id: "maintenance", label: "Maintenance", desc: "Maintain current physique" },
];

export default function RegistrationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        goal: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (validationErrors.length > 0) setValidationErrors([]);
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        const errors: string[] = [];

        if (!formData.name.trim()) errors.push("Full name is required.");
        if (!formData.email.trim()) errors.push("Email address is required.");
        if (formData.password.length < 8) errors.push("Password must be at least 8 characters.");
        if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match.");
        if (!formData.goal) errors.push("Primary Goal is required.");

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            await signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                preference: formData.goal,
            } as {
                email: string;
                password: string;
                name: string;
                preference: string;
            });

            toast.success("Account created successfully!");

        } catch (err: any) {
            const message =
                err?.message || "Failed to create account. Please try again.";

            toast.error(message);
            setValidationErrors([message]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden font-sans text-slate-100">
            {/* Background Glow Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl z-10"
            >
                <div className="rounded-2xl sm:rounded-3xl border border-slate-700/70 bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.7)] flex flex-col gap-8">

                    {/* Header */}
                    <div className="text-center sm:text-left space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight uppercase">
                            Start Your Journey
                        </h1>
                        <p className="text-sm text-slate-400 font-medium">
                            Create an account to get your AI-powered personalized fitness plan.
                        </p>
                    </div>

                    {/* Validation Errors Box */}
                    {validationErrors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="rounded-2xl border border-rose-500/60 bg-rose-500/10 p-4 sm:p-5 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                    <FaShieldHalved size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2 text-sm font-extrabold text-rose-300 tracking-wide uppercase">
                                        Action Required ({validationErrors.length})
                                    </div>
                                    <ul className="grid grid-cols-1 gap-1.5">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="flex items-center gap-2 text-xs text-rose-200/90 font-medium">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="flex flex-col gap-6">

                        {/* Input Grid for Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative">
                                    <FaUser className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Input Grid for Passwords */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <FaLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-12 py-3.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative">
                                    <FaLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-12 py-3.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Goal Selection */}
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2 ml-1">
                                <FaDumbbell className="text-cyan-400" />
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Primary Goal <span className="text-slate-500 font-normal">(Required)</span>
                                </label>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {FITNESS_GOALS.map((goal) => (
                                    <button
                                        key={goal.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, goal: goal.id })}
                                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${formData.goal === goal.id
                                            ? "border-cyan-400/60 bg-cyan-500/20 text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.3)] scale-[1.02]"
                                            : "border-slate-700/60 bg-slate-950/50 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200"
                                            }`}
                                    >
                                        {goal.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gradient Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full px-8 py-4 rounded-xl bg-linear-to-r from-cyan-400 via-teal-300 to-emerald-400 font-black uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.45)] hover:shadow-[0_0_45px_rgba(34,211,238,0.7)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                            ) : (
                                <>
                                    <FaWandMagicSparkles size={18} />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm font-medium text-slate-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4 decoration-cyan-400/30"
                        >
                            Log in here
                        </Link>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}