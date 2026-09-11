import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePremium } from "../middlewares/auth.middleware";
import {
  getPresets,
  createCustomPreset,
  getUserPresets,
  markSessionComplete,
  getRecentSessions,
  syncGymTime,
  resetTodayGymTime,
  createRestPreset,
  getRestPresets,
  deleteRestPreset,
} from "../controllers/stopwatch.controller";

const router = Router();

router.get("/presets", getPresets); // Public - no auth required
router.post("/custom-preset", authMiddleware, createCustomPreset);
router.get("/user-presets", authMiddleware, getUserPresets);
router.post("/session-complete", authMiddleware, markSessionComplete);
router.get("/recent-sessions", authMiddleware, getRecentSessions);
router.post("/sync-time", authMiddleware, syncGymTime);
router.post("/reset-today", authMiddleware, resetTodayGymTime);

// Custom rest presets - premium authenticated endpoints
router.post("/rest-preset", authMiddleware, requirePremium, createRestPreset);
router.get("/rest-presets", authMiddleware, getRestPresets);
router.delete("/rest-preset/:id", authMiddleware, deleteRestPreset);

export default router;
