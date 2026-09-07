import { Router } from "express";

import {
  createCheckoutSession,
  verifySession,
  checkoutPayment,
  getMyTransactions,
  getAllPayments,
  getInvoiceById,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession,
);

router.get(
  "/verify-session",
  authMiddleware,
  verifySession,
);

router.post(
  "/checkout",
  authMiddleware,
  checkoutPayment,
);

router.get(
  "/me",
  authMiddleware,
  getMyTransactions,
);

router.get(
  "/my-transactions",
  authMiddleware,
  getMyTransactions,
);

router.get(
  "/invoice/:id",
  authMiddleware,
  getInvoiceById,
);

// Digital Invoice by ID or Transaction ID
router.get("/invoice/:id", authMiddleware, getInvoiceById);

export default router;