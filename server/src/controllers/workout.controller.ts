import { Request, Response } from "express";
import mongoose from "mongoose";
import { WorkoutLog, IWorkoutLog } from "../models/WorkoutLog.model.js";
import {
  LOCAL_WORKOUTS_DATABASE,
  WorkoutExercise,
} from "../data/workout.data.js";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * GET /api/workouts
 * Retrieve list of workout exercises from local catalog database
 */
export const getWorkouts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { category, difficulty, equipment, search, limit, page } = req.query;

    let results: WorkoutExercise[] = [...LOCAL_WORKOUTS_DATABASE];

    // Filter by category / muscle group
    if (category && typeof category === "string") {
      const catLower = category.toLowerCase();
      results = results.filter(
        (w) =>
          w.category.toLowerCase() === catLower ||
          w.muscleGroup.toLowerCase().includes(catLower),
      );
    }

    // Filter by difficulty
    if (difficulty && typeof difficulty === "string") {
      const diffLower = difficulty.toLowerCase();
      results = results.filter((w) => w.difficulty.toLowerCase() === diffLower);
    }

    // Filter by equipment
    if (equipment && typeof equipment === "string") {
      const eqLower = equipment.toLowerCase();
      results = results.filter((w) => w.equipment.toLowerCase() === eqLower);
    }

    // Search by name, target muscles, or instructions
    if (search && typeof search === "string") {
      const query = search.toLowerCase();
      results = results.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.muscleGroup.toLowerCase().includes(query) ||
          w.targetMuscles.some((m) => m.toLowerCase().includes(query)),
      );
    }

    const total = results.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || total;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    return res.status(200).json(
      successResponse("Workouts retrieved successfully", {
        items: paginatedResults,
        count: paginatedResults.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      }),
    );
  } catch (error) {
    console.error("[Workout Controller] getWorkouts Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch workouts",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * GET /api/workouts/:id
 * Retrieve a specific workout by ID
 */
export const getWorkoutById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;
    const workout = LOCAL_WORKOUTS_DATABASE.find((w) => w.id === id);

    if (!workout) {
      return res
        .status(404)
        .json(
          errorResponse(
            `Workout with ID '${id}' not found`,
            "WORKOUT_NOT_FOUND",
            404,
          ),
        );
    }

    return res
      .status(200)
      .json(successResponse("Workout retrieved successfully", workout));
  } catch (error) {
    console.error("[Workout Controller] getWorkoutById Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch workout details",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * GET /api/workouts/log
 * Retrieve workout logs and summary metrics
 */
export const getWorkoutLogs = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userId, limit } = req.query;
    const authUser = (req as any).user;
    const targetUserId =
      (userId as string) || authUser?.userId || authUser?.id || "guest_user";

    let logs: any[] = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const query: any = {};
        if (targetUserId && targetUserId !== "all") {
          const conditions: any[] = [
            { userId: targetUserId },
            { userId: "guest_user" },
          ];
          if (mongoose.Types.ObjectId.isValid(targetUserId)) {
            conditions.push({
              userId: new mongoose.Types.ObjectId(targetUserId),
            });
          }
          query.$or = conditions;
        }
        logs = await WorkoutLog.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit as string, 10) || 100);
      } catch (dbErr) {
        console.error(
          "[Workout Controller] MongoDB query failed:",
          dbErr,
        );
        return res.status(500).json(
          errorResponse(
            "Failed to retrieve workout logs",
            dbErr instanceof Error ? dbErr.message : "Internal Server Error",
            500,
          ),
        );
      }
    }

    // If no DB logs found, return empty array instead of dummy seed data
    if (!logs || logs.length === 0) {
      logs = [];
    }

    // Compute workout summary stats
    const summary = logs.reduce(
      (acc, log) => {
        acc.totalWorkouts += 1;
        acc.totalSets += Number(log.setsCount) || 0;
        acc.totalReps += Number(log.repsCount) || 0;
        acc.totalCaloriesBurned += Number(log.caloriesBurned) || 0;
        acc.totalDurationMinutes += Number(log.durationMinutes) || 0;
        return acc;
      },
      {
        totalWorkouts: 0,
        totalSets: 0,
        totalReps: 0,
        totalCaloriesBurned: 0,
        totalDurationMinutes: 0,
      },
    );

    return res.status(200).json(
      successResponse("Workout logs retrieved successfully", {
        logs,
        count: logs.length,
        summary,
      }),
    );
  } catch (error) {
    console.error("[Workout Controller] getWorkoutLogs Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve workout logs",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * POST /api/workouts/log
 * Log a new workout entry
 */
export const createWorkoutLog = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      exerciseName,
      setsCount,
      repsCount,
      weight,
      durationMinutes,
      caloriesBurned,
      notes,
      date,
      userId,
    } = req.body;

    // Validation
    if (
      !exerciseName ||
      typeof exerciseName !== "string" ||
      exerciseName.trim() === ""
    ) {
      return res
        .status(400)
        .json(
          errorResponse(
            "exerciseName is required and must be a non-empty string",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    const sets = Number(setsCount);
    if (isNaN(sets) || sets <= 0) {
      return res
        .status(400)
        .json(
          errorResponse(
            "setsCount must be a positive number",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    const reps = Number(repsCount);
    if (isNaN(reps) || reps <= 0) {
      return res
        .status(400)
        .json(
          errorResponse(
            "repsCount must be a positive number",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    const authUser = (req as any).user;
    const finalUserId =
      userId || authUser?.userId || authUser?.id || "guest_user";
    const logDate = date ? new Date(date) : new Date();

    // Auto-calculate estimated calories if not provided
    let finalCalories = Number(caloriesBurned) || 0;
    if (!finalCalories) {
      const matchedCatalog = LOCAL_WORKOUTS_DATABASE.find(
        (w) => w.name.toLowerCase() === exerciseName.trim().toLowerCase(),
      );
      if (matchedCatalog) {
        finalCalories = Math.round(
          (matchedCatalog.estimatedCaloriesBurn /
            (matchedCatalog.targetSets || 3)) *
            sets,
        );
      } else {
        finalCalories = Math.round(sets * reps * 2.5);
      }
    }

    const logPayload = {
      userId: finalUserId,
      exerciseName: exerciseName.trim(),
      setsCount: sets,
      repsCount: reps,
      weight: Number(weight) || 0,
      durationMinutes: Number(durationMinutes) || 0,
      caloriesBurned: finalCalories,
      notes: notes ? String(notes).trim() : "",
      date: logDate,
    };

    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      return res.status(503).json(
        errorResponse("Database unavailable — please try again later", "SERVICE_UNAVAILABLE", 503)
      );
    }

    let createdLog: any = null;
    try {
      createdLog = await WorkoutLog.create(logPayload);
    } catch (dbErr) {
      console.error("[Workout Controller] DB save failed:", dbErr);
      return res.status(500).json(
        errorResponse("Failed to save workout log", dbErr instanceof Error ? dbErr.message : "Internal Server Error", 500)
      );
    }

    return res
      .status(201)
      .json(
        successResponse("Workout logged successfully", createdLog),
      );
  } catch (error) {
    console.error("[Workout Controller] createWorkoutLog Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to create workout log",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * DELETE /api/workouts/log/:id
 * Delete a specific workout log entry
 */
export const deleteWorkoutLog = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        errorResponse("Invalid workout log ID", "VALIDATION_ERROR", 400)
      );
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      return res.status(503).json(
        errorResponse("Database unavailable — please try again later", "SERVICE_UNAVAILABLE", 503)
      );
    }

    const deleted = await WorkoutLog.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json(
        errorResponse("Workout log not found", "NOT_FOUND", 404)
      );
    }

    return res
      .status(200)
      .json(successResponse("Workout log deleted successfully", {}));
  } catch (error) {
    console.error("[Workout Controller] deleteWorkoutLog Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to delete workout log",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};
