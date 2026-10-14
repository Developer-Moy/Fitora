import { Router } from "express";

import {
  getExercises,
  getExerciseById,
  createExercise,
  getFavoriteExercises,
  toggleFavoriteExercise,
  removeFavoriteExercise,
} from "../controllers/exercise.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// ── Favorite Exercise Routes (Connected to Profile Database) ──────────────────
router.get("/favorites", getFavoriteExercises);
router.get("/favorites/:userId", getFavoriteExercises);
router.post("/favorites/toggle", toggleFavoriteExercise);
router.delete("/favorites/:exerciseId", removeFavoriteExercise);

// ── Exercise Catalog Routes ───────────────────────────────────────────────────
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