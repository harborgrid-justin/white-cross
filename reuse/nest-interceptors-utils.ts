/**
 * LOC: 7C3F9B5D82
 * File: /reuse/nest-interceptors-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (NestJS framework)
 *   - rxjs (Reactive extensions)
 *
 * DOWNSTREAM (imported by):
 *   - backend/src/**/*.controller.ts (Controller interceptors)
 *   - backend/src/**/*.module.ts (Global interceptors)
 *   - backend/src/**/*.interceptor.ts (Custom interceptors)
 */

/**
 * File: /reuse/nest-interceptors-utils.ts
 * Locator: WC-UTL-ICPT-002
 * Purpose: NestJS Interceptor Utilities - Request/response transformation, logging, caching
 *
 * Upstream: @nestjs/common, rxjs, rxjs/operators
 * Downstream: All NestJS controllers and modules across White Cross platform
 * Dependencies: NestJS v11.x, RxJS v7.x, TypeScript 5.x, Node 18+
 * Exports: 40 interceptor utilities for transforms, caching, logging, errors, timeouts
 *
 * LLM Context: Type-safe NestJS interceptor utilities for White Cross healthcare system.
 * Provides request/response interceptors, transform patterns, caching strategies,
 * logging middleware, error handling, timeout management, retry logic, metrics collection,
 * data sanitization, and response mapping. Critical for API performance and reliability.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import {
  Observable,
  throwError,
  of,
  TimeoutError,
  timer,
  Subject,
  from,
} from 'rxjs';
import {
  map,
  catchError,
  timeout,
  tap,
  retry,
  mergeMap,
  delay,
  retryWhen,
  scan,
  takeUntil,
  finalize,
  share,
} from 'rxjs/operators';

// ============================================================================
// REQUEST/RESPONSE INTERCEPTORS
// ============================================================================

/**
 * Creates a basic request/response logging interceptor.
 *
 * @param {object} [options] - Logging configuration
 * @returns {NestInterceptor} Logging interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createLoggingInterceptor({ logBody: false }))
 * @Controller('users')
 * export class UsersController {
 *   @Get()
 *   async findAll() {
 *     // Logs request/response automatically
 *   }
 * }
 * ```
 */
export function createLoggingInterceptor(
  options: { logBody?: boolean; logHeaders?: boolean } = {},
): NestInterceptor {
  @Injectable()
  class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, body, headers } = request;
      const now = Date.now();

      console.log(`[REQUEST] ${method} ${url}`);
      if (options.logBody && body) {
        console.log('[BODY]', JSON.stringify(body));
      }
      if (options.logHeaders) {
        console.log('[HEADERS]', headers);
      }

      return next.handle().pipe(
        tap((data) => {
          const duration = Date.now() - now;
          console.log(`[RESPONSE] ${method} ${url} - ${duration}ms`);
        }),
        catchError((error) => {
          const duration = Date.now() - now;
          console.error(`[ERROR] ${method} ${url} - ${duration}ms`, error.message);
          throw error;
        }),
      );
    }
  }

  return new LoggingInterceptor();
}

/**
 * Creates an interceptor that adds custom headers to responses.
 *
 * @param {Record<string, string>} headers - Headers to add
 * @returns {NestInterceptor} Header interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createHeaderInterceptor({
 *   'X-API-Version': '1.0',
 *   'X-RateLimit-Limit': '100'
 * }))
 * @Get()
 * async getData() {
 *   return { data: 'value' };
 * }
 * ```
 */
export function createHeaderInterceptor(
  headers: Record<string, string>,
): NestInterceptor {
  @Injectable()
  class HeaderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse();

      Object.entries(headers).forEach(([key, value]) => {
        response.setHeader(key, value);
      });

      return next.handle();
    }
  }

  return new HeaderInterceptor();
}

/**
 * Creates an interceptor that extracts and attaches request context.
 *
 * @param {(context: ExecutionContext) => Record<string, any>} extractor - Context extraction function
 * @returns {NestInterceptor} Context interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createRequestContextInterceptor((ctx) => ({
 *   userId: ctx.switchToHttp().getRequest().user?.id,
 *   requestId: ctx.switchToHttp().getRequest().id
 * })))
 * @Post()
 * async create(@Body() dto: CreateDto) {
 *   // Context available in request
 * }
 * ```
 */
export function createRequestContextInterceptor(
  extractor: (context: ExecutionContext) => Record<string, any>,
): NestInterceptor {
  @Injectable()
  class RequestContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const contextData = extractor(context);

      request.context = {
        ...request.context,
        ...contextData,
      };

      return next.handle();
    }
  }

  return new RequestContextInterceptor();
}

/**
 * Creates an interceptor that measures request execution time.
 *
 * @param {(duration: number, context: ExecutionContext) => void} onComplete - Callback with duration
 * @returns {NestInterceptor} Performance interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPerformanceInterceptor((duration, ctx) => {
 *   console.log(`Request took ${duration}ms`);
 *   metrics.recordDuration('api.request', duration);
 * }))
 * ```
 */
export function createPerformanceInterceptor(
  onComplete: (duration: number, context: ExecutionContext) => void,
): NestInterceptor {
  @Injectable()
  class PerformanceInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const startTime = Date.now();

      return next.handle().pipe(
        finalize(() => {
          const duration = Date.now() - startTime;
          onComplete(duration, context);
        }),
      );
    }
  }

  return new PerformanceInterceptor();
}

// ============================================================================
// TRANSFORM INTERCEPTORS
// ============================================================================

/**
 * Creates an interceptor that wraps responses in a standard format.
 *
 * @template T - The response data type
 * @param {(data: T) => any} wrapper - Response wrapper function
 * @returns {NestInterceptor} Transform interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseWrapperInterceptor((data) => ({
 *   success: true,
 *   data,
 *   timestamp: new Date().toISOString()
 * })))
 * @Get()
 * async getData() {
 *   return { value: 'test' };
 *   // Returns: { success: true, data: { value: 'test' }, timestamp: '...' }
 * }
 * ```
 */
export function createResponseWrapperInterceptor<T = any>(
  wrapper: (data: T, context?: ExecutionContext) => any,
): NestInterceptor {
  @Injectable()
  class ResponseWrapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => wrapper(data, context)),
      );
    }
  }

  return new ResponseWrapperInterceptor();
}

/**
 * Creates an interceptor that transforms response data using a mapper function.
 *
 * @template TInput - Input data type
 * @template TOutput - Output data type
 * @param {(data: TInput) => TOutput} mapper - Data transformation function
 * @returns {NestInterceptor} Data mapper interceptor
 *
 * @example
 * ```typescript
 * interface DbUser { id: string; password_hash: string; email: string }
 * interface ApiUser { id: string; email: string }
 *
 * @UseInterceptors(createDataMapperInterceptor<DbUser, ApiUser>((user) => ({
 *   id: user.id,
 *   email: user.email
 *   // password_hash excluded
 * })))
 * ```
 */
export function createDataMapperInterceptor<TInput, TOutput>(
  mapper: (data: TInput) => TOutput,
): NestInterceptor {
  @Injectable()
  class DataMapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (Array.isArray(data)) {
            return data.map(mapper);
          }
          return mapper(data);
        }),
      );
    }
  }

  return new DataMapperInterceptor();
}

/**
 * Creates an interceptor that filters object properties from responses.
 *
 * @param {string[]} excludeFields - Fields to exclude from response
 * @returns {NestInterceptor} Property filter interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPropertyFilterInterceptor([
 *   'password',
 *   'passwordHash',
 *   'ssn',
 *   'medicalRecordNumber'
 * ]))
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   // Sensitive fields automatically removed
 * }
 * ```
 */
export function createPropertyFilterInterceptor(
  excludeFields: string[],
): NestInterceptor {
  @Injectable()
  class PropertyFilterInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => this.filterProperties(data, excludeFields)),
      );
    }

    private filterProperties(obj: any, excludeFields: string[]): any {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.filterProperties(item, excludeFields));
      }

      if (obj !== null && typeof obj === 'object') {
        const filtered: any = {};
        Object.keys(obj).forEach((key) => {
          if (!excludeFields.includes(key)) {
            filtered[key] = this.filterProperties(obj[key], excludeFields);
          }
        });
        return filtered;
      }

      return obj;
    }
  }

  return new PropertyFilterInterceptor();
}

/**
 * Creates an interceptor that serializes class instances to plain objects.
 *
 * @param {object} [options] - Serialization options
 * @returns {NestInterceptor} Serialization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createSerializationInterceptor({
 *   excludeExtraneousValues: true
 * }))
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   return new Patient(...); // Automatically serialized
 * }
 * ```
 */
export function createSerializationInterceptor(
  options: { excludeExtraneousValues?: boolean } = {},
): NestInterceptor {
  @Injectable()
  class SerializationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (data && typeof data === 'object') {
            return JSON.parse(JSON.stringify(data));
          }
          return data;
        }),
      );
    }
  }

  return new SerializationInterceptor();
}

// ============================================================================
// CACHING INTERCEPTORS
// ============================================================================

/**
 * Creates a simple in-memory caching interceptor.
 *
 * @param {object} options - Cache configuration
 * @returns {NestInterceptor} Cache interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(createCacheInterceptor({
 *   ttl: 60000, // 1 minute
 *   keyGenerator: (ctx) => {
 *     const request = ctx.switchToHttp().getRequest();
 *     return `${request.method}:${request.url}`;
 *   }
 * }))
 * @Get('reports/daily')
 * async getDailyReport() {
 *   // Cached for 1 minute
 * }
 * ```
 */
export function createCacheInterceptor(options: {
  ttl: number;
  keyGenerator: (context: ExecutionContext) => string;
}): NestInterceptor {
  const cache = new Map<string, { data: any; expiry: number }>();

  @Injectable()
  class CacheInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const key = options.keyGenerator(context);
      const cached = cache.get(key);

      if (cached && cached.expiry > Date.now()) {
        return of(cached.data);
      }

      return next.handle().pipe(
        tap((data) => {
          cache.set(key, {
            data,
            expiry: Date.now() + options.ttl,
          });
        }),
      );
    }
  }

  return new CacheInterceptor();
}

/**
 * Creates a conditional caching interceptor based on request/response.
 *
 * @param {object} config - Conditional cache configuration
 * @returns {NestInterceptor} Conditional cache interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createConditionalCacheInterceptor({
 *   ttl: 30000,
 *   shouldCache: (ctx, data) => {
 *     const request = ctx.switchToHttp().getRequest();
 *     return request.method === 'GET' && data.cacheable;
 *   },
 *   keyGenerator: (ctx) => ctx.switchToHttp().getRequest().url
 * }))
 * ```
 */
export function createConditionalCacheInterceptor(config: {
  ttl: number;
  shouldCache: (context: ExecutionContext, data: any) => boolean;
  keyGenerator: (context: ExecutionContext) => string;
}): NestInterceptor {
  const cache = new Map<string, { data: any; expiry: number }>();

  @Injectable()
  class ConditionalCacheInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const key = config.keyGenerator(context);
      const cached = cache.get(key);

      if (cached && cached.expiry > Date.now()) {
        return of(cached.data);
      }

      return next.handle().pipe(
        tap((data) => {
          if (config.shouldCache(context, data)) {
            cache.set(key, {
              data,
              expiry: Date.now() + config.ttl,
            });
          }
        }),
      );
    }
  }

  return new ConditionalCacheInterceptor();
}

/**
 * Creates an interceptor that invalidates cache on mutation operations.
 *
 * @param {object} options - Cache invalidation configuration
 * @returns {NestInterceptor} Cache invalidation interceptor
 *
 * @example
 * ```typescript
 * const cache = new Map();
 *
 * @UseInterceptors(createCacheInvalidationInterceptor({
 *   cache,
 *   pattern: /^\/api\/students/,
 *   methods: ['POST', 'PUT', 'DELETE', 'PATCH']
 * }))
 * @Post('students')
 * async createStudent(@Body() dto: CreateStudentDto) {
 *   // Invalidates /api/students/* cache entries
 * }
 * ```
 */
export function createCacheInvalidationInterceptor(options: {
  cache: Map<string, any>;
  pattern: RegExp;
  methods?: string[];
}): NestInterceptor {
  const { cache, pattern, methods = ['POST', 'PUT', 'DELETE', 'PATCH'] } = options;

  @Injectable()
  class CacheInvalidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      if (methods.includes(request.method)) {
        // Invalidate matching cache entries after mutation
        return next.handle().pipe(
          tap(() => {
            const keysToDelete: string[] = [];
            cache.forEach((value, key) => {
              if (pattern.test(key)) {
                keysToDelete.push(key);
              }
            });
            keysToDelete.forEach((key) => cache.delete(key));
          }),
        );
      }

      return next.handle();
    }
  }

  return new CacheInvalidationInterceptor();
}

// ============================================================================
// LOGGING INTERCEPTORS
// ============================================================================

/**
 * Creates a structured logging interceptor with context.
 *
 * @param {object} logger - Logger instance with log methods
 * @returns {NestInterceptor} Structured logging interceptor
 *
 * @example
 * ```typescript
 * const logger = {
 *   info: (msg, meta) => console.log(msg, meta),
 *   error: (msg, meta) => console.error(msg, meta)
 * };
 *
 * @UseInterceptors(createStructuredLoggingInterceptor(logger))
 * @Controller('api')
 * export class ApiController {}
 * ```
 */
export function createStructuredLoggingInterceptor(logger: {
  info: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
}): NestInterceptor {
  @Injectable()
  class StructuredLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, headers, body } = request;
      const startTime = Date.now();

      const metadata = {
        method,
        url,
        userAgent: headers['user-agent'],
        ip: request.ip,
        userId: request.user?.id,
      };

      logger.info('Incoming request', metadata);

      return next.handle().pipe(
        tap((data) => {
          logger.info('Request completed', {
            ...metadata,
            duration: Date.now() - startTime,
            statusCode: context.switchToHttp().getResponse().statusCode,
          });
        }),
        catchError((error) => {
          logger.error('Request failed', {
            ...metadata,
            duration: Date.now() - startTime,
            error: error.message,
            stack: error.stack,
          });
          return throwError(() => error);
        }),
      );
    }
  }

  return new StructuredLoggingInterceptor();
}

/**
 * Creates an audit logging interceptor for HIPAA compliance.
 *
 * @param {object} auditService - Audit service instance
 * @returns {NestInterceptor} Audit logging interceptor
 *
 * @example
 * ```typescript
 * const auditService = {
 *   logAccess: async (data) => {
 *     await db.auditLogs.create(data);
 *   }
 * };
 *
 * @UseInterceptors(createAuditLoggingInterceptor(auditService))
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   // Access automatically logged for HIPAA compliance
 * }
 * ```
 */
export function createAuditLoggingInterceptor(auditService: {
  logAccess: (data: any) => Promise<void>;
}): NestInterceptor {
  @Injectable()
  class AuditLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, user, ip } = request;

      const auditData = {
        userId: user?.id,
        userName: user?.name,
        method,
        url,
        ip,
        timestamp: new Date(),
        resource: this.extractResource(url),
      };

      return next.handle().pipe(
        tap(async (response) => {
          await auditService.logAccess({
            ...auditData,
            action: 'access',
            success: true,
          });
        }),
        catchError(async (error) => {
          await auditService.logAccess({
            ...auditData,
            action: 'access_denied',
            success: false,
            error: error.message,
          });
          return throwError(() => error);
        }),
      );
    }

    private extractResource(url: string): string {
      const match = url.match(/\/([^/]+)/);
      return match ? match[1] : 'unknown';
    }
  }

  return new AuditLoggingInterceptor();
}

/**
 * Creates a request/response payload logging interceptor.
 *
 * @param {object} options - Payload logging configuration
 * @returns {NestInterceptor} Payload logging interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPayloadLoggingInterceptor({
 *   logRequest: true,
 *   logResponse: true,
 *   maxBodyLength: 1000,
 *   sanitizeFields: ['password', 'ssn', 'creditCard']
 * }))
 * ```
 */
export function createPayloadLoggingInterceptor(options: {
  logRequest?: boolean;
  logResponse?: boolean;
  maxBodyLength?: number;
  sanitizeFields?: string[];
}): NestInterceptor {
  @Injectable()
  class PayloadLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      if (options.logRequest && request.body) {
        const sanitized = this.sanitize(request.body, options.sanitizeFields || []);
        console.log('[REQUEST PAYLOAD]', this.truncate(sanitized, options.maxBodyLength));
      }

      return next.handle().pipe(
        tap((data) => {
          if (options.logResponse && data) {
            const sanitized = this.sanitize(data, options.sanitizeFields || []);
            console.log('[RESPONSE PAYLOAD]', this.truncate(sanitized, options.maxBodyLength));
          }
        }),
      );
    }

    private sanitize(obj: any, fields: string[]): any {
      if (typeof obj !== 'object' || obj === null) return obj;

      const sanitized = Array.isArray(obj) ? [] : {};
      Object.keys(obj).forEach((key) => {
        if (fields.includes(key)) {
          (sanitized as any)[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          (sanitized as any)[key] = this.sanitize(obj[key], fields);
        } else {
          (sanitized as any)[key] = obj[key];
        }
      });
      return sanitized;
    }

    private truncate(obj: any, maxLength?: number): any {
      if (!maxLength) return obj;
      const str = JSON.stringify(obj);
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : obj;
    }
  }

  return new PayloadLoggingInterceptor();
}

// ============================================================================
// ERROR HANDLING INTERCEPTORS
// ============================================================================

/**
 * Creates an error transformation interceptor.
 *
 * @param {(error: Error) => HttpException} transformer - Error transformer function
 * @returns {NestInterceptor} Error transform interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createErrorTransformInterceptor((error) => {
 *   if (error.name === 'SequelizeUniqueConstraintError') {
 *     return new ConflictException('Resource already exists');
 *   }
 *   return new InternalServerErrorException('Internal error');
 * }))
 * ```
 */
export function createErrorTransformInterceptor(
  transformer: (error: Error) => HttpException,
): NestInterceptor {
  @Injectable()
  class ErrorTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((error) => {
          const transformed = transformer(error);
          return throwError(() => transformed);
        }),
      );
    }
  }

  return new ErrorTransformInterceptor();
}

/**
 * Creates an error sanitization interceptor that removes sensitive data from errors.
 *
 * @param {string[]} sensitiveFields - Fields to sanitize
 * @returns {NestInterceptor} Error sanitization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createErrorSanitizationInterceptor([
 *   'password',
 *   'apiKey',
 *   'connectionString'
 * ]))
 * ```
 */
export function createErrorSanitizationInterceptor(
  sensitiveFields: string[],
): NestInterceptor {
  @Injectable()
  class ErrorSanitizationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((error) => {
          // Sanitize error message and stack
          const sanitized = { ...error };
          sensitiveFields.forEach((field) => {
            if (sanitized.message?.includes(field)) {
              sanitized.message = sanitized.message.replace(
                new RegExp(field, 'gi'),
                '[REDACTED]',
              );
            }
            if (sanitized.stack?.includes(field)) {
              sanitized.stack = sanitized.stack.replace(
                new RegExp(field, 'gi'),
                '[REDACTED]',
              );
            }
          });
          return throwError(() => sanitized);
        }),
      );
    }
  }

  return new ErrorSanitizationInterceptor();
}

/**
 * Creates a fallback interceptor that provides default values on error.
 *
 * @template T - The fallback value type
 * @param {T | ((error: Error) => T)} fallbackValue - Fallback value or generator
 * @returns {NestInterceptor} Fallback interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createFallbackInterceptor({
 *   users: [],
 *   total: 0,
 *   message: 'Service temporarily unavailable'
 * }))
 * @Get('users')
 * async getUsers() {
 *   // Returns fallback value if service fails
 * }
 * ```
 */
export function createFallbackInterceptor<T>(
  fallbackValue: T | ((error: Error) => T),
): NestInterceptor {
  @Injectable()
  class FallbackInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((error) => {
          console.error('Request failed, returning fallback:', error.message);
          const value =
            typeof fallbackValue === 'function'
              ? (fallbackValue as (error: Error) => T)(error)
              : fallbackValue;
          return of(value);
        }),
      );
    }
  }

  return new FallbackInterceptor();
}

// ============================================================================
// TIMEOUT INTERCEPTORS
// ============================================================================

/**
 * Creates a timeout interceptor that throws error after specified duration.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} [message] - Custom timeout message
 * @returns {NestInterceptor} Timeout interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createTimeoutInterceptor(5000, 'Request timeout'))
 * @Get('slow-operation')
 * async slowOperation() {
 *   // Throws timeout error if takes > 5 seconds
 * }
 * ```
 */
export function createTimeoutInterceptor(
  timeoutMs: number,
  message?: string,
): NestInterceptor {
  @Injectable()
  class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(timeoutMs),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            return throwError(
              () =>
                new HttpException(
                  message || `Request timeout after ${timeoutMs}ms`,
                  HttpStatus.REQUEST_TIMEOUT,
                ),
            );
          }
          return throwError(() => error);
        }),
      );
    }
  }

  return new TimeoutInterceptor();
}

/**
 * Creates an adaptive timeout interceptor based on request characteristics.
 *
 * @param {(context: ExecutionContext) => number} timeoutCalculator - Dynamic timeout calculator
 * @returns {NestInterceptor} Adaptive timeout interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createAdaptiveTimeoutInterceptor((ctx) => {
 *   const request = ctx.switchToHttp().getRequest();
 *   // Large file uploads get more time
 *   const contentLength = parseInt(request.headers['content-length'] || '0');
 *   return contentLength > 10000000 ? 60000 : 5000;
 * }))
 * ```
 */
export function createAdaptiveTimeoutInterceptor(
  timeoutCalculator: (context: ExecutionContext) => number,
): NestInterceptor {
  @Injectable()
  class AdaptiveTimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const timeoutMs = timeoutCalculator(context);
      return next.handle().pipe(
        timeout(timeoutMs),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            return throwError(
              () =>
                new HttpException(
                  `Request timeout after ${timeoutMs}ms`,
                  HttpStatus.REQUEST_TIMEOUT,
                ),
            );
          }
          return throwError(() => error);
        }),
      );
    }
  }

  return new AdaptiveTimeoutInterceptor();
}

// ============================================================================
// RETRY INTERCEPTORS
// ============================================================================

/**
 * Creates a retry interceptor with exponential backoff.
 *
 * @param {object} options - Retry configuration
 * @returns {NestInterceptor} Retry interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createRetryInterceptor({
 *   maxRetries: 3,
 *   initialDelay: 1000,
 *   maxDelay: 5000,
 *   shouldRetry: (error) => error.status >= 500
 * }))
 * @Get('external-api')
 * async callExternalAPI() {
 *   // Retries on 5xx errors with exponential backoff
 * }
 * ```
 */
export function createRetryInterceptor(options: {
  maxRetries: number;
  initialDelay: number;
  maxDelay?: number;
  shouldRetry?: (error: Error) => boolean;
}): NestInterceptor {
  @Injectable()
  class RetryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        retryWhen((errors) =>
          errors.pipe(
            scan((retryCount, error) => {
              if (
                retryCount >= options.maxRetries ||
                (options.shouldRetry && !options.shouldRetry(error))
              ) {
                throw error;
              }
              return retryCount + 1;
            }, 0),
            mergeMap((retryCount) => {
              const delayMs = Math.min(
                options.initialDelay * Math.pow(2, retryCount),
                options.maxDelay || Infinity,
              );
              console.log(`Retry attempt ${retryCount + 1} after ${delayMs}ms`);
              return timer(delayMs);
            }),
          ),
        ),
      );
    }
  }

  return new RetryInterceptor();
}

/**
 * Creates a conditional retry interceptor.
 *
 * @param {object} config - Conditional retry configuration
 * @returns {NestInterceptor} Conditional retry interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createConditionalRetryInterceptor({
 *   maxRetries: 3,
 *   retryDelay: 1000,
 *   shouldRetry: (error, retryCount) => {
 *     return error.status === 503 && retryCount < 3;
 *   }
 * }))
 * ```
 */
export function createConditionalRetryInterceptor(config: {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (error: Error, retryCount: number) => boolean;
}): NestInterceptor {
  @Injectable()
  class ConditionalRetryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      let retryCount = 0;

      return next.handle().pipe(
        retryWhen((errors) =>
          errors.pipe(
            mergeMap((error) => {
              if (
                retryCount >= config.maxRetries ||
                !config.shouldRetry(error, retryCount)
              ) {
                return throwError(() => error);
              }
              retryCount++;
              return timer(config.retryDelay);
            }),
          ),
        ),
      );
    }
  }

  return new ConditionalRetryInterceptor();
}

// ============================================================================
// METRICS COLLECTION INTERCEPTORS
// ============================================================================

/**
 * Creates a metrics collection interceptor for monitoring.
 *
 * @param {object} metricsService - Metrics service instance
 * @returns {NestInterceptor} Metrics collection interceptor
 *
 * @example
 * ```typescript
 * const metricsService = {
 *   recordRequestDuration: (route, duration) => { ... },
 *   incrementRequestCount: (route, status) => { ... }
 * };
 *
 * @UseInterceptors(createMetricsCollectionInterceptor(metricsService))
 * @Controller('api')
 * export class ApiController {}
 * ```
 */
export function createMetricsCollectionInterceptor(metricsService: {
  recordRequestDuration: (route: string, duration: number, status: number) => void;
  incrementRequestCount: (route: string, method: string, status: number) => void;
}): NestInterceptor {
  @Injectable()
  class MetricsCollectionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const startTime = Date.now();
      const route = request.route?.path || request.url;
      const method = request.method;

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - startTime;
          const response = context.switchToHttp().getResponse();
          const status = response.statusCode;

          metricsService.recordRequestDuration(route, duration, status);
          metricsService.incrementRequestCount(route, method, status);
        }),
        catchError((error) => {
          const duration = Date.now() - startTime;
          const status = error.status || 500;

          metricsService.recordRequestDuration(route, duration, status);
          metricsService.incrementRequestCount(route, method, status);

          return throwError(() => error);
        }),
      );
    }
  }

  return new MetricsCollectionInterceptor();
}

/**
 * Creates a request rate tracking interceptor.
 *
 * @param {object} options - Rate tracking configuration
 * @returns {NestInterceptor} Rate tracking interceptor
 *
 * @example
 * ```typescript
 * const rateTracker = new Map();
 *
 * @UseInterceptors(createRateTrackingInterceptor({
 *   storage: rateTracker,
 *   windowMs: 60000, // 1 minute
 *   onRateCalculated: (ip, rate) => {
 *     console.log(`IP ${ip}: ${rate} req/min`);
 *   }
 * }))
 * ```
 */
export function createRateTrackingInterceptor(options: {
  storage: Map<string, number[]>;
  windowMs: number;
  onRateCalculated?: (key: string, rate: number) => void;
}): NestInterceptor {
  @Injectable()
  class RateTrackingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const key = request.ip || 'unknown';
      const now = Date.now();

      // Get existing timestamps and filter old ones
      const timestamps = options.storage.get(key) || [];
      const recent = timestamps.filter((ts) => now - ts < options.windowMs);
      recent.push(now);
      options.storage.set(key, recent);

      if (options.onRateCalculated) {
        const rate = recent.length;
        options.onRateCalculated(key, rate);
      }

      return next.handle();
    }
  }

  return new RateTrackingInterceptor();
}

/**
 * Creates a response size tracking interceptor.
 *
 * @param {(size: number, route: string) => void} onSizeCalculated - Size callback
 * @returns {NestInterceptor} Response size tracking interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseSizeTrackingInterceptor((size, route) => {
 *   console.log(`Route ${route} returned ${size} bytes`);
 *   metrics.recordResponseSize(route, size);
 * }))
 * ```
 */
export function createResponseSizeTrackingInterceptor(
  onSizeCalculated: (size: number, route: string) => void,
): NestInterceptor {
  @Injectable()
  class ResponseSizeTrackingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const route = request.route?.path || request.url;

      return next.handle().pipe(
        tap((data) => {
          const size = JSON.stringify(data).length;
          onSizeCalculated(size, route);
        }),
      );
    }
  }

  return new ResponseSizeTrackingInterceptor();
}

// ============================================================================
// DATA SANITIZATION INTERCEPTORS
// ============================================================================

/**
 * Creates a PHI/PII sanitization interceptor for healthcare data.
 *
 * @param {string[]} sensitiveFields - Fields containing PHI/PII
 * @returns {NestInterceptor} Data sanitization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPHISanitizationInterceptor([
 *   'ssn',
 *   'medicalRecordNumber',
 *   'dateOfBirth',
 *   'phoneNumber',
 *   'address'
 * ]))
 * @Get('patients')
 * async getPatients() {
 *   // PHI fields automatically masked in logs
 * }
 * ```
 */
export function createPHISanitizationInterceptor(
  sensitiveFields: string[],
): NestInterceptor {
  @Injectable()
  class PHISanitizationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      // Sanitize request body for logging
      if (request.body) {
        request.sanitizedBody = this.sanitize(request.body, sensitiveFields);
      }

      return next.handle().pipe(
        tap((data) => {
          // Sanitize response for logging (not for client)
          if (data) {
            request.sanitizedResponse = this.sanitize(data, sensitiveFields);
          }
        }),
      );
    }

    private sanitize(obj: any, fields: string[]): any {
      if (typeof obj !== 'object' || obj === null) return obj;

      const sanitized = Array.isArray(obj) ? [] : {};
      Object.keys(obj).forEach((key) => {
        if (fields.includes(key)) {
          (sanitized as any)[key] = this.maskValue(obj[key]);
        } else if (typeof obj[key] === 'object') {
          (sanitized as any)[key] = this.sanitize(obj[key], fields);
        } else {
          (sanitized as any)[key] = obj[key];
        }
      });
      return sanitized;
    }

    private maskValue(value: any): string {
      if (typeof value === 'string') {
        return value.length > 4 ? `***${value.slice(-4)}` : '***';
      }
      return '***';
    }
  }

  return new PHISanitizationInterceptor();
}

/**
 * Creates an input validation sanitization interceptor.
 *
 * @param {object} options - Sanitization rules
 * @returns {NestInterceptor} Input sanitization interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createInputSanitizationInterceptor({
 *   trimStrings: true,
 *   removeNullValues: true,
 *   convertEmptyStringsToNull: true
 * }))
 * @Post()
 * async create(@Body() dto: CreateDto) {
 *   // Input automatically sanitized
 * }
 * ```
 */
export function createInputSanitizationInterceptor(options: {
  trimStrings?: boolean;
  removeNullValues?: boolean;
  convertEmptyStringsToNull?: boolean;
}): NestInterceptor {
  @Injectable()
  class InputSanitizationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      if (request.body) {
        request.body = this.sanitize(request.body, options);
      }

      return next.handle();
    }

    private sanitize(obj: any, opts: typeof options): any {
      if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string' && opts.trimStrings) {
          return obj.trim();
        }
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map((item) => this.sanitize(item, opts));
      }

      const sanitized: any = {};
      Object.keys(obj).forEach((key) => {
        let value = obj[key];

        if (typeof value === 'string') {
          if (opts.trimStrings) {
            value = value.trim();
          }
          if (opts.convertEmptyStringsToNull && value === '') {
            value = null;
          }
        }

        if (opts.removeNullValues && (value === null || value === undefined)) {
          return;
        }

        sanitized[key] = typeof value === 'object' ? this.sanitize(value, opts) : value;
      });

      return sanitized;
    }
  }

  return new InputSanitizationInterceptor();
}

// ============================================================================
// RESPONSE MAPPING INTERCEPTORS
// ============================================================================

/**
 * Creates a pagination response interceptor.
 *
 * @template T - The data item type
 * @returns {NestInterceptor} Pagination interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createPaginationInterceptor())
 * @Get('students')
 * async getStudents(@Query() query: PaginationDto) {
 *   return {
 *     data: students,
 *     total: 100,
 *     page: 1,
 *     limit: 10
 *   };
 *   // Transformed to: { data: [...], meta: { total, page, limit, pages } }
 * }
 * ```
 */
export function createPaginationInterceptor<T>(): NestInterceptor {
  @Injectable()
  class PaginationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((response) => {
          if (response && 'data' in response && 'total' in response) {
            const { data, total, page = 1, limit = 10, ...rest } = response;
            return {
              data,
              meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
              },
              ...rest,
            };
          }
          return response;
        }),
      );
    }
  }

  return new PaginationInterceptor();
}

/**
 * Creates a status code override interceptor.
 *
 * @param {(data: any, context: ExecutionContext) => number} statusCodeResolver - Status resolver
 * @returns {NestInterceptor} Status code interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createStatusCodeInterceptor((data, ctx) => {
 *   if (data.created) return HttpStatus.CREATED;
 *   if (data.empty) return HttpStatus.NO_CONTENT;
 *   return HttpStatus.OK;
 * }))
 * ```
 */
export function createStatusCodeInterceptor(
  statusCodeResolver: (data: any, context: ExecutionContext) => number,
): NestInterceptor {
  @Injectable()
  class StatusCodeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        tap((data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = statusCodeResolver(data, context);
          response.status(statusCode);
        }),
      );
    }
  }

  return new StatusCodeInterceptor();
}

/**
 * Creates a conditional response interceptor that modifies response based on criteria.
 *
 * @param {object} options - Conditional response configuration
 * @returns {NestInterceptor} Conditional response interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createConditionalResponseInterceptor({
 *   condition: (data, ctx) => {
 *     const request = ctx.switchToHttp().getRequest();
 *     return request.query.includeMetadata === 'true';
 *   },
 *   transform: (data) => ({
 *     ...data,
 *     metadata: { timestamp: new Date(), version: '1.0' }
 *   })
 * }))
 * ```
 */
export function createConditionalResponseInterceptor(options: {
  condition: (data: any, context: ExecutionContext) => boolean;
  transform: (data: any) => any;
}): NestInterceptor {
  @Injectable()
  class ConditionalResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (options.condition(data, context)) {
            return options.transform(data);
          }
          return data;
        }),
      );
    }
  }

  return new ConditionalResponseInterceptor();
}

/**
 * Creates a response compression hint interceptor.
 *
 * @param {object} options - Compression configuration
 * @returns {NestInterceptor} Compression hint interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createCompressionHintInterceptor({
 *   minSize: 1024, // Only compress if response > 1KB
 *   encoding: 'gzip'
 * }))
 * ```
 */
export function createCompressionHintInterceptor(options: {
  minSize: number;
  encoding?: string;
}): NestInterceptor {
  @Injectable()
  class CompressionHintInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        tap((data) => {
          const response = context.switchToHttp().getResponse();
          const size = JSON.stringify(data).length;

          if (size >= options.minSize) {
            response.setHeader('Content-Encoding', options.encoding || 'gzip');
          }
        }),
      );
    }
  }

  return new CompressionHintInterceptor();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Request/Response
  createLoggingInterceptor,
  createHeaderInterceptor,
  createRequestContextInterceptor,
  createPerformanceInterceptor,

  // Transform
  createResponseWrapperInterceptor,
  createDataMapperInterceptor,
  createPropertyFilterInterceptor,
  createSerializationInterceptor,

  // Caching
  createCacheInterceptor,
  createConditionalCacheInterceptor,
  createCacheInvalidationInterceptor,

  // Logging
  createStructuredLoggingInterceptor,
  createAuditLoggingInterceptor,
  createPayloadLoggingInterceptor,

  // Error handling
  createErrorTransformInterceptor,
  createErrorSanitizationInterceptor,
  createFallbackInterceptor,

  // Timeout
  createTimeoutInterceptor,
  createAdaptiveTimeoutInterceptor,

  // Retry
  createRetryInterceptor,
  createConditionalRetryInterceptor,

  // Metrics
  createMetricsCollectionInterceptor,
  createRateTrackingInterceptor,
  createResponseSizeTrackingInterceptor,

  // Sanitization
  createPHISanitizationInterceptor,
  createInputSanitizationInterceptor,

  // Response mapping
  createPaginationInterceptor,
  createStatusCodeInterceptor,
  createConditionalResponseInterceptor,
  createCompressionHintInterceptor,
};
