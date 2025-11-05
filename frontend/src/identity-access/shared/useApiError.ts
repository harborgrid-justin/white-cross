/**
 * @fileoverview API Error handling hook
 * @module identity-access/shared/useApiError
 * 
 * Centralized error handling for API operations.
 * Provides consistent error formatting and user-friendly messages.
 */

import { useCallback } from 'react';
import { AxiosError } from 'axios';

/**
 * API Error types for better error handling
 */
export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: unknown;
  context?: string;
}

/**
 * Error context types for different API operations
 */
export type ErrorContext = 
  | 'fetch_user_permissions'
  | 'update_permissions'
  | 'check_permission'
  | 'fetch_roles'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'network'
  | 'server'
  | 'unknown';

/**
 * Hook for consistent API error handling
 * 
 * @returns Object with handleError function
 */
export function useApiError() {
  const handleError = useCallback((error: unknown, context: ErrorContext = 'unknown'): ApiError => {
    // Create base error object
    const apiError: ApiError = new Error() as ApiError;
    apiError.context = context;

    // Handle Axios errors
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      apiError.status = axiosError.response?.status;
      apiError.code = axiosError.code;
      
      // Extract error message from response
      const responseData = axiosError.response?.data as Record<string, unknown>;
      if (responseData?.message && typeof responseData.message === 'string') {
        apiError.message = responseData.message;
      } else if (responseData?.error && typeof responseData.error === 'string') {
        apiError.message = responseData.error;
      } else {
        apiError.message = getDefaultErrorMessage(axiosError.response?.status, context);
      }
      
      // Include additional details
      apiError.details = responseData;
    }
    // Handle regular Error objects
    else if (error instanceof Error) {
      apiError.message = error.message;
      apiError.code = 'CLIENT_ERROR';
    }
    // Handle string errors
    else if (typeof error === 'string') {
      apiError.message = error;
      apiError.code = 'CLIENT_ERROR';
    }
    // Handle unknown error types
    else {
      apiError.message = getDefaultErrorMessage(undefined, context);
      apiError.code = 'UNKNOWN_ERROR';
      apiError.details = error;
    }

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error [${context}]:`, {
        message: apiError.message,
        status: apiError.status,
        code: apiError.code,
        details: apiError.details,
        originalError: error
      });
    }

    return apiError;
  }, []);

  return { handleError };
}

/**
 * Get default error message based on status code and context
 */
function getDefaultErrorMessage(status?: number, context?: ErrorContext): string {
  // Context-specific messages
  const contextMessages: Record<ErrorContext, string> = {
    fetch_user_permissions: 'Failed to load user permissions',
    update_permissions: 'Failed to update permissions',
    check_permission: 'Failed to check permission',
    fetch_roles: 'Failed to load roles',
    authentication: 'Authentication failed',
    authorization: 'Access denied',
    validation: 'Invalid data provided',
    network: 'Network connection failed',
    server: 'Server error occurred',
    unknown: 'An unexpected error occurred'
  };

  // Status-specific messages
  const statusMessages: Record<number, string> = {
    400: 'Invalid request data',
    401: 'Authentication required',
    403: 'Access denied',
    404: 'Resource not found',
    409: 'Conflict with existing data',
    422: 'Validation failed',
    429: 'Too many requests',
    500: 'Internal server error',
    502: 'Service unavailable',
    503: 'Service temporarily unavailable',
    504: 'Request timeout'
  };

  // Return status-specific message if available
  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  // Return context-specific message
  if (context && contextMessages[context]) {
    return contextMessages[context];
  }

  // Fallback message
  return 'An unexpected error occurred';
}

/**
 * Utility function to check if an error is an Axios error
 */
function isAxiosError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === 'object' &&
    ('isAxiosError' in error || 'response' in error)
  );
}

/**
 * Utility function to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'context' in error &&
    'message' in error
  );
}

/**
 * Utility function to extract user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}
