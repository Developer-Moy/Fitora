import { Request, Response } from "express";
import UserDailyMealPlan from "../models/UserDailyMealPlan.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * POST /api/daily-plan
 * Saves a meal to the user's daily meal plan.
 */
export const addToDailyPlan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, mealId, name, calories, description, ingredients, img } =
      req.body;

    if (!userId) {
      return res.status(400).json(
        errorResponse("userId is required", "VALIDATION_ERROR", 400)
      );
    }

    if (!mealId || !name || calories === undefined || !description || !ingredients || !img) {
      return res.status(400).json(
        errorResponse(
          "Missing required meal fields: mealId, name, calories, description, ingredients, img",
          "VALIDATION_ERROR",
          400
        )
      );
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json(
        errorResponse(
          "ingredients must be a non-empty array",
          "VALIDATION_ERROR",
          400
        )
      );
    }

    const savedEntry = await UserDailyMealPlan.create({
      userId,
      mealId,
      name,
      calories,
      description,
      ingredients,
      img,
    });

    return res.status(201).json(
      successResponse("Meal added to daily plan successfully", savedEntry)
    );
  } catch (error) {
    console.error("[DailyMealPlan] addToDailyPlan error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to add meal to daily plan",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};
