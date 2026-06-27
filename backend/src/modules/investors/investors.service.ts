import { InvestorsRepository } from './investors.repository';
import { Investor, InvestorDetail } from '../../types';
import { cache } from '../../lib/cache';

export class InvestorsService {
  private investorsRepository = new InvestorsRepository();

  /**
   * Lists investors with filters and pagination.
   */
  async list(filters: {
    type?: string;
    stage_focus?: string;
    limit: number;
    cursor?: string;
  }): Promise<{ items: Investor[]; total: number; nextCursor: string | null }> {
    return this.investorsRepository.list(filters);
  }

  /**
   * Retrieves the most active investors, using a 10-minute cache.
   */
  async getMostActive(): Promise<Investor[]> {
    const cacheKey = 'investors:most-active';
    const cachedData = cache.get<Investor[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const mostActive = await this.investorsRepository.getMostActive();
    // Cache for 10 minutes (600 seconds)
    cache.set(cacheKey, mostActive, 600);

    return mostActive;
  }

  /**
   * Retrieves detail view for an investor by their slug.
   */
  async findBySlug(slug: string): Promise<InvestorDetail> {
    return this.investorsRepository.findBySlug(slug);
  }
}
