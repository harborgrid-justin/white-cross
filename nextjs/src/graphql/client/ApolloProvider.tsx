/**
 * @fileoverview Apollo Provider for Next.js 15 App Router
 *
 * Provides Apollo Client to the Next.js application with:
 * - Client-side rendering support
 * - Server-side rendering support
 * - Streaming support for React Server Components
 * - Automatic cache hydration
 *
 * @module graphql/client/ApolloProvider
 * @since 1.0.0
 */

'use client';

import { ApolloProvider as ApolloProviderBase } from '@apollo/client';
import { getApolloClient } from './apolloClient';
import { ReactNode } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

/**
 * Apollo Provider wrapper for Next.js App Router
 *
 * Usage in app/layout.tsx:
 * ```tsx
 * import { ApolloProvider } from '@/graphql/client/ApolloProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ApolloProvider>
 *           {children}
 *         </ApolloProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = getApolloClient();

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
}

export default ApolloProvider;
