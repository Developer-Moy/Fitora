"use client";

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { uploadToImgBB } from "@/services/imageUploadService";
import { createMealApi } from "@/services/mealService";
import { getAuthSession } from "@/services/authService";
import { X, Plus, UploadCloud } from "lucide-react";

/**
 * Meal Upload Form
 */
export default function MealUploadForm() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // New image upload states
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) {
      toast.error("Ingredient cannot be empty");
      return;
    }
    if (ingredients.length >= 15) {
      toast.error("Maximum 15 ingredients allowed");
      return;
    }
    setIngredients([...ingredients, trimmed]);
    setIngredientInput("");
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);

      setIsImageUploading(true);
      setUploadedImageUrl(null);
      setImageUploadError(null);

      try {
        const uploadRes = await uploadToImgBB(file);

        if (uploadRes.success && uploadRes.url && !uploadRes.isLocal) {
          setUploadedImageUrl(uploadRes.url);
          toast.success("Image uploaded successfully");
        } else {
          throw new Error(uploadRes.error || "ImgBB upload failed.");
        }
      } catch (error: any) {  // eslint-disable-line @typescript-eslint/no-explicit-any
        const errMsg = error?.message || "Failed to upload image.";
        setImageUploadError(errMsg);
        toast.error(errMsg);
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const trimmedName = name.trim();
    if (trimmedName.length < 3 || trimmedName.length > 100) {
      toast.error("Name must be between 3 and 100 characters");
      return;
    }

    if (ingredients.length < 1) {
      toast.error("At least 1 ingredient is required");
      return;
    }

    if (calories === "" || calories < 0) {
      toast.error("Calories must be a valid number");
      return;
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 1 || trimmedDesc.length > 500) {
      toast.error("Description must be between 1 and 500 characters");
      return;
    }

    // Handle image upload state checks
    if (!imageFile || !uploadedImageUrl) {
      if (isImageUploading) {
        toast.error("Please wait for the image upload to finish.");
        return;
      }
      if (imageUploadError) {
        toast.error(
          "Please select an image and make sure it uploads successfully."
        );
        return;
      }
      toast.error("Image is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const { token } = getAuthSession();

      const payload = {
        name: trimmedName,
        ingredients,
        calories: Number(calories),
        description: trimmedDesc,
        img: uploadedImageUrl,
      };

      await createMealApi(payload, token ?? null);

      toast.success("Meal uploaded successfully!");

      // Reset form to clean state
      setName("");
      setIngredients([]);
      setIngredientInput("");
      setCalories("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
      setImageUploadError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred during submission";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 tracking-wider">
        Upload New Meal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Meal Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Trout with Almonds"
            className="w-full h-11 px-4 rounded-xl bg-neutral-900 text-sm text-white placeholder-gray-500 outline-none border border-white/5 focus:border-white/30 transition-colors"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Meal Image *
          </label>
          {imagePreview ? (
            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                  isImageUploading || imageUploadError || uploadedImageUrl
                    ? "bg-black/60 opacity-100"
                    : "bg-black/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {isImageUploading ? (
                  <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/80 px-4 py-2 rounded-full animate-pulse">
                    Uploading image...
                  </span>
                ) : imageUploadError ? (
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider bg-black/80 px-4 py-2 rounded-full">
                    Failed to upload image.
                  </span>
                ) : uploadedImageUrl ? (
                  <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/80 px-4 py-2 rounded-full">
                    Image uploaded successfully
                  </span>
                ) : (
                  <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 bg-neutral-900 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Click to upload image
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
            <span>Ingredients *</span>
            <span className="text-[10px] text-gray-500 bg-neutral-900 px-2 py-0.5 rounded-md">
              {ingredients.length}/15
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddIngredient();
                }
              }}
              placeholder="e.g. 200g Chicken Breast"
              className="flex-1 h-11 px-4 rounded-xl bg-neutral-900 text-sm text-white placeholder-gray-500 outline-none border border-white/5 focus:border-white/30 transition-colors"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              disabled={ingredients.length >= 15}
              className="h-11 px-5 rounded-xl bg-white text-black hover:bg-gray-200 font-bold text-xs uppercase transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Add
            </button>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-4 bg-neutral-900/50 rounded-xl border border-white/5">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-full border border-white/10 group hover:border-white/20 transition-colors"
                >
                  <span className="text-xs font-medium text-white">{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-gray-400 hover:text-white hover:bg-red-500/80 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calories */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Total Calories *
          </label>
          <input
            type="number"
            min="0"
            value={calories}
            onChange={(e) =>
              setCalories(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g. 450"
            className="w-full h-11 px-4 rounded-xl bg-neutral-900 text-sm text-white placeholder-gray-500 outline-none border border-white/5 focus:border-white/30 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
            <span>Description *</span>
            <span className="text-[10px] text-gray-500 bg-neutral-900 px-2 py-0.5 rounded-md">
              {description.length}/500
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="A brief description of this meal..."
            className="w-full p-4 rounded-xl bg-neutral-900 text-sm text-white placeholder-gray-500 outline-none border border-white/5 focus:border-white/30 transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-white text-black font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-xl active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Uploading...</span>
            ) : (
              "Upload Meal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
