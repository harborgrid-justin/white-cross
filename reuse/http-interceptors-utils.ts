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

/**
 * File: /reuse/http-interceptors-utils.ts
 * Locator: WC-UTL-INT-003
 * Purpose: HTTP Interceptor Utilities - Comprehensive NestJS interceptor patterns and HTTP request/response manipulation
 *
 * Upstream: Independent utility module for HTTP interception
 * Downstream: ../backend/*, NestJS controllers, middleware, guards
 * Dependencies: TypeScript 5.x, @nestjs/common, rxjs
 * Exports: 40 utility functions for HTTP interceptors, request/response transformation, logging, timing
 *
 * LLM Context: Comprehensive HTTP interceptor utilities for White Cross healthcare system.
 * Provides request/response interceptors, authentication handlers, logging, performance monitoring,
 * header manipulation, request ID injection, CORS handling, compression, and NestJS patterns.
 * Essential for healthcare API security, audit trails, and performance optimization.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

interface InterceptorContext {
  startTime?: number;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface RequestInterceptorConfig {
  addTimestamp?: boolean;
  addRequestId?: boolean;
  addUserContext?: boolean;
  transformHeaders?: boolean;
}

interface ResponseInterceptorConfig {
  logResponse?: boolean;
  transformResponse?: boolean;
  addMetadata?: boolean;
  measurePerformance?: boolean;
}

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
  threshold: number; // bytes
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

interface AuthInterceptorConfig {
  tokenHeader: string;
  tokenPrefix: string;
  validateToken?: (token: string) => Promise<boolean>;
  extractUser?: (token: string) => Promise<any>;
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
export const createTimestampInterceptor = (
  headerName: string = 'X-Request-Time',
): Function => {
  return (req: any, next: Function) => {
    req.headers = req.headers || {};
    req.headers[headerName] = new Date().toISOString();
    return next(req);
  };
};

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
export const createRequestIdInterceptor = (
  headerName: string = 'X-Request-ID',
  idGenerator?: () => string,
): Function => {
  const generateId = idGenerator || (() => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  return (req: any, next: Function) => {
    req.headers = req.headers || {};
    req.headers[headerName] = generateId();
    return next(req);
  };
};

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
export const createAuthInterceptor = (
  token: string,
  scheme: string = 'Bearer',
  headerName: string = 'Authorization',
): Function => {
  return (req: any, next: Function) => {
    req.headers = req.headers || {};
    req.headers[headerName] = `${scheme} ${token}`;
    return next(req);
  };
};

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
export const createHeaderInterceptor = (
  headers: Record<string, string>,
  overwrite: boolean = false,
): Function => {
  return (req: any, next: Function) => {
    req.headers = req.headers || {};
    Object.entries(headers).forEach(([key, value]) => {
      if (overwrite || !req.headers[key]) {
        req.headers[key] = value;
      }
    });
    return next(req);
  };
};

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
export const createHeaderTransformInterceptor = (
  transformer: (headers: Record<string, string>) => Record<string, string>,
): Function => {
  return (req: any, next: Function) => {
    req.headers = transformer(req.headers || {});
    return next(req);
  };
};

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
export const createUserContextInterceptor = (
  getUserContext: () => Promise<any>,
  headerPrefix: string = 'X-User-',
): Function => {
  return async (req: any, next: Function) => {
    const userContext = await getUserContext();
    req.headers = req.headers || {};

    Object.entries(userContext).forEach(([key, value]) => {
      req.headers[`${headerPrefix}${key}`] = String(value);
    });

    return next(req);
  };
};

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
export const createBodyValidationInterceptor = (
  validator: (body: any) => any,
): Function => {
  return (req: any, next: Function) => {
    if (req.body) {
      req.body = validator(req.body);
    }
    return next(req);
  };
};

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
export const createCorrelationIdInterceptor = (
  headerName: string = 'X-Correlation-ID',
): Function => {
  return (req: any, next: Function) => {
    req.headers = req.headers || {};
    // Use existing correlation ID or generate new one
    req.headers[headerName] = req.headers[headerName] ||
      `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return next(req);
  };
};

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
export const createResponseMetadataInterceptor = (
  metadataBuilder: (req: any, res: any) => Record<string, any>,
): Function => {
  return (req: any, res: any, next: Function) => {
    const metadata = metadataBuilder(req, res);
    res.body = {
      ...res.body,
      _metadata: metadata,
    };
    return next(res);
  };
};

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
export const createResponseTransformInterceptor = (
  transformer: (data: any) => any,
): Function => {
  return (req: any, res: any, next: Function) => {
    res.body = transformer(res.body);
    return next(res);
  };
};

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
export const createCacheControlInterceptor = (
  maxAge: number,
  isPrivate: boolean = true,
): Function => {
  return (req: any, res: any, next: Function) => {
    const cacheType = isPrivate ? 'private' : 'public';
    res.headers = res.headers || {};
    res.headers['Cache-Control'] = `${cacheType}, max-age=${maxAge}`;
    return next(res);
  };
};

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
export const createHateoasInterceptor = (
  linkBuilder: (req: any, data: any) => Record<string, string>,
): Function => {
  return (req: any, res: any, next: Function) => {
    const links = linkBuilder(req, res.body);
    res.body = {
      ...res.body,
      _links: links,
    };
    return next(res);
  };
};

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
export const createFieldFilterInterceptor = (
  allowedFields: string[],
): Function => {
  return (req: any, res: any, next: Function) => {
    const filterObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(filterObject);
      } else if (obj && typeof obj === 'object') {
        return Object.keys(obj)
          .filter(key => allowedFields.includes(key))
          .reduce((acc, key) => {
            acc[key] = filterObject(obj[key]);
            return acc;
          }, {} as any);
      }
      return obj;
    };

    res.body = filterObject(res.body);
    return next(res);
  };
};

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
export const createJwtValidationInterceptor = (
  validateToken: (token: string) => Promise<any>,
  headerName: string = 'Authorization',
): Function => {
  return async (req: any, next: Function) => {
    const authHeader = req.headers[headerName] || req.headers[headerName.toLowerCase()];

    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '');
      try {
        const payload = await validateToken(token);
        req.user = payload;
      } catch (error) {
        throw new Error('Invalid authentication token');
      }
    }

    return next(req);
  };
};

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
export const createApiKeyInterceptor = (
  validateApiKey: (apiKey: string) => Promise<any>,
  headerName: string = 'X-API-Key',
): Function => {
  return async (req: any, next: Function) => {
    const apiKey = req.headers[headerName] || req.headers[headerName.toLowerCase()];

    if (!apiKey) {
      throw new Error('API key required');
    }

    try {
      const keyInfo = await validateApiKey(apiKey);
      req.apiKeyInfo = keyInfo;
    } catch (error) {
      throw new Error('Invalid API key');
    }

    return next(req);
  };
};

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
export const createBasicAuthInterceptor = (
  authenticate: (username: string, password: string) => Promise<any>,
): Function => {
  return async (req: any, next: Function) => {
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
    } catch (error) {
      throw new Error('Invalid credentials');
    }

    return next(req);
  };
};

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
export const createTokenRefreshInterceptor = (
  refreshToken: (token: string) => Promise<string>,
  isTokenExpired: (token: string) => boolean,
): Function => {
  return async (req: any, next: Function) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '');

      if (isTokenExpired(token)) {
        try {
          const newToken = await refreshToken(token);
          req.headers['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
          throw new Error('Failed to refresh token');
        }
      }
    }

    return next(req);
  };
};

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
export const createRequestLoggingInterceptor = (
  logger: (entry: RequestLogEntry) => void,
  config?: LoggingConfig,
): Function => {
  return (req: any, next: Function) => {
    const entry: RequestLogEntry = {
      requestId: req.headers['x-request-id'] || 'unknown',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      userId: req.user?.id,
      ipAddress: req.ip,
    };

    if (config?.logHeaders) entry.headers = req.headers;
    if (config?.logQuery) entry.query = req.query;
    if (config?.logParams) entry.params = req.params;
    if (config?.logBody) entry.body = req.body;

    logger(entry);
    return next(req);
  };
};

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
export const createResponseLoggingInterceptor = (
  logger: (entry: ResponseLogEntry) => void,
  config?: LoggingConfig,
): Function => {
  return (req: any, res: any, next: Function) => {
    const entry: ResponseLogEntry = {
      requestId: req.headers['x-request-id'] || 'unknown',
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      duration: res.duration || 0,
    };

    if (config?.logHeaders) entry.headers = res.headers;
    if (config?.logBody) entry.body = res.body;

    logger(entry);
    return next(res);
  };
};

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
export const createAuditLogInterceptor = (
  auditLogger: (entry: any) => Promise<void>,
): Function => {
  return async (req: any, next: Function) => {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      userRole: req.user?.role,
      action: `${req.method} ${req.url}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
      resourceType: extractResourceType(req.url),
      resourceId: extractResourceId(req.url),
    };

    await auditLogger(auditEntry);
    return next(req);
  };
};

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
export const createErrorLoggingInterceptor = (
  errorLogger: (error: any, req: any) => void,
): Function => {
  return (req: any, next: Function) => {
    try {
      return next(req);
    } catch (error) {
      errorLogger(error, req);
      throw error;
    }
  };
};

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
export const createErrorTransformInterceptor = (
  transformer: (error: any) => any,
): Function => {
  return (req: any, res: any, next: Function) => {
    if (res.error) {
      res.error = transformer(res.error);
    }
    return next(res);
  };
};

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
export const createErrorSanitizationInterceptor = (
  includeStackTrace: boolean = false,
): Function => {
  return (req: any, res: any, next: Function) => {
    if (res.error) {
      const sanitized: any = {
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
export const createErrorStatusMapInterceptor = (
  errorMap: Map<string, number>,
): Function => {
  return (req: any, res: any, next: Function) => {
    if (res.error) {
      const errorType = res.error.constructor.name;
      const statusCode = errorMap.get(errorType) || 500;
      res.statusCode = statusCode;
      res.error.statusCode = statusCode;
    }
    return next(res);
  };
};

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
export const createPerformanceInterceptor = (
  metricsHandler: (metrics: TimingMetrics) => void,
): Function => {
  return (req: any, next: Function) => {
    const startTime = Date.now();
    req.startTime = startTime;

    const result = next(req);

    // Handle both sync and async results
    if (result && typeof result.then === 'function') {
      return result.then((res: any) => {
        const endTime = Date.now();
        const metrics: TimingMetrics = {
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
export const createServerTimingInterceptor = (
  timingMetrics: Record<string, () => number>,
): Function => {
  return (req: any, res: any, next: Function) => {
    const timings = Object.entries(timingMetrics)
      .map(([name, getValue]) => `${name};dur=${getValue()}`)
      .join(', ');

    res.headers = res.headers || {};
    res.headers['Server-Timing'] = timings;

    return next(res);
  };
};

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
export const createTimeoutInterceptor = (
  timeoutMs: number,
  timeoutHandler?: () => any,
): Function => {
  return (req: any, next: Function) => {
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
export const removeSensitiveHeaders = (
  sensitiveHeaders: string[],
): Function => {
  return (req: any, next: Function) => {
    sensitiveHeaders.forEach(header => {
      delete req.headers[header];
      delete req.headers[header.toLowerCase()];
    });
    return next(req);
  };
};

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
export const normalizeHeaderNames = (): Function => {
  return (req: any, next: Function) => {
    const normalizedHeaders: Record<string, string> = {};
    Object.entries(req.headers || {}).forEach(([key, value]) => {
      normalizedHeaders[key.toLowerCase()] = value as string;
    });
    req.headers = normalizedHeaders;
    return next(req);
  };
};

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
export const addSecurityHeaders = (
  customHeaders?: Record<string, string>,
): Function => {
  const defaultHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    ...customHeaders,
  };

  return (req: any, res: any, next: Function) => {
    res.headers = { ...res.headers, ...defaultHeaders };
    return next(res);
  };
};

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
export const createCorsInterceptor = (
  config: CorsInterceptorConfig,
): Function => {
  return (req: any, res: any, next: Function) => {
    const origin = req.headers['origin'];

    // Check if origin is allowed
    const isAllowed = checkOriginAllowed(origin, config.allowedOrigins);

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
export const handlePreflightRequest = (
  config: CorsInterceptorConfig,
): Function => {
  return (req: any, res: any, next: Function) => {
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
export const createContentNegotiationInterceptor = (
  formatters: Map<string, (data: any) => any>,
): Function => {
  return (req: any, res: any, next: Function) => {
    const acceptHeader = req.headers['accept'] || 'application/json';
    const preferredFormat = parseAcceptHeader(acceptHeader, Array.from(formatters.keys()));

    if (preferredFormat && formatters.has(preferredFormat)) {
      const formatter = formatters.get(preferredFormat)!;
      res.body = formatter(res.body);
      res.headers = res.headers || {};
      res.headers['Content-Type'] = preferredFormat;
    }

    return next(res);
  };
};

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
export const createCompressionInterceptor = (
  config: CompressionConfig,
): Function => {
  return (req: any, res: any, next: Function) => {
    const contentType = res.headers['Content-Type'] || 'application/json';
    const shouldCompress = config.mimeTypes.some(type => contentType.includes(type));

    if (shouldCompress && res.body && JSON.stringify(res.body).length > config.threshold) {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const supportedEncoding = config.algorithms.find(algo =>
        acceptEncoding.toLowerCase().includes(algo)
      );

      if (supportedEncoding) {
        res.headers = res.headers || {};
        res.headers['Content-Encoding'] = supportedEncoding;
        // Compression logic would go here
      }
    }

    return next(res);
  };
};

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
export const extractResourceType = (url: string): string => {
  const match = url.match(/\/api\/(?:v\d+\/)?([^/]+)/);
  return match ? match[1] : 'unknown';
};

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
export const extractResourceId = (url: string): string | null => {
  const match = url.match(/\/([^/]+)$/);
  return match && match[1] && !/^\d+$/.test(match[1]) === false ? match[1] : null;
};

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
export const checkOriginAllowed = (
  origin: string,
  allowedOrigins: string | string[] | RegExp,
): boolean => {
  if (allowedOrigins === '*') return true;
  if (allowedOrigins instanceof RegExp) return allowedOrigins.test(origin);
  if (Array.isArray(allowedOrigins)) return allowedOrigins.includes(origin);
  return allowedOrigins === origin;
};

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
export const parseAcceptHeader = (
  acceptHeader: string,
  supportedFormats: string[],
): string | null => {
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

export default {
  // Request interceptors
  createTimestampInterceptor,
  createRequestIdInterceptor,
  createAuthInterceptor,
  createHeaderInterceptor,
  createHeaderTransformInterceptor,
  createUserContextInterceptor,
  createBodyValidationInterceptor,
  createCorrelationIdInterceptor,

  // Response interceptors
  createResponseMetadataInterceptor,
  createResponseTransformInterceptor,
  createCacheControlInterceptor,
  createHateoasInterceptor,
  createFieldFilterInterceptor,

  // Authentication
  createJwtValidationInterceptor,
  createApiKeyInterceptor,
  createBasicAuthInterceptor,
  createTokenRefreshInterceptor,

  // Logging
  createRequestLoggingInterceptor,
  createResponseLoggingInterceptor,
  createAuditLogInterceptor,
  createErrorLoggingInterceptor,

  // Error handling
  createErrorTransformInterceptor,
  createErrorSanitizationInterceptor,
  createErrorStatusMapInterceptor,

  // Performance
  createPerformanceInterceptor,
  createServerTimingInterceptor,
  createTimeoutInterceptor,

  // Headers
  removeSensitiveHeaders,
  normalizeHeaderNames,
  addSecurityHeaders,

  // CORS
  createCorsInterceptor,
  handlePreflightRequest,

  // Content negotiation
  createContentNegotiationInterceptor,

  // Compression
  createCompressionInterceptor,

  // Helpers
  extractResourceType,
  extractResourceId,
  checkOriginAllowed,
  parseAcceptHeader,
};
