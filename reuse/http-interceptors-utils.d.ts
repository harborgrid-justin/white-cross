/**
 * LOC: INT1234567
 * File: /reuse/http-interceptors-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers and modules
 *   - HTTP middleware services
 *   - API gateway configurations
 */
interface LoggingConfig {
    logHeaders?: boolean;
    logBody?: boolean;
    logQuery?: boolean;
    logParams?: boolean;
    excludePaths?: string[];
}
interface TimingMetrics {
    startTime: number;
    endTime: number;
    duration: number;
    requestId: string;
}
interface CompressionConfig {
    threshold: number;
    algorithms: string[];
    mimeTypes: string[];
}
interface CorsInterceptorConfig {
    allowedOrigins: string | string[] | RegExp;
    allowedMethods: string[];
    allowedHeaders: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
}
interface RequestLogEntry {
    requestId: string;
    timestamp: string;
    method: string;
    url: string;
    headers?: Record<string, string>;
    query?: Record<string, any>;
    params?: Record<string, any>;
    body?: any;
    userId?: string;
    ipAddress?: string;
}
interface ResponseLogEntry {
    requestId: string;
    timestamp: string;
    statusCode: number;
    duration: number;
    responseSize?: number;
    headers?: Record<string, string>;
    body?: any;
}
/**
 * Creates a request interceptor that adds timestamps to requests.
 *
 * @param {string} [headerName] - Header name for timestamp (default: 'X-Request-Time')
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const timestampInterceptor = createTimestampInterceptor('X-Timestamp');
 * // Adds timestamp header to all outgoing requests
 * ```
 */
export declare const createTimestampInterceptor: (headerName?: string) => Function;
/**
 * Creates a request interceptor that adds unique request IDs.
 *
 * @param {string} [headerName] - Header name for request ID (default: 'X-Request-ID')
 * @param {() => string} [idGenerator] - Custom ID generator function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const requestIdInterceptor = createRequestIdInterceptor('X-Request-ID');
 * // Adds unique ID to each request for tracking
 * ```
 */
export declare const createRequestIdInterceptor: (headerName?: string, idGenerator?: () => string) => Function;
/**
 * Creates a request interceptor that adds authentication headers.
 *
 * @param {string} token - Authentication token
 * @param {string} [scheme] - Auth scheme (default: 'Bearer')
 * @param {string} [headerName] - Header name (default: 'Authorization')
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const authInterceptor = createAuthInterceptor('eyJhbGc...', 'Bearer');
 * // Adds 'Authorization: Bearer eyJhbGc...' to all requests
 * ```
 */
export declare const createAuthInterceptor: (token: string, scheme?: string, headerName?: string) => Function;
/**
 * Creates a request interceptor that adds custom headers.
 *
 * @param {Record<string, string>} headers - Headers to add
 * @param {boolean} [overwrite] - Overwrite existing headers (default: false)
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const headerInterceptor = createHeaderInterceptor({
 *   'X-API-Version': '2.0',
 *   'X-Client-Id': 'mobile-app'
 * });
 * ```
 */
export declare const createHeaderInterceptor: (headers: Record<string, string>, overwrite?: boolean) => Function;
/**
 * Creates a request interceptor that transforms request headers.
 *
 * @param {(headers: Record<string, string>) => Record<string, string>} transformer - Header transformer function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const headerTransformer = createHeaderTransformInterceptor(headers => {
 *   return Object.entries(headers).reduce((acc, [key, value]) => {
 *     acc[key.toLowerCase()] = value;
 *     return acc;
 *   }, {});
 * });
 * ```
 */
export declare const createHeaderTransformInterceptor: (transformer: (headers: Record<string, string>) => Record<string, string>) => Function;
/**
 * Creates a request interceptor that adds user context headers.
 *
 * @param {() => Promise<any>} getUserContext - Function to retrieve user context
 * @param {string} [headerPrefix] - Header prefix (default: 'X-User-')
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const userContextInterceptor = createUserContextInterceptor(
 *   async () => ({ id: '123', role: 'doctor' }),
 *   'X-User-'
 * );
 * // Adds X-User-Id and X-User-Role headers
 * ```
 */
export declare const createUserContextInterceptor: (getUserContext: () => Promise<any>, headerPrefix?: string) => Function;
/**
 * Creates a request interceptor that validates and sanitizes request body.
 *
 * @param {(body: any) => any} validator - Validation function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const bodyValidator = createBodyValidationInterceptor(body => {
 *   if (!body.email) throw new Error('Email required');
 *   return { ...body, email: body.email.toLowerCase() };
 * });
 * ```
 */
export declare const createBodyValidationInterceptor: (validator: (body: any) => any) => Function;
/**
 * Creates a request interceptor that adds correlation IDs for distributed tracing.
 *
 * @param {string} [headerName] - Header name (default: 'X-Correlation-ID')
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const correlationInterceptor = createCorrelationIdInterceptor('X-Correlation-ID');
 * // Enables distributed tracing across microservices
 * ```
 */
export declare const createCorrelationIdInterceptor: (headerName?: string) => Function;
/**
 * Creates a response interceptor that adds metadata to responses.
 *
 * @param {(req: any, res: any) => Record<string, any>} metadataBuilder - Function to build metadata
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const metadataInterceptor = createResponseMetadataInterceptor((req, res) => ({
 *   timestamp: new Date().toISOString(),
 *   version: '2.0',
 *   requestId: req.headers['x-request-id']
 * }));
 * ```
 */
export declare const createResponseMetadataInterceptor: (metadataBuilder: (req: any, res: any) => Record<string, any>) => Function;
/**
 * Creates a response interceptor that transforms response data.
 *
 * @param {(data: any) => any} transformer - Data transformer function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const camelCaseInterceptor = createResponseTransformInterceptor(data => {
 *   // Transform snake_case to camelCase
 *   return transformKeys(data, toCamelCase);
 * });
 * ```
 */
export declare const createResponseTransformInterceptor: (transformer: (data: any) => any) => Function;
/**
 * Creates a response interceptor that adds cache control headers.
 *
 * @param {number} maxAge - Cache max age in seconds
 * @param {boolean} [isPrivate] - Whether cache is private (default: true)
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const cacheInterceptor = createCacheControlInterceptor(3600, false);
 * // Adds 'Cache-Control: public, max-age=3600'
 * ```
 */
export declare const createCacheControlInterceptor: (maxAge: number, isPrivate?: boolean) => Function;
/**
 * Creates a response interceptor that adds HATEOAS links.
 *
 * @param {(req: any, data: any) => Record<string, string>} linkBuilder - Function to build links
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const hateoasInterceptor = createHateoasInterceptor((req, data) => ({
 *   self: `/api/users/${data.id}`,
 *   update: `/api/users/${data.id}`,
 *   delete: `/api/users/${data.id}`
 * }));
 * ```
 */
export declare const createHateoasInterceptor: (linkBuilder: (req: any, data: any) => Record<string, string>) => Function;
/**
 * Creates a response interceptor that filters response fields.
 *
 * @param {string[]} allowedFields - Fields to include in response
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const fieldFilter = createFieldFilterInterceptor(['id', 'name', 'email']);
 * // Removes all fields except id, name, and email
 * ```
 */
export declare const createFieldFilterInterceptor: (allowedFields: string[]) => Function;
/**
 * Creates an authentication interceptor that validates JWT tokens.
 *
 * @param {(token: string) => Promise<any>} validateToken - Token validation function
 * @param {string} [headerName] - Header name (default: 'Authorization')
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const jwtInterceptor = createJwtValidationInterceptor(
 *   async (token) => await jwtService.verify(token),
 *   'Authorization'
 * );
 * ```
 */
export declare const createJwtValidationInterceptor: (validateToken: (token: string) => Promise<any>, headerName?: string) => Function;
/**
 * Creates an authentication interceptor that extracts API keys.
 *
 * @param {(apiKey: string) => Promise<any>} validateApiKey - API key validation function
 * @param {string} [headerName] - Header name (default: 'X-API-Key')
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const apiKeyInterceptor = createApiKeyInterceptor(
 *   async (key) => await apiKeyService.validate(key),
 *   'X-API-Key'
 * );
 * ```
 */
export declare const createApiKeyInterceptor: (validateApiKey: (apiKey: string) => Promise<any>, headerName?: string) => Function;
/**
 * Creates an authentication interceptor that handles Basic Auth.
 *
 * @param {(username: string, password: string) => Promise<any>} authenticate - Authentication function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const basicAuthInterceptor = createBasicAuthInterceptor(
 *   async (username, password) => await authService.validateCredentials(username, password)
 * );
 * ```
 */
export declare const createBasicAuthInterceptor: (authenticate: (username: string, password: string) => Promise<any>) => Function;
/**
 * Creates an authentication interceptor that refreshes expired tokens.
 *
 * @param {(token: string) => Promise<string>} refreshToken - Token refresh function
 * @param {(token: string) => boolean} isTokenExpired - Token expiration check
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const refreshInterceptor = createTokenRefreshInterceptor(
 *   async (token) => await authService.refreshToken(token),
 *   (token) => jwtService.isExpired(token)
 * );
 * ```
 */
export declare const createTokenRefreshInterceptor: (refreshToken: (token: string) => Promise<string>, isTokenExpired: (token: string) => boolean) => Function;
/**
 * Creates a logging interceptor that logs all requests.
 *
 * @param {(entry: RequestLogEntry) => void} logger - Logging function
 * @param {LoggingConfig} [config] - Logging configuration
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const requestLogger = createRequestLoggingInterceptor(
 *   (entry) => console.log(JSON.stringify(entry)),
 *   { logHeaders: true, logBody: true }
 * );
 * ```
 */
export declare const createRequestLoggingInterceptor: (logger: (entry: RequestLogEntry) => void, config?: LoggingConfig) => Function;
/**
 * Creates a logging interceptor that logs all responses.
 *
 * @param {(entry: ResponseLogEntry) => void} logger - Logging function
 * @param {LoggingConfig} [config] - Logging configuration
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const responseLogger = createResponseLoggingInterceptor(
 *   (entry) => console.log(JSON.stringify(entry)),
 *   { logHeaders: true }
 * );
 * ```
 */
export declare const createResponseLoggingInterceptor: (logger: (entry: ResponseLogEntry) => void, config?: LoggingConfig) => Function;
/**
 * Creates a logging interceptor for audit trails (HIPAA compliance).
 *
 * @param {(entry: any) => Promise<void>} auditLogger - Audit logging function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const auditInterceptor = createAuditLogInterceptor(
 *   async (entry) => await auditService.log(entry)
 * );
 * // Logs all PHI access for HIPAA compliance
 * ```
 */
export declare const createAuditLogInterceptor: (auditLogger: (entry: any) => Promise<void>) => Function;
/**
 * Creates a logging interceptor for error tracking.
 *
 * @param {(error: any, req: any) => void} errorLogger - Error logging function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const errorTracker = createErrorLoggingInterceptor(
 *   (error, req) => errorService.log({ error, requestId: req.headers['x-request-id'] })
 * );
 * ```
 */
export declare const createErrorLoggingInterceptor: (errorLogger: (error: any, req: any) => void) => Function;
/**
 * Creates an error interceptor that transforms errors to standard format.
 *
 * @param {(error: any) => any} transformer - Error transformer function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const errorTransformer = createErrorTransformInterceptor(error => ({
 *   statusCode: error.status || 500,
 *   message: error.message,
 *   timestamp: new Date().toISOString()
 * }));
 * ```
 */
export declare const createErrorTransformInterceptor: (transformer: (error: any) => any) => Function;
/**
 * Creates an error interceptor that sanitizes error details.
 *
 * @param {boolean} includeStackTrace - Include stack traces (default: false)
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const errorSanitizer = createErrorSanitizationInterceptor(
 *   process.env.NODE_ENV === 'development'
 * );
 * // Removes sensitive error details in production
 * ```
 */
export declare const createErrorSanitizationInterceptor: (includeStackTrace?: boolean) => Function;
/**
 * Creates an error interceptor that maps errors to HTTP status codes.
 *
 * @param {Map<string, number>} errorMap - Error type to status code mapping
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const statusMapper = createErrorStatusMapInterceptor(new Map([
 *   ['ValidationError', 400],
 *   ['NotFoundError', 404],
 *   ['UnauthorizedError', 401]
 * ]));
 * ```
 */
export declare const createErrorStatusMapInterceptor: (errorMap: Map<string, number>) => Function;
/**
 * Creates a performance interceptor that measures request duration.
 *
 * @param {(metrics: TimingMetrics) => void} metricsHandler - Metrics handler function
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const perfMonitor = createPerformanceInterceptor(
 *   (metrics) => metricsService.record(metrics)
 * );
 * ```
 */
export declare const createPerformanceInterceptor: (metricsHandler: (metrics: TimingMetrics) => void) => Function;
/**
 * Creates a timing interceptor that adds Server-Timing headers.
 *
 * @param {Record<string, () => number>} timingMetrics - Timing metrics to track
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const serverTiming = createServerTimingInterceptor({
 *   'db': () => dbQueryTime,
 *   'cache': () => cacheTime
 * });
 * // Adds 'Server-Timing: db;dur=45, cache;dur=12' header
 * ```
 */
export declare const createServerTimingInterceptor: (timingMetrics: Record<string, () => number>) => Function;
/**
 * Creates a timeout interceptor that aborts slow requests.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {() => any} [timeoutHandler] - Custom timeout handler
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const timeout = createTimeoutInterceptor(5000, () => ({
 *   statusCode: 504,
 *   message: 'Request timeout'
 * }));
 * ```
 */
export declare const createTimeoutInterceptor: (timeoutMs: number, timeoutHandler?: () => any) => Function;
/**
 * Removes sensitive headers from requests.
 *
 * @param {string[]} sensitiveHeaders - Headers to remove
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const headerRemover = removeSensitiveHeaders([
 *   'X-Internal-Token',
 *   'X-Debug-Info'
 * ]);
 * ```
 */
export declare const removeSensitiveHeaders: (sensitiveHeaders: string[]) => Function;
/**
 * Normalizes header names to lowercase.
 *
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const normalizer = normalizeHeaderNames();
 * // Converts all header names to lowercase for consistency
 * ```
 */
export declare const normalizeHeaderNames: () => Function;
/**
 * Adds security headers to responses.
 *
 * @param {Record<string, string>} [customHeaders] - Custom security headers
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const securityHeaders = addSecurityHeaders({
 *   'X-Frame-Options': 'DENY',
 *   'X-Content-Type-Options': 'nosniff'
 * });
 * ```
 */
export declare const addSecurityHeaders: (customHeaders?: Record<string, string>) => Function;
/**
 * Creates a CORS interceptor for cross-origin requests.
 *
 * @param {CorsInterceptorConfig} config - CORS configuration
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const corsHandler = createCorsInterceptor({
 *   allowedOrigins: ['https://app.whitecross.com'],
 *   allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   allowedHeaders: ['Content-Type', 'Authorization'],
 *   credentials: true
 * });
 * ```
 */
export declare const createCorsInterceptor: (config: CorsInterceptorConfig) => Function;
/**
 * Handles CORS preflight OPTIONS requests.
 *
 * @param {CorsInterceptorConfig} config - CORS configuration
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const preflightHandler = handlePreflightRequest({
 *   allowedOrigins: '*',
 *   allowedMethods: ['GET', 'POST'],
 *   allowedHeaders: ['Content-Type'],
 *   maxAge: 86400
 * });
 * ```
 */
export declare const handlePreflightRequest: (config: CorsInterceptorConfig) => Function;
/**
 * Creates a content negotiation interceptor.
 *
 * @param {Map<string, (data: any) => any>} formatters - Format-specific serializers
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const contentNegotiator = createContentNegotiationInterceptor(new Map([
 *   ['application/json', data => JSON.stringify(data)],
 *   ['application/xml', data => xmlSerializer(data)]
 * ]));
 * ```
 */
export declare const createContentNegotiationInterceptor: (formatters: Map<string, (data: any) => any>) => Function;
/**
 * Creates a compression interceptor for response data.
 *
 * @param {CompressionConfig} config - Compression configuration
 * @returns {Function} Interceptor function
 *
 * @example
 * ```typescript
 * const compressor = createCompressionInterceptor({
 *   threshold: 1024,
 *   algorithms: ['gzip', 'deflate'],
 *   mimeTypes: ['application/json', 'text/html']
 * });
 * ```
 */
export declare const createCompressionInterceptor: (config: CompressionConfig) => Function;
/**
 * Extracts resource type from URL path.
 *
 * @param {string} url - Request URL
 * @returns {string} Resource type
 *
 * @example
 * ```typescript
 * extractResourceType('/api/patients/123'); // 'patients'
 * extractResourceType('/api/v2/appointments'); // 'appointments'
 * ```
 */
export declare const extractResourceType: (url: string) => string;
/**
 * Extracts resource ID from URL path.
 *
 * @param {string} url - Request URL
 * @returns {string | null} Resource ID or null
 *
 * @example
 * ```typescript
 * extractResourceId('/api/patients/123'); // '123'
 * extractResourceId('/api/patients'); // null
 * ```
 */
export declare const extractResourceId: (url: string) => string | null;
/**
 * Checks if origin is allowed based on CORS config.
 *
 * @param {string} origin - Request origin
 * @param {string | string[] | RegExp} allowedOrigins - Allowed origins
 * @returns {boolean} True if origin is allowed
 *
 * @example
 * ```typescript
 * checkOriginAllowed('https://app.whitecross.com', ['https://app.whitecross.com']); // true
 * checkOriginAllowed('https://evil.com', /^https:\/\/.*\.whitecross\.com$/); // false
 * ```
 */
export declare const checkOriginAllowed: (origin: string, allowedOrigins: string | string[] | RegExp) => boolean;
/**
 * Parses Accept header and returns best matching format.
 *
 * @param {string} acceptHeader - Accept header value
 * @param {string[]} supportedFormats - Supported MIME types
 * @returns {string | null} Best matching format or null
 *
 * @example
 * ```typescript
 * parseAcceptHeader(
 *   'application/json, application/xml;q=0.9',
 *   ['application/json', 'application/xml']
 * ); // 'application/json'
 * ```
 */
export declare const parseAcceptHeader: (acceptHeader: string, supportedFormats: string[]) => string | null;
declare const _default: {
    createTimestampInterceptor: (headerName?: string) => Function;
    createRequestIdInterceptor: (headerName?: string, idGenerator?: () => string) => Function;
    createAuthInterceptor: (token: string, scheme?: string, headerName?: string) => Function;
    createHeaderInterceptor: (headers: Record<string, string>, overwrite?: boolean) => Function;
    createHeaderTransformInterceptor: (transformer: (headers: Record<string, string>) => Record<string, string>) => Function;
    createUserContextInterceptor: (getUserContext: () => Promise<any>, headerPrefix?: string) => Function;
    createBodyValidationInterceptor: (validator: (body: any) => any) => Function;
    createCorrelationIdInterceptor: (headerName?: string) => Function;
    createResponseMetadataInterceptor: (metadataBuilder: (req: any, res: any) => Record<string, any>) => Function;
    createResponseTransformInterceptor: (transformer: (data: any) => any) => Function;
    createCacheControlInterceptor: (maxAge: number, isPrivate?: boolean) => Function;
    createHateoasInterceptor: (linkBuilder: (req: any, data: any) => Record<string, string>) => Function;
    createFieldFilterInterceptor: (allowedFields: string[]) => Function;
    createJwtValidationInterceptor: (validateToken: (token: string) => Promise<any>, headerName?: string) => Function;
    createApiKeyInterceptor: (validateApiKey: (apiKey: string) => Promise<any>, headerName?: string) => Function;
    createBasicAuthInterceptor: (authenticate: (username: string, password: string) => Promise<any>) => Function;
    createTokenRefreshInterceptor: (refreshToken: (token: string) => Promise<string>, isTokenExpired: (token: string) => boolean) => Function;
    createRequestLoggingInterceptor: (logger: (entry: RequestLogEntry) => void, config?: LoggingConfig) => Function;
    createResponseLoggingInterceptor: (logger: (entry: ResponseLogEntry) => void, config?: LoggingConfig) => Function;
    createAuditLogInterceptor: (auditLogger: (entry: any) => Promise<void>) => Function;
    createErrorLoggingInterceptor: (errorLogger: (error: any, req: any) => void) => Function;
    createErrorTransformInterceptor: (transformer: (error: any) => any) => Function;
    createErrorSanitizationInterceptor: (includeStackTrace?: boolean) => Function;
    createErrorStatusMapInterceptor: (errorMap: Map<string, number>) => Function;
    createPerformanceInterceptor: (metricsHandler: (metrics: TimingMetrics) => void) => Function;
    createServerTimingInterceptor: (timingMetrics: Record<string, () => number>) => Function;
    createTimeoutInterceptor: (timeoutMs: number, timeoutHandler?: () => any) => Function;
    removeSensitiveHeaders: (sensitiveHeaders: string[]) => Function;
    normalizeHeaderNames: () => Function;
    addSecurityHeaders: (customHeaders?: Record<string, string>) => Function;
    createCorsInterceptor: (config: CorsInterceptorConfig) => Function;
    handlePreflightRequest: (config: CorsInterceptorConfig) => Function;
    createContentNegotiationInterceptor: (formatters: Map<string, (data: any) => any>) => Function;
    createCompressionInterceptor: (config: CompressionConfig) => Function;
    extractResourceType: (url: string) => string;
    extractResourceId: (url: string) => string | null;
    checkOriginAllowed: (origin: string, allowedOrigins: string | string[] | RegExp) => boolean;
    parseAcceptHeader: (acceptHeader: string, supportedFormats: string[]) => string | null;
};
export default _default;
//# sourceMappingURL=http-interceptors-utils.d.ts.map