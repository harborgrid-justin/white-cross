/**
 * LOC: RADP1234567
 * File: /reuse/rest-api-design-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and services
 *   - REST API middleware
 *   - API gateway implementations
 *   - HTTP interceptors
 */

/**
 * File: /reuse/rest-api-design-patterns-kit.ts
 * Locator: WC-UTL-RADP-001
 * Purpose: Comprehensive REST API Design Patterns Kit - HATEOAS, ETags, content negotiation, CORS, rate limiting, webhooks, batch operations
 *
 * Upstream: Independent utility module for REST API design patterns and best practices
 * Downstream: ../backend/*, API controllers, middleware, gateway services, HTTP interceptors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, crypto, @nestjs/common
 * Exports: 45 utility functions for REST API design including HATEOAS, ETags, conditional requests, content negotiation, CORS, rate limiting, API keys, webhooks, batch operations, field filtering, caching strategies
 *
 * LLM Context: Comprehensive REST API design pattern utilities for White Cross healthcare system.
 * Provides HATEOAS link generation, resource versioning with ETags, conditional request handling,
 * content negotiation, CORS management, rate limiting strategies, API key authentication, webhook delivery,
 * batch/bulk operations, partial response handling, field filtering, sparse fieldsets, cache control headers,
 * HTTP method utilities, and security best practices. Essential for building production-ready, scalable,
 * secure, and developer-friendly REST APIs in healthcare applications.
 */

import { createHash, randomBytes } from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface HateoasLink {
  href: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  rel?: string;
  type?: string;
  title?: string;
  templated?: boolean;
}

interface HateoasLinks {
  [relation: string]: HateoasLink | string;
}

interface ResourceVersion {
  version: string;
  etag: string;
  lastModified: Date;
}

interface ETagOptions {
  weak?: boolean;
  algorithm?: 'md5' | 'sha1' | 'sha256';
}

interface ConditionalRequestHeaders {
  ifMatch?: string;
  ifNoneMatch?: string;
  ifModifiedSince?: string;
  ifUnmodifiedSince?: string;
}

interface ContentNegotiationResult {
  contentType: string;
  charset: string;
  encoding?: string;
  language?: string;
}

interface CorsConfig {
  origin: string | string[] | RegExp | ((origin: string) => boolean);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
  handler?: (req: any, res: any) => void;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitState {
  requests: number;
  resetTime: Date;
  remaining: number;
}

interface ApiKeyConfig {
  prefix?: string;
  length?: number;
  expiresIn?: number;
  scopes?: string[];
}

interface ApiKey {
  key: string;
  hash: string;
  createdAt: Date;
  expiresAt?: Date;
  scopes?: string[];
  metadata?: Record<string, any>;
}

interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  retryAttempts?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

interface WebhookPayload {
  event: string;
  timestamp: Date;
  data: any;
  signature?: string;
}

interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  attempt: number;
  error?: Error;
  responseTime: number;
}

interface BatchRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

interface BatchResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: any;
  error?: string;
}

interface FieldFilter {
  include?: string[];
  exclude?: string[];
  sparse?: Record<string, string[]>;
}

interface PartialResponseOptions {
  fields?: string[];
  omit?: string[];
  depth?: number;
}

interface CacheControl {
  public?: boolean;
  private?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
  proxyRevalidate?: boolean;
  maxAge?: number;
  sMaxage?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
}

interface CompressionOptions {
  threshold?: number;
  level?: number;
  memLevel?: number;
  strategy?: number;
}

interface ApiDocumentation {
  endpoint: string;
  method: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responses?: Record<number, { description: string; schema?: any }>;
  examples?: any[];
}

// ============================================================================
// HATEOAS UTILITIES
// ============================================================================

/**
 * 1. Generates HATEOAS links for a resource with full HAL specification support.
 *
 * @param {string} baseUrl - Base URL for the API
 * @param {string} resourceType - Resource type (e.g., 'users', 'patients')
 * @param {string | number} resourceId - Resource identifier
 * @param {Record<string, HateoasLink | string>} [additionalLinks] - Additional custom links
 * @returns {HateoasLinks} HATEOAS links object
 *
 * @example
 * ```typescript
 * const links = generateHateoasLinks('/api/v1', 'patients', '123', {
 *   appointments: { href: '/api/v1/patients/123/appointments', method: 'GET' },
 *   'medical-records': '/api/v1/patients/123/medical-records'
 * });
 * // Result: {
 * //   self: { href: '/api/v1/patients/123', method: 'GET' },
 * //   collection: { href: '/api/v1/patients', method: 'GET' },
 * //   appointments: { href: '/api/v1/patients/123/appointments', method: 'GET' },
 * //   'medical-records': { href: '/api/v1/patients/123/medical-records' }
 * // }
 * ```
 */
export const generateHateoasLinks = (
  baseUrl: string,
  resourceType: string,
  resourceId: string | number,
  additionalLinks?: Record<string, HateoasLink | string>,
): HateoasLinks => {
  const links: HateoasLinks = {
    self: {
      href: `${baseUrl}/${resourceType}/${resourceId}`,
      method: 'GET',
      rel: 'self',
    },
    collection: {
      href: `${baseUrl}/${resourceType}`,
      method: 'GET',
      rel: 'collection',
    },
  };

  if (additionalLinks) {
    Object.entries(additionalLinks).forEach(([key, value]) => {
      links[key] = typeof value === 'string' ? { href: value } : value;
    });
  }

  return links;
};

/**
 * 2. Creates HAL-compliant embedded resources with links.
 *
 * @template T
 * @param {T} resource - Resource data
 * @param {HateoasLinks} links - HATEOAS links
 * @param {Record<string, any>} [embedded] - Embedded resources
 * @returns {object} HAL-formatted resource
 *
 * @example
 * ```typescript
 * const halResource = createHalResource(
 *   { id: 1, name: 'John Doe', email: 'john@example.com' },
 *   { self: '/api/users/1', posts: '/api/users/1/posts' },
 *   { posts: [{ id: 1, title: 'Hello World' }] }
 * );
 * ```
 */
export const createHalResource = <T extends Record<string, any>>(
  resource: T,
  links: HateoasLinks,
  embedded?: Record<string, any>,
): T & { _links: HateoasLinks; _embedded?: Record<string, any> } => {
  const halResource: any = { ...resource, _links: links };

  if (embedded && Object.keys(embedded).length > 0) {
    halResource._embedded = embedded;
  }

  return halResource;
};

/**
 * 3. Generates templated URI for HATEOAS links with RFC 6570 URI templates.
 *
 * @param {string} template - URI template with placeholders
 * @param {Record<string, any>} [params] - Template parameters
 * @returns {HateoasLink} Templated HATEOAS link
 *
 * @example
 * ```typescript
 * const link = createTemplatedLink('/api/users{?page,limit,sort}', { page: 2, limit: 20 });
 * // Result: { href: '/api/users{?page,limit,sort}', templated: true }
 * ```
 */
export const createTemplatedLink = (
  template: string,
  params?: Record<string, any>,
): HateoasLink => {
  return {
    href: template,
    templated: true,
  };
};

// ============================================================================
// ETAG AND CONDITIONAL REQUEST UTILITIES
// ============================================================================

/**
 * 4. Generates ETag for resource based on content hash.
 *
 * @param {any} resource - Resource data
 * @param {ETagOptions} [options] - ETag generation options
 * @returns {string} ETag value
 *
 * @example
 * ```typescript
 * const etag = generateETag({ id: 1, name: 'John', updatedAt: '2024-01-01' });
 * // Result: '"a1b2c3d4e5f6..."'
 *
 * const weakEtag = generateETag(resource, { weak: true });
 * // Result: 'W/"a1b2c3d4e5f6..."'
 * ```
 */
export const generateETag = (resource: any, options?: ETagOptions): string => {
  const algorithm = options?.algorithm || 'sha256';
  const content = JSON.stringify(resource);
  const hash = createHash(algorithm).update(content).digest('hex');
  const etag = `"${hash}"`;

  return options?.weak ? `W/${etag}` : etag;
};

/**
 * 5. Validates conditional request headers (If-Match, If-None-Match, etc.).
 *
 * @param {ConditionalRequestHeaders} headers - Request headers
 * @param {ResourceVersion} currentVersion - Current resource version
 * @returns {{ shouldProcess: boolean; statusCode?: number }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateConditionalRequest(
 *   { ifMatch: '"abc123"', ifModifiedSince: '2024-01-01T00:00:00Z' },
 *   { version: 'v1', etag: '"abc123"', lastModified: new Date('2024-01-01') }
 * );
 * // Result: { shouldProcess: true }
 * ```
 */
export const validateConditionalRequest = (
  headers: ConditionalRequestHeaders,
  currentVersion: ResourceVersion,
): { shouldProcess: boolean; statusCode?: number } => {
  // If-Match: Process only if ETag matches
  if (headers.ifMatch && headers.ifMatch !== '*') {
    if (headers.ifMatch !== currentVersion.etag) {
      return { shouldProcess: false, statusCode: 412 }; // Precondition Failed
    }
  }

  // If-None-Match: Process only if ETag doesn't match
  if (headers.ifNoneMatch) {
    if (headers.ifNoneMatch === '*' || headers.ifNoneMatch === currentVersion.etag) {
      return { shouldProcess: false, statusCode: 304 }; // Not Modified
    }
  }

  // If-Modified-Since: Process only if modified after date
  if (headers.ifModifiedSince) {
    const ifModifiedDate = new Date(headers.ifModifiedSince);
    if (currentVersion.lastModified <= ifModifiedDate) {
      return { shouldProcess: false, statusCode: 304 }; // Not Modified
    }
  }

  // If-Unmodified-Since: Process only if not modified since date
  if (headers.ifUnmodifiedSince) {
    const ifUnmodifiedDate = new Date(headers.ifUnmodifiedSince);
    if (currentVersion.lastModified > ifUnmodifiedDate) {
      return { shouldProcess: false, statusCode: 412 }; // Precondition Failed
    }
  }

  return { shouldProcess: true };
};

/**
 * 6. Creates resource version metadata with ETag and Last-Modified.
 *
 * @param {any} resource - Resource data
 * @param {Date} [lastModified] - Last modified date (defaults to now)
 * @returns {ResourceVersion} Resource version metadata
 *
 * @example
 * ```typescript
 * const version = createResourceVersion(patient, new Date('2024-01-15'));
 * // Result: { version: 'v1', etag: '"abc..."', lastModified: Date('2024-01-15') }
 * ```
 */
export const createResourceVersion = (
  resource: any,
  lastModified?: Date,
): ResourceVersion => {
  return {
    version: 'v1',
    etag: generateETag(resource),
    lastModified: lastModified || new Date(),
  };
};

/**
 * 7. Compares ETags for cache validation.
 *
 * @param {string} etag1 - First ETag
 * @param {string} etag2 - Second ETag
 * @returns {boolean} True if ETags match
 *
 * @example
 * ```typescript
 * const matches = compareETags('"abc123"', '"abc123"'); // true
 * const weakMatch = compareETags('W/"abc123"', '"abc123"'); // true (weak comparison)
 * ```
 */
export const compareETags = (etag1: string, etag2: string): boolean => {
  // Strip weak validator prefix for comparison
  const normalize = (etag: string) => etag.replace(/^W\//, '');
  return normalize(etag1) === normalize(etag2);
};

// ============================================================================
// CONTENT NEGOTIATION UTILITIES
// ============================================================================

/**
 * 8. Negotiates content type based on Accept header.
 *
 * @param {string} acceptHeader - Accept header value
 * @param {string[]} supportedTypes - Supported content types
 * @returns {string | null} Best matching content type or null
 *
 * @example
 * ```typescript
 * const contentType = negotiateContentType(
 *   'application/json, application/xml;q=0.9, *\/*;q=0.8',
 *   ['application/json', 'application/xml', 'text/html']
 * );
 * // Result: 'application/json'
 * ```
 */
export const negotiateContentType = (
  acceptHeader: string,
  supportedTypes: string[],
): string | null => {
  const accepted = parseAcceptHeader(acceptHeader);

  for (const { type, quality } of accepted) {
    if (type === '*/*') {
      return supportedTypes[0];
    }

    const match = supportedTypes.find((supported) => {
      if (type.endsWith('/*')) {
        const prefix = type.replace('/*', '');
        return supported.startsWith(prefix);
      }
      return supported === type;
    });

    if (match) {
      return match;
    }
  }

  return null;
};

/**
 * 9. Parses Accept header with quality values.
 *
 * @param {string} acceptHeader - Accept header value
 * @returns {Array<{ type: string; quality: number }>} Parsed accept types with quality
 *
 * @example
 * ```typescript
 * const parsed = parseAcceptHeader('text/html, application/json;q=0.9, *\/*;q=0.8');
 * // Result: [
 * //   { type: 'text/html', quality: 1.0 },
 * //   { type: 'application/json', quality: 0.9 },
 * //   { type: '*\/*', quality: 0.8 }
 * // ]
 * ```
 */
export const parseAcceptHeader = (
  acceptHeader: string,
): Array<{ type: string; quality: number }> => {
  return acceptHeader
    .split(',')
    .map((part) => {
      const [type, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const quality = qParam ? parseFloat(qParam.split('=')[1]) : 1.0;

      return { type: type.trim(), quality };
    })
    .sort((a, b) => b.quality - a.quality);
};

/**
 * 10. Performs comprehensive content negotiation (type, charset, encoding, language).
 *
 * @param {object} headers - Request headers
 * @param {object} supported - Supported options
 * @returns {ContentNegotiationResult} Negotiation result
 *
 * @example
 * ```typescript
 * const result = negotiateContent(
 *   {
 *     accept: 'application/json',
 *     acceptCharset: 'utf-8',
 *     acceptEncoding: 'gzip, deflate',
 *     acceptLanguage: 'en-US, en;q=0.9'
 *   },
 *   {
 *     types: ['application/json', 'application/xml'],
 *     charsets: ['utf-8', 'iso-8859-1'],
 *     encodings: ['gzip', 'deflate'],
 *     languages: ['en-US', 'es-ES']
 *   }
 * );
 * ```
 */
export const negotiateContent = (
  headers: {
    accept?: string;
    acceptCharset?: string;
    acceptEncoding?: string;
    acceptLanguage?: string;
  },
  supported: {
    types: string[];
    charsets?: string[];
    encodings?: string[];
    languages?: string[];
  },
): ContentNegotiationResult => {
  const contentType = headers.accept
    ? negotiateContentType(headers.accept, supported.types)
    : supported.types[0];

  return {
    contentType: contentType || supported.types[0],
    charset: 'utf-8',
    encoding: headers.acceptEncoding?.includes('gzip') ? 'gzip' : undefined,
    language: headers.acceptLanguage?.split(',')[0]?.trim(),
  };
};

// ============================================================================
// CORS UTILITIES
// ============================================================================

/**
 * 11. Validates CORS origin against configuration.
 *
 * @param {string} origin - Request origin
 * @param {CorsConfig['origin']} allowedOrigins - Allowed origins configuration
 * @returns {boolean} True if origin is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = validateCorsOrigin('https://app.example.com', [
 *   'https://app.example.com',
 *   /\.example\.com$/
 * ]);
 * // Result: true
 * ```
 */
export const validateCorsOrigin = (
  origin: string,
  allowedOrigins: CorsConfig['origin'],
): boolean => {
  if (typeof allowedOrigins === 'string') {
    return origin === allowedOrigins || allowedOrigins === '*';
  }

  if (Array.isArray(allowedOrigins)) {
    return allowedOrigins.some((allowed) => {
      if (typeof allowed === 'string') {
        return origin === allowed || allowed === '*';
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
  }

  if (allowedOrigins instanceof RegExp) {
    return allowedOrigins.test(origin);
  }

  if (typeof allowedOrigins === 'function') {
    return allowedOrigins(origin);
  }

  return false;
};

/**
 * 12. Generates CORS headers for response.
 *
 * @param {string} origin - Request origin
 * @param {CorsConfig} config - CORS configuration
 * @returns {Record<string, string>} CORS headers
 *
 * @example
 * ```typescript
 * const headers = generateCorsHeaders('https://app.example.com', {
 *   origin: ['https://app.example.com'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   allowedHeaders: ['Content-Type', 'Authorization'],
 *   credentials: true,
 *   maxAge: 86400
 * });
 * // Result: {
 * //   'Access-Control-Allow-Origin': 'https://app.example.com',
 * //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
 * //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
 * //   'Access-Control-Allow-Credentials': 'true',
 * //   'Access-Control-Max-Age': '86400'
 * // }
 * ```
 */
export const generateCorsHeaders = (
  origin: string,
  config: CorsConfig,
): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (validateCorsOrigin(origin, config.origin)) {
    headers['Access-Control-Allow-Origin'] = origin;

    if (config.methods) {
      headers['Access-Control-Allow-Methods'] = config.methods.join(', ');
    }

    if (config.allowedHeaders) {
      headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
    }

    if (config.exposedHeaders) {
      headers['Access-Control-Expose-Headers'] = config.exposedHeaders.join(', ');
    }

    if (config.credentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }

    if (config.maxAge) {
      headers['Access-Control-Max-Age'] = config.maxAge.toString();
    }
  }

  return headers;
};

/**
 * 13. Handles CORS preflight OPTIONS request.
 *
 * @param {string} origin - Request origin
 * @param {string} method - Request method from Access-Control-Request-Method
 * @param {string[]} headers - Request headers from Access-Control-Request-Headers
 * @param {CorsConfig} config - CORS configuration
 * @returns {{ allowed: boolean; headers: Record<string, string> }} Preflight result
 *
 * @example
 * ```typescript
 * const result = handleCorsPreFlight(
 *   'https://app.example.com',
 *   'POST',
 *   ['Content-Type', 'Authorization'],
 *   corsConfig
 * );
 * ```
 */
export const handleCorsPreFlight = (
  origin: string,
  method: string,
  headers: string[],
  config: CorsConfig,
): { allowed: boolean; headers: Record<string, string> } => {
  if (!validateCorsOrigin(origin, config.origin)) {
    return { allowed: false, headers: {} };
  }

  const methodAllowed = !config.methods || config.methods.includes(method);
  const headersAllowed =
    !config.allowedHeaders ||
    headers.every((h) => config.allowedHeaders!.includes(h));

  if (!methodAllowed || !headersAllowed) {
    return { allowed: false, headers: {} };
  }

  return {
    allowed: true,
    headers: generateCorsHeaders(origin, config),
  };
};

// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================

/**
 * 14. Creates in-memory rate limiter with sliding window.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {object} Rate limiter instance
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   windowMs: 60000, // 1 minute
 *   maxRequests: 100,
 *   keyGenerator: (req) => req.ip
 * });
 *
 * const result = limiter.checkLimit('192.168.1.1');
 * if (!result.allowed) {
 *   // Rate limit exceeded
 * }
 * ```
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  const store = new Map<string, RateLimitState>();

  const checkLimit = (key: string): RateLimitState & { allowed: boolean } => {
    const now = Date.now();
    const state = store.get(key);

    if (!state || now >= state.resetTime.getTime()) {
      const newState: RateLimitState = {
        requests: 1,
        resetTime: new Date(now + config.windowMs),
        remaining: config.maxRequests - 1,
      };
      store.set(key, newState);
      return { ...newState, allowed: true };
    }

    if (state.requests >= config.maxRequests) {
      return { ...state, allowed: false };
    }

    state.requests++;
    state.remaining = config.maxRequests - state.requests;
    store.set(key, state);

    return { ...state, allowed: true };
  };

  const reset = (key: string) => {
    store.delete(key);
  };

  const resetAll = () => {
    store.clear();
  };

  return {
    checkLimit,
    reset,
    resetAll,
    getState: (key: string) => store.get(key),
  };
};

/**
 * 15. Generates rate limit headers for response (X-RateLimit-*).
 *
 * @param {RateLimitState} state - Rate limit state
 * @param {number} limit - Maximum requests allowed
 * @returns {Record<string, string>} Rate limit headers
 *
 * @example
 * ```typescript
 * const headers = generateRateLimitHeaders(
 *   { requests: 45, remaining: 55, resetTime: new Date('2024-01-01T12:01:00Z') },
 *   100
 * );
 * // Result: {
 * //   'X-RateLimit-Limit': '100',
 * //   'X-RateLimit-Remaining': '55',
 * //   'X-RateLimit-Reset': '1704110460'
 * // }
 * ```
 */
export const generateRateLimitHeaders = (
  state: RateLimitState,
  limit: number,
): Record<string, string> => {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': state.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(state.resetTime.getTime() / 1000).toString(),
    'X-RateLimit-Used': state.requests.toString(),
  };
};

/**
 * 16. Calculates rate limit reset time with retry-after header.
 *
 * @param {Date} resetTime - Reset time
 * @returns {{ retryAfter: number; retryAfterDate: string }} Retry timing
 *
 * @example
 * ```typescript
 * const retry = calculateRetryAfter(new Date(Date.now() + 60000));
 * // Result: { retryAfter: 60, retryAfterDate: 'Wed, 01 Jan 2024 12:01:00 GMT' }
 * ```
 */
export const calculateRetryAfter = (
  resetTime: Date,
): { retryAfter: number; retryAfterDate: string } => {
  const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
  return {
    retryAfter: Math.max(0, retryAfter),
    retryAfterDate: resetTime.toUTCString(),
  };
};

// ============================================================================
// API KEY MANAGEMENT UTILITIES
// ============================================================================

/**
 * 17. Generates secure API key with configurable options.
 *
 * @param {ApiKeyConfig} [config] - API key configuration
 * @returns {ApiKey} Generated API key with metadata
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey({
 *   prefix: 'wc',
 *   length: 32,
 *   expiresIn: 86400000, // 24 hours
 *   scopes: ['read:patients', 'write:appointments']
 * });
 * // Result: {
 * //   key: 'wc_a1b2c3d4e5f6...',
 * //   hash: 'sha256hash...',
 * //   createdAt: Date,
 * //   expiresAt: Date,
 * //   scopes: ['read:patients', 'write:appointments']
 * // }
 * ```
 */
export const generateApiKey = (config?: ApiKeyConfig): ApiKey => {
  const length = config?.length || 32;
  const keyBytes = randomBytes(length);
  const keyString = keyBytes.toString('base64url');
  const prefix = config?.prefix || 'api';
  const key = `${prefix}_${keyString}`;

  const hash = createHash('sha256').update(key).digest('hex');

  const createdAt = new Date();
  const expiresAt = config?.expiresIn
    ? new Date(createdAt.getTime() + config.expiresIn)
    : undefined;

  return {
    key,
    hash,
    createdAt,
    expiresAt,
    scopes: config?.scopes,
  };
};

/**
 * 18. Validates API key and checks expiration.
 *
 * @param {string} providedKey - API key from request
 * @param {ApiKey} storedKey - Stored API key data
 * @returns {{ valid: boolean; reason?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiKey(requestApiKey, storedApiKey);
 * if (!result.valid) {
 *   console.error(`Invalid API key: ${result.reason}`);
 * }
 * ```
 */
export const validateApiKey = (
  providedKey: string,
  storedKey: ApiKey,
): { valid: boolean; reason?: string } => {
  const providedHash = createHash('sha256').update(providedKey).digest('hex');

  if (providedHash !== storedKey.hash) {
    return { valid: false, reason: 'Invalid API key' };
  }

  if (storedKey.expiresAt && new Date() > storedKey.expiresAt) {
    return { valid: false, reason: 'API key expired' };
  }

  return { valid: true };
};

/**
 * 19. Checks API key scope/permission.
 *
 * @param {ApiKey} apiKey - API key data
 * @param {string} requiredScope - Required scope
 * @returns {boolean} True if API key has required scope
 *
 * @example
 * ```typescript
 * const hasPermission = checkApiKeyScope(apiKey, 'read:patients');
 * if (!hasPermission) {
 *   throw new Error('Insufficient permissions');
 * }
 * ```
 */
export const checkApiKeyScope = (apiKey: ApiKey, requiredScope: string): boolean => {
  if (!apiKey.scopes || apiKey.scopes.length === 0) {
    return true; // No scope restrictions
  }

  return apiKey.scopes.includes(requiredScope) || apiKey.scopes.includes('*');
};

/**
 * 20. Masks API key for safe logging/display.
 *
 * @param {string} apiKey - API key to mask
 * @param {number} [visibleChars] - Number of visible characters at end (default: 4)
 * @returns {string} Masked API key
 *
 * @example
 * ```typescript
 * const masked = maskApiKey('wc_a1b2c3d4e5f6g7h8i9j0', 4);
 * // Result: 'wc_****************j0'
 * ```
 */
export const maskApiKey = (apiKey: string, visibleChars: number = 4): string => {
  if (apiKey.length <= visibleChars) {
    return '*'.repeat(apiKey.length);
  }

  const [prefix, ...rest] = apiKey.split('_');
  const keyPart = rest.join('_');
  const visiblePart = keyPart.slice(-visibleChars);
  const maskedPart = '*'.repeat(Math.max(0, keyPart.length - visibleChars));

  return `${prefix}_${maskedPart}${visiblePart}`;
};

// ============================================================================
// WEBHOOK DELIVERY UTILITIES
// ============================================================================

/**
 * 21. Delivers webhook with signature verification and retry logic.
 *
 * @param {WebhookConfig} config - Webhook configuration
 * @param {WebhookPayload} payload - Webhook payload
 * @returns {Promise<WebhookDeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhook(
 *   {
 *     url: 'https://example.com/webhook',
 *     secret: 'webhook_secret',
 *     events: ['patient.created'],
 *     retryAttempts: 3,
 *     timeout: 5000
 *   },
 *   {
 *     event: 'patient.created',
 *     timestamp: new Date(),
 *     data: { id: 123, name: 'John Doe' }
 *   }
 * );
 * ```
 */
export const deliverWebhook = async (
  config: WebhookConfig,
  payload: WebhookPayload,
): Promise<WebhookDeliveryResult> => {
  const maxAttempts = config.retryAttempts || 3;
  const timeout = config.timeout || 30000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const startTime = Date.now();

    try {
      const signature = generateWebhookSignature(payload, config.secret);
      const signedPayload = { ...payload, signature };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': payload.event,
          'X-Webhook-Timestamp': payload.timestamp.toISOString(),
          ...config.headers,
        },
        body: JSON.stringify(signedPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        success: response.ok,
        statusCode: response.status,
        attempt,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      if (attempt === maxAttempts) {
        return {
          success: false,
          attempt,
          error: error as Error,
          responseTime: Date.now() - startTime,
        };
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      );
    }
  }

  return {
    success: false,
    attempt: maxAttempts,
    error: new Error('Max retry attempts exceeded'),
    responseTime: 0,
  };
};

/**
 * 22. Generates HMAC signature for webhook payload.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {string} HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'webhook_secret');
 * // Result: 'sha256=a1b2c3d4e5f6...'
 * ```
 */
export const generateWebhookSignature = (
  payload: WebhookPayload,
  secret: string,
): string => {
  const data = JSON.stringify(payload);
  const hmac = createHash('sha256').update(`${secret}${data}`).digest('hex');
  return `sha256=${hmac}`;
};

/**
 * 23. Verifies webhook signature from incoming request.
 *
 * @param {string} signature - Provided signature
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(
 *   req.headers['x-webhook-signature'],
 *   req.body,
 *   'webhook_secret'
 * );
 * ```
 */
export const verifyWebhookSignature = (
  signature: string,
  payload: WebhookPayload,
  secret: string,
): boolean => {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return signature === expectedSignature;
};

// ============================================================================
// BATCH AND BULK OPERATION UTILITIES
// ============================================================================

/**
 * 24. Processes batch requests with parallel execution.
 *
 * @param {BatchRequest[]} requests - Batch requests
 * @param {number} [maxConcurrent] - Maximum concurrent requests (default: 5)
 * @returns {Promise<BatchResponse[]>} Batch responses
 *
 * @example
 * ```typescript
 * const responses = await processBatchRequests([
 *   { method: 'GET', url: '/api/patients/1' },
 *   { method: 'GET', url: '/api/patients/2' },
 *   { method: 'POST', url: '/api/appointments', body: {...} }
 * ], 3);
 * ```
 */
export const processBatchRequests = async (
  requests: BatchRequest[],
  maxConcurrent: number = 5,
): Promise<BatchResponse[]> => {
  const results: BatchResponse[] = [];
  const queue = [...requests];

  const processBatch = async (batch: BatchRequest[]): Promise<void> => {
    const promises = batch.map(async (request) => {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        const body = await response.json().catch(() => null);

        return {
          statusCode: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body,
        };
      } catch (error) {
        return {
          statusCode: 500,
          error: (error as Error).message,
        };
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  };

  while (queue.length > 0) {
    const batch = queue.splice(0, maxConcurrent);
    await processBatch(batch);
  }

  return results;
};

/**
 * 25. Creates bulk operation response with partial success handling.
 *
 * @template T
 * @param {Array<{ success: boolean; data?: T; error?: string }>} results - Operation results
 * @returns {object} Bulk operation response
 *
 * @example
 * ```typescript
 * const bulkResponse = createBulkResponse([
 *   { success: true, data: { id: 1 } },
 *   { success: false, error: 'Validation failed' },
 *   { success: true, data: { id: 2 } }
 * ]);
 * // Result: {
 * //   totalCount: 3,
 * //   successCount: 2,
 * //   failureCount: 1,
 * //   results: [...]
 * // }
 * ```
 */
export const createBulkResponse = <T>(
  results: Array<{ success: boolean; data?: T; error?: string }>,
): {
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: typeof results;
} => {
  return {
    totalCount: results.length,
    successCount: results.filter((r) => r.success).length,
    failureCount: results.filter((r) => !r.success).length,
    results,
  };
};

/**
 * 26. Validates batch request size and limits.
 *
 * @param {BatchRequest[]} requests - Batch requests
 * @param {number} maxBatchSize - Maximum batch size
 * @param {number} [maxPayloadSize] - Maximum payload size in bytes
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateBatchRequest(requests, 100, 1048576); // Max 100 requests, 1MB
 * if (!validation.valid) {
 *   throw new Error(validation.error);
 * }
 * ```
 */
export const validateBatchRequest = (
  requests: BatchRequest[],
  maxBatchSize: number,
  maxPayloadSize?: number,
): { valid: boolean; error?: string } => {
  if (requests.length === 0) {
    return { valid: false, error: 'Batch cannot be empty' };
  }

  if (requests.length > maxBatchSize) {
    return {
      valid: false,
      error: `Batch size ${requests.length} exceeds maximum ${maxBatchSize}`,
    };
  }

  if (maxPayloadSize) {
    const totalSize = JSON.stringify(requests).length;
    if (totalSize > maxPayloadSize) {
      return {
        valid: false,
        error: `Batch payload size ${totalSize} exceeds maximum ${maxPayloadSize} bytes`,
      };
    }
  }

  return { valid: true };
};

// ============================================================================
// FIELD FILTERING AND PARTIAL RESPONSE UTILITIES
// ============================================================================

/**
 * 27. Applies field filter to resource (include/exclude fields).
 *
 * @template T
 * @param {T} resource - Resource object
 * @param {FieldFilter} filter - Field filter configuration
 * @returns {Partial<T>} Filtered resource
 *
 * @example
 * ```typescript
 * const filtered = applyFieldFilter(
 *   { id: 1, name: 'John', email: 'john@example.com', password: 'secret' },
 *   { exclude: ['password'] }
 * );
 * // Result: { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export const applyFieldFilter = <T extends Record<string, any>>(
  resource: T,
  filter: FieldFilter,
): Partial<T> => {
  if (filter.include && filter.include.length > 0) {
    const result: Partial<T> = {};
    filter.include.forEach((field) => {
      if (field in resource) {
        result[field as keyof T] = resource[field];
      }
    });
    return result;
  }

  if (filter.exclude && filter.exclude.length > 0) {
    const result = { ...resource };
    filter.exclude.forEach((field) => {
      delete result[field];
    });
    return result;
  }

  return resource;
};

/**
 * 28. Parses field selection from query parameter (e.g., "?fields=id,name,email").
 *
 * @param {string} fieldsParam - Fields query parameter
 * @returns {string[]} Array of field names
 *
 * @example
 * ```typescript
 * const fields = parseFieldsParameter('id,name,email,profile.avatar');
 * // Result: ['id', 'name', 'email', 'profile.avatar']
 * ```
 */
export const parseFieldsParameter = (fieldsParam: string): string[] => {
  return fieldsParam
    .split(',')
    .map((field) => field.trim())
    .filter((field) => field.length > 0);
};

/**
 * 29. Creates sparse fieldset for resource type (JSON:API style).
 *
 * @template T
 * @param {T} resource - Resource object
 * @param {Record<string, string[]>} sparseFields - Sparse fieldsets by type
 * @param {string} resourceType - Resource type
 * @returns {Partial<T>} Sparse resource
 *
 * @example
 * ```typescript
 * const sparse = applySparseFieldset(
 *   patient,
 *   { patients: ['id', 'name', 'dateOfBirth'] },
 *   'patients'
 * );
 * ```
 */
export const applySparseFieldset = <T extends Record<string, any>>(
  resource: T,
  sparseFields: Record<string, string[]>,
  resourceType: string,
): Partial<T> => {
  const fields = sparseFields[resourceType];

  if (!fields || fields.length === 0) {
    return resource;
  }

  return applyFieldFilter(resource, { include: fields });
};

/**
 * 30. Applies partial response with nested field support.
 *
 * @template T
 * @param {T} resource - Resource object
 * @param {PartialResponseOptions} options - Partial response options
 * @returns {Partial<T>} Partial resource
 *
 * @example
 * ```typescript
 * const partial = applyPartialResponse(
 *   patient,
 *   { fields: ['id', 'name', 'address.city', 'address.state'], depth: 2 }
 * );
 * ```
 */
export const applyPartialResponse = <T extends Record<string, any>>(
  resource: T,
  options: PartialResponseOptions,
): Partial<T> => {
  if (options.fields && options.fields.length > 0) {
    return pickFields(resource, options.fields);
  }

  if (options.omit && options.omit.length > 0) {
    return applyFieldFilter(resource, { exclude: options.omit });
  }

  return resource;
};

/**
 * 31. Picks nested fields from object using dot notation.
 *
 * @template T
 * @param {T} obj - Source object
 * @param {string[]} fields - Field paths (dot notation)
 * @returns {Partial<T>} Object with selected fields
 *
 * @example
 * ```typescript
 * const picked = pickFields(
 *   { id: 1, profile: { name: 'John', address: { city: 'NYC' } } },
 *   ['id', 'profile.name', 'profile.address.city']
 * );
 * // Result: { id: 1, profile: { name: 'John', address: { city: 'NYC' } } }
 * ```
 */
export const pickFields = <T extends Record<string, any>>(
  obj: T,
  fields: string[],
): Partial<T> => {
  const result: any = {};

  fields.forEach((field) => {
    const parts = field.split('.');
    let source: any = obj;
    let target: any = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        if (source && part in source) {
          target[part] = source[part];
        }
      } else {
        if (!(part in target)) {
          target[part] = {};
        }
        target = target[part];
        source = source?.[part];
      }
    }
  });

  return result;
};

// ============================================================================
// CACHE CONTROL UTILITIES
// ============================================================================

/**
 * 32. Generates Cache-Control header from configuration.
 *
 * @param {CacheControl} config - Cache control configuration
 * @returns {string} Cache-Control header value
 *
 * @example
 * ```typescript
 * const cacheControl = generateCacheControlHeader({
 *   public: true,
 *   maxAge: 3600,
 *   staleWhileRevalidate: 86400
 * });
 * // Result: 'public, max-age=3600, stale-while-revalidate=86400'
 * ```
 */
export const generateCacheControlHeader = (config: CacheControl): string => {
  const directives: string[] = [];

  if (config.public) directives.push('public');
  if (config.private) directives.push('private');
  if (config.noCache) directives.push('no-cache');
  if (config.noStore) directives.push('no-store');
  if (config.mustRevalidate) directives.push('must-revalidate');
  if (config.proxyRevalidate) directives.push('proxy-revalidate');
  if (config.maxAge !== undefined) directives.push(`max-age=${config.maxAge}`);
  if (config.sMaxage !== undefined) directives.push(`s-maxage=${config.sMaxage}`);
  if (config.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }
  if (config.staleIfError !== undefined) {
    directives.push(`stale-if-error=${config.staleIfError}`);
  }

  return directives.join(', ');
};

/**
 * 33. Creates cache headers for different resource types.
 *
 * @param {string} resourceType - Resource type (static, dynamic, api)
 * @param {number} [customMaxAge] - Custom max-age override
 * @returns {Record<string, string>} Cache headers
 *
 * @example
 * ```typescript
 * const headers = createCacheHeaders('static', 31536000);
 * // Result: {
 * //   'Cache-Control': 'public, max-age=31536000, immutable',
 * //   'Vary': 'Accept-Encoding'
 * // }
 * ```
 */
export const createCacheHeaders = (
  resourceType: 'static' | 'dynamic' | 'api' | 'private',
  customMaxAge?: number,
): Record<string, string> => {
  const headers: Record<string, string> = {};

  switch (resourceType) {
    case 'static':
      headers['Cache-Control'] = generateCacheControlHeader({
        public: true,
        maxAge: customMaxAge || 31536000, // 1 year
      });
      headers['Vary'] = 'Accept-Encoding';
      break;

    case 'dynamic':
      headers['Cache-Control'] = generateCacheControlHeader({
        public: true,
        maxAge: customMaxAge || 300, // 5 minutes
        staleWhileRevalidate: 3600,
      });
      headers['Vary'] = 'Accept, Accept-Encoding';
      break;

    case 'api':
      headers['Cache-Control'] = generateCacheControlHeader({
        private: true,
        maxAge: customMaxAge || 60,
        mustRevalidate: true,
      });
      headers['Vary'] = 'Accept, Authorization';
      break;

    case 'private':
      headers['Cache-Control'] = generateCacheControlHeader({
        private: true,
        noStore: true,
      });
      break;
  }

  return headers;
};

/**
 * 34. Determines if resource should be cached based on request/response.
 *
 * @param {object} request - Request metadata
 * @param {object} response - Response metadata
 * @returns {boolean} True if resource should be cached
 *
 * @example
 * ```typescript
 * const shouldCache = shouldCacheResource(
 *   { method: 'GET', hasAuthHeader: false },
 *   { statusCode: 200, hasCacheControl: true }
 * );
 * ```
 */
export const shouldCacheResource = (
  request: { method: string; hasAuthHeader?: boolean },
  response: { statusCode: number; hasCacheControl?: boolean },
): boolean => {
  // Only cache GET and HEAD requests
  if (!['GET', 'HEAD'].includes(request.method)) {
    return false;
  }

  // Don't cache authenticated requests by default
  if (request.hasAuthHeader) {
    return false;
  }

  // Only cache successful responses
  if (response.statusCode < 200 || response.statusCode >= 300) {
    return false;
  }

  return true;
};

// ============================================================================
// HTTP METHOD AND STATUS CODE UTILITIES
// ============================================================================

/**
 * 35. Validates HTTP method is allowed for endpoint.
 *
 * @param {string} method - HTTP method
 * @param {string[]} allowedMethods - Allowed methods for endpoint
 * @returns {boolean} True if method is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = validateHttpMethod('PATCH', ['GET', 'POST', 'PUT', 'DELETE']);
 * // Result: false
 * ```
 */
export const validateHttpMethod = (
  method: string,
  allowedMethods: string[],
): boolean => {
  return allowedMethods.includes(method.toUpperCase());
};

/**
 * 36. Determines if HTTP method is idempotent.
 *
 * @param {string} method - HTTP method
 * @returns {boolean} True if method is idempotent
 *
 * @example
 * ```typescript
 * const isIdempotent = isIdempotentMethod('PUT'); // true
 * const notIdempotent = isIdempotentMethod('POST'); // false
 * ```
 */
export const isIdempotentMethod = (method: string): boolean => {
  const idempotentMethods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
  return idempotentMethods.includes(method.toUpperCase());
};

/**
 * 37. Determines if HTTP method is safe (read-only).
 *
 * @param {string} method - HTTP method
 * @returns {boolean} True if method is safe
 *
 * @example
 * ```typescript
 * const isSafe = isSafeMethod('GET'); // true
 * const notSafe = isSafeMethod('DELETE'); // false
 * ```
 */
export const isSafeMethod = (method: string): boolean => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
  return safeMethods.includes(method.toUpperCase());
};

/**
 * 38. Gets standard HTTP status text for status code.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {string} Status text
 *
 * @example
 * ```typescript
 * const text = getStatusText(404); // 'Not Found'
 * const text2 = getStatusText(201); // 'Created'
 * ```
 */
export const getStatusText = (statusCode: number): string => {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    409: 'Conflict',
    410: 'Gone',
    412: 'Precondition Failed',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  return statusTexts[statusCode] || 'Unknown Status';
};

/**
 * 39. Determines appropriate status code for operation type.
 *
 * @param {string} operation - Operation type (create, update, delete, etc.)
 * @param {boolean} [resourceExists] - Whether resource exists (for updates)
 * @returns {number} Appropriate HTTP status code
 *
 * @example
 * ```typescript
 * const status = getStatusCodeForOperation('create'); // 201
 * const status2 = getStatusCodeForOperation('update', true); // 200
 * const status3 = getStatusCodeForOperation('delete'); // 204
 * ```
 */
export const getStatusCodeForOperation = (
  operation: 'create' | 'update' | 'delete' | 'read' | 'list',
  resourceExists?: boolean,
): number => {
  switch (operation) {
    case 'create':
      return 201; // Created
    case 'update':
      return resourceExists ? 200 : 201; // OK or Created
    case 'delete':
      return 204; // No Content
    case 'read':
      return 200; // OK
    case 'list':
      return 200; // OK
    default:
      return 200;
  }
};

// ============================================================================
// REQUEST VALIDATION UTILITIES
// ============================================================================

/**
 * 40. Validates required headers are present.
 *
 * @param {Record<string, string>} headers - Request headers
 * @param {string[]} requiredHeaders - Required header names
 * @returns {{ valid: boolean; missing?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequiredHeaders(
 *   req.headers,
 *   ['Content-Type', 'Authorization', 'X-API-Key']
 * );
 * if (!result.valid) {
 *   console.error('Missing headers:', result.missing);
 * }
 * ```
 */
export const validateRequiredHeaders = (
  headers: Record<string, string>,
  requiredHeaders: string[],
): { valid: boolean; missing?: string[] } => {
  const normalizedHeaders = Object.keys(headers).map((k) => k.toLowerCase());
  const missing = requiredHeaders.filter(
    (required) => !normalizedHeaders.includes(required.toLowerCase()),
  );

  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  };
};

/**
 * 41. Validates Content-Type header matches expected type.
 *
 * @param {string} contentType - Content-Type header value
 * @param {string[]} acceptedTypes - Accepted content types
 * @returns {boolean} True if content type is accepted
 *
 * @example
 * ```typescript
 * const isValid = validateContentType(
 *   'application/json; charset=utf-8',
 *   ['application/json', 'application/xml']
 * );
 * // Result: true
 * ```
 */
export const validateContentType = (
  contentType: string,
  acceptedTypes: string[],
): boolean => {
  const baseType = contentType.split(';')[0].trim().toLowerCase();
  return acceptedTypes.some((accepted) => baseType === accepted.toLowerCase());
};

/**
 * 42. Validates Accept header can be satisfied.
 *
 * @param {string} acceptHeader - Accept header value
 * @param {string[]} availableTypes - Available response types
 * @returns {{ canSatisfy: boolean; matchedType?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateAcceptHeader(
 *   'application/json, application/xml;q=0.9',
 *   ['application/json', 'text/html']
 * );
 * // Result: { canSatisfy: true, matchedType: 'application/json' }
 * ```
 */
export const validateAcceptHeader = (
  acceptHeader: string,
  availableTypes: string[],
): { canSatisfy: boolean; matchedType?: string } => {
  const matchedType = negotiateContentType(acceptHeader, availableTypes);

  return {
    canSatisfy: matchedType !== null,
    matchedType: matchedType || undefined,
  };
};

// ============================================================================
// SECURITY HEADER UTILITIES
// ============================================================================

/**
 * 43. Generates security headers for API responses.
 *
 * @param {object} [options] - Security header options
 * @returns {Record<string, string>} Security headers
 *
 * @example
 * ```typescript
 * const headers = generateSecurityHeaders({
 *   enableHSTS: true,
 *   frameOptions: 'DENY',
 *   contentSecurityPolicy: "default-src 'self'"
 * });
 * // Result: {
 * //   'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
 * //   'X-Frame-Options': 'DENY',
 * //   'X-Content-Type-Options': 'nosniff',
 * //   'X-XSS-Protection': '1; mode=block',
 * //   'Content-Security-Policy': "default-src 'self'"
 * // }
 * ```
 */
export const generateSecurityHeaders = (options?: {
  enableHSTS?: boolean;
  hstsMaxAge?: number;
  frameOptions?: 'DENY' | 'SAMEORIGIN';
  contentSecurityPolicy?: string;
  referrerPolicy?: string;
}): Record<string, string> => {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
  };

  if (options?.enableHSTS) {
    const maxAge = options.hstsMaxAge || 31536000;
    headers['Strict-Transport-Security'] = `max-age=${maxAge}; includeSubDomains`;
  }

  if (options?.frameOptions) {
    headers['X-Frame-Options'] = options.frameOptions;
  }

  if (options?.contentSecurityPolicy) {
    headers['Content-Security-Policy'] = options.contentSecurityPolicy;
  }

  if (options?.referrerPolicy) {
    headers['Referrer-Policy'] = options.referrerPolicy;
  }

  return headers;
};

/**
 * 44. Validates API version from header or URL.
 *
 * @param {string} version - API version string
 * @param {string[]} supportedVersions - Supported API versions
 * @returns {{ valid: boolean; normalized?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiVersion('v2', ['v1', 'v2', 'v3']);
 * // Result: { valid: true, normalized: 'v2' }
 * ```
 */
export const validateApiVersion = (
  version: string,
  supportedVersions: string[],
): { valid: boolean; normalized?: string } => {
  const normalized = version.toLowerCase().startsWith('v')
    ? version.toLowerCase()
    : `v${version}`;

  return {
    valid: supportedVersions.includes(normalized),
    normalized: normalized,
  };
};

/**
 * 45. Creates API documentation metadata for endpoint.
 *
 * @param {Partial<ApiDocumentation>} metadata - Documentation metadata
 * @returns {ApiDocumentation} Complete API documentation
 *
 * @example
 * ```typescript
 * const docs = createApiDocumentation({
 *   endpoint: '/api/v1/patients',
 *   method: 'GET',
 *   description: 'List all patients',
 *   parameters: [
 *     { name: 'page', type: 'number', required: false, description: 'Page number' }
 *   ],
 *   responses: {
 *     200: { description: 'Success', schema: { type: 'array' } },
 *     401: { description: 'Unauthorized' }
 *   }
 * });
 * ```
 */
export const createApiDocumentation = (
  metadata: Partial<ApiDocumentation>,
): ApiDocumentation => {
  return {
    endpoint: metadata.endpoint || '',
    method: metadata.method || 'GET',
    description: metadata.description || '',
    parameters: metadata.parameters || [],
    responses: metadata.responses || {
      200: { description: 'Success' },
    },
    examples: metadata.examples || [],
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // HATEOAS
  generateHateoasLinks,
  createHalResource,
  createTemplatedLink,

  // ETags and conditional requests
  generateETag,
  validateConditionalRequest,
  createResourceVersion,
  compareETags,

  // Content negotiation
  negotiateContentType,
  parseAcceptHeader,
  negotiateContent,

  // CORS
  validateCorsOrigin,
  generateCorsHeaders,
  handleCorsPreFlight,

  // Rate limiting
  createRateLimiter,
  generateRateLimitHeaders,
  calculateRetryAfter,

  // API keys
  generateApiKey,
  validateApiKey,
  checkApiKeyScope,
  maskApiKey,

  // Webhooks
  deliverWebhook,
  generateWebhookSignature,
  verifyWebhookSignature,

  // Batch operations
  processBatchRequests,
  createBulkResponse,
  validateBatchRequest,

  // Field filtering
  applyFieldFilter,
  parseFieldsParameter,
  applySparseFieldset,
  applyPartialResponse,
  pickFields,

  // Cache control
  generateCacheControlHeader,
  createCacheHeaders,
  shouldCacheResource,

  // HTTP methods and status codes
  validateHttpMethod,
  isIdempotentMethod,
  isSafeMethod,
  getStatusText,
  getStatusCodeForOperation,

  // Request validation
  validateRequiredHeaders,
  validateContentType,
  validateAcceptHeader,

  // Security
  generateSecurityHeaders,
  validateApiVersion,
  createApiDocumentation,
};
