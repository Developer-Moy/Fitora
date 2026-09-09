// client/src/services/notificationService.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AppNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "payment" | "renewal" | "system" | "invoice" | "upgrade" | "alert";
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data?: {
    notifications: AppNotification[];
    unreadCount: number;
  };
}

/**
 * Fetch authenticated user notifications
 */
export async function fetchNotificationsApi(token: string): Promise<{
  success: boolean;
  notifications: AppNotification[];
  unreadCount: number;
}> {
  try {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { success: false, notifications: [], unreadCount: 0 };
    }

    const json = await res.json();
    return {
      success: true,
      notifications: json?.data?.notifications || [],
      unreadCount: json?.data?.unreadCount || 0,
    };
  } catch (error) {
    console.error("[Notification Service] fetchNotificationsApi Error:", error);
    return { success: false, notifications: [], unreadCount: 0 };
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsReadApi(
  token: string,
  id: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsReadApi(
  token: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
