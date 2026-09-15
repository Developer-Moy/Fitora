import { Request, Response } from "express";
import Goal from "../models/Goal.model";
import WorkoutLog from "../models/WorkoutLog.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * Automatically completes a goal when progress reaches target.
 */
const applyGoalCompletion = (goal: any) => {
  const currentValue = Number(goal.currentValue) || 0;
  const targetValue = Number(goal.targetValue) || 0;

  if (
    targetValue > 0 &&
    currentValue >= targetValue &&
    goal.status !== "completed"
  ) {
    goal.status = "completed";
    goal.archivedAt = new Date();
  }

  return goal;
};

export const createOrUpdateGoal = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      targetWeight,
      weeklyWorkoutFrequency,
      currentValue,
      targetValue,
      goalType,
      bmr,
      tdee,
      targetCalories,
      macros,
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json(errorResponse("userId is required", "VALIDATION_ERROR", 400));
    }

    const existingGoal = await Goal.findOne({ userId });

    const normalizeGoalType = (gt?: string) => {
      if (!gt) return undefined;
      const lower = gt.toLowerCase();
      if (lower === "bulking") return "Bulking";
      if (lower === "cutting") return "Cutting";
      if (lower === "recomp") return "Recomp";
      if (lower === "maintenance") return "Maintenance";
      return gt;
    };

    const goalData: any = {
      userId,
      targetWeight,
      weeklyWorkoutFrequency,
      currentValue:
        currentValue !== undefined
          ? Number(currentValue)
          : (existingGoal?.currentValue ?? 0),
      targetValue:
        targetValue !== undefined
          ? Number(targetValue)
          : (existingGoal?.targetValue ?? targetWeight ?? 0),
      goalType:
        normalizeGoalType(goalType) || existingGoal?.goalType || "Maintenance",
      bmr: bmr !== undefined ? Number(bmr) : (existingGoal?.bmr ?? 1800),
      tdee: tdee !== undefined ? Number(tdee) : (existingGoal?.tdee ?? 2200),
      targetCalories:
        targetCalories !== undefined
          ? Number(targetCalories)
          : (existingGoal?.targetCalories ?? 2200),
      macros:
        macros !== undefined
          ? macros
          : (existingGoal?.macros ?? { protein: 140, carbs: 220, fat: 65 }),
    };

    // Auto-complete when target is reached
    if (
      goalData.targetValue > 0 &&
      goalData.currentValue >= goalData.targetValue
    ) {
      goalData.status = "completed";
      goalData.archivedAt = existingGoal?.archivedAt || new Date();
    } else {
      goalData.status = "active";
      goalData.archivedAt = null;
    }

    const goal = await Goal.findOneAndUpdate({ userId }, goalData, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json(
        successResponse(
          goal?.status === "completed"
            ? "Goal completed and archived automatically"
            : "Goal created or updated successfully",
          goal,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to create/update goal",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

export const getGoal = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const goal = await Goal.findOne({ userId });

    if (!goal) {
      return res
        .status(404)
        .json(errorResponse("Goal not found", "GOAL_NOT_FOUND", 404));
    }

    // Check completion whenever goal is retrieved
    applyGoalCompletion(goal);

    if (goal.isModified()) {
      await goal.save();
    }

    const workouts = await WorkoutLog.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    let activeStreak = 0;
    let totalVolumeLifted = 0;

    if (workouts.length > 0) {
      activeStreak = 1;

      for (let i = 0; i < workouts.length - 1; i++) {
        const currentDate =
          (workouts[i] as any).createdAt ||
          (workouts[i] as any).date ||
          new Date();
        const previousDate =
          (workouts[i + 1] as any).createdAt ||
          (workouts[i + 1] as any).date ||
          new Date();

        const current = new Date(currentDate).getTime();
        const previous = new Date(previousDate).getTime();

        const gapHours = (current - previous) / (1000 * 60 * 60);

        if (gapHours <= 48) {
          activeStreak++;
        } else {
          break;
        }
      }

      for (const workout of workouts as any[]) {
        if (Array.isArray(workout.sets)) {
          for (const set of workout.sets) {
            totalVolumeLifted +=
              (Number(set.weight) || 0) * (Number(set.reps) || 0);
          }
        } else {
          totalVolumeLifted +=
            (Number(workout.setsCount) || 1) *
            (Number(workout.repsCount) || 10) *
            (Number(workout.weight) || 0);
        }
      }
    }

    const milestones = [7, 14, 30, 60, 100];

    const achievedMilestone =
      milestones.filter((milestone) => activeStreak >= milestone).pop() || null;

    return res.status(200).json(
      successResponse("Goal retrieved successfully", {
        goal,
        activeStreak,
        totalVolumeLifted,
        milestone: {
          achieved: achievedMilestone !== null,
          current: achievedMilestone,
        },
      }),
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to get goal",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!goal) {
      return res
        .status(404)
        .json(errorResponse("Goal not found", "GOAL_NOT_FOUND", 404));
    }

    // Update only supplied fields
    Object.assign(goal, req.body);

    // Normalize numeric values
    if (req.body.currentValue !== undefined) {
      goal.currentValue = Number(req.body.currentValue);
    }

    if (req.body.targetValue !== undefined) {
      goal.targetValue = Number(req.body.targetValue);
    }

    // Auto-complete / archive
    applyGoalCompletion(goal);

    await goal.save();

    return res
      .status(200)
      .json(
        successResponse(
          goal.status === "completed"
            ? "Goal completed and archived automatically"
            : "Goal updated successfully",
          goal,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update goal",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      return res
        .status(404)
        .json(errorResponse("Goal not found", "GOAL_NOT_FOUND", 404));
    }

    return res
      .status(200)
      .json(successResponse("Goal deleted successfully", goal));
  } catch (error) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to delete goal",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

// Active Goals
export const getActiveGoals = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const goals = await Goal.find({
      userId,
      status: "active",
    }).sort({ createdAt: -1 });

    return res.status(200).json(
      successResponse("Active goals retrieved successfully", {
        goals,
        count: goals.length,
      }),
    );
  } catch (error) {
    console.error("[Goal Controller] getActiveGoals Error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to get active goals",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

// Completed / Archived Goals
export const getArchivedGoals = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const goals = await Goal.find({
      userId,
      status: "completed",
    }).sort({ archivedAt: -1 });

    return res.status(200).json(
      successResponse("Archived goals retrieved successfully", {
        goals,
        count: goals.length,
      }),
    );
  } catch (error) {
    console.error("[Goal Controller] getArchivedGoals Error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to get archived goals",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};
