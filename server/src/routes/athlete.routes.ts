import { Router } from "express";
import { addHydration, getAthleteStats, upgradeVip } from "../controllers/athlete.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.get("/stats", getAthleteStats);
router.patch("/hydration", addHydration);
router.post("/upgrade-vip", upgradeVip);

export default router;