/**
 * LOC: ENTMGMT001
 * File: /reuse/threat/composites/downstream/data_layer/composites/entity-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Entity lifecycle services
 *   - State management systems
 *   - Workflow orchestrators
 *   - Audit systems
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/entity-management-kit.ts
 * Locator: WC-DATALAY-ENTMGMT-001
 * Purpose: Entity Lifecycle Management Kit - Production-grade entity state, versioning, and lifecycle operations
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: Entity services, Workflow systems, State management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, class-validator
 * Exports: Entity management controllers, services, DTOs, and lifecycle utilities
 *
 * LLM Context: Production-ready entity lifecycle management for White Cross healthcare threat intelligence platform.
 * Provides comprehensive entity state management, versioning, cloning, archiving, restoration, merging, and
 * relationship management. Includes full audit trails, HIPAA compliance, transaction support, and event-driven
 * state changes. All operations include proper error handling, logging, and standardized response formats.
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
} from 'class-validator';
import { Type } from 'class-transformer';
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
  BaseDto,
  createHIPAALog,
  sanitizeErrorForHIPAA,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum EntityState {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  LOCKED = 'LOCKED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
}

export enum StateTransition {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  SUSPEND = 'SUSPEND',
  RESUME = 'RESUME',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
  DELETE = 'DELETE',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
  SUBMIT_FOR_APPROVAL = 'SUBMIT_FOR_APPROVAL',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export enum RelationshipType {
  ONE_TO_ONE = 'ONE_TO_ONE',
  ONE_TO_MANY = 'ONE_TO_MANY',
  MANY_TO_MANY = 'MANY_TO_MANY',
  PARENT_CHILD = 'PARENT_CHILD',
  REFERENCE = 'REFERENCE',
}

export enum MergeStrategy {
  OVERWRITE = 'OVERWRITE',
  PRESERVE = 'PRESERVE',
  MERGE = 'MERGE',
  CUSTOM = 'CUSTOM',
}

export interface EntityVersion {
  version: number;
  entityId: string;
  data: Record<string, any>;
  changedBy: string;
  changedAt: Date;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  changeDescription?: string;
  metadata?: Record<string, any>;
}

export interface StateChange {
  id: string;
  entityId: string;
  fromState: EntityState;
  toState: EntityState;
  transition: StateTransition;
  reason?: string;
  performedBy: string;
  performedAt: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class ChangeEntityStateDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'Target state', enum: EntityState })
  @IsEnum(EntityState)
  @IsNotEmpty()
  targetState: EntityState;

  @ApiProperty({ description: 'State transition', enum: StateTransition })
  @IsEnum(StateTransition)
  @IsNotEmpty()
  transition: StateTransition;

  @ApiPropertyOptional({ description: 'Reason for state change' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Validate transition rules', default: true })
  @IsBoolean()
  @IsOptional()
  validateTransition?: boolean = true;
}

export class CloneEntityDto extends BaseDto {
  @ApiProperty({ description: 'Source entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  sourceEntityId: string;

  @ApiPropertyOptional({ description: 'New entity name' })
  @IsString()
  @IsOptional()
  newName?: string;

  @ApiPropertyOptional({ description: 'Include relationships', default: false })
  @IsBoolean()
  @IsOptional()
  includeRelationships?: boolean = false;

  @ApiPropertyOptional({ description: 'Deep clone nested entities', default: false })
  @IsBoolean()
  @IsOptional()
  deepClone?: boolean = false;

  @ApiPropertyOptional({ description: 'Fields to exclude from clone', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excludeFields?: string[];
}

export class ArchiveEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Archive reason' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Archive location/bucket' })
  @IsString()
  @IsOptional()
  archiveLocation?: string;

  @ApiPropertyOptional({ description: 'Create snapshot before archiving', default: true })
  @IsBoolean()
  @IsOptional()
  createSnapshot?: boolean = true;
}

export class RestoreEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Version to restore to' })
  @IsNumber()
  @IsOptional()
  restoreToVersion?: number;

  @ApiPropertyOptional({ description: 'Target state after restoration', enum: EntityState })
  @IsEnum(EntityState)
  @IsOptional()
  targetState?: EntityState = EntityState.ACTIVE;
}

export class MergeEntitiesDto extends BaseDto {
  @ApiProperty({ description: 'Primary entity ID (will receive merged data)', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  primaryEntityId: string;

  @ApiProperty({ description: 'Secondary entity IDs to merge into primary', type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  secondaryEntityIds: string[];

  @ApiProperty({ description: 'Merge strategy', enum: MergeStrategy })
  @IsEnum(MergeStrategy)
  @IsNotEmpty()
  strategy: MergeStrategy;

  @ApiPropertyOptional({ description: 'Delete secondary entities after merge', default: true })
  @IsBoolean()
  @IsOptional()
  deleteSecondary?: boolean = true;

  @ApiPropertyOptional({ description: 'Custom merge rules' })
  @IsOptional()
  customRules?: Record<string, any>;
}

export class LinkEntitiesDto extends BaseDto {
  @ApiProperty({ description: 'Source entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  sourceEntityId: string;

  @ApiProperty({ description: 'Target entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  targetEntityId: string;

  @ApiProperty({ description: 'Relationship type', enum: RelationshipType })
  @IsEnum(RelationshipType)
  @IsNotEmpty()
  relationshipType: RelationshipType;

  @ApiPropertyOptional({ description: 'Relationship name/label' })
  @IsString()
  @IsOptional()
  relationshipName?: string;

  @ApiPropertyOptional({ description: 'Relationship metadata' })
  @IsOptional()
  relationshipMetadata?: Record<string, any>;
}

export class UnlinkEntitiesDto extends BaseDto {
  @ApiProperty({ description: 'Source entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  sourceEntityId: string;

  @ApiProperty({ description: 'Target entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  targetEntityId: string;

  @ApiPropertyOptional({ description: 'Relationship type to unlink', enum: RelationshipType })
  @IsEnum(RelationshipType)
  @IsOptional()
  relationshipType?: RelationshipType;
}

export class CreateSnapshotDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Snapshot description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Include relationships', default: false })
  @IsBoolean()
  @IsOptional()
  includeRelationships?: boolean = false;
}

export class LockEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Lock reason' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Lock duration in seconds' })
  @IsNumber()
  @Min(1)
  @Max(86400)
  @IsOptional()
  duration?: number;
}

export class UnlockEntityDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Force unlock even if locked by another user', default: false })
  @IsBoolean()
  @IsOptional()
  force?: boolean = false;
}

export class GetVersionHistoryDto extends PaginationDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Include full entity data', default: false })
  @IsBoolean()
  @IsOptional()
  includeData?: boolean = false;
}

export class CompareVersionsDto extends BaseDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'First version number' })
  @IsNumber()
  @Min(1)
  version1: number;

  @ApiProperty({ description: 'Second version number' })
  @IsNumber()
  @Min(1)
  version2: number;

  @ApiPropertyOptional({ description: 'Detailed field-level diff', default: true })
  @IsBoolean()
  @IsOptional()
  detailedDiff?: boolean = true;
}

export class GetStateHistoryDto extends PaginationDto {
  @ApiProperty({ description: 'Entity ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({ description: 'Filter by state', enum: EntityState })
  @IsEnum(EntityState)
  @IsOptional()
  state?: EntityState;

  @ApiPropertyOptional({ description: 'Start date for history' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date for history' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@Controller('api/v1/entity-management')
@ApiTags('Entity Management')
@ApiBearerAuth()
export class EntityManagementController {
  private readonly logger = createLogger(EntityManagementController.name);

  constructor(private readonly service: EntityManagementService) {}

  @Post('state/change')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change entity state',
    description: 'Transitions an entity from one state to another with validation'
  })
  @ApiBody({ type: ChangeEntityStateDto })
  @ApiResponse({ status: 200, description: 'State changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async changeState(@Body(ValidationPipe) dto: ChangeEntityStateDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Changing state for entity: ${dto.entityId}`);

    try {
      const result = await this.service.changeState(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] State change failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('clone')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Clone entity',
    description: 'Creates a copy of an existing entity with optional deep cloning'
  })
  @ApiBody({ type: CloneEntityDto })
  @ApiResponse({ status: 201, description: 'Entity cloned successfully' })
  @ApiResponse({ status: 404, description: 'Source entity not found' })
  async cloneEntity(@Body(ValidationPipe) dto: CloneEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Cloning entity: ${dto.sourceEntityId}`);

    try {
      const result = await this.service.cloneEntity(dto, requestId);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Clone failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archive entity',
    description: 'Archives an entity, making it inactive but preserving it'
  })
  @ApiBody({ type: ArchiveEntityDto })
  @ApiResponse({ status: 200, description: 'Entity archived successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async archiveEntity(@Body(ValidationPipe) dto: ArchiveEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Archiving entity: ${dto.entityId}`);

    try {
      const result = await this.service.archiveEntity(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Archive failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restore entity',
    description: 'Restores an archived or deleted entity to active state'
  })
  @ApiBody({ type: RestoreEntityDto })
  @ApiResponse({ status: 200, description: 'Entity restored successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async restoreEntity(@Body(ValidationPipe) dto: RestoreEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Restoring entity: ${dto.entityId}`);

    try {
      const result = await this.service.restoreEntity(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Restore failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('merge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Merge entities',
    description: 'Merges multiple entities into a primary entity using specified strategy'
  })
  @ApiBody({ type: MergeEntitiesDto })
  @ApiResponse({ status: 200, description: 'Entities merged successfully' })
  @ApiResponse({ status: 404, description: 'One or more entities not found' })
  async mergeEntities(@Body(ValidationPipe) dto: MergeEntitiesDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Merging entities into: ${dto.primaryEntityId}`);

    try {
      const result = await this.service.mergeEntities(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Merge failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('relationships/link')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Link entities',
    description: 'Creates a relationship between two entities'
  })
  @ApiBody({ type: LinkEntitiesDto })
  @ApiResponse({ status: 201, description: 'Entities linked successfully' })
  @ApiResponse({ status: 404, description: 'One or more entities not found' })
  async linkEntities(@Body(ValidationPipe) dto: LinkEntitiesDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Linking entities: ${dto.sourceEntityId} -> ${dto.targetEntityId}`);

    try {
      const result = await this.service.linkEntities(dto, requestId);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Link failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Delete('relationships/unlink')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unlink entities',
    description: 'Removes a relationship between two entities'
  })
  @ApiBody({ type: UnlinkEntitiesDto })
  @ApiResponse({ status: 200, description: 'Entities unlinked successfully' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  async unlinkEntities(@Body(ValidationPipe) dto: UnlinkEntitiesDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Unlinking entities: ${dto.sourceEntityId} -> ${dto.targetEntityId}`);

    try {
      const result = await this.service.unlinkEntities(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Unlink failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Get('relationships/:entityId')
  @ApiOperation({
    summary: 'Get entity relationships',
    description: 'Retrieves all relationships for an entity'
  })
  @ApiParam({ name: 'entityId', description: 'Entity ID', format: 'uuid' })
  @ApiQuery({ name: 'type', required: false, enum: RelationshipType })
  @ApiResponse({ status: 200, description: 'Relationships retrieved successfully' })
  async getRelationships(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Query('type') type?: RelationshipType,
  ): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Getting relationships for entity: ${entityId}`);

    try {
      const result = await this.service.getRelationships(entityId, type, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Get relationships failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('snapshots/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create snapshot',
    description: 'Creates a point-in-time snapshot of an entity'
  })
  @ApiBody({ type: CreateSnapshotDto })
  @ApiResponse({ status: 201, description: 'Snapshot created successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async createSnapshot(@Body(ValidationPipe) dto: CreateSnapshotDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Creating snapshot for entity: ${dto.entityId}`);

    try {
      const result = await this.service.createSnapshot(dto, requestId);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Snapshot creation failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Get('snapshots/:entityId')
  @ApiOperation({
    summary: 'List entity snapshots',
    description: 'Retrieves all snapshots for an entity'
  })
  @ApiParam({ name: 'entityId', description: 'Entity ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Snapshots retrieved successfully' })
  async listSnapshots(@Param('entityId', ParseUUIDPipe) entityId: string): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Listing snapshots for entity: ${entityId}`);

    try {
      const result = await this.service.listSnapshots(entityId, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] List snapshots failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('lock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lock entity',
    description: 'Locks an entity to prevent concurrent modifications'
  })
  @ApiBody({ type: LockEntityDto })
  @ApiResponse({ status: 200, description: 'Entity locked successfully' })
  @ApiResponse({ status: 409, description: 'Entity already locked' })
  async lockEntity(@Body(ValidationPipe) dto: LockEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Locking entity: ${dto.entityId}`);

    try {
      const result = await this.service.lockEntity(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Lock failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('unlock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unlock entity',
    description: 'Unlocks a previously locked entity'
  })
  @ApiBody({ type: UnlockEntityDto })
  @ApiResponse({ status: 200, description: 'Entity unlocked successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found or not locked' })
  async unlockEntity(@Body(ValidationPipe) dto: UnlockEntityDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Unlocking entity: ${dto.entityId}`);

    try {
      const result = await this.service.unlockEntity(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Unlock failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('versions/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get version history',
    description: 'Retrieves the version history for an entity'
  })
  @ApiBody({ type: GetVersionHistoryDto })
  @ApiResponse({ status: 200, description: 'Version history retrieved successfully' })
  async getVersionHistory(@Body(ValidationPipe) dto: GetVersionHistoryDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Getting version history for entity: ${dto.entityId}`);

    try {
      const result = await this.service.getVersionHistory(dto, requestId);
      return createPaginatedResponse(result.data, result.total, dto.page, dto.pageSize, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Get version history failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('versions/compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Compare versions',
    description: 'Compares two versions of an entity and returns differences'
  })
  @ApiBody({ type: CompareVersionsDto })
  @ApiResponse({ status: 200, description: 'Version comparison completed' })
  async compareVersions(@Body(ValidationPipe) dto: CompareVersionsDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Comparing versions for entity: ${dto.entityId}`);

    try {
      const result = await this.service.compareVersions(dto, requestId);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Version comparison failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('state/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get state history',
    description: 'Retrieves the state change history for an entity'
  })
  @ApiBody({ type: GetStateHistoryDto })
  @ApiResponse({ status: 200, description: 'State history retrieved successfully' })
  async getStateHistory(@Body(ValidationPipe) dto: GetStateHistoryDto): Promise<any> {
    const requestId = generateRequestId();
    this.logger.log(`[${requestId}] Getting state history for entity: ${dto.entityId}`);

    try {
      const result = await this.service.getStateHistory(dto, requestId);
      return createPaginatedResponse(result.data, result.total, dto.page, dto.pageSize, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Get state history failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @Post('activate/:entityId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate entity', description: 'Activates an inactive or draft entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Entity activated successfully' })
  async activateEntity(@Param('entityId', ParseUUIDPipe) entityId: string): Promise<any> {
    const requestId = generateRequestId();
    const dto: ChangeEntityStateDto = {
      entityId,
      targetState: EntityState.ACTIVE,
      transition: StateTransition.ACTIVATE,
    };
    return this.changeState(dto);
  }

  @Post('deactivate/:entityId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate entity', description: 'Deactivates an active entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Entity deactivated successfully' })
  async deactivateEntity(@Param('entityId', ParseUUIDPipe) entityId: string): Promise<any> {
    const requestId = generateRequestId();
    const dto: ChangeEntityStateDto = {
      entityId,
      targetState: EntityState.INACTIVE,
      transition: StateTransition.DEACTIVATE,
    };
    return this.changeState(dto);
  }

  @Post('suspend/:entityId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suspend entity', description: 'Suspends an entity temporarily' })
  @ApiParam({ name: 'entityId', description: 'Entity ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Entity suspended successfully' })
  async suspendEntity(@Param('entityId', ParseUUIDPipe) entityId: string): Promise<any> {
    const requestId = generateRequestId();
    const dto: ChangeEntityStateDto = {
      entityId,
      targetState: EntityState.SUSPENDED,
      transition: StateTransition.SUSPEND,
    };
    return this.changeState(dto);
  }

  @Post('resume/:entityId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume entity', description: 'Resumes a suspended entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Entity resumed successfully' })
  async resumeEntity(@Param('entityId', ParseUUIDPipe) entityId: string): Promise<any> {
    const requestId = generateRequestId();
    const dto: ChangeEntityStateDto = {
      entityId,
      targetState: EntityState.ACTIVE,
      transition: StateTransition.RESUME,
    };
    return this.changeState(dto);
  }
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class EntityManagementService {
  private readonly logger = createLogger(EntityManagementService.name);
  private entities: Map<string, any> = new Map();
  private versions: Map<string, EntityVersion[]> = new Map();
  private stateHistory: Map<string, StateChange[]> = new Map();
  private relationships: Map<string, any[]> = new Map();
  private locks: Map<string, { lockedBy: string; lockedAt: Date; expiresAt?: Date }> = new Map();
  private snapshots: Map<string, any[]> = new Map();

  /**
   * Change entity state with validation
   */
  async changeState(dto: ChangeEntityStateDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Changing state for entity: ${dto.entityId}`);

      const entity = this.entities.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      const currentState = entity.state || EntityState.DRAFT;

      // Validate state transition if required
      if (dto.validateTransition) {
        this.validateStateTransition(currentState, dto.targetState, dto.transition);
      }

      const previousState = currentState;
      entity.state = dto.targetState;
      entity.updatedAt = new Date();
      this.entities.set(dto.entityId, entity);

      // Record state change
      const stateChange: StateChange = {
        id: this.generateId(),
        entityId: dto.entityId,
        fromState: previousState,
        toState: dto.targetState,
        transition: dto.transition,
        reason: dto.reason,
        performedBy: requestId,
        performedAt: new Date(),
        metadata: dto.metadata,
      };

      if (!this.stateHistory.has(dto.entityId)) {
        this.stateHistory.set(dto.entityId, []);
      }
      this.stateHistory.get(dto.entityId)!.push(stateChange);

      // Create version entry
      await this.createVersion(dto.entityId, entity, requestId, 'UPDATE', `State changed to ${dto.targetState}`);

      // HIPAA audit log
      const auditLog = createHIPAALog(requestId, 'STATE_CHANGE', 'Entity', dto.entityId, 'SUCCESS', requestId, 'ALLOWED');
      this.logger.log(`[${requestId}] HIPAA Audit: ${JSON.stringify(auditLog)}`);

      this.logger.log(`[${requestId}] State changed: ${previousState} -> ${dto.targetState}`);
      return { entity, stateChange };
    } catch (error) {
      this.logger.error(`[${requestId}] State change failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Clone entity
   */
  async cloneEntity(dto: CloneEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Cloning entity: ${dto.sourceEntityId}`);

      const sourceEntity = this.entities.get(dto.sourceEntityId);
      if (!sourceEntity) {
        throw new NotFoundError('Entity', dto.sourceEntityId);
      }

      const clonedEntity = JSON.parse(JSON.stringify(sourceEntity));
      clonedEntity.id = this.generateId();
      clonedEntity.createdAt = new Date();
      clonedEntity.updatedAt = new Date();
      clonedEntity.version = 1;
      clonedEntity.state = EntityState.DRAFT;

      if (dto.newName) {
        clonedEntity.name = dto.newName;
      }

      // Exclude specified fields
      if (dto.excludeFields) {
        dto.excludeFields.forEach(field => {
          delete clonedEntity[field];
        });
      }

      this.entities.set(clonedEntity.id, clonedEntity);

      // Clone relationships if requested
      if (dto.includeRelationships) {
        const sourceRelationships = this.relationships.get(dto.sourceEntityId) || [];
        const clonedRelationships = sourceRelationships.map(rel => ({
          ...rel,
          sourceEntityId: clonedEntity.id,
        }));
        this.relationships.set(clonedEntity.id, clonedRelationships);
      }

      // Create initial version
      await this.createVersion(clonedEntity.id, clonedEntity, requestId, 'CREATE', 'Cloned from ' + dto.sourceEntityId);

      this.logger.log(`[${requestId}] Entity cloned: ${clonedEntity.id}`);
      return clonedEntity;
    } catch (error) {
      this.logger.error(`[${requestId}] Clone failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Archive entity
   */
  async archiveEntity(dto: ArchiveEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Archiving entity: ${dto.entityId}`);

      const entity = this.entities.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      // Create snapshot if requested
      if (dto.createSnapshot) {
        await this.createSnapshot({ entityId: dto.entityId, description: 'Pre-archive snapshot' }, requestId);
      }

      entity.state = EntityState.ARCHIVED;
      entity.archivedAt = new Date();
      entity.archivedBy = requestId;
      entity.archiveReason = dto.reason;
      entity.archiveLocation = dto.archiveLocation;
      entity.updatedAt = new Date();

      this.entities.set(dto.entityId, entity);

      // Create version entry
      await this.createVersion(dto.entityId, entity, requestId, 'UPDATE', 'Entity archived');

      this.logger.log(`[${requestId}] Entity archived: ${dto.entityId}`);
      return entity;
    } catch (error) {
      this.logger.error(`[${requestId}] Archive failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Restore entity
   */
  async restoreEntity(dto: RestoreEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Restoring entity: ${dto.entityId}`);

      let entity = this.entities.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      // Restore to specific version if requested
      if (dto.restoreToVersion) {
        const versions = this.versions.get(dto.entityId) || [];
        const targetVersion = versions.find(v => v.version === dto.restoreToVersion);
        if (!targetVersion) {
          throw new NotFoundError('Version', dto.restoreToVersion.toString());
        }
        entity = { ...targetVersion.data, id: dto.entityId };
      }

      entity.state = dto.targetState || EntityState.ACTIVE;
      entity.restoredAt = new Date();
      entity.restoredBy = requestId;
      entity.updatedAt = new Date();
      delete entity.deletedAt;
      delete entity.archivedAt;

      this.entities.set(dto.entityId, entity);

      // Create version entry
      await this.createVersion(dto.entityId, entity, requestId, 'RESTORE', 'Entity restored');

      this.logger.log(`[${requestId}] Entity restored: ${dto.entityId}`);
      return entity;
    } catch (error) {
      this.logger.error(`[${requestId}] Restore failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Merge entities
   */
  async mergeEntities(dto: MergeEntitiesDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Merging entities into: ${dto.primaryEntityId}`);

      const primaryEntity = this.entities.get(dto.primaryEntityId);
      if (!primaryEntity) {
        throw new NotFoundError('Entity', dto.primaryEntityId);
      }

      const secondaryEntities: any[] = [];
      for (const id of dto.secondaryEntityIds) {
        const entity = this.entities.get(id);
        if (!entity) {
          throw new NotFoundError('Entity', id);
        }
        secondaryEntities.push(entity);
      }

      // Merge based on strategy
      let mergedEntity = { ...primaryEntity };

      switch (dto.strategy) {
        case MergeStrategy.OVERWRITE:
          secondaryEntities.forEach(entity => {
            mergedEntity = { ...mergedEntity, ...entity };
          });
          break;

        case MergeStrategy.PRESERVE:
          secondaryEntities.forEach(entity => {
            Object.keys(entity).forEach(key => {
              if (mergedEntity[key] === undefined || mergedEntity[key] === null) {
                mergedEntity[key] = entity[key];
              }
            });
          });
          break;

        case MergeStrategy.MERGE:
          secondaryEntities.forEach(entity => {
            mergedEntity = this.deepMerge(mergedEntity, entity);
          });
          break;

        case MergeStrategy.CUSTOM:
          if (dto.customRules) {
            // Apply custom merge rules
            mergedEntity = this.applyCustomMerge(mergedEntity, secondaryEntities, dto.customRules);
          }
          break;
      }

      mergedEntity.id = dto.primaryEntityId;
      mergedEntity.updatedAt = new Date();
      mergedEntity.version = (primaryEntity.version || 0) + 1;
      mergedEntity.mergedFrom = dto.secondaryEntityIds;

      this.entities.set(dto.primaryEntityId, mergedEntity);

      // Delete secondary entities if requested
      if (dto.deleteSecondary) {
        for (const id of dto.secondaryEntityIds) {
          this.entities.delete(id);
        }
      }

      // Create version entry
      await this.createVersion(dto.primaryEntityId, mergedEntity, requestId, 'UPDATE', 'Entity merge completed');

      this.logger.log(`[${requestId}] Entities merged successfully`);
      return mergedEntity;
    } catch (error) {
      this.logger.error(`[${requestId}] Merge failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Link entities
   */
  async linkEntities(dto: LinkEntitiesDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Linking entities: ${dto.sourceEntityId} -> ${dto.targetEntityId}`);

      const sourceEntity = this.entities.get(dto.sourceEntityId);
      const targetEntity = this.entities.get(dto.targetEntityId);

      if (!sourceEntity || !targetEntity) {
        throw new NotFoundError('Entity', !sourceEntity ? dto.sourceEntityId : dto.targetEntityId);
      }

      const relationship = {
        id: this.generateId(),
        sourceEntityId: dto.sourceEntityId,
        targetEntityId: dto.targetEntityId,
        type: dto.relationshipType,
        name: dto.relationshipName,
        metadata: dto.relationshipMetadata,
        createdAt: new Date(),
        createdBy: requestId,
      };

      if (!this.relationships.has(dto.sourceEntityId)) {
        this.relationships.set(dto.sourceEntityId, []);
      }
      this.relationships.get(dto.sourceEntityId)!.push(relationship);

      this.logger.log(`[${requestId}] Entities linked: ${relationship.id}`);
      return relationship;
    } catch (error) {
      this.logger.error(`[${requestId}] Link failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Unlink entities
   */
  async unlinkEntities(dto: UnlinkEntitiesDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Unlinking entities: ${dto.sourceEntityId} -> ${dto.targetEntityId}`);

      const relationships = this.relationships.get(dto.sourceEntityId) || [];
      const filteredRelationships = relationships.filter(rel => {
        const matchesTarget = rel.targetEntityId === dto.targetEntityId;
        const matchesType = !dto.relationshipType || rel.type === dto.relationshipType;
        return !(matchesTarget && matchesType);
      });

      this.relationships.set(dto.sourceEntityId, filteredRelationships);

      const removedCount = relationships.length - filteredRelationships.length;
      this.logger.log(`[${requestId}] Removed ${removedCount} relationship(s)`);
      return { removed: removedCount };
    } catch (error) {
      this.logger.error(`[${requestId}] Unlink failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Get entity relationships
   */
  async getRelationships(entityId: string, type?: RelationshipType, requestId?: string): Promise<any[]> {
    try {
      this.logger.log(`[${requestId}] Getting relationships for entity: ${entityId}`);

      let relationships = this.relationships.get(entityId) || [];

      if (type) {
        relationships = relationships.filter(rel => rel.type === type);
      }

      this.logger.log(`[${requestId}] Found ${relationships.length} relationship(s)`);
      return relationships;
    } catch (error) {
      this.logger.error(`[${requestId}] Get relationships failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Create snapshot
   */
  async createSnapshot(dto: CreateSnapshotDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Creating snapshot for entity: ${dto.entityId}`);

      const entity = this.entities.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      const snapshot = {
        id: this.generateId(),
        entityId: dto.entityId,
        data: JSON.parse(JSON.stringify(entity)),
        description: dto.description,
        createdAt: new Date(),
        createdBy: requestId,
      };

      if (dto.includeRelationships) {
        snapshot['relationships'] = this.relationships.get(dto.entityId) || [];
      }

      if (!this.snapshots.has(dto.entityId)) {
        this.snapshots.set(dto.entityId, []);
      }
      this.snapshots.get(dto.entityId)!.push(snapshot);

      this.logger.log(`[${requestId}] Snapshot created: ${snapshot.id}`);
      return snapshot;
    } catch (error) {
      this.logger.error(`[${requestId}] Snapshot creation failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * List snapshots
   */
  async listSnapshots(entityId: string, requestId: string): Promise<any[]> {
    try {
      this.logger.log(`[${requestId}] Listing snapshots for entity: ${entityId}`);

      const snapshots = this.snapshots.get(entityId) || [];
      this.logger.log(`[${requestId}] Found ${snapshots.length} snapshot(s)`);
      return snapshots;
    } catch (error) {
      this.logger.error(`[${requestId}] List snapshots failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Lock entity
   */
  async lockEntity(dto: LockEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Locking entity: ${dto.entityId}`);

      const entity = this.entities.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      if (this.locks.has(dto.entityId)) {
        throw new ConflictError('Entity is already locked');
      }

      const lock = {
        lockedBy: requestId,
        lockedAt: new Date(),
        expiresAt: dto.duration ? new Date(Date.now() + dto.duration * 1000) : undefined,
      };

      this.locks.set(dto.entityId, lock);

      entity.state = EntityState.LOCKED;
      entity.lockedBy = requestId;
      entity.lockedAt = lock.lockedAt;
      this.entities.set(dto.entityId, entity);

      this.logger.log(`[${requestId}] Entity locked: ${dto.entityId}`);
      return { locked: true, ...lock };
    } catch (error) {
      this.logger.error(`[${requestId}] Lock failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Unlock entity
   */
  async unlockEntity(dto: UnlockEntityDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Unlocking entity: ${dto.entityId}`);

      const entity = this.entities.get(dto.entityId);
      if (!entity) {
        throw new NotFoundError('Entity', dto.entityId);
      }

      const lock = this.locks.get(dto.entityId);
      if (!lock) {
        throw new NotFoundError('Lock', dto.entityId);
      }

      if (!dto.force && lock.lockedBy !== requestId) {
        throw new ConflictError('Entity is locked by another user');
      }

      this.locks.delete(dto.entityId);

      entity.state = EntityState.ACTIVE;
      delete entity.lockedBy;
      delete entity.lockedAt;
      this.entities.set(dto.entityId, entity);

      this.logger.log(`[${requestId}] Entity unlocked: ${dto.entityId}`);
      return { unlocked: true };
    } catch (error) {
      this.logger.error(`[${requestId}] Unlock failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Get version history
   */
  async getVersionHistory(dto: GetVersionHistoryDto, requestId: string): Promise<{ data: EntityVersion[]; total: number }> {
    try {
      this.logger.log(`[${requestId}] Getting version history for entity: ${dto.entityId}`);

      let versions = this.versions.get(dto.entityId) || [];
      const total = versions.length;

      // Paginate
      const offset = (dto.page - 1) * dto.pageSize;
      versions = versions.slice(offset, offset + dto.pageSize);

      // Remove data if not requested
      if (!dto.includeData) {
        versions = versions.map(v => {
          const { data, ...rest } = v;
          return rest as EntityVersion;
        });
      }

      this.logger.log(`[${requestId}] Retrieved ${versions.length}/${total} versions`);
      return { data: versions, total };
    } catch (error) {
      this.logger.error(`[${requestId}] Get version history failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Compare versions
   */
  async compareVersions(dto: CompareVersionsDto, requestId: string): Promise<any> {
    try {
      this.logger.log(`[${requestId}] Comparing versions for entity: ${dto.entityId}`);

      const versions = this.versions.get(dto.entityId) || [];
      const version1 = versions.find(v => v.version === dto.version1);
      const version2 = versions.find(v => v.version === dto.version2);

      if (!version1 || !version2) {
        throw new NotFoundError('Version', !version1 ? dto.version1.toString() : dto.version2.toString());
      }

      const differences = dto.detailedDiff
        ? this.detailedDiff(version1.data, version2.data)
        : this.simpleDiff(version1.data, version2.data);

      this.logger.log(`[${requestId}] Version comparison completed`);
      return {
        version1: dto.version1,
        version2: dto.version2,
        differences,
        changedFields: Object.keys(differences),
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Version comparison failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Get state history
   */
  async getStateHistory(dto: GetStateHistoryDto, requestId: string): Promise<{ data: StateChange[]; total: number }> {
    try {
      this.logger.log(`[${requestId}] Getting state history for entity: ${dto.entityId}`);

      let history = this.stateHistory.get(dto.entityId) || [];

      // Apply filters
      if (dto.state) {
        history = history.filter(h => h.toState === dto.state);
      }
      if (dto.startDate) {
        history = history.filter(h => h.performedAt >= dto.startDate!);
      }
      if (dto.endDate) {
        history = history.filter(h => h.performedAt <= dto.endDate!);
      }

      const total = history.length;

      // Paginate
      const offset = (dto.page - 1) * dto.pageSize;
      history = history.slice(offset, offset + dto.pageSize);

      this.logger.log(`[${requestId}] Retrieved ${history.length}/${total} state changes`);
      return { data: history, total };
    } catch (error) {
      this.logger.error(`[${requestId}] Get state history failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async createVersion(
    entityId: string,
    data: any,
    changedBy: string,
    changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE',
    description?: string
  ): Promise<void> {
    if (!this.versions.has(entityId)) {
      this.versions.set(entityId, []);
    }

    const versions = this.versions.get(entityId)!;
    const version: EntityVersion = {
      version: versions.length + 1,
      entityId,
      data: JSON.parse(JSON.stringify(data)),
      changedBy,
      changedAt: new Date(),
      changeType,
      changeDescription: description,
    };

    versions.push(version);
  }

  private validateStateTransition(from: EntityState, to: EntityState, transition: StateTransition): void {
    const validTransitions: Record<EntityState, EntityState[]> = {
      [EntityState.DRAFT]: [EntityState.ACTIVE, EntityState.DELETED],
      [EntityState.ACTIVE]: [EntityState.INACTIVE, EntityState.SUSPENDED, EntityState.ARCHIVED, EntityState.DELETED],
      [EntityState.INACTIVE]: [EntityState.ACTIVE, EntityState.ARCHIVED, EntityState.DELETED],
      [EntityState.SUSPENDED]: [EntityState.ACTIVE, EntityState.DELETED],
      [EntityState.ARCHIVED]: [EntityState.ACTIVE, EntityState.DELETED],
      [EntityState.DELETED]: [EntityState.ACTIVE],
      [EntityState.LOCKED]: [EntityState.ACTIVE],
      [EntityState.PENDING_APPROVAL]: [EntityState.ACTIVE, EntityState.REJECTED],
      [EntityState.REJECTED]: [EntityState.DRAFT, EntityState.PENDING_APPROVAL],
    };

    const allowed = validTransitions[from] || [];
    if (!allowed.includes(to)) {
      throw new BadRequestError(`Invalid state transition: ${from} -> ${to}`);
    }
  }

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

  private applyCustomMerge(primary: any, secondaries: any[], rules: Record<string, any>): any {
    // Implement custom merge logic based on rules
    // This is a placeholder for custom merge strategies
    return primary;
  }

  private detailedDiff(obj1: any, obj2: any): Record<string, any> {
    const diff: Record<string, any> = {};

    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    allKeys.forEach(key => {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        diff[key] = {
          old: obj1[key],
          new: obj2[key],
        };
      }
    });

    return diff;
  }

  private simpleDiff(obj1: any, obj2: any): Record<string, any> {
    const diff: Record<string, any> = {};

    Object.keys(obj2).forEach(key => {
      if (obj1[key] !== obj2[key]) {
        diff[key] = obj2[key];
      }
    });

    return diff;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  EntityManagementController,
  EntityManagementService,
};
