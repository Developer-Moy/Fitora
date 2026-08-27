import { Router, Request, Response } from "express";
import {
  getPresets,
  createCustomPreset,
  getUserPresets,
  markSessionComplete,
  getRecentSessions,
} from "../controllers/stopwatch.controller.js";

const router = Router();

router.get("/presets", getPresets);
router.post("/custom-preset", createCustomPreset);
router.get("/user-presets", getUserPresets);
router.post("/session-complete", markSessionComplete);
router.get("/recent-sessions", getRecentSessions);

export default router;