/**
 * @fileoverview Enterprise-grade API response utilities for RESTful services
 * @module reuse/data/api-response
 * @description Production-ready response formatters, error handlers, caching, HATEOAS,
 * content negotiation, and HTTP header builders following REST best practices
 */

import { Response } from 'express';
import { createHash } from 'crypto';
import { Transform } from 'stream';
import * as zlib from 'zlib';

/**
 * Standard API response envelope interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
  links?: HateoasLinks;
  timestamp: string;
  version?: string;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
  stack?: string;
}

/**
 * Response metadata for pagination and statistics
 */
export interface ResponseMetadata {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  [key: string]: any;
}

/**
 * HATEOAS links structure
 */
export interface HateoasLinks {
  self: string;
  [key: string]: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  totalItems: number;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Cache control options
 */
export interface CacheOptions {
  maxAge?: number;
  sMaxAge?: number;
  public?: boolean;
  private?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
  proxyRevalidate?: boolean;
  immutable?: boolean;
}

/**
 * CORS configuration options
 */
export interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Content type enumeration
 */
export enum ContentType {
  JSON = 'application/json',
  XML = 'application/xml',
  CSV = 'text/csv',
  HTML = 'text/html',
  PLAIN = 'text/plain',
  STREAM = 'application/octet-stream',
}

// ============================================================================
// Standard Response Formatters
// ============================================================================

/**
 * Creates a standardized API response envelope
 * @param success - Whether the operation was successful
 * @param data - Response data payload
 * @param metadata - Optional metadata (pagination, etc.)
 * @param links - Optional HATEOAS links
 * @param version - API version
 * @returns Formatted API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  metadata?: ResponseMetadata,
  links?: HateoasLinks,
  version?: string
): ApiResponse<T> {
  return {
    success,
    data,
    metadata,
    links,
    timestamp: new Date().toISOString(),
    version,
  };
}

/**
 * Formats a success response with data
 * @param data - Response data
 * @param metadata - Optional metadata
 * @param links - Optional HATEOAS links
 * @param version - API version
 * @returns Success response envelope
 */
export function formatSuccessResponse<T>(
  data: T,
  metadata?: ResponseMetadata,
  links?: HateoasLinks,
  version: string = 'v1'
): ApiResponse<T> {
  return createApiResponse(true, data, metadata, links, version);
}

/**
 * Sends a formatted JSON response with proper status code and headers.
 * Sets Content-Type to application/json automatically.
 *
 * @param res - Express response object
 * @param statusCode - HTTP status code (e.g., 200, 201, 400, 500)
 * @param responseData - API response data following ApiResponse interface
 *
 * @example
 * ```typescript
 * const response = formatSuccessResponse({ id: '123', name: 'John' });
 * sendJsonResponse(res, 200, response);
 * ```
 */
export function sendJsonResponse(
  res: Response,
  statusCode: number,
  responseData: ApiResponse
): void {
  res.status(statusCode).json(responseData);
}

/**
 * Creates a minimal success response for operations with no data
 * @param message - Success message
 * @param version - API version
 * @returns Success response
 */
export function createNoContentResponse(
  message: string = 'Operation completed successfully',
  version: string = 'v1'
): ApiResponse<{ message: string }> {
  return formatSuccessResponse({ message }, undefined, undefined, version);
}

/**
 * Formats a created resource response with location header
 * @param res - Express response object
 * @param data - Created resource data
 * @param resourceUrl - URL of the created resource
 * @param version - API version
 */
export function sendCreatedResponse<T>(
  res: Response,
  data: T,
  resourceUrl: string,
  version: string = 'v1'
): void {
  const response = formatSuccessResponse(data, undefined, { self: resourceUrl }, version);
  res.status(201).location(resourceUrl).json(response);
}

/**
 * Sends a 204 No Content response
 * @param res - Express response object
 */
export function sendNoContentResponse(res: Response): void {
  res.status(204).send();
}

// ============================================================================
// Error Response Builders
// ============================================================================

/**
 * Creates a standardized error response
 * @param code - Error code
 * @param message - Error message
 * @param details - Additional error details
 * @param field - Field name for validation errors
 * @param includeStack - Whether to include stack trace
 * @param version - API version
 * @returns Error response envelope
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any,
  field?: string,
  includeStack: boolean = false,
  version: string = 'v1'
): ApiResponse {
  const error: ApiError = {
    code,
    message,
    details,
    field,
  };

  if (includeStack && details instanceof Error) {
    error.stack = details.stack;
  }

  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    version,
  };
}

/**
 * Formats a validation error response with field-level errors
 * @param validationErrors - Array of validation errors
 * @param version - API version
 * @returns Validation error response
 */
export function formatValidationErrorResponse(
  validationErrors: Array<{ field: string; message: string; code?: string }>,
  version: string = 'v1'
): ApiResponse {
  return createErrorResponse(
    'VALIDATION_ERROR',
    'Request validation failed',
    validationErrors,
    undefined,
    false,
    version
  );
}

/**
 * Sends a 400 Bad Request error response
 * @param res - Express response object
 * @param message - Error message
 * @param details - Error details
 * @param version - API version
 */
export function sendBadRequestError(
  res: Response,
  message: string = 'Bad Request',
  details?: any,
  version: string = 'v1'
): void {
  const response = createErrorResponse('BAD_REQUEST', message, details, undefined, false, version);
  res.status(400).json(response);
}

/**
 * Sends a 401 Unauthorized error response
 * @param res - Express response object
 * @param message - Error message
 * @param realm - Authentication realm
 * @param version - API version
 */
export function sendUnauthorizedError(
  res: Response,
  message: string = 'Unauthorized',
  realm: string = 'API',
  version: string = 'v1'
): void {
  const response = createErrorResponse('UNAUTHORIZED', message, undefined, undefined, false, version);
  res.status(401).header('WWW-Authenticate', `Bearer realm="${realm}"`).json(response);
}

/**
 * Sends a 403 Forbidden error response
 * @param res - Express response object
 * @param message - Error message
 * @param version - API version
 */
export function sendForbiddenError(
  res: Response,
  message: string = 'Forbidden',
  version: string = 'v1'
): void {
  const response = createErrorResponse('FORBIDDEN', message, undefined, undefined, false, version);
  res.status(403).json(response);
}

/**
 * Sends a 404 Not Found error response
 * @param res - Express response object
 * @param resource - Resource type that was not found
 * @param identifier - Resource identifier
 * @param version - API version
 */
export function sendNotFoundError(
  res: Response,
  resource: string = 'Resource',
  identifier?: string | number,
  version: string = 'v1'
): void {
  const message = identifier
    ? `${resource} with identifier '${identifier}' not found`
    : `${resource} not found`;
  const response = createErrorResponse('NOT_FOUND', message, undefined, undefined, false, version);
  res.status(404).json(response);
}

/**
 * Sends a 409 Conflict error response
 * @param res - Express response object
 * @param message - Error message
 * @param conflictDetails - Details about the conflict
 * @param version - API version
 */
export function sendConflictError(
  res: Response,
  message: string = 'Resource conflict',
  conflictDetails?: any,
  version: string = 'v1'
): void {
  const response = createErrorResponse('CONFLICT', message, conflictDetails, undefined, false, version);
  res.status(409).json(response);
}

/**
 * Sends a 500 Internal Server Error response
 * @param res - Express response object
 * @param error - Error object
 * @param includeStack - Whether to include stack trace (for development)
 * @param version - API version
 */
export function sendInternalServerError(
  res: Response,
  error?: Error,
  includeStack: boolean = false,
  version: string = 'v1'
): void {
  const response = createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred',
    error,
    undefined,
    includeStack,
    version
  );
  res.status(500).json(response);
}

// ============================================================================
// Paginated Response Formatters
// ============================================================================

/**
 * Creates pagination metadata
 * @param params - Pagination parameters
 * @returns Pagination metadata
 */
export function createPaginationMetadata(params: PaginationParams): ResponseMetadata {
  const { page, pageSize, totalItems } = params;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

/**
 * Formats a paginated response with HATEOAS links
 * @param data - Array of items for current page
 * @param params - Pagination parameters
 * @param baseUrl - Base URL for pagination links
 * @param version - API version
 * @returns Paginated response with links
 */
export function formatPaginatedResponse<T>(
  data: T[],
  params: PaginationParams,
  baseUrl: string,
  version: string = 'v1'
): ApiResponse<T[]> {
  const metadata = createPaginationMetadata(params);
  const links = generatePaginationLinks(params, baseUrl);

  return formatSuccessResponse(data, metadata, links, version);
}

/**
 * Generates HATEOAS pagination links
 * @param params - Pagination parameters
 * @param baseUrl - Base URL for links
 * @returns HATEOAS links object
 */
export function generatePaginationLinks(
  params: PaginationParams,
  baseUrl: string
): HateoasLinks {
  const { page, pageSize, totalItems } = params;
  const totalPages = Math.ceil(totalItems / pageSize);

  const links: HateoasLinks = {
    self: `${baseUrl}?page=${page}&pageSize=${pageSize}`,
    first: `${baseUrl}?page=1&pageSize=${pageSize}`,
    last: `${baseUrl}?page=${totalPages}&pageSize=${pageSize}`,
  };

  if (page > 1) {
    links.previous = `${baseUrl}?page=${page - 1}&pageSize=${pageSize}`;
  }

  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}&pageSize=${pageSize}`;
  }

  return links;
}

/**
 * Calculates offset and limit from page-based pagination
 * @param page - Page number (1-based)
 * @param pageSize - Items per page
 * @returns Object with offset and limit
 */
export function calculatePaginationOffset(
  page: number,
  pageSize: number
): { offset: number; limit: number } {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}

// ============================================================================
// HATEOAS Link Generators
// ============================================================================

/**
 * Creates HATEOAS links for a resource
 * @param resourceId - Resource identifier
 * @param resourceType - Resource type/name
 * @param baseUrl - Base API URL
 * @param additionalLinks - Additional custom links
 * @returns HATEOAS links object
 */
export function createResourceLinks(
  resourceId: string | number,
  resourceType: string,
  baseUrl: string,
  additionalLinks?: Record<string, string>
): HateoasLinks {
  const links: HateoasLinks = {
    self: `${baseUrl}/${resourceType}/${resourceId}`,
    collection: `${baseUrl}/${resourceType}`,
    ...additionalLinks,
  };

  return links;
}

/**
 * Generates CRUD operation links for a resource
 * @param resourceId - Resource identifier
 * @param resourceType - Resource type/name
 * @param baseUrl - Base API URL
 * @param operations - Available operations
 * @returns HATEOAS links with CRUD operations
 */
export function generateCrudLinks(
  resourceId: string | number,
  resourceType: string,
  baseUrl: string,
  operations: Array<'create' | 'read' | 'update' | 'delete'> = ['read', 'update', 'delete']
): HateoasLinks {
  const resourceUrl = `${baseUrl}/${resourceType}/${resourceId}`;
  const collectionUrl = `${baseUrl}/${resourceType}`;

  const links: HateoasLinks = {
    self: resourceUrl,
  };

  if (operations.includes('read')) {
    links.read = resourceUrl;
  }

  if (operations.includes('update')) {
    links.update = resourceUrl;
  }

  if (operations.includes('delete')) {
    links.delete = resourceUrl;
  }

  if (operations.includes('create')) {
    links.create = collectionUrl;
  }

  return links;
}

/**
 * Creates related resource links
 * @param resourceId - Parent resource identifier
 * @param resourceType - Parent resource type
 * @param baseUrl - Base API URL
 * @param relations - Related resource types
 * @returns HATEOAS links for related resources
 */
export function createRelatedResourceLinks(
  resourceId: string | number,
  resourceType: string,
  baseUrl: string,
  relations: string[]
): HateoasLinks {
  const links: HateoasLinks = {
    self: `${baseUrl}/${resourceType}/${resourceId}`,
  };

  relations.forEach((relation) => {
    links[relation] = `${baseUrl}/${resourceType}/${resourceId}/${relation}`;
  });

  return links;
}

// ============================================================================
// API Versioning Response Handlers
// ============================================================================

/**
 * Extracts API version from request headers or URL
 * @param acceptHeader - Accept header value
 * @param urlVersion - Version from URL path
 * @param defaultVersion - Default version if none specified
 * @returns API version string
 */
export function extractApiVersion(
  acceptHeader?: string,
  urlVersion?: string,
  defaultVersion: string = 'v1'
): string {
  if (urlVersion) {
    return urlVersion;
  }

  if (acceptHeader) {
    const versionMatch = acceptHeader.match(/version=(\d+)/);
    if (versionMatch) {
      return `v${versionMatch[1]}`;
    }
  }

  return defaultVersion;
}

/**
 * Sets API version headers in response
 * @param res - Express response object
 * @param version - API version
 * @param deprecatedVersion - Whether this version is deprecated
 * @param sunsetDate - Deprecation sunset date
 */
export function setApiVersionHeaders(
  res: Response,
  version: string,
  deprecatedVersion: boolean = false,
  sunsetDate?: Date
): void {
  res.setHeader('API-Version', version);

  if (deprecatedVersion) {
    res.setHeader('Deprecation', 'true');
    if (sunsetDate) {
      res.setHeader('Sunset', sunsetDate.toUTCString());
    }
  }
}

/**
 * Creates a response with version information in headers and body
 * @param res - Express response object
 * @param data - Response data
 * @param version - API version
 * @param deprecatedVersion - Whether version is deprecated
 * @param sunsetDate - Sunset date if deprecated
 */
export function sendVersionedResponse<T>(
  res: Response,
  data: T,
  version: string = 'v1',
  deprecatedVersion: boolean = false,
  sunsetDate?: Date
): void {
  setApiVersionHeaders(res, version, deprecatedVersion, sunsetDate);
  const response = formatSuccessResponse(data, undefined, undefined, version);
  res.status(200).json(response);
}

// ============================================================================
// Content Negotiation
// ============================================================================

/**
 * Determines response content type from Accept header
 * @param acceptHeader - Accept header value
 * @param supportedTypes - Array of supported content types
 * @param defaultType - Default content type
 * @returns Negotiated content type
 */
export function negotiateContentType(
  acceptHeader: string | undefined,
  supportedTypes: ContentType[] = [ContentType.JSON],
  defaultType: ContentType = ContentType.JSON
): ContentType {
  if (!acceptHeader) {
    return defaultType;
  }

  const acceptedTypes = acceptHeader.split(',').map((type) => type.trim().split(';')[0]);

  for (const accepted of acceptedTypes) {
    const matched = supportedTypes.find((supported) => supported === accepted);
    if (matched) {
      return matched;
    }
  }

  return defaultType;
}

/**
 * Converts data to JSON format
 * @param data - Data to convert
 * @param pretty - Whether to pretty-print JSON
 * @returns JSON string
 */
export function formatAsJson(data: any, pretty: boolean = false): string {
  return JSON.stringify(data, null, pretty ? 2 : 0);
}

/**
 * Converts data to XML format
 * @param data - Data to convert
 * @param rootElement - Root XML element name
 * @returns XML string
 */
export function formatAsXml(data: any, rootElement: string = 'response'): string {
  const toXml = (obj: any, indent: string = ''): string => {
    if (Array.isArray(obj)) {
      return obj.map((item) => `${indent}<item>\n${toXml(item, indent + '  ')}${indent}</item>`).join('\n');
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => {
          if (typeof value === 'object') {
            return `${indent}<${key}>\n${toXml(value, indent + '  ')}${indent}</${key}>`;
          }
          return `${indent}<${key}>${value}</${key}>`;
        })
        .join('\n');
    }

    return `${indent}${obj}`;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n${toXml(data, '  ')}</${rootElement}>`;
}

/**
 * Converts array of objects to CSV format
 * @param data - Array of objects to convert
 * @param headers - Column headers (extracted from first object if not provided)
 * @returns CSV string
 */
export function formatAsCsv(data: any[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  const columnHeaders = headers || Object.keys(data[0]);
  const csvHeaders = columnHeaders.join(',');

  const csvRows = data.map((row) => {
    return columnHeaders
      .map((header) => {
        const value = row[header];
        const stringValue = value !== null && value !== undefined ? String(value) : '';
        // Escape quotes and wrap in quotes if contains comma or quote
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Sends response in negotiated content type
 * @param res - Express response object
 * @param data - Response data
 * @param acceptHeader - Accept header value
 * @param supportedTypes - Supported content types
 */
export function sendNegotiatedResponse(
  res: Response,
  data: any,
  acceptHeader: string | undefined,
  supportedTypes: ContentType[] = [ContentType.JSON, ContentType.XML, ContentType.CSV]
): void {
  const contentType = negotiateContentType(acceptHeader, supportedTypes);

  res.setHeader('Content-Type', contentType);

  switch (contentType) {
    case ContentType.JSON:
      res.status(200).json(data);
      break;

    case ContentType.XML:
      const xml = formatAsXml(data);
      res.status(200).send(xml);
      break;

    case ContentType.CSV:
      const csv = formatAsCsv(Array.isArray(data) ? data : [data]);
      res.status(200).send(csv);
      break;

    default:
      res.status(200).json(data);
  }
}

// ============================================================================
// Compression Middleware
// ============================================================================

/**
 * Determines if response should be compressed based on content type and size
 * @param contentType - Response content type
 * @param contentLength - Response content length
 * @param threshold - Minimum size for compression (bytes)
 * @returns Whether to compress response
 */
export function shouldCompressResponse(
  contentType: string,
  contentLength: number,
  threshold: number = 1024
): boolean {
  if (contentLength < threshold) {
    return false;
  }

  const compressibleTypes = [
    'text/',
    'application/json',
    'application/xml',
    'application/javascript',
    'application/x-javascript',
  ];

  return compressibleTypes.some((type) => contentType.includes(type));
}

/**
 * Creates a gzip compression stream
 * @param level - Compression level (0-9)
 * @returns Gzip transform stream
 */
export function createGzipStream(level: number = 6): Transform {
  return zlib.createGzip({ level });
}

/**
 * Creates a Brotli compression stream
 * @param quality - Compression quality (0-11)
 * @returns Brotli transform stream
 */
export function createBrotliStream(quality: number = 6): Transform {
  return zlib.createBrotliCompress({
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: quality,
    },
  });
}

/**
 * Applies compression to response based on Accept-Encoding header
 * @param res - Express response object
 * @param data - Response data
 * @param acceptEncoding - Accept-Encoding header value
 * @param compressionLevel - Compression level
 */
export function sendCompressedResponse(
  res: Response,
  data: string | Buffer,
  acceptEncoding: string | undefined,
  compressionLevel: number = 6
): void {
  const encoding = acceptEncoding?.toLowerCase() || '';

  if (encoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    const compressed = zlib.brotliCompressSync(data, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: compressionLevel,
      },
    });
    res.status(200).send(compressed);
  } else if (encoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const compressed = zlib.gzipSync(data, { level: compressionLevel });
    res.status(200).send(compressed);
  } else if (encoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
    const compressed = zlib.deflateSync(data, { level: compressionLevel });
    res.status(200).send(compressed);
  } else {
    res.status(200).send(data);
  }
}

// ============================================================================
// ETag Generation and Validation
// ============================================================================

/**
 * Generates ETag from response data
 * @param data - Response data
 * @param weak - Whether to generate weak ETag
 * @returns ETag string
 */
export function generateETag(data: any, weak: boolean = false): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  const hash = createHash('md5').update(content).digest('hex');
  return weak ? `W/"${hash}"` : `"${hash}"`;
}

/**
 * Validates if request ETag matches current resource ETag
 * @param requestETag - ETag from If-None-Match header
 * @param currentETag - Current resource ETag
 * @returns Whether ETags match
 */
export function validateETag(requestETag: string | undefined, currentETag: string): boolean {
  if (!requestETag) {
    return false;
  }

  // Handle multiple ETags in If-None-Match
  const requestETags = requestETag.split(',').map((tag) => tag.trim());
  return requestETags.includes(currentETag) || requestETags.includes('*');
}

/**
 * Sends 304 Not Modified response if ETag matches
 * @param res - Express response object
 * @param data - Response data
 * @param ifNoneMatch - If-None-Match header value
 * @returns True if 304 was sent, false otherwise
 */
export function handleETagValidation(
  res: Response,
  data: any,
  ifNoneMatch: string | undefined
): boolean {
  const etag = generateETag(data);
  res.setHeader('ETag', etag);

  if (validateETag(ifNoneMatch, etag)) {
    res.status(304).send();
    return true;
  }

  return false;
}

/**
 * Validates If-Match precondition for updates
 * @param ifMatch - If-Match header value
 * @param currentETag - Current resource ETag
 * @returns Whether precondition is met
 */
export function validateIfMatch(ifMatch: string | undefined, currentETag: string): boolean {
  if (!ifMatch) {
    return true; // No precondition
  }

  const requestETags = ifMatch.split(',').map((tag) => tag.trim());
  return requestETags.includes(currentETag) || requestETags.includes('*');
}

// ============================================================================
// Cache Header Builders
// ============================================================================

/**
 * Builds Cache-Control header value from options
 * @param options - Cache control options
 * @returns Cache-Control header value
 */
export function buildCacheControlHeader(options: CacheOptions): string {
  const directives: string[] = [];

  if (options.public) {
    directives.push('public');
  }

  if (options.private) {
    directives.push('private');
  }

  if (options.noCache) {
    directives.push('no-cache');
  }

  if (options.noStore) {
    directives.push('no-store');
  }

  if (options.mustRevalidate) {
    directives.push('must-revalidate');
  }

  if (options.proxyRevalidate) {
    directives.push('proxy-revalidate');
  }

  if (options.immutable) {
    directives.push('immutable');
  }

  if (options.maxAge !== undefined) {
    directives.push(`max-age=${options.maxAge}`);
  }

  if (options.sMaxAge !== undefined) {
    directives.push(`s-maxage=${options.sMaxAge}`);
  }

  return directives.join(', ');
}

/**
 * Sets cache headers for public resources
 * @param res - Express response object
 * @param maxAge - Cache max age in seconds
 * @param immutable - Whether resource is immutable
 */
export function setCacheHeadersPublic(
  res: Response,
  maxAge: number = 3600,
  immutable: boolean = false
): void {
  const cacheControl = buildCacheControlHeader({
    public: true,
    maxAge,
    immutable,
  });
  res.setHeader('Cache-Control', cacheControl);
}

/**
 * Sets cache headers for private resources
 * @param res - Express response object
 * @param maxAge - Cache max age in seconds
 */
export function setCacheHeadersPrivate(res: Response, maxAge: number = 300): void {
  const cacheControl = buildCacheControlHeader({
    private: true,
    maxAge,
  });
  res.setHeader('Cache-Control', cacheControl);
}

/**
 * Sets no-cache headers to prevent caching
 * @param res - Express response object
 */
export function setNoCacheHeaders(res: Response): void {
  const cacheControl = buildCacheControlHeader({
    noCache: true,
    noStore: true,
    mustRevalidate: true,
  });
  res.setHeader('Cache-Control', cacheControl);
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

// ============================================================================
// CORS Configuration Builders
// ============================================================================

/**
 * Sets CORS headers on response
 * @param res - Express response object
 * @param options - CORS configuration options
 */
export function setCorsHeaders(res: Response, options: CorsOptions): void {
  const origin = Array.isArray(options.origin) ? options.origin.join(', ') : options.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);

  if (options.methods && options.methods.length > 0) {
    res.setHeader('Access-Control-Allow-Methods', options.methods.join(', '));
  }

  if (options.allowedHeaders && options.allowedHeaders.length > 0) {
    res.setHeader('Access-Control-Allow-Headers', options.allowedHeaders.join(', '));
  }

  if (options.exposedHeaders && options.exposedHeaders.length > 0) {
    res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders.join(', '));
  }

  if (options.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (options.maxAge !== undefined) {
    res.setHeader('Access-Control-Max-Age', options.maxAge.toString());
  }
}

/**
 * Creates default CORS options for public APIs
 * @returns Default CORS options
 */
export function createDefaultCorsOptions(): CorsOptions {
  return {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number', 'Link'],
    credentials: false,
    maxAge: 86400, // 24 hours
  };
}

/**
 * Handles CORS preflight request
 * @param res - Express response object
 * @param options - CORS configuration options
 */
export function handlePreflightRequest(res: Response, options: CorsOptions): void {
  setCorsHeaders(res, options);
  res.status(204).send();
}

// ============================================================================
// Rate Limit Response Headers
// ============================================================================

/**
 * Sets rate limit headers on response
 * @param res - Express response object
 * @param rateLimitInfo - Rate limit information
 */
export function setRateLimitHeaders(res: Response, rateLimitInfo: RateLimitInfo): void {
  res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimitInfo.reset.toString());

  if (rateLimitInfo.retryAfter !== undefined) {
    res.setHeader('Retry-After', rateLimitInfo.retryAfter.toString());
  }
}

/**
 * Sends 429 Too Many Requests response
 * @param res - Express response object
 * @param rateLimitInfo - Rate limit information
 * @param version - API version
 */
export function sendRateLimitExceededResponse(
  res: Response,
  rateLimitInfo: RateLimitInfo,
  version: string = 'v1'
): void {
  setRateLimitHeaders(res, rateLimitInfo);

  const resetTime = new Date(rateLimitInfo.reset * 1000).toISOString();
  const response = createErrorResponse(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests. Please try again later.',
    { resetTime, limit: rateLimitInfo.limit },
    undefined,
    false,
    version
  );

  res.status(429).json(response);
}

/**
 * Calculates rate limit reset time
 * @param windowSeconds - Rate limit window in seconds
 * @returns Unix timestamp for reset time
 */
export function calculateRateLimitReset(windowSeconds: number): number {
  return Math.floor(Date.now() / 1000) + windowSeconds;
}

// ============================================================================
// API Deprecation Headers
// ============================================================================

/**
 * Sets deprecation headers on response
 * @param res - Express response object
 * @param sunsetDate - Date when deprecated feature will be removed
 * @param alternativeUrl - URL of alternative/replacement resource
 * @param deprecationMessage - Custom deprecation message
 */
export function setDeprecationHeaders(
  res: Response,
  sunsetDate: Date,
  alternativeUrl?: string,
  deprecationMessage?: string
): void {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', sunsetDate.toUTCString());

  if (alternativeUrl) {
    res.setHeader('Link', `<${alternativeUrl}>; rel="alternate"`);
  }

  if (deprecationMessage) {
    res.setHeader('X-API-Warn', deprecationMessage);
  }
}

/**
 * Sends response with deprecation warning
 * @param res - Express response object
 * @param data - Response data
 * @param sunsetDate - Sunset date
 * @param alternativeUrl - Alternative resource URL
 * @param version - API version
 */
export function sendDeprecatedResponse<T>(
  res: Response,
  data: T,
  sunsetDate: Date,
  alternativeUrl?: string,
  version: string = 'v1'
): void {
  const message = alternativeUrl
    ? `This endpoint is deprecated and will be removed on ${sunsetDate.toISOString()}. Use ${alternativeUrl} instead.`
    : `This endpoint is deprecated and will be removed on ${sunsetDate.toISOString()}.`;

  setDeprecationHeaders(res, sunsetDate, alternativeUrl, message);

  const response = formatSuccessResponse(data, undefined, undefined, version);
  res.status(200).json(response);
}

/**
 * Checks if a feature should be considered sunset
 * @param sunsetDate - Sunset date
 * @returns Whether feature is past sunset date
 */
export function isSunset(sunsetDate: Date): boolean {
  return new Date() > sunsetDate;
}

// ============================================================================
// Response Streaming Utilities
// ============================================================================

/**
 * Creates a JSON streaming response for large datasets
 * @param res - Express response object
 * @param dataStream - Readable stream of data
 * @param transform - Optional transform function for each item
 */
export function streamJsonResponse(
  res: Response,
  dataStream: NodeJS.ReadableStream,
  transform?: (item: any) => any
): void {
  res.setHeader('Content-Type', ContentType.JSON);
  res.write('[');

  let first = true;

  dataStream.on('data', (chunk) => {
    const item = transform ? transform(chunk) : chunk;
    const prefix = first ? '' : ',';
    first = false;
    res.write(`${prefix}${JSON.stringify(item)}`);
  });

  dataStream.on('end', () => {
    res.write(']');
    res.end();
  });

  dataStream.on('error', (error) => {
    res.end();
  });
}

/**
 * Creates a server-sent events (SSE) stream
 * @param res - Express response object
 */
export function initializeSseStream(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

/**
 * Sends an SSE event
 * @param res - Express response object
 * @param eventName - Event name
 * @param data - Event data
 * @param id - Optional event ID
 */
export function sendSseEvent(
  res: Response,
  eventName: string,
  data: any,
  id?: string | number
): void {
  if (id !== undefined) {
    res.write(`id: ${id}\n`);
  }
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Sends data in chunked transfer encoding
 * @param res - Express response object
 * @param chunks - Array of data chunks
 * @param contentType - Content type
 * @param delayMs - Delay between chunks in milliseconds
 */
export async function sendChunkedResponse(
  res: Response,
  chunks: any[],
  contentType: ContentType = ContentType.JSON,
  delayMs: number = 0
): Promise<void> {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Transfer-Encoding', 'chunked');

  for (const chunk of chunks) {
    const data = typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
    res.write(data);

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  res.end();
}
