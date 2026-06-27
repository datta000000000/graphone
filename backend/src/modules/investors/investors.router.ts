import { Router } from 'express';
import { InvestorsController } from './investors.controller';
import { validate } from '../../middleware/validate';
import {
  listInvestorsQuerySchema,
  investorSlugParamsSchema,
} from './investors.schema';

const router = Router();
const controller = new InvestorsController();

// GET /api/v1/investors/most-active (must be registered before /:slug)
router.get('/most-active', controller.getMostActive);

// GET /api/v1/investors
router.get('/', validate({ query: listInvestorsQuerySchema }), controller.list);

// GET /api/v1/investors/:slug
router.get('/:slug', validate({ params: investorSlugParamsSchema }), controller.findBySlug);

export const investorsRouter = router;
