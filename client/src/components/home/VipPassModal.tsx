"use client";

import { useState } from "react";
import { X, Crown, MapPin, Phone, User, CheckCircle2 } from "lucide-react";
import FitoraPillButton from "@/components/ui/FitoraPillButton";

interface VipPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  branch: string;
}

export default function VipPassModal({
  isOpen,
  onClose,
}: VipPassModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    branch: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleClose = () => {
    if (submitting) return;

    setFormData({
      fullName: "",
      phone: "",
      branch: "",
    });

    setError("");
    setSuccess(false);
    onClose();
  };

  const validateForm = () => {
    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();

    if (!fullName) {
      setError("Please enter your full name.");
      return false;
    }

    if (fullName.length < 3) {
      setError("Please enter a valid full name.");
      return false;
    }

    if (!phone) {
      setError("Please enter your phone number.");
      return false;
    }

    // Bangladesh phone number validation
    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid Bangladesh phone number.");
      return false;
    }

    if (!formData.branch) {
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

      // Backend API will be connected here later.
      console.log("VIP Pass Lead:", formData);

      // Temporary request simulation
      await new Promise((resolve) => setTimeout(resolve, 700));

      setSuccess(true);

      // Keep success message visible before closing
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      console.error("VIP pass submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
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

        {/* Header */}
        <div className="relative overflow-hidden px-6 pb-7 pt-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <Crown className="h-4 w-4 text-white" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                Exclusive Access
              </span>
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              FITORA FITNESS
            </p>

            <h2 className="text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl">
              Free 1-Day
              <br />
              <span className="text-white/60">VIP Gym Pass</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
              Experience Fitora for one full day. Train like a VIP and discover
              your new fitness home.
            </p>
          </div>
        </div>

        {/* Success State */}
        {success ? (
          <div className="px-6 pb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black uppercase text-white">
                Request Received
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Your 1-Day VIP Gym Pass request has been received. Our team will
                contact you shortly.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Pass Card */}
            <div className="mx-6 mb-6 rounded-2xl border border-white/15 bg-linear-to-br from-[#181818] to-[#080808] p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
                    MEMBERSHIP
                  </p>

                  <p className="mt-1 text-lg font-black uppercase text-white">
                    VIP DAY PASS
                  </p>
                </div>

                <p className="text-3xl font-black text-white">01</p>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white/30">FITORA</span>
                <span className="text-white/50">ONE DAY ACCESS</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-7">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/50"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={submitting}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/50"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    disabled={submitting}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Branch */}
              <div>
                <label
                  htmlFor="branch"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/50"
                >
                  Select Nearest Branch
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    disabled={submitting}
                    className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled className="bg-black">
                      Select your nearest branch
                    </option>

                    <option value="dhaka" className="bg-black">
                      Dhaka
                    </option>

                    <option value="sylhet" className="bg-black">
                      Sylhet
                    </option>

                    <option value="chittagong" className="bg-black">
                      Chittagong
                    </option>
                  </select>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs leading-5 text-white/70">{error}</p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-2">
                <FitoraPillButton
                  type="submit"
                  variant="white"
                  disabled={submitting}
                  className="w-full justify-center"
                >
                  {submitting ? "CLAIMING..." : "CLAIM VIP 1-DAY PASS ↗"}
                </FitoraPillButton>
              </div>

              <p className="text-center text-[10px] leading-5 text-white/25">
                Your information is used only to arrange your VIP gym pass.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
