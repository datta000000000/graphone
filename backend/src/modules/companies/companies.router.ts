import { Router } from 'express';
import { CompaniesController } from './companies.controller';
import { validate } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';
import {
  listCompaniesQuerySchema,
  companySlugParamsSchema,
  createCompanySchema,
} from './companies.schema';

const router = Router();
const controller = new CompaniesController();

// GET /api/v1/companies/trending (must be registered before /:slug)
router.get('/trending', controller.getTrending);

// GET /api/v1/companies
router.get('/', validate({ query: listCompaniesQuerySchema }), controller.list);

// GET /api/v1/companies/:slug/graph
router.get('/:slug/graph', validate({ params: companySlugParamsSchema }), controller.getEcosystemGraph);

// GET /api/v1/companies/:slug
router.get('/:slug', validate({ params: companySlugParamsSchema }), controller.findBySlug);

// POST /api/v1/companies (requires authentication API key)
router.post('/', authMiddleware, validate({ body: createCompanySchema }), controller.create);

export const companiesRouter = router;
