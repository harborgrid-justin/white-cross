/**
 * OpenAPI Response Formatters
 *
 * Enterprise-ready utilities for standardizing API response formats, error schemas,
 * pagination, HATEOAS links, content negotiation, and response transformation.
 *
 * @module openapi-response-formatters
 * @version 1.0.0
 */

import { SchemaObject } from '@nestjs/swagger';

/**
 * Type definitions for response formatting
 */

export interface StandardResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorDetails;
  metadata?: ResponseMetadata;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

export interface ResponseMetadata {
  timestamp: string;
  version: string;
  requestId?: string;
  duration?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HateoasLink {
  href: string;
  rel: string;
  method?: string;
  type?: string;
}

// ============================================================================
// SUCCESS RESPONSE FORMATTERS (6 functions)
// ============================================================================

/**
 * Formats a standard success response.
 *
 * @param data - Response data
 * @param metadata - Optional response metadata
 * @returns Formatted success response
 *
 * @example
 * ```typescript
 * const response = formatSuccessResponse({ id: '123', name: 'John' });
 * // Returns: { success: true, data: {...}, metadata: {...} }
 * ```
 */
export function formatSuccessResponse<T>(
  data: T,
  metadata?: Partial<ResponseMetadata>
): StandardResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...metadata,
    },
  };
}

/**
 * Formats a resource creation (201) response.
 *
 * @param data - Created resource data
 * @param resourceId - ID of created resource
 * @param location - Optional resource location URL
 * @returns Formatted creation response
 *
 * @example
 * ```typescript
 * const response = formatCreatedResponse(user, '123', '/api/users/123');
 * ```
 */
export function formatCreatedResponse<T>(
  data: T,
  resourceId: string,
  location?: string
): StandardResponse<T> & { id: string; location?: string } {
  return {
    success: true,
    data,
    id: resourceId,
    location: location || '/api/resource/' + resourceId,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a no content (204) response.
 *
 * @returns Formatted no content response
 *
 * @example
 * ```typescript
 * return formatNoContentResponse();
 * ```
 */
export function formatNoContentResponse(): { success: boolean; metadata: ResponseMetadata } {
  return {
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats an accepted (202) async operation response.
 *
 * @param jobId - Background job ID
 * @param statusUrl - URL to check job status
 * @returns Formatted accepted response
 *
 * @example
 * ```typescript
 * const response = formatAcceptedResponse('job-123', '/api/jobs/job-123/status');
 * ```
 */
export function formatAcceptedResponse(
  jobId: string,
  statusUrl: string
): StandardResponse<{ jobId: string; statusUrl: string }> {
  return {
    success: true,
    data: {
      jobId,
      statusUrl,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a bulk operation response.
 *
 * @param results - Array of operation results
 * @returns Formatted bulk response
 *
 * @example
 * ```typescript
 * const response = formatBulkResponse([
 *   { success: true, data: user1, index: 0 },
 *   { success: false, error: 'Validation failed', index: 1 }
 * ]);
 * ```
 */
export function formatBulkResponse<T>(
  results: Array<{ success: boolean; data?: T; error?: string; index: number }>
): {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  results: typeof results;
  metadata: ResponseMetadata;
} {
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  return {
    success: failureCount === 0,
    totalProcessed: results.length,
    successCount,
    failureCount,
    results,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a partial content (206) response.
 *
 * @param data - Partial data
 * @param range - Range information
 * @returns Formatted partial content response
 *
 * @example
 * ```typescript
 * const response = formatPartialContentResponse(dataChunk, { start: 0, end: 99, total: 1000 });
 * ```
 */
export function formatPartialContentResponse<T>(
  data: T,
  range: { start: number; end: number; total: number }
): StandardResponse<T> & { range: typeof range } {
  return {
    success: true,
    data,
    range,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

// ============================================================================
// ERROR RESPONSE FORMATTERS (6 functions)
// ============================================================================

/**
 * Formats a standard error response.
 *
 * @param code - Error code
 * @param message - Error message
 * @param details - Optional error details
 * @param statusCode - HTTP status code
 * @returns Formatted error response
 *
 * @example
 * ```typescript
 * const error = formatErrorResponse('INTERNAL_ERROR', 'Server error occurred', null, 500);
 * ```
 */
export function formatErrorResponse(
  code: string,
  message: string,
  details?: any,
  statusCode: number = 500
): StandardResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a validation error response (400).
 *
 * @param validationErrors - Array of validation errors
 * @returns Formatted validation error response
 *
 * @example
 * ```typescript
 * const error = formatValidationErrorResponse([
 *   { field: 'email', message: 'Invalid email format', constraint: 'isEmail' }
 * ]);
 * ```
 */
export function formatValidationErrorResponse(
  validationErrors: Array<{ field: string; message: string; constraint?: string }>
): StandardResponse {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: {
        errors: validationErrors,
      },
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a not found error response (404).
 *
 * @param resource - Resource type
 * @param identifier - Resource identifier
 * @returns Formatted not found error
 *
 * @example
 * ```typescript
 * const error = formatNotFoundErrorResponse('User', '123');
 * ```
 */
export function formatNotFoundErrorResponse(
  resource: string,
  identifier: string
): StandardResponse {
  return {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: resource + ' with identifier \'' + identifier + '\' not found',
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats an unauthorized error response (401).
 *
 * @param reason - Optional reason for unauthorized
 * @returns Formatted unauthorized error
 *
 * @example
 * ```typescript
 * const error = formatUnauthorizedErrorResponse('Invalid token');
 * ```
 */
export function formatUnauthorizedErrorResponse(
  reason?: string
): StandardResponse {
  return {
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: reason || 'Authentication required',
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a forbidden error response (403).
 *
 * @param reason - Optional reason for forbidden
 * @returns Formatted forbidden error
 *
 * @example
 * ```typescript
 * const error = formatForbiddenErrorResponse('Insufficient permissions');
 * ```
 */
export function formatForbiddenErrorResponse(
  reason?: string
): StandardResponse {
  return {
    success: false,
    error: {
      code: 'FORBIDDEN',
      message: reason || 'Insufficient permissions',
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats a conflict error response (409).
 *
 * @param conflictingField - Field causing conflict
 * @param message - Optional custom message
 * @returns Formatted conflict error
 *
 * @example
 * ```typescript
 * const error = formatConflictErrorResponse('email', 'Email already exists');
 * ```
 */
export function formatConflictErrorResponse(
  conflictingField: string,
  message?: string
): StandardResponse {
  return {
    success: false,
    error: {
      code: 'CONFLICT',
      message: message || 'Resource conflict on field \'' + conflictingField + '\'',
      details: {
        conflictingField,
      },
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

// ============================================================================
// PAGINATION RESPONSE FORMATTERS (5 functions)
// ============================================================================

/**
 * Formats a paginated response.
 *
 * @param items - Array of items for current page
 * @param pagination - Pagination metadata
 * @returns Formatted paginated response
 *
 * @example
 * ```typescript
 * const response = formatPaginatedResponse(users, {
 *   page: 1,
 *   limit: 20,
 *   total: 100,
 *   totalPages: 5,
 *   hasNextPage: true,
 *   hasPreviousPage: false
 * });
 * ```
 */
export function formatPaginatedResponse<T>(
  items: T[],
  pagination: PaginationMeta
): {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  metadata: ResponseMetadata;
} {
  return {
    success: true,
    data: items,
    pagination,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Calculates pagination metadata.
 *
 * @param page - Current page number
 * @param limit - Items per page
 * @param totalItems - Total number of items
 * @returns Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = calculatePaginationMeta(1, 20, 100);
 * // Returns: { page: 1, limit: 20, total: 100, totalPages: 5, ... }
 * ```
 */
export function calculatePaginationMeta(
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    total: totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Generates pagination links.
 *
 * @param baseUrl - Base URL for pagination
 * @param pagination - Pagination metadata
 * @returns Pagination links object
 *
 * @example
 * ```typescript
 * const links = generatePaginationLinks('/api/users', pagination);
 * // Returns: { self: '...', first: '...', last: '...', next: '...', prev: '...' }
 * ```
 */
export function generatePaginationLinks(
  baseUrl: string,
  pagination: PaginationMeta
): {
  self: string;
  first: string;
  last: string;
  next?: string;
  prev?: string;
} {
  const pageParam = pagination.page;
  const limitParam = pagination.limit;

  const links: any = {
    self: baseUrl + '?page=' + pageParam + '&limit=' + limitParam,
    first: baseUrl + '?page=1&limit=' + limitParam,
    last: baseUrl + '?page=' + pagination.totalPages + '&limit=' + limitParam,
  };

  if (pagination.hasNextPage) {
    links.next = baseUrl + '?page=' + (pageParam + 1) + '&limit=' + limitParam;
  }

  if (pagination.hasPreviousPage) {
    links.prev = baseUrl + '?page=' + (pageParam - 1) + '&limit=' + limitParam;
  }

  return links;
}

/**
 * Formats a cursor-based paginated response.
 *
 * @param items - Array of items
 * @param cursor - Cursor information
 * @returns Formatted cursor paginated response
 *
 * @example
 * ```typescript
 * const response = formatCursorPaginatedResponse(items, {
 *   current: 'abc123',
 *   next: 'def456',
 *   prev: 'xyz789'
 * });
 * ```
 */
export function formatCursorPaginatedResponse<T>(
  items: T[],
  cursor: { current: string; next?: string; prev?: string }
): {
  success: boolean;
  data: T[];
  cursor: typeof cursor;
  metadata: ResponseMetadata;
} {
  return {
    success: true,
    data: items,
    cursor,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

/**
 * Formats an offset-based paginated response.
 *
 * @param items - Array of items
 * @param offset - Offset value
 * @param limit - Limit value
 * @param total - Total items
 * @returns Formatted offset paginated response
 *
 * @example
 * ```typescript
 * const response = formatOffsetPaginatedResponse(items, 40, 20, 100);
 * ```
 */
export function formatOffsetPaginatedResponse<T>(
  items: T[],
  offset: number,
  limit: number,
  total: number
): {
  success: boolean;
  data: T[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  metadata: ResponseMetadata;
} {
  return {
    success: true,
    data: items,
    pagination: {
      offset,
      limit,
      total,
      hasMore: offset + limit < total,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

// ============================================================================
// HYPERMEDIA/HATEOAS FORMATTERS (5 functions)
// ============================================================================

/**
 * Adds HATEOAS links to response data.
 *
 * @param data - Response data
 * @param links - Array of HATEOAS links
 * @returns Data with _links property
 *
 * @example
 * ```typescript
 * const enriched = addHateoasLinks(user, [
 *   { href: '/api/users/123', rel: 'self', method: 'GET' },
 *   { href: '/api/users/123/orders', rel: 'orders', method: 'GET' }
 * ]);
 * ```
 */
export function addHateoasLinks<T>(
  data: T,
  links: HateoasLink[]
): T & { _links: Record<string, HateoasLink> } {
  const _links: Record<string, HateoasLink> = {};

  links.forEach(link => {
    _links[link.rel] = link;
  });

  return {
    ...(data as any),
    _links,
  };
}

/**
 * Generates a self link for a resource.
 *
 * @param resourceUrl - Resource URL
 * @param method - HTTP method (default: GET)
 * @returns Self link object
 *
 * @example
 * ```typescript
 * const selfLink = generateSelfLink('/api/users/123');
 * ```
 */
export function generateSelfLink(
  resourceUrl: string,
  method: string = 'GET'
): HateoasLink {
  return {
    href: resourceUrl,
    rel: 'self',
    method,
  };
}

/**
 * Generates standard CRUD links for a collection item.
 *
 * @param baseUrl - Base collection URL
 * @param itemId - Item identifier
 * @returns Array of CRUD links
 *
 * @example
 * ```typescript
 * const links = generateCollectionLinks('/api/users', '123');
 * // Returns: [{ self }, { update }, { delete }, { collection }]
 * ```
 */
export function generateCollectionLinks(
  baseUrl: string,
  itemId: string
): HateoasLink[] {
  return [
    {
      href: baseUrl + '/' + itemId,
      rel: 'self',
      method: 'GET',
    },
    {
      href: baseUrl + '/' + itemId,
      rel: 'update',
      method: 'PUT',
    },
    {
      href: baseUrl + '/' + itemId,
      rel: 'delete',
      method: 'DELETE',
    },
    {
      href: baseUrl,
      rel: 'collection',
      method: 'GET',
    },
  ];
}

/**
 * Generates related resource links.
 *
 * @param data - Resource data
 * @param baseUrl - Base API URL
 * @param relations - Relation configurations
 * @returns Array of related links
 *
 * @example
 * ```typescript
 * const links = generateRelatedLinks(order, '/api', [
 *   { field: 'userId', endpoint: '/users', rel: 'user' },
 *   { field: 'productId', endpoint: '/products', rel: 'product' }
 * ]);
 * ```
 */
export function generateRelatedLinks<T extends Record<string, any>>(
  data: T,
  baseUrl: string,
  relations: Array<{ field: string; endpoint: string; rel: string }>
): HateoasLink[] {
  const links: HateoasLink[] = [];

  relations.forEach(relation => {
    if (data[relation.field]) {
      links.push({
        href: baseUrl + relation.endpoint + '/' + data[relation.field],
        rel: relation.rel,
        method: 'GET',
      });
    }
  });

  return links;
}

/**
 * Formats response with hypermedia links.
 *
 * @param data - Response data
 * @param selfUrl - Self URL
 * @param additionalLinks - Additional links to include
 * @returns Formatted hypermedia response
 *
 * @example
 * ```typescript
 * const response = formatHypermediaResponse(user, '/api/users/123', [
 *   { href: '/api/users/123/orders', rel: 'orders', method: 'GET' }
 * ]);
 * ```
 */
export function formatHypermediaResponse<T>(
  data: T,
  selfUrl: string,
  additionalLinks: HateoasLink[] = []
): StandardResponse<T & { _links: Record<string, HateoasLink> }> {
  const selfLink = generateSelfLink(selfUrl);
  const allLinks = [selfLink, ...additionalLinks];

  return {
    success: true,
    data: addHateoasLinks(data, allLinks),
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

// ============================================================================
// CONTENT NEGOTIATION (5 functions)
// ============================================================================

/**
 * Formats response based on content type.
 *
 * @param data - Response data
 * @param contentType - Requested content type
 * @returns Formatted data in requested format
 *
 * @example
 * ```typescript
 * const formatted = formatResponseByContentType(data, 'application/xml');
 * ```
 */
export function formatResponseByContentType<T>(
  data: T,
  contentType: string
): string | Buffer | T {
  if (contentType.includes('application/json')) {
    return data;
  }

  if (contentType.includes('application/xml')) {
    return convertToXML(data);
  }

  if (contentType.includes('text/csv')) {
    return convertToCSV(data);
  }

  if (contentType.includes('text/yaml')) {
    return convertToYAML(data);
  }

  return data;
}

/**
 * Converts data to XML format.
 *
 * @param data - Data to convert
 * @returns XML string
 *
 * @example
 * ```typescript
 * const xml = convertToXML({ name: 'John', age: 30 });
 * ```
 */
export function convertToXML(data: any): string {
  const toXML = (obj: any, indent: string = ''): string => {
    let xml = '';

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          xml += indent + '<' + key + '>\n' + toXML(value, indent + '  ') + '\n' + indent + '</' + key + '>\n';
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            xml += indent + '<' + key + '>' + item + '</' + key + '>\n';
          });
        } else {
          xml += indent + '<' + key + '>' + value + '</' + key + '>\n';
        }
      }
    }

    return xml;
  };

  return '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' + toXML(data, '  ') + '</root>';
}

/**
 * Converts data to CSV format.
 *
 * @param data - Data to convert (object or array)
 * @returns CSV string
 *
 * @example
 * ```typescript
 * const csv = convertToCSV([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);
 * ```
 */
export function convertToCSV<T extends Record<string, any>>(data: T | T[]): string {
  const items = Array.isArray(data) ? data : [data];

  if (items.length === 0) {
    return '';
  }

  const headers = Object.keys(items[0]);
  const headerRow = headers.join(',');

  const rows = items.map(item => {
    return headers.map(header => {
      const value = item[header];
      const stringValue = value === null || value === undefined ? '' : String(value);
      return stringValue.includes(',') ? '"' + stringValue + '"' : stringValue;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
}

/**
 * Converts data to YAML format.
 *
 * @param data - Data to convert
 * @returns YAML string
 *
 * @example
 * ```typescript
 * const yaml = convertToYAML({ name: 'John', age: 30 });
 * ```
 */
export function convertToYAML(data: any): string {
  const toYAML = (obj: any, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    let yaml = '';

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          yaml += spaces + key + ':\n' + toYAML(value, indent + 1);
        } else if (Array.isArray(value)) {
          yaml += spaces + key + ':\n';
          value.forEach(item => {
            yaml += spaces + '  - ' + item + '\n';
          });
        } else {
          yaml += spaces + key + ': ' + value + '\n';
        }
      }
    }

    return yaml;
  };

  return toYAML(data);
}

/**
 * Negotiates content type based on Accept header.
 *
 * @param acceptHeader - Accept header value
 * @param supportedTypes - Array of supported content types
 * @returns Best matching content type or null
 *
 * @example
 * ```typescript
 * const contentType = negotiateContentType(
 *   'application/xml, application/json;q=0.9',
 *   ['application/json', 'application/xml']
 * );
 * ```
 */
export function negotiateContentType(
  acceptHeader: string,
  supportedTypes: string[]
): string | null {
  const acceptedTypes = acceptHeader
    .split(',')
    .map(type => type.trim().split(';')[0])
    .filter(Boolean);

  for (const accepted of acceptedTypes) {
    if (supportedTypes.includes(accepted)) {
      return accepted;
    }
  }

  return null;
}

// ============================================================================
// RESPONSE COMPRESSION (5 functions)
// ============================================================================

/**
 * Compresses response data.
 *
 * @param data - Data to compress
 * @param algorithm - Compression algorithm
 * @returns Compression result with statistics
 *
 * @example
 * ```typescript
 * const result = compressResponse(largeData, 'gzip');
 * ```
 */
export function compressResponse(
  data: any,
  algorithm: 'gzip' | 'deflate' | 'br' = 'gzip'
): {
  compressed: Buffer | string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
} {
  const jsonString = JSON.stringify(data);
  const originalSize = Buffer.byteLength(jsonString);

  // In production, use actual compression libraries (zlib, brotli)
  const compressed = jsonString;
  const compressedSize = Buffer.byteLength(compressed);

  return {
    compressed,
    originalSize,
    compressedSize,
    compressionRatio: compressedSize / originalSize,
    algorithm,
  };
}

/**
 * Determines if response should be compressed.
 *
 * @param contentLength - Content length in bytes
 * @param contentType - Content type
 * @param threshold - Minimum size threshold for compression
 * @returns Whether to compress
 *
 * @example
 * ```typescript
 * const compress = shouldCompress(2048, 'application/json', 1024);
 * ```
 */
export function shouldCompress(
  contentLength: number,
  contentType: string,
  threshold: number = 1024
): boolean {
  if (contentLength < threshold) {
    return false;
  }

  const compressibleTypes = [
    'application/json',
    'text/html',
    'text/plain',
    'text/css',
    'application/javascript',
    'text/xml',
  ];

  return compressibleTypes.some(type => contentType.includes(type));
}

/**
 * Adds compression-related headers to response.
 *
 * @param headers - Existing headers
 * @param algorithm - Compression algorithm used
 * @returns Updated headers
 *
 * @example
 * ```typescript
 * const headers = addCompressionHeaders({}, 'gzip');
 * ```
 */
export function addCompressionHeaders(
  headers: Record<string, string>,
  algorithm: 'gzip' | 'deflate' | 'br'
): Record<string, string> {
  return {
    ...headers,
    'Content-Encoding': algorithm,
    'Vary': 'Accept-Encoding',
  };
}

/**
 * Calculates compression statistics.
 *
 * @param originalSize - Original size in bytes
 * @param compressedSize - Compressed size in bytes
 * @returns Compression statistics
 *
 * @example
 * ```typescript
 * const stats = calculateCompressionStats(10000, 3000);
 * ```
 */
export function calculateCompressionStats(
  originalSize: number,
  compressedSize: number
): {
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  compressionRatio: number;
  savingsPercent: number;
} {
  const savedBytes = originalSize - compressedSize;
  const compressionRatio = compressedSize / originalSize;
  const savingsPercent = ((savedBytes / originalSize) * 100);

  return {
    originalSize,
    compressedSize,
    savedBytes,
    compressionRatio,
    savingsPercent: Math.round(savingsPercent * 100) / 100,
  };
}

/**
 * Selects best compression algorithm based on Accept-Encoding.
 *
 * @param acceptEncoding - Accept-Encoding header value
 * @param preferBrotli - Whether to prefer Brotli if available
 * @returns Selected algorithm or null
 *
 * @example
 * ```typescript
 * const algo = selectCompressionAlgorithm('gzip, deflate, br', true);
 * ```
 */
export function selectCompressionAlgorithm(
  acceptEncoding: string,
  preferBrotli: boolean = true
): 'gzip' | 'deflate' | 'br' | null {
  const encodings = acceptEncoding.toLowerCase().split(',').map(e => e.trim());

  if (preferBrotli && encodings.includes('br')) {
    return 'br';
  }

  if (encodings.includes('gzip')) {
    return 'gzip';
  }

  if (encodings.includes('deflate')) {
    return 'deflate';
  }

  return null;
}

// ============================================================================
// STREAMING RESPONSE FORMATTERS (4 functions)
// ============================================================================

/**
 * Formats Server-Sent Events (SSE) message.
 *
 * @param data - Event data
 * @param event - Event type
 * @param id - Event ID
 * @returns Formatted SSE message
 *
 * @example
 * ```typescript
 * const message = formatSSEMessage({ update: 'New data' }, 'update', '123');
 * ```
 */
export function formatSSEMessage<T>(
  data: T,
  event?: string,
  id?: string
): string {
  let message = '';

  if (id) {
    message += 'id: ' + id + '\n';
  }

  if (event) {
    message += 'event: ' + event + '\n';
  }

  message += 'data: ' + JSON.stringify(data) + '\n\n';

  return message;
}

/**
 * Formats data for chunked transfer encoding.
 *
 * @param chunks - Array of data chunks
 * @param chunkSize - Maximum chunk size
 * @returns Array of chunked data
 *
 * @example
 * ```typescript
 * const chunked = formatChunkedResponse(largeArray, 1000);
 * ```
 */
export function formatChunkedResponse<T>(
  chunks: T[],
  chunkSize: number = 1000
): T[][] {
  const chunked: T[][] = [];

  for (let i = 0; i < chunks.length; i += chunkSize) {
    chunked.push(chunks.slice(i, i + chunkSize));
  }

  return chunked;
}

/**
 * Formats stream metadata.
 *
 * @param streamId - Stream identifier
 * @param startTime - Stream start time
 * @returns Stream metadata object
 *
 * @example
 * ```typescript
 * const metadata = formatStreamMetadata('stream-123', new Date());
 * ```
 */
export function formatStreamMetadata(
  streamId: string,
  startTime: Date
): {
  streamId: string;
  startTime: string;
  isActive: boolean;
} {
  return {
    streamId,
    startTime: startTime.toISOString(),
    isActive: true,
  };
}

/**
 * Generates stream end message.
 *
 * @param streamId - Stream identifier
 * @param totalEvents - Total events sent
 * @param duration - Stream duration in ms
 * @returns Formatted end message
 *
 * @example
 * ```typescript
 * const endMsg = generateStreamEndMessage('stream-123', 500, 30000);
 * ```
 */
export function generateStreamEndMessage(
  streamId: string,
  totalEvents: number,
  duration: number
): string {
  return formatSSEMessage(
    {
      streamId,
      totalEvents,
      duration,
      status: 'complete',
    },
    'end'
  );
}

// ============================================================================
// RESPONSE TRANSFORMATION (4 functions)
// ============================================================================

/**
 * Transforms response object keys.
 *
 * @param data - Data to transform
 * @param transformer - Key transformation function
 * @returns Transformed data
 *
 * @example
 * ```typescript
 * const camelCase = (key: string) => key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
 * const transformed = transformResponseKeys(data, camelCase);
 * ```
 */
export function transformResponseKeys<T extends Record<string, any>>(
  data: T,
  transformer: (key: string) => string
): Record<string, any> {
  if (Array.isArray(data)) {
    return data.map(item => transformResponseKeys(item, transformer)) as any;
  }

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const transformed: Record<string, any> = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = transformer(key);
      const value = data[key];
      transformed[newKey] = typeof value === 'object' && value !== null
        ? transformResponseKeys(value, transformer)
        : value;
    }
  }

  return transformed;
}

/**
 * Filters response to include only specified fields.
 *
 * @param data - Data to filter
 * @param fields - Array of field names to include
 * @returns Filtered data
 *
 * @example
 * ```typescript
 * const filtered = filterResponseFields(user, ['id', 'name', 'email']);
 * ```
 */
export function filterResponseFields<T extends Record<string, any>>(
  data: T,
  fields: string[]
): Partial<T> {
  if (Array.isArray(data)) {
    return data.map(item => filterResponseFields(item, fields)) as any;
  }

  const filtered: Partial<T> = {};

  fields.forEach(field => {
    if (field in data) {
      filtered[field as keyof T] = data[field];
    }
  });

  return filtered;
}

/**
 * Enriches response data with computed fields.
 *
 * @param data - Data to enrich
 * @param enrichments - Map of field names to enrichment functions
 * @returns Enriched data
 *
 * @example
 * ```typescript
 * const enriched = enrichResponseData(user, {
 *   fullName: (data) => data.firstName + ' ' + data.lastName,
 *   isAdult: (data) => data.age >= 18
 * });
 * ```
 */
export function enrichResponseData<T extends Record<string, any>>(
  data: T,
  enrichments: Record<string, (data: T) => any>
): T & Record<string, any> {
  const enriched: any = { ...data };

  for (const key in enrichments) {
    if (enrichments.hasOwnProperty(key)) {
      enriched[key] = enrichments[key](data);
    }
  }

  return enriched;
}

/**
 * Sanitizes response by redacting sensitive fields.
 *
 * @param data - Data to sanitize
 * @param sensitiveFields - Array of sensitive field names
 * @returns Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeResponseData(user, ['password', 'ssn', 'creditCard']);
 * ```
 */
export function sanitizeResponseData<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[]
): T {
  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponseData(item, sensitiveFields)) as any;
  }

  const sanitized: any = { ...data };

  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
}
