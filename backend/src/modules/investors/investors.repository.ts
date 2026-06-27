import { supabase } from '../../config/db';
import { Investor, InvestorDetail, CompanyInvestment, RecentInvestment, PortfolioSlice } from '../../types';
import { AppError } from '../../lib/errors';
import { parseCursor } from '../../lib/pagination';

export class InvestorsRepository {
  /**
   * Lists investors with filtering and pagination.
   */
  async list(filters: {
    type?: string;
    stage_focus?: string;
    limit: number;
    cursor?: string;
  }): Promise<{ items: Investor[]; total: number; nextCursor: string | null }> {
    let query = supabase.from('investors').select('*', { count: 'exact' });

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.stage_focus) {
      // Check if stage_focus array in DB contains the filtered stage
      query = query.contains('stage_focus', [filters.stage_focus]);
    }

    // Decode cursor
    const parsedCursor = parseCursor(filters.cursor);
    if (parsedCursor) {
      const lastVal = Number(parsedCursor.lastValue);
      const lastId = parsedCursor.lastId;
      query = query.or(`portfolio_count.lt.${lastVal},and(portfolio_count.eq.${lastVal},id.lt.${lastId})`);
    }

    // Default sorting by portfolio_count DESC
    query = query
      .order('portfolio_count', { ascending: false })
      .order('id', { ascending: false })
      .limit(filters.limit + 1);

    const { data, count, error } = await query;
    if (error) {
      throw new AppError(`Failed to fetch investors: ${error.message}`, 500);
    }

    const items = (data || []) as Investor[];
    const total = count || 0;

    let nextCursor: string | null = null;
    if (items.length > filters.limit) {
      const nextItem = items.pop()!;
      nextCursor = Buffer.from(
        JSON.stringify({ lastValue: nextItem.portfolio_count, lastId: nextItem.id })
      ).toString('base64');
    }

    return {
      items,
      total,
      nextCursor,
    };
  }

  /**
   * Finds the most active investors ranked by deal count in the last 90 days.
   */
  async getMostActive(): Promise<Investor[]> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const dateStr = ninetyDaysAgo.toISOString().split('T')[0];

    // Fetch all investments in last 90 days
    const { data: deals, error } = await supabase
      .from('investor_portfolio')
      .select('investor_id, investors (*)')
      .gte('invested_at', dateStr);

    if (error) {
      throw new AppError(`Failed to fetch active deals: ${error.message}`, 500);
    }

    // Aggregate deal counts
    const counts = new Map<string, { investor: Investor; count: number }>();
    (deals || []).forEach((d: any) => {
      if (d.investors) {
        const inv = d.investors as Investor;
        const current = counts.get(inv.id) || { investor: inv, count: 0 };
        current.count += 1;
        counts.set(inv.id, current);
      }
    });

    // Sort by count DESC and map back to Investor array
    const sorted = Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .map((item) => item.investor);

    // If no deals in 90 days (e.g. fresh database), fall back to top by portfolio_count
    if (sorted.length === 0) {
      const { data: fallback, error: fallErr } = await supabase
        .from('investors')
        .select('*')
        .order('portfolio_count', { ascending: false })
        .limit(10);
      if (fallErr) throw new AppError(fallErr.message, 500);
      return (fallback || []) as Investor[];
    }

    return sorted.slice(0, 10);
  }

  /**
   * Finds an investor by slug and aggregates their details and portfolio.
   */
  async findBySlug(slug: string): Promise<InvestorDetail> {
    // 1. Fetch main investor details
    const { data: investor, error: invErr } = await supabase
      .from('investors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (invErr || !investor) {
      throw new AppError(`Investor with slug "${slug}" not found`, 404, 'NOT_FOUND');
    }

    const investorId = investor.id;

    // Run remaining portfolio queries in parallel
    const [portfolioRes, concentrationRes] = await Promise.all([
      // Fetch portfolio company investments
      supabase
        .from('investor_portfolio')
        .select('round_type, invested_at, is_lead, company:companies (id, name, slug, logo_url, category, stage)')
        .eq('investor_id', investorId)
        .order('invested_at', { ascending: false }),

      // Fetch portfolio concentration slices
      supabase
        .from('portfolio_concentration')
        .select('*')
        .eq('investor_id', investorId)
        .order('percentage', { ascending: false }),
    ]);

    // Extract portfolio items
    const portfolio: CompanyInvestment[] = (portfolioRes.data || [])
      .filter((row: any) => row.company)
      .map((row: any) => ({
        company: row.company,
        round_type: row.round_type,
        invested_at: row.invested_at,
        is_lead: row.is_lead,
      }));

    const portfolio_concentration = (concentrationRes.data || []) as PortfolioSlice[];

    // 2. Fetch co-investors: investors who have invested in the same companies
    const companyIds = portfolio.map((p) => p.company.id);
    let co_investors: Pick<Investor, 'id' | 'name' | 'slug' | 'logo_url'>[] = [];

    if (companyIds.length > 0) {
      const { data: coInvData, error: coErr } = await supabase
        .from('investor_portfolio')
        .select('investors (id, name, slug, logo_url)')
        .in('company_id', companyIds)
        .neq('investor_id', investorId)
        .limit(10);

      if (!coErr && coInvData) {
        const uniqueCo = new Map<string, any>();
        coInvData.forEach((row: any) => {
          if (row.investors) {
            uniqueCo.set(row.investors.id, row.investors);
          }
        });
        co_investors = Array.from(uniqueCo.values()).slice(0, 5);
      }
    }

    // 3. Construct recent investments (last 5 deals)
    // For each company investment, we fetch the corresponding funding round amount
    const recentInvestmentsData = portfolio.slice(0, 5);
    const recent_investments: RecentInvestment[] = [];

    if (recentInvestmentsData.length > 0) {
      const recentCompanyIds = recentInvestmentsData.map((p) => p.company.id);
      const { data: rounds } = await supabase
        .from('funding_rounds')
        .select('company_id, round_type, amount')
        .in('company_id', recentCompanyIds);

      const roundAmountMap = new Map<string, number>();
      (rounds || []).forEach((r) => {
        roundAmountMap.set(`${r.company_id}:${r.round_type}`, r.amount);
      });

      recentInvestmentsData.forEach((p) => {
        const amountKey = `${p.company.id}:${p.round_type}`;
        recent_investments.push({
          company_name: p.company.name,
          company_logo: p.company.logo_url,
          category: p.company.category,
          round_type: p.round_type,
          amount: roundAmountMap.get(amountKey) || 0,
          date: p.invested_at,
          is_lead: p.is_lead,
        });
      });
    }

    // 4. Construct deal counts by year
    const yearCounts = new Map<number, number>();
    portfolio.forEach((p) => {
      if (p.invested_at) {
        const year = new Date(p.invested_at).getFullYear();
        yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
      }
    });

    const deal_counts_by_year = Array.from(yearCounts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year);

    return {
      ...(investor as Investor),
      portfolio,
      co_investors,
      investment_thesis: investor.investment_thesis || '',
      portfolio_concentration,
      recent_investments,
      deal_counts_by_year,
    };
  }
}
