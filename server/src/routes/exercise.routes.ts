import { Router } from "express";

import {
  getExercises,
  getExerciseById,
  createExercise,
} from "../controllers/exercise.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getExercises);

router.get("/:id", getExerciseById);

// Protected Route: Create a new exercise (Admin/Branch Admin only)
router.post(
  "/",
  authMiddleware,
  requireAdminOrBranchAdmin,
  createExercise
);

export default router;