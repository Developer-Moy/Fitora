import { Request, Response } from "express";
import { Exercise } from "../models/Exercise.model";

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
      filter.$or = [
        { primaryMuscles: muscleGroup },
        { secondaryMuscles: muscleGroup },
      ];
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

    res.status(200).json({
      success: true,
      message: "Exercises fetched successfully",
      data: exercises,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get exercises error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 500,
    });
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
      res.status(404).json({
        success: false,
        message: "Exercise not found",
        error: "EXERCISE_NOT_FOUND",
        statusCode: 404,
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Exercise fetched successfully",
      data: exercise,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get exercise by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise",
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 500,
    });
  }
};