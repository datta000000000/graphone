import { z } from 'zod';

const CompanyCategoryEnum = z.enum([
  'AI Agents', 'AI Coding', 'AI Search', 'AI Video',
  'AI Voice', 'AI Infrastructure', 'Healthcare AI', 'Foundation Models'
]);

const FundingStageEnum = z.enum([
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'IPO'
]);

export const listCompaniesQuerySchema = z.object({
  category: CompanyCategoryEnum.optional(),
  stage: FundingStageEnum.optional(),
  country: z.string().optional(),
  sort: z.enum(['trending', 'funded', 'new']).default('trending'),
  limit: z.string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 20 : Math.min(Math.max(parsed, 1), 100);
    })
    .default('20'),
  cursor: z.string().optional(),
});

export const companySlugParamsSchema = z.object({
  slug: z.string().min(1, 'Slug parameter is required'),
});

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  category: CompanyCategoryEnum,
  funding_total: z.number().nonnegative().default(0),
  employee_count: z.number().int().nonnegative().optional(),
  founded_year: z.number().int().nonnegative().optional(),
  hq_city: z.string().optional(),
  hq_country: z.string().optional(),
  logo_url: z.string().url().optional(),
  website: z.string().url().optional(),
  stage: FundingStageEnum.optional(),
  is_unicorn: z.boolean().default(false),
  valuation: z.number().int().nonnegative().nullable().default(null),
  growth_score: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
});
