import { Router } from "express";
import {
  getAttendanceExport,
  getRevenueExport,
} from "../controllers/admin.controller";
import {
  authMiddleware,
  requireMasterAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/export/attendance",
  authMiddleware,
  requireMasterAdmin,
  getAttendanceExport,
);
router.get(
  "/export/revenue",
  authMiddleware,
  requireMasterAdmin,
  getRevenueExport,
);

export default router;
