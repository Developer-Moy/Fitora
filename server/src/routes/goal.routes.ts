import { Router } from "express";

import {
  createOrUpdateGoal,
  getGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller";

const router = Router();

router.post("/", createOrUpdateGoal);

router.get("/:userId", getGoal);

router.patch("/:id", updateGoal);

router.delete("/:id", deleteGoal);

export default router;