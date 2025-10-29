/**
 * API Response Normalization Utility
 *
 * Normalizes API responses to consistent format, handling legacy and
 * standard response structures.
 *
 * @module lib/normalize-response
 * @category Core
 */

import type { PaginatedResponse } from '@/types/common';
import { ApiError } from '@/types/errors';

/**
 * Standard response format (target)
 */
interface StandardPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Legacy response format (to be deprecated)
 */
interface LegacyPaginatedResponse<T> {
  students?: T[];
  medications?: T[];
  appointments?: T[];
  healthRecords?: T[];
  immunizations?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages?: number;
    totalPages?: number;
  };
}

/**
 * Normalize paginated API responses to standard format
 *
 * Handles multiple response structures:
 * 1. Standard: { data: [], meta: { page, limit, total, pages } }
 * 2. Legacy: { students: [], pagination: { page, limit, total } }
 * 3. Direct array: []
 *
 * @param response - API response to normalize
 * @param entityKey - Optional entity key for legacy format (e.g., 'students')
 * @returns Normalized response in standard format
 * @throws {ApiError} If response structure is invalid
 */
export function normalizeResponse<T>(
  response: unknown,
  entityKey?: string
): PaginatedResponse<T> {
  // Check if already in standard format
  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    'meta' in response
  ) {
    const standardResponse = response as StandardPaginatedResponse<T>;
    return {
      data: standardResponse.data,
      pagination: {
        page: standardResponse.meta.page,
        limit: standardResponse.meta.limit,
        total: standardResponse.meta.total,
        pages: standardResponse.meta.pages,
      },
      success: true,
    };
  }

  // Handle legacy format
  const legacyResponse = response as LegacyPaginatedResponse<T>;

  // Try to extract data array
  let dataArray: T[] | undefined;

  if (entityKey && entityKey in legacyResponse) {
    dataArray = legacyResponse[entityKey as keyof LegacyPaginatedResponse<T>] as T[];
  } else {
    // Try common entity keys
    dataArray =
      legacyResponse.students ||
      legacyResponse.medications ||
      legacyResponse.appointments ||
      legacyResponse.healthRecords ||
      legacyResponse.immunizations;
  }

  if (dataArray && Array.isArray(dataArray)) {
    // Extract pagination metadata
    const pagination = legacyResponse.pagination || {
      page: 1,
      limit: dataArray.length,
      total: dataArray.length,
      pages: 1,
    };

    return {
      data: dataArray,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: pagination.pages || pagination.totalPages || 1,
      },
      success: true,
    };
  }

  // Handle direct array
  if (Array.isArray(response)) {
    return {
      data: response,
      pagination: {
        page: 1,
        limit: response.length,
        total: response.length,
        pages: 1,
      },
      success: true,
    };
  }

  // Invalid format
  throw new ApiError(
    'Invalid API response format: expected paginated data',
    'unknown',
    'INVALID_RESPONSE',
    500,
    response
  );
}

/**
 * Normalize single entity response
 *
 * @param response - API response to normalize
 * @returns The entity data
 * @throws {ApiError} If response structure is invalid
 */
export function normalizeSingleResponse<T>(response: unknown): T {
  // Check if wrapped in { data: T }
  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    response.data
  ) {
    return response.data as T;
  }

  // Direct entity
  if (response && typeof response === 'object') {
    return response as T;
  }

  throw new ApiError(
    'Invalid API response format: expected entity data',
    'unknown',
    'INVALID_RESPONSE',
    500,
    response
  );
}
