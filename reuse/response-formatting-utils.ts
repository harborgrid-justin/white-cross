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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  data: { type: string; id: string } | { type: string; id: string }[] | null;
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
export const createSuccessResponse = <T>(
  data: T,
  metadata?: Partial<ResponseMetadata>,
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
};

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
export const createSuccessResponseWithLinks = <T>(
  data: T,
  links: HateoasLinks,
  metadata?: Partial<ResponseMetadata>,
): SuccessResponse<T> => {
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
export const createCreatedResponse = <T>(
  data: T,
  location: string,
  metadata?: Partial<ResponseMetadata>,
): SuccessResponse<T> & { location: string } => {
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
export const createNoContentResponse = (): object => {
  return {};
};

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
export const createAcceptedResponse = (
  jobId: string,
  statusUrl: string,
  metadata?: Partial<ResponseMetadata>,
): SuccessResponse<any> => {
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
export const createErrorResponse = (
  code: string,
  message: string,
  details?: any,
  path?: string,
  requestId?: string,
): ErrorResponse => {
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
export const createValidationErrorResponse = (
  validationErrors: Record<string, string[]>,
  requestId?: string,
): ErrorResponse => {
  return createErrorResponse(
    'VALIDATION_ERROR',
    'Validation failed',
    { fields: validationErrors },
    undefined,
    requestId,
  );
};

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
export const createNotFoundResponse = (
  resourceType: string,
  resourceId: string,
  requestId?: string,
): ErrorResponse => {
  return createErrorResponse(
    'NOT_FOUND',
    `${resourceType} with ID ${resourceId} not found`,
    { resourceType, resourceId },
    undefined,
    requestId,
  );
};

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
export const createUnauthorizedResponse = (
  message: string = 'Unauthorized access',
  requestId?: string,
): ErrorResponse => {
  return createErrorResponse('UNAUTHORIZED', message, undefined, undefined, requestId);
};

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
export const createForbiddenResponse = (
  message: string = 'Access forbidden',
  requestId?: string,
): ErrorResponse => {
  return createErrorResponse('FORBIDDEN', message, undefined, undefined, requestId);
};

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
export const createConflictResponse = (
  message: string,
  details?: any,
  requestId?: string,
): ErrorResponse => {
  return createErrorResponse('CONFLICT', message, details, undefined, requestId);
};

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
export const createInternalServerErrorResponse = (
  message: string = 'Internal server error',
  details?: any,
  requestId?: string,
): ErrorResponse => {
  return createErrorResponse('INTERNAL_ERROR', message, details, undefined, requestId);
};

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
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  baseUrl: string,
): PaginatedResponse<T> => {
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
    links: createPaginationLinks(baseUrl, page, totalPages),
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
};

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
export const createPaginationLinks = (
  baseUrl: string,
  currentPage: number,
  totalPages: number,
): PaginationLinks => {
  const links: PaginationLinks = {
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
export const calculatePaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => {
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
export const createCursorPaginatedResponse = <T>(
  data: T[],
  nextCursor: string | null,
  prevCursor: string | null,
  baseUrl: string,
): object => {
  const links: any = {
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
export const generateResourceLinks = (
  resourceType: string,
  resourceId: string,
  baseUrl: string = '/api',
): HateoasLinks => {
  const resourcePath = `${baseUrl}/${resourceType}/${resourceId}`;

  return {
    self: resourcePath,
    update: resourcePath,
    delete: resourcePath,
    collection: `${baseUrl}/${resourceType}`,
  };
};

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
export const generateCollectionLinks = (
  resourceType: string,
  baseUrl: string = '/api',
): HateoasLinks => {
  const collectionPath = `${baseUrl}/${resourceType}`;

  return {
    self: collectionPath,
    create: collectionPath,
  };
};

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
export const addCustomLinks = (
  existingLinks: HateoasLinks,
  customLinks: Record<string, string>,
): HateoasLinks => {
  return { ...existingLinks, ...customLinks };
};

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
export const generateRelationshipLinks = (
  parentType: string,
  parentId: string,
  childType: string,
  baseUrl: string = '/api',
): HateoasLinks => {
  const relationshipPath = `${baseUrl}/${parentType}/${parentId}/${childType}`;

  return {
    self: relationshipPath,
    parent: `${baseUrl}/${parentType}/${parentId}`,
  };
};

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
export const createJsonApiResource = (
  type: string,
  id: string,
  attributes: Record<string, any>,
  relationships?: Record<string, JsonApiRelationship>,
): JsonApiResponse => {
  const resource: JsonApiResource = {
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
export const createJsonApiCollection = (
  type: string,
  items: Array<{ id: string; attributes: Record<string, any> }>,
  included?: JsonApiResource[],
): JsonApiResponse => {
  const data = items.map(item => ({
    type,
    id: item.id,
    attributes: item.attributes,
  }));

  const response: JsonApiResponse = {
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
export const createJsonApiError = (
  code: string,
  title: string,
  detail: string,
  status?: number,
): object => {
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
export const createHalResource = (
  data: Record<string, any>,
  links: HateoasLinks,
  embedded?: Record<string, any>,
): HalResource => {
  const resource: HalResource = {
    ...data,
    _links: links,
  };

  if (embedded) {
    resource._embedded = embedded;
  }

  return resource;
};

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
export const createHalCollection = (
  items: any[],
  links: HateoasLinks,
  total?: number,
): HalResource => {
  return {
    _links: links,
    _embedded: {
      items,
    },
    total,
    count: items.length,
  };
};

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
export const addMetadata = <T>(
  response: T,
  metadata: Partial<ResponseMetadata>,
): T & { metadata: ResponseMetadata } => {
  return {
    ...response,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
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
export const addRequestTracking = <T>(
  response: T,
  requestId: string,
  duration?: number,
): T & { metadata: ResponseMetadata } => {
  return addMetadata(response, { requestId, duration });
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
export const addVersionMetadata = <T>(
  response: T,
  version: string,
): T & { metadata: ResponseMetadata } => {
  return addMetadata(response, { version });
};

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
export const getStatusCodes = (): StatusCodeMapping => {
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
export const getStatusCodeForOperation = (
  operation: 'create' | 'read' | 'update' | 'delete' | 'list',
): number => {
  const statusMap = {
    create: 201,
    read: 200,
    update: 200,
    delete: 204,
    list: 200,
  };

  return statusMap[operation];
};

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
export const formatResponseByContentType = (
  data: any,
  acceptHeader: string,
): any => {
  if (acceptHeader.includes('application/vnd.api+json')) {
    // JSON:API format
    return createJsonApiResource(data.type, data.id, data.attributes);
  } else if (acceptHeader.includes('application/hal+json')) {
    // HAL format
    return createHalResource(data, data._links);
  } else {
    // Default JSON format
    return createSuccessResponse(data);
  }
};

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
export const filterResponseFields = <T extends Record<string, any>>(
  data: T,
  fields: string[],
): Partial<T> => {
  if (Array.isArray(data)) {
    return data.map(item => filterResponseFields(item, fields)) as any;
  }

  return Object.keys(data)
    .filter(key => fields.includes(key))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Partial<T>);
};

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
export const excludeSensitiveFields = <T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[],
): Partial<T> => {
  if (Array.isArray(data)) {
    return data.map(item => excludeSensitiveFields(item, sensitiveFields)) as any;
  }

  return Object.keys(data)
    .filter(key => !sensitiveFields.includes(key))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Partial<T>);
};

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
export const applySparseFieldsets = (
  data: any,
  fieldsets: Record<string, string[]>,
): any => {
  if (Array.isArray(data)) {
    return data.map(item => applySparseFieldsets(item, fieldsets));
  }

  if (data.type && fieldsets[data.type]) {
    const allowedFields = fieldsets[data.type];
    data.attributes = filterResponseFields(data.attributes, allowedFields);
  }

  return data;
};

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
export const transformToCamelCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(transformToCamelCase);
  }

  if (data && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = transformToCamelCase(data[key]);
      return acc;
    }, {} as any);
  }

  return data;
};

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
export const transformToSnakeCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(transformToSnakeCase);
  }

  if (data && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = transformToSnakeCase(data[key]);
      return acc;
    }, {} as any);
  }

  return data;
};

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
export const wrapInEnvelope = <T>(
  data: T,
  envelopeKey: string = 'data',
): object => {
  return {
    [envelopeKey]: data,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
};

export default {
  // Success responses
  createSuccessResponse,
  createSuccessResponseWithLinks,
  createCreatedResponse,
  createNoContentResponse,
  createAcceptedResponse,

  // Error responses
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  createUnauthorizedResponse,
  createForbiddenResponse,
  createConflictResponse,
  createInternalServerErrorResponse,

  // Pagination
  createPaginatedResponse,
  createPaginationLinks,
  calculatePaginationMeta,
  createCursorPaginatedResponse,

  // HATEOAS
  generateResourceLinks,
  generateCollectionLinks,
  addCustomLinks,
  generateRelationshipLinks,

  // JSON:API
  createJsonApiResource,
  createJsonApiCollection,
  createJsonApiError,

  // HAL
  createHalResource,
  createHalCollection,

  // Metadata
  addMetadata,
  addRequestTracking,
  addVersionMetadata,

  // Status codes
  getStatusCodes,
  getStatusCodeForOperation,

  // Content negotiation
  formatResponseByContentType,

  // Filtering
  filterResponseFields,
  excludeSensitiveFields,
  applySparseFieldsets,

  // Transformation
  transformToCamelCase,
  transformToSnakeCase,
  wrapInEnvelope,
};
