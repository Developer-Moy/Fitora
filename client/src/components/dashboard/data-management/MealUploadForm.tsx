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
  Utensils,
  Flame,
  Tag,
  FileText,
  Trash2,
} from "lucide-react";
import { uploadToImgBB } from "@/services/imageUploadService";
import { getAuthSession } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const MEAL_CATEGORIES = [
  { value: "high-protein", label: "High Protein (450+ kcal)" },
  { value: "low-calorie", label: "Low Calorie (<500 kcal)" },
  { value: "fat-loss", label: "Fat Loss (<450 kcal)" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "vegetarian", label: "Vegetarian / Plant Based" },
  { value: "keto", label: "Keto / Low Carb" },
  { value: "balanced", label: "Balanced Nutrition" },
];

export interface MealFormState {
  name: string;
  calories: number | string;
  category: string;
  description: string;
  img: string;
  ingredients: string[];
}

const INITIAL_MEAL_STATE: MealFormState = {
  name: "",
  calories: "",
  category: "high-protein",
  description: "",
  img: "",
  ingredients: [],
};

export default function MealUploadForm() {
  const [formData, setFormData] = useState<MealFormState>(INITIAL_MEAL_STATE);
  const [ingredientInput, setIngredientInput] = useState<string>("");
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

  // Dynamic Ingredient Chips Handling
  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;

    if (
      formData.ingredients.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      toast.error(`"${trimmed}" is already in the ingredients list.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, trimmed],
    }));
    setIngredientInput("");
  };

  const handleIngredientKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // ImgBB Meal Image Upload
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
        setFormData((prev) => ({ ...prev, img: uploadResult.url! }));
        toast.success("Meal photo uploaded to ImgBB!");
      } else {
        const errorMsg = uploadResult.error || "Failed to upload meal photo to ImgBB.";
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
    setFormData((prev) => ({ ...prev, img: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || isUploadingImage) return;

    const nameTrimmed = formData.name.trim();
    const descriptionTrimmed = formData.description.trim();
    const imgTrimmed = formData.img.trim();
    const caloriesNum = Number(formData.calories);

    if (!nameTrimmed) {
      toast.error("Meal name is required.");
      return;
    }

    if (formData.calories === "" || isNaN(caloriesNum) || caloriesNum <= 0) {
      toast.error("Please enter a valid calorie count greater than 0.");
      return;
    }

    if (formData.ingredients.length === 0) {
      toast.error("Please add at least one ingredient.");
      return;
    }

    if (!descriptionTrimmed) {
      toast.error("Meal description is required.");
      return;
    }

    if (!imgTrimmed) {
      toast.error("Please upload a meal photo before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const session = getAuthSession();
      const token = session.token;

      // Meal ID is automatically generated by backend; omitted from client POST payload
      const payload = {
        name: nameTrimmed,
        ingredients: formData.ingredients,
        calories: caloriesNum,
        description: descriptionTrimmed,
        img: imgTrimmed,
        category: formData.category,
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

      const res = await fetch(`${API_URL}/meals`, {
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
              : "Failed to create meal.");
        setSubmitError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Meal recipe uploaded successfully!");
      setSubmitSuccess(true);
      setFormData(INITIAL_MEAL_STATE);
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
              <Utensils className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-white/50 font-bold">
              Data Management Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Upload New Meal
          </h2>
          <p className="text-sm text-white/60">
            Add a healthy recipe, ingredient breakdown, and macro targets to the nutritional database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/15">
            Auto ID Assigned
          </span>
        </div>
      </div>

      {/* Feedback Alerts */}
      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Meal uploaded successfully!</p>
            <p className="text-emerald-400/80 text-xs mt-0.5">
              The recipe and nutritional macros are now live in the meal library.
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

      {/* Grid: Basic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meal Name */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-white/40" />
            Meal Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Grilled Lemon Herb Chicken"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>

        {/* Calories */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Calories (kcal) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            name="calories"
            min="1"
            step="1"
            value={formData.calories}
            onChange={handleInputChange}
            placeholder="e.g. 450"
            required
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
        </div>
      </div>

      {/* Category Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-white/40" />
          Meal Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
        >
          {MEAL_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Ingredient Chips Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
            Ingredients Breakdown <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-white/40">
            {formData.ingredients.length} {formData.ingredients.length === 1 ? "ingredient" : "ingredients"} added
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={handleIngredientKeyDown}
            placeholder="e.g. Chicken breast, Asparagus, Olive oil (press Enter to add)"
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Dynamic Ingredient Chips Display */}
        {formData.ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/10 min-h-[48px] items-center">
            {formData.ingredients.map((ing, index) => (
              <span
                key={`${ing}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-white shadow-sm transition hover:border-white/30"
              >
                <span>{ing}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="p-0.5 hover:text-rose-400 rounded transition"
                  title={`Remove ${ing}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/40 italic">
            No ingredients added yet. Type an ingredient name and press Enter or click Add.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-white/40" />
          Meal Description & Preparation <span className="text-rose-400">*</span>
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe flavor profile, cooking tips, and nutritional benefits..."
          required
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition resize-y"
        />
      </div>

      {/* Image Upload (ImgBB Direct Upload) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-white/40" />
          Meal Photo <span className="text-rose-400">*</span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          disabled={isUploadingImage || isSubmitting}
        />

        {formData.img ? (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900">
              <Image
                src={formData.img}
                alt="Meal preview"
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
                {formData.img}
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
                  Uploading recipe photo to ImgBB...
                </p>
                <p className="text-xs text-white/40">
                  Processing and generating CDN image URL
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/10 text-white">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Click to browse or drop delicious meal photo
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
            setFormData(INITIAL_MEAL_STATE);
            setIngredientInput("");
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
              Publishing Meal...
            </>
          ) : isUploadingImage ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading Photo...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Upload Meal
            </>
          )}
        </button>
      </div>
    </form>
  );
}

