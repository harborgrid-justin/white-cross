/**
 * Cache Manager Type Definitions
 *
 * Type definitions, interfaces, and constants for cache management
 * in healthcare applications.
 *
 * @module hooks/shared/cache-types
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Cache time constants for healthcare applications
 */
export const CACHE_TIMES = {
  // Critical healthcare data - minimal or no caching
  CRITICAL: {
    staleTime: 0,
    cacheTime: 1 * 60 * 1000, // 1 minute
  },
  // Real-time data
  REALTIME: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 2 * 60 * 1000, // 2 minutes
  },
  // Frequently changing data
  DYNAMIC: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  },
  // Moderately stable data
  MODERATE: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  // Stable reference data
  STABLE: {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 4 * 60 * 60 * 1000, // 4 hours
  },
} as const;

/**
 * Data sensitivity levels for healthcare compliance
 */
export type DataSensitivity =
  | 'public'        // Non-sensitive public data
  | 'internal'      // Internal business data
  | 'confidential'  // Confidential business data
  | 'phi'           // Protected Health Information
  | 'critical';     // Safety-critical healthcare data

/**
 * Cache strategy configuration
 */
export interface CacheStrategy {
  sensitivity: DataSensitivity;
  staleTime: number;
  cacheTime: number;
  enableOptimistic: boolean;
  requiresInvalidation: boolean;
}

/**
 * Cache invalidation scope
 */
export type InvalidationScope =
  | 'exact'      // Invalidate exact key match
  | 'prefix'     // Invalidate keys with prefix
  | 'pattern'    // Invalidate keys matching pattern
  | 'domain';    // Invalidate entire domain

/**
 * Cache manager options
 */
export interface CacheManagerOptions {
  enableAuditLogging?: boolean;
  defaultSensitivity?: DataSensitivity;
  performanceMode?: 'balanced' | 'aggressive' | 'conservative';
}

/**
 * Cache statistics
 */
export interface CacheStats {
  totalQueries: number;
  staleCodes: number;
  errorQueries: number;
  loadingQueries: number;
  cacheSize: number;
}
