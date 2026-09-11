import { Router } from "express";

import {
  createBMIHistory,
  getBMIHistory,
  updateBMIHistory,
  deleteBMIHistory,
} from "../controllers/bmi.controller";
import { optionalAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/history", optionalAuth, createBMIHistory);
router.get("/history", optionalAuth, getBMIHistory);
router.put("/history/:id", optionalAuth, updateBMIHistory);
router.delete("/history/:id", optionalAuth, deleteBMIHistory);

export default router;
