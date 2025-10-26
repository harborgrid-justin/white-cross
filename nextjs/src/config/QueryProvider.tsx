/**
 * @fileoverview TanStack Query Provider for Next.js 15 App Router
 * @module config/QueryProvider
 * @category Configuration
 *
 * Provides React Query context to the component tree in Next.js App Router.
 * Must be used in client components only.
 *
 * Features:
 * - Client-side only (no SSR)
 * - Automatic client creation per request
 * - DevTools integration in development
 * - Type-safe context
 *
 * @example
 * ```typescript
 * // In app/layout.tsx
 * import { QueryProvider } from '@/config/QueryProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <QueryProvider>
 *           {children}
 *         </QueryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from './queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider Component
 * Wraps the app with React Query Provider for server state management
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Get or create query client
  // In Next.js App Router, each client gets its own instance
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* React Query DevTools - only in development */}
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
