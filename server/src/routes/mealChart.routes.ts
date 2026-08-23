import { Router } from "express";
import { createMealChart, getMealCharts } from "../controllers/mealChart.controller";

const router = Router();

router.post("/meal-charts", createMealChart);
router.get("/meal-charts", getMealCharts);

export default router;