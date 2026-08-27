import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Goal from "../models/Goal.model";
import WorkoutLog from "../models/WorkoutLog.model";

export const createOrUpdateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { fitnessGoal, targetWeight, weeklyWorkoutFrequency, strengthTarget } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });

    const goal = await Goal.findOneAndUpdate(
      { userId },
      {
        userId,
        fitnessGoal,
        targetWeight,
        weeklyWorkoutFrequency,
        strengthTarget,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
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

export const getGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId || (req.params.userId && req.params.userId !== userId)) {
      return res.status(403).json({ success: false, message: "You can only access your own goals" });
    }

    const goal = await Goal.findOne({ userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
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

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndUpdate({ _id: id, userId: req.user?.userId }, req.body, {
      new: true,
      runValidators: true,
    });

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

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.user?.userId });

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
