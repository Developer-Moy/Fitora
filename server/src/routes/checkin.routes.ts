import { Router } from "express";
import { checkoutMember, createCheckin, getLiveCheckins } from "../controllers/checkin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.post("/", createCheckin);
router.post("/checkout", checkoutMember);
router.get("/live/:branchId", getLiveCheckins);

export default router;