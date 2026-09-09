import { Router } from "express";
import { getMeals, getMealById } from "../controllers/meal.controller";

const router = Router();

// GET /api/meals - list all meals from MongoDB with filters
router.get("/", getMeals);

// GET /api/meals/:id - get single meal
router.get("/:id", getMealById);

export default router;
