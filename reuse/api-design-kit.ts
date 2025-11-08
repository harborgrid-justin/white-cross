/**
 * LOC: APID1234567
 * File: /reuse/api-design-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and services
 *   - API gateway implementations
 *   - REST API middleware
 */

/**
 * File: /reuse/api-design-kit.ts
 * Locator: WC-UTL-APID-001
 * Purpose: Comprehensive API Design Utilities - REST patterns, pagination, filtering, HATEOAS, circuit breakers
 *
 * Upstream: Independent utility module for API design and implementation
 * Downstream: ../backend/*, API controllers, middleware, gateway services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI
 * Exports: 48 utility functions for REST API design, pagination, filtering, circuit breakers, response envelopes
 *
 * LLM Context: Comprehensive API design utilities for implementing production-ready REST APIs in White Cross system.
 * Provides pagination, filtering, sorting, HATEOAS links, response envelopes, circuit breakers, retry policies,
 * fallback strategies, and API gateway patterns. Essential for building scalable, resilient healthcare APIs.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  cursor?: string;
}

interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

interface FilterOptions {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'between';
  value: any;
}

interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

interface SearchOptions {
  query: string;
  fields: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata?: Record<string, any>;
  errors?: ApiError[];
  links?: HateoasLinks;
}

interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

interface HateoasLinks {
  self: string;
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
  [key: string]: string | undefined;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  successes: number;
  nextAttempt: number;
}

interface RetryPolicy {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

interface FallbackStrategy<T> {
  type: 'cache' | 'default' | 'degraded';
  handler: () => Promise<T> | T;
}

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

/**
 * Creates offset-based pagination metadata from query parameters.
 *
 * @param {PaginationParams} params - Pagination parameters
 * @param {number} totalItems - Total number of items
 * @returns {PaginationMetadata} Pagination metadata
 *
 * @example
 * ```typescript
 * const metadata = createOffsetPagination(
 *   { page: 2, limit: 20 },
 *   150
 * );
 * // Result: { currentPage: 2, pageSize: 20, totalItems: 150, totalPages: 8, hasNextPage: true, ... }
 * ```
 */
export const createOffsetPagination = (
  params: PaginationParams,
  totalItems: number,
): PaginationMetadata => {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    pageSize: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Creates cursor-based pagination metadata for efficient large dataset pagination.
 *
 * @param {string | null} currentCursor - Current cursor position
 * @param {number} limit - Items per page
 * @param {boolean} hasMore - Whether more items exist
 * @param {string | null} [nextCursor] - Next cursor position
 * @returns {Partial<PaginationMetadata>} Cursor pagination metadata
 *
 * @example
 * ```typescript
 * const metadata = createCursorPagination(
 *   'eyJpZCI6MTAwfQ==',
 *   25,
 *   true,
 *   'eyJpZCI6MTI1fQ=='
 * );
 * // Result: { pageSize: 25, hasNextPage: true, nextCursor: 'eyJpZCI6MTI1fQ==', ... }
 * ```
 */
export const createCursorPagination = (
  currentCursor: string | null,
  limit: number,
  hasMore: boolean,
  nextCursor?: string | null,
): Partial<PaginationMetadata> => {
  return {
    pageSize: limit,
    hasNextPage: hasMore,
    nextCursor: nextCursor || undefined,
    previousCursor: currentCursor || undefined,
  };
};

/**
 * Encodes pagination cursor from object (base64 encoding).
 *
 * @param {Record<string, any>} cursorData - Cursor data object
 * @returns {string} Encoded cursor string
 *
 * @example
 * ```typescript
 * const cursor = encodePaginationCursor({ id: 100, timestamp: 1234567890 });
 * // Result: 'eyJpZCI6MTAwLCJ0aW1lc3RhbXAiOjEyMzQ1Njc4OTB9'
 * ```
 */
export const encodePaginationCursor = (cursorData: Record<string, any>): string => {
  const jsonStr = JSON.stringify(cursorData);
  return Buffer.from(jsonStr).toString('base64');
};

/**
 * Decodes pagination cursor to object.
 *
 * @param {string} cursor - Encoded cursor string
 * @returns {Record<string, any>} Decoded cursor data
 *
 * @example
 * ```typescript
 * const data = decodePaginationCursor('eyJpZCI6MTAwLCJ0aW1lc3RhbXAiOjEyMzQ1Njc4OTB9');
 * // Result: { id: 100, timestamp: 1234567890 }
 * ```
 */
export const decodePaginationCursor = (cursor: string): Record<string, any> => {
  try {
    const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error('Invalid pagination cursor');
  }
};

/**
 * Calculates offset from page and limit parameters.
 *
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {number} Offset value
 *
 * @example
 * ```typescript
 * const offset = calculateOffset(3, 20);
 * // Result: 40 (skip first 2 pages of 20 items each)
 * ```
 */
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Validates pagination parameters and applies defaults.
 *
 * @param {PaginationParams} params - Raw pagination parameters
 * @param {number} [maxLimit] - Maximum allowed limit (default: 100)
 * @param {number} [defaultLimit] - Default limit (default: 20)
 * @returns {Required<Omit<PaginationParams, 'cursor'>>} Validated pagination parameters
 *
 * @example
 * ```typescript
 * const validated = validatePaginationParams({ page: 0, limit: 200 }, 100, 20);
 * // Result: { page: 1, limit: 100, offset: 0 }
 * ```
 */
export const validatePaginationParams = (
  params: PaginationParams,
  maxLimit: number = 100,
  defaultLimit: number = 20,
): Required<Omit<PaginationParams, 'cursor'>> => {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(maxLimit, Math.max(1, params.limit || defaultLimit));
  const offset = params.offset !== undefined ? params.offset : calculateOffset(page, limit);

  return { page, limit, offset };
};

// ============================================================================
// FILTERING UTILITIES
// ============================================================================

/**
 * Builds a filter query object from filter options array.
 *
 * @param {FilterOptions[]} filters - Array of filter options
 * @returns {Record<string, any>} Filter query object
 *
 * @example
 * ```typescript
 * const query = buildFilterQuery([
 *   { field: 'status', operator: 'eq', value: 'active' },
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'role', operator: 'in', value: ['admin', 'user'] }
 * ]);
 * // Result: { status: 'active', age: { $gte: 18 }, role: { $in: ['admin', 'user'] } }
 * ```
 */
export const buildFilterQuery = (filters: FilterOptions[]): Record<string, any> => {
  const query: Record<string, any> = {};

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        query[field] = value;
        break;
      case 'ne':
        query[field] = { $ne: value };
        break;
      case 'gt':
        query[field] = { $gt: value };
        break;
      case 'gte':
        query[field] = { $gte: value };
        break;
      case 'lt':
        query[field] = { $lt: value };
        break;
      case 'lte':
        query[field] = { $lte: value };
        break;
      case 'in':
        query[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case 'nin':
        query[field] = { $nin: Array.isArray(value) ? value : [value] };
        break;
      case 'like':
        query[field] = { $regex: value, $options: 'i' };
        break;
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          query[field] = { $gte: value[0], $lte: value[1] };
        }
        break;
    }
  });

  return query;
};

/**
 * Parses filter string from query parameter (e.g., "status:eq:active").
 *
 * @param {string} filterString - Filter string in format "field:operator:value"
 * @returns {FilterOptions} Parsed filter options
 *
 * @example
 * ```typescript
 * const filter = parseFilterString('age:gte:18');
 * // Result: { field: 'age', operator: 'gte', value: '18' }
 *
 * const filter2 = parseFilterString('status:in:active,pending');
 * // Result: { field: 'status', operator: 'in', value: ['active', 'pending'] }
 * ```
 */
export const parseFilterString = (filterString: string): FilterOptions => {
  const [field, operator, ...valueParts] = filterString.split(':');
  const valueStr = valueParts.join(':');

  let value: any = valueStr;
  if (operator === 'in' || operator === 'nin') {
    value = valueStr.split(',').map(v => v.trim());
  } else if (operator === 'between') {
    value = valueStr.split(',').map(v => parseFloat(v.trim()));
  } else if (!isNaN(Number(valueStr))) {
    value = Number(valueStr);
  } else if (valueStr === 'true' || valueStr === 'false') {
    value = valueStr === 'true';
  }

  return {
    field,
    operator: operator as FilterOptions['operator'],
    value,
  };
};

/**
 * Validates filter options against allowed fields and operators.
 *
 * @param {FilterOptions} filter - Filter options to validate
 * @param {string[]} allowedFields - Allowed field names
 * @param {string[]} [allowedOperators] - Allowed operators (default: all)
 * @returns {boolean} True if filter is valid
 *
 * @example
 * ```typescript
 * const isValid = validateFilter(
 *   { field: 'status', operator: 'eq', value: 'active' },
 *   ['status', 'name', 'age'],
 *   ['eq', 'ne', 'in']
 * );
 * // Result: true
 * ```
 */
export const validateFilter = (
  filter: FilterOptions,
  allowedFields: string[],
  allowedOperators?: string[],
): boolean => {
  if (!allowedFields.includes(filter.field)) {
    return false;
  }

  if (allowedOperators && !allowedOperators.includes(filter.operator)) {
    return false;
  }

  return true;
};

/**
 * Combines multiple filter queries with AND logic.
 *
 * @param {Record<string, any>[]} queries - Array of filter queries
 * @returns {Record<string, any>} Combined filter query
 *
 * @example
 * ```typescript
 * const combined = combineFilters([
 *   { status: 'active' },
 *   { age: { $gte: 18 } },
 *   { role: { $in: ['admin', 'user'] } }
 * ]);
 * // Result: { $and: [{ status: 'active' }, { age: { $gte: 18 } }, { role: { $in: [...] } }] }
 * ```
 */
export const combineFilters = (queries: Record<string, any>[]): Record<string, any> => {
  if (queries.length === 0) return {};
  if (queries.length === 1) return queries[0];
  return { $and: queries };
};

// ============================================================================
// SORTING UTILITIES
// ============================================================================

/**
 * Builds sort query object from sort options array.
 *
 * @param {SortOptions[]} sortOptions - Array of sort options
 * @returns {Record<string, 1 | -1>} Sort query object
 *
 * @example
 * ```typescript
 * const sort = buildSortQuery([
 *   { field: 'createdAt', order: 'desc' },
 *   { field: 'name', order: 'asc' }
 * ]);
 * // Result: { createdAt: -1, name: 1 }
 * ```
 */
export const buildSortQuery = (sortOptions: SortOptions[]): Record<string, 1 | -1> => {
  const sort: Record<string, 1 | -1> = {};

  sortOptions.forEach((option) => {
    sort[option.field] = option.order === 'asc' ? 1 : -1;
  });

  return sort;
};

/**
 * Parses sort string from query parameter (e.g., "-createdAt,name").
 *
 * @param {string} sortString - Sort string (prefix with '-' for descending)
 * @returns {SortOptions[]} Array of sort options
 *
 * @example
 * ```typescript
 * const sortOptions = parseSortString('-createdAt,name,-priority');
 * // Result: [
 * //   { field: 'createdAt', order: 'desc' },
 * //   { field: 'name', order: 'asc' },
 * //   { field: 'priority', order: 'desc' }
 * // ]
 * ```
 */
export const parseSortString = (sortString: string): SortOptions[] => {
  return sortString.split(',').map((field) => {
    const trimmed = field.trim();
    if (trimmed.startsWith('-')) {
      return { field: trimmed.substring(1), order: 'desc' as const };
    }
    return { field: trimmed, order: 'asc' as const };
  });
};

/**
 * Validates sort options against allowed fields.
 *
 * @param {SortOptions[]} sortOptions - Sort options to validate
 * @param {string[]} allowedFields - Allowed field names for sorting
 * @returns {boolean} True if all sort options are valid
 *
 * @example
 * ```typescript
 * const isValid = validateSort(
 *   [{ field: 'createdAt', order: 'desc' }, { field: 'name', order: 'asc' }],
 *   ['createdAt', 'name', 'status']
 * );
 * // Result: true
 * ```
 */
export const validateSort = (
  sortOptions: SortOptions[],
  allowedFields: string[],
): boolean => {
  return sortOptions.every((option) => allowedFields.includes(option.field));
};

// ============================================================================
// SEARCH UTILITIES
// ============================================================================

/**
 * Builds search query for multiple fields.
 *
 * @param {SearchOptions} options - Search options
 * @returns {Record<string, any>} Search query object
 *
 * @example
 * ```typescript
 * const query = buildSearchQuery({
 *   query: 'john',
 *   fields: ['firstName', 'lastName', 'email'],
 *   fuzzy: true,
 *   caseSensitive: false
 * });
 * // Result: { $or: [
 * //   { firstName: { $regex: 'john', $options: 'i' } },
 * //   { lastName: { $regex: 'john', $options: 'i' } },
 * //   { email: { $regex: 'john', $options: 'i' } }
 * // ]}
 * ```
 */
export const buildSearchQuery = (options: SearchOptions): Record<string, any> => {
  const { query, fields, fuzzy = false, caseSensitive = false } = options;

  const searchPattern = fuzzy ? `.*${query}.*` : query;
  const regexOptions = caseSensitive ? '' : 'i';

  const conditions = fields.map((field) => ({
    [field]: { $regex: searchPattern, $options: regexOptions },
  }));

  return { $or: conditions };
};

/**
 * Creates full-text search query with ranking.
 *
 * @param {string} searchText - Search text
 * @param {string[]} [weightedFields] - Fields with search weights
 * @returns {Record<string, any>} Full-text search query
 *
 * @example
 * ```typescript
 * const query = createFullTextSearch('patient diagnosis', ['title', 'description', 'notes']);
 * // Result: { $text: { $search: 'patient diagnosis' }, score: { $meta: 'textScore' } }
 * ```
 */
export const createFullTextSearch = (
  searchText: string,
  weightedFields?: string[],
): Record<string, any> => {
  return {
    $text: { $search: searchText },
    score: { $meta: 'textScore' },
  };
};

/**
 * Sanitizes search query to prevent injection attacks.
 *
 * @param {string} query - Raw search query
 * @returns {string} Sanitized search query
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeSearchQuery('test$regex.*');
 * // Result: 'testregex' (removes special regex characters)
 * ```
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ============================================================================
// RESPONSE ENVELOPE UTILITIES
// ============================================================================

/**
 * Creates a standardized success response envelope.
 *
 * @template T
 * @param {T} data - Response data
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @param {HateoasLinks} [links] - HATEOAS links
 * @returns {ApiResponse<T>} Standardized API response
 *
 * @example
 * ```typescript
 * const response = createSuccessResponse(
 *   { id: 1, name: 'John Doe' },
 *   { timestamp: Date.now() },
 *   { self: '/api/users/1' }
 * );
 * // Result: { success: true, data: {...}, metadata: {...}, links: {...} }
 * ```
 */
export const createSuccessResponse = <T>(
  data: T,
  metadata?: Record<string, any>,
  links?: HateoasLinks,
): ApiResponse<T> => {
  return {
    success: true,
    data,
    ...(metadata && { metadata }),
    ...(links && { links }),
  };
};

/**
 * Creates a standardized error response envelope.
 *
 * @param {ApiError | ApiError[]} errors - Error or array of errors
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {ApiResponse<null>} Standardized error response
 *
 * @example
 * ```typescript
 * const response = createErrorResponse({
 *   code: 'VALIDATION_ERROR',
 *   message: 'Invalid input',
 *   field: 'email'
 * });
 * // Result: { success: false, data: null, errors: [{...}] }
 * ```
 */
export const createErrorResponse = (
  errors: ApiError | ApiError[],
  metadata?: Record<string, any>,
): ApiResponse<null> => {
  return {
    success: false,
    data: null,
    errors: Array.isArray(errors) ? errors : [errors],
    ...(metadata && { metadata }),
  };
};

/**
 * Creates paginated response envelope with data and pagination metadata.
 *
 * @template T
 * @param {T[]} items - Array of items
 * @param {PaginationMetadata} pagination - Pagination metadata
 * @param {HateoasLinks} [links] - HATEOAS pagination links
 * @returns {ApiResponse<T[]>} Paginated response
 *
 * @example
 * ```typescript
 * const response = createPaginatedResponse(
 *   users,
 *   { currentPage: 2, pageSize: 20, totalItems: 150, ... },
 *   { self: '/api/users?page=2', next: '/api/users?page=3', previous: '/api/users?page=1' }
 * );
 * ```
 */
export const createPaginatedResponse = <T>(
  items: T[],
  pagination: PaginationMetadata,
  links?: HateoasLinks,
): ApiResponse<T[]> => {
  return {
    success: true,
    data: items,
    metadata: { pagination },
    ...(links && { links }),
  };
};

// ============================================================================
// HATEOAS UTILITIES
// ============================================================================

/**
 * Generates HATEOAS links for a resource.
 *
 * @param {string} baseUrl - Base URL for the resource
 * @param {string} resourceId - Resource identifier
 * @param {string[]} [relations] - Additional relations to include
 * @returns {HateoasLinks} HATEOAS links object
 *
 * @example
 * ```typescript
 * const links = generateResourceLinks('/api/users', '123', ['posts', 'comments']);
 * // Result: {
 * //   self: '/api/users/123',
 * //   posts: '/api/users/123/posts',
 * //   comments: '/api/users/123/comments'
 * // }
 * ```
 */
export const generateResourceLinks = (
  baseUrl: string,
  resourceId: string,
  relations?: string[],
): HateoasLinks => {
  const links: HateoasLinks = {
    self: `${baseUrl}/${resourceId}`,
  };

  if (relations) {
    relations.forEach((relation) => {
      links[relation] = `${baseUrl}/${resourceId}/${relation}`;
    });
  }

  return links;
};

/**
 * Generates pagination HATEOAS links.
 *
 * @param {string} baseUrl - Base URL for the endpoint
 * @param {PaginationMetadata} pagination - Pagination metadata
 * @param {Record<string, any>} [queryParams] - Additional query parameters
 * @returns {HateoasLinks} Pagination links
 *
 * @example
 * ```typescript
 * const links = generatePaginationLinks(
 *   '/api/users',
 *   { currentPage: 2, totalPages: 5, hasNextPage: true, hasPreviousPage: true, ... },
 *   { status: 'active' }
 * );
 * // Result: {
 * //   self: '/api/users?page=2&status=active',
 * //   first: '/api/users?page=1&status=active',
 * //   next: '/api/users?page=3&status=active',
 * //   previous: '/api/users?page=1&status=active',
 * //   last: '/api/users?page=5&status=active'
 * // }
 * ```
 */
export const generatePaginationLinks = (
  baseUrl: string,
  pagination: PaginationMetadata,
  queryParams?: Record<string, any>,
): HateoasLinks => {
  const buildUrl = (page: number): string => {
    const params = new URLSearchParams({ ...queryParams, page: String(page) });
    return `${baseUrl}?${params.toString()}`;
  };

  const links: HateoasLinks = {
    self: buildUrl(pagination.currentPage),
    first: buildUrl(1),
    last: buildUrl(pagination.totalPages),
  };

  if (pagination.hasNextPage) {
    links.next = buildUrl(pagination.currentPage + 1);
  }

  if (pagination.hasPreviousPage) {
    links.previous = buildUrl(pagination.currentPage - 1);
  }

  return links;
};

/**
 * Adds HATEOAS links to a resource object.
 *
 * @template T
 * @param {T} resource - Resource object
 * @param {HateoasLinks} links - HATEOAS links
 * @returns {T & { _links: HateoasLinks }} Resource with embedded links
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John Doe' };
 * const enriched = embedHateoasLinks(user, {
 *   self: '/api/users/1',
 *   posts: '/api/users/1/posts'
 * });
 * // Result: { id: 1, name: 'John Doe', _links: { self: '...', posts: '...' } }
 * ```
 */
export const embedHateoasLinks = <T extends Record<string, any>>(
  resource: T,
  links: HateoasLinks,
): T & { _links: HateoasLinks } => {
  return {
    ...resource,
    _links: links,
  };
};

// ============================================================================
// API VERSIONING STRATEGIES
// ============================================================================

/**
 * Extracts API version from URL path.
 *
 * @param {string} path - Request path
 * @returns {string | null} API version or null
 *
 * @example
 * ```typescript
 * const version = extractVersionFromPath('/api/v2/users/123');
 * // Result: 'v2'
 * ```
 */
export const extractVersionFromPath = (path: string): string | null => {
  const match = path.match(/\/v(\d+)\//);
  return match ? `v${match[1]}` : null;
};

/**
 * Extracts API version from Accept header.
 *
 * @param {string} acceptHeader - Accept header value
 * @returns {string | null} API version or null
 *
 * @example
 * ```typescript
 * const version = extractVersionFromHeader('application/vnd.myapi.v2+json');
 * // Result: 'v2'
 * ```
 */
export const extractVersionFromHeader = (acceptHeader: string): string | null => {
  const match = acceptHeader.match(/\.v(\d+)\+/);
  return match ? `v${match[1]}` : null;
};

/**
 * Validates API version against supported versions.
 *
 * @param {string} version - API version to validate
 * @param {string[]} supportedVersions - Array of supported versions
 * @returns {boolean} True if version is supported
 *
 * @example
 * ```typescript
 * const isSupported = isVersionSupported('v2', ['v1', 'v2', 'v3']);
 * // Result: true
 * ```
 */
export const isVersionSupported = (version: string, supportedVersions: string[]): boolean => {
  return supportedVersions.includes(version);
};

/**
 * Gets the latest API version from supported versions list.
 *
 * @param {string[]} supportedVersions - Array of supported versions
 * @returns {string} Latest version
 *
 * @example
 * ```typescript
 * const latest = getLatestVersion(['v1', 'v2', 'v3', 'v2.1']);
 * // Result: 'v3'
 * ```
 */
export const getLatestVersion = (supportedVersions: string[]): string => {
  return supportedVersions
    .map((v) => ({ version: v, number: parseInt(v.replace('v', '').split('.')[0]) }))
    .sort((a, b) => b.number - a.number)[0].version;
};

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

/**
 * Creates a circuit breaker for protecting API calls.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance with execute method
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 3000,
 *   resetTimeout: 60000
 * });
 *
 * const result = await breaker.execute(() => apiCall());
 * ```
 */
export const createCircuitBreaker = (config: CircuitBreakerConfig) => {
  const state: CircuitBreakerState = {
    state: 'CLOSED',
    failures: 0,
    successes: 0,
    nextAttempt: Date.now(),
  };

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (state.state === 'OPEN') {
      if (Date.now() < state.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      state.state = 'HALF_OPEN';
      state.successes = 0;
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), config.timeout),
        ),
      ]);

      if (state.state === 'HALF_OPEN') {
        state.successes++;
        if (state.successes >= config.successThreshold) {
          state.state = 'CLOSED';
          state.failures = 0;
        }
      }

      return result;
    } catch (error) {
      state.failures++;

      if (state.state === 'HALF_OPEN') {
        state.state = 'OPEN';
        state.nextAttempt = Date.now() + config.resetTimeout;
      } else if (state.failures >= config.failureThreshold) {
        state.state = 'OPEN';
        state.nextAttempt = Date.now() + config.resetTimeout;
      }

      throw error;
    }
  };

  const getState = () => ({ ...state });
  const reset = () => {
    state.state = 'CLOSED';
    state.failures = 0;
    state.successes = 0;
    state.nextAttempt = Date.now();
  };

  return { execute, getState, reset };
};

/**
 * Checks if circuit breaker should allow request.
 *
 * @param {CircuitBreakerState} state - Current circuit breaker state
 * @returns {boolean} True if request should be allowed
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker(config);
 * const state = breaker.getState();
 * if (shouldAllowRequest(state)) {
 *   // Make request
 * }
 * ```
 */
export const shouldAllowRequest = (state: CircuitBreakerState): boolean => {
  if (state.state === 'CLOSED') return true;
  if (state.state === 'HALF_OPEN') return true;
  if (state.state === 'OPEN' && Date.now() >= state.nextAttempt) return true;
  return false;
};

// ============================================================================
// RETRY POLICY UTILITIES
// ============================================================================

/**
 * Executes function with exponential backoff retry policy.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryPolicy} policy - Retry policy configuration
 * @returns {Promise<T>} Result of successful execution
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   () => fetch('/api/users'),
 *   {
 *     maxAttempts: 3,
 *     baseDelay: 1000,
 *     maxDelay: 10000,
 *     backoffMultiplier: 2
 *   }
 * );
 * ```
 */
export const executeWithRetry = async <T>(
  fn: () => Promise<T>,
  policy: RetryPolicy,
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt === policy.maxAttempts) {
        throw error;
      }

      if (policy.retryableErrors && !policy.retryableErrors.includes(error.code)) {
        throw error;
      }

      const delay = Math.min(
        policy.baseDelay * Math.pow(policy.backoffMultiplier, attempt - 1),
        policy.maxDelay,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Creates a retry policy with default values.
 *
 * @param {Partial<RetryPolicy>} [overrides] - Policy overrides
 * @returns {RetryPolicy} Complete retry policy
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy({ maxAttempts: 5, baseDelay: 2000 });
 * // Result: { maxAttempts: 5, baseDelay: 2000, maxDelay: 30000, backoffMultiplier: 2 }
 * ```
 */
export const createRetryPolicy = (overrides?: Partial<RetryPolicy>): RetryPolicy => {
  return {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    ...overrides,
  };
};

/**
 * Calculates exponential backoff delay with jitter.
 *
 * @param {number} attempt - Current attempt number (1-based)
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @param {number} [backoffMultiplier] - Backoff multiplier (default: 2)
 * @returns {number} Calculated delay with jitter
 *
 * @example
 * ```typescript
 * const delay1 = calculateBackoffDelay(1, 1000, 10000, 2); // ~1000ms
 * const delay2 = calculateBackoffDelay(2, 1000, 10000, 2); // ~2000ms
 * const delay3 = calculateBackoffDelay(3, 1000, 10000, 2); // ~4000ms
 * ```
 */
export const calculateBackoffDelay = (
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  backoffMultiplier: number = 2,
): number => {
  const exponentialDelay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
  const jitter = Math.random() * 0.1 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, maxDelay);
};

// ============================================================================
// FALLBACK STRATEGY UTILITIES
// ============================================================================

/**
 * Executes function with fallback strategy on failure.
 *
 * @template T
 * @param {() => Promise<T>} primaryFn - Primary function to execute
 * @param {FallbackStrategy<T>} fallback - Fallback strategy
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const result = await executeWithFallback(
 *   () => fetchLiveData(),
 *   {
 *     type: 'cache',
 *     handler: () => getCachedData()
 *   }
 * );
 * ```
 */
export const executeWithFallback = async <T>(
  primaryFn: () => Promise<T>,
  fallback: FallbackStrategy<T>,
): Promise<T> => {
  try {
    return await primaryFn();
  } catch (error) {
    console.warn(`Primary execution failed, using ${fallback.type} fallback`, error);
    return await Promise.resolve(fallback.handler());
  }
};

/**
 * Creates a cache-based fallback strategy.
 *
 * @template T
 * @param {() => Promise<T> | T} cacheHandler - Cache retrieval handler
 * @returns {FallbackStrategy<T>} Cache fallback strategy
 *
 * @example
 * ```typescript
 * const cacheFallback = createCacheFallback(() => redis.get('users'));
 * const users = await executeWithFallback(() => fetchUsers(), cacheFallback);
 * ```
 */
export const createCacheFallback = <T>(
  cacheHandler: () => Promise<T> | T,
): FallbackStrategy<T> => {
  return {
    type: 'cache',
    handler: cacheHandler,
  };
};

/**
 * Creates a default value fallback strategy.
 *
 * @template T
 * @param {T} defaultValue - Default value to return
 * @returns {FallbackStrategy<T>} Default value fallback strategy
 *
 * @example
 * ```typescript
 * const defaultFallback = createDefaultFallback([]);
 * const users = await executeWithFallback(() => fetchUsers(), defaultFallback);
 * ```
 */
export const createDefaultFallback = <T>(defaultValue: T): FallbackStrategy<T> => {
  return {
    type: 'default',
    handler: () => defaultValue,
  };
};

/**
 * Creates a degraded service fallback strategy.
 *
 * @template T
 * @param {() => Promise<T> | T} degradedHandler - Degraded service handler
 * @returns {FallbackStrategy<T>} Degraded service fallback strategy
 *
 * @example
 * ```typescript
 * const degradedFallback = createDegradedFallback(() => fetchBasicUserData());
 * const users = await executeWithFallback(() => fetchFullUserData(), degradedFallback);
 * ```
 */
export const createDegradedFallback = <T>(
  degradedHandler: () => Promise<T> | T,
): FallbackStrategy<T> => {
  return {
    type: 'degraded',
    handler: degradedHandler,
  };
};

// ============================================================================
// STATUS CODE UTILITIES
// ============================================================================

/**
 * Maps common error types to appropriate HTTP status codes.
 *
 * @param {string} errorType - Error type identifier
 * @returns {number} HTTP status code
 *
 * @example
 * ```typescript
 * const status = mapErrorToStatusCode('NOT_FOUND'); // 404
 * const status2 = mapErrorToStatusCode('VALIDATION_ERROR'); // 422
 * const status3 = mapErrorToStatusCode('UNAUTHORIZED'); // 401
 * ```
 */
export const mapErrorToStatusCode = (errorType: string): number => {
  const errorMap: Record<string, number> = {
    VALIDATION_ERROR: 422,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMIT_EXCEEDED: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  };

  return errorMap[errorType] || 500;
};

/**
 * Determines if status code indicates a successful response.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if status indicates success
 *
 * @example
 * ```typescript
 * isSuccessStatus(200); // true
 * isSuccessStatus(201); // true
 * isSuccessStatus(400); // false
 * isSuccessStatus(500); // false
 * ```
 */
export const isSuccessStatus = (statusCode: number): boolean => {
  return statusCode >= 200 && statusCode < 300;
};

/**
 * Determines if status code indicates a redirect.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if status indicates redirect
 *
 * @example
 * ```typescript
 * isRedirectStatus(301); // true
 * isRedirectStatus(302); // true
 * isRedirectStatus(200); // false
 * ```
 */
export const isRedirectStatus = (statusCode: number): boolean => {
  return statusCode >= 300 && statusCode < 400;
};

/**
 * Determines if status code indicates a client error.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if status indicates client error
 *
 * @example
 * ```typescript
 * isClientErrorStatus(400); // true
 * isClientErrorStatus(404); // true
 * isClientErrorStatus(500); // false
 * ```
 */
export const isClientErrorStatus = (statusCode: number): boolean => {
  return statusCode >= 400 && statusCode < 500;
};

/**
 * Determines if status code indicates a server error.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {boolean} True if status indicates server error
 *
 * @example
 * ```typescript
 * isServerErrorStatus(500); // true
 * isServerErrorStatus(503); // true
 * isServerErrorStatus(400); // false
 * ```
 */
export const isServerErrorStatus = (statusCode: number): boolean => {
  return statusCode >= 500 && statusCode < 600;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Pagination
  createOffsetPagination,
  createCursorPagination,
  encodePaginationCursor,
  decodePaginationCursor,
  calculateOffset,
  validatePaginationParams,

  // Filtering
  buildFilterQuery,
  parseFilterString,
  validateFilter,
  combineFilters,

  // Sorting
  buildSortQuery,
  parseSortString,
  validateSort,

  // Search
  buildSearchQuery,
  createFullTextSearch,
  sanitizeSearchQuery,

  // Response envelopes
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,

  // HATEOAS
  generateResourceLinks,
  generatePaginationLinks,
  embedHateoasLinks,

  // Versioning
  extractVersionFromPath,
  extractVersionFromHeader,
  isVersionSupported,
  getLatestVersion,

  // Circuit breaker
  createCircuitBreaker,
  shouldAllowRequest,

  // Retry policy
  executeWithRetry,
  createRetryPolicy,
  calculateBackoffDelay,

  // Fallback strategies
  executeWithFallback,
  createCacheFallback,
  createDefaultFallback,
  createDegradedFallback,

  // Status codes
  mapErrorToStatusCode,
  isSuccessStatus,
  isRedirectStatus,
  isClientErrorStatus,
  isServerErrorStatus,
};
