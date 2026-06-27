import { supabase } from '../../config/db';
import { Company, CompanyDetail, FundingRound, Founder, Product, Investor, TimelineEvent, OwnershipSlice, NewsArticle } from '../../types';
import { AppError } from '../../lib/errors';
import { parseCursor } from '../../lib/pagination';

export class CompaniesRepository {
  /**
   * Lists companies with filtering, sorting, and cursor-based pagination.
   */
  async list(filters: {
    category?: string;
    stage?: string;
    country?: string;
    sort: 'trending' | 'funded' | 'new';
    limit: number;
    cursor?: string;
  }): Promise<{ items: Company[]; total: number; nextCursor: string | null }> {
    let query = supabase.from('companies').select('*', { count: 'exact' });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.stage) {
      query = query.eq('stage', filters.stage);
    }
    if (filters.country) {
      // Case-insensitive match on country
      query = query.ilike('hq_country', `%${filters.country}%`);
    }

    // Decode and apply pagination cursor
    const parsedCursor = parseCursor(filters.cursor);

    // Apply sorting and cursor threshold
    if (filters.sort === 'trending') {
      if (parsedCursor) {
        const lastVal = Number(parsedCursor.lastValue);
        const lastId = parsedCursor.lastId;
        query = query.or(`trending_score.lt.${lastVal},and(trending_score.eq.${lastVal},id.lt.${lastId})`);
      }
      query = query.order('trending_score', { ascending: false }).order('id', { ascending: false });
    } else if (filters.sort === 'funded') {
      if (parsedCursor) {
        const lastVal = Number(parsedCursor.lastValue);
        const lastId = parsedCursor.lastId;
        query = query.or(`funding_total.lt.${lastVal},and(funding_total.eq.${lastVal},id.lt.${lastId})`);
      }
      query = query.order('funding_total', { ascending: false }).order('id', { ascending: false });
    } else if (filters.sort === 'new') {
      if (parsedCursor) {
        const lastVal = parsedCursor.lastValue; // ISO date string
        const lastId = parsedCursor.lastId;
        query = query.or(`created_at.lt.${lastVal},and(created_at.eq.${lastVal},id.lt.${lastId})`);
      }
      query = query.order('created_at', { ascending: false }).order('id', { ascending: false });
    }

    // Limit is +1 to check for next page
    query = query.limit(filters.limit + 1);

    const { data, count, error } = await query;
    if (error) {
      throw new AppError(`Failed to fetch companies: ${error.message}`, 500);
    }

    const items = (data || []) as Company[];
    const total = count || 0;

    let nextCursor: string | null = null;
    if (items.length > filters.limit) {
      // We have an extra item, which means there is a next page
      const nextItem = items.pop()!; // Remove the extra item
      let lastValue: any = null;

      if (filters.sort === 'trending') {
        lastValue = nextItem.trending_score;
      } else if (filters.sort === 'funded') {
        lastValue = nextItem.funding_total;
      } else if (filters.sort === 'new') {
        lastValue = (nextItem as any).created_at;
      }

      // Encode the cursor
      nextCursor = Buffer.from(
        JSON.stringify({ lastValue, lastId: nextItem.id })
      ).toString('base64');
    }

    return {
      items,
      total,
      nextCursor,
    };
  }

  /**
   * Fetches the top 10 companies sorted by trending_score.
   */
  async getTrending(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('trending_score', { ascending: false })
      .limit(10);

    if (error) {
      throw new AppError(`Failed to fetch trending companies: ${error.message}`, 500);
    }

    return (data || []) as Company[];
  }

  /**
   * Finds a company by slug and aggregates all its details and relations.
   */
  async findBySlug(slug: string): Promise<CompanyDetail> {
    // 1. Fetch main company details
    const { data: company, error: compErr } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (compErr || !company) {
      throw new AppError(`Company with slug "${slug}" not found`, 404, 'NOT_FOUND');
    }

    const companyId = company.id;

    // Increments view count in background (not blocking API response)
    supabase
      .from('companies')
      .update({ view_count: (company.view_count || 0) + 1 })
      .eq('id', companyId)
      .then(({ error }) => {
        if (error) console.error(`Failed to increment view count for ${company.name}:`, error);
      });

    // Run remaining relation queries in parallel
    const [
      roundsRes,
      foundersRes,
      productsRes,
      investorsRes,
      timelineRes,
      ownershipRes,
      competitorsRes,
      similarRes,
      newsRes,
    ] = await Promise.all([
      // 2. Funding Rounds
      supabase
        .from('funding_rounds')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false }),

      // 3. Founders
      supabase
        .from('founders')
        .select('*')
        .eq('company_id', companyId),

      // 4. Products
      supabase
        .from('products')
        .select('*')
        .eq('company_id', companyId),

      // 5. Investors (via investor_portfolio junction)
      supabase
        .from('investor_portfolio')
        .select('round_type, invested_at, is_lead, investors (*)')
        .eq('company_id', companyId),

      // 6. Timeline Events
      supabase
        .from('timeline_events')
        .select('*')
        .eq('company_id', companyId)
        .order('year', { ascending: true }),

      // 7. Ownership Breakdown
      supabase
        .from('ownership_breakdown')
        .select('*')
        .eq('company_id', companyId)
        .order('percentage', { ascending: false }),

      // 8. Competitors (via competitor_relations junction)
      supabase
        .from('competitor_relations')
        .select('competitor_id, competitor:companies (id, name, slug, logo_url, category)')
        .eq('company_id', companyId),

      // 9. Similar Companies (same category, highest trending, excluding self)
      supabase
        .from('companies')
        .select('id, name, slug, logo_url, category')
        .eq('category', company.category)
        .neq('id', companyId)
        .order('trending_score', { ascending: false })
        .limit(5),

      // 10. News (via news_company_relations junction)
      supabase
        .from('news_company_relations')
        .select('news_article_id, news_articles (*)')
        .eq('company_id', companyId),
    ]);

    // Parse and type-cast database responses
    const funding_rounds = (roundsRes.data || []) as FundingRound[];
    const founders = (foundersRes.data || []) as Founder[];
    const products = (productsRes.data || []) as Product[];

    // Extract investor details from junction query
    const investorsMap = new Map<string, Investor>();
    (investorsRes.data || []).forEach((row: any) => {
      if (row.investors) {
        const inv = row.investors as Investor;
        investorsMap.set(inv.id, inv);
      }
    });
    const investors = Array.from(investorsMap.values());

    const timeline_events = (timelineRes.data || []) as TimelineEvent[];
    const ownership_breakdown = (ownershipRes.data || []) as OwnershipSlice[];

    // Extract competitor details
    const competitors = (competitorsRes.data || [])
      .filter((row: any) => row.competitor)
      .map((row: any) => row.competitor as Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category'>);

    const similar_companies = (similarRes.data || []) as Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category'>[];

    // Extract news articles
    const news = (newsRes.data || [])
      .filter((row: any) => row.news_articles)
      .map((row: any) => row.news_articles as NewsArticle);

    return {
      ...(company as Company),
      funding_rounds,
      investors,
      founders,
      products,
      competitors,
      similar_companies,
      timeline_events,
      ownership_breakdown,
      news,
    };
  }

  /**
   * Inserts a new company into the database.
   */
  async create(companyData: Partial<Company>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError(`Company with slug "${companyData.slug}" already exists`, 400, 'VALIDATION_ERROR');
      }
      throw new AppError(`Failed to create company: ${error.message}`, 500);
    }

    return data as Company;
  }

  /**
   * Fetches the 1-hop ecosystem graph nodes and edges for a company by its slug.
   */
  async getEcosystemGraph(slug: string): Promise<{
    nodes: Array<{ id: string; name: string; type: string; logo_url?: string | null }>;
    edges: Array<{ source: string; target: string }>;
  }> {
    const { data: company, error: compErr } = await supabase
      .from('companies')
      .select('id, name, logo_url')
      .eq('slug', slug)
      .single();

    if (compErr || !company) {
      throw new AppError(`Company with slug "${slug}" not found`, 404, 'NOT_FOUND');
    }

    const companyId = company.id;

    // Fetch products, investors, and competitors in parallel
    const [productsRes, investorsRes, competitorsRes] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, logo_url')
        .eq('company_id', companyId),
      supabase
        .from('investor_portfolio')
        .select('investors (id, name, logo_url)')
        .eq('company_id', companyId),
      supabase
        .from('competitor_relations')
        .select('competitor:companies (id, name, logo_url)')
        .eq('company_id', companyId),
    ]);

    const nodes: Array<{ id: string; name: string; type: string; logo_url?: string | null }> = [
      { id: company.id, name: company.name, type: 'center', logo_url: company.logo_url }
    ];
    const edges: Array<{ source: string; target: string }> = [];

    // Add products
    if (productsRes.data) {
      productsRes.data.forEach((p: any) => {
        nodes.push({ id: p.id, name: p.name, type: 'product', logo_url: p.logo_url || company.logo_url });
        edges.push({ source: companyId, target: p.id });
      });
    }

    // Add investors
    if (investorsRes.data) {
      const addedInvestors = new Set<string>();
      investorsRes.data.forEach((row: any) => {
        if (row.investors && !addedInvestors.has(row.investors.id)) {
          addedInvestors.add(row.investors.id);
          nodes.push({ id: row.investors.id, name: row.investors.name, type: 'investor', logo_url: row.investors.logo_url });
          edges.push({ source: companyId, target: row.investors.id });
        }
      });
    }

    // Add competitors
    if (competitorsRes.data) {
      competitorsRes.data.forEach((row: any) => {
        if (row.competitor) {
          nodes.push({ id: row.competitor.id, name: row.competitor.name, type: 'competitor', logo_url: row.competitor.logo_url });
          edges.push({ source: companyId, target: row.competitor.id });
        }
      });
    }

    return { nodes, edges };
  }
}
