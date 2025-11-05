/**
 * @fileoverview Apollo Client Configuration for Next.js 15
 *
 * Configures Apollo Client for Next.js App Router with:
 * - Authentication with JWT tokens
 * - Retry logic and error handling
 * - Cache policies with HIPAA compliance
 * - WebSocket subscriptions for real-time updates
 * - Request batching and deduplication
 *
 * @module graphql/client/apolloClient
 * @since 1.0.0
 *
 * @security JWT authentication integrated
 * @compliance HIPAA - No PHI in persisted cache
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  split,
  Operation,
  NextLink,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

/**
 * Retrieves the API base URL from environment variables.
 *
 * @returns {string} The GraphQL API URL, defaults to http://localhost:3001 if not configured
 *
 * @remarks
 * Works in both server-side and client-side contexts. Uses NEXT_PUBLIC_API_URL
 * environment variable for configuration.
 *
 * @example
 * ```typescript
 * const apiUrl = getApiUrl();
 * // Returns: 'http://localhost:3001' or configured URL
 * ```
 */
const getApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

/**
 * Constructs the WebSocket URL for GraphQL subscriptions.
 *
 * @returns {string} The WebSocket URL with wss:// or ws:// protocol
 *
 * @remarks
 * Automatically determines the protocol based on the API URL:
 * - Uses wss:// for https endpoints (secure)
 * - Uses ws:// for http endpoints (development)
 *
 * @example
 * ```typescript
 * const wsUrl = getWsUrl();
 * // Returns: 'ws://localhost:3001/graphql' or 'wss://api.example.com/graphql'
 * ```
 */
const getWsUrl = (): string => {
  const apiUrl = getApiUrl();
  const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
  const url = new URL(apiUrl);
  return `${wsProtocol}://${url.host}/graphql`;
};

/**
 * Retrieves the authentication token from browser storage.
 *
 * @returns {string | null} The JWT authentication token, or null if not found or on server-side
 *
 * @remarks
 * Token retrieval follows this priority:
 * 1. localStorage (persistent across sessions)
 * 2. sessionStorage (single session)
 * 3. Returns null if not found or on server-side
 *
 * @throws {Error} Logs error to console if storage access fails
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * if (token) {
 *   // User is authenticated
 * }
 * ```
 *
 * @see {@link authLink} for how the token is used in requests
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Try to get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) return token;

    // Fallback to sessionStorage
    return sessionStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * HTTP link for GraphQL queries and mutations.
 *
 * @remarks
 * Configured with:
 * - CORS mode enabled for cross-origin requests
 * - credentials: 'include' for cookie-based authentication
 * - Connects to /graphql endpoint
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-http/}
 */
const httpLink = new HttpLink({
  uri: `${getApiUrl()}/graphql`,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
});

/**
 * WebSocket link for GraphQL subscriptions.
 *
 * @remarks
 * Only created on client-side (null during SSR). Configured with:
 * - Automatic reconnection (5 retry attempts)
 * - JWT authentication via connection params
 * - Always retries on connection failure
 *
 * Used for real-time updates like appointment notifications, medication reminders,
 * and health record changes.
 *
 * @see {@link https://www.apollographql.com/docs/react/data/subscriptions/}
 */
const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: getWsUrl(),
        connectionParams: () => {
          const token = getAuthToken();
          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
        retryAttempts: 5,
        shouldRetry: () => true,
      })
    )
  : null;

/**
 * Authentication link that adds JWT token to all GraphQL requests.
 *
 * @remarks
 * Adds the following headers to every request:
 * - authorization: Bearer token for authentication
 * - x-client-name: Identifies the client application
 * - x-client-version: Client version for compatibility tracking
 *
 * If no token is available, sends empty authorization header.
 *
 * @see {@link getAuthToken} for token retrieval logic
 */
const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-client-name': 'white-cross-nextjs',
      'x-client-version': '1.0.0',
    },
  };
});

/**
 * Error handling link for GraphQL operations.
 *
 * @remarks
 * Handles three types of errors:
 *
 * 1. GraphQL Errors:
 *    - UNAUTHENTICATED: Clears tokens and redirects to login
 *    - FORBIDDEN: Logs access denied message
 *
 * 2. Network Errors:
 *    - Logs connection issues
 *    - Detects offline mode
 *
 * 3. All errors are logged to console with context
 *
 * @see {@link https://www.apollographql.com/docs/react/data/error-handling/}
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const { message, locations, path, extensions } = error;

      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        if (typeof window !== 'undefined') {
          // Clear auth token
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');

          // Redirect to login
          window.location.href = '/auth/login';
        }
      }

      // Handle forbidden errors
      if (extensions?.code === 'FORBIDDEN') {
        console.error('Access denied:', message);
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle offline mode
    if (!navigator.onLine) {
      console.warn('Application is offline');
    }
  }
});

/**
 * Retry link implementing exponential backoff for failed requests.
 *
 * @remarks
 * Retry configuration:
 * - Initial delay: 300ms
 * - Max delay: 3000ms
 * - Max attempts: 3
 * - Jitter enabled to prevent thundering herd
 * - Mutations are NOT retried by default to prevent duplicate operations
 * - Only retries on network errors (not GraphQL errors)
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-retry/}
 */
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      // Don't retry mutations by default
      const definition = getMainDefinition(operation.query);
      if (definition.kind === 'OperationDefinition' && definition.operation === 'mutation') {
        return false;
      }

      // Retry on network errors
      return !!error;
    },
  },
});

/**
 * Split link that routes operations based on type.
 *
 * @remarks
 * Routing logic:
 * - Subscriptions → WebSocket link (real-time)
 * - Queries/Mutations → HTTP link (request/response)
 *
 * On server-side, all operations use HTTP link (no WebSocket support in SSR).
 */
const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

/**
 * Apollo Client in-memory cache configuration.
 *
 * @remarks
 * HIPAA Compliance: No PHI persisted to browser storage.
 *
 * Cache features:
 * - Pagination support with merge strategies
 * - Computed fields (fullName) for Student and Contact
 * - Type policies for normalized data storage
 * - Automatic cache updates on queries and mutations
 *
 * Paginated fields:
 * - students: Merges based on filters
 * - medications: Merges based on filters
 * - healthRecords: Merges based on filters
 * - appointments: Merges based on filters
 *
 * @see {@link https://www.apollographql.com/docs/react/caching/cache-configuration/}
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Merge pagination results
        students: {
          keyArgs: ['filters'],
          merge(existing = { students: [], pagination: {} }, incoming) {
            return {
              students: [...existing.students, ...incoming.students],
              pagination: incoming.pagination,
            };
          },
        },
        medications: {
          keyArgs: ['filters'],
          merge(existing = { medications: [], pagination: {} }, incoming) {
            return {
              medications: [...existing.medications, ...incoming.medications],
              pagination: incoming.pagination,
            };
          },
        },
        healthRecords: {
          keyArgs: ['filters'],
          merge(existing = { records: [], pagination: {} }, incoming) {
            return {
              records: [...existing.records, ...incoming.records],
              pagination: incoming.pagination,
            };
          },
        },
        appointments: {
          keyArgs: ['filters'],
          merge(existing = { appointments: [], pagination: {} }, incoming) {
            return {
              appointments: [...existing.appointments, ...incoming.appointments],
              pagination: incoming.pagination,
            };
          },
        },
      },
    },
    Student: {
      fields: {
        fullName: {
          read(_, { readField }) {
            const firstName = readField('firstName');
            const lastName = readField('lastName');
            return `${firstName} ${lastName}`;
          },
        },
      },
    },
    Contact: {
      fields: {
        fullName: {
          read(_, { readField }) {
            const firstName = readField('firstName');
            const lastName = readField('lastName');
            return `${firstName} ${lastName}`;
          },
        },
      },
    },
  },
});

/**
 * Singleton Apollo Client instance.
 *
 * @remarks
 * Null until first client creation. Reset on logout or cache invalidation.
 */
let apolloClient: ApolloClient<any> | null = null;

/**
 * Import query complexity link (Item 193)
 */
import { queryComplexityLink } from '../plugins/query-complexity';

/**
 * Creates a new Apollo Client instance with full configuration.
 *
 * @returns {ApolloClient} Configured Apollo Client instance
 *
 * @remarks
 * Configuration includes:
 * - SSR mode detection for server-side rendering
 * - Link chain: query complexity → error → retry → auth → split (HTTP/WS)
 * - In-memory cache with type policies
 * - Default fetch policies for optimal performance
 * - DevTools integration in development mode
 *
 * Default fetch policies:
 * - watchQuery: cache-and-network (show cached data, update with network)
 * - query: network-only (always fetch fresh data)
 * - mutate: all error policy (don't throw on GraphQL errors)
 *
 * @example
 * ```typescript
 * const client = createApolloClient();
 * // Use with Apollo Provider
 * ```
 *
 * @see {@link getApolloClient} for singleton pattern usage
 */
export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([
      queryComplexityLink, // Item 193: Query complexity management
      errorLink,
      retryLink,
      authLink,
      splitLink,
    ]),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
};

/**
 * Retrieves the singleton Apollo Client instance, creating it if necessary.
 *
 * @returns {ApolloClient} The Apollo Client singleton instance
 *
 * @remarks
 * Implements singleton pattern to ensure one client instance across the application.
 * Safe to call multiple times - returns existing instance after first creation.
 *
 * @example
 * ```typescript
 * // In any component or hook
 * const client = getApolloClient();
 * const { data } = await client.query({ query: GET_STUDENTS });
 * ```
 *
 * @see {@link createApolloClient} for instance creation details
 * @see {@link resetApolloClient} for clearing the singleton
 */
export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

/**
 * Resets the Apollo Client singleton by clearing cache and nullifying instance.
 *
 * @returns {Promise<void>} Resolves when cache is cleared
 *
 * @remarks
 * Use cases:
 * - User logout: Clear all cached data including PHI
 * - Cache invalidation: Force fresh data fetch
 * - Authentication changes: Reset for new user session
 *
 * Performs two operations:
 * 1. Clears all cached data (clearStore)
 * 2. Nullifies singleton instance (allows garbage collection)
 *
 * @example
 * ```typescript
 * // During logout
 * await resetApolloClient();
 * localStorage.removeItem('auth_token');
 * router.push('/auth/login');
 * ```
 *
 * @see {@link getApolloClient} to create new instance after reset
 */
export const resetApolloClient = async () => {
  if (apolloClient) {
    await apolloClient.clearStore();
    apolloClient = null;
  }
};

export default getApolloClient;
