import { Router } from "express";
import { createMealChart, getMealCharts, getMealChartById } from "../controllers/mealChart.controller";

const router = Router();

router.post("/", createMealChart);
router.get("/", getMealCharts);
router.get("/:id", getMealChartById);

export default router;