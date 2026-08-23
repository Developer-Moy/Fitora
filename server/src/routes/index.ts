import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import workoutRoutes from "./workout.routes";
import aiRoutes from "./ai.routes";

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

apiRouter.use("/workouts", workoutRoutes);
apiRouter.use("/ai", aiRoutes);

export default apiRouter;
