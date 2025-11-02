/**
 * @fileoverview Apollo GraphQL Provider - Consolidated
 * @module providers/ApolloProvider
 * @category State Management
 *
 * Provides Apollo Client to the Next.js application with:
 * - Client-side rendering support
 * - Server-side rendering support
 * - Streaming support for React Server Components
 * - Automatic cache hydration
 *
 * @example
 * ```typescript
 * import { ApolloProvider } from '@/providers/ApolloProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <ApolloProvider>
 *       {children}
 *     </ApolloProvider>
 *   );
 * }
 * ```
 */

'use client';

import { ApolloProvider as ApolloProviderBase } from '@apollo/client/react';
import { apolloClient } from '@/config/apolloClient';
import type { ReactNode } from 'react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface ApolloProviderProps {
  /** Child components to wrap */
  children: ReactNode;
}

// ==========================================
// PROVIDER COMPONENT
// ==========================================

/**
 * Apollo Provider wrapper for Next.js App Router
 *
 * Wraps the application with Apollo Client for GraphQL data fetching.
 *
 * @param {ApolloProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider tree
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>;
}

export default ApolloProvider;
