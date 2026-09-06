import { Router } from "express";
import {
  checkoutBranchCheckin,
  createBranchCheckin,
  getAdminBranches,
  getBranchCheckins,
  getBranchOccupancy,
  getPublicBranches,
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

// Protected: Branch attendance management for branch admins
router.get(
  "/:id/checkins",
  authMiddleware,
  requireAdminOrBranchAdmin,
  getBranchCheckins,
);

router.post(
  "/:id/checkins",
  authMiddleware,
  requireAdminOrBranchAdmin,
  createBranchCheckin,
);

router.patch(
  "/:id/checkins/:checkinId/checkout",
  authMiddleware,
  requireAdminOrBranchAdmin,
  checkoutBranchCheckin,
);

router.get(
  "/:id/occupancy",
  authMiddleware,
  requireAdminOrBranchAdmin,
  getBranchOccupancy,
);

export default router;
