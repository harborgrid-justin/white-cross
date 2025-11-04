/**
 * Students Domain Cache Configuration
 *
 * Cache strategies for student data with sensitivity-based configurations.
 * Cache durations are inversely proportional to data sensitivity.
 *
 * @module hooks/domains/students/config.cache
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Cache Strategy**:
 * Cache durations are inversely proportional to data sensitivity:
 * - Public data: Long cache (30min+) for performance
 * - Internal data: Moderate cache (10-15min) for balance
 * - Confidential data: Short cache (5min) for freshness
 * - PHI data: Minimal/no cache for compliance
 * - Critical data: No cache, always fetch fresh
 *
 * @example
 * ```typescript
 * // Using cache configuration
 * import { STUDENT_CACHE_CONFIG } from '@/hooks/domains/students/config.cache';
 *
 * const healthCacheConfig = STUDENT_CACHE_CONFIG.health;
 * // { staleTime: 0, gcTime: 0, sensitivity: 'phi' }
 * ```
 */

import { CACHE_TIMES } from '@/hooks/shared/useCacheManager';

/**
 * Student query cache configuration
 */
export const STUDENT_CACHE_CONFIG = {
  // Public directory data - longer cache
  directory: {
    ...CACHE_TIMES.STABLE,
    sensitivity: 'public' as const,
  },

  // Student list and search - moderate cache
  list: {
    ...CACHE_TIMES.MODERATE,
    sensitivity: 'internal' as const,
  },

  // Individual student details - dynamic cache
  details: {
    ...CACHE_TIMES.DYNAMIC,
    sensitivity: 'confidential' as const,
  },

  // Health data - minimal cache
  health: {
    ...CACHE_TIMES.REALTIME,
    sensitivity: 'phi' as const,
  },

  // Critical data - no cache
  critical: {
    ...CACHE_TIMES.CRITICAL,
    sensitivity: 'critical' as const,
  },
} as const;
