import { Router } from "express";
import {
  getHeatmapData,
  recordActivity,
} from "../controllers/heatmap.controller";

const router = Router();

// GET /api/heatmap?userId=<id>&year=<year>
router.get("/", getHeatmapData);

// POST /api/heatmap/activity
router.post("/activity", recordActivity);

export default router;
