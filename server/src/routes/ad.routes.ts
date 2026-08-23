import { Router } from "express";
import { trackAdClick } from "../controllers/ad.controller.js";

const router = Router();

router.post("/click", trackAdClick);

export default router;

