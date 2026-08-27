"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn, Dumbbell } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validation Error States
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Client-side Form Validation
        if (!validateForm()) {
            toast.error("Please fix the errors in the form before submitting.");
            return;
        }

        setIsLoading(true);

        // 2. Submit Credentials via centralized better-auth client
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password. Please try again.");
                setIsLoading(false);
                return;
            }

            // 3. Success Notification & Redirection
            toast.success("Welcome back! Redirecting to your dashboard...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);

        } catch (err: any) {
            toast.error(err?.message || "An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-3rem)] w-full flex items-center justify-center bg-[#050B14] text-[#F4F7F2] overflow-hidden px-4 py-12">
            {/* Toast Notification Container */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#0A1220",
                        color: "#F4F7F2",
                        border: "1px solid #1E293B",
                        fontSize: "13px",
                        borderRadius: "12px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#00E6A8",
                            secondary: "#050B14",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#F4F7F2",
                        },
                    },
                }}
            />

            {/* Background Glow Elements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00F2FE]/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-[#4FACFE]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Dark Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#1E293B]/80 bg-[#0A1220]/70 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-[#000000]/60">

                {/* Header & Logo */}
                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F2FE] to-[#00E6A8] flex items-center justify-center shadow-lg shadow-[#00F2FE]/25 group-hover:scale-105 transition-transform">
                            <Dumbbell className="w-5 h-5 text-[#050B14]" />
                        </div>
                        <span className="text-2xl font-black tracking-wider uppercase text-[#F4F7F2]">
                            FITORA<span className="text-[#00F2FE]">.</span>
                        </span>
                    </Link>

                    <div className="pt-2">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F4F7F2] uppercase">
                            WELCOME BACK
                        </h1>
                        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                            Log in to access your personalized training & recovery dashboard.
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider uppercase text-[#94A3B8]">
                            EMAIL ADDRESS
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 w-4 h-4 text-[#00F2FE]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                }}
                                placeholder="you@example.com"
                                className={`w-full h-12 pl-11 pr-4 rounded-xl bg-[#060D18]/80 border text-sm text-[#F4F7F2] placeholder-[#475569] focus:outline-none transition-all ${errors.email
                                        ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-[#1E293B] focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]"
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-400 pl-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold tracking-wider uppercase text-[#94A3B8]">
                                PASSWORD
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-[#00F2FE] hover:underline font-medium"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-4 h-4 text-[#00F2FE]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                                }}
                                placeholder="••••••••"
                                className={`w-full h-12 pl-11 pr-11 rounded-xl bg-[#060D18]/80 border text-sm text-[#F4F7F2] placeholder-[#475569] focus:outline-none transition-all ${errors.password
                                        ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-[#1E293B] focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-[#64748B] hover:text-[#F4F7F2] transition-colors"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-400 pl-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Login Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 mt-2 rounded-xl font-black text-sm bg-gradient-to-r from-[#00F2FE] to-[#00E6A8] text-[#050B14] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-[#050B14] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                <span>LOG IN</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-xs text-[#94A3B8]">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-[#00F2FE] hover:underline"
                    >
                        Register here
                    </Link>
                </div>

            </div>
        </div>
    );
}