"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { uploadToImgBB } from "@/services/imageUploadService";

interface MealFormData {
  name: string;
  calories: string;
  description: string;
  category: string;
  img: File | null;
}

const initialFormData: MealFormData = {
  name: "",
  calories: "",
  description: "",
  category: "",
  img: null,
};

export default function MealUploadForm() {
  const [formData, setFormData] = useState<MealFormData>(initialFormData);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      img: file,
    }));
  };

  const addIngredient = () => {
    const value = ingredientInput.trim();

    if (!value) return;

    setIngredients((prev) => [...prev, value]);
    setIngredientInput("");
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient.");
      return;
    }

    if (!formData.img) {
      toast.error("Please select a meal image.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUploading(true);

      // Upload image to ImgBB
      const uploadResult = await uploadToImgBB(formData.img);

      setIsUploading(false);

      if (!uploadResult.success || !uploadResult.url) {
        toast.error(
          uploadResult.error || "Failed to upload meal image."
        );
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // POST /api/meals
      const response = await fetch(`${apiUrl}/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          ingredients,
          calories: Number(formData.calories),
          description: formData.description.trim(),
          img: uploadResult.url,
          category: formData.category.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create meal."
        );
      }

      toast.success("Meal uploaded successfully.");

      setFormData(initialFormData);
      setIngredients([]);
      setIngredientInput("");
    } catch (error) {
      console.error("Meal upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload meal."
      );
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Upload New Meal
        </h2>

        <p className="mt-1 text-sm text-white/50">
          Add meal information and ingredients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Category */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Chicken Rice Bowl"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="high-protein"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>
        </div>

        {/* Calories */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Calories
          </label>

          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="500"
            min="0"
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the meal..."
            rows={4}
            required
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Ingredients
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleIngredientKeyDown}
              placeholder="Add an ingredient"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />

            <button
              type="button"
              onClick={addIngredient}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Add
            </button>
          </div>

          {ingredients.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={`${ingredient}-${index}`}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"
                >
                  <span>{ingredient}</span>

                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-white/50 transition hover:text-white"
                    aria-label={`Remove ${ingredient}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Meal Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
          />

          {formData.img && (
            <p className="mt-2 text-xs text-white/40">
              Selected: {formData.img.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading
            ? "Uploading Image..."
            : isSubmitting
              ? "Creating Meal..."
              : "Upload Meal"}
        </button>
      </form>
    </div>
  );
}