import { Request, Response } from "express";
import MealPlan from "../models/MealChart.model";

// Create / Save a meal plan
export const createMealChart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId, profile, goals, dietary, structure } = req.body;

        if (!profile || !goals || !dietary || !structure) {
            res.status(400).json({
                success: false,
                message: "Profile, goals, dietary, and structure are required",
            });
            return;
        }

        const mealPlan = await MealPlan.create({
            userId,
            profile,
            goals,
            dietary,
            structure,
        });

        res.status(201).json({
            success: true,
            message: "Meal plan created successfully",
            data: mealPlan,
        });
    } catch (error) {
        console.error("Create meal chart error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create meal plan",
        });
    }
};

// Get meal plan by user ID
export const getMealCharts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== "string") {
            res.status(400).json({
                success: false,
                message: "userId is required",
            });
            return;
        }

        const mealPlans = await MealPlan.find({ userId: String(userId) }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            data: mealPlans,
        });
    } catch (error) {
        console.error("Get meal charts error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch meal plans",
        });
    }
};

// Get meal chart by user ID
export const getMealChartById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== "string") {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }

        const mealChart = await MealPlan.findOne({ userId: id });

        if (!mealChart) {
            res.status(404).json({
                success: false,
                message: "Meal chart not found for this user",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: mealChart,
        });
    } catch (error) {
        console.error("Get meal chart by user ID error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch meal chart",
        });
    }
};