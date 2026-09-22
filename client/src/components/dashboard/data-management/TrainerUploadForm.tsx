"use client";

import React, { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Upload,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Mail,
  User,
  Briefcase,
  Calendar,
  Sparkles,
  Building2,
  Trash2,
} from "lucide-react";
import { uploadToImgBB } from "@/services/imageUploadService";
import { getAuthSession } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface TrainerFormState {
  name: string;
  email: string;
  designation: string;
  bio: string;
  about: string;
  experienceYears: number | string;
  specializations: string[];
  photo: string;
  branchName: string;
  status: "active" | "inactive";
  featured: boolean;
}

const INITIAL_FORM_STATE: TrainerFormState = {
  name: "",
  email: "",
  designation: "",
  bio: "",
  about: "",
  experienceYears: "",
  specializations: [],
  photo: "",
  branchName: "",
  status: "active",
  featured: false,
};

export default function TrainerUploadForm() {
  const [formData, setFormData] = useState<TrainerFormState>(INITIAL_FORM_STATE);
  const [specInput, setSpecInput] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field change handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (submitError) setSubmitError(null);
  };

  // Specialization chip addition
  const handleAddSpecialization = () => {
    const trimmed = specInput.trim();
    if (!trimmed) return;

    if (
      formData.specializations.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      toast.error(`"${trimmed}" is already added.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specializations: [...prev.specializations, trimmed],
    }));
    setSpecInput("");
  };

  const handleSpecKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSpecialization();
    }
  };

  const handleRemoveSpecialization = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // ImgBB Image Upload
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image size exceeds 8MB limit.");
      return;
    }

    setIsUploadingImage(true);
    setSubmitError(null);

    try {
      const uploadResult = await uploadToImgBB(file);
      if (uploadResult.success && uploadResult.url) {
        setFormData((prev) => ({ ...prev, photo: uploadResult.url! }));
        toast.success("Trainer photo uploaded to ImgBB!");
      } else {
        const errorMsg = uploadResult.error || "Failed to upload image to ImgBB.";
        toast.error(errorMsg);
        setSubmitError(errorMsg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error during image upload.";
      toast.error(msg);
      setSubmitError(msg);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || isUploadingImage) return;

    // Validation
    const nameTrimmed = formData.name.trim();
    const designationTrimmed = formData.designation.trim();
    const bioTrimmed = formData.bio.trim();
    const aboutTrimmed = formData.about.trim() || bioTrimmed;
    const photoTrimmed = formData.photo.trim();
    const experienceNum = Number(formData.experienceYears);

    if (!nameTrimmed) {
      toast.error("Trainer name is required.");
      return;
    }

    if (!designationTrimmed) {
      toast.error("Designation is required.");
      return;
    }

    if (formData.experienceYears === "" || isNaN(experienceNum) || experienceNum < 0) {
      toast.error("Please enter a valid non-negative experience (years).");
      return;
    }

    if (!bioTrimmed) {
      toast.error("Bio is required.");
      return;
    }

    if (!photoTrimmed) {
      toast.error("Please upload a trainer photo.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const session = getAuthSession();
      const token = session.token;

      const payload = {
        name: nameTrimmed,
        email: formData.email.trim(),
        designation: designationTrimmed,
        bio: bioTrimmed,
        about: aboutTrimmed,
        experienceYears: experienceNum,
        specializations: formData.specializations,
        photo: photoTrimmed,
        branchName: formData.branchName.trim(),
        status: formData.status,
        featured: formData.featured,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (session.user?.email) {
        headers["x-user-email"] = session.user.email;
      }

      const res = await fetch(`${API_URL}/trainers`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && data.success === false)) {
        const errorMsg =
          data?.message ||
          (res.status === 401
            ? "Unauthorized: Admin session required."
            : res.status === 403
              ? "Forbidden: Admin privileges required."
              : "Failed to create trainer.");
        setSubmitError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Trainer profile created successfully!");
      setSubmitSuccess(true);
      setFormData(INITIAL_FORM_STATE);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Network error. Please try again.";
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto"
      noValidate
    >
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/10 text-white">
              <Dumbbell className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-white/50 font-bold">
              Data Management Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Upload New Trainer
          </h2>
          <p className="text-sm text-white/60">
            Publish a certified coach or athlete profile to the public trainers roster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Auto-Slug Generation Active
          </span>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Trainer uploaded successfully!</p>
            <p className="text-emerald-400/80 text-xs mt-0.5">
              The coach profile is now registered and will appear in public trainer catalogs.
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Submission Failed</p>
            <p className="text-rose-400/80 text-xs mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Grid: Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-white/40" />
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Alex Mercer"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-white/40" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="e.g. alex.mercer@fitora.com"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-white/40" />
            Designation / Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="e.g. Head Strength & Conditioning Coach"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Experience (Years) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-white/40" />
            Experience (Years) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            name="experienceYears"
            min="0"
            step="1"
            value={formData.experienceYears}
            onChange={handleInputChange}
            placeholder="e.g. 6"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Branch Assignment */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-white/40" />
            Assigned Branch
          </label>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleInputChange}
            placeholder="e.g. Gulshan-2 Flagship Branch"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white/40" />
            Profile Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          >
            <option value="active">Active (Visible Publicly)</option>
            <option value="inactive">Inactive (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Specializations (Chip Tag Input) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white/40" />
          Specializations
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            onKeyDown={handleSpecKeyDown}
            placeholder="e.g. Hypertrophy, HIIT, Kettlebell (press Enter)"
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
          <button
            type="button"
            onClick={handleAddSpecialization}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Chips list */}
        {formData.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {formData.specializations.map((spec, index) => (
              <span
                key={`${spec}-${index}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-white"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialization(index)}
                  className="p-0.5 hover:text-rose-400 rounded transition"
                  title="Remove specialization"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Short Bio */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          Short Bio <span className="text-rose-400">*</span>
        </label>
        <textarea
          name="bio"
          rows={2}
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="A punchy 1-2 sentence introduction displayed on trainer cards..."
          required
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition resize-y"
        />
      </div>

      {/* Detailed About */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            Full Biography / About Section
          </label>
          <span className="text-[11px] text-white/40">
            Optional (defaults to Short Bio if left blank)
          </span>
        </div>
        <textarea
          name="about"
          rows={4}
          value={formData.about}
          onChange={handleInputChange}
          placeholder="Comprehensive athletic background, coaching philosophy, and client transformation journey..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition resize-y"
        />
      </div>

      {/* Image Upload (ImgBB Direct Upload) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-white/40" />
          Trainer Photo <span className="text-rose-400">*</span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          disabled={isUploadingImage || isSubmitting}
        />

        {formData.photo ? (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900">
              <Image
                src={formData.photo}
                alt="Trainer preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ImgBB Hosted
                </span>
              </div>
              <p className="text-xs text-white/50 truncate font-mono">
                {formData.photo}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage || isSubmitting}
                  className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-4 disabled:opacity-50"
                >
                  Change Image
                </button>
                <span className="text-white/20">•</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage || isSubmitting}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              if (!isUploadingImage && !isSubmitting) {
                fileInputRef.current?.click();
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isUploadingImage
                ? "border-white/30 bg-white/5 cursor-wait"
                : "border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            {isUploadingImage ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-sm font-semibold text-white">
                  Uploading image to ImgBB...
                </p>
                <p className="text-xs text-white/40">
                  Compressing and securing high-resolution image asset
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/10 text-white">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Click to browse or drop coach photo
                  </p>
                  <p className="text-xs text-white/40">
                    PNG, JPG, WEBP up to 8MB • Hosted securely via ImgBB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10">
        <input
          type="checkbox"
          id="featuredTrainer"
          name="featured"
          checked={formData.featured}
          onChange={handleInputChange}
          className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-white/40 accent-white"
        />
        <label
          htmlFor="featuredTrainer"
          className="text-xs text-white/80 select-none cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Pin as <strong>Featured Trainer</strong> on homepage and spotlight highlights</span>
        </label>
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setFormData(INITIAL_FORM_STATE);
            setSubmitError(null);
            setSubmitSuccess(false);
          }}
          disabled={isSubmitting || isUploadingImage}
          className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium text-white/70 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Form
        </button>

        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publishing Trainer...
            </>
          ) : isUploadingImage ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading Photo...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Upload Trainer
            </>
          )}
        </button>
      </div>
    </form>
  );
}

