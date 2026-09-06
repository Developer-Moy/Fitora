import express from "express";
import {
  getDashboardStats,
  getPlatformStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
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

export default router;