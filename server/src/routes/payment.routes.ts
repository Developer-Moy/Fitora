import { Router } from "express";
import {
  checkoutPayment,
  getMyTransactions,
  getAllPayments,
} from "../controllers/payment.controller";

const router = Router();

// Process checkout and upgrade membership plan
router.post("/checkout", checkoutPayment);

// Retrieve transaction history for user/member
router.get("/my-transactions", getMyTransactions);

// Retrieve all platform transactions (Admin telemetry)
router.get("/all", getAllPayments);

export default router;
