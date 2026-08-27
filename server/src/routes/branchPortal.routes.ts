import { Router } from "express";
import {
    getBranchLeads,
    getBranchOverview,
    updateBranchLeadStatus,
} from "../controllers/branchPortal.controller";
import { authMiddleware, requireAdminOrBranchAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware, requireAdminOrBranchAdmin);
router.get("/:branchId/overview", getBranchOverview);
router.get("/:branchId/leads", getBranchLeads);
router.patch("/leads/:id/status", updateBranchLeadStatus);

export default router;