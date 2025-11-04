/**
 * Student Utility Type Definitions
 *
 * Type definitions and interfaces for student utility hooks.
 *
 * @module hooks/utilities/studentUtilityTypes
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

/**
 * Enhanced API error type
 */
export interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Cache invalidation patterns
 */
export type InvalidationPattern =
  | 'all-students'
  | 'student-lists'
  | 'student-details'
  | 'student-statistics'
  | 'student-searches'
  | 'student-relationships'
  | 'specific-student';

/**
 * Prefetch strategy options
 */
export interface PrefetchOptions {
  /** Grade levels to prefetch */
  grades?: string[];
  /** Maximum number of students to prefetch */
  limit?: number;
  /** Whether to prefetch relationships */
  includeRelationships?: boolean;
  /** Priority level for prefetching */
  priority?: 'low' | 'medium' | 'high';
  /** Custom filters for prefetching */
  filters?: Partial<any>;
}

/**
 * Cache warming strategy
 */
export interface CacheWarmingStrategy {
  /** Enable automatic cache warming */
  enabled: boolean;
  /** Patterns to warm */
  patterns: ('lists' | 'popular-students' | 'statistics' | 'current-grade')[];
  /** Delay before warming starts (ms) */
  delay?: number;
  /** Interval for refreshing warm cache (ms) */
  refreshInterval?: number;
}

/**
 * PHI (Protected Health Information) handling utilities
 */
export interface PHIHandlingOptions {
  /** Enable PHI sanitization */
  sanitize?: boolean;
  /** Fields to exclude from cache */
  excludeFields?: string[];
  /** Custom sanitization function */
  sanitizer?: (data: any) => any;
  /** Log PHI access for audit trails */
  logAccess?: boolean;
}

/**
 * Cache statistics interface
 */
export interface CacheStats {
  /** Total number of queries in cache */
  totalQueries: number;
  /** Number of student-related queries */
  studentQueries: number;
  /** Number of fresh queries (< 5 min old) */
  freshQueries: number;
  /** Number of stale queries */
  staleQueries: number;
  /** Number of queries with errors */
  errorQueries: number;
  /** Number of currently loading queries */
  loadingQueries: number;
  /** Approximate cache size in bytes */
  cacheSize: number;
}
