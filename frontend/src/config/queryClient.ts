/**
 * WF-COMP-QUERYCLIENT-001 | queryClient.ts - React Query Client Configuration
 * Purpose: Enterprise-grade TanStack Query configuration with advanced features
 *
 * Features:
 * - Granular cache invalidation strategies
 * - Optimistic update management
 * - Error handling and retry logic
 * - Query deduplication
 * - Background refetch management
 * - Persistence integration
 * - Healthcare-specific caching rules
 *
 * Security:
 * - PHI data excluded from persistence
 * - Audit logging integration
 * - Secure error handling
 *
 * Last Updated: 2025-10-21 | File Type: .ts
 */

import { QueryClient, QueryCache, MutationCache, DefaultOptions } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { getCacheManager } from '../services/cache';
import { auditService } from '../services/audit';
import { getGlobalHealthMonitor } from '../services/resilience/HealthMonitor';
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

  /**
   * Cache time override (in ms)
   */
  cacheTimeOverride?: number;

  /**
   * Stale time override (in ms)
   */
  staleTimeOverride?: number;
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
   * Related resource type for audit
   */
  resourceType?: string;

  /**
   * Success message to display
   */
  successMessage?: string;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Whether to invalidate cache on success
   */
  invalidateOnSuccess?: boolean;

  /**
   * Query keys to invalidate on success
   */
  invalidateKeys?: string[][];

  /**
   * Whether to show toast notifications
   */
  showToast?: boolean;
}

// ==========================================
// QUERY CLIENT CONFIGURATION
// ==========================================

/**
 * Default options for all queries
 */
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes (data considered fresh for 5 minutes)
    staleTime: 5 * 60 * 1000,

    // GC time: 10 minutes (unused data kept in cache for 10 minutes)
    gcTime: 10 * 60 * 1000,

    // Retry logic with exponential backoff
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408 (timeout) and 429 (rate limit)
      if (error?.status >= 400 && error?.status < 500) {
        if (error.status === 408 || error.status === 429) {
          return failureCount < 3;
        }
        return false;
      }

      // Retry up to 3 times for 5xx errors
      return failureCount < 3;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30 seconds
    },

    // Don't refetch on window focus by default (too aggressive for healthcare)
    refetchOnWindowFocus: false,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Don't refetch on mount if data is fresh
    refetchOnMount: false,

    // Network mode: online-first with offline fallback
    networkMode: 'online',
  },

  mutations: {
    // Retry mutations once
    retry: 1,

    // Network mode for mutations
    networkMode: 'online',
  },
};

/**
 * Query Cache with error handling and monitoring
 */
const queryCache = new QueryCache({
  onError: (error: any, query) => {
    const meta = query.meta as QueryMeta | undefined;

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('[QueryCache] Query error:', {
        queryKey: query.queryKey,
        error,
        meta,
      });
    }

    // Record health metrics
    const healthMonitor = getGlobalHealthMonitor();
    const endpoint = Array.isArray(query.queryKey) ? query.queryKey[0] as string : 'unknown';
    healthMonitor.recordFailure(endpoint);

    // Audit log if needed
    if (meta?.auditLog) {
      auditService.logFailure(
        {
          action: 'READ' as any, // Using generic READ action for query errors
          resourceType: 'DOCUMENT' as any, // Using generic DOCUMENT type for API errors
          context: {
            queryKey: query.queryKey,
            errorMessage: error.message,
          },
        },
        error
      );
    }

    // Show user-friendly error message
    const errorMessage = meta?.errorMessage || 'Failed to load data. Please try again.';

    // Only show toast for non-PHI errors to avoid information leakage
    if (!meta?.containsPHI) {
      toast.error(errorMessage, {
        id: `query-error-${query.queryHash}`, // Prevent duplicate toasts
      });
    }
  },

  onSuccess: (data, query) => {
    const meta = query.meta as QueryMeta | undefined;

    // Record health metrics
    const healthMonitor = getGlobalHealthMonitor();
    const endpoint = Array.isArray(query.queryKey) ? query.queryKey[0] as string : 'unknown';
    healthMonitor.recordSuccess(endpoint, 0); // Response time tracked by interceptor

    // Integrate with cache manager for advanced caching
    if (meta?.cacheTags) {
      const cacheManager = getCacheManager();
      const cacheKey = JSON.stringify(query.queryKey);

      cacheManager.set(cacheKey, data, {
        tags: meta.cacheTags,
        containsPHI: meta.containsPHI,
        ttl: meta.cacheTimeOverride || 10 * 60 * 1000, // 10 minutes default
      });
    }
  },
});

/**
 * Mutation Cache with success/error handling
 */
const mutationCache = new MutationCache({
  onSuccess: (data, variables, context, mutation) => {
    const meta = mutation.meta as MutationMeta | undefined;

    if (import.meta.env.DEV) {
      console.log('[MutationCache] Mutation success:', {
        mutationKey: mutation.options.mutationKey,
        meta,
      });
    }

    // Show success toast
    if (meta?.showToast !== false) {
      const successMessage = meta?.successMessage || 'Changes saved successfully';
      toast.success(successMessage);
    }

    // Audit log
    if (meta?.auditAction && meta?.resourceType) {
      auditService.logSuccess({
        action: meta.auditAction as any,
        resourceType: meta.resourceType as any,
        context: {
          mutationKey: mutation.options.mutationKey,
          variables,
        },
      });
    }

    // Invalidate related queries
    if (meta?.invalidateOnSuccess && meta?.invalidateKeys) {
      meta.invalidateKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    }
  },

  onError: (error: any, variables, context, mutation) => {
    const meta = mutation.meta as MutationMeta | undefined;

    if (import.meta.env.DEV) {
      console.error('[MutationCache] Mutation error:', {
        mutationKey: mutation.options.mutationKey,
        error,
        meta,
      });
    }

    // Show error toast
    if (meta?.showToast !== false) {
      const errorMessage = meta?.errorMessage || error.message || 'Operation failed. Please try again.';
      toast.error(errorMessage);
    }

    // Audit log
    if (meta?.auditAction && meta?.resourceType) {
      auditService.logFailure(
        {
          action: meta.auditAction as any,
          resourceType: meta.resourceType as any,
          context: {
            mutationKey: mutation.options.mutationKey,
            variables,
          },
        },
        error
      );
    }
  },
});

/**
 * Create Query Client Instance
 */
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: defaultQueryOptions,
});

// ==========================================
// PERSISTENCE CONFIGURATION
// ==========================================

/**
 * Custom persister that excludes PHI data
 */
const customPersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'white-cross-query-cache',
  serialize: (data) => {
    // Filter out PHI data before serialization
    const filtered = {
      ...data,
      clientState: {
        ...data.clientState,
        queries: data.clientState.queries.filter((query: any) => {
          const meta = query.meta as QueryMeta | undefined;
          // Exclude PHI data and sensitive queries
          return !meta?.containsPHI;
        }),
      },
    };

    return JSON.stringify(filtered);
  },
  deserialize: JSON.parse,
});

/**
 * Setup query persistence (non-PHI data only)
 */
export function setupQueryPersistence(): void {
  persistQueryClient({
    queryClient,
    persister: customPersister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        const meta = query.meta as QueryMeta | undefined;

        // Don't persist PHI data
        if (meta?.containsPHI) {
          return false;
        }

        // Don't persist if there were errors
        if (query.state.status === 'error') {
          return false;
        }

        // Persist successful, non-PHI queries
        return query.state.status === 'success';
      },
    },
  });

  if (import.meta.env.DEV) {
    console.log('[QueryClient] Persistence configured (non-PHI only)');
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Invalidate queries by cache tags
 */
export function invalidateByTags(tags: string[]): Promise<void> {
  const cacheManager = getCacheManager();

  // Invalidate in cache manager
  cacheManager.invalidate({ tags });

  // Find all queries with matching tags and invalidate
  const queries = queryClient.getQueryCache().getAll();

  const keysToInvalidate = queries
    .filter((query) => {
      const meta = query.meta as QueryMeta | undefined;
      return meta?.cacheTags?.some((tag) => tags.includes(tag));
    })
    .map((query) => query.queryKey);

  // Invalidate all matching queries
  return Promise.all(
    keysToInvalidate.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey })
    )
  ).then(() => {});
}

/**
 * Clear all PHI data from cache
 * Call this on logout or when needed for security
 */
export function clearPHICache(): void {
  const queries = queryClient.getQueryCache().getAll();

  queries.forEach((query) => {
    const meta = query.meta as QueryMeta | undefined;
    if (meta?.containsPHI) {
      queryClient.removeQueries({ queryKey: query.queryKey });
    }
  });

  if (import.meta.env.DEV) {
    console.log('[QueryClient] PHI cache cleared');
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const queries = queryClient.getQueryCache().getAll();
  const mutations = queryClient.getMutationCache().getAll();

  const stats = {
    totalQueries: queries.length,
    totalMutations: mutations.length,
    activeQueries: queries.filter((q) => q.state.fetchStatus === 'fetching').length,
    cachedQueries: queries.filter((q) => q.state.status === 'success').length,
    errorQueries: queries.filter((q) => q.state.status === 'error').length,
    phiQueries: queries.filter((q) => {
      const meta = q.meta as QueryMeta | undefined;
      return meta?.containsPHI;
    }).length,
  };

  return stats;
}

/**
 * Prefetch query with error handling
 */
export async function safePrefetch<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number;
    gcTime?: number;
    meta?: QueryMeta;
  }
): Promise<void> {
  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime,
      gcTime: options?.gcTime,
      meta: options?.meta as Record<string, unknown>,
    });
  } catch (error) {
    // Log error but don't throw - prefetch failures are non-critical
    console.warn('[QueryClient] Prefetch failed:', queryKey, error);
  }
}

// ==========================================
// HEALTHCARE-SPECIFIC HELPERS
// ==========================================

/**
 * Student data query meta
 */
export const STUDENT_QUERY_META: QueryMeta = {
  containsPHI: true,
  cacheTags: ['students'],
  auditLog: true,
  staleTimeOverride: 2 * 60 * 1000, // 2 minutes for student data
};

/**
 * Health record query meta
 */
export const HEALTH_RECORD_META: QueryMeta = {
  containsPHI: true,
  cacheTags: ['health-records'],
  auditLog: true,
  staleTimeOverride: 1 * 60 * 1000, // 1 minute for health records
};

/**
 * Medication query meta
 */
export const MEDICATION_META: QueryMeta = {
  containsPHI: true,
  cacheTags: ['medications'],
  auditLog: true,
  staleTimeOverride: 2 * 60 * 1000, // 2 minutes for medications
};

/**
 * Non-PHI configuration meta
 */
export const CONFIG_META: QueryMeta = {
  containsPHI: false,
  cacheTags: ['configuration'],
  staleTimeOverride: 30 * 60 * 1000, // 30 minutes for config
};

// ==========================================
// EXPORTS
// ==========================================

export default queryClient;
