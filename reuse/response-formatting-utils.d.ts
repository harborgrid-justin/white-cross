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
/**
 * File: /reuse/response-formatting-utils.ts
 * Locator: WC-UTL-RES-004
 * Purpose: Response Formatting Utilities - Comprehensive API response formatting and standardization
 *
 * Upstream: Independent utility module for response formatting
 * Downstream: ../backend/*, NestJS controllers, response transformers
 * Dependencies: TypeScript 5.x, @nestjs/common
 * Exports: 42 utility functions for response formatting, pagination, HATEOAS, JSON:API, HAL
 *
 * LLM Context: Comprehensive response formatting utilities for White Cross healthcare system.
 * Provides success/error wrappers, pagination formatting, HATEOAS links, JSON:API compliance,
 * HAL format helpers, metadata injection, content negotiation, filtering, and transformation.
 * Essential for consistent API responses and healthcare data interoperability.
 */
interface SuccessResponse<T = any> {
    success: true;
    data: T;
    metadata?: ResponseMetadata;
    links?: HateoasLinks;
}
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
        path?: string;
        requestId?: string;
    };
}
interface ResponseMetadata {
    timestamp: string;
    version?: string;
    requestId?: string;
    duration?: number;
    [key: string]: any;
}
interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
interface PaginatedResponse<T = any> {
    data: T[];
    pagination: PaginationMeta;
    links?: PaginationLinks;
    metadata?: ResponseMetadata;
}
interface PaginationLinks {
    self: string;
    first: string;
    last: string;
    next?: string;
    previous?: string;
}
interface HateoasLinks {
    self: string;
    [rel: string]: string;
}
interface JsonApiResource {
    type: string;
    id: string;
    attributes: Record<string, any>;
    relationships?: Record<string, JsonApiRelationship>;
    links?: HateoasLinks;
    meta?: Record<string, any>;
}
interface JsonApiRelationship {
    data: {
        type: string;
        id: string;
    } | {
        type: string;
        id: string;
    }[] | null;
    links?: HateoasLinks;
}
interface JsonApiResponse {
    data: JsonApiResource | JsonApiResource[];
    included?: JsonApiResource[];
    meta?: Record<string, any>;
    links?: HateoasLinks;
}
interface HalResource {
    _links: HateoasLinks;
    _embedded?: Record<string, HalResource | HalResource[]>;
    [key: string]: any;
}
interface StatusCodeMapping {
    success: number;
    created: number;
    noContent: number;
    badRequest: number;
    unauthorized: number;
    forbidden: number;
    notFound: number;
    conflict: number;
    internalError: number;
}
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
export declare const createSuccessResponse: <T>(data: T, metadata?: Partial<ResponseMetadata>) => SuccessResponse<T>;
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
export declare const createSuccessResponseWithLinks: <T>(data: T, links: HateoasLinks, metadata?: Partial<ResponseMetadata>) => SuccessResponse<T>;
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
export declare const createCreatedResponse: <T>(data: T, location: string, metadata?: Partial<ResponseMetadata>) => SuccessResponse<T> & {
    location: string;
};
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
export declare const createNoContentResponse: () => object;
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
export declare const createAcceptedResponse: (jobId: string, statusUrl: string, metadata?: Partial<ResponseMetadata>) => SuccessResponse<any>;
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
export declare const createErrorResponse: (code: string, message: string, details?: any, path?: string, requestId?: string) => ErrorResponse;
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
export declare const createValidationErrorResponse: (validationErrors: Record<string, string[]>, requestId?: string) => ErrorResponse;
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
export declare const createNotFoundResponse: (resourceType: string, resourceId: string, requestId?: string) => ErrorResponse;
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
export declare const createUnauthorizedResponse: (message?: string, requestId?: string) => ErrorResponse;
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
export declare const createForbiddenResponse: (message?: string, requestId?: string) => ErrorResponse;
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
export declare const createConflictResponse: (message: string, details?: any, requestId?: string) => ErrorResponse;
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
export declare const createInternalServerErrorResponse: (message?: string, details?: any, requestId?: string) => ErrorResponse;
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
export declare const createPaginatedResponse: <T>(data: T[], page: number, limit: number, total: number, baseUrl: string) => PaginatedResponse<T>;
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
export declare const createPaginationLinks: (baseUrl: string, currentPage: number, totalPages: number) => PaginationLinks;
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
export declare const calculatePaginationMeta: (page: number, limit: number, total: number) => PaginationMeta;
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
export declare const createCursorPaginatedResponse: <T>(data: T[], nextCursor: string | null, prevCursor: string | null, baseUrl: string) => object;
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
export declare const generateResourceLinks: (resourceType: string, resourceId: string, baseUrl?: string) => HateoasLinks;
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
export declare const generateCollectionLinks: (resourceType: string, baseUrl?: string) => HateoasLinks;
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
export declare const addCustomLinks: (existingLinks: HateoasLinks, customLinks: Record<string, string>) => HateoasLinks;
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
export declare const generateRelationshipLinks: (parentType: string, parentId: string, childType: string, baseUrl?: string) => HateoasLinks;
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
export declare const createJsonApiResource: (type: string, id: string, attributes: Record<string, any>, relationships?: Record<string, JsonApiRelationship>) => JsonApiResponse;
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
export declare const createJsonApiCollection: (type: string, items: Array<{
    id: string;
    attributes: Record<string, any>;
}>, included?: JsonApiResource[]) => JsonApiResponse;
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
export declare const createJsonApiError: (code: string, title: string, detail: string, status?: number) => object;
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
export declare const createHalResource: (data: Record<string, any>, links: HateoasLinks, embedded?: Record<string, any>) => HalResource;
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
export declare const createHalCollection: (items: any[], links: HateoasLinks, total?: number) => HalResource;
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
export declare const addMetadata: <T>(response: T, metadata: Partial<ResponseMetadata>) => T & {
    metadata: ResponseMetadata;
};
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
export declare const addRequestTracking: <T>(response: T, requestId: string, duration?: number) => T & {
    metadata: ResponseMetadata;
};
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
export declare const addVersionMetadata: <T>(response: T, version: string) => T & {
    metadata: ResponseMetadata;
};
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
export declare const getStatusCodes: () => StatusCodeMapping;
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
export declare const getStatusCodeForOperation: (operation: "create" | "read" | "update" | "delete" | "list") => number;
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
export declare const formatResponseByContentType: (data: any, acceptHeader: string) => any;
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
export declare const filterResponseFields: <T extends Record<string, any>>(data: T, fields: string[]) => Partial<T>;
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
export declare const excludeSensitiveFields: <T extends Record<string, any>>(data: T, sensitiveFields: string[]) => Partial<T>;
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
export declare const applySparseFieldsets: (data: any, fieldsets: Record<string, string[]>) => any;
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
export declare const transformToCamelCase: (data: any) => any;
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
export declare const transformToSnakeCase: (data: any) => any;
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
export declare const wrapInEnvelope: <T>(data: T, envelopeKey?: string) => object;
declare const _default: {
    createSuccessResponse: <T>(data: T, metadata?: Partial<ResponseMetadata>) => SuccessResponse<T>;
    createSuccessResponseWithLinks: <T>(data: T, links: HateoasLinks, metadata?: Partial<ResponseMetadata>) => SuccessResponse<T>;
    createCreatedResponse: <T>(data: T, location: string, metadata?: Partial<ResponseMetadata>) => SuccessResponse<T> & {
        location: string;
    };
    createNoContentResponse: () => object;
    createAcceptedResponse: (jobId: string, statusUrl: string, metadata?: Partial<ResponseMetadata>) => SuccessResponse<any>;
    createErrorResponse: (code: string, message: string, details?: any, path?: string, requestId?: string) => ErrorResponse;
    createValidationErrorResponse: (validationErrors: Record<string, string[]>, requestId?: string) => ErrorResponse;
    createNotFoundResponse: (resourceType: string, resourceId: string, requestId?: string) => ErrorResponse;
    createUnauthorizedResponse: (message?: string, requestId?: string) => ErrorResponse;
    createForbiddenResponse: (message?: string, requestId?: string) => ErrorResponse;
    createConflictResponse: (message: string, details?: any, requestId?: string) => ErrorResponse;
    createInternalServerErrorResponse: (message?: string, details?: any, requestId?: string) => ErrorResponse;
    createPaginatedResponse: <T>(data: T[], page: number, limit: number, total: number, baseUrl: string) => PaginatedResponse<T>;
    createPaginationLinks: (baseUrl: string, currentPage: number, totalPages: number) => PaginationLinks;
    calculatePaginationMeta: (page: number, limit: number, total: number) => PaginationMeta;
    createCursorPaginatedResponse: <T>(data: T[], nextCursor: string | null, prevCursor: string | null, baseUrl: string) => object;
    generateResourceLinks: (resourceType: string, resourceId: string, baseUrl?: string) => HateoasLinks;
    generateCollectionLinks: (resourceType: string, baseUrl?: string) => HateoasLinks;
    addCustomLinks: (existingLinks: HateoasLinks, customLinks: Record<string, string>) => HateoasLinks;
    generateRelationshipLinks: (parentType: string, parentId: string, childType: string, baseUrl?: string) => HateoasLinks;
    createJsonApiResource: (type: string, id: string, attributes: Record<string, any>, relationships?: Record<string, JsonApiRelationship>) => JsonApiResponse;
    createJsonApiCollection: (type: string, items: Array<{
        id: string;
        attributes: Record<string, any>;
    }>, included?: JsonApiResource[]) => JsonApiResponse;
    createJsonApiError: (code: string, title: string, detail: string, status?: number) => object;
    createHalResource: (data: Record<string, any>, links: HateoasLinks, embedded?: Record<string, any>) => HalResource;
    createHalCollection: (items: any[], links: HateoasLinks, total?: number) => HalResource;
    addMetadata: <T>(response: T, metadata: Partial<ResponseMetadata>) => T & {
        metadata: ResponseMetadata;
    };
    addRequestTracking: <T>(response: T, requestId: string, duration?: number) => T & {
        metadata: ResponseMetadata;
    };
    addVersionMetadata: <T>(response: T, version: string) => T & {
        metadata: ResponseMetadata;
    };
    getStatusCodes: () => StatusCodeMapping;
    getStatusCodeForOperation: (operation: "create" | "read" | "update" | "delete" | "list") => number;
    formatResponseByContentType: (data: any, acceptHeader: string) => any;
    filterResponseFields: <T extends Record<string, any>>(data: T, fields: string[]) => Partial<T>;
    excludeSensitiveFields: <T extends Record<string, any>>(data: T, sensitiveFields: string[]) => Partial<T>;
    applySparseFieldsets: (data: any, fieldsets: Record<string, string[]>) => any;
    transformToCamelCase: (data: any) => any;
    transformToSnakeCase: (data: any) => any;
    wrapInEnvelope: <T>(data: T, envelopeKey?: string) => object;
};
export default _default;
//# sourceMappingURL=response-formatting-utils.d.ts.map