"use client";

import { useState, useEffect } from "react";
import {
  X,
  Crown,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  LogIn,
  AlertCircle,
} from "lucide-react";
import FitoraPillButton from "@/components/ui/FitoraPillButton";
import {
  fetchPublicBranches,
  activateFreePassApi,
} from "@/services/branchService";
import { getAuthSession, saveAuthSession } from "@/services/authService";

interface VipPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  branchId: string;
}

interface BranchOption {
  _id: string;
  name: string;
  division?: string;
  district?: string;
}

export default function VipPassModal({
  isOpen,
  onClose,
}: VipPassModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    branchId: "",
  });

  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    assignedBranch: string;
    trialExpiresAt: string;
  } | null>(null);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trialAlreadyActive, setTrialAlreadyActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  // Load branches and check auth on open
  useEffect(() => {
    if (!isOpen) return;

    // Check auth
    const { token, user } = getAuthSession();
    const loggedIn = !!(token && user);
    setIsLoggedIn(loggedIn);

    // Check if trial already active
    if (loggedIn && user?.trialExpiresAt) {
      const expiry = new Date(user.trialExpiresAt);
      if (expiry > new Date()) {
        const daysLeft = Math.ceil(
          (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        setTrialAlreadyActive(true);
        setTrialDaysLeft(daysLeft);
      } else {
        setTrialAlreadyActive(false);
      }
    } else {
      setTrialAlreadyActive(false);
    }

    // Pre-fill name & phone from session
    if (loggedIn && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
      }));
    }

    // Fetch branches from MongoDB
    setBranchesLoading(true);
    fetchPublicBranches()
      .then((data) => setBranches(data))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleClose = () => {
    if (submitting) return;
    setFormData({ fullName: "", phone: "", branchId: "" });
    setError("");
    setSuccess(false);
    setSuccessData(null);
    setTrialAlreadyActive(false);
    onClose();
  };

  const validateForm = () => {
    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();

    if (!fullName || fullName.length < 3) {
      setError("Please enter your full name (min 3 characters).");
      return false;
    }
    if (!phone) {
      setError("Please enter your phone number.");
      return false;
    }
    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid Bangladesh phone number.");
      return false;
    }
    if (!formData.branchId) {
      setError("Please select your nearest branch.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError("");

      const result = await activateFreePassApi({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        branchId: formData.branchId,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      // Update local session with trial info
      const { token, user } = getAuthSession();
      if (token && user && result.data) {
        saveAuthSession(token, {
          ...user,
          trialExpiresAt: result.data.trialExpiresAt,
          isTrialActive: true,
          assignedBranch: result.data.assignedBranch,
        });
      }

      setSuccessData(result.data
        ? {
            assignedBranch: result.data.assignedBranch,
            trialExpiresAt: result.data.trialExpiresAt,
          }
        : null);
      setSuccess(true);

      setTimeout(() => {
        handleClose();
      }, 3500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatExpiry = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          disabled={submitting}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── SUCCESS STATE ── */}
        {success ? (
          <div className="flex flex-col items-center justify-center px-8 py-14 text-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <Sparkles className="h-3.5 w-3.5 text-black" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                VIP Pass Activated!
              </h3>
              <p className="mt-2 text-sm text-white/50 leading-6">
                Your 3-Day Free VIP access is now live.
                {successData?.assignedBranch && (
                  <>
                    {" "}Branch:{" "}
                    <span className="text-white/80 font-semibold">
                      {successData.assignedBranch}
                    </span>
                  </>
                )}
              </p>
              {successData?.trialExpiresAt && (
                <p className="mt-1 text-xs text-white/35">
                  Expires: {formatExpiry(successData.trialExpiresAt)}
                </p>
              )}
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] text-white/40 leading-5">
                All premium features are unlocked. Enjoy Fitora VIP for 3 full
                days!
              </p>
            </div>
          </div>
        ) : trialAlreadyActive ? (
          /* ── ALREADY ACTIVE STATE ── */
          <div className="flex flex-col items-center justify-center px-8 py-14 text-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <Crown className="h-9 w-9 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase text-white">
                Already Active
              </h3>
              <p className="mt-2 text-sm text-white/50 leading-6">
                Your 3-Day Free VIP Pass is already running.
                <br />
                <span className="text-white font-bold text-base">
                  {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining
                </span>
              </p>
            </div>
            <FitoraPillButton
              variant="white"
              onClick={handleClose}
              className="w-full justify-center"
            >
              Continue Training
            </FitoraPillButton>
          </div>
        ) : !isLoggedIn ? (
          /* ── NOT LOGGED IN STATE ── */
          <div className="flex flex-col items-center justify-center px-8 py-14 text-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <LogIn className="h-9 w-9 text-white/70" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase text-white">
                Login Required
              </h3>
              <p className="mt-2 text-sm text-white/50 leading-6">
                Sign in or create a free account to activate your{" "}
                <span className="text-white font-semibold">
                  3-Day VIP Gym Pass
                </span>{" "}
                and unlock all premium features.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <FitoraPillButton
                variant="white"
                href="/register"
                className="w-full justify-center"
              >
                Create Free Account
              </FitoraPillButton>
              <FitoraPillButton
                variant="black"
                href="/login"
                className="w-full justify-center"
              >
                Sign In
              </FitoraPillButton>
            </div>
            <p className="text-[10px] text-white/25">
              Free account creation takes less than 30 seconds.
            </p>
          </div>
        ) : (
          /* ── MAIN FORM STATE ── */
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative overflow-hidden px-6 pb-5 pt-7">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/4 blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Crown className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                    Exclusive Access
                  </span>
                </div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  FITORA FITNESS
                </p>
                <h2 className="text-2xl font-black uppercase leading-none tracking-tight text-white sm:text-3xl">
                  Free 3-Day
                  <br />
                  <span className="text-white/55">VIP Gym Pass</span>
                </h2>
                <p className="mt-3 text-xs leading-5 text-white/40 max-w-xs">
                  Activate full premium access for 3 days — completely free.
                </p>
              </div>
            </div>

            {/* Pass Card (compact) */}
            <div className="mx-6 mb-5 rounded-xl border border-white/12 bg-gradient-to-br from-[#181818] to-[#080808] px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/30">
                    MEMBERSHIP
                  </p>
                  <p className="mt-0.5 text-sm font-black uppercase text-white">
                    VIP DAY PASS
                  </p>
                </div>
                <p className="text-2xl font-black text-white">03</p>
              </div>
              <div className="my-3 h-px bg-white/8" />
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                <span className="text-white/30">FITORA</span>
                <span className="text-white/45">3 DAYS FREE ACCESS</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 px-6 pb-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="vip-fullName"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-white/45"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                  <input
                    id="vip-fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={submitting}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="vip-phone"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-white/45"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                  <input
                    id="vip-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    disabled={submitting}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Branch Select — dynamic from MongoDB */}
              <div>
                <label
                  htmlFor="vip-branch"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-white/45"
                >
                  Select Nearest Branch
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                  <select
                    id="vip-branch"
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    disabled={submitting || branchesLoading}
                    className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled className="bg-[#0b0b0b]">
                      {branchesLoading
                        ? "Loading branches..."
                        : "Select your nearest branch"}
                    </option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id} className="bg-[#0b0b0b]">
                        {b.name}
                        {b.division ? ` — ${b.division}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {!branchesLoading && branches.length === 0 && (
                  <p className="mt-1 text-[10px] text-white/30">
                    Could not load branches. Check your connection.
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" />
                  <p className="text-xs leading-5 text-white/65">{error}</p>
                </div>
              )}

              {/* CTA */}
              <FitoraPillButton
                type="submit"
                variant="white"
                disabled={submitting || branchesLoading}
                loading={submitting}
                className="w-full justify-center mt-1"
              >
                {submitting ? "Activating..." : "Activate Free VIP Pass"}
              </FitoraPillButton>

              <p className="text-center text-[10px] leading-5 text-white/22">
                Your information is used only to set up your VIP gym pass.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
