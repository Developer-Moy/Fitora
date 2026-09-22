import { Router } from "express";
import { getMeals, getMealById } from "../controllers/meal.controller";

const router = Router();

// GET /api/meals - list all meals from MongoDB with filters
router.get("/", getMeals);

// GET /api/meals/:id - get single meal
router.get("/:id", getMealById);

/**
 * @task Backend Dev 2: Register POST route for creating meals
 * - Import `createMeal` from controller.
 * - Import `authMiddleware` and `requireAdminOrBranchAdmin` from auth middleware.
 * - Create POST `/` route using these middlewares and controller.
 */
// DEV 2: Add router.post("/", ...) here

export default router;
