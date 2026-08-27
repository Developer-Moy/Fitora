import { Request, Response } from "express";
import Branch from "../models/Branch.model";
import Checkin from "../models/Checkin.model";
import { User } from "../models/User.model";

export const getBranchAdminOverview = async (_req: Request, res: Response) => {
    try {
        const branches = await Branch.aggregate([
            { $lookup: { from: User.collection.name, localField: "name", foreignField: "assignedBranch", as: "members" } },
            { $lookup: { from: Checkin.collection.name, let: { branchId: "$branchId" }, pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$branchId", "$$branchId"] }, { $eq: ["$status", "active"] }] } } }, { $count: "count" }], as: "live" } },
            {
                $project: {
                    _id: 0, branchId: 1, name: 1, division: 1, district: 1, address: 1,
                    manager: { name: "$managerName", email: "$managerEmail", phone: "$managerPhone" },
                    maxCapacity: 1, status: 1, totalMembers: { $size: "$members" },
                    activeMembers: { $size: { $filter: { input: "$members", as: "member", cond: { $eq: ["$$member.status", "active"] } } } },
                    liveCapacity: { $ifNull: [{ $arrayElemAt: ["$live.count", 0] }, 0] },
                },
            },
            { $sort: { division: 1, district: 1 } },
        ]);
        return res.json({ success: true, data: { totalBranches: branches.length, branches } });
    } catch (error) {
        console.error("Branch overview query failed:", error);
        return res.status(500).json({ success: false, message: "Failed to load branch overview" });
    }
};