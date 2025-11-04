/**
 * @fileoverview TanStack Query Public API
 * @module lib/react-query
 * @category Query
 *
 * Central export for all TanStack Query utilities, providers, and hooks.
 * Use this module for all query-related imports.
 *
 * @example
 * ```typescript
 * import { QueryProvider, prefetchQuery, dehydrateQueries } from '@/lib/react-query';
 * ```
 */

// Provider
export { QueryProvider, default as Provider } from './QueryProvider';

// Server utilities
export {
  prefetchQuery,
  prefetchQueries,
  dehydrateQueries,
  getServerQueryClient,
  isServer,
  healthcarePrefetch,
} from './serverQuery';

// Server action hooks and utilities
export {
  useServerQuery,
  useServerMutation,
  useServerPaginatedQuery,
  createQueryKey,
  prefetchServerQuery,
  QUERY_DEFAULTS,
} from './useServerAction';

// Server action types
export type {
  ServerActionResult,
  UseServerQueryOptions,
  UseServerMutationOptions,
} from './useServerAction';

// Query client configuration (re-export from config)
export { getQueryClient, queryClient, invalidateByTags, clearAllData, getCacheStats } from '@/config/queryClient';

// Re-export TanStack Query hooks for convenience
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Re-export TanStack Query types for convenience
export type {
  QueryClient,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
