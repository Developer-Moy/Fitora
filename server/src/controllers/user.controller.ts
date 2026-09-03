import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User.model";
import WorkoutLog from "../models/WorkoutLog.model";
import { errorResponse, successResponse } from "../utils/apiResponse";

/**
 * 1. GET /api/dashboard/stats — Personal member dashboard stats
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req.query.userId as string) || "guest_user";

    const workouts = await WorkoutLog.find({ userId });
    const workoutCount = workouts.length;
    const burnedCalories = workouts.reduce(
      (total: number, workout: any) => total + (workout.caloriesBurned || 0),
      0
    );

    return res.status(200).json(
      successResponse("Dashboard statistics retrieved successfully", {
        workoutCount,
        burnedCalories,
        totalHours:
          Math.round(
            (workouts.reduce(
              (total: number, workout: any) =>
                total + (workout.durationMinutes || 0),
              0
            ) /
              60) *
            10
          ) / 10,
      })
    );
  } catch (error: any) {
    console.error("Error in getDashboardStats controller:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch dashboard statistics",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

/**
 * 2. GET /api/dashboard/platform-stats — Master admin platform overview
 */
export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalMembers = await User.countDocuments({});
    const activeMembersToday = await User.countDocuments({ status: "active" });
    const premiumMembers = await User.countDocuments({
      plan: { $in: ["Basic Pass", "Pro Athlete", "VIP Ultimate"] },
    });
    const freeMembers = await User.countDocuments({ plan: "Free Pass" });

    // Revenue aggregation from user payments
    const revenueAgg = await User.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPaidBDT" } } },
    ]);
    const totalRevenueBDT = revenueAgg[0]?.totalRevenue || 0;

    // Payment gateway breakdown
    const bkashCount = await User.countDocuments({ paymentMethod: "bKash" });
    const nagadCount = await User.countDocuments({ paymentMethod: "Nagad" });
    const cardCount = await User.countDocuments({ paymentMethod: "Card" });
    const totalPaid = bkashCount + nagadCount + cardCount || 1;

    const bkashRevenue = await User.aggregate([
      { $match: { paymentMethod: "bKash" } },
      { $group: { _id: null, total: { $sum: "$totalPaidBDT" } } },
    ]);
    const nagadRevenue = await User.aggregate([
      { $match: { paymentMethod: "Nagad" } },
      { $group: { _id: null, total: { $sum: "$totalPaidBDT" } } },
    ]);
    const cardRevenue = await User.aggregate([
      { $match: { paymentMethod: "Card" } },
      { $group: { _id: null, total: { $sum: "$totalPaidBDT" } } },
    ]);

    // Plan breakdown
    const planBreakdown = await User.aggregate([
      { $group: { _id: "$plan", count: { $sum: 1 } } },
    ]);

    // Recent check-ins (last 20 active users sorted by updatedAt)
    const recentUsers = await User.find({ status: "active" })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select("name role assignedBranch updatedAt plan");

    const checkIns = recentUsers.map((u: any, i: number) => ({
      id: `CHK-${i + 1}`,
      userName: u.name,
      userRole: u.role,
      branchName: u.assignedBranch || "Dhaka - Gulshan-2 Branch",
      time: u.updatedAt
        ? new Date(u.updatedAt).toLocaleTimeString("en-BD", {
          hour: "2-digit",
          minute: "2-digit",
        })
        : "N/A",
      status: "Verified Entry",
      method: i % 3 === 0 ? "QR Scan" : i % 3 === 1 ? "Manual Entry" : "Biometric NFC",
    }));

    return res.status(200).json(
      successResponse("Platform statistics retrieved successfully", {
        platformStats: {
          totalRevenueBDT,
          mrrBDT: Math.round(totalRevenueBDT / 6),
          totalMembers,
          activeMembersToday,
          totalBranches: 64,
          conversionRatePercent:
            totalMembers > 0
              ? Math.round((premiumMembers / totalMembers) * 100 * 10) / 10
              : 0,
          revenueGrowthPercent: 18.5, // can be calculated from historical data
          membersGrowthPercent: 12.3,
        },
        paymentGatewayBreakdown: [
          {
            name: "bKash Direct",
            percentage: Math.round((bkashCount / totalPaid) * 100),
            amountBDT: bkashRevenue[0]?.total || 0,
            color: "#E2136E",
          },
          {
            name: "Nagad Gateway",
            percentage: Math.round((nagadCount / totalPaid) * 100),
            amountBDT: nagadRevenue[0]?.total || 0,
            color: "#F7941D",
          },
          {
            name: "Visa / Mastercard",
            percentage: Math.round((cardCount / totalPaid) * 100),
            amountBDT: cardRevenue[0]?.total || 0,
            color: "#00579F",
          },
        ],
        packageSalesBreakdown: planBreakdown.map((p) => ({
          name: p._id,
          members: p.count,
          priceBDT:
            p._id === "Free Pass"
              ? 0
              : p._id === "Basic Pass"
                ? 2500
                : p._id === "Pro Athlete"
                  ? 4900
                  : 9900,
          share: `${Math.round((p.count / (totalMembers || 1)) * 100)}%`,
        })),
        recentCheckIns: checkIns,
      })
    );
  } catch (error: any) {
    console.error("Error in getPlatformStats:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch platform statistics",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

/**
 * 3. GET /api/dashboard/users — Get all users (admin only)
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, status, branch, search, page = 1, limit = 50 } = req.query;

    const filter: Record<string, any> = {};
    if (role && role !== "all") filter.role = role;
    if (status && status !== "all") filter.status = status;
    if (branch && branch !== "all") filter.assignedBranch = branch;
    if (search) {
      const q = String(search);
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { assignedBranch: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-passwordHash");

    const total = await User.countDocuments(filter);

    const formatted = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "Unnamed User",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role,
      assignedBranch: u.assignedBranch || "Unassigned",
      plan: u.plan || "Free Pass",
      status: u.status || "active",
      joinDate: u.createdAt
        ? new Date(u.createdAt).toISOString().split("T")[0]
        : "",
      expiryDate: u.updatedAt
        ? new Date(
          new Date(u.updatedAt).getTime() + 30 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0]
        : "",
      totalPaidBDT: u.totalPaidBDT || 0,
      paymentMethod: u.paymentMethod || "None",
      attendanceStreakDays: u.attendanceStreakDays || 0,
      lastCheckIn: u.updatedAt
        ? new Date(u.updatedAt).toLocaleDateString("en-BD")
        : "Never",
      qrCodeId: u.qrCodeId || `FIT-QR-${u._id.toString().slice(-6).toUpperCase()}`,
    }));

    return res.status(200).json(
      successResponse("Users retrieved successfully", {
        users: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      })
    );
  } catch (error: any) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch users",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

/**
 * 4. POST /api/dashboard/users — Create new user (admin)
 */
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, role, assignedBranch, plan, status, paymentMethod } =
      req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json(errorResponse("Name, email and phone are required", "", 400));
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json(errorResponse("User with this email already exists", "", 409));
    }

    const newUser = new User({
      name,
      email,
      phone,
      role: role || "free_user",
      assignedBranch: assignedBranch || "Dhaka - Gulshan-2 Branch",
      assignedBranchSlug: (assignedBranch || "dhaka-gulshan-2")
        .toLowerCase()
        .replace(/\s+/g, "-"),
      plan: plan || "Free Pass",
      status: status || "active",
      paymentMethod: paymentMethod || "None",
      passwordHash: "temp_hash_" + Date.now(),
      attendanceStreakDays: 0,
      hydrationTargetLiters: 2.5,
      totalPaidBDT: plan === "Pro Athlete" ? 4900 : plan === "Basic Pass" ? 2500 : plan === "VIP Ultimate" ? 9900 : 0,
      qrCodeId: `FIT-QR-${Date.now().toString(36).toUpperCase()}`,
      isMasterProtected: false,
    });

    await newUser.save();

    return res.status(201).json(
      successResponse("User created successfully", {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
      })
    );
  } catch (error: any) {
    console.error("Error in createUser:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to create user",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

/**
 * 5. PUT /api/dashboard/users/:id — Update user (admin)
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Try finding by string id pattern
      const user = await User.findOne({});
      if (!user) {
        return res.status(404).json(errorResponse("User not found", "", 404));
      }
    }

    // Don't allow passwordHash updates through this route
    delete updates.passwordHash;
    delete updates.isMasterProtected;

    const updated = await User.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updated) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    return res.status(200).json(
      successResponse("User updated successfully", {
        id: updated._id.toString(),
        name: updated.name,
      })
    );
  } catch (error: any) {
    console.error("Error in updateUser:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to update user",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

/**
 * 6. DELETE /api/dashboard/users/:id — Delete user (master admin only)
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    if (user.isMasterProtected) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Master Admin account is permanently protected and cannot be deleted",
            "",
            403
          )
        );
    }

    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json(successResponse(`User "${user.name}" deleted successfully`, {}));
  } catch (error: any) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to delete user",
        error.message || "Internal Server Error",
        500
      )
    );
  }
};

export default {
  getDashboardStats,
  getPlatformStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};