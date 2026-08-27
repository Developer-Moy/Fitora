import { Router } from "express";
import { deleteUser, listUsers, updateUserRole } from "../controllers/userManagement.controller";
import { authMiddleware, requireMasterAdmin } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware, requireMasterAdmin);
router.get("/", listUsers);
router.patch("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);
export default router;