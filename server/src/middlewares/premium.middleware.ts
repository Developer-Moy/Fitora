import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import UserTier from "../models/UserTier.model";
import { errorResponse } from "../utils/apiResponse";

export const requirePremiumTier = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Authentication required",
            "Unauthorized",
            401,
          ),
        );
    }

    const userTier = await UserTier.findOne({
      userId: req.user.userId,
      isActive: true,
    });

    if (!userTier) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Premium subscription required",
            "Forbidden",
            403,
          ),
        );
    }

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

    if (!["pro", "vip"].includes(userTier.tier)) {
      return res
        .status(403)
        .json(
          errorResponse(
            "This feature is available for Pro and VIP members only",
            "Forbidden",
            403,
          ),
        );
    }

    next();
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