import { Request, Response, NextFunction } from 'express';
import { ProductsRepository } from './products.repository';
import { sendSuccess } from '../../lib/response';

export class ProductsController {
  private productsRepository = new ProductsRepository();

  /**
   * GET /api/v1/products
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;
      const data = await this.productsRepository.list({
        category: filters.category,
        sort: filters.sort,
      });

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };
}
