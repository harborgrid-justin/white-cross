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
    value: unknown;
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
    metadata?: Record<string, unknown>;
    errors?: ApiError[];
    links?: HateoasLinks;
}
interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: unknown;
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
export declare const createOffsetPagination: (params: PaginationParams, totalItems: number) => PaginationMetadata;
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
export declare const createCursorPagination: (currentCursor: string | null, limit: number, hasMore: boolean, nextCursor?: string | null) => Partial<PaginationMetadata>;
/**
 * Encodes pagination cursor from object (base64 encoding).
 *
 * @param {Record<string, unknown>} cursorData - Cursor data object
 * @returns {string} Encoded cursor string
 * @throws {Error} If cursorData cannot be serialized
 *
 * @example
 * ```typescript
 * const cursor = encodePaginationCursor({ id: 100, timestamp: 1234567890 });
 * // Result: 'eyJpZCI6MTAwLCJ0aW1lc3RhbXAiOjEyMzQ1Njc4OTB9'
 * ```
 */
export declare const encodePaginationCursor: (cursorData: Record<string, unknown>) => string;
/**
 * Decodes pagination cursor to object.
 *
 * @param {string} cursor - Encoded cursor string
 * @returns {Record<string, unknown>} Decoded cursor data
 * @throws {Error} If cursor is invalid or cannot be decoded
 *
 * @example
 * ```typescript
 * const data = decodePaginationCursor('eyJpZCI6MTAwLCJ0aW1lc3RhbXAiOjEyMzQ1Njc4OTB9');
 * // Result: { id: 100, timestamp: 1234567890 }
 * ```
 */
export declare const decodePaginationCursor: (cursor: string) => Record<string, unknown>;
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
export declare const calculateOffset: (page: number, limit: number) => number;
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
export declare const validatePaginationParams: (params: PaginationParams, maxLimit?: number, defaultLimit?: number) => Required<Omit<PaginationParams, "cursor">>;
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
export declare const buildFilterQuery: (filters: FilterOptions[]) => Record<string, any>;
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
export declare const parseFilterString: (filterString: string) => FilterOptions;
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
export declare const validateFilter: (filter: FilterOptions, allowedFields: string[], allowedOperators?: string[]) => boolean;
/**
 * Combines multiple filter queries with AND logic.
 *
 * @param {Record<string, unknown>[]} queries - Array of filter queries
 * @returns {Record<string, unknown>} Combined filter query
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
export declare const combineFilters: (queries: ReadonlyArray<Record<string, unknown>>) => Record<string, unknown>;
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
export declare const buildSortQuery: (sortOptions: SortOptions[]) => Record<string, 1 | -1>;
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
export declare const parseSortString: (sortString: string) => SortOptions[];
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
export declare const validateSort: (sortOptions: SortOptions[], allowedFields: string[]) => boolean;
/**
 * Builds search query for multiple fields.
 *
 * @param {SearchOptions} options - Search options
 * @returns {Record<string, unknown>} Search query object
 * @throws {Error} If query or fields are invalid
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
export declare const buildSearchQuery: (options: SearchOptions) => Record<string, unknown>;
/**
 * Creates full-text search query with ranking.
 *
 * @param {string} searchText - Search text
 * @param {string[]} [weightedFields] - Fields with search weights (currently unused, reserved for future enhancement)
 * @returns {Record<string, unknown>} Full-text search query
 * @throws {Error} If searchText is invalid
 *
 * @example
 * ```typescript
 * const query = createFullTextSearch('patient diagnosis', ['title', 'description', 'notes']);
 * // Result: { $text: { $search: 'patient diagnosis' }, score: { $meta: 'textScore' } }
 * ```
 */
export declare const createFullTextSearch: (searchText: string, weightedFields?: string[]) => Record<string, unknown>;
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
export declare const sanitizeSearchQuery: (query: string) => string;
/**
 * Creates a standardized success response envelope.
 *
 * @template T
 * @param {T} data - Response data
 * @param {Record<string, unknown>} [metadata] - Additional metadata
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
export declare const createSuccessResponse: <T>(data: T, metadata?: Record<string, unknown>, links?: HateoasLinks) => ApiResponse<T>;
/**
 * Creates a standardized error response envelope.
 *
 * @param {ApiError | ApiError[]} errors - Error or array of errors
 * @param {Record<string, unknown>} [metadata] - Additional metadata
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
export declare const createErrorResponse: (errors: ApiError | ApiError[], metadata?: Record<string, unknown>) => ApiResponse<null>;
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
export declare const createPaginatedResponse: <T>(items: T[], pagination: PaginationMetadata, links?: HateoasLinks) => ApiResponse<T[]>;
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
export declare const generateResourceLinks: (baseUrl: string, resourceId: string, relations?: string[]) => HateoasLinks;
/**
 * Generates pagination HATEOAS links.
 *
 * @param {string} baseUrl - Base URL for the endpoint
 * @param {PaginationMetadata} pagination - Pagination metadata
 * @param {Record<string, string>} [queryParams] - Additional query parameters
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
export declare const generatePaginationLinks: (baseUrl: string, pagination: PaginationMetadata, queryParams?: Record<string, string>) => HateoasLinks;
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
export declare const embedHateoasLinks: <T extends Record<string, any>>(resource: T, links: HateoasLinks) => T & {
    _links: HateoasLinks;
};
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
export declare const extractVersionFromPath: (path: string) => string | null;
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
export declare const extractVersionFromHeader: (acceptHeader: string) => string | null;
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
export declare const isVersionSupported: (version: string, supportedVersions: string[]) => boolean;
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
export declare const getLatestVersion: (supportedVersions: string[]) => string;
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
export declare const createCircuitBreaker: (config: CircuitBreakerConfig) => {
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
    getState: () => {
        state: "CLOSED" | "OPEN" | "HALF_OPEN";
        failures: number;
        successes: number;
        nextAttempt: number;
    };
    reset: () => void;
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
export declare const shouldAllowRequest: (state: CircuitBreakerState) => boolean;
/**
 * Executes function with exponential backoff retry policy.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryPolicy} policy - Retry policy configuration
 * @returns {Promise<T>} Result of successful execution
 * @throws {Error} Last error encountered after all retry attempts exhausted
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
export declare const executeWithRetry: <T>(fn: () => Promise<T>, policy: RetryPolicy) => Promise<T>;
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
export declare const createRetryPolicy: (overrides?: Partial<RetryPolicy>) => RetryPolicy;
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
export declare const calculateBackoffDelay: (attempt: number, baseDelay: number, maxDelay: number, backoffMultiplier?: number) => number;
/**
 * Executes function with fallback strategy on failure.
 *
 * @template T
 * @param {() => Promise<T>} primaryFn - Primary function to execute
 * @param {FallbackStrategy<T>} fallback - Fallback strategy
 * @returns {Promise<T>} Result from primary or fallback
 * @throws {Error} If both primary and fallback fail
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
export declare const executeWithFallback: <T>(primaryFn: () => Promise<T>, fallback: FallbackStrategy<T>) => Promise<T>;
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
export declare const createCacheFallback: <T>(cacheHandler: () => Promise<T> | T) => FallbackStrategy<T>;
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
export declare const createDefaultFallback: <T>(defaultValue: T) => FallbackStrategy<T>;
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
export declare const createDegradedFallback: <T>(degradedHandler: () => Promise<T> | T) => FallbackStrategy<T>;
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
export declare const mapErrorToStatusCode: (errorType: string) => number;
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
export declare const isSuccessStatus: (statusCode: number) => boolean;
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
export declare const isRedirectStatus: (statusCode: number) => boolean;
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
export declare const isClientErrorStatus: (statusCode: number) => boolean;
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
export declare const isServerErrorStatus: (statusCode: number) => boolean;
declare const _default: {
    createOffsetPagination: (params: PaginationParams, totalItems: number) => PaginationMetadata;
    createCursorPagination: (currentCursor: string | null, limit: number, hasMore: boolean, nextCursor?: string | null) => Partial<PaginationMetadata>;
    encodePaginationCursor: (cursorData: Record<string, unknown>) => string;
    decodePaginationCursor: (cursor: string) => Record<string, unknown>;
    calculateOffset: (page: number, limit: number) => number;
    validatePaginationParams: (params: PaginationParams, maxLimit?: number, defaultLimit?: number) => Required<Omit<PaginationParams, "cursor">>;
    buildFilterQuery: (filters: FilterOptions[]) => Record<string, any>;
    parseFilterString: (filterString: string) => FilterOptions;
    validateFilter: (filter: FilterOptions, allowedFields: string[], allowedOperators?: string[]) => boolean;
    combineFilters: (queries: ReadonlyArray<Record<string, unknown>>) => Record<string, unknown>;
    buildSortQuery: (sortOptions: SortOptions[]) => Record<string, 1 | -1>;
    parseSortString: (sortString: string) => SortOptions[];
    validateSort: (sortOptions: SortOptions[], allowedFields: string[]) => boolean;
    buildSearchQuery: (options: SearchOptions) => Record<string, unknown>;
    createFullTextSearch: (searchText: string, weightedFields?: string[]) => Record<string, unknown>;
    sanitizeSearchQuery: (query: string) => string;
    createSuccessResponse: <T>(data: T, metadata?: Record<string, unknown>, links?: HateoasLinks) => ApiResponse<T>;
    createErrorResponse: (errors: ApiError | ApiError[], metadata?: Record<string, unknown>) => ApiResponse<null>;
    createPaginatedResponse: <T>(items: T[], pagination: PaginationMetadata, links?: HateoasLinks) => ApiResponse<T[]>;
    generateResourceLinks: (baseUrl: string, resourceId: string, relations?: string[]) => HateoasLinks;
    generatePaginationLinks: (baseUrl: string, pagination: PaginationMetadata, queryParams?: Record<string, string>) => HateoasLinks;
    embedHateoasLinks: <T extends Record<string, any>>(resource: T, links: HateoasLinks) => T & {
        _links: HateoasLinks;
    };
    extractVersionFromPath: (path: string) => string | null;
    extractVersionFromHeader: (acceptHeader: string) => string | null;
    isVersionSupported: (version: string, supportedVersions: string[]) => boolean;
    getLatestVersion: (supportedVersions: string[]) => string;
    createCircuitBreaker: (config: CircuitBreakerConfig) => {
        execute: <T>(fn: () => Promise<T>) => Promise<T>;
        getState: () => {
            state: "CLOSED" | "OPEN" | "HALF_OPEN";
            failures: number;
            successes: number;
            nextAttempt: number;
        };
        reset: () => void;
    };
    shouldAllowRequest: (state: CircuitBreakerState) => boolean;
    executeWithRetry: <T>(fn: () => Promise<T>, policy: RetryPolicy) => Promise<T>;
    createRetryPolicy: (overrides?: Partial<RetryPolicy>) => RetryPolicy;
    calculateBackoffDelay: (attempt: number, baseDelay: number, maxDelay: number, backoffMultiplier?: number) => number;
    executeWithFallback: <T>(primaryFn: () => Promise<T>, fallback: FallbackStrategy<T>) => Promise<T>;
    createCacheFallback: <T>(cacheHandler: () => Promise<T> | T) => FallbackStrategy<T>;
    createDefaultFallback: <T>(defaultValue: T) => FallbackStrategy<T>;
    createDegradedFallback: <T>(degradedHandler: () => Promise<T> | T) => FallbackStrategy<T>;
    mapErrorToStatusCode: (errorType: string) => number;
    isSuccessStatus: (statusCode: number) => boolean;
    isRedirectStatus: (statusCode: number) => boolean;
    isClientErrorStatus: (statusCode: number) => boolean;
    isServerErrorStatus: (statusCode: number) => boolean;
};
export default _default;
//# sourceMappingURL=api-design-kit.d.ts.map