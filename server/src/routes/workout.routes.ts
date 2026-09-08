import { Router } from "express";
import {
  getWorkouts,
  getAdvancedWorkouts,
  getWorkoutById,
  getWorkoutLogs,
  createWorkoutLog,
  deleteWorkoutLog,
} from "../controllers/workout.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePremiumTier } from "../middlewares/premium.middleware";

const router = Router();

// Log routes (must be before /:id to prevent route shadowing)
router.get("/log", getWorkoutLogs);
router.post("/log", createWorkoutLog);
router.delete("/log/:id", deleteWorkoutLog);

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
