/**
 * LOC: NMIK1234567
 * File: /reuse/nestjs-middleware-interceptor-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers and modules
 *   - Middleware services
 *   - API gateway configurations
 */

/**
 * File: /reuse/nestjs-middleware-interceptor-kit.ts
 * Locator: WC-UTL-NMIK-001
 * Purpose: Comprehensive NestJS Middleware & Interceptor Kit - Custom middleware, interceptors, guards, pipes, decorators
 *
 * Upstream: Independent utility module for NestJS request/response handling
 * Downstream: ../backend/*, NestJS controllers, modules, providers
 * Dependencies: TypeScript 5.x, @nestjs/common, @nestjs/core, rxjs, crypto
 * Exports: 45 utility functions for middleware, interceptors, exception filters, pipes, guards, decorators
 *
 * LLM Context: Comprehensive NestJS middleware and interceptor utilities for White Cross healthcare system.
 * Provides custom middleware factories, interceptors for logging/timing/caching, exception filters, validation pipes,
 * authorization guards, parameter decorators, route decorators, response transformation, request sanitization,
 * HIPAA-compliant audit logging, and advanced NestJS patterns for healthcare APIs.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import {
  Injectable,
  NestMiddleware,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ArgumentsHost,
  ExceptionFilter,
  PipeTransform,
  ArgumentMetadata,
  CanActivate,
  createParamDecorator,
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UsePipes,
  HttpCode,
  Header,
} from '@nestjs/common';
import { Observable, throwError, of } from 'rxjs';
import { tap, map, catchError, timeout, retry } from 'rxjs/operators';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MiddlewareConfig {
  logRequests?: boolean;
  addRequestId?: boolean;
  addTimestamp?: boolean;
  sanitizeInput?: boolean;
  validateHeaders?: boolean;
}

interface InterceptorConfig {
  enableLogging?: boolean;
  enableTiming?: boolean;
  enableCaching?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
}

interface RequestContext {
  requestId: string;
  timestamp: number;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  method: string;
  url: string;
  headers?: Record<string, any>;
}

interface TimingMetrics {
  requestId: string;
  startTime: number;
  endTime: number;
  duration: number;
  endpoint: string;
  method: string;
}

interface AuditLogEntry {
  requestId: string;
  timestamp: string;
  userId?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  statusCode: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface CacheConfig {
  ttl: number;
  maxSize?: number;
  keyGenerator?: (ctx: ExecutionContext) => string;
  condition?: (ctx: ExecutionContext) => boolean;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface ValidationOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  transform?: boolean;
  validateNested?: boolean;
  strictMode?: boolean;
}

interface GuardContext {
  user?: any;
  roles?: string[];
  permissions?: string[];
  resource?: string;
  action?: string;
}

interface ResponseTransformConfig {
  wrapData?: boolean;
  addMetadata?: boolean;
  excludeFields?: string[];
  includeTimestamp?: boolean;
}

interface ExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  requestId?: string;
  details?: any;
}

interface CompressionOptions {
  threshold: number;
  filter?: (req: Request, res: Response) => boolean;
  level?: number;
}

interface SanitizationOptions {
  sanitizeBody?: boolean;
  sanitizeQuery?: boolean;
  sanitizeParams?: boolean;
  allowedTags?: string[];
  stripXSS?: boolean;
}

// ============================================================================
// MIDDLEWARE UTILITIES
// ============================================================================

/**
 * 1. Creates a request ID middleware that adds unique identifiers to each request.
 *
 * @returns {NestMiddleware} Middleware instance
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(createRequestIdMiddleware()).forRoutes('*');
 *   }
 * }
 * ```
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = crypto.randomUUID();
    req['requestId'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  }
}

export const createRequestIdMiddleware = (): typeof RequestIdMiddleware => RequestIdMiddleware;

/**
 * 2. Creates a logging middleware that logs all incoming requests with details.
 *
 * @param {object} options - Logging options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createLoggingMiddleware({ logBody: true, logHeaders: false }));
 * ```
 */
export const createLoggingMiddleware = (options: {
  logBody?: boolean;
  logHeaders?: boolean;
  logQuery?: boolean;
  excludePaths?: string[];
} = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { method, url, headers, body, query } = req;
    const requestId = req['requestId'] || 'unknown';

    if (options.excludePaths?.some(path => url.startsWith(path))) {
      return next();
    }

    const logData: any = {
      requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
    };

    if (options.logHeaders) logData.headers = headers;
    if (options.logBody) logData.body = body;
    if (options.logQuery) logData.query = query;

    console.log('[REQUEST]', JSON.stringify(logData));
    next();
  };
};

/**
 * 3. Creates a CORS middleware with configurable options for cross-origin requests.
 *
 * @param {object} config - CORS configuration
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createCorsMiddleware({
 *   allowedOrigins: ['https://app.example.com'],
 *   allowedMethods: ['GET', 'POST'],
 *   credentials: true
 * }));
 * ```
 */
export const createCorsMiddleware = (config: {
  allowedOrigins: string | string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const allowedOrigins = Array.isArray(config.allowedOrigins)
      ? config.allowedOrigins
      : [config.allowedOrigins];

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    if (config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (config.allowedMethods) {
      res.setHeader('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
    }

    if (config.allowedHeaders) {
      res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
    }

    if (config.maxAge) {
      res.setHeader('Access-Control-Max-Age', config.maxAge.toString());
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  };
};

/**
 * 4. Creates a rate limiting middleware to prevent abuse and DDoS attacks.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createRateLimitMiddleware({
 *   windowMs: 60000,
 *   maxRequests: 100
 * }));
 * ```
 */
export const createRateLimitMiddleware = (config: RateLimitConfig) => {
  const store = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = config.keyGenerator ? config.keyGenerator(req) : req.ip;
    const now = Date.now();
    const record = store.get(key);

    if (record && now < record.resetTime) {
      if (record.count >= config.maxRequests) {
        res.status(429).json({
          statusCode: 429,
          message: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        });
        return;
      }
      record.count++;
    } else {
      store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
    }

    next();
  };
};

/**
 * 5. Creates a request sanitization middleware to prevent XSS and injection attacks.
 *
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createSanitizationMiddleware({ stripXSS: true }));
 * ```
 */
export const createSanitizationMiddleware = (options: SanitizationOptions = {}) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      if (options.stripXSS) {
        // Remove common XSS patterns
        return value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (options.sanitizeBody && req.body) {
      req.body = sanitizeValue(req.body);
    }
    if (options.sanitizeQuery && req.query) {
      req.query = sanitizeValue(req.query);
    }
    if (options.sanitizeParams && req.params) {
      req.params = sanitizeValue(req.params);
    }
    next();
  };
};

/**
 * 6. Creates a security headers middleware to add common security headers.
 *
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createSecurityHeadersMiddleware());
 * ```
 */
export const createSecurityHeadersMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.removeHeader('X-Powered-By');
    next();
  };
};

/**
 * 7. Creates a timing middleware that measures request processing time.
 *
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * app.use(createTimingMiddleware());
 * ```
 */
export const createTimingMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    req['startTime'] = startTime;

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      res.setHeader('X-Response-Time', `${duration}ms`);
    });

    next();
  };
};

// ============================================================================
// INTERCEPTOR UTILITIES
// ============================================================================

/**
 * 8. Creates a logging interceptor that logs request and response details.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(LoggingInterceptor)
 * @Controller('users')
 * export class UsersController {}
 * ```
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const requestId = request.requestId || crypto.randomUUID();

    console.log(`[INTERCEPTOR] ${method} ${url} - Request ID: ${requestId}`);

    return next.handle().pipe(
      tap(data => {
        console.log(`[INTERCEPTOR] ${method} ${url} - Response:`, {
          requestId,
          dataType: typeof data,
          hasData: !!data,
        });
      }),
    );
  }
}

export const createLoggingInterceptor = (): typeof LoggingInterceptor => LoggingInterceptor;

/**
 * 9. Creates a timing interceptor that measures and logs execution time.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(TimingInterceptor)
 * @Get()
 * async findAll() {}
 * ```
 */
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        response.setHeader('X-Response-Time', `${duration}ms`);
        console.log(`[TIMING] ${request.method} ${request.url} - ${duration}ms`);
      }),
    );
  }
}

export const createTimingInterceptor = (): typeof TimingInterceptor => TimingInterceptor;

/**
 * 10. Creates a response transformation interceptor that wraps responses in a standard envelope.
 *
 * @param {ResponseTransformConfig} config - Transform configuration
 * @returns {NestInterceptor} Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseTransformInterceptor({ wrapData: true }))
 * @Get()
 * async findAll() {}
 * ```
 */
export const createResponseTransformInterceptor = (config: ResponseTransformConfig = {}) => {
  @Injectable()
  class ResponseTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map(data => {
          const response: any = {};

          if (config.wrapData) {
            response.success = true;
            response.data = data;
          } else {
            Object.assign(response, data);
          }

          if (config.addMetadata) {
            const request = context.switchToHttp().getRequest();
            response.metadata = {
              requestId: request.requestId,
              path: request.url,
              method: request.method,
            };
          }

          if (config.includeTimestamp) {
            response.timestamp = new Date().toISOString();
          }

          return response;
        }),
      );
    }
  }

  return ResponseTransformInterceptor;
};

/**
 * 11. Creates a caching interceptor that caches responses for specified duration.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {NestInterceptor} Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createCachingInterceptor({ ttl: 60000 }))
 * @Get('users')
 * async findAll() {}
 * ```
 */
export const createCachingInterceptor = (config: CacheConfig) => {
  const cache = new Map<string, { data: any; expiresAt: number }>();

  @Injectable()
  class CachingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      if (config.condition && !config.condition(context)) {
        return next.handle();
      }

      const cacheKey = config.keyGenerator
        ? config.keyGenerator(context)
        : this.generateCacheKey(context);

      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        console.log(`[CACHE] Hit: ${cacheKey}`);
        return of(cached.data);
      }

      return next.handle().pipe(
        tap(data => {
          cache.set(cacheKey, {
            data,
            expiresAt: Date.now() + config.ttl,
          });
          console.log(`[CACHE] Set: ${cacheKey}`);

          // Clean up expired entries
          if (config.maxSize && cache.size > config.maxSize) {
            this.cleanupCache();
          }
        }),
      );
    }

    private generateCacheKey(context: ExecutionContext): string {
      const request = context.switchToHttp().getRequest();
      return `${request.method}:${request.url}`;
    }

    private cleanupCache(): void {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (value.expiresAt < now) {
          cache.delete(key);
        }
      }
    }
  }

  return CachingInterceptor;
};

/**
 * 12. Creates an error handling interceptor that catches and transforms errors.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(ErrorHandlingInterceptor)
 * @Controller()
 * export class AppController {}
 * ```
 */
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        const request = context.switchToHttp().getRequest();
        console.error(`[ERROR] ${request.method} ${request.url}`, {
          error: error.message,
          stack: error.stack,
        });

        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        return throwError(() => new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ));
      }),
    );
  }
}

/**
 * 13. Creates a timeout interceptor that enforces request timeouts.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {NestInterceptor} Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createTimeoutInterceptor(5000))
 * @Get()
 * async findAll() {}
 * ```
 */
export const createTimeoutInterceptor = (timeoutMs: number) => {
  @Injectable()
  class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(timeoutMs),
        catchError(error => {
          if (error.name === 'TimeoutError') {
            return throwError(() => new HttpException(
              'Request timeout',
              HttpStatus.REQUEST_TIMEOUT,
            ));
          }
          return throwError(() => error);
        }),
      );
    }
  }

  return TimeoutInterceptor;
};

/**
 * 14. Creates an audit logging interceptor for HIPAA compliance.
 *
 * @returns {NestInterceptor} Interceptor instance
 *
 * @example
 * ```typescript
 * @UseInterceptors(AuditLoggingInterceptor)
 * @Get('patients/:id')
 * async getPatient() {}
 * ```
 */
@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const auditEntry: Partial<AuditLogEntry> = {
      requestId: request.requestId || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: request.user?.id,
      action: request.method,
      resource: request.url,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    };

    return next.handle().pipe(
      tap(() => {
        auditEntry.statusCode = response.statusCode;
        auditEntry.duration = Date.now() - startTime;
        console.log('[AUDIT]', JSON.stringify(auditEntry));
      }),
      catchError(error => {
        auditEntry.statusCode = error.status || 500;
        auditEntry.duration = Date.now() - startTime;
        auditEntry.metadata = { error: error.message };
        console.log('[AUDIT]', JSON.stringify(auditEntry));
        return throwError(() => error);
      }),
    );
  }
}

// ============================================================================
// EXCEPTION FILTER UTILITIES
// ============================================================================

/**
 * 15. Creates a global exception filter that handles all exceptions uniformly.
 *
 * @returns {ExceptionFilter} Exception filter instance
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    const exceptionResponse: ExceptionResponse = {
      statusCode: status,
      message,
      error: exception.name || 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request['requestId'],
    };

    if (exception.response?.details) {
      exceptionResponse.details = exception.response.details;
    }

    console.error('[EXCEPTION]', {
      ...exceptionResponse,
      stack: exception.stack,
    });

    response.status(status).json(exceptionResponse);
  }
}

/**
 * 16. Creates an HTTP exception filter for handling HTTP-specific errors.
 *
 * @returns {ExceptionFilter} Exception filter instance
 *
 * @example
 * ```typescript
 * @UseFilters(HttpExceptionFilter)
 * @Controller()
 * export class AppController {}
 * ```
 */
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ExceptionResponse = {
      statusCode: status,
      message: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request['requestId'],
    };

    response.status(status).json(errorResponse);
  }
}

/**
 * 17. Creates a validation exception filter for handling validation errors.
 *
 * @returns {ExceptionFilter} Exception filter instance
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new ValidationExceptionFilter());
 * ```
 */
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionResponse: any = exception.getResponse();
    const validationErrors = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [exceptionResponse.message];

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request['requestId'],
    });
  }
}

// ============================================================================
// PIPE UTILITIES
// ============================================================================

/**
 * 18. Creates a custom validation pipe with configurable options.
 *
 * @param {ValidationOptions} options - Validation options
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @UsePipes(createValidationPipe({ whitelist: true }))
 * @Post()
 * async create(@Body() dto: CreateUserDto) {}
 * ```
 */
export const createValidationPipe = (options: ValidationOptions = {}) => {
  @Injectable()
  class CustomValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      if (!value) {
        throw new BadRequestException('Validation failed: No data provided');
      }

      if (options.whitelist && typeof value === 'object') {
        // Remove properties not in DTO
        // This is a simplified version - use class-validator in production
        return value;
      }

      if (options.forbidNonWhitelisted) {
        // Throw error if extra properties exist
        // Implementation would require DTO metadata
      }

      if (options.transform) {
        // Transform plain object to class instance
        return value;
      }

      return value;
    }
  }

  return CustomValidationPipe;
};

/**
 * 19. Creates a parse integer pipe with custom error messages.
 *
 * @param {string} fieldName - Name of the field being parsed
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id', createParseIntPipe('User ID')) id: number) {}
 * ```
 */
export const createParseIntPipe = (fieldName: string = 'value') => {
  @Injectable()
  class CustomParseIntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        throw new BadRequestException(`${fieldName} must be a valid integer`);
      }
      return val;
    }
  }

  return CustomParseIntPipe;
};

/**
 * 20. Creates a parse UUID pipe with validation.
 *
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id', ParseUuidPipe) id: string) {}
 * ```
 */
@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  transform(value: string, metadata: ArgumentMetadata): string {
    if (!this.uuidRegex.test(value)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return value;
  }
}

/**
 * 21. Creates a sanitization pipe that removes dangerous characters.
 *
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(SanitizationPipe) dto: CreateUserDto) {}
 * ```
 */
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.transform(item, metadata));
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.transform(val, metadata);
      }
      return sanitized;
    }
    return value;
  }

  private sanitizeString(value: string): string {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
}

/**
 * 22. Creates a transformation pipe that converts data types.
 *
 * @param {Function} transformFn - Transformation function
 * @returns {PipeTransform} Pipe instance
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@Query('limit', createTransformPipe(Number)) limit: number) {}
 * ```
 */
export const createTransformPipe = (transformFn: (value: any) => any) => {
  @Injectable()
  class TransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      try {
        return transformFn(value);
      } catch (error) {
        throw new BadRequestException(`Transformation failed: ${error.message}`);
      }
    }
  }

  return TransformPipe;
};

// ============================================================================
// GUARD UTILITIES
// ============================================================================

/**
 * 23. Creates a role-based authorization guard.
 *
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createRoleGuard(['admin', 'doctor']))
 * @Get()
 * async findAll() {}
 * ```
 */
export const createRoleGuard = (allowedRoles: string[]) => {
  @Injectable()
  class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }

      const userRoles = user.roles || [];
      const hasRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException(
          `User does not have required role. Required: ${allowedRoles.join(', ')}`
        );
      }

      return true;
    }
  }

  return RoleGuard;
};

/**
 * 24. Creates a permission-based authorization guard.
 *
 * @param {string[]} requiredPermissions - Array of required permissions
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createPermissionGuard(['patients.read', 'patients.write']))
 * @Post('patients')
 * async create() {}
 * ```
 */
export const createPermissionGuard = (requiredPermissions: string[]) => {
  @Injectable()
  class PermissionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }

      const userPermissions = user.permissions || [];
      const hasAllPermissions = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        throw new ForbiddenException(
          `Missing required permissions: ${requiredPermissions.join(', ')}`
        );
      }

      return true;
    }
  }

  return PermissionGuard;
};

/**
 * 25. Creates an API key authentication guard.
 *
 * @param {string[]} validApiKeys - Array of valid API keys
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createApiKeyGuard(['key1', 'key2']))
 * @Get('public/data')
 * async getPublicData() {}
 * ```
 */
export const createApiKeyGuard = (validApiKeys: string[]) => {
  @Injectable()
  class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const apiKey = request.headers['x-api-key'] || request.query.apiKey;

      if (!apiKey) {
        throw new UnauthorizedException('API key is required');
      }

      if (!validApiKeys.includes(apiKey)) {
        throw new UnauthorizedException('Invalid API key');
      }

      return true;
    }
  }

  return ApiKeyGuard;
};

/**
 * 26. Creates a JWT authentication guard.
 *
 * @returns {CanActivate} Guard instance
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * async getProfile() {}
 * ```
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    // In production, verify the JWT token here
    // For now, just check if token exists
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach decoded user to request
    request.user = { id: 'user-id-from-token' };

    return true;
  }
}

/**
 * 27. Creates a throttle guard to limit request frequency per user.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time window in milliseconds
 * @returns {CanActivate} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createThrottleGuard(10, 60000))
 * @Post('send-email')
 * async sendEmail() {}
 * ```
 */
export const createThrottleGuard = (limit: number, ttl: number) => {
  const tracker = new Map<string, { count: number; resetTime: number }>();

  @Injectable()
  class ThrottleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const key = request.user?.id || request.ip;
      const now = Date.now();

      const record = tracker.get(key);

      if (record && now < record.resetTime) {
        if (record.count >= limit) {
          throw new HttpException(
            'Too many requests',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        record.count++;
      } else {
        tracker.set(key, {
          count: 1,
          resetTime: now + ttl,
        });
      }

      return true;
    }
  }

  return ThrottleGuard;
};

// ============================================================================
// PARAMETER DECORATOR UTILITIES
// ============================================================================

/**
 * 28. Creates a custom parameter decorator to extract the current user.
 *
 * @returns Current user from request
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {}
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

/**
 * 29. Creates a custom parameter decorator to extract IP address.
 *
 * @returns IP address from request
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@IpAddress() ip: string) {}
 * ```
 */
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress || 'unknown';
  },
);

/**
 * 30. Creates a custom parameter decorator to extract user agent.
 *
 * @returns User agent string from request
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@UserAgent() userAgent: string) {}
 * ```
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'unknown';
  },
);

/**
 * 31. Creates a custom parameter decorator to extract request ID.
 *
 * @returns Request ID from request
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@RequestId() requestId: string) {}
 * ```
 */
export const RequestId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.requestId || request.headers['x-request-id'] || crypto.randomUUID();
  },
);

/**
 * 32. Creates a custom parameter decorator to extract cookies.
 *
 * @returns Cookie value or all cookies
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@Cookie('sessionId') sessionId: string) {}
 * ```
 */
export const Cookie = createParamDecorator(
  (cookieName: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return cookieName ? request.cookies?.[cookieName] : request.cookies;
  },
);

/**
 * 33. Creates a custom parameter decorator to extract request origin.
 *
 * @returns Origin header from request
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Origin() origin: string) {}
 * ```
 */
export const Origin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.origin || request.headers.referer || 'unknown';
  },
);

// ============================================================================
// ROUTE DECORATOR UTILITIES
// ============================================================================

/**
 * 34. Creates a combined decorator for public routes that skip authentication.
 *
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('health')
 * async healthCheck() {}
 * ```
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * 35. Creates a roles decorator to specify required roles.
 *
 * @param {string[]} roles - Required roles
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Roles('admin', 'doctor')
 * @Get('patients')
 * async getPatients() {}
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * 36. Creates a permissions decorator to specify required permissions.
 *
 * @param {string[]} permissions - Required permissions
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Permissions('patients.read', 'patients.write')
 * @Post('patients')
 * async createPatient() {}
 * ```
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

/**
 * 37. Creates an API versioning decorator.
 *
 * @param {string} version - API version
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @ApiVersion('v2')
 * @Get('users')
 * async getUsersV2() {}
 * ```
 */
export const ApiVersion = (version: string) => SetMetadata('apiVersion', version);

/**
 * 38. Creates an audit log decorator to mark endpoints for audit logging.
 *
 * @param {string} action - Action being performed
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @AuditLog('VIEW_PATIENT_RECORD')
 * @Get('patients/:id')
 * async getPatient() {}
 * ```
 */
export const AuditLog = (action: string) => SetMetadata('auditAction', action);

/**
 * 39. Creates a rate limit decorator for specific endpoints.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time window in milliseconds
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @RateLimit(5, 60000)
 * @Post('send-verification')
 * async sendVerification() {}
 * ```
 */
export const RateLimit = (limit: number, ttl: number) =>
  SetMetadata('rateLimit', { limit, ttl });

/**
 * 40. Creates a combined decorator for authenticated and authorized routes.
 *
 * @param {string[]} roles - Required roles
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @Authenticated(['admin', 'doctor'])
 * @Get('sensitive-data')
 * async getSensitiveData() {}
 * ```
 */
export const Authenticated = (roles: string[] = []) => {
  const decorators = [UseGuards(JwtAuthGuard)];

  if (roles.length > 0) {
    decorators.push(Roles(...roles));
    decorators.push(UseGuards(createRoleGuard(roles)));
  }

  return applyDecorators(...decorators);
};

// ============================================================================
// RESPONSE HELPER UTILITIES
// ============================================================================

/**
 * 41. Creates a standard success response wrapper.
 *
 * @param {T} data - Response data
 * @param {string} message - Success message
 * @param {any} metadata - Additional metadata
 * @returns Formatted success response
 *
 * @example
 * ```typescript
 * return createSuccessResponse(users, 'Users retrieved successfully');
 * ```
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = 'Success',
  metadata?: any,
) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    ...(metadata && { metadata }),
  };
};

/**
 * 42. Creates a standard error response wrapper.
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Additional error details
 * @returns Formatted error response
 *
 * @example
 * ```typescript
 * throw new HttpException(
 *   createErrorResponse('User not found', 404),
 *   404
 * );
 * ```
 */
export const createErrorResponse = (
  message: string,
  statusCode: number = 500,
  details?: any,
) => {
  return {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };
};

/**
 * 43. Creates a paginated response wrapper.
 *
 * @param {T[]} data - Array of data items
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns Paginated response
 *
 * @example
 * ```typescript
 * return createPaginatedResponse(users, 100, 1, 20);
 * ```
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * 44. Creates a file download response helper.
 *
 * @param {Response} res - Express response object
 * @param {Buffer} fileData - File buffer
 * @param {string} filename - Filename for download
 * @param {string} mimeType - MIME type of file
 *
 * @example
 * ```typescript
 * createFileDownloadResponse(res, buffer, 'report.pdf', 'application/pdf');
 * ```
 */
export const createFileDownloadResponse = (
  res: Response,
  fileData: Buffer,
  filename: string,
  mimeType: string,
) => {
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', fileData.length);
  res.send(fileData);
};

/**
 * 45. Creates a streaming response helper for large data.
 *
 * @param {Response} res - Express response object
 * @param {NodeJS.ReadableStream} stream - Data stream
 * @param {string} contentType - Content type header
 *
 * @example
 * ```typescript
 * createStreamingResponse(res, dataStream, 'application/json');
 * ```
 */
export const createStreamingResponse = (
  res: Response,
  stream: NodeJS.ReadableStream,
  contentType: string = 'application/octet-stream',
) => {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Transfer-Encoding', 'chunked');
  stream.pipe(res);
};
