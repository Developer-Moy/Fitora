import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthRole = "user" | "admin" | "master_admin" | "branch_admin" | "athlete" | "trainer";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: AuthRole;
  };
}

interface JwtPayload {
  userId: string;
  role: AuthRole;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const [schema, token] = authHeader.split(" ");

    if (schema !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "FITORA_SUPER_SECRET_JWT_KEY_2026_PRODUCTION";

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const requireMasterAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "master_admin") {
    return res.status(403).json({ success: false, message: "Forbidden: master_admin role required" });
  }
  next();
};

export const requireAdminOrBranchAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin" && req.user?.role !== "branch_admin" && req.user?.role !== "master_admin") {
    return res.status(403).json({ success: false, message: "Forbidden: administrator role required" });
  }
  next();
};