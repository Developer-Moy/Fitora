import { Router } from "express";
import {
  getAttendanceExport,
  getRevenueExport,
} from "../controllers/admin.controller";

const router = Router();

router.get("/export/attendance", getAttendanceExport);
router.get("/export/revenue", getRevenueExport);

export default router;