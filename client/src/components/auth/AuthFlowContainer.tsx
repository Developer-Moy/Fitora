"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ChevronsRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { loginApi, registerApi } from "@/services/authService";

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

/**
 * Reusable Fitora glassmorphism card wrapper for auth forms.
 * Pure black surface, soft white border, heavy backdrop blur.
 */
function AuthGlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

interface AuthGlassFieldProps {
  /** "text" | "email" | "password" input type */
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  /** Enables the password visibility toggle and shows the lock/eye affordances */
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  autoComplete?: string;
  maxLength?: number;
  /** Tailwind height class so each breakpoint can keep its existing sizing */
  heightClass?: string;
  /** Tailwind text size class so each breakpoint can keep its existing sizing */
  textClass?: string;
}

/**
 * Reusable monochrome glassmorphism input used by the desktop, tablet and
 * mobile login/register forms. Purely presentational — the parent form keeps
 * owning all state and submit behaviour.
 */
function AuthGlassField({
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  autoComplete,
  maxLength,
  heightClass = "h-11",
  textClass = "text-xs",
}: AuthGlassFieldProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-4 flex items-center text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${heightClass} ${
          icon ? "pl-11" : "px-4"
        } pr-11 rounded-full border border-white/10 bg-neutral-900/70 backdrop-blur-xl ${textClass} text-white placeholder-gray-500 outline-none font-medium shadow-inner transition-colors focus:border-white/30`}
      />
      {isPassword && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Shared monochrome glassmorphism submit button with inline loading feedback.
 */
function AuthSubmitButton({
  label,
  loading = false,
  disabled = false,
  heightClass = "h-11",
  className = "",
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  heightClass?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full ${heightClass} rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-between px-5 border border-white hover:bg-neutral-100 transition-all shadow-xl cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
      <span>{label}</span>
      {loading ? (
        <span className="w-4 h-4 rounded-full border-[1.5px] border-black/20 border-t-black animate-spin" />
      ) : (
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      )}
    </button>
  );
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

// 🧑 Dedicated Full Name Validation (register only)
const validateName = (nameStr: string): string | null => {
  const trimmed = nameStr.trim();
  if (!trimmed) {
    return "Full Name Required: Please enter your full name.";
  }
  if (trimmed.length < 2) {
    return "Invalid Name: Must be at least 2 characters long.";
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return "Invalid Name: Must contain at least one letter.";
  }
  return null;
};

// 🔐 Login-only password check: presence + minimum length policy.
// (Login must NOT enforce the full complexity policy — legacy accounts may
// predate it. Only the register flow enforces complexity.)
const validateLoginPassword = (pwd: string): string | null => {
  if (!pwd) {
    return "Password Required: Please enter your password.";
  }
  if (pwd.length < 8) {
    return "Password Too Short: Minimum 8 characters required.";
  }
  if (pwd.length > 16) {
    return "Password Too Long: Maximum 16 characters allowed.";
  }
  return null;
};

// 🔁 Confirm-password validation (register only)
const validateConfirmPassword = (
  pwd: string,
  confirmPwd: string,
): string | null => {
  if (!confirmPwd) {
    return "Confirm Password Required: Please re-enter your password.";
  }
  if (pwd !== confirmPwd) {
    return "Passwords Do Not Match: Confirm password does not match.";
  }
  return null;
};

/**
 * Classify a thrown/rejected auth error into a safe, user-facing toast message.
 * Never throws — always returns a displayable string so the page cannot crash.
 */
const classifyAuthError = (error: unknown): string => {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "Network Error: You appear to be offline. Check your connection.";
  }

  const err = error as { name?: string; code?: string; message?: string } | null;
  const name = err?.name || "";
  const code = err?.code || "";
  const rawMessage = typeof err?.message === "string" ? err.message : "";
  const haystack = `${name} ${code} ${rawMessage}`.toLowerCase();

  if (name === "AbortError" || haystack.includes("timeout")) {
    return "Network Timeout: The server took too long to respond. Please retry.";
  }
  if (
    name === "TypeError" ||
    haystack.includes("failed to fetch") ||
    haystack.includes("networkerror") ||
    haystack.includes("network request failed") ||
    haystack.includes("load failed")
  ) {
    return "Server Unavailable: Could not reach FITORA servers. Please retry.";
  }
  if (rawMessage.trim()) {
    return rawMessage;
  }
  return "Something Went Wrong: An unexpected error occurred. Please try again.";
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

// 💡 Inline Single-Line Dynamic Password Requirements Hint (Unmet rules only)
const getPasswordHint = (pwd: string): string | null => {
  if (!pwd) return null;

  const hasLength = pwd.length >= 8 && pwd.length <= 16;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

  const missingList: string[] = [];
  if (!hasUpper) missingList.push("an uppercase letter");
  if (!hasLower) missingList.push("a lowercase letter");
  if (!hasDigit) missingList.push("a number");
  if (!hasSymbol) missingList.push("a special character");

  if (hasLength && missingList.length === 0) {
    return null;
  }

  const formatList = (items: string[]) => {
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} & ${items[1]}`;
    return `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`;
  };

  if (!hasLength && missingList.length > 0) {
    return `Must be 8–16 characters, include ${formatList(missingList)}.`;
  }

  if (!hasLength) {
    return "Must be 8–16 characters.";
  }

  return `Must include ${formatList(missingList)}.`;
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Dynamic Password Hint for Registration (derived state, UI-only)
  const passwordHint = getPasswordHint(password);

  // Social Login Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // NOTE: better-call returns { data, error } and does NOT throw on
      // failure, so the result must be inspected explicitly.
      const res = (await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })) as
        | {
            data?: { url?: string; redirect?: boolean } | null;
            error?: { message?: string; status?: number } | null;
          }
        | undefined;

      // 1) Server/provider rejected the OAuth initiation.
      if (res?.error) {
        console.error("Google OAuth initiation failed:", res.error);
        toast.error(
          res.error.message ||
            "Google Sign-In Failed: Could not start Google authentication.",
        );
        return;
      }

      // 2) Better Auth's redirect plugin usually navigates on its own.
      //    Navigate explicitly as a fallback so OAuth always starts.
      const oauthUrl = res?.data?.url;
      if (oauthUrl) {
        window.location.href = oauthUrl;
        return;
      }

      // 3) No URL and no error — treat as an initiation failure.
      toast.error(
        "Google Sign-In Failed: No redirect received. Please try again.",
      );
    } catch (err: unknown) {
      // Surface the real OAuth failure instead of silently faking a session.
      console.error("Google OAuth initiation failed:", err);
      toast.error(classifyAuthError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛡️ Prevent double submit while a request is already pending
    if (isLoading) return;

    // Distinct Email Validation Toast
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    // Distinct Password Validation Toast (presence + minimum length)
    const passwordError = validateLoginPassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const apiRes = await loginApi(email, password);
      if (apiRes.success && apiRes.user) {
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
            "Invalid Credentials: Email or password is incorrect.",
        );
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("fitora_auth_session", "true");
        localStorage.setItem("fitora_active_role", "free_user");
      }
      toast.success("Login successful! Welcome back to FITORA.");
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: unknown) {
      toast.error(classifyAuthError(err));
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛡️ Prevent double submit while a request is already pending
    if (isLoading) return;

    // Distinct Full Name Validation Toast
    const nameError = validateName(fullName);
    if (nameError) {
      toast.error(nameError);
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

    // Distinct Confirm-Password Validation Toast (required + match)
    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) {
      toast.error(confirmError);
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

      toast.success("Account created successfully! Welcome to FITORA.");
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: unknown) {
      toast.error(classifyAuthError(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 overflow-hidden select-none">
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

            <h1 className="text-2xl sm:text-4xl font-black font-sans uppercase tracking-tight text-white select-none drop-shadow-lg">
              Start your journey to a healthier, stronger you.
            </h1>

            <p className="text-xs xl:text-sm text-gray-200 leading-relaxed font-medium drop-shadow-md">
              Track workouts, get real-time AI nutrition & training plans, and
              stay motivated every single day with FITORA's monochrome gym
              ecosystem.
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
        <div className="col-span-5 relative p-8 xl:p-10 flex flex-col justify-between overflow-hidden">
          {/* Frosted glass backplate + monochrome ambient glow behind the auth card */}
          <div className="absolute inset-0 z-0 bg-white/[0.04] backdrop-blur-2xl" />
          <div className="absolute -top-24 -right-16 z-0 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 z-0 w-72 h-72 rounded-full bg-white/[0.07] blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-4 shrink-0">
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
                className="relative z-10 my-auto py-2"
              >
                <AuthGlassCard className="p-6 xl:p-7 space-y-3">
                  <div className="space-y-0.5 mb-2">
                    <h2 className="text-xl xl:text-2xl font-black text-white uppercase tracking-tight">
                      Create Account
                    </h2>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Start your personalized fitness journey today
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <AuthGlassField
                      type="text"
                      value={fullName}
                      onChange={setFullName}
                      placeholder="Full Name"
                      autoComplete="name"
                      icon={<User className="w-4 h-4" />}
                    />
                    <AuthGlassField
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="Email Address (e.g. name@domain.com)"
                      autoComplete="email"
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <AuthGlassField
                      isPassword
                      value={password}
                      onChange={setPassword}
                      placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                      autoComplete="new-password"
                      maxLength={16}
                      icon={<Lock className="w-4 h-4" />}
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
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
                  {passwordHint && (
                    <p className="text-[10px] text-red-400 font-medium px-4 pt-0.5">
                      {passwordHint}
                    </p>
                  )}
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      maxLength={16}
                      icon={<Lock className="w-4 h-4" />}
                      showPassword={showConfirmPassword}
                      onTogglePassword={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium px-2 pt-0.5">
                    Must be 8–16 chars with 1 uppercase, 1 lowercase, 1 number &
                    1 symbol.
                  </p>

                  <div className="flex items-center gap-2 text-[10px] xl:text-[11px] text-gray-400 font-medium px-2 pt-0.5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                    />
                    <span>
                      Agree to{" "}
                      <span className="text-white underline">Terms</span> &{" "}
                      <span className="text-white underline">Privacy Policy</span>
                    </span>
                  </div>

                  <AuthSubmitButton
                    label="Create Account"
                    loading={isLoading}
                    className="mt-1"
                  />

                  {/* ── Divider ── */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="h-px flex-1 bg-white/15" />
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                      OR
                    </span>
                    <span className="h-px flex-1 bg-white/15" />
                  </div>

                  <GoogleButton
                    onClick={handleGoogleSignIn}
                    loading={isGoogleLoading}
                  />
                </AuthGlassCard>
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
                className="relative z-10 my-auto py-2"
              >
                <AuthGlassCard className="p-6 xl:p-7 space-y-4">
                  <div className="space-y-0.5">
                    <h2 className="text-xl xl:text-2xl font-black text-white uppercase tracking-tight">
                      Welcome Back
                    </h2>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Log in to access your personalized training dashboard
                    </p>
                  </div>

                  <div className="space-y-3">
                    <AuthGlassField
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="Email Address"
                      autoComplete="email"
                      icon={<Mail className="w-4 h-4" />}
                    />

                    <AuthGlassField
                      isPassword
                      value={password}
                      onChange={setPassword}
                      placeholder="Password"
                      autoComplete="current-password"
                      maxLength={16}
                      icon={<Lock className="w-4 h-4" />}
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs px-1 text-gray-300 font-medium">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
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
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("Password reset is coming soon!", { icon: "🔒" });
                    }}
                    className="text-gray-400 hover:text-white underline"
                  >
                    Forget Password?
                  </Link>
                </div>

                  {/* ── Divider ── */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="h-px flex-1 bg-white/15" />
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                      OR
                    </span>
                    <span className="h-px flex-1 bg-white/15" />
                  </div>

                  <GoogleButton
                    onClick={handleGoogleSignIn}
                    loading={isGoogleLoading}
                  />
                </AuthGlassCard>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          LAYOUT VARIANT 2: TABLET (11/12 Screen Width max-w-xl)
          ════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex lg:hidden relative w-11/12 max-w-xl h-full max-h-[660px] min-h-[500px] rounded-[2.5rem] border border-white/15 shadow-2xl overflow-hidden flex-col justify-between p-7 bg-neutral-950">
        {/* Frosted glass backplate layered above the step hero images */}
        <div className="absolute inset-0 z-[1] bg-white/[0.05] backdrop-blur-2xl pointer-events-none" />
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
                  Track workouts, get real-time AI nutrition & training plans,
                  and stay motivated every single day.
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
                <form
                  onSubmit={handleLoginSubmit}
                  noValidate
                  className="space-y-2.5"
                >
                  <AuthGlassCard className="p-5 space-y-2.5">
                    <div className="space-y-0.5 mb-2">
                      <h2 className="text-xl font-black uppercase text-white drop-shadow">
                        Welcome Back
                      </h2>
                      <p className="text-[11px] text-gray-300 font-medium drop-shadow">
                        Log in to continue your fitness journey
                      </p>
                    </div>
                    <AuthGlassField
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="Email Address"
                      autoComplete="email"
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <AuthGlassField
                      isPassword
                      value={password}
                      onChange={setPassword}
                      placeholder="Password"
                      autoComplete="current-password"
                      maxLength={16}
                      icon={<Lock className="w-4 h-4" />}
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                    <div className="flex items-center justify-between text-xs px-1 text-gray-300 font-medium">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
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
                    <AuthSubmitButton
                      label="Login"
                      loading={isLoading}
                      className="mt-1"
                    />

                    {/* ─ Divider ── */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="h-px flex-1 bg-white/15" />
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                        OR
                      </span>
                      <span className="h-px flex-1 bg-white/15" />
                    </div>

                    <GoogleButton
                      onClick={handleGoogleSignIn}
                      loading={isGoogleLoading}
                    />
                  </AuthGlassCard>
                </form>

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
                  {passwordHint && (
                    <p className="text-[10px] text-gray-400 font-medium px-4 pt-0.5">
                      {passwordHint}
                    </p>
                  )}
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

                    {/* ── Divider ── */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="h-px flex-1 bg-white/15" />
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                        OR
                      </span>
                      <span className="h-px flex-1 bg-white/15" />
                    </div>

                    <GoogleButton
                      onClick={handleGoogleSignIn}
                      loading={isGoogleLoading}
                    />
                  </AuthGlassCard>
                </form>

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
      <div className="block md:hidden relative w-11/12 max-w-[410px] h-full max-h-[750px] min-h-[500px] bg-neutral-950 rounded-[2.5rem] border border-white/15 shadow-2xl overflow-hidden flex-col">
        {/* Frosted glass backplate layered above the step hero images */}
        <div className="absolute inset-0 z-[1] bg-white/[0.05] backdrop-blur-2xl pointer-events-none" />
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
              className="relative w-full h-full flex flex-col justify-between p-5 xs:p-6"
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
                className="relative z-10 my-auto"
              >
                <AuthGlassCard className="p-4 xs:p-5 space-y-2.5">
                  <AuthGlassField
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email"
                    autoComplete="email"
                    heightClass="h-10 xs:h-11"
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <AuthGlassField
                    isPassword
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    autoComplete="current-password"
                    maxLength={16}
                    heightClass="h-10 xs:h-11"
                    icon={<Lock className="w-4 h-4" />}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  <div className="flex items-center justify-between text-[10px] px-1 text-gray-300 font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
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

                  <AuthSubmitButton
                    label="Login"
                    loading={isLoading}
                    heightClass="h-10 xs:h-11"
                    className="mt-1 [&>span:first-child]:tracking-wider"
                  />

                  {/* ── Divider ── */}
                  <div className="flex items-center gap-2.5 pt-0.5">
                    <span className="h-px flex-1 bg-white/15" />
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
                      OR
                    </span>
                    <span className="h-px flex-1 bg-white/15" />
                  </div>

                  <GoogleButton
                    onClick={handleGoogleSignIn}
                    loading={isGoogleLoading}
                    heightClass="h-10 xs:h-11"
                  />
                </AuthGlassCard>
              </form>

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
              className="relative w-full h-full flex flex-col justify-between p-5 xs:p-6 overflow-hidden"
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
                className="relative z-10 my-auto"
              >
                <AuthGlassCard className="p-3.5 xs:p-4 space-y-2">
                  <AuthGlassField
                    type="text"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Full Name"
                    autoComplete="name"
                    heightClass="h-9 xs:h-10"
                    textClass="text-[11px]"
                    icon={<User className="w-3.5 h-3.5" />}
                  />
                  <AuthGlassField
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email Address (e.g. user@domain.com)"
                    autoComplete="email"
                    heightClass="h-9 xs:h-10"
                    textClass="text-[11px]"
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />
                  <AuthGlassField
                    isPassword
                    value={password}
                    onChange={setPassword}
                    placeholder="Password (8-16 chars, 1 cap, 1 num, 1 symbol)"
                    autoComplete="new-password"
                    maxLength={16}
                    heightClass="h-9 xs:h-10"
                    textClass="text-[11px]"
                    icon={<Lock className="w-3.5 h-3.5" />}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
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
                {passwordHint && (
                  <p className="text-[9.5px] xs:text-[10px] text-gray-400 font-medium px-3.5 pt-0.5">
                    {passwordHint}
                  </p>
                )}
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    maxLength={16}
                    heightClass="h-9 xs:h-10"
                    textClass="text-[11px]"
                    icon={<Lock className="w-3.5 h-3.5" />}
                    showPassword={showConfirmPassword}
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />

                  <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 font-medium px-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-neutral-800 text-white accent-white"
                    />
                    <span>
                      Agree to{" "}
                      <span className="text-white underline">Terms</span> &{" "}
                      <span className="text-white underline">Privacy Policy</span>
                    </span>
                  </div>

                  <AuthSubmitButton
                    label="Create Account"
                    loading={isLoading}
                    heightClass="h-9 xs:h-10"
                    className="mt-1 px-4"
                  />

                  {/* ── Divider ── */}
                  <div className="flex items-center gap-2.5 pt-0.5">
                    <span className="h-px flex-1 bg-white/15" />
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
                      OR
                    </span>
                    <span className="h-px flex-1 bg-white/15" />
                  </div>

                  <GoogleButton
                    onClick={handleGoogleSignIn}
                    loading={isGoogleLoading}
                    heightClass="h-9 xs:h-10"
                  />
                </AuthGlassCard>
              </form>

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
