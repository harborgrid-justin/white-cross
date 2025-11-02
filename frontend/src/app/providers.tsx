'use client';

/**
 * Providers Component - Client-side provider setup for Next.js
 *
 * This component wraps the app with all necessary providers:
 * - React Query Provider (server state)
 * - Redux Provider (client state)
 * - Apollo Provider (GraphQL)
 * - Auth Provider (authentication & authorization)
 * - Navigation Provider (UI navigation state)
 *
 * @module app/providers
 * @category State Management
 */

import React, { type ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/config/queryClient';

// Import consolidated providers
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ApolloProvider } from '@/providers/ApolloProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create a new query client instance per request for SSR
  const [queryClient] = useState(() => getQueryClient());

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider>
          <AuthProvider>
            <NavigationProvider>
              {children}
            </NavigationProvider>
          </AuthProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ApolloProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
