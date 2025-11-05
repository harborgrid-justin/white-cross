/**
 * @fileoverview GraphQL Client Exports
 *
 * Centralized exports for Apollo Client configuration and provider components.
 *
 * @module graphql/client
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Import client functions
 * import { getApolloClient, resetApolloClient } from '@/graphql/client';
 *
 * const client = getApolloClient();
 * await resetApolloClient(); // on logout
 * ```
 *
 * @example
 * ```tsx
 * // Import provider component
 * import { ApolloProvider } from '@/graphql/client';
 *
 * export default function RootLayout({ children }) {
 *   return <ApolloProvider>{children}</ApolloProvider>;
 * }
 * ```
 */

/**
 * Apollo Client factory function - creates new configured client instance
 * @see {@link apolloClient.createApolloClient}
 */
export { createApolloClient } from './apolloClient';

/**
 * Apollo Client singleton getter - returns existing or creates new client
 * @see {@link apolloClient.getApolloClient}
 */
export { getApolloClient } from './apolloClient';

/**
 * Apollo Client reset function - clears cache and nullifies singleton
 * @see {@link apolloClient.resetApolloClient}
 */
export { resetApolloClient } from './apolloClient';

/**
 * Apollo Provider component for Next.js App Router
 * @see {@link ApolloProvider.ApolloProvider}
 */
export { ApolloProvider } from './ApolloProvider';
