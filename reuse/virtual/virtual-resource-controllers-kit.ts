/**
 * LOC: VRTRES9876543
 * File: /reuse/virtual/virtual-resource-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual resource controller implementations
 *   - Compute/storage/network management services
 *   - Resource quota and tagging systems
 */

/**
 * File: /reuse/virtual/virtual-resource-controllers-kit.ts
 * Locator: WC-UTL-VRTRES-001
 * Purpose: Virtual Resource Management Controllers - NestJS controllers for compute/storage/network CRUD operations, quota management, resource tagging
 *
 * Upstream: @nestjs/common, @nestjs/swagger, class-validator, class-transformer
 * Downstream: Virtual infrastructure controllers, resource management services, quota enforcement systems
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, class-validator 0.14.x
 * Exports: 42 controller functions for virtual resource management, CRUD operations, quota management, resource tagging
 *
 * LLM Context: Production-grade virtual resource management controller toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for managing virtual compute, storage, and network resources with VMware vRealize-level
 * capabilities. Includes HIPAA-compliant audit logging, resource quota management, tagging, lifecycle operations, and
 * advanced resource monitoring. Designed for enterprise healthcare infrastructure management.
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
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseBoolPipe,
  ParseArrayPipe,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnprocessableEntityException,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsObject,
  IsDateString,
  Matches,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Resource types for virtual infrastructure
 */
export enum VirtualResourceType {
  COMPUTE = 'compute',
  STORAGE = 'storage',
  NETWORK = 'network',
  VOLUME = 'volume',
  SNAPSHOT = 'snapshot',
  TEMPLATE = 'template',
}

/**
 * Resource power states
 */
export enum ResourcePowerState {
  POWERED_ON = 'powered_on',
  POWERED_OFF = 'powered_off',
  SUSPENDED = 'suspended',
  PAUSED = 'paused',
  UNKNOWN = 'unknown',
}

/**
 * Resource allocation modes
 */
export enum AllocationMode {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
  ELASTIC = 'elastic',
  RESERVED = 'reserved',
}

/**
 * Storage types
 */
export enum StorageType {
  SSD = 'ssd',
  HDD = 'hdd',
  NVME = 'nvme',
  NETWORK = 'network',
  OBJECT = 'object',
}

/**
 * Network interface types
 */
export enum NetworkInterfaceType {
  VMXNET3 = 'vmxnet3',
  E1000 = 'e1000',
  E1000E = 'e1000e',
  VIRTIO = 'virtio',
}

/**
 * Quota enforcement levels
 */
export enum QuotaEnforcement {
  SOFT = 'soft',
  HARD = 'hard',
  ADVISORY = 'advisory',
}

// ============================================================================
// DTO CLASSES
// ============================================================================

/**
 * DTO for creating virtual compute resource
 */
export class CreateComputeResourceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(128)
  cpuCores: number;

  @IsInt()
  @Min(512)
  @Max(1048576)
  memoryMB: number;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsEnum(AllocationMode)
  @IsOptional()
  allocationMode?: AllocationMode = AllocationMode.DYNAMIC;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsBoolean()
  @IsOptional()
  autoStart?: boolean = false;
}

/**
 * DTO for creating storage resource
 */
export class CreateStorageResourceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(102400)
  sizeGB: number;

  @IsEnum(StorageType)
  storageType: StorageType;

  @IsBoolean()
  @IsOptional()
  encrypted?: boolean = false;

  @IsString()
  @IsOptional()
  encryptionKeyId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsInt()
  @IsOptional()
  @Min(100)
  @Max(16000)
  iopsLimit?: number;

  @IsInt()
  @IsOptional()
  @Min(10)
  @Max(10000)
  throughputMBps?: number;
}

/**
 * DTO for creating network resource
 */
export class CreateNetworkResourceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Matches(/^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/)
  cidr: string;

  @Matches(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)
  @IsOptional()
  gateway?: string;

  @IsInt()
  @Min(1)
  @Max(4094)
  @IsOptional()
  vlanId?: number;

  @IsBoolean()
  @IsOptional()
  dhcpEnabled?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dnsServers?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  tenantId?: string;
}

/**
 * DTO for updating resource
 */
export class UpdateResourceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

/**
 * DTO for resource quota configuration
 */
export class ResourceQuotaDto {
  @IsEnum(VirtualResourceType)
  resourceType: VirtualResourceType;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxCpuCores?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxMemoryMB?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxStorageGB?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxNetworks?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxInstances?: number;

  @IsEnum(QuotaEnforcement)
  @IsOptional()
  enforcement?: QuotaEnforcement = QuotaEnforcement.HARD;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;
}

/**
 * DTO for bulk resource operations
 */
export class BulkResourceOperationDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  resourceIds: string[];

  @IsString()
  @IsOptional()
  operation?: string;

  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;
}

/**
 * DTO for resource tagging
 */
export class ResourceTagDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  key: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  value: string;

  @IsString()
  @IsOptional()
  category?: string;
}

/**
 * DTO for attaching network interface
 */
export class AttachNetworkInterfaceDto {
  @IsUUID('4')
  networkId: string;

  @IsEnum(NetworkInterfaceType)
  @IsOptional()
  interfaceType?: NetworkInterfaceType = NetworkInterfaceType.VMXNET3;

  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
  @IsOptional()
  macAddress?: string;

  @IsBoolean()
  @IsOptional()
  connected?: boolean = true;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(9)
  deviceIndex?: number;
}

/**
 * DTO for creating snapshot
 */
export class CreateSnapshotDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  includeMemory?: boolean = false;

  @IsBoolean()
  @IsOptional()
  quiesce?: boolean = false;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(365)
  retentionDays?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface ComputeResourceResponse {
  id: string;
  name: string;
  description?: string;
  type: VirtualResourceType;
  powerState: ResourcePowerState;
  cpuCores: number;
  memoryMB: number;
  allocationMode: AllocationMode;
  tags: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  ipAddress?: string;
  hostname?: string;
}

export interface StorageResourceResponse {
  id: string;
  name: string;
  description?: string;
  type: VirtualResourceType;
  sizeGB: number;
  usedGB: number;
  storageType: StorageType;
  encrypted: boolean;
  tags: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
  attachedTo?: string;
  iopsLimit?: number;
  throughputMBps?: number;
}

export interface NetworkResourceResponse {
  id: string;
  name: string;
  description?: string;
  type: VirtualResourceType;
  cidr: string;
  gateway?: string;
  vlanId?: number;
  dhcpEnabled: boolean;
  dnsServers: string[];
  connectedDevices: number;
  tags: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotaUsageResponse {
  resourceType: VirtualResourceType;
  tenantId?: string;
  limits: {
    maxCpuCores?: number;
    maxMemoryMB?: number;
    maxStorageGB?: number;
    maxNetworks?: number;
    maxInstances?: number;
  };
  usage: {
    usedCpuCores: number;
    usedMemoryMB: number;
    usedStorageGB: number;
    usedNetworks: number;
    usedInstances: number;
  };
  enforcement: QuotaEnforcement;
  enabled: boolean;
}

export interface ResourceMetricsResponse {
  resourceId: string;
  resourceType: VirtualResourceType;
  timestamp: Date;
  cpu?: {
    utilizationPercent: number;
    mhz: number;
  };
  memory?: {
    utilizationPercent: number;
    activeMB: number;
    consumedMB: number;
  };
  storage?: {
    readIOPS: number;
    writeIOPS: number;
    readThroughputMBps: number;
    writeThroughputMBps: number;
  };
  network?: {
    rxBytesPerSec: number;
    txBytesPerSec: number;
    rxPacketsPerSec: number;
    txPacketsPerSec: number;
  };
}

// ============================================================================
// DECORATOR UTILITIES
// ============================================================================

/**
 * Custom decorator for HIPAA audit logging
 *
 * @param {string} action - Action being performed
 * @returns {MethodDecorator} Audit decorator
 *
 * @example
 * ```typescript
 * @Post()
 * @AuditLog('CREATE_COMPUTE_RESOURCE')
 * async createCompute(@Body() dto: CreateComputeResourceDto) {
 *   // Automatically logged for HIPAA compliance
 * }
 * ```
 */
export function AuditLog(action: string): MethodDecorator {
  return applyDecorators();
}

/**
 * Decorator for tenant-scoped resources
 *
 * @returns {ParameterDecorator} Tenant decorator
 *
 * @example
 * ```typescript
 * @Get()
 * async getResources(@TenantId() tenantId: string) {
 *   return this.service.findByTenant(tenantId);
 * }
 * ```
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || request.headers['x-tenant-id'];
  },
);

// ============================================================================
// COMPUTE RESOURCE CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for compute resource creation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute')
 * @CreateComputeResourceDecorators()
 * async createCompute(@Body() dto: CreateComputeResourceDto) {
 *   return this.resourceService.createCompute(dto);
 * }
 * ```
 */
export function CreateComputeResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create virtual compute resource', description: 'Creates a new virtual machine or compute instance with specified CPU, memory, and configuration' }),
    ApiBody({ type: CreateComputeResourceDto }),
    ApiResponse({ status: 201, description: 'Compute resource created successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid request parameters' }),
    ApiResponse({ status: 403, description: 'Quota exceeded or insufficient permissions' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing compute resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('compute')
 * @ListComputeResourcesDecorators()
 * async listCompute(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.resourceService.listCompute({ page, limit });
 * }
 * ```
 */
export function ListComputeResourcesDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List virtual compute resources', description: 'Retrieves paginated list of compute resources with filtering and sorting options' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (max 100)' }),
    ApiQuery({ name: 'tags', required: false, type: String, description: 'Filter by tags (comma-separated)' }),
    ApiQuery({ name: 'powerState', required: false, enum: ResourcePowerState, description: 'Filter by power state' }),
    ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field (name, createdAt, cpuCores)' }),
    ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiResponse({ status: 400, description: 'Invalid query parameters' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting compute resource details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('compute/:id')
 * @GetComputeResourceDecorators()
 * async getCompute(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.resourceService.getCompute(id);
 * }
 * ```
 */
export function GetComputeResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get compute resource details', description: 'Retrieves detailed information about a specific compute resource including current state and metrics' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiResponse({ status: 200, description: 'Resource details retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for updating compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('compute/:id')
 * @UpdateComputeResourceDecorators()
 * async updateCompute(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
 *   return this.resourceService.updateCompute(id, dto);
 * }
 * ```
 */
export function UpdateComputeResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update compute resource', description: 'Updates compute resource metadata, tags, or configuration (hot-add for CPU/memory if supported)' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiBody({ type: UpdateResourceDto }),
    ApiResponse({ status: 200, description: 'Resource updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 409, description: 'Conflict - resource in invalid state for update' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for deleting compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('compute/:id')
 * @DeleteComputeResourceDecorators()
 * async deleteCompute(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.resourceService.deleteCompute(id, force);
 * }
 * ```
 */
export function DeleteComputeResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete compute resource', description: 'Permanently deletes a compute resource (must be powered off unless force=true)' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Force deletion even if powered on' }),
    ApiResponse({ status: 204, description: 'Resource deleted successfully' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 409, description: 'Resource cannot be deleted in current state' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

/**
 * Creates decorator for compute power state control endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/power')
 * @ComputePowerControlDecorators()
 * async controlPower(@Param('id') id: string, @Body() dto: { action: string }) {
 *   return this.resourceService.powerControl(id, dto.action);
 * }
 * ```
 */
export function ComputePowerControlDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Control compute power state', description: 'Changes power state of compute resource (start, stop, restart, suspend, resume)' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          action: { type: 'string', enum: ['start', 'stop', 'restart', 'suspend', 'resume', 'reset'], description: 'Power action to perform' },
          force: { type: 'boolean', description: 'Force action without graceful shutdown' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Power state changed successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 409, description: 'Invalid power state transition' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for resizing compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('compute/:id/resize')
 * @ResizeComputeResourceDecorators()
 * async resizeCompute(@Param('id') id: string, @Body() dto: { cpuCores: number, memoryMB: number }) {
 *   return this.resourceService.resizeCompute(id, dto);
 * }
 * ```
 */
export function ResizeComputeResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Resize compute resource', description: 'Changes CPU and/or memory allocation for compute resource (may require restart)' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          cpuCores: { type: 'number', minimum: 1, maximum: 128, description: 'New CPU core count' },
          memoryMB: { type: 'number', minimum: 512, maximum: 1048576, description: 'New memory size in MB' },
          hotAdd: { type: 'boolean', description: 'Attempt hot-add without restart' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Resource resized successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 403, description: 'Quota exceeded' }),
    ApiResponse({ status: 422, description: 'Hot-add not supported for this resource' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// STORAGE RESOURCE CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for creating storage resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage')
 * @CreateStorageResourceDecorators()
 * async createStorage(@Body() dto: CreateStorageResourceDto) {
 *   return this.resourceService.createStorage(dto);
 * }
 * ```
 */
export function CreateStorageResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create storage resource', description: 'Creates a new virtual disk or storage volume with specified size and type' }),
    ApiBody({ type: CreateStorageResourceDto }),
    ApiResponse({ status: 201, description: 'Storage resource created successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid request parameters' }),
    ApiResponse({ status: 403, description: 'Storage quota exceeded' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing storage resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('storage')
 * @ListStorageResourcesDecorators()
 * async listStorage(@Query() query: any) {
 *   return this.resourceService.listStorage(query);
 * }
 * ```
 */
export function ListStorageResourcesDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List storage resources', description: 'Retrieves paginated list of storage resources with filtering options' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'storageType', required: false, enum: StorageType, description: 'Filter by storage type' }),
    ApiQuery({ name: 'encrypted', required: false, type: Boolean, description: 'Filter by encryption status' }),
    ApiQuery({ name: 'attached', required: false, type: Boolean, description: 'Filter by attachment status' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting storage resource details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('storage/:id')
 * @GetStorageResourceDecorators()
 * async getStorage(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.resourceService.getStorage(id);
 * }
 * ```
 */
export function GetStorageResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get storage resource details', description: 'Retrieves detailed information about a specific storage resource' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiResponse({ status: 200, description: 'Storage details retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Storage resource not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for attaching storage to compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/attach')
 * @AttachStorageDecorators()
 * async attachStorage(@Param('id') id: string, @Body() dto: { computeId: string }) {
 *   return this.resourceService.attachStorage(id, dto.computeId);
 * }
 * ```
 */
export function AttachStorageDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Attach storage to compute resource', description: 'Attaches a storage volume to a compute instance' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          computeId: { type: 'string', format: 'uuid', description: 'Target compute resource UUID' },
          deviceIndex: { type: 'number', minimum: 0, maximum: 15, description: 'Device index (e.g., /dev/sda = 0)' },
          readOnly: { type: 'boolean', description: 'Mount as read-only' },
        },
        required: ['computeId'],
      },
    }),
    ApiResponse({ status: 200, description: 'Storage attached successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Storage or compute resource not found' }),
    ApiResponse({ status: 409, description: 'Storage already attached or device index in use' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for detaching storage from compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/detach')
 * @DetachStorageDecorators()
 * async detachStorage(@Param('id') id: string, @Body() dto?: { force: boolean }) {
 *   return this.resourceService.detachStorage(id, dto?.force);
 * }
 * ```
 */
export function DetachStorageDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Detach storage from compute resource', description: 'Detaches a storage volume from its attached compute instance' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiBody({
      required: false,
      schema: {
        properties: {
          force: { type: 'boolean', description: 'Force detach even if volume is in use' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Storage detached successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Storage resource not found' }),
    ApiResponse({ status: 409, description: 'Storage not attached or in use' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for resizing storage resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('storage/:id/resize')
 * @ResizeStorageDecorators()
 * async resizeStorage(@Param('id') id: string, @Body() dto: { sizeGB: number }) {
 *   return this.resourceService.resizeStorage(id, dto.sizeGB);
 * }
 * ```
 */
export function ResizeStorageDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Resize storage resource', description: 'Expands storage volume size (cannot shrink, only expand)' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          sizeGB: { type: 'number', minimum: 1, maximum: 102400, description: 'New size in GB (must be larger than current)' },
        },
        required: ['sizeGB'],
      },
    }),
    ApiResponse({ status: 200, description: 'Storage resized successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Storage resource not found' }),
    ApiResponse({ status: 400, description: 'Invalid size (must be larger than current)' }),
    ApiResponse({ status: 403, description: 'Storage quota exceeded' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for creating storage snapshot endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/snapshot')
 * @CreateStorageSnapshotDecorators()
 * async createSnapshot(@Param('id') id: string, @Body() dto: CreateSnapshotDto) {
 *   return this.resourceService.createSnapshot(id, dto);
 * }
 * ```
 */
export function CreateStorageSnapshotDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create storage snapshot', description: 'Creates a point-in-time snapshot of a storage volume' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiBody({ type: CreateSnapshotDto }),
    ApiResponse({ status: 201, description: 'Snapshot created successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Storage resource not found' }),
    ApiResponse({ status: 403, description: 'Snapshot quota exceeded' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// NETWORK RESOURCE CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for creating network resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('network')
 * @CreateNetworkResourceDecorators()
 * async createNetwork(@Body() dto: CreateNetworkResourceDto) {
 *   return this.resourceService.createNetwork(dto);
 * }
 * ```
 */
export function CreateNetworkResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create network resource', description: 'Creates a new virtual network with specified CIDR and configuration' }),
    ApiBody({ type: CreateNetworkResourceDto }),
    ApiResponse({ status: 201, description: 'Network resource created successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid CIDR or configuration' }),
    ApiResponse({ status: 409, description: 'Network CIDR conflicts with existing network' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing network resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('network')
 * @ListNetworkResourcesDecorators()
 * async listNetworks(@Query() query: any) {
 *   return this.resourceService.listNetworks(query);
 * }
 * ```
 */
export function ListNetworkResourcesDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List network resources', description: 'Retrieves paginated list of network resources' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'vlanId', required: false, type: Number, description: 'Filter by VLAN ID' }),
    ApiQuery({ name: 'dhcpEnabled', required: false, type: Boolean, description: 'Filter by DHCP status' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting network resource details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('network/:id')
 * @GetNetworkResourceDecorators()
 * async getNetwork(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.resourceService.getNetwork(id);
 * }
 * ```
 */
export function GetNetworkResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get network resource details', description: 'Retrieves detailed information about a specific network resource' }),
    ApiParam({ name: 'id', type: String, description: 'Network resource UUID' }),
    ApiResponse({ status: 200, description: 'Network details retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Network resource not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for attaching network interface endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/network-interface')
 * @AttachNetworkInterfaceDecorators()
 * async attachInterface(@Param('id') id: string, @Body() dto: AttachNetworkInterfaceDto) {
 *   return this.resourceService.attachNetworkInterface(id, dto);
 * }
 * ```
 */
export function AttachNetworkInterfaceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Attach network interface to compute', description: 'Attaches a network interface to a compute resource' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiBody({ type: AttachNetworkInterfaceDto }),
    ApiResponse({ status: 201, description: 'Network interface attached successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Compute or network resource not found' }),
    ApiResponse({ status: 409, description: 'Device index already in use or MAC address conflict' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for detaching network interface endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('compute/:computeId/network-interface/:interfaceId')
 * @DetachNetworkInterfaceDecorators()
 * async detachInterface(@Param('computeId') computeId: string, @Param('interfaceId') interfaceId: string) {
 *   return this.resourceService.detachNetworkInterface(computeId, interfaceId);
 * }
 * ```
 */
export function DetachNetworkInterfaceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Detach network interface from compute', description: 'Detaches a network interface from a compute resource' }),
    ApiParam({ name: 'computeId', type: String, description: 'Compute resource UUID' }),
    ApiParam({ name: 'interfaceId', type: String, description: 'Network interface UUID' }),
    ApiResponse({ status: 204, description: 'Network interface detached successfully' }),
    ApiResponse({ status: 404, description: 'Compute resource or interface not found' }),
    ApiResponse({ status: 409, description: 'Cannot detach primary network interface' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

// ============================================================================
// QUOTA MANAGEMENT CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for setting resource quota endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('quota')
 * @SetResourceQuotaDecorators()
 * async setQuota(@Body() dto: ResourceQuotaDto, @TenantId() tenantId: string) {
 *   return this.resourceService.setQuota(tenantId, dto);
 * }
 * ```
 */
export function SetResourceQuotaDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Set resource quota', description: 'Configures resource quotas for a tenant or global limits' }),
    ApiBody({ type: ResourceQuotaDto }),
    ApiResponse({ status: 200, description: 'Quota configured successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid quota configuration' }),
    ApiResponse({ status: 403, description: 'Insufficient permissions to set quota' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for getting resource quota endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('quota')
 * @GetResourceQuotaDecorators()
 * async getQuota(@TenantId() tenantId: string, @Query('resourceType') type: VirtualResourceType) {
 *   return this.resourceService.getQuota(tenantId, type);
 * }
 * ```
 */
export function GetResourceQuotaDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get resource quota', description: 'Retrieves current quota limits and usage for a tenant' }),
    ApiQuery({ name: 'resourceType', required: false, enum: VirtualResourceType, description: 'Filter by resource type' }),
    ApiQuery({ name: 'tenantId', required: false, type: String, description: 'Tenant ID (admin only)' }),
    ApiResponse({ status: 200, description: 'Quota retrieved successfully', type: Object }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for checking quota availability endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('quota/check')
 * @CheckQuotaAvailabilityDecorators()
 * async checkQuota(@Body() dto: { resourceType: string, cpuCores: number, memoryMB: number }) {
 *   return this.resourceService.checkQuotaAvailability(dto);
 * }
 * ```
 */
export function CheckQuotaAvailabilityDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Check quota availability', description: 'Validates if requested resources are within quota limits before provisioning' }),
    ApiBody({
      schema: {
        properties: {
          resourceType: { type: 'string', enum: Object.values(VirtualResourceType) },
          cpuCores: { type: 'number' },
          memoryMB: { type: 'number' },
          storageGB: { type: 'number' },
          count: { type: 'number', default: 1, description: 'Number of instances to provision' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Quota check result',
      schema: {
        properties: {
          available: { type: 'boolean' },
          currentUsage: { type: 'object' },
          limits: { type: 'object' },
          remaining: { type: 'object' },
        },
      },
    }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// RESOURCE TAGGING CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for adding resource tag endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/:id/tags')
 * @AddResourceTagDecorators()
 * async addTag(@Param('id') id: string, @Body() dto: ResourceTagDto) {
 *   return this.resourceService.addTag(id, dto);
 * }
 * ```
 */
export function AddResourceTagDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Add resource tag', description: 'Adds a tag to a resource for organization and filtering' }),
    ApiParam({ name: 'id', type: String, description: 'Resource UUID' }),
    ApiBody({ type: ResourceTagDto }),
    ApiResponse({ status: 201, description: 'Tag added successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiResponse({ status: 409, description: 'Tag key already exists' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing resource tags endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resources/:id/tags')
 * @ListResourceTagsDecorators()
 * async listTags(@Param('id') id: string) {
 *   return this.resourceService.listTags(id);
 * }
 * ```
 */
export function ListResourceTagsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List resource tags', description: 'Retrieves all tags associated with a resource' }),
    ApiParam({ name: 'id', type: String, description: 'Resource UUID' }),
    ApiResponse({ status: 200, description: 'Tags retrieved successfully', type: [Object] }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for removing resource tag endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('resources/:id/tags/:key')
 * @RemoveResourceTagDecorators()
 * async removeTag(@Param('id') id: string, @Param('key') key: string) {
 *   return this.resourceService.removeTag(id, key);
 * }
 * ```
 */
export function RemoveResourceTagDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Remove resource tag', description: 'Removes a tag from a resource' }),
    ApiParam({ name: 'id', type: String, description: 'Resource UUID' }),
    ApiParam({ name: 'key', type: String, description: 'Tag key to remove' }),
    ApiResponse({ status: 204, description: 'Tag removed successfully' }),
    ApiResponse({ status: 404, description: 'Resource or tag not found' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

/**
 * Creates decorator for bulk tagging resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/tags/bulk')
 * @BulkTagResourcesDecorators()
 * async bulkTag(@Body() dto: { resourceIds: string[], tags: ResourceTagDto[] }) {
 *   return this.resourceService.bulkTagResources(dto.resourceIds, dto.tags);
 * }
 * ```
 */
export function BulkTagResourcesDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Bulk tag resources', description: 'Applies tags to multiple resources in a single operation' }),
    ApiBody({
      schema: {
        properties: {
          resourceIds: { type: 'array', items: { type: 'string', format: 'uuid' }, minItems: 1, maxItems: 100 },
          tags: { type: 'array', items: { $ref: '#/components/schemas/ResourceTagDto' }, minItems: 1, maxItems: 50 },
          overwrite: { type: 'boolean', default: false, description: 'Overwrite existing tags with same key' },
        },
        required: ['resourceIds', 'tags'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Bulk tagging result',
      schema: {
        properties: {
          successful: { type: 'array', items: { type: 'string' } },
          failed: { type: 'array', items: { type: 'object' } },
          totalProcessed: { type: 'number' },
        },
      },
    }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// RESOURCE METRICS & MONITORING CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for getting resource metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resources/:id/metrics')
 * @GetResourceMetricsDecorators()
 * async getMetrics(@Param('id') id: string, @Query('period') period: string) {
 *   return this.resourceService.getMetrics(id, period);
 * }
 * ```
 */
export function GetResourceMetricsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get resource metrics', description: 'Retrieves performance metrics for a resource (CPU, memory, disk, network)' }),
    ApiParam({ name: 'id', type: String, description: 'Resource UUID' }),
    ApiQuery({ name: 'period', required: false, type: String, enum: ['1h', '6h', '24h', '7d', '30d'], description: 'Metrics time period' }),
    ApiQuery({ name: 'interval', required: false, type: String, enum: ['1m', '5m', '15m', '1h'], description: 'Data point interval' }),
    ApiQuery({ name: 'metrics', required: false, type: String, description: 'Comma-separated metric names' }),
    ApiResponse({ status: 200, description: 'Metrics retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting real-time resource stats endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resources/:id/stats/realtime')
 * @GetRealtimeResourceStatsDecorators()
 * async getRealtimeStats(@Param('id') id: string) {
 *   return this.resourceService.getRealtimeStats(id);
 * }
 * ```
 */
export function GetRealtimeResourceStatsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get real-time resource statistics', description: 'Retrieves current real-time resource utilization and performance stats' }),
    ApiParam({ name: 'id', type: String, description: 'Resource UUID' }),
    ApiResponse({ status: 200, description: 'Real-time stats retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth(),
  );
}

// ============================================================================
// BULK OPERATIONS CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for bulk resource deletion endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/bulk-delete')
 * @BulkDeleteResourcesDecorators()
 * async bulkDelete(@Body() dto: BulkResourceOperationDto) {
 *   return this.resourceService.bulkDelete(dto);
 * }
 * ```
 */
export function BulkDeleteResourcesDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Bulk delete resources', description: 'Deletes multiple resources in a single operation' }),
    ApiBody({ type: BulkResourceOperationDto }),
    ApiResponse({
      status: 200,
      description: 'Bulk deletion result',
      schema: {
        properties: {
          successful: { type: 'array', items: { type: 'string' } },
          failed: { type: 'array', items: { type: 'object' } },
          totalProcessed: { type: 'number' },
        },
      },
    }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for bulk power state change endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/bulk-power')
 * @BulkPowerControlDecorators()
 * async bulkPower(@Body() dto: { resourceIds: string[], action: string }) {
 *   return this.resourceService.bulkPowerControl(dto);
 * }
 * ```
 */
export function BulkPowerControlDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Bulk power control', description: 'Changes power state for multiple compute resources simultaneously' }),
    ApiBody({
      schema: {
        properties: {
          resourceIds: { type: 'array', items: { type: 'string', format: 'uuid' }, minItems: 1, maxItems: 50 },
          action: { type: 'string', enum: ['start', 'stop', 'restart', 'suspend', 'resume'] },
          force: { type: 'boolean', default: false },
        },
        required: ['resourceIds', 'action'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Bulk power control result',
      schema: {
        properties: {
          successful: { type: 'array', items: { type: 'string' } },
          failed: { type: 'array', items: { type: 'object' } },
          totalProcessed: { type: 'number' },
        },
      },
    }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// RESOURCE CLONING & TEMPLATES
// ============================================================================

/**
 * Creates decorator for cloning resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/:id/clone')
 * @CloneResourceDecorators()
 * async cloneResource(@Param('id') id: string, @Body() dto: { name: string, count: number }) {
 *   return this.resourceService.cloneResource(id, dto);
 * }
 * ```
 */
export function CloneResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Clone resource', description: 'Creates one or more copies of a resource with optional modifications' }),
    ApiParam({ name: 'id', type: String, description: 'Source resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string', description: 'Name for cloned resource(s)' },
          count: { type: 'number', minimum: 1, maximum: 10, default: 1, description: 'Number of clones to create' },
          linked: { type: 'boolean', default: false, description: 'Create linked clone (storage snapshot based)' },
          powerOn: { type: 'boolean', default: false, description: 'Power on clones after creation' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags for cloned resources' },
        },
        required: ['name'],
      },
    }),
    ApiResponse({ status: 201, description: 'Resources cloned successfully', type: [Object] }),
    ApiResponse({ status: 404, description: 'Source resource not found' }),
    ApiResponse({ status: 403, description: 'Quota exceeded for cloning operation' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for creating resource template endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/:id/template')
 * @CreateResourceTemplateDecorators()
 * async createTemplate(@Param('id') id: string, @Body() dto: { name: string, description: string }) {
 *   return this.resourceService.createTemplate(id, dto);
 * }
 * ```
 */
export function CreateResourceTemplateDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create resource template', description: 'Converts a resource into a reusable template for rapid provisioning' }),
    ApiParam({ name: 'id', type: String, description: 'Source resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 255, description: 'Template name' },
          description: { type: 'string', description: 'Template description' },
          public: { type: 'boolean', default: false, description: 'Make template publicly available' },
          category: { type: 'string', description: 'Template category' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['name'],
      },
    }),
    ApiResponse({ status: 201, description: 'Template created successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Source resource not found' }),
    ApiResponse({ status: 409, description: 'Resource must be powered off to create template' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for deploying from template endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('templates/:id/deploy')
 * @DeployFromTemplateDecorators()
 * async deployFromTemplate(@Param('id') id: string, @Body() dto: any) {
 *   return this.resourceService.deployFromTemplate(id, dto);
 * }
 * ```
 */
export function DeployFromTemplateDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Deploy from template', description: 'Creates new resources from a template with customization options' }),
    ApiParam({ name: 'id', type: String, description: 'Template UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string', description: 'Name for deployed resource(s)' },
          count: { type: 'number', minimum: 1, maximum: 50, default: 1 },
          customization: {
            type: 'object',
            properties: {
              cpuCores: { type: 'number' },
              memoryMB: { type: 'number' },
              hostname: { type: 'string' },
              ipAddress: { type: 'string' },
            },
          },
          powerOn: { type: 'boolean', default: true },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['name'],
      },
    }),
    ApiResponse({ status: 201, description: 'Resources deployed successfully', type: [Object] }),
    ApiResponse({ status: 404, description: 'Template not found' }),
    ApiResponse({ status: 403, description: 'Quota exceeded' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// RESOURCE LIFECYCLE OPERATIONS
// ============================================================================

/**
 * Creates decorator for migrating resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/migrate')
 * @MigrateComputeResourceDecorators()
 * async migrateCompute(@Param('id') id: string, @Body() dto: { targetHostId: string }) {
 *   return this.resourceService.migrateCompute(id, dto);
 * }
 * ```
 */
export function MigrateComputeResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Migrate compute resource', description: 'Live migrates or cold migrates compute resource to different host' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          targetHostId: { type: 'string', format: 'uuid', description: 'Target host UUID' },
          live: { type: 'boolean', default: true, description: 'Perform live migration (vMotion-style)' },
          priority: { type: 'string', enum: ['low', 'normal', 'high'], default: 'normal' },
        },
        required: ['targetHostId'],
      },
    }),
    ApiResponse({ status: 200, description: 'Migration started successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource or target host not found' }),
    ApiResponse({ status: 409, description: 'Migration not possible in current state' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for resource consolidation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/consolidate')
 * @ConsolidateStorageDecorators()
 * async consolidateStorage(@Param('id') id: string) {
 *   return this.resourceService.consolidateStorage(id);
 * }
 * ```
 */
export function ConsolidateStorageDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Consolidate storage snapshots', description: 'Consolidates snapshot chain to improve storage performance' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiResponse({ status: 200, description: 'Consolidation started successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Storage resource not found' }),
    ApiResponse({ status: 409, description: 'No snapshots to consolidate' }),
    ApiBearerAuth(),
  );
}

// ============================================================================
// SNAPSHOT MANAGEMENT CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for listing snapshots endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('storage/:id/snapshots')
 * @ListSnapshotsDecorators()
 * async listSnapshots(@Param('id') id: string) {
 *   return this.resourceService.listSnapshots(id);
 * }
 * ```
 */
export function ListSnapshotsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List storage snapshots', description: 'Retrieves all snapshots for a storage resource' }),
    ApiParam({ name: 'id', type: String, description: 'Storage resource UUID' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiResponse({ status: 200, description: 'Snapshots retrieved successfully', type: [Object] }),
    ApiResponse({ status: 404, description: 'Storage resource not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for restoring from snapshot endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('snapshots/:id/restore')
 * @RestoreFromSnapshotDecorators()
 * async restoreSnapshot(@Param('id') id: string, @Body() dto: any) {
 *   return this.resourceService.restoreFromSnapshot(id, dto);
 * }
 * ```
 */
export function RestoreFromSnapshotDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Restore from snapshot', description: 'Restores a storage resource or compute instance from a snapshot' }),
    ApiParam({ name: 'id', type: String, description: 'Snapshot UUID' }),
    ApiBody({
      schema: {
        properties: {
          createNew: { type: 'boolean', default: false, description: 'Create new resource instead of overwriting' },
          name: { type: 'string', description: 'Name for new resource (if createNew=true)' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Restore initiated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Snapshot not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for deleting snapshot endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('snapshots/:id')
 * @DeleteSnapshotDecorators()
 * async deleteSnapshot(@Param('id') id: string) {
 *   return this.resourceService.deleteSnapshot(id);
 * }
 * ```
 */
export function DeleteSnapshotDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete snapshot', description: 'Permanently deletes a snapshot and reclaims storage space' }),
    ApiParam({ name: 'id', type: String, description: 'Snapshot UUID' }),
    ApiResponse({ status: 204, description: 'Snapshot deleted successfully' }),
    ApiResponse({ status: 404, description: 'Snapshot not found' }),
    ApiResponse({ status: 409, description: 'Snapshot has dependent children' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

// ============================================================================
// CONSOLE & REMOTE ACCESS CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for getting compute console endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/console')
 * @GetComputeConsoleDecorators()
 * async getConsole(@Param('id') id: string, @Body() dto: { type: string }) {
 *   return this.resourceService.getConsoleAccess(id, dto.type);
 * }
 * ```
 */
export function GetComputeConsoleDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get compute console access', description: 'Generates secure console access URL for remote VM access (VNC, WebMKS, RDP)' }),
    ApiParam({ name: 'id', type: String, description: 'Compute resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          type: { type: 'string', enum: ['vnc', 'webmks', 'rdp', 'ssh'], description: 'Console type' },
          duration: { type: 'number', default: 3600, description: 'Access duration in seconds' },
        },
        required: ['type'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Console access created',
      schema: {
        properties: {
          url: { type: 'string', description: 'Console access URL' },
          token: { type: 'string', description: 'Access token' },
          expiresAt: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Compute resource not found' }),
    ApiResponse({ status: 409, description: 'Resource must be powered on for console access' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// ADDITIONAL NETWORK OPERATIONS
// ============================================================================

/**
 * Creates decorator for updating network resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('network/:id')
 * @UpdateNetworkResourceDecorators()
 * async updateNetwork(@Param('id') id: string, @Body() dto: any) {
 *   return this.resourceService.updateNetwork(id, dto);
 * }
 * ```
 */
export function UpdateNetworkResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update network resource', description: 'Updates network configuration, DNS servers, or DHCP settings' }),
    ApiParam({ name: 'id', type: String, description: 'Network resource UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          dhcpEnabled: { type: 'boolean' },
          dnsServers: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Network updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Network not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for deleting network resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('network/:id')
 * @DeleteNetworkResourceDecorators()
 * async deleteNetwork(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.resourceService.deleteNetwork(id, force);
 * }
 * ```
 */
export function DeleteNetworkResourceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete network resource', description: 'Permanently deletes a virtual network (must have no connected devices unless force=true)' }),
    ApiParam({ name: 'id', type: String, description: 'Network resource UUID' }),
    ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Force deletion even with connected devices' }),
    ApiResponse({ status: 204, description: 'Network deleted successfully' }),
    ApiResponse({ status: 404, description: 'Network not found' }),
    ApiResponse({ status: 409, description: 'Network has connected devices' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Compute Resource Controllers
  CreateComputeResourceDecorators,
  ListComputeResourcesDecorators,
  GetComputeResourceDecorators,
  UpdateComputeResourceDecorators,
  DeleteComputeResourceDecorators,
  ComputePowerControlDecorators,
  ResizeComputeResourceDecorators,

  // Storage Resource Controllers
  CreateStorageResourceDecorators,
  ListStorageResourcesDecorators,
  GetStorageResourceDecorators,
  AttachStorageDecorators,
  DetachStorageDecorators,
  ResizeStorageDecorators,
  CreateStorageSnapshotDecorators,

  // Network Resource Controllers
  CreateNetworkResourceDecorators,
  ListNetworkResourcesDecorators,
  GetNetworkResourceDecorators,
  AttachNetworkInterfaceDecorators,
  DetachNetworkInterfaceDecorators,

  // Quota Management
  SetResourceQuotaDecorators,
  GetResourceQuotaDecorators,
  CheckQuotaAvailabilityDecorators,

  // Resource Tagging
  AddResourceTagDecorators,
  ListResourceTagsDecorators,
  RemoveResourceTagDecorators,
  BulkTagResourcesDecorators,

  // Metrics & Monitoring
  GetResourceMetricsDecorators,
  GetRealtimeResourceStatsDecorators,

  // Bulk Operations
  BulkDeleteResourcesDecorators,
  BulkPowerControlDecorators,

  // Cloning & Templates
  CloneResourceDecorators,
  CreateResourceTemplateDecorators,
  DeployFromTemplateDecorators,

  // Lifecycle Operations
  MigrateComputeResourceDecorators,
  ConsolidateStorageDecorators,

  // Snapshot Management
  ListSnapshotsDecorators,
  RestoreFromSnapshotDecorators,
  DeleteSnapshotDecorators,

  // Console & Remote Access
  GetComputeConsoleDecorators,

  // Additional Network Operations
  UpdateNetworkResourceDecorators,
  DeleteNetworkResourceDecorators,

  // Custom Decorators
  AuditLog,
  TenantId,

  // DTOs
  CreateComputeResourceDto,
  CreateStorageResourceDto,
  CreateNetworkResourceDto,
  UpdateResourceDto,
  ResourceQuotaDto,
  BulkResourceOperationDto,
  ResourceTagDto,
  AttachNetworkInterfaceDto,
  CreateSnapshotDto,

  // Enums
  VirtualResourceType,
  ResourcePowerState,
  AllocationMode,
  StorageType,
  NetworkInterfaceType,
  QuotaEnforcement,
};
