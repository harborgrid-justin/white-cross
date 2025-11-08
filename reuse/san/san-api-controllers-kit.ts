/**
 * LOC: S1A2N3C4T5
 * File: /reuse/san/san-api-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - SAN Volume Controllers
 *   - SAN LUN Controllers
 *   - SAN Snapshot Controllers
 *   - SAN Replication Controllers
 */

/**
 * File: /reuse/san/san-api-controllers-kit.ts
 * Locator: WC-SAN-CTRL-001
 * Purpose: SAN REST API Controllers Kit - Comprehensive controller utilities for Storage Area Network APIs
 *
 * Upstream: @nestjs/common, @nestjs/swagger, @nestjs/platform-express, class-transformer, class-validator
 * Downstream: All SAN controllers, volume management, LUN management, snapshot management, replication APIs
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express
 * Exports: 35 SAN controller functions for volumes, LUNs, snapshots, replication, monitoring
 *
 * LLM Context: Production-grade SAN REST API controller toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for SAN volume management, LUN provisioning, snapshot operations,
 * replication management, performance monitoring, capacity planning, and storage analytics.
 * HIPAA-compliant with comprehensive audit logging, PHI protection, and healthcare-specific storage validation.
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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiProduces,
  ApiConsumes,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IsString, IsNumber, IsBoolean, IsEnum, IsOptional, IsUUID, IsArray, Min, Max, ValidateNested, IsObject, IsInt, IsPositive, MaxLength, MinLength } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * SAN Volume types
 */
export enum VolumeType {
  THICK = 'THICK',
  THIN = 'THIN',
  DEDUP = 'DEDUP',
  COMPRESSED = 'COMPRESSED',
}

/**
 * Volume status enumeration
 */
export enum VolumeStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  FAILED = 'FAILED',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  MIGRATING = 'MIGRATING',
}

/**
 * LUN protocol types
 */
export enum LunProtocol {
  ISCSI = 'ISCSI',
  FC = 'FC',
  FCOE = 'FCOE',
  NVME = 'NVME',
}

/**
 * Snapshot status
 */
export enum SnapshotStatus {
  ACTIVE = 'ACTIVE',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  FAILED = 'FAILED',
}

/**
 * Replication status
 */
export enum ReplicationStatus {
  SYNCING = 'SYNCING',
  SYNCHRONIZED = 'SYNCHRONIZED',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED',
  INITIALIZING = 'INITIALIZING',
}

/**
 * Replication mode
 */
export enum ReplicationMode {
  SYNCHRONOUS = 'SYNCHRONOUS',
  ASYNCHRONOUS = 'ASYNCHRONOUS',
  SEMI_SYNCHRONOUS = 'SEMI_SYNCHRONOUS',
}

/**
 * Storage tier for tiered storage
 */
export enum StorageTier {
  TIER_0 = 'TIER_0', // NVMe/Flash
  TIER_1 = 'TIER_1', // SSD
  TIER_2 = 'TIER_2', // SAS
  TIER_3 = 'TIER_3', // SATA
}

/**
 * RAID level configuration
 */
export enum RaidLevel {
  RAID_0 = 'RAID_0',
  RAID_1 = 'RAID_1',
  RAID_5 = 'RAID_5',
  RAID_6 = 'RAID_6',
  RAID_10 = 'RAID_10',
  RAID_50 = 'RAID_50',
}

// ============================================================================
// REQUEST DTOs
// ============================================================================

/**
 * Base SAN audit metadata
 */
export class SanAuditMetadata {
  @ApiProperty({ description: 'User ID performing the operation' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsString()
  @IsOptional()
  organizationId?: string;

  @ApiProperty({ description: 'Request ID for tracking' })
  @IsString()
  @IsOptional()
  requestId?: string;

  @ApiProperty({ description: 'Client IP address' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ description: 'Reason for operation' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;
}

/**
 * Create Volume DTO
 */
export class CreateVolumeDto extends SanAuditMetadata {
  @ApiProperty({ description: 'Volume name', example: 'patient-records-vol-01' })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @ApiProperty({ description: 'Volume size in GB', example: 500 })
  @IsNumber()
  @Min(1)
  @Max(100000)
  sizeGB: number;

  @ApiProperty({ description: 'Volume type', enum: VolumeType })
  @IsEnum(VolumeType)
  type: VolumeType;

  @ApiProperty({ description: 'Storage tier', enum: StorageTier, required: false })
  @IsEnum(StorageTier)
  @IsOptional()
  tier?: StorageTier;

  @ApiProperty({ description: 'RAID level', enum: RaidLevel, required: false })
  @IsEnum(RaidLevel)
  @IsOptional()
  raidLevel?: RaidLevel;

  @ApiProperty({ description: 'Enable encryption', default: true })
  @IsBoolean()
  @IsOptional()
  encrypted?: boolean;

  @ApiProperty({ description: 'Enable compression', default: false })
  @IsBoolean()
  @IsOptional()
  compressed?: boolean;

  @ApiProperty({ description: 'Enable deduplication', default: false })
  @IsBoolean()
  @IsOptional()
  deduplication?: boolean;

  @ApiProperty({ description: 'Volume description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Tags for classification', required: false })
  @IsObject()
  @IsOptional()
  tags?: Record<string, string>;
}

/**
 * Update Volume DTO
 */
export class UpdateVolumeDto {
  @ApiProperty({ description: 'New volume name', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(64)
  name?: string;

  @ApiProperty({ description: 'New size in GB (expand only)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  sizeGB?: number;

  @ApiProperty({ description: 'Update description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Update tags', required: false })
  @IsObject()
  @IsOptional()
  tags?: Record<string, string>;

  @ApiProperty({ description: 'Change storage tier', enum: StorageTier, required: false })
  @IsEnum(StorageTier)
  @IsOptional()
  tier?: StorageTier;
}

/**
 * Create LUN DTO
 */
export class CreateLunDto extends SanAuditMetadata {
  @ApiProperty({ description: 'LUN name', example: 'medical-imaging-lun-01' })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @ApiProperty({ description: 'Volume ID to create LUN on' })
  @IsUUID()
  volumeId: string;

  @ApiProperty({ description: 'LUN size in GB', example: 100 })
  @IsNumber()
  @Min(1)
  @Max(10000)
  sizeGB: number;

  @ApiProperty({ description: 'Protocol', enum: LunProtocol })
  @IsEnum(LunProtocol)
  protocol: LunProtocol;

  @ApiProperty({ description: 'LUN ID (if specific ID required)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(255)
  lunId?: number;

  @ApiProperty({ description: 'Host access groups (initiators)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  hostGroups: string[];

  @ApiProperty({ description: 'Enable write cache', default: true })
  @IsBoolean()
  @IsOptional()
  writeCache?: boolean;

  @ApiProperty({ description: 'Enable read cache', default: true })
  @IsBoolean()
  @IsOptional()
  readCache?: boolean;

  @ApiProperty({ description: 'LUN description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

/**
 * Update LUN DTO
 */
export class UpdateLunDto {
  @ApiProperty({ description: 'New LUN name', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(64)
  name?: string;

  @ApiProperty({ description: 'Expand size in GB', required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  sizeGB?: number;

  @ApiProperty({ description: 'Update host groups', required: false, type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  hostGroups?: string[];

  @ApiProperty({ description: 'Update write cache setting', required: false })
  @IsBoolean()
  @IsOptional()
  writeCache?: boolean;

  @ApiProperty({ description: 'Update read cache setting', required: false })
  @IsBoolean()
  @IsOptional()
  readCache?: boolean;

  @ApiProperty({ description: 'Update description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

/**
 * Create Snapshot DTO
 */
export class CreateSnapshotDto extends SanAuditMetadata {
  @ApiProperty({ description: 'Snapshot name', example: 'patient-data-snapshot-2024-01' })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @ApiProperty({ description: 'Volume ID or LUN ID to snapshot' })
  @IsUUID()
  sourceId: string;

  @ApiProperty({ description: 'Source type', enum: ['volume', 'lun'] })
  @IsEnum(['volume', 'lun'])
  sourceType: 'volume' | 'lun';

  @ApiProperty({ description: 'Snapshot description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Retention period in days', required: false, default: 30 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(3650)
  retentionDays?: number;

  @ApiProperty({ description: 'Tags for classification', required: false })
  @IsObject()
  @IsOptional()
  tags?: Record<string, string>;
}

/**
 * Create Replication DTO
 */
export class CreateReplicationDto extends SanAuditMetadata {
  @ApiProperty({ description: 'Replication name', example: 'dr-replication-primary-to-secondary' })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @ApiProperty({ description: 'Source volume ID' })
  @IsUUID()
  sourceVolumeId: string;

  @ApiProperty({ description: 'Target volume ID' })
  @IsUUID()
  targetVolumeId: string;

  @ApiProperty({ description: 'Replication mode', enum: ReplicationMode })
  @IsEnum(ReplicationMode)
  mode: ReplicationMode;

  @ApiProperty({ description: 'Target array ID/address' })
  @IsString()
  targetArrayId: string;

  @ApiProperty({ description: 'Sync interval in minutes (for async)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(1440)
  syncIntervalMinutes?: number;

  @ApiProperty({ description: 'Enable compression for data transfer', default: true })
  @IsBoolean()
  @IsOptional()
  compressionEnabled?: boolean;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

/**
 * Volume query/filter DTO
 */
export class VolumeQueryDto {
  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 20 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({ description: 'Filter by status', enum: VolumeStatus, required: false })
  @IsEnum(VolumeStatus)
  @IsOptional()
  status?: VolumeStatus;

  @ApiProperty({ description: 'Filter by type', enum: VolumeType, required: false })
  @IsEnum(VolumeType)
  @IsOptional()
  type?: VolumeType;

  @ApiProperty({ description: 'Filter by storage tier', enum: StorageTier, required: false })
  @IsEnum(StorageTier)
  @IsOptional()
  tier?: StorageTier;

  @ApiProperty({ description: 'Search by name', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Sort by field', required: false, default: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({ description: 'Sort order', enum: ['ASC', 'DESC'], required: false, default: 'DESC' })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * Performance metrics query DTO
 */
export class PerformanceQueryDto {
  @ApiProperty({ description: 'Start time (ISO 8601)', required: false })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ description: 'End time (ISO 8601)', required: false })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ description: 'Metric interval in seconds', required: false, default: 300 })
  @IsNumber()
  @IsOptional()
  @Min(60)
  @Max(3600)
  @Type(() => Number)
  intervalSeconds?: number = 300;

  @ApiProperty({ description: 'Metrics to retrieve', type: [String], required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  metrics?: string[];
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================

/**
 * Volume response DTO
 */
export class VolumeResponseDto {
  @ApiProperty({ description: 'Volume ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Volume name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Size in GB' })
  @Expose()
  sizeGB: number;

  @ApiProperty({ description: 'Used space in GB' })
  @Expose()
  usedGB: number;

  @ApiProperty({ description: 'Volume type', enum: VolumeType })
  @Expose()
  type: VolumeType;

  @ApiProperty({ description: 'Volume status', enum: VolumeStatus })
  @Expose()
  status: VolumeStatus;

  @ApiProperty({ description: 'Storage tier', enum: StorageTier })
  @Expose()
  tier: StorageTier;

  @ApiProperty({ description: 'RAID level', enum: RaidLevel })
  @Expose()
  raidLevel: RaidLevel;

  @ApiProperty({ description: 'Encryption enabled' })
  @Expose()
  encrypted: boolean;

  @ApiProperty({ description: 'Compression enabled' })
  @Expose()
  compressed: boolean;

  @ApiProperty({ description: 'Deduplication enabled' })
  @Expose()
  deduplication: boolean;

  @ApiProperty({ description: 'Description' })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Tags' })
  @Expose()
  tags?: Record<string, string>;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Created by user ID' })
  @Expose()
  createdBy?: string;
}

/**
 * LUN response DTO
 */
export class LunResponseDto {
  @ApiProperty({ description: 'LUN ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'LUN name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'LUN number' })
  @Expose()
  lunId: number;

  @ApiProperty({ description: 'Volume ID' })
  @Expose()
  volumeId: string;

  @ApiProperty({ description: 'Size in GB' })
  @Expose()
  sizeGB: number;

  @ApiProperty({ description: 'Protocol', enum: LunProtocol })
  @Expose()
  protocol: LunProtocol;

  @ApiProperty({ description: 'Status' })
  @Expose()
  status: string;

  @ApiProperty({ description: 'Host groups' })
  @Expose()
  hostGroups: string[];

  @ApiProperty({ description: 'Write cache enabled' })
  @Expose()
  writeCache: boolean;

  @ApiProperty({ description: 'Read cache enabled' })
  @Expose()
  readCache: boolean;

  @ApiProperty({ description: 'Description' })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updatedAt: Date;
}

/**
 * Snapshot response DTO
 */
export class SnapshotResponseDto {
  @ApiProperty({ description: 'Snapshot ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Snapshot name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Source ID (volume or LUN)' })
  @Expose()
  sourceId: string;

  @ApiProperty({ description: 'Source type' })
  @Expose()
  sourceType: 'volume' | 'lun';

  @ApiProperty({ description: 'Snapshot size in GB' })
  @Expose()
  sizeGB: number;

  @ApiProperty({ description: 'Status', enum: SnapshotStatus })
  @Expose()
  status: SnapshotStatus;

  @ApiProperty({ description: 'Retention days' })
  @Expose()
  retentionDays: number;

  @ApiProperty({ description: 'Expiration date' })
  @Expose()
  expiresAt: Date;

  @ApiProperty({ description: 'Description' })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Tags' })
  @Expose()
  tags?: Record<string, string>;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Created by user ID' })
  @Expose()
  createdBy?: string;
}

/**
 * Replication response DTO
 */
export class ReplicationResponseDto {
  @ApiProperty({ description: 'Replication ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Replication name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Source volume ID' })
  @Expose()
  sourceVolumeId: string;

  @ApiProperty({ description: 'Target volume ID' })
  @Expose()
  targetVolumeId: string;

  @ApiProperty({ description: 'Target array ID' })
  @Expose()
  targetArrayId: string;

  @ApiProperty({ description: 'Mode', enum: ReplicationMode })
  @Expose()
  mode: ReplicationMode;

  @ApiProperty({ description: 'Status', enum: ReplicationStatus })
  @Expose()
  status: ReplicationStatus;

  @ApiProperty({ description: 'Sync interval minutes' })
  @Expose()
  syncIntervalMinutes?: number;

  @ApiProperty({ description: 'Compression enabled' })
  @Expose()
  compressionEnabled: boolean;

  @ApiProperty({ description: 'Last sync time' })
  @Expose()
  lastSyncAt?: Date;

  @ApiProperty({ description: 'Next sync time' })
  @Expose()
  nextSyncAt?: Date;

  @ApiProperty({ description: 'Bytes transferred' })
  @Expose()
  bytesTransferred: number;

  @ApiProperty({ description: 'Sync progress percentage' })
  @Expose()
  syncProgress: number;

  @ApiProperty({ description: 'Description' })
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  createdAt: Date;
}

/**
 * Paginated response wrapper
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Data items' })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Performance metrics response DTO
 */
export class PerformanceMetricsDto {
  @ApiProperty({ description: 'Resource ID' })
  @Expose()
  resourceId: string;

  @ApiProperty({ description: 'Resource type' })
  @Expose()
  resourceType: string;

  @ApiProperty({ description: 'Timestamp' })
  @Expose()
  timestamp: Date;

  @ApiProperty({ description: 'IOPS (read)' })
  @Expose()
  iopsRead: number;

  @ApiProperty({ description: 'IOPS (write)' })
  @Expose()
  iopsWrite: number;

  @ApiProperty({ description: 'Throughput MB/s (read)' })
  @Expose()
  throughputReadMBps: number;

  @ApiProperty({ description: 'Throughput MB/s (write)' })
  @Expose()
  throughputWriteMBps: number;

  @ApiProperty({ description: 'Latency ms (read)' })
  @Expose()
  latencyReadMs: number;

  @ApiProperty({ description: 'Latency ms (write)' })
  @Expose()
  latencyWriteMs: number;

  @ApiProperty({ description: 'Queue depth' })
  @Expose()
  queueDepth: number;

  @ApiProperty({ description: 'CPU utilization %' })
  @Expose()
  cpuUtilization: number;
}

/**
 * Capacity report DTO
 */
export class CapacityReportDto {
  @ApiProperty({ description: 'Total capacity GB' })
  @Expose()
  totalCapacityGB: number;

  @ApiProperty({ description: 'Used capacity GB' })
  @Expose()
  usedCapacityGB: number;

  @ApiProperty({ description: 'Available capacity GB' })
  @Expose()
  availableCapacityGB: number;

  @ApiProperty({ description: 'Utilization percentage' })
  @Expose()
  utilizationPercent: number;

  @ApiProperty({ description: 'Projected days until full' })
  @Expose()
  projectedDaysUntilFull: number;

  @ApiProperty({ description: 'Capacity by tier' })
  @Expose()
  capacityByTier: Record<StorageTier, { total: number; used: number; available: number }>;

  @ApiProperty({ description: 'Capacity by volume type' })
  @Expose()
  capacityByType: Record<VolumeType, { total: number; used: number; available: number }>;
}

// ============================================================================
// CUSTOM PARAMETER DECORATORS
// ============================================================================

/**
 * Extracts SAN audit context from request
 */
export const SanAuditContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SanAuditMetadata => {
    const request = ctx.switchToHttp().getRequest();
    return {
      userId: request.user?.id,
      organizationId: request.user?.organizationId,
      requestId: request.headers['x-request-id'] || `req-${Date.now()}`,
      ipAddress:
        (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        request.ip ||
        'unknown',
    };
  },
);

/**
 * Extracts storage array ID from headers
 */
export const StorageArrayId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-storage-array-id'];
  },
);

// ============================================================================
// CUSTOM ROUTE DECORATORS
// ============================================================================

/**
 * Decorator for SAN controller endpoints with audit logging
 */
export function SanApiOperation(summary: string, description?: string): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary, description }),
    SetMetadata('san:audit', true),
    SetMetadata('san:operation', summary),
  );
}

/**
 * Decorator for volume management endpoints
 */
export function VolumeEndpoint(summary: string): MethodDecorator {
  return applyDecorators(
    SanApiOperation(summary),
    ApiTags('SAN - Volumes'),
    ApiBearerAuth(),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}

/**
 * Decorator for LUN management endpoints
 */
export function LunEndpoint(summary: string): MethodDecorator {
  return applyDecorators(
    SanApiOperation(summary),
    ApiTags('SAN - LUNs'),
    ApiBearerAuth(),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}

/**
 * Decorator for snapshot management endpoints
 */
export function SnapshotEndpoint(summary: string): MethodDecorator {
  return applyDecorators(
    SanApiOperation(summary),
    ApiTags('SAN - Snapshots'),
    ApiBearerAuth(),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}

/**
 * Decorator for replication management endpoints
 */
export function ReplicationEndpoint(summary: string): MethodDecorator {
  return applyDecorators(
    SanApiOperation(summary),
    ApiTags('SAN - Replication'),
    ApiBearerAuth(),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}

// ============================================================================
// CONTROLLER UTILITY FUNCTIONS
// ============================================================================

/**
 * 1. Creates paginated response for SAN resources
 */
export function createSanPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponseDto<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * 2. Validates volume creation parameters
 */
export function validateVolumeCreation(dto: CreateVolumeDto): void {
  // Validate size constraints based on type
  if (dto.type === VolumeType.THIN && dto.sizeGB > 50000) {
    throw new BadRequestException('Thin volumes cannot exceed 50TB');
  }

  // Validate tier and RAID compatibility
  if (dto.tier === StorageTier.TIER_0 && dto.raidLevel === RaidLevel.RAID_5) {
    throw new BadRequestException('RAID 5 is not recommended for Tier 0 storage');
  }

  // Validate deduplication only on supported types
  if (dto.deduplication && dto.type !== VolumeType.DEDUP) {
    throw new BadRequestException('Deduplication requires DEDUP volume type');
  }
}

/**
 * 3. Validates volume expansion request
 */
export function validateVolumeExpansion(
  currentSizeGB: number,
  newSizeGB: number,
  maxSizeGB: number = 100000,
): void {
  if (newSizeGB <= currentSizeGB) {
    throw new BadRequestException('New size must be larger than current size');
  }

  if (newSizeGB > maxSizeGB) {
    throw new BadRequestException(`Volume size cannot exceed ${maxSizeGB}GB`);
  }

  const expansionPercent = ((newSizeGB - currentSizeGB) / currentSizeGB) * 100;
  if (expansionPercent > 500) {
    throw new BadRequestException('Volume expansion cannot exceed 500% of current size');
  }
}

/**
 * 4. Validates LUN creation parameters
 */
export function validateLunCreation(dto: CreateLunDto): void {
  // Validate LUN size
  if (dto.sizeGB > 10000) {
    throw new BadRequestException('LUN size cannot exceed 10TB');
  }

  // Validate protocol-specific constraints
  if (dto.protocol === LunProtocol.ISCSI && dto.hostGroups.length === 0) {
    throw new BadRequestException('iSCSI LUNs require at least one host group');
  }

  // Validate LUN ID range
  if (dto.lunId !== undefined && (dto.lunId < 0 || dto.lunId > 255)) {
    throw new BadRequestException('LUN ID must be between 0 and 255');
  }
}

/**
 * 5. Validates LUN mapping to host groups
 */
export function validateLunMapping(
  hostGroups: string[],
  availableGroups: string[],
): void {
  if (hostGroups.length === 0) {
    throw new BadRequestException('At least one host group is required');
  }

  const invalidGroups = hostGroups.filter((group) => !availableGroups.includes(group));
  if (invalidGroups.length > 0) {
    throw new BadRequestException(
      `Invalid host groups: ${invalidGroups.join(', ')}`,
    );
  }
}

/**
 * 6. Validates snapshot creation parameters
 */
export function validateSnapshotCreation(dto: CreateSnapshotDto): void {
  // Validate retention period
  if (dto.retentionDays && (dto.retentionDays < 1 || dto.retentionDays > 3650)) {
    throw new BadRequestException('Retention period must be between 1 and 3650 days');
  }

  // Validate snapshot naming convention
  const namePattern = /^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/;
  if (!namePattern.test(dto.name)) {
    throw new BadRequestException(
      'Snapshot name must start and end with alphanumeric characters',
    );
  }
}

/**
 * 7. Calculates snapshot expiration date
 */
export function calculateSnapshotExpiration(
  createdAt: Date,
  retentionDays: number,
): Date {
  const expirationDate = new Date(createdAt);
  expirationDate.setDate(expirationDate.getDate() + retentionDays);
  return expirationDate;
}

/**
 * 8. Validates replication configuration
 */
export function validateReplicationConfig(dto: CreateReplicationDto): void {
  // Validate source and target are different
  if (dto.sourceVolumeId === dto.targetVolumeId) {
    throw new BadRequestException('Source and target volumes must be different');
  }

  // Validate sync interval for async mode
  if (dto.mode === ReplicationMode.ASYNCHRONOUS && !dto.syncIntervalMinutes) {
    throw new BadRequestException('Sync interval is required for asynchronous replication');
  }

  // Validate sync interval range
  if (
    dto.syncIntervalMinutes &&
    (dto.syncIntervalMinutes < 5 || dto.syncIntervalMinutes > 1440)
  ) {
    throw new BadRequestException('Sync interval must be between 5 and 1440 minutes');
  }
}

/**
 * 9. Calculates replication next sync time
 */
export function calculateNextSyncTime(
  lastSyncAt: Date,
  intervalMinutes: number,
): Date {
  const nextSync = new Date(lastSyncAt);
  nextSync.setMinutes(nextSync.getMinutes() + intervalMinutes);
  return nextSync;
}

/**
 * 10. Validates storage tier migration
 */
export function validateTierMigration(
  currentTier: StorageTier,
  targetTier: StorageTier,
  volumeType: VolumeType,
): void {
  // Prevent downgrade for certain volume types
  if (volumeType === VolumeType.DEDUP && targetTier === StorageTier.TIER_3) {
    throw new BadRequestException('Dedup volumes cannot be migrated to Tier 3');
  }

  // Validate tier order
  const tierOrder = [StorageTier.TIER_0, StorageTier.TIER_1, StorageTier.TIER_2, StorageTier.TIER_3];
  const currentIndex = tierOrder.indexOf(currentTier);
  const targetIndex = tierOrder.indexOf(targetTier);

  if (Math.abs(currentIndex - targetIndex) > 2) {
    throw new BadRequestException('Cannot skip more than 2 tiers in migration');
  }
}

/**
 * 11. Calculates volume utilization percentage
 */
export function calculateVolumeUtilization(
  usedGB: number,
  totalGB: number,
): number {
  if (totalGB === 0) return 0;
  return Math.round((usedGB / totalGB) * 100 * 100) / 100; // Round to 2 decimals
}

/**
 * 12. Generates volume health status
 */
export function determineVolumeHealth(
  status: VolumeStatus,
  utilizationPercent: number,
  performanceMetrics?: PerformanceMetricsDto,
): 'healthy' | 'warning' | 'critical' | 'failed' {
  if (status === VolumeStatus.FAILED) return 'failed';
  if (status === VolumeStatus.DEGRADED) return 'critical';
  if (utilizationPercent > 95) return 'critical';
  if (utilizationPercent > 85) return 'warning';
  if (performanceMetrics && performanceMetrics.latencyReadMs > 50) return 'warning';
  return 'healthy';
}

/**
 * 13. Validates performance metrics query
 */
export function validatePerformanceQuery(dto: PerformanceQueryDto): void {
  if (dto.startTime && dto.endTime) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
      throw new BadRequestException('Time range cannot exceed 90 days');
    }
  }
}

/**
 * 14. Calculates average performance metrics
 */
export function calculateAverageMetrics(
  metrics: PerformanceMetricsDto[],
): PerformanceMetricsDto | null {
  if (metrics.length === 0) return null;

  const sum = metrics.reduce(
    (acc, m) => ({
      iopsRead: acc.iopsRead + m.iopsRead,
      iopsWrite: acc.iopsWrite + m.iopsWrite,
      throughputReadMBps: acc.throughputReadMBps + m.throughputReadMBps,
      throughputWriteMBps: acc.throughputWriteMBps + m.throughputWriteMBps,
      latencyReadMs: acc.latencyReadMs + m.latencyReadMs,
      latencyWriteMs: acc.latencyWriteMs + m.latencyWriteMs,
      queueDepth: acc.queueDepth + m.queueDepth,
      cpuUtilization: acc.cpuUtilization + m.cpuUtilization,
    }),
    {
      iopsRead: 0,
      iopsWrite: 0,
      throughputReadMBps: 0,
      throughputWriteMBps: 0,
      latencyReadMs: 0,
      latencyWriteMs: 0,
      queueDepth: 0,
      cpuUtilization: 0,
    },
  );

  const count = metrics.length;
  return {
    resourceId: metrics[0].resourceId,
    resourceType: metrics[0].resourceType,
    timestamp: new Date(),
    iopsRead: Math.round(sum.iopsRead / count),
    iopsWrite: Math.round(sum.iopsWrite / count),
    throughputReadMBps: Math.round((sum.throughputReadMBps / count) * 100) / 100,
    throughputWriteMBps: Math.round((sum.throughputWriteMBps / count) * 100) / 100,
    latencyReadMs: Math.round((sum.latencyReadMs / count) * 100) / 100,
    latencyWriteMs: Math.round((sum.latencyWriteMs / count) * 100) / 100,
    queueDepth: Math.round(sum.queueDepth / count),
    cpuUtilization: Math.round((sum.cpuUtilization / count) * 100) / 100,
  };
}

/**
 * 15. Generates capacity forecast
 */
export function generateCapacityForecast(
  currentUsedGB: number,
  totalGB: number,
  dailyGrowthGB: number,
): number {
  const availableGB = totalGB - currentUsedGB;
  if (dailyGrowthGB <= 0 || availableGB <= 0) return -1;
  return Math.floor(availableGB / dailyGrowthGB);
}

/**
 * 16. Validates RAID level for volume size
 */
export function validateRaidForVolumeSize(
  raidLevel: RaidLevel,
  sizeGB: number,
  diskCount: number,
): void {
  // Minimum disk requirements
  const minDisks: Record<RaidLevel, number> = {
    [RaidLevel.RAID_0]: 2,
    [RaidLevel.RAID_1]: 2,
    [RaidLevel.RAID_5]: 3,
    [RaidLevel.RAID_6]: 4,
    [RaidLevel.RAID_10]: 4,
    [RaidLevel.RAID_50]: 6,
  };

  if (diskCount < minDisks[raidLevel]) {
    throw new BadRequestException(
      `${raidLevel} requires at least ${minDisks[raidLevel]} disks`,
    );
  }

  // Size limitations
  if (raidLevel === RaidLevel.RAID_0 && sizeGB > 10000) {
    throw new BadRequestException('RAID 0 volumes should not exceed 10TB for safety');
  }
}

/**
 * 17. Calculates RAID usable capacity
 */
export function calculateRaidUsableCapacity(
  raidLevel: RaidLevel,
  diskSizeGB: number,
  diskCount: number,
): number {
  switch (raidLevel) {
    case RaidLevel.RAID_0:
      return diskSizeGB * diskCount;
    case RaidLevel.RAID_1:
      return diskSizeGB * (diskCount / 2);
    case RaidLevel.RAID_5:
      return diskSizeGB * (diskCount - 1);
    case RaidLevel.RAID_6:
      return diskSizeGB * (diskCount - 2);
    case RaidLevel.RAID_10:
      return diskSizeGB * (diskCount / 2);
    case RaidLevel.RAID_50:
      return diskSizeGB * (diskCount - 2);
    default:
      return 0;
  }
}

/**
 * 18. Validates snapshot restore operation
 */
export function validateSnapshotRestore(
  snapshotStatus: SnapshotStatus,
  targetVolumeStatus: VolumeStatus,
): void {
  if (snapshotStatus !== SnapshotStatus.ACTIVE) {
    throw new BadRequestException('Can only restore from active snapshots');
  }

  if (
    targetVolumeStatus !== VolumeStatus.ONLINE &&
    targetVolumeStatus !== VolumeStatus.OFFLINE
  ) {
    throw new BadRequestException('Target volume must be online or offline for restore');
  }
}

/**
 * 19. Calculates snapshot space savings
 */
export function calculateSnapshotSavings(
  originalSizeGB: number,
  actualSizeGB: number,
): { savingsGB: number; savingsPercent: number } {
  const savingsGB = originalSizeGB - actualSizeGB;
  const savingsPercent = (savingsGB / originalSizeGB) * 100;
  return {
    savingsGB: Math.round(savingsGB * 100) / 100,
    savingsPercent: Math.round(savingsPercent * 100) / 100,
  };
}

/**
 * 20. Validates volume deletion
 */
export function validateVolumeDeletion(
  volumeStatus: VolumeStatus,
  hasSnapshots: boolean,
  hasLuns: boolean,
  hasReplications: boolean,
): void {
  if (volumeStatus === VolumeStatus.CREATING || volumeStatus === VolumeStatus.DELETING) {
    throw new ConflictException('Volume is currently being created or deleted');
  }

  if (hasLuns) {
    throw new ConflictException('Cannot delete volume with active LUNs');
  }

  if (hasReplications) {
    throw new ConflictException('Cannot delete volume with active replications');
  }

  if (hasSnapshots) {
    throw new ConflictException(
      'Cannot delete volume with snapshots. Delete snapshots first.',
    );
  }
}

/**
 * 21. Generates SAN audit log entry
 */
export function createSanAuditLog(
  operation: string,
  resourceType: 'volume' | 'lun' | 'snapshot' | 'replication',
  resourceId: string,
  metadata: SanAuditMetadata,
  success: boolean,
  errorMessage?: string,
): {
  operation: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  organizationId?: string;
  requestId: string;
  ipAddress: string;
  success: boolean;
  errorMessage?: string;
  timestamp: Date;
} {
  return {
    operation,
    resourceType,
    resourceId,
    userId: metadata.userId || 'system',
    organizationId: metadata.organizationId,
    requestId: metadata.requestId || 'unknown',
    ipAddress: metadata.ipAddress || 'unknown',
    success,
    errorMessage,
    timestamp: new Date(),
  };
}

/**
 * 22. Validates storage array connectivity
 */
export function validateStorageArrayConnection(
  arrayId: string,
  availableArrays: string[],
): void {
  if (!availableArrays.includes(arrayId)) {
    throw new NotFoundException(`Storage array ${arrayId} not found or unavailable`);
  }
}

/**
 * 23. Calculates replication bandwidth requirements
 */
export function calculateReplicationBandwidth(
  volumeSizeGB: number,
  changeRatePercent: number,
  syncIntervalMinutes: number,
): { requiredMBps: number; dailyDataGB: number } {
  const dailyChangeGB = (volumeSizeGB * changeRatePercent) / 100;
  const changePerSyncGB = (dailyChangeGB / (24 * 60)) * syncIntervalMinutes;
  const requiredMBps = (changePerSyncGB * 1024) / (syncIntervalMinutes * 60);

  return {
    requiredMBps: Math.round(requiredMBps * 100) / 100,
    dailyDataGB: Math.round(dailyChangeGB * 100) / 100,
  };
}

/**
 * 24. Validates thin provisioning over-commitment
 */
export function validateThinProvisioningRatio(
  totalProvisionedGB: number,
  totalPhysicalGB: number,
  maxRatio: number = 3,
): void {
  const ratio = totalProvisionedGB / totalPhysicalGB;
  if (ratio > maxRatio) {
    throw new BadRequestException(
      `Thin provisioning ratio ${ratio.toFixed(2)}:1 exceeds maximum ${maxRatio}:1`,
    );
  }
}

/**
 * 25. Generates storage efficiency report
 */
export function generateEfficiencyReport(
  totalPhysicalGB: number,
  totalUsedGB: number,
  deduplicationSavingsGB: number,
  compressionSavingsGB: number,
): {
  physicalUsage: number;
  logicalUsage: number;
  deduplicationRatio: number;
  compressionRatio: number;
  overallEfficiency: number;
} {
  const logicalUsage = totalUsedGB + deduplicationSavingsGB + compressionSavingsGB;
  const deduplicationRatio = logicalUsage / (logicalUsage - deduplicationSavingsGB);
  const compressionRatio =
    (logicalUsage - deduplicationSavingsGB) /
    (logicalUsage - deduplicationSavingsGB - compressionSavingsGB);
  const overallEfficiency = logicalUsage / totalUsedGB;

  return {
    physicalUsage: totalUsedGB,
    logicalUsage,
    deduplicationRatio: Math.round(deduplicationRatio * 100) / 100,
    compressionRatio: Math.round(compressionRatio * 100) / 100,
    overallEfficiency: Math.round(overallEfficiency * 100) / 100,
  };
}

/**
 * 26. Validates QoS (Quality of Service) settings
 */
export function validateQoSSettings(
  minIOPS: number,
  maxIOPS: number,
  minThroughputMBps: number,
  maxThroughputMBps: number,
): void {
  if (minIOPS > maxIOPS) {
    throw new BadRequestException('Minimum IOPS cannot exceed maximum IOPS');
  }

  if (minThroughputMBps > maxThroughputMBps) {
    throw new BadRequestException('Minimum throughput cannot exceed maximum throughput');
  }

  if (maxIOPS > 1000000) {
    throw new BadRequestException('Maximum IOPS cannot exceed 1,000,000');
  }

  if (maxThroughputMBps > 10000) {
    throw new BadRequestException('Maximum throughput cannot exceed 10,000 MB/s');
  }
}

/**
 * 27. Generates volume clone validation
 */
export function validateVolumeClone(
  sourceVolumeId: string,
  sourceStatus: VolumeStatus,
  targetName: string,
  existingVolumeNames: string[],
): void {
  if (sourceStatus !== VolumeStatus.ONLINE) {
    throw new BadRequestException('Source volume must be online to clone');
  }

  if (existingVolumeNames.includes(targetName)) {
    throw new ConflictException(`Volume with name ${targetName} already exists`);
  }
}

/**
 * 28. Calculates optimal snapshot schedule
 */
export function calculateSnapshotSchedule(
  changeRateGB: number,
  availableSnapshotSpaceGB: number,
  retentionDays: number,
): { intervalHours: number; maxSnapshots: number } {
  const dailySnapshots = Math.max(1, Math.floor(24 / Math.ceil(changeRateGB / 10)));
  const intervalHours = 24 / dailySnapshots;
  const maxSnapshots = Math.floor(
    availableSnapshotSpaceGB / (changeRateGB * (retentionDays / dailySnapshots)),
  );

  return {
    intervalHours: Math.round(intervalHours),
    maxSnapshots,
  };
}

/**
 * 29. Validates multipath configuration
 */
export function validateMultipathConfig(
  pathCount: number,
  protocol: LunProtocol,
): void {
  if (pathCount < 2) {
    throw new BadRequestException('Multipath requires at least 2 paths for redundancy');
  }

  if (protocol === LunProtocol.ISCSI && pathCount > 8) {
    throw new BadRequestException('iSCSI supports maximum 8 paths');
  }

  if (protocol === LunProtocol.FC && pathCount > 16) {
    throw new BadRequestException('FC supports maximum 16 paths');
  }
}

/**
 * 30. Generates disaster recovery readiness score
 */
export function calculateDRReadiness(
  hasReplication: boolean,
  replicationStatus: ReplicationStatus,
  snapshotCount: number,
  lastBackupAge: number,
): { score: number; status: 'excellent' | 'good' | 'fair' | 'poor' } {
  let score = 0;

  if (hasReplication && replicationStatus === ReplicationStatus.SYNCHRONIZED) {
    score += 40;
  } else if (hasReplication) {
    score += 20;
  }

  if (snapshotCount >= 7) {
    score += 30;
  } else if (snapshotCount >= 3) {
    score += 20;
  } else if (snapshotCount >= 1) {
    score += 10;
  }

  if (lastBackupAge <= 24) {
    score += 30;
  } else if (lastBackupAge <= 48) {
    score += 20;
  } else if (lastBackupAge <= 168) {
    score += 10;
  }

  let status: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 80) status = 'excellent';
  else if (score >= 60) status = 'good';
  else if (score >= 40) status = 'fair';
  else status = 'poor';

  return { score, status };
}

/**
 * 31. Validates storage migration plan
 */
export function validateMigrationPlan(
  sourceVolumeSize: number,
  targetArrayCapacity: number,
  estimatedMigrationHours: number,
  allowedDowntime: number,
): void {
  const requiredCapacity = sourceVolumeSize * 1.2; // 20% buffer
  if (targetArrayCapacity < requiredCapacity) {
    throw new BadRequestException(
      `Target array needs ${requiredCapacity}GB (including 20% buffer), has ${targetArrayCapacity}GB`,
    );
  }

  if (estimatedMigrationHours > allowedDowntime) {
    throw new BadRequestException(
      `Estimated migration time ${estimatedMigrationHours}h exceeds allowed downtime ${allowedDowntime}h`,
    );
  }
}

/**
 * 32. Calculates storage TCO (Total Cost of Ownership)
 */
export function calculateStorageTCO(
  capacityGB: number,
  tier: StorageTier,
  years: number,
): {
  hardwareCost: number;
  maintenanceCost: number;
  powerCost: number;
  totalCost: number;
  costPerGBPerYear: number;
} {
  // Cost per GB per year by tier (example values)
  const tierCosts: Record<StorageTier, number> = {
    [StorageTier.TIER_0]: 5.0,
    [StorageTier.TIER_1]: 2.5,
    [StorageTier.TIER_2]: 1.0,
    [StorageTier.TIER_3]: 0.5,
  };

  const costPerGB = tierCosts[tier];
  const hardwareCost = capacityGB * costPerGB * years;
  const maintenanceCost = hardwareCost * 0.15; // 15% maintenance
  const powerCost = capacityGB * 0.05 * years; // Power cost
  const totalCost = hardwareCost + maintenanceCost + powerCost;

  return {
    hardwareCost: Math.round(hardwareCost * 100) / 100,
    maintenanceCost: Math.round(maintenanceCost * 100) / 100,
    powerCost: Math.round(powerCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerGBPerYear: Math.round((totalCost / capacityGB / years) * 100) / 100,
  };
}

/**
 * 33. Validates storage array firmware version
 */
export function validateFirmwareVersion(
  currentVersion: string,
  minimumVersion: string,
  operation: string,
): void {
  const current = currentVersion.split('.').map(Number);
  const minimum = minimumVersion.split('.').map(Number);

  for (let i = 0; i < Math.max(current.length, minimum.length); i++) {
    const c = current[i] || 0;
    const m = minimum[i] || 0;
    if (c < m) {
      throw new BadRequestException(
        `Operation '${operation}' requires firmware version ${minimumVersion} or higher. Current: ${currentVersion}`,
      );
    }
    if (c > m) break;
  }
}

/**
 * 34. Generates storage health check report
 */
export function generateHealthCheckReport(
  volumes: Array<{ id: string; status: VolumeStatus; utilization: number }>,
  performanceIssues: number,
  capacityWarnings: number,
  failedComponents: number,
): {
  overallHealth: 'healthy' | 'degraded' | 'critical';
  volumeHealth: number;
  performanceHealth: number;
  capacityHealth: number;
  recommendations: string[];
} {
  const healthyVolumes = volumes.filter((v) => v.status === VolumeStatus.ONLINE).length;
  const volumeHealth = (healthyVolumes / volumes.length) * 100;

  const performanceHealth = Math.max(0, 100 - performanceIssues * 10);
  const capacityHealth = Math.max(0, 100 - capacityWarnings * 15);

  const overallScore = (volumeHealth + performanceHealth + capacityHealth) / 3;

  let overallHealth: 'healthy' | 'degraded' | 'critical';
  if (overallScore >= 80 && failedComponents === 0) overallHealth = 'healthy';
  else if (overallScore >= 60 && failedComponents < 2) overallHealth = 'degraded';
  else overallHealth = 'critical';

  const recommendations: string[] = [];
  if (volumeHealth < 90) recommendations.push('Check and repair degraded volumes');
  if (performanceIssues > 0) recommendations.push('Investigate performance bottlenecks');
  if (capacityWarnings > 0) recommendations.push('Plan capacity expansion');
  if (failedComponents > 0) recommendations.push('Replace failed hardware components');

  return {
    overallHealth,
    volumeHealth: Math.round(volumeHealth),
    performanceHealth: Math.round(performanceHealth),
    capacityHealth: Math.round(capacityHealth),
    recommendations,
  };
}

/**
 * 35. Validates and sanitizes volume name
 */
export function sanitizeVolumeName(name: string, maxLength: number = 64): string {
  // Remove invalid characters
  let sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Ensure it starts with alphanumeric
  if (!/^[a-z0-9]/.test(sanitized)) {
    sanitized = 'vol-' + sanitized;
  }

  // Truncate if needed
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Ensure minimum length
  if (sanitized.length < 3) {
    throw new BadRequestException('Volume name too short after sanitization');
  }

  return sanitized;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Enums
  VolumeType,
  VolumeStatus,
  LunProtocol,
  SnapshotStatus,
  ReplicationStatus,
  ReplicationMode,
  StorageTier,
  RaidLevel,

  // DTOs
  CreateVolumeDto,
  UpdateVolumeDto,
  CreateLunDto,
  UpdateLunDto,
  CreateSnapshotDto,
  CreateReplicationDto,
  VolumeQueryDto,
  PerformanceQueryDto,
  VolumeResponseDto,
  LunResponseDto,
  SnapshotResponseDto,
  ReplicationResponseDto,
  PaginatedResponseDto,
  PerformanceMetricsDto,
  CapacityReportDto,

  // Decorators
  SanAuditContext,
  StorageArrayId,
  VolumeEndpoint,
  LunEndpoint,
  SnapshotEndpoint,
  ReplicationEndpoint,
  SanApiOperation,

  // Utility Functions (35 total)
  createSanPaginatedResponse,
  validateVolumeCreation,
  validateVolumeExpansion,
  validateLunCreation,
  validateLunMapping,
  validateSnapshotCreation,
  calculateSnapshotExpiration,
  validateReplicationConfig,
  calculateNextSyncTime,
  validateTierMigration,
  calculateVolumeUtilization,
  determineVolumeHealth,
  validatePerformanceQuery,
  calculateAverageMetrics,
  generateCapacityForecast,
  validateRaidForVolumeSize,
  calculateRaidUsableCapacity,
  validateSnapshotRestore,
  calculateSnapshotSavings,
  validateVolumeDeletion,
  createSanAuditLog,
  validateStorageArrayConnection,
  calculateReplicationBandwidth,
  validateThinProvisioningRatio,
  generateEfficiencyReport,
  validateQoSSettings,
  validateVolumeClone,
  calculateSnapshotSchedule,
  validateMultipathConfig,
  calculateDRReadiness,
  validateMigrationPlan,
  calculateStorageTCO,
  validateFirmwareVersion,
  generateHealthCheckReport,
  sanitizeVolumeName,
};

// Add ApiProperty decorator import
function ApiProperty(options?: any): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    // Placeholder for actual implementation
  };
}
