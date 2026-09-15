import { Request, Response } from "express";
import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.model";
import { EXERCISE_DATABASE } from "../data/exercise.data";
import { successResponse, errorResponse } from "../utils/apiResponse";

// GET /api/exercises
export const getExercises = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, muscleGroup, equipment, difficulty, search } = req.query;

    const filter: Record<string, unknown> = {};

    // Category filter
    if (category && typeof category === "string" && category.toUpperCase() !== "ALL") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Muscle group filter
    if (muscleGroup && typeof muscleGroup === "string") {
      filter.muscle = { $regex: new RegExp(muscleGroup, "i") };
    }

    // Equipment filter
    if (equipment && typeof equipment === "string") {
      filter.equipment = { $regex: new RegExp(equipment, "i") };
    }

    // Difficulty filter
    if (difficulty && typeof difficulty === "string") {
      filter.difficulty = difficulty.toUpperCase();
    }

    // Search filter
    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { muscle: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    let exercises: any[] = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        exercises = await Exercise.find(filter).sort({ id: 1, createdAt: -1 });
      } catch (dbErr) {
        console.warn("[Exercise Controller] DB query failed, falling back to local dataset:", dbErr);
      }
    }

    // If MongoDB collection is empty or DB offline, fallback gracefully to EXERCISE_DATABASE
    if (!exercises || exercises.length === 0) {
      let localExercises = [...EXERCISE_DATABASE];

      if (category && typeof category === "string" && category.toUpperCase() !== "ALL") {
        const catUpper = category.toUpperCase();
        localExercises = localExercises.filter(
          (e) => e.category?.toUpperCase() === catUpper
        );
      }

      if (muscleGroup && typeof muscleGroup === "string") {
        const mgLower = muscleGroup.toLowerCase();
        localExercises = localExercises.filter((e) =>
          e.muscle?.toLowerCase().includes(mgLower)
        );
      }

      if (equipment && typeof equipment === "string") {
        const eqLower = equipment.toLowerCase();
        localExercises = localExercises.filter((e) =>
          e.equipment?.toLowerCase().includes(eqLower)
        );
      }

      if (difficulty && typeof difficulty === "string") {
        const diffUpper = difficulty.toUpperCase();
        localExercises = localExercises.filter(
          (e) => e.difficulty?.toUpperCase() === diffUpper
        );
      }

      if (search && typeof search === "string" && search.trim() !== "") {
        const q = search.trim().toLowerCase();
        localExercises = localExercises.filter(
          (e) =>
            e.name?.toLowerCase().includes(q) ||
            e.muscle?.toLowerCase().includes(q) ||
            e.category?.toLowerCase().includes(q) ||
            e.description?.toLowerCase().includes(q)
        );
      }

      exercises = localExercises;
    }

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

    let exercise: any = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          exercise = await Exercise.findById(id);
        }
        if (!exercise && !isNaN(Number(id))) {
          exercise = await Exercise.findOne({ id: Number(id) });
        }
        if (!exercise) {
          exercise = await Exercise.findOne({
            name: { $regex: new RegExp(`^${id}$`, "i") },
          });
        }
      } catch (dbErr) {
        console.warn("[Exercise Controller] DB query error:", dbErr);
      }
    }

    if (!exercise) {
      // Check local dataset fallback
      exercise = EXERCISE_DATABASE.find(
        (e) =>
          String(e.id) === String(id) ||
          e.name.toLowerCase() === id.toLowerCase()
      );
    }

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