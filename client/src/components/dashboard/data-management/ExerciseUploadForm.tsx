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
  Type,
  Tag,
  Timer,
  Zap,
  Target,
  FileText,
  Link,
  Trash2,
  Activity,
} from "lucide-react";
import { uploadToImgBB } from "@/services/imageUploadService";
import { getAuthSession } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const EXERCISE_CATEGORIES = [
  "CHEST",
  "BACK",
  "LEGS",
  "ARMS",
  "SHOULDERS",
  "CORE",
  "GLUTES",
  "FULL BODY",
  "CARDIO",
  "MOBILITY",
  "FUNCTIONAL",
];

const EXERCISE_EQUIPMENT = [
  "BARBELL",
  "DUMBBELLS",
  "BODYWEIGHT",
  "KETTLEBELL",
  "CABLE",
  "MACHINE",
  "PULL-UP BAR",
  "JUMP ROPE",
  "BOX",
  "EZ BAR",
  "BATTLE ROPE",
  "SLED",
];

const EXERCISE_DIFFICULTY = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
];

export interface ExerciseFormState {
  name: string;
  category: string;
  difficulty: string;
  duration: string;
  equipment: string;
  muscle: string;
  description: string;
  tips: string[];
  videoId: string;
  image: string;
}

const INITIAL_EXERCISE_STATE: ExerciseFormState = {
  name: "",
  category: "",
  difficulty: "BEGINNER",
  duration: "",
  equipment: "",
  muscle: "",
  description: "",
  tips: [],
  videoId: "",
  image: "",
};

export default function ExerciseUploadForm() {
  const [formData, setFormData] = useState<ExerciseFormState>(INITIAL_EXERCISE_STATE);
  const [tipInput, setTipInput] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field change handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  // Dynamic Tips Chip Handling
  const handleAddTip = () => {
    const trimmed = tipInput.trim();
    if (!trimmed) return;

    if (formData.tips.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`"${trimmed}" tip is already added.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tips: [...prev.tips, trimmed],
    }));
    setTipInput("");
  };

  const handleTipKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTip();
    }
  };

  const handleRemoveTip = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      tips: prev.tips.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // ImgBB Exercise Image Upload
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
        setFormData((prev) => ({ ...prev, image: uploadResult.url! }));
        toast.success("Exercise photo uploaded to ImgBB!");
      } else {
        const errorMsg = uploadResult.error || "Failed to upload exercise photo to ImgBB.";
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
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || isUploadingImage) return;

    const nameTrimmed = formData.name.trim();
    const durationTrimmed = formData.duration.trim();
    const equipmentTrimmed = formData.equipment.trim();
    const muscleTrimmed = formData.muscle.trim();
    const descriptionTrimmed = formData.description.trim();
    const imgTrimmed = formData.image.trim();
    const videoIdTrimmed = formData.videoId.trim();

    if (!nameTrimmed) {
      toast.error("Exercise name is required.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (!formData.difficulty) {
      toast.error("Please select a difficulty level.");
      return;
    }

    if (!durationTrimmed) {
      toast.error("Duration is required.");
      return;
    }

    if (!equipmentTrimmed) {
      toast.error("Equipment is required.");
      return;
    }

    if (!muscleTrimmed) {
      toast.error("Target muscle is required.");
      return;
    }

    if (!descriptionTrimmed) {
      toast.error("Description is required.");
      return;
    }

    if (!videoIdTrimmed) {
      toast.error("YouTube video ID is required.");
      return;
    }

    if (!imgTrimmed) {
      toast.error("Please upload an exercise photo before submitting.");
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
        category: formData.category,
        difficulty: formData.difficulty,
        duration: durationTrimmed,
        equipment: equipmentTrimmed,
        muscle: muscleTrimmed,
        description: descriptionTrimmed,
        tips: formData.tips,
        videoId: videoIdTrimmed,
        image: imgTrimmed,
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

      const res = await fetch(`${API_URL}/exercises`, {
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
              : "Failed to create exercise.");
        setSubmitError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Exercise published successfully!");
      setSubmitSuccess(true);
      setFormData(INITIAL_EXERCISE_STATE);
      setTipInput("");
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
            Upload New Exercise
          </h2>
          <p className="text-sm text-white/60">
            Add a new exercise to the library with category, difficulty, equipment, and demonstration media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/15">
            Auto ID Assigned
          </span>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Exercise uploaded successfully!</p>
            <p className="text-emerald-400/80 text-xs mt-0.5">
              The exercise is now registered and will appear in public exercise catalogs.
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
        {/* Exercise Name */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-white/40" />
            Exercise Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Barbell Bench Press"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-white/40" />
            Category <span className="text-rose-400">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          >
            <option value="" disabled>
              Select category
            </option>
            {EXERCISE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-white/40" />
            Difficulty <span className="text-rose-400">*</span>
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            required
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          >
            {EXERCISE_DIFFICULTY.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-white/40" />
            Duration <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g. 12 MIN"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Equipment */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-white/40" />
            Equipment <span className="text-rose-400">*</span>
          </label>
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleInputChange}
            required
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          >
            <option value="" disabled>
              Select equipment
            </option>
            {EXERCISE_EQUIPMENT.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {/* Target Muscle */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-white/40" />
            Target Muscle <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="muscle"
            value={formData.muscle}
            onChange={handleInputChange}
            placeholder="e.g. Chest, Quads, Lats, Shoulders"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* YouTube Video ID */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-white/40" />
            YouTube Video ID <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="videoId"
              value={formData.videoId}
              onChange={handleInputChange}
              placeholder="e.g. vcBig73ojpE (YouTube video ID only)"
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition pl-[38px]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/5 rounded-lg p-1.5 border border-white/10">
              <Link className="w-4 h-4 text-white/40" />
            </div>
          </div>
          <p className="text-[11px] text-white/40">
            Paste only the YouTube video ID (the string after v= in the URL).
          </p>
        </div>
      </div>

      {/* Dynamic Tips Chip Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white/40" />
            Coaching Tips
          </label>
          <span className="text-[11px] text-white/40">
            {formData.tips.length} {formData.tips.length === 1 ? "tip" : "tips"} added
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={tipInput}
            onChange={(e) => setTipInput(e.target.value)}
            onKeyDown={handleTipKeyDown}
            placeholder="e.g. Keep your shoulder blades retracted (press Enter)"
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
          <button
            type="button"
            onClick={handleAddTip}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Dynamic Tips Chips Display */}
        {formData.tips.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/10 min-h-[48px] items-center">
            {formData.tips.map((tip, index) => (
              <span
                key={`${tip}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-white shadow-sm transition hover:border-white/30"
              >
                <span>{tip}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTip(index)}
                  className="p-0.5 hover:text-rose-400 rounded transition"
                  title={`Remove tip`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/40 italic">
            No tips added yet. Type a tip and press Enter or click Add.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-white/40" />
          Exercise Description <span className="text-rose-400">*</span>
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the movement, target muscles, form cues, and breathing pattern..."
          required
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition resize-y"
        />
      </div>

      {/* Image Upload (ImgBB Direct Upload) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-white/40" />
          Exercise Photo <span className="text-rose-400">*</span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          disabled={isUploadingImage || isSubmitting}
        />

        {formData.image ? (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900">
              <Image
                src={formData.image}
                alt="Exercise preview"
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
                {formData.image}
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
                  Uploading exercise photo to ImgBB...
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
                    Click to browse or drop exercise photo
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

      {/* Submit Action */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setFormData(INITIAL_EXERCISE_STATE);
            setTipInput("");
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
              Publishing Exercise...
            </>
          ) : isUploadingImage ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading Photo...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Upload Exercise
            </>
          )}
        </button>
      </div>
    </form>
  );
}
