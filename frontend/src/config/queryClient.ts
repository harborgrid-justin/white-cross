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

import { QueryClient, QueryCache, MutationCache, DefaultOptions } from '@tanstack/react-query';
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
 * Default query options with healthcare-specific settings
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
    retry: (failureCount, error) => {
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
    
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
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
 * Query cache with error handling and audit logging
 */
const queryCache = new QueryCache({
  onError: (error, query) => {
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
  
  onSuccess: (data, query) => {
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
 * Mutation cache with success/error handling and audit logging
 */
const mutationCache = new MutationCache({
  onSuccess: (data, variables, context, mutation) => {
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
  
  onError: (error, variables, context, mutation) => {
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
 * Create QueryClient instance for server-side rendering
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions,
  });
}

/**
 * Global QueryClient instance for client-side
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get QueryClient instance - creates new for SSR, reuses for client
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
 * Invalidate queries by cache tags
 */
export async function invalidateByTags(tags: string[]): Promise<void> {
  const client = getQueryClient();
  
  // Find all queries that match any of the provided tags
  const queriesToInvalidate = client.getQueryCache().findAll({
    predicate: (query) => {
      const meta = query.meta as QueryMeta | undefined;
      const queryTags = meta?.cacheTags || [];
      return tags.some(tag => queryTags.includes(tag));
    },
  });
  
  // Invalidate matching queries
  const invalidationPromises = queriesToInvalidate.map(query =>
    client.invalidateQueries({ queryKey: query.queryKey })
  );
  
  await Promise.all(invalidationPromises);
}

/**
 * Clear all cached data (useful for logout)
 */
export async function clearAllData(): Promise<void> {
  const client = getQueryClient();
  client.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const client = getQueryClient();
  const queries = client.getQueryCache().getAll();
  
  return {
    totalQueries: queries.length,
    activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
    staleQueries: queries.filter(q => q.isStale()).length,
    phiQueries: queries.filter(q => (q.meta as QueryMeta)?.containsPHI).length,
  };
}

export default queryClient;
