import { ApiExtension } from '@nestjs/swagger';
import { HeaderDefinition } from './types';
/**
 * Creates CORS headers for response.
 * Cross-Origin Resource Sharing headers.
 *
 * @param allowedOrigins - Allowed origin patterns
 * @param allowedMethods - Allowed HTTP methods
 * @param allowedHeaders - Allowed request headers
 * @returns CORS headers configuration
 *
 * @example
 * ```typescript
 * @createCorsHeaders(['https://example.com'], ['GET', 'POST'], ['Content-Type', 'Authorization'])
 * async corsEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createCorsHeaders(
  allowedOrigins: string[],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: string[] = ['Content-Type', 'Authorization'],
) {
  const headers: Record<string, HeaderDefinition> = {
    'Access-Control-Allow-Origin': {
      description: 'Allowed origins',
      schema: { type: 'string' },
      example: allowedOrigins.join(', '),
    },
    'Access-Control-Allow-Methods': {
      description: 'Allowed HTTP methods',
      schema: { type: 'string' },
      example: allowedMethods.join(', '),
    },
    'Access-Control-Allow-Headers': {
      description: 'Allowed request headers',
      schema: { type: 'string' },
      example: allowedHeaders.join(', '),
    },
  };
  return ApiExtension('x-cors-headers', headers);
}
/**
 * Creates cache control headers.
 * HTTP caching directives.
 *
 * @param maxAge - Cache max age in seconds
 * @param isPublic - Whether cache is public or private
 * @param revalidate - Whether to revalidate
 * @returns Cache control headers configuration
 *
 * @example
 * ```typescript
 * @createCacheControlHeaders(3600, true, true)
 * async cachedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createCacheControlHeaders(maxAge: number, isPublic = true, revalidate = false) {
  const directives: string[] = [isPublic ? 'public' : 'private', `max-age=${maxAge}`];
  if (revalidate) {
    directives.push('must-revalidate');
  }
  return ApiExtension('x-cache-control', {
    'Cache-Control': {
      description: 'Cache control directives',
      schema: { type: 'string' },
      example: directives.join(', '),
    },
    'ETag': {
      description: 'Entity tag for cache validation',
      schema: { type: 'string' },
    },
  });
}
/**
 * Creates security headers.
 * Security-related HTTP headers.
 *
 * @param includeHsts - Include HTTP Strict Transport Security
 * @param includeXssProtection - Include XSS protection headers
 * @returns Security headers configuration
 *
 * @example
 * ```typescript
 * @createSecurityHeaders(true, true)
 * async secureEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createSecurityHeaders(includeHsts = true, includeXssProtection = true) {
  const headers: Record<string, HeaderDefinition> = {
    'X-Content-Type-Options': {
      description: 'Prevent MIME type sniffing',
      schema: { type: 'string' },
      example: 'nosniff',
    },
    'X-Frame-Options': {
      description: 'Clickjacking protection',
      schema: { type: 'string' },
      example: 'DENY',
    },
  };
  if (includeHsts) {
    headers['Strict-Transport-Security'] = {
      description: 'HSTS policy',
      schema: { type: 'string' },
      example: 'max-age=31536000; includeSubDomains',
    };
  }
  if (includeXssProtection) {
    headers['X-XSS-Protection'] = {
      description: 'XSS filter',
      schema: { type: 'string' },
      example: '1; mode=block',
    };
  }
  return ApiExtension('x-security-headers', headers);
}
/**
 * Creates content disposition header.
 * Content disposition for downloads.
 *
 * @param filename - Attachment filename
 * @param inline - Whether to display inline
 * @returns Content disposition header configuration
 *
 * @example
 * ```typescript
 * @createContentDispositionHeader('document.pdf', false)
 * async downloadDocument() {
 *   return this.documentService.getFile();
 * }
 * ```
 */
export function createContentDispositionHeader(filename: string, inline = false) {
  const disposition = inline ? 'inline' : 'attachment';
  return ApiExtension('x-content-disposition', {
    'Content-Disposition': {
      description: 'Content disposition',
      schema: { type: 'string' },
      example: `${disposition}; filename="${filename}"`,
    },
  });
}
/**
 * Creates ETag header for versioning.
 * Entity tag for cache validation.
 *
 * @param strong - Whether ETag is strong or weak
 * @returns ETag header configuration
 *
 * @example
 * ```typescript
 * @createETagHeader(true)
 * async versionedResource() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createETagHeader(strong = true) {
  return ApiExtension('x-etag', {
    'ETag': {
      description: strong ? 'Strong entity tag' : 'Weak entity tag',
      schema: { type: 'string' },
      example: strong ? '"33a64df551425fcc"' : 'W/"33a64df551425fcc"',
    },
  });
}
/**
 * Creates Last-Modified header.
 * Resource modification timestamp.
 *
 * @returns Last-Modified header configuration
 *
 * @example
 * ```typescript
 * @createLastModifiedHeader()
 * async getResource() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createLastModifiedHeader() {
  return ApiExtension('x-last-modified', {
    'Last-Modified': {
      description: 'Resource last modification timestamp',
      schema: { type: 'string', format: 'date-time' },
      example: 'Wed, 21 Oct 2015 07:28:00 GMT',
    },
  });
}
/**
 * Creates custom tracking headers.
 * Request/response tracking headers.
 *
 * @param includeRequestId - Include request ID
 * @param includeCorrelationId - Include correlation ID
 * @returns Tracking headers configuration
 *
 * @example
 * ```typescript
 * @createTrackingHeaders(true, true)
 * async trackedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createTrackingHeaders(includeRequestId = true, includeCorrelationId = true) {
  const headers: Record<string, HeaderDefinition> = {};
  if (includeRequestId) {
    headers['X-Request-ID'] = {
      description: 'Unique request identifier',
      schema: { type: 'string', format: 'uuid' },
    };
  }
  if (includeCorrelationId) {
    headers['X-Correlation-ID'] = {
      description: 'Correlation ID for distributed tracing',
      schema: { type: 'string', format: 'uuid' },
    };
  }
  return ApiExtension('x-tracking-headers', headers);
}
/**
 * Creates rate limit headers.
 * Rate limiting information headers.
 *
 * @param limit - Rate limit
 * @param window - Time window
 * @returns Rate limit headers configuration
 *
 * @example
 * ```typescript
 * @createRateLimitHeaders(100, '1m')
 * async rateLimitedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createRateLimitHeaders(limit: number, window: string) {
  return ApiExtension('x-rate-limit-headers', {
    'X-RateLimit-Limit': {
      description: 'Request limit per window',
      schema: { type: 'integer' },
      example: limit,
    },
    'X-RateLimit-Remaining': {
      description: 'Remaining requests',
      schema: { type: 'integer' },
    },
    'X-RateLimit-Reset': {
      description: 'Reset timestamp',
      schema: { type: 'integer' },
    },
  });
}
/**
 * Creates pagination headers.
 * Pagination metadata in headers.
 *
 * @returns Pagination headers configuration
 *
 * @example
 * ```typescript
 * @createPaginationHeaders()
 * async paginatedEndpoint() {
 *   return this.service.findPaginated();
 * }
 * ```
 */
export function createPaginationHeaders() {
  return ApiExtension('x-pagination-headers', {
    'X-Total-Count': {
      description: 'Total number of items',
      schema: { type: 'integer' },
    },
    'X-Page': {
      description: 'Current page number',
      schema: { type: 'integer' },
    },
    'X-Per-Page': {
      description: 'Items per page',
      schema: { type: 'integer' },
    },
    'X-Total-Pages': {
      description: 'Total number of pages',
      schema: { type: 'integer' },
    },
  });
}
/**
 * Creates deprecation warning headers.
 * API deprecation notification headers.
 *
 * @param sunsetDate - Date when endpoint will be removed
 * @param alternativeUrl - Alternative endpoint URL
 * @returns Deprecation headers configuration
 *
 * @example
 * ```typescript
 * @createDeprecationHeaders('2025-12-31', '/api/v2/users')
 * async deprecatedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createDeprecationHeaders(sunsetDate?: string, alternativeUrl?: string) {
  const headers: Record<string, HeaderDefinition> = {
    'Deprecation': {
      description: 'Deprecation notice',
      schema: { type: 'string' },
      example: 'true',
    },
  };
  if (sunsetDate) {
    headers['Sunset'] = {
      description: 'Sunset date (RFC 8594)',
      schema: { type: 'string', format: 'date' },
      example: sunsetDate,
    };
  }
  if (alternativeUrl) {
    headers['Link'] = {
      description: 'Alternative endpoint',
      schema: { type: 'string' },
      example: `<${alternativeUrl}>; rel="alternate"`,
    };
  }
  return ApiExtension('x-deprecation-headers', headers);
}


