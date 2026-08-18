import { Workout } from "../models/WorkoutLog.model";
import { Request, Response } from "express";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const workouts = await Workout.find({
      userId,
      completed: true,
    });

    const workoutCount = workouts.length;

    const burnedCalories = workouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    res.status(200).json({
      workoutCount,
      burnedCalories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};