/**
 * WF-COMP-147 | studentQueryKeys.ts - Query key factory and cache configuration
 * Purpose: Centralized query key factory and cache configuration for student queries
 * Upstream: @tanstack/react-query
 * Downstream: Student query hooks
 * Exports: studentKeys, CACHE_CONFIG
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

import type { StudentFilters } from '@/types/student.types';

// =====================
// QUERY KEY FACTORY
// =====================

/**
 * Centralized query key factory for student-related queries.
 * Provides type-safe, consistent cache key generation.
 *
 * @pattern Query Key Factory
 * @see {@link https://tkdodo.eu/blog/effective-react-query-keys}
 */
export const studentKeys = {
  /** Base key for all student queries */
  all: ['students'] as const,

  /** Keys for student list queries */
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,

  /** Keys for student detail queries */
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,

  /** Keys for search queries */
  searches: () => [...studentKeys.all, 'search'] as const,
  search: (query: string) => [...studentKeys.searches(), query] as const,

  /** Keys for assigned students queries */
  assigned: () => [...studentKeys.all, 'assigned'] as const,

  /** Keys for statistics queries */
  stats: () => [...studentKeys.all, 'stats'] as const,
} as const;

// =====================
// CACHE CONFIGURATION
// =====================

/**
 * Cache configuration for student queries.
 * Healthcare data requires balance between freshness and performance.
 */
export const CACHE_CONFIG = {
  /** Semi-static data - student lists don't change frequently */
  LIST_STALE_TIME: 10 * 60 * 1000, // 10 minutes

  /** Student details can be cached longer */
  DETAIL_STALE_TIME: 15 * 60 * 1000, // 15 minutes

  /** Search results should be fresh */
  SEARCH_STALE_TIME: 5 * 60 * 1000, // 5 minutes

  /** Statistics should be relatively fresh */
  STATS_STALE_TIME: 5 * 60 * 1000, // 5 minutes

  /** Default cache time (how long unused data stays in cache) */
  DEFAULT_CACHE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;
