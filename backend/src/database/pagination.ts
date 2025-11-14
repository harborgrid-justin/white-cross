/**
 * Database Pagination Utilities
 *
 * Provides utilities for building pagination queries and processing paginated results
 * for database operations in the White Cross healthcare platform.
 */

import { PaginatedResponse, PaginationMeta } from './types/pagination.types';

/**
 * Pagination constraints interface
 */
export interface PaginationConstraints {
  maxPageSize?: number;
  defaultPageSize?: number;
  maxOffset?: number;
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Builds pagination query parameters with validation and constraints
 *
 * @param params - Raw pagination parameters
 * @param constraints - Pagination constraints
 * @returns Normalized pagination parameters
 */
export function buildPaginationQuery(
  params: PaginationParams,
  constraints: PaginationConstraints = {}
): { page: number; limit: number; offset: number } {
  const {
    maxPageSize = 100,
    defaultPageSize = 20,
    maxOffset = 10000
  } = constraints;

  // Normalize page (1-indexed)
  let page = Math.max(1, params.page || 1);

  // Normalize limit
  let limit = Math.min(maxPageSize, Math.max(1, params.limit || defaultPageSize));

  // Calculate offset
  let offset = (page - 1) * limit;

  // Apply max offset constraint
  if (offset > maxOffset) {
    offset = maxOffset;
    page = Math.floor(offset / limit) + 1;
  }

  return { page, limit, offset };
}

/**
 * Processes paginated database results into standardized response format
 *
 * @param result - Database query result with rows and count
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Standardized paginated response
 */
export function processPaginatedResult<T>(
  result: { rows: T[]; count: number },
  page: number,
  limit: number
): PaginatedResponse<T> {
  const { rows, count } = result;

  // Calculate pagination metadata
  const totalPages = Math.ceil(count / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const meta: PaginationMeta = {
    page,
    limit,
    total: count,
    pages: totalPages,
  };

  return {
    data: rows,
    meta,
  };
}

/**
 * Validates pagination parameters
 *
 * @param params - Pagination parameters to validate
 * @param constraints - Pagination constraints
 * @returns Validation result with normalized parameters
 */
export function validatePaginationParams(
  params: PaginationParams,
  constraints: PaginationConstraints = {}
): {
  isValid: boolean;
  errors?: string[];
  normalizedParams?: { page: number; limit: number; offset: number };
} {
  const errors: string[] = [];

  const {
    maxPageSize = 100,
    defaultPageSize = 20,
    maxOffset = 10000
  } = constraints;

  // Validate page
  if (params.page !== undefined) {
    if (!Number.isInteger(params.page) || params.page < 1) {
      errors.push('Page must be a positive integer');
    }
  }

  // Validate limit
  if (params.limit !== undefined) {
    if (!Number.isInteger(params.limit) || params.limit < 1) {
      errors.push('Limit must be a positive integer');
    } else if (params.limit > maxPageSize) {
      errors.push(`Limit cannot exceed ${maxPageSize}`);
    }
  }

  // Validate offset
  if (params.offset !== undefined) {
    if (!Number.isInteger(params.offset) || params.offset < 0) {
      errors.push('Offset must be a non-negative integer');
    } else if (params.offset > maxOffset) {
      errors.push(`Offset cannot exceed ${maxOffset}`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Build normalized parameters
  const normalizedParams = buildPaginationQuery(params, constraints);

  return {
    isValid: true,
    normalizedParams,
  };
}