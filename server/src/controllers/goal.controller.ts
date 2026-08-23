import { Request, Response } from "express";
import Goal from "@/models/Goal.models";
import Workout from "@/models/workoutLog.model";

export const createOrUpdateGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      targetWeight,
      weeklyWorkoutFrequency,
    } = req.body;

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
      }
    );

    return res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create/update goal",
    });
  }
};

export const getGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const goal = await Goal.findOne({ userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const workouts = await Workout.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    let activeStreak = 0;
    let totalVolumeLifted = 0;

    if (workouts.length > 0) {
      activeStreak = 1;

      for (let i = 0; i < workouts.length - 1; i++) {
        const current = new Date(
          workouts[i].createdAt
        ).getTime();

        const previous = new Date(
          workouts[i + 1].createdAt
        ).getTime();

        const gapHours =
          (current - previous) / (1000 * 60 * 60);

        if (gapHours <= 48) {
          activeStreak++;
        } else {
          break;
        }
      }

      for (const workout of workouts) {
        if (Array.isArray(workout.sets)) {
          for (const set of workout.sets) {
            totalVolumeLifted +=
              (Number(set.weight) || 0) *
              (Number(set.reps) || 0);
          }
        }
      }
    }

    const milestones = [7, 14, 30, 60, 100];

    const achievedMilestone =
      milestones.filter(
        (milestone) => activeStreak >= milestone
      ).pop() || null;

    return res.status(200).json({
      success: true,
      data: {
        goal,
        activeStreak,
        totalVolumeLifted,
        milestone: {
          achieved: achievedMilestone !== null,
          current: achievedMilestone,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get goal",
    });
  }
};

export const updateGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update goal",
    });
  }
};

export const deleteGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete goal",
    });
  }
};