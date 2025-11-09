"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAcceptHeader = exports.checkOriginAllowed = exports.extractResourceId = exports.extractResourceType = exports.createCompressionInterceptor = exports.createContentNegotiationInterceptor = exports.handlePreflightRequest = exports.createCorsInterceptor = exports.addSecurityHeaders = exports.normalizeHeaderNames = exports.removeSensitiveHeaders = exports.createTimeoutInterceptor = exports.createServerTimingInterceptor = exports.createPerformanceInterceptor = exports.createErrorStatusMapInterceptor = exports.createErrorSanitizationInterceptor = exports.createErrorTransformInterceptor = exports.createErrorLoggingInterceptor = exports.createAuditLogInterceptor = exports.createResponseLoggingInterceptor = exports.createRequestLoggingInterceptor = exports.createTokenRefreshInterceptor = exports.createBasicAuthInterceptor = exports.createApiKeyInterceptor = exports.createJwtValidationInterceptor = exports.createFieldFilterInterceptor = exports.createHateoasInterceptor = exports.createCacheControlInterceptor = exports.createResponseTransformInterceptor = exports.createResponseMetadataInterceptor = exports.createCorrelationIdInterceptor = exports.createBodyValidationInterceptor = exports.createUserContextInterceptor = exports.createHeaderTransformInterceptor = exports.createHeaderInterceptor = exports.createAuthInterceptor = exports.createRequestIdInterceptor = exports.createTimestampInterceptor = void 0;
// ============================================================================
// REQUEST INTERCEPTOR FACTORIES
// ============================================================================
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
const createTimestampInterceptor = (headerName = 'X-Request-Time') => {
    return (req, next) => {
        req.headers = req.headers || {};
        req.headers[headerName] = new Date().toISOString();
        return next(req);
    };
};
exports.createTimestampInterceptor = createTimestampInterceptor;
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
const createRequestIdInterceptor = (headerName = 'X-Request-ID', idGenerator) => {
    const generateId = idGenerator || (() => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    return (req, next) => {
        req.headers = req.headers || {};
        req.headers[headerName] = generateId();
        return next(req);
    };
};
exports.createRequestIdInterceptor = createRequestIdInterceptor;
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
const createAuthInterceptor = (token, scheme = 'Bearer', headerName = 'Authorization') => {
    return (req, next) => {
        req.headers = req.headers || {};
        req.headers[headerName] = `${scheme} ${token}`;
        return next(req);
    };
};
exports.createAuthInterceptor = createAuthInterceptor;
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
const createHeaderInterceptor = (headers, overwrite = false) => {
    return (req, next) => {
        req.headers = req.headers || {};
        Object.entries(headers).forEach(([key, value]) => {
            if (overwrite || !req.headers[key]) {
                req.headers[key] = value;
            }
        });
        return next(req);
    };
};
exports.createHeaderInterceptor = createHeaderInterceptor;
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
const createHeaderTransformInterceptor = (transformer) => {
    return (req, next) => {
        req.headers = transformer(req.headers || {});
        return next(req);
    };
};
exports.createHeaderTransformInterceptor = createHeaderTransformInterceptor;
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
const createUserContextInterceptor = (getUserContext, headerPrefix = 'X-User-') => {
    return async (req, next) => {
        const userContext = await getUserContext();
        req.headers = req.headers || {};
        Object.entries(userContext).forEach(([key, value]) => {
            req.headers[`${headerPrefix}${key}`] = String(value);
        });
        return next(req);
    };
};
exports.createUserContextInterceptor = createUserContextInterceptor;
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
const createBodyValidationInterceptor = (validator) => {
    return (req, next) => {
        if (req.body) {
            req.body = validator(req.body);
        }
        return next(req);
    };
};
exports.createBodyValidationInterceptor = createBodyValidationInterceptor;
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
const createCorrelationIdInterceptor = (headerName = 'X-Correlation-ID') => {
    return (req, next) => {
        req.headers = req.headers || {};
        // Use existing correlation ID or generate new one
        req.headers[headerName] = req.headers[headerName] ||
            `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return next(req);
    };
};
exports.createCorrelationIdInterceptor = createCorrelationIdInterceptor;
// ============================================================================
// RESPONSE INTERCEPTOR FACTORIES
// ============================================================================
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
const createResponseMetadataInterceptor = (metadataBuilder) => {
    return (req, res, next) => {
        const metadata = metadataBuilder(req, res);
        res.body = {
            ...res.body,
            _metadata: metadata,
        };
        return next(res);
    };
};
exports.createResponseMetadataInterceptor = createResponseMetadataInterceptor;
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
const createResponseTransformInterceptor = (transformer) => {
    return (req, res, next) => {
        res.body = transformer(res.body);
        return next(res);
    };
};
exports.createResponseTransformInterceptor = createResponseTransformInterceptor;
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
const createCacheControlInterceptor = (maxAge, isPrivate = true) => {
    return (req, res, next) => {
        const cacheType = isPrivate ? 'private' : 'public';
        res.headers = res.headers || {};
        res.headers['Cache-Control'] = `${cacheType}, max-age=${maxAge}`;
        return next(res);
    };
};
exports.createCacheControlInterceptor = createCacheControlInterceptor;
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
const createHateoasInterceptor = (linkBuilder) => {
    return (req, res, next) => {
        const links = linkBuilder(req, res.body);
        res.body = {
            ...res.body,
            _links: links,
        };
        return next(res);
    };
};
exports.createHateoasInterceptor = createHateoasInterceptor;
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
const createFieldFilterInterceptor = (allowedFields) => {
    return (req, res, next) => {
        const filterObject = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(filterObject);
            }
            else if (obj && typeof obj === 'object') {
                return Object.keys(obj)
                    .filter(key => allowedFields.includes(key))
                    .reduce((acc, key) => {
                    acc[key] = filterObject(obj[key]);
                    return acc;
                }, {});
            }
            return obj;
        };
        res.body = filterObject(res.body);
        return next(res);
    };
};
exports.createFieldFilterInterceptor = createFieldFilterInterceptor;
// ============================================================================
// AUTHENTICATION INTERCEPTORS
// ============================================================================
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
const createJwtValidationInterceptor = (validateToken, headerName = 'Authorization') => {
    return async (req, next) => {
        const authHeader = req.headers[headerName] || req.headers[headerName.toLowerCase()];
        if (authHeader) {
            const token = authHeader.replace(/^Bearer\s+/i, '');
            try {
                const payload = await validateToken(token);
                req.user = payload;
            }
            catch (error) {
                throw new Error('Invalid authentication token');
            }
        }
        return next(req);
    };
};
exports.createJwtValidationInterceptor = createJwtValidationInterceptor;
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
const createApiKeyInterceptor = (validateApiKey, headerName = 'X-API-Key') => {
    return async (req, next) => {
        const apiKey = req.headers[headerName] || req.headers[headerName.toLowerCase()];
        if (!apiKey) {
            throw new Error('API key required');
        }
        try {
            const keyInfo = await validateApiKey(apiKey);
            req.apiKeyInfo = keyInfo;
        }
        catch (error) {
            throw new Error('Invalid API key');
        }
        return next(req);
    };
};
exports.createApiKeyInterceptor = createApiKeyInterceptor;
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
const createBasicAuthInterceptor = (authenticate) => {
    return async (req, next) => {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new Error('Basic authentication required');
        }
        const base64Credentials = authHeader.slice(6);
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        try {
            const user = await authenticate(username, password);
            req.user = user;
        }
        catch (error) {
            throw new Error('Invalid credentials');
        }
        return next(req);
    };
};
exports.createBasicAuthInterceptor = createBasicAuthInterceptor;
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
const createTokenRefreshInterceptor = (refreshToken, isTokenExpired) => {
    return async (req, next) => {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.replace(/^Bearer\s+/i, '');
            if (isTokenExpired(token)) {
                try {
                    const newToken = await refreshToken(token);
                    req.headers['Authorization'] = `Bearer ${newToken}`;
                }
                catch (error) {
                    throw new Error('Failed to refresh token');
                }
            }
        }
        return next(req);
    };
};
exports.createTokenRefreshInterceptor = createTokenRefreshInterceptor;
// ============================================================================
// LOGGING INTERCEPTORS
// ============================================================================
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
const createRequestLoggingInterceptor = (logger, config) => {
    return (req, next) => {
        const entry = {
            requestId: req.headers['x-request-id'] || 'unknown',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            userId: req.user?.id,
            ipAddress: req.ip,
        };
        if (config?.logHeaders)
            entry.headers = req.headers;
        if (config?.logQuery)
            entry.query = req.query;
        if (config?.logParams)
            entry.params = req.params;
        if (config?.logBody)
            entry.body = req.body;
        logger(entry);
        return next(req);
    };
};
exports.createRequestLoggingInterceptor = createRequestLoggingInterceptor;
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
const createResponseLoggingInterceptor = (logger, config) => {
    return (req, res, next) => {
        const entry = {
            requestId: req.headers['x-request-id'] || 'unknown',
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            duration: res.duration || 0,
        };
        if (config?.logHeaders)
            entry.headers = res.headers;
        if (config?.logBody)
            entry.body = res.body;
        logger(entry);
        return next(res);
    };
};
exports.createResponseLoggingInterceptor = createResponseLoggingInterceptor;
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
const createAuditLogInterceptor = (auditLogger) => {
    return async (req, next) => {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            userId: req.user?.id,
            userRole: req.user?.role,
            action: `${req.method} ${req.url}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'],
            resourceType: (0, exports.extractResourceType)(req.url),
            resourceId: (0, exports.extractResourceId)(req.url),
        };
        await auditLogger(auditEntry);
        return next(req);
    };
};
exports.createAuditLogInterceptor = createAuditLogInterceptor;
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
const createErrorLoggingInterceptor = (errorLogger) => {
    return (req, next) => {
        try {
            return next(req);
        }
        catch (error) {
            errorLogger(error, req);
            throw error;
        }
    };
};
exports.createErrorLoggingInterceptor = createErrorLoggingInterceptor;
// ============================================================================
// ERROR TRANSFORMATION INTERCEPTORS
// ============================================================================
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
const createErrorTransformInterceptor = (transformer) => {
    return (req, res, next) => {
        if (res.error) {
            res.error = transformer(res.error);
        }
        return next(res);
    };
};
exports.createErrorTransformInterceptor = createErrorTransformInterceptor;
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
const createErrorSanitizationInterceptor = (includeStackTrace = false) => {
    return (req, res, next) => {
        if (res.error) {
            const sanitized = {
                statusCode: res.error.statusCode || 500,
                message: res.error.message || 'Internal server error',
                timestamp: new Date().toISOString(),
            };
            if (includeStackTrace && res.error.stack) {
                sanitized.stack = res.error.stack;
            }
            res.error = sanitized;
        }
        return next(res);
    };
};
exports.createErrorSanitizationInterceptor = createErrorSanitizationInterceptor;
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
const createErrorStatusMapInterceptor = (errorMap) => {
    return (req, res, next) => {
        if (res.error) {
            const errorType = res.error.constructor.name;
            const statusCode = errorMap.get(errorType) || 500;
            res.statusCode = statusCode;
            res.error.statusCode = statusCode;
        }
        return next(res);
    };
};
exports.createErrorStatusMapInterceptor = createErrorStatusMapInterceptor;
// ============================================================================
// TIMING/PERFORMANCE INTERCEPTORS
// ============================================================================
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
const createPerformanceInterceptor = (metricsHandler) => {
    return (req, next) => {
        const startTime = Date.now();
        req.startTime = startTime;
        const result = next(req);
        // Handle both sync and async results
        if (result && typeof result.then === 'function') {
            return result.then((res) => {
                const endTime = Date.now();
                const metrics = {
                    startTime,
                    endTime,
                    duration: endTime - startTime,
                    requestId: req.headers['x-request-id'] || 'unknown',
                };
                metricsHandler(metrics);
                res.duration = metrics.duration;
                return res;
            });
        }
        return result;
    };
};
exports.createPerformanceInterceptor = createPerformanceInterceptor;
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
const createServerTimingInterceptor = (timingMetrics) => {
    return (req, res, next) => {
        const timings = Object.entries(timingMetrics)
            .map(([name, getValue]) => `${name};dur=${getValue()}`)
            .join(', ');
        res.headers = res.headers || {};
        res.headers['Server-Timing'] = timings;
        return next(res);
    };
};
exports.createServerTimingInterceptor = createServerTimingInterceptor;
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
const createTimeoutInterceptor = (timeoutMs, timeoutHandler) => {
    return (req, next) => {
        return Promise.race([
            next(req),
            new Promise((_, reject) => {
                setTimeout(() => {
                    const error = timeoutHandler ? timeoutHandler() : new Error('Request timeout');
                    reject(error);
                }, timeoutMs);
            }),
        ]);
    };
};
exports.createTimeoutInterceptor = createTimeoutInterceptor;
// ============================================================================
// HEADER MANIPULATION
// ============================================================================
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
const removeSensitiveHeaders = (sensitiveHeaders) => {
    return (req, next) => {
        sensitiveHeaders.forEach(header => {
            delete req.headers[header];
            delete req.headers[header.toLowerCase()];
        });
        return next(req);
    };
};
exports.removeSensitiveHeaders = removeSensitiveHeaders;
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
const normalizeHeaderNames = () => {
    return (req, next) => {
        const normalizedHeaders = {};
        Object.entries(req.headers || {}).forEach(([key, value]) => {
            normalizedHeaders[key.toLowerCase()] = value;
        });
        req.headers = normalizedHeaders;
        return next(req);
    };
};
exports.normalizeHeaderNames = normalizeHeaderNames;
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
const addSecurityHeaders = (customHeaders) => {
    const defaultHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        ...customHeaders,
    };
    return (req, res, next) => {
        res.headers = { ...res.headers, ...defaultHeaders };
        return next(res);
    };
};
exports.addSecurityHeaders = addSecurityHeaders;
// ============================================================================
// CORS HANDLING
// ============================================================================
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
const createCorsInterceptor = (config) => {
    return (req, res, next) => {
        const origin = req.headers['origin'];
        // Check if origin is allowed
        const isAllowed = (0, exports.checkOriginAllowed)(origin, config.allowedOrigins);
        if (isAllowed) {
            res.headers = res.headers || {};
            res.headers['Access-Control-Allow-Origin'] = origin;
            res.headers['Access-Control-Allow-Methods'] = config.allowedMethods.join(', ');
            res.headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
            if (config.credentials) {
                res.headers['Access-Control-Allow-Credentials'] = 'true';
            }
            if (config.exposedHeaders) {
                res.headers['Access-Control-Expose-Headers'] = config.exposedHeaders.join(', ');
            }
            if (config.maxAge) {
                res.headers['Access-Control-Max-Age'] = String(config.maxAge);
            }
        }
        return next(res);
    };
};
exports.createCorsInterceptor = createCorsInterceptor;
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
const handlePreflightRequest = (config) => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.headers = res.headers || {};
            res.headers['Access-Control-Allow-Methods'] = config.allowedMethods.join(', ');
            res.headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
            res.headers['Access-Control-Max-Age'] = String(config.maxAge || 86400);
            res.body = null;
            return res;
        }
        return next(req);
    };
};
exports.handlePreflightRequest = handlePreflightRequest;
// ============================================================================
// CONTENT-TYPE NEGOTIATION
// ============================================================================
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
const createContentNegotiationInterceptor = (formatters) => {
    return (req, res, next) => {
        const acceptHeader = req.headers['accept'] || 'application/json';
        const preferredFormat = (0, exports.parseAcceptHeader)(acceptHeader, Array.from(formatters.keys()));
        if (preferredFormat && formatters.has(preferredFormat)) {
            const formatter = formatters.get(preferredFormat);
            res.body = formatter(res.body);
            res.headers = res.headers || {};
            res.headers['Content-Type'] = preferredFormat;
        }
        return next(res);
    };
};
exports.createContentNegotiationInterceptor = createContentNegotiationInterceptor;
// ============================================================================
// COMPRESSION INTERCEPTORS
// ============================================================================
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
const createCompressionInterceptor = (config) => {
    return (req, res, next) => {
        const contentType = res.headers['Content-Type'] || 'application/json';
        const shouldCompress = config.mimeTypes.some(type => contentType.includes(type));
        if (shouldCompress && res.body && JSON.stringify(res.body).length > config.threshold) {
            const acceptEncoding = req.headers['accept-encoding'] || '';
            const supportedEncoding = config.algorithms.find(algo => acceptEncoding.toLowerCase().includes(algo));
            if (supportedEncoding) {
                res.headers = res.headers || {};
                res.headers['Content-Encoding'] = supportedEncoding;
                // Compression logic would go here
            }
        }
        return next(res);
    };
};
exports.createCompressionInterceptor = createCompressionInterceptor;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
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
const extractResourceType = (url) => {
    const match = url.match(/\/api\/(?:v\d+\/)?([^/]+)/);
    return match ? match[1] : 'unknown';
};
exports.extractResourceType = extractResourceType;
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
const extractResourceId = (url) => {
    const match = url.match(/\/([^/]+)$/);
    return match && match[1] && !/^\d+$/.test(match[1]) === false ? match[1] : null;
};
exports.extractResourceId = extractResourceId;
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
const checkOriginAllowed = (origin, allowedOrigins) => {
    if (allowedOrigins === '*')
        return true;
    if (allowedOrigins instanceof RegExp)
        return allowedOrigins.test(origin);
    if (Array.isArray(allowedOrigins))
        return allowedOrigins.includes(origin);
    return allowedOrigins === origin;
};
exports.checkOriginAllowed = checkOriginAllowed;
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
const parseAcceptHeader = (acceptHeader, supportedFormats) => {
    const acceptedTypes = acceptHeader.split(',').map(type => {
        const [mimeType, qValue] = type.trim().split(';');
        const quality = qValue ? parseFloat(qValue.split('=')[1]) : 1.0;
        return { mimeType: mimeType.trim(), quality };
    });
    acceptedTypes.sort((a, b) => b.quality - a.quality);
    for (const accepted of acceptedTypes) {
        if (supportedFormats.includes(accepted.mimeType)) {
            return accepted.mimeType;
        }
    }
    return null;
};
exports.parseAcceptHeader = parseAcceptHeader;
exports.default = {
    // Request interceptors
    createTimestampInterceptor: exports.createTimestampInterceptor,
    createRequestIdInterceptor: exports.createRequestIdInterceptor,
    createAuthInterceptor: exports.createAuthInterceptor,
    createHeaderInterceptor: exports.createHeaderInterceptor,
    createHeaderTransformInterceptor: exports.createHeaderTransformInterceptor,
    createUserContextInterceptor: exports.createUserContextInterceptor,
    createBodyValidationInterceptor: exports.createBodyValidationInterceptor,
    createCorrelationIdInterceptor: exports.createCorrelationIdInterceptor,
    // Response interceptors
    createResponseMetadataInterceptor: exports.createResponseMetadataInterceptor,
    createResponseTransformInterceptor: exports.createResponseTransformInterceptor,
    createCacheControlInterceptor: exports.createCacheControlInterceptor,
    createHateoasInterceptor: exports.createHateoasInterceptor,
    createFieldFilterInterceptor: exports.createFieldFilterInterceptor,
    // Authentication
    createJwtValidationInterceptor: exports.createJwtValidationInterceptor,
    createApiKeyInterceptor: exports.createApiKeyInterceptor,
    createBasicAuthInterceptor: exports.createBasicAuthInterceptor,
    createTokenRefreshInterceptor: exports.createTokenRefreshInterceptor,
    // Logging
    createRequestLoggingInterceptor: exports.createRequestLoggingInterceptor,
    createResponseLoggingInterceptor: exports.createResponseLoggingInterceptor,
    createAuditLogInterceptor: exports.createAuditLogInterceptor,
    createErrorLoggingInterceptor: exports.createErrorLoggingInterceptor,
    // Error handling
    createErrorTransformInterceptor: exports.createErrorTransformInterceptor,
    createErrorSanitizationInterceptor: exports.createErrorSanitizationInterceptor,
    createErrorStatusMapInterceptor: exports.createErrorStatusMapInterceptor,
    // Performance
    createPerformanceInterceptor: exports.createPerformanceInterceptor,
    createServerTimingInterceptor: exports.createServerTimingInterceptor,
    createTimeoutInterceptor: exports.createTimeoutInterceptor,
    // Headers
    removeSensitiveHeaders: exports.removeSensitiveHeaders,
    normalizeHeaderNames: exports.normalizeHeaderNames,
    addSecurityHeaders: exports.addSecurityHeaders,
    // CORS
    createCorsInterceptor: exports.createCorsInterceptor,
    handlePreflightRequest: exports.handlePreflightRequest,
    // Content negotiation
    createContentNegotiationInterceptor: exports.createContentNegotiationInterceptor,
    // Compression
    createCompressionInterceptor: exports.createCompressionInterceptor,
    // Helpers
    extractResourceType: exports.extractResourceType,
    extractResourceId: exports.extractResourceId,
    checkOriginAllowed: exports.checkOriginAllowed,
    parseAcceptHeader: exports.parseAcceptHeader,
};
//# sourceMappingURL=http-interceptors-utils.js.map