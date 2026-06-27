import { supabase } from '../../config/db';
import { Company, Investor, Product } from '../../types';
import { AppError } from '../../lib/errors';

export interface UnifiedSearchResult {
  companies: Company[];
  investors: Investor[];
  products: Product[];
}

export class SearchRepository {
  /**
   * Search across companies, investors, and products using ILIKE matchers.
   */
  async search(q: string): Promise<UnifiedSearchResult> {
    const searchPattern = `%${q}%`;

    // Query across entities in parallel
    const [companiesRes, investorsRes, productsRes] = await Promise.all([
      supabase
        .from('companies')
        .select('*')
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(10),
      supabase
        .from('investors')
        .select('*')
        .or(`name.ilike.${searchPattern},bio.ilike.${searchPattern}`)
        .limit(10),
      supabase
        .from('products')
        .select('*, companies (name, logo_url)')
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(10),
    ]);

    if (companiesRes.error) {
      throw new AppError(`Search failed in companies: ${companiesRes.error.message}`, 500);
    }
    if (investorsRes.error) {
      throw new AppError(`Search failed in investors: ${investorsRes.error.message}`, 500);
    }
    if (productsRes.error) {
      throw new AppError(`Search failed in products: ${productsRes.error.message}`, 500);
    }

    return {
      companies: (companiesRes.data || []) as Company[],
      investors: (investorsRes.data || []) as Investor[],
      products: (productsRes.data || []) as Product[],
    };
  }
}
