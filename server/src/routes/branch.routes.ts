import { Router } from "express";
import { getBranchAdminOverview } from "../controllers/branch.controller";
import { authMiddleware, requireMasterAdmin } from "../middlewares/auth.middleware";

const router = Router();
router.get("/admin-overview", authMiddleware, requireMasterAdmin, getBranchAdminOverview);
export default router;