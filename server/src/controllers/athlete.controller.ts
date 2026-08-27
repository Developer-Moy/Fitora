import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import HydrationLog from "../models/HydrationLog.model";
import { User } from "../models/User.model";
import UserTier from "../models/UserTier.model";
import WorkoutLog from "../models/WorkoutLog.model";

const hydrationGoalLiters = 3.5;

const today = () => new Date().toISOString().slice(0, 10);

const getWorkoutStreak = async (userId: string) => {
    const workouts = await WorkoutLog.find({ userId }).select("date createdAt").sort({ date: -1, createdAt: -1 }).lean();
    const workoutDays = new Set(
        workouts.map((workout) => new Date(workout.date || workout.createdAt || Date.now()).toISOString().slice(0, 10)),
    );

    let streak = 0;
    const current = new Date();
    while (workoutDays.has(current.toISOString().slice(0, 10))) {
        streak += 1;
        current.setUTCDate(current.getUTCDate() - 1);
    }
    return streak;
};

export const getAthleteStats = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });

    try {
        const [user, hydration, streak] = await Promise.all([
            User.findById(userId).select("name email plan status assignedBranch").lean(),
            HydrationLog.findOne({ userId, date: today() }).lean(),
            getWorkoutStreak(userId),
        ]);
        if (!user) return res.status(404).json({ success: false, message: "Athlete not found" });

        return res.json({
            success: true,
            data: {
                streakDays: streak,
                hydration: { date: today(), liters: hydration?.liters || 0, goalLiters: hydrationGoalLiters },
                membership: { plan: user.plan, isVip: user.plan === "VIP Ultimate" },
            },
        });
    } catch (error) {
        console.error("Athlete stats query failed:", error);
        return res.status(500).json({ success: false, message: "Failed to load athlete stats" });
    }
};

export const addHydration = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const liters = Number(req.body.liters ?? req.body.amount ?? 0);
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    if (!Number.isFinite(liters) || liters <= 0 || liters > hydrationGoalLiters) {
        return res.status(400).json({ success: false, message: "Hydration increment must be greater than 0 and at most 3.5 liters" });
    }

    try {
        const hydration = await HydrationLog.findOneAndUpdate(
            { userId, date: today() },
            { $inc: { liters }, $min: { liters: hydrationGoalLiters } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
        );
        return res.json({ success: true, data: { ...hydration.toObject(), goalLiters: hydrationGoalLiters } });
    } catch (error) {
        console.error("Hydration update failed:", error);
        return res.status(500).json({ success: false, message: "Failed to update hydration" });
    }
};

export const upgradeVip = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });

    try {
        const user = await User.findByIdAndUpdate(userId, { plan: "VIP Ultimate" }, { new: true, runValidators: true })
            .select("name email plan status")
            .lean();
        if (!user) return res.status(404).json({ success: false, message: "Athlete not found" });

        await UserTier.findOneAndUpdate(
            { userId },
            { userId, tier: "vip", startDate: new Date(), isActive: true },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
        );
        return res.json({ success: true, data: { user, tier: "vip", isVip: true } });
    } catch (error) {
        console.error("VIP upgrade failed:", error);
        return res.status(500).json({ success: false, message: "Failed to upgrade membership" });
    }
};