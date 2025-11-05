/**
 * WF-COMP-QUERYCLIENT-001 | queryClient.ts - React Query Client Configuration
 * Purpose: Enterprise-grade TanStack Query configuration with Next.js integration
 *
 * Features:
 * - SSR/SSG compatible configuration
 * - Granular cache invalidation strategies
 * - Error handling and retry logic
 * - Query deduplication
 * - Healthcare-specific caching rules
 *
 * Security:
 * - PHI data excluded from persistence
 * - Secure error handling
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */

import { QueryClient, QueryCache, MutationCache, DefaultOptions, Query, Mutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface QueryMeta extends Record<string, unknown> {
  /**
   * Whether this query contains PHI data
   * PHI data will not be persisted to localStorage
   */
  containsPHI?: boolean;

  /**
   * Custom cache tags for granular invalidation
   */
  cacheTags?: string[];

  /**
   * Custom error message for user display
   */
  errorMessage?: string;

  /**
   * Whether to audit this query
   */
  auditLog?: boolean;

  /**
   * Custom retry logic
   */
  customRetry?: boolean;
}

interface MutationMeta {
  /**
   * Whether this mutation affects PHI data
   */
  affectsPHI?: boolean;

  /**
   * Audit action type
   */
  auditAction?: string;

  /**
   * Success message to display
   */
  successMessage?: string;

  /**
   * Error message to display
   */
  errorMessage?: string;
}

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Default TanStack Query options with healthcare-specific caching and retry settings.
 *
 * Configures conservative caching strategies appropriate for healthcare data,
 * balancing data freshness with performance. Implements intelligent retry logic
 * that distinguishes between transient failures and permanent errors.
 *
 * Query Configuration:
 * - staleTime: 5 minutes (data freshness threshold)
 * - gcTime: 30 minutes (garbage collection time, previously cacheTime)
 * - Automatic refetch on: window focus, reconnect, mount
 * - Retry logic: Up to 3 attempts for 5xx errors, no retry for 4xx except 408/429
 * - Exponential backoff: Starts at 1s, max 30s with doubling delay
 *
 * Mutation Configuration:
 * - Single retry attempt for mutations (idempotency concerns)
 * - Requires online network mode
 *
 * @constant {DefaultOptions}
 *
 * @example
 * ```typescript
 * // Query with default options:
 * const { data } = useQuery({
 *   queryKey: ['students'],
 *   queryFn: fetchStudents,
 *   // Inherits: 5min staleTime, 3 retries, background refetch
 * });
 *
 * // Mutation with default options:
 * const { mutate } = useMutation({
 *   mutationFn: createStudent,
 *   // Inherits: 1 retry, online mode
 * });
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Conservative stale time for healthcare data
    staleTime: 5 * 60 * 1000, // 5 minutes
    
    // Longer cache time for non-critical data
    gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4)
    
    // Enable background refetch for critical data
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    
    // Retry configuration for transient failures
    retry: (failureCount: number, error: any) => {
      // Don't retry on 4xx client errors except 408, 429
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
          return false;
        }
      }

      // Retry up to 3 times with exponential backoff
      return failureCount < 3;
    },

    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Network mode for offline support
    networkMode: 'online',
  },
  
  mutations: {
    // Conservative retry for mutations
    retry: 1,
    
    // Network mode for mutations
    networkMode: 'online',
  },
};

/**
 * TanStack Query cache with centralized error handling and audit logging.
 *
 * Provides lifecycle hooks for query success and failure, enabling consistent
 * error notifications, PHI access auditing, and debugging support. Integrates
 * with toast notifications for user-friendly error messages.
 *
 * Error Handling:
 * - Displays toast notifications for failed queries (except background refetches)
 * - Uses custom errorMessage from query meta if provided
 * - Logs errors with query keys and metadata for debugging
 * - Suppresses toasts when query has existing data (background refresh failed)
 *
 * Audit Logging:
 * - Tracks PHI data access when auditLog and containsPHI flags are set
 * - Logs query keys and data sizes for compliance
 * - Client-side only (respects SSR constraints)
 *
 * @constant {QueryCache}
 *
 * @example
 * ```typescript
 * // Query with audit logging:
 * const { data } = useQuery({
 *   queryKey: ['patient', patientId],
 *   queryFn: fetchPatient,
 *   meta: {
 *     containsPHI: true,
 *     auditLog: true,
 *     errorMessage: 'Failed to load patient data'
 *   }
 * });
 * // On success: Logs PHI access audit
 * // On error: Shows custom error message, logs to console
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/reference/QueryCache
 */
const queryCache = new QueryCache({
  onError: (error: any, query: Query<any, any, any>) => {
    const meta = query.meta as QueryMeta | undefined;

    console.error('[QueryCache] Query failed:', {
      queryKey: query.queryKey,
      error,
      meta,
    });

    // Display user-friendly error message
    const errorMessage = meta?.errorMessage || 'Failed to load data. Please try again.';

    // Don't show toast for background refetches of successful queries
    if (query.state.data === undefined) {
      toast.error(errorMessage);
    }

    // Log audit trail for PHI-related queries
    if (meta?.auditLog && typeof window !== 'undefined') {
      console.log('[Audit] Query failed', {
        queryKey: query.queryKey,
        error: error.message,
        containsPHI: meta?.containsPHI,
      });
    }
  },

  onSuccess: (data: any, query: Query<any, any, any>) => {
    const meta = query.meta as QueryMeta | undefined;

    // Log audit trail for PHI-related queries
    if (meta?.auditLog && meta?.containsPHI && typeof window !== 'undefined') {
      console.log('[Audit] PHI data accessed', {
        queryKey: query.queryKey,
        dataSize: JSON.stringify(data).length,
      });
    }
  },
});

/**
 * TanStack Mutation cache with success/error handling and PHI audit logging.
 *
 * Provides lifecycle hooks for mutation success and failure, enabling automatic
 * success notifications, error handling, and audit trails for data modifications
 * affecting Protected Health Information (PHI).
 *
 * Success Handling:
 * - Displays custom successMessage from mutation meta as toast
 * - Logs PHI modifications for compliance auditing
 * - Records mutation keys and data sizes
 *
 * Error Handling:
 * - Displays custom errorMessage or default error toast
 * - Logs failed mutations with variables for debugging
 * - Tracks failed PHI modifications for security auditing
 *
 * @constant {MutationCache}
 *
 * @example
 * ```typescript
 * // Mutation with audit and notifications:
 * const { mutate } = useMutation({
 *   mutationFn: updatePatient,
 *   meta: {
 *     affectsPHI: true,
 *     auditAction: 'UPDATE_PATIENT',
 *     successMessage: 'Patient updated successfully',
 *     errorMessage: 'Failed to update patient'
 *   }
 * });
 * // On success: Shows success toast, logs PHI audit
 * // On error: Shows error toast, logs failure audit
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/reference/MutationCache
 */
const mutationCache = new MutationCache({
  onSuccess: (data: any, variables: any, context: any, mutation: Mutation<any, any, any, any>) => {
    const meta = mutation.meta as MutationMeta | undefined;

    // Show success message
    if (meta?.successMessage) {
      toast.success(meta.successMessage);
    }

    // Log audit trail for PHI-affecting mutations
    if (meta?.affectsPHI && typeof window !== 'undefined') {
      console.log('[Audit] PHI data modified', {
        action: meta.auditAction,
        mutationKey: mutation.options.mutationKey,
        dataSize: JSON.stringify(variables).length,
      });
    }
  },

  onError: (error: any, variables: any, context: any, mutation: Mutation<any, any, any, any>) => {
    const meta = mutation.meta as MutationMeta | undefined;

    console.error('[MutationCache] Mutation failed:', {
      mutationKey: mutation.options.mutationKey,
      error,
      variables,
      meta,
    });

    // Display user-friendly error message
    const errorMessage = meta?.errorMessage || 'Operation failed. Please try again.';
    toast.error(errorMessage);

    // Log audit trail for failed PHI mutations
    if (meta?.affectsPHI && typeof window !== 'undefined') {
      console.log('[Audit] PHI mutation failed', {
        action: meta.auditAction,
        error: error.message,
        mutationKey: mutation.options.mutationKey,
      });
    }
  },
});

// ==========================================
// QUERY CLIENT
// ==========================================

/**
 * Creates a new QueryClient instance with configured caches and default options.
 *
 * Factory function for instantiating TanStack Query clients with healthcare-specific
 * configuration. Used for both server-side rendering (new instance per request) and
 * client-side (singleton instance).
 *
 * @returns {QueryClient} Configured QueryClient instance
 * @private
 *
 * @example
 * ```typescript
 * // Server-side: new client per request
 * const client = createQueryClient();
 *
 * // Client-side: singleton pattern via getQueryClient()
 * ```
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions,
  });
}

/**
 * Global QueryClient singleton instance for browser/client-side usage.
 *
 * Cached client instance that persists across component renders on the client.
 * Undefined on server to ensure fresh instances per SSR request.
 *
 * @type {QueryClient | undefined}
 * @private
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Retrieves the appropriate QueryClient instance for the current environment.
 *
 * Implements SSR-compatible client management:
 * - Server (SSR): Creates a new QueryClient for each request to avoid data leakage
 * - Browser: Returns singleton QueryClient instance, creating if necessary
 *
 * This pattern ensures:
 * - No shared state between SSR requests (security)
 * - Optimal performance on client with persistent cache
 * - Compatibility with Next.js App Router and React Server Components
 *
 * @returns {QueryClient} QueryClient instance appropriate for current environment
 *
 * @example
 * ```typescript
 * // In React Server Component (SSR)
 * const queryClient = getQueryClient();
 * await queryClient.prefetchQuery({
 *   queryKey: ['students'],
 *   queryFn: fetchStudents
 * });
 *
 * // In Client Component
 * const queryClient = getQueryClient();
 * // Same instance across component renders
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/advanced-ssr
 */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * Default export for backwards compatibility
 */
export const queryClient = getQueryClient();

// ==========================================
// CACHE MANAGEMENT
// ==========================================

/**
 * Invalidates queries matching specified cache tags for granular cache management.
 *
 * Provides tag-based cache invalidation strategy for related queries. Searches all
 * cached queries for matching tags in their meta.cacheTags array and invalidates
 * them, triggering refetches for active queries.
 *
 * Use Cases:
 * - After student mutation: invalidate ['students', 'student-list', 'student-count']
 * - After medication update: invalidate ['medications', 'inventory']
 * - After document upload: invalidate ['documents', 'document-folders']
 *
 * @param {string[]} tags - Array of cache tag strings to invalidate
 * @returns {Promise<void>} Resolves when all matching queries are invalidated
 *
 * @example
 * ```typescript
 * // Define queries with cache tags:
 * const studentsQuery = useQuery({
 *   queryKey: ['students'],
 *   queryFn: fetchStudents,
 *   meta: { cacheTags: ['students', 'student-list'] }
 * });
 *
 * const studentCountQuery = useQuery({
 *   queryKey: ['studentCount'],
 *   queryFn: fetchStudentCount,
 *   meta: { cacheTags: ['students', 'student-count'] }
 * });
 *
 * // Invalidate all student-related queries:
 * await invalidateByTags(['students']);
 * // Both studentsQuery and studentCountQuery will refetch
 *
 * // Invalidate only count query:
 * await invalidateByTags(['student-count']);
 * // Only studentCountQuery will refetch
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-invalidation
 */
export async function invalidateByTags(tags: string[]): Promise<void> {
  const client = getQueryClient();

  // Find all queries that match any of the provided tags
  const queriesToInvalidate = client.getQueryCache().findAll({
    predicate: (query: Query<any, any, any>) => {
      const meta = query.meta as QueryMeta | undefined;
      const queryTags = meta?.cacheTags || [];
      return tags.some(tag => queryTags.includes(tag));
    },
  });

  // Invalidate matching queries
  const invalidationPromises = queriesToInvalidate.map((query: Query<any, any, any>) =>
    client.invalidateQueries({ queryKey: query.queryKey })
  );

  await Promise.all(invalidationPromises);
}

/**
 * Clears all cached query and mutation data from the QueryClient.
 *
 * Completely removes all cached data, resetting the QueryClient to initial state.
 * Critical for logout flows to ensure no PHI or user-specific data remains in memory.
 * All active queries will enter loading state and refetch when next accessed.
 *
 * Operations Performed:
 * - Removes all query data from cache
 * - Clears all mutation states
 * - Resets cache to empty state
 * - Does NOT remove observers (subscriptions persist)
 *
 * @returns {Promise<void>} Resolves immediately (synchronous clear wrapped in Promise)
 *
 * @example
 * ```typescript
 * // Logout flow
 * async function handleLogout() {
 *   await clearAllData();
 *   await resetApolloClient(); // Clear GraphQL cache too
 *   router.push('/login');
 * }
 *
 * // Account switching
 * async function switchAccount(newUserId: string) {
 *   await clearAllData();
 *   await authenticateAs(newUserId);
 *   router.refresh();
 * }
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientclear
 */
export async function clearAllData(): Promise<void> {
  const client = getQueryClient();
  client.clear();
}

/**
 * Retrieves statistics about the current TanStack Query cache state.
 *
 * Provides diagnostic information about cached queries for debugging, monitoring,
 * and performance analysis. Useful for understanding cache utilization and
 * identifying potential issues with stale data or PHI retention.
 *
 * Statistics Returned:
 * - totalQueries: Total number of queries in cache
 * - activeQueries: Queries with active observers (components using them)
 * - staleQueries: Queries past their staleTime threshold
 * - phiQueries: Queries marked as containing PHI in metadata
 *
 * @returns {object} Cache statistics object
 * @returns {number} return.totalQueries - Total cached queries
 * @returns {number} return.activeQueries - Queries with active subscriptions
 * @returns {number} return.staleQueries - Queries marked stale
 * @returns {number} return.phiQueries - Queries containing PHI data
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log('Cache Statistics:', stats);
 * // {
 * //   totalQueries: 45,
 * //   activeQueries: 12,
 * //   staleQueries: 8,
 * //   phiQueries: 15
 * // }
 *
 * // Use in performance monitoring
 * if (stats.staleQueries > 20) {
 *   console.warn('High number of stale queries, consider adjusting staleTime');
 * }
 *
 * // Audit PHI data retention
 * if (stats.phiQueries > 0 && !userIsAuthenticated) {
 *   console.error('PHI queries cached while unauthenticated!');
 *   await clearAllData();
 * }
 * ```
 */
export function getCacheStats() {
  const client = getQueryClient();
  const queries = client.getQueryCache().getAll();

  return {
    totalQueries: queries.length,
    activeQueries: queries.filter((q: Query<any, any, any>) => q.getObserversCount() > 0).length,
    staleQueries: queries.filter((q: Query<any, any, any>) => q.isStale()).length,
    phiQueries: queries.filter((q: Query<any, any, any>) => (q.meta as QueryMeta)?.containsPHI).length,
  };
}

export default queryClient;
