import { Router } from "express";

import {
  calculateMetrics,
  calculateMacroSplit,
  createBMIHistory,
  getBMIHistory,
  deleteBMIHistory,
} from "../controllers/bmi.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();


// FIT-301
router.post(
  "/calculate",
  calculateMetrics
);

router.post(
  "/macros",
  calculateMacroSplit
);


// FIT-302
router.post(
  "/history",
  authMiddleware,
  createBMIHistory
);

router.get(
  "/history",
  authMiddleware,
  getBMIHistory
);

router.delete(
  "/history/:id",
  authMiddleware,
  deleteBMIHistory
);

export default router;