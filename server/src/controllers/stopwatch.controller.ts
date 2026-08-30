import { Request, Response } from "express";
import mongoose from "mongoose";
import { StopwatchPreset } from "../models/StopwatchPreset.model";
import { StopwatchSession } from "../models/StopwatchSession.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { estimateCalories } from "../services/calorieEstimation.service";
import { successResponse, errorResponse } from "../utils/apiResponse";

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

    return res.status(200).json(
      successResponse("Public presets retrieved successfully", presets)
    );
  } catch (error) {
    console.error("[Stopwatch Controller] getPresets Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch presets",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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
      return res.status(401).json(
        errorResponse(
          "Authentication required to create custom preset",
          "Unauthorized",
          401
        )
      );
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
      return res.status(400).json(
        errorResponse("name is required", "Validation Error", 400)
      );
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json(
        errorResponse(
          "name must be a non-empty string",
          "Validation Error",
          400
        )
      );
    }

    // Validate workDuration
    if (workDuration === undefined || workDuration === null) {
      return res.status(400).json(
        errorResponse("workDuration is required", "Validation Error", 400)
      );
    }

    if (typeof workDuration !== "number" || workDuration <= 0) {
      return res.status(400).json(
        errorResponse(
          "workDuration must be a positive number",
          "Validation Error",
          400
        )
      );
    }

    if (workDuration > 3600) {
      return res.status(400).json(
        errorResponse(
          "workDuration must not exceed 3600 seconds",
          "Validation Error",
          400
        )
      );
    }

    // Validate restDuration
    if (restDuration === undefined || restDuration === null) {
      return res.status(400).json(
        errorResponse("restDuration is required", "Validation Error", 400)
      );
    }

    if (typeof restDuration !== "number" || restDuration < 0) {
      return res.status(400).json(
        errorResponse(
          "restDuration must be a non-negative number",
          "Validation Error",
          400
        )
      );
    }

    if (restDuration > 3600) {
      return res.status(400).json(
        errorResponse(
          "restDuration must not exceed 3600 seconds",
          "Validation Error",
          400
        )
      );
    }

    // Validate warmupDuration
    const warmup = warmupDuration !== undefined ? warmupDuration : 0;
    if (typeof warmup !== "number" || warmup < 0) {
      return res.status(400).json(
        errorResponse(
          "warmupDuration must be a non-negative number",
          "Validation Error",
          400
        )
      );
    }

    if (warmup > 3600) {
      return res.status(400).json(
        errorResponse(
          "warmupDuration must not exceed 3600 seconds",
          "Validation Error",
          400
        )
      );
    }

    // Validate cooldownDuration
    const cooldown = cooldownDuration !== undefined ? cooldownDuration : 0;
    if (typeof cooldown !== "number" || cooldown < 0) {
      return res.status(400).json(
        errorResponse(
          "cooldownDuration must be a non-negative number",
          "Validation Error",
          400
        )
      );
    }

    if (cooldown > 3600) {
      return res.status(400).json(
        errorResponse(
          "cooldownDuration must not exceed 3600 seconds",
          "Validation Error",
          400
        )
      );
    }

    // Validate rounds
    if (rounds === undefined || rounds === null) {
      return res.status(400).json(
        errorResponse("rounds is required", "Validation Error", 400)
      );
    }

    if (
      typeof rounds !== "number" ||
      !Number.isInteger(rounds) ||
      rounds <= 0
    ) {
      return res.status(400).json(
        errorResponse(
          "rounds must be a positive integer",
          "Validation Error",
          400
        )
      );
    }

    if (rounds > 100) {
      return res.status(400).json(
        errorResponse(
          "rounds must not exceed 100",
          "Validation Error",
          400
        )
      );
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

    return res.status(201).json(
      successResponse("Custom preset created successfully", {
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
      })
    );
  } catch (error) {
    console.error("[Stopwatch Controller] createCustomPreset Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to create custom preset",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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
      return res.status(401).json(
        errorResponse("Authentication required to fetch user presets", "UNAUTHORIZED", 401)
      );
    }

    // Only fetch presets belonging to the authenticated user
    const userPresets = await StopwatchPreset.find({
      userId: req.user.userId,
      isPublic: false,
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(
      successResponse("User presets retrieved successfully", userPresets)
    );
  } catch (error) {
    console.error("[Stopwatch Controller] getUserPresets Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch user presets",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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
      return res.status(401).json(
        errorResponse("Authentication required to save session", "UNAUTHORIZED", 401)
      );
    }

    const { presetId, workoutType, durationMinutes, weightKg, caloriesBurned } =
      req.body;

    // Validate required field: durationMinutes
    if (durationMinutes === undefined || durationMinutes === null) {
      return res.status(400).json(
        errorResponse("durationMinutes is required", "VALIDATION_ERROR", 400)
      );
    }

    if (typeof durationMinutes !== "number" || durationMinutes <= 0) {
      return res.status(400).json(
        errorResponse("durationMinutes must be a positive number", "VALIDATION_ERROR", 400)
      );
    }

    if (durationMinutes > 1440) {
      return res.status(400).json(
        errorResponse("durationMinutes must not exceed 1440 (24 hours)", "VALIDATION_ERROR", 400)
      );
    }

    if (presetId !== undefined && presetId !== null) {
      if (typeof presetId !== "string" || presetId.trim() === "") {
        return res.status(400).json(
          errorResponse("presetId must be a non-empty string", "VALIDATION_ERROR", 400)
        );
      }
    }

    if (workoutType !== undefined && workoutType !== null) {
      if (typeof workoutType !== "string" || workoutType.trim() === "") {
        return res.status(400).json(
          errorResponse("workoutType must be a non-empty string", "VALIDATION_ERROR", 400)
        );
      }
    }

    if (weightKg !== undefined && weightKg !== null) {
      if (typeof weightKg !== "number" || weightKg <= 0) {
        return res.status(400).json(
          errorResponse("weightKg must be a positive number", "VALIDATION_ERROR", 400)
        );
      }

      if (weightKg > 500) {
        return res.status(400).json(
          errorResponse("weightKg must not exceed 500", "VALIDATION_ERROR", 400)
        );
      }
    }

    // Validate optional field: caloriesBurned (if provided by frontend)
    let finalCalories: number;
    let calorieEstimationMetadata: any = undefined;

    if (caloriesBurned !== undefined && caloriesBurned !== null) {
      // Frontend provided calories - validate it
      if (typeof caloriesBurned !== "number" || caloriesBurned < 0) {
        return res.status(400).json(
          errorResponse("caloriesBurned must be a non-negative number", "VALIDATION_ERROR", 400)
        );
      }

      if (caloriesBurned > 10000) {
        return res.status(400).json(
          errorResponse("caloriesBurned must not exceed 10000", "VALIDATION_ERROR", 400)
        );
      }

      finalCalories = caloriesBurned;
    } else {
      // Estimate calories using MET-based calculation
      const estimation = estimateCalories({
        workoutType,
        weightKg,
        durationMinutes,
      });

      finalCalories = estimation.estimatedCalories;
      calorieEstimationMetadata = {
        metValue: estimation.metValue,
        isEstimate: estimation.isEstimate,
        usedDefaultWeight: estimation.usedDefaultWeight,
        disclaimer: estimation.disclaimer,
      };
    }

    const session = await StopwatchSession.create({
      userId: req.user.userId,
      presetId: presetId?.trim(),
      workoutType: workoutType?.trim(),
      durationMinutes,
      weightKg,
      caloriesBurned: finalCalories,
    });

    const responseData: any = {
      session,
    };

    // Include estimation metadata if calories were estimated
    if (calorieEstimationMetadata) {
      responseData.calorieEstimation = calorieEstimationMetadata;
    }

    return res.status(201).json(
      successResponse("Session marked as complete", responseData)
    );
  } catch (error) {
    console.error("[Stopwatch Controller] markSessionComplete Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to mark session complete",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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
      return res.status(401).json(
        errorResponse("Authentication required to fetch sessions", "UNAUTHORIZED", 401)
      );
    }

    // Parse limit from query params, default to 10
    const limit = parseInt(req.query.limit as string, 10) || 10;

    // Validate limit is reasonable
    if (limit < 1 || limit > 100) {
      return res.status(400).json(
        errorResponse("limit must be between 1 and 100", "VALIDATION_ERROR", 400)
      );
    }

    // Only fetch sessions belonging to the authenticated user
    const sessions = await StopwatchSession.find({
      userId: req.user.userId,
    })
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json(
      successResponse("Recent sessions retrieved successfully", {
        count: sessions.length,
        sessions,
      })
    );
  } catch (error) {
    console.error("[Stopwatch Controller] getRecentSessions Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch recent sessions",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};
