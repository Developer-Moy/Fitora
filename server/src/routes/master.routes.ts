import { Router } from "express";
import { getMasterRevenue } from "../controllers/master.controller.js";
import {
  authMiddleware,
  requireMasterAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Master admin revenue aggregation dashboard (master_admin only)
router.get(
  "/revenue",
  authMiddleware,
  requireMasterAdmin,
  getMasterRevenue,
);

export default router;