import { Router } from "express";
import { getMeals, getMealById, createMeal } from "../controllers/meal.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /api/meals - list all meals from MongoDB with filters
router.get("/", getMeals);

// GET /api/meals/:id - get single meal
router.get("/:id", getMealById);

// POST /api/meals - create a new meal (admin / branch_admin only)
router.post("/", authMiddleware, requireAdminOrBranchAdmin, createMeal);

router.post(
  "/",
  authMiddleware,
  requireAdminOrBranchAdmin,
  createMeal
);
export default router;
