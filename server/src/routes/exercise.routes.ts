import { Router } from "express";

import {
  getExercises,
  getExerciseById,
  createExercise,
} from "../controllers/exercise.controller";
import {authMiddleware, requireAdminOrBranchAdmin} from '../middlewares/auth.middleware';
const router = Router();

router.get("/", getExercises);

router.get("/:id", getExerciseById);


router.post(
  "/",
  authMiddleware,
  requireAdminOrBranchAdmin,
  createExercise
);
export default router;