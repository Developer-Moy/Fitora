import { Router } from "express";

import {
  createCheckoutSession,
  verifySession,
  checkoutPayment,
  getMyTransactions,
  getAllPayments,
  getInvoiceById,
  toggleAutoRenew,
  changeMembershipPlan,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

router.get("/verify-session", authMiddleware, verifySession);

router.post("/checkout", authMiddleware, checkoutPayment);

router.get("/me", authMiddleware, getMyTransactions);

router.get("/my-transactions", authMiddleware, getMyTransactions);

router.get("/all", authMiddleware, getAllPayments);

// Digital Invoice by ID or Transaction ID
router.get("/invoice/:id", authMiddleware, getInvoiceById);

// Auto-Renewal and Subscription Management
router.post("/toggle-auto-renew", authMiddleware, toggleAutoRenew);
router.post("/change-plan", authMiddleware, changeMembershipPlan);

export default router;
