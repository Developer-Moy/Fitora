"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ChevronsRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// High-Contrast Google SVG Icon
const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Zero-Border Sleek Universal Slide Pill (100% Identical Height & Scale to Login & Google Buttons: h-11 / 44px)
function UniversalSlidePill({
  label,
  onAction,
}: {
  label: string;
  onAction: () => void;
}) {
  const [isSliding, setIsSliding] = useState(false);

  const handleSlideAction = () => {
    if (isSliding) return;
    setIsSliding(true);
    setTimeout(() => {
      onAction();
      setIsSliding(false);
    }, 350);
  };

  return (
    <div
      onClick={handleSlideAction}
      className="relative w-full h-11 bg-neutral-900/90 rounded-full p-1 flex items-center justify-between shadow-2xl backdrop-blur-xl cursor-pointer select-none overflow-hidden transition-all duration-300 group"
    >
      {/* Track & Text Area */}
      <div className="relative flex-1 h-full flex items-center justify-between overflow-hidden cursor-pointer px-1">
        <span className="text-[10px] xs:text-[11px] font-black uppercase text-white tracking-wider truncate pl-11 z-10 drop-shadow">
          {label}
        </span>
        <ChevronsRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors shrink-0 z-10 mr-2" />

        {/* Single Pure White Circle Knob */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 380 }}
          dragElastic={0.05}
          animate={{ left: isSliding ? "calc(100% - 36px)" : "4px" }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          onDrag={(_, info) => {
            if (info.offset.x >= 100 && !isSliding) {
              handleSlideAction();
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSlideAction();
          }}
          className="absolute top-0 bottom-0 my-auto w-8.5 h-8.5 bg-white text-black rounded-full flex items-center justify-center shadow-2xl cursor-grab active:cursor-grabbing z-20 group-hover:scale-105 transition-transform"
        >
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </motion.div>
      </div>
    </div>
  );
}

type Step = "welcome" | "login" | "register";

interface AuthFlowProps {
  initialStep?: Step;
}

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
  if (pwd.length > 16) {
    return "Password Error: Maximum 16 characters allowed.";
  }
  if (!/[A-Z]/.test(pwd)) {
    return "Password Error: Must contain at least 1 capital letter (A-Z).";
  }
  if (!/[a-z]/.test(pwd)) {
    return "Password Error: Must contain at least 1 lowercase letter (a-z).";
  }
  if (!/[0-9]/.test(pwd)) {
    return "Password Error: Must contain at least 1 digit (0-9).";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
    return "Password Error: Must contain at least 1 symbol (!@#$%^&*).";
  }
  return null;
};

export default function AuthFlowContainer({
  initialStep = "welcome",
}: AuthFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialStep);

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Social Login Handler
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user/ai-coach",
      });
    } catch (err: any) {
      toast.error(err?.message || "Could not sign in with Google.");
    }
  };

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Distinct Email Validation Toast
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    // Distinct Password Validation Toast
    if (!password) {
      toast.error("Password Required: Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password credentials.");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back to FITORA!");
      setTimeout(() => {
        router.push("/dashboard/user/ai-coach");
      }, 800);
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name Required: Please enter your full name.");
      return;
    }

    // Distinct Email Validation Toast
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    // Distinct Password Policy Validation Toast
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password Mismatch: Confirm password does not match.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Terms Required: Please agree to Terms & Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: fullName,
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Could not create account.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard/user/ai-coach");
      }, 800);
    } catch (err: any) {
      toast.error(err?.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 overflow-hidden select-none">
      
      {/* Premium Theme-Matched Monochrome Glass Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(10, 10, 10, 0.95)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "9999px",
            padding: "12px 22px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(16px)",
            maxWidth: "440px",
          },
          success: {
            iconTheme: {
              primary: "#ffffff",
              secondary: "#000000",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {/* ════════════════════════════════════════════════════════════
          LAYOUT VARIANT 1: PC / DESKTOP (Zero-Border 12-Col Split >= 1024px)
          ════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:grid grid-cols-12 w-full max-w-6xl h-full max-h-[760px] min-h-[560px] bg-neutral-950 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Left 7 Columns: Ultra-Vivid Hero Gym Image & Centered Slide Pill */}
        <div className="col-span-7 relative flex flex-col justify-between p-8 xl:p-10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.png"
              alt="FITORA Athlete"
              fill
              priority
              className="object-cover object-center brightness-[0.75] contrast-115 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-neutral-950/90" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.svg"
                alt="FITORA Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-white font-black text-lg tracking-wider uppercase leading-none">
                  FITORA
                </span>
                <span className="text-[9px] text-gray-300 font-bold tracking-[0.25em] uppercase">
                  GYM & AI PLATFORM
                </span>
              </div>
            </Link>
            <span className="text-xs font-extrabold text-white tracking-widest uppercase bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full shadow-lg">
              EST. 2026
            </span>
          </div>

          {/* Centered Middle Section on Left Column */}
          <div className="relative z-10 space-y-4 max-w-xl my-auto py-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Next-Gen AI Fitness Platform</span>
            </div>
            
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight uppercase drop-shadow-lg">
              Start your journey to a healthier, stronger you.
            </h1>
            
            <p className="text-xs xl:text-sm text-gray-200 leading-relaxed font-medium drop-shadow-md">
              Track workouts, get real-time AI nutrition & training plans, and stay motivated every single day with FITORA's monochrome gym ecosystem.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1 pb-1">
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Realtime Gemini 2.0 AI Coach</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Custom Macro Calculations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Audio Gym Stopwatch HUD</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Smart Workout Log Tracker</span>
              </div>
            </div>

            {/* Slide Pill Bar Centered in Middle of Left Hero Column */}
            <div className="pt-2 max-w-md">
              <UniversalSlidePill
                label={
                  step === "welcome"
                    ? "Click or Slide to Login"
                    : step === "login"
                      ? "Click or Slide to Create Account"
                      : "Click or Slide to Login"
                }
                onAction={() =>
                  setStep(
                    step === "welcome"
                      ? "login"
                      : step === "login"
                        ? "register"
                        : "login",
                  )
                }
              />
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            © 2026 FITORA INC. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Right 5 Columns: Desktop Auth Form Container (Zero Border, noValidate to block browser popups) */}
        <div className="col-span-5 relative bg-neutral-950 p-8 xl:p-10 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-4 shrink-0">
            <button
              onClick={() => setStep("login")}
              className={`text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                step === "login"
                  ? "text-white font-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setStep("register")}
              className={`text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                step === "register"
                  ? "text-white font-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "register" ? (
              <motion.form
                key="desktop-register"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onSubmit={handleRegisterSubmit}
                noValidate
                className="space-y-3 my-auto py-2"
              >
                <div className="space-y-0.5 mb-2">
                  <h2 className="text-xl xl:text-2xl font-black text-white uppercase tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Start your personalized fitness journey today
                  </p>
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (e.g. name@domain.com)"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                  />
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      maxLength={16}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                      className="w-full h-11 px-4 pr-10 rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      maxLength={16}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm Password"
                      className="w-full h-11 px-4 pr-10 rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 font-medium px-2 pt-0.5">
                  Must be 8–16 chars with 1 uppercase, 1 lowercase, 1 number & 1 symbol.
                </p>

                <div className="flex items-center gap-2 text-[10px] xl:text-[11px] text-gray-400 font-medium px-2 pt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                  />
                  <span>
                    Agree to <span className="text-white underline">Terms</span>{" "}
                    &{" "}
                    <span className="text-white underline">Privacy Policy</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-between px-5 hover:bg-gray-100 transition-all shadow-2xl cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="desktop-login"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onSubmit={handleLoginSubmit}
                noValidate
                className="space-y-4 my-auto py-2"
              >
                <div className="space-y-0.5 mb-2">
                  <h2 className="text-xl xl:text-2xl font-black text-white uppercase tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Log in to access your personalized training dashboard
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full h-11 px-4 pr-10 rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                    />
                    <Mail className="absolute right-4 w-4 h-4 text-gray-400" />
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      maxLength={16}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full h-11 px-4 pr-10 rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs px-2 text-gray-300 font-medium pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                    />
                    <span>Remember Me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-gray-400 hover:text-white underline"
                  >
                    Forget Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-between px-5 hover:bg-gray-100 transition-all shadow-2xl cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-2"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Exclusive Google Login Option on PC */}
          <div className="pt-4 text-center space-y-2 shrink-0 border-t border-neutral-900/60 mt-2">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
              Or continue with
            </span>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-11 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-white font-black text-xs uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95"
            >
              <GoogleIcon className="w-4.5 h-4.5" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          LAYOUT VARIANT 2: TABLET (11/12 Screen Width max-w-xl)
          ════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex lg:hidden relative w-11/12 max-w-xl h-full max-h-[660px] min-h-[500px] bg-neutral-950 rounded-[2.5rem] shadow-2xl overflow-hidden flex-col justify-between p-7">
        <AnimatePresence mode="wait">
          {/* Tablet STEP 1: Welcome Onboarding Screen */}
          {step === "welcome" && (
            <motion.div
              key="tablet-welcome"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between"
            >
              {/* Tablet Hero Background Image */}
              <div className="absolute -inset-7 z-0">
                <Image
                  src="/hero.png"
                  alt="FITORA Athlete Background"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.7] contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              </div>

              <div className="relative z-10 flex items-center justify-between pt-1">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <Image
                    src="/logo.svg"
                    alt="FITORA Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain shadow-md group-hover:scale-105 transition-transform"
                  />
                  <span className="text-white font-black text-base uppercase tracking-wider">
                    FITORA GYM
                  </span>
                </Link>
                <span className="text-xs font-extrabold text-white tracking-widest uppercase bg-black/60 backdrop-blur-md px-3 py-1 rounded-full shadow">
                  EST. 2026
                </span>
              </div>

              <div className="relative z-10 space-y-3 my-auto max-w-md mx-auto w-full">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Next-Gen AI Fitness Platform</span>
                </div>
                <h1 className="text-2xl xs:text-3xl font-black text-white leading-tight uppercase drop-shadow-lg">
                  Start your journey to a healthier, stronger you.
                </h1>
                <p className="text-xs text-gray-200 leading-relaxed font-medium drop-shadow">
                  Track workouts, get real-time AI nutrition & training plans, and stay motivated every single day.
                </p>
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Realtime AI Coach</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Workout Tracker</span>
                  </div>
                </div>

                <div className="pt-2">
                  <UniversalSlidePill
                    label="Click or Slide to Login"
                    onAction={() => setStep("login")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tablet STEP 2: Login Screen */}
          {step === "login" && (
            <motion.div
              key="tablet-login"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between"
            >
              {/* Tablet Hero Background Image */}
              <div className="absolute -inset-7 z-0">
                <Image
                  src="/hero.png"
                  alt="Gym Background"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.65] contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-neutral-950/85 to-neutral-950" />
              </div>

              <div className="relative z-10 flex items-center justify-between pb-3 shrink-0">
                <button
                  onClick={() => setStep("welcome")}
                  className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer font-bold drop-shadow"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep("login")}
                    className="bg-white text-black font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setStep("register")}
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="relative z-10 my-auto py-1 space-y-2.5 max-w-md mx-auto w-full">
                <form onSubmit={handleLoginSubmit} noValidate className="space-y-2.5">
                  <div className="space-y-0.5 mb-2">
                    <h2 className="text-xl font-black uppercase text-white drop-shadow">
                      Welcome Back
                    </h2>
                    <p className="text-[11px] text-gray-300 font-medium drop-shadow">
                      Log in to continue your fitness journey
                    </p>
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900/90 text-xs text-white outline-none font-medium shadow-inner"
                  />
                  <input
                    type="password"
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900/90 text-xs text-white outline-none font-medium shadow-inner"
                  />
                  <div className="flex items-center justify-between text-xs px-1 text-gray-300 font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                      />
                      <span>Remember Me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-gray-400 hover:text-white underline"
                    >
                      Forget Password
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-between px-5 shadow-xl mt-1"
                  >
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Tablet Google Login Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-11 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Tablet Universal Slide Pill */}
                <div className="pt-1">
                  <UniversalSlidePill
                    label="Click or Slide to Create Account"
                    onAction={() => setStep("register")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tablet STEP 3: Register Screen */}
          {step === "register" && (
            <motion.div
              key="tablet-register"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between"
            >
              {/* Tablet Hero Background Image */}
              <div className="absolute -inset-7 z-0">
                <Image
                  src="/hero.png"
                  alt="Create Account Background"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.65] contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-neutral-950/85 to-neutral-950" />
              </div>

              <div className="relative z-10 flex items-center justify-between pb-3 shrink-0">
                <button
                  onClick={() => setStep("login")}
                  className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer font-bold drop-shadow"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep("login")}
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setStep("register")}
                    className="bg-white text-black font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="relative z-10 my-auto py-1 space-y-2 max-w-md mx-auto w-full">
                <form onSubmit={handleRegisterSubmit} noValidate className="space-y-2">
                  <div className="space-y-0.5 mb-2">
                    <h2 className="text-xl font-black uppercase text-white drop-shadow">
                      Create Account
                    </h2>
                    <p className="text-[11px] text-gray-300 font-medium drop-shadow">
                      Start your fitness journey today
                    </p>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900/90 text-xs text-white outline-none font-medium shadow-inner"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (e.g. user@domain.com)"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900/90 text-xs text-white outline-none font-medium shadow-inner"
                  />
                  <input
                    type="password"
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900/90 text-xs text-white outline-none font-medium shadow-inner"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    maxLength={16}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full h-11 px-4 rounded-full bg-neutral-900/90 text-xs text-white outline-none font-medium shadow-inner"
                  />
                  <button
                    type="submit"
                    className="w-full h-11 rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-between px-5 shadow-xl mt-1"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Tablet Google Register Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-11 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </button>
                </div>

                <div className="pt-1">
                  <UniversalSlidePill
                    label="Click or Slide to Login"
                    onAction={() => setStep("login")}
                  />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════════════════════════
          LAYOUT VARIANT 3: MOBILE (11/12 Screen Width max-w-[410px] < 768px)
          ════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden relative w-11/12 max-w-[410px] h-full max-h-[750px] min-h-[500px] bg-neutral-950 rounded-[2.5rem] shadow-2xl overflow-hidden flex-col">
        <AnimatePresence mode="wait">
          {/* Mobile STEP 1: Welcome Onboarding Screen */}
          {step === "welcome" && (
            <motion.div
              key="mobile-welcome"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between p-5 xs:p-6"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="/hero.png"
                  alt="FITORA Athlete Background"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.75] contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 flex items-center justify-between pt-1">
                <Link href="/" className="flex items-center gap-2 group">
                  <Image
                    src="/logo.svg"
                    alt="FITORA Logo"
                    width={30}
                    height={30}
                    className="w-7.5 h-7.5 object-contain shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <span className="text-white font-black text-sm tracking-wider uppercase">
                    FITORA
                  </span>
                </Link>
                <span className="text-[9px] font-extrabold text-white tracking-widest uppercase bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow">
                  EST. 2026
                </span>
              </div>

              <div className="relative z-10 space-y-2 mb-2">
                <span className="text-xs font-semibold text-gray-200 block drop-shadow">
                  Welcome to FitLife
                </span>
                <h1 className="text-xl xs:text-2xl font-black text-white leading-tight uppercase drop-shadow-lg">
                  Start your journey to a healthier, stronger you.
                </h1>
                <p className="text-[11px] text-gray-200 leading-relaxed font-medium drop-shadow">
                  Track workouts, stay motivated, and build healthy habits—every day.
                </p>
              </div>

              <div className="relative z-10 w-full pt-1">
                <UniversalSlidePill
                  label="Click or Slide to Login"
                  onAction={() => setStep("login")}
                />
              </div>
            </motion.div>
          )}

          {/* Mobile STEP 2: Login Screen */}
          {step === "login" && (
            <motion.div
              key="mobile-login"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between p-5 xs:p-6 bg-neutral-950"
            >
              {/* Full Mobile Login Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/hero.png"
                  alt="Gym Background"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.65] contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-neutral-950/85 to-neutral-950" />
              </div>

              <div className="relative z-10 pt-1 space-y-0.5 mb-1">
                <button
                  onClick={() => setStep("welcome")}
                  className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors mb-1 cursor-pointer font-bold drop-shadow"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <h2 className="text-xl font-black text-white uppercase tracking-tight drop-shadow">
                  Welcome Back
                </h2>
                <p className="text-[10px] text-gray-300 font-medium drop-shadow">
                  Log in to continue your fitness journey
                </p>
              </div>

              <form
                onSubmit={handleLoginSubmit}
                noValidate
                className="relative z-10 space-y-2.5 my-auto"
              >
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full h-10 xs:h-11 px-4 pr-10 rounded-full bg-neutral-900/90 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                  />
                  <Mail className="absolute right-4 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-10 xs:h-11 px-4 pr-10 rounded-full bg-neutral-900/90 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] px-1 text-gray-300 font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                    />
                    <span>Remember Me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-gray-400 hover:text-white underline"
                  >
                    Forget Password
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 xs:h-11 rounded-full bg-white text-black font-black text-xs flex items-center justify-between px-5 hover:bg-gray-100 transition-all shadow-xl cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-1"
                >
                  <span className="uppercase tracking-wider">Login</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Mobile Google Login Option */}
              <div className="relative z-10 pt-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-10 xs:h-11 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Universal Slide Pill inside Mobile Login */}
              <div className="relative z-10 pt-2.5">
                <UniversalSlidePill
                  label="Click or Slide to Create Account"
                  onAction={() => setStep("register")}
                />
              </div>
            </motion.div>
          )}

          {/* Mobile STEP 3: Register Screen */}
          {step === "register" && (
            <motion.div
              key="mobile-register"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col justify-between p-5 xs:p-6 bg-neutral-950 overflow-hidden"
            >
              {/* Full Mobile Register Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/hero.png"
                  alt="Create Account Background"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.65] contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-neutral-950/85 to-neutral-950" />
              </div>

              <div className="relative z-10 pt-1 space-y-0.5 mb-1">
                <button
                  onClick={() => setStep("login")}
                  className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors mb-1 cursor-pointer font-bold drop-shadow"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <h2 className="text-lg xs:text-xl font-black text-white uppercase tracking-tight drop-shadow">
                  Create Account
                </h2>
                <p className="text-[10px] text-gray-300 font-medium drop-shadow">
                  Start your fitness journey today
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} noValidate className="relative z-10 space-y-2 my-auto">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full h-9 xs:h-10 px-3.5 rounded-full bg-neutral-900/90 text-[11px] text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (e.g. user@domain.com)"
                  className="w-full h-9 xs:h-10 px-3.5 rounded-full bg-neutral-900/90 text-[11px] text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                />
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                    className="w-full h-9 xs:h-10 px-3.5 pr-9 rounded-full bg-neutral-900/90 text-[11px] text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    maxLength={16}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm Password"
                    className="w-full h-9 xs:h-10 px-3.5 pr-9 rounded-full bg-neutral-900/90 text-[11px] text-white placeholder-gray-500 outline-none font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 font-medium px-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                  />
                  <span>
                    Agree to <span className="text-white underline">Terms</span>{" "}
                    &{" "}
                    <span className="text-white underline">Privacy Policy</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 xs:h-10 rounded-full bg-white text-black font-black text-xs flex items-center justify-between px-4 hover:bg-gray-100 transition-all shadow-xl cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-1"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Mobile Google Register Option */}
              <div className="relative z-10 pt-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-9 xs:h-10 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Universal Slide Pill inside Mobile Register */}
              <div className="relative z-10 pt-2.5">
                <UniversalSlidePill
                  label="Click or Slide to Login"
                  onAction={() => setStep("login")}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
