import { Request, Response } from "express";
import MealPlan from "../models/MealChart.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

// Create / Save a meal plan
export const createMealChart = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userId, profile, goals, dietary, structure } = req.body;

        if (!profile || !goals || !dietary || !structure) {
            return res.status(400).json(
                errorResponse("Profile, goals, dietary, and structure are required", "VALIDATION_ERROR", 400)
            );
        }

        const mealPlan = await MealPlan.create({
            userId,
            profile,
            goals,
            dietary,
            structure,
        });

        return res.status(201).json(
            successResponse("Meal plan created successfully", mealPlan)
        );
    } catch (error) {
        console.error("Create meal chart error:", error);

        return res.status(500).json(
            errorResponse(
                "Failed to create meal plan",
                error instanceof Error ? error.message : "Internal Server Error",
                500
            )
        );
    }
};

// Get meal plan by user ID
export const getMealCharts = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== "string") {
            return res.status(400).json(
                errorResponse("userId is required", "VALIDATION_ERROR", 400)
            );
        }

        const mealPlans = await MealPlan.find({ userId: String(userId) }).sort({
            createdAt: -1,
        });

        return res.status(200).json(
            successResponse("Meal plans retrieved successfully", mealPlans)
        );
    } catch (error) {
        console.error("Get meal charts error:", error);

        return res.status(500).json(
            errorResponse(
                "Failed to fetch meal plans",
                error instanceof Error ? error.message : "Internal Server Error",
                500
            )
        );
    }
};