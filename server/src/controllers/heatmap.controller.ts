import { Request, Response } from "express";
import mongoose from "mongoose";
import Heatmap, { IHeatmap } from "../models/Heatmap.model";
import WorkoutLog from "../models/WorkoutLog.model";
import User from "../models/User.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * Normalizes any Date or string into a standardized calendar representation:
 * - dateStr: "YYYY-MM-DD"
 * - dateObj: Midnight Date object in UTC
 * - year: Number (e.g. 2026)
 */
export function normalizeDateKey(inputDate?: Date | string | null): {
  dateStr: string;
  dateObj: Date;
  year: number;
} {
  if (typeof inputDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(inputDate.trim())) {
    const cleanStr = inputDate.trim();
    const year = parseInt(cleanStr.slice(0, 4), 10);
    const dateObj = new Date(`${cleanStr}T00:00:00.000Z`);
    return { dateStr: cleanStr, dateObj, year };
  }

  const d = inputDate ? new Date(inputDate) : new Date();
  const valid = isNaN(d.getTime()) ? new Date() : d;
  const y = valid.getFullYear();
  const m = String(valid.getMonth() + 1).padStart(2, "0");
  const day = String(valid.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${day}`;
  const dateObj = new Date(`${dateStr}T00:00:00.000Z`);
  return { dateStr, dateObj, year: y };
}

/**
 * Helper: Record or increment a daily Heatmap document.
 * Uses atomic MongoDB operators ($inc, $addToSet, $setOnInsert) with upsert.
 */
export async function recordHeatmapActivityHelper(params: {
  userId: string;
  exerciseName?: string;
  date?: string | Date | null;
  durationMinutes?: number;
  caloriesBurned?: number;
}): Promise<IHeatmap | null> {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (!isDbConnected) {
    console.warn("[Heatmap Helper] MongoDB not connected; skipping heatmap sync.");
    return null;
  }

  const targetUserId = String(params.userId || "guest_user").trim();
  const exerciseName = String(params.exerciseName || "Workout").trim();
  const { dateStr, dateObj, year } = normalizeDateKey(params.date);
  const duration = Math.max(0, Number(params.durationMinutes) || 0);
  const calories = Math.max(0, Number(params.caloriesBurned) || 0);

  const updated = await Heatmap.findOneAndUpdate(
    { userId: targetUserId, date: dateStr },
    {
      $inc: {
        activityCount: 1,
        totalDuration: duration,
        totalCalories: calories,
      },
      $addToSet: {
        exercises: exerciseName,
      },
      $setOnInsert: {
        userId: targetUserId,
        date: dateStr,
        dateObj,
        year,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: false }
  );

  return updated;
}

/**
 * Helper: Synchronize Heatmap when a WorkoutLog is deleted.
 * Decrements the daily activity, removes the exercise name if no remaining logs
 * on that date have it, and removes the Heatmap document if count drops to 0.
 */
export async function syncHeatmapOnWorkoutDeleted(params: {
  userId: string | any;
  date?: string | Date | null;
  exerciseName: string;
}): Promise<void> {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (!isDbConnected) return;

  const targetUserId = String(params.userId || "guest_user").trim();
  const { dateStr } = normalizeDateKey(params.date);

  // Find all remaining WorkoutLog records for this user on this exact calendar date
  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

  const remainingLogs = await WorkoutLog.find({
    userId: params.userId,
    $or: [
      { date: { $gte: dayStart, $lte: dayEnd } },
      { createdAt: { $gte: dayStart, $lte: dayEnd } },
    ],
  }).lean();

  if (!remainingLogs || remainingLogs.length === 0) {
    // No workouts left on this date -> delete the daily Heatmap record
    await Heatmap.findOneAndDelete({
      userId: targetUserId,
      date: dateStr,
    });
  } else {
    // Recalculate ground truth from remaining logs for this date
    const distinctExercises = Array.from(
      new Set(remainingLogs.map((l) => l.exerciseName).filter(Boolean))
    );
    const totalDuration = remainingLogs.reduce(
      (sum, l) => sum + (Number(l.durationMinutes) || 0),
      0
    );
    const totalCalories = remainingLogs.reduce(
      (sum, l) => sum + (Number(l.caloriesBurned) || 0),
      0
    );

    await Heatmap.findOneAndUpdate(
      { userId: targetUserId, date: dateStr },
      {
        $set: {
          activityCount: remainingLogs.length,
          exercises: distinctExercises,
          totalDuration,
          totalCalories,
        },
      }
    );
  }
}

/**
 * Calculate consecutive daily active streak backwards from today or yesterday
 */
function calculateStreakFromRecords(
  activeDatesSet: Set<string>,
  todayKey: string
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = normalizeDateKey(yesterday).dateStr;

  const workedToday = activeDatesSet.has(todayKey);
  const workedYesterday = activeDatesSet.has(yesterdayKey);

  if (!workedToday && !workedYesterday) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(today);

  if (workedToday) {
    while (true) {
      const key = normalizeDateKey(cursor).dateStr;
      if (activeDatesSet.has(key)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    cursor.setDate(cursor.getDate() - 1);
    while (true) {
      const key = normalizeDateKey(cursor).dateStr;
      if (activeDatesSet.has(key)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return streak;
}

/**
 * GET /api/heatmap
 * Retrieve aggregated daily heatmap records for a given user and year.
 */
export const getHeatmapData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, year } = req.query;
    const authUser = (req as any).user;

    const targetUserId =
      (userId as string) ||
      authUser?.userId ||
      authUser?.id ||
      "guest_user";

    const currentYear = new Date().getFullYear();
    const selectedYear = parseInt(year as string, 10) || currentYear;

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(200).json(
        successResponse("Heatmap data retrieved (offline fallback)", {
          userId: targetUserId,
          year: selectedYear,
          totalWorkoutsInYear: 0,
          activeDaysInYear: 0,
          currentStreak: 0,
          availableYears: [currentYear, currentYear - 1],
          days: [],
        })
      );
    }

    // Build user match conditions supporting ObjectId and email aliasing
    const userConditions: string[] = [targetUserId];
    if (targetUserId !== "guest_user") {
      try {
        let userDoc = null;
        if (mongoose.Types.ObjectId.isValid(targetUserId)) {
          userDoc = await User.findById(targetUserId).select("_id email");
        } else if (targetUserId.includes("@")) {
          userDoc = await User.findOne({
            email: targetUserId.toLowerCase(),
          }).select("_id email");
        }

        if (userDoc) {
          if (userDoc.email && !userConditions.includes(userDoc.email)) {
            userConditions.push(userDoc.email);
          }
          const idStr = userDoc._id.toString();
          if (!userConditions.includes(idStr)) {
            userConditions.push(idStr);
          }
        }
      } catch {}
    }

    // Query Heatmap records for the selected year
    let records = await Heatmap.find({
      userId: { $in: userConditions },
      year: selectedYear,
    })
      .sort({ date: 1 })
      .lean();

    // If no user-specific records found, also check guest_user so local/guest workout activity always displays
    if (records.length === 0) {
      const guestRecords = await Heatmap.find({
        userId: "guest_user",
        year: selectedYear,
      })
        .sort({ date: 1 })
        .lean();
      if (guestRecords.length > 0) {
        records = guestRecords;
        if (!userConditions.includes("guest_user")) {
          userConditions.push("guest_user");
        }
      }
    }

    // Query distinct available years across all history for this user
    const dbYears = await Heatmap.distinct("year", {
      userId: { $in: userConditions },
    });
    const yearSet = new Set<number>([currentYear, currentYear - 1]);
    for (const yr of dbYears) {
      if (typeof yr === "number" && !isNaN(yr)) {
        yearSet.add(yr);
      }
    }
    const availableYears = Array.from(yearSet).sort((a, b) => b - a);

    // Also fetch all active dates across the user's history to calculate active streak
    const allActiveDates = await Heatmap.find({
      userId: { $in: userConditions },
    })
      .select("date activityCount")
      .lean();

    const activeDatesSet = new Set<string>();
    for (const item of allActiveDates) {
      if (item.activityCount > 0 && item.date) {
        activeDatesSet.add(item.date);
      }
    }

    const todayKey = normalizeDateKey(new Date()).dateStr;
    const currentStreak = calculateStreakFromRecords(activeDatesSet, todayKey);

    // Compute year totals
    const totalWorkoutsInYear = records.reduce(
      (sum, r) => sum + (r.activityCount || 0),
      0
    );
    const activeDaysInYear = records.filter(
      (r) => (r.activityCount || 0) > 0
    ).length;

    const days = records.map((r) => ({
      date: r.date,
      count: r.activityCount,
      exercises: r.exercises || [],
      totalDuration: r.totalDuration || 0,
      totalCalories: r.totalCalories || 0,
    }));

    return res.status(200).json(
      successResponse("Heatmap retrieved successfully", {
        userId: targetUserId,
        year: selectedYear,
        totalWorkoutsInYear,
        activeDaysInYear,
        currentStreak,
        availableYears,
        days,
      })
    );
  } catch (error) {
    console.error("[Heatmap Controller] getHeatmapData Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch activity heatmap data",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};

/**
 * POST /api/heatmap/activity
 * Standalone endpoint to record an activity directly into the Heatmap collection.
 */
export const recordActivity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, exerciseName, date, durationMinutes, caloriesBurned } =
      req.body;
    const authUser = (req as any).user;

    const finalUserId =
      userId ||
      authUser?.userId ||
      authUser?.id ||
      "guest_user";

    const finalExercise =
      exerciseName && typeof exerciseName === "string" && exerciseName.trim()
        ? exerciseName.trim()
        : "Workout";

    const record = await recordHeatmapActivityHelper({
      userId: finalUserId,
      exerciseName: finalExercise,
      date,
      durationMinutes,
      caloriesBurned,
    });

    return res.status(201).json(
      successResponse("Heatmap activity recorded successfully", record)
    );
  } catch (error) {
    console.error("[Heatmap Controller] recordActivity Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to record heatmap activity",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};
