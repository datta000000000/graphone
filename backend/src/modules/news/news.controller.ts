import { Request, Response, NextFunction } from 'express';
import { NewsRepository } from './news.repository';
import { sendSuccess } from '../../lib/response';

export class NewsController {
  private newsRepository = new NewsRepository();

  /**
   * GET /api/v1/news
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;
      const { items, total, nextCursor } = await this.newsRepository.list({
        tag: filters.tag,
        limit: filters.limit,
        cursor: filters.cursor,
      });

      sendSuccess(res, items, 200, { total, cursor: nextCursor });
    } catch (error) {
      next(error);
    }
  };
}
