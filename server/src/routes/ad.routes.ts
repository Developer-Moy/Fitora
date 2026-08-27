import { Router } from "express";
import {
  getPublicAds,
  createAd,
  updateAd,
  deleteAd,
  trackAdClick,
} from "../controllers/ad.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// Public Routes
router.get("/", getPublicAds);
router.post("/click", trackAdClick);

// Protected Admin Campaign Management
router.post("/", authMiddleware, requireAdminOrBranchAdmin, createAd);
router.patch("/:id", authMiddleware, requireAdminOrBranchAdmin, updateAd);
router.delete("/:id", authMiddleware, requireAdminOrBranchAdmin, deleteAd);

export default router;
