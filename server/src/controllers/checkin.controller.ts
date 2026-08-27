import { Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import { AuthRequest } from "../middlewares/auth.middleware";
import Branch from "../models/Branch.model";
import Checkin from "../models/Checkin.model";
import { User } from "../models/User.model";

const staffRoles = ["admin", "master_admin", "branch_admin"];

const emitAttendanceUpdate = async (req: AuthRequest, branchId: string) => {
    const io = req.app.get("io") as SocketIOServer | undefined;
    if (!io) return;

    const liveCount = await Checkin.countDocuments({ branchId, status: "active" });
    io.emit("member_checkin_update", { branchId, liveCount });
};

const canManageBranch = (req: AuthRequest, branchId: string) =>
    req.user?.role === "master_admin" ||
    req.user?.role === "admin" ||
    (req.user?.role === "branch_admin" && req.user.assignedBranch === branchId);

export const createCheckin = async (req: AuthRequest, res: Response) => {
    const requestedUserId = req.body.userId ? String(req.body.userId).trim() : undefined;
    const branchId = req.body.branchId ? String(req.body.branchId).trim() : "";
    const method = req.body.method || "manual";
    const userId = requestedUserId || req.user?.userId;

    if (!branchId || !userId) {
        return res.status(400).json({ success: false, message: "branchId is required" });
    }
    if (!["qr", "manual", "biometric"].includes(method)) {
        return res.status(400).json({ success: false, message: "Invalid check-in method" });
    }
    if (requestedUserId && !staffRoles.includes(req.user?.role || "")) {
        return res.status(403).json({ success: false, message: "Only staff can check in another member" });
    }
    if (!canManageBranch(req, branchId) && userId !== req.user?.userId) {
        return res.status(403).json({ success: false, message: "Forbidden: branch access required" });
    }

    try {
        const [branch, user, activeCheckin] = await Promise.all([
            Branch.exists({ branchId }),
            User.findById(userId).select("assignedBranch role status").lean(),
            Checkin.findOne({ userId, status: "active" }).lean(),
        ]);
        if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });
        if (!user || user.status !== "active") return res.status(404).json({ success: false, message: "Active member not found" });
        if (!canManageBranch(req, branchId) && user.assignedBranch !== branchId) {
            return res.status(403).json({ success: false, message: "Member is not assigned to this branch" });
        }
        if (activeCheckin) return res.status(409).json({ success: false, message: "Member is already checked in", data: activeCheckin });

        const checkin = await Checkin.create({ userId, branchId, method });
        await emitAttendanceUpdate(req, branchId);
        return res.status(201).json({ success: true, data: checkin });
    } catch (error) {
        console.error("Check-in failed:", error);
        return res.status(500).json({ success: false, message: "Failed to record check-in" });
    }
};

export const checkoutMember = async (req: AuthRequest, res: Response) => {
    const requestedUserId = req.body.userId ? String(req.body.userId).trim() : undefined;
    const userId = requestedUserId || req.user?.userId;
    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });
    if (requestedUserId && !staffRoles.includes(req.user?.role || "")) {
        return res.status(403).json({ success: false, message: "Only staff can check out another member" });
    }

    try {
        const activeCheckin = await Checkin.findOne({ userId, status: "active" });
        if (!activeCheckin) return res.status(404).json({ success: false, message: "Active check-in not found" });
        if (!canManageBranch(req, activeCheckin.branchId) && userId !== req.user?.userId) {
            return res.status(403).json({ success: false, message: "Forbidden: branch access required" });
        }

        const checkedOutAt = new Date();
        activeCheckin.checkedOutAt = checkedOutAt;
        activeCheckin.durationMinutes = Math.max(0, Math.round((checkedOutAt.getTime() - activeCheckin.checkedInAt.getTime()) / 60000));
        activeCheckin.status = "completed";
        await activeCheckin.save();
        await emitAttendanceUpdate(req, activeCheckin.branchId);
        return res.json({ success: true, data: activeCheckin });
    } catch (error) {
        console.error("Check-out failed:", error);
        return res.status(500).json({ success: false, message: "Failed to record check-out" });
    }
};

export const getLiveCheckins = async (req: AuthRequest, res: Response) => {
    const { branchId } = req.params;
    if (!canManageBranch(req, branchId) && req.user?.assignedBranch !== branchId) {
        return res.status(403).json({ success: false, message: "Forbidden: branch access required" });
    }

    try {
        const checkins = await Checkin.find({ branchId, status: "active" }).sort({ checkedInAt: 1 }).lean();
        const memberIds = checkins.map((checkin) => checkin.userId);
        const members = await User.find({ _id: { $in: memberIds } }).select("name email plan").lean();
        const memberById = new Map(members.map((member) => [member._id.toString(), member]));
        const data = checkins.map((checkin) => ({ ...checkin, member: memberById.get(checkin.userId) || null }));
        return res.json({ success: true, data: { branchId, liveCount: data.length, checkins: data } });
    } catch (error) {
        console.error("Live check-ins query failed:", error);
        return res.status(500).json({ success: false, message: "Failed to load live check-ins" });
    }
};