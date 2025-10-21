/**
 * Pagination utility functions for database queries
 */

import { 
  PaginationParams, 
  PaginationMeta, 
  PaginatedResponse, 
  PaginatedResult,
  PAGINATION_DEFAULTS,
  PaginationConstraints
} from '../types/pagination';
import { ValidationResult, ValidationError } from '../types/common';

/**
 * Calculate pagination offset from page and limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Normalize and validate pagination parameters
 */
export function normalizePaginationParams(
  params: PaginationParams = {},
  constraints: PaginationConstraints = {}
): Required<PaginationParams> {
  const {
    maxLimit = PAGINATION_DEFAULTS.MAX_LIMIT,
    minLimit = PAGINATION_DEFAULTS.MIN_LIMIT,
    defaultLimit = PAGINATION_DEFAULTS.LIMIT,
    defaultPage = PAGINATION_DEFAULTS.PAGE
  } = constraints;

  // Normalize page
  let page = params.page ?? defaultPage;
  page = Math.max(1, Math.floor(page));

  // Normalize limit
  let limit = params.limit ?? defaultLimit;
  limit = Math.max(minLimit, Math.min(maxLimit, Math.floor(limit)));

  // Calculate offset
  const offset = params.offset ?? calculateOffset(page, limit);

  return { page, limit, offset };
}

/**
 * Create pagination metadata from query results
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const pages = Math.ceil(total / limit);
  const offset = calculateOffset(page, limit);

  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
    offset
  };
}

/**
 * Create a paginated response wrapper
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: createPaginationMeta(page, limit, total)
  };
}

/**
 * Process database findAndCountAll results into paginated response
 */
export function processPaginatedResult<T>(
  result: PaginatedResult<T>,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return createPaginatedResponse(result.rows, page, limit, result.count);
}

/**
 * Build Sequelize query options for pagination
 */
export function buildPaginationQuery(
  params: PaginationParams = {},
  constraints: PaginationConstraints = {}
): { limit: number; offset: number; page: number } {
  const normalized = normalizePaginationParams(params, constraints);
  
  return {
    limit: normalized.limit,
    offset: normalized.offset,
    page: normalized.page
  };
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(
  params: PaginationParams,
  constraints: PaginationConstraints = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const {
    maxLimit = PAGINATION_DEFAULTS.MAX_LIMIT,
    minLimit = PAGINATION_DEFAULTS.MIN_LIMIT
  } = constraints;

  // Validate page
  if (params.page !== undefined) {
    if (!Number.isInteger(params.page) || params.page < 1) {
      errors.push({
        field: 'page',
        message: 'Page must be a positive integer',
        code: 'INVALID_VALUE',
        value: params.page
      });
    }
  }

  // Validate limit
  if (params.limit !== undefined) {
    if (!Number.isInteger(params.limit)) {
      errors.push({
        field: 'limit',
        message: 'Limit must be an integer',
        code: 'INVALID_TYPE',
        value: params.limit
      });
    } else if (params.limit < minLimit) {
      errors.push({
        field: 'limit',
        message: `Limit must be at least ${minLimit}`,
        code: 'TOO_SMALL',
        value: params.limit
      });
    } else if (params.limit > maxLimit) {
      errors.push({
        field: 'limit',
        message: `Limit cannot exceed ${maxLimit}`,
        code: 'TOO_LARGE',
        value: params.limit
      });
    }
  }

  // Validate offset
  if (params.offset !== undefined) {
    if (!Number.isInteger(params.offset) || params.offset < 0) {
      errors.push({
        field: 'offset',
        message: 'Offset must be a non-negative integer',
        code: 'INVALID_VALUE',
        value: params.offset
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Calculate pagination info for cursor-based pagination
 */
export function calculateCursorPagination(
  items: any[],
  limit: number,
  cursorField: string = 'id'
): {
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
} {
  const hasNext = items.length > limit;
  const actualItems = hasNext ? items.slice(0, -1) : items;
  
  return {
    hasNext,
    hasPrev: false, // Would need additional context to determine
    nextCursor: hasNext && actualItems.length > 0 
      ? actualItems[actualItems.length - 1][cursorField] 
      : undefined,
    prevCursor: actualItems.length > 0 
      ? actualItems[0][cursorField] 
      : undefined
  };
}

/**
 * Helper to extract pagination params from request query
 */
export function extractPaginationFromQuery(query: any): PaginationParams {
  const page = query.page ? parseInt(query.page, 10) : undefined;
  const limit = query.limit ? parseInt(query.limit, 10) : undefined;
  const offset = query.offset ? parseInt(query.offset, 10) : undefined;

  return { page, limit, offset };
}
