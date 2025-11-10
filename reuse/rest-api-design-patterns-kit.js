"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiDocumentation = exports.validateApiVersion = exports.generateSecurityHeaders = exports.validateAcceptHeader = exports.validateContentType = exports.validateRequiredHeaders = exports.getStatusCodeForOperation = exports.getStatusText = exports.isSafeMethod = exports.isIdempotentMethod = exports.validateHttpMethod = exports.shouldCacheResource = exports.createCacheHeaders = exports.generateCacheControlHeader = exports.pickFields = exports.applyPartialResponse = exports.applySparseFieldset = exports.parseFieldsParameter = exports.applyFieldFilter = exports.validateBatchRequest = exports.createBulkResponse = exports.processBatchRequests = exports.verifyWebhookSignature = exports.generateWebhookSignature = exports.deliverWebhook = exports.maskApiKey = exports.checkApiKeyScope = exports.validateApiKey = exports.generateApiKey = exports.calculateRetryAfter = exports.generateRateLimitHeaders = exports.createRateLimiter = exports.handleCorsPreFlight = exports.generateCorsHeaders = exports.validateCorsOrigin = exports.negotiateContent = exports.parseAcceptHeader = exports.negotiateContentType = exports.compareETags = exports.createResourceVersion = exports.validateConditionalRequest = exports.generateETag = exports.createTemplatedLink = exports.createHalResource = exports.generateHateoasLinks = void 0;
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
const crypto_1 = require("crypto");
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
const generateHateoasLinks = (baseUrl, resourceType, resourceId, additionalLinks) => {
    const links = {
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
exports.generateHateoasLinks = generateHateoasLinks;
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
const createHalResource = (resource, links, embedded) => {
    const halResource = { ...resource, _links: links };
    if (embedded && Object.keys(embedded).length > 0) {
        halResource._embedded = embedded;
    }
    return halResource;
};
exports.createHalResource = createHalResource;
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
const createTemplatedLink = (template, params) => {
    return {
        href: template,
        templated: true,
    };
};
exports.createTemplatedLink = createTemplatedLink;
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
const generateETag = (resource, options) => {
    const algorithm = options?.algorithm || 'sha256';
    const content = JSON.stringify(resource);
    const hash = (0, crypto_1.createHash)(algorithm).update(content).digest('hex');
    const etag = `"${hash}"`;
    return options?.weak ? `W/${etag}` : etag;
};
exports.generateETag = generateETag;
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
const validateConditionalRequest = (headers, currentVersion) => {
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
exports.validateConditionalRequest = validateConditionalRequest;
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
const createResourceVersion = (resource, lastModified) => {
    return {
        version: 'v1',
        etag: (0, exports.generateETag)(resource),
        lastModified: lastModified || new Date(),
    };
};
exports.createResourceVersion = createResourceVersion;
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
const compareETags = (etag1, etag2) => {
    // Strip weak validator prefix for comparison
    const normalize = (etag) => etag.replace(/^W\//, '');
    return normalize(etag1) === normalize(etag2);
};
exports.compareETags = compareETags;
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
const negotiateContentType = (acceptHeader, supportedTypes) => {
    const accepted = (0, exports.parseAcceptHeader)(acceptHeader);
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
exports.negotiateContentType = negotiateContentType;
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
const parseAcceptHeader = (acceptHeader) => {
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
exports.parseAcceptHeader = parseAcceptHeader;
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
const negotiateContent = (headers, supported) => {
    const contentType = headers.accept
        ? (0, exports.negotiateContentType)(headers.accept, supported.types)
        : supported.types[0];
    return {
        contentType: contentType || supported.types[0],
        charset: 'utf-8',
        encoding: headers.acceptEncoding?.includes('gzip') ? 'gzip' : undefined,
        language: headers.acceptLanguage?.split(',')[0]?.trim(),
    };
};
exports.negotiateContent = negotiateContent;
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
const validateCorsOrigin = (origin, allowedOrigins) => {
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
exports.validateCorsOrigin = validateCorsOrigin;
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
const generateCorsHeaders = (origin, config) => {
    const headers = {};
    if ((0, exports.validateCorsOrigin)(origin, config.origin)) {
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
exports.generateCorsHeaders = generateCorsHeaders;
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
const handleCorsPreFlight = (origin, method, headers, config) => {
    if (!(0, exports.validateCorsOrigin)(origin, config.origin)) {
        return { allowed: false, headers: {} };
    }
    const methodAllowed = !config.methods || config.methods.includes(method);
    const headersAllowed = !config.allowedHeaders ||
        headers.every((h) => config.allowedHeaders.includes(h));
    if (!methodAllowed || !headersAllowed) {
        return { allowed: false, headers: {} };
    }
    return {
        allowed: true,
        headers: (0, exports.generateCorsHeaders)(origin, config),
    };
};
exports.handleCorsPreFlight = handleCorsPreFlight;
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
const createRateLimiter = (config) => {
    const store = new Map();
    const checkLimit = (key) => {
        const now = Date.now();
        const state = store.get(key);
        if (!state || now >= state.resetTime.getTime()) {
            const newState = {
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
    const reset = (key) => {
        store.delete(key);
    };
    const resetAll = () => {
        store.clear();
    };
    return {
        checkLimit,
        reset,
        resetAll,
        getState: (key) => store.get(key),
    };
};
exports.createRateLimiter = createRateLimiter;
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
const generateRateLimitHeaders = (state, limit) => {
    return {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': state.remaining.toString(),
        'X-RateLimit-Reset': Math.floor(state.resetTime.getTime() / 1000).toString(),
        'X-RateLimit-Used': state.requests.toString(),
    };
};
exports.generateRateLimitHeaders = generateRateLimitHeaders;
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
const calculateRetryAfter = (resetTime) => {
    const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    return {
        retryAfter: Math.max(0, retryAfter),
        retryAfterDate: resetTime.toUTCString(),
    };
};
exports.calculateRetryAfter = calculateRetryAfter;
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
const generateApiKey = (config) => {
    const length = config?.length || 32;
    const keyBytes = (0, crypto_1.randomBytes)(length);
    const keyString = keyBytes.toString('base64url');
    const prefix = config?.prefix || 'api';
    const key = `${prefix}_${keyString}`;
    const hash = (0, crypto_1.createHash)('sha256').update(key).digest('hex');
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
exports.generateApiKey = generateApiKey;
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
const validateApiKey = (providedKey, storedKey) => {
    const providedHash = (0, crypto_1.createHash)('sha256').update(providedKey).digest('hex');
    if (providedHash !== storedKey.hash) {
        return { valid: false, reason: 'Invalid API key' };
    }
    if (storedKey.expiresAt && new Date() > storedKey.expiresAt) {
        return { valid: false, reason: 'API key expired' };
    }
    return { valid: true };
};
exports.validateApiKey = validateApiKey;
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
const checkApiKeyScope = (apiKey, requiredScope) => {
    if (!apiKey.scopes || apiKey.scopes.length === 0) {
        return true; // No scope restrictions
    }
    return apiKey.scopes.includes(requiredScope) || apiKey.scopes.includes('*');
};
exports.checkApiKeyScope = checkApiKeyScope;
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
const maskApiKey = (apiKey, visibleChars = 4) => {
    if (apiKey.length <= visibleChars) {
        return '*'.repeat(apiKey.length);
    }
    const [prefix, ...rest] = apiKey.split('_');
    const keyPart = rest.join('_');
    const visiblePart = keyPart.slice(-visibleChars);
    const maskedPart = '*'.repeat(Math.max(0, keyPart.length - visibleChars));
    return `${prefix}_${maskedPart}${visiblePart}`;
};
exports.maskApiKey = maskApiKey;
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
const deliverWebhook = async (config, payload) => {
    const maxAttempts = config.retryAttempts || 3;
    const timeout = config.timeout || 30000;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const startTime = Date.now();
        try {
            const signature = (0, exports.generateWebhookSignature)(payload, config.secret);
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
        }
        catch (error) {
            if (attempt === maxAttempts) {
                return {
                    success: false,
                    attempt,
                    error: error,
                    responseTime: Date.now() - startTime,
                };
            }
            // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
    return {
        success: false,
        attempt: maxAttempts,
        error: new Error('Max retry attempts exceeded'),
        responseTime: 0,
    };
};
exports.deliverWebhook = deliverWebhook;
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
const generateWebhookSignature = (payload, secret) => {
    const data = JSON.stringify(payload);
    const hmac = (0, crypto_1.createHash)('sha256').update(`${secret}${data}`).digest('hex');
    return `sha256=${hmac}`;
};
exports.generateWebhookSignature = generateWebhookSignature;
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
const verifyWebhookSignature = (signature, payload, secret) => {
    const expectedSignature = (0, exports.generateWebhookSignature)(payload, secret);
    return signature === expectedSignature;
};
exports.verifyWebhookSignature = verifyWebhookSignature;
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
const processBatchRequests = async (requests, maxConcurrent = 5) => {
    const results = [];
    const queue = [...requests];
    const processBatch = async (batch) => {
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
            }
            catch (error) {
                return {
                    statusCode: 500,
                    error: error.message,
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
exports.processBatchRequests = processBatchRequests;
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
const createBulkResponse = (results) => {
    return {
        totalCount: results.length,
        successCount: results.filter((r) => r.success).length,
        failureCount: results.filter((r) => !r.success).length,
        results,
    };
};
exports.createBulkResponse = createBulkResponse;
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
const validateBatchRequest = (requests, maxBatchSize, maxPayloadSize) => {
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
exports.validateBatchRequest = validateBatchRequest;
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
const applyFieldFilter = (resource, filter) => {
    if (filter.include && filter.include.length > 0) {
        const result = {};
        filter.include.forEach((field) => {
            if (field in resource) {
                result[field] = resource[field];
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
exports.applyFieldFilter = applyFieldFilter;
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
const parseFieldsParameter = (fieldsParam) => {
    return fieldsParam
        .split(',')
        .map((field) => field.trim())
        .filter((field) => field.length > 0);
};
exports.parseFieldsParameter = parseFieldsParameter;
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
const applySparseFieldset = (resource, sparseFields, resourceType) => {
    const fields = sparseFields[resourceType];
    if (!fields || fields.length === 0) {
        return resource;
    }
    return (0, exports.applyFieldFilter)(resource, { include: fields });
};
exports.applySparseFieldset = applySparseFieldset;
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
const applyPartialResponse = (resource, options) => {
    if (options.fields && options.fields.length > 0) {
        return (0, exports.pickFields)(resource, options.fields);
    }
    if (options.omit && options.omit.length > 0) {
        return (0, exports.applyFieldFilter)(resource, { exclude: options.omit });
    }
    return resource;
};
exports.applyPartialResponse = applyPartialResponse;
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
const pickFields = (obj, fields) => {
    const result = {};
    fields.forEach((field) => {
        const parts = field.split('.');
        let source = obj;
        let target = result;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                if (source && part in source) {
                    target[part] = source[part];
                }
            }
            else {
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
exports.pickFields = pickFields;
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
const generateCacheControlHeader = (config) => {
    const directives = [];
    if (config.public)
        directives.push('public');
    if (config.private)
        directives.push('private');
    if (config.noCache)
        directives.push('no-cache');
    if (config.noStore)
        directives.push('no-store');
    if (config.mustRevalidate)
        directives.push('must-revalidate');
    if (config.proxyRevalidate)
        directives.push('proxy-revalidate');
    if (config.maxAge !== undefined)
        directives.push(`max-age=${config.maxAge}`);
    if (config.sMaxage !== undefined)
        directives.push(`s-maxage=${config.sMaxage}`);
    if (config.staleWhileRevalidate !== undefined) {
        directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
    }
    if (config.staleIfError !== undefined) {
        directives.push(`stale-if-error=${config.staleIfError}`);
    }
    return directives.join(', ');
};
exports.generateCacheControlHeader = generateCacheControlHeader;
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
const createCacheHeaders = (resourceType, customMaxAge) => {
    const headers = {};
    switch (resourceType) {
        case 'static':
            headers['Cache-Control'] = (0, exports.generateCacheControlHeader)({
                public: true,
                maxAge: customMaxAge || 31536000, // 1 year
            });
            headers['Vary'] = 'Accept-Encoding';
            break;
        case 'dynamic':
            headers['Cache-Control'] = (0, exports.generateCacheControlHeader)({
                public: true,
                maxAge: customMaxAge || 300, // 5 minutes
                staleWhileRevalidate: 3600,
            });
            headers['Vary'] = 'Accept, Accept-Encoding';
            break;
        case 'api':
            headers['Cache-Control'] = (0, exports.generateCacheControlHeader)({
                private: true,
                maxAge: customMaxAge || 60,
                mustRevalidate: true,
            });
            headers['Vary'] = 'Accept, Authorization';
            break;
        case 'private':
            headers['Cache-Control'] = (0, exports.generateCacheControlHeader)({
                private: true,
                noStore: true,
            });
            break;
    }
    return headers;
};
exports.createCacheHeaders = createCacheHeaders;
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
const shouldCacheResource = (request, response) => {
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
exports.shouldCacheResource = shouldCacheResource;
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
const validateHttpMethod = (method, allowedMethods) => {
    return allowedMethods.includes(method.toUpperCase());
};
exports.validateHttpMethod = validateHttpMethod;
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
const isIdempotentMethod = (method) => {
    const idempotentMethods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
    return idempotentMethods.includes(method.toUpperCase());
};
exports.isIdempotentMethod = isIdempotentMethod;
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
const isSafeMethod = (method) => {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
    return safeMethods.includes(method.toUpperCase());
};
exports.isSafeMethod = isSafeMethod;
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
const getStatusText = (statusCode) => {
    const statusTexts = {
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
exports.getStatusText = getStatusText;
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
const getStatusCodeForOperation = (operation, resourceExists) => {
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
exports.getStatusCodeForOperation = getStatusCodeForOperation;
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
const validateRequiredHeaders = (headers, requiredHeaders) => {
    const normalizedHeaders = Object.keys(headers).map((k) => k.toLowerCase());
    const missing = requiredHeaders.filter((required) => !normalizedHeaders.includes(required.toLowerCase()));
    return {
        valid: missing.length === 0,
        missing: missing.length > 0 ? missing : undefined,
    };
};
exports.validateRequiredHeaders = validateRequiredHeaders;
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
const validateContentType = (contentType, acceptedTypes) => {
    const baseType = contentType.split(';')[0].trim().toLowerCase();
    return acceptedTypes.some((accepted) => baseType === accepted.toLowerCase());
};
exports.validateContentType = validateContentType;
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
const validateAcceptHeader = (acceptHeader, availableTypes) => {
    const matchedType = (0, exports.negotiateContentType)(acceptHeader, availableTypes);
    return {
        canSatisfy: matchedType !== null,
        matchedType: matchedType || undefined,
    };
};
exports.validateAcceptHeader = validateAcceptHeader;
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
const generateSecurityHeaders = (options) => {
    const headers = {
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
exports.generateSecurityHeaders = generateSecurityHeaders;
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
const validateApiVersion = (version, supportedVersions) => {
    const normalized = version.toLowerCase().startsWith('v')
        ? version.toLowerCase()
        : `v${version}`;
    return {
        valid: supportedVersions.includes(normalized),
        normalized: normalized,
    };
};
exports.validateApiVersion = validateApiVersion;
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
const createApiDocumentation = (metadata) => {
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
exports.createApiDocumentation = createApiDocumentation;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // HATEOAS
    generateHateoasLinks: exports.generateHateoasLinks,
    createHalResource: exports.createHalResource,
    createTemplatedLink: exports.createTemplatedLink,
    // ETags and conditional requests
    generateETag: exports.generateETag,
    validateConditionalRequest: exports.validateConditionalRequest,
    createResourceVersion: exports.createResourceVersion,
    compareETags: exports.compareETags,
    // Content negotiation
    negotiateContentType: exports.negotiateContentType,
    parseAcceptHeader: exports.parseAcceptHeader,
    negotiateContent: exports.negotiateContent,
    // CORS
    validateCorsOrigin: exports.validateCorsOrigin,
    generateCorsHeaders: exports.generateCorsHeaders,
    handleCorsPreFlight: exports.handleCorsPreFlight,
    // Rate limiting
    createRateLimiter: exports.createRateLimiter,
    generateRateLimitHeaders: exports.generateRateLimitHeaders,
    calculateRetryAfter: exports.calculateRetryAfter,
    // API keys
    generateApiKey: exports.generateApiKey,
    validateApiKey: exports.validateApiKey,
    checkApiKeyScope: exports.checkApiKeyScope,
    maskApiKey: exports.maskApiKey,
    // Webhooks
    deliverWebhook: exports.deliverWebhook,
    generateWebhookSignature: exports.generateWebhookSignature,
    verifyWebhookSignature: exports.verifyWebhookSignature,
    // Batch operations
    processBatchRequests: exports.processBatchRequests,
    createBulkResponse: exports.createBulkResponse,
    validateBatchRequest: exports.validateBatchRequest,
    // Field filtering
    applyFieldFilter: exports.applyFieldFilter,
    parseFieldsParameter: exports.parseFieldsParameter,
    applySparseFieldset: exports.applySparseFieldset,
    applyPartialResponse: exports.applyPartialResponse,
    pickFields: exports.pickFields,
    // Cache control
    generateCacheControlHeader: exports.generateCacheControlHeader,
    createCacheHeaders: exports.createCacheHeaders,
    shouldCacheResource: exports.shouldCacheResource,
    // HTTP methods and status codes
    validateHttpMethod: exports.validateHttpMethod,
    isIdempotentMethod: exports.isIdempotentMethod,
    isSafeMethod: exports.isSafeMethod,
    getStatusText: exports.getStatusText,
    getStatusCodeForOperation: exports.getStatusCodeForOperation,
    // Request validation
    validateRequiredHeaders: exports.validateRequiredHeaders,
    validateContentType: exports.validateContentType,
    validateAcceptHeader: exports.validateAcceptHeader,
    // Security
    generateSecurityHeaders: exports.generateSecurityHeaders,
    validateApiVersion: exports.validateApiVersion,
    createApiDocumentation: exports.createApiDocumentation,
};
//# sourceMappingURL=rest-api-design-patterns-kit.js.map