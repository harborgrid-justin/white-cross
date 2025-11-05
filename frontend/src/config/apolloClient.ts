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
 * Retrieves the GraphQL endpoint URL from environment variables.
 *
 * Constructs the full GraphQL endpoint URL using the API base URL from environment variables,
 * ensuring the correct path format for GraphQL queries and mutations.
 *
 * @returns {string} The complete GraphQL endpoint URL
 *
 * @example
 * ```typescript
 * // Development
 * // Returns: "http://localhost:3001/graphql"
 *
 * // Production
 * // Returns: "https://api.example.com/graphql"
 * ```
 */
function getGraphQLEndpoint(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  // GraphQL is at /graphql not /api/graphql
  return baseUrl.replace('/api', '/graphql');
}

/**
 * Retrieves the authentication JWT token from browser localStorage.
 *
 * Safely accesses localStorage to retrieve the user's authentication token,
 * handling server-side rendering where localStorage is unavailable.
 *
 * @returns {string | null} The JWT token string, or null if not available or on server
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * if (token) {
 *   // User is authenticated
 *   headers.authorization = `Bearer ${token}`;
 * }
 * ```
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
 * HTTP Link for Apollo Client - handles GraphQL request transmission.
 *
 * Configured to send GraphQL queries and mutations to the backend server
 * with cookie-based session management support for authentication.
 *
 * @constant {HttpLink}
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-http/
 */
const httpLink = new HttpLink({
  uri: getGraphQLEndpoint(),
  credentials: 'include', // Include cookies for session management
});

/**
 * Authentication Link - adds JWT token and custom headers to GraphQL requests.
 *
 * Intercepts every GraphQL request to inject authentication credentials and
 * client metadata into request headers. This ensures all API calls are properly
 * authenticated and versioned.
 *
 * Headers Added:
 * - authorization: JWT Bearer token (if user is authenticated)
 * - Content-Type: application/json
 * - X-Client-Version: Frontend application version for API compatibility tracking
 *
 * @constant {ApolloLink}
 *
 * @example
 * ```typescript
 * // Request headers when authenticated:
 * {
 *   authorization: "Bearer eyJhbGciOiJIUzI1NiIs...",
 *   "Content-Type": "application/json",
 *   "X-Client-Version": "1.0.0"
 * }
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-context/
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
 * Retry Link - handles transient failures with exponential backoff strategy.
 *
 * Automatically retries failed GraphQL requests for network errors and server errors (5xx),
 * using exponential backoff with jitter to avoid thundering herd problems. Client errors
 * (4xx) are not retried as they indicate invalid requests.
 *
 * Retry Strategy:
 * - Initial delay: 300ms
 * - Maximum delay: 5000ms (5 seconds)
 * - Maximum attempts: 3
 * - Jitter enabled: adds randomness to prevent synchronized retries
 *
 * Retry Conditions:
 * - Network errors: Always retry
 * - 5xx server errors: Retry (server issues)
 * - 4xx client errors: No retry (invalid request)
 *
 * @constant {RetryLink}
 *
 * @example
 * ```typescript
 * // Failed request timeline with exponential backoff:
 * // Attempt 1: fails at t=0
 * // Attempt 2: retry at t=300ms (+ jitter)
 * // Attempt 3: retry at t=900ms (300 * 2^1 + jitter)
 * // Final failure if all attempts exhausted
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-retry/
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
 * Error Link - centralized GraphQL and network error handling.
 *
 * Intercepts all GraphQL errors and network failures to provide consistent error handling,
 * user notifications, and automatic session management. Logs errors for debugging and
 * implements authentication flows when sessions expire.
 *
 * Error Types Handled:
 * - GraphQL errors: Query/mutation validation errors, server-side errors
 * - Network errors: Connection failures, HTTP status errors
 * - Authentication errors: Expired sessions, invalid tokens (redirects to login)
 * - Authorization errors: Insufficient permissions (displays error message)
 *
 * Authentication Flow:
 * - UNAUTHENTICATED error -> Clear token, show message, redirect to /login
 * - 401 status code -> Clear token, show message, redirect to /login
 * - FORBIDDEN error -> Show permission denied message
 *
 * User Experience:
 * - Displays toast notifications for user-friendly error messages
 * - Hides network errors during background refetches
 * - Provides specific messages for rate limiting (429) and server errors (5xx)
 *
 * @constant {ApolloLink}
 *
 * @example
 * ```typescript
 * // Authentication error handling:
 * // 1. User makes query with expired token
 * // 2. Server returns UNAUTHENTICATED error
 * // 3. Error link clears localStorage token
 * // 4. User sees "Session expired" toast
 * // 5. Redirected to /login page
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-error/
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
 * Apollo InMemory Cache with healthcare-specific type policies.
 *
 * Configures normalized caching for GraphQL data with custom merge strategies
 * for paginated queries and computed fields. Optimizes data fetching and reduces
 * redundant network requests for healthcare application data.
 *
 * Type Policies:
 * - Query.contacts: Offset-based pagination with position-aware merging
 * - Query.students: Offset-based pagination with position-aware merging
 * - Contact.fullName: Computed field from firstName + lastName
 * - Student.fullName: Computed field from firstName + lastName
 *
 * Cache Normalization:
 * - Entities are stored by ID for efficient updates
 * - Pagination preserves item positions across fetches
 * - Computed fields reduce redundant data storage
 *
 * @constant {InMemoryCache}
 *
 * @example
 * ```typescript
 * // Pagination merge behavior:
 * // Fetch 1: offset=0, limit=10 -> [items 0-9]
 * // Fetch 2: offset=10, limit=10 -> [items 0-19]
 * // Cache now contains complete dataset [0-19]
 *
 * // Computed field behavior:
 * const student = cache.readFragment({
 *   id: 'Student:123',
 *   fragment: gql`fragment StudentName on Student { fullName }`
 * });
 * // Returns computed "John Doe" from stored firstName + lastName
 * ```
 *
 * @see https://www.apollographql.com/docs/react/caching/cache-configuration/
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
 * Configured Apollo Client instance for GraphQL operations.
 *
 * Main client instance used throughout the application for executing GraphQL
 * queries, mutations, and subscriptions. Combines authentication, retry logic,
 * error handling, and caching into a single client.
 *
 * Link Chain (order matters):
 * 1. retryLink: Retry failed requests with exponential backoff
 * 2. errorLink: Handle and log errors, manage authentication
 * 3. authLink: Add JWT token and headers to requests
 * 4. httpLink: Send requests to GraphQL endpoint
 *
 * Default Options:
 * - watchQuery: Returns partial data and errors for better UX
 * - query: Returns partial data and errors
 * - mutate: Returns partial data and errors
 *
 * DevTools:
 * - Enabled in development for debugging queries and cache
 * - Disabled in production for security and performance
 *
 * @constant {ApolloClient}
 *
 * @example
 * ```typescript
 * import { apolloClient } from '@/config/apolloClient';
 *
 * // Execute a query
 * const { data } = await apolloClient.query({
 *   query: GET_STUDENTS,
 *   variables: { limit: 10 }
 * });
 *
 * // Execute a mutation
 * const { data } = await apolloClient.mutate({
 *   mutation: CREATE_STUDENT,
 *   variables: { input: studentData }
 * });
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/core/ApolloClient/
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
 * Resets Apollo Client cache and clears authentication storage.
 *
 * Completely clears all cached GraphQL data and removes the authentication token
 * from localStorage. Typically called during logout to ensure no stale data remains
 * and to force fresh data fetches on next login.
 *
 * Operations Performed:
 * 1. Clears all cached queries and fragments from Apollo cache
 * 2. Removes auth_token from browser localStorage
 * 3. Resets cache to initial empty state
 *
 * Use Cases:
 * - User logout: Clear all cached patient/healthcare data
 * - Account switching: Ensure clean slate for new user
 * - Session expiry: Reset cache when authentication fails
 * - Development: Reset state during debugging
 *
 * @returns {Promise<void>} Resolves when cache is cleared
 *
 * @example
 * ```typescript
 * // Logout flow
 * async function handleLogout() {
 *   await resetApolloClient();
 *   router.push('/login');
 * }
 *
 * // Account switching
 * async function switchAccount(newUserId: string) {
 *   await resetApolloClient();
 *   await authenticate(newUserId);
 * }
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.clearStore
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
