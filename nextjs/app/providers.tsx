'use client';

/**
 * Client-side Providers Component
 *
 * This component wraps the application with all necessary providers:
 * - Redux Store Provider
 * - TanStack Query Client Provider
 * - Apollo GraphQL Client Provider
 * - Authentication Context Provider
 * - Global Error Boundary
 * - Toast Notifications
 *
 * @remarks
 * This component must be a Client Component ('use client') because it uses
 * React context and client-side state management.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

// Import from existing Next.js src structure
import { store } from '@/hooks/reduxStore';
import { apolloClient } from '@/lib/apolloClient';
import { GlobalErrorBoundary } from '@/components/shared/errors/GlobalErrorBoundary';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <GlobalErrorBoundary enableAuditLogging>
      <ReduxProvider store={store}>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ApolloProvider>
      </ReduxProvider>
    </GlobalErrorBoundary>
  );
}
