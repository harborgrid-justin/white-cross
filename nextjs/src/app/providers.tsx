'use client';

/**
 * Providers Component - Client-side provider setup for Next.js
 * 
 * This component wraps the app with all necessary providers:
 * - React Query Provider
 * - Redux Provider  
 * - Apollo Provider
 * - Theme Provider
 */

import { ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client/react';
import { getQueryClient } from '@/config/queryClient';
import { apolloClient } from '@/config/apolloClient';
import { store } from '@/stores/store';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create a new query client instance per request for SSR
  const [queryClient] = useState(() => getQueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ApolloProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}