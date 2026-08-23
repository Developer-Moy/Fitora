import { Router } from "express";

import {
  createBMIHistory,
  getBMIHistory,
  updateBMIHistory,
  deleteBMIHistory,
} from "../controllers/bmi.controller";

const router = Router();

router.post("/history", createBMIHistory);
router.get("/history", getBMIHistory);
router.put("/history/:id", updateBMIHistory);
router.delete("/history/:id", deleteBMIHistory);

export default router;