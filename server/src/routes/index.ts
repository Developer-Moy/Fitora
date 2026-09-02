import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import workoutRoutes from "./workout.routes";
import aiRoutes from "./ai.routes";
import authRoutes from "./auth.routes";
import goalRoutes from "./goal.routes";
import mealChartRoutes from "./mealChart.routes";
import bmiRoutes from "./bmi.routes";
import adRoutes from "./ad.routes";
import userRoutes from "./user.routes";
import consultationRoutes from "./consultation.routes";
import branchRoutes from "./branch.routes";
import newsletterRoutes from "./newsletter.routes";
import stopwatchRoutes from "./stopwatch.routes";
import exerciseRoutes from "./exercise.routes";
import nutritionRoutes from "./nutrition.routes";
import dailyMealPlanRoutes from "./dailyMealPlan.routes";
import searchRoutes from "./search.routes";
import { successResponse, errorResponse } from "../utils/apiResponse";

const apiRouter = Router();

// System Health Check & Server Status Endpoint
apiRouter.get("/health", (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus =
      dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

    return res.status(200).json(
      successResponse("Fitora API & Socket Server is running smoothly", {
        uptimeSeconds: Math.floor(process.uptime()),
        databaseStatus: dbStatus,
        environment: process.env.NODE_ENV || "development",
      })
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Health check failed",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
});

// Mounted Central API Routes across all 6 Team Members
apiRouter.use("/workouts", workoutRoutes);
apiRouter.use("/exercises", exerciseRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/goals", goalRoutes);
apiRouter.use("/meal-charts", mealChartRoutes);
apiRouter.use("/nutrition", nutritionRoutes);
apiRouter.use("/bmi", bmiRoutes);
apiRouter.use("/stopwatch", stopwatchRoutes);
apiRouter.use("/ads", adRoutes);
apiRouter.use("/dashboard", userRoutes);
apiRouter.use("/consultations", consultationRoutes);
apiRouter.use("/branches", branchRoutes);
apiRouter.use("/newsletter", newsletterRoutes);
apiRouter.use("/daily-plan", dailyMealPlanRoutes);
apiRouter.use("/search", searchRoutes);

export default apiRouter;
