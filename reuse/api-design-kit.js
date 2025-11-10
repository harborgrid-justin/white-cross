"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isServerErrorStatus = exports.isClientErrorStatus = exports.isRedirectStatus = exports.isSuccessStatus = exports.mapErrorToStatusCode = exports.createDegradedFallback = exports.createDefaultFallback = exports.createCacheFallback = exports.executeWithFallback = exports.calculateBackoffDelay = exports.createRetryPolicy = exports.executeWithRetry = exports.shouldAllowRequest = exports.createCircuitBreaker = exports.getLatestVersion = exports.isVersionSupported = exports.extractVersionFromHeader = exports.extractVersionFromPath = exports.embedHateoasLinks = exports.generatePaginationLinks = exports.generateResourceLinks = exports.createPaginatedResponse = exports.createErrorResponse = exports.createSuccessResponse = exports.sanitizeSearchQuery = exports.createFullTextSearch = exports.buildSearchQuery = exports.validateSort = exports.parseSortString = exports.buildSortQuery = exports.combineFilters = exports.validateFilter = exports.parseFilterString = exports.buildFilterQuery = exports.validatePaginationParams = exports.calculateOffset = exports.decodePaginationCursor = exports.encodePaginationCursor = exports.createCursorPagination = exports.createOffsetPagination = void 0;
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
const createOffsetPagination = (params, totalItems) => {
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
exports.createOffsetPagination = createOffsetPagination;
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
const createCursorPagination = (currentCursor, limit, hasMore, nextCursor) => {
    return {
        pageSize: limit,
        hasNextPage: hasMore,
        nextCursor: nextCursor || undefined,
        previousCursor: currentCursor || undefined,
    };
};
exports.createCursorPagination = createCursorPagination;
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
const encodePaginationCursor = (cursorData) => {
    try {
        const jsonStr = JSON.stringify(cursorData);
        return Buffer.from(jsonStr).toString('base64');
    }
    catch (error) {
        throw new Error(`Failed to encode pagination cursor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.encodePaginationCursor = encodePaginationCursor;
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
const decodePaginationCursor = (cursor) => {
    if (!cursor || typeof cursor !== 'string') {
        throw new Error('Invalid pagination cursor: cursor must be a non-empty string');
    }
    try {
        const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
        const parsed = JSON.parse(jsonStr);
        if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Invalid pagination cursor: decoded value is not an object');
        }
        return parsed;
    }
    catch (error) {
        if (error instanceof Error && error.message.startsWith('Invalid pagination cursor:')) {
            throw error;
        }
        throw new Error(`Invalid pagination cursor: ${error instanceof Error ? error.message : 'decode failed'}`);
    }
};
exports.decodePaginationCursor = decodePaginationCursor;
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
const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};
exports.calculateOffset = calculateOffset;
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
const validatePaginationParams = (params, maxLimit = 100, defaultLimit = 20) => {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(maxLimit, Math.max(1, params.limit || defaultLimit));
    const offset = params.offset !== undefined ? params.offset : (0, exports.calculateOffset)(page, limit);
    return { page, limit, offset };
};
exports.validatePaginationParams = validatePaginationParams;
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
const buildFilterQuery = (filters) => {
    const query = {};
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
exports.buildFilterQuery = buildFilterQuery;
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
const parseFilterString = (filterString) => {
    if (!filterString || typeof filterString !== 'string') {
        throw new Error('Invalid filter string: must be a non-empty string');
    }
    const parts = filterString.split(':');
    if (parts.length < 3) {
        throw new Error('Invalid filter string format: expected "field:operator:value"');
    }
    const [field, operator, ...valueParts] = parts;
    const valueStr = valueParts.join(':');
    if (!field || !operator || !valueStr) {
        throw new Error('Invalid filter string: field, operator, and value are required');
    }
    const validOperators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'like', 'between'];
    if (!validOperators.includes(operator)) {
        throw new Error(`Invalid filter operator: ${operator}. Must be one of: ${validOperators.join(', ')}`);
    }
    let value = valueStr;
    if (operator === 'in' || operator === 'nin') {
        value = valueStr.split(',').map(v => v.trim()).filter(v => v.length > 0);
    }
    else if (operator === 'between') {
        const numValues = valueStr.split(',').map(v => parseFloat(v.trim()));
        if (numValues.length !== 2 || numValues.some(isNaN)) {
            throw new Error('Invalid "between" filter: requires exactly two numeric values');
        }
        value = numValues;
    }
    else if (!isNaN(Number(valueStr))) {
        value = Number(valueStr);
    }
    else if (valueStr === 'true' || valueStr === 'false') {
        value = valueStr === 'true';
    }
    return {
        field,
        operator: operator,
        value,
    };
};
exports.parseFilterString = parseFilterString;
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
const validateFilter = (filter, allowedFields, allowedOperators) => {
    if (!allowedFields.includes(filter.field)) {
        return false;
    }
    if (allowedOperators && !allowedOperators.includes(filter.operator)) {
        return false;
    }
    return true;
};
exports.validateFilter = validateFilter;
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
const combineFilters = (queries) => {
    if (queries.length === 0)
        return {};
    if (queries.length === 1)
        return queries[0];
    return { $and: queries };
};
exports.combineFilters = combineFilters;
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
const buildSortQuery = (sortOptions) => {
    const sort = {};
    sortOptions.forEach((option) => {
        sort[option.field] = option.order === 'asc' ? 1 : -1;
    });
    return sort;
};
exports.buildSortQuery = buildSortQuery;
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
const parseSortString = (sortString) => {
    return sortString.split(',').map((field) => {
        const trimmed = field.trim();
        if (trimmed.startsWith('-')) {
            return { field: trimmed.substring(1), order: 'desc' };
        }
        return { field: trimmed, order: 'asc' };
    });
};
exports.parseSortString = parseSortString;
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
const validateSort = (sortOptions, allowedFields) => {
    return sortOptions.every((option) => allowedFields.includes(option.field));
};
exports.validateSort = validateSort;
// ============================================================================
// SEARCH UTILITIES
// ============================================================================
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
const buildSearchQuery = (options) => {
    const { query, fields, fuzzy = false, caseSensitive = false } = options;
    if (!query || typeof query !== 'string') {
        throw new Error('Invalid search query: must be a non-empty string');
    }
    if (!Array.isArray(fields) || fields.length === 0) {
        throw new Error('Invalid search fields: must be a non-empty array');
    }
    // Escape special regex characters to prevent regex injection
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchPattern = fuzzy ? `.*${escapedQuery}.*` : escapedQuery;
    const regexOptions = caseSensitive ? '' : 'i';
    const conditions = fields.map((field) => ({
        [field]: { $regex: searchPattern, $options: regexOptions },
    }));
    return { $or: conditions };
};
exports.buildSearchQuery = buildSearchQuery;
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
const createFullTextSearch = (searchText, weightedFields) => {
    if (!searchText || typeof searchText !== 'string') {
        throw new Error('Invalid search text: must be a non-empty string');
    }
    return {
        $text: { $search: searchText },
        score: { $meta: 'textScore' },
    };
};
exports.createFullTextSearch = createFullTextSearch;
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
const sanitizeSearchQuery = (query) => {
    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
exports.sanitizeSearchQuery = sanitizeSearchQuery;
// ============================================================================
// RESPONSE ENVELOPE UTILITIES
// ============================================================================
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
const createSuccessResponse = (data, metadata, links) => {
    return {
        success: true,
        data,
        ...(metadata && { metadata }),
        ...(links && { links }),
    };
};
exports.createSuccessResponse = createSuccessResponse;
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
const createErrorResponse = (errors, metadata) => {
    return {
        success: false,
        data: null,
        errors: Array.isArray(errors) ? errors : [errors],
        ...(metadata && { metadata }),
    };
};
exports.createErrorResponse = createErrorResponse;
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
const createPaginatedResponse = (items, pagination, links) => {
    return {
        success: true,
        data: items,
        metadata: { pagination },
        ...(links && { links }),
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
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
const generateResourceLinks = (baseUrl, resourceId, relations) => {
    const links = {
        self: `${baseUrl}/${resourceId}`,
    };
    if (relations) {
        relations.forEach((relation) => {
            links[relation] = `${baseUrl}/${resourceId}/${relation}`;
        });
    }
    return links;
};
exports.generateResourceLinks = generateResourceLinks;
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
const generatePaginationLinks = (baseUrl, pagination, queryParams) => {
    const buildUrl = (page) => {
        const params = new URLSearchParams({ ...queryParams, page: String(page) });
        return `${baseUrl}?${params.toString()}`;
    };
    const links = {
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
exports.generatePaginationLinks = generatePaginationLinks;
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
const embedHateoasLinks = (resource, links) => {
    return {
        ...resource,
        _links: links,
    };
};
exports.embedHateoasLinks = embedHateoasLinks;
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
const extractVersionFromPath = (path) => {
    const match = path.match(/\/v(\d+)\//);
    return match ? `v${match[1]}` : null;
};
exports.extractVersionFromPath = extractVersionFromPath;
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
const extractVersionFromHeader = (acceptHeader) => {
    const match = acceptHeader.match(/\.v(\d+)\+/);
    return match ? `v${match[1]}` : null;
};
exports.extractVersionFromHeader = extractVersionFromHeader;
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
const isVersionSupported = (version, supportedVersions) => {
    return supportedVersions.includes(version);
};
exports.isVersionSupported = isVersionSupported;
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
const getLatestVersion = (supportedVersions) => {
    return supportedVersions
        .map((v) => ({ version: v, number: parseInt(v.replace('v', '').split('.')[0]) }))
        .sort((a, b) => b.number - a.number)[0].version;
};
exports.getLatestVersion = getLatestVersion;
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
const createCircuitBreaker = (config) => {
    const state = {
        state: 'CLOSED',
        failures: 0,
        successes: 0,
        nextAttempt: Date.now(),
    };
    const execute = async (fn) => {
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
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), config.timeout)),
            ]);
            if (state.state === 'HALF_OPEN') {
                state.successes++;
                if (state.successes >= config.successThreshold) {
                    state.state = 'CLOSED';
                    state.failures = 0;
                }
            }
            return result;
        }
        catch (error) {
            state.failures++;
            if (state.state === 'HALF_OPEN') {
                state.state = 'OPEN';
                state.nextAttempt = Date.now() + config.resetTimeout;
            }
            else if (state.failures >= config.failureThreshold) {
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
exports.createCircuitBreaker = createCircuitBreaker;
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
const shouldAllowRequest = (state) => {
    if (state.state === 'CLOSED')
        return true;
    if (state.state === 'HALF_OPEN')
        return true;
    if (state.state === 'OPEN' && Date.now() >= state.nextAttempt)
        return true;
    return false;
};
exports.shouldAllowRequest = shouldAllowRequest;
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
const executeWithRetry = async (fn, policy) => {
    let lastError;
    for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt === policy.maxAttempts) {
                throw lastError;
            }
            const errorCode = error.code;
            if (policy.retryableErrors && errorCode && !policy.retryableErrors.includes(errorCode)) {
                throw lastError;
            }
            const delay = Math.min(policy.baseDelay * Math.pow(policy.backoffMultiplier, attempt - 1), policy.maxDelay);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    // This should never be reached due to the throw in the catch block, but TypeScript requires it
    throw lastError || new Error('Retry failed with unknown error');
};
exports.executeWithRetry = executeWithRetry;
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
const createRetryPolicy = (overrides) => {
    return {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 30000,
        backoffMultiplier: 2,
        ...overrides,
    };
};
exports.createRetryPolicy = createRetryPolicy;
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
const calculateBackoffDelay = (attempt, baseDelay, maxDelay, backoffMultiplier = 2) => {
    const exponentialDelay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, maxDelay);
};
exports.calculateBackoffDelay = calculateBackoffDelay;
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
const executeWithFallback = async (primaryFn, fallback) => {
    try {
        return await primaryFn();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Primary execution failed, using ${fallback.type} fallback:`, errorMessage);
        try {
            return await Promise.resolve(fallback.handler());
        }
        catch (fallbackError) {
            const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
            throw new Error(`Both primary and fallback execution failed. Primary: ${errorMessage}, Fallback: ${fallbackErrorMessage}`);
        }
    }
};
exports.executeWithFallback = executeWithFallback;
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
const createCacheFallback = (cacheHandler) => {
    return {
        type: 'cache',
        handler: cacheHandler,
    };
};
exports.createCacheFallback = createCacheFallback;
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
const createDefaultFallback = (defaultValue) => {
    return {
        type: 'default',
        handler: () => defaultValue,
    };
};
exports.createDefaultFallback = createDefaultFallback;
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
const createDegradedFallback = (degradedHandler) => {
    return {
        type: 'degraded',
        handler: degradedHandler,
    };
};
exports.createDegradedFallback = createDegradedFallback;
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
const mapErrorToStatusCode = (errorType) => {
    const errorMap = {
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
exports.mapErrorToStatusCode = mapErrorToStatusCode;
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
const isSuccessStatus = (statusCode) => {
    return statusCode >= 200 && statusCode < 300;
};
exports.isSuccessStatus = isSuccessStatus;
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
const isRedirectStatus = (statusCode) => {
    return statusCode >= 300 && statusCode < 400;
};
exports.isRedirectStatus = isRedirectStatus;
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
const isClientErrorStatus = (statusCode) => {
    return statusCode >= 400 && statusCode < 500;
};
exports.isClientErrorStatus = isClientErrorStatus;
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
const isServerErrorStatus = (statusCode) => {
    return statusCode >= 500 && statusCode < 600;
};
exports.isServerErrorStatus = isServerErrorStatus;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Pagination
    createOffsetPagination: exports.createOffsetPagination,
    createCursorPagination: exports.createCursorPagination,
    encodePaginationCursor: exports.encodePaginationCursor,
    decodePaginationCursor: exports.decodePaginationCursor,
    calculateOffset: exports.calculateOffset,
    validatePaginationParams: exports.validatePaginationParams,
    // Filtering
    buildFilterQuery: exports.buildFilterQuery,
    parseFilterString: exports.parseFilterString,
    validateFilter: exports.validateFilter,
    combineFilters: exports.combineFilters,
    // Sorting
    buildSortQuery: exports.buildSortQuery,
    parseSortString: exports.parseSortString,
    validateSort: exports.validateSort,
    // Search
    buildSearchQuery: exports.buildSearchQuery,
    createFullTextSearch: exports.createFullTextSearch,
    sanitizeSearchQuery: exports.sanitizeSearchQuery,
    // Response envelopes
    createSuccessResponse: exports.createSuccessResponse,
    createErrorResponse: exports.createErrorResponse,
    createPaginatedResponse: exports.createPaginatedResponse,
    // HATEOAS
    generateResourceLinks: exports.generateResourceLinks,
    generatePaginationLinks: exports.generatePaginationLinks,
    embedHateoasLinks: exports.embedHateoasLinks,
    // Versioning
    extractVersionFromPath: exports.extractVersionFromPath,
    extractVersionFromHeader: exports.extractVersionFromHeader,
    isVersionSupported: exports.isVersionSupported,
    getLatestVersion: exports.getLatestVersion,
    // Circuit breaker
    createCircuitBreaker: exports.createCircuitBreaker,
    shouldAllowRequest: exports.shouldAllowRequest,
    // Retry policy
    executeWithRetry: exports.executeWithRetry,
    createRetryPolicy: exports.createRetryPolicy,
    calculateBackoffDelay: exports.calculateBackoffDelay,
    // Fallback strategies
    executeWithFallback: exports.executeWithFallback,
    createCacheFallback: exports.createCacheFallback,
    createDefaultFallback: exports.createDefaultFallback,
    createDegradedFallback: exports.createDegradedFallback,
    // Status codes
    mapErrorToStatusCode: exports.mapErrorToStatusCode,
    isSuccessStatus: exports.isSuccessStatus,
    isRedirectStatus: exports.isRedirectStatus,
    isClientErrorStatus: exports.isClientErrorStatus,
    isServerErrorStatus: exports.isServerErrorStatus,
};
//# sourceMappingURL=api-design-kit.js.map