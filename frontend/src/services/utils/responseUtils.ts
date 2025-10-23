/**
 * Response Utilities
 * Type-safe utilities for handling API responses
 */

import { AxiosResponse } from 'axios';
import { ApiResponse } from './apiUtils';
import { ApiError } from '../core/errors';

/**
 * Unwrap API response data safely with type validation
 * Handles the common pattern of response.data.data
 *
 * @param response - Axios response with ApiResponse wrapper
 * @returns Unwrapped data of type T
 * @throws ApiError if response structure is invalid
 */
export function unwrapApiResponse<T>(
  response: AxiosResponse<ApiResponse<T>>
): T {
  if (!response) {
    throw new ApiError('Invalid response: response is null or undefined');
  }

  if (!response.data) {
    throw new ApiError('Invalid response structure: missing data property');
  }

  const apiResponse = response.data;

  // Check for success flag
  if (apiResponse.success === false) {
    throw new ApiError(
      apiResponse.message || 'API request failed',
      undefined,
      response.status,
      'API_REQUEST_FAILED'
    );
  }

  // Check for data property
  if (apiResponse.data === undefined) {
    throw new ApiError(
      'Invalid response structure: missing data.data property',
      undefined,
      response.status,
      'INVALID_RESPONSE_STRUCTURE'
    );
  }

  return apiResponse.data;
}

/**
 * Unwrap paginated API response
 * Handles responses with pagination metadata
 */
export function unwrapPaginatedResponse<T>(
  response: AxiosResponse<ApiResponse<{
    data?: T[];
    items?: T[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  }>>
): {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const unwrapped = unwrapApiResponse(response);

  // Handle both 'data' and 'items' property names
  const items = unwrapped.data || unwrapped.items || [];

  return {
    data: items,
    total: unwrapped.total ?? items.length,
    page: unwrapped.page ?? 1,
    limit: unwrapped.limit ?? items.length,
    totalPages: unwrapped.totalPages ?? 1,
    hasNext: unwrapped.hasNext ?? false,
    hasPrev: unwrapped.hasPrev ?? false,
  };
}

/**
 * Unwrap nested API response with additional property
 * Handles responses like { data: { item: T } }
 */
export function unwrapNestedResponse<T>(
  response: AxiosResponse<ApiResponse<{ [key: string]: T }>>,
  propertyName: string = 'item'
): T {
  const unwrapped = unwrapApiResponse(response);

  if (!unwrapped || typeof unwrapped !== 'object') {
    throw new ApiError(
      `Invalid nested response: expected object with '${propertyName}' property`,
      undefined,
      response.status,
      'INVALID_NESTED_RESPONSE'
    );
  }

  const item = unwrapped[propertyName];

  if (item === undefined) {
    throw new ApiError(
      `Invalid nested response: missing '${propertyName}' property`,
      undefined,
      response.status,
      'MISSING_NESTED_PROPERTY'
    );
  }

  return item;
}

/**
 * Unwrap array response
 * Handles responses like { data: { items: T[] } }
 */
export function unwrapArrayResponse<T>(
  response: AxiosResponse<ApiResponse<{ [key: string]: T[] }>>,
  propertyName: string = 'items'
): T[] {
  const unwrapped = unwrapApiResponse(response);

  if (!unwrapped || typeof unwrapped !== 'object') {
    throw new ApiError(
      `Invalid array response: expected object with '${propertyName}' property`,
      undefined,
      response.status,
      'INVALID_ARRAY_RESPONSE'
    );
  }

  const items = unwrapped[propertyName];

  if (!Array.isArray(items)) {
    throw new ApiError(
      `Invalid array response: '${propertyName}' is not an array`,
      undefined,
      response.status,
      'INVALID_ARRAY_PROPERTY'
    );
  }

  return items;
}

/**
 * Type guard to check if response is an API error response
 */
export function isApiErrorResponse(response: any): response is {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
} {
  return (
    response &&
    typeof response === 'object' &&
    response.success === false &&
    typeof response.message === 'string'
  );
}

/**
 * Type guard to check if response is an API success response
 */
export function isApiSuccessResponse<T>(
  response: any
): response is ApiResponse<T> {
  return (
    response &&
    typeof response === 'object' &&
    response.success !== false &&
    'data' in response
  );
}
