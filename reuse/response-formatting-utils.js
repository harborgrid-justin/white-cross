"use strict";
/**
 * LOC: RES1234567
 * File: /reuse/response-formatting-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers
 *   - Response transformation pipes
 *   - API response middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInEnvelope = exports.transformToSnakeCase = exports.transformToCamelCase = exports.applySparseFieldsets = exports.excludeSensitiveFields = exports.filterResponseFields = exports.formatResponseByContentType = exports.getStatusCodeForOperation = exports.getStatusCodes = exports.addVersionMetadata = exports.addRequestTracking = exports.addMetadata = exports.createHalCollection = exports.createHalResource = exports.createJsonApiError = exports.createJsonApiCollection = exports.createJsonApiResource = exports.generateRelationshipLinks = exports.addCustomLinks = exports.generateCollectionLinks = exports.generateResourceLinks = exports.createCursorPaginatedResponse = exports.calculatePaginationMeta = exports.createPaginationLinks = exports.createPaginatedResponse = exports.createInternalServerErrorResponse = exports.createConflictResponse = exports.createForbiddenResponse = exports.createUnauthorizedResponse = exports.createNotFoundResponse = exports.createValidationErrorResponse = exports.createErrorResponse = exports.createAcceptedResponse = exports.createNoContentResponse = exports.createCreatedResponse = exports.createSuccessResponseWithLinks = exports.createSuccessResponse = void 0;
// ============================================================================
// SUCCESS RESPONSE WRAPPERS
// ============================================================================
/**
 * Creates a standardized success response.
 *
 * @template T
 * @param {T} data - Response data
 * @param {Partial<ResponseMetadata>} [metadata] - Optional metadata
 * @returns {SuccessResponse<T>} Formatted success response
 *
 * @example
 * ```typescript
 * const response = createSuccessResponse({ id: '123', name: 'John' });
 * // Result: { success: true, data: { id: '123', name: 'John' }, metadata: {...} }
 * ```
 */
const createSuccessResponse = (data, metadata) => {
    return {
        success: true,
        data,
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata,
        },
    };
};
exports.createSuccessResponse = createSuccessResponse;
/**
 * Creates a success response with HATEOAS links.
 *
 * @template T
 * @param {T} data - Response data
 * @param {HateoasLinks} links - HATEOAS links
 * @param {Partial<ResponseMetadata>} [metadata] - Optional metadata
 * @returns {SuccessResponse<T>} Formatted success response with links
 *
 * @example
 * ```typescript
 * const response = createSuccessResponseWithLinks(
 *   { id: '123', name: 'John' },
 *   { self: '/api/users/123', update: '/api/users/123', delete: '/api/users/123' }
 * );
 * ```
 */
const createSuccessResponseWithLinks = (data, links, metadata) => {
    return {
        success: true,
        data,
        links,
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata,
        },
    };
};
exports.createSuccessResponseWithLinks = createSuccessResponseWithLinks;
/**
 * Creates a created (201) response for resource creation.
 *
 * @template T
 * @param {T} data - Created resource data
 * @param {string} location - Resource location URL
 * @param {Partial<ResponseMetadata>} [metadata] - Optional metadata
 * @returns {SuccessResponse<T> & { location: string }} Created response
 *
 * @example
 * ```typescript
 * const response = createCreatedResponse(
 *   { id: '123', name: 'New Patient' },
 *   '/api/patients/123'
 * );
 * ```
 */
const createCreatedResponse = (data, location, metadata) => {
    return {
        success: true,
        data,
        location,
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata,
        },
    };
};
exports.createCreatedResponse = createCreatedResponse;
/**
 * Creates a no content (204) response.
 *
 * @returns {object} No content response
 *
 * @example
 * ```typescript
 * const response = createNoContentResponse();
 * // Used for successful DELETE operations
 * ```
 */
const createNoContentResponse = () => {
    return {};
};
exports.createNoContentResponse = createNoContentResponse;
/**
 * Creates an accepted (202) response for async operations.
 *
 * @param {string} jobId - Job/task identifier
 * @param {string} statusUrl - URL to check operation status
 * @param {Partial<ResponseMetadata>} [metadata] - Optional metadata
 * @returns {SuccessResponse<any>} Accepted response
 *
 * @example
 * ```typescript
 * const response = createAcceptedResponse(
 *   'job_12345',
 *   '/api/jobs/job_12345/status'
 * );
 * ```
 */
const createAcceptedResponse = (jobId, statusUrl, metadata) => {
    return {
        success: true,
        data: {
            jobId,
            status: 'processing',
            statusUrl,
        },
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata,
        },
    };
};
exports.createAcceptedResponse = createAcceptedResponse;
// ============================================================================
// ERROR RESPONSE WRAPPERS
// ============================================================================
/**
 * Creates a standardized error response.
 *
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {any} [details] - Additional error details
 * @param {string} [path] - Request path
 * @param {string} [requestId] - Request ID for tracking
 * @returns {ErrorResponse} Formatted error response
 *
 * @example
 * ```typescript
 * const error = createErrorResponse(
 *   'VALIDATION_ERROR',
 *   'Invalid input data',
 *   { field: 'email', reason: 'Invalid format' },
 *   '/api/users',
 *   'req_12345'
 * );
 * ```
 */
const createErrorResponse = (code, message, details, path, requestId) => {
    return {
        success: false,
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
            path,
            requestId,
        },
    };
};
exports.createErrorResponse = createErrorResponse;
/**
 * Creates a validation error response.
 *
 * @param {Record<string, string[]>} validationErrors - Field validation errors
 * @param {string} [requestId] - Request ID
 * @returns {ErrorResponse} Validation error response
 *
 * @example
 * ```typescript
 * const error = createValidationErrorResponse({
 *   email: ['Invalid email format', 'Email already exists'],
 *   age: ['Must be at least 18']
 * });
 * ```
 */
const createValidationErrorResponse = (validationErrors, requestId) => {
    return (0, exports.createErrorResponse)('VALIDATION_ERROR', 'Validation failed', { fields: validationErrors }, undefined, requestId);
};
exports.createValidationErrorResponse = createValidationErrorResponse;
/**
 * Creates a not found (404) error response.
 *
 * @param {string} resourceType - Type of resource not found
 * @param {string} resourceId - Resource identifier
 * @param {string} [requestId] - Request ID
 * @returns {ErrorResponse} Not found error response
 *
 * @example
 * ```typescript
 * const error = createNotFoundResponse('Patient', '12345');
 * // Result: { success: false, error: { code: 'NOT_FOUND', message: 'Patient with ID 12345 not found' } }
 * ```
 */
const createNotFoundResponse = (resourceType, resourceId, requestId) => {
    return (0, exports.createErrorResponse)('NOT_FOUND', `${resourceType} with ID ${resourceId} not found`, { resourceType, resourceId }, undefined, requestId);
};
exports.createNotFoundResponse = createNotFoundResponse;
/**
 * Creates an unauthorized (401) error response.
 *
 * @param {string} [message] - Custom error message
 * @param {string} [requestId] - Request ID
 * @returns {ErrorResponse} Unauthorized error response
 *
 * @example
 * ```typescript
 * const error = createUnauthorizedResponse('Invalid credentials');
 * ```
 */
const createUnauthorizedResponse = (message = 'Unauthorized access', requestId) => {
    return (0, exports.createErrorResponse)('UNAUTHORIZED', message, undefined, undefined, requestId);
};
exports.createUnauthorizedResponse = createUnauthorizedResponse;
/**
 * Creates a forbidden (403) error response.
 *
 * @param {string} [message] - Custom error message
 * @param {string} [requestId] - Request ID
 * @returns {ErrorResponse} Forbidden error response
 *
 * @example
 * ```typescript
 * const error = createForbiddenResponse('Insufficient permissions to access patient records');
 * ```
 */
const createForbiddenResponse = (message = 'Access forbidden', requestId) => {
    return (0, exports.createErrorResponse)('FORBIDDEN', message, undefined, undefined, requestId);
};
exports.createForbiddenResponse = createForbiddenResponse;
/**
 * Creates a conflict (409) error response.
 *
 * @param {string} message - Conflict message
 * @param {any} [details] - Conflict details
 * @param {string} [requestId] - Request ID
 * @returns {ErrorResponse} Conflict error response
 *
 * @example
 * ```typescript
 * const error = createConflictResponse(
 *   'Email already registered',
 *   { email: 'john@example.com' }
 * );
 * ```
 */
const createConflictResponse = (message, details, requestId) => {
    return (0, exports.createErrorResponse)('CONFLICT', message, details, undefined, requestId);
};
exports.createConflictResponse = createConflictResponse;
/**
 * Creates an internal server error (500) response.
 *
 * @param {string} [message] - Error message
 * @param {any} [details] - Error details (sanitized in production)
 * @param {string} [requestId] - Request ID
 * @returns {ErrorResponse} Internal server error response
 *
 * @example
 * ```typescript
 * const error = createInternalServerErrorResponse('Database connection failed', undefined, 'req_12345');
 * ```
 */
const createInternalServerErrorResponse = (message = 'Internal server error', details, requestId) => {
    return (0, exports.createErrorResponse)('INTERNAL_ERROR', message, details, undefined, requestId);
};
exports.createInternalServerErrorResponse = createInternalServerErrorResponse;
// ============================================================================
// PAGINATION RESPONSE FORMATTING
// ============================================================================
/**
 * Creates a paginated response with metadata and links.
 *
 * @template T
 * @param {T[]} data - Array of data items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} baseUrl - Base URL for pagination links
 * @returns {PaginatedResponse<T>} Formatted paginated response
 *
 * @example
 * ```typescript
 * const response = createPaginatedResponse(
 *   patients,
 *   2,
 *   20,
 *   150,
 *   '/api/patients'
 * );
 * ```
 */
const createPaginatedResponse = (data, page, limit, total, baseUrl) => {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        links: (0, exports.createPaginationLinks)(baseUrl, page, totalPages),
        metadata: {
            timestamp: new Date().toISOString(),
        },
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
/**
 * Creates pagination links for HATEOAS.
 *
 * @param {string} baseUrl - Base URL
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {PaginationLinks} Pagination links
 *
 * @example
 * ```typescript
 * const links = createPaginationLinks('/api/patients', 2, 10);
 * // Result: { self: '/api/patients?page=2', first: '/api/patients?page=1', ... }
 * ```
 */
const createPaginationLinks = (baseUrl, currentPage, totalPages) => {
    const links = {
        self: `${baseUrl}?page=${currentPage}`,
        first: `${baseUrl}?page=1`,
        last: `${baseUrl}?page=${totalPages}`,
    };
    if (currentPage < totalPages) {
        links.next = `${baseUrl}?page=${currentPage + 1}`;
    }
    if (currentPage > 1) {
        links.previous = `${baseUrl}?page=${currentPage - 1}`;
    }
    return links;
};
exports.createPaginationLinks = createPaginationLinks;
/**
 * Calculates pagination metadata from total count.
 *
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {PaginationMeta} Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = calculatePaginationMeta(3, 20, 150);
 * // Result: { page: 3, limit: 20, total: 150, totalPages: 8, hasNextPage: true, hasPreviousPage: true }
 * ```
 */
const calculatePaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
exports.calculatePaginationMeta = calculatePaginationMeta;
/**
 * Creates cursor-based pagination response.
 *
 * @template T
 * @param {T[]} data - Array of data items
 * @param {string | null} nextCursor - Cursor for next page
 * @param {string | null} prevCursor - Cursor for previous page
 * @param {string} baseUrl - Base URL for pagination
 * @returns {object} Cursor-based paginated response
 *
 * @example
 * ```typescript
 * const response = createCursorPaginatedResponse(
 *   patients,
 *   'cursor_abc123',
 *   'cursor_xyz789',
 *   '/api/patients'
 * );
 * ```
 */
const createCursorPaginatedResponse = (data, nextCursor, prevCursor, baseUrl) => {
    const links = {
        self: baseUrl,
    };
    if (nextCursor) {
        links.next = `${baseUrl}?cursor=${nextCursor}`;
    }
    if (prevCursor) {
        links.previous = `${baseUrl}?cursor=${prevCursor}`;
    }
    return {
        data,
        cursors: {
            next: nextCursor,
            previous: prevCursor,
        },
        links,
        metadata: {
            timestamp: new Date().toISOString(),
        },
    };
};
exports.createCursorPaginatedResponse = createCursorPaginatedResponse;
// ============================================================================
// HATEOAS LINK GENERATION
// ============================================================================
/**
 * Generates HATEOAS links for a resource.
 *
 * @param {string} resourceType - Resource type (e.g., 'patients', 'users')
 * @param {string} resourceId - Resource identifier
 * @param {string} [baseUrl] - Base API URL (default: '/api')
 * @returns {HateoasLinks} HATEOAS links
 *
 * @example
 * ```typescript
 * const links = generateResourceLinks('patients', '123');
 * // Result: { self: '/api/patients/123', update: '/api/patients/123', delete: '/api/patients/123' }
 * ```
 */
const generateResourceLinks = (resourceType, resourceId, baseUrl = '/api') => {
    const resourcePath = `${baseUrl}/${resourceType}/${resourceId}`;
    return {
        self: resourcePath,
        update: resourcePath,
        delete: resourcePath,
        collection: `${baseUrl}/${resourceType}`,
    };
};
exports.generateResourceLinks = generateResourceLinks;
/**
 * Generates collection HATEOAS links.
 *
 * @param {string} resourceType - Resource type
 * @param {string} [baseUrl] - Base API URL (default: '/api')
 * @returns {HateoasLinks} Collection links
 *
 * @example
 * ```typescript
 * const links = generateCollectionLinks('patients');
 * // Result: { self: '/api/patients', create: '/api/patients' }
 * ```
 */
const generateCollectionLinks = (resourceType, baseUrl = '/api') => {
    const collectionPath = `${baseUrl}/${resourceType}`;
    return {
        self: collectionPath,
        create: collectionPath,
    };
};
exports.generateCollectionLinks = generateCollectionLinks;
/**
 * Adds custom HATEOAS links to existing links.
 *
 * @param {HateoasLinks} existingLinks - Existing links
 * @param {Record<string, string>} customLinks - Custom links to add
 * @returns {HateoasLinks} Combined links
 *
 * @example
 * ```typescript
 * const links = addCustomLinks(
 *   { self: '/api/patients/123' },
 *   { appointments: '/api/patients/123/appointments', medicalRecords: '/api/patients/123/medical-records' }
 * );
 * ```
 */
const addCustomLinks = (existingLinks, customLinks) => {
    return { ...existingLinks, ...customLinks };
};
exports.addCustomLinks = addCustomLinks;
/**
 * Generates relationship links for nested resources.
 *
 * @param {string} parentType - Parent resource type
 * @param {string} parentId - Parent resource ID
 * @param {string} childType - Child resource type
 * @param {string} [baseUrl] - Base API URL
 * @returns {HateoasLinks} Relationship links
 *
 * @example
 * ```typescript
 * const links = generateRelationshipLinks('patients', '123', 'appointments');
 * // Result: { self: '/api/patients/123/appointments', ... }
 * ```
 */
const generateRelationshipLinks = (parentType, parentId, childType, baseUrl = '/api') => {
    const relationshipPath = `${baseUrl}/${parentType}/${parentId}/${childType}`;
    return {
        self: relationshipPath,
        parent: `${baseUrl}/${parentType}/${parentId}`,
    };
};
exports.generateRelationshipLinks = generateRelationshipLinks;
// ============================================================================
// JSON:API FORMAT HELPERS
// ============================================================================
/**
 * Creates a JSON:API formatted single resource response.
 *
 * @param {string} type - Resource type
 * @param {string} id - Resource ID
 * @param {Record<string, any>} attributes - Resource attributes
 * @param {Record<string, JsonApiRelationship>} [relationships] - Resource relationships
 * @returns {JsonApiResponse} JSON:API response
 *
 * @example
 * ```typescript
 * const response = createJsonApiResource(
 *   'patients',
 *   '123',
 *   { name: 'John Doe', age: 35 },
 *   { appointments: { data: [{ type: 'appointments', id: '456' }] } }
 * );
 * ```
 */
const createJsonApiResource = (type, id, attributes, relationships) => {
    const resource = {
        type,
        id,
        attributes,
    };
    if (relationships) {
        resource.relationships = relationships;
    }
    return {
        data: resource,
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
};
exports.createJsonApiResource = createJsonApiResource;
/**
 * Creates a JSON:API formatted collection response.
 *
 * @param {string} type - Resource type
 * @param {Array<{ id: string; attributes: Record<string, any> }>} items - Collection items
 * @param {JsonApiResource[]} [included] - Included related resources
 * @returns {JsonApiResponse} JSON:API collection response
 *
 * @example
 * ```typescript
 * const response = createJsonApiCollection('patients', [
 *   { id: '123', attributes: { name: 'John' } },
 *   { id: '456', attributes: { name: 'Jane' } }
 * ]);
 * ```
 */
const createJsonApiCollection = (type, items, included) => {
    const data = items.map(item => ({
        type,
        id: item.id,
        attributes: item.attributes,
    }));
    const response = {
        data,
        meta: {
            timestamp: new Date().toISOString(),
            count: items.length,
        },
    };
    if (included && included.length > 0) {
        response.included = included;
    }
    return response;
};
exports.createJsonApiCollection = createJsonApiCollection;
/**
 * Creates a JSON:API error response.
 *
 * @param {string} code - Error code
 * @param {string} title - Error title
 * @param {string} detail - Error detail
 * @param {number} [status] - HTTP status code
 * @returns {object} JSON:API error response
 *
 * @example
 * ```typescript
 * const error = createJsonApiError('VALIDATION_ERROR', 'Validation Failed', 'Email is required', 400);
 * ```
 */
const createJsonApiError = (code, title, detail, status) => {
    return {
        errors: [
            {
                code,
                status: status?.toString(),
                title,
                detail,
                meta: {
                    timestamp: new Date().toISOString(),
                },
            },
        ],
    };
};
exports.createJsonApiError = createJsonApiError;
// ============================================================================
// HAL FORMAT HELPERS
// ============================================================================
/**
 * Creates a HAL formatted resource.
 *
 * @param {Record<string, any>} data - Resource data
 * @param {HateoasLinks} links - HAL links
 * @param {Record<string, any>} [embedded] - Embedded resources
 * @returns {HalResource} HAL formatted resource
 *
 * @example
 * ```typescript
 * const halResource = createHalResource(
 *   { id: '123', name: 'John Doe' },
 *   { self: '/api/patients/123' },
 *   { appointments: [{ id: '456', date: '2024-01-15' }] }
 * );
 * ```
 */
const createHalResource = (data, links, embedded) => {
    const resource = {
        ...data,
        _links: links,
    };
    if (embedded) {
        resource._embedded = embedded;
    }
    return resource;
};
exports.createHalResource = createHalResource;
/**
 * Creates a HAL collection resource.
 *
 * @param {any[]} items - Collection items
 * @param {HateoasLinks} links - Collection links
 * @param {number} [total] - Total items count
 * @returns {HalResource} HAL collection
 *
 * @example
 * ```typescript
 * const halCollection = createHalCollection(
 *   patients,
 *   { self: '/api/patients', next: '/api/patients?page=2' },
 *   150
 * );
 * ```
 */
const createHalCollection = (items, links, total) => {
    return {
        _links: links,
        _embedded: {
            items,
        },
        total,
        count: items.length,
    };
};
exports.createHalCollection = createHalCollection;
// ============================================================================
// RESPONSE METADATA INJECTION
// ============================================================================
/**
 * Adds metadata to any response object.
 *
 * @template T
 * @param {T} response - Response object
 * @param {Partial<ResponseMetadata>} metadata - Metadata to add
 * @returns {T & { metadata: ResponseMetadata }} Response with metadata
 *
 * @example
 * ```typescript
 * const response = addMetadata(
 *   { data: patients },
 *   { requestId: 'req_12345', duration: 45 }
 * );
 * ```
 */
const addMetadata = (response, metadata) => {
    return {
        ...response,
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata,
        },
    };
};
exports.addMetadata = addMetadata;
/**
 * Adds request tracking metadata.
 *
 * @template T
 * @param {T} response - Response object
 * @param {string} requestId - Request ID
 * @param {number} [duration] - Request duration in ms
 * @returns {T & { metadata: ResponseMetadata }} Response with tracking metadata
 *
 * @example
 * ```typescript
 * const response = addRequestTracking(data, 'req_12345', 125);
 * ```
 */
const addRequestTracking = (response, requestId, duration) => {
    return (0, exports.addMetadata)(response, { requestId, duration });
};
exports.addRequestTracking = addRequestTracking;
/**
 * Adds version metadata to response.
 *
 * @template T
 * @param {T} response - Response object
 * @param {string} version - API version
 * @returns {T & { metadata: ResponseMetadata }} Response with version metadata
 *
 * @example
 * ```typescript
 * const response = addVersionMetadata(data, '2.0');
 * ```
 */
const addVersionMetadata = (response, version) => {
    return (0, exports.addMetadata)(response, { version });
};
exports.addVersionMetadata = addVersionMetadata;
// ============================================================================
// STATUS CODE HELPERS
// ============================================================================
/**
 * Gets standard status code mappings.
 *
 * @returns {StatusCodeMapping} Status code mapping object
 *
 * @example
 * ```typescript
 * const codes = getStatusCodes();
 * console.log(codes.success); // 200
 * console.log(codes.created); // 201
 * ```
 */
const getStatusCodes = () => {
    return {
        success: 200,
        created: 201,
        noContent: 204,
        badRequest: 400,
        unauthorized: 401,
        forbidden: 403,
        notFound: 404,
        conflict: 409,
        internalError: 500,
    };
};
exports.getStatusCodes = getStatusCodes;
/**
 * Determines appropriate status code based on operation.
 *
 * @param {'create' | 'read' | 'update' | 'delete' | 'list'} operation - Operation type
 * @returns {number} HTTP status code
 *
 * @example
 * ```typescript
 * const code = getStatusCodeForOperation('create'); // 201
 * const code = getStatusCodeForOperation('delete'); // 204
 * ```
 */
const getStatusCodeForOperation = (operation) => {
    const statusMap = {
        create: 201,
        read: 200,
        update: 200,
        delete: 204,
        list: 200,
    };
    return statusMap[operation];
};
exports.getStatusCodeForOperation = getStatusCodeForOperation;
// ============================================================================
// CONTENT NEGOTIATION
// ============================================================================
/**
 * Formats response based on Accept header.
 *
 * @param {any} data - Response data
 * @param {string} acceptHeader - Accept header value
 * @returns {any} Formatted response
 *
 * @example
 * ```typescript
 * const formatted = formatResponseByContentType(
 *   patients,
 *   'application/vnd.api+json'
 * );
 * // Returns JSON:API formatted response
 * ```
 */
const formatResponseByContentType = (data, acceptHeader) => {
    if (acceptHeader.includes('application/vnd.api+json')) {
        // JSON:API format
        return (0, exports.createJsonApiResource)(data.type, data.id, data.attributes);
    }
    else if (acceptHeader.includes('application/hal+json')) {
        // HAL format
        return (0, exports.createHalResource)(data, data._links);
    }
    else {
        // Default JSON format
        return (0, exports.createSuccessResponse)(data);
    }
};
exports.formatResponseByContentType = formatResponseByContentType;
// ============================================================================
// RESPONSE FILTERING
// ============================================================================
/**
 * Filters response fields based on query parameter.
 *
 * @template T
 * @param {T} data - Response data
 * @param {string[]} fields - Fields to include
 * @returns {Partial<T>} Filtered data
 *
 * @example
 * ```typescript
 * const filtered = filterResponseFields(
 *   { id: '123', name: 'John', email: 'john@example.com', ssn: '123-45-6789' },
 *   ['id', 'name', 'email']
 * );
 * // Result: { id: '123', name: 'John', email: 'john@example.com' }
 * ```
 */
const filterResponseFields = (data, fields) => {
    if (Array.isArray(data)) {
        return data.map(item => (0, exports.filterResponseFields)(item, fields));
    }
    return Object.keys(data)
        .filter(key => fields.includes(key))
        .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
    }, {});
};
exports.filterResponseFields = filterResponseFields;
/**
 * Excludes sensitive fields from response.
 *
 * @template T
 * @param {T} data - Response data
 * @param {string[]} sensitiveFields - Fields to exclude
 * @returns {Partial<T>} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = excludeSensitiveFields(
 *   patient,
 *   ['ssn', 'medicalRecordNumber', 'insuranceId']
 * );
 * ```
 */
const excludeSensitiveFields = (data, sensitiveFields) => {
    if (Array.isArray(data)) {
        return data.map(item => (0, exports.excludeSensitiveFields)(item, sensitiveFields));
    }
    return Object.keys(data)
        .filter(key => !sensitiveFields.includes(key))
        .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
    }, {});
};
exports.excludeSensitiveFields = excludeSensitiveFields;
// ============================================================================
// PARTIAL RESPONSE SUPPORT
// ============================================================================
/**
 * Implements sparse fieldsets (JSON:API spec).
 *
 * @param {any} data - Response data
 * @param {Record<string, string[]>} fieldsets - Fieldsets by resource type
 * @returns {any} Data with sparse fieldsets applied
 *
 * @example
 * ```typescript
 * const sparse = applySparseFieldsets(
 *   { type: 'patients', id: '123', attributes: { name: 'John', age: 35, ssn: '...' } },
 *   { patients: ['name', 'age'] }
 * );
 * ```
 */
const applySparseFieldsets = (data, fieldsets) => {
    if (Array.isArray(data)) {
        return data.map(item => (0, exports.applySparseFieldsets)(item, fieldsets));
    }
    if (data.type && fieldsets[data.type]) {
        const allowedFields = fieldsets[data.type];
        data.attributes = (0, exports.filterResponseFields)(data.attributes, allowedFields);
    }
    return data;
};
exports.applySparseFieldsets = applySparseFieldsets;
// ============================================================================
// RESPONSE TRANSFORMATION PIPES
// ============================================================================
/**
 * Transforms response data keys to camelCase.
 *
 * @param {any} data - Response data
 * @returns {any} Transformed data
 *
 * @example
 * ```typescript
 * const camelCased = transformToCamelCase({
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   patient_id: '123'
 * });
 * // Result: { firstName: 'John', lastName: 'Doe', patientId: '123' }
 * ```
 */
const transformToCamelCase = (data) => {
    if (Array.isArray(data)) {
        return data.map(exports.transformToCamelCase);
    }
    if (data && typeof data === 'object') {
        return Object.keys(data).reduce((acc, key) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            acc[camelKey] = (0, exports.transformToCamelCase)(data[key]);
            return acc;
        }, {});
    }
    return data;
};
exports.transformToCamelCase = transformToCamelCase;
/**
 * Transforms response data keys to snake_case.
 *
 * @param {any} data - Response data
 * @returns {any} Transformed data
 *
 * @example
 * ```typescript
 * const snakeCased = transformToSnakeCase({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   patientId: '123'
 * });
 * // Result: { first_name: 'John', last_name: 'Doe', patient_id: '123' }
 * ```
 */
const transformToSnakeCase = (data) => {
    if (Array.isArray(data)) {
        return data.map(exports.transformToSnakeCase);
    }
    if (data && typeof data === 'object') {
        return Object.keys(data).reduce((acc, key) => {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            acc[snakeKey] = (0, exports.transformToSnakeCase)(data[key]);
            return acc;
        }, {});
    }
    return data;
};
exports.transformToSnakeCase = transformToSnakeCase;
/**
 * Wraps response data in envelope format.
 *
 * @template T
 * @param {T} data - Response data
 * @param {string} [envelopeKey] - Key for data envelope (default: 'data')
 * @returns {object} Enveloped response
 *
 * @example
 * ```typescript
 * const enveloped = wrapInEnvelope(patients, 'patients');
 * // Result: { patients: [...] }
 * ```
 */
const wrapInEnvelope = (data, envelopeKey = 'data') => {
    return {
        [envelopeKey]: data,
        metadata: {
            timestamp: new Date().toISOString(),
        },
    };
};
exports.wrapInEnvelope = wrapInEnvelope;
exports.default = {
    // Success responses
    createSuccessResponse: exports.createSuccessResponse,
    createSuccessResponseWithLinks: exports.createSuccessResponseWithLinks,
    createCreatedResponse: exports.createCreatedResponse,
    createNoContentResponse: exports.createNoContentResponse,
    createAcceptedResponse: exports.createAcceptedResponse,
    // Error responses
    createErrorResponse: exports.createErrorResponse,
    createValidationErrorResponse: exports.createValidationErrorResponse,
    createNotFoundResponse: exports.createNotFoundResponse,
    createUnauthorizedResponse: exports.createUnauthorizedResponse,
    createForbiddenResponse: exports.createForbiddenResponse,
    createConflictResponse: exports.createConflictResponse,
    createInternalServerErrorResponse: exports.createInternalServerErrorResponse,
    // Pagination
    createPaginatedResponse: exports.createPaginatedResponse,
    createPaginationLinks: exports.createPaginationLinks,
    calculatePaginationMeta: exports.calculatePaginationMeta,
    createCursorPaginatedResponse: exports.createCursorPaginatedResponse,
    // HATEOAS
    generateResourceLinks: exports.generateResourceLinks,
    generateCollectionLinks: exports.generateCollectionLinks,
    addCustomLinks: exports.addCustomLinks,
    generateRelationshipLinks: exports.generateRelationshipLinks,
    // JSON:API
    createJsonApiResource: exports.createJsonApiResource,
    createJsonApiCollection: exports.createJsonApiCollection,
    createJsonApiError: exports.createJsonApiError,
    // HAL
    createHalResource: exports.createHalResource,
    createHalCollection: exports.createHalCollection,
    // Metadata
    addMetadata: exports.addMetadata,
    addRequestTracking: exports.addRequestTracking,
    addVersionMetadata: exports.addVersionMetadata,
    // Status codes
    getStatusCodes: exports.getStatusCodes,
    getStatusCodeForOperation: exports.getStatusCodeForOperation,
    // Content negotiation
    formatResponseByContentType: exports.formatResponseByContentType,
    // Filtering
    filterResponseFields: exports.filterResponseFields,
    excludeSensitiveFields: exports.excludeSensitiveFields,
    applySparseFieldsets: exports.applySparseFieldsets,
    // Transformation
    transformToCamelCase: exports.transformToCamelCase,
    transformToSnakeCase: exports.transformToSnakeCase,
    wrapInEnvelope: exports.wrapInEnvelope,
};
//# sourceMappingURL=response-formatting-utils.js.map