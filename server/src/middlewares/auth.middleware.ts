import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthRole = "user" | "admin" | "master_admin" | "branch_admin" | "athlete" | "trainer";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role: string;
    assignedBranch?: string;
    tier?: string;
  };
}

interface JwtPayload {
  userId: string;
  email?: string;
  role: string;
  assignedBranch?: string;
  tier?: string;
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

    const jwtSecret = process.env.JWT_SECRET || "fitora_jwt_secret_key_2026_super_secure";

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      assignedBranch: decoded.assignedBranch,
      tier: decoded.tier,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole) && userRole !== "master_admin") {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(", ")}]`,
      });
    }

    next();
  };
};

export const requireMasterAdmin = requireRoles("master_admin");
export const requireAdminOrBranchAdmin = requireRoles(
  "master_admin",
  "branch_admin",
  "admin"
);

export default {
  authMiddleware,
  requireRoles,
  requireMasterAdmin,
  requireAdminOrBranchAdmin,
};