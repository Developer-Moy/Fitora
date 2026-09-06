import { Router } from "express";
import { createMealChart, getMealCharts } from "../controllers/mealChart.controller";

const router = Router();

router.post("/", createMealChart);
router.get("/", getMealCharts);

export default router;