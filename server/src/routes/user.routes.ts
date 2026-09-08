import express from "express";
import {
  getDashboardStats,
  getPlatformStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  extendUserMembership,
  updateUserMembershipPlan,
  getUserMembershipAudit,
  updateHealthMetrics,
} from "../controllers/user.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
  requireMasterAdmin,
} from "../middlewares/auth.middleware";

const router = express.Router();

// Personal member stats (authenticated)
router.get("/", authMiddleware, getDashboardStats);

// Platform-wide admin stats (admin only)
router.get(
  "/platform-stats",
  authMiddleware,
  requireAdminOrBranchAdmin,
  getPlatformStats
);

// List all users with filters (admin only)
router.get(
  "/users",
  authMiddleware,
  requireAdminOrBranchAdmin,
  getAllUsers
);

// Create new user (admin only)
router.post(
  "/users",
  authMiddleware,
  requireAdminOrBranchAdmin,
  createUser
);

// Update user (admin only)
router.put(
  "/users/:id",
  authMiddleware,
  requireAdminOrBranchAdmin,
  updateUser
);

// Delete user (master admin only)
router.delete(
  "/users/:id",
  authMiddleware,
  requireMasterAdmin,
  deleteUser
);

// ── Membership Management (master admin only) ────────────────────────────────

// Membership & payment audit (read-only)
router.get(
  "/users/:id/membership",
  authMiddleware,
  requireMasterAdmin,
  getUserMembershipAudit
);

// Extend membership expiry by N days
router.post(
  "/users/:id/membership/extend",
  authMiddleware,
  requireMasterAdmin,
  extendUserMembership
);

// Change subscription plan (Basic Pass / Pro Athlete / VIP Ultimate)
router.put(
  "/users/:id/membership/plan",
  authMiddleware,
  requireMasterAdmin,
  updateUserMembershipPlan
// Update authenticated user's BMR and TDEE
router.patch(
  "/profile/health-metrics",
  authMiddleware,
  updateHealthMetrics
);

export default router;