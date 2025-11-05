/**
 * Query Client Configuration
 *
 * Shared QueryClient configuration for React Query.
 * Used by both Server Components and Client Components.
 *
 * @module lib/query-client
 * @since 2025-11-05
 */

import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

/**
 * Make QueryClient for server-side use
 *
 * @returns New QueryClient instance
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get QueryClient instance
 *
 * For server: Always creates new instance
 * For browser: Reuses singleton instance
 *
 * @returns QueryClient instance
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This ensures that data is not shared between different users and requests
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
