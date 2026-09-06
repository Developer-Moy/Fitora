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