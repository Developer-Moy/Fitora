import { Router } from "express";
import { createSessionBooking, getBookedSlots } from "../controllers/sessionBooking.controller";

const router = Router();

router.post("/", createSessionBooking);
router.get("/booked-slots", getBookedSlots);

export default router;
