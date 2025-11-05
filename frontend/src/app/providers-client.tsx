/**
 * Client Providers - Split from Root Layout
 *
 * PERFORMANCE FIX: This file contains ONLY client-side providers,
 * allowing the root layout to remain a Server Component.
 *
 * BEFORE: Root layout had 'use client' forcing entire app client-side
 * AFTER: Only state management is client-side
 *
 * @module app/providers-client
 * @since 2025-11-05
 */

'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/stores/store';

/**
 * Query Client configuration
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * React Query Provider
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

/**
 * Redux Provider with Persistence
 */
export function StateProvider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  );
}

/**
 * All Client Providers Combined
 *
 * This component wraps ONLY the parts that need client-side state.
 * The root layout remains a Server Component.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <StateProvider>{children}</StateProvider>
    </QueryProvider>
  );
}
