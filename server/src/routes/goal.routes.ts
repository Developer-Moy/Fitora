import { Router } from "express";

import {
  createOrUpdateGoal,
  deleteGoal,
  getGoal,
  updateGoal,
} from "../controllers/goal.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getGoal);
router.post("/", createOrUpdateGoal);

router.get("/:userId", getGoal);

router.patch("/:id", updateGoal);

router.delete("/:id", deleteGoal);

export default router;