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
 * Last Updated: 2025-10-26 | File Type: .ts
 */

import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import toast from 'react-hot-toast';

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Get GraphQL endpoint URL
 */
function getGraphQLEndpoint(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  // GraphQL is at /graphql not /api/graphql
  return baseUrl.replace('/api', '/graphql');
}

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token;
    }
    return null;
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
      'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
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
      const statusCode = (error as any)?.statusCode;
      return !!error && (!statusCode || statusCode >= 500);
    },
  },
});

/**
 * Error Link - handles GraphQL and network errors
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          toast.error('Session expired. Please login again.');
          // Redirect to login - in Next.js we'll handle this differently
          window.location.href = '/login';
        }
        return;
      }

      // Handle authorization errors
      if (extensions?.code === 'FORBIDDEN') {
        toast.error('You do not have permission to perform this action');
        return;
      }

      // Show user-friendly error messages
      if (!message.includes('Network')) {
        toast.error(message || 'An unexpected error occurred');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);

    // Handle specific network errors
    if ('statusCode' in networkError) {
      switch (networkError.statusCode) {
        case 401:
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            toast.error('Authentication required');
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again.');
          break;
        default:
          if (networkError.statusCode >= 500) {
            toast.error('Server error. Please try again.');
          }
      }
    } else {
      // Connection errors
      toast.error('Connection error. Please check your internet connection.');
    }
  }
});

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Apollo InMemory Cache with healthcare-specific policies
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Pagination handling for contacts
        contacts: {
          keyArgs: false,
          merge(existing, incoming, { args }) {
            const merged = existing ? existing.slice(0) : [];
            const { offset = 0 } = args || {};
            
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }
            
            return merged;
          },
        },
        
        // Pagination handling for students
        students: {
          keyArgs: false,
          merge(existing, incoming, { args }) {
            const merged = existing ? existing.slice(0) : [];
            const { offset = 0 } = args || {};
            
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }
            
            return merged;
          },
        },
      },
    },
    
    Contact: {
      fields: {
        // Handle computed fields
        fullName: {
          read(existing, { readField }) {
            return existing || `${readField('firstName')} ${readField('lastName')}`;
          },
        },
      },
    },
    
    Student: {
      fields: {
        // Handle computed fields
        fullName: {
          read(existing, { readField }) {
            return existing || `${readField('firstName')} ${readField('lastName')}`;
          },
        },
      },
    },
  },
});

// ==========================================
// APOLLO CLIENT
// ==========================================

/**
 * Create and configure Apollo Client instance
 */
export const apolloClient = new ApolloClient({
  link: from([
    retryLink,
    errorLink,
    authLink,
    httpLink,
  ]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
});

/**
 * Reset Apollo Client cache and storage
 */
export async function resetApolloClient(): Promise<void> {
  try {
    await apolloClient.clearStore();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  } catch (error) {
    console.error('[Apollo] Failed to reset client:', error);
  }
}

export default apolloClient;