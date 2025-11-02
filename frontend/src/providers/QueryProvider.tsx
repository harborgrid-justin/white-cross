/**
 * @fileoverview TanStack Query Provider - Consolidated
 * @module providers/QueryProvider
 * @category State Management
 *
 * Provides TanStack Query (React Query) context to the application.
 * This is the single source of truth for Query provider configuration.
 *
 * Features:
 * - SSR-compatible query client
 * - Automatic hydration on client
 * - DevTools in development
 * - HIPAA-compliant caching
 * - Per-request client instances
 *
 * @example Basic usage
 * ```typescript
 * import { QueryProvider } from '@/providers/QueryProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <QueryProvider>
 *       {children}
 *     </QueryProvider>
 *   );
 * }
 * ```
 *
 * @example With SSR hydration
 * ```typescript
 * // Server Component
 * const dehydratedState = await prefetchQueries();
 *
 * // Pass to client
 * <QueryProvider dehydratedState={dehydratedState}>
 *   <App />
 * </QueryProvider>
 * ```
 */

'use client';

import { ReactNode, useState } from 'react';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/config/queryClient';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface QueryProviderProps {
  /** Child components to wrap */
  children: ReactNode;
  /**
   * Dehydrated state from server-side prefetching.
   * Pass this from Server Components to hydrate on client.
   */
  dehydratedState?: unknown;
}

// ==========================================
// PROVIDER COMPONENT
// ==========================================

/**
 * Query Provider Component with SSR Hydration
 *
 * Wraps the app with TanStack Query provider and handles SSR hydration.
 * Creates a new query client per request on server, reuses on client.
 *
 * @param {QueryProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @param {unknown} [props.dehydratedState] - Optional dehydrated state from server
 * @returns {JSX.Element} Provider tree
 */
export function QueryProvider({ children, dehydratedState }: QueryProviderProps) {
  // Create query client once per client (not per render)
  // On server, getQueryClient() creates new instance per request
  // On client, getQueryClient() reuses the same instance
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
      </HydrationBoundary>

      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;
