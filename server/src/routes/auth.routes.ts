import { Router } from 'express';
import {
  registerUser,
  loginUser,
  dashboardLogin,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/dashboard-login", dashboardLogin);

export default router;