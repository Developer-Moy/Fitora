import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import Trainer from "../models/trainer.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * Helper: Generate a URL-friendly slug from a trainer name.
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * Allowed trainer status values (mirrors the model enum).
 */
const ALLOWED_STATUSES = ["active", "inactive"] as const;

/**
 * Helper: Validate a trainer status value.
 */
const isValidStatus = (status: unknown): boolean => {
  return ALLOWED_STATUSES.includes(status as any);
};

/**
 * Helper: Validate a numeric field against an optional min/max range.
 * Returns an error message when invalid, or `null` when valid.
 */
const validateNumericRange = (
  label: string,
  value: unknown,
  min?: number,
  max?: number,
): string | null => {
  if (value === undefined || value === null || value === "") return null;

  const num = Number(value);

  if (Number.isNaN(num)) {
    return `${label} must be a valid number.`;
  }

  if (min !== undefined && num < min) {
    return `${label} must be greater than or equal to ${min}.`;
  }

  if (max !== undefined && num > max) {
    return `${label} must be less than or equal to ${max}.`;
  }

  return null;
};

/**
 * 1. Create Trainer (`POST /api/trainers`)
 */
export const createTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      slug,
      designation,
      bio,
      about,
      photo,
      coverImage,
      experienceYears,
      specializations,
      certifications,
      achievements,
      education,
      languages,
      facebook,
      instagram,
      linkedin,
      youtube,
      branchId,
      branchName,
      city,
      availability,
      featured,
      status,
      rating,
      totalReviews,
    } = req.body;

    // Validate required fields
    if (!name || !designation || !bio || !about || !photo) {
      return res.status(400).json(
        errorResponse(
          "Name, designation, bio, about, and photo are required fields.",
          "VALIDATION_ERROR",
          400,
        ),
      );
    }

    if (experienceYears === undefined || experienceYears === null) {
      return res.status(400).json(
        errorResponse(
          "Experience years is a required field.",
          "VALIDATION_ERROR",
          400,
        ),
      );
    }

    // Validate numeric ranges
    const numericError =
      validateNumericRange("Experience years", experienceYears, 0) ||
      validateNumericRange("Rating", rating, 0, 5) ||
      validateNumericRange("Total reviews", totalReviews, 0);

    if (numericError) {
      return res
        .status(400)
        .json(errorResponse(numericError, "VALIDATION_ERROR", 400));
    }

    // Validate status enum
    if (status !== undefined && status !== null && !isValidStatus(status)) {
      return res.status(400).json(
        errorResponse(
          `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`,
          "VALIDATION_ERROR",
          400,
        ),
      );
    }

    // Generate slug from name if not provided
    const finalSlug =
      slug && String(slug).trim()
        ? String(slug).trim().toLowerCase()
        : generateSlug(String(name));

    // Prevent duplicate slug creation
    const existingTrainer = await Trainer.findOne({ slug: finalSlug });
    if (existingTrainer) {
      return res.status(400).json(
        errorResponse(
          `A trainer with slug "${finalSlug}" already exists.`,
          "DUPLICATE_SLUG",
          400,
        ),
      );
    }

    const trainer = await Trainer.create({
      name: String(name).trim(),
      slug: finalSlug,
      designation: String(designation).trim(),
      bio: String(bio).trim(),
      about: String(about).trim(),
      photo: String(photo).trim(),
      coverImage: coverImage?.trim() || "",
      experienceYears,
      specializations: specializations || [],
      certifications: certifications || [],
      achievements: achievements || [],
      education: education || [],
      languages: languages || [],
      facebook: facebook?.trim() || "",
      instagram: instagram?.trim() || "",
      linkedin: linkedin?.trim() || "",
      youtube: youtube?.trim() || "",
      branchId: branchId
        ? new mongoose.Types.ObjectId(String(branchId))
        : null,
      branchName: branchName?.trim() || "",
      city: city?.trim() || "",
      availability: availability || [],
      featured: featured !== undefined ? featured : false,
      status: status || "active",
      rating: rating !== undefined ? Number(rating) : 0,
      totalReviews: totalReviews !== undefined ? Number(totalReviews) : 0,
    });

    return res
      .status(201)
      .json(successResponse("Trainer created successfully.", trainer));
  } catch (error: any) {
    console.error("Error creating trainer:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while creating trainer.",
        error.message,
        500,
      ),
    );
  }
};

/**
 * 2. Get All Trainers (`GET /api/trainers`)
 * Returns all active trainers with no pagination, search, or filtering.
 */
export const getAllTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await Trainer.find({ status: "active" }).sort({
      createdAt: -1,
    });

    return res.status(200).json(
      successResponse("Trainers retrieved successfully.", { trainers }),
    );
  } catch (error: any) {
    console.error("Error fetching trainers:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching trainers.",
        error.message,
        500,
      ),
    );
  }
};

/**
 * 3. Get Trainer By Slug (`GET /api/trainers/slug/:slug`)
 */
export const getTrainerBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const trainer = await Trainer.findOne({ slug });

    if (!trainer) {
      return res
        .status(404)
        .json(errorResponse("Trainer not found.", "TRAINER_NOT_FOUND", 404));
    }

    return res
      .status(200)
      .json(successResponse("Trainer retrieved successfully.", trainer));
  } catch (error: any) {
    console.error("Error fetching trainer by slug:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching trainer.",
        error.message,
        500,
      ),
    );
  }
};

/**
 * 4. Get Trainer By ID (`GET /api/trainers/:id`)
 */
export const getTrainerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return res
        .status(400)
        .json(errorResponse("Invalid trainer ID.", "INVALID_ID", 400));
    }

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res
        .status(404)
        .json(errorResponse("Trainer not found.", "TRAINER_NOT_FOUND", 404));
    }

    return res
      .status(200)
      .json(successResponse("Trainer retrieved successfully.", trainer));
  } catch (error: any) {
    console.error("Error fetching trainer by ID:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching trainer.",
        error.message,
        500,
      ),
    );
  }
};

/**
 * 5. Update Trainer (`PUT /api/trainers/:id`)
 */
export const updateTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      designation,
      bio,
      about,
      photo,
      coverImage,
      experienceYears,
      specializations,
      certifications,
      achievements,
      education,
      languages,
      facebook,
      instagram,
      linkedin,
      youtube,
      branchId,
      branchName,
      city,
      availability,
      featured,
      status,
      rating,
      totalReviews,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return res
        .status(400)
        .json(errorResponse("Invalid trainer ID.", "INVALID_ID", 400));
    }

    const existingTrainer = await Trainer.findById(id);

    if (!existingTrainer) {
      return res
        .status(404)
        .json(errorResponse("Trainer not found.", "TRAINER_NOT_FOUND", 404));
    }

    // Validate numeric ranges
    const numericError =
      validateNumericRange("Experience years", experienceYears, 0) ||
      validateNumericRange("Rating", rating, 0, 5) ||
      validateNumericRange("Total reviews", totalReviews, 0);

    if (numericError) {
      return res
        .status(400)
        .json(errorResponse(numericError, "VALIDATION_ERROR", 400));
    }

    // Validate status enum
    if (status !== undefined && status !== null && !isValidStatus(status)) {
      return res.status(400).json(
        errorResponse(
          `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`,
          "VALIDATION_ERROR",
          400,
        ),
      );
    }

    // If name changes and slug isn't manually provided, regenerate slug
    if (name && name !== existingTrainer.name) {
      const newSlug =
        slug && String(slug).trim()
          ? String(slug).trim().toLowerCase()
          : generateSlug(String(name));

      // Prevent duplicate slug (excluding current trainer)
      const duplicate = await Trainer.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json(
          errorResponse(
            `A trainer with slug "${newSlug}" already exists.`,
            "DUPLICATE_SLUG",
            400,
          ),
        );
      }

      existingTrainer.slug = newSlug;
    } else if (slug && String(slug).trim()) {
      // Slug was manually provided
      const finalSlug = String(slug).trim().toLowerCase();

      // Prevent duplicate slug (excluding current trainer)
      const duplicate = await Trainer.findOne({
        slug: finalSlug,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json(
          errorResponse(
            `A trainer with slug "${finalSlug}" already exists.`,
            "DUPLICATE_SLUG",
            400,
          ),
        );
      }

      existingTrainer.slug = finalSlug;
    }

    // Apply other field updates
    if (name !== undefined) existingTrainer.name = String(name).trim();
    if (designation !== undefined)
      existingTrainer.designation = String(designation).trim();
    if (bio !== undefined) existingTrainer.bio = String(bio).trim();
    if (about !== undefined) existingTrainer.about = String(about).trim();
    if (photo !== undefined) existingTrainer.photo = String(photo).trim();
    if (coverImage !== undefined)
      existingTrainer.coverImage = coverImage?.trim() || "";
    if (experienceYears !== undefined)
      existingTrainer.experienceYears = experienceYears;
    if (specializations !== undefined)
      existingTrainer.specializations = specializations;
    if (certifications !== undefined)
      existingTrainer.certifications = certifications;
    if (achievements !== undefined) existingTrainer.achievements = achievements;
    if (education !== undefined) existingTrainer.education = education;
    if (languages !== undefined) existingTrainer.languages = languages;
    if (facebook !== undefined)
      existingTrainer.facebook = facebook?.trim() || "";
    if (instagram !== undefined)
      existingTrainer.instagram = instagram?.trim() || "";
    if (linkedin !== undefined)
      existingTrainer.linkedin = linkedin?.trim() || "";
    if (youtube !== undefined) existingTrainer.youtube = youtube?.trim() || "";
    if (branchId !== undefined)
      existingTrainer.branchId = branchId
        ? new mongoose.Types.ObjectId(String(branchId))
        : undefined;
    if (branchName !== undefined)
      existingTrainer.branchName = branchName?.trim() || "";
    if (city !== undefined) existingTrainer.city = city?.trim() || "";
    if (availability !== undefined) existingTrainer.availability = availability;
    if (featured !== undefined) existingTrainer.featured = featured;
    if (status !== undefined) existingTrainer.status = status;
    if (rating !== undefined) existingTrainer.rating = Number(rating);
    if (totalReviews !== undefined)
      existingTrainer.totalReviews = Number(totalReviews);

    const updatedTrainer = await existingTrainer.save();

    return res
      .status(200)
      .json(
        successResponse("Trainer updated successfully.", updatedTrainer),
      );
  } catch (error: any) {
    console.error("Error updating trainer:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while updating trainer.",
        error.message,
        500,
      ),
    );
  }
};

/**
 * 6. Delete Trainer (`DELETE /api/trainers/:id`)
 * Soft delete: set status = "inactive".
 */
export const deleteTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return res
        .status(400)
        .json(errorResponse("Invalid trainer ID.", "INVALID_ID", 400));
    }

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res
        .status(404)
        .json(errorResponse("Trainer not found.", "TRAINER_NOT_FOUND", 404));
    }

    trainer.status = "inactive";
    await trainer.save();

    return res
      .status(200)
      .json(successResponse("Trainer deleted successfully.", { _id: id }));
  } catch (error: any) {
    console.error("Error deleting trainer:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while deleting trainer.",
        error.message,
        500,
      ),
    );
  }
};

export default {
  createTrainer,
  getAllTrainers,
  getTrainerBySlug,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
};
