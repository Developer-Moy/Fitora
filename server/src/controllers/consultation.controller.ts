import { Request, Response } from "express";
import { Consultation } from "../models/Consultation.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * 1. Public: Create Consultation / Inquiry Lead (`POST /api/consultations`)
 */
export const createLead = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      selectedClass,
      preferredBranch,
      preferredProgram,
      comment,
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required fields.",
      });
    }

    const lead = await Consultation.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      selectedClass: selectedClass || "General Fitness & Gym Access",
      preferredBranch: preferredBranch || "Dhaka - Gulshan-2 Branch (Flagship)",
      preferredProgram: preferredProgram || "Standard Membership",
      comment: comment?.trim() || "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your fitness inquiry has been submitted. A trainer will reach out shortly.",
      data: lead,
    });
  } catch (error: any) {
    console.error("Error creating consultation lead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while recording consultation lead.",
      error: error.message,
    });
  }
};

/**
 * 2. Protected: Get All Consultation Leads (`GET /api/consultations`)
 */
export const getAllLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = "50", page = "1" } = req.query;

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Consultation.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Consultation.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: leads.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: leads,
    });
  } catch (error: any) {
    console.error("Error fetching consultation leads:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching consultation leads.",
      error: error.message,
    });
  }
};

/**
 * 3. Protected: Update Lead Status (`PATCH /api/consultations/:id/status`)
 */
export const updateLeadStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "contacted", "enrolled", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value provided.",
      });
    }

    const lead = await Consultation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Consultation lead record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}.`,
      data: lead,
    });
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating lead status.",
      error: error.message,
    });
  }
};

/**
 * 4. Protected: Delete Consultation Lead (`DELETE /api/consultations/:id`)
 */
export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Consultation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Consultation lead record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation lead deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting consultation lead.",
      error: error.message,
    });
  }
};

export default {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
};
