import { supabase } from '../../config/db';
import { AppError } from '../../lib/errors';

export interface AppStats {
  companiesCount: number;
  investorsCount: number;
  fundingTotal: number;
  productsCount: number;
  unicornsCount: number;
}

export class StatsRepository {
  /**
   * Fetches aggregate statistics from the database.
   */
  async getStats(): Promise<AppStats> {
    const [compRes, invRes, prodRes, uniRes] = await Promise.all([
      // 1. Companies count & sum of funding
      supabase
        .from('companies')
        .select('funding_total', { count: 'exact' }),

      // 2. Investors count
      supabase
        .from('investors')
        .select('*', { count: 'exact', head: true }),

      // 3. Products count
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true }),

      // 4. Unicorns count
      supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_unicorn', true),
    ]);

    if (compRes.error) throw new AppError(`Stats calculation failed: ${compRes.error.message}`, 500);
    if (invRes.error) throw new AppError(`Stats calculation failed: ${invRes.error.message}`, 500);
    if (prodRes.error) throw new AppError(`Stats calculation failed: ${prodRes.error.message}`, 500);
    if (uniRes.error) throw new AppError(`Stats calculation failed: ${uniRes.error.message}`, 500);

    const companiesCount = compRes.count || 0;
    const investorsCount = invRes.count || 0;
    const productsCount = prodRes.count || 0;
    const unicornsCount = uniRes.count || 0;

    // Calculate total funding amount sum from fetched rows
    const companiesData = compRes.data || [];
    const fundingTotal = companiesData.reduce((sum, c) => sum + (Number(c.funding_total) || 0), 0);

    return {
      companiesCount,
      investorsCount,
      fundingTotal,
      productsCount,
      unicornsCount,
    };
  }
}
