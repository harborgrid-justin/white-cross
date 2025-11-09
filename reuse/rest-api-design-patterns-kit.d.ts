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
    responses?: Record<number, {
        description: string;
        schema?: any;
    }>;
    examples?: any[];
}
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
export declare const generateHateoasLinks: (baseUrl: string, resourceType: string, resourceId: string | number, additionalLinks?: Record<string, HateoasLink | string>) => HateoasLinks;
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
export declare const createHalResource: <T extends Record<string, any>>(resource: T, links: HateoasLinks, embedded?: Record<string, any>) => T & {
    _links: HateoasLinks;
    _embedded?: Record<string, any>;
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
export declare const createTemplatedLink: (template: string, params?: Record<string, any>) => HateoasLink;
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
export declare const generateETag: (resource: any, options?: ETagOptions) => string;
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
export declare const validateConditionalRequest: (headers: ConditionalRequestHeaders, currentVersion: ResourceVersion) => {
    shouldProcess: boolean;
    statusCode?: number;
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
export declare const createResourceVersion: (resource: any, lastModified?: Date) => ResourceVersion;
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
export declare const compareETags: (etag1: string, etag2: string) => boolean;
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
export declare const negotiateContentType: (acceptHeader: string, supportedTypes: string[]) => string | null;
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
export declare const parseAcceptHeader: (acceptHeader: string) => Array<{
    type: string;
    quality: number;
}>;
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
export declare const negotiateContent: (headers: {
    accept?: string;
    acceptCharset?: string;
    acceptEncoding?: string;
    acceptLanguage?: string;
}, supported: {
    types: string[];
    charsets?: string[];
    encodings?: string[];
    languages?: string[];
}) => ContentNegotiationResult;
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
export declare const validateCorsOrigin: (origin: string, allowedOrigins: CorsConfig["origin"]) => boolean;
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
export declare const generateCorsHeaders: (origin: string, config: CorsConfig) => Record<string, string>;
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
export declare const handleCorsPreFlight: (origin: string, method: string, headers: string[], config: CorsConfig) => {
    allowed: boolean;
    headers: Record<string, string>;
};
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
export declare const createRateLimiter: (config: RateLimitConfig) => {
    checkLimit: (key: string) => RateLimitState & {
        allowed: boolean;
    };
    reset: (key: string) => void;
    resetAll: () => void;
    getState: (key: string) => RateLimitState | undefined;
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
export declare const generateRateLimitHeaders: (state: RateLimitState, limit: number) => Record<string, string>;
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
export declare const calculateRetryAfter: (resetTime: Date) => {
    retryAfter: number;
    retryAfterDate: string;
};
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
export declare const generateApiKey: (config?: ApiKeyConfig) => ApiKey;
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
export declare const validateApiKey: (providedKey: string, storedKey: ApiKey) => {
    valid: boolean;
    reason?: string;
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
export declare const checkApiKeyScope: (apiKey: ApiKey, requiredScope: string) => boolean;
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
export declare const maskApiKey: (apiKey: string, visibleChars?: number) => string;
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
export declare const deliverWebhook: (config: WebhookConfig, payload: WebhookPayload) => Promise<WebhookDeliveryResult>;
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
export declare const generateWebhookSignature: (payload: WebhookPayload, secret: string) => string;
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
export declare const verifyWebhookSignature: (signature: string, payload: WebhookPayload, secret: string) => boolean;
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
export declare const processBatchRequests: (requests: BatchRequest[], maxConcurrent?: number) => Promise<BatchResponse[]>;
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
export declare const createBulkResponse: <T>(results: Array<{
    success: boolean;
    data?: T;
    error?: string;
}>) => {
    totalCount: number;
    successCount: number;
    failureCount: number;
    results: typeof results;
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
export declare const validateBatchRequest: (requests: BatchRequest[], maxBatchSize: number, maxPayloadSize?: number) => {
    valid: boolean;
    error?: string;
};
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
export declare const applyFieldFilter: <T extends Record<string, any>>(resource: T, filter: FieldFilter) => Partial<T>;
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
export declare const parseFieldsParameter: (fieldsParam: string) => string[];
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
export declare const applySparseFieldset: <T extends Record<string, any>>(resource: T, sparseFields: Record<string, string[]>, resourceType: string) => Partial<T>;
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
export declare const applyPartialResponse: <T extends Record<string, any>>(resource: T, options: PartialResponseOptions) => Partial<T>;
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
export declare const pickFields: <T extends Record<string, any>>(obj: T, fields: string[]) => Partial<T>;
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
export declare const generateCacheControlHeader: (config: CacheControl) => string;
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
export declare const createCacheHeaders: (resourceType: "static" | "dynamic" | "api" | "private", customMaxAge?: number) => Record<string, string>;
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
export declare const shouldCacheResource: (request: {
    method: string;
    hasAuthHeader?: boolean;
}, response: {
    statusCode: number;
    hasCacheControl?: boolean;
}) => boolean;
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
export declare const validateHttpMethod: (method: string, allowedMethods: string[]) => boolean;
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
export declare const isIdempotentMethod: (method: string) => boolean;
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
export declare const isSafeMethod: (method: string) => boolean;
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
export declare const getStatusText: (statusCode: number) => string;
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
export declare const getStatusCodeForOperation: (operation: "create" | "update" | "delete" | "read" | "list", resourceExists?: boolean) => number;
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
export declare const validateRequiredHeaders: (headers: Record<string, string>, requiredHeaders: string[]) => {
    valid: boolean;
    missing?: string[];
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
export declare const validateContentType: (contentType: string, acceptedTypes: string[]) => boolean;
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
export declare const validateAcceptHeader: (acceptHeader: string, availableTypes: string[]) => {
    canSatisfy: boolean;
    matchedType?: string;
};
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
export declare const generateSecurityHeaders: (options?: {
    enableHSTS?: boolean;
    hstsMaxAge?: number;
    frameOptions?: "DENY" | "SAMEORIGIN";
    contentSecurityPolicy?: string;
    referrerPolicy?: string;
}) => Record<string, string>;
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
export declare const validateApiVersion: (version: string, supportedVersions: string[]) => {
    valid: boolean;
    normalized?: string;
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
export declare const createApiDocumentation: (metadata: Partial<ApiDocumentation>) => ApiDocumentation;
declare const _default: {
    generateHateoasLinks: (baseUrl: string, resourceType: string, resourceId: string | number, additionalLinks?: Record<string, HateoasLink | string>) => HateoasLinks;
    createHalResource: <T extends Record<string, any>>(resource: T, links: HateoasLinks, embedded?: Record<string, any>) => T & {
        _links: HateoasLinks;
        _embedded?: Record<string, any>;
    };
    createTemplatedLink: (template: string, params?: Record<string, any>) => HateoasLink;
    generateETag: (resource: any, options?: ETagOptions) => string;
    validateConditionalRequest: (headers: ConditionalRequestHeaders, currentVersion: ResourceVersion) => {
        shouldProcess: boolean;
        statusCode?: number;
    };
    createResourceVersion: (resource: any, lastModified?: Date) => ResourceVersion;
    compareETags: (etag1: string, etag2: string) => boolean;
    negotiateContentType: (acceptHeader: string, supportedTypes: string[]) => string | null;
    parseAcceptHeader: (acceptHeader: string) => Array<{
        type: string;
        quality: number;
    }>;
    negotiateContent: (headers: {
        accept?: string;
        acceptCharset?: string;
        acceptEncoding?: string;
        acceptLanguage?: string;
    }, supported: {
        types: string[];
        charsets?: string[];
        encodings?: string[];
        languages?: string[];
    }) => ContentNegotiationResult;
    validateCorsOrigin: (origin: string, allowedOrigins: CorsConfig["origin"]) => boolean;
    generateCorsHeaders: (origin: string, config: CorsConfig) => Record<string, string>;
    handleCorsPreFlight: (origin: string, method: string, headers: string[], config: CorsConfig) => {
        allowed: boolean;
        headers: Record<string, string>;
    };
    createRateLimiter: (config: RateLimitConfig) => {
        checkLimit: (key: string) => RateLimitState & {
            allowed: boolean;
        };
        reset: (key: string) => void;
        resetAll: () => void;
        getState: (key: string) => RateLimitState | undefined;
    };
    generateRateLimitHeaders: (state: RateLimitState, limit: number) => Record<string, string>;
    calculateRetryAfter: (resetTime: Date) => {
        retryAfter: number;
        retryAfterDate: string;
    };
    generateApiKey: (config?: ApiKeyConfig) => ApiKey;
    validateApiKey: (providedKey: string, storedKey: ApiKey) => {
        valid: boolean;
        reason?: string;
    };
    checkApiKeyScope: (apiKey: ApiKey, requiredScope: string) => boolean;
    maskApiKey: (apiKey: string, visibleChars?: number) => string;
    deliverWebhook: (config: WebhookConfig, payload: WebhookPayload) => Promise<WebhookDeliveryResult>;
    generateWebhookSignature: (payload: WebhookPayload, secret: string) => string;
    verifyWebhookSignature: (signature: string, payload: WebhookPayload, secret: string) => boolean;
    processBatchRequests: (requests: BatchRequest[], maxConcurrent?: number) => Promise<BatchResponse[]>;
    createBulkResponse: <T>(results: Array<{
        success: boolean;
        data?: T;
        error?: string;
    }>) => {
        totalCount: number;
        successCount: number;
        failureCount: number;
        results: typeof results;
    };
    validateBatchRequest: (requests: BatchRequest[], maxBatchSize: number, maxPayloadSize?: number) => {
        valid: boolean;
        error?: string;
    };
    applyFieldFilter: <T extends Record<string, any>>(resource: T, filter: FieldFilter) => Partial<T>;
    parseFieldsParameter: (fieldsParam: string) => string[];
    applySparseFieldset: <T extends Record<string, any>>(resource: T, sparseFields: Record<string, string[]>, resourceType: string) => Partial<T>;
    applyPartialResponse: <T extends Record<string, any>>(resource: T, options: PartialResponseOptions) => Partial<T>;
    pickFields: <T extends Record<string, any>>(obj: T, fields: string[]) => Partial<T>;
    generateCacheControlHeader: (config: CacheControl) => string;
    createCacheHeaders: (resourceType: "static" | "dynamic" | "api" | "private", customMaxAge?: number) => Record<string, string>;
    shouldCacheResource: (request: {
        method: string;
        hasAuthHeader?: boolean;
    }, response: {
        statusCode: number;
        hasCacheControl?: boolean;
    }) => boolean;
    validateHttpMethod: (method: string, allowedMethods: string[]) => boolean;
    isIdempotentMethod: (method: string) => boolean;
    isSafeMethod: (method: string) => boolean;
    getStatusText: (statusCode: number) => string;
    getStatusCodeForOperation: (operation: "create" | "update" | "delete" | "read" | "list", resourceExists?: boolean) => number;
    validateRequiredHeaders: (headers: Record<string, string>, requiredHeaders: string[]) => {
        valid: boolean;
        missing?: string[];
    };
    validateContentType: (contentType: string, acceptedTypes: string[]) => boolean;
    validateAcceptHeader: (acceptHeader: string, availableTypes: string[]) => {
        canSatisfy: boolean;
        matchedType?: string;
    };
    generateSecurityHeaders: (options?: {
        enableHSTS?: boolean;
        hstsMaxAge?: number;
        frameOptions?: "DENY" | "SAMEORIGIN";
        contentSecurityPolicy?: string;
        referrerPolicy?: string;
    }) => Record<string, string>;
    validateApiVersion: (version: string, supportedVersions: string[]) => {
        valid: boolean;
        normalized?: string;
    };
    createApiDocumentation: (metadata: Partial<ApiDocumentation>) => ApiDocumentation;
};
export default _default;
//# sourceMappingURL=rest-api-design-patterns-kit.d.ts.map