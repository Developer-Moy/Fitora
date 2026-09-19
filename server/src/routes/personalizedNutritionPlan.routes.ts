import { Router } from "express";
import {
  getMyPlan,
  generatePlan,
  regeneratePlan,
} from "../controllers/personalizedNutritionPlan.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/personalized-nutrition-plan/me
router.get("/me", optionalAuth, getMyPlan);

// GET /api/personalized-nutrition-plan/:userId
router.get("/:userId", optionalAuth, getMyPlan);

// POST /api/personalized-nutrition-plan/generate
router.post("/generate", optionalAuth, generatePlan);

// POST /api/personalized-nutrition-plan/regenerate
router.post("/regenerate", optionalAuth, regeneratePlan);

export default router;
