import { Request, Response, NextFunction } from 'express';
import { CompaniesService } from './companies.service';
import { sendSuccess } from '../../lib/response';

export class CompaniesController {
  private companiesService = new CompaniesService();

  /**
   * GET /api/v1/companies
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;
      const { items, total, nextCursor } = await this.companiesService.list({
        category: filters.category,
        stage: filters.stage,
        country: filters.country,
        sort: filters.sort,
        limit: filters.limit,
        cursor: filters.cursor,
      });

      sendSuccess(res, items, 200, { total, cursor: nextCursor });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/companies/trending
   */
  getTrending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.companiesService.getTrending();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/companies/:slug
   */
  findBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const data = await this.companiesService.findBySlug(slug);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/companies
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyData = req.body;
      const data = await this.companiesService.create(companyData);
      sendSuccess(res, data, 201);
    } catch (error) {
      next(error);
    }
  };
}
