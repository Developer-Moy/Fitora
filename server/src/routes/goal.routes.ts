import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

import {
  createOrUpdateGoal,
  getGoal,
  updateGoal,
  getGoalPresets,
  deleteGoal,
  getActiveGoals,
  getArchivedGoals,
  getMyGoal,
} from "../controllers/goal.controller";

const router = Router();

router.get("/presets", getGoalPresets);

// GET /api/goals — returns the authenticated user's goal (uses JWT token)
router.get("/", authMiddleware, getMyGoal);

router.get("/active/:userId", getActiveGoals);

router.get("/archived/:userId", getArchivedGoals);

router.post("/", createOrUpdateGoal);

router.get("/:userId", getGoal);

router.patch("/:id", updateGoal);

router.delete("/:id", deleteGoal);

export default router;