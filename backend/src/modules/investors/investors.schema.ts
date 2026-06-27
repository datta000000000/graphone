import { z } from 'zod';

const InvestorTypeEnum = z.enum(['VC', 'Angel', 'Corporate', 'Growth Equity']);
const FundingStageEnum = z.enum([
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'IPO'
]);

export const listInvestorsQuerySchema = z.object({
  type: InvestorTypeEnum.optional(),
  stage_focus: z.string().optional(), // Will query array using overlap or contains
  limit: z.string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 20 : Math.min(Math.max(parsed, 1), 100);
    })
    .default('20'),
  cursor: z.string().optional(),
});

export const investorSlugParamsSchema = z.object({
  slug: z.string().min(1, 'Slug parameter is required'),
});
