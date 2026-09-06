import { Router } from "express";
import { globalSearch } from "../controllers/search.controller";

const router = Router();

// GET /api/search?q=...
router.get("/", globalSearch);

export default router;
