import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.model";
import { errorResponse } from "../utils/apiResponse";

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  assignedBranch?: string;
  tier?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json(
        errorResponse("Authorization token is required", "Unauthorized", 401)
      );
    }

    const [schema, token] = authHeader.split(" ");

    if (schema !== "Bearer" || !token) {
      return res.status(401).json(
        errorResponse(
          "Invalid authorization format. Bearer token required.",
          "Unauthorized",
          401
        )
      );
    }

    const jwtSecret =
      process.env.JWT_SECRET || "FITORA_SUPER_SECRET_JWT_KEY_2026_PRODUCTION";

    const decoded = jwt.verify(token, jwtSecret) as AuthUserPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      assignedBranch: decoded.assignedBranch,
      tier: decoded.tier,
    };

    next();
  } catch (error: any) {
    return res.status(401).json(
      errorResponse(
        "Invalid or expired authorization token",
        error.message,
        401
      )
    );
  }
};

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(
        errorResponse("Authentication required", "Unauthorized", 401)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        errorResponse(
          `Forbidden: Insufficient privileges. Required role: [${allowedRoles.join(", ")}]`,
          "Forbidden",
          403
        )
      );
    }

    next();
  };
};

/**
 * Convenience Guard: Master Admin Only
 */
export const requireMasterAdmin = requireRoles(["master_admin"]);

/**
 * Convenience Guard: Master Admin or Branch Admin
 */
export const requireAdminOrBranchAdmin = requireRoles([
  "master_admin",
  "branch_admin",
]);
