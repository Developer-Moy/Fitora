import { Router } from "express";
import { addToDailyPlan } from "../controllers/dailyMealPlan.controller";

const router = Router();

router.post("/", addToDailyPlan);

export default router;
