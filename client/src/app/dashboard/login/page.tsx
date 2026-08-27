"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Building2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// 📧 Dedicated Email Validation with Specific Distinct Toast Messages
const validateEmail = (emailStr: string): string | null => {
  const trimmed = emailStr.trim();
  if (!trimmed) {
    return "Email Required: Please enter your email address.";
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return "Invalid Email: Must contain '@' and domain (e.g. name@gmail.com).";
  }
  return null;
};

// 🔒 Dedicated Password Validation with Specific Distinct Toast Messages
const validatePassword = (pwd: string): string | null => {
  if (!pwd) {
    return "Password Required: Please enter your password.";
  }
  if (pwd.length < 8) {
    return "Password Error: Minimum 8 characters required.";
  }
  if (pwd.length > 24) {
    return "Password Error: Maximum 24 characters allowed.";
  }
  if (!/[A-Z]/.test(pwd)) {
    return "Password Error: Must contain at least 1 capital letter (A-Z).";
  }
  if (!/[0-9]/.test(pwd)) {
    return "Password Error: Must contain at least 1 digit (0-9).";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
    return "Password Error: Must contain at least 1 symbol (!@#$%^&*).";
  }
  return null;
};

import { dashboardLoginApi, saveAuthSession } from "@/services/authService";

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

    // 1. Validate Email with distinct Toast
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      setErrorMessage(emailError);
      return;
    }

    // 2. Validate Password with distinct Toast
    if (!password) {
      const pwdReq = "Password Required: Please enter your password.";
      toast.error(pwdReq);
      setErrorMessage(pwdReq);
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 3. Call Backend Enterprise Security Gateway API
      const result = await dashboardLoginApi(cleanEmail, cleanPass);

      if (result.success && result.user) {
        toast.success(
          `${result.user.role === "master_admin" ? "Master Admin" : "Branch Admin"} Authenticated! Entering Dashboard...`,
        );
        setSuccessMessage("Security Gateway verified. Entering dashboard...");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 600);
        return;
      }

      // If backend returned a specific error (e.g. 403 regular athlete denied)
      if (result.message && !result.message.includes("Network error")) {
        setIsLoading(false);
        toast.error(result.message);
        setErrorMessage(result.message);
        return;
      }

      // 4. Offline/Local Master Fallback Resilience
      if (
        cleanEmail === "master@fitora.com" &&
        (cleanPass === "P@SSW0RDF!T0R@" || cleanPass === "MasterPassword123!")
      ) {
        saveAuthSession("fitora_master_dev_token", {
          id: "master_01",
          name: "Moloy Paul",
          email: "master@fitora.com",
          role: "master_admin",
          isMasterAdmin: true,
          plan: "VIP Ultimate",
          assignedBranch: "All 64 Branches (Headquarters)",
        });
        toast.success("Master Admin Authenticated! Entering Dashboard...");
        setSuccessMessage("Signed in as Master Admin. Entering dashboard...");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 600);
        return;
      }

      if (
        (cleanEmail.endsWith("admin@fitora.com.bd") ||
          cleanEmail.endsWith("admin@fitora.com") ||
          cleanEmail.includes("admin")) &&
        cleanPass.length >= 6
      ) {
        saveAuthSession("fitora_branch_dev_token", {
          id: "branch_01",
          name: "Branch Manager",
          email: cleanEmail,
          role: "branch_admin",
          isBranchAdmin: true,
          plan: "Pro Athlete",
          assignedBranch: "Gulshan, Dhaka",
        });
        toast.success("Branch Admin Authenticated! Entering Dashboard...");
        setSuccessMessage("Signed in as Branch Admin. Entering dashboard...");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 600);
        return;
      }

      setIsLoading(false);
      const invalidMsg =
        result.message || "Invalid administrator credentials. Access denied.";
      toast.error(invalidMsg);
      setErrorMessage(invalidMsg);
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err.message || "Authentication error occurred.";
      toast.error(errMsg);
      setErrorMessage(errMsg);
    }
  };

  const fillMasterCredentials = () => {
    setEmail("master@fitora.com");
    setPassword("P@SSW0RDF!T0R@");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fillBranchCredentials = () => {
    setEmail("gulshan.admin@fitora.com.bd");
    setPassword("BranchAdmin2025!");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="h-screen max-h-screen w-full bg-black text-white font-sans antialiased flex flex-col justify-between p-3 sm:p-5 overflow-hidden select-none">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#09090b",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "9999px",
            padding: "10px 18px",
          },
        }}
      />

      {/* ── TOP NAVIGATION BAR ── */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-1 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <img
            src="/logo.svg"
            alt="FITORA logo"
            className="w-6 h-6 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-white font-black text-base tracking-wider uppercase leading-none font-sans">
              FITORA
            </span>
            <span className="text-[7.5px] text-neutral-400 font-bold tracking-[0.25em] uppercase">
              GYM & FITNESS
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

      {/* ── MAIN LOGIN CONTAINER (100% NON-SCROLLING COMPACT CARD) ── */}
      <main className="max-w-[420px] w-full mx-auto my-auto shrink-0 space-y-4 py-1">
        {/* Header Title Section */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-[9.5px] font-bold uppercase tracking-widest text-neutral-300">
            <span>Management Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Sign In to Dashboard
          </h1>
          <p className="text-[11px] text-neutral-400">
            Authorized administrator & athlete management access
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-neutral-950 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-2xl">
          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            noValidate
            className="space-y-3 text-xs font-bold uppercase tracking-wider"
          >
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-neutral-400 text-[10px] font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="master@fitora.com"
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 text-xs font-medium lowercase outline-none focus:border-white transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-neutral-400 text-[10px] font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 text-xs font-medium outline-none focus:border-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 group flex items-center justify-between bg-white text-black font-extrabold text-xs sm:text-sm px-5 py-3 rounded-full hover:bg-neutral-100 transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isLoading ? "Signing In..." : "Sign In to Dashboard"}
              </span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <span className="block text-[9.5px] font-bold uppercase text-neutral-500 text-center tracking-wider">
              Quick 1-Click Credential Fill
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillMasterCredentials}
                className="p-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-[10px] font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-white" />
                <span>Master Admin</span>
              </button>

              <button
                type="button"
                onClick={fillBranchCredentials}
                className="p-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-[10px] font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3 h-3 text-white" />
                <span>Branch Admin</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="max-w-5xl mx-auto w-full py-1 text-center text-[9.5px] font-medium text-neutral-500 tracking-wider uppercase shrink-0">
        &copy; {new Date().getFullYear()} FITORA &bull; 64 Nationwide Gym
        Branches
      </footer>
    </div>
  );
}
