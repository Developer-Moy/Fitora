import { Request, Response } from "express";
import mongoose from "mongoose";
import { StopwatchPreset } from "../models/StopwatchPreset.model";
import { StopwatchSession } from "../models/StopwatchSession.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * GET /api/stopwatch/presets
 * Public endpoint - Returns all public stopwatch presets
 */
export const getPresets = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const presets = await StopwatchPreset.find({ isPublic: true })
      .select("-userId -__v -isPublic")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: presets.length,
      data: presets,
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

/**
 * POST /api/stopwatch/custom-preset
 * Authenticated endpoint - Create a custom workout preset
 */
export const createCustomPreset = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to create custom preset",
      });
    }

    const {
      name,
      workDuration,
      restDuration,
      warmupDuration,
      cooldownDuration,
      rounds,
    } = req.body;

    // Validate name
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "name must be a non-empty string",
      });
    }

    // Validate workDuration
    if (workDuration === undefined || workDuration === null) {
      return res.status(400).json({
        success: false,
        message: "workDuration is required",
      });
    }

    if (typeof workDuration !== "number" || workDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: "workDuration must be a positive number",
      });
    }

    if (workDuration > 3600) {
      return res.status(400).json({
        success: false,
        message: "workDuration must not exceed 3600 seconds",
      });
    }

    // Validate restDuration
    if (restDuration === undefined || restDuration === null) {
      return res.status(400).json({
        success: false,
        message: "restDuration is required",
      });
    }

    if (typeof restDuration !== "number" || restDuration < 0) {
      return res.status(400).json({
        success: false,
        message: "restDuration must be a non-negative number",
      });
    }

    if (restDuration > 3600) {
      return res.status(400).json({
        success: false,
        message: "restDuration must not exceed 3600 seconds",
      });
    }

    // Validate warmupDuration
    const warmup = warmupDuration !== undefined ? warmupDuration : 0;
    if (typeof warmup !== "number" || warmup < 0) {
      return res.status(400).json({
        success: false,
        message: "warmupDuration must be a non-negative number",
      });
    }

    if (warmup > 3600) {
      return res.status(400).json({
        success: false,
        message: "warmupDuration must not exceed 3600 seconds",
      });
    }

    // Validate cooldownDuration
    const cooldown = cooldownDuration !== undefined ? cooldownDuration : 0;
    if (typeof cooldown !== "number" || cooldown < 0) {
      return res.status(400).json({
        success: false,
        message: "cooldownDuration must be a non-negative number",
      });
    }

    if (cooldown > 3600) {
      return res.status(400).json({
        success: false,
        message: "cooldownDuration must not exceed 3600 seconds",
      });
    }

    // Validate rounds
    if (rounds === undefined || rounds === null) {
      return res.status(400).json({
        success: false,
        message: "rounds is required",
      });
    }

    if (
      typeof rounds !== "number" ||
      !Number.isInteger(rounds) ||
      rounds <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "rounds must be a positive integer",
      });
    }

    if (rounds > 100) {
      return res.status(400).json({
        success: false,
        message: "rounds must not exceed 100",
      });
    }

    const newPreset = await StopwatchPreset.create({
      userId: req.user.userId,
      name: name.trim(),
      workDuration,
      restDuration,
      rounds,
      warmupDuration: warmup,
      cooldownDuration: cooldown,
      type: "Custom",
      isPublic: false,
    });

    return res.status(201).json({
      success: true,
      message: "Custom preset created successfully",
      data: {
        _id: newPreset._id,
        userId: newPreset.userId,
        name: newPreset.name,
        workDuration: newPreset.workDuration,
        restDuration: newPreset.restDuration,
        rounds: newPreset.rounds,
        warmupDuration: newPreset.warmupDuration,
        cooldownDuration: newPreset.cooldownDuration,
        createdAt: newPreset.createdAt,
        updatedAt: newPreset.updatedAt,
      },
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

/**
 * GET /api/stopwatch/user-presets
 * Authenticated endpoint - Get user's custom presets
 * Users can only retrieve their own presets
 */
export const getUserPresets = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to fetch user presets",
      });
    }

    // Only fetch presets belonging to the authenticated user
    const userPresets = await StopwatchPreset.find({
      userId: req.user.userId,
      isPublic: false,
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "User presets retrieved successfully",
      data: userPresets,
      timestamp: new Date().toISOString(),
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

/**
 * POST /api/stopwatch/session-complete
 * Authenticated endpoint - Mark a workout session as complete
 */
export const markSessionComplete = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to save session",
      });
    }

    const { presetId, workoutType, durationMinutes, weightKg, caloriesBurned } =
      req.body;

    // Validate required field: durationMinutes
    if (durationMinutes === undefined || durationMinutes === null) {
      return res.status(400).json({
        success: false,
        message: "durationMinutes is required",
      });
    }

    if (typeof durationMinutes !== "number" || durationMinutes <= 0) {
      return res.status(400).json({
        success: false,
        message: "durationMinutes must be a positive number",
      });
    }

    if (durationMinutes > 1440) {
      return res.status(400).json({
        success: false,
        message: "durationMinutes must not exceed 1440 (24 hours)",
      });
    }

    // Validate optional field: presetId
    if (presetId !== undefined && presetId !== null) {
      if (typeof presetId !== "string" || presetId.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "presetId must be a non-empty string",
        });
      }
    }

    // Validate optional field: workoutType
    if (workoutType !== undefined && workoutType !== null) {
      if (typeof workoutType !== "string" || workoutType.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "workoutType must be a non-empty string",
        });
      }
    }

    // Validate optional field: weightKg
    if (weightKg !== undefined && weightKg !== null) {
      if (typeof weightKg !== "number" || weightKg <= 0) {
        return res.status(400).json({
          success: false,
          message: "weightKg must be a positive number",
        });
      }

      if (weightKg > 500) {
        return res.status(400).json({
          success: false,
          message: "weightKg must not exceed 500",
        });
      }
    }

    // Validate optional field: caloriesBurned
    if (caloriesBurned !== undefined && caloriesBurned !== null) {
      if (typeof caloriesBurned !== "number" || caloriesBurned < 0) {
        return res.status(400).json({
          success: false,
          message: "caloriesBurned must be a non-negative number",
        });
      }

      if (caloriesBurned > 10000) {
        return res.status(400).json({
          success: false,
          message: "caloriesBurned must not exceed 10000",
        });
      }
    }

    const session = await StopwatchSession.create({
      userId: req.user.userId,
      presetId: presetId?.trim(),
      workoutType: workoutType?.trim(),
      durationMinutes,
      weightKg,
      caloriesBurned,
    });

    return res.status(201).json({
      success: true,
      message: "Session marked as complete",
      data: session,
      timestamp: new Date().toISOString(),
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

/**
 * GET /api/stopwatch/recent-sessions
 * Authenticated endpoint - Get user's recent workout sessions
 */
export const getRecentSessions = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to fetch sessions",
      });
    }

    const limit = parseInt(req.query.limit as string, 10) || 10;

    const sessions = await StopwatchSession.find({
      userId: req.user.userId,
    })
      .sort({ startedAt: -1 })
      .limit(limit)
      .populate("presetId", "name description");

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
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
