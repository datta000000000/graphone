import { Request, Response, NextFunction } from 'express';
import { InvestorsService } from './investors.service';
import { sendSuccess } from '../../lib/response';

export class InvestorsController {
  private investorsService = new InvestorsService();

  /**
   * GET /api/v1/investors
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;
      const { items, total, nextCursor } = await this.investorsService.list({
        type: filters.type,
        stage_focus: filters.stage_focus,
        limit: filters.limit,
        cursor: filters.cursor,
      });

      sendSuccess(res, items, 200, { total, cursor: nextCursor });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/investors/most-active
   */
  getMostActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.investorsService.getMostActive();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/investors/:slug
   */
  findBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const data = await this.investorsService.findBySlug(slug);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };
}
