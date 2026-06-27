import { supabase } from '../../config/db';
import { Product } from '../../types';
import { AppError } from '../../lib/errors';

export class ProductsRepository {
  /**
   * Lists products with category filter and sort by popular (upvotes) or newest.
   */
  async list(filters: {
    category?: string;
    sort: 'popular' | 'newest';
  }): Promise<Product[]> {
    let query = supabase.from('products').select('*, companies (name, logo_url)');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.sort === 'popular') {
      query = query.order('upvotes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }

    // Map nested company info as a convenience if frontend wants it,
    // but preserve structural compatibility with core Product interface.
    return (data || []) as any[];
  }
}
