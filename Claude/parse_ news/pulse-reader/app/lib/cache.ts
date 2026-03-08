const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`pr_cache_${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) {
      sessionStorage.removeItem(`pr_cache_${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
    sessionStorage.setItem(`pr_cache_${key}`, JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function buildCacheKey(keywords: string[], timeRange: string, limit: number): string {
  return `${keywords.sort().join(',').toLowerCase()}:${timeRange}:${limit}`;
}

export function clearCache(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith('pr_cache_')) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => sessionStorage.removeItem(k));
}
