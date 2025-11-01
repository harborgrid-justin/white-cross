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
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

/**
 * Get API base URL from environment
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
 * Get WebSocket URL for subscriptions
 */
const getWsUrl = (): string => {
  const apiUrl = getApiUrl();
  const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
  const url = new URL(apiUrl);
  return `${wsProtocol}://${url.host}/graphql`;
};

/**
 * Get authentication token from storage
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
 * HTTP link for GraphQL queries and mutations
 */
const httpLink = new HttpLink({
  uri: `${getApiUrl()}/graphql`,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
});

/**
 * WebSocket link for GraphQL subscriptions
 * Only created on client-side
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
 * Authentication link - adds JWT token to requests
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
 * Error handling link
 * Handles authentication errors, network errors, and GraphQL errors
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
 * Retry link - implements exponential backoff for failed requests
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
 * Split link - routes queries to HTTP and subscriptions to WebSocket
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
 * Apollo Client cache configuration
 * HIPAA Compliance: No PHI persisted to storage
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
 * Create Apollo Client instance
 * Singleton pattern for client and server
 */
let apolloClient: ApolloClient<any> | null = null;

export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([
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
 * Get or create Apollo Client instance
 */
export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

/**
 * Reset Apollo Client instance
 * Used for logout or cache invalidation
 */
export const resetApolloClient = async () => {
  if (apolloClient) {
    await apolloClient.clearStore();
    apolloClient = null;
  }
};

export default getApolloClient;
