import { z } from 'zod';

export const listNewsQuerySchema = z.object({
  tag: z.string().optional(),
  limit: z.string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 20 : Math.min(Math.max(parsed, 1), 100);
    })
    .default('20'),
  cursor: z.string().optional(),
});
