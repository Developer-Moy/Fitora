import { Router } from "express";
import {
  registerUser,
  loginUser,
  dashboardLogin,
  getCurrentUser,
  logoutUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/dashboard-login", dashboardLogin);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;
