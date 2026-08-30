import { Request, Response } from "express";
import mongoose from "mongoose";
import { WorkoutLog, IWorkoutLog } from "../models/WorkoutLog.model.js";
import { LOCAL_WORKOUTS_DATABASE, WorkoutExercise } from "../data/workout.data.js";

// In-memory fallback storage for offline development
interface LocalLogItem {
  _id: string;
  userId: string;
  exerciseName: string;
  setsCount: number;
  repsCount: number;
  weight: number;
  durationMinutes: number;
  caloriesBurned: number;
  notes: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Initial sample logs for realistic local database experience
const inMemoryWorkoutLogs: LocalLogItem[] = [
  {
    _id: "log-seed-01",
    userId: "guest_user",
    exerciseName: "Barbell Bench Press",
    setsCount: 4,
    repsCount: 10,
    weight: 75,
    durationMinutes: 20,
    caloriesBurned: 120,
    notes: "Felt strong on the last set, hit all 10 reps cleanly.",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    _id: "log-seed-02",
    userId: "guest_user",
    exerciseName: "Barbell Back Squat",
    setsCount: 4,
    repsCount: 8,
    weight: 100,
    durationMinutes: 25,
    caloriesBurned: 150,
    notes: "Deep squats, good mobility and core stability.",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

/**
 * GET /api/workouts
 * Retrieve list of workout exercises from local catalog database
 */
export const getWorkouts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category, difficulty, equipment, search, limit, page } = req.query;

    let results: WorkoutExercise[] = [...LOCAL_WORKOUTS_DATABASE];

    // Filter by category / muscle group
    if (category && typeof category === "string") {
      const catLower = category.toLowerCase();
      results = results.filter(
        (w) => w.category.toLowerCase() === catLower || w.muscleGroup.toLowerCase().includes(catLower)
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
          w.targetMuscles.some((m) => m.toLowerCase().includes(query))
      );
    }

    const total = results.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || total;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      count: paginatedResults.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: paginatedResults,
    });
  } catch (error) {
    console.error("[Workout Controller] getWorkouts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workouts",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/**
 * GET /api/workouts/:id
 * Retrieve a specific workout by ID
 */
export const getWorkoutById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const workout = LOCAL_WORKOUTS_DATABASE.find((w) => w.id === id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: `Workout with ID '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    console.error("[Workout Controller] getWorkoutById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workout details",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/**
 * GET /api/workouts/log
 * Retrieve workout logs and summary metrics
 */
export const getWorkoutLogs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, limit } = req.query;
    const authUser = (req as any).user;
    const targetUserId = (userId as string) || authUser?.userId || "guest_user";

    let logs: any[] = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const query: any = {};
        if (targetUserId && targetUserId !== "all") {
          query.$or = [{ userId: targetUserId }, { userId: "guest_user" }];
        }
        logs = await WorkoutLog.find(query).sort({ createdAt: -1 }).limit(parseInt(limit as string, 10) || 100);
      } catch (dbErr) {
        console.warn("[Workout Controller] MongoDB query failed, using in-memory store:", dbErr);
        logs = inMemoryWorkoutLogs;
      }
    }

    // If no DB logs found or DB is offline, fall back to in-memory logs
    if (!logs || logs.length === 0) {
      logs = inMemoryWorkoutLogs;
      if (targetUserId && targetUserId !== "all" && targetUserId !== "guest_user") {
        logs = logs.filter((l) => l.userId === targetUserId || l.userId === "guest_user");
      }
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
      }
    );

    return res.status(200).json({
      success: true,
      count: logs.length,
      summary,
      data: logs,
    });
  } catch (error) {
    console.error("[Workout Controller] getWorkoutLogs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve workout logs",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/**
 * POST /api/workouts/log
 * Log a new workout entry
 */
export const createWorkoutLog = async (req: Request, res: Response): Promise<Response> => {
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
    if (!exerciseName || typeof exerciseName !== "string" || exerciseName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "exerciseName is required and must be a non-empty string",
      });
    }

    const sets = Number(setsCount);
    if (isNaN(sets) || sets <= 0) {
      return res.status(400).json({
        success: false,
        message: "setsCount must be a positive number",
      });
    }

    const reps = Number(repsCount);
    if (isNaN(reps) || reps <= 0) {
      return res.status(400).json({
        success: false,
        message: "repsCount must be a positive number",
      });
    }

    const authUser = (req as any).user;
    const finalUserId = userId || authUser?.userId || "guest_user";
    const logDate = date ? new Date(date) : new Date();

    // Auto-calculate estimated calories if not provided
    let finalCalories = Number(caloriesBurned) || 0;
    if (!finalCalories) {
      const matchedCatalog = LOCAL_WORKOUTS_DATABASE.find(
        (w) => w.name.toLowerCase() === exerciseName.trim().toLowerCase()
      );
      if (matchedCatalog) {
        finalCalories = Math.round((matchedCatalog.estimatedCaloriesBurn / (matchedCatalog.targetSets || 3)) * sets);
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

    let createdLog: any = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        createdLog = await WorkoutLog.create(logPayload);
      } catch (dbErr) {
        console.warn("[Workout Controller] DB save failed, saving to local in-memory store:", dbErr);
      }
    }

    // In-memory fallback item creation
    const localItem: LocalLogItem = {
      _id: createdLog ? createdLog._id.toString() : `log-${Date.now()}`,
      userId: finalUserId,
      exerciseName: logPayload.exerciseName,
      setsCount: logPayload.setsCount,
      repsCount: logPayload.repsCount,
      weight: logPayload.weight,
      durationMinutes: logPayload.durationMinutes,
      caloriesBurned: logPayload.caloriesBurned,
      notes: logPayload.notes,
      date: logPayload.date,
      createdAt: createdLog?.createdAt || new Date(),
      updatedAt: createdLog?.updatedAt || new Date(),
    };

    inMemoryWorkoutLogs.unshift(localItem);

    return res.status(201).json({
      success: true,
      message: "Workout logged successfully",
      data: createdLog || localItem,
    });
  } catch (error) {
    console.error("[Workout Controller] createWorkoutLog Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create workout log",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/**
 * DELETE /api/workouts/log/:id
 * Delete a specific workout log entry
 */
export const deleteWorkoutLog = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await WorkoutLog.findByIdAndDelete(id);
        }
      } catch (dbErr) {
        console.warn("[Workout Controller] DB delete failed:", dbErr);
      }
    }

    // Remove from in-memory fallback
    const index = inMemoryWorkoutLogs.findIndex((l) => l._id === id);
    if (index !== -1) {
      inMemoryWorkoutLogs.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: "Workout log deleted successfully",
    });
  } catch (error) {
    console.error("[Workout Controller] deleteWorkoutLog Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete workout log",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
