import { Request, Response, NextFunction } from 'express';
import { SearchRepository } from './search.repository';
import { sendSuccess, sendError } from '../../lib/response';

export class SearchController {
  private searchRepository = new SearchRepository();

  /**
   * GET /api/v1/search?q=
   */
  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = req.query.q;

      if (!q || typeof q !== 'string') {
        sendError(res, 'Query parameter "q" is required and must be a string', 400, 'VALIDATION_ERROR');
        return;
      }

      const trimmedQ = q.trim();
      if (trimmedQ.length < 1) {
        sendSuccess(res, { companies: [], investors: [], products: [] });
        return;
      }

      const data = await this.searchRepository.search(trimmedQ);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };
}
