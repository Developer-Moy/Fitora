import { Router } from "express";
import { addToDailyPlan, getDailyMealPlan } from "../controllers/dailyMealPlan.controller";

const router = Router();

// POST /api/daily-plan — add a meal to the user's daily plan
router.post("/", addToDailyPlan);

// GET /api/daily-plan/:userId — retrieve all saved meals for a user
router.get("/:userId", getDailyMealPlan);

export default router;
