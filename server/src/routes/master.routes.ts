import { Router } from "express";
import { getMasterOverview, getMasterRevenue } from "../controllers/master.controller";
import { authMiddleware, requireMasterAdmin } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware, requireMasterAdmin);
router.get("/overview", getMasterOverview);
router.get("/revenue", getMasterRevenue);
export default router;