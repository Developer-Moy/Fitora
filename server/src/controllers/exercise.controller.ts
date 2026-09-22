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


export const createExercise = async (
  req: Request,
  res: Response
): Promise<void> => {
  // DEV 1: Add your logic here
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

    // 1. Validate required fields
    if (
      !name ||
      !category ||
      !difficulty ||
      !duration ||
      !equipment ||
      !muscle ||
      !description ||
      !videoId ||
      !image
    ) {
      res.status(400).json(
        errorResponse(
          "All required fields must be provided",
          "VALIDATION_ERROR",
          400
        )
      );

      return;
    }

    // 2. Validate difficulty
    const allowedDifficulties = [
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED",
    ];

    if (!allowedDifficulties.includes(difficulty)) {
      res.status(400).json(
        errorResponse(
          "Invalid difficulty. Use BEGINNER, INTERMEDIATE, or ADVANCED",
          "INVALID_DIFFICULTY",
          400
        )
      );

      return;
    }

    // 3. Check duplicate exercise name
    const existingExercise = await Exercise.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existingExercise) {
      res.status(409).json(
        errorResponse(
          "An exercise with this name already exists",
          "EXERCISE_ALREADY_EXISTS",
          409
        )
      );

      return;
    }

    // 4. Generate next numeric ID
    const lastExercise = await Exercise.findOne()
      .sort({ id: -1 })
      .select("id");

    const nextId = lastExercise ? lastExercise.id + 1 : 1;

    // 5. Prepare tips
    const exerciseTips = Array.isArray(tips)
      ? tips
      : typeof tips === "string" && tips.trim()
      ? [tips.trim()]
      : [];

    // 6. Create exercise
    const exercise = await Exercise.create({
      id: nextId,
      name: name.trim(),
      category: category.trim(),
      difficulty,
      duration: duration.trim(),
      equipment: equipment.trim(),
      muscle: muscle.trim(),
      description: description.trim(),
      tips: exerciseTips,
      videoId: videoId.trim(),
      image: image.trim(),
    });

    // 7. Send response
    res.status(201).json(
      successResponse(
        "Exercise created successfully",
        exercise
      )
    );
  } catch (error) {
    console.error("Create exercise error:", error);

    // Handle MongoDB duplicate key error
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      res.status(409).json(
        errorResponse(
          "Exercise with this ID already exists",
          "DUPLICATE_EXERCISE_ID",
          409
        )
      );

      return;
    }

    res.status(500).json(
      errorResponse(
        "Failed to create exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};