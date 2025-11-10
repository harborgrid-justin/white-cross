"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeQueryParams = exports.validateQueryParams = exports.parseQueryParams = exports.createRateLimitResponse = exports.checkRateLimitExceeded = exports.calculateRateLimitReset = exports.generateRateLimitHeaders = exports.requireScopes = exports.validatePermissionScopes = exports.extractApiKey = exports.extractBearerToken = exports.createApiVersionMetadata = exports.apiVersionDeprecationMiddleware = exports.validateApiVersionFromMetadata = exports.extractApiVersionFromRequest = exports.asyncErrorHandler = exports.createApiError = exports.errorHandlerMiddleware = exports.createDetailedErrorResponse = exports.mapStatusCodeToError = exports.extractFieldSelection = exports.selectFields = exports.createResourceResponse = exports.createValidationErrorResponse = exports.createErrorResponse = exports.createSuccessResponse = exports.validateSortCriteria = exports.validateFilterCriteria = exports.buildOrderByClause = exports.parseSortCriteria = exports.buildWhereClause = exports.parseFilterCriteria = exports.generatePaginationLinkHeader = exports.createCursorPaginatedResponse = exports.extractCursorPaginationParams = exports.decodeCursor = exports.encodeCursor = exports.createPaginatedResponse = exports.buildPaginationMetadata = exports.extractPaginationParams = void 0;
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
const extractPaginationParams = (req, defaultPageSize = 20, maxPageSize = 100) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const requestedSize = parseInt(req.query.pageSize, 10) || defaultPageSize;
    const pageSize = Math.min(Math.max(1, requestedSize), maxPageSize);
    const offset = (page - 1) * pageSize;
    return {
        page,
        pageSize,
        offset,
        limit: pageSize,
    };
};
exports.extractPaginationParams = extractPaginationParams;
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
const buildPaginationMetadata = (totalItems, params) => {
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
exports.buildPaginationMetadata = buildPaginationMetadata;
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
const createPaginatedResponse = (data, totalItems, params, baseUrl) => {
    const pagination = (0, exports.buildPaginationMetadata)(totalItems, params);
    const response = {
        data,
        pagination,
    };
    if (baseUrl) {
        const buildUrl = (page) => `${baseUrl}?page=${page}&pageSize=${params.pageSize}`;
        response.links = {
            self: buildUrl(params.page),
            first: buildUrl(1),
            last: buildUrl(pagination.totalPages),
            next: pagination.hasNextPage ? buildUrl(pagination.nextPage) : undefined,
            previous: pagination.hasPreviousPage ? buildUrl(pagination.previousPage) : undefined,
        };
    }
    return response;
};
exports.createPaginatedResponse = createPaginatedResponse;
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
const encodeCursor = (value) => {
    const json = JSON.stringify(value);
    return Buffer.from(json).toString('base64url');
};
exports.encodeCursor = encodeCursor;
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
const decodeCursor = (cursor) => {
    try {
        const json = Buffer.from(cursor, 'base64url').toString('utf-8');
        return JSON.parse(json);
    }
    catch (error) {
        throw new Error('Invalid cursor format');
    }
};
exports.decodeCursor = decodeCursor;
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
const extractCursorPaginationParams = (req, defaultLimit = 20, maxLimit = 100) => {
    const cursor = req.query.cursor;
    const requestedLimit = parseInt(req.query.limit, 10) || defaultLimit;
    const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
    const direction = req.query.direction || 'forward';
    return { cursor, limit, direction };
};
exports.extractCursorPaginationParams = extractCursorPaginationParams;
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
const createCursorPaginatedResponse = (data, limit, getCursorValue) => {
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    return {
        data: items,
        pagination: {
            nextCursor: hasMore ? (0, exports.encodeCursor)(getCursorValue(items[items.length - 1])) : undefined,
            previousCursor: items.length > 0 ? (0, exports.encodeCursor)(getCursorValue(items[0])) : undefined,
            hasMore,
            limit,
        },
    };
};
exports.createCursorPaginatedResponse = createCursorPaginatedResponse;
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
const generatePaginationLinkHeader = (baseUrl, metadata) => {
    const links = [];
    const buildUrl = (page) => `<${baseUrl}?page=${page}&pageSize=${metadata.pageSize}>`;
    links.push(`${buildUrl(1)}; rel="first"`);
    links.push(`${buildUrl(metadata.totalPages)}; rel="last"`);
    if (metadata.hasPreviousPage) {
        links.push(`${buildUrl(metadata.previousPage)}; rel="prev"`);
    }
    if (metadata.hasNextPage) {
        links.push(`${buildUrl(metadata.nextPage)}; rel="next"`);
    }
    return links.join(', ');
};
exports.generatePaginationLinkHeader = generatePaginationLinkHeader;
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
const parseFilterCriteria = (req) => {
    const filters = [];
    const filterParams = req.query.filter;
    if (!filterParams || typeof filterParams !== 'object') {
        return filters;
    }
    Object.entries(filterParams).forEach(([field, operators]) => {
        if (typeof operators === 'object' && operators !== null) {
            Object.entries(operators).forEach(([operator, value]) => {
                filters.push({
                    field,
                    operator: operator,
                    value,
                    logicalOperator: 'AND',
                });
            });
        }
    });
    return filters;
};
exports.parseFilterCriteria = parseFilterCriteria;
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
const buildWhereClause = (filters) => {
    const where = {};
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
exports.buildWhereClause = buildWhereClause;
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
const parseSortCriteria = (req) => {
    const sortParam = req.query.sort;
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
exports.parseSortCriteria = parseSortCriteria;
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
const buildOrderByClause = (sort) => {
    return sort.map(criteria => [
        criteria.field,
        criteria.order.toUpperCase(),
    ]);
};
exports.buildOrderByClause = buildOrderByClause;
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
const validateFilterCriteria = (filters, allowedFields, allowedOperators) => {
    const errors = [];
    const defaultOperators = [
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
exports.validateFilterCriteria = validateFilterCriteria;
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
const validateSortCriteria = (sort, allowedFields) => {
    const errors = [];
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
exports.validateSortCriteria = validateSortCriteria;
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
const createSuccessResponse = (data, metadata) => {
    return {
        success: true,
        data,
        metadata,
        timestamp: new Date().toISOString(),
    };
};
exports.createSuccessResponse = createSuccessResponse;
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
const createErrorResponse = (code, message, field, details) => {
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
exports.createErrorResponse = createErrorResponse;
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
const createValidationErrorResponse = (errors) => {
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
exports.createValidationErrorResponse = createValidationErrorResponse;
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
const createResourceResponse = (data, links, metadata) => {
    return {
        data,
        links,
        metadata,
    };
};
exports.createResourceResponse = createResourceResponse;
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
const selectFields = (data, fields) => {
    if (Array.isArray(data)) {
        return data.map(item => (0, exports.selectFields)(item, fields));
    }
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const result = {};
    fields.forEach(field => {
        const parts = field.split('.');
        if (parts.length === 1) {
            if (field in data) {
                result[field] = data[field];
            }
        }
        else {
            // Handle nested field selection
            const [parent, ...rest] = parts;
            if (parent in data) {
                result[parent] = (0, exports.selectFields)(data[parent], [rest.join('.')]);
            }
        }
    });
    return result;
};
exports.selectFields = selectFields;
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
const extractFieldSelection = (req) => {
    const fieldsParam = req.query.fields;
    if (!fieldsParam) {
        return undefined;
    }
    return fieldsParam.split(',').map(f => f.trim()).filter(Boolean);
};
exports.extractFieldSelection = extractFieldSelection;
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
const mapStatusCodeToError = (statusCode) => {
    const errorMap = {
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
exports.mapStatusCodeToError = mapStatusCodeToError;
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
const createDetailedErrorResponse = (error, includeStack = false) => {
    return {
        success: false,
        error: {
            code: error.code || 'INTERNAL_ERROR',
            message: error.message,
            stack: includeStack ? error.stack : undefined,
        },
        timestamp: new Date().toISOString(),
    };
};
exports.createDetailedErrorResponse = createDetailedErrorResponse;
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
const errorHandlerMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;
    const errorInfo = (0, exports.mapStatusCodeToError)(statusCode);
    const response = (0, exports.createErrorResponse)(error.code || errorInfo.code, error.message || errorInfo.message, error.field, error.details);
    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.error.stack = error.stack;
    }
    res.status(statusCode).json(response);
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
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
const createApiError = (code, message, statusCode) => {
    const error = new Error(message);
    error.code = code;
    error.statusCode = statusCode;
    return error;
};
exports.createApiError = createApiError;
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
const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
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
const extractApiVersionFromRequest = (req, defaultVersion = 'v1') => {
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
    const versionHeader = req.headers['api-version'];
    if (versionHeader) {
        return versionHeader.startsWith('v') ? versionHeader : `v${versionHeader}`;
    }
    return defaultVersion;
};
exports.extractApiVersionFromRequest = extractApiVersionFromRequest;
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
const validateApiVersionFromMetadata = (version, supportedVersions) => {
    return supportedVersions.find(v => v.version === version) || null;
};
exports.validateApiVersionFromMetadata = validateApiVersionFromMetadata;
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
const apiVersionDeprecationMiddleware = (supportedVersions) => {
    return (req, res, next) => {
        const version = (0, exports.extractApiVersionFromRequest)(req);
        const metadata = (0, exports.validateApiVersionFromMetadata)(version, supportedVersions);
        if (!metadata) {
            return res.status(400).json((0, exports.createErrorResponse)('UNSUPPORTED_VERSION', `API version ${version} is not supported`));
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
            return res.status(410).json((0, exports.createErrorResponse)('VERSION_SUNSET', `API version ${version} has been sunset`, undefined, { migrationGuide: metadata.migrationGuide }));
        }
        req.apiVersion = version;
        next();
    };
};
exports.apiVersionDeprecationMiddleware = apiVersionDeprecationMiddleware;
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
const createApiVersionMetadata = (version, status, options) => {
    return {
        version,
        status,
        deprecationDate: options?.deprecationDate,
        sunsetDate: options?.sunsetDate,
        migrationGuide: options?.migrationGuide,
    };
};
exports.createApiVersionMetadata = createApiVersionMetadata;
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
const extractBearerToken = (req) => {
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
exports.extractBearerToken = extractBearerToken;
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
const extractApiKey = (req) => {
    // Check X-API-Key header
    const headerKey = req.headers['x-api-key'];
    if (headerKey) {
        return headerKey;
    }
    // Check query parameter
    const queryKey = req.query.apiKey || req.query.api_key;
    if (queryKey) {
        return queryKey;
    }
    return null;
};
exports.extractApiKey = extractApiKey;
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
const validatePermissionScopes = (requiredScopes, userScopes, requireAll = true) => {
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
    }
    else {
        return requiredScopes.some(scope => userScopes.includes(scope));
    }
};
exports.validatePermissionScopes = validatePermissionScopes;
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
const requireScopes = (requiredScopes, requireAll = true) => {
    return (req, res, next) => {
        const userScopes = req.user?.scopes || req.scopes || [];
        if (!(0, exports.validatePermissionScopes)(requiredScopes, userScopes, requireAll)) {
            return res.status(403).json((0, exports.createErrorResponse)('FORBIDDEN', 'Insufficient permissions', undefined, { requiredScopes, userScopes }));
        }
        next();
    };
};
exports.requireScopes = requireScopes;
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
const generateRateLimitHeaders = (info) => {
    const headers = {
        'X-RateLimit-Limit': info.limit.toString(),
        'X-RateLimit-Remaining': info.remaining.toString(),
        'X-RateLimit-Reset': new Date(info.reset).toISOString(),
    };
    if (info.retryAfter !== undefined) {
        headers['Retry-After'] = info.retryAfter.toString();
    }
    return headers;
};
exports.generateRateLimitHeaders = generateRateLimitHeaders;
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
const calculateRateLimitReset = (windowMs, startTime) => {
    const start = startTime || Date.now();
    return start + windowMs;
};
exports.calculateRateLimitReset = calculateRateLimitReset;
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
const checkRateLimitExceeded = (currentCount, limit, resetTime) => {
    const exceeded = currentCount >= limit;
    const retryAfter = exceeded ? Math.ceil((resetTime - Date.now()) / 1000) : undefined;
    return { exceeded, retryAfter };
};
exports.checkRateLimitExceeded = checkRateLimitExceeded;
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
const createRateLimitResponse = (info) => {
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
exports.createRateLimitResponse = createRateLimitResponse;
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
const parseQueryParams = (req) => {
    return {
        filters: req.query.filter,
        sort: req.query.sort,
        page: parseInt(req.query.page, 10) || undefined,
        pageSize: parseInt(req.query.pageSize, 10) || undefined,
        cursor: req.query.cursor,
        fields: (0, exports.extractFieldSelection)(req),
        include: req.query.include ? req.query.include.split(',') : undefined,
        expand: req.query.expand ? req.query.expand.split(',') : undefined,
    };
};
exports.parseQueryParams = parseQueryParams;
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
const validateQueryParams = (params, constraints) => {
    const errors = [];
    if (params.pageSize && constraints.maxPageSize && params.pageSize > constraints.maxPageSize) {
        errors.push(`pageSize cannot exceed ${constraints.maxPageSize}`);
    }
    if (params.filters && constraints.allowedFilters) {
        const filterFields = Object.keys(params.filters);
        const invalidFilters = filterFields.filter(f => !constraints.allowedFilters.includes(f));
        if (invalidFilters.length > 0) {
            errors.push(`Invalid filter fields: ${invalidFilters.join(', ')}`);
        }
    }
    if (params.sort && constraints.allowedSortFields) {
        const sortFields = Array.isArray(params.sort) ? params.sort : [params.sort];
        const cleanedFields = sortFields.map(f => f.replace(/^-/, ''));
        const invalidSorts = cleanedFields.filter(f => !constraints.allowedSortFields.includes(f));
        if (invalidSorts.length > 0) {
            errors.push(`Invalid sort fields: ${invalidSorts.join(', ')}`);
        }
    }
    if (params.fields && constraints.allowedFields) {
        const invalidFields = params.fields.filter(f => !constraints.allowedFields.includes(f));
        if (invalidFields.length > 0) {
            errors.push(`Invalid fields: ${invalidFields.join(', ')}`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateQueryParams = validateQueryParams;
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
const sanitizeQueryParams = (params) => {
    const sanitizeValue = (value) => {
        if (typeof value === 'string') {
            // Remove potentially dangerous characters
            return value.replace(/[<>'"`;\\]/g, '');
        }
        if (Array.isArray(value)) {
            return value.map(sanitizeValue);
        }
        if (typeof value === 'object' && value !== null) {
            const sanitized = {};
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
exports.sanitizeQueryParams = sanitizeQueryParams;
exports.default = {
    // Pagination Helpers
    extractPaginationParams: exports.extractPaginationParams,
    buildPaginationMetadata: exports.buildPaginationMetadata,
    createPaginatedResponse: exports.createPaginatedResponse,
    encodeCursor: exports.encodeCursor,
    decodeCursor: exports.decodeCursor,
    extractCursorPaginationParams: exports.extractCursorPaginationParams,
    createCursorPaginatedResponse: exports.createCursorPaginatedResponse,
    generatePaginationLinkHeader: exports.generatePaginationLinkHeader,
    // Filtering & Sorting
    parseFilterCriteria: exports.parseFilterCriteria,
    buildWhereClause: exports.buildWhereClause,
    parseSortCriteria: exports.parseSortCriteria,
    buildOrderByClause: exports.buildOrderByClause,
    validateFilterCriteria: exports.validateFilterCriteria,
    validateSortCriteria: exports.validateSortCriteria,
    // Response Formatting
    createSuccessResponse: exports.createSuccessResponse,
    createErrorResponse: exports.createErrorResponse,
    createValidationErrorResponse: exports.createValidationErrorResponse,
    createResourceResponse: exports.createResourceResponse,
    selectFields: exports.selectFields,
    extractFieldSelection: exports.extractFieldSelection,
    // Error Handling
    mapStatusCodeToError: exports.mapStatusCodeToError,
    createDetailedErrorResponse: exports.createDetailedErrorResponse,
    errorHandlerMiddleware: exports.errorHandlerMiddleware,
    createApiError: exports.createApiError,
    asyncErrorHandler: exports.asyncErrorHandler,
    // API Versioning
    extractApiVersionFromRequest: exports.extractApiVersionFromRequest,
    validateApiVersionFromMetadata: exports.validateApiVersionFromMetadata,
    apiVersionDeprecationMiddleware: exports.apiVersionDeprecationMiddleware,
    createApiVersionMetadata: exports.createApiVersionMetadata,
    // Authentication & Authorization
    extractBearerToken: exports.extractBearerToken,
    extractApiKey: exports.extractApiKey,
    validatePermissionScopes: exports.validatePermissionScopes,
    requireScopes: exports.requireScopes,
    // Rate Limiting
    generateRateLimitHeaders: exports.generateRateLimitHeaders,
    calculateRateLimitReset: exports.calculateRateLimitReset,
    checkRateLimitExceeded: exports.checkRateLimitExceeded,
    createRateLimitResponse: exports.createRateLimitResponse,
    // Query Parsing
    parseQueryParams: exports.parseQueryParams,
    validateQueryParams: exports.validateQueryParams,
    sanitizeQueryParams: exports.sanitizeQueryParams,
};
//# sourceMappingURL=network-api-design-kit.js.map