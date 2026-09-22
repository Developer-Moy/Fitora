import { Request, Response } from "express";
import { Exercise } from "../models/Exercise.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

// GET /api/exercises
export const getExercises = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { muscleGroup, equipment, difficulty } = req.query;

    const filter: Record<string, unknown> = {};

    // Muscle group filter
    if (muscleGroup) {
      filter.muscle = muscleGroup;
    }

    // Equipment filter
    if (equipment) {
      filter.equipment = equipment;
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const exercises = await Exercise.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(
      successResponse("Exercises fetched successfully", exercises)
    );
  } catch (error) {
    console.error("Get exercises error:", error);

    res.status(500).json(
      errorResponse(
        "Failed to fetch exercises",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};

// GET /api/exercises/:id
export const getExerciseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findOne({id});

    if (!exercise) {
      res.status(404).json(
        errorResponse("Exercise not found", "EXERCISE_NOT_FOUND", 404)
      );

      return;
    }

    res.status(200).json(
      successResponse("Exercise fetched successfully", exercise)
    );
  } catch (error) {
    console.error("Get exercise by ID error:", error);

    res.status(500).json(
      errorResponse(
        "Failed to fetch exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};

/**
 * Create Exercise Controller
 * - Implement POST logic to save a new exercise.
 * - Generate unique numeric `id` dynamically.
 * - Check for duplicates by name.
 */
export const createExercise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      category,
      difficulty,
      duration,
      equipment,
      muscle,
      description,
      tips,
      videoId,
      image,
    } = req.body;

    // Validate required fields
    if (!name || !category || !difficulty || !duration || !equipment || !muscle || !description || !videoId || !image) {
      res.status(400).json(errorResponse("All required fields must be provided", "MISSING_FIELDS", 400));
      return;
    }

    // Check for duplicate by name (case-insensitive)
    const existingExercise = await Exercise.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingExercise) {
      res.status(409).json(errorResponse("An exercise with this name already exists", "DUPLICATE_NAME", 409));
      return;
    }

    // Generate unique numeric ID
    const lastExercise = await Exercise.findOne().sort({ id: -1 });
    const newId = lastExercise ? lastExercise.id + 1 : 1;

    // Create the exercise
    const newExercise = new Exercise({
      id: newId,
      name,
      category,
      difficulty,
      duration,
      equipment,
      muscle,
      description,
      tips: Array.isArray(tips) ? tips : [],
      videoId,
      image,
    });

    await newExercise.save();

    res.status(201).json(successResponse("Exercise created successfully", newExercise));
  } catch (error) {
    console.error("Create exercise error:", error);
    res.status(500).json(
      errorResponse(
        "Failed to create exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};