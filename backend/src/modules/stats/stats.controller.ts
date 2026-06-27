import { Request, Response, NextFunction } from 'express';
import { StatsRepository, AppStats } from './stats.repository';
import { cache } from '../../lib/cache';
import { sendSuccess } from '../../lib/response';

export class StatsController {
  private statsRepository = new StatsRepository();

  /**
   * GET /api/v1/stats
   */
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cacheKey = 'stats:aggregate';
      const cachedData = cache.get<AppStats>(cacheKey);

      if (cachedData) {
        sendSuccess(res, cachedData);
        return;
      }

      const data = await this.statsRepository.getStats();
      // Cache aggregate stats for 10 minutes (600 seconds)
      cache.set(cacheKey, data, 600);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };
}
