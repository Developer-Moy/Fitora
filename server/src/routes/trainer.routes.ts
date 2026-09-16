import { Router } from "express";
import {
  createTrainer,
  getAllTrainers,
  getTrainerBySlug,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainer.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// ==========================================
// Public Routes (no authentication required)
// ==========================================

// Public: List all active trainers
router.get("/", getAllTrainers);

// Public: Fetch a single trainer by slug
router.get("/slug/:slug", getTrainerBySlug);

// Public: Fetch a single trainer by MongoDB ID
router.get("/id/:id", getTrainerById);

// ==========================================
// Protected Routes (master_admin | branch_admin)
// ==========================================

// Protected: Create a new trainer
router.post("/", authMiddleware, requireAdminOrBranchAdmin, createTrainer);

// Protected: Update an existing trainer
router.patch("/:id", authMiddleware, requireAdminOrBranchAdmin, updateTrainer);

// Protected: Soft delete a trainer (sets status = "inactive")
router.delete(
  "/:id",
  authMiddleware,
  requireAdminOrBranchAdmin,
  deleteTrainer,
);

export default router;
