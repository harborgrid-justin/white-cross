/**
 * @fileoverview GraphQL Error Handling Utilities
 *
 * Utilities for handling GraphQL errors with user-friendly messages
 *
 * @module graphql/utils/errorHandler
 * @since 1.0.0
 */

import { ApolloError, ServerError, ServerParseError } from '@apollo/client';
import { GraphQLError } from 'graphql';

export interface GraphQLErrorResponse {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

/**
 * Extract user-friendly error message from Apollo Error
 */
export const getErrorMessage = (error: ApolloError | Error): string => {
  if (error instanceof ApolloError) {
    // Check for GraphQL errors
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }

    // Check for network errors
    if (error.networkError) {
      return getNetworkErrorMessage(error.networkError);
    }

    // Fallback to generic message
    return error.message || 'An unexpected error occurred';
  }

  return error.message || 'An unexpected error occurred';
};

/**
 * Extract network error message
 */
const getNetworkErrorMessage = (
  error: Error | ServerError | ServerParseError
): string => {
  if ('statusCode' in error) {
    switch (error.statusCode) {
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Network error: ${error.message}`;
    }
  }

  return error.message || 'Network error occurred';
};

/**
 * Get all error messages from Apollo Error
 */
export const getAllErrorMessages = (error: ApolloError): string[] => {
  const messages: string[] = [];

  if (error.graphQLErrors) {
    error.graphQLErrors.forEach((err) => {
      messages.push(err.message);
    });
  }

  if (error.networkError) {
    messages.push(getNetworkErrorMessage(error.networkError));
  }

  return messages.length > 0 ? messages : [error.message];
};

/**
 * Check if error is authentication error
 */
export const isAuthenticationError = (error: ApolloError): boolean => {
  if (error.graphQLErrors) {
    return error.graphQLErrors.some(
      (err) => err.extensions?.code === 'UNAUTHENTICATED'
    );
  }

  if (error.networkError && 'statusCode' in error.networkError) {
    return error.networkError.statusCode === 401;
  }

  return false;
};

/**
 * Check if error is authorization error
 */
export const isAuthorizationError = (error: ApolloError): boolean => {
  if (error.graphQLErrors) {
    return error.graphQLErrors.some(
      (err) => err.extensions?.code === 'FORBIDDEN'
    );
  }

  if (error.networkError && 'statusCode' in error.networkError) {
    return error.networkError.statusCode === 403;
  }

  return false;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error: ApolloError): boolean => {
  if (error.graphQLErrors) {
    return error.graphQLErrors.some(
      (err) => err.extensions?.code === 'BAD_USER_INPUT' ||
               err.extensions?.code === 'VALIDATION_ERROR'
    );
  }

  return false;
};

/**
 * Get field-specific validation errors
 */
export const getFieldErrors = (
  error: ApolloError
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  if (error.graphQLErrors) {
    error.graphQLErrors.forEach((err) => {
      if (err.extensions?.field) {
        fieldErrors[err.extensions.field as string] = err.message;
      }
    });
  }

  return fieldErrors;
};

/**
 * Format error for logging
 */
export const formatErrorForLogging = (error: ApolloError): string => {
  const errorDetails: any = {
    message: error.message,
    graphQLErrors: error.graphQLErrors?.map((err) => ({
      message: err.message,
      code: err.extensions?.code,
      path: err.path,
    })),
    networkError: error.networkError
      ? {
          message: error.networkError.message,
          statusCode: 'statusCode' in error.networkError
            ? error.networkError.statusCode
            : undefined,
        }
      : null,
  };

  return JSON.stringify(errorDetails, null, 2);
};

/**
 * Handle error and return user-friendly response
 */
export const handleGraphQLError = (
  error: ApolloError
): GraphQLErrorResponse => {
  const message = getErrorMessage(error);
  const code = error.graphQLErrors?.[0]?.extensions?.code as string;
  const field = error.graphQLErrors?.[0]?.extensions?.field as string;

  let statusCode: number | undefined;
  if (error.networkError && 'statusCode' in error.networkError) {
    statusCode = error.networkError.statusCode;
  }

  return {
    message,
    code,
    field,
    statusCode,
  };
};
