"use strict";
/**
 * LOC: PAG1234567
 * File: /reuse/pagination-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and routes
 *   - Database query builders
 *   - GraphQL resolvers
 *   - REST API middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwaggerPaginatedResponseSchema = exports.getSwaggerPaginationParams = exports.parseGraphQLPaginationArgs = exports.createGraphQLConnection = exports.validatePaginationParams = exports.formatCursorResponse = exports.formatPaginatedResponse = exports.calculateVirtualScrollRange = exports.formatInfiniteScrollResponse = exports.estimateTotalCount = exports.shouldSkipTotalCount = exports.formatSequelizeResult = exports.createSequelizePaginationOptions = exports.convertSortToSequelizeOrder = exports.parseSortQuery = exports.parsePaginationQuery = exports.generateCursorLinks = exports.generatePaginationLinks = exports.createPaginationMetadata = exports.sanitizeLimit = exports.sanitizePageNumber = exports.extractKeysetValues = exports.buildKeysetWhereClause = exports.createKeysetPagination = exports.hasMoreCursorResults = exports.createCursorPagination = exports.parseCursor = exports.createCursorFromItem = exports.decodeCursor = exports.encodeCursor = exports.hasPreviousPage = exports.hasNextPage = exports.createOffsetPagination = exports.calculateTotalPages = exports.calculatePageFromOffset = exports.calculateOffset = void 0;
// ============================================================================
// OFFSET-BASED PAGINATION
// ============================================================================
/**
 * Calculates offset from page number and limit.
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {number} Calculated offset
 *
 * @example
 * ```typescript
 * const offset = calculateOffset(3, 20);
 * // Result: 40 (skip first 2 pages = 40 items)
 * ```
 */
const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};
exports.calculateOffset = calculateOffset;
/**
 * Calculates page number from offset and limit.
 *
 * @param {number} offset - Current offset
 * @param {number} limit - Items per page
 * @returns {number} Calculated page number (1-indexed)
 *
 * @example
 * ```typescript
 * const page = calculatePageFromOffset(40, 20);
 * // Result: 3
 * ```
 */
const calculatePageFromOffset = (offset, limit) => {
    return Math.floor(offset / limit) + 1;
};
exports.calculatePageFromOffset = calculatePageFromOffset;
/**
 * Calculates total number of pages.
 *
 * @param {number} totalItems - Total number of items
 * @param {number} limit - Items per page
 * @returns {number} Total pages
 *
 * @example
 * ```typescript
 * const totalPages = calculateTotalPages(95, 20);
 * // Result: 5 (pages needed for 95 items with 20 per page)
 * ```
 */
const calculateTotalPages = (totalItems, limit) => {
    return Math.ceil(totalItems / limit);
};
exports.calculateTotalPages = calculateTotalPages;
/**
 * Creates offset-based pagination parameters from query.
 *
 * @param {number} [page] - Page number (default: 1)
 * @param {number} [limit] - Items per page (default: 20)
 * @returns {object} Offset and limit for database query
 *
 * @example
 * ```typescript
 * const params = createOffsetPagination(3, 25);
 * // Result: { offset: 50, limit: 25 }
 *
 * // Use with Sequelize:
 * const students = await Student.findAll({ ...params });
 * ```
 */
const createOffsetPagination = (page = 1, limit = 20) => {
    return {
        offset: (0, exports.calculateOffset)(page, limit),
        limit,
    };
};
exports.createOffsetPagination = createOffsetPagination;
/**
 * Checks if a next page exists based on current data.
 *
 * @param {number} currentPage - Current page number
 * @param {number} totalItems - Total number of items
 * @param {number} limit - Items per page
 * @returns {boolean} True if next page exists
 *
 * @example
 * ```typescript
 * const hasNext = hasNextPage(2, 100, 20);
 * // Result: true (page 2 of 5)
 *
 * const hasNext2 = hasNextPage(5, 100, 20);
 * // Result: false (last page)
 * ```
 */
const hasNextPage = (currentPage, totalItems, limit) => {
    const totalPages = (0, exports.calculateTotalPages)(totalItems, limit);
    return currentPage < totalPages;
};
exports.hasNextPage = hasNextPage;
/**
 * Checks if a previous page exists.
 *
 * @param {number} currentPage - Current page number
 * @returns {boolean} True if previous page exists
 *
 * @example
 * ```typescript
 * hasPreviousPage(1); // false
 * hasPreviousPage(2); // true
 * hasPreviousPage(5); // true
 * ```
 */
const hasPreviousPage = (currentPage) => {
    return currentPage > 1;
};
exports.hasPreviousPage = hasPreviousPage;
// ============================================================================
// CURSOR-BASED PAGINATION
// ============================================================================
/**
 * Encodes a cursor from an ID (Base64).
 *
 * @param {string | number} id - Item ID to encode
 * @returns {string} Base64 encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor('user_12345');
 * // Result: 'dXNlcl8xMjM0NQ=='
 * ```
 */
const encodeCursor = (id) => {
    return Buffer.from(String(id)).toString('base64');
};
exports.encodeCursor = encodeCursor;
/**
 * Decodes a cursor to retrieve the ID.
 *
 * @param {string} cursor - Base64 encoded cursor
 * @returns {string} Decoded ID
 *
 * @example
 * ```typescript
 * const id = decodeCursor('dXNlcl8xMjM0NQ==');
 * // Result: 'user_12345'
 * ```
 */
const decodeCursor = (cursor) => {
    return Buffer.from(cursor, 'base64').toString('utf-8');
};
exports.decodeCursor = decodeCursor;
/**
 * Creates cursor from object with timestamp and ID.
 *
 * @param {object} item - Item with id and createdAt fields
 * @returns {string} Encoded cursor
 *
 * @example
 * ```typescript
 * const item = { id: '123', createdAt: new Date('2024-01-15') };
 * const cursor = createCursorFromItem(item);
 * // Result: Base64 encoded "123:2024-01-15T00:00:00.000Z"
 * ```
 */
const createCursorFromItem = (item) => {
    const cursorData = `${item.id}:${item.createdAt?.toISOString() || Date.now()}`;
    return (0, exports.encodeCursor)(cursorData);
};
exports.createCursorFromItem = createCursorFromItem;
/**
 * Parses cursor into ID and timestamp components.
 *
 * @param {string} cursor - Encoded cursor
 * @returns {object} Parsed cursor with id and timestamp
 *
 * @example
 * ```typescript
 * const parsed = parseCursor('encoded_cursor_here');
 * // Result: { id: '123', timestamp: '2024-01-15T00:00:00.000Z' }
 * ```
 */
const parseCursor = (cursor) => {
    const decoded = (0, exports.decodeCursor)(cursor);
    const [id, timestamp] = decoded.split(':');
    return { id, timestamp };
};
exports.parseCursor = parseCursor;
/**
 * Creates cursor-based pagination query parameters.
 *
 * @param {CursorPaginationParams} params - Cursor pagination parameters
 * @returns {object} Query parameters for cursor pagination
 *
 * @example
 * ```typescript
 * const query = createCursorPagination({
 *   cursor: 'abc123',
 *   limit: 25,
 *   direction: 'forward'
 * });
 * // Use with database: WHERE id > decoded_cursor LIMIT 25
 * ```
 */
const createCursorPagination = (params) => {
    return {
        decodedCursor: params.cursor ? (0, exports.decodeCursor)(params.cursor) : undefined,
        limit: params.limit,
        direction: params.direction || 'forward',
    };
};
exports.createCursorPagination = createCursorPagination;
/**
 * Determines if more items exist after cursor.
 *
 * @param {number} fetchedCount - Number of items fetched
 * @param {number} requestedLimit - Requested limit
 * @returns {boolean} True if more items exist
 *
 * @example
 * ```typescript
 * // Requested 20, got 20 -> likely more exist
 * hasMoreCursorResults(20, 20); // true
 *
 * // Requested 20, got 15 -> no more
 * hasMoreCursorResults(15, 20); // false
 * ```
 */
const hasMoreCursorResults = (fetchedCount, requestedLimit) => {
    return fetchedCount >= requestedLimit;
};
exports.hasMoreCursorResults = hasMoreCursorResults;
// ============================================================================
// KEYSET PAGINATION
// ============================================================================
/**
 * Creates keyset pagination parameters for efficient large dataset pagination.
 *
 * @param {KeysetPaginationParams} params - Keyset pagination parameters
 * @returns {object} Query parameters for keyset pagination
 *
 * @example
 * ```typescript
 * const query = createKeysetPagination({
 *   lastId: '12345',
 *   lastValue: '2024-01-15',
 *   limit: 50,
 *   sortField: 'createdAt',
 *   sortOrder: 'DESC'
 * });
 * // Use: WHERE createdAt < '2024-01-15' OR (createdAt = '2024-01-15' AND id < '12345')
 * //      ORDER BY createdAt DESC LIMIT 50
 * ```
 */
const createKeysetPagination = (params) => {
    const { lastId, lastValue, limit, sortField, sortOrder = 'ASC' } = params;
    return {
        lastId,
        lastValue,
        limit,
        sortField,
        sortOrder,
        operator: sortOrder === 'ASC' ? '>' : '<',
    };
};
exports.createKeysetPagination = createKeysetPagination;
/**
 * Builds WHERE clause for keyset pagination.
 *
 * @param {string} sortField - Field used for sorting
 * @param {any} lastValue - Last value from previous page
 * @param {string | number} [lastId] - Last ID for tie-breaking
 * @param {string} operator - Comparison operator ('>' or '<')
 * @returns {string} WHERE clause for SQL query
 *
 * @example
 * ```typescript
 * const where = buildKeysetWhereClause('createdAt', '2024-01-15', '123', '>');
 * // Result: "(createdAt > '2024-01-15') OR (createdAt = '2024-01-15' AND id > '123')"
 * ```
 */
const buildKeysetWhereClause = (sortField, lastValue, lastId, operator = '>') => {
    if (!lastId) {
        return `${sortField} ${operator} ${JSON.stringify(lastValue)}`;
    }
    return `(${sortField} ${operator} ${JSON.stringify(lastValue)}) OR (${sortField} = ${JSON.stringify(lastValue)} AND id ${operator} ${JSON.stringify(lastId)})`;
};
exports.buildKeysetWhereClause = buildKeysetWhereClause;
/**
 * Extracts keyset values from the last item for next page.
 *
 * @param {any} lastItem - Last item from current page
 * @param {string} sortField - Field used for sorting
 * @returns {object} Keyset values for next query
 *
 * @example
 * ```typescript
 * const lastItem = { id: '999', createdAt: '2024-01-20', name: 'Test' };
 * const keyset = extractKeysetValues(lastItem, 'createdAt');
 * // Result: { lastId: '999', lastValue: '2024-01-20' }
 * ```
 */
const extractKeysetValues = (lastItem, sortField) => {
    return {
        lastId: lastItem.id,
        lastValue: lastItem[sortField],
    };
};
exports.extractKeysetValues = extractKeysetValues;
// ============================================================================
// PAGE NUMBER PAGINATION
// ============================================================================
/**
 * Validates and sanitizes page number.
 *
 * @param {number | string | undefined} page - Page number to validate
 * @param {number} [defaultPage] - Default page if invalid (default: 1)
 * @returns {number} Sanitized page number
 *
 * @example
 * ```typescript
 * sanitizePageNumber(5); // 5
 * sanitizePageNumber('3'); // 3
 * sanitizePageNumber(-1); // 1 (default)
 * sanitizePageNumber('abc'); // 1 (default)
 * sanitizePageNumber(undefined); // 1 (default)
 * ```
 */
const sanitizePageNumber = (page, defaultPage = 1) => {
    const parsed = typeof page === 'string' ? parseInt(page, 10) : page;
    return parsed && parsed > 0 ? parsed : defaultPage;
};
exports.sanitizePageNumber = sanitizePageNumber;
/**
 * Validates and sanitizes limit/page size.
 *
 * @param {number | string | undefined} limit - Limit to validate
 * @param {number} [defaultLimit] - Default limit if invalid (default: 20)
 * @param {number} [maxLimit] - Maximum allowed limit (default: 100)
 * @returns {number} Sanitized limit
 *
 * @example
 * ```typescript
 * sanitizeLimit(50); // 50
 * sanitizeLimit('25'); // 25
 * sanitizeLimit(150, 20, 100); // 100 (capped at max)
 * sanitizeLimit(-5); // 20 (default)
 * sanitizeLimit(undefined); // 20 (default)
 * ```
 */
const sanitizeLimit = (limit, defaultLimit = 20, maxLimit = 100) => {
    const parsed = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    if (!parsed || parsed < 1)
        return defaultLimit;
    return Math.min(parsed, maxLimit);
};
exports.sanitizeLimit = sanitizeLimit;
/**
 * Creates complete pagination metadata object.
 *
 * @param {number} currentPage - Current page number
 * @param {number} pageSize - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {PaginationMetadata} Complete pagination metadata
 *
 * @example
 * ```typescript
 * const meta = createPaginationMetadata(3, 20, 150);
 * // Result: {
 * //   currentPage: 3,
 * //   pageSize: 20,
 * //   totalItems: 150,
 * //   totalPages: 8,
 * //   hasNextPage: true,
 * //   hasPreviousPage: true
 * // }
 * ```
 */
const createPaginationMetadata = (currentPage, pageSize, totalItems) => {
    const totalPages = (0, exports.calculateTotalPages)(totalItems, pageSize);
    return {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: (0, exports.hasNextPage)(currentPage, totalItems, pageSize),
        hasPreviousPage: (0, exports.hasPreviousPage)(currentPage),
    };
};
exports.createPaginationMetadata = createPaginationMetadata;
// ============================================================================
// PAGINATION LINKS GENERATION
// ============================================================================
/**
 * Generates pagination links (first, previous, next, last, self).
 *
 * @param {string} baseUrl - Base URL for links
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} limit - Items per page
 * @param {Record<string, any>} [queryParams] - Additional query parameters
 * @returns {PaginationLinks} Pagination links object
 *
 * @example
 * ```typescript
 * const links = generatePaginationLinks(
 *   'https://api.example.com/students',
 *   3,
 *   10,
 *   20,
 *   { grade: '10', status: 'active' }
 * );
 * // Result: {
 * //   self: 'https://api.example.com/students?page=3&limit=20&grade=10&status=active',
 * //   first: 'https://api.example.com/students?page=1&limit=20&grade=10&status=active',
 * //   previous: 'https://api.example.com/students?page=2&limit=20&grade=10&status=active',
 * //   next: 'https://api.example.com/students?page=4&limit=20&grade=10&status=active',
 * //   last: 'https://api.example.com/students?page=10&limit=20&grade=10&status=active'
 * // }
 * ```
 */
const generatePaginationLinks = (baseUrl, currentPage, totalPages, limit, queryParams) => {
    const createLink = (page) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (queryParams) {
            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
        }
        return `${baseUrl}?${params.toString()}`;
    };
    const links = {
        self: createLink(currentPage),
        first: createLink(1),
    };
    if ((0, exports.hasPreviousPage)(currentPage)) {
        links.previous = createLink(currentPage - 1);
    }
    if (currentPage < totalPages) {
        links.next = createLink(currentPage + 1);
    }
    if (totalPages > 0) {
        links.last = createLink(totalPages);
    }
    return links;
};
exports.generatePaginationLinks = generatePaginationLinks;
/**
 * Generates cursor-based pagination links.
 *
 * @param {string} baseUrl - Base URL for links
 * @param {string | undefined} nextCursor - Cursor for next page
 * @param {string | undefined} previousCursor - Cursor for previous page
 * @param {number} limit - Items per page
 * @returns {object} Cursor pagination links
 *
 * @example
 * ```typescript
 * const links = generateCursorLinks(
 *   'https://api.example.com/feed',
 *   'bmV4dF9jdXJzb3I=',
 *   'cHJldl9jdXJzb3I=',
 *   25
 * );
 * // Result: {
 * //   next: 'https://api.example.com/feed?cursor=bmV4dF9jdXJzb3I=&limit=25',
 * //   previous: 'https://api.example.com/feed?cursor=cHJldl9jdXJzb3I=&limit=25'
 * // }
 * ```
 */
const generateCursorLinks = (baseUrl, nextCursor, previousCursor, limit) => {
    const links = {};
    if (nextCursor) {
        const params = new URLSearchParams({ cursor: nextCursor, limit: String(limit) });
        links.next = `${baseUrl}?${params.toString()}`;
    }
    if (previousCursor) {
        const params = new URLSearchParams({
            cursor: previousCursor,
            limit: String(limit),
        });
        links.previous = `${baseUrl}?${params.toString()}`;
    }
    return links;
};
exports.generateCursorLinks = generateCursorLinks;
// ============================================================================
// PAGINATION QUERY PARSING
// ============================================================================
/**
 * Parses pagination parameters from query string or object.
 *
 * @param {Record<string, any>} query - Query parameters object
 * @param {object} [defaults] - Default values for pagination
 * @returns {PaginationParams} Parsed and sanitized pagination parameters
 *
 * @example
 * ```typescript
 * const params = parsePaginationQuery(
 *   { page: '3', limit: '50', sort: 'name' },
 *   { page: 1, limit: 20 }
 * );
 * // Result: { page: 3, limit: 50, offset: 100 }
 * ```
 */
const parsePaginationQuery = (query, defaults) => {
    const page = (0, exports.sanitizePageNumber)(query.page, defaults?.page);
    const limit = (0, exports.sanitizeLimit)(query.limit, defaults?.limit, defaults?.maxLimit);
    const offset = (0, exports.calculateOffset)(page, limit);
    return {
        page,
        limit,
        offset,
        cursor: query.cursor,
    };
};
exports.parsePaginationQuery = parsePaginationQuery;
/**
 * Parses sort parameters from query string.
 *
 * @param {string | string[] | undefined} sortQuery - Sort query parameter
 * @returns {SortCriteria[]} Array of sort criteria
 *
 * @example
 * ```typescript
 * parseSortQuery('name:ASC'); // [{ field: 'name', order: 'ASC' }]
 * parseSortQuery(['createdAt:DESC', 'name:ASC']);
 * // [{ field: 'createdAt', order: 'DESC' }, { field: 'name', order: 'ASC' }]
 * parseSortQuery('-createdAt'); // [{ field: 'createdAt', order: 'DESC' }]
 * ```
 */
const parseSortQuery = (sortQuery) => {
    if (!sortQuery)
        return [];
    const sorts = Array.isArray(sortQuery) ? sortQuery : [sortQuery];
    return sorts.map((sort) => {
        if (sort.startsWith('-')) {
            return { field: sort.slice(1), order: 'DESC' };
        }
        if (sort.includes(':')) {
            const [field, order] = sort.split(':');
            return {
                field,
                order: (order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'),
            };
        }
        return { field: sort, order: 'ASC' };
    });
};
exports.parseSortQuery = parseSortQuery;
/**
 * Converts sort criteria to Sequelize order array.
 *
 * @param {SortCriteria[]} sortCriteria - Sort criteria array
 * @returns {any[]} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = convertSortToSequelizeOrder([
 *   { field: 'createdAt', order: 'DESC' },
 *   { field: 'name', order: 'ASC' }
 * ]);
 * // Result: [['createdAt', 'DESC'], ['name', 'ASC']]
 * // Use: Student.findAll({ order })
 * ```
 */
const convertSortToSequelizeOrder = (sortCriteria) => {
    return sortCriteria.map((criteria) => [criteria.field, criteria.order]);
};
exports.convertSortToSequelizeOrder = convertSortToSequelizeOrder;
// ============================================================================
// SEQUELIZE PAGINATION INTEGRATION
// ============================================================================
/**
 * Creates Sequelize findAndCountAll options with pagination.
 *
 * @param {SequelizePaginationOptions} options - Pagination options
 * @returns {object} Sequelize query options
 *
 * @example
 * ```typescript
 * const options = createSequelizePaginationOptions({
 *   page: 2,
 *   limit: 25,
 *   order: [['createdAt', 'DESC']],
 *   where: { status: 'active' }
 * });
 * const result = await Student.findAndCountAll(options);
 * // Returns: { rows: [...], count: 150 }
 * ```
 */
const createSequelizePaginationOptions = (options) => {
    const { page, limit, order, where, include } = options;
    return {
        offset: (0, exports.calculateOffset)(page, limit),
        limit,
        ...(order && { order }),
        ...(where && { where }),
        ...(include && { include }),
    };
};
exports.createSequelizePaginationOptions = createSequelizePaginationOptions;
/**
 * Formats Sequelize findAndCountAll result into paginated response.
 *
 * @template T
 * @param {object} sequelizeResult - Sequelize findAndCountAll result
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {PaginatedResponse<T>} Formatted paginated response
 *
 * @example
 * ```typescript
 * const result = await Student.findAndCountAll({ offset: 20, limit: 20 });
 * const response = formatSequelizeResult<Student>(result, 2, 20);
 * // Result: {
 * //   data: [...students],
 * //   pagination: { currentPage: 2, pageSize: 20, totalItems: 150, ... }
 * // }
 * ```
 */
const formatSequelizeResult = (sequelizeResult, page, limit) => {
    const { rows, count } = sequelizeResult;
    return {
        data: rows,
        pagination: (0, exports.createPaginationMetadata)(page, limit, count),
    };
};
exports.formatSequelizeResult = formatSequelizeResult;
// ============================================================================
// TOTAL COUNT OPTIMIZATION
// ============================================================================
/**
 * Checks if total count query should be skipped for performance.
 *
 * @param {number} page - Current page number
 * @param {number} estimatedTotal - Estimated total from cache
 * @param {number} threshold - Page threshold for skipping count
 * @returns {boolean} True if count query should be skipped
 *
 * @example
 * ```typescript
 * // Skip expensive COUNT(*) for pages beyond threshold
 * if (shouldSkipTotalCount(50, 1000000, 10)) {
 *   // Use estimated total instead of exact count
 *   // More efficient for large datasets
 * }
 * ```
 */
const shouldSkipTotalCount = (page, estimatedTotal, threshold = 10) => {
    return page > threshold && estimatedTotal > 10000;
};
exports.shouldSkipTotalCount = shouldSkipTotalCount;
/**
 * Estimates total count based on current page results.
 *
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 * @param {number} fetchedCount - Number of items fetched
 * @returns {number} Estimated total count
 *
 * @example
 * ```typescript
 * // Page 5, limit 20, got full 20 results
 * const estimated = estimateTotalCount(5, 20, 20);
 * // Result: ~100+ (at least 5 pages worth)
 * ```
 */
const estimateTotalCount = (currentPage, limit, fetchedCount) => {
    if (fetchedCount < limit) {
        return (currentPage - 1) * limit + fetchedCount;
    }
    return currentPage * limit;
};
exports.estimateTotalCount = estimateTotalCount;
// ============================================================================
// INFINITE SCROLL HELPERS
// ============================================================================
/**
 * Formats response for infinite scroll (load more) pattern.
 *
 * @template T
 * @param {T[]} data - Current page data
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} [totalItems] - Total items (optional)
 * @returns {object} Infinite scroll response
 *
 * @example
 * ```typescript
 * const response = formatInfiniteScrollResponse(students, 3, 20, 150);
 * // Result: {
 * //   data: [...students],
 * //   nextPage: 4,
 * //   hasMore: true,
 * //   loadedCount: 60
 * // }
 * ```
 */
const formatInfiniteScrollResponse = (data, page, limit, totalItems) => {
    const loadedCount = page * limit;
    const hasMore = totalItems
        ? loadedCount < totalItems
        : data.length >= limit;
    return {
        data,
        nextPage: hasMore ? page + 1 : null,
        hasMore,
        loadedCount: Math.min(loadedCount, totalItems || loadedCount),
    };
};
exports.formatInfiniteScrollResponse = formatInfiniteScrollResponse;
/**
 * Calculates items to fetch for virtual scroll viewport.
 *
 * @param {number} scrollTop - Current scroll position
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} viewportHeight - Height of viewport
 * @param {number} [bufferSize] - Number of items to buffer (default: 5)
 * @returns {object} Range of items to fetch
 *
 * @example
 * ```typescript
 * const range = calculateVirtualScrollRange(1000, 50, 600, 5);
 * // Result: { startIndex: 15, endIndex: 32, count: 17 }
 * // Fetch items 15-32 for current viewport position
 * ```
 */
const calculateVirtualScrollRange = (scrollTop, itemHeight, viewportHeight, bufferSize = 5) => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const endIndex = startIndex + visibleCount + bufferSize * 2;
    return {
        startIndex,
        endIndex,
        count: endIndex - startIndex,
    };
};
exports.calculateVirtualScrollRange = calculateVirtualScrollRange;
// ============================================================================
// PAGINATION RESPONSE FORMATTING
// ============================================================================
/**
 * Formats complete paginated API response with links.
 *
 * @template T
 * @param {T[]} data - Page data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total items
 * @param {string} [baseUrl] - Base URL for links
 * @param {Record<string, any>} [queryParams] - Additional query params
 * @returns {PaginatedResponse<T>} Complete paginated response
 *
 * @example
 * ```typescript
 * const response = formatPaginatedResponse(
 *   students,
 *   2,
 *   20,
 *   150,
 *   'https://api.example.com/students',
 *   { grade: '10' }
 * );
 * // Result: {
 * //   data: [...],
 * //   pagination: { currentPage: 2, pageSize: 20, totalItems: 150, ... },
 * //   links: { self: '...', first: '...', previous: '...', next: '...', last: '...' }
 * // }
 * ```
 */
const formatPaginatedResponse = (data, page, limit, totalItems, baseUrl, queryParams) => {
    const metadata = (0, exports.createPaginationMetadata)(page, limit, totalItems);
    const totalPages = (0, exports.calculateTotalPages)(totalItems, limit);
    const response = {
        data,
        pagination: metadata,
    };
    if (baseUrl) {
        response.links = (0, exports.generatePaginationLinks)(baseUrl, page, totalPages, limit, queryParams);
    }
    return response;
};
exports.formatPaginatedResponse = formatPaginatedResponse;
/**
 * Formats cursor-based paginated response.
 *
 * @template T
 * @param {T[]} data - Page data
 * @param {number} limit - Items per page
 * @param {string} [baseUrl] - Base URL for cursor links
 * @returns {CursorPaginationResult<T>} Cursor pagination result
 *
 * @example
 * ```typescript
 * const response = formatCursorResponse(
 *   feedItems,
 *   20,
 *   'https://api.example.com/feed'
 * );
 * // Result: {
 * //   data: [...],
 * //   nextCursor: 'encoded_cursor',
 * //   previousCursor: 'encoded_cursor',
 * //   hasMore: true
 * // }
 * ```
 */
const formatCursorResponse = (data, limit, baseUrl) => {
    const hasMore = data.length >= limit;
    const nextCursor = hasMore && data.length > 0
        ? (0, exports.encodeCursor)(data[data.length - 1].id)
        : undefined;
    const previousCursor = data.length > 0 ? (0, exports.encodeCursor)(data[0].id) : undefined;
    return {
        data,
        nextCursor,
        previousCursor,
        hasMore,
    };
};
exports.formatCursorResponse = formatCursorResponse;
// ============================================================================
// PAGINATION VALIDATION
// ============================================================================
/**
 * Validates pagination parameters and returns validation result.
 *
 * @param {PaginationParams} params - Pagination parameters to validate
 * @param {object} [constraints] - Validation constraints
 * @returns {PaginationValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePaginationParams(
 *   { page: -1, limit: 500 },
 *   { maxLimit: 100, minLimit: 1 }
 * );
 * // Result: {
 * //   isValid: false,
 * //   errors: ['Page must be >= 1', 'Limit exceeds maximum of 100'],
 * //   sanitized: { page: 1, limit: 100, offset: 0 }
 * // }
 * ```
 */
const validatePaginationParams = (params, constraints) => {
    const errors = [];
    const { page = 1, limit = 20 } = params;
    const { maxLimit = 100, minLimit = 1, maxPage } = constraints || {};
    if (page < 1) {
        errors.push('Page must be >= 1');
    }
    if (maxPage && page > maxPage) {
        errors.push(`Page exceeds maximum of ${maxPage}`);
    }
    if (limit < minLimit) {
        errors.push(`Limit must be >= ${minLimit}`);
    }
    if (limit > maxLimit) {
        errors.push(`Limit exceeds maximum of ${maxLimit}`);
    }
    const sanitized = {
        page: (0, exports.sanitizePageNumber)(page),
        limit: (0, exports.sanitizeLimit)(limit, 20, maxLimit),
    };
    sanitized.offset = (0, exports.calculateOffset)(sanitized.page, sanitized.limit);
    return {
        isValid: errors.length === 0,
        errors,
        sanitized,
    };
};
exports.validatePaginationParams = validatePaginationParams;
// ============================================================================
// GRAPHQL PAGINATION (RELAY CURSOR CONNECTIONS)
// ============================================================================
/**
 * Creates GraphQL connection response (Relay Cursor Connections spec).
 *
 * @template T
 * @param {T[]} nodes - Array of nodes
 * @param {GraphQLPaginationArgs} args - GraphQL pagination arguments
 * @param {number} [totalCount] - Total count (optional)
 * @returns {GraphQLConnection<T>} GraphQL connection object
 *
 * @example
 * ```typescript
 * const connection = createGraphQLConnection(
 *   students,
 *   { first: 20, after: 'cursor_abc' },
 *   150
 * );
 * // Result: {
 * //   edges: [{ node: {...}, cursor: '...' }, ...],
 * //   pageInfo: {
 * //     hasNextPage: true,
 * //     hasPreviousPage: true,
 * //     startCursor: '...',
 * //     endCursor: '...'
 * //   },
 * //   totalCount: 150
 * // }
 * ```
 */
const createGraphQLConnection = (nodes, args, totalCount) => {
    const edges = nodes.map((node) => ({
        node,
        cursor: (0, exports.encodeCursor)(node.id),
    }));
    const startCursor = edges.length > 0 ? edges[0].cursor : undefined;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : undefined;
    const hasNextPage = args.first ? nodes.length >= args.first : false;
    const hasPreviousPage = args.last ? nodes.length >= args.last : !!args.after;
    return {
        edges,
        pageInfo: {
            hasNextPage,
            hasPreviousPage,
            startCursor,
            endCursor,
        },
        ...(totalCount !== undefined && { totalCount }),
    };
};
exports.createGraphQLConnection = createGraphQLConnection;
/**
 * Parses GraphQL pagination arguments into database query params.
 *
 * @param {GraphQLPaginationArgs} args - GraphQL pagination arguments
 * @returns {object} Database query parameters
 *
 * @example
 * ```typescript
 * const queryParams = parseGraphQLPaginationArgs({
 *   first: 20,
 *   after: 'encoded_cursor'
 * });
 * // Result: { limit: 20, cursor: 'decoded_id', direction: 'forward' }
 *
 * const backwardParams = parseGraphQLPaginationArgs({
 *   last: 10,
 *   before: 'encoded_cursor'
 * });
 * // Result: { limit: 10, cursor: 'decoded_id', direction: 'backward' }
 * ```
 */
const parseGraphQLPaginationArgs = (args) => {
    if (args.first !== undefined) {
        return {
            limit: args.first,
            cursor: args.after ? (0, exports.decodeCursor)(args.after) : undefined,
            direction: 'forward',
        };
    }
    if (args.last !== undefined) {
        return {
            limit: args.last,
            cursor: args.before ? (0, exports.decodeCursor)(args.before) : undefined,
            direction: 'backward',
        };
    }
    return { limit: 20, direction: 'forward' };
};
exports.parseGraphQLPaginationArgs = parseGraphQLPaginationArgs;
// ============================================================================
// SWAGGER/OPENAPI PAGINATION DECORATORS
// ============================================================================
/**
 * Generates Swagger/OpenAPI pagination query parameters schema.
 *
 * @param {object} [options] - Schema options
 * @returns {object[]} OpenAPI parameter definitions
 *
 * @example
 * ```typescript
 * // Use in NestJS controller:
 * // @ApiQuery(getSwaggerPaginationParams())
 * const swaggerParams = getSwaggerPaginationParams({
 *   defaultLimit: 20,
 *   maxLimit: 100
 * });
 * // Result: [
 * //   { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
 * //   { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } }
 * // ]
 * ```
 */
const getSwaggerPaginationParams = (options) => {
    const { defaultPage = 1, defaultLimit = 20, maxLimit = 100 } = options || {};
    return [
        {
            name: 'page',
            in: 'query',
            description: 'Page number (1-indexed)',
            required: false,
            schema: {
                type: 'integer',
                minimum: 1,
                default: defaultPage,
            },
        },
        {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: {
                type: 'integer',
                minimum: 1,
                maximum: maxLimit,
                default: defaultLimit,
            },
        },
    ];
};
exports.getSwaggerPaginationParams = getSwaggerPaginationParams;
/**
 * Generates Swagger/OpenAPI response schema for paginated endpoints.
 *
 * @param {string} itemSchemaRef - Reference to item schema ($ref)
 * @returns {object} OpenAPI response schema
 *
 * @example
 * ```typescript
 * // Use in Swagger/OpenAPI spec:
 * const responseSchema = getSwaggerPaginatedResponseSchema('#/components/schemas/Student');
 * // Result: {
 * //   type: 'object',
 * //   properties: {
 * //     data: { type: 'array', items: { $ref: '#/components/schemas/Student' } },
 * //     pagination: { type: 'object', properties: { currentPage, pageSize, ... } },
 * //     links: { ... }
 * //   }
 * // }
 * ```
 */
const getSwaggerPaginatedResponseSchema = (itemSchemaRef) => {
    return {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: { $ref: itemSchemaRef },
            },
            pagination: {
                type: 'object',
                properties: {
                    currentPage: { type: 'integer', example: 1 },
                    pageSize: { type: 'integer', example: 20 },
                    totalItems: { type: 'integer', example: 150 },
                    totalPages: { type: 'integer', example: 8 },
                    hasNextPage: { type: 'boolean', example: true },
                    hasPreviousPage: { type: 'boolean', example: false },
                },
            },
            links: {
                type: 'object',
                properties: {
                    self: { type: 'string', format: 'uri' },
                    first: { type: 'string', format: 'uri' },
                    previous: { type: 'string', format: 'uri' },
                    next: { type: 'string', format: 'uri' },
                    last: { type: 'string', format: 'uri' },
                },
            },
        },
    };
};
exports.getSwaggerPaginatedResponseSchema = getSwaggerPaginatedResponseSchema;
exports.default = {
    // Offset-based pagination
    calculateOffset: exports.calculateOffset,
    calculatePageFromOffset: exports.calculatePageFromOffset,
    calculateTotalPages: exports.calculateTotalPages,
    createOffsetPagination: exports.createOffsetPagination,
    hasNextPage: exports.hasNextPage,
    hasPreviousPage: exports.hasPreviousPage,
    // Cursor-based pagination
    encodeCursor: exports.encodeCursor,
    decodeCursor: exports.decodeCursor,
    createCursorFromItem: exports.createCursorFromItem,
    parseCursor: exports.parseCursor,
    createCursorPagination: exports.createCursorPagination,
    hasMoreCursorResults: exports.hasMoreCursorResults,
    // Keyset pagination
    createKeysetPagination: exports.createKeysetPagination,
    buildKeysetWhereClause: exports.buildKeysetWhereClause,
    extractKeysetValues: exports.extractKeysetValues,
    // Page number pagination
    sanitizePageNumber: exports.sanitizePageNumber,
    sanitizeLimit: exports.sanitizeLimit,
    createPaginationMetadata: exports.createPaginationMetadata,
    // Pagination links
    generatePaginationLinks: exports.generatePaginationLinks,
    generateCursorLinks: exports.generateCursorLinks,
    // Query parsing
    parsePaginationQuery: exports.parsePaginationQuery,
    parseSortQuery: exports.parseSortQuery,
    convertSortToSequelizeOrder: exports.convertSortToSequelizeOrder,
    // Sequelize integration
    createSequelizePaginationOptions: exports.createSequelizePaginationOptions,
    formatSequelizeResult: exports.formatSequelizeResult,
    // Total count optimization
    shouldSkipTotalCount: exports.shouldSkipTotalCount,
    estimateTotalCount: exports.estimateTotalCount,
    // Infinite scroll
    formatInfiniteScrollResponse: exports.formatInfiniteScrollResponse,
    calculateVirtualScrollRange: exports.calculateVirtualScrollRange,
    // Response formatting
    formatPaginatedResponse: exports.formatPaginatedResponse,
    formatCursorResponse: exports.formatCursorResponse,
    // Validation
    validatePaginationParams: exports.validatePaginationParams,
    // GraphQL
    createGraphQLConnection: exports.createGraphQLConnection,
    parseGraphQLPaginationArgs: exports.parseGraphQLPaginationArgs,
    // Swagger/OpenAPI
    getSwaggerPaginationParams: exports.getSwaggerPaginationParams,
    getSwaggerPaginatedResponseSchema: exports.getSwaggerPaginatedResponseSchema,
};
//# sourceMappingURL=pagination-utils.js.map