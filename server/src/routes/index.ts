import { Router } from "express";
import workoutRoutes from "./workout.routes.js";
import aiRoutes from "./ai.routes.js";

const apiRouter = Router();

apiRouter.use("/workouts", workoutRoutes);
apiRouter.use("/ai", aiRoutes);

export default apiRouter;
