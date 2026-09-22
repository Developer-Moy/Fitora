import { Request, Response } from "express";
import mongoose from "mongoose";
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
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ id }, { _id: id }] }
      : { id };

    const meal = await Meal.findOne(query).lean();

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


export const createMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      ingredients,
      calories,
      description,
      img,
      category,
    } = req.body;

    // 1. Validate required fields
    if (
      !name ||
      !ingredients ||
      calories === undefined ||
      calories === null ||
      !description ||
      !img
    ) {
      res.status(400).json(
        errorResponse(
          "All required fields must be provided",
          "VALIDATION_ERROR",
          400
        )
      );

      return;
    }

    // 2. Validate ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(400).json(
        errorResponse(
          "Ingredients must be a non-empty array",
          "INVALID_INGREDIENTS",
          400
        )
      );

      return;
    }

    // 3. Validate calories
    const calorieValue = Number(calories);

    if (isNaN(calorieValue) || calorieValue < 0) {
      res.status(400).json(
        errorResponse(
          "Calories must be a valid positive number",
          "INVALID_CALORIES",
          400
        )
      );

      return;
    }

    // 4. Check duplicate meal name
    const existingMeal = await Meal.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existingMeal) {
      res.status(409).json(
        errorResponse(
          "A meal with this name already exists",
          "MEAL_ALREADY_EXISTS",
          409
        )
      );

      return;
    }

    // 5. Generate unique string ID
    let mealId = `meal-${Date.now()}`;

    // Make sure generated ID does not already exist
    while (await Meal.exists({ id: mealId })) {
      mealId = `meal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // 6. Create meal
    const meal = await Meal.create({
      id: mealId,
      name: name.trim(),
      ingredients: ingredients
        .map((ingredient: unknown) => String(ingredient).trim())
        .filter((ingredient: string) => ingredient.length > 0),
      calories: calorieValue,
      description: description.trim(),
      img: img.trim(),
      category: category?.trim() || undefined,
    });

    // 7. Send response
    res.status(201).json(
      successResponse(
        "Meal created successfully",
        meal
      )
    );
  } catch (error) {
    console.error("Create meal error:", error);

    // Handle MongoDB duplicate key error
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      res.status(409).json(
        errorResponse(
          "Meal with this ID already exists",
          "DUPLICATE_MEAL_ID",
          409
        )
      );

      return;
    }

    res.status(500).json(
      errorResponse(
        "Failed to create meal",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};
