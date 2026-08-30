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

const apiRouter = Router();

// System Health Check & Server Status Endpoint
apiRouter.get("/health", (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  res.status(200).json({
    success: true,
    message: "Fitora API & Socket Server is running smoothly",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    databaseStatus: dbStatus,
    environment: process.env.NODE_ENV || "development",
  });
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

export default apiRouter;
