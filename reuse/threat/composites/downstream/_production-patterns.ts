/**
 * LOC: PRODPAT001
 * File: /reuse/threat/composites/downstream/_production-patterns.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - All downstream composite files in this directory
 */

/**
 * File: /reuse/threat/composites/downstream/_production-patterns.ts
 * Locator: WC-PRODPAT-001
 * Purpose: Production Patterns - Shared utilities, decorators, error responses, and DTO base classes
 *
 * Upstream: NestJS framework libraries
 * Downstream: All downstream composites
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator
 * Exports: Standard error interfaces, response wrappers, utility functions, base classes
 *
 * LLM Context: Shared production-grade patterns for White Cross healthcare threat intelligence platform.
 * Provides centralized error handling, standard response formats, validation utilities, and logging
 * helpers to ensure consistency across all 45+ downstream composite files. Includes HIPAA-compliant
 * error handling that prevents information leakage while providing sufficient detail for debugging.
 * All files import from this module to maintain uniform patterns and reduce code duplication.
 */

import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsUUID,
  ValidationError,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// STANDARD ERROR INTERFACES
// ============================================================================

/**
 * Standard error response envelope
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: ApiError;
  timestamp: Date;
  path?: string;
  requestId?: string;
}

/**
 * Standard error details
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  context?: string;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
  field: string;
  constraint: string;
  value?: any;
}

/**
 * Standard 400 Bad Request error
 */
export class BadRequestError extends HttpException {
  constructor(message: string, details?: Record<string, any>) {
    super(
      {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        error: {
          code: 'BAD_REQUEST',
          message,
          details,
        },
        timestamp: new Date(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Standard 401 Unauthorized error
 */
export class UnauthorizedError extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(
      {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        error: {
          code: 'UNAUTHORIZED',
          message,
        },
        timestamp: new Date(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Standard 403 Forbidden error
 */
export class ForbiddenError extends HttpException {
  constructor(message: string = 'Access denied') {
    super(
      {
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        error: {
          code: 'FORBIDDEN',
          message,
        },
        timestamp: new Date(),
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Standard 404 Not Found error
 */
export class NotFoundError extends HttpException {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(
      {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        error: {
          code: 'NOT_FOUND',
          message,
        },
        timestamp: new Date(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Standard 409 Conflict error
 */
export class ConflictError extends HttpException {
  constructor(message: string) {
    super(
      {
        success: false,
        statusCode: HttpStatus.CONFLICT,
        error: {
          code: 'CONFLICT',
          message,
        },
        timestamp: new Date(),
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Standard 500 Internal Server error
 */
export class InternalServerError extends HttpException {
  constructor(message: string = 'Internal server error', requestId?: string) {
    super(
      {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          context: requestId,
        },
        timestamp: new Date(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

// ============================================================================
// STANDARD SUCCESS RESPONSE
// ============================================================================

/**
 * Standard success response envelope
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  statusCode: number;
  data: T;
  timestamp: Date;
  requestId?: string;
}

/**
 * Standard paginated response envelope
 */
export interface ApiPaginatedResponse<T = any> {
  success: true;
  statusCode: number;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
  };
  timestamp: Date;
  requestId?: string;
}

/**
 * Helper to create success response
 */
export function createSuccessResponse<T>(data: T, requestId?: string): ApiSuccessResponse<T> {
  return {
    success: true,
    statusCode: HttpStatus.OK,
    data,
    timestamp: new Date(),
    requestId,
  };
}

/**
 * Helper to create created response
 */
export function createCreatedResponse<T>(data: T, requestId?: string): ApiSuccessResponse<T> {
  return {
    success: true,
    statusCode: HttpStatus.CREATED,
    data,
    timestamp: new Date(),
    requestId,
  };
}

/**
 * Helper to create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  requestId?: string,
): ApiPaginatedResponse<T> {
  const totalPages = Math.ceil(total / pageSize);
  return {
    success: true,
    statusCode: HttpStatus.OK,
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
    },
    timestamp: new Date(),
    requestId,
  };
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Create logger for any class
 */
export function createLogger(className: string): Logger {
  return new Logger(className);
}

/**
 * Log operation with timing
 */
export function logOperation(
  logger: Logger,
  operation: string,
  context: string = 'Operation',
  metadata?: Record<string, any>,
): () => void {
  const startTime = Date.now();
  logger.log(`[${context}] Starting: ${operation}`, metadata ? JSON.stringify(metadata) : '');

  return () => {
    const duration = Date.now() - startTime;
    logger.log(`[${context}] Completed: ${operation} (${duration}ms)`);
  };
}

/**
 * Log error with context
 */
export function logError(
  logger: Logger,
  operation: string,
  error: Error,
  context: string = 'Error',
  metadata?: Record<string, any>,
): void {
  logger.error(
    `[${context}] Failed: ${operation}\nError: ${error.message}`,
    metadata ? JSON.stringify(metadata) : '',
  );
}

// ============================================================================
// COMMON DTO BASE CLASSES
// ============================================================================

/**
 * Base DTO with common properties
 */
export abstract class BaseDto {
  @ApiPropertyOptional({ description: 'Request correlation ID', example: 'req-123-abc' })
  @IsUUID()
  @IsOptional()
  requestId?: string;

  @ApiPropertyOptional({ description: 'Metadata for request', example: {} })
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Base entity with timestamps
 */
export abstract class BaseEntity {
  @ApiProperty({ description: 'Unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @IsDate()
  updatedAt: Date;
}

/**
 * Standard pagination DTO
 */
export class PaginationDto {
  @ApiProperty({ description: 'Page number (1-indexed)', example: 1, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiProperty({ description: 'Number of items per page', example: 20, default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize: number = 20;

  @ApiProperty({ description: 'Sort field', example: 'createdAt', required: false })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ description: 'Sort direction', example: 'DESC', enum: ['ASC', 'DESC'], required: false })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortDirection?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * Standard filter DTO
 */
export class FilterDto {
  @ApiProperty({ description: 'Search query', example: 'threat', required: false })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ description: 'Filter by status', example: 'active', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Filter by severity', example: 'HIGH', required: false })
  @IsString()
  @IsOptional()
  severity?: string;

  @ApiProperty({ description: 'Start date (ISO 8601)', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: 'End date (ISO 8601)', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

// ============================================================================
// HIPAA-COMPLIANCE UTILITIES
// ============================================================================

/**
 * HIPAA-safe error message that prevents PHI leakage
 */
export function sanitizeErrorForHIPAA(error: Error, requestId?: string): ApiErrorResponse {
  // Never expose internal error details in HIPAA context
  return {
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An error occurred processing your request',
      context: requestId,
    },
    timestamp: new Date(),
    requestId,
  };
}

/**
 * Verify HIPAA audit logging requirements
 */
export interface HIPAAAuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  status: 'SUCCESS' | 'FAILURE';
  result?: 'ALLOWED' | 'DENIED';
  requestId: string;
}

/**
 * Create HIPAA audit log entry
 */
export function createHIPAALog(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  status: 'SUCCESS' | 'FAILURE',
  requestId: string,
  result?: 'ALLOWED' | 'DENIED',
): HIPAAAuditLog {
  return {
    timestamp: new Date(),
    userId,
    action,
    resourceType,
    resourceId,
    status,
    result,
    requestId,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse validation errors
 */
export function parseValidationErrors(errors: ValidationError[]): ValidationErrorResponse[] {
  const result: ValidationErrorResponse[] = [];

  for (const error of errors) {
    if (error.constraints) {
      for (const [constraint, message] of Object.entries(error.constraints)) {
        result.push({
          field: error.property,
          constraint,
          value: error.value,
        });
      }
    }
  }

  return result;
}

/**
 * Check if value is UUID
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Safe JSON stringify (prevents circular references)
 */
export function safeStringify(obj: any, maxDepth: number = 3, currentDepth: number = 0): string {
  if (currentDepth >= maxDepth) {
    return '[Object]';
  }

  if (obj === null || obj === undefined) {
    return String(obj);
  }

  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => safeStringify(item, maxDepth, currentDepth + 1)).join(', ') + ']';
  }

  const entries = Object.entries(obj).map(
    ([key, value]) => `${key}: ${safeStringify(value, maxDepth, currentDepth + 1)}`,
  );

  return '{' + entries.join(', ') + '}';
}

// ============================================================================
// COMMON ENUMS
// ============================================================================

/**
 * Standard severity levels
 */
export enum SeverityLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Standard status types
 */
export enum StatusType {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Standard result types
 */
export enum ResultType {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL = 'PARTIAL',
  UNKNOWN = 'UNKNOWN',
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Error responses
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,

  // Success responses
  createSuccessResponse,
  createCreatedResponse,
  createPaginatedResponse,

  // Logging
  createLogger,
  logOperation,
  logError,

  // DTOs
  BaseDto,
  BaseEntity,
  PaginationDto,
  FilterDto,

  // HIPAA
  createHIPAALog,
  sanitizeErrorForHIPAA,

  // Utilities
  generateRequestId,
  parseValidationErrors,
  isValidUUID,
  safeStringify,

  // Enums
  SeverityLevel,
  StatusType,
  ResultType,
};
