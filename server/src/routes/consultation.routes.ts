import { Router } from "express";
import {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
} from "../controllers/consultation.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// Public: Submit Lead Inquiry from ContactInfoForm.tsx
router.post("/", createLead);

// Protected: Admin Management
router.get("/", authMiddleware, requireAdminOrBranchAdmin, getAllLeads);
router.patch("/:id/status", authMiddleware, requireAdminOrBranchAdmin, updateLeadStatus);
router.delete("/:id", authMiddleware, requireAdminOrBranchAdmin, deleteLead);

export default router;
