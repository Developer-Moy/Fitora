import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Notification, {
  NotificationType,
} from "../models/Notification.model.js";
import Payment from "../models/Payment.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * Helper to record in-app notifications
 */
export async function createNotificationHelper(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = "system",
  link?: string,
) {
  try {
    return await Notification.create({
      userId,
      title,
      message,
      type,
      link,
      isRead: false,
    });
  } catch (error) {
    console.warn("[Notification Helper] Failed to save notification:", error);
    return null;
  }
}

/**
 * GET /api/notifications
 * Retrieves notifications for the authenticated user, newest first.
 */
export async function getMyNotifications(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId || (req as any).user?.id;
    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "Unauthorized", 401));
    }

    let notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // If no notifications exist yet, bootstrap initial welcome & invoice notifications from payment history
    if (notifications.length === 0) {
      const recentPayment = await Payment.findOne({
        $or: [{ userId }, { userEmail: req.user?.email }],
        status: "completed",
      })
        .sort({ createdAt: -1 })
        .lean();

      if (recentPayment) {
        await createNotificationHelper(
          userId,
          "Invoice Available",
          `Your digital invoice ${recentPayment.invoiceNumber || "INV-FITORA"} for ${recentPayment.planName || "Membership"} is ready for download.`,
          "invoice",
          "/profile",
        );

        await createNotificationHelper(
          userId,
          "Subscription Active",
          `Welcome to Fitora ${recentPayment.planName || "Pro Athlete"}! Your premium benefits and AI Coach Studio are active.`,
          "upgrade",
          "/profile",
        );
      } else {
        await createNotificationHelper(
          userId,
          "Welcome to Fitora",
          "Welcome to Fitora! Explore training programs, calculate your macros, or join a flagship gym branch.",
          "system",
          "/profile",
        );
      }

      notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json(
      successResponse("Notifications retrieved successfully", {
        notifications,
        unreadCount,
      }),
    );
  } catch (error) {
    console.error("[Notification Controller] getMyNotifications Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve notifications",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId || (req as any).user?.id;
    const { id } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "Unauthorized", 401));
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true } },
      { new: true },
    );

    if (!notification) {
      return res
        .status(404)
        .json(errorResponse("Notification not found", "NOT_FOUND", 404));
    }

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json(
      successResponse("Notification marked as read", {
        notification,
        unreadCount,
      }),
    );
  } catch (error) {
    console.error(
      "[Notification Controller] markNotificationAsRead Error:",
      error,
    );
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update notification",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications for authenticated user as read.
 */
export async function markAllNotificationsAsRead(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId = req.user?.userId || (req as any).user?.id;
    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "Unauthorized", 401));
    }

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } },
    );

    return res.status(200).json(
      successResponse("All notifications marked as read", {
        unreadCount: 0,
      }),
    );
  } catch (error) {
    console.error(
      "[Notification Controller] markAllNotificationsAsRead Error:",
      error,
    );
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update notifications",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
}
