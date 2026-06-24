interface CacheEntry<T> {
  value: Promise<T>;
  expiresAt: number;
}

interface CacheOptions<Args extends unknown[]> {
  ttlMs: number;
  maxSize?: number;
  keyFn?: (...args: Args) => string;
}

// In-memory LRU cache with per-entry TTL. Caches the in-flight promise (not
// just the resolved value) so concurrent calls for the same key dedupe into
// a single request instead of racing.
export function withCache<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
  { ttlMs, maxSize = 50, keyFn = (...args) => JSON.stringify(args) }: CacheOptions<Args>,
): (...args: Args) => Promise<T> {
  const cache = new Map<string, CacheEntry<T>>();

  return (...args: Args): Promise<T> => {
    const key = keyFn(...args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && cached.expiresAt > now) {
      // Refresh recency for LRU eviction.
      cache.delete(key);
      cache.set(key, cached);
      return cached.value;
    }

    const value = fn(...args).catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, { value, expiresAt: now + ttlMs });

    if (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) cache.delete(oldestKey);
    }

    return value;
  };
}
