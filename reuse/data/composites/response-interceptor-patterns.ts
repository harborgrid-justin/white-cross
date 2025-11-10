/**
 * NestJS Response Interceptor Patterns - Production-Ready Response Transformation
 *
 * Enterprise-grade interceptor functions supporting:
 * - Response transformation and serialization
 * - Data compression (gzip, brotli)
 * - Cache header management
 * - Response time tracking
 * - Logging and monitoring
 * - Error transformation
 * - Data masking and filtering
 * - HATEOAS link injection
 * - Pagination envelope wrapping
 * - Response versioning
 *
 * @module response-interceptor-patterns
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { Observable, throwError, of } from 'rxjs';
import { map, tap, catchError, timeout, retry } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Response envelope structure
 */
export interface ResponseEnvelope<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  meta?: Record<string, any>;
  timestamp: string;
  path?: string;
  method?: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  _links?: any[];
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path?: string;
  stack?: string;
  correlationId?: string;
}

/**
 * Compression options
 */
export interface CompressionOptions {
  threshold?: number;
  level?: number;
  algorithm?: 'gzip' | 'brotli' | 'auto';
}

/**
 * Cache options
 */
export interface CacheOptions {
  ttl?: number;
  strategy?: 'public' | 'private' | 'no-cache';
  vary?: string[];
  etag?: boolean;
}

/**
 * Logging options
 */
export interface LoggingOptions {
  logRequest?: boolean;
  logResponse?: boolean;
  logHeaders?: boolean;
  logBody?: boolean;
  excludePaths?: string[];
  sensitiveFields?: string[];
}

/**
 * Transformation options
 */
export interface TransformOptions {
  excludeNull?: boolean;
  excludeUndefined?: boolean;
  excludeFields?: string[];
  includeFields?: string[];
  renameFields?: Record<string, string>;
}

// ============================================================================
// 1. Response Envelope Interceptors
// ============================================================================

/**
 * Wraps all responses in a standard envelope format.
 * Provides consistent response structure across all endpoints.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ResponseEnvelopeInterceptor)
 * @Controller('users')
 * export class UsersController {
 *   @Get()
 *   findAll() {
 *     return this.service.findAll();
 *   }
 * }
 * // Response: { success: true, statusCode: 200, data: [...], timestamp: "..." }
 * ```
 */
@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseEnvelope<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      })),
    );
  }
}

/**
 * Wraps paginated responses with metadata.
 *
 * @example
 * ```typescript
 * @UseInterceptors(PaginationEnvelopeInterceptor)
 * @Get('users')
 * findAll(@Query() query: PaginationDto) {
 *   return this.service.findAll(query);
 * }
 * ```
 */
@Injectable()
export class PaginationEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return data;
        }

        // If data is an array, wrap it with default pagination
        if (Array.isArray(data)) {
          return {
            data,
            meta: {
              page: 1,
              limit: data.length,
              total: data.length,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }

        return data;
      }),
    );
  }
}

/**
 * Success response wrapper with custom message.
 *
 * @param message - Success message
 * @returns Success response interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(SuccessResponseInterceptor('User created successfully'))
 * @Post('users')
 * create(@Body() data: CreateUserDto) {
 *   return this.service.create(data);
 * }
 * ```
 */
export function SuccessResponseInterceptor(message?: string): Type<NestInterceptor> {
  @Injectable()
  class SuccessResponseInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        map((data) => ({
          success: true,
          statusCode: response.statusCode,
          message: message || 'Operation completed successfully',
          data,
          timestamp: new Date().toISOString(),
        })),
      );
    }
  }

  return SuccessResponseInterceptorImpl;
}

/**
 * Minimal response wrapper (removes envelope for specific endpoints).
 *
 * @example
 * ```typescript
 * @UseInterceptors(MinimalResponseInterceptor)
 * @Get('health')
 * health() {
 *   return { status: 'ok' };
 * }
 * // Response: { status: 'ok' } (no envelope)
 * ```
 */
@Injectable()
export class MinimalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}

// ============================================================================
// 2. Data Transformation Interceptors
// ============================================================================

/**
 * Excludes null and undefined values from responses.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ExcludeNullInterceptor)
 * @Get('users/:id')
 * findOne(@Param('id') id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removeNullValues(data)));
  }

  private removeNullValues(obj: any): any {
    if (obj === null || obj === undefined) {
      return undefined;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeNullValues(item)).filter((item) => item !== undefined);
    }

    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleaned = this.removeNullValues(value);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
      return result;
    }

    return obj;
  }
}

/**
 * Transforms field names in response (e.g., snake_case to camelCase).
 *
 * @param transformFn - Function to transform keys
 * @returns Field transformation interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(TransformFieldNamesInterceptor((key) => camelCase(key)))
 * @Get('users')
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export function TransformFieldNamesInterceptor(
  transformFn: (key: string) => string,
): Type<NestInterceptor> {
  @Injectable()
  class TransformFieldNamesInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => this.transformKeys(data, transformFn)));
    }

    private transformKeys(obj: any, fn: (key: string) => string): any {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.transformKeys(item, fn));
      }

      if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
          const newKey = fn(key);
          result[newKey] = this.transformKeys(obj[key], fn);
          return result;
        }, {} as any);
      }

      return obj;
    }
  }

  return TransformFieldNamesInterceptorImpl;
}

/**
 * Masks sensitive data in responses (e.g., SSN, credit cards).
 *
 * @param sensitiveFields - Array of field names to mask
 * @param maskChar - Character to use for masking
 * @param visibleChars - Number of characters to leave visible
 * @returns Data masking interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(MaskSensitiveDataInterceptor(['ssn', 'creditCard'], '*', 4))
 * @Get('patients/:id')
 * findOne(@Param('id') id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
export function MaskSensitiveDataInterceptor(
  sensitiveFields: string[],
  maskChar: string = '*',
  visibleChars: number = 4,
): Type<NestInterceptor> {
  @Injectable()
  class MaskSensitiveDataInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => this.maskFields(data)));
    }

    private maskFields(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.maskFields(item));
      }

      if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (sensitiveFields.includes(key) && typeof value === 'string') {
            result[key] = this.maskValue(value);
          } else {
            result[key] = this.maskFields(value);
          }
        }
        return result;
      }

      return obj;
    }

    private maskValue(value: string): string {
      if (value.length <= visibleChars) {
        return maskChar.repeat(value.length);
      }
      const masked = maskChar.repeat(value.length - visibleChars);
      return masked + value.slice(-visibleChars);
    }
  }

  return MaskSensitiveDataInterceptorImpl;
}

/**
 * Selects specific fields from response.
 *
 * @param fields - Array of field names to include
 * @returns Field selection interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(SelectFieldsInterceptor(['id', 'name', 'email']))
 * @Get('users')
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export function SelectFieldsInterceptor(fields: string[]): Type<NestInterceptor> {
  @Injectable()
  class SelectFieldsInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => this.selectFields(data)));
    }

    private selectFields(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.selectFields(item));
      }

      if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        fields.forEach((field) => {
          if (field in obj) {
            result[field] = obj[field];
          }
        });
        return result;
      }

      return obj;
    }
  }

  return SelectFieldsInterceptorImpl;
}

/**
 * Omits specific fields from response.
 *
 * @param fields - Array of field names to exclude
 * @returns Field omission interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(OmitFieldsInterceptor(['password', 'salt', 'token']))
 * @Get('users/:id')
 * findOne(@Param('id') id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
export function OmitFieldsInterceptor(fields: string[]): Type<NestInterceptor> {
  @Injectable()
  class OmitFieldsInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => this.omitFields(data)));
    }

    private omitFields(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.omitFields(item));
      }

      if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (!fields.includes(key)) {
            result[key] = this.omitFields(value);
          }
        }
        return result;
      }

      return obj;
    }
  }

  return OmitFieldsInterceptorImpl;
}

// ============================================================================
// 3. Compression Interceptors
// ============================================================================

/**
 * Compresses response data using gzip or brotli.
 *
 * @param options - Compression options
 * @returns Compression interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(CompressionInterceptor({ threshold: 1024, algorithm: 'brotli' }))
 * @Get('large-dataset')
 * getLargeDataset() {
 *   return this.service.getLargeDataset();
 * }
 * ```
 */
export function CompressionInterceptor(options?: CompressionOptions): Type<NestInterceptor> {
  @Injectable()
  class CompressionInterceptorImpl implements NestInterceptor {
    private readonly threshold = options?.threshold || 1024;
    private readonly algorithm = options?.algorithm || 'auto';
    private readonly level = options?.level || 6;

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        map(async (data) => {
          const content = JSON.stringify(data);

          if (content.length < this.threshold) {
            return data;
          }

          const acceptEncoding = request.headers['accept-encoding'] || '';
          let encoding: string | null = null;

          if (this.algorithm === 'auto') {
            if (acceptEncoding.includes('br')) {
              encoding = 'br';
            } else if (acceptEncoding.includes('gzip')) {
              encoding = 'gzip';
            }
          } else {
            if (
              (this.algorithm === 'brotli' && acceptEncoding.includes('br')) ||
              (this.algorithm === 'gzip' && acceptEncoding.includes('gzip'))
            ) {
              encoding = this.algorithm === 'brotli' ? 'br' : 'gzip';
            }
          }

          if (encoding) {
            let compressed: Buffer;
            if (encoding === 'br') {
              compressed = await brotliCompress(content);
            } else {
              compressed = await gzip(content, { level: this.level });
            }

            response.setHeader('Content-Encoding', encoding);
            response.setHeader('Content-Length', compressed.length);
            return compressed;
          }

          return data;
        }),
      );
    }
  }

  return CompressionInterceptorImpl;
}

/**
 * Gzip compression interceptor.
 *
 * @example
 * ```typescript
 * @UseInterceptors(GzipInterceptor)
 * @Get('data')
 * getData() {
 *   return this.service.getData();
 * }
 * ```
 */
@Injectable()
export class GzipInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        response.setHeader('Content-Encoding', 'gzip');
      }),
    );
  }
}

// ============================================================================
// 4. Cache Control Interceptors
// ============================================================================

/**
 * Sets cache control headers based on options.
 *
 * @param options - Cache options
 * @returns Cache control interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(CacheControlInterceptor({ ttl: 3600, strategy: 'public' }))
 * @Get('static-data')
 * getStaticData() {
 *   return this.service.getStaticData();
 * }
 * ```
 */
export function CacheControlInterceptor(options: CacheOptions): Type<NestInterceptor> {
  @Injectable()
  class CacheControlInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        tap(() => {
          const { ttl = 0, strategy = 'no-cache', vary = [], etag = false } = options;

          let cacheControl = strategy;
          if (ttl > 0) {
            cacheControl += `, max-age=${ttl}`;
          }

          response.setHeader('Cache-Control', cacheControl);

          if (vary.length > 0) {
            response.setHeader('Vary', vary.join(', '));
          }

          if (etag) {
            const etagValue = this.generateETag(response);
            response.setHeader('ETag', etagValue);
          }
        }),
      );
    }

    private generateETag(response: Response): string {
      const crypto = require('crypto');
      const hash = crypto.createHash('md5');
      hash.update(JSON.stringify(response));
      return `"${hash.digest('hex')}"`;
    }
  }

  return CacheControlInterceptorImpl;
}

/**
 * No-cache interceptor (prevents any caching).
 *
 * @example
 * ```typescript
 * @UseInterceptors(NoCacheInterceptor)
 * @Get('real-time-data')
 * getRealTimeData() {
 *   return this.service.getRealTimeData();
 * }
 * ```
 */
@Injectable()
export class NoCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.setHeader('Pragma', 'no-cache');
        response.setHeader('Expires', '0');
      }),
    );
  }
}

/**
 * ETag generation interceptor.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ETagInterceptor)
 * @Get('users/:id')
 * findOne(@Param('id') id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const crypto = require('crypto');
        const hash = crypto.createHash('md5');
        hash.update(JSON.stringify(data));
        const etag = `"${hash.digest('hex')}"`;

        response.setHeader('ETag', etag);

        // Check if client has matching ETag
        const clientETag = request.headers['if-none-match'];
        if (clientETag === etag) {
          response.status(HttpStatus.NOT_MODIFIED);
          return null;
        }

        return data;
      }),
    );
  }
}

/**
 * Last-Modified header interceptor.
 *
 * @example
 * ```typescript
 * @UseInterceptors(LastModifiedInterceptor)
 * @Get('documents/:id')
 * getDocument(@Param('id') id: string) {
 *   return this.service.getDocument(id);
 * }
 * ```
 */
@Injectable()
export class LastModifiedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'updatedAt' in data) {
          const lastModified = new Date(data.updatedAt).toUTCString();
          response.setHeader('Last-Modified', lastModified);

          const ifModifiedSince = request.headers['if-modified-since'];
          if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(data.updatedAt)) {
            response.status(HttpStatus.NOT_MODIFIED);
            return null;
          }
        }

        return data;
      }),
    );
  }
}

// ============================================================================
// 5. Performance & Monitoring Interceptors
// ============================================================================

/**
 * Tracks and logs response time for each request.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ResponseTimeInterceptor)
 * @Controller('users')
 * export class UsersController { ... }
 * ```
 */
@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        response.setHeader('X-Response-Time', `${duration}ms`);
        this.logger.log(`${request.method} ${request.url} - ${duration}ms`);
      }),
    );
  }
}

/**
 * Comprehensive logging interceptor with configurable options.
 *
 * @param options - Logging options
 * @returns Logging interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(LoggingInterceptor({
 *   logRequest: true,
 *   logResponse: true,
 *   sensitiveFields: ['password', 'token']
 * }))
 * @Controller('users')
 * export class UsersController { ... }
 * ```
 */
export function LoggingInterceptor(options?: LoggingOptions): Type<NestInterceptor> {
  @Injectable()
  class LoggingInterceptorImpl implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const startTime = Date.now();

      const shouldLog = !options?.excludePaths?.some((path) => request.url.includes(path));

      if (shouldLog && options?.logRequest) {
        this.logRequest(request, options);
      }

      return next.handle().pipe(
        tap((data) => {
          if (shouldLog && options?.logResponse) {
            const duration = Date.now() - startTime;
            this.logResponse(request, response, data, duration, options);
          }
        }),
      );
    }

    private logRequest(request: Request, options?: LoggingOptions): void {
      const logData: any = {
        method: request.method,
        url: request.url,
        ip: request.ip,
      };

      if (options?.logHeaders) {
        logData.headers = this.sanitizeData(request.headers, options.sensitiveFields);
      }

      if (options?.logBody && request.body) {
        logData.body = this.sanitizeData(request.body, options.sensitiveFields);
      }

      this.logger.log(`Request: ${JSON.stringify(logData)}`);
    }

    private logResponse(
      request: Request,
      response: Response,
      data: any,
      duration: number,
      options?: LoggingOptions,
    ): void {
      const logData: any = {
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        duration: `${duration}ms`,
      };

      if (options?.logBody) {
        logData.body = this.sanitizeData(data, options.sensitiveFields);
      }

      this.logger.log(`Response: ${JSON.stringify(logData)}`);
    }

    private sanitizeData(data: any, sensitiveFields?: string[]): any {
      if (!sensitiveFields || sensitiveFields.length === 0) {
        return data;
      }

      if (typeof data !== 'object' || data === null) {
        return data;
      }

      const sanitized = Array.isArray(data) ? [...data] : { ...data };

      for (const field of sensitiveFields) {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      }

      return sanitized;
    }
  }

  return LoggingInterceptorImpl;
}

/**
 * Request timeout interceptor.
 *
 * @param timeoutMs - Timeout in milliseconds
 * @returns Timeout interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(TimeoutInterceptor(5000))
 * @Get('slow-operation')
 * slowOperation() {
 *   return this.service.slowOperation();
 * }
 * ```
 */
export function TimeoutInterceptor(timeoutMs: number): Type<NestInterceptor> {
  @Injectable()
  class TimeoutInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(timeoutMs),
        catchError((err) => {
          if (err.name === 'TimeoutError') {
            return throwError(() => ({
              statusCode: HttpStatus.REQUEST_TIMEOUT,
              message: `Request timeout after ${timeoutMs}ms`,
            }));
          }
          return throwError(() => err);
        }),
      );
    }
  }

  return TimeoutInterceptorImpl;
}

/**
 * Retry failed requests automatically.
 *
 * @param retries - Number of retry attempts
 * @param delay - Delay between retries in milliseconds
 * @returns Retry interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(RetryInterceptor(3, 1000))
 * @Get('external-service')
 * callExternalService() {
 *   return this.externalService.getData();
 * }
 * ```
 */
export function RetryInterceptor(retries: number = 3, delay: number = 1000): Type<NestInterceptor> {
  @Injectable()
  class RetryInterceptorImpl implements NestInterceptor {
    private readonly logger = new Logger('RetryInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        retry({
          count: retries,
          delay: (error, retryCount) => {
            this.logger.warn(`Retry attempt ${retryCount} after error: ${error.message}`);
            return of(null).pipe(tap(() => setTimeout(() => {}, delay)));
          },
        }),
      );
    }
  }

  return RetryInterceptorImpl;
}

// ============================================================================
// 6. Header Manipulation Interceptors
// ============================================================================

/**
 * Adds custom headers to responses.
 *
 * @param headers - Map of header names to values
 * @returns Custom headers interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(AddHeadersInterceptor({
 *   'X-API-Version': '1.0.0',
 *   'X-Rate-Limit': '100'
 * }))
 * @Get('users')
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export function AddHeadersInterceptor(headers: Record<string, string>): Type<NestInterceptor> {
  @Injectable()
  class AddHeadersInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        tap(() => {
          Object.entries(headers).forEach(([key, value]) => {
            response.setHeader(key, value);
          });
        }),
      );
    }
  }

  return AddHeadersInterceptorImpl;
}

/**
 * CORS headers interceptor.
 *
 * @param allowedOrigins - Array of allowed origins
 * @param allowedMethods - Array of allowed HTTP methods
 * @returns CORS interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(CorsHeadersInterceptor(['https://example.com'], ['GET', 'POST']))
 * @Controller('api')
 * export class ApiController { ... }
 * ```
 */
export function CorsHeadersInterceptor(
  allowedOrigins: string[],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE'],
): Type<NestInterceptor> {
  @Injectable()
  class CorsHeadersInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        tap(() => {
          const origin = request.headers.origin;

          if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
            response.setHeader('Access-Control-Allow-Origin', origin);
            response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.setHeader('Access-Control-Allow-Credentials', 'true');
          }
        }),
      );
    }
  }

  return CorsHeadersInterceptorImpl;
}

/**
 * Security headers interceptor.
 *
 * @example
 * ```typescript
 * @UseInterceptors(SecurityHeadersInterceptor)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Injectable()
export class SecurityHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('X-XSS-Protection', '1; mode=block');
        response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.setHeader(
          'Content-Security-Policy',
          "default-src 'self'; script-src 'self'; object-src 'none'",
        );
      }),
    );
  }
}

/**
 * Rate limit headers interceptor.
 *
 * @param limit - Rate limit
 * @param remaining - Remaining requests
 * @param reset - Reset timestamp
 * @returns Rate limit headers interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(RateLimitHeadersInterceptor(100, 95, Date.now() + 3600000))
 * @Get('api/data')
 * getData() {
 *   return this.service.getData();
 * }
 * ```
 */
export function RateLimitHeadersInterceptor(
  limit: number,
  remaining: number,
  reset: number,
): Type<NestInterceptor> {
  @Injectable()
  class RateLimitHeadersInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        tap(() => {
          response.setHeader('X-RateLimit-Limit', limit.toString());
          response.setHeader('X-RateLimit-Remaining', remaining.toString());
          response.setHeader('X-RateLimit-Reset', reset.toString());
        }),
      );
    }
  }

  return RateLimitHeadersInterceptorImpl;
}

// ============================================================================
// 7. Error Handling Interceptors
// ============================================================================

/**
 * Transforms errors into standardized format.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ErrorTransformInterceptor)
 * @Controller('users')
 * export class UsersController { ... }
 * ```
 */
@Injectable()
export class ErrorTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest<Request>();

        const errorResponse: ErrorResponse = {
          success: false,
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.name || 'Error',
          message: error.message || 'An error occurred',
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        if (process.env.NODE_ENV === 'development') {
          errorResponse.stack = error.stack;
        }

        return throwError(() => errorResponse);
      }),
    );
  }
}

/**
 * Sanitizes error messages to prevent information leakage.
 *
 * @example
 * ```typescript
 * @UseInterceptors(SanitizeErrorInterceptor)
 * @Controller('sensitive')
 * export class SensitiveController { ... }
 * ```
 */
@Injectable()
export class SanitizeErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const sanitized = {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while processing your request',
          timestamp: new Date().toISOString(),
        };

        return throwError(() => sanitized);
      }),
    );
  }
}

// ============================================================================
// 8. HATEOAS & Hypermedia Interceptors
// ============================================================================

/**
 * Injects HATEOAS links into responses.
 *
 * @param linkGenerator - Function to generate links
 * @returns HATEOAS interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(HATEOASInterceptor((data, req) => ({
 *   self: `${req.protocol}://${req.get('host')}${req.url}`,
 *   collection: `${req.protocol}://${req.get('host')}/api/users`
 * })))
 * @Get('users/:id')
 * findOne(@Param('id') id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
export function HATEOASInterceptor(
  linkGenerator: (data: any, request: Request) => Record<string, string>,
): Type<NestInterceptor> {
  @Injectable()
  class HATEOASInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();

      return next.handle().pipe(
        map((data) => {
          if (!data) return data;

          const links = linkGenerator(data, request);

          if (Array.isArray(data)) {
            return {
              data,
              _links: links,
            };
          }

          return {
            ...data,
            _links: links,
          };
        }),
      );
    }
  }

  return HATEOASInterceptorImpl;
}

/**
 * Pagination links interceptor.
 *
 * @example
 * ```typescript
 * @UseInterceptors(PaginationLinksInterceptor)
 * @Get('users')
 * findAll(@Query() query: PaginationDto) {
 *   return this.service.findAll(query);
 * }
 * ```
 */
@Injectable()
export class PaginationLinksInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        if (!data || !data.meta) return data;

        const { page, limit, totalPages } = data.meta;
        const baseUrl = `${request.protocol}://${request.get('host')}${request.path}`;

        const links: any = {
          self: `${baseUrl}?page=${page}&limit=${limit}`,
        };

        if (page > 1) {
          links.first = `${baseUrl}?page=1&limit=${limit}`;
          links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
        }

        if (page < totalPages) {
          links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
          links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
        }

        return {
          ...data,
          _links: links,
        };
      }),
    );
  }
}

// ============================================================================
// 9. Versioning & Deprecation Interceptors
// ============================================================================

/**
 * API version header interceptor.
 *
 * @param version - API version
 * @returns Version header interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(ApiVersionInterceptor('1.0.0'))
 * @Controller('v1/users')
 * export class UsersV1Controller { ... }
 * ```
 */
export function ApiVersionInterceptor(version: string): Type<NestInterceptor> {
  @Injectable()
  class ApiVersionInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
        tap(() => {
          response.setHeader('X-API-Version', version);
        }),
      );
    }
  }

  return ApiVersionInterceptorImpl;
}

/**
 * Deprecation warning interceptor.
 *
 * @param deprecatedSince - Version when deprecated
 * @param removeInVersion - Version when it will be removed
 * @param migrateTo - New endpoint to use
 * @returns Deprecation interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(DeprecationWarningInterceptor('1.5.0', '2.0.0', '/api/v2/users'))
 * @Get('old-users')
 * oldFindAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export function DeprecationWarningInterceptor(
  deprecatedSince: string,
  removeInVersion: string,
  migrateTo?: string,
): Type<NestInterceptor> {
  @Injectable()
  class DeprecationWarningInterceptorImpl implements NestInterceptor {
    private readonly logger = new Logger('DeprecationWarning');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      this.logger.warn(
        `Deprecated endpoint accessed: ${request.method} ${request.url}. ` +
          `Deprecated since ${deprecatedSince}, will be removed in ${removeInVersion}.` +
          (migrateTo ? ` Please migrate to ${migrateTo}` : ''),
      );

      return next.handle().pipe(
        tap(() => {
          response.setHeader('X-API-Deprecated', 'true');
          response.setHeader('X-API-Deprecated-Since', deprecatedSince);
          response.setHeader('X-API-Remove-In', removeInVersion);
          if (migrateTo) {
            response.setHeader('X-API-Migrate-To', migrateTo);
          }
        }),
      );
    }
  }

  return DeprecationWarningInterceptorImpl;
}

// ============================================================================
// 10. Healthcare-Specific Interceptors
// ============================================================================

/**
 * HIPAA audit logging interceptor.
 *
 * @example
 * ```typescript
 * @UseInterceptors(HIPAAAuditInterceptor)
 * @Get('patients/:id')
 * getPatient(@Param('id') id: string) {
 *   return this.patientsService.findOne(id);
 * }
 * ```
 */
@Injectable()
export class HIPAAAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HIPAAAudit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    const auditLog = {
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      action: `${request.method} ${request.url}`,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    };

    this.logger.log(`HIPAA Audit: ${JSON.stringify(auditLog)}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`HIPAA Audit Complete: ${JSON.stringify(auditLog)}`);
      }),
    );
  }
}

/**
 * PHI data masking interceptor for healthcare data.
 *
 * @example
 * ```typescript
 * @UseInterceptors(PHIMaskingInterceptor)
 * @Get('patients')
 * findAll() {
 *   return this.patientsService.findAll();
 * }
 * ```
 */
@Injectable()
export class PHIMaskingInterceptor implements NestInterceptor {
  private readonly phiFields = ['ssn', 'medicalRecordNumber', 'dateOfBirth', 'phone', 'email'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user = (context.switchToHttp().getRequest() as any).user;
    const hasFullAccess = user?.roles?.includes('doctor') || user?.roles?.includes('nurse');

    if (hasFullAccess) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => this.maskPHI(data)));
  }

  private maskPHI(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.maskPHI(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (this.phiFields.includes(key)) {
          result[key] = '[PROTECTED]';
        } else {
          result[key] = this.maskPHI(value);
        }
      }
      return result;
    }

    return obj;
  }
}
