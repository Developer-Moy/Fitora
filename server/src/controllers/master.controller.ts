import { Request, Response } from "express";
import Checkin from "../models/Checkin.model";
import { User } from "../models/User.model";

const databaseError = (res: Response, error: unknown) => {
    console.error("Master dashboard query failed:", error);
    return res.status(500).json({ success: false, message: "Failed to load master dashboard data" });
};

export const getMasterOverview = async (_req: Request, res: Response) => {
    try {
        const [members, revenue, liveCheckins, trainers] = await Promise.all([
            User.aggregate([
                { $match: { role: { $in: ["athlete", "user", "premium_user", "free_user"] } } },
                { $group: { _id: null, totalMembers: { $sum: 1 }, activeMembers: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } } } },
            ]),
            User.aggregate([{ $match: { status: "active" } }, { $group: { _id: null, total: { $sum: "$totalPaidBDT" } } }]),
            Checkin.countDocuments({ status: "active" }),
            User.countDocuments({ role: "trainer", status: "active" }),
        ]);

        return res.json({
            success: true,
            data: {
                totalActiveMembers: members[0]?.activeMembers || 0,
                totalMembers: members[0]?.totalMembers || 0,
                nationwideRevenueBDT: revenue[0]?.total || 0,
                liveCheckins,
                activeTrainers: trainers,
            },
        });
    } catch (error) {
        return databaseError(res, error);
    }
};

export const getMasterRevenue = async (_req: Request, res: Response) => {
    try {
        const [packages, monthly] = await Promise.all([
            User.aggregate([
                { $match: { plan: { $in: ["Basic Pass", "Pro Athlete", "VIP Ultimate"] } } },
                { $group: { _id: "$plan", memberCount: { $sum: 1 }, revenueBDT: { $sum: "$totalPaidBDT" } } },
                { $sort: { revenueBDT: -1 } },
            ]),
            User.aggregate([
                { $match: { totalPaidBDT: { $gt: 0 }, createdAt: { $type: "date" } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenueBDT: { $sum: "$totalPaidBDT" } } },
                { $sort: { _id: 1 } },
            ]),
        ]);
        const totalRevenue = packages.reduce((sum, item) => sum + item.revenueBDT, 0);

        return res.json({
            success: true,
            data: {
                totalRevenueBDT: totalRevenue,
                packages: packages.map((item) => ({
                    plan: item._id,
                    memberCount: item.memberCount,
                    revenueBDT: item.revenueBDT,
                    percentage: totalRevenue ? Number(((item.revenueBDT / totalRevenue) * 100).toFixed(2)) : 0,
                })),
                monthlyRevenue: monthly.map((item) => ({ month: item._id, revenueBDT: item.revenueBDT })),
            },
        });
    } catch (error) {
        return databaseError(res, error);
    }
};