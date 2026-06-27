/**
 * Calculates a trending score for a company.
 * Formula:
 * score = (0.35 × funding_recency) + (0.25 × news_mentions) + (0.25 × view_velocity) + (0.15 × growth_score)
 *
 * All sub-components are capped/normalized between 0 and 1.
 */
export function calculateTrendingScore(params: {
  daysSinceLastFunding: number | null;
  articlesLast30Days: number;
  viewCount: number;
  growthScore: number; // 0 to 100
}): number {
  // 1. Funding Recency (capped 0-1)
  // If never funded or daysSinceLastFunding is null, set recency to 0
  const fundingRecency = params.daysSinceLastFunding !== null
    ? Math.exp(-params.daysSinceLastFunding / 90)
    : 0;
  const cappedFundingRecency = Math.max(0, Math.min(1, fundingRecency));

  // 2. News Mentions (capped 0-1)
  const newsMentions = Math.min(params.articlesLast30Days / 10, 1);
  const cappedNewsMentions = Math.max(0, Math.min(1, newsMentions));

  // 3. View Velocity (capped 0-1)
  const viewVelocity = Math.min(params.viewCount / 1000, 1);
  const cappedViewVelocity = Math.max(0, Math.min(1, viewVelocity));

  // 4. Growth Score (normalized 0-1)
  const normalizedGrowthScore = Math.max(0, Math.min(1, params.growthScore / 100));

  // Calculate final score
  const score = (0.35 * cappedFundingRecency) +
                (0.25 * cappedNewsMentions) +
                (0.25 * cappedViewVelocity) +
                (0.15 * normalizedGrowthScore);

  // Return score rounded to 4 decimal places
  return Math.round(score * 10000) / 10000;
}
