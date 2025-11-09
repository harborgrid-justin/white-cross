/**
 * LOC: H1T2P3C4K5
 * File: /reuse/http-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - All NestJS controllers requiring advanced HTTP operations
 *   - Request/response interceptors and transformers
 *   - Validation pipes and custom decorators
 */
/**
 * File: /reuse/http-controllers-kit.ts
 * Locator: WC-UTL-HTTPCTRL-001
 * Purpose: HTTP Controllers Kit - Comprehensive NestJS controller utilities for request/response handling
 *
 * Upstream: @nestjs/common, @nestjs/swagger, @nestjs/platform-express, class-transformer, class-validator
 * Downstream: All NestJS controllers, interceptors, pipes, guards, exception filters
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express
 * Exports: 45 HTTP controller utility functions for validation, transformation, formatting, error handling, pagination
 *
 * LLM Context: Production-grade HTTP controller toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for request validation, response formatting, error handling, pagination,
 * query building, DTO transformation, file handling, content negotiation, versioning, and Swagger documentation.
 * HIPAA-compliant with PHI protection, audit logging, and healthcare-specific patterns.
 */
import { ExecutionContext, Type, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
import { ValidationError, ValidatorOptions } from 'class-validator';
import { Observable } from 'rxjs';
/**
 * Pagination query parameters
 */
export interface PaginationQuery {
    page?: number;
    limit?: number;
    offset?: number;
}
/**
 * Pagination metadata for responses
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
/**
 * Sort query parameters
 */
export interface SortQuery {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
/**
 * Filter operation types
 */
export type FilterOperation = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
/**
 * Filter criteria
 */
export interface FilterCriteria {
    field: string;
    operation: FilterOperation;
    value: unknown;
}
/**
 * Query builder options
 */
export interface QueryBuilderOptions {
    pagination?: PaginationQuery;
    sort?: SortQuery;
    filters?: FilterCriteria[];
    search?: string;
    searchFields?: string[];
}
/**
 * Validation options with custom error formatting
 */
export interface CustomValidationOptions extends ValidatorOptions {
    errorFormatter?: (errors: ValidationError[]) => any;
}
/**
 * DTO transformation options
 */
export interface DtoTransformOptions {
    excludeExtraneousValues?: boolean;
    enableImplicitConversion?: boolean;
    groups?: string[];
    exposeDefaultValues?: boolean;
    excludePrefixes?: string[];
}
/**
 * Response transformation metadata
 */
export interface ResponseTransformMetadata {
    statusCode?: number;
    message?: string;
    timestamp?: string;
    path?: string;
    version?: string;
}
/**
 * API versioning configuration
 */
export interface VersioningConfig {
    type: 'header' | 'uri' | 'media-type' | 'custom';
    header?: string;
    key?: string;
    defaultVersion?: string;
}
/**
 * Content negotiation options
 */
export interface ContentNegotiationOptions {
    supportedTypes: string[];
    defaultType?: string;
    charset?: string;
}
/**
 * Bulk operation result
 */
export interface BulkOperationResult<T = unknown> {
    success: T[];
    failed: Array<{
        item: unknown;
        error: string;
    }>;
    total: number;
    successCount: number;
    failedCount: number;
}
/**
 * Validates request body against DTO class with custom options.
 *
 * @template T - DTO type
 * @param {any} body - Request body
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {CustomValidationOptions} options - Validation options
 * @returns {Promise<T>} Validated DTO instance
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * @Post('patients')
 * async createPatient(@Body() rawBody: any) {
 *   const dto = await validateRequestBody(rawBody, CreatePatientDto, {
 *     whitelist: true,
 *     forbidNonWhitelisted: true
 *   });
 *   return this.patientsService.create(dto);
 * }
 * ```
 */
export declare function validateRequestBody<T extends object>(body: any, dtoClass: ClassConstructor<T>, options?: CustomValidationOptions): Promise<T>;
/**
 * Formats validation errors into readable structure.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {object} Formatted error object
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const formatted = formatValidationErrors(errors);
 * // { email: ['email must be an email'], age: ['age must be a positive number'] }
 * ```
 */
export declare function formatValidationErrors(errors: ValidationError[]): Record<string, string[]>;
/**
 * Validates multiple items in bulk operation.
 *
 * @template T - DTO type
 * @param {any[]} items - Array of items to validate
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {ValidatorOptions} options - Validation options
 * @returns {Promise<BulkOperationResult<T>>} Bulk validation result
 *
 * @example
 * ```typescript
 * @Post('patients/bulk')
 * async createBulkPatients(@Body() items: any[]) {
 *   const result = await validateBulkItems(items, CreatePatientDto);
 *   return this.patientsService.createBulk(result.success);
 * }
 * ```
 */
export declare function validateBulkItems<T extends object>(items: any[], dtoClass: ClassConstructor<T>, options?: ValidatorOptions): Promise<BulkOperationResult<T>>;
/**
 * Sanitizes request input by removing dangerous characters.
 *
 * @param {unknown} input - Input to sanitize
 * @param {object} options - Sanitization options
 * @returns {unknown} Sanitized input
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeInput(req.body, {
 *   removeScriptTags: true,
 *   trimStrings: true
 * });
 * ```
 */
export declare function sanitizeInput(input: unknown, options?: {
    removeScriptTags?: boolean;
    trimStrings?: boolean;
    removeNullBytes?: boolean;
}): unknown;
/**
 * Validates query string parameters against allowed fields.
 *
 * @param {unknown} query - Query object
 * @param {string[]} allowedFields - Allowed field names
 * @throws {BadRequestException} If invalid fields present or query is not an object
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: unknown) {
 *   validateQueryFields(query, ['page', 'limit', 'search', 'status']);
 *   return this.patientsService.findAll(query);
 * }
 * ```
 */
export declare function validateQueryFields(query: unknown, allowedFields: string[]): void;
/**
 * Wraps response data with standardized success envelope.
 *
 * @template T - Response data type
 * @param {T} data - Response data
 * @param {ResponseTransformMetadata} metadata - Additional metadata
 * @returns {object} Formatted response
 *
 * @example
 * ```typescript
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   const patient = await this.patientsService.findOne(id);
 *   return wrapSuccessResponse(patient, {
 *     message: 'Patient retrieved successfully'
 *   });
 * }
 * ```
 */
export declare function wrapSuccessResponse<T>(data: T, metadata?: ResponseTransformMetadata): {
    success: true;
    data: T;
    message?: string;
    timestamp: string;
    statusCode: number;
};
/**
 * Wraps error response with standardized error envelope.
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Error details
 * @returns {object} Formatted error response
 *
 * @example
 * ```typescript
 * if (!patient) {
 *   throw new NotFoundException(
 *     wrapErrorResponse('Patient not found', 404, { patientId: id })
 *   );
 * }
 * ```
 */
export declare function wrapErrorResponse(message: string, statusCode: number, details?: any): {
    success: false;
    error: string;
    statusCode: number;
    details?: any;
    timestamp: string;
};
/**
 * Transforms response using DTO class with serialization options.
 *
 * @template T - DTO type
 * @param {unknown} data - Raw data
 * @param {ClassConstructor<T>} dtoClass - DTO class
 * @param {DtoTransformOptions} options - Transform options
 * @returns {T | T[]} Transformed DTO instance(s)
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients() {
 *   const patients = await this.patientsService.findAll();
 *   return transformResponse(patients, PatientResponseDto, {
 *     excludeExtraneousValues: true,
 *     groups: ['public']
 *   });
 * }
 * ```
 */
export declare function transformResponse<T>(data: unknown, dtoClass: ClassConstructor<T>, options?: DtoTransformOptions): T | T[];
/**
 * Serializes DTO instance to plain object for response.
 *
 * @param {unknown} dto - DTO instance
 * @param {DtoTransformOptions} options - Serialization options
 * @returns {unknown} Plain object
 *
 * @example
 * ```typescript
 * const dto = new UserResponseDto();
 * dto.email = 'user@example.com';
 * const plain = serializeDto(dto, { groups: ['public'] });
 * ```
 */
export declare function serializeDto(dto: unknown, options?: DtoTransformOptions): unknown;
/**
 * Removes sensitive fields from response object.
 *
 * @param {unknown} data - Data object
 * @param {string[]} sensitiveFields - Fields to remove
 * @returns {unknown} Sanitized data
 *
 * @example
 * ```typescript
 * const user = await this.usersService.findOne(id);
 * return removeSensitiveFields(user, ['password', 'ssn', 'bankAccount']);
 * ```
 */
export declare function removeSensitiveFields(data: unknown, sensitiveFields: string[]): unknown;
/**
 * Creates pagination metadata from query and total count.
 *
 * @param {PaginationQuery} query - Pagination query parameters
 * @param {number} total - Total number of items
 * @returns {PaginationMeta} Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = createPaginationMeta({ page: 2, limit: 10 }, 45);
 * // { page: 2, limit: 10, total: 45, totalPages: 5, hasNextPage: true, ... }
 * ```
 */
export declare function createPaginationMeta(query: PaginationQuery, total: number): PaginationMeta;
/**
 * Creates paginated response with data and metadata.
 *
 * @template T - Data type
 * @param {T[]} data - Array of items
 * @param {PaginationMeta} meta - Pagination metadata
 * @returns {PaginatedResponse<T>} Paginated response
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: PaginationQuery) {
 *   const [data, total] = await this.patientsService.findAndCount(query);
 *   const meta = createPaginationMeta(query, total);
 *   return createPaginatedResponse(data, meta);
 * }
 * ```
 */
export declare function createPaginatedResponse<T>(data: T[], meta: PaginationMeta): PaginatedResponse<T>;
/**
 * Calculates pagination offset from page and limit.
 *
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {number} Offset for database query
 *
 * @example
 * ```typescript
 * const offset = calculatePaginationOffset(3, 10); // Returns 20
 * const results = await this.repository.find({ skip: offset, take: limit });
 * ```
 */
export declare function calculatePaginationOffset(page: number, limit: number): number;
/**
 * Parses pagination parameters from request query.
 *
 * @param {unknown} query - Request query object
 * @param {object} defaults - Default pagination values
 * @returns {PaginationQuery} Parsed pagination query
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: unknown) {
 *   const pagination = parsePaginationQuery(query, { page: 1, limit: 20 });
 *   return this.patientsService.findAll(pagination);
 * }
 * ```
 */
export declare function parsePaginationQuery(query: unknown, defaults?: {
    page?: number;
    limit?: number;
}): PaginationQuery;
/**
 * Parses sort parameters from query string.
 *
 * @param {unknown} query - Request query object
 * @param {string} defaultSortBy - Default sort field
 * @param {string[]} allowedFields - Allowed sort fields
 * @returns {SortQuery} Sort query object
 * @throws {BadRequestException} If sort field is invalid
 *
 * @example
 * ```typescript
 * const sort = parseSortQuery(req.query, 'createdAt', ['name', 'createdAt', 'updatedAt']);
 * // { sortBy: 'createdAt', sortOrder: 'DESC' }
 * ```
 */
export declare function parseSortQuery(query: unknown, defaultSortBy?: string, allowedFields?: string[]): SortQuery;
/**
 * Builds filter criteria from query parameters.
 *
 * @param {unknown} query - Request query object
 * @param {string[]} filterableFields - Fields that can be filtered
 * @returns {FilterCriteria[]} Array of filter criteria
 *
 * @example
 * ```typescript
 * // Query: ?status=active&age__gte=18
 * const filters = buildFilterCriteria(req.query, ['status', 'age']);
 * // [{ field: 'status', operation: 'eq', value: 'active' },
 * //  { field: 'age', operation: 'gte', value: 18 }]
 * ```
 */
export declare function buildFilterCriteria(query: unknown, filterableFields: string[]): FilterCriteria[];
/**
 * Builds complete query options from request query.
 *
 * @param {unknown} query - Request query object
 * @param {object} config - Query builder configuration
 * @returns {QueryBuilderOptions} Complete query options
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: unknown) {
 *   const options = buildQueryOptions(query, {
 *     defaultSort: 'createdAt',
 *     allowedSortFields: ['name', 'createdAt'],
 *     filterableFields: ['status', 'age']
 *   });
 *   return this.patientsService.findAll(options);
 * }
 * ```
 */
export declare function buildQueryOptions(query: unknown, config?: {
    defaultSort?: string;
    allowedSortFields?: string[];
    filterableFields?: string[];
    searchFields?: string[];
}): QueryBuilderOptions;
/**
 * Converts query options to SQL WHERE clause parameters.
 *
 * @param {QueryBuilderOptions} options - Query options
 * @returns {object} SQL query parameters
 *
 * @example
 * ```typescript
 * const options = buildQueryOptions(req.query);
 * const sqlParams = queryOptionsToSql(options);
 * // { where: { status: 'active', age: { $gte: 18 } }, order: [['createdAt', 'DESC']] }
 * ```
 */
export declare function queryOptionsToSql(options: QueryBuilderOptions): {
    where?: Record<string, unknown>;
    order?: Array<[string, string]>;
    limit?: number;
    offset?: number;
};
/**
 * Parses UUID parameter with validation.
 *
 * @param {string} value - UUID string
 * @param {string} paramName - Parameter name for error messages
 * @returns {string} Validated UUID
 * @throws {BadRequestException} If UUID is invalid
 *
 * @example
 * ```typescript
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string) {
 *   const validId = parseUuidParam(id, 'patientId');
 *   return this.patientsService.findOne(validId);
 * }
 * ```
 */
export declare function parseUuidParam(value: string, paramName?: string): string;
/**
 * Parses integer parameter with range validation.
 *
 * @param {string} value - Integer string
 * @param {object} options - Validation options
 * @returns {number} Parsed integer
 * @throws {BadRequestException} If invalid or out of range
 *
 * @example
 * ```typescript
 * const age = parseIntParam(req.query.age, {
 *   min: 0,
 *   max: 150,
 *   paramName: 'age'
 * });
 * ```
 */
export declare function parseIntParam(value: string, options?: {
    min?: number;
    max?: number;
    paramName?: string;
}): number;
/**
 * Parses date parameter with validation.
 *
 * @param {string} value - Date string
 * @param {string} paramName - Parameter name
 * @returns {Date} Parsed date
 * @throws {BadRequestException} If date is invalid
 *
 * @example
 * ```typescript
 * const startDate = parseDateParam(req.query.startDate, 'startDate');
 * ```
 */
export declare function parseDateParam(value: string, paramName?: string): Date;
/**
 * Parses enum parameter with validation.
 *
 * @template T - Enum type
 * @param {string} value - Enum value string
 * @param {object} enumObj - Enum object
 * @param {string} paramName - Parameter name
 * @returns {T} Enum value
 * @throws {BadRequestException} If value not in enum
 *
 * @example
 * ```typescript
 * enum Status { Active = 'active', Inactive = 'inactive' }
 * const status = parseEnumParam(req.query.status, Status, 'status');
 * ```
 */
export declare function parseEnumParam<T>(value: string, enumObj: object, paramName?: string): T;
/**
 * Parses boolean parameter from string.
 *
 * @param {string | boolean} value - Boolean value
 * @returns {boolean} Parsed boolean
 *
 * @example
 * ```typescript
 * const isActive = parseBooleanParam(req.query.active); // 'true' -> true
 * ```
 */
export declare function parseBooleanParam(value: string | boolean): boolean;
/**
 * Parses array parameter from comma-separated string.
 *
 * @param {string | string[]} value - Array or comma-separated string
 * @param {object} options - Parsing options
 * @returns {string[]} Array of values
 *
 * @example
 * ```typescript
 * // Query: ?ids=1,2,3 or ?ids[]=1&ids[]=2&ids[]=3
 * const ids = parseArrayParam(req.query.ids, { unique: true });
 * ```
 */
export declare function parseArrayParam(value: string | string[], options?: {
    separator?: string;
    unique?: boolean;
    trim?: boolean;
}): string[];
/**
 * Determines response content type based on Accept header.
 *
 * @param {Request} req - Express request
 * @param {ContentNegotiationOptions} options - Negotiation options
 * @returns {string} Selected content type
 * @throws {BadRequestException} If no acceptable type found
 *
 * @example
 * ```typescript
 * const contentType = negotiateContentType(req, {
 *   supportedTypes: ['application/json', 'application/xml'],
 *   defaultType: 'application/json'
 * });
 * ```
 */
export declare function negotiateContentType(req: Request, options: ContentNegotiationOptions): string;
/**
 * Sets response headers for content type and charset.
 *
 * @param {Response} res - Express response
 * @param {string} contentType - Content type
 * @param {string} charset - Character encoding
 *
 * @example
 * ```typescript
 * setContentTypeHeader(res, 'application/json', 'utf-8');
 * ```
 */
export declare function setContentTypeHeader(res: Response, contentType: string, charset?: string): void;
/**
 * Checks if request accepts specific content type.
 *
 * @param {Request} req - Express request
 * @param {string} contentType - Content type to check
 * @returns {boolean} True if content type is accepted
 *
 * @example
 * ```typescript
 * if (acceptsContentType(req, 'application/json')) {
 *   return res.json(data);
 * }
 * ```
 */
export declare function acceptsContentType(req: Request, contentType: string): boolean;
/**
 * Extracts API version from request.
 *
 * @param {Request} req - Express request
 * @param {VersioningConfig} config - Versioning configuration
 * @returns {string} API version
 *
 * @example
 * ```typescript
 * const version = extractApiVersion(req, {
 *   type: 'header',
 *   header: 'X-API-Version',
 *   defaultVersion: '1'
 * });
 * ```
 */
export declare function extractApiVersion(req: Request, config: VersioningConfig): string;
/**
 * Validates API version is supported.
 *
 * @param {string} version - Requested version
 * @param {string[]} supportedVersions - Array of supported versions
 * @throws {BadRequestException} If version not supported
 *
 * @example
 * ```typescript
 * const version = extractApiVersion(req, config);
 * validateApiVersion(version, ['1', '2', '3']);
 * ```
 */
export declare function validateApiVersion(version: string, supportedVersions: string[]): void;
/**
 * Creates API paginated response decorator.
 *
 * @template T - DTO type
 * @param {Type<T>} dtoClass - DTO class
 * @returns {MethodDecorator} Swagger decorator
 *
 * @example
 * ```typescript
 * @Get('patients')
 * @ApiPaginatedResponse(PatientDto)
 * async getPatients() {
 *   // Returns paginated response with PatientDto schema
 * }
 * ```
 */
export declare function ApiPaginatedResponse<T>(dtoClass: Type<T>): MethodDecorator;
/**
 * Creates API array response decorator.
 *
 * @template T - DTO type
 * @param {Type<T>} dtoClass - DTO class
 * @param {number} status - HTTP status code
 * @returns {MethodDecorator} Swagger decorator
 *
 * @example
 * ```typescript
 * @Get('patients/recent')
 * @ApiArrayResponse(PatientDto, 200)
 * async getRecentPatients() {
 *   // Returns array of PatientDto
 * }
 * ```
 */
export declare function ApiArrayResponse<T>(dtoClass: Type<T>, status?: number): MethodDecorator;
/**
 * Creates standardized error response decorators.
 *
 * @param {number[]} statusCodes - Status codes to document
 * @returns {MethodDecorator} Swagger decorator
 *
 * @example
 * ```typescript
 * @Get('patients/:id')
 * @ApiErrorResponses([400, 404, 500])
 * async getPatient(@Param('id') id: string) {
 *   // Documented with standard error responses
 * }
 * ```
 */
export declare function ApiErrorResponses(statusCodes: number[]): MethodDecorator;
/**
 * Extracts current user from request.
 *
 * @param {string} property - Optional property to extract from user
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Post('appointments')
 * async createAppointment(
 *   @CurrentUser() user: User,
 *   @CurrentUser('id') userId: string
 * ) {
 *   // Use user or userId
 * }
 * ```
 */
export declare const CurrentUser: any;
/**
 * Extracts client IP address from request.
 *
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@ClientIp() ip: string) {
 *   await this.auditService.logLogin(ip);
 * }
 * ```
 */
export declare const ClientIp: any;
/**
 * Extracts user agent from request headers.
 *
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Post('analytics')
 * async trackEvent(@UserAgent() userAgent: string) {
 *   await this.analyticsService.track({ userAgent });
 * }
 * ```
 */
export declare const UserAgent: any;
/**
 * Creates response transformation interceptor.
 *
 * @template T - DTO type
 * @param {ClassConstructor<T>} dtoClass - DTO class for transformation
 * @returns {NestInterceptor} Response interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createTransformInterceptor(UserResponseDto))
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return this.usersService.findOne(id);
 * }
 * ```
 */
export declare function createTransformInterceptor<T>(dtoClass: ClassConstructor<T>): {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
};
/**
 * Creates response wrapping interceptor that adds success envelope.
 *
 * @returns {NestInterceptor} Response interceptor
 *
 * @example
 * ```typescript
 * @UseInterceptors(createResponseWrapperInterceptor())
 * @Get('data')
 * async getData() {
 *   return { value: 123 };
 *   // Returns: { success: true, data: { value: 123 }, timestamp: '...' }
 * }
 * ```
 */
export declare function createResponseWrapperInterceptor(): {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
};
/**
 * Transforms plain object to DTO instance with validation.
 *
 * @template T - DTO type
 * @param {any} plain - Plain object
 * @param {ClassConstructor<T>} dtoClass - DTO class
 * @param {boolean} validate - Whether to validate
 * @returns {Promise<T>} DTO instance
 *
 * @example
 * ```typescript
 * const dto = await plainToDto(req.body, CreatePatientDto, true);
 * ```
 */
export declare function plainToDto<T extends object>(plain: any, dtoClass: ClassConstructor<T>, validate?: boolean): Promise<T>;
/**
 * Validates DTO instance.
 *
 * @param {object} dto - DTO instance to validate
 * @param {ValidatorOptions} options - Validation options
 * @returns {Promise<ValidationError[]>} Array of validation errors
 *
 * @example
 * ```typescript
 * const errors = await validateDto(dto, { skipMissingProperties: false });
 * ```
 */
export declare function validateDto(dto: object, options?: ValidatorOptions): Promise<ValidationError[]>;
/**
 * Merges partial DTO with existing entity.
 *
 * @template T - Entity type
 * @param {T} entity - Existing entity
 * @param {Partial<T>} dto - Partial DTO with updates
 * @param {string[]} allowedFields - Fields allowed to be updated
 * @returns {T} Merged entity
 *
 * @example
 * ```typescript
 * const updated = mergeDtoWithEntity(existingPatient, updateDto, ['name', 'email', 'phone']);
 * ```
 */
export declare function mergeDtoWithEntity<T>(entity: T, dto: Partial<T>, allowedFields?: string[]): T;
declare const _default: {
    validateRequestBody: typeof validateRequestBody;
    formatValidationErrors: typeof formatValidationErrors;
    validateBulkItems: typeof validateBulkItems;
    sanitizeInput: typeof sanitizeInput;
    validateQueryFields: typeof validateQueryFields;
    wrapSuccessResponse: typeof wrapSuccessResponse;
    wrapErrorResponse: typeof wrapErrorResponse;
    transformResponse: typeof transformResponse;
    serializeDto: typeof serializeDto;
    removeSensitiveFields: typeof removeSensitiveFields;
    createPaginationMeta: typeof createPaginationMeta;
    createPaginatedResponse: typeof createPaginatedResponse;
    calculatePaginationOffset: typeof calculatePaginationOffset;
    parsePaginationQuery: typeof parsePaginationQuery;
    parseSortQuery: typeof parseSortQuery;
    buildFilterCriteria: typeof buildFilterCriteria;
    buildQueryOptions: typeof buildQueryOptions;
    queryOptionsToSql: typeof queryOptionsToSql;
    parseUuidParam: typeof parseUuidParam;
    parseIntParam: typeof parseIntParam;
    parseDateParam: typeof parseDateParam;
    parseEnumParam: typeof parseEnumParam;
    parseBooleanParam: typeof parseBooleanParam;
    parseArrayParam: typeof parseArrayParam;
    negotiateContentType: typeof negotiateContentType;
    setContentTypeHeader: typeof setContentTypeHeader;
    acceptsContentType: typeof acceptsContentType;
    extractApiVersion: typeof extractApiVersion;
    validateApiVersion: typeof validateApiVersion;
    ApiPaginatedResponse: typeof ApiPaginatedResponse;
    ApiArrayResponse: typeof ApiArrayResponse;
    ApiErrorResponses: typeof ApiErrorResponses;
    CurrentUser: any;
    ClientIp: any;
    UserAgent: any;
    createTransformInterceptor: typeof createTransformInterceptor;
    createResponseWrapperInterceptor: typeof createResponseWrapperInterceptor;
    plainToDto: typeof plainToDto;
    validateDto: typeof validateDto;
    mergeDtoWithEntity: typeof mergeDtoWithEntity;
};
export default _default;
//# sourceMappingURL=http-controllers-kit.d.ts.map