import { Router } from "express";

import {
  getExercises,
  getExerciseById,
} from "../controllers/exercise.controller";

const router = Router();

router.get("/", getExercises);

router.get("/:id", getExerciseById);

/**
 * @task Backend Dev 2: Register POST route for creating exercises
 * - Import `createExercise` from controller.
 * - Import `authMiddleware` and `requireAdminOrBranchAdmin` from auth middleware.
 * - Create POST `/` route using these middlewares and controller.
 */
// DEV 2: Add router.post("/", ...) here

export default router;