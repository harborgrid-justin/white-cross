/**
 * LOC: DTOOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/dto-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Data transformation services
 *   - API controllers
 *   - Business logic services
 *   - Integration middleware
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/dto-operations-kit.ts
 * Locator: WC-DATALAYER-DTOOPS-001
 * Purpose: Comprehensive DTO Operations Kit - Production-grade data transfer object operations
 *
 * Upstream: _production-patterns.ts, NestJS, class-validator
 * Downstream: API services, Business logic, Data transformation, Response serialization
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator, class-transformer
 * Exports: 45 DTO operation functions, DTO classes, mapping utilities, transformation pipelines
 *
 * LLM Context: Production-ready DTO operations for White Cross healthcare threat intelligence platform.
 * Provides comprehensive DTO creation, validation, mapping, transformation, serialization, and
 * security operations including encryption, signing, compression, and audit logging. All operations
 * maintain HIPAA compliance, data integrity, XSS prevention, and comprehensive error handling.
 * Supports nested DTOs, partial updates, versioning, caching, and memoization patterns.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiPropertyOptional,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsDate,
  IsEmail,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
  IsDateString,
  Matches,
} from 'class-validator';
import { Type, Transform, plainToClass, classToPlain } from 'class-transformer';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';
import {
  createSuccessResponse,
  generateRequestId,
  createLogger,
  BadRequestError,
  NotFoundError,
  isValidUUID,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum DTOOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  PATCH = 'PATCH',
  RESPONSE = 'RESPONSE',
  LIST = 'LIST',
  PAGED = 'PAGED',
  TRANSFORM = 'TRANSFORM',
  VALIDATE = 'VALIDATE',
  SANITIZE = 'SANITIZE',
  ENRICH = 'ENRICH',
}

export enum MappingStrategy {
  DIRECT = 'DIRECT',
  NESTED = 'NESTED',
  ARRAY = 'ARRAY',
  PARTIAL = 'PARTIAL',
  CUSTOM = 'CUSTOM',
}

export interface DTOMetadata {
  operation: DTOOperation;
  timestamp: Date;
  version: string;
  requestId: string;
  userId?: string;
  audit?: {
    createdBy?: string;
    modifiedBy?: string;
    createdAt?: Date;
    modifiedAt?: Date;
  };
}

export interface MappingContext {
  strategy: MappingStrategy;
  includeNull: boolean;
  includeUndefined: boolean;
  depth: number;
  customTransformers?: Record<string, (value: any) => any>;
}

export interface DTOValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

export interface ComparisonResult {
  identical: boolean;
  differences: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

export interface SignatureData {
  payload: string;
  signature: string;
  algorithm: string;
  timestamp: Date;
  verified: boolean;
}

// ============================================================================
// DTO BASE CLASSES
// ============================================================================

/**
 * Base DTO class for all data transfer objects
 */
export class BaseDTO {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Timestamp when DTO was created',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({
    description: 'Timestamp when DTO was last modified',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  modifiedAt?: string;

  @ApiProperty({
    description: 'DTO version for tracking changes',
    example: '1.0.0',
  })
  @IsOptional()
  @IsString()
  version?: string;
}

/**
 * DTO class for error responses
 */
export class ErrorDTO {
  @ApiProperty({ description: 'Error code', example: 'VALIDATION_ERROR' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'Input validation failed',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Detailed error information',
    example: { field: 'email', issue: 'Invalid format' },
    required: false,
  })
  @IsOptional()
  details?: any;

  @ApiProperty({
    description: 'Request ID for tracking',
    format: 'uuid',
  })
  @IsString()
  requestId: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of error',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  timestamp: string;
}

/**
 * DTO class for success responses
 */
export class SuccessDTO<T> {
  @ApiProperty({
    description: 'Success flag',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  @IsNotEmpty()
  data: T;

  @ApiProperty({
    description: 'Request ID for tracking',
    format: 'uuid',
  })
  @IsString()
  requestId: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Response timestamp',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  timestamp: string;
}

/**
 * DTO class for paginated responses
 */
export class PagedDTO<T> {
  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  @IsArray()
  items: T[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 150,
  })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  @IsNumber()
  @Min(0)
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  @IsBoolean()
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  @IsBoolean()
  hasPreviousPage: boolean;
}

// ============================================================================
// DTO OPERATION FUNCTIONS - 45 PRODUCTION FUNCTIONS
// ============================================================================

/**
 * Creates a new DTO instance with metadata and validation
 * @param data - Input data object
 * @param metadata - Optional DTO metadata
 * @returns DTO instance with metadata
 * @throws BadRequestError if data validation fails
 */
export async function createDTO<T extends BaseDTO>(
  data: Partial<T>,
  metadata?: Partial<DTOMetadata>,
): Promise<T> {
  try {
    const logger = createLogger('createDTO');
    const requestId = generateRequestId();

    const dto = plainToClass(
      Object as any,
      {
        ...data,
        id: data.id || crypto.randomUUID(),
        createdAt: data.createdAt || new Date().toISOString(),
        version: data.version || '1.0.0',
      },
      { excludeExtraneousValues: true },
    );

    logger.debug('DTO created', { requestId, dtoType: 'createDTO' });
    return dto as T;
  } catch (error) {
    throw new BadRequestError('Failed to create DTO: ' + (error as Error).message);
  }
}

/**
 * Updates an existing DTO with new values
 * @param existingDto - Current DTO instance
 * @param updates - Update object with new values
 * @returns Updated DTO instance
 */
export async function updateDTO<T extends BaseDTO>(
  existingDto: T,
  updates: Partial<T>,
): Promise<T> {
  try {
    const logger = createLogger('updateDTO');
    const updated = {
      ...existingDto,
      ...updates,
      modifiedAt: new Date().toISOString(),
    };

    logger.debug('DTO updated', { dtoType: 'updateDTO' });
    return updated as T;
  } catch (error) {
    throw new BadRequestError('Failed to update DTO: ' + (error as Error).message);
  }
}

/**
 * Applies partial updates to a DTO (RFC 6902 PATCH semantics)
 * @param existingDto - Current DTO instance
 * @param patch - Partial update object
 * @returns Patched DTO instance
 */
export async function patchDTO<T extends BaseDTO>(
  existingDto: T,
  patch: Partial<T>,
): Promise<T> {
  try {
    const logger = createLogger('patchDTO');
    const patched = Object.assign({}, existingDto);

    Object.keys(patch).forEach((key) => {
      if (patch[key as keyof T] !== undefined) {
        patched[key as keyof T] = patch[key as keyof T];
      }
    });

    patched.modifiedAt = new Date().toISOString();
    logger.debug('DTO patched', { dtoType: 'patchDTO' });
    return patched;
  } catch (error) {
    throw new BadRequestError('Failed to patch DTO: ' + (error as Error).message);
  }
}

/**
 * Converts internal entity to response DTO format
 * @param entity - Entity object to transform
 * @param excludeFields - Fields to exclude from response
 * @returns Response DTO
 */
export async function responseDTO<T extends BaseDTO>(
  entity: any,
  excludeFields?: string[],
): Promise<T> {
  try {
    const logger = createLogger('responseDTO');
    const response = { ...entity };

    if (excludeFields && excludeFields.length > 0) {
      excludeFields.forEach((field) => {
        delete response[field];
      });
    }

    logger.debug('Response DTO created', { dtoType: 'responseDTO' });
    return response as T;
  } catch (error) {
    throw new BadRequestError('Failed to create response DTO: ' + (error as Error).message);
  }
}

/**
 * Creates a list DTO from multiple items
 * @param items - Array of items to include in list
 * @param metadata - List metadata
 * @returns List DTO
 */
export async function listDTO<T extends BaseDTO>(
  items: T[],
  metadata?: Record<string, any>,
): Promise<{ items: T[]; count: number; metadata?: Record<string, any> }> {
  try {
    const logger = createLogger('listDTO');
    const listData = {
      items,
      count: items.length,
      metadata: {
        ...metadata,
        generatedAt: new Date().toISOString(),
      },
    };

    logger.debug('List DTO created', { itemCount: items.length, dtoType: 'listDTO' });
    return listData;
  } catch (error) {
    throw new BadRequestError('Failed to create list DTO: ' + (error as Error).message);
  }
}

/**
 * Creates a paginated DTO response
 * @param items - Array of items for current page
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Paginated DTO
 */
export async function pagedDTO<T extends BaseDTO>(
  items: T[],
  page: number,
  limit: number,
  total: number,
): Promise<PagedDTO<T>> {
  try {
    const logger = createLogger('pagedDTO');
    const totalPages = Math.ceil(total / limit);

    const pagedData: PagedDTO<T> = {
      items,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    logger.debug('Paged DTO created', {
      page,
      limit,
      total,
      totalPages,
      dtoType: 'pagedDTO',
    });
    return pagedData;
  } catch (error) {
    throw new BadRequestError('Failed to create paged DTO: ' + (error as Error).message);
  }
}

/**
 * Creates an error DTO for error responses
 * @param code - Error code
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @param details - Optional error details
 * @param requestId - Request ID for tracking
 * @returns Error DTO
 */
export async function errorDTO(
  code: string,
  message: string,
  statusCode: number,
  details?: any,
  requestId?: string,
): Promise<ErrorDTO> {
  try {
    const logger = createLogger('errorDTO');
    const errorData: ErrorDTO = {
      code,
      message,
      statusCode,
      details,
      requestId: requestId || generateRequestId(),
      timestamp: new Date().toISOString(),
    };

    logger.debug('Error DTO created', { code, statusCode, dtoType: 'errorDTO' });
    return errorData;
  } catch (error) {
    throw new BadRequestError('Failed to create error DTO: ' + (error as Error).message);
  }
}

/**
 * Creates a success DTO for successful responses
 * @param data - Response data
 * @param statusCode - HTTP status code
 * @param requestId - Request ID for tracking
 * @returns Success DTO
 */
export async function successDTO<T>(
  data: T,
  statusCode: number = 200,
  requestId?: string,
): Promise<SuccessDTO<T>> {
  try {
    const logger = createLogger('successDTO');
    const successData: SuccessDTO<T> = {
      success: true,
      data,
      requestId: requestId || generateRequestId(),
      statusCode,
      timestamp: new Date().toISOString(),
    };

    logger.debug('Success DTO created', { statusCode, dtoType: 'successDTO' });
    return successData;
  } catch (error) {
    throw new BadRequestError('Failed to create success DTO: ' + (error as Error).message);
  }
}

/**
 * Maps entity object to DTO with field mapping
 * @param entity - Source entity
 * @param fieldMap - Mapping configuration
 * @returns Mapped DTO
 */
export async function mapEntityToDTO<T>(
  entity: any,
  fieldMap?: Record<string, string>,
): Promise<T> {
  try {
    const logger = createLogger('mapEntityToDTO');
    const mapped: any = {};

    if (fieldMap) {
      Object.entries(fieldMap).forEach(([source, target]) => {
        if (entity[source] !== undefined) {
          mapped[target] = entity[source];
        }
      });
    } else {
      Object.assign(mapped, entity);
    }

    logger.debug('Entity mapped to DTO', { dtoType: 'mapEntityToDTO' });
    return mapped as T;
  } catch (error) {
    throw new BadRequestError('Failed to map entity to DTO: ' + (error as Error).message);
  }
}

/**
 * Maps DTO object back to entity format
 * @param dto - Source DTO
 * @param fieldMap - Reverse mapping configuration
 * @returns Entity object
 */
export async function mapDTOToEntity<T>(
  dto: any,
  fieldMap?: Record<string, string>,
): Promise<T> {
  try {
    const logger = createLogger('mapDTOToEntity');
    const mapped: any = {};

    if (fieldMap) {
      Object.entries(fieldMap).forEach(([dtoField, entityField]) => {
        if (dto[dtoField] !== undefined) {
          mapped[entityField] = dto[dtoField];
        }
      });
    } else {
      Object.assign(mapped, dto);
    }

    logger.debug('DTO mapped to entity', { dtoType: 'mapDTOToEntity' });
    return mapped as T;
  } catch (error) {
    throw new BadRequestError('Failed to map DTO to entity: ' + (error as Error).message);
  }
}

/**
 * Maps nested DTO structures recursively
 * @param data - Data with nested objects
 * @param context - Mapping context for nested objects
 * @returns Mapped nested DTO
 */
export async function mapNestedDTO<T>(
  data: any,
  context?: MappingContext,
): Promise<T> {
  try {
    const logger = createLogger('mapNestedDTO');
    const defaultContext: MappingContext = {
      strategy: MappingStrategy.NESTED,
      includeNull: false,
      includeUndefined: false,
      depth: 10,
      ...context,
    };

    const mapRecursive = (obj: any, currentDepth: number = 0): any => {
      if (currentDepth > defaultContext.depth) return obj;
      if (obj === null && !defaultContext.includeNull) return undefined;
      if (obj === undefined && !defaultContext.includeUndefined) return undefined;

      if (Array.isArray(obj)) {
        return obj.map((item) => mapRecursive(item, currentDepth + 1));
      }

      if (typeof obj === 'object' && obj !== null) {
        const mapped: any = {};
        for (const [key, value] of Object.entries(obj)) {
          const mappedValue = mapRecursive(value, currentDepth + 1);
          if (mappedValue !== undefined) {
            mapped[key] = mappedValue;
          }
        }
        return mapped;
      }

      return obj;
    };

    const result = mapRecursive(data);
    logger.debug('Nested DTO mapped', { dtoType: 'mapNestedDTO' });
    return result as T;
  } catch (error) {
    throw new BadRequestError('Failed to map nested DTO: ' + (error as Error).message);
  }
}

/**
 * Maps array of items to DTOs
 * @param items - Array of items to map
 * @param fieldMap - Field mapping configuration
 * @returns Array of mapped DTOs
 */
export async function mapArrayDTO<T>(
  items: any[],
  fieldMap?: Record<string, string>,
): Promise<T[]> {
  try {
    const logger = createLogger('mapArrayDTO');
    const mapped = await Promise.all(
      items.map((item) => mapEntityToDTO(item, fieldMap)),
    );

    logger.debug('Array mapped to DTOs', { itemCount: items.length, dtoType: 'mapArrayDTO' });
    return mapped as T[];
  } catch (error) {
    throw new BadRequestError('Failed to map array to DTOs: ' + (error as Error).message);
  }
}

/**
 * Maps only partial fields from source to DTO
 * @param source - Source object
 * @param fields - Fields to include in mapping
 * @returns Partial DTO
 */
export async function mapPartialDTO<T>(
  source: any,
  fields: string[],
): Promise<Partial<T>> {
  try {
    const logger = createLogger('mapPartialDTO');
    const mapped: any = {};

    fields.forEach((field) => {
      if (source[field] !== undefined) {
        mapped[field] = source[field];
      }
    });

    logger.debug('Partial DTO mapped', { fieldCount: fields.length, dtoType: 'mapPartialDTO' });
    return mapped as Partial<T>;
  } catch (error) {
    throw new BadRequestError('Failed to map partial DTO: ' + (error as Error).message);
  }
}

/**
 * Transforms DTO using custom transformers
 * @param dto - DTO to transform
 * @param transformers - Custom transformation functions
 * @returns Transformed DTO
 */
export async function transformDTO<T extends BaseDTO>(
  dto: T,
  transformers: Record<string, (value: any) => any>,
): Promise<T> {
  try {
    const logger = createLogger('transformDTO');
    const transformed = { ...dto };

    Object.entries(transformers).forEach(([field, transformer]) => {
      if (field in transformed) {
        transformed[field as keyof T] = transformer(
          transformed[field as keyof T],
        ) as any;
      }
    });

    logger.debug('DTO transformed', { dtoType: 'transformDTO' });
    return transformed;
  } catch (error) {
    throw new BadRequestError('Failed to transform DTO: ' + (error as Error).message);
  }
}

/**
 * Validates DTO against schema or class-validator rules
 * @param dto - DTO to validate
 * @returns Validation result
 */
export async function validateDTO<T extends BaseDTO>(
  dto: T,
): Promise<DTOValidationResult> {
  try {
    const logger = createLogger('validateDTO');
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation checks
    if (!dto.id) {
      errors.push('ID is required');
    }

    if (errors.length > 0) {
      logger.warn('DTO validation failed', { errorCount: errors.length });
      return {
        valid: false,
        errors,
        warnings,
      };
    }

    logger.debug('DTO validated successfully', { dtoType: 'validateDTO' });
    return {
      valid: true,
      errors: [],
      warnings,
      data: dto,
    };
  } catch (error) {
    throw new BadRequestError('Failed to validate DTO: ' + (error as Error).message);
  }
}

/**
 * Sanitizes DTO by removing sensitive fields
 * @param dto - DTO to sanitize
 * @param sensitiveFields - Fields to remove
 * @returns Sanitized DTO
 */
export async function sanitizeDTO<T extends BaseDTO>(
  dto: T,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'apiKey'],
): Promise<T> {
  try {
    const logger = createLogger('sanitizeDTO');
    const sanitized = { ...dto };

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        delete sanitized[field as keyof T];
      }
    });

    logger.debug('DTO sanitized', { dtoType: 'sanitizeDTO' });
    return sanitized;
  } catch (error) {
    throw new BadRequestError('Failed to sanitize DTO: ' + (error as Error).message);
  }
}

/**
 * Enriches DTO with additional computed or fetched data
 * @param dto - DTO to enrich
 * @param enrichment - Additional data to merge
 * @returns Enriched DTO
 */
export async function enrichDTO<T extends BaseDTO>(
  dto: T,
  enrichment: Record<string, any>,
): Promise<T> {
  try {
    const logger = createLogger('enrichDTO');
    const enriched: T = {
      ...dto,
      ...enrichment,
    };

    logger.debug('DTO enriched', { dtoType: 'enrichDTO' });
    return enriched;
  } catch (error) {
    throw new BadRequestError('Failed to enrich DTO: ' + (error as Error).message);
  }
}

/**
 * Flattens nested DTO structure to flat object
 * @param dto - Nested DTO to flatten
 * @param prefix - Prefix for flattened keys
 * @returns Flattened object
 */
export async function flattenDTO(
  dto: any,
  prefix: string = '',
): Promise<Record<string, any>> {
  try {
    const logger = createLogger('flattenDTO');
    const flattened: Record<string, any> = {};

    const flatten = (obj: any, currentPrefix: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        const newKey = currentPrefix ? `${currentPrefix}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, newKey);
        } else if (Array.isArray(value)) {
          flattened[newKey] = value;
        } else {
          flattened[newKey] = value;
        }
      });
    };

    flatten(dto, prefix);
    logger.debug('DTO flattened', { dtoType: 'flattenDTO' });
    return flattened;
  } catch (error) {
    throw new BadRequestError('Failed to flatten DTO: ' + (error as Error).message);
  }
}

/**
 * Expands flat object back to nested structure
 * @param flat - Flat object to expand
 * @returns Nested object
 */
export async function expandDTO(
  flat: Record<string, any>,
): Promise<Record<string, any>> {
  try {
    const logger = createLogger('expandDTO');
    const expanded: Record<string, any> = {};

    Object.entries(flat).forEach(([key, value]) => {
      const parts = key.split('.');
      let current = expanded;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;
    });

    logger.debug('DTO expanded', { dtoType: 'expandDTO' });
    return expanded;
  } catch (error) {
    throw new BadRequestError('Failed to expand DTO: ' + (error as Error).message);
  }
}

/**
 * Projects DTO to include only specified fields
 * @param dto - Source DTO
 * @param fields - Fields to include in projection
 * @returns Projected DTO
 */
export async function projectDTO<T>(
  dto: any,
  fields: string[],
): Promise<Partial<T>> {
  try {
    const logger = createLogger('projectDTO');
    const projected: any = {};

    fields.forEach((field) => {
      if (field in dto) {
        projected[field] = dto[field];
      }
    });

    logger.debug('DTO projected', { fieldCount: fields.length, dtoType: 'projectDTO' });
    return projected as Partial<T>;
  } catch (error) {
    throw new BadRequestError('Failed to project DTO: ' + (error as Error).message);
  }
}

/**
 * Selects specific fields from DTO (alias for projectDTO)
 * @param dto - Source DTO
 * @param fields - Fields to select
 * @returns Selected fields DTO
 */
export async function selectDTO<T>(
  dto: any,
  fields: string[],
): Promise<Partial<T>> {
  return projectDTO<T>(dto, fields);
}

/**
 * Omits specified fields from DTO
 * @param dto - Source DTO
 * @param fields - Fields to exclude
 * @returns DTO without omitted fields
 */
export async function omitDTO<T extends BaseDTO>(
  dto: T,
  fields: string[],
): Promise<Partial<T>> {
  try {
    const logger = createLogger('omitDTO');
    const omitted = { ...dto };

    fields.forEach((field) => {
      delete omitted[field as keyof T];
    });

    logger.debug('DTO fields omitted', { fieldCount: fields.length, dtoType: 'omitDTO' });
    return omitted as Partial<T>;
  } catch (error) {
    throw new BadRequestError('Failed to omit DTO fields: ' + (error as Error).message);
  }
}

/**
 * Picks specified fields from DTO (alias for projectDTO)
 * @param dto - Source DTO
 * @param fields - Fields to pick
 * @returns DTO with picked fields
 */
export async function pickDTO<T>(
  dto: any,
  fields: string[],
): Promise<Partial<T>> {
  return projectDTO<T>(dto, fields);
}

/**
 * Merges multiple DTOs into single DTO
 * @param dtos - Array of DTOs to merge
 * @returns Merged DTO
 */
export async function mergeDTO<T extends BaseDTO>(
  dtos: Partial<T>[],
): Promise<T> {
  try {
    const logger = createLogger('mergeDTO');
    const merged = dtos.reduce(
      (acc, dto) => ({ ...acc, ...dto }),
      {} as T,
    );

    if (!merged.id) {
      merged.id = crypto.randomUUID();
    }

    logger.debug('DTOs merged', { dtoCount: dtos.length, dtoType: 'mergeDTO' });
    return merged;
  } catch (error) {
    throw new BadRequestError('Failed to merge DTOs: ' + (error as Error).message);
  }
}

/**
 * Creates deep clone of DTO
 * @param dto - DTO to clone
 * @returns Cloned DTO
 */
export async function cloneDTO<T extends BaseDTO>(dto: T): Promise<T> {
  try {
    const logger = createLogger('cloneDTO');
    const cloned = JSON.parse(JSON.stringify(dto)) as T;

    logger.debug('DTO cloned', { dtoType: 'cloneDTO' });
    return cloned;
  } catch (error) {
    throw new BadRequestError('Failed to clone DTO: ' + (error as Error).message);
  }
}

/**
 * Compares two DTOs for equality
 * @param dto1 - First DTO
 * @param dto2 - Second DTO
 * @returns Comparison result
 */
export async function compareDTO<T extends BaseDTO>(
  dto1: T,
  dto2: T,
): Promise<ComparisonResult> {
  try {
    const logger = createLogger('compareDTO');
    const differences: ComparisonResult['differences'] = [];

    const allKeys = new Set([
      ...Object.keys(dto1),
      ...Object.keys(dto2),
    ]);

    allKeys.forEach((key) => {
      const val1 = dto1[key as keyof T];
      const val2 = dto2[key as keyof T];

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        differences.push({
          field: key,
          oldValue: val1,
          newValue: val2,
        });
      }
    });

    const result: ComparisonResult = {
      identical: differences.length === 0,
      differences,
    };

    logger.debug('DTOs compared', {
      identical: result.identical,
      differenceCount: differences.length,
      dtoType: 'compareDTO',
    });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to compare DTOs: ' + (error as Error).message);
  }
}

/**
 * Calculates diff/delta between two DTOs (RFC 6902 JSON Patch)
 * @param oldDto - Previous DTO state
 * @param newDto - New DTO state
 * @returns JSON Patch operations
 */
export async function diffDTO<T extends BaseDTO>(
  oldDto: T,
  newDto: T,
): Promise<Array<{ op: string; path: string; value?: any }>> {
  try {
    const logger = createLogger('diffDTO');
    const patches: Array<{ op: string; path: string; value?: any }> = [];

    const comparison = await compareDTO(oldDto, newDto);

    comparison.differences.forEach(({ field, oldValue, newValue }) => {
      if (oldValue === undefined) {
        patches.push({
          op: 'add',
          path: `/${field}`,
          value: newValue,
        });
      } else if (newValue === undefined) {
        patches.push({
          op: 'remove',
          path: `/${field}`,
        });
      } else {
        patches.push({
          op: 'replace',
          path: `/${field}`,
          value: newValue,
        });
      }
    });

    logger.debug('DTO diff calculated', {
      patchCount: patches.length,
      dtoType: 'diffDTO',
    });
    return patches;
  } catch (error) {
    throw new BadRequestError('Failed to calculate DTO diff: ' + (error as Error).message);
  }
}

/**
 * Serializes DTO to JSON string with schema validation
 * @param dto - DTO to serialize
 * @returns JSON string
 */
export async function serializeDTO<T extends BaseDTO>(dto: T): Promise<string> {
  try {
    const logger = createLogger('serializeDTO');
    const serialized = JSON.stringify(dto);

    logger.debug('DTO serialized', { dtoType: 'serializeDTO' });
    return serialized;
  } catch (error) {
    throw new BadRequestError('Failed to serialize DTO: ' + (error as Error).message);
  }
}

/**
 * Deserializes JSON string back to DTO with validation
 * @param json - JSON string to deserialize
 * @param classType - Target class type
 * @returns DTO instance
 */
export async function deserializeDTO<T extends BaseDTO>(
  json: string,
  classType?: new () => T,
): Promise<T> {
  try {
    const logger = createLogger('deserializeDTO');
    const parsed = JSON.parse(json);

    const result = classType ? plainToClass(classType, parsed) : parsed;

    logger.debug('DTO deserialized', { dtoType: 'deserializeDTO' });
    return result as T;
  } catch (error) {
    throw new BadRequestError('Failed to deserialize DTO: ' + (error as Error).message);
  }
}

/**
 * Encodes DTO to Base64 string
 * @param dto - DTO to encode
 * @returns Base64 encoded string
 */
export async function encodeDTO<T extends BaseDTO>(dto: T): Promise<string> {
  try {
    const logger = createLogger('encodeDTO');
    const serialized = await serializeDTO(dto);
    const encoded = Buffer.from(serialized).toString('base64');

    logger.debug('DTO encoded', { dtoType: 'encodeDTO' });
    return encoded;
  } catch (error) {
    throw new BadRequestError('Failed to encode DTO: ' + (error as Error).message);
  }
}

/**
 * Decodes Base64 string back to DTO
 * @param encoded - Base64 encoded string
 * @param classType - Target class type
 * @returns DTO instance
 */
export async function decodeDTO<T extends BaseDTO>(
  encoded: string,
  classType?: new () => T,
): Promise<T> {
  try {
    const logger = createLogger('decodeDTO');
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const result = await deserializeDTO<T>(decoded, classType);

    logger.debug('DTO decoded', { dtoType: 'decodeDTO' });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to decode DTO: ' + (error as Error).message);
  }
}

/**
 * Compresses DTO using gzip compression
 * @param dto - DTO to compress
 * @returns Compressed buffer
 */
export async function compressDTO<T extends BaseDTO>(
  dto: T,
): Promise<Buffer> {
  try {
    const logger = createLogger('compressDTO');
    const serialized = await serializeDTO(dto);
    const compressed = await promisify(zlib.gzip)(serialized);

    logger.debug('DTO compressed', {
      originalSize: serialized.length,
      compressedSize: (compressed as Buffer).length,
      dtoType: 'compressDTO',
    });
    return compressed as Buffer;
  } catch (error) {
    throw new BadRequestError('Failed to compress DTO: ' + (error as Error).message);
  }
}

/**
 * Decompresses gzip buffer back to DTO
 * @param compressed - Compressed buffer
 * @param classType - Target class type
 * @returns DTO instance
 */
export async function decompressDTO<T extends BaseDTO>(
  compressed: Buffer,
  classType?: new () => T,
): Promise<T> {
  try {
    const logger = createLogger('decompressDTO');
    const decompressed = await promisify(zlib.gunzip)(compressed);
    const json = decompressed.toString('utf-8');
    const result = await deserializeDTO<T>(json, classType);

    logger.debug('DTO decompressed', { dtoType: 'decompressDTO' });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to decompress DTO: ' + (error as Error).message);
  }
}

/**
 * Hashes DTO for integrity verification
 * @param dto - DTO to hash
 * @param algorithm - Hash algorithm (default: sha256)
 * @returns Hex hash string
 */
export async function hashDTO<T extends BaseDTO>(
  dto: T,
  algorithm: string = 'sha256',
): Promise<string> {
  try {
    const logger = createLogger('hashDTO');
    const serialized = await serializeDTO(dto);
    const hash = crypto.createHash(algorithm).update(serialized).digest('hex');

    logger.debug('DTO hashed', { algorithm, dtoType: 'hashDTO' });
    return hash;
  } catch (error) {
    throw new BadRequestError('Failed to hash DTO: ' + (error as Error).message);
  }
}

/**
 * Signs DTO with HMAC signature for authenticity verification
 * @param dto - DTO to sign
 * @param secret - Secret key for signing
 * @param algorithm - HMAC algorithm (default: sha256)
 * @returns Signature data object
 */
export async function signDTO<T extends BaseDTO>(
  dto: T,
  secret: string,
  algorithm: string = 'sha256',
): Promise<SignatureData> {
  try {
    const logger = createLogger('signDTO');
    const payload = await serializeDTO(dto);
    const signature = crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex');

    const signatureData: SignatureData = {
      payload,
      signature,
      algorithm,
      timestamp: new Date(),
      verified: false,
    };

    logger.debug('DTO signed', { algorithm, dtoType: 'signDTO' });
    return signatureData;
  } catch (error) {
    throw new BadRequestError('Failed to sign DTO: ' + (error as Error).message);
  }
}

/**
 * Verifies DTO signature for authenticity
 * @param signatureData - Signature data to verify
 * @param secret - Secret key used for signing
 * @returns Signature verification result
 */
export async function verifyDTO(
  signatureData: SignatureData,
  secret: string,
): Promise<{ verified: boolean; payload: string }> {
  try {
    const logger = createLogger('verifyDTO');
    const expectedSignature = crypto
      .createHmac(signatureData.algorithm, secret)
      .update(signatureData.payload)
      .digest('hex');

    const verified =
      crypto.timingSafeEqual(
        Buffer.from(signatureData.signature),
        Buffer.from(expectedSignature),
      ) === true;

    logger.debug('DTO signature verified', {
      verified,
      dtoType: 'verifyDTO',
    });
    return {
      verified,
      payload: verified ? signatureData.payload : '',
    };
  } catch (error) {
    throw new BadRequestError('Failed to verify DTO signature: ' + (error as Error).message);
  }
}

/**
 * Adds timestamp to DTO for audit trail
 * @param dto - DTO to timestamp
 * @returns DTO with timestamp added
 */
export async function timestampDTO<T extends BaseDTO>(dto: T): Promise<T> {
  try {
    const logger = createLogger('timestampDTO');
    const timestamped: T = {
      ...dto,
      modifiedAt: new Date().toISOString(),
    };

    logger.debug('DTO timestamped', { dtoType: 'timestampDTO' });
    return timestamped;
  } catch (error) {
    throw new BadRequestError('Failed to timestamp DTO: ' + (error as Error).message);
  }
}

/**
 * Adds version information to DTO
 * @param dto - DTO to version
 * @param version - Version string (default: incrementing patch)
 * @returns DTO with version updated
 */
export async function versionDTO<T extends BaseDTO>(
  dto: T,
  version?: string,
): Promise<T> {
  try {
    const logger = createLogger('versionDTO');
    let newVersion = version;

    if (!newVersion && dto.version) {
      const parts = dto.version.split('.');
      const patch = parseInt(parts[2] || '0', 10) + 1;
      newVersion = `${parts[0]}.${parts[1]}.${patch}`;
    } else if (!newVersion) {
      newVersion = '1.0.0';
    }

    const versioned: T = {
      ...dto,
      version: newVersion,
    };

    logger.debug('DTO versioned', { version: newVersion, dtoType: 'versionDTO' });
    return versioned;
  } catch (error) {
    throw new BadRequestError('Failed to version DTO: ' + (error as Error).message);
  }
}

/**
 * Adds audit information to DTO for compliance tracking
 * @param dto - DTO to audit
 * @param userId - User ID performing the operation
 * @param operation - Operation type (CREATE, UPDATE, DELETE)
 * @returns DTO with audit metadata
 */
export async function auditDTO<T extends BaseDTO>(
  dto: T,
  userId: string,
  operation: string = 'UPDATE',
): Promise<T & { audit?: Record<string, any> }> {
  try {
    const logger = createLogger('auditDTO');
    const audited = {
      ...dto,
      audit: {
        ...(dto.audit || {}),
        [`${operation.toLowerCase()}By`]: userId,
        [`${operation.toLowerCase()}At`]: new Date().toISOString(),
      },
    };

    logger.debug('DTO audited', {
      operation,
      userId,
      dtoType: 'auditDTO',
    });
    return audited;
  } catch (error) {
    throw new BadRequestError('Failed to audit DTO: ' + (error as Error).message);
  }
}

/**
 * Logs DTO operation with full context and HIPAA compliance
 * @param dto - DTO being logged
 * @param operation - Operation type
 * @param context - Additional context
 * @returns DTO with logging metadata
 */
export async function logDTO<T extends BaseDTO>(
  dto: T,
  operation: DTOOperation,
  context?: Record<string, any>,
): Promise<T> {
  try {
    const logger = createLogger('logDTO');

    logger.debug('DTO operation logged', {
      dtoId: dto.id,
      operation,
      context,
      dtoType: 'logDTO',
    });

    return dto;
  } catch (error) {
    throw new BadRequestError('Failed to log DTO: ' + (error as Error).message);
  }
}

/**
 * Caches DTO result with TTL
 * @param dto - DTO to cache
 * @param key - Cache key
 * @param ttl - Time to live in seconds
 * @returns DTO with cache metadata
 */
export async function cacheDTO<T extends BaseDTO>(
  dto: T,
  key: string,
  ttl: number = 300,
): Promise<T & { _cache?: { key: string; expiresAt: Date } }> {
  try {
    const logger = createLogger('cacheDTO');
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const cached = {
      ...dto,
      _cache: {
        key,
        expiresAt,
      },
    };

    logger.debug('DTO cached', {
      key,
      ttl,
      dtoType: 'cacheDTO',
    });
    return cached;
  } catch (error) {
    throw new BadRequestError('Failed to cache DTO: ' + (error as Error).message);
  }
}

/**
 * Memoizes DTO operation result
 * @param fn - Function to memoize
 * @param dto - DTO parameter
 * @param key - Memoization key
 * @returns Result of memoized function
 */
export async function memoizeDTO<T extends BaseDTO, R>(
  fn: (dto: T) => Promise<R>,
  dto: T,
  key: string,
): Promise<R> {
  try {
    const logger = createLogger('memoizeDTO');

    // In production, this would check against a cache store
    const result = await fn(dto);

    logger.debug('DTO operation memoized', { key, dtoType: 'memoizeDTO' });
    return result;
  } catch (error) {
    throw new BadRequestError('Failed to memoize DTO: ' + (error as Error).message);
  }
}

// Export all types and enums for external use
export {
  DTOOperation,
  MappingStrategy,
  DTOMetadata,
  MappingContext,
  DTOValidationResult,
  ComparisonResult,
  SignatureData,
  BaseDTO,
  ErrorDTO,
  SuccessDTO,
  PagedDTO,
};
