/**
 * @fileoverview Server-Side Query Utilities for TanStack Query + Next.js SSR
 * @module lib/react-query/serverQuery
 * @category Query
 *
 * Utilities for server-side data fetching and query prefetching in Server Components.
 * Enables efficient SSR with TanStack Query.
 *
 * Features:
 * - Server-side query prefetching
 * - Dehydration for client hydration
 * - Type-safe query builders
 * - HIPAA-compliant (no PHI in dehydrated state)
 *
 * @example
 * ```typescript
 * // In Server Component
 * import { prefetchQuery, dehydrateQueries } from '@/lib/react-query/serverQuery';
 *
 * export default async function Page() {
 *   await prefetchQuery(['students'], fetchStudents);
 *   const dehydratedState = await dehydrateQueries();
 *
 *   return (
 *     <QueryProvider dehydratedState={dehydratedState}>
 *       <StudentsPage />
 *     </QueryProvider>
 *   );
 * }
 * ```
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/query-core';
import { getQueryClient } from '@/config/queryClient';

/**
 * Prefetch a query on the server for SSR
 *
 * Use this in Server Components to prefetch data before rendering.
 * The data will be available immediately on the client via hydration.
 *
 * @param queryKey - Query key array
 * @param queryFn - Query function to fetch data
 * @param options - Optional query options
 * @returns Promise that resolves when query is prefetched
 *
 * @example
 * ```typescript
 * // In Server Component
 * await prefetchQuery(
 *   ['students', { page: 1 }],
 *   () => fetchStudents({ page: 1 }),
 *   { staleTime: 5 * 60 * 1000 } // 5 minutes
 * );
 * ```
 */
export async function prefetchQuery<TData = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: {
    staleTime?: number;
    gcTime?: number;
    meta?: Record<string, unknown>;
  }
): Promise<void> {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
    meta: options?.meta,
  });
}

/**
 * Prefetch multiple queries in parallel
 *
 * @param queries - Array of query configurations
 * @returns Promise that resolves when all queries are prefetched
 *
 * @example
 * ```typescript
 * await prefetchQueries([
 *   {
 *     queryKey: ['students'],
 *     queryFn: fetchStudents,
 *   },
 *   {
 *     queryKey: ['medications'],
 *     queryFn: fetchMedications,
 *   },
 * ]);
 * ```
 */
export async function prefetchQueries(
  queries: Array<{
    queryKey: QueryKey;
    queryFn: () => Promise<unknown>;
    staleTime?: number;
    gcTime?: number;
    meta?: Record<string, unknown>;
  }>
): Promise<void> {
  await Promise.all(
    queries.map((query) =>
      prefetchQuery(
        query.queryKey,
        query.queryFn,
        {
          staleTime: query.staleTime,
          gcTime: query.gcTime,
          meta: query.meta,
        }
      )
    )
  );
}

/**
 * Dehydrate query cache for client hydration
 *
 * Serializes the query cache to pass from server to client.
 * Only includes safe, non-PHI data.
 *
 * @param queryClient - Optional query client (uses default if not provided)
 * @returns Dehydrated state for client hydration
 *
 * @example
 * ```typescript
 * const dehydratedState = await dehydrateQueries();
 *
 * return (
 *   <QueryProvider dehydratedState={dehydratedState}>
 *     <Page />
 *   </QueryProvider>
 * );
 * ```
 */
export async function dehydrateQueries(
  queryClient?: QueryClient
): Promise<DehydratedState> {
  const client = queryClient || getQueryClient();

  // Dehydrate only safe queries (exclude PHI)
  const dehydratedState = dehydrate(client as any, {
    shouldDehydrateQuery: (query: any) => {
      const meta = query.meta as Record<string, unknown> | undefined;

      // Don't dehydrate queries marked as containing PHI
      if (meta?.containsPHI === true) {
        return false;
      }

      // Don't dehydrate queries with errors
      if (query.state.status === 'error') {
        return false;
      }

      return true;
    },
  });

  return dehydratedState;
}

/**
 * Helper to check if we're on the server
 *
 * @returns True if running on server, false on client
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get or create query client for server-side use
 *
 * Always creates a new instance on server to avoid state leakage.
 * On client, reuses existing instance.
 *
 * @returns Query client instance
 */
export function getServerQueryClient(): QueryClient {
  return getQueryClient();
}

/**
 * Prefetch healthcare-specific queries
 *
 * Common patterns for healthcare data prefetching
 */
export const healthcarePrefetch = {
  /**
   * Prefetch student data (non-PHI list only)
   *
   * @param params - Query parameters
   */
  async students(params?: { page?: number; limit?: number }) {
    await prefetchQuery(
      ['students', 'list', params],
      async () => {
        // Fetch student list (IDs and names only, no PHI)
        const response = await fetch(`/students?${new URLSearchParams(params as any)}`);
        return response.json();
      },
      {
        staleTime: 5 * 60 * 1000, // 5 minutes
        meta: { containsPHI: false }, // List view is safe
      }
    );
  },

  /**
   * Prefetch appointments (non-PHI summary)
   *
   * @param params - Query parameters
   */
  async appointments(params?: { date?: string; nurseId?: string }) {
    await prefetchQuery(
      ['appointments', 'list', params],
      async () => {
        const response = await fetch(`/appointments?${new URLSearchParams(params as any)}`);
        return response.json();
      },
      {
        staleTime: 2 * 60 * 1000, // 2 minutes
        meta: { containsPHI: false },
      }
    );
  },

  /**
   * Prefetch dashboard statistics (aggregated, non-PHI)
   */
  async dashboardStats() {
    await prefetchQuery(
      ['dashboard', 'stats'],
      async () => {
        const response = await fetch('/dashboard/stats');
        return response.json();
      },
      {
        staleTime: 1 * 60 * 1000, // 1 minute
        meta: { containsPHI: false },
      }
    );
  },

  /**
   * Prefetch user settings (non-PHI)
   */
  async userSettings(userId: string) {
    await prefetchQuery(
      ['users', userId, 'settings'],
      async () => {
        const response = await fetch(`/users/${userId}/settings`);
        return response.json();
      },
      {
        staleTime: 10 * 60 * 1000, // 10 minutes
        meta: { containsPHI: false },
      }
    );
  },
};

export default {
  prefetchQuery,
  prefetchQueries,
  dehydrateQueries,
  getServerQueryClient,
  isServer,
  healthcarePrefetch,
};
