import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import AuditLog from "../models/AuditLog.model";
import { User, UserRole } from "../models/User.model";

const editableRoles: UserRole[] = ["master_admin", "branch_admin", "athlete"];

const publicUser = (user: any) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    assignedBranch: user.assignedBranch,
    plan: user.plan,
    status: user.status,
    totalPaidBDT: user.totalPaidBDT,
    createdAt: user.createdAt,
});

const validObjectId = (id: string) => mongoose.isValidObjectId(id);

export const listUsers = async (req: Request, res: Response) => {
    try {
        const page = Math.max(Number.parseInt(String(req.query.page || "1"), 10) || 1, 1);
        const limit = Math.min(Math.max(Number.parseInt(String(req.query.limit || "20"), 10) || 20, 1), 100);
        const filter: Record<string, unknown> = {};

        if (req.query.search) {
            const search = String(req.query.search).trim();
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        if (req.query.branch) filter.assignedBranch = String(req.query.branch);
        if (req.query.role) {
            if (!editableRoles.includes(String(req.query.role) as UserRole)) {
                return res.status(400).json({ success: false, message: "Invalid role filter" });
            }
            filter.role = String(req.query.role);
        }

        const [users, total] = await Promise.all([
            User.find(filter).select("-passwordHash").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            User.countDocuments(filter),
        ]);

        return res.json({ success: true, data: { users: users.map(publicUser), pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
    } catch (error) {
        console.error("User directory query failed:", error);
        return res.status(500).json({ success: false, message: "Failed to load user directory" });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role, assignedBranch } = req.body;
        if (!validObjectId(id)) return res.status(400).json({ success: false, message: "Invalid user id" });
        if (!editableRoles.includes(role)) return res.status(400).json({ success: false, message: "Role must be master_admin, branch_admin, or athlete" });

        const target = await User.findById(id);
        if (!target) return res.status(404).json({ success: false, message: "User not found" });
        if (target.email.toLowerCase() === "master@fitora.com") return res.status(403).json({ success: false, message: "Master Admin is immutable" });

        const previous = { role: target.role, assignedBranch: target.assignedBranch };
        target.role = role;
        if (assignedBranch !== undefined) target.assignedBranch = String(assignedBranch).trim();
        await target.save();
        await AuditLog.create({ actorId: req.user!.userId, action: "USER_ROLE_UPDATED", targetId: id, metadata: { previous, next: { role: target.role, assignedBranch: target.assignedBranch } } });

        return res.json({ success: true, message: "User role updated", data: publicUser(target) });
    } catch (error) {
        console.error("User role update failed:", error);
        return res.status(500).json({ success: false, message: "Failed to update user role" });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!validObjectId(id)) return res.status(400).json({ success: false, message: "Invalid user id" });
        const target = await User.findById(id);
        if (!target) return res.status(404).json({ success: false, message: "User not found" });
        if (target.email.toLowerCase() === "master@fitora.com") return res.status(403).json({ success: false, message: "Master Admin is immutable" });

        await target.deleteOne();
        await AuditLog.create({ actorId: req.user!.userId, action: "USER_DELETED", targetId: id, metadata: { email: target.email, role: target.role } });
        return res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("User deletion failed:", error);
        return res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};