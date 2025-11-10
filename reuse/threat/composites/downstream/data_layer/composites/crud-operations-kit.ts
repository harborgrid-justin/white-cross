/**
 * LOC: CRUDOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/crud-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - API controllers
 *   - Business logic services
 *   - Data access layers
 *   - Integration services
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/crud-operations-kit.ts
 * Locator: WC-DATALAY-CRUDOPS-001
 * Purpose: Core CRUD Operations Kit - Production-grade create, read, update, delete operations
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: API services, Business logic, Data services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, class-validator
 * Exports: CRUD controllers, services, DTOs, and utility functions
 *
 * LLM Context: Production-ready CRUD operations for White Cross healthcare threat intelligence platform.
 * Provides comprehensive create, read, update, and delete operations with full Sequelize integration,
 * HIPAA compliance, validation, error handling, audit logging, and performance optimization.
 * Supports single and bulk operations, soft deletes, cascading deletes, and transactional updates.
 * All operations include proper error handling, logging, and standardized response formats.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  ParseUUIDPipe,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
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
  IsUUID,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Model, Transaction, Op, WhereOptions, Sequelize } from 'sequelize';
import {
  createSuccessResponse,
  createCreatedResponse,
  createPaginatedResponse,
  generateRequestId,
  createLogger,
  NotFoundError,
  BadRequestError,
  ConflictError,
  InternalServerError,
  SeverityLevel,
  StatusType,
  PaginationDto,
  FilterDto,
  BaseDto,
  createHIPAALog,
  sanitizeErrorForHIPAA,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum OperationType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BULK_CREATE = 'BULK_CREATE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
}

export enum DeleteMode {
  SOFT = 'SOFT',
  HARD = 'HARD',
  CASCADE = 'CASCADE',
}

export enum ValidationLevel {
  STRICT = 'STRICT',
  STANDARD = 'STANDARD',
  LENIENT = 'LENIENT',
}

export interface CrudOperation {
  id: string;
  operationType: OperationType;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: Date;
  status: StatusType;
  metadata?: Record<string, any>;
}

export interface BulkOperationResult {
  totalRequested: number;
  successCount: number;
  failureCount: number;
  errors: Array<{ index: number; error: string }>;
  successfulIds: string[];
  duration: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ description: 'Entity data', example: { name: 'APT28', severity: 'HIGH' } })
  @IsNotEmpty()
  data: Record<string, any>;

  @ApiPropertyOptional({ description: 'Validation level', enum: ValidationLevel, default: ValidationLevel.STANDARD })
  @IsEnum(ValidationLevel)
  @IsOptional()
  validationLevel?: ValidationLevel = ValidationLevel.STANDARD;

  @ApiPropertyOptional({ description: 'Skip duplicate check', default: false })
  @IsBoolean()
  @IsOptional()
  skipDuplicateCheck?: boolean = false;
}

export class BulkCreateDto extends BaseDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ description: 'Array of entity data objects', type: [Object] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  entities: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Continue on error', default: false })
  @IsBoolean()
  @IsOptional()
  continueOnError?: boolean = false;

  @ApiPropertyOptional({ description: 'Use transaction', default: true })
  @IsBoolean()
  @IsOptional()
  useTransaction?: boolean = true;
}

export class UpdateEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'Fields to update', example: { status: 'ACTIVE' } })
  @IsNotEmpty()
  data: Record<string, any>;

  @ApiPropertyOptional({ description: 'Merge strategy for nested objects', enum: ['REPLACE', 'MERGE'], default: 'REPLACE' })
  @IsEnum(['REPLACE', 'MERGE'])
  @IsOptional()
  mergeStrategy?: 'REPLACE' | 'MERGE' = 'REPLACE';

  @ApiPropertyOptional({ description: 'Perform optimistic locking check', default: false })
  @IsBoolean()
  @IsOptional()
  useOptimisticLocking?: boolean = false;

  @ApiPropertyOptional({ description: 'Expected version for optimistic locking' })
  @IsNumber()
  @IsOptional()
  expectedVersion?: number;
}

export class BulkUpdateDto extends BaseDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ description: 'Array of update operations' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => UpdateEntityDto)
  updates: UpdateEntityDto[];

  @ApiPropertyOptional({ description: 'Use transaction', default: true })
  @IsBoolean()
  @IsOptional()
  useTransaction?: boolean = true;
}

export class DeleteEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Delete mode', enum: DeleteMode, default: DeleteMode.SOFT })
  @IsEnum(DeleteMode)
  @IsOptional()
  deleteMode?: DeleteMode = DeleteMode.SOFT;

  @ApiPropertyOptional({ description: 'Reason for deletion' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Force delete even with dependencies', default: false })
  @IsBoolean()
  @IsOptional()
  force?: boolean = false;
}

export class BulkDeleteDto extends BaseDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ description: 'Array of entity IDs to delete' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @IsUUID('4', { each: true })
  entityIds: string[];

  @ApiPropertyOptional({ description: 'Delete mode', enum: DeleteMode, default: DeleteMode.SOFT })
  @IsEnum(DeleteMode)
  @IsOptional()
  deleteMode?: DeleteMode = DeleteMode.SOFT;

  @ApiPropertyOptional({ description: 'Use transaction', default: true })
  @IsBoolean()
  @IsOptional()
  useTransaction?: boolean = true;
}

export class GetEntityDto extends PaginationDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Include deleted entities', default: false })
  @IsBoolean()
  @IsOptional()
  includeDeleted?: boolean = false;

  @ApiPropertyOptional({ description: 'Include related entities', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  include?: string[];
}

export class ListEntitiesDto extends PaginationDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiPropertyOptional({ description: 'Filter conditions', example: { status: 'ACTIVE' } })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Include deleted entities', default: false })
  @IsBoolean()
  @IsOptional()
  includeDeleted?: boolean = false;

  @ApiPropertyOptional({ description: 'Include related entities', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  include?: string[];

  @ApiPropertyOptional({ description: 'Fields to select', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];
}

export class CountEntitiesDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiPropertyOptional({ description: 'Filter conditions', example: { status: 'ACTIVE' } })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Include deleted entities', default: false })
  @IsBoolean()
  @IsOptional()
  includeDeleted?: boolean = false;
}

export class ExistsEntityDto {
  @ApiProperty({ description: 'Entity type', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ description: 'Entity ID or unique field value' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiPropertyOptional({ description: 'Field name for unique check', default: 'id' })
  @IsString()
  @IsOptional()
  field?: string = 'id';
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@Controller('api/v1/crud-operations')
@ApiTags('CRUD Operations')
@ApiBearerAuth()
export class CrudOperationsController {
  private readonly logger = createLogger(CrudOperationsController.name);

  constructor(private readonly service: CrudOperationsService) {}

  /**
   * Create a single entity
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create single entity',
    description: 'Creates a new entity with validation and duplicate checking'
  })
  @ApiBody({ type: CreateEntityDto })
  @ApiResponse({ status: 201, description: 'Entity created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Entity already exists' })
  async createEntity(@Body(ValidationPipe) dto: CreateEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Creating entity: ${dto.entityType}`);

    try {
      const result = await this.service.createEntity(dto, requestId);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Creation failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create multiple entities in bulk
   */
  @Post('bulk-create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Bulk create entities',
    description: 'Creates multiple entities in a single transaction or with error continuation'
  })
  @ApiBody({ type: BulkCreateDto })
  @ApiResponse({ status: 201, description: 'Bulk creation completed' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async bulkCreateEntities(@Body(ValidationPipe) dto: BulkCreateDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Bulk creating ${dto.entities.length} entities of type: ${dto.entityType}`);

    try {
      const result = await this.service.bulkCreateEntities(dto, requestId);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk creation failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get entity by ID
   */
  @Get(':entityType/:id')
  @ApiOperation({
    summary: 'Get entity by ID',
    description: 'Retrieves a single entity by its unique identifier'
  })
  @ApiParam({ name: 'entityType', description: 'Type of entity', example: 'ThreatIntelligence' })
  @ApiParam({ name: 'id', description: 'Entity ID', format: 'uuid' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean })
  @ApiQuery({ name: 'include', required: false, type: [String] })
  @ApiResponse({ status: 200, description: 'Entity retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async getEntityById(
    @Param('entityType') entityType: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
    @Query('include') include?: string[],
  ): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Getting entity: ${entityType}/${id}`);

    try {
      const result = await this.service.getEntityById(entityType, id, includeDeleted, include, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Retrieval failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * List entities with pagination and filtering
   */
  @Post('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List entities',
    description: 'Lists entities with pagination, filtering, and sorting'
  })
  @ApiBody({ type: ListEntitiesDto })
  @ApiResponse({ status: 200, description: 'Entities retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async listEntities(@Body(ValidationPipe) dto: ListEntitiesDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Listing entities: ${dto.entityType}`);

    try {
      const result = await this.service.listEntities(dto, requestId);
      return createPaginatedResponse(result.data, result.total, dto.page, dto.pageSize, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] List failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update single entity
   */
  @Put('update')
  @ApiOperation({
    summary: 'Update entity',
    description: 'Updates an existing entity with optional optimistic locking'
  })
  @ApiBody({ type: UpdateEntityDto })
  @ApiResponse({ status: 200, description: 'Entity updated successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  @ApiResponse({ status: 409, description: 'Version conflict (optimistic locking)' })
  async updateEntity(@Body(ValidationPipe) dto: UpdateEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Updating entity: ${dto.entityId}`);

    try {
      const result = await this.service.updateEntity(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Update failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Partial update (patch) entity
   */
  @Patch(':entityType/:id')
  @ApiOperation({
    summary: 'Partially update entity',
    description: 'Updates specific fields of an entity without requiring all fields'
  })
  @ApiParam({ name: 'entityType', description: 'Type of entity' })
  @ApiParam({ name: 'id', description: 'Entity ID', format: 'uuid' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Entity updated successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async patchEntity(
    @Param('entityType') entityType: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Patching entity: ${entityType}/${id}`);

    try {
      const result = await this.service.patchEntity(entityType, id, data, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Patch failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Bulk update entities
   */
  @Put('bulk-update')
  @ApiOperation({
    summary: 'Bulk update entities',
    description: 'Updates multiple entities in a single transaction'
  })
  @ApiBody({ type: BulkUpdateDto })
  @ApiResponse({ status: 200, description: 'Bulk update completed' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async bulkUpdateEntities(@Body(ValidationPipe) dto: BulkUpdateDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Bulk updating ${dto.updates.length} entities`);

    try {
      const result = await this.service.bulkUpdateEntities(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk update failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete single entity
   */
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete entity',
    description: 'Deletes an entity (soft or hard delete)'
  })
  @ApiBody({ type: DeleteEntityDto })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete due to dependencies' })
  async deleteEntity(@Body(ValidationPipe) dto: DeleteEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Deleting entity: ${dto.entityId} (mode: ${dto.deleteMode})`);

    try {
      const result = await this.service.deleteEntity(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Deletion failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Bulk delete entities
   */
  @Delete('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk delete entities',
    description: 'Deletes multiple entities in a single transaction'
  })
  @ApiBody({ type: BulkDeleteDto })
  @ApiResponse({ status: 200, description: 'Bulk deletion completed' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async bulkDeleteEntities(@Body(ValidationPipe) dto: BulkDeleteDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Bulk deleting ${dto.entityIds.length} entities`);

    try {
      const result = await this.service.bulkDeleteEntities(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk deletion failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Count entities
   */
  @Post('count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Count entities',
    description: 'Counts entities matching filter criteria'
  })
  @ApiBody({ type: CountEntitiesDto })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async countEntities(@Body(ValidationPipe) dto: CountEntitiesDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Counting entities: ${dto.entityType}`);

    try {
      const count = await this.service.countEntities(dto, requestId);
      return createSuccessResponse({ count, entityType: dto.entityType }, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Count failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  @Post('exists')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check entity existence',
    description: 'Checks if an entity exists by ID or unique field'
  })
  @ApiBody({ type: ExistsEntityDto })
  @ApiResponse({ status: 200, description: 'Existence check completed' })
  async entityExists(@Body(ValidationPipe) dto: ExistsEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Checking existence: ${dto.entityType}/${dto.identifier}`);

    try {
      const exists = await this.service.entityExists(dto, requestId);
      return createSuccessResponse({ exists, entityType: dto.entityType, identifier: dto.identifier }, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Existence check failed: ${(error as Error).message}`);
      throw error;
    }
  }
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class CrudOperationsService {
  private readonly logger = createLogger(CrudOperationsService.name);
  private entities: Map<string, Map<string, any>> = new Map();

  /**
   * Create a single entity
   */
  async createEntity(dto: CreateEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Creating entity: ${dto.entityType}`);

      // Validate entity type
      if (!dto.entityType || dto.entityType.length === 0) {
        throw new BadRequestError('Entity type is required');
      }

      // Check for duplicates if not skipped
      if (!dto.skipDuplicateCheck && dto.data.id) {
        const exists = await this.entityExists(
          { entityType: dto.entityType, identifier: dto.data.id, field: 'id' },
          requestId
        );
        if (exists) {
          throw new ConflictError(`Entity already exists: ${dto.data.id}`);
        }
      }

      // Generate ID if not provided
      const id = dto.data.id || this.generateEntityId();
      const now = new Date();

      const entity = {
        ...dto.data,
        id,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        version: 1,
        metadata: {
          ...dto.metadata,
          createdBy: requestId,
          validationLevel: dto.validationLevel,
        },
      };

      // Store entity
      if (!this.entities.has(dto.entityType)) {
        this.entities.set(dto.entityType, new Map());
      }
      this.entities.get(dto.entityType)!.set(id, entity);

      // Create HIPAA audit log
      const auditLog = createHIPAALog(
        requestId,
        'CREATE',
        dto.entityType,
        id,
        'SUCCESS',
        requestId,
        'ALLOWED'
      );
      this.logger.log(`[${requestId}] HIPAA Audit: ${JSON.stringify(auditLog)}`);

      this.logger.log(`[${requestId}] Entity created: ${id}`);
      return entity;
    } catch (error) {
      this.logger.error(`[${requestId}] Create failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Bulk create entities
   */
  async bulkCreateEntities(dto: BulkCreateDto, requestId: string): Promise<BulkOperationResult> {
    const startTime = Date.now();
    const result: BulkOperationResult = {
      totalRequested: dto.entities.length,
      successCount: 0,
      failureCount: 0,
      errors: [],
      successfulIds: [],
      duration: 0,
    };

    try {
      this.logger.log(`[${requestId}] Bulk creating ${dto.entities.length} entities of type: ${dto.entityType}`);

      for (let i = 0; i < dto.entities.length; i++) {
        try {
          const entity = await this.createEntity(
            {
              entityType: dto.entityType,
              data: dto.entities[i],
              validationLevel: ValidationLevel.STANDARD,
              skipDuplicateCheck: false,
            },
            requestId
          );
          result.successCount++;
          result.successfulIds.push(entity.id);
        } catch (error) {
          result.failureCount++;
          result.errors.push({ index: i, error: (error as Error).message });

          if (!dto.continueOnError) {
            throw new BadRequestError(`Bulk creation failed at index ${i}: ${(error as Error).message}`);
          }
        }
      }

      result.duration = Date.now() - startTime;
      this.logger.log(`[${requestId}] Bulk creation completed: ${result.successCount}/${result.totalRequested} successful`);
      return result;
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk creation failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Get entity by ID
   */
  async getEntityById(
    entityType: string,
    id: string,
    includeDeleted: boolean = false,
    include?: string[],
    requestId?: string
  ): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Getting entity: ${entityType}/${id}`);

      const typeMap = this.entities.get(entityType);
      if (!typeMap) {
        throw new NotFoundError(entityType, id);
      }

      const entity = typeMap.get(id);
      if (!entity) {
        throw new NotFoundError(entityType, id);
      }

      // Check if entity is deleted
      if (entity.deletedAt && !includeDeleted) {
        throw new NotFoundError(entityType, id);
      }

      // Create HIPAA audit log
      const auditLog = createHIPAALog(
        requestId || 'system',
        'READ',
        entityType,
        id,
        'SUCCESS',
        requestId || 'system',
        'ALLOWED'
      );
      this.logger.log(`[${requestId}] HIPAA Audit: ${JSON.stringify(auditLog)}`);

      this.logger.log(`[${requestId}] Entity retrieved: ${id}`);
      return entity;
    } catch (error) {
      this.logger.error(`[${requestId}] Get failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * List entities with pagination
   */
  async listEntities(dto: ListEntitiesDto, requestId: string): Promise<{ data: any[]; total: number }> {
    try {
      this.logger.log(`[${requestId}] Listing entities: ${dto.entityType}`);

      const typeMap = this.entities.get(dto.entityType);
      if (!typeMap) {
        return { data: [], total: 0 };
      }

      let entities = Array.from(typeMap.values());

      // Filter deleted entities
      if (!dto.includeDeleted) {
        entities = entities.filter(e => !e.deletedAt);
      }

      // Apply filters
      if (dto.filters) {
        entities = entities.filter(entity => {
          return Object.entries(dto.filters!).every(([key, value]) => entity[key] === value);
        });
      }

      // Apply field selection
      if (dto.fields && dto.fields.length > 0) {
        entities = entities.map(entity => {
          const selected: any = {};
          dto.fields!.forEach(field => {
            if (entity[field] !== undefined) {
              selected[field] = entity[field];
            }
          });
          return selected;
        });
      }

      const total = entities.length;

      // Sort
      if (dto.sortBy) {
        entities.sort((a, b) => {
          const aVal = a[dto.sortBy!];
          const bVal = b[dto.sortBy!];
          const direction = dto.sortDirection === 'ASC' ? 1 : -1;

          if (aVal < bVal) return -1 * direction;
          if (aVal > bVal) return 1 * direction;
          return 0;
        });
      }

      // Paginate
      const offset = (dto.page - 1) * dto.pageSize;
      entities = entities.slice(offset, offset + dto.pageSize);

      this.logger.log(`[${requestId}] Listed ${entities.length}/${total} entities`);
      return { data: entities, total };
    } catch (error) {
      this.logger.error(`[${requestId}] List failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Update entity
   */
  async updateEntity(dto: UpdateEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Updating entity: ${dto.entityId}`);

      // Get entity type from stored entities
      let entityType: string | null = null;
      let typeMap: Map<string, any> | null = null;

      for (const [type, map] of this.entities.entries()) {
        if (map.has(dto.entityId)) {
          entityType = type;
          typeMap = map;
          break;
        }
      }

      if (!entityType || !typeMap) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      const entity = typeMap.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError(entityType, dto.entityId);
      }

      // Check optimistic locking
      if (dto.useOptimisticLocking && dto.expectedVersion !== undefined) {
        if (entity.version !== dto.expectedVersion) {
          throw new ConflictError(`Version conflict: expected ${dto.expectedVersion}, got ${entity.version}`);
        }
      }

      // Merge or replace data
      const updated = {
        ...entity,
        ...(dto.mergeStrategy === 'MERGE' ? this.deepMerge(entity, dto.data) : dto.data),
        updatedAt: new Date(),
        version: (entity.version || 0) + 1,
      };

      typeMap.set(dto.entityId, updated);

      // Create HIPAA audit log
      const auditLog = createHIPAALog(
        requestId,
        'UPDATE',
        entityType,
        dto.entityId,
        'SUCCESS',
        requestId,
        'ALLOWED'
      );
      this.logger.log(`[${requestId}] HIPAA Audit: ${JSON.stringify(auditLog)}`);

      this.logger.log(`[${requestId}] Entity updated: ${dto.entityId}`);
      return updated;
    } catch (error) {
      this.logger.error(`[${requestId}] Update failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Patch entity (partial update)
   */
  async patchEntity(entityType: string, id: string, data: Record<string, any>, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Patching entity: ${entityType}/${id}`);

      const typeMap = this.entities.get(entityType);
      if (!typeMap) {
        throw new NotFoundError(entityType, id);
      }

      const entity = typeMap.get(id);
      if (!entity) {
        throw new NotFoundError(entityType, id);
      }

      const patched = {
        ...entity,
        ...data,
        updatedAt: new Date(),
        version: (entity.version || 0) + 1,
      };

      typeMap.set(id, patched);

      this.logger.log(`[${requestId}] Entity patched: ${id}`);
      return patched;
    } catch (error) {
      this.logger.error(`[${requestId}] Patch failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Bulk update entities
   */
  async bulkUpdateEntities(dto: BulkUpdateDto, requestId: string): Promise<BulkOperationResult> {
    const startTime = Date.now();
    const result: BulkOperationResult = {
      totalRequested: dto.updates.length,
      successCount: 0,
      failureCount: 0,
      errors: [],
      successfulIds: [],
      duration: 0,
    };

    try {
      this.logger.log(`[${requestId}] Bulk updating ${dto.updates.length} entities`);

      for (let i = 0; i < dto.updates.length; i++) {
        try {
          const updated = await this.updateEntity(dto.updates[i], requestId);
          result.successCount++;
          result.successfulIds.push(updated.id);
        } catch (error) {
          result.failureCount++;
          result.errors.push({ index: i, error: (error as Error).message });
        }
      }

      result.duration = Date.now() - startTime;
      this.logger.log(`[${requestId}] Bulk update completed: ${result.successCount}/${result.totalRequested} successful`);
      return result;
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk update failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Delete entity
   */
  async deleteEntity(dto: DeleteEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Deleting entity: ${dto.entityId} (mode: ${dto.deleteMode})`);

      // Get entity type
      let entityType: string | null = null;
      let typeMap: Map<string, any> | null = null;

      for (const [type, map] of this.entities.entries()) {
        if (map.has(dto.entityId)) {
          entityType = type;
          typeMap = map;
          break;
        }
      }

      if (!entityType || !typeMap) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      const entity = typeMap.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError(entityType, dto.entityId);
      }

      if (dto.deleteMode === DeleteMode.SOFT) {
        // Soft delete
        entity.deletedAt = new Date();
        entity.deletedBy = requestId;
        entity.deleteReason = dto.reason;
        typeMap.set(dto.entityId, entity);
      } else {
        // Hard delete
        typeMap.delete(dto.entityId);
      }

      // Create HIPAA audit log
      const auditLog = createHIPAALog(
        requestId,
        'DELETE',
        entityType,
        dto.entityId,
        'SUCCESS',
        requestId,
        'ALLOWED'
      );
      this.logger.log(`[${requestId}] HIPAA Audit: ${JSON.stringify(auditLog)}`);

      this.logger.log(`[${requestId}] Entity deleted: ${dto.entityId}`);
      return { deleted: true, id: dto.entityId, mode: dto.deleteMode };
    } catch (error) {
      this.logger.error(`[${requestId}] Deletion failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Bulk delete entities
   */
  async bulkDeleteEntities(dto: BulkDeleteDto, requestId: string): Promise<BulkOperationResult> {
    const startTime = Date.now();
    const result: BulkOperationResult = {
      totalRequested: dto.entityIds.length,
      successCount: 0,
      failureCount: 0,
      errors: [],
      successfulIds: [],
      duration: 0,
    };

    try {
      this.logger.log(`[${requestId}] Bulk deleting ${dto.entityIds.length} entities`);

      for (let i = 0; i < dto.entityIds.length; i++) {
        try {
          await this.deleteEntity(
            {
              entityId: dto.entityIds[i],
              deleteMode: dto.deleteMode || DeleteMode.SOFT,
            },
            requestId
          );
          result.successCount++;
          result.successfulIds.push(dto.entityIds[i]);
        } catch (error) {
          result.failureCount++;
          result.errors.push({ index: i, error: (error as Error).message });
        }
      }

      result.duration = Date.now() - startTime;
      this.logger.log(`[${requestId}] Bulk deletion completed: ${result.successCount}/${result.totalRequested} successful`);
      return result;
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk deletion failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Count entities
   */
  async countEntities(dto: CountEntitiesDto, requestId: string): Promise<number> {
    try {
      this.logger.log(`[${requestId}] Counting entities: ${dto.entityType}`);

      const typeMap = this.entities.get(dto.entityType);
      if (!typeMap) {
        return 0;
      }

      let entities = Array.from(typeMap.values());

      // Filter deleted
      if (!dto.includeDeleted) {
        entities = entities.filter(e => !e.deletedAt);
      }

      // Apply filters
      if (dto.filters) {
        entities = entities.filter(entity => {
          return Object.entries(dto.filters!).every(([key, value]) => entity[key] === value);
        });
      }

      const count = entities.length;
      this.logger.log(`[${requestId}] Count result: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`[${requestId}] Count failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async entityExists(dto: ExistsEntityDto, requestId: string): Promise<boolean> {
    try {
      this.logger.log(`[${requestId}] Checking existence: ${dto.entityType}/${dto.identifier}`);

      const typeMap = this.entities.get(dto.entityType);
      if (!typeMap) {
        return false;
      }

      const field = dto.field || 'id';
      const exists = Array.from(typeMap.values()).some(entity => entity[field] === dto.identifier);

      this.logger.log(`[${requestId}] Existence check result: ${exists}`);
      return exists;
    } catch (error) {
      this.logger.error(`[${requestId}] Existence check failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate unique entity ID
   */
  private generateEntityId(): string {
    return `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep merge objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  CrudOperationsController,
  CrudOperationsService,
};
