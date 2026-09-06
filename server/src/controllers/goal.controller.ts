import { Request, Response } from "express";
import Goal from "../models/Goal.model";
import WorkoutLog from "../models/WorkoutLog.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

export const createOrUpdateGoal = async (req: Request, res: Response) => {
  try {
    const { userId, targetWeight, weeklyWorkoutFrequency } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { userId },
      {
        userId,
        targetWeight,
        weeklyWorkoutFrequency,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json(
      successResponse("Goal created or updated successfully", goal)
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Failed to create/update goal",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};

export const getGoal = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const goal = await Goal.findOne({ userId });

    if (!goal) {
      return res.status(404).json(
        errorResponse("Goal not found", "GOAL_NOT_FOUND", 404)
      );
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
      })
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Failed to get goal",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
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
      return res.status(404).json(
        errorResponse("Goal not found", "GOAL_NOT_FOUND", 404)
      );
    }

    return res.status(200).json(
      successResponse("Goal updated successfully", goal)
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Failed to update goal",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      return res.status(404).json(
        errorResponse("Goal not found", "GOAL_NOT_FOUND", 404)
      );
    }

    return res.status(200).json(
      successResponse("Goal deleted successfully", goal)
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Failed to delete goal",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};
