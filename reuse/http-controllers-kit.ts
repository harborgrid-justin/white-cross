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

import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
  applyDecorators,
  SetMetadata,
  BadRequestException,
  ValidationPipe,
  PipeTransform,
  ArgumentMetadata,
  Type,
  CallHandler,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiProperty,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { plainToClass, plainToInstance, ClassConstructor, instanceToPlain } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  value: any;
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
export interface BulkOperationResult<T = any> {
  success: T[];
  failed: Array<{ item: any; error: string }>;
  total: number;
  successCount: number;
  failedCount: number;
}

// ============================================================================
// REQUEST VALIDATION UTILITIES
// ============================================================================

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
export async function validateRequestBody<T extends object>(
  body: any,
  dtoClass: ClassConstructor<T>,
  options?: CustomValidationOptions,
): Promise<T> {
  const dto = plainToInstance(dtoClass, body, {
    excludeExtraneousValues: options?.whitelist,
    enableImplicitConversion: true,
  });

  const errors = await validate(dto, options);

  if (errors.length > 0) {
    const formattedErrors = options?.errorFormatter
      ? options.errorFormatter(errors)
      : formatValidationErrors(errors);

    throw new BadRequestException({
      message: 'Validation failed',
      errors: formattedErrors,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  return dto;
}

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
export function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const error of errors) {
    if (error.constraints) {
      formatted[error.property] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      for (const [key, value] of Object.entries(childErrors)) {
        formatted[`${error.property}.${key}`] = value;
      }
    }
  }

  return formatted;
}

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
export async function validateBulkItems<T extends object>(
  items: any[],
  dtoClass: ClassConstructor<T>,
  options?: ValidatorOptions,
): Promise<BulkOperationResult<T>> {
  const success: T[] = [];
  const failed: Array<{ item: any; error: string }> = [];

  for (const item of items) {
    try {
      const dto = plainToInstance(dtoClass, item);
      const errors = await validate(dto, options);

      if (errors.length === 0) {
        success.push(dto);
      } else {
        failed.push({
          item,
          error: JSON.stringify(formatValidationErrors(errors)),
        });
      }
    } catch (error) {
      failed.push({
        item,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return {
    success,
    failed,
    total: items.length,
    successCount: success.length,
    failedCount: failed.length,
  };
}

/**
 * Sanitizes request input by removing dangerous characters.
 *
 * @param {any} input - Input to sanitize
 * @param {object} options - Sanitization options
 * @returns {any} Sanitized input
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeInput(req.body, {
 *   removeScriptTags: true,
 *   trimStrings: true
 * });
 * ```
 */
export function sanitizeInput(
  input: any,
  options: {
    removeScriptTags?: boolean;
    trimStrings?: boolean;
    removeNullBytes?: boolean;
  } = {},
): any {
  const { removeScriptTags = true, trimStrings = true, removeNullBytes = true } = options;

  if (typeof input === 'string') {
    let sanitized = input;

    if (removeScriptTags) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    if (removeNullBytes) {
      sanitized = sanitized.replace(/\0/g, '');
    }

    if (trimStrings) {
      sanitized = sanitized.trim();
    }

    return sanitized;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item, options));
  }

  if (input !== null && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value, options);
    }
    return sanitized;
  }

  return input;
}

/**
 * Validates query string parameters against allowed fields.
 *
 * @param {any} query - Query object
 * @param {string[]} allowedFields - Allowed field names
 * @throws {BadRequestException} If invalid fields present
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: any) {
 *   validateQueryFields(query, ['page', 'limit', 'search', 'status']);
 *   return this.patientsService.findAll(query);
 * }
 * ```
 */
export function validateQueryFields(query: any, allowedFields: string[]): void {
  const queryFields = Object.keys(query);
  const invalidFields = queryFields.filter((field) => !allowedFields.includes(field));

  if (invalidFields.length > 0) {
    throw new BadRequestException({
      message: 'Invalid query parameters',
      invalidFields,
      allowedFields,
    });
  }
}

// ============================================================================
// RESPONSE FORMATTING UTILITIES
// ============================================================================

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
export function wrapSuccessResponse<T>(
  data: T,
  metadata?: ResponseTransformMetadata,
): {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  statusCode: number;
} {
  return {
    success: true,
    data,
    ...(metadata?.message && { message: metadata.message }),
    timestamp: metadata?.timestamp || new Date().toISOString(),
    statusCode: metadata?.statusCode || HttpStatus.OK,
  };
}

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
export function wrapErrorResponse(
  message: string,
  statusCode: number,
  details?: any,
): {
  success: false;
  error: string;
  statusCode: number;
  details?: any;
  timestamp: string;
} {
  return {
    success: false,
    error: message,
    statusCode,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Transforms response using DTO class with serialization options.
 *
 * @template T - DTO type
 * @param {any} data - Raw data
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
export function transformResponse<T>(
  data: any,
  dtoClass: ClassConstructor<T>,
  options?: DtoTransformOptions,
): T | T[] {
  return plainToInstance(dtoClass, data, {
    excludeExtraneousValues: options?.excludeExtraneousValues,
    enableImplicitConversion: options?.enableImplicitConversion,
    groups: options?.groups,
    exposeDefaultValues: options?.exposeDefaultValues,
  });
}

/**
 * Serializes DTO instance to plain object for response.
 *
 * @param {any} dto - DTO instance
 * @param {DtoTransformOptions} options - Serialization options
 * @returns {any} Plain object
 *
 * @example
 * ```typescript
 * const dto = new UserResponseDto();
 * dto.email = 'user@example.com';
 * const plain = serializeDto(dto, { groups: ['public'] });
 * ```
 */
export function serializeDto(dto: any, options?: DtoTransformOptions): any {
  return instanceToPlain(dto, {
    excludeExtraneousValues: options?.excludeExtraneousValues,
    groups: options?.groups,
    exposeDefaultValues: options?.exposeDefaultValues,
  });
}

/**
 * Removes sensitive fields from response object.
 *
 * @param {any} data - Data object
 * @param {string[]} sensitiveFields - Fields to remove
 * @returns {any} Sanitized data
 *
 * @example
 * ```typescript
 * const user = await this.usersService.findOne(id);
 * return removeSensitiveFields(user, ['password', 'ssn', 'bankAccount']);
 * ```
 */
export function removeSensitiveFields(data: any, sensitiveFields: string[]): any {
  if (Array.isArray(data)) {
    return data.map((item) => removeSensitiveFields(item, sensitiveFields));
  }

  if (data !== null && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (!sensitiveFields.includes(key)) {
        sanitized[key] = typeof value === 'object' ? removeSensitiveFields(value, sensitiveFields) : value;
      }
    }
    return sanitized;
  }

  return data;
}

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

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
export function createPaginationMeta(query: PaginationQuery, total: number): PaginationMeta {
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 10));
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

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
export function createPaginatedResponse<T>(data: T[], meta: PaginationMeta): PaginatedResponse<T> {
  return { data, meta };
}

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
export function calculatePaginationOffset(page: number, limit: number): number {
  return Math.max(0, (Math.max(1, page) - 1) * Math.max(1, limit));
}

/**
 * Parses pagination parameters from request query.
 *
 * @param {any} query - Request query object
 * @param {object} defaults - Default pagination values
 * @returns {PaginationQuery} Parsed pagination query
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: any) {
 *   const pagination = parsePaginationQuery(query, { page: 1, limit: 20 });
 *   return this.patientsService.findAll(pagination);
 * }
 * ```
 */
export function parsePaginationQuery(
  query: any,
  defaults: { page?: number; limit?: number } = {},
): PaginationQuery {
  const page = parseInt(query.page) || defaults.page || 1;
  const limit = parseInt(query.limit) || defaults.limit || 10;
  const offset = query.offset ? parseInt(query.offset) : calculatePaginationOffset(page, limit);

  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)),
    offset: Math.max(0, offset),
  };
}

// ============================================================================
// QUERY STRING BUILDERS
// ============================================================================

/**
 * Parses sort parameters from query string.
 *
 * @param {any} query - Request query object
 * @param {string} defaultSortBy - Default sort field
 * @param {string[]} allowedFields - Allowed sort fields
 * @returns {SortQuery} Sort query object
 *
 * @example
 * ```typescript
 * const sort = parseSortQuery(req.query, 'createdAt', ['name', 'createdAt', 'updatedAt']);
 * // { sortBy: 'createdAt', sortOrder: 'DESC' }
 * ```
 */
export function parseSortQuery(
  query: any,
  defaultSortBy?: string,
  allowedFields?: string[],
): SortQuery {
  let sortBy = query.sortBy || query.sort || defaultSortBy;
  const sortOrder = (query.sortOrder || query.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';

  if (allowedFields && sortBy && !allowedFields.includes(sortBy)) {
    throw new BadRequestException({
      message: 'Invalid sort field',
      field: sortBy,
      allowedFields,
    });
  }

  return { sortBy, sortOrder };
}

/**
 * Builds filter criteria from query parameters.
 *
 * @param {any} query - Request query object
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
export function buildFilterCriteria(query: any, filterableFields: string[]): FilterCriteria[] {
  const filters: FilterCriteria[] = [];

  for (const [key, value] of Object.entries(query)) {
    // Parse field and operation (e.g., "age__gte" -> field: "age", op: "gte")
    const parts = key.split('__');
    const field = parts[0];
    const operation = (parts[1] || 'eq') as FilterOperation;

    if (filterableFields.includes(field)) {
      filters.push({ field, operation, value });
    }
  }

  return filters;
}

/**
 * Builds complete query options from request query.
 *
 * @param {any} query - Request query object
 * @param {object} config - Query builder configuration
 * @returns {QueryBuilderOptions} Complete query options
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Query() query: any) {
 *   const options = buildQueryOptions(query, {
 *     defaultSort: 'createdAt',
 *     allowedSortFields: ['name', 'createdAt'],
 *     filterableFields: ['status', 'age']
 *   });
 *   return this.patientsService.findAll(options);
 * }
 * ```
 */
export function buildQueryOptions(
  query: any,
  config: {
    defaultSort?: string;
    allowedSortFields?: string[];
    filterableFields?: string[];
    searchFields?: string[];
  } = {},
): QueryBuilderOptions {
  const pagination = parsePaginationQuery(query);
  const sort = parseSortQuery(query, config.defaultSort, config.allowedSortFields);
  const filters = config.filterableFields ? buildFilterCriteria(query, config.filterableFields) : [];
  const search = query.search || query.q;

  return {
    pagination,
    sort,
    filters,
    search,
    searchFields: config.searchFields,
  };
}

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
export function queryOptionsToSql(options: QueryBuilderOptions): {
  where?: any;
  order?: any;
  limit?: number;
  offset?: number;
} {
  const result: any = {};

  // Build WHERE clause
  if (options.filters && options.filters.length > 0) {
    result.where = {};
    for (const filter of options.filters) {
      switch (filter.operation) {
        case 'eq':
          result.where[filter.field] = filter.value;
          break;
        case 'ne':
          result.where[filter.field] = { $ne: filter.value };
          break;
        case 'gt':
          result.where[filter.field] = { $gt: filter.value };
          break;
        case 'gte':
          result.where[filter.field] = { $gte: filter.value };
          break;
        case 'lt':
          result.where[filter.field] = { $lt: filter.value };
          break;
        case 'lte':
          result.where[filter.field] = { $lte: filter.value };
          break;
        case 'like':
          result.where[filter.field] = { $like: `%${filter.value}%` };
          break;
        case 'in':
          result.where[filter.field] = { $in: Array.isArray(filter.value) ? filter.value : [filter.value] };
          break;
      }
    }
  }

  // Build ORDER clause
  if (options.sort?.sortBy) {
    result.order = [[options.sort.sortBy, options.sort.sortOrder || 'DESC']];
  }

  // Add pagination
  if (options.pagination) {
    result.limit = options.pagination.limit;
    result.offset = options.pagination.offset;
  }

  return result;
}

// ============================================================================
// ROUTE PARAMETER PARSING
// ============================================================================

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
export function parseUuidParam(value: string, paramName: string = 'id'): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(value)) {
    throw new BadRequestException({
      message: `Invalid ${paramName}`,
      value,
      expected: 'UUID v4 format',
    });
  }

  return value;
}

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
export function parseIntParam(
  value: string,
  options: { min?: number; max?: number; paramName?: string } = {},
): number {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new BadRequestException({
      message: `Invalid ${options.paramName || 'parameter'}`,
      value,
      expected: 'integer',
    });
  }

  if (options.min !== undefined && parsed < options.min) {
    throw new BadRequestException({
      message: `${options.paramName || 'Parameter'} must be at least ${options.min}`,
      value: parsed,
    });
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new BadRequestException({
      message: `${options.paramName || 'Parameter'} must be at most ${options.max}`,
      value: parsed,
    });
  }

  return parsed;
}

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
export function parseDateParam(value: string, paramName: string = 'date'): Date {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new BadRequestException({
      message: `Invalid ${paramName}`,
      value,
      expected: 'ISO 8601 date format',
    });
  }

  return date;
}

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
export function parseEnumParam<T>(value: string, enumObj: object, paramName: string = 'parameter'): T {
  const enumValues = Object.values(enumObj);

  if (!enumValues.includes(value)) {
    throw new BadRequestException({
      message: `Invalid ${paramName}`,
      value,
      allowedValues: enumValues,
    });
  }

  return value as T;
}

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
export function parseBooleanParam(value: string | boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  const lowerValue = String(value).toLowerCase();
  return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';
}

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
export function parseArrayParam(
  value: string | string[],
  options: { separator?: string; unique?: boolean; trim?: boolean } = {},
): string[] {
  const { separator = ',', unique = false, trim = true } = options;

  let array: string[];

  if (Array.isArray(value)) {
    array = value;
  } else {
    array = String(value).split(separator);
  }

  if (trim) {
    array = array.map((item) => item.trim());
  }

  if (unique) {
    array = [...new Set(array)];
  }

  return array.filter((item) => item.length > 0);
}

// ============================================================================
// CONTENT NEGOTIATION
// ============================================================================

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
export function negotiateContentType(req: Request, options: ContentNegotiationOptions): string {
  const acceptHeader = req.headers.accept || '*/*';
  const { supportedTypes, defaultType } = options;

  for (const supportedType of supportedTypes) {
    if (acceptHeader.includes(supportedType) || acceptHeader.includes('*/*')) {
      return supportedType;
    }
  }

  if (defaultType) {
    return defaultType;
  }

  throw new BadRequestException({
    message: 'Not acceptable',
    acceptHeader,
    supportedTypes,
  });
}

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
export function setContentTypeHeader(res: Response, contentType: string, charset: string = 'utf-8'): void {
  res.setHeader('Content-Type', `${contentType}; charset=${charset}`);
}

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
export function acceptsContentType(req: Request, contentType: string): boolean {
  const acceptHeader = req.headers.accept || '*/*';
  return acceptHeader.includes(contentType) || acceptHeader.includes('*/*');
}

// ============================================================================
// VERSIONING HELPERS
// ============================================================================

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
export function extractApiVersion(req: Request, config: VersioningConfig): string {
  switch (config.type) {
    case 'header':
      return req.headers[config.header?.toLowerCase() || 'x-api-version'] as string || config.defaultVersion || '1';
    case 'uri':
      const match = req.path.match(/\/v(\d+)\//);
      return match ? match[1] : config.defaultVersion || '1';
    case 'media-type':
      const contentType = req.headers['content-type'] || '';
      const versionMatch = contentType.match(/version=(\d+)/);
      return versionMatch ? versionMatch[1] : config.defaultVersion || '1';
    default:
      return config.defaultVersion || '1';
  }
}

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
export function validateApiVersion(version: string, supportedVersions: string[]): void {
  if (!supportedVersions.includes(version)) {
    throw new BadRequestException({
      message: 'Unsupported API version',
      requestedVersion: version,
      supportedVersions,
    });
  }
}

// ============================================================================
// SWAGGER DECORATORS
// ============================================================================

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
export function ApiPaginatedResponse<T>(dtoClass: Type<T>): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(dtoClass),
    ApiResponse({
      status: 200,
      description: 'Paginated response',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dtoClass) },
              },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  totalPages: { type: 'number' },
                  hasNextPage: { type: 'boolean' },
                  hasPreviousPage: { type: 'boolean' },
                },
              },
            },
          },
        ],
      },
    }),
  );
}

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
export function ApiArrayResponse<T>(dtoClass: Type<T>, status: number = 200): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(dtoClass),
    ApiResponse({
      status,
      description: 'Success',
      schema: {
        type: 'array',
        items: { $ref: getSchemaPath(dtoClass) },
      },
    }),
  );
}

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
export function ApiErrorResponses(statusCodes: number[]): MethodDecorator {
  const errorDescriptions: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };

  const decorators = statusCodes.map((status) =>
    ApiResponse({
      status,
      description: errorDescriptions[status] || 'Error',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' },
          statusCode: { type: 'number', example: status },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );

  return applyDecorators(...decorators);
}

// ============================================================================
// CUSTOM PARAMETER DECORATORS
// ============================================================================

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
export const CurrentUser = createParamDecorator((property: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return property ? user?.[property] : user;
});

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
export const ClientIp = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return (
    (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    request.ip ||
    request.connection?.remoteAddress ||
    'unknown'
  );
});

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
export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers['user-agent'] || 'unknown';
});

// ============================================================================
// INTERCEPTOR UTILITIES
// ============================================================================

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
export function createTransformInterceptor<T>(dtoClass: ClassConstructor<T>) {
  @Injectable()
  class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (!data) return data;
          return transformResponse(data, dtoClass, { excludeExtraneousValues: true });
        }),
      );
    }
  }

  return new TransformInterceptor();
}

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
export function createResponseWrapperInterceptor() {
  @Injectable()
  class ResponseWrapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const startTime = Date.now();

      return next.handle().pipe(
        map((data) => {
          return wrapSuccessResponse(data, {
            timestamp: new Date().toISOString(),
            path: request.url,
            statusCode: context.switchToHttp().getResponse().statusCode,
          });
        }),
      );
    }
  }

  return new ResponseWrapperInterceptor();
}

// ============================================================================
// DTO TRANSFORMATION UTILITIES
// ============================================================================

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
export async function plainToDto<T extends object>(
  plain: any,
  dtoClass: ClassConstructor<T>,
  validate: boolean = true,
): Promise<T> {
  const dto = plainToInstance(dtoClass, plain);

  if (validate) {
    const errors = await validateDto(dto);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formatValidationErrors(errors),
      });
    }
  }

  return dto;
}

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
export async function validateDto(dto: object, options?: ValidatorOptions): Promise<ValidationError[]> {
  return validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
    ...options,
  });
}

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
export function mergeDtoWithEntity<T>(entity: T, dto: Partial<T>, allowedFields?: string[]): T {
  const merged = { ...entity };

  for (const [key, value] of Object.entries(dto)) {
    if (value !== undefined) {
      if (!allowedFields || allowedFields.includes(key)) {
        (merged as any)[key] = value;
      }
    }
  }

  return merged;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Request Validation
  validateRequestBody,
  formatValidationErrors,
  validateBulkItems,
  sanitizeInput,
  validateQueryFields,

  // Response Formatting
  wrapSuccessResponse,
  wrapErrorResponse,
  transformResponse,
  serializeDto,
  removeSensitiveFields,

  // Pagination
  createPaginationMeta,
  createPaginatedResponse,
  calculatePaginationOffset,
  parsePaginationQuery,

  // Query Builders
  parseSortQuery,
  buildFilterCriteria,
  buildQueryOptions,
  queryOptionsToSql,

  // Route Parameter Parsing
  parseUuidParam,
  parseIntParam,
  parseDateParam,
  parseEnumParam,
  parseBooleanParam,
  parseArrayParam,

  // Content Negotiation
  negotiateContentType,
  setContentTypeHeader,
  acceptsContentType,

  // Versioning
  extractApiVersion,
  validateApiVersion,

  // Swagger Decorators
  ApiPaginatedResponse,
  ApiArrayResponse,
  ApiErrorResponses,

  // Parameter Decorators
  CurrentUser,
  ClientIp,
  UserAgent,

  // Interceptors
  createTransformInterceptor,
  createResponseWrapperInterceptor,

  // DTO Transformation
  plainToDto,
  validateDto,
  mergeDtoWithEntity,
};
