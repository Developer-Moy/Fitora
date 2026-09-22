"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { uploadToImgBB } from "@/services/imageUploadService";

interface ExerciseFormData {
  name: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  equipment: string;
  muscle: string;
  description: string;
  videoId: string;
  image: File | null;
}

const initialFormData: ExerciseFormData = {
  name: "",
  category: "",
  difficulty: "BEGINNER",
  duration: "",
  equipment: "",
  muscle: "",
  description: "",
  videoId: "",
  image: null,
};

export default function ExerciseUploadForm() {
  const [formData, setFormData] =
    useState<ExerciseFormData>(initialFormData);

  const [tips, setTips] = useState<string[]>([]);
  const [tipInput, setTipInput] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      image: file,
    }));
  };

  const addTip = () => {
    const value = tipInput.trim();

    if (!value) return;

    setTips((prev) => [...prev, value]);
    setTipInput("");
  };

  const removeTip = (index: number) => {
    setTips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTipKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTip();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tips.length === 0) {
      toast.error("Please add at least one tip.");
      return;
    }

    if (!formData.image) {
      toast.error("Please select an exercise image.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUploading(true);

      // Upload image to ImgBB
      const uploadResult = await uploadToImgBB(formData.image);

      setIsUploading(false);

      if (!uploadResult.success || !uploadResult.url) {
        toast.error(
          uploadResult.error || "Failed to upload exercise image."
        );
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // POST /api/exercises
      const response = await fetch(`${apiUrl}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category.trim(),
          difficulty: formData.difficulty,
          duration: formData.duration.trim(),
          equipment: formData.equipment.trim(),
          muscle: formData.muscle.trim(),
          description: formData.description.trim(),
          tips,
          videoId: formData.videoId.trim(),
          image: uploadResult.url,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create exercise."
        );
      }

      toast.success("Exercise uploaded successfully.");

      setFormData(initialFormData);
      setTips([]);
      setTipInput("");
    } catch (error) {
      console.error("Exercise upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload exercise."
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
          Upload New Exercise
        </h2>

        <p className="mt-1 text-sm text-white/50">
          Add exercise information, tips, video, and image.
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
              placeholder="Barbell Bench Press"
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
              placeholder="CHEST"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>
        </div>

        {/* Muscle & Equipment */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Muscle Group
            </label>

            <input
              type="text"
              name="muscle"
              value={formData.muscle}
              onChange={handleChange}
              placeholder="Chest"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Equipment
            </label>

            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="Barbell"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>
        </div>

        {/* Difficulty & Duration */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Difficulty
            </label>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Duration
            </label>

            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="10 minutes"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>
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
            placeholder="Describe how to perform this exercise..."
            rows={4}
            required
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />
        </div>

        {/* Video ID */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            YouTube Video ID
          </label>

          <input
            type="text"
            name="videoId"
            value={formData.videoId}
            onChange={handleChange}
            placeholder="dQw4w9WgXcQ"
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />
        </div>

        {/* Tips */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Tips
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={tipInput}
              onChange={(e) => setTipInput(e.target.value)}
              onKeyDown={handleTipKeyDown}
              placeholder="Keep your back straight"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />

            <button
              type="button"
              onClick={addTip}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Add
            </button>
          </div>

          {tips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tips.map((tip, index) => (
                <div
                  key={`${tip}-${index}`}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"
                >
                  <span>{tip}</span>

                  <button
                    type="button"
                    onClick={() => removeTip(index)}
                    className="text-white/50 transition hover:text-white"
                    aria-label={`Remove ${tip}`}
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
            Exercise Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
          />

          {formData.image && (
            <p className="mt-2 text-xs text-white/40">
              Selected: {formData.image.name}
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
              ? "Creating Exercise..."
              : "Upload Exercise"}
        </button>
      </form>
    </div>
  );
}