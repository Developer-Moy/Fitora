import { Router } from "express";
import { createMeal, getMeals, getMealById } from "../controllers/mealCatalog.controller.js";

const router = Router();

// Create route
router.post("/createMeal", createMeal);

// List routes
router.get("/getMeals", getMeals);

// Single meal route
router.get("/:id", getMealById);

export default router;