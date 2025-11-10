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
import { NestInterceptor, ExecutionContext, HttpException } from '@nestjs/common';
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
export declare function createLoggingInterceptor(options?: {
    logBody?: boolean;
    logHeaders?: boolean;
}): NestInterceptor;
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
export declare function createHeaderInterceptor(headers: Record<string, string>): NestInterceptor;
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
export declare function createRequestContextInterceptor(extractor: (context: ExecutionContext) => Record<string, any>): NestInterceptor;
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
export declare function createPerformanceInterceptor(onComplete: (duration: number, context: ExecutionContext) => void): NestInterceptor;
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
export declare function createResponseWrapperInterceptor<T = any>(wrapper: (data: T, context?: ExecutionContext) => any): NestInterceptor;
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
export declare function createDataMapperInterceptor<TInput, TOutput>(mapper: (data: TInput) => TOutput): NestInterceptor;
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
export declare function createPropertyFilterInterceptor(excludeFields: string[]): NestInterceptor;
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
export declare function createSerializationInterceptor(options?: {
    excludeExtraneousValues?: boolean;
}): NestInterceptor;
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
export declare function createCacheInterceptor(options: {
    ttl: number;
    keyGenerator: (context: ExecutionContext) => string;
}): NestInterceptor;
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
export declare function createConditionalCacheInterceptor(config: {
    ttl: number;
    shouldCache: (context: ExecutionContext, data: any) => boolean;
    keyGenerator: (context: ExecutionContext) => string;
}): NestInterceptor;
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
export declare function createCacheInvalidationInterceptor(options: {
    cache: Map<string, any>;
    pattern: RegExp;
    methods?: string[];
}): NestInterceptor;
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
export declare function createStructuredLoggingInterceptor(logger: {
    info: (message: string, meta?: any) => void;
    error: (message: string, meta?: any) => void;
}): NestInterceptor;
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
export declare function createAuditLoggingInterceptor(auditService: {
    logAccess: (data: any) => Promise<void>;
}): NestInterceptor;
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
export declare function createPayloadLoggingInterceptor(options: {
    logRequest?: boolean;
    logResponse?: boolean;
    maxBodyLength?: number;
    sanitizeFields?: string[];
}): NestInterceptor;
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
export declare function createErrorTransformInterceptor(transformer: (error: Error) => HttpException): NestInterceptor;
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
export declare function createErrorSanitizationInterceptor(sensitiveFields: string[]): NestInterceptor;
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
export declare function createFallbackInterceptor<T>(fallbackValue: T | ((error: Error) => T)): NestInterceptor;
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
export declare function createTimeoutInterceptor(timeoutMs: number, message?: string): NestInterceptor;
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
export declare function createAdaptiveTimeoutInterceptor(timeoutCalculator: (context: ExecutionContext) => number): NestInterceptor;
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
export declare function createRetryInterceptor(options: {
    maxRetries: number;
    initialDelay: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
}): NestInterceptor;
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
export declare function createConditionalRetryInterceptor(config: {
    maxRetries: number;
    retryDelay: number;
    shouldRetry: (error: Error, retryCount: number) => boolean;
}): NestInterceptor;
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
export declare function createMetricsCollectionInterceptor(metricsService: {
    recordRequestDuration: (route: string, duration: number, status: number) => void;
    incrementRequestCount: (route: string, method: string, status: number) => void;
}): NestInterceptor;
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
export declare function createRateTrackingInterceptor(options: {
    storage: Map<string, number[]>;
    windowMs: number;
    onRateCalculated?: (key: string, rate: number) => void;
}): NestInterceptor;
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
export declare function createResponseSizeTrackingInterceptor(onSizeCalculated: (size: number, route: string) => void): NestInterceptor;
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
export declare function createPHISanitizationInterceptor(sensitiveFields: string[]): NestInterceptor;
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
export declare function createInputSanitizationInterceptor(options: {
    trimStrings?: boolean;
    removeNullValues?: boolean;
    convertEmptyStringsToNull?: boolean;
}): NestInterceptor;
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
export declare function createPaginationInterceptor<T>(): NestInterceptor;
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
export declare function createStatusCodeInterceptor(statusCodeResolver: (data: any, context: ExecutionContext) => number): NestInterceptor;
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
export declare function createConditionalResponseInterceptor(options: {
    condition: (data: any, context: ExecutionContext) => boolean;
    transform: (data: any) => any;
}): NestInterceptor;
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
export declare function createCompressionHintInterceptor(options: {
    minSize: number;
    encoding?: string;
}): NestInterceptor;
declare const _default: {
    createLoggingInterceptor: typeof createLoggingInterceptor;
    createHeaderInterceptor: typeof createHeaderInterceptor;
    createRequestContextInterceptor: typeof createRequestContextInterceptor;
    createPerformanceInterceptor: typeof createPerformanceInterceptor;
    createResponseWrapperInterceptor: typeof createResponseWrapperInterceptor;
    createDataMapperInterceptor: typeof createDataMapperInterceptor;
    createPropertyFilterInterceptor: typeof createPropertyFilterInterceptor;
    createSerializationInterceptor: typeof createSerializationInterceptor;
    createCacheInterceptor: typeof createCacheInterceptor;
    createConditionalCacheInterceptor: typeof createConditionalCacheInterceptor;
    createCacheInvalidationInterceptor: typeof createCacheInvalidationInterceptor;
    createStructuredLoggingInterceptor: typeof createStructuredLoggingInterceptor;
    createAuditLoggingInterceptor: typeof createAuditLoggingInterceptor;
    createPayloadLoggingInterceptor: typeof createPayloadLoggingInterceptor;
    createErrorTransformInterceptor: typeof createErrorTransformInterceptor;
    createErrorSanitizationInterceptor: typeof createErrorSanitizationInterceptor;
    createFallbackInterceptor: typeof createFallbackInterceptor;
    createTimeoutInterceptor: typeof createTimeoutInterceptor;
    createAdaptiveTimeoutInterceptor: typeof createAdaptiveTimeoutInterceptor;
    createRetryInterceptor: typeof createRetryInterceptor;
    createConditionalRetryInterceptor: typeof createConditionalRetryInterceptor;
    createMetricsCollectionInterceptor: typeof createMetricsCollectionInterceptor;
    createRateTrackingInterceptor: typeof createRateTrackingInterceptor;
    createResponseSizeTrackingInterceptor: typeof createResponseSizeTrackingInterceptor;
    createPHISanitizationInterceptor: typeof createPHISanitizationInterceptor;
    createInputSanitizationInterceptor: typeof createInputSanitizationInterceptor;
    createPaginationInterceptor: typeof createPaginationInterceptor;
    createStatusCodeInterceptor: typeof createStatusCodeInterceptor;
    createConditionalResponseInterceptor: typeof createConditionalResponseInterceptor;
    createCompressionHintInterceptor: typeof createCompressionHintInterceptor;
};
export default _default;
//# sourceMappingURL=nest-interceptors-utils.d.ts.map