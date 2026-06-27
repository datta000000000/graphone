import NodeCache from 'node-cache';

// Create internal NodeCache instance
const internalCache = new NodeCache({
  stdTTL: 300, // default 5 minutes
  checkperiod: 60,
});

/**
 * Cache utility singleton
 */
export const cache = {
  /**
   * Retrieves a typed value from the cache.
   */
  get<T>(key: string): T | undefined {
    const value = internalCache.get<T>(key);
    if (value !== undefined) {
      console.log(`[CACHE HIT] Key: "${key}"`);
      return value;
    }
    console.log(`[CACHE MISS] Key: "${key}"`);
    return undefined;
  },

  /**
   * Sets a value in the cache with an optional TTL (in seconds).
   */
  set<T>(key: string, value: T, ttlSeconds?: number): boolean {
    const success = ttlSeconds !== undefined
      ? internalCache.set(key, value, ttlSeconds)
      : internalCache.set(key, value);
    if (success) {
      console.log(`[CACHE SET] Key: "${key}" (TTL: ${ttlSeconds ?? 'default'}s)`);
    } else {
      console.warn(`[CACHE SET FAILED] Key: "${key}"`);
    }
    return success;
  },

  /**
   * Deletes a value or list of values from the cache.
   */
  del(keys: string | string[]): number {
    return internalCache.del(keys);
  },

  /**
   * Clears the entire cache.
   */
  flush(): void {
    internalCache.flushAll();
    console.log('[CACHE FLUSHED] Entire cache has been cleared');
  }
};
