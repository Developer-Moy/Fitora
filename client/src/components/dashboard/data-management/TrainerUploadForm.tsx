"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { uploadToImgBB } from "@/services/imageUploadService";

interface TrainerFormData {
  name: string;
  email: string;
  designation: string;
  bio: string;
  experienceYears: string;
  specializations: string;
  photo: File | null;
}

const initialFormData: TrainerFormData = {
  name: "",
  email: "",
  designation: "",
  bio: "",
  experienceYears: "",
  specializations: "",
  photo: null,
};

export default function TrainerUploadForm() {
  const [formData, setFormData] = useState<TrainerFormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.photo) {
      toast.error("Please select a trainer photo.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image to ImgBB
      setIsUploading(true);

      const uploadResult = await uploadToImgBB(formData.photo);

      setIsUploading(false);

      if (!uploadResult.success || !uploadResult.url) {
        toast.error(uploadResult.error || "Failed to upload trainer photo.");
        return;
      }

      // Generate slug from trainer name
      const slug = formData.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Prepare trainer data
      const trainerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        slug,
        designation: formData.designation.trim(),
        bio: formData.bio.trim(),
        about: formData.bio.trim(),
        photo: uploadResult.url,
        experienceYears: Number(formData.experienceYears),
        specializations: formData.specializations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      // POST /api/trainers
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/trainers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainerData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create trainer.",
        );
      }

      toast.success("Trainer uploaded successfully.");

      setFormData(initialFormData);
    } catch (error) {
      console.error("Trainer upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload trainer.",
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
          Upload New Trainer
        </h2>

        <p className="mt-1 text-sm text-white/50">
          Add trainer basic and professional information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
              placeholder="Trainer name"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="trainer@example.com"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Senior Fitness Trainer"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              placeholder="5"
              min="0"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Bio
          </label>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write trainer bio..."
            rows={4}
            required
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />
        </div>

        {/* Specializations */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Specializations
          </label>

          <input
            type="text"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            placeholder="Strength Training, Weight Loss, Yoga"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          />

          <p className="mt-2 text-xs text-white/40">
            Separate multiple specializations with commas.
          </p>
        </div>

        {/* Photo */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Trainer Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            required
            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
          />

          {formData.photo && (
            <p className="mt-2 text-xs text-white/40">
              Selected: {formData.photo.name}
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
              ? "Creating Trainer..."
              : "Upload Trainer"}
        </button>
      </form>
    </div>
  );
}