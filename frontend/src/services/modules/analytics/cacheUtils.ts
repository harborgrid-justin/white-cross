/**
 * @fileoverview Analytics Cache Management Utilities
 * @module services/modules/analytics/cacheUtils
 * @category Services - Analytics
 *
 * Provides centralized cache management for analytics API modules with TTL support,
 * cache key generation, and pattern-based cache invalidation.
 *
 * @example
 * ```typescript
 * const cache = new AnalyticsCache();
 * const key = cache.buildKey(CacheKeys.HEALTH_METRICS, { studentId: '123' });
 * cache.set(key, data, CacheTTL.METRICS);
 * const cached = cache.get<HealthMetrics[]>(key);
 * cache.clear('health'); // Clear all health-related caches
 * ```
 */

/**
 * Cache keys for analytics queries
 */
export const CacheKeys = {
  HEALTH_METRICS: 'analytics:health-metrics',
  HEALTH_TRENDS: 'analytics:health-trends',
  INCIDENT_TRENDS: 'analytics:incident-trends',
  MEDICATION_USAGE: 'analytics:medication-usage',
  APPOINTMENT_TRENDS: 'analytics:appointment-trends',
  NURSE_DASHBOARD: 'analytics:dashboard:nurse',
  ADMIN_DASHBOARD: 'analytics:dashboard:admin',
  SCHOOL_DASHBOARD: 'analytics:dashboard:school',
  SUMMARY: 'analytics:summary',
  REPORT_LIST: 'analytics:reports:list'
} as const;

/**
 * Default cache TTL in seconds
 */
export const CacheTTL = {
  METRICS: 300,        // 5 minutes
  TRENDS: 600,         // 10 minutes
  DASHBOARD: 180,      // 3 minutes
  SUMMARY: 300,        // 5 minutes
  REPORTS: 60          // 1 minute
} as const;

/**
 * Cache entry structure
 */
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Analytics Cache Manager
 * Provides intelligent caching with TTL and pattern-based invalidation
 */
export class AnalyticsCache {
  private cache: Map<string, CacheEntry>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set cache data with TTL
   */
  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clear cache by key or pattern
   * @param pattern - Optional pattern to match cache keys. If omitted, clears all cache.
   */
  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    const cacheKeys = Array.from(this.cache.keys());
    for (const key of cacheKeys) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Build cache key from base key and parameters
   * @param base - Base cache key
   * @param params - Optional parameters to include in cache key
   * @returns Formatted cache key with parameters
   */
  buildKey(base: string, params?: Record<string, any>): string {
    if (!params) return base;

    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');

    return `${base}:${sortedParams}`;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach((entry) => {
      if (now - entry.timestamp > entry.ttl * 1000) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl * 1000) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

/**
 * Singleton cache instance for analytics modules
 */
export const analyticsCache = new AnalyticsCache();
