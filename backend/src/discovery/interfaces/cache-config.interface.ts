export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  includeQuery?: boolean;
  includeParams?: boolean;
  includeUser?: boolean;
  invalidateOn?: string[]; // Events that invalidate cache
  keyPrefix?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memoryUsage: number;
  hitRate: number;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}
