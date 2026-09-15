import { Router } from "express";

import {
  createOrUpdateGoal,
  getGoal,
  updateGoal,
  getGoalPresets,
  deleteGoal,
   getActiveGoals,
  getArchivedGoals,
} from "../controllers/goal.controller";

const router = Router();

router.get("/presets", getGoalPresets);

router.get("/active/:userId", getActiveGoals);

router.get("/archived/:userId", getArchivedGoals);

router.post("/", createOrUpdateGoal);

router.get("/:userId", getGoal);

router.patch("/:id", updateGoal);

router.delete("/:id", deleteGoal);

export default router;