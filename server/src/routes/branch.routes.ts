import { Router } from "express";
import {
  getPublicBranches,
  getAdminBranches,
} from "../controllers/branch.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// Public: List 64 Nationwide Bangladesh Branches
router.get("/public", getPublicBranches);

// Protected: Admin Comprehensive Branch Overview Grid
router.get(
  "/admin-overview",
  authMiddleware,
  requireAdminOrBranchAdmin,
  getAdminBranches,
);

export default router;
