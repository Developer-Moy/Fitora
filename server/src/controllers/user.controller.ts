import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User.model";
import WorkoutLog from "../models/WorkoutLog.model";
import Payment from "../models/Payment.model";
import BranchCheckin from "../models/BranchCheckin.model";
import StopwatchSession from "../models/StopwatchSession.model";
import { errorResponse, successResponse } from "../utils/apiResponse";

/**
 * 1. GET /api/dashboard/stats — Personal member dashboard stats
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId =
      authUser?.userId ||
      authUser?.id ||
      authUser?._id ||
      (req.query.userId as string) ||
      "guest_user";

    const userConditions: any[] = [{ userId: String(userId) }];
    if (mongoose.Types.ObjectId.isValid(String(userId))) {
      userConditions.push({
        userId: new mongoose.Types.ObjectId(String(userId)),
      });
    }
    if (authUser?.email && authUser.email !== userId) {
      userConditions.push({ userId: authUser.email });
    }

    const workouts = await WorkoutLog.find({ $or: userConditions });
    const workoutCount = workouts.length;

    // Monthly workouts calculation
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const workoutsThisMonth = workouts.filter((w: any) => {
      const d = w.date || w.createdAt;
      return d && new Date(d) >= startOfMonth;
    }).length;

    const burnedCalories = workouts.reduce(
      (total: number, workout: any) => total + (workout.caloriesBurned || 0),
      0,
    );

    const totalHours =
      Math.round(
        (workouts.reduce(
          (total: number, workout: any) =>
            total + (workout.durationMinutes || 0),
          0,
        ) /
          60) *
          10,
      ) / 10;

    // Retrieve user for streak and membership info
    const userDoc = await User.findOne({
      $or: [
        ...(mongoose.Types.ObjectId.isValid(String(userId))
          ? [{ _id: userId }]
          : []),
        { email: String(userId) },
        ...(authUser?.email ? [{ email: authUser.email }] : []),
      ],
    });

    let streakDays = userDoc?.attendanceStreakDays || 0;
    if (streakDays === 0 && workouts.length > 0) {
      const dates = workouts
        .map((w: any) => w.date || w.createdAt)
        .filter(Boolean)
        .map((d: any) => {
          try {
            return new Date(d).toISOString().slice(0, 10);
          } catch {
            return "";
          }
        })
        .filter(Boolean);
      const uniqueDates = Array.from(new Set(dates));
      const todayKey = new Date().toISOString().slice(0, 10);
      const yesterdayKey = new Date(Date.now() - 86400000)
        .toISOString()
        .slice(0, 10);

      if (
        uniqueDates.includes(todayKey) ||
        uniqueDates.includes(yesterdayKey)
      ) {
        let currentStreak = 0;
        const anchor = new Date(
          uniqueDates.includes(todayKey) ? Date.now() : Date.now() - 86400000,
        );
        while (true) {
          const k = anchor.toISOString().slice(0, 10);
          if (uniqueDates.includes(k)) {
            currentStreak++;
            anchor.setDate(anchor.getDate() - 1);
          } else {
            break;
          }
        }
        streakDays = currentStreak;
        if (userDoc) {
          userDoc.attendanceStreakDays = streakDays;
          await userDoc.save({ validateModifiedOnly: true });
        }
      }
    }
    const targetWorkouts = 20;
    const consistencyScore =
      Math.min(
        100,
        Math.round(
          ((workoutsThisMonth || workoutCount) / targetWorkouts) * 100,
        ),
      ) || (workoutCount > 0 ? 80 : 0);

    return res.status(200).json(
      successResponse("Dashboard statistics retrieved successfully", {
        workoutCount,
        workoutsThisMonth: workoutsThisMonth || workoutCount,
        burnedCalories,
        caloriesBurned: burnedCalories,
        totalHours,
        streakDays,
        targetWorkouts,
        consistencyScore,
      }),
    );
  } catch (error: any) {
    console.error("Error in getDashboardStats controller:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch dashboard statistics",
          error.message || "Internal Server Error",
          500,
        ),
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
      method:
        i % 3 === 0
          ? "QR Scan"
          : i % 3 === 1
            ? "Manual Entry"
            : "Biometric NFC",
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
        packageSalesBreakdown: [
          "Free Pass",
          "Basic Pass",
          "Pro Athlete",
          "VIP Ultimate",
        ].map((tierName) => {
          const found = planBreakdown.find((p: any) => p._id === tierName);
          const count = found?.count || 0;
          return {
            name: tierName,
            members: count,
            priceBDT:
              tierName === "Free Pass"
                ? 0
                : tierName === "Basic Pass"
                  ? 2500
                  : tierName === "Pro Athlete"
                    ? 4900
                    : 9900,
            share: `${Math.round((count / (totalMembers || 1)) * 100)}%`,
          };
        }),
        recentCheckIns: checkIns,
      }),
    );
  } catch (error: any) {
    console.error("Error in getPlatformStats:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch platform statistics",
          error.message || "Internal Server Error",
          500,
        ),
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

    // Auto-seed initial users into MongoDB if user collection is completely empty
    const totalUsersInDb = await User.countDocuments();
    if (totalUsersInDb === 0) {
      try {
        const usersJsonModule = await import("../data/users.json");
        const usersData = usersJsonModule.default || usersJsonModule;
        if (Array.isArray(usersData) && usersData.length > 0) {
          await User.insertMany(usersData);
        }
      } catch (seedErr) {
        console.warn("User auto-seed non-fatal error:", seedErr);
      }
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
        ? new Date(new Date(u.updatedAt).getTime() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        : "",
      totalPaidBDT: u.totalPaidBDT || 0,
      paymentMethod: u.paymentMethod || "None",
      // Live subscription data (from latest completed payment)
      subscriptionExpiryDate: u.subscriptionExpiryDate
        ? new Date(u.subscriptionExpiryDate).toISOString()
        : null,
      membershipExpiresAt: u.membershipExpiresAt
        ? new Date(u.membershipExpiresAt).toISOString()
        : null,
      attendanceStreakDays: u.attendanceStreakDays || 0,
      lastCheckIn: u.updatedAt
        ? new Date(u.updatedAt).toLocaleDateString("en-BD")
        : "Never",
      qrCodeId:
        u.qrCodeId || `FIT-QR-${u._id.toString().slice(-6).toUpperCase()}`,
    }));

    return res.status(200).json(
      successResponse("Users retrieved successfully", {
        users: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }),
    );
  } catch (error: any) {
    console.error("Error in getAllUsers:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch users",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * 4. POST /api/dashboard/users — Create new user (admin)
 */
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      assignedBranch,
      plan,
      status,
      paymentMethod,
    } = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json(errorResponse("Name, email and phone are required", "", 400));
    }

    if (role === "master_admin") {
      return res
        .status(403)
        .json(
          errorResponse(
            "Forbidden: Master Admin is unique and cannot be created.",
            "FORBIDDEN",
            403,
          ),
        );
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
      totalPaidBDT:
        plan === "Pro Athlete"
          ? 4900
          : plan === "Basic Pass"
            ? 2500
            : plan === "VIP Ultimate"
              ? 9900
              : 0,
      qrCodeId: `FIT-QR-${Date.now().toString(36).toUpperCase()}`,
      isMasterProtected: false,
    });

    await newUser.save();

    return res.status(201).json(
      successResponse("User created successfully", {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
      }),
    );
  } catch (error: any) {
    console.error("Error in createUser:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to create user",
          error.message || "Internal Server Error",
          500,
        ),
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

    // Root/Master Admin account is completely immutable (protected by email too)
    const target = await User.findById(id);
    if (target && isImmutableRootUser(target)) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Master Admin account is immutable and cannot be modified",
            "",
            403,
          ),
        );
    }

    // Don't allow passwordHash updates through this route
    delete updates.passwordHash;
    delete updates.isMasterProtected;

    if (updates.role === "master_admin") {
      return res
        .status(403)
        .json(
          errorResponse(
            "Forbidden: Cannot promote user to Master Admin. FITORA permits only one Master Admin.",
            "FORBIDDEN",
            403,
          ),
        );
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    if (!updated) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    return res.status(200).json(
      successResponse("User updated successfully", {
        id: updated._id.toString(),
        name: updated.name,
      }),
    );
  } catch (error: any) {
    console.error("Error in updateUser:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update user",
          error.message || "Internal Server Error",
          500,
        ),
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

    if (isImmutableRootUser(user)) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Master Admin account is permanently protected and cannot be deleted",
            "",
            403,
          ),
        );
    }

    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json(successResponse(`User "${user.name}" deleted successfully`, {}));
  } catch (error: any) {
    console.error("Error in deleteUser:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to delete user",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * Root/Master Admin immutability guard.
 * The account `master@fitora.com` (or any master-protected user) can never
 * have its membership modified, plan changed, deleted, or suspended.
 */
const isImmutableRootUser = (user: any): boolean =>
  (user?.email || "").toLowerCase() === "master@fitora.com" ||
  user?.isMasterProtected === true;

/** Resolve the current effective subscription expiry for a user. */
const resolveUserExpiry = (user: any): Date | null => {
  const candidates = [user?.subscriptionExpiryDate, user?.membershipExpiresAt]
    .map((value) => (value ? new Date(value) : null))
    .filter((d): d is Date => !!d && !Number.isNaN(d.getTime()))
    .map((d) => d.getTime());

  if (candidates.length === 0) return null;

  const max = Math.max(...candidates);
  // Only a future date counts as the live expiry; lapsed memberships are
  // extended from today instead.
  return max > Date.now() ? new Date(max) : null;
};

/**
 * POST /api/dashboard/users/:id/membership/extend — Extend membership
 * (master admin only) by `days`.
 */
export const extendUserMembership = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { days } = req.body;

    const daysToAdd = Number(days);
    if (!Number.isFinite(daysToAdd) || daysToAdd < 1 || daysToAdd > 3650) {
      return res
        .status(400)
        .json(
          errorResponse("Days must be a number between 1 and 3650", "", 400),
        );
    }

    const target = await User.findById(id);
    if (!target) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    if (isImmutableRootUser(target)) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Master Admin account is immutable and cannot be modified",
            "",
            403,
          ),
        );
    }

    const base = resolveUserExpiry(target) || new Date();
    const newExpiry = new Date(
      base.getTime() + daysToAdd * 24 * 60 * 60 * 1000,
    );

    target.subscriptionExpiryDate = newExpiry;
    target.membershipExpiresAt = newExpiry;
    if (target.plan !== "Free Pass") {
      target.status = "active";
    }
    await target.save();

    return res.status(200).json(
      successResponse(
        `Membership extended by ${daysToAdd} day(s) for "${target.name}"`,
        {
          name: target.name,
          subscriptionExpiryDate: newExpiry.toISOString(),
        },
      ),
    );
  } catch (error: any) {
    console.error("Error in extendUserMembership:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to extend membership",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * PUT /api/dashboard/users/:id/membership/plan — Modify membership plan
 * (master admin only) among the three paid tiers.
 */
export const updateUserMembershipPlan = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { planName } = req.body;

    const allowedPlans = ["Basic Pass", "Pro Athlete", "VIP Ultimate"];
    if (!planName || !allowedPlans.includes(planName)) {
      return res
        .status(400)
        .json(
          errorResponse(
            `Plan must be one of: ${allowedPlans.join(", ")}`,
            "",
            400,
          ),
        );
    }

    const target = await User.findById(id);
    if (!target) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    if (isImmutableRootUser(target)) {
      return res
        .status(403)
        .json(
          errorResponse(
            "Master Admin account is immutable — plan cannot be changed",
            "",
            403,
          ),
        );
    }

    target.plan = planName;
    target.status = "active";

    // Ensure a paid plan always has a valid future expiry.
    const currentExpiry = resolveUserExpiry(target);
    if (!currentExpiry) {
      const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      target.subscriptionExpiryDate = newExpiry;
      target.membershipExpiresAt = newExpiry;
    }

    await target.save();

    const effectiveExpiry = (
      target.subscriptionExpiryDate || target.membershipExpiresAt
    )?.toISOString();

    return res.status(200).json(
      successResponse(
        `Membership plan updated to "${planName}" for "${target.name}"`,
        {
          name: target.name,
          plan: target.plan,
          subscriptionExpiryDate: effectiveExpiry || null,
        },
      ),
    );
  } catch (error: any) {
    console.error("Error in updateUserMembershipPlan:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update membership plan",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * GET /api/dashboard/users/:id/membership — Membership & payment audit
 * (master admin only, read-only). Root account may be viewed, never edited.
 */
export const getUserMembershipAudit = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const target = await User.findById(id);
    if (!target) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    const latestPayment = await Payment.findOne({
      userId: target._id,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .lean();

    const effectiveExpiry =
      target.subscriptionExpiryDate || target.membershipExpiresAt || null;

    return res.status(200).json(
      successResponse("Membership audit retrieved successfully", {
        membership: {
          userId: target._id.toString(),
          name: target.name,
          email: target.email,
          plan: target.plan,
          billingCycle: latestPayment?.billingCycle || null,
          transactionId: latestPayment?.transactionId || null,
          gateway: latestPayment?.gateway || target.paymentMethod || null,
          amountBDT: latestPayment?.amountBDT ?? target.totalPaidBDT ?? 0,
          subscriptionStartDate:
            latestPayment?.subscriptionStartDate?.toISOString() || null,
          subscriptionExpiryDate: effectiveExpiry
            ? new Date(effectiveExpiry).toISOString()
            : null,
          invoiceNumber: latestPayment?.invoiceNumber || null,
          status: target.status,
        },
      }),
    );
  } catch (error: any) {
    console.error("Error in getUserMembershipAudit:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve membership audit",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * PATCH /api/users/profile/health-metrics
 * Sync calculated BMR and TDEE to the authenticated user's profile
 */
export const updateHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || (req as any).user?.id;

    if (!userId) {
      return res.status(401).json(errorResponse("Unauthorized", "", 401));
    }

    const { bmr, tdee } = req.body;

    if (
      typeof bmr !== "number" ||
      typeof tdee !== "number" ||
      bmr <= 0 ||
      tdee <= 0
    ) {
      return res
        .status(400)
        .json(errorResponse("Valid BMR and TDEE are required", "", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    return res.status(200).json(
      successResponse("Health metrics updated successfully", {
        bmr: updatedUser.bmr,
        tdee: updatedUser.tdee,
      }),
    );
  } catch (error: any) {
    console.error("Error in updateHealthMetrics:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update health metrics",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * PATCH /api/users/profile/hydration-target
 * Sync calculated hydration target to the authenticated user's profile
 */
export const updateHydrationTarget = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId || (req as any).user?.id;

    if (!userId) {
      return res.status(401).json(errorResponse("Unauthorized", "", 401));
    }

    const { hydrationTargetLiters } = req.body;

    if (
      typeof hydrationTargetLiters !== "number" ||
      !Number.isFinite(hydrationTargetLiters) ||
      hydrationTargetLiters <= 0 ||
      hydrationTargetLiters > 15
    ) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Valid hydration target between 0 and 15 liters is required",
            "",
            400,
          ),
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          hydrationTargetLiters: Math.round(hydrationTargetLiters * 100) / 100,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    return res.status(200).json(
      successResponse("Hydration target updated successfully", {
        hydrationTargetLiters: updatedUser.hydrationTargetLiters,
      }),
    );
  } catch (error: any) {
    console.error("Error in updateHydrationTarget:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update hydration target",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * PATCH /api/users/profile or PATCH /api/dashboard/profile
 * Update authenticated user's own profile (name, phone, assignedBranch, fitnessGoal, weight, targetWeight)
 */
export const updateOwnProfile = async (req: AuthRequest, res: Response) => {
  try {
    const authUser = req.user || (req as any).user;
    const userId = authUser?.userId || authUser?.id || authUser?._id;

    if (!userId) {
      return res.status(401).json(errorResponse("Unauthorized", "", 401));
    }

    const {
      name,
      phone,
      assignedBranch,
      fitnessGoal,
      weight,
      targetWeight,
      height,
      gender,
      bio,
      avatarUrl,
      image,
    } = req.body;

    const updateFields: Record<string, any> = {};
    if (typeof name === "string" && name.trim()) {
      updateFields.name = name.trim();
    }
    if (typeof phone === "string" && phone.trim()) {
      updateFields.phone = phone.trim();
    }
    if (typeof assignedBranch === "string" && assignedBranch.trim()) {
      updateFields.assignedBranch = assignedBranch.trim();
      updateFields.assignedBranchSlug = assignedBranch
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
    }
    if (typeof fitnessGoal === "string" && fitnessGoal.trim()) {
      updateFields.fitnessGoal = fitnessGoal.trim();
    }
    if (
      typeof weight === "number" ||
      (typeof weight === "string" &&
        !isNaN(Number(weight)) &&
        Number(weight) > 0)
    ) {
      updateFields.weight = Number(weight);
    }
    if (
      typeof targetWeight === "number" ||
      (typeof targetWeight === "string" &&
        !isNaN(Number(targetWeight)) &&
        Number(targetWeight) > 0)
    ) {
      updateFields.targetWeight = Number(targetWeight);
    }
    if (
      typeof height === "number" ||
      (typeof height === "string" &&
        !isNaN(Number(height)) &&
        Number(height) > 0)
    ) {
      updateFields.height = Number(height);
    }
    if (typeof gender === "string" && gender.trim()) {
      updateFields.gender = gender.trim();
    }
    if (typeof bio === "string") {
      updateFields.bio = bio.trim();
    }
    if (typeof avatarUrl === "string" && avatarUrl.trim()) {
      updateFields.avatarUrl = avatarUrl.trim();
      updateFields.image = avatarUrl.trim();
    } else if (typeof image === "string" && image.trim()) {
      updateFields.avatarUrl = image.trim();
      updateFields.image = image.trim();
    }

    let updatedUser = null;
    if (mongoose.Types.ObjectId.isValid(String(userId))) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true },
      ).select("-passwordHash");
    }

    if (!updatedUser && authUser?.email) {
      updatedUser = await User.findOneAndUpdate(
        { email: authUser.email },
        { $set: updateFields },
        { new: true, runValidators: true },
      ).select("-passwordHash");
    }

    if (!updatedUser) {
      return res.status(404).json(errorResponse("User not found", "", 404));
    }

    return res.status(200).json(
      successResponse("Profile updated successfully", {
        user: updatedUser,
      }),
    );
  } catch (error: any) {
    console.error("Error in updateOwnProfile:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update profile",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * GET /api/users/activity/streak
 * GET /api/dashboard/activity/streak
 * Authoritative dynamic streak engine & activity heatmap data aggregator.
 * Calculates consecutive active days, longest streak, total activity,
 * and compiles daily activity history across WorkoutLog, BranchCheckin, and StopwatchSession.
 */
export const getUserActivityStreak = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const rawUserId =
      authUser?.userId ||
      authUser?.id ||
      authUser?._id ||
      (req.query.userId as string) ||
      "guest_user";

    const userEmail = authUser?.email || (req.query.email as string);

    // 1. Resolve User Document from Database
    const userQuery: any[] = [];
    if (mongoose.Types.ObjectId.isValid(String(rawUserId))) {
      userQuery.push({ _id: new mongoose.Types.ObjectId(String(rawUserId)) });
    }
    if (rawUserId && rawUserId !== "guest_user") {
      userQuery.push({ email: String(rawUserId).toLowerCase() });
    }
    if (userEmail) {
      userQuery.push({ email: String(userEmail).toLowerCase() });
    }

    let targetUser =
      userQuery.length > 0 ? await User.findOne({ $or: userQuery }) : null;

    // Build conditions to query all activity models
    const userMatchConditions: any[] = [];
    if (targetUser?._id) {
      userMatchConditions.push({ userId: targetUser._id });
      userMatchConditions.push({ userId: targetUser._id.toString() });
    }
    if (rawUserId && rawUserId !== "guest_user") {
      userMatchConditions.push({ userId: String(rawUserId) });
    }
    if (targetUser?.email) {
      userMatchConditions.push({ userId: targetUser.email.toLowerCase() });
    }

    // 2. Query Activities from all 3 dynamic collections
    const [workouts, checkins, stopwatchSessions] = await Promise.all([
      userMatchConditions.length > 0
        ? WorkoutLog.find({ $or: userMatchConditions })
            .sort({ date: -1, createdAt: -1 })
            .lean()
        : [],
      targetUser
        ? BranchCheckin.find({
            $or: [
              { userId: targetUser._id },
              ...(targetUser.email
                ? [{ memberEmail: targetUser.email.toLowerCase() }]
                : []),
            ],
          })
            .sort({ checkInTime: -1 })
            .lean()
        : [],
      targetUser
        ? StopwatchSession.find({ userId: targetUser._id })
            .sort({ completedAt: -1, createdAt: -1 })
            .lean()
        : [],
    ]);

    // 3. Helper to format local YYYY-MM-DD
    const toDateKey = (val: any): string => {
      if (!val) return "";
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      } catch {
        return "";
      }
    };

    // 4. Group all activities by date key
    const activityMap: Record<
      string,
      {
        date: string;
        count: number;
        workoutsCount: number;
        checkinsCount: number;
        stopwatchCount: number;
        durationMinutes: number;
        caloriesBurned: number;
      }
    > = {};

    const recordActivity = (
      rawDate: any,
      type: "workout" | "checkin" | "stopwatch",
      duration = 0,
      calories = 0,
    ) => {
      const dateKey = toDateKey(rawDate);
      if (!dateKey) return;

      if (!activityMap[dateKey]) {
        activityMap[dateKey] = {
          date: dateKey,
          count: 0,
          workoutsCount: 0,
          checkinsCount: 0,
          stopwatchCount: 0,
          durationMinutes: 0,
          caloriesBurned: 0,
        };
      }

      activityMap[dateKey].count += 1;
      activityMap[dateKey].durationMinutes += Number(duration) || 0;
      activityMap[dateKey].caloriesBurned += Number(calories) || 0;

      if (type === "workout") activityMap[dateKey].workoutsCount += 1;
      if (type === "checkin") activityMap[dateKey].checkinsCount += 1;
      if (type === "stopwatch") activityMap[dateKey].stopwatchCount += 1;
    };

    workouts.forEach((w: any) => {
      recordActivity(
        w.date || w.createdAt,
        "workout",
        w.durationMinutes,
        w.caloriesBurned,
      );
    });

    checkins.forEach((c: any) => {
      recordActivity(
        c.date || c.checkInTime || c.createdAt,
        "checkin",
        c.durationMinutes,
        0,
      );
    });

    stopwatchSessions.forEach((s: any) => {
      recordActivity(
        s.completedAt || s.createdAt,
        "stopwatch",
        s.durationMinutes,
        s.caloriesBurned,
      );
    });

    // 5. Calculate Streaks accurately using Calendar Days
    const sortedDates = Object.keys(activityMap).sort(); // ascending "YYYY-MM-DD"
    const now = new Date();
    const todayKey = toDateKey(now);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);

    let currentStreak = 0;
    let longestStreak = 0;

    if (sortedDates.length > 0) {
      // Check if user was active either today or yesterday
      const hasToday = !!activityMap[todayKey];
      const hasYesterday = !!activityMap[yesterdayKey];

      if (hasToday || hasYesterday) {
        // Start counting backwards from the most recent anchor (today or yesterday)
        let anchorDate = hasToday ? new Date(now) : new Date(yesterday);
        while (true) {
          const key = toDateKey(anchorDate);
          if (activityMap[key]) {
            currentStreak += 1;
            anchorDate.setDate(anchorDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Compute longest streak across all history
      const epochDays = sortedDates.map((dk) => {
        const [y, m, d] = dk.split("-").map(Number);
        return Math.round(Date.UTC(y, m - 1, d) / (1000 * 60 * 60 * 24));
      });

      let tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < epochDays.length; i++) {
        if (epochDays[i] === epochDays[i - 1] + 1) {
          tempStreak += 1;
        } else if (epochDays[i] > epochDays[i - 1] + 1) {
          tempStreak = 1;
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    const totalActiveDays = sortedDates.length;
    const totalWorkouts = workouts.length;
    const totalCheckins = checkins.length;
    const totalStopwatchSessions = stopwatchSessions.length;
    const totalMinutes =
      workouts.reduce(
        (sum: number, w: any) => sum + (Number(w.durationMinutes) || 0),
        0,
      ) +
      checkins.reduce(
        (sum: number, c: any) => sum + (Number(c.durationMinutes) || 0),
        0,
      ) +
      stopwatchSessions.reduce(
        (sum: number, s: any) => sum + (Number(s.durationMinutes) || 0),
        0,
      );

    const totalCaloriesBurned =
      workouts.reduce(
        (sum: number, w: any) => sum + (Number(w.caloriesBurned) || 0),
        0,
      ) +
      stopwatchSessions.reduce(
        (sum: number, s: any) => sum + (Number(s.caloriesBurned) || 0),
        0,
      );

    // Consistency score (last 30 days)
    let activeDaysLast30 = 0;
    for (let i = 0; i < 30; i++) {
      const pastD = new Date(now);
      pastD.setDate(pastD.getDate() - i);
      const pastKey = toDateKey(pastD);
      if (activityMap[pastKey]) activeDaysLast30 += 1;
    }
    const consistencyScore = Math.round((activeDaysLast30 / 30) * 100);

    // Milestone Badges
    const milestones = [
      {
        id: "starter",
        name: "First Step",
        targetDays: 1,
        achieved: totalActiveDays >= 1,
        icon: "👟",
      },
      {
        id: "streak_3",
        name: "3-Day Fire",
        targetDays: 3,
        achieved: longestStreak >= 3 || currentStreak >= 3,
        icon: "🔥",
      },
      {
        id: "streak_7",
        name: "Weekly Warrior",
        targetDays: 7,
        achieved: longestStreak >= 7 || currentStreak >= 7,
        icon: "⚡",
      },
      {
        id: "streak_14",
        name: "Fortnight Beast",
        targetDays: 14,
        achieved: longestStreak >= 14 || currentStreak >= 14,
        icon: "🏆",
      },
      {
        id: "streak_30",
        name: "Monthly Master",
        targetDays: 30,
        achieved: longestStreak >= 30 || currentStreak >= 30,
        icon: "👑",
      },
      {
        id: "streak_60",
        name: "60-Day Titan",
        targetDays: 60,
        achieved: longestStreak >= 60 || currentStreak >= 60,
        icon: "🛡️",
      },
      {
        id: "streak_100",
        name: "Century Legend",
        targetDays: 100,
        achieved: longestStreak >= 100 || currentStreak >= 100,
        icon: "💎",
      },
    ];

    const nextMilestone =
      milestones.find((m) => !m.achieved) || milestones[milestones.length - 1];

    // Build structured array for GitHub-style heatmap (past 180 days)
    const heatmapDays: Array<{
      date: string;
      count: number;
      level: 0 | 1 | 2 | 3;
      workouts: number;
      checkins: number;
      stopwatch: number;
      minutes: number;
      calories: number;
    }> = [];

    const DAYS_TO_SHOW = 180; // ~6 months
    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const k = toDateKey(d);
      const rec = activityMap[k];
      const count = rec?.count || 0;
      let level: 0 | 1 | 2 | 3 = 0;
      if (count === 1) level = 1;
      else if (count >= 2 && count <= 3) level = 2;
      else if (count >= 4) level = 3;

      heatmapDays.push({
        date: k,
        count,
        level,
        workouts: rec?.workoutsCount || 0,
        checkins: rec?.checkinsCount || 0,
        stopwatch: rec?.stopwatchCount || 0,
        minutes: rec?.durationMinutes || 0,
        calories: rec?.caloriesBurned || 0,
      });
    }

    // 6. Persist currentStreak in User Model to keep all views synchronized
    if (targetUser && targetUser.attendanceStreakDays !== currentStreak) {
      targetUser.attendanceStreakDays = currentStreak;
      await targetUser.save({ validateModifiedOnly: true });
    }

    return res.status(200).json(
      successResponse("User activity and streak calculated successfully", {
        currentStreak,
        longestStreak,
        totalActiveDays,
        totalWorkouts,
        totalCheckins,
        totalStopwatchSessions,
        totalMinutes,
        totalCaloriesBurned,
        consistencyScore,
        todayActive: !!activityMap[todayKey],
        lastActiveDate: sortedDates[sortedDates.length - 1] || null,
        milestones,
        nextMilestone: {
          name: nextMilestone.name,
          targetDays: nextMilestone.targetDays,
          daysLeft: Math.max(0, nextMilestone.targetDays - currentStreak),
        },
        heatmapDays,
      }),
    );
  } catch (error: any) {
    console.error("[getUserActivityStreak] Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to calculate user activity streak",
          error.message || "Internal Server Error",
          500,
        ),
      );
  }
};

/**
 * Save or update a card on the authenticated user's profile
 * POST /api/users/saved-card
 */
export const saveSavedCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Unauthorized", "UNAUTHORIZED", 401));
    }
    const { last4, brand, expiryMonth, expiryYear, cardHolder, token } =
      req.body;
    if (!last4 || !brand || !expiryMonth || !expiryYear || !cardHolder) {
      return res
        .status(400)
        .json(errorResponse("Missing card details", "VALIDATION_ERROR", 400));
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(errorResponse("User not found", "NOT_FOUND", 404));
    }
    user.savedCard = {
      last4,
      brand,
      expiryMonth,
      expiryYear,
      cardHolder,
      token,
      savedAt: new Date(),
    };
    await user.save({ validateModifiedOnly: true });
    return res.status(200).json(
      successResponse("Card saved successfully", {
        savedCard: {
          last4,
          brand,
          expiryMonth,
          expiryYear,
          cardHolder,
          savedAt: user.savedCard.savedAt,
        },
      }),
    );
  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse("Failed to save card", error.message, 500));
  }
};

/**
 * Remove saved card from authenticated user's profile
 * DELETE /api/users/saved-card
 */
export const deleteSavedCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json(errorResponse("Unauthorized", "UNAUTHORIZED", 401));
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(errorResponse("User not found", "NOT_FOUND", 404));
    }
    user.savedCard = undefined;
    await user.save({ validateModifiedOnly: true });
    return res
      .status(200)
      .json(successResponse("Card removed successfully", {}));
  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse("Failed to remove card", error.message, 500));
  }
};

export default {
  getDashboardStats,
  getPlatformStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  extendUserMembership,
  updateUserMembershipPlan,
  getUserMembershipAudit,
  updateHealthMetrics,
  updateHydrationTarget,
  updateOwnProfile,
  getUserActivityStreak,
  saveSavedCard,
  deleteSavedCard,
};
