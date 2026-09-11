import { Router } from "express";
import {
  getWorkouts,
  getAdvancedWorkouts,
  getWorkoutById,
  getWorkoutLogs,
  createWorkoutLog,
  deleteWorkoutLog,
   getPRHistory,
} from "../controllers/workout.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePremiumTier } from "../middlewares/premium.middleware";

const router = Router();

// Log routes (must be before /:id to prevent route shadowing)
router.get("/log", getWorkoutLogs);
router.post("/log", createWorkoutLog);
router.delete("/log/:id", deleteWorkoutLog);

// 1RM / PR History
router.get(
  "/pr-history/:exerciseId",
  authMiddleware,
  getPRHistory,
);

// Workout catalog routes
router.get(
  "/advanced",
  authMiddleware,
  requirePremiumTier,
  getAdvancedWorkouts,
);
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);

export default router;
