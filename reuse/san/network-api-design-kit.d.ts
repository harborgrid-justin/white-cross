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
export declare const extractPaginationParams: (req: Request, defaultPageSize?: number, maxPageSize?: number) => PaginationParams;
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
export declare const buildPaginationMetadata: (totalItems: number, params: PaginationParams) => PaginationMetadata;
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
export declare const createPaginatedResponse: <T>(data: T[], totalItems: number, params: PaginationParams, baseUrl?: string) => PaginatedResponse<T>;
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
export declare const encodeCursor: (value: any) => string;
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
export declare const decodeCursor: (cursor: string) => any;
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
export declare const extractCursorPaginationParams: (req: Request, defaultLimit?: number, maxLimit?: number) => CursorPaginationParams;
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
export declare const createCursorPaginatedResponse: <T>(data: T[], limit: number, getCursorValue: (item: T) => any) => CursorPaginationResponse<T>;
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
export declare const generatePaginationLinkHeader: (baseUrl: string, metadata: PaginationMetadata) => string;
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
export declare const parseFilterCriteria: (req: Request) => FilterCriteria[];
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
export declare const buildWhereClause: (filters: FilterCriteria[]) => Record<string, any>;
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
export declare const parseSortCriteria: (req: Request) => SortCriteria[];
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
export declare const buildOrderByClause: (sort: SortCriteria[]) => Array<[string, string]>;
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
export declare const validateFilterCriteria: (filters: FilterCriteria[], allowedFields: string[], allowedOperators?: FilterCriteria["operator"][]) => {
    valid: boolean;
    errors: string[];
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
export declare const validateSortCriteria: (sort: SortCriteria[], allowedFields: string[]) => {
    valid: boolean;
    errors: string[];
};
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
export declare const createSuccessResponse: <T>(data: T, metadata?: Record<string, any>) => ApiResponse<T>;
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
export declare const createErrorResponse: (code: string, message: string, field?: string, details?: any) => ApiResponse<never>;
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
export declare const createValidationErrorResponse: (errors: ValidationError[]) => ApiResponse<never>;
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
export declare const createResourceResponse: <T>(data: T, links: HateoasLink[], metadata?: Record<string, any>) => ResourceResponse<T>;
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
export declare const selectFields: (data: any, fields: string[]) => any;
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
export declare const extractFieldSelection: (req: Request) => string[] | undefined;
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
export declare const mapStatusCodeToError: (statusCode: number) => {
    code: string;
    message: string;
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
export declare const createDetailedErrorResponse: (error: Error, includeStack?: boolean) => ApiResponse<never>;
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
export declare const errorHandlerMiddleware: (error: Error, req: Request, res: Response, next: NextFunction) => void;
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
export declare const createApiError: (code: string, message: string, statusCode: number) => Error;
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
export declare const asyncErrorHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
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
export declare const extractApiVersionFromRequest: (req: Request, defaultVersion?: string) => string;
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
export declare const validateApiVersionFromMetadata: (version: string, supportedVersions: ApiVersionMetadata[]) => ApiVersionMetadata | null;
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
export declare const apiVersionDeprecationMiddleware: (supportedVersions: ApiVersionMetadata[]) => (req: Request, res: Response, next: NextFunction) => any;
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
export declare const createApiVersionMetadata: (version: string, status: ApiVersionMetadata["status"], options?: Partial<ApiVersionMetadata>) => ApiVersionMetadata;
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
export declare const extractBearerToken: (req: Request) => string | null;
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
export declare const extractApiKey: (req: Request) => string | null;
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
export declare const validatePermissionScopes: (requiredScopes: string[], userScopes: string[], requireAll?: boolean) => boolean;
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
export declare const requireScopes: (requiredScopes: string[], requireAll?: boolean) => (req: Request, res: Response, next: NextFunction) => any;
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
export declare const generateRateLimitHeaders: (info: RateLimitInfo) => Record<string, string>;
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
export declare const calculateRateLimitReset: (windowMs: number, startTime?: number) => number;
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
export declare const checkRateLimitExceeded: (currentCount: number, limit: number, resetTime: number) => {
    exceeded: boolean;
    retryAfter?: number;
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
export declare const createRateLimitResponse: (info: RateLimitInfo) => ApiResponse<never>;
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
export declare const parseQueryParams: (req: Request) => QueryParams;
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
export declare const validateQueryParams: (params: QueryParams, constraints: {
    maxPageSize?: number;
    allowedFilters?: string[];
    allowedSortFields?: string[];
    allowedFields?: string[];
}) => {
    valid: boolean;
    errors: string[];
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
export declare const sanitizeQueryParams: (params: QueryParams) => QueryParams;
declare const _default: {
    extractPaginationParams: (req: Request, defaultPageSize?: number, maxPageSize?: number) => PaginationParams;
    buildPaginationMetadata: (totalItems: number, params: PaginationParams) => PaginationMetadata;
    createPaginatedResponse: <T>(data: T[], totalItems: number, params: PaginationParams, baseUrl?: string) => PaginatedResponse<T>;
    encodeCursor: (value: any) => string;
    decodeCursor: (cursor: string) => any;
    extractCursorPaginationParams: (req: Request, defaultLimit?: number, maxLimit?: number) => CursorPaginationParams;
    createCursorPaginatedResponse: <T>(data: T[], limit: number, getCursorValue: (item: T) => any) => CursorPaginationResponse<T>;
    generatePaginationLinkHeader: (baseUrl: string, metadata: PaginationMetadata) => string;
    parseFilterCriteria: (req: Request) => FilterCriteria[];
    buildWhereClause: (filters: FilterCriteria[]) => Record<string, any>;
    parseSortCriteria: (req: Request) => SortCriteria[];
    buildOrderByClause: (sort: SortCriteria[]) => Array<[string, string]>;
    validateFilterCriteria: (filters: FilterCriteria[], allowedFields: string[], allowedOperators?: FilterCriteria["operator"][]) => {
        valid: boolean;
        errors: string[];
    };
    validateSortCriteria: (sort: SortCriteria[], allowedFields: string[]) => {
        valid: boolean;
        errors: string[];
    };
    createSuccessResponse: <T>(data: T, metadata?: Record<string, any>) => ApiResponse<T>;
    createErrorResponse: (code: string, message: string, field?: string, details?: any) => ApiResponse<never>;
    createValidationErrorResponse: (errors: ValidationError[]) => ApiResponse<never>;
    createResourceResponse: <T>(data: T, links: HateoasLink[], metadata?: Record<string, any>) => ResourceResponse<T>;
    selectFields: (data: any, fields: string[]) => any;
    extractFieldSelection: (req: Request) => string[] | undefined;
    mapStatusCodeToError: (statusCode: number) => {
        code: string;
        message: string;
    };
    createDetailedErrorResponse: (error: Error, includeStack?: boolean) => ApiResponse<never>;
    errorHandlerMiddleware: (error: Error, req: Request, res: Response, next: NextFunction) => void;
    createApiError: (code: string, message: string, statusCode: number) => Error;
    asyncErrorHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
    extractApiVersionFromRequest: (req: Request, defaultVersion?: string) => string;
    validateApiVersionFromMetadata: (version: string, supportedVersions: ApiVersionMetadata[]) => ApiVersionMetadata | null;
    apiVersionDeprecationMiddleware: (supportedVersions: ApiVersionMetadata[]) => (req: Request, res: Response, next: NextFunction) => any;
    createApiVersionMetadata: (version: string, status: ApiVersionMetadata["status"], options?: Partial<ApiVersionMetadata>) => ApiVersionMetadata;
    extractBearerToken: (req: Request) => string | null;
    extractApiKey: (req: Request) => string | null;
    validatePermissionScopes: (requiredScopes: string[], userScopes: string[], requireAll?: boolean) => boolean;
    requireScopes: (requiredScopes: string[], requireAll?: boolean) => (req: Request, res: Response, next: NextFunction) => any;
    generateRateLimitHeaders: (info: RateLimitInfo) => Record<string, string>;
    calculateRateLimitReset: (windowMs: number, startTime?: number) => number;
    checkRateLimitExceeded: (currentCount: number, limit: number, resetTime: number) => {
        exceeded: boolean;
        retryAfter?: number;
    };
    createRateLimitResponse: (info: RateLimitInfo) => ApiResponse<never>;
    parseQueryParams: (req: Request) => QueryParams;
    validateQueryParams: (params: QueryParams, constraints: {
        maxPageSize?: number;
        allowedFilters?: string[];
        allowedSortFields?: string[];
        allowedFields?: string[];
    }) => {
        valid: boolean;
        errors: string[];
    };
    sanitizeQueryParams: (params: QueryParams) => QueryParams;
};
export default _default;
//# sourceMappingURL=network-api-design-kit.d.ts.map