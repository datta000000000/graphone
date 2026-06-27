import { Request, Response, NextFunction } from 'express';
import { NewsRepository } from './news.repository';
import { sendSuccess } from '../../lib/response';
import { cache } from '../../lib/cache';
import { NewsArticle } from '../../types';

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

  /**
   * GET /api/v1/news/trending
   */
  getTrending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cacheKey = 'news:trending';
      const cached = cache.get<NewsArticle[]>(cacheKey);

      if (cached) {
        sendSuccess(res, cached);
        return;
      }

      const data = await this.newsRepository.getTrending();
      // Cache trending news for 2 minutes (120 seconds)
      cache.set(cacheKey, data, 120);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };
}
