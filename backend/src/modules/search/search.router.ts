import { Router } from 'express';
import { SearchController } from './search.controller';

const router = Router();
const controller = new SearchController();

// GET /api/v1/search?q=
router.get('/', controller.search);

export const searchRouter = router;
