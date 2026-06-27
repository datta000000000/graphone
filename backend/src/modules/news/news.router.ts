import { Router } from 'express';
import { NewsController } from './news.controller';
import { validate } from '../../middleware/validate';
import { listNewsQuerySchema } from './news.schema';

const router = Router();
const controller = new NewsController();

// GET /api/v1/news/trending (must be registered before /)
router.get('/trending', controller.getTrending);

// GET /api/v1/news
router.get('/', validate({ query: listNewsQuerySchema }), controller.list);

export const newsRouter = router;
