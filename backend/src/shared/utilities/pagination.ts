/**
 * @fileoverview Pagination utility functions for API responses
 * @module shared/utils/pagination
 *
 * Provides utilities for handling pagination in API endpoints including:
 * - Query parameter parsing and validation
 * - Pagination metadata generation
 * - Filter building from query parameters
 */

import { Request } from '@hapi/hapi';
import { Op } from 'sequelize';

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Parsed pagination parameters
 */
export interface PaginationParams {
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Offset for database queries (0-based) */
  offset: number;
}

/**
 * Pagination metadata for API responses
 */
export interface PaginationMeta {
  /** Current page number */
  currentPage: number;
  /** Items per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * Parse and validate pagination parameters from request query
 *
 * @param {Request | Record<string, any>} requestOrQuery - Hapi request object or query object
 * @returns {PaginationParams} Validated pagination parameters
 *
 * @example
 * ```typescript
 * // Pass full request object
 * const { page, limit, offset } = parsePagination(request);
 *
 * // Or pass query object directly
 * const { page, limit, offset } = parsePagination(request.query);
 *
 * const results = await Model.findAll({
 *   limit,
 *   offset
 * });
 * ```
 */
export function parsePagination(
  requestOrQuery: Request | Record<string, any>,
): PaginationParams {
  // Support both request object and query object directly
  const query =
    'query' in requestOrQuery && requestOrQuery.query
      ? (requestOrQuery.query as Record<string, any>)
      : (requestOrQuery as Record<string, any>);

  // Parse page number
  let page = parseInt(query.page as string, 10);
  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  // Parse limit
  let limit = parseInt(query.limit as string, 10);
  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  // Enforce maximum limit
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
}

/**
 * Build pagination metadata for API response
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total number of items available
 * @returns {PaginationMeta} Pagination metadata object
 *
 * @example
 * ```typescript
 * const { count, rows } = await Model.findAndCountAll({ limit, offset });
 * const pagination = buildPaginationMeta(page, limit, count);
 *
 * return {
 *   data: rows,
 *   pagination
 * };
 * ```
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  totalItems: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Filter operator mapping for database queries
 */
export interface FilterOperator {
  /** Sequelize operator symbol */
  operator: symbol;
  /** Transform function for the value */
  transform?: (value: any) => any;
}

/**
 * Supported filter operators
 */
export const FILTER_OPERATORS = {
  eq: 'eq', // Equal
  ne: 'ne', // Not equal
  gt: 'gt', // Greater than
  gte: 'gte', // Greater than or equal
  lt: 'lt', // Less than
  lte: 'lte', // Less than or equal
  like: 'like', // Like (case-sensitive)
  ilike: 'iLike', // Like (case-insensitive)
  in: 'in', // In array
  notIn: 'notIn', // Not in array
  between: 'between', // Between two values
  is: 'is', // Is (for null/not null)
} as const;

/**
 * Field configuration for buildFilters
 */
export interface FilterFieldConfig {
  type?: 'string' | 'number' | 'boolean' | 'date';
  operator?: keyof typeof FILTER_OPERATORS;
}

/**
 * Build database filters from query parameters
 *
 * Converts query parameters into Sequelize-compatible filter objects.
 * Supports various operators and automatic type conversion.
 *
 * @param {Request | Record<string, any>} requestOrQuery - Hapi request object or query object
 * @param {string[] | Record<string, FilterFieldConfig>} allowedFieldsOrConfig - List of allowed fields or field configuration object
 * @param {Record<string, any>} [defaults={}] - Default filter values
 * @returns {Record<string, any>} Filter object for database queries
 *
 * @example
 * ```typescript
 * // Using array of field names (legacy API)
 * const filters = buildFilters(request, ['status', 'age', 'name']);
 *
 * // Using field configuration object (new API)
 * const filters = buildFilters(request.query, {
 *   status: { type: 'string' },
 *   age: { type: 'number' },
 *   isActive: { type: 'boolean' }
 * });
 *
 * // Query: ?status=active&age[gte]=18&name[like]=%John%
 * // Result: {
 * //   status: 'active',
 * //   age: { [Op.gte]: 18 },
 * //   name: { [Op.like]: '%John%' }
 * // }
 *
 * const students = await Student.findAll({ where: filters });
 * ```
 */
export function buildFilters(
  requestOrQuery: Request | Record<string, any>,
  allowedFieldsOrConfig: string[] | Record<string, FilterFieldConfig>,
  defaults: Record<string, any> = {},
): Record<string, any> {
  // Support both request object and query object directly
  const query =
    'query' in requestOrQuery && requestOrQuery.query
      ? (requestOrQuery.query as Record<string, any>)
      : (requestOrQuery as Record<string, any>);

  // Extract allowed field names from either array or config object
  const allowedFields = Array.isArray(allowedFieldsOrConfig)
    ? allowedFieldsOrConfig
    : Object.keys(allowedFieldsOrConfig);

  const filters: Record<string, any> = { ...defaults };

  for (const field of allowedFields) {
    const value = query[field];

    // Skip if field is not in query
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Handle simple equality
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      filters[field] = value;
      continue;
    }

    // Handle operator-based filters (e.g., age[gte]=18)
    if (typeof value === 'object' && !Array.isArray(value)) {
      const fieldFilters: Record<symbol, any> = {};

      for (const [operator, operatorValue] of Object.entries(value)) {
        const opKey = operator.toLowerCase();

        switch (opKey) {
          case 'eq':
            filters[field] = operatorValue;
            break;
          case 'ne':
            fieldFilters[Op.ne] = operatorValue;
            break;
          case 'gt':
            fieldFilters[Op.gt] = parseNumericValue(operatorValue);
            break;
          case 'gte':
            fieldFilters[Op.gte] = parseNumericValue(operatorValue);
            break;
          case 'lt':
            fieldFilters[Op.lt] = parseNumericValue(operatorValue);
            break;
          case 'lte':
            fieldFilters[Op.lte] = parseNumericValue(operatorValue);
            break;
          case 'like':
            fieldFilters[Op.like] = operatorValue;
            break;
          case 'ilike':
            fieldFilters[Op.iLike] = operatorValue;
            break;
          case 'in':
            fieldFilters[Op.in] = Array.isArray(operatorValue)
              ? operatorValue
              : typeof operatorValue === 'string'
                ? operatorValue.split(',')
                : [operatorValue];
            break;
          case 'notin':
            fieldFilters[Op.notIn] = Array.isArray(operatorValue)
              ? operatorValue
              : typeof operatorValue === 'string'
                ? operatorValue.split(',')
                : [operatorValue];
            break;
          case 'between':
            if (Array.isArray(operatorValue) && operatorValue.length === 2) {
              fieldFilters[Op.between] = operatorValue.map(parseNumericValue);
            }
            break;
          case 'is':
            if (operatorValue === 'null') {
              fieldFilters[Op.is] = null;
            }
            break;
        }
      }

      if (Object.keys(fieldFilters).length > 0) {
        filters[field] = fieldFilters;
      }
    }

    // Handle array values (for IN queries)
    if (Array.isArray(value)) {
      filters[field] = { [Op.in]: value };
    }
  }

  return filters;
}

/**
 * Parse a value as numeric if possible, otherwise return as-is
 *
 * @param {any} value - Value to parse
 * @returns {number|any} Parsed number or original value
 */
function parseNumericValue(value: any): number | any {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return value;
}

/**
 * Build sorting parameters from query
 *
 * @param {Request | Record<string, any>} requestOrQuery - Hapi request object or query object
 * @param {string[]} allowedFields - List of fields that can be sorted
 * @param {string} [defaultSort='createdAt'] - Default sort field
 * @param {'ASC'|'DESC'} [defaultOrder='DESC'] - Default sort order
 * @returns {Array<[string, 'ASC'|'DESC']>} Sequelize order array
 *
 * @example
 * ```typescript
 * // Query: ?sort=lastName&order=ASC
 * const order = buildSort(request, ['firstName', 'lastName', 'createdAt']);
 * // Result: [['lastName', 'ASC']]
 *
 * const students = await Student.findAll({ order });
 * ```
 */
export function buildSort(
  requestOrQuery: Request | Record<string, any>,
  allowedFields: string[],
  defaultSort: string = 'createdAt',
  defaultOrder: 'ASC' | 'DESC' = 'DESC',
): Array<[string, 'ASC' | 'DESC']> {
  // Support both request object and query object directly
  const query =
    'query' in requestOrQuery && requestOrQuery.query
      ? (requestOrQuery.query as Record<string, any>)
      : (requestOrQuery as Record<string, any>);

  let sortField = query.sort || query.sortBy || defaultSort;
  let sortOrder = (
    query.order ||
    query.sortOrder ||
    defaultOrder
  ).toUpperCase();

  // Validate sort field
  if (!allowedFields.includes(sortField)) {
    sortField = defaultSort;
  }

  // Validate sort order
  if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
    sortOrder = defaultOrder;
  }

  return [[sortField, sortOrder as 'ASC' | 'DESC']];
}
