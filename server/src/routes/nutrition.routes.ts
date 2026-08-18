import { Router } from "express";
import { calculateNutrition } from "../controllers/nutrition.controller";

const router = Router();

router.post("/calculate", calculateNutrition);

export default router;