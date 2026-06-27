import { Router } from 'express';
import { StatsController } from './stats.controller';

const router = Router();
const controller = new StatsController();

// GET /api/v1/stats
router.get('/', controller.getStats);

export const statsRouter = router;
