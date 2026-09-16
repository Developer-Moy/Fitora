import { Router } from 'express';
import { getTrainers } from '../controllers/trainer.controller';

const router = Router();

// Public route to fetch trainers for the homepage
router.get('/', getTrainers);

export default router;
