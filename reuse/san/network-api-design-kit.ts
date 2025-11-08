/**
 * LOC: NETAPI1234567
 * File: /reuse/san/network-api-design-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network API implementations
 *   - NestJS network controllers
 *   - Network gateway services
 */

/**
 * File: /reuse/san/network-api-design-kit.ts
 * Locator: WC-SAN-NETAPI-001
 * Purpose: Comprehensive Network API Design Utilities - RESTful patterns, versioning, pagination, filtering, sorting, error handling, authentication flows
 *
 * Upstream: Independent utility module for network API design
 * Downstream: ../backend/*, Network controllers, API gateway, SAN services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Express 4.x
 * Exports: 40 utility functions for network API design, pagination, filtering, sorting, error handling, authentication
 *
 * LLM Context: Comprehensive network API design utilities for implementing production-ready RESTful APIs for enterprise virtual networks.
 * Provides versioning strategies, response formatting, pagination helpers, filtering and sorting, error handling patterns,
 * authentication flows, and API design best practices. Essential for scalable network management API infrastructure.
 */

import { Request, Response, NextFunction } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PaginationParams {
  page: number;
  pageSize: number;
  offset?: number;
  limit?: number;
}

interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: number;
  previousPage?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
  links?: {
    self: string;
    first: string;
    last: string;
    next?: string;
    previous?: string;
  };
}

interface CursorPaginationParams {
  cursor?: string;
  limit: number;
  direction?: 'forward' | 'backward';
}

interface CursorPaginationResponse<T> {
  data: T[];
  pagination: {
    nextCursor?: string;
    previousCursor?: string;
    hasMore: boolean;
    limit: number;
  };
}

interface FilterCriteria {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

interface SortCriteria {
  field: string;
  order: 'asc' | 'desc';
  nullsFirst?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorDetail;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
  details?: any;
  stack?: string;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

interface ApiVersionMetadata {
  version: string;
  status: 'current' | 'deprecated' | 'sunset';
  deprecationDate?: Date;
  sunsetDate?: Date;
  migrationGuide?: string;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

interface ApiKeyInfo {
  key: string;
  name: string;
  scopes: string[];
  environment: 'production' | 'staging' | 'development';
  createdAt: Date;
  expiresAt?: Date;
}

interface QueryParams {
  filters?: Record<string, any>;
  sort?: string | string[];
  page?: number;
  pageSize?: number;
  cursor?: string;
  fields?: string[];
  include?: string[];
  expand?: string[];
}

interface HateoasLink {
  rel: string;
  href: string;
  method: string;
  type?: string;
}

interface ResourceResponse<T> {
  data: T;
  links: HateoasLink[];
  metadata?: Record<string, any>;
}

// ============================================================================
// PAGINATION HELPERS (1-8)
// ============================================================================

/**
 * Extracts pagination parameters from request query.
 *
 * @param {Request} req - Express request object
 * @param {number} [defaultPageSize=20] - Default page size
 * @param {number} [maxPageSize=100] - Maximum allowed page size
 * @returns {PaginationParams} Pagination parameters
 *
 * @example
 * ```typescript
 * const pagination = extractPaginationParams(req, 25, 100);
 * // Result: { page: 1, pageSize: 25, offset: 0, limit: 25 }
 * ```
 */
export const extractPaginationParams = (
  req: Request,
  defaultPageSize = 20,
  maxPageSize = 100,
): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const requestedSize = parseInt(req.query.pageSize as string, 10) || defaultPageSize;
  const pageSize = Math.min(Math.max(1, requestedSize), maxPageSize);
  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    offset,
    limit: pageSize,
  };
};

/**
 * Builds pagination metadata from query results.
 *
 * @param {number} totalItems - Total number of items
 * @param {PaginationParams} params - Pagination parameters
 * @returns {PaginationMetadata} Pagination metadata
 *
 * @example
 * ```typescript
 * const metadata = buildPaginationMetadata(250, { page: 3, pageSize: 20 });
 * // Result: { currentPage: 3, totalPages: 13, hasNextPage: true, ... }
 * ```
 */
export const buildPaginationMetadata = (
  totalItems: number,
  params: PaginationParams,
): PaginationMetadata => {
  const totalPages = Math.ceil(totalItems / params.pageSize);
  const hasNextPage = params.page < totalPages;
  const hasPreviousPage = params.page > 1;

  return {
    currentPage: params.page,
    pageSize: params.pageSize,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? params.page + 1 : undefined,
    previousPage: hasPreviousPage ? params.page - 1 : undefined,
  };
};

/**
 * Creates a paginated response with data and metadata.
 *
 * @param {T[]} data - Array of data items
 * @param {number} totalItems - Total number of items
 * @param {PaginationParams} params - Pagination parameters
 * @param {string} [baseUrl] - Base URL for HATEOAS links
 * @returns {PaginatedResponse<T>} Paginated response
 *
 * @example
 * ```typescript
 * const response = createPaginatedResponse(networks, 250, pagination, '/api/v1/networks');
 * // Result: { data: [...], pagination: {...}, links: {...} }
 * ```
 */
export const createPaginatedResponse = <T>(
  data: T[],
  totalItems: number,
  params: PaginationParams,
  baseUrl?: string,
): PaginatedResponse<T> => {
  const pagination = buildPaginationMetadata(totalItems, params);
  const response: PaginatedResponse<T> = {
    data,
    pagination,
  };

  if (baseUrl) {
    const buildUrl = (page: number) => `${baseUrl}?page=${page}&pageSize=${params.pageSize}`;

    response.links = {
      self: buildUrl(params.page),
      first: buildUrl(1),
      last: buildUrl(pagination.totalPages),
      next: pagination.hasNextPage ? buildUrl(pagination.nextPage!) : undefined,
      previous: pagination.hasPreviousPage ? buildUrl(pagination.previousPage!) : undefined,
    };
  }

  return response;
};

/**
 * Encodes cursor for cursor-based pagination.
 *
 * @param {any} value - Cursor value (typically ID or timestamp)
 * @returns {string} Encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor({ id: 12345, timestamp: Date.now() });
 * // Result: 'eyJpZCI6MTIzNDUsInRpbWVzdGFtcCI6MTY5ODc2NTQzMjEwMH0='
 * ```
 */
export const encodeCursor = (value: any): string => {
  const json = JSON.stringify(value);
  return Buffer.from(json).toString('base64url');
};

/**
 * Decodes cursor from cursor-based pagination.
 *
 * @param {string} cursor - Encoded cursor string
 * @returns {any} Decoded cursor value
 *
 * @example
 * ```typescript
 * const value = decodeCursor('eyJpZCI6MTIzNDV9');
 * // Result: { id: 12345 }
 * ```
 */
export const decodeCursor = (cursor: string): any => {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch (error) {
    throw new Error('Invalid cursor format');
  }
};

/**
 * Extracts cursor-based pagination parameters from request.
 *
 * @param {Request} req - Express request object
 * @param {number} [defaultLimit=20] - Default page limit
 * @param {number} [maxLimit=100] - Maximum allowed limit
 * @returns {CursorPaginationParams} Cursor pagination parameters
 *
 * @example
 * ```typescript
 * const params = extractCursorPaginationParams(req, 25, 100);
 * // Result: { cursor: 'abc123', limit: 25, direction: 'forward' }
 * ```
 */
export const extractCursorPaginationParams = (
  req: Request,
  defaultLimit = 20,
  maxLimit = 100,
): CursorPaginationParams => {
  const cursor = req.query.cursor as string | undefined;
  const requestedLimit = parseInt(req.query.limit as string, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const direction = (req.query.direction as 'forward' | 'backward') || 'forward';

  return { cursor, limit, direction };
};

/**
 * Creates cursor-based paginated response.
 *
 * @param {T[]} data - Array of data items
 * @param {number} limit - Page limit
 * @param {Function} getCursorValue - Function to extract cursor value from item
 * @returns {CursorPaginationResponse<T>} Cursor paginated response
 *
 * @example
 * ```typescript
 * const response = createCursorPaginatedResponse(
 *   networks,
 *   25,
 *   (network) => ({ id: network.id, createdAt: network.createdAt })
 * );
 * ```
 */
export const createCursorPaginatedResponse = <T>(
  data: T[],
  limit: number,
  getCursorValue: (item: T) => any,
): CursorPaginationResponse<T> => {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;

  return {
    data: items,
    pagination: {
      nextCursor: hasMore ? encodeCursor(getCursorValue(items[items.length - 1])) : undefined,
      previousCursor: items.length > 0 ? encodeCursor(getCursorValue(items[0])) : undefined,
      hasMore,
      limit,
    },
  };
};

/**
 * Generates pagination links header (RFC 8288) for HTTP responses.
 *
 * @param {string} baseUrl - Base URL for links
 * @param {PaginationMetadata} metadata - Pagination metadata
 * @returns {string} Link header value
 *
 * @example
 * ```typescript
 * const linkHeader = generatePaginationLinkHeader('/api/v1/networks', metadata);
 * res.setHeader('Link', linkHeader);
 * // Link: </api/v1/networks?page=1>; rel="first", ...
 * ```
 */
export const generatePaginationLinkHeader = (
  baseUrl: string,
  metadata: PaginationMetadata,
): string => {
  const links: string[] = [];
  const buildUrl = (page: number) => `<${baseUrl}?page=${page}&pageSize=${metadata.pageSize}>`;

  links.push(`${buildUrl(1)}; rel="first"`);
  links.push(`${buildUrl(metadata.totalPages)}; rel="last"`);

  if (metadata.hasPreviousPage) {
    links.push(`${buildUrl(metadata.previousPage!)}; rel="prev"`);
  }

  if (metadata.hasNextPage) {
    links.push(`${buildUrl(metadata.nextPage!)}; rel="next"`);
  }

  return links.join(', ');
};

// ============================================================================
// FILTERING & SORTING (9-14)
// ============================================================================

/**
 * Parses filter criteria from query string.
 *
 * @param {Request} req - Express request object
 * @returns {FilterCriteria[]} Array of filter criteria
 *
 * @example
 * ```typescript
 * // Request: /api/networks?filter[name][contains]=prod&filter[status][eq]=active
 * const filters = parseFilterCriteria(req);
 * // Result: [
 * //   { field: 'name', operator: 'contains', value: 'prod' },
 * //   { field: 'status', operator: 'eq', value: 'active' }
 * // ]
 * ```
 */
export const parseFilterCriteria = (req: Request): FilterCriteria[] => {
  const filters: FilterCriteria[] = [];
  const filterParams = req.query.filter as Record<string, any> | undefined;

  if (!filterParams || typeof filterParams !== 'object') {
    return filters;
  }

  Object.entries(filterParams).forEach(([field, operators]) => {
    if (typeof operators === 'object' && operators !== null) {
      Object.entries(operators).forEach(([operator, value]) => {
        filters.push({
          field,
          operator: operator as FilterCriteria['operator'],
          value,
          logicalOperator: 'AND',
        });
      });
    }
  });

  return filters;
};

/**
 * Builds WHERE clause conditions from filter criteria.
 *
 * @param {FilterCriteria[]} filters - Array of filter criteria
 * @returns {Record<string, any>} WHERE clause object
 *
 * @example
 * ```typescript
 * const where = buildWhereClause([
 *   { field: 'status', operator: 'eq', value: 'active' },
 *   { field: 'name', operator: 'contains', value: 'network' }
 * ]);
 * // Can be used with Sequelize or TypeORM
 * ```
 */
export const buildWhereClause = (filters: FilterCriteria[]): Record<string, any> => {
  const where: Record<string, any> = {};

  filters.forEach(filter => {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        where[field] = value;
        break;
      case 'ne':
        where[field] = { $ne: value };
        break;
      case 'gt':
        where[field] = { $gt: value };
        break;
      case 'gte':
        where[field] = { $gte: value };
        break;
      case 'lt':
        where[field] = { $lt: value };
        break;
      case 'lte':
        where[field] = { $lte: value };
        break;
      case 'in':
        where[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case 'nin':
        where[field] = { $nin: Array.isArray(value) ? value : [value] };
        break;
      case 'contains':
        where[field] = { $like: `%${value}%` };
        break;
      case 'startsWith':
        where[field] = { $like: `${value}%` };
        break;
      case 'endsWith':
        where[field] = { $like: `%${value}` };
        break;
    }
  });

  return where;
};

/**
 * Parses sort criteria from query string.
 *
 * @param {Request} req - Express request object
 * @returns {SortCriteria[]} Array of sort criteria
 *
 * @example
 * ```typescript
 * // Request: /api/networks?sort=-createdAt,name
 * const sort = parseSortCriteria(req);
 * // Result: [
 * //   { field: 'createdAt', order: 'desc' },
 * //   { field: 'name', order: 'asc' }
 * // ]
 * ```
 */
export const parseSortCriteria = (req: Request): SortCriteria[] => {
  const sortParam = req.query.sort as string | undefined;

  if (!sortParam) {
    return [];
  }

  const sortFields = sortParam.split(',').map(s => s.trim());

  return sortFields.map(field => {
    const isDescending = field.startsWith('-');
    const cleanField = isDescending ? field.substring(1) : field;

    return {
      field: cleanField,
      order: isDescending ? 'desc' : 'asc',
    };
  });
};

/**
 * Builds ORDER BY clause from sort criteria.
 *
 * @param {SortCriteria[]} sort - Array of sort criteria
 * @returns {Array<[string, string]>} ORDER BY array for Sequelize
 *
 * @example
 * ```typescript
 * const orderBy = buildOrderByClause([
 *   { field: 'createdAt', order: 'desc' },
 *   { field: 'name', order: 'asc' }
 * ]);
 * // Result: [['createdAt', 'DESC'], ['name', 'ASC']]
 * ```
 */
export const buildOrderByClause = (sort: SortCriteria[]): Array<[string, string]> => {
  return sort.map(criteria => [
    criteria.field,
    criteria.order.toUpperCase(),
  ]);
};

/**
 * Validates filter criteria against allowed fields and operators.
 *
 * @param {FilterCriteria[]} filters - Filter criteria to validate
 * @param {string[]} allowedFields - Allowed filterable fields
 * @param {FilterCriteria['operator'][]} [allowedOperators] - Allowed operators
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFilterCriteria(filters, ['name', 'status', 'createdAt']);
 * if (!result.valid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export const validateFilterCriteria = (
  filters: FilterCriteria[],
  allowedFields: string[],
  allowedOperators?: FilterCriteria['operator'][],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const defaultOperators: FilterCriteria['operator'][] = [
    'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'startsWith', 'endsWith',
  ];
  const validOperators = allowedOperators || defaultOperators;

  filters.forEach(filter => {
    if (!allowedFields.includes(filter.field)) {
      errors.push(`Field '${filter.field}' is not allowed for filtering`);
    }

    if (!validOperators.includes(filter.operator)) {
      errors.push(`Operator '${filter.operator}' is not allowed`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates sort criteria against allowed fields.
 *
 * @param {SortCriteria[]} sort - Sort criteria to validate
 * @param {string[]} allowedFields - Allowed sortable fields
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSortCriteria(sort, ['name', 'createdAt', 'status']);
 * if (!result.valid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export const validateSortCriteria = (
  sort: SortCriteria[],
  allowedFields: string[],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  sort.forEach(criteria => {
    if (!allowedFields.includes(criteria.field)) {
      errors.push(`Field '${criteria.field}' is not allowed for sorting`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// RESPONSE FORMATTING (15-20)
// ============================================================================

/**
 * Creates standardized success response.
 *
 * @param {T} data - Response data
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {ApiResponse<T>} Standardized API response
 *
 * @example
 * ```typescript
 * const response = createSuccessResponse(network, { version: 'v1' });
 * res.json(response);
 * // Result: { success: true, data: {...}, metadata: {...}, timestamp: '...' }
 * ```
 */
export const createSuccessResponse = <T>(
  data: T,
  metadata?: Record<string, any>,
): ApiResponse<T> => {
  return {
    success: true,
    data,
    metadata,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Creates standardized error response.
 *
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {string} [field] - Field that caused the error
 * @param {any} [details] - Additional error details
 * @returns {ApiResponse<never>} Standardized error response
 *
 * @example
 * ```typescript
 * const response = createErrorResponse(
 *   'NETWORK_NOT_FOUND',
 *   'Network with ID 123 not found',
 *   undefined,
 *   { networkId: 123 }
 * );
 * res.status(404).json(response);
 * ```
 */
export const createErrorResponse = (
  code: string,
  message: string,
  field?: string,
  details?: any,
): ApiResponse<never> => {
  return {
    success: false,
    error: {
      code,
      message,
      field,
      details,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Creates validation error response from multiple errors.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {ApiResponse<never>} Validation error response
 *
 * @example
 * ```typescript
 * const response = createValidationErrorResponse([
 *   { field: 'name', message: 'Name is required', code: 'REQUIRED' },
 *   { field: 'cidr', message: 'Invalid CIDR format', code: 'INVALID_FORMAT' }
 * ]);
 * res.status(422).json(response);
 * ```
 */
export const createValidationErrorResponse = (
  errors: ValidationError[],
): ApiResponse<never> => {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: errors,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Wraps data with HATEOAS links.
 *
 * @param {T} data - Resource data
 * @param {HateoasLink[]} links - HATEOAS links
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {ResourceResponse<T>} Resource with HATEOAS links
 *
 * @example
 * ```typescript
 * const response = createResourceResponse(network, [
 *   { rel: 'self', href: '/api/v1/networks/123', method: 'GET' },
 *   { rel: 'update', href: '/api/v1/networks/123', method: 'PUT' },
 *   { rel: 'delete', href: '/api/v1/networks/123', method: 'DELETE' }
 * ]);
 * ```
 */
export const createResourceResponse = <T>(
  data: T,
  links: HateoasLink[],
  metadata?: Record<string, any>,
): ResourceResponse<T> => {
  return {
    data,
    links,
    metadata,
  };
};

/**
 * Transforms response data by selecting specific fields.
 *
 * @param {any} data - Response data
 * @param {string[]} fields - Fields to include
 * @returns {any} Transformed data with selected fields
 *
 * @example
 * ```typescript
 * const transformed = selectFields(
 *   { id: 1, name: 'Network', cidr: '10.0.0.0/16', internalData: 'secret' },
 *   ['id', 'name', 'cidr']
 * );
 * // Result: { id: 1, name: 'Network', cidr: '10.0.0.0/16' }
 * ```
 */
export const selectFields = (data: any, fields: string[]): any => {
  if (Array.isArray(data)) {
    return data.map(item => selectFields(item, fields));
  }

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const result: Record<string, any> = {};

  fields.forEach(field => {
    const parts = field.split('.');

    if (parts.length === 1) {
      if (field in data) {
        result[field] = data[field];
      }
    } else {
      // Handle nested field selection
      const [parent, ...rest] = parts;
      if (parent in data) {
        result[parent] = selectFields(data[parent], [rest.join('.')]);
      }
    }
  });

  return result;
};

/**
 * Extracts field selection from query parameters.
 *
 * @param {Request} req - Express request object
 * @returns {string[] | undefined} Array of fields to select
 *
 * @example
 * ```typescript
 * // Request: /api/networks?fields=id,name,cidr
 * const fields = extractFieldSelection(req);
 * // Result: ['id', 'name', 'cidr']
 * ```
 */
export const extractFieldSelection = (req: Request): string[] | undefined => {
  const fieldsParam = req.query.fields as string | undefined;

  if (!fieldsParam) {
    return undefined;
  }

  return fieldsParam.split(',').map(f => f.trim()).filter(Boolean);
};

// ============================================================================
// ERROR HANDLING (21-25)
// ============================================================================

/**
 * Maps HTTP status codes to error codes and messages.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {{ code: string; message: string }} Error code and message
 *
 * @example
 * ```typescript
 * const error = mapStatusCodeToError(404);
 * // Result: { code: 'NOT_FOUND', message: 'Resource not found' }
 * ```
 */
export const mapStatusCodeToError = (statusCode: number): { code: string; message: string } => {
  const errorMap: Record<number, { code: string; message: string }> = {
    400: { code: 'BAD_REQUEST', message: 'Bad request' },
    401: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    403: { code: 'FORBIDDEN', message: 'Access forbidden' },
    404: { code: 'NOT_FOUND', message: 'Resource not found' },
    405: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
    409: { code: 'CONFLICT', message: 'Resource conflict' },
    422: { code: 'UNPROCESSABLE_ENTITY', message: 'Validation failed' },
    429: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
    500: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    502: { code: 'BAD_GATEWAY', message: 'Bad gateway' },
    503: { code: 'SERVICE_UNAVAILABLE', message: 'Service unavailable' },
    504: { code: 'GATEWAY_TIMEOUT', message: 'Gateway timeout' },
  };

  return errorMap[statusCode] || { code: 'UNKNOWN_ERROR', message: 'Unknown error occurred' };
};

/**
 * Creates detailed error response with stack trace in development.
 *
 * @param {Error} error - Error object
 * @param {boolean} [includeStack=false] - Whether to include stack trace
 * @returns {ApiResponse<never>} Detailed error response
 *
 * @example
 * ```typescript
 * try {
 *   // ... operation
 * } catch (error) {
 *   const response = createDetailedErrorResponse(error, process.env.NODE_ENV === 'development');
 *   res.status(500).json(response);
 * }
 * ```
 */
export const createDetailedErrorResponse = (
  error: Error,
  includeStack = false,
): ApiResponse<never> => {
  return {
    success: false,
    error: {
      code: (error as any).code || 'INTERNAL_ERROR',
      message: error.message,
      stack: includeStack ? error.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Error handler middleware for Express.
 *
 * @param {Error} error - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next function
 *
 * @example
 * ```typescript
 * app.use(errorHandlerMiddleware);
 * ```
 */
export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = (error as any).statusCode || (error as any).status || 500;
  const errorInfo = mapStatusCodeToError(statusCode);

  const response = createErrorResponse(
    (error as any).code || errorInfo.code,
    error.message || errorInfo.message,
    (error as any).field,
    (error as any).details,
  );

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (response.error as any).stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Creates custom API error class.
 *
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Custom API error
 *
 * @example
 * ```typescript
 * throw createApiError('NETWORK_NOT_FOUND', 'Network not found', 404);
 * ```
 */
export const createApiError = (code: string, message: string, statusCode: number): Error => {
  const error = new Error(message) as any;
  error.code = code;
  error.statusCode = statusCode;
  return error;
};

/**
 * Async error wrapper for Express route handlers.
 *
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler
 *
 * @example
 * ```typescript
 * app.get('/api/networks/:id', asyncErrorHandler(async (req, res) => {
 *   const network = await getNetworkById(req.params.id);
 *   res.json(createSuccessResponse(network));
 * }));
 * ```
 */
export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ============================================================================
// API VERSIONING (26-29)
// ============================================================================

/**
 * Extracts API version from request.
 *
 * @param {Request} req - Express request object
 * @param {string} [defaultVersion='v1'] - Default version
 * @returns {string} API version
 *
 * @example
 * ```typescript
 * // From URL: /api/v2/networks
 * const version = extractApiVersionFromRequest(req);
 * // Result: 'v2'
 * ```
 */
export const extractApiVersionFromRequest = (req: Request, defaultVersion = 'v1'): string => {
  // Check URL path
  const pathMatch = req.path.match(/\/v(\d+)\//);
  if (pathMatch) {
    return `v${pathMatch[1]}`;
  }

  // Check Accept header (e.g., application/vnd.api.v2+json)
  const acceptHeader = req.headers.accept;
  if (acceptHeader) {
    const versionMatch = acceptHeader.match(/\.v(\d+)\+/);
    if (versionMatch) {
      return `v${versionMatch[1]}`;
    }
  }

  // Check custom header
  const versionHeader = req.headers['api-version'] as string;
  if (versionHeader) {
    return versionHeader.startsWith('v') ? versionHeader : `v${versionHeader}`;
  }

  return defaultVersion;
};

/**
 * Validates API version and returns metadata.
 *
 * @param {string} version - API version to validate
 * @param {ApiVersionMetadata[]} supportedVersions - Supported versions
 * @returns {ApiVersionMetadata | null} Version metadata or null if invalid
 *
 * @example
 * ```typescript
 * const metadata = validateApiVersionFromMetadata('v2', supportedVersions);
 * if (metadata?.status === 'deprecated') {
 *   res.setHeader('Deprecation', 'true');
 *   res.setHeader('Sunset', metadata.sunsetDate.toUTCString());
 * }
 * ```
 */
export const validateApiVersionFromMetadata = (
  version: string,
  supportedVersions: ApiVersionMetadata[],
): ApiVersionMetadata | null => {
  return supportedVersions.find(v => v.version === version) || null;
};

/**
 * Middleware to handle API version deprecation warnings.
 *
 * @param {ApiVersionMetadata[]} supportedVersions - Supported versions
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(apiVersionDeprecationMiddleware(supportedVersions));
 * ```
 */
export const apiVersionDeprecationMiddleware = (supportedVersions: ApiVersionMetadata[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const version = extractApiVersionFromRequest(req);
    const metadata = validateApiVersionFromMetadata(version, supportedVersions);

    if (!metadata) {
      return res.status(400).json(
        createErrorResponse(
          'UNSUPPORTED_VERSION',
          `API version ${version} is not supported`,
        ),
      );
    }

    if (metadata.status === 'deprecated') {
      res.setHeader('Deprecation', 'true');
      if (metadata.sunsetDate) {
        res.setHeader('Sunset', metadata.sunsetDate.toUTCString());
      }
      if (metadata.migrationGuide) {
        res.setHeader('Link', `<${metadata.migrationGuide}>; rel="deprecation"`);
      }
    }

    if (metadata.status === 'sunset') {
      return res.status(410).json(
        createErrorResponse(
          'VERSION_SUNSET',
          `API version ${version} has been sunset`,
          undefined,
          { migrationGuide: metadata.migrationGuide },
        ),
      );
    }

    (req as any).apiVersion = version;
    next();
  };
};

/**
 * Generates API version metadata object.
 *
 * @param {string} version - Version string
 * @param {ApiVersionMetadata['status']} status - Version status
 * @param {Partial<ApiVersionMetadata>} [options] - Additional options
 * @returns {ApiVersionMetadata} Version metadata
 *
 * @example
 * ```typescript
 * const v1Metadata = createApiVersionMetadata('v1', 'deprecated', {
 *   deprecationDate: new Date('2024-01-01'),
 *   sunsetDate: new Date('2025-01-01'),
 *   migrationGuide: '/docs/migration/v1-to-v2'
 * });
 * ```
 */
export const createApiVersionMetadata = (
  version: string,
  status: ApiVersionMetadata['status'],
  options?: Partial<ApiVersionMetadata>,
): ApiVersionMetadata => {
  return {
    version,
    status,
    deprecationDate: options?.deprecationDate,
    sunsetDate: options?.sunsetDate,
    migrationGuide: options?.migrationGuide,
  };
};

// ============================================================================
// AUTHENTICATION & AUTHORIZATION (30-33)
// ============================================================================

/**
 * Extracts bearer token from Authorization header.
 *
 * @param {Request} req - Express request object
 * @returns {string | null} Bearer token or null
 *
 * @example
 * ```typescript
 * const token = extractBearerToken(req);
 * if (!token) {
 *   return res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Token required'));
 * }
 * ```
 */
export const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Extracts API key from headers or query parameters.
 *
 * @param {Request} req - Express request object
 * @returns {string | null} API key or null
 *
 * @example
 * ```typescript
 * const apiKey = extractApiKey(req);
 * if (!apiKey) {
 *   return res.status(401).json(createErrorResponse('UNAUTHORIZED', 'API key required'));
 * }
 * ```
 */
export const extractApiKey = (req: Request): string | null => {
  // Check X-API-Key header
  const headerKey = req.headers['x-api-key'] as string;
  if (headerKey) {
    return headerKey;
  }

  // Check query parameter
  const queryKey = req.query.apiKey as string || req.query.api_key as string;
  if (queryKey) {
    return queryKey;
  }

  return null;
};

/**
 * Validates permission scopes for resource access.
 *
 * @param {string[]} requiredScopes - Required scopes
 * @param {string[]} userScopes - User's scopes
 * @param {boolean} [requireAll=true] - Whether all scopes are required
 * @returns {boolean} Whether user has required permissions
 *
 * @example
 * ```typescript
 * const hasAccess = validatePermissionScopes(
 *   ['networks:read', 'networks:write'],
 *   user.scopes,
 *   true
 * );
 * if (!hasAccess) {
 *   return res.status(403).json(createErrorResponse('FORBIDDEN', 'Insufficient permissions'));
 * }
 * ```
 */
export const validatePermissionScopes = (
  requiredScopes: string[],
  userScopes: string[],
  requireAll = true,
): boolean => {
  if (requiredScopes.length === 0) {
    return true;
  }

  if (userScopes.includes('*') || userScopes.includes('admin')) {
    return true;
  }

  if (requireAll) {
    return requiredScopes.every(scope => {
      if (userScopes.includes(scope)) {
        return true;
      }

      // Check wildcard permissions (e.g., 'networks:*')
      const [resource] = scope.split(':');
      return userScopes.includes(`${resource}:*`);
    });
  } else {
    return requiredScopes.some(scope => userScopes.includes(scope));
  }
};

/**
 * Middleware factory for scope-based authorization.
 *
 * @param {string[]} requiredScopes - Required scopes
 * @param {boolean} [requireAll=true] - Whether all scopes are required
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.put(
 *   '/api/v1/networks/:id',
 *   authMiddleware,
 *   requireScopes(['networks:write']),
 *   updateNetworkHandler
 * );
 * ```
 */
export const requireScopes = (requiredScopes: string[], requireAll = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userScopes = (req as any).user?.scopes || (req as any).scopes || [];

    if (!validatePermissionScopes(requiredScopes, userScopes, requireAll)) {
      return res.status(403).json(
        createErrorResponse(
          'FORBIDDEN',
          'Insufficient permissions',
          undefined,
          { requiredScopes, userScopes },
        ),
      );
    }

    next();
  };
};

// ============================================================================
// RATE LIMITING (34-37)
// ============================================================================

/**
 * Generates rate limit headers for response.
 *
 * @param {RateLimitInfo} info - Rate limit information
 * @returns {Record<string, string>} Rate limit headers
 *
 * @example
 * ```typescript
 * const headers = generateRateLimitHeaders({
 *   limit: 1000,
 *   remaining: 750,
 *   reset: Date.now() + 3600000
 * });
 * Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
 * ```
 */
export const generateRateLimitHeaders = (info: RateLimitInfo): Record<string, string> => {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': info.limit.toString(),
    'X-RateLimit-Remaining': info.remaining.toString(),
    'X-RateLimit-Reset': new Date(info.reset).toISOString(),
  };

  if (info.retryAfter !== undefined) {
    headers['Retry-After'] = info.retryAfter.toString();
  }

  return headers;
};

/**
 * Calculates rate limit reset time for window-based limiting.
 *
 * @param {number} windowMs - Window duration in milliseconds
 * @param {number} [startTime] - Window start time (defaults to now)
 * @returns {number} Reset timestamp
 *
 * @example
 * ```typescript
 * const resetTime = calculateRateLimitReset(3600000); // 1 hour window
 * // Result: timestamp for 1 hour from now
 * ```
 */
export const calculateRateLimitReset = (windowMs: number, startTime?: number): number => {
  const start = startTime || Date.now();
  return start + windowMs;
};

/**
 * Checks if rate limit has been exceeded.
 *
 * @param {number} currentCount - Current request count
 * @param {number} limit - Rate limit
 * @param {number} resetTime - Reset timestamp
 * @returns {{ exceeded: boolean; retryAfter?: number }} Rate limit status
 *
 * @example
 * ```typescript
 * const status = checkRateLimitExceeded(userRequestCount, 1000, resetTime);
 * if (status.exceeded) {
 *   return res.status(429).json(
 *     createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests')
 *   );
 * }
 * ```
 */
export const checkRateLimitExceeded = (
  currentCount: number,
  limit: number,
  resetTime: number,
): { exceeded: boolean; retryAfter?: number } => {
  const exceeded = currentCount >= limit;
  const retryAfter = exceeded ? Math.ceil((resetTime - Date.now()) / 1000) : undefined;

  return { exceeded, retryAfter };
};

/**
 * Creates rate limit exceeded response.
 *
 * @param {RateLimitInfo} info - Rate limit information
 * @returns {ApiResponse<never>} Rate limit error response
 *
 * @example
 * ```typescript
 * const response = createRateLimitResponse({
 *   limit: 1000,
 *   remaining: 0,
 *   reset: resetTime,
 *   retryAfter: 3600
 * });
 * res.status(429).json(response);
 * ```
 */
export const createRateLimitResponse = (info: RateLimitInfo): ApiResponse<never> => {
  return {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit exceeded',
      details: {
        limit: info.limit,
        remaining: info.remaining,
        reset: new Date(info.reset).toISOString(),
        retryAfter: info.retryAfter,
      },
    },
    timestamp: new Date().toISOString(),
  };
};

// ============================================================================
// QUERY PARSING (38-40)
// ============================================================================

/**
 * Parses and validates query parameters.
 *
 * @param {Request} req - Express request object
 * @returns {QueryParams} Parsed query parameters
 *
 * @example
 * ```typescript
 * const params = parseQueryParams(req);
 * // Result: { filters: {...}, sort: [...], page: 1, pageSize: 20, fields: [...] }
 * ```
 */
export const parseQueryParams = (req: Request): QueryParams => {
  return {
    filters: req.query.filter as Record<string, any> | undefined,
    sort: req.query.sort as string | string[] | undefined,
    page: parseInt(req.query.page as string, 10) || undefined,
    pageSize: parseInt(req.query.pageSize as string, 10) || undefined,
    cursor: req.query.cursor as string | undefined,
    fields: extractFieldSelection(req),
    include: req.query.include ? (req.query.include as string).split(',') : undefined,
    expand: req.query.expand ? (req.query.expand as string).split(',') : undefined,
  };
};

/**
 * Validates query parameter constraints.
 *
 * @param {QueryParams} params - Query parameters
 * @param {object} constraints - Validation constraints
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateQueryParams(params, {
 *   maxPageSize: 100,
 *   allowedFilters: ['name', 'status'],
 *   allowedSortFields: ['createdAt', 'name']
 * });
 * ```
 */
export const validateQueryParams = (
  params: QueryParams,
  constraints: {
    maxPageSize?: number;
    allowedFilters?: string[];
    allowedSortFields?: string[];
    allowedFields?: string[];
  },
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (params.pageSize && constraints.maxPageSize && params.pageSize > constraints.maxPageSize) {
    errors.push(`pageSize cannot exceed ${constraints.maxPageSize}`);
  }

  if (params.filters && constraints.allowedFilters) {
    const filterFields = Object.keys(params.filters);
    const invalidFilters = filterFields.filter(f => !constraints.allowedFilters!.includes(f));
    if (invalidFilters.length > 0) {
      errors.push(`Invalid filter fields: ${invalidFilters.join(', ')}`);
    }
  }

  if (params.sort && constraints.allowedSortFields) {
    const sortFields = Array.isArray(params.sort) ? params.sort : [params.sort];
    const cleanedFields = sortFields.map(f => f.replace(/^-/, ''));
    const invalidSorts = cleanedFields.filter(f => !constraints.allowedSortFields!.includes(f));
    if (invalidSorts.length > 0) {
      errors.push(`Invalid sort fields: ${invalidSorts.join(', ')}`);
    }
  }

  if (params.fields && constraints.allowedFields) {
    const invalidFields = params.fields.filter(f => !constraints.allowedFields!.includes(f));
    if (invalidFields.length > 0) {
      errors.push(`Invalid fields: ${invalidFields.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitizes query parameters to prevent injection attacks.
 *
 * @param {QueryParams} params - Query parameters
 * @returns {QueryParams} Sanitized parameters
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeQueryParams(parseQueryParams(req));
 * // Use sanitized params for database queries
 * ```
 */
export const sanitizeQueryParams = (params: QueryParams): QueryParams => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      return value.replace(/[<>'"`;\\]/g, '');
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: Record<string, any> = {};
      Object.entries(value).forEach(([key, val]) => {
        sanitized[key] = sanitizeValue(val);
      });
      return sanitized;
    }
    return value;
  };

  return {
    filters: sanitizeValue(params.filters),
    sort: params.sort,
    page: params.page,
    pageSize: params.pageSize,
    cursor: params.cursor,
    fields: params.fields,
    include: params.include,
    expand: params.expand,
  };
};

export default {
  // Pagination Helpers
  extractPaginationParams,
  buildPaginationMetadata,
  createPaginatedResponse,
  encodeCursor,
  decodeCursor,
  extractCursorPaginationParams,
  createCursorPaginatedResponse,
  generatePaginationLinkHeader,

  // Filtering & Sorting
  parseFilterCriteria,
  buildWhereClause,
  parseSortCriteria,
  buildOrderByClause,
  validateFilterCriteria,
  validateSortCriteria,

  // Response Formatting
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createResourceResponse,
  selectFields,
  extractFieldSelection,

  // Error Handling
  mapStatusCodeToError,
  createDetailedErrorResponse,
  errorHandlerMiddleware,
  createApiError,
  asyncErrorHandler,

  // API Versioning
  extractApiVersionFromRequest,
  validateApiVersionFromMetadata,
  apiVersionDeprecationMiddleware,
  createApiVersionMetadata,

  // Authentication & Authorization
  extractBearerToken,
  extractApiKey,
  validatePermissionScopes,
  requireScopes,

  // Rate Limiting
  generateRateLimitHeaders,
  calculateRateLimitReset,
  checkRateLimitExceeded,
  createRateLimitResponse,

  // Query Parsing
  parseQueryParams,
  validateQueryParams,
  sanitizeQueryParams,
};
