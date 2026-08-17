import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "admin";
  };
}

interface JwtPayload {
  userId: string;
  role: "user" | "admin";
}
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }
    const [schema, token] = authHeader.split(" ");

    if(schema! == "Bearer" || !token ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }
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