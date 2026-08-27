import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import adRoutes from "./ad.routes";
import aiRoutes from "./ai.routes";
import athleteRoutes from "./athlete.routes";
import authRoutes from "./auth.routes";
import goalRoutes from "./goal.routes";
import mealChartRoutes from "./mealChart.routes";
import mealCatalogRoutes from "./mealCatalog.routes";
import bmiRoutes from "./bmi.routes";
import branchRoutes from "./branch.routes";
import branchPortalRoutes from "./branchPortal.routes";
import checkinRoutes from "./checkin.routes";
import goalRoutes from "./goal.routes";
import masterRoutes from "./master.routes";
import mealChartRoutes from "./mealChart.routes";
import newsletterRoutes from "./newsletter.routes";
import stopwatchRoutes from "./stopwatch.routes";
import userRoutes from "./user.routes";
import userManagementRoutes from "./userManagement.routes";
import workoutRoutes from "./workout.routes";

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

// Mounted Central API Routes
apiRouter.use("/workouts", workoutRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/goals", goalRoutes);
apiRouter.use("/meal-charts", mealChartRoutes);
apiRouter.use("/meals", mealCatalogRoutes);
apiRouter.use("/bmi", bmiRoutes);
apiRouter.use("/ads", adRoutes);
apiRouter.use("/dashboard/athlete", athleteRoutes);
apiRouter.use("/dashboard", userRoutes);
apiRouter.use("/dashboard/users", userManagementRoutes);
apiRouter.use("/dashboard/branch", branchPortalRoutes);
apiRouter.use("/branches", branchRoutes);
apiRouter.use("/checkins", checkinRoutes);
apiRouter.use("/newsletter", newsletterRoutes);
apiRouter.use("/stopwatch", stopwatchRoutes);
apiRouter.use("/dashboard/master", masterRoutes);

export default apiRouter;
