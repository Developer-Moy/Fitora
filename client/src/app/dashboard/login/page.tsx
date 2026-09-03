"use client";

import { dashboardLoginApi } from "@/services/authService";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      const err = "Email Required: Please enter your admin email.";
      toast.error(err);
      setErrorMessage(err);
      return;
    }

    if (!cleanPass) {
      const err = "Password Required: Please enter your admin password.";
      toast.error(err);
      setErrorMessage(err);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Attempt API Gateway Login
      const result = await dashboardLoginApi(cleanEmail, cleanPass);

      if (result.success && result.user) {
        toast.success(
          `${result.user.role === "master_admin" ? "Master Admin" : "Branch Admin"} Authenticated! Entering Dashboard...`,
        );
        setSuccessMessage("Security Gateway verified. Entering dashboard...");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 500);
        return;
      }

      setIsLoading(false);
      const invalidMsg =
        result.message || "Invalid administrator credentials. Access denied.";
      toast.error(invalidMsg);
      setErrorMessage(invalidMsg);
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err?.message || "Authentication error occurred.";
      toast.error(errMsg);
      setErrorMessage(errMsg);
    }
  };

  const fillMasterCredentials = () => {
    setEmail("master@fitora.com");
    setPassword("P@SSW0RDF!T0R@");
    setErrorMessage(null);
    setSuccessMessage(null);
    toast.success("Loaded Master Admin credentials");
  };

  const fillBranchCredentials = () => {
    setEmail("gulshan.admin@fitora.com.bd");
    setPassword("BranchAdmin2025!");
    setErrorMessage(null);
    setSuccessMessage(null);
    toast.success("Loaded Branch Admin credentials");
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 select-none overflow-x-hidden">


      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <img
            src="/logo.svg"
            alt="FITORA logo"
            className="w-7 h-7 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-white font-black text-base tracking-wider uppercase leading-none font-sans">
              FITORA
            </span>
            <span className="text-[8px] text-neutral-400 font-bold tracking-[0.25em] uppercase">
              ADMIN GATEWAY
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-[440px] w-full mx-auto my-auto shrink-0 space-y-5 py-6">
        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-white/15 text-[10px] font-bold uppercase tracking-widest text-neutral-300">
            <Shield className="w-3 h-3" />
            <span>Management Security Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-sans uppercase tracking-tight text-white select-none">
            Sign In to Dashboard
          </h1>
          <p className="text-xs text-neutral-400">
            Access restricted to Master Admin & 64-District Directors.
          </p>
        </div>

        {/* Quick Fill Credentials Pills */}
        <div className="space-y-2">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 text-center">
            One-Click Administrative Demo Profiles:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillMasterCredentials}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Master Admin</span>
            </button>
            <button
              type="button"
              onClick={fillBranchCredentials}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Branch Admin</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="master@fitora.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-900 border border-white/15 text-white text-sm placeholder-neutral-500 outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300">
              Security Passkey
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-900 border border-white/15 text-white text-sm placeholder-neutral-500 outline-none focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer disabled:opacity-60"
          >
            <span>{isLoading ? "Authenticating..." : "Enter Dashboard"}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center py-2 shrink-0">
        <p className="text-[10px] text-neutral-500 font-medium">
          FITORA Central Management Architecture © 2026. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
