import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  getPlanByUserId,
  generatePersonalizedNutritionPlan,
} from "../services/personalizedNutritionPlan.service.js";

/**
 * GET /api/personalized-nutrition-plan/me
 * Retrieves saved personalized nutrition plan for the logged-in user
 */
export const getMyPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId =
      req.user?.userId ||
      req.params?.userId ||
      (req.query.userId as string) ||
      (req.headers["x-user-id"] as string);

    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "UNAUTHORIZED", 401));
    }

    const plan = await getPlanByUserId(userId);

    return res
      .status(200)
      .json(
        successResponse(
          plan
            ? "Personalized nutrition plan retrieved successfully"
            : "No personalized nutrition plan found for this user",
          plan,
        ),
      );
  } catch (error) {
    console.error(
      "[PersonalizedNutritionPlanController] getMyPlan error:",
      error,
    );
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve personalized nutrition plan",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * POST /api/personalized-nutrition-plan/generate
 * Generates or retrieves the personalized plan for the logged-in user
 */
export const generatePlan = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId =
      req.user?.userId ||
      req.body?.userId ||
      (req.query.userId as string) ||
      (req.headers["x-user-id"] as string);

    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "UNAUTHORIZED", 401));
    }

    const { fitnessGoal } = req.body || {};

    const plan = await generatePersonalizedNutritionPlan(userId, fitnessGoal);

    return res
      .status(201)
      .json(
        successResponse(
          "Personalized nutrition plan generated and calibrated successfully",
          plan,
        ),
      );
  } catch (error) {
    console.error(
      "[PersonalizedNutritionPlanController] generatePlan error:",
      error,
    );
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to generate personalized nutrition plan",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * POST /api/personalized-nutrition-plan/regenerate
 * Re-evaluates biometrics and regenerates the plan
 */
export const regeneratePlan = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId =
      req.user?.userId ||
      req.body?.userId ||
      (req.query.userId as string) ||
      (req.headers["x-user-id"] as string);

    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "UNAUTHORIZED", 401));
    }

    const { fitnessGoal } = req.body || {};

    const plan = await generatePersonalizedNutritionPlan(userId, fitnessGoal);

    return res
      .status(200)
      .json(
        successResponse(
          "Personalized nutrition plan recalibrated and updated successfully",
          plan,
        ),
      );
  } catch (error) {
    console.error(
      "[PersonalizedNutritionPlanController] regeneratePlan error:",
      error,
    );
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to regenerate personalized nutrition plan",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};
