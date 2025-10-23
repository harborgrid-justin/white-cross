/**
 * WF-COMP-APOLLO-001 | apolloClient.ts - Apollo Client Configuration
 * Purpose: Configure Apollo Client for GraphQL API integration
 *
 * Features:
 * - GraphQL query and mutation support
 * - Authentication integration
 * - Error handling and retry logic
 * - Cache management
 * - Healthcare-specific policies
 *
 * Security:
 * - JWT token integration
 * - PHI data handling
 * - Audit logging integration
 *
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import toast from 'react-hot-toast';
import { auditService } from '../services/audit';

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Get GraphQL endpoint URL
 */
function getGraphQLEndpoint(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  // GraphQL is at /graphql not /api/graphql
  return baseUrl.replace('/api', '/graphql');
}

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('[Apollo] Failed to get auth token:', error);
    return null;
  }
}

// ==========================================
// APOLLO LINKS
// ==========================================

/**
 * HTTP Link - handles GraphQL requests
 */
const httpLink = new HttpLink({
  uri: getGraphQLEndpoint(),
  credentials: 'include', // Include cookies for session management
});

/**
 * Auth Link - adds authentication headers
 */
const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
      'X-Client-Version': import.meta.env.VITE_APP_VERSION || '1.0.0',
    },
  };
});

/**
 * Retry Link - handles transient failures with exponential backoff
 */
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors or 5xx server errors
      return !!error && (!error.statusCode || error.statusCode >= 500);
    },
  },
});

/**
 * Error Link - handles GraphQL and network errors
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorCode = extensions?.code as string;
      
      // Log error in development
      if (import.meta.env.DEV) {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${errorCode}`
        );
      }

      // Handle authentication errors
      if (errorCode === 'UNAUTHENTICATED') {
        toast.error('Session expired. Please log in again.');
        // Clear auth token
        localStorage.removeItem('auth_token');
        // Redirect to login (if not already there)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return;
      }

      // Handle authorization errors
      if (errorCode === 'FORBIDDEN') {
        toast.error('You do not have permission to perform this action.');
        return;
      }

      // Handle not found errors
      if (errorCode === 'NOT_FOUND') {
        toast.error('The requested resource was not found.');
        return;
      }

      // Handle validation errors
      if (errorCode === 'BAD_USER_INPUT') {
        toast.error(`Validation error: ${message}`);
        return;
      }

      // Audit log for errors
      auditService.logFailure(
        {
          action: 'GRAPHQL_ERROR',
          resourceType: 'API',
          context: {
            operation: operation.operationName,
            message,
            code: errorCode,
            path,
          },
        },
        new Error(message)
      );

      // Show generic error for other cases
      toast.error('An error occurred. Please try again.');
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Check if it's a connectivity issue
    if ('statusCode' in networkError) {
      const statusCode = (networkError as any).statusCode;
      
      if (statusCode >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (statusCode === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('auth_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } else {
      toast.error('Unable to connect to server. Please check your connection.');
    }

    // Audit log for network errors
    auditService.logFailure(
      {
        action: 'NETWORK_ERROR',
        resourceType: 'API',
        context: {
          operation: operation.operationName,
          error: networkError.message,
        },
      },
      networkError
    );
  }
});

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Apollo Cache configuration with type policies
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Pagination handling for contacts
        contacts: {
          keyArgs: ['filters', 'orderBy', 'orderDirection'],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming;
            
            // Handle pagination - append or replace based on page
            if (args?.page === 1) {
              return incoming;
            }
            
            return {
              ...incoming,
              contacts: [...(existing.contacts || []), ...(incoming.contacts || [])],
            };
          },
        },
        // Pagination handling for students
        students: {
          keyArgs: ['filters', 'orderBy'],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming;
            
            if (args?.page === 1) {
              return incoming;
            }
            
            return {
              ...incoming,
              students: [...(existing.students || []), ...(incoming.students || [])],
            };
          },
        },
      },
    },
    Contact: {
      keyFields: ['id'],
      fields: {
        // Computed fields are handled by resolvers
        fullName: {
          read(_, { readField }) {
            const firstName = readField('firstName');
            const lastName = readField('lastName');
            return `${firstName} ${lastName}`;
          },
        },
      },
    },
    Student: {
      keyFields: ['id'],
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

// ==========================================
// APOLLO CLIENT INSTANCE
// ==========================================

/**
 * Create Apollo Client instance
 */
export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    retryLink,
    authLink,
    httpLink,
  ]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: import.meta.env.DEV,
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Clear Apollo cache (called on logout)
 */
export function clearApolloCache(): void {
  apolloClient.clearStore().catch((error) => {
    console.error('[Apollo] Failed to clear cache:', error);
  });
  
  if (import.meta.env.DEV) {
    console.log('[Apollo] Cache cleared');
  }
}

/**
 * Refetch all active queries
 */
export function refetchActiveQueries(): Promise<any[]> {
  return apolloClient.refetchQueries({
    include: 'active',
  });
}

/**
 * Get cache statistics
 */
export function getApolloCacheStats() {
  const cache = apolloClient.cache;
  const extract = cache.extract();
  
  return {
    entries: Object.keys(extract).length,
    size: JSON.stringify(extract).length,
  };
}

export default apolloClient;
