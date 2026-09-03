import { Router } from "express";
import {
  getWorkouts,
  getWorkoutById,
  getWorkoutLogs,
  createWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
} from "../controllers/workout.controller.js";

const router = Router();

// Log routes (must be before /:id to prevent route shadowing)
router.get("/log", getWorkoutLogs);
router.post("/log", createWorkoutLog);
router.put("/log/:id", updateWorkoutLog);
router.delete("/log/:id", deleteWorkoutLog);

// Workout catalog routes
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);

export default router;
