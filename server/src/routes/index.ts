import { Router } from "express";
import workoutRoutes from "./workout.routes.js";

const apiRouter = Router();

apiRouter.use("/workouts", workoutRoutes);

export default apiRouter;
