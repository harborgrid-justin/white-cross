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
/**
 * File: /reuse/pagination-utils.ts
 * Locator: WC-UTL-PAG-003
 * Purpose: Pagination Utilities - Comprehensive pagination helpers for APIs and databases
 *
 * Upstream: Independent utility module for pagination operations
 * Downstream: ../backend/*, ../frontend/*, API controllers, GraphQL resolvers, database services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize (optional), GraphQL (optional)
 * Exports: 40 utility functions for pagination (offset, cursor, keyset, page-based)
 *
 * LLM Context: Comprehensive pagination utilities for White Cross healthcare system.
 * Provides offset-based, cursor-based, keyset, and page number pagination strategies.
 * Includes metadata generation, query parsing, response formatting, Sequelize integration,
 * GraphQL resolvers, and Swagger decorators. Essential for scalable data listing in
 * healthcare applications with large datasets (patients, records, appointments).
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
}
interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMetadata;
    links?: PaginationLinks;
}
interface PaginationLinks {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    self: string;
}
interface CursorPaginationParams {
    cursor?: string;
    limit: number;
    direction?: 'forward' | 'backward';
}
interface CursorPaginationResult<T> {
    data: T[];
    nextCursor?: string;
    previousCursor?: string;
    hasMore: boolean;
}
interface KeysetPaginationParams {
    lastId?: string | number;
    lastValue?: any;
    limit: number;
    sortField: string;
    sortOrder?: 'ASC' | 'DESC';
}
interface SequelizePaginationOptions {
    page: number;
    limit: number;
    order?: any[];
    where?: any;
    include?: any[];
}
interface GraphQLPaginationArgs {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
interface GraphQLConnection<T> {
    edges: Array<{
        node: T;
        cursor: string;
    }>;
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string;
        endCursor?: string;
    };
    totalCount?: number;
}
interface SortCriteria {
    field: string;
    order: 'ASC' | 'DESC';
}
interface PaginationValidationResult {
    isValid: boolean;
    errors: string[];
    sanitized?: PaginationParams;
}
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
export declare const calculateOffset: (page: number, limit: number) => number;
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
export declare const calculatePageFromOffset: (offset: number, limit: number) => number;
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
export declare const calculateTotalPages: (totalItems: number, limit: number) => number;
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
export declare const createOffsetPagination: (page?: number, limit?: number) => {
    offset: number;
    limit: number;
};
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
export declare const hasNextPage: (currentPage: number, totalItems: number, limit: number) => boolean;
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
export declare const hasPreviousPage: (currentPage: number) => boolean;
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
export declare const encodeCursor: (id: string | number) => string;
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
export declare const decodeCursor: (cursor: string) => string;
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
export declare const createCursorFromItem: (item: any) => string;
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
export declare const parseCursor: (cursor: string) => {
    id: string;
    timestamp?: string;
};
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
export declare const createCursorPagination: (params: CursorPaginationParams) => {
    decodedCursor?: string;
    limit: number;
    direction: "forward" | "backward";
};
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
export declare const hasMoreCursorResults: (fetchedCount: number, requestedLimit: number) => boolean;
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
export declare const createKeysetPagination: (params: KeysetPaginationParams) => {
    lastId: string | number | undefined;
    lastValue: any;
    limit: number;
    sortField: string;
    sortOrder: "DESC" | "ASC";
    operator: string;
};
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
export declare const buildKeysetWhereClause: (sortField: string, lastValue: any, lastId?: string | number, operator?: string) => string;
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
export declare const extractKeysetValues: (lastItem: any, sortField: string) => {
    lastId: string | number;
    lastValue: any;
};
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
export declare const sanitizePageNumber: (page: number | string | undefined, defaultPage?: number) => number;
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
export declare const sanitizeLimit: (limit: number | string | undefined, defaultLimit?: number, maxLimit?: number) => number;
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
export declare const createPaginationMetadata: (currentPage: number, pageSize: number, totalItems: number) => PaginationMetadata;
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
export declare const generatePaginationLinks: (baseUrl: string, currentPage: number, totalPages: number, limit: number, queryParams?: Record<string, any>) => PaginationLinks;
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
export declare const generateCursorLinks: (baseUrl: string, nextCursor: string | undefined, previousCursor: string | undefined, limit: number) => {
    next?: string;
    previous?: string;
};
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
export declare const parsePaginationQuery: (query: Record<string, any>, defaults?: {
    page?: number;
    limit?: number;
    maxLimit?: number;
}) => PaginationParams;
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
export declare const parseSortQuery: (sortQuery: string | string[] | undefined) => SortCriteria[];
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
export declare const convertSortToSequelizeOrder: (sortCriteria: SortCriteria[]) => any[];
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
export declare const createSequelizePaginationOptions: (options: SequelizePaginationOptions) => any;
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
export declare const formatSequelizeResult: <T>(sequelizeResult: {
    rows: T[];
    count: number;
}, page: number, limit: number) => PaginatedResponse<T>;
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
export declare const shouldSkipTotalCount: (page: number, estimatedTotal: number, threshold?: number) => boolean;
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
export declare const estimateTotalCount: (currentPage: number, limit: number, fetchedCount: number) => number;
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
export declare const formatInfiniteScrollResponse: <T>(data: T[], page: number, limit: number, totalItems?: number) => {
    data: T[];
    nextPage: number | null;
    hasMore: boolean;
    loadedCount: number;
};
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
export declare const calculateVirtualScrollRange: (scrollTop: number, itemHeight: number, viewportHeight: number, bufferSize?: number) => {
    startIndex: number;
    endIndex: number;
    count: number;
};
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
export declare const formatPaginatedResponse: <T>(data: T[], page: number, limit: number, totalItems: number, baseUrl?: string, queryParams?: Record<string, any>) => PaginatedResponse<T>;
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
export declare const formatCursorResponse: <T extends {
    id: any;
}>(data: T[], limit: number, baseUrl?: string) => CursorPaginationResult<T>;
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
export declare const validatePaginationParams: (params: PaginationParams, constraints?: {
    maxLimit?: number;
    minLimit?: number;
    maxPage?: number;
}) => PaginationValidationResult;
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
export declare const createGraphQLConnection: <T extends {
    id: any;
}>(nodes: T[], args: GraphQLPaginationArgs, totalCount?: number) => GraphQLConnection<T>;
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
export declare const parseGraphQLPaginationArgs: (args: GraphQLPaginationArgs) => {
    limit: number;
    cursor?: string;
    direction: "forward" | "backward";
};
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
export declare const getSwaggerPaginationParams: (options?: {
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
}) => any[];
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
export declare const getSwaggerPaginatedResponseSchema: (itemSchemaRef: string) => any;
declare const _default: {
    calculateOffset: (page: number, limit: number) => number;
    calculatePageFromOffset: (offset: number, limit: number) => number;
    calculateTotalPages: (totalItems: number, limit: number) => number;
    createOffsetPagination: (page?: number, limit?: number) => {
        offset: number;
        limit: number;
    };
    hasNextPage: (currentPage: number, totalItems: number, limit: number) => boolean;
    hasPreviousPage: (currentPage: number) => boolean;
    encodeCursor: (id: string | number) => string;
    decodeCursor: (cursor: string) => string;
    createCursorFromItem: (item: any) => string;
    parseCursor: (cursor: string) => {
        id: string;
        timestamp?: string;
    };
    createCursorPagination: (params: CursorPaginationParams) => {
        decodedCursor?: string;
        limit: number;
        direction: "forward" | "backward";
    };
    hasMoreCursorResults: (fetchedCount: number, requestedLimit: number) => boolean;
    createKeysetPagination: (params: KeysetPaginationParams) => {
        lastId: string | number | undefined;
        lastValue: any;
        limit: number;
        sortField: string;
        sortOrder: "DESC" | "ASC";
        operator: string;
    };
    buildKeysetWhereClause: (sortField: string, lastValue: any, lastId?: string | number, operator?: string) => string;
    extractKeysetValues: (lastItem: any, sortField: string) => {
        lastId: string | number;
        lastValue: any;
    };
    sanitizePageNumber: (page: number | string | undefined, defaultPage?: number) => number;
    sanitizeLimit: (limit: number | string | undefined, defaultLimit?: number, maxLimit?: number) => number;
    createPaginationMetadata: (currentPage: number, pageSize: number, totalItems: number) => PaginationMetadata;
    generatePaginationLinks: (baseUrl: string, currentPage: number, totalPages: number, limit: number, queryParams?: Record<string, any>) => PaginationLinks;
    generateCursorLinks: (baseUrl: string, nextCursor: string | undefined, previousCursor: string | undefined, limit: number) => {
        next?: string;
        previous?: string;
    };
    parsePaginationQuery: (query: Record<string, any>, defaults?: {
        page?: number;
        limit?: number;
        maxLimit?: number;
    }) => PaginationParams;
    parseSortQuery: (sortQuery: string | string[] | undefined) => SortCriteria[];
    convertSortToSequelizeOrder: (sortCriteria: SortCriteria[]) => any[];
    createSequelizePaginationOptions: (options: SequelizePaginationOptions) => any;
    formatSequelizeResult: <T>(sequelizeResult: {
        rows: T[];
        count: number;
    }, page: number, limit: number) => PaginatedResponse<T>;
    shouldSkipTotalCount: (page: number, estimatedTotal: number, threshold?: number) => boolean;
    estimateTotalCount: (currentPage: number, limit: number, fetchedCount: number) => number;
    formatInfiniteScrollResponse: <T>(data: T[], page: number, limit: number, totalItems?: number) => {
        data: T[];
        nextPage: number | null;
        hasMore: boolean;
        loadedCount: number;
    };
    calculateVirtualScrollRange: (scrollTop: number, itemHeight: number, viewportHeight: number, bufferSize?: number) => {
        startIndex: number;
        endIndex: number;
        count: number;
    };
    formatPaginatedResponse: <T>(data: T[], page: number, limit: number, totalItems: number, baseUrl?: string, queryParams?: Record<string, any>) => PaginatedResponse<T>;
    formatCursorResponse: <T extends {
        id: any;
    }>(data: T[], limit: number, baseUrl?: string) => CursorPaginationResult<T>;
    validatePaginationParams: (params: PaginationParams, constraints?: {
        maxLimit?: number;
        minLimit?: number;
        maxPage?: number;
    }) => PaginationValidationResult;
    createGraphQLConnection: <T extends {
        id: any;
    }>(nodes: T[], args: GraphQLPaginationArgs, totalCount?: number) => GraphQLConnection<T>;
    parseGraphQLPaginationArgs: (args: GraphQLPaginationArgs) => {
        limit: number;
        cursor?: string;
        direction: "forward" | "backward";
    };
    getSwaggerPaginationParams: (options?: {
        defaultPage?: number;
        defaultLimit?: number;
        maxLimit?: number;
    }) => any[];
    getSwaggerPaginatedResponseSchema: (itemSchemaRef: string) => any;
};
export default _default;
//# sourceMappingURL=pagination-utils.d.ts.map