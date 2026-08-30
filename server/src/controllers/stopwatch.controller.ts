import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.model";

// In-memory storage for stopwatch presets and sessions (for offline development)
// In production, these would be stored in MongoDB

interface StopwatchPreset {
  _id: string;
  name: string;
  description?: string;
  defaultDurationSeconds: number;
  defaultRestSeconds?: number;
  exercises: StopwatchExercise[];
}

interface StopwatchExercise {
  _id: string;
  name: string;
  targetDurationSeconds?: number;
  targetRestSeconds?: number;
  sets: number;
  reps?: number;
}

interface StopwatchSession {
  _id: string;
  userId: string;
  presetId: string;
  startedAt: Date;
  stoppedAt?: Date;
  durationSeconds?: number;
  completedExercises: number;
  totalExercises: number;
  caloriesBurned?: number;
  notes?: string;
}

const inMemoryPresets: StopwatchPreset[] = [
  {
    _id: "preset-01",
    name: "HIIT Interval",
    description: "High-intensity interval training with work/rest cycles",
    defaultDurationSeconds: 20,
    defaultRestSeconds: 10,
    exercises: [
      { _id: "ex-01", name: "Jumping Jacks", targetDurationSeconds: 30, targetRestSeconds: 15, sets: 3, reps: 20 },
      { _id: "ex-02", name: "Burpees", targetDurationSeconds: 30, targetRestSeconds: 15, sets: 3, reps: 10 },
      { _id: "ex-03", name: "Mountain Climbers", targetDurationSeconds: 30, targetRestSeconds: 15, sets: 3, reps: 20 },
    ],
  },
  {
    _id: "preset-02",
    name: "Strength Circuit",
    description: "Progressive strength training circuit",
    defaultDurationSeconds: 45,
    defaultRestSeconds: 60,
    exercises: [
      { _id: "ex-04", name: "Push-ups", targetDurationSeconds: 45, targetRestSeconds: 60, sets: 3, reps: 15 },
      { _id: "ex-05", name: "Squats", targetDurationSeconds: 45, targetRestSeconds: 60, sets: 3, reps: 20 },
      { _id: "ex-06", name: "Lunges", targetDurationSeconds: 45, targetRestSeconds: 60, sets: 3, reps: 12 },
    ],
  },
];

const inMemorySessions: StopwatchSession[] = [];

export const getPresets = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json({
      success: true,
      count: inMemoryPresets.length,
      data: inMemoryPresets,
    });
  } catch (error) {
    console.error("[Stopwatch Controller] getPresets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch presets",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const createCustomPreset = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description, defaultDurationSeconds, defaultRestSeconds, exercises } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Preset name is required and must be a non-empty string",
      });
    }

    const newPreset: StopwatchPreset = {
      _id: `preset-${Date.now()}`,
      name: name.trim(),
      description: description || "",
      defaultDurationSeconds: defaultDurationSeconds || 0,
      defaultRestSeconds: defaultRestSeconds || 0,
      exercises: exercises || [],
    };

    inMemoryPresets.unshift(newPreset);

    return res.status(201).json({
      success: true,
      message: "Custom preset created successfully",
      data: newPreset,
    });
  } catch (error) {
    console.error("[Stopwatch Controller] createCustomPreset Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create custom preset",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getUserPresets = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.query;
    
    // Filter presets by userId if provided
    let userPresets = inMemoryPresets;
    if (userId && typeof userId === "string") {
      userPresets = inMemoryPresets.filter((p) => p.exercises.length > 0); // Simple filter
    }

    return res.status(200).json({
      success: true,
      count: userPresets.length,
      data: userPresets,
    });
  } catch (error) {
    console.error("[Stopwatch Controller] getUserPresets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user presets",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const markSessionComplete = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sessionId, durationSeconds, caloriesBurned, notes } = req.body;
    const authUser = (req as any).user;
    const userId = authUser?.userId || "guest_user";

    if (sessionId) {
      // Find and update existing session
      const sessionIndex = inMemorySessions.findIndex((s) => s._id === sessionId && s.userId === userId);
      if (sessionIndex !== -1) {
        inMemorySessions[sessionIndex].stoppedAt = new Date();
        inMemorySessions[sessionIndex].durationSeconds = durationSeconds;
        inMemorySessions[sessionIndex].caloriesBurned = caloriesBurned;
        inMemorySessions[sessionIndex].notes = notes;
      }
    } else {
      // Create new completed session
      const newSession: StopwatchSession = {
        _id: `session-${Date.now()}`,
        userId,
        presetId: req.body.presetId || "",
        startedAt: new Date(Date.now() - (durationSeconds || 0) * 1000),
        stoppedAt: new Date(),
        durationSeconds: durationSeconds,
        completedExercises: req.body.completedExercises || 0,
        totalExercises: req.body.totalExercises || 0,
        caloriesBurned,
        notes,
      };

      inMemorySessions.push(newSession);
    }

    return res.status(200).json({
      success: true,
      message: "Session marked as complete",
    });
  } catch (error) {
    console.error("[Stopwatch Controller] markSessionComplete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark session complete",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getRecentSessions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit } = req.query;
    const authUser = (req as any).user;
    const userId = authUser?.userId || "guest_user";

    let sessions = inMemorySessions.filter((s) => s.userId === userId);
    
    // Sort by startedAt descending (most recent first)
    sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

    const limitNum = parseInt(limit as string, 10) || 10;
    const recentSessions = sessions.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      count: recentSessions.length,
      data: recentSessions,
    });
  } catch (error) {
    console.error("[Stopwatch Controller] getRecentSessions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent sessions",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};