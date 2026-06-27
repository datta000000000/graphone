import { z } from 'zod';

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  sort: z.enum(['popular', 'newest']).default('popular'),
});
