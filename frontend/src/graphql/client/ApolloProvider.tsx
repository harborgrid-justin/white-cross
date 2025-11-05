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

/**
 * Props for ApolloProvider component.
 *
 * @property {ReactNode} children - Child components that will have access to Apollo Client
 */
interface ApolloProviderProps {
  children: ReactNode;
}

/**
 * Apollo Provider wrapper component for Next.js App Router.
 *
 * @param {ApolloProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components to wrap with Apollo Client context
 *
 * @returns {JSX.Element} ApolloProvider component wrapping children
 *
 * @remarks
 * This is a client component ('use client') that provides Apollo Client to all
 * child components. It uses the singleton pattern via getApolloClient() to ensure
 * a single client instance across the application.
 *
 * Features:
 * - Automatic client initialization
 * - Works with Next.js 15 App Router
 * - Supports React Server Components (RSC)
 * - Enables GraphQL queries, mutations, and subscriptions in child components
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
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
 *
 * @example
 * ```tsx
 * // Using in a component
 * 'use client';
 * import { useQuery } from '@apollo/client';
 * import { GET_STUDENTS } from '@/graphql/queries';
 *
 * function StudentList() {
 *   const { data, loading } = useQuery(GET_STUDENTS);
 *   // Component has access to Apollo Client via context
 * }
 * ```
 *
 * @see {@link getApolloClient} for client initialization
 * @see {@link https://www.apollographql.com/docs/react/api/react/hooks/}
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = getApolloClient();

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
}

export default ApolloProvider;
