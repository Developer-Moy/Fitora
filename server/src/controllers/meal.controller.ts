import { Request, Response } from "express";
import { Meal } from "../models/Meal.model";
import { DEFAULT_MEALS } from "../data/meals.data";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * GET /api/meals
 * Returns list of healthy meals from MongoDB with search and category filtering.
 * Auto-seeds from DEFAULT_MEALS if collection is empty.
 */
export const getMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, minCalories, maxCalories } = req.query;

    // Auto-seed into MongoDB if empty
    const count = await Meal.countDocuments();
    if (
      count === 0 &&
      Array.isArray(DEFAULT_MEALS) &&
      DEFAULT_MEALS.length > 0
    ) {
      await Meal.insertMany(DEFAULT_MEALS).catch((err) =>
        console.warn("Auto-seed meals non-fatal error:", err),
      );
    }

    const filter: Record<string, any> = {};

    if (search && typeof search === "string" && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { description: regex },
        { ingredients: { $in: [regex] } },
      ];
    }

    if (category && typeof category === "string") {
      const cat = category.toLowerCase();
      if (cat === "high-protein") {
        filter.calories = { ...filter.calories, $gte: 450 };
      } else if (cat === "low-calorie") {
        filter.calories = { ...filter.calories, $lt: 500 };
      } else if (cat === "fat-loss") {
        filter.calories = { ...filter.calories, $lt: 450 };
      }
    }

    if (minCalories && !isNaN(Number(minCalories))) {
      filter.calories = { ...filter.calories, $gte: Number(minCalories) };
    }
    if (maxCalories && !isNaN(Number(maxCalories))) {
      filter.calories = { ...filter.calories, $lte: Number(maxCalories) };
    }

    const meals = await Meal.find(filter).sort({ createdAt: -1 }).lean();

    res
      .status(200)
      .json(
        successResponse(
          "Healthy meals retrieved successfully from MongoDB",
          meals,
        ),
      );
  } catch (error) {
    console.error("Error in getMeals controller:", error);
    res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch meals from database",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * GET /api/meals/:id
 * Retrieve single meal by unique id or _id
 */
export const getMealById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const meal = await Meal.findOne({
      $or: [{ id }, { _id: id }],
    }).lean();

    if (!meal) {
      res.status(404).json(errorResponse("Meal not found", "NOT_FOUND", 404));
      return;
    }

    res.status(200).json(successResponse("Meal retrieved successfully", meal));
  } catch (error) {
    console.error("Error in getMealById controller:", error);
    res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch meal",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};
