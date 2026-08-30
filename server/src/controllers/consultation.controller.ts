import { Request, Response } from "express";
import { Consultation } from "../models/Consultation.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * 1. Public: Create Consultation Lead Inquiry (`POST /api/consultations`)
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
        message: "Full Name and Email are required fields.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    const consultation = await Consultation.create({
      fullName: cleanName,
      email: cleanEmail,
      phone: phone?.trim() || "",
      selectedClass: selectedClass?.trim() || "General Fitness & Gym Access",
      preferredBranch:
        preferredBranch?.trim() || "Dhaka - Gulshan-2 Branch (Flagship)",
      preferredProgram: preferredProgram?.trim() || "Standard Gym Membership",
      comment: comment?.trim() || "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your gym consultation request has been received. Our branch coordinator will contact you shortly.",
      data: consultation,
    });
  } catch (error: any) {
    console.error("Error creating consultation lead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while saving consultation inquiry.",
      error: error.message,
    });
  }
};

/**
 * 2. Protected: Get All Consultation Leads (`GET /api/consultations`)
 */
export const getAllLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { branch, status, search, page = "1", limit = "20" } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (branch && branch !== "All") {
      query.preferredBranch = { $regex: String(branch), $options: "i" };
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: String(search), $options: "i" } },
        { email: { $regex: String(search), $options: "i" } },
        { phone: { $regex: String(search), $options: "i" } },
      ];
    }

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [leads, totalCount] = await Promise.all([
      Consultation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Consultation.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total: totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
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
    const { status, notes } = req.body;

    const validStatuses = ["pending", "contacted", "enrolled", "archived"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: [${validStatuses.join(", ")}]`,
      });
    }

    const lead = await Consultation.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      { new: true },
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Consultation lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation lead status updated successfully.",
      data: lead,
    });
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating lead.",
      error: error.message,
    });
  }
};

/**
 * 4. Protected: Delete Lead (`DELETE /api/consultations/:id`)
 */
export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Consultation.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Consultation lead not found.",
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
      message: "Internal server error while deleting lead.",
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
