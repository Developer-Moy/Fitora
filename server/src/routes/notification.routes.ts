import { Router } from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/notifications — Retrieve user notifications
router.get("/", authMiddleware, getMyNotifications);

// PATCH /api/notifications/read-all — Mark all as read
router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

// PATCH /api/notifications/:id/read — Mark single notification as read
router.patch("/:id/read", authMiddleware, markNotificationAsRead);

export default router;
