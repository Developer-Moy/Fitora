import express from "express";
import { getDashboardStats } from "../controllers/user.controller";

const router = express.Router();

router.get('/', getDashboardStats);

export default router;