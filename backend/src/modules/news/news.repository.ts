import { supabase } from '../../config/db';
import { NewsArticle } from '../../types';
import { AppError } from '../../lib/errors';
import { parseCursor } from '../../lib/pagination';

export class NewsRepository {
  /**
   * Lists news articles with optional tag filter and cursor-based pagination.
   */
  async list(filters: {
    tag?: string;
    limit: number;
    cursor?: string;
  }): Promise<{ items: NewsArticle[]; total: number; nextCursor: string | null }> {
    let query = supabase.from('news_articles').select('*', { count: 'exact' });

    if (filters.tag) {
      query = query.eq('tag', filters.tag);
    }

    const parsedCursor = parseCursor(filters.cursor);
    if (parsedCursor) {
      const lastVal = parsedCursor.lastValue; // published_at ISO string
      const lastId = parsedCursor.lastId;
      query = query.or(`published_at.lt.${lastVal},and(published_at.eq.${lastVal},id.lt.${lastId})`);
    }

    query = query
      .order('published_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(filters.limit + 1);

    const { data, count, error } = await query;
    if (error) {
      throw new AppError(`Failed to fetch news articles: ${error.message}`, 500);
    }

    const items = (data || []) as NewsArticle[];
    const total = count || 0;

    let nextCursor: string | null = null;
    if (items.length > filters.limit) {
      const nextItem = items.pop()!;
      nextCursor = Buffer.from(
        JSON.stringify({ lastValue: nextItem.published_at, lastId: nextItem.id })
      ).toString('base64');
    }

    return {
      items,
      total,
      nextCursor,
    };
  }
}
