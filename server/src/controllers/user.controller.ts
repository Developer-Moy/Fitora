import { Request, Response } from "express";
import WorkoutLog from "../models/WorkoutLog.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req.query.userId as string) || "guest_user";

    const workouts = await WorkoutLog.find({
      userId,
    });

    const workoutCount = workouts.length;

    const burnedCalories = workouts.reduce(
      (total: number, workout: any) => total + (workout.caloriesBurned || 0),
      0
    );

    return res.status(200).json(
      successResponse("Dashboard statistics retrieved successfully", {
        workoutCount,
        burnedCalories,
        totalHours: Math.round((workouts.reduce((total: number, workout: any) => total + (workout.durationMinutes || 0), 0) / 60) * 10) / 10,
      })
    );
  } catch (error: any) {
    console.error("Error in getDashboardStats controller:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch dashboard statistics",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

export default {
  getDashboardStats,
};