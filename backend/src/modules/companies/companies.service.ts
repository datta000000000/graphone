import { CompaniesRepository } from './companies.repository';
import { Company, CompanyDetail } from '../../types';
import { cache } from '../../lib/cache';

export class CompaniesService {
  private companiesRepository = new CompaniesRepository();

  /**
   * Lists companies with filters and pagination.
   */
  async list(filters: {
    category?: string;
    stage?: string;
    country?: string;
    sort: 'trending' | 'funded' | 'new';
    limit: number;
    cursor?: string;
  }): Promise<{ items: Company[]; total: number; nextCursor: string | null }> {
    return this.companiesRepository.list(filters);
  }

  /**
   * Retrieves the top 10 trending companies, using a 5-minute cache.
   */
  async getTrending(): Promise<Company[]> {
    const cacheKey = 'companies:trending';
    const cachedData = cache.get<Company[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const trendingCompanies = await this.companiesRepository.getTrending();
    // Cache for 5 minutes (300 seconds)
    cache.set(cacheKey, trendingCompanies, 300);

    return trendingCompanies;
  }

  /**
   * Retrieves detail view for a company by its slug.
   */
  async findBySlug(slug: string): Promise<CompanyDetail> {
    return this.companiesRepository.findBySlug(slug);
  }

  /**
   * Creates a new company and invalidates the trending cache.
   */
  async create(companyData: Partial<Company>): Promise<Company> {
    const newCompany = await this.companiesRepository.create(companyData);
    // Invalidate trending cache
    cache.del('companies:trending');
    return newCompany;
  }
}
