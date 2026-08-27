import { Router } from "express";
import {
  getWorkouts,
  getWorkoutById,
  getWorkoutLogs,
  createWorkoutLog,
  deleteWorkoutLog,
  getPrograms,
  get1RMAndPR,
} from "../controllers/workout.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Log routes (must be before /:id to prevent route shadowing)
router.get("/programs", getPrograms);
router.get("/log", authMiddleware, getWorkoutLogs);
router.post("/log", authMiddleware, createWorkoutLog);
router.delete("/log/:id", deleteWorkoutLog);

// Workout catalog routes
router.get("/", getWorkouts);
router.get("/pr/:exerciseId", authMiddleware, get1RMAndPR);
router.get("/:id", getWorkoutById);

export default router;
