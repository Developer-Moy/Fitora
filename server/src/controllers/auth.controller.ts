import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth.middleware";
import User, { IUser, UserRole } from "../models/User.model";
import { errorResponse, successResponse } from "../utils/apiResponse";

const getJwtSecret = (): string => {
  return (
    process.env.JWT_SECRET || "FITORA_SUPER_SECRET_JWT_KEY_2026_PRODUCTION"
  );
};

const signUserToken = (user: IUser): string => {
  const secret = getJwtSecret();
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      assignedBranch: user.assignedBranch,
      tier: user.plan,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );
};

/**
 * 1. User Registration (`POST /api/auth/register`)
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, assignedBranch } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Name, email, and password are required fields",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res
        .status(409)
        .json(
          errorResponse(
            "An account with this email address already exists",
            "USER_ALREADY_EXISTS",
            409,
          ),
        );
    }

    // Hash password with high work factor
    const passwordHash = await bcrypt.hash(password, 12);

    const validRole: UserRole =
      role && ["master_admin", "branch_admin", "athlete", "user"].includes(role)
        ? role
        : "athlete";

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      phone: phone?.trim() || "",
      role: validRole,
      assignedBranch: assignedBranch || "Dhanmondi, Dhaka",
      plan: "Free Pass",
      status: "active",
      attendanceStreakDays: 0,
      hydrationTargetLiters: 3.5,
      totalPaidBDT: 0,
      isMasterProtected: cleanEmail === "master@fitora.com",
    });

    const token = signUserToken(user);

    return res.status(201).json(
      successResponse("User registered successfully", {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedBranch: user.assignedBranch,
          plan: user.plan,
          status: user.status,
          attendanceStreakDays: user.attendanceStreakDays,
          hydrationTargetLiters: user.hydrationTargetLiters,
          totalPaidBDT: user.totalPaidBDT,
        },
      }),
    );
  } catch (error: any) {
    console.error("Error in registerUser:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal server error during user registration",
          error.message,
          500,
        ),
      );
  }
};

/**
 * 2. Standard Public Login (`POST /api/auth/login`)
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Email and password are required",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Invalid email or password",
            "INVALID_CREDENTIALS",
            401,
          ),
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Invalid email or password",
            "INVALID_CREDENTIALS",
            401,
          ),
        );
    }

    const token = signUserToken(user);

    return res.status(200).json(
      successResponse("Login successful", {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedBranch: user.assignedBranch,
          plan: user.plan,
          status: user.status,
          attendanceStreakDays: user.attendanceStreakDays,
          hydrationTargetLiters: user.hydrationTargetLiters,
          totalPaidBDT: user.totalPaidBDT,
        },
      }),
    );
  } catch (error: any) {
    console.error("Error in loginUser:", error);
    return res
      .status(500)
      .json(
        errorResponse("Internal server error during login", error.message, 500),
      );
  }
};

/**
 * 3. Dedicated Enterprise Security Gateway Login (`POST /api/auth/dashboard-login`)
 * For Master Admin and Branch Admins accessing `/dashboard/login`
 */
export const dashboardLogin = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password || req.body.secretPass;
    const gatewayKey = req.body.gatewayKey;

    if (!email || !password) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Email and password are required for security gateway authentication",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    let user = await User.findOne({ email: cleanEmail });

    // Automatic Fallback Provisioning for Master Admin if not in DB yet
    if (
      !user &&
      cleanEmail === "master@fitora.com" &&
      (cleanPassword === "P@SSW0RDF!T0R@" ||
        cleanPassword === "MasterPassword123!")
    ) {
      const passwordHash = await bcrypt.hash("P@SSW0RDF!T0R@", 12);
      user = await User.create({
        name: "Moloy Paul",
        email: "master@fitora.com",
        passwordHash,
        phone: "+8801700000000",
        role: "master_admin",
        assignedBranch: "All 64 Branches (Headquarters)",
        plan: "VIP Ultimate",
        status: "active",
        attendanceStreakDays: 145,
        hydrationTargetLiters: 4.0,
        totalPaidBDT: 50000,
        isMasterProtected: true,
      });
    }

    // Automatic Fallback Provisioning for Demo Branch Admin if not in DB yet
    if (
      !user &&
      (cleanEmail === "gulshan.admin@fitora.com.bd" ||
        cleanEmail.includes("admin@fitora")) &&
      (cleanPassword === "BranchAdmin2025!" ||
        cleanPassword === "BranchPassword123!")
    ) {
      const passwordHash = await bcrypt.hash(cleanPassword, 12);
      user = await User.create({
        name: "Gulshan Branch Manager",
        email: cleanEmail,
        passwordHash,
        phone: "+8801800000000",
        role: "branch_admin",
        assignedBranch: "Gulshan, Dhaka",
        plan: "Pro Athlete",
        status: "active",
        attendanceStreakDays: 88,
        hydrationTargetLiters: 3.5,
        totalPaidBDT: 25000,
        isMasterProtected: false,
      });
    }

    if (!user) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Invalid administrator credentials. Access denied.",
            "INVALID_CREDENTIALS",
            401,
          ),
        );
    }

    // Compare Password (supports hash or default demo master bypass)
    let isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);
    if (
      !isMatch &&
      cleanEmail === "master@fitora.com" &&
      (cleanPassword === "P@SSW0RDF!T0R@" ||
        cleanPassword === "MasterPassword123!")
    ) {
      isMatch = true;
    }
    if (
      !isMatch &&
      cleanEmail.includes("admin@fitora") &&
      (cleanPassword === "BranchAdmin2025!" ||
        cleanPassword === "BranchPassword123!")
    ) {
      isMatch = true;
    }

    if (!isMatch) {
      return res
        .status(401)
        .json(
          errorResponse(
            "Invalid administrator credentials. Access denied.",
            "INVALID_CREDENTIALS",
            401,
          ),
        );
    }

    const isAdmin =
      user.role === "master_admin" ||
      user.role === "branch_admin" ||
      user.role === "admin" ||
      cleanEmail === "master@fitora.com" ||
      cleanEmail.includes("admin");

    if (!isAdmin) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Access Denied: Enterprise Security Gateway requires administrator clearance. Regular athletes must sign in via the main portal.",
            "FORBIDDEN",
            403,
          ),
        );
    }

    const token = signUserToken(user);

    return res.status(200).json(
      successResponse("Enterprise Security Gateway Authorization Successful", {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedBranch: user.assignedBranch,
          plan: user.plan,
          status: user.status,
          isMasterAdmin:
            user.role === "master_admin" || user.email === "master@fitora.com",
          isBranchAdmin: user.role === "branch_admin",
          attendanceStreakDays: user.attendanceStreakDays,
          hydrationTargetLiters: user.hydrationTargetLiters,
          totalPaidBDT: user.totalPaidBDT,
        },
      }),
    );
  } catch (error: any) {
    console.error("Error in dashboardLogin controller:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal server error during dashboard security authentication",
          error.message,
          500,
        ),
      );
  }
};

/**
 * 4. Get Current Authenticated User (`GET /api/auth/me`)
 */
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json(
          errorResponse("User session not authenticated", "UNAUTHORIZED", 401),
        );
    }

    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return res
        .status(404)
        .json(errorResponse("User profile not found", "USER_NOT_FOUND", 404));
    }

    return res.status(200).json(
      successResponse("User profile retrieved successfully", {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedBranch: user.assignedBranch,
          plan: user.plan,
          status: user.status,
          isMasterAdmin:
            user.role === "master_admin" || user.email === "master@fitora.com",
          isBranchAdmin: user.role === "branch_admin",
          attendanceStreakDays: user.attendanceStreakDays,
          hydrationTargetLiters: user.hydrationTargetLiters,
          totalPaidBDT: user.totalPaidBDT,
          paymentMethod: user.paymentMethod,
          qrCodeId: user.qrCodeId,
        },
      }),
    );
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal server error while fetching user profile",
          error.message,
          500,
        ),
      );
  }
};

/**
 * 5. Logout User (`POST /api/auth/logout`)
 */
export const logoutUser = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(successResponse("Session terminated successfully", {}));
};

export default {
  registerUser,
  loginUser,
  dashboardLogin,
  getCurrentUser,
  logoutUser,
};
