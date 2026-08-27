import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import Branch from "../models/Branch.model";
import ConsultationLead, { ConsultationLeadStatus } from "../models/ConsultationLead.model";
import { User } from "../models/User.model";

const canAccessBranch = (req: AuthRequest, branchId: string) =>
    req.user?.role === "master_admin" || req.user?.role === "admin" || req.user?.role === "branch_admin" && req.user.assignedBranch === branchId;

const findBranch = (branchId: string) => Branch.findOne({ branchId }).lean();

export const getBranchOverview = async (req: AuthRequest, res: Response) => {
    const { branchId } = req.params;
    if (!canAccessBranch(req, branchId)) {
        return res.status(403).json({ success: false, message: "Forbidden: branch access required" });
    }

    try {
        const branch = await findBranch(branchId);
        if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });

        const [members, trainers, activeMemberCount] = await Promise.all([
            User.find({ assignedBranch: branchId, role: { $in: ["user", "athlete"] } })
                .select("name email role plan status createdAt")
                .sort({ name: 1 })
                .lean(),
            User.find({ assignedBranch: branchId, role: "trainer" })
                .select("name email status")
                .sort({ name: 1 })
                .lean(),
            User.countDocuments({ assignedBranch: branchId, role: { $in: ["user", "athlete"] }, status: "active" }),
        ]);

        return res.json({
            success: true,
            data: { branch, activeMemberCount, totalMembers: members.length, members, trainers },
        });
    } catch (error) {
        console.error("Branch overview query failed:", error);
        return res.status(500).json({ success: false, message: "Failed to load branch overview" });
    }
};

export const getBranchLeads = async (req: AuthRequest, res: Response) => {
    const { branchId } = req.params;
    if (!canAccessBranch(req, branchId)) {
        return res.status(403).json({ success: false, message: "Forbidden: branch access required" });
    }

    try {
        const branch = await findBranch(branchId);
        if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });

        const status = req.query.status ? String(req.query.status) : undefined;
        if (status && !["new", "contacted", "enrolled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid lead status" });
        }

        const search = req.query.search ? String(req.query.search).trim() : "";
        const filter: Record<string, unknown> = { branchId };
        if (status) filter.status = status;
        if (search) filter.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];

        const leads = await ConsultationLead.find(filter).sort({ createdAt: -1 }).lean();
        return res.json({ success: true, data: { branchId, total: leads.length, leads } });
    } catch (error) {
        console.error("Branch leads query failed:", error);
        return res.status(500).json({ success: false, message: "Failed to load branch leads" });
    }
};

export const updateBranchLeadStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status?: ConsultationLeadStatus };
    if (!status || !["contacted", "enrolled"].includes(status)) {
        return res.status(400).json({ success: false, message: "Status must be contacted or enrolled" });
    }
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: "Invalid lead id" });
    }

    try {
        const lead = await ConsultationLead.findById(id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        if (!canAccessBranch(req, lead.branchId)) {
            return res.status(403).json({ success: false, message: "Forbidden: branch access required" });
        }

        lead.status = status;
        await lead.save();
        return res.json({ success: true, data: lead });
    } catch (error) {
        console.error("Branch lead status update failed:", error);
        return res.status(500).json({ success: false, message: "Failed to update branch lead" });
    }
};