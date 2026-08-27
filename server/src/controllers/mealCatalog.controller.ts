import { Request, Response } from "express";
import mongoose from "mongoose";
import MealCatalog from "../models/MealCatalog.model";

/**
 * POST /api/meals/createMeal
 * Create a new meal plan in the mealplans collection
 */
export const createMeal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      name,
      description,
      imageUrl,
      goal,
      calories,
      prepTime,
      dietaryTags,
      ingredients,
      instructions,
      macros,
      servings,
      difficulty,
    } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "name is required and must be a non-empty string",
      });
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "description is required and must be a non-empty string",
      });
    }

    if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "imageUrl is required and must be a non-empty string",
      });
    }

    if (!goal || typeof goal !== "string" || goal.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "goal is required and must be a non-empty string",
      });
    }

    if (calories === undefined || typeof calories !== "number" || calories < 0) {
      return res.status(400).json({
        success: false,
        message: "calories is required and must be a non-negative number",
      });
    }

    if (prepTime === undefined || typeof prepTime !== "number" || prepTime < 0) {
      return res.status(400).json({
        success: false,
        message: "prepTime is required and must be a non-negative number",
      });
    }

    if (!Array.isArray(dietaryTags)) {
      return res.status(400).json({
        success: false,
        message: "dietaryTags is required and must be an array",
      });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: "ingredients is required and must be an array",
      });
    }

    if (!Array.isArray(instructions)) {
      return res.status(400).json({
        success: false,
        message: "instructions is required and must be an array",
      });
    }

    if (!macros || typeof macros !== "object") {
      return res.status(400).json({
        success: false,
        message: "macros is required and must be an object",
      });
    }

    const meal = await MealCatalog.create({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      goal: goal.trim(),
      calories,
      prepTime,
      dietaryTags,
      ingredients,
      instructions,
      macros,
      servings,
      difficulty,
    });

    return res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: meal,
    });
  } catch (error) {
    console.error("[Meal Catalog Controller] createMeal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create meal",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/**
 * GET /api/meals/getMeals
 * Retrieve filtered list of meal plans from mealplans collection
 */
export const getMeals = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { goal, caloriesMin, caloriesMax, prepTime, dietaryTags, page, limit } = req.query;

    const query: any = {};

    if (goal && typeof goal === "string") {
      query.goal = { $regex: new RegExp(`^${goal}$`, "i") };
    }

    if (caloriesMin && typeof caloriesMin === "string") {
      const minCalories = parseInt(caloriesMin, 10);
      if (!isNaN(minCalories) && minCalories >= 0) {
        query.calories = { ...query.calories, $gte: minCalories };
      }
    }

    if (caloriesMax && typeof caloriesMax === "string") {
      const maxCalories = parseInt(caloriesMax, 10);
      if (!isNaN(maxCalories) && maxCalories >= 0) {
        query.calories = { ...query.calories, $lte: maxCalories };
      }
    }

    if (prepTime && typeof prepTime === "string") {
      const maxPrepTime = parseInt(prepTime, 10);
      if (!isNaN(maxPrepTime) && maxPrepTime >= 0) {
        query.prepTime = { $lte: maxPrepTime };
      }
    }

    if (dietaryTags && typeof dietaryTags === "string") {
      const tags = dietaryTags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0);
      if (tags.length > 0) {
        query.dietaryTags = { $in: tags };
      }
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await MealCatalog.countDocuments(query);
    const meals = await MealCatalog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: meals.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: meals,
    });
  } catch (error) {
    console.error("[Meal Catalog Controller] getMeals Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meals",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/**
 * GET /api/meals/:id
 * Retrieve complete details of a specific meal plan
 */
export const getMealById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Meal ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Meal ID format",
      });
    }

    const meal = await MealCatalog.findById(id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    console.error("[Meal Catalog Controller] getMealById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meal details",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export default {
  createMeal,
  getMeals,
  getMealById,
};