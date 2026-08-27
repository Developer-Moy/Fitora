import { Router } from "express";
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
} from "../controllers/ad.controller";
import {
  authMiddleware,
  requireAdminOrBranchAdmin,
} from "../middlewares/auth.middleware";

const router = Router();

// Public: Subscribe from Footer
router.post("/subscribe", subscribeNewsletter);

// Protected: Admin Subscriber List
router.get(
  "/subscribers",
  authMiddleware,
  requireAdminOrBranchAdmin,
  getNewsletterSubscribers,
);

export default router;
