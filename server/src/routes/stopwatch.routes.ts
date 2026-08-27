import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getPresets,
  createCustomPreset,
  getUserPresets,
  markSessionComplete,
  getRecentSessions,
} from "../controllers/stopwatch.controller.js";

const router = Router();

router.get("/presets", getPresets); // Public - no auth required
router.post("/custom-preset", authMiddleware, createCustomPreset);
router.get("/user-presets", authMiddleware, getUserPresets);
router.post("/session-complete", authMiddleware, markSessionComplete);
router.get("/recent-sessions", authMiddleware, getRecentSessions);

export default router;