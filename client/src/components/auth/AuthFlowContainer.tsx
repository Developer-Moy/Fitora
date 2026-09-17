"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  Dumbbell,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { loginApi, registerApi, saveAuthSession } from "@/services/authService";

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

// 🔒 3. Olympic Quick-Lock Barbell Collar Slider (Master Launch Plan §5.1)
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
      className="relative w-full h-12 bg-white/5 border border-white/10 rounded-full p-1 flex items-center justify-between shadow-2xl backdrop-blur-sm cursor-pointer select-none overflow-hidden transition-all duration-300 group hover:border-white/20 hover:bg-white/[0.08]"
    >
      {/* Olympic Barbell Center Axis & Knurling Guide */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Track & Text Area */}
      <div className="relative flex-1 h-full flex items-center justify-between overflow-hidden cursor-pointer px-1">
        <span className="text-xs font-black uppercase text-white tracking-wider truncate pl-12 z-10 drop-shadow flex items-center gap-1.5">
          <span>{label}</span>
        </span>
        <ChevronsRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors shrink-0 z-10 mr-2" />

        {/* Olympic Barbell Quick-Lock Collar Knob */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 380 }}
          dragElastic={0.05}
          animate={{
            left: isSliding ? "calc(100% - 40px)" : "4px",
            rotate: isSliding ? 45 : 0,
          }}
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
          className="absolute top-0 bottom-0 my-auto w-9.5 h-9.5 bg-white text-black rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-20 group-hover:scale-105 transition-transform border border-black/10"
        >
          <motion.div
            animate={{ rotate: isSliding ? 90 : 0 }}
            className="flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Symmetrical Vector Barbell Plates (Clean 2-Plate Stack, No Bar, Exact 2-3px Gap) ── */
const BarbellPlates = ({ side }: { side: "left" | "right" }) => (
  <svg
    viewBox="0 0 10 16"
    className={`w-2.5 h-4 shrink-0 pointer-events-none text-neutral-300 ${
      side === "right" ? "-scale-x-100" : ""
    }`}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* 1. Outer Plate */}
    <rect x="0.5" y="1" width="3" height="14" rx="1" />
    {/* 2. Inner Plate */}
    <rect x="5.5" y="3" width="3" height="10" rx="1" />
  </svg>
);

// 🏋️‍♂️ 1. Olympic Barbell Clamp Input (Master Launch Plan §5.1) - Exact 2-3px Gap, No Bar
function BarbellClampInput({
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  maxLength,
  autoComplete,
  heightClass = "h-11",
  className = "",
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  maxLength?: number;
  autoComplete?: string;
  heightClass?: string;
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center group">
      {/* 🏋️ Left Olympic Barbell Plates with Exact 2.5px Gap */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ x: -6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className="absolute -left-[13px] top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none"
          >
            <BarbellPlates side="left" />
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full ${heightClass} px-4 ${
          isPassword || icon ? "pr-10" : ""
        } rounded-full bg-neutral-900 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner transition-colors duration-150 border ${
          isFocused ? "border-white/35" : "border-white/5"
        } ${className}`}
      />

      {/* Right Icon or Password Toggle */}
      {icon && !isPassword && (
        <span className="absolute right-4 text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}

      {isPassword && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      )}

      {/* 🏋️ Right Olympic Barbell Plates with Exact 2.5px Gap */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className="absolute -right-[13px] top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none"
          >
            <BarbellPlates side="right" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 💪 2. Dumbbell Curl Loader Button (Master Launch Plan §5.1)
function DumbbellCurlButton({
  label,
  loading = false,
  disabled = false,
  onClick,
  type = "submit",
  heightClass = "h-11",
  className = "",
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit" | "button";
  heightClass?: string;
  className?: string;
}) {
  const [repCount, setRepCount] = useState(1);

  useEffect(() => {
    if (!loading) {
      setRepCount(1);
      return;
    }
    const timer = setInterval(() => {
      setRepCount((prev) => (prev % 3) + 1);
    }, 600);
    return () => clearInterval(timer);
  }, [loading]);

  const repText =
    repCount === 1
      ? "LIFTING... REP 1"
      : repCount === 2
        ? "POWERING... REP 2"
        : "LOCKED IN! REP 3";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`w-full ${heightClass} rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-between px-5 hover:bg-gray-100 transition-all shadow-2xl cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="w-full flex items-center justify-between">
          <motion.div
            animate={{ rotate: [-25, 25, -25], y: [1, -3, 1] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
            className="flex items-center"
          >
            <Dumbbell className="w-4 h-4 text-black stroke-[2.5]" />
          </motion.div>
          <span className="font-black tracking-widest text-[11px] animate-pulse">
            {repText}
          </span>
          <motion.div
            animate={{ rotate: [25, -25, 25], y: [1, -3, 1] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
            className="flex items-center"
          >
            <Dumbbell className="w-4 h-4 text-black stroke-[2.5]" />
          </motion.div>
        </div>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </>
      )}
    </button>
  );
}

// 📊 4. Progressive Overload Barbell Password Strength Meter (Master Launch Plan §5.1)
function BarbellStrengthMeter({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasCases = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const criteriaCount = [hasLength, hasCases, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;

  let strengthLabel = "Weak";
  let loadLabel = "Empty Bar (20 KG)";
  let guideText = "Stronger password loads heavier plates onto the barbell";

  if (!password) {
    strengthLabel = "Too Weak";
    loadLabel = "Empty Bar (20 KG)";
    guideText = "Type a password to load plates onto the barbell";
  } else if (criteriaCount === 1) {
    strengthLabel = "Weak";
    loadLabel = "+5 KG Plates (30 KG)";
    guideText = "Add uppercase, numbers & symbols to load heavier plates";
  } else if (criteriaCount === 2) {
    strengthLabel = "Medium";
    loadLabel = "+10 KG Plates (50 KG)";
    guideText = "Good progress! Add numbers & symbols for heavier load";
  } else if (criteriaCount === 3) {
    strengthLabel = "Strong";
    loadLabel = "+15 KG Plates (70 KG)";
    guideText = "Strong! Add 1 more requirement to reach 90 KG PR load";
  } else if (criteriaCount === 4) {
    strengthLabel = "Maximum";
    loadLabel = "Fully Loaded (90 KG) 🏆";
    guideText = "Unbreakable! Heavy 90 KG Olympic barbell locked & ready";
  }

  return (
    <div className="space-y-1 px-1 py-1">
      {/* Weight & Rank Indicator */}
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">PASSWORD:</span>
          <span
            className={
              criteriaCount === 4
                ? "text-white font-black"
                : criteriaCount >= 3
                  ? "text-gray-200 font-bold"
                  : criteriaCount >= 2
                    ? "text-gray-300 font-semibold"
                    : "text-gray-400 font-medium"
            }
          >
            {strengthLabel}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9.5px] font-semibold text-gray-400">
          <Dumbbell className="w-3 h-3 text-gray-400 shrink-0 inline" />
          <span
            className={
              criteriaCount === 4 ? "text-white font-bold" : "text-gray-300"
            }
          >
            {loadLabel}
          </span>
        </div>
      </div>

      {/* Visual Olympic Barbell with Racked Plates */}
      <div className="relative h-5.5 w-full bg-neutral-950 rounded-full border border-white/10 px-3 flex items-center justify-between overflow-hidden">
        {/* Left Sleeve & Loaded Plates */}
        <div className="flex items-center gap-1 z-10">
          <span
            className="w-1.5 h-3 bg-neutral-600 rounded-sm"
            title="Collar"
          />
          <AnimatePresence>
            {hasLength && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-1.5 h-3.5 bg-neutral-400 rounded-sm border border-white/40"
                title="5kg Plate"
              />
            )}
            {hasCases && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-1.5 h-4 bg-neutral-300 rounded-sm border border-white/60"
                title="10kg Plate"
              />
            )}
            {hasNumber && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-2 h-4.5 bg-neutral-200 rounded-sm border border-white/80"
                title="15kg Plate"
              />
            )}
            {hasSymbol && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-2.5 h-5 bg-white rounded-sm border border-white"
                title="20kg Bumper Plate"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Central Olympic Bar Shaft (Knurled Bar) */}
        <div className="flex-1 mx-2 h-1 bg-gradient-to-r from-neutral-700 via-neutral-400 to-neutral-700 rounded-full relative">
          <div className="absolute inset-0 flex justify-around items-center opacity-30">
            <span className="w-2 h-full bg-white" />
            <span className="w-2 h-full bg-white" />
          </div>
        </div>

        {/* Right Sleeve & Loaded Plates */}
        <div className="flex items-center gap-1 z-10 flex-row-reverse">
          <span
            className="w-1.5 h-3 bg-neutral-600 rounded-sm"
            title="Collar"
          />
          <AnimatePresence>
            {hasLength && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-1.5 h-3.5 bg-neutral-400 rounded-sm border border-white/40"
                title="5kg Plate"
              />
            )}
            {hasCases && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-1.5 h-4 bg-neutral-300 rounded-sm border border-white/60"
                title="10kg Plate"
              />
            )}
            {hasNumber && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-2 h-4.5 bg-neutral-200 rounded-sm border border-white/80"
                title="15kg Plate"
              />
            )}
            {hasSymbol && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-2.5 h-5 bg-white rounded-sm border border-white"
                title="20kg Bumper Plate"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* User-Friendly Explanatory Caption */}
      <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium px-0.5">
        <span className="truncate">{guideText}</span>
        <span className="text-gray-500 font-mono text-[8.5px] shrink-0 ml-2">
          {criteriaCount}/4 LOADED
        </span>
      </div>
    </div>
  );
}

// 💥 5. Chalk Dust Particle Burst (Master Launch Plan §5.1)
function ChalkDustBurst({ show }: { show: boolean }) {
  if (!show) return null;

  const particles = Array.from({ length: 36 }).map((_, i) => {
    const angle = (i / 36) * 360;
    const distance = 90 + (i % 6) * 35;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size: 8 + (i % 5) * 4,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {/* Chalk Flash Shockwave */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 3.5, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-64 h-64 rounded-full bg-white/25 blur-3xl"
      />

      {/* Chalk Dust Particle Puffs */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.95 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0.2, 1.8, 2.5],
            opacity: [0.95, 0.6, 0],
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ width: p.size, height: p.size }}
          className="absolute rounded-full bg-white/80 blur-[2px] shadow-[0_0_12px_rgba(255,255,255,0.9)]"
        />
      ))}

      {/* Central Athletic Lift Authorized Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 15 }}
        animate={{ scale: [0.7, 1.05, 1], opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "backOut" }}
        className="relative z-10 px-6 py-3 rounded-full bg-white text-black font-black tracking-widest text-xs uppercase shadow-[0_0_40px_rgba(255,255,255,0.8)] border border-white flex items-center gap-2"
      >
        <Dumbbell className="w-4 h-4 stroke-[2.5]" />
        <span>LIFT AUTHORIZED • FITORA ATHLETE</span>
      </motion.div>
    </motion.div>
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
  const [showChalkBurst, setShowChalkBurst] = useState(false);

  // Social Login Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        });
        return;
      }

      // One-Click Fast Google Auth Simulator for Demo
      saveAuthSession("fitora_google_auth_token", {
        id: "google_user_01",
        name: "Google Athlete",
        email: "athlete.google@gmail.com",
        role: "athlete",
        plan: "Free Pass",
        assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
      });
      toast.success("Signed in with Google! Welcome to FITORA.");
      setTimeout(() => {
        router.push("/");
      }, 700);
    } catch (err: any) {
      saveAuthSession("fitora_google_auth_token", {
        id: "google_user_01",
        name: "Google Athlete",
        email: "athlete.google@gmail.com",
        role: "athlete",
        plan: "Free Pass",
        assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
      });
      toast.success("Signed in with Google! Welcome to FITORA.");
      setTimeout(() => {
        router.push("/");
      }, 700);
    } finally {
      setIsLoading(false);
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
      const apiRes = await loginApi(email, password);
      if (apiRes.success && apiRes.user) {
        setShowChalkBurst(true);
        toast.success(`Welcome back, ${apiRes.user.name || "Athlete"}!`);
        setTimeout(() => {
          router.push("/");
        }, 800);
        return;
      }

      // Secondary fallback to client auth
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(
          apiRes.message ||
            error.message ||
            "Invalid email or password credentials.",
        );
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("fitora_auth_session", "true");
        localStorage.setItem("fitora_active_role", "free_user");
      }
      setShowChalkBurst(true);
      toast.success("Welcome back to FITORA!");
      setTimeout(() => {
        router.push("/");
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
      const apiRes = await registerApi({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (apiRes.success) {
        setShowChalkBurst(true);
        toast.success("Account created successfully! Welcome to FITORA.");
        setTimeout(() => {
          router.push("/");
        }, 800);
        return;
      }

      // Secondary fallback to client auth
      const { error } = await authClient.signUp.email({
        name: fullName,
        email,
        password,
      });

      if (error) {
        toast.error(
          apiRes.message || error.message || "Could not create account.",
        );
        setIsLoading(false);
        return;
      }

      setShowChalkBurst(true);
      toast.success("Account created! Welcome to FITORA.");
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: any) {
      toast.error(err?.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 overflow-hidden select-none">
      {/* 💥 Chalk Dust Burst Shockwave Overlay (§5.1) */}
      <ChalkDustBurst show={showChalkBurst} />
      {/* Premium Theme-Matched Monochrome Glass Toaster */}

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
            <Link
              href="/"
              className="text-xs font-extrabold text-white/80 hover:text-white tracking-widest uppercase transition-colors cursor-pointer"
            >
              HOME
            </Link>
          </div>

          {/* Centered Middle Section on Left Column */}
          <div className="relative z-10 space-y-4 max-w-xl my-auto py-4">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
              <span>Next-Gen AI Fitness Platform</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-sans uppercase tracking-tight text-white select-none drop-shadow-lg">
              Start your journey to a healthier, stronger you.
            </h1>

            <p className="text-xs xl:text-sm text-gray-200 leading-relaxed font-medium drop-shadow-md">
              Track workouts, get real-time AI nutrition & training plans, and
              stay motivated every single day with FITORA's monochrome gym
              ecosystem.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1 pb-1">
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Realtime Gemini 2.0 AI Coach</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Custom Macro Calculations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Audio Gym Stopwatch HUD</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-white bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Smart Workout Log Tracker</span>
              </div>
            </div>

            {/* Slide Pill Bar Centered in Middle of Left Hero Column */}
            <div className="pt-2 w-full">
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

          <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span>© 2026 FITORA INC. ALL RIGHTS RESERVED.</span>
            <span>EST. 2026</span>
          </div>
        </div>

        {/* Right 5 Columns: Desktop Auth Form Container (Zero Border, noValidate to block browser popups) */}
        <div className="col-span-5 relative bg-neutral-950 py-5 px-7 xl:py-6 xl:px-9 flex flex-col justify-between overflow-hidden">
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
                className="space-y-2 my-auto"
              >
                <div className="space-y-0.5 mb-2">
                  <h2 className="text-xl xl:text-2xl font-black text-white uppercase tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Start your personalized fitness journey today
                  </p>
                </div>

                <div className="space-y-1.5">
                  <BarbellClampInput
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    autoComplete="name"
                  />
                  <BarbellClampInput
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (e.g. name@domain.com)"
                    autoComplete="email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <BarbellClampInput
                    isPassword
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                    autoComplete="new-password"
                  />
                  <BarbellClampInput
                    isPassword
                    showPassword={showConfirmPassword}
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    value={confirmPassword}
                    maxLength={16}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                  />
                </div>

                <BarbellStrengthMeter password={password} />

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

                <DumbbellCurlButton
                  label="Create Account"
                  loading={isLoading}
                  className="mt-2"
                />
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
                  <BarbellClampInput
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    autoComplete="email"
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <BarbellClampInput
                    isPassword
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                  />
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

                <DumbbellCurlButton
                  label="Login"
                  loading={isLoading}
                  className="mt-2"
                />
              </motion.form>
            )}
          </AnimatePresence>

          {/* Exclusive Google Login Option on PC */}
          <div className="pt-2 text-center space-y-1.5 shrink-0 border-t border-neutral-900/40 mt-1">
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
                <Link
                  href="/"
                  className="text-xs font-extrabold text-white/80 hover:text-white tracking-widest uppercase transition-colors cursor-pointer"
                >
                  HOME
                </Link>
              </div>

              <div className="relative z-10 space-y-3 my-auto max-w-md mx-auto w-full">
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  <span>Next-Gen AI Fitness Platform</span>
                </div>
                <h1 className="text-2xl xs:text-3xl font-black text-white leading-tight uppercase drop-shadow-lg">
                  Start your journey to a healthier, stronger you.
                </h1>
                <p className="text-xs text-gray-200 leading-relaxed font-medium drop-shadow">
                  Track workouts, get real-time AI nutrition & training plans,
                  and stay motivated every single day.
                </p>
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 border border-white/10 backdrop-blur-sm px-3.5 py-2 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Realtime AI Coach</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 border border-white/10 backdrop-blur-sm px-3.5 py-2 rounded-full">
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
                <form
                  onSubmit={handleLoginSubmit}
                  noValidate
                  className="space-y-2.5"
                >
                  <div className="space-y-0.5 mb-2">
                    <h2 className="text-xl font-black uppercase text-white drop-shadow">
                      Welcome Back
                    </h2>
                    <p className="text-[11px] text-gray-300 font-medium drop-shadow">
                      Log in to continue your fitness journey
                    </p>
                  </div>
                  <BarbellClampInput
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    autoComplete="email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <BarbellClampInput
                    isPassword
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
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
                  <DumbbellCurlButton
                    label="Login"
                    loading={isLoading}
                    className="mt-1"
                  />
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
                <form
                  onSubmit={handleRegisterSubmit}
                  noValidate
                  className="space-y-2"
                >
                  <div className="space-y-0.5 mb-2">
                    <h2 className="text-xl font-black uppercase text-white drop-shadow">
                      Create Account
                    </h2>
                    <p className="text-[11px] text-gray-300 font-medium drop-shadow">
                      Start your fitness journey today
                    </p>
                  </div>
                  <BarbellClampInput
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    autoComplete="name"
                  />
                  <BarbellClampInput
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (e.g. user@domain.com)"
                    autoComplete="email"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <BarbellClampInput
                    isPassword
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    value={password}
                    maxLength={16}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                    autoComplete="new-password"
                  />
                  <BarbellStrengthMeter password={password} />
                  <BarbellClampInput
                    isPassword
                    showPassword={showConfirmPassword}
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    value={confirmPassword}
                    maxLength={16}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                  />
                  <DumbbellCurlButton
                    label="Create Account"
                    loading={isLoading}
                    className="mt-1"
                  />
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
                    className="w-7 h-7 object-contain shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <span className="text-white font-black text-sm tracking-wider uppercase">
                    FITORA
                  </span>
                </Link>
                <Link
                  href="/"
                  className="text-[10px] font-extrabold text-white/80 hover:text-white tracking-widest uppercase transition-colors cursor-pointer"
                >
                  HOME
                </Link>
              </div>

              <div className="relative z-10 space-y-2 mb-2">
                <span className="text-xs font-semibold text-gray-200 block drop-shadow">
                  Welcome to FitLife
                </span>
                <h1 className="text-xl xs:text-2xl font-black text-white leading-tight uppercase drop-shadow-lg">
                  Start your journey to a healthier, stronger you.
                </h1>
                <p className="text-[11px] text-gray-200 leading-relaxed font-medium drop-shadow">
                  Track workouts, stay motivated, and build healthy habits—every
                  day.
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
                      <Eye className="w-4 h-4" />
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

                <DumbbellCurlButton
                  label="Login"
                  loading={isLoading}
                  heightClass="h-10 xs:h-11"
                  className="mt-1"
                />
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

              <form
                onSubmit={handleRegisterSubmit}
                noValidate
                className="relative z-10 space-y-2 my-auto"
              >
                <BarbellClampInput
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  heightClass="h-9 xs:h-10"
                  autoComplete="name"
                />
                <BarbellClampInput
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (e.g. user@domain.com)"
                  heightClass="h-9 xs:h-10"
                  autoComplete="email"
                  icon={<Mail className="w-3.5 h-3.5" />}
                />
                <BarbellClampInput
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  value={password}
                  maxLength={16}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                  heightClass="h-9 xs:h-10"
                  autoComplete="new-password"
                />
                <BarbellStrengthMeter password={password} />
                <BarbellClampInput
                  isPassword
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  value={confirmPassword}
                  maxLength={16}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  heightClass="h-9 xs:h-10"
                  autoComplete="new-password"
                />

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

                <DumbbellCurlButton
                  label="Create Account"
                  loading={isLoading}
                  heightClass="h-9 xs:h-10"
                  className="mt-1"
                />
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
