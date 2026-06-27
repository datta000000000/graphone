import { Router } from 'express';
import { ProductsController } from './products.controller';
import { validate } from '../../middleware/validate';
import { listProductsQuerySchema } from './products.schema';

const router = Router();
const controller = new ProductsController();

// GET /api/v1/products
router.get('/', validate({ query: listProductsQuerySchema }), controller.list);

export const productsRouter = router;
