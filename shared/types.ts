// ── SOURCE: shared/types.ts — keep in sync ──────────────────────────────────

// ── Enums ──────────────────────────────────────────────────────────────────

export type CompanyCategory =
  | 'AI Agents' | 'AI Coding' | 'AI Search' | 'AI Video'
  | 'AI Voice' | 'AI Infrastructure' | 'Healthcare AI' | 'Foundation Models';

export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Growth' | 'IPO';

export type InvestorType = 'VC' | 'Angel' | 'Corporate' | 'Growth Equity';

// ── API envelope ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: { total?: number; cursor?: string | null };
  error?: null;
}
export interface ApiError {
  data: null;
  error: { code: string; message: string };
}

// ── Core entities ──────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CompanyCategory;
  funding_total: number;
  employee_count: number;
  founded_year: number;
  hq_city: string;
  hq_country: string;
  logo_url: string;
  website: string;
  stage: FundingStage;
  is_unicorn: boolean;
  valuation: number | null;
  growth_score: number;
  trending_score: number;
  view_count: number;
  tags: string[];
}

export interface CompanyDetail extends Company {
  funding_rounds: FundingRound[];
  investors: Investor[];
  founders: Founder[];
  products: Product[];
  competitors: Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category'>[];
  similar_companies: Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category'>[];
  timeline_events: TimelineEvent[];
  ownership_breakdown: OwnershipSlice[];
  news: NewsArticle[];
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: InvestorType;
  bio: string;
  aum: number | null;
  portfolio_count: number;
  stage_focus: FundingStage[];
  sector_focus: string[];
  location: string;
  logo_url: string;
  avg_check_size: number | null;
  website: string;
}

export interface InvestorDetail extends Investor {
  portfolio: CompanyInvestment[];
  co_investors: Pick<Investor, 'id' | 'name' | 'slug' | 'logo_url'>[];
  investment_thesis: string;
  portfolio_concentration: PortfolioSlice[];
  recent_investments: RecentInvestment[];
  deal_counts_by_year: { year: number; count: number }[];
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: FundingStage;
  amount: number;
  currency: string;
  date: string;
  lead_investor_id: string | null;
  lead_investor_name: string | null;
}

export interface Founder {
  id: string;
  name: string;
  slug: string;
  title: string;
  company_id: string;
  bio: string;
  twitter: string | null;
  linkedin: string | null;
  photo_url: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  upvotes: number;
  logo_url: string;
  website_url: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: string;
  tag: string;
  summary: string;
}

export interface TimelineEvent {
  year: number;
  label: string;
  description: string;
}

export interface OwnershipSlice {
  owner_name: string;
  percentage: number;
  color: string;
}

export interface PortfolioSlice {
  category: string;
  percentage: number;
  color: string;
}

export interface CompanyInvestment {
  company: Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category' | 'stage'>;
  round_type: FundingStage;
  invested_at: string;
  is_lead: boolean;
}

export interface RecentInvestment {
  company_name: string;
  company_logo: string;
  category: string;
  round_type: FundingStage;
  amount: number;
  date: string;
  is_lead: boolean;
}
