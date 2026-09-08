import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import UserTier from "../models/UserTier.model.js";
import User from "../models/User.model.js";
import { errorResponse } from "../utils/apiResponse.js";

export const requirePremiumTier = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json(errorResponse("Authentication required", "Unauthorized", 401));
    }

    // 1. Master Admin and Staff Admins always have full access
    if (
      req.user.role === "master_admin" ||
      req.user.role === "admin" ||
      req.user.email === "master@fitora.com"
    ) {
      return next();
    }

    // 2. Check UserTier model
    const userTier = await UserTier.findOne({
      userId: req.user.userId,
      isActive: true,
    });

    if (userTier) {
      const expiryDate = userTier.expiryDate || userTier.validUntil;

      if (expiryDate && expiryDate < new Date()) {
        return res
          .status(403)
          .json(
            errorResponse(
              "Your premium subscription has expired",
              "Forbidden",
              403,
            ),
          );
      }

      if (["pro", "vip"].includes(userTier.tier)) {
        return next();
      }
    }

    // 3. Dynamic fallback: check User model for plan / role
    const userDoc = await User.findById(req.user.userId);

    if (userDoc) {
      if (
        userDoc.role === "master_admin" ||
        userDoc.role === "admin" ||
        userDoc.email === "master@fitora.com" ||
        userDoc.isMasterProtected
      ) {
        return next();
      }

      const isProOrVip =
        userDoc.plan === "Pro Athlete" ||
        userDoc.plan === "VIP Ultimate" ||
        userDoc.role === "premium_user";

      if (isProOrVip) {
        const expiry =
          userDoc.subscriptionExpiryDate || userDoc.membershipExpiresAt;
        if (!expiry || new Date(expiry) > new Date()) {
          return next();
        } else {
          return res
            .status(403)
            .json(
              errorResponse(
                "Your premium subscription has expired",
                "Forbidden",
                403,
              ),
            );
        }
      }
    }

    return res
      .status(403)
      .json(
        errorResponse(
          "This feature is available for Pro and VIP members only",
          "Forbidden",
          403,
        ),
      );
  } catch (error: any) {
    console.error("Premium tier verification error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to verify premium membership",
          error.message,
          500,
        ),
      );
  }
};
