/**
 * LOC: VRTINF8765432
 * File: /reuse/virtual/virtual-infrastructure-api-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *
 * DOWNSTREAM (imported by):
 *   - Infrastructure controller implementations
 *   - Datacenter/cluster/host management services
 *   - Capacity planning and resource scheduling systems
 */

/**
 * File: /reuse/virtual/virtual-infrastructure-api-kit.ts
 * Locator: WC-UTL-VRTINF-001
 * Purpose: Virtual Infrastructure API Controllers - NestJS controllers for datacenter/cluster/host management, capacity planning, infrastructure monitoring
 *
 * Upstream: @nestjs/common, @nestjs/swagger, class-validator, class-transformer
 * Downstream: Infrastructure management controllers, datacenter services, cluster orchestration, host provisioning
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, class-validator 0.14.x
 * Exports: 38 controller functions for infrastructure management, datacenter operations, cluster management, host provisioning, capacity planning
 *
 * LLM Context: Enterprise-grade virtual infrastructure management controller toolkit for White Cross healthcare platform.
 * Provides VMware vCenter/vRealize-level capabilities for managing datacenters, clusters, hosts, and capacity planning.
 * Includes HIPAA-compliant audit logging, resource scheduling, DRS/HA configurations, and advanced infrastructure monitoring.
 * Designed for large-scale healthcare infrastructure orchestration and management.
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
  ServiceUnavailableException,
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
  IsIP,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Infrastructure component types
 */
export enum InfrastructureType {
  DATACENTER = 'datacenter',
  CLUSTER = 'cluster',
  HOST = 'host',
  RESOURCE_POOL = 'resource_pool',
  DATASTORE = 'datastore',
  NETWORK = 'network',
}

/**
 * Host power states
 */
export enum HostPowerState {
  POWERED_ON = 'powered_on',
  POWERED_OFF = 'powered_off',
  STANDBY = 'standby',
  MAINTENANCE = 'maintenance',
  UNKNOWN = 'unknown',
}

/**
 * Cluster HA (High Availability) modes
 */
export enum HAMode {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  FULLY_AUTOMATED = 'fully_automated',
}

/**
 * Cluster DRS (Distributed Resource Scheduler) modes
 */
export enum DRSMode {
  DISABLED = 'disabled',
  MANUAL = 'manual',
  PARTIALLY_AUTOMATED = 'partially_automated',
  FULLY_AUTOMATED = 'fully_automated',
}

/**
 * Host connection states
 */
export enum HostConnectionState {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  NOT_RESPONDING = 'not_responding',
}

/**
 * Alarm severity levels
 */
export enum AlarmSeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Capacity planning threshold types
 */
export enum ThresholdType {
  CPU = 'cpu',
  MEMORY = 'memory',
  STORAGE = 'storage',
  NETWORK = 'network',
}

/**
 * Maintenance mode types
 */
export enum MaintenanceMode {
  ENTER = 'enter',
  EXIT = 'exit',
}

// ============================================================================
// DTO CLASSES
// ============================================================================

/**
 * DTO for creating datacenter
 */
export class CreateDatacenterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;
}

/**
 * DTO for creating cluster
 */
export class CreateClusterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4')
  datacenterId: string;

  @IsEnum(DRSMode)
  @IsOptional()
  drsMode?: DRSMode = DRSMode.FULLY_AUTOMATED;

  @IsEnum(HAMode)
  @IsOptional()
  haMode?: HAMode = HAMode.ENABLED;

  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  haAdmissionControlFailoverLevel?: number = 1;

  @IsBoolean()
  @IsOptional()
  vSanEnabled?: boolean = false;

  @IsBoolean()
  @IsOptional()
  evrsEnabled?: boolean = false;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for adding host to infrastructure
 */
export class AddHostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsIP()
  ipAddress: string;

  @IsString()
  @IsOptional()
  hostname?: string;

  @IsUUID('4')
  @IsOptional()
  clusterId?: string;

  @IsUUID('4')
  @IsOptional()
  datacenterId?: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsInt()
  @Min(1)
  @Max(1024)
  @IsOptional()
  cpuCores?: number;

  @IsInt()
  @Min(1024)
  @Max(8388608)
  @IsOptional()
  memoryMB?: number;

  @IsBoolean()
  @IsOptional()
  sslVerify?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for updating cluster DRS settings
 */
export class UpdateClusterDRSDto {
  @IsEnum(DRSMode)
  drsMode: DRSMode;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  migrationThreshold?: number = 3;

  @IsBoolean()
  @IsOptional()
  vmDistribution?: boolean = true;

  @IsBoolean()
  @IsOptional()
  memoryMetricForPlacement?: boolean = true;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  cpuOverCommitRatio?: number = 400;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  memoryOverCommitRatio?: number = 150;
}

/**
 * DTO for updating cluster HA settings
 */
export class UpdateClusterHADto {
  @IsEnum(HAMode)
  haMode: HAMode;

  @IsInt()
  @Min(0)
  @Max(4)
  @IsOptional()
  failoverLevel?: number = 1;

  @IsBoolean()
  @IsOptional()
  admissionControlEnabled?: boolean = true;

  @IsString()
  @IsOptional()
  admissionControlPolicy?: 'failover-hosts' | 'percentage' | 'slot';

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  admissionControlPercentage?: number = 25;

  @IsBoolean()
  @IsOptional()
  vmMonitoring?: boolean = true;

  @IsInt()
  @Min(30)
  @Max(3600)
  @IsOptional()
  vmMonitoringSensitivity?: number = 120;

  @IsBoolean()
  @IsOptional()
  hostMonitoring?: boolean = true;
}

/**
 * DTO for resource pool configuration
 */
export class CreateResourcePoolDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4')
  clusterId: string;

  @IsUUID('4')
  @IsOptional()
  parentPoolId?: string;

  @IsInt()
  @Min(-1)
  @Max(1000000)
  @IsOptional()
  cpuShares?: number = -1;

  @IsInt()
  @Min(-1)
  @Max(1000000)
  @IsOptional()
  cpuReservationMHz?: number = 0;

  @IsInt()
  @Min(-1)
  @Max(1000000)
  @IsOptional()
  cpuLimitMHz?: number = -1;

  @IsInt()
  @Min(-1)
  @Max(8388608)
  @IsOptional()
  memorySharesMB?: number = -1;

  @IsInt()
  @Min(0)
  @Max(8388608)
  @IsOptional()
  memoryReservationMB?: number = 0;

  @IsInt()
  @Min(-1)
  @Max(8388608)
  @IsOptional()
  memoryLimitMB?: number = -1;

  @IsBoolean()
  @IsOptional()
  expandableReservation?: boolean = true;
}

/**
 * DTO for capacity planning thresholds
 */
export class CapacityThresholdDto {
  @IsEnum(ThresholdType)
  thresholdType: ThresholdType;

  @IsInt()
  @Min(1)
  @Max(100)
  warningThreshold: number;

  @IsInt()
  @Min(1)
  @Max(100)
  criticalThreshold: number;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

  @IsString()
  @IsOptional()
  notificationEmail?: string;
}

/**
 * DTO for host maintenance mode
 */
export class HostMaintenanceModeDto {
  @IsEnum(MaintenanceMode)
  mode: MaintenanceMode;

  @IsInt()
  @Min(0)
  @Max(3600)
  @IsOptional()
  timeoutSeconds?: number = 600;

  @IsBoolean()
  @IsOptional()
  evacuatePoweredOffVMs?: boolean = false;

  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * DTO for DRS recommendation
 */
export class DRSRecommendationDto {
  @IsUUID('4')
  vmId: string;

  @IsUUID('4')
  sourceHostId: string;

  @IsUUID('4')
  targetHostId: string;

  @IsString()
  reason: string;

  @IsInt()
  @Min(1)
  @Max(5)
  priority: number;

  @IsNumber()
  expectedImprovement: number;
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface DatacenterResponse {
  id: string;
  name: string;
  description?: string;
  location?: string;
  regionId?: string;
  enabled: boolean;
  tags: string[];
  metadata: Record<string, any>;
  statistics: {
    totalClusters: number;
    totalHosts: number;
    totalVMs: number;
    totalCpuCores: number;
    totalMemoryMB: number;
    totalStorageGB: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ClusterResponse {
  id: string;
  name: string;
  description?: string;
  datacenterId: string;
  drsMode: DRSMode;
  haMode: HAMode;
  vSanEnabled: boolean;
  evrsEnabled: boolean;
  tags: string[];
  metadata: Record<string, any>;
  statistics: {
    totalHosts: number;
    totalVMs: number;
    cpuCores: number;
    memoryMB: number;
    usedCpuPercent: number;
    usedMemoryPercent: number;
  };
  health: {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HostResponse {
  id: string;
  name: string;
  hostname?: string;
  ipAddress: string;
  clusterId?: string;
  datacenterId?: string;
  powerState: HostPowerState;
  connectionState: HostConnectionState;
  maintenanceMode: boolean;
  cpuCores: number;
  cpuMHz: number;
  memoryMB: number;
  tags: string[];
  metadata: Record<string, any>;
  statistics: {
    runningVMs: number;
    usedCpuPercent: number;
    usedMemoryPercent: number;
    networkThroughputMBps: number;
    uptime: number;
  };
  version: {
    productName: string;
    productVersion: string;
    buildNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CapacityForecastResponse {
  resourceType: string;
  currentUsage: number;
  currentCapacity: number;
  utilizationPercent: number;
  forecast: Array<{
    date: Date;
    projectedUsage: number;
    projectedUtilization: number;
  }>;
  recommendations: string[];
  timeToExhaustion?: Date;
}

export interface InfrastructureHealthResponse {
  overallStatus: 'healthy' | 'warning' | 'critical';
  datacenters: Array<{
    id: string;
    name: string;
    status: string;
    issueCount: number;
  }>;
  clusters: Array<{
    id: string;
    name: string;
    status: string;
    issueCount: number;
  }>;
  hosts: Array<{
    id: string;
    name: string;
    status: string;
    issueCount: number;
  }>;
  activeAlarms: number;
  criticalAlarms: number;
  warningAlarms: number;
  lastChecked: Date;
}

// ============================================================================
// DECORATOR UTILITIES
// ============================================================================

/**
 * Custom decorator for infrastructure audit logging
 *
 * @param {string} action - Action being performed
 * @returns {MethodDecorator} Audit decorator
 *
 * @example
 * ```typescript
 * @Post('datacenters')
 * @InfrastructureAudit('CREATE_DATACENTER')
 * async createDatacenter(@Body() dto: CreateDatacenterDto) {
 *   // Automatically logged for compliance
 * }
 * ```
 */
export function InfrastructureAudit(action: string): MethodDecorator {
  return applyDecorators();
}

/**
 * Decorator for infrastructure admin permissions
 *
 * @returns {MethodDecorator} Admin permission decorator
 *
 * @example
 * ```typescript
 * @Delete('hosts/:id')
 * @RequireInfrastructureAdmin()
 * async deleteHost(@Param('id') id: string) {
 *   return this.service.deleteHost(id);
 * }
 * ```
 */
export function RequireInfrastructureAdmin(): MethodDecorator {
  return applyDecorators();
}

// ============================================================================
// DATACENTER CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for creating datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('datacenters')
 * @CreateDatacenterDecorators()
 * async createDatacenter(@Body() dto: CreateDatacenterDto) {
 *   return this.infraService.createDatacenter(dto);
 * }
 * ```
 */
export function CreateDatacenterDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create datacenter', description: 'Creates a new virtual datacenter container for organizing infrastructure resources' }),
    ApiBody({ type: CreateDatacenterDto }),
    ApiResponse({ status: 201, description: 'Datacenter created successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid request parameters' }),
    ApiResponse({ status: 409, description: 'Datacenter name already exists' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing datacenters endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('datacenters')
 * @ListDatacentersDecorators()
 * async listDatacenters(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.infraService.listDatacenters({ page, limit });
 * }
 * ```
 */
export function ListDatacentersDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List datacenters', description: 'Retrieves paginated list of all datacenters with statistics' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (max 100)' }),
    ApiQuery({ name: 'enabled', required: false, type: Boolean, description: 'Filter by enabled status' }),
    ApiQuery({ name: 'regionId', required: false, type: String, description: 'Filter by region' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting datacenter details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('datacenters/:id')
 * @GetDatacenterDecorators()
 * async getDatacenter(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getDatacenter(id);
 * }
 * ```
 */
export function GetDatacenterDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get datacenter details', description: 'Retrieves detailed information about a specific datacenter including statistics and health' }),
    ApiParam({ name: 'id', type: String, description: 'Datacenter UUID' }),
    ApiResponse({ status: 200, description: 'Datacenter details retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Datacenter not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for updating datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('datacenters/:id')
 * @UpdateDatacenterDecorators()
 * async updateDatacenter(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateDatacenter(id, dto);
 * }
 * ```
 */
export function UpdateDatacenterDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update datacenter', description: 'Updates datacenter metadata, configuration, or settings' }),
    ApiParam({ name: 'id', type: String, description: 'Datacenter UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string' },
          enabled: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } },
          metadata: { type: 'object' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Datacenter updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Datacenter not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for deleting datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('datacenters/:id')
 * @DeleteDatacenterDecorators()
 * async deleteDatacenter(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.infraService.deleteDatacenter(id, force);
 * }
 * ```
 */
export function DeleteDatacenterDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete datacenter', description: 'Permanently deletes a datacenter (must be empty unless force=true)' }),
    ApiParam({ name: 'id', type: String, description: 'Datacenter UUID' }),
    ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Force deletion even if contains resources' }),
    ApiResponse({ status: 204, description: 'Datacenter deleted successfully' }),
    ApiResponse({ status: 404, description: 'Datacenter not found' }),
    ApiResponse({ status: 409, description: 'Datacenter contains resources and cannot be deleted' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

// ============================================================================
// CLUSTER CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for creating cluster endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters')
 * @CreateClusterDecorators()
 * async createCluster(@Body() dto: CreateClusterDto) {
 *   return this.infraService.createCluster(dto);
 * }
 * ```
 */
export function CreateClusterDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create cluster', description: 'Creates a new compute cluster with DRS and HA configuration' }),
    ApiBody({ type: CreateClusterDto }),
    ApiResponse({ status: 201, description: 'Cluster created successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid cluster configuration' }),
    ApiResponse({ status: 404, description: 'Datacenter not found' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing clusters endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters')
 * @ListClustersDecorators()
 * async listClusters(@Query() query: any) {
 *   return this.infraService.listClusters(query);
 * }
 * ```
 */
export function ListClustersDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List clusters', description: 'Retrieves paginated list of clusters with health and statistics' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'datacenterId', required: false, type: String, description: 'Filter by datacenter' }),
    ApiQuery({ name: 'drsMode', required: false, enum: DRSMode, description: 'Filter by DRS mode' }),
    ApiQuery({ name: 'haMode', required: false, enum: HAMode, description: 'Filter by HA mode' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting cluster details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters/:id')
 * @GetClusterDecorators()
 * async getCluster(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getCluster(id);
 * }
 * ```
 */
export function GetClusterDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get cluster details', description: 'Retrieves detailed cluster information including DRS/HA status and resource utilization' }),
    ApiParam({ name: 'id', type: String, description: 'Cluster UUID' }),
    ApiResponse({ status: 200, description: 'Cluster details retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Cluster not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for updating cluster DRS settings endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('clusters/:id/drs')
 * @UpdateClusterDRSDecorators()
 * async updateDRS(@Param('id') id: string, @Body() dto: UpdateClusterDRSDto) {
 *   return this.infraService.updateClusterDRS(id, dto);
 * }
 * ```
 */
export function UpdateClusterDRSDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update cluster DRS settings', description: 'Configures Distributed Resource Scheduler settings for load balancing and VM placement' }),
    ApiParam({ name: 'id', type: String, description: 'Cluster UUID' }),
    ApiBody({ type: UpdateClusterDRSDto }),
    ApiResponse({ status: 200, description: 'DRS settings updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Cluster not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for updating cluster HA settings endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('clusters/:id/ha')
 * @UpdateClusterHADecorators()
 * async updateHA(@Param('id') id: string, @Body() dto: UpdateClusterHADto) {
 *   return this.infraService.updateClusterHA(id, dto);
 * }
 * ```
 */
export function UpdateClusterHADecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update cluster HA settings', description: 'Configures High Availability settings for automatic VM failover and restart' }),
    ApiParam({ name: 'id', type: String, description: 'Cluster UUID' }),
    ApiBody({ type: UpdateClusterHADto }),
    ApiResponse({ status: 200, description: 'HA settings updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Cluster not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for getting cluster recommendations endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters/:id/recommendations')
 * @GetClusterRecommendationsDecorators()
 * async getRecommendations(@Param('id') id: string) {
 *   return this.infraService.getClusterRecommendations(id);
 * }
 * ```
 */
export function GetClusterRecommendationsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get DRS recommendations', description: 'Retrieves current DRS load balancing recommendations for the cluster' }),
    ApiParam({ name: 'id', type: String, description: 'Cluster UUID' }),
    ApiQuery({ name: 'autoApply', required: false, type: Boolean, description: 'Include auto-apply recommendations only' }),
    ApiResponse({ status: 200, description: 'Recommendations retrieved successfully', type: [Object] }),
    ApiResponse({ status: 404, description: 'Cluster not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for applying DRS recommendation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters/:id/recommendations/:recommendationId/apply')
 * @ApplyDRSRecommendationDecorators()
 * async applyRecommendation(@Param('id') id: string, @Param('recommendationId') recId: string) {
 *   return this.infraService.applyDRSRecommendation(id, recId);
 * }
 * ```
 */
export function ApplyDRSRecommendationDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Apply DRS recommendation', description: 'Applies a specific DRS recommendation to migrate VM to optimal host' }),
    ApiParam({ name: 'id', type: String, description: 'Cluster UUID' }),
    ApiParam({ name: 'recommendationId', type: String, description: 'Recommendation UUID' }),
    ApiResponse({ status: 200, description: 'Recommendation applied successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Cluster or recommendation not found' }),
    ApiResponse({ status: 409, description: 'Recommendation no longer valid' }),
    ApiBearerAuth(),
  );
}

// ============================================================================
// HOST CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for adding host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts')
 * @AddHostDecorators()
 * async addHost(@Body() dto: AddHostDto) {
 *   return this.infraService.addHost(dto);
 * }
 * ```
 */
export function AddHostDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Add host to infrastructure', description: 'Registers a new ESXi/hypervisor host to the infrastructure' }),
    ApiBody({ type: AddHostDto }),
    ApiResponse({ status: 201, description: 'Host added successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid host credentials or configuration' }),
    ApiResponse({ status: 404, description: 'Cluster or datacenter not found' }),
    ApiResponse({ status: 503, description: 'Unable to connect to host' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing hosts endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts')
 * @ListHostsDecorators()
 * async listHosts(@Query() query: any) {
 *   return this.infraService.listHosts(query);
 * }
 * ```
 */
export function ListHostsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List hosts', description: 'Retrieves paginated list of hosts with power state and statistics' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'clusterId', required: false, type: String, description: 'Filter by cluster' }),
    ApiQuery({ name: 'powerState', required: false, enum: HostPowerState, description: 'Filter by power state' }),
    ApiQuery({ name: 'connectionState', required: false, enum: HostConnectionState, description: 'Filter by connection state' }),
    ApiQuery({ name: 'maintenanceMode', required: false, type: Boolean, description: 'Filter by maintenance mode' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting host details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts/:id')
 * @GetHostDecorators()
 * async getHost(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getHost(id);
 * }
 * ```
 */
export function GetHostDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get host details', description: 'Retrieves detailed host information including hardware specs, running VMs, and utilization' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiResponse({ status: 200, description: 'Host details retrieved successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for removing host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('hosts/:id')
 * @RemoveHostDecorators()
 * async removeHost(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.infraService.removeHost(id, force);
 * }
 * ```
 */
export function RemoveHostDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Remove host from infrastructure', description: 'Removes a host from management (must be in maintenance mode unless force=true)' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Force removal even with running VMs' }),
    ApiResponse({ status: 204, description: 'Host removed successfully' }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiResponse({ status: 409, description: 'Host has running VMs or not in maintenance mode' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

/**
 * Creates decorator for host maintenance mode endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/maintenance')
 * @HostMaintenanceModeDecorators()
 * async setMaintenanceMode(@Param('id') id: string, @Body() dto: HostMaintenanceModeDto) {
 *   return this.infraService.setHostMaintenanceMode(id, dto);
 * }
 * ```
 */
export function HostMaintenanceModeDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Set host maintenance mode', description: 'Enters or exits maintenance mode, evacuating or allowing VMs' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiBody({ type: HostMaintenanceModeDto }),
    ApiResponse({ status: 200, description: 'Maintenance mode changed successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiResponse({ status: 409, description: 'Unable to evacuate VMs within timeout' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for host power control endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/power')
 * @HostPowerControlDecorators()
 * async controlHostPower(@Param('id') id: string, @Body() dto: { action: string }) {
 *   return this.infraService.controlHostPower(id, dto.action);
 * }
 * ```
 */
export function HostPowerControlDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Control host power state', description: 'Powers on, off, or reboots a host (evacuates VMs first)' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiBody({
      schema: {
        properties: {
          action: { type: 'string', enum: ['poweron', 'poweroff', 'reboot', 'standby'], description: 'Power action to perform' },
          force: { type: 'boolean', description: 'Force action without VM evacuation' },
        },
        required: ['action'],
      },
    }),
    ApiResponse({ status: 200, description: 'Power action initiated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiResponse({ status: 409, description: 'Invalid power state transition' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for reconnecting host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/reconnect')
 * @ReconnectHostDecorators()
 * async reconnectHost(@Param('id') id: string) {
 *   return this.infraService.reconnectHost(id);
 * }
 * ```
 */
export function ReconnectHostDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Reconnect host', description: 'Attempts to reconnect a disconnected or not responding host' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiResponse({ status: 200, description: 'Host reconnected successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiResponse({ status: 503, description: 'Unable to connect to host' }),
    ApiBearerAuth(),
  );
}

// ============================================================================
// RESOURCE POOL CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for creating resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resource-pools')
 * @CreateResourcePoolDecorators()
 * async createResourcePool(@Body() dto: CreateResourcePoolDto) {
 *   return this.infraService.createResourcePool(dto);
 * }
 * ```
 */
export function CreateResourcePoolDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create resource pool', description: 'Creates a resource pool for hierarchical resource management and allocation' }),
    ApiBody({ type: CreateResourcePoolDto }),
    ApiResponse({ status: 201, description: 'Resource pool created successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid resource pool configuration' }),
    ApiResponse({ status: 404, description: 'Cluster or parent pool not found' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.CREATED),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for listing resource pools endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resource-pools')
 * @ListResourcePoolsDecorators()
 * async listResourcePools(@Query() query: any) {
 *   return this.infraService.listResourcePools(query);
 * }
 * ```
 */
export function ListResourcePoolsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List resource pools', description: 'Retrieves paginated list of resource pools with allocation details' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'clusterId', required: false, type: String, description: 'Filter by cluster' }),
    ApiQuery({ name: 'parentPoolId', required: false, type: String, description: 'Filter by parent pool' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for updating resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('resource-pools/:id')
 * @UpdateResourcePoolDecorators()
 * async updateResourcePool(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateResourcePool(id, dto);
 * }
 * ```
 */
export function UpdateResourcePoolDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update resource pool', description: 'Updates resource pool allocation settings (shares, reservation, limits)' }),
    ApiParam({ name: 'id', type: String, description: 'Resource pool UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string' },
          cpuShares: { type: 'number' },
          cpuReservationMHz: { type: 'number' },
          cpuLimitMHz: { type: 'number' },
          memorySharesMB: { type: 'number' },
          memoryReservationMB: { type: 'number' },
          memoryLimitMB: { type: 'number' },
          expandableReservation: { type: 'boolean' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Resource pool updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Resource pool not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for deleting resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('resource-pools/:id')
 * @DeleteResourcePoolDecorators()
 * async deleteResourcePool(@Param('id') id: string) {
 *   return this.infraService.deleteResourcePool(id);
 * }
 * ```
 */
export function DeleteResourcePoolDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete resource pool', description: 'Deletes a resource pool (must be empty or VMs moved to parent)' }),
    ApiParam({ name: 'id', type: String, description: 'Resource pool UUID' }),
    ApiQuery({ name: 'moveVMsToParent', required: false, type: Boolean, description: 'Move VMs to parent pool before deletion' }),
    ApiResponse({ status: 204, description: 'Resource pool deleted successfully' }),
    ApiResponse({ status: 404, description: 'Resource pool not found' }),
    ApiResponse({ status: 409, description: 'Resource pool contains VMs or child pools' }),
    ApiBearerAuth(),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}

// ============================================================================
// CAPACITY PLANNING CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Creates decorator for getting capacity overview endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/overview')
 * @GetCapacityOverviewDecorators()
 * async getCapacityOverview(@Query('datacenterId') datacenterId?: string) {
 *   return this.infraService.getCapacityOverview(datacenterId);
 * }
 * ```
 */
export function GetCapacityOverviewDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get capacity overview', description: 'Retrieves current capacity utilization across all resources' }),
    ApiQuery({ name: 'datacenterId', required: false, type: String, description: 'Filter by datacenter' }),
    ApiQuery({ name: 'clusterId', required: false, type: String, description: 'Filter by cluster' }),
    ApiResponse({
      status: 200,
      description: 'Capacity overview retrieved successfully',
      schema: {
        properties: {
          cpu: {
            type: 'object',
            properties: {
              totalMHz: { type: 'number' },
              usedMHz: { type: 'number' },
              utilizationPercent: { type: 'number' },
            },
          },
          memory: {
            type: 'object',
            properties: {
              totalMB: { type: 'number' },
              usedMB: { type: 'number' },
              utilizationPercent: { type: 'number' },
            },
          },
          storage: {
            type: 'object',
            properties: {
              totalGB: { type: 'number' },
              usedGB: { type: 'number' },
              utilizationPercent: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting capacity forecast endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/forecast')
 * @GetCapacityForecastDecorators()
 * async getCapacityForecast(@Query() query: any) {
 *   return this.infraService.getCapacityForecast(query);
 * }
 * ```
 */
export function GetCapacityForecastDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get capacity forecast', description: 'Retrieves capacity forecasts based on historical trends and growth projections' }),
    ApiQuery({ name: 'resourceType', required: false, enum: ThresholdType, description: 'Resource type for forecast' }),
    ApiQuery({ name: 'forecastDays', required: false, type: Number, description: 'Number of days to forecast (default: 90)' }),
    ApiQuery({ name: 'datacenterId', required: false, type: String }),
    ApiQuery({ name: 'clusterId', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Forecast retrieved successfully', type: Object }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for setting capacity thresholds endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('capacity/thresholds')
 * @SetCapacityThresholdsDecorators()
 * async setThresholds(@Body() dto: CapacityThresholdDto) {
 *   return this.infraService.setCapacityThresholds(dto);
 * }
 * ```
 */
export function SetCapacityThresholdsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Set capacity thresholds', description: 'Configures warning and critical thresholds for capacity monitoring' }),
    ApiBody({ type: CapacityThresholdDto }),
    ApiResponse({ status: 200, description: 'Thresholds configured successfully', type: Object }),
    ApiResponse({ status: 400, description: 'Invalid threshold configuration' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for getting capacity recommendations endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/recommendations')
 * @GetCapacityRecommendationsDecorators()
 * async getCapacityRecommendations() {
 *   return this.infraService.getCapacityRecommendations();
 * }
 * ```
 */
export function GetCapacityRecommendationsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get capacity recommendations', description: 'Retrieves AI-driven recommendations for capacity optimization and expansion' }),
    ApiQuery({ name: 'includeRightSizing', required: false, type: Boolean, description: 'Include VM rightsizing recommendations' }),
    ApiResponse({
      status: 200,
      description: 'Recommendations retrieved successfully',
      schema: {
        properties: {
          expansion: { type: 'array', items: { type: 'object' } },
          rightsizing: { type: 'array', items: { type: 'object' } },
          consolidation: { type: 'array', items: { type: 'object' } },
          decommission: { type: 'array', items: { type: 'object' } },
        },
      },
    }),
    ApiBearerAuth(),
  );
}

// ============================================================================
// INFRASTRUCTURE HEALTH & MONITORING
// ============================================================================

/**
 * Creates decorator for getting infrastructure health endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('health')
 * @GetInfrastructureHealthDecorators()
 * async getHealth() {
 *   return this.infraService.getInfrastructureHealth();
 * }
 * ```
 */
export function GetInfrastructureHealthDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get infrastructure health', description: 'Retrieves overall infrastructure health status and active alarms' }),
    ApiQuery({ name: 'severity', required: false, enum: AlarmSeverity, description: 'Filter alarms by severity' }),
    ApiResponse({ status: 200, description: 'Health status retrieved successfully', type: Object }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for listing alarms endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('alarms')
 * @ListAlarmsDecorators()
 * async listAlarms(@Query() query: any) {
 *   return this.infraService.listAlarms(query);
 * }
 * ```
 */
export function ListAlarmsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'List infrastructure alarms', description: 'Retrieves active and historical alarms with filtering options' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'severity', required: false, enum: AlarmSeverity }),
    ApiQuery({ name: 'resourceId', required: false, type: String, description: 'Filter by resource' }),
    ApiQuery({ name: 'acknowledged', required: false, type: Boolean, description: 'Filter by acknowledgment status' }),
    ApiResponse({ status: 200, description: 'Alarms retrieved successfully', type: [Object] }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for acknowledging alarm endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('alarms/:id/acknowledge')
 * @AcknowledgeAlarmDecorators()
 * async acknowledgeAlarm(@Param('id') id: string, @Body() dto: { comment: string }) {
 *   return this.infraService.acknowledgeAlarm(id, dto.comment);
 * }
 * ```
 */
export function AcknowledgeAlarmDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Acknowledge alarm', description: 'Acknowledges an alarm with optional comment' }),
    ApiParam({ name: 'id', type: String, description: 'Alarm UUID' }),
    ApiBody({
      schema: {
        properties: {
          comment: { type: 'string', description: 'Acknowledgment comment' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Alarm acknowledged successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Alarm not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for getting infrastructure metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('metrics')
 * @GetInfrastructureMetricsDecorators()
 * async getMetrics(@Query() query: any) {
 *   return this.infraService.getInfrastructureMetrics(query);
 * }
 * ```
 */
export function GetInfrastructureMetricsDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get infrastructure metrics', description: 'Retrieves time-series performance metrics for infrastructure components' }),
    ApiQuery({ name: 'resourceType', required: false, enum: InfrastructureType }),
    ApiQuery({ name: 'resourceId', required: false, type: String }),
    ApiQuery({ name: 'period', required: false, type: String, enum: ['1h', '6h', '24h', '7d', '30d'] }),
    ApiQuery({ name: 'metrics', required: false, type: String, description: 'Comma-separated metric names' }),
    ApiResponse({ status: 200, description: 'Metrics retrieved successfully', type: Object }),
    ApiBearerAuth(),
  );
}

// ============================================================================
// ADVANCED OPERATIONS
// ============================================================================

/**
 * Creates decorator for optimizing cluster placement endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters/:id/optimize')
 * @OptimizeClusterPlacementDecorators()
 * async optimizeCluster(@Param('id') id: string) {
 *   return this.infraService.optimizeClusterPlacement(id);
 * }
 * ```
 */
export function OptimizeClusterPlacementDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Optimize cluster VM placement', description: 'Runs DRS optimization to balance workload across cluster hosts' }),
    ApiParam({ name: 'id', type: String, description: 'Cluster UUID' }),
    ApiBody({
      required: false,
      schema: {
        properties: {
          targetUtilization: { type: 'number', minimum: 50, maximum: 90, description: 'Target CPU/memory utilization percentage' },
          autoApply: { type: 'boolean', default: false, description: 'Automatically apply high-priority recommendations' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Optimization completed successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Cluster not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for simulating workload placement endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('capacity/simulate')
 * @SimulateWorkloadPlacementDecorators()
 * async simulatePlacement(@Body() dto: any) {
 *   return this.infraService.simulateWorkloadPlacement(dto);
 * }
 * ```
 */
export function SimulateWorkloadPlacementDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Simulate workload placement', description: 'Simulates placing new workloads to determine optimal host/cluster placement' }),
    ApiBody({
      schema: {
        properties: {
          workloads: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                cpuCores: { type: 'number' },
                memoryMB: { type: 'number' },
                storageGB: { type: 'number' },
                count: { type: 'number', default: 1 },
              },
            },
          },
          targetClusterId: { type: 'string', format: 'uuid' },
          constraints: { type: 'object' },
        },
        required: ['workloads'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Simulation completed successfully',
      schema: {
        properties: {
          feasible: { type: 'boolean' },
          recommendedPlacements: { type: 'array', items: { type: 'object' } },
          projectedUtilization: { type: 'object' },
          warnings: { type: 'array', items: { type: 'string' } },
        },
      },
    }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// ADDITIONAL HOST OPERATIONS
// ============================================================================

/**
 * Creates decorator for getting host performance metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts/:id/performance')
 * @GetHostPerformanceDecorators()
 * async getHostPerformance(@Param('id') id: string, @Query() query: any) {
 *   return this.infraService.getHostPerformance(id, query);
 * }
 * ```
 */
export function GetHostPerformanceDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get host performance metrics', description: 'Retrieves detailed performance metrics for a host including CPU, memory, storage, and network' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiQuery({ name: 'period', required: false, type: String, enum: ['1h', '6h', '24h', '7d', '30d'], description: 'Metrics time period' }),
    ApiQuery({ name: 'interval', required: false, type: String, enum: ['1m', '5m', '15m', '1h'], description: 'Data point interval' }),
    ApiResponse({
      status: 200,
      description: 'Host performance metrics retrieved successfully',
      schema: {
        properties: {
          hostId: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          cpu: {
            type: 'object',
            properties: {
              utilizationPercent: { type: 'number' },
              mhzUsed: { type: 'number' },
              mhzTotal: { type: 'number' },
            },
          },
          memory: {
            type: 'object',
            properties: {
              utilizationPercent: { type: 'number' },
              usedMB: { type: 'number' },
              totalMB: { type: 'number' },
            },
          },
          network: {
            type: 'object',
            properties: {
              rxBytesPerSec: { type: 'number' },
              txBytesPerSec: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiBearerAuth(),
  );
}

/**
 * Creates decorator for updating host configuration endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('hosts/:id/config')
 * @UpdateHostConfigDecorators()
 * async updateHostConfig(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateHostConfig(id, dto);
 * }
 * ```
 */
export function UpdateHostConfigDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update host configuration', description: 'Updates host settings including name, tags, resource pool assignments, and custom attributes' }),
    ApiParam({ name: 'id', type: String, description: 'Host UUID' }),
    ApiBody({
      schema: {
        properties: {
          name: { type: 'string', description: 'Host display name' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Host tags' },
          customAttributes: { type: 'object', description: 'Custom key-value attributes' },
          powerPolicy: { type: 'string', enum: ['balanced', 'performance', 'low-power'], description: 'Power management policy' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Host configuration updated successfully', type: Object }),
    ApiResponse({ status: 404, description: 'Host not found' }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

/**
 * Creates decorator for exporting infrastructure report endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('reports/export')
 * @ExportInfrastructureReportDecorators()
 * async exportReport(@Body() dto: any) {
 *   return this.infraService.exportInfrastructureReport(dto);
 * }
 * ```
 */
export function ExportInfrastructureReportDecorators(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Export infrastructure report', description: 'Generates and exports comprehensive infrastructure report in various formats (PDF, CSV, JSON)' }),
    ApiBody({
      schema: {
        properties: {
          reportType: {
            type: 'string',
            enum: ['capacity', 'utilization', 'health', 'compliance', 'inventory', 'performance'],
            description: 'Type of report to generate',
          },
          format: { type: 'string', enum: ['pdf', 'csv', 'json', 'xlsx'], description: 'Export format', default: 'pdf' },
          scope: {
            type: 'object',
            properties: {
              datacenterIds: { type: 'array', items: { type: 'string' } },
              clusterIds: { type: 'array', items: { type: 'string' } },
              hostIds: { type: 'array', items: { type: 'string' } },
            },
          },
          period: { type: 'string', enum: ['1d', '7d', '30d', '90d', '1y'], description: 'Reporting period', default: '30d' },
          includeCharts: { type: 'boolean', default: true, description: 'Include visualizations in report' },
        },
        required: ['reportType'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Report generated successfully',
      schema: {
        properties: {
          reportId: { type: 'string' },
          downloadUrl: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
          size: { type: 'number', description: 'File size in bytes' },
        },
      },
    }),
    ApiBearerAuth(),
    UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Datacenter Controllers
  CreateDatacenterDecorators,
  ListDatacentersDecorators,
  GetDatacenterDecorators,
  UpdateDatacenterDecorators,
  DeleteDatacenterDecorators,

  // Cluster Controllers
  CreateClusterDecorators,
  ListClustersDecorators,
  GetClusterDecorators,
  UpdateClusterDRSDecorators,
  UpdateClusterHADecorators,
  GetClusterRecommendationsDecorators,
  ApplyDRSRecommendationDecorators,

  // Host Controllers
  AddHostDecorators,
  ListHostsDecorators,
  GetHostDecorators,
  RemoveHostDecorators,
  HostMaintenanceModeDecorators,
  HostPowerControlDecorators,
  ReconnectHostDecorators,

  // Resource Pool Controllers
  CreateResourcePoolDecorators,
  ListResourcePoolsDecorators,
  UpdateResourcePoolDecorators,
  DeleteResourcePoolDecorators,

  // Capacity Planning
  GetCapacityOverviewDecorators,
  GetCapacityForecastDecorators,
  SetCapacityThresholdsDecorators,
  GetCapacityRecommendationsDecorators,

  // Health & Monitoring
  GetInfrastructureHealthDecorators,
  ListAlarmsDecorators,
  AcknowledgeAlarmDecorators,
  GetInfrastructureMetricsDecorators,

  // Advanced Operations
  OptimizeClusterPlacementDecorators,
  SimulateWorkloadPlacementDecorators,

  // Additional Host Operations
  GetHostPerformanceDecorators,
  UpdateHostConfigDecorators,

  // Reporting
  ExportInfrastructureReportDecorators,

  // Custom Decorators
  InfrastructureAudit,
  RequireInfrastructureAdmin,

  // DTOs
  CreateDatacenterDto,
  CreateClusterDto,
  AddHostDto,
  UpdateClusterDRSDto,
  UpdateClusterHADto,
  CreateResourcePoolDto,
  CapacityThresholdDto,
  HostMaintenanceModeDto,
  DRSRecommendationDto,

  // Enums
  InfrastructureType,
  HostPowerState,
  HAMode,
  DRSMode,
  HostConnectionState,
  AlarmSeverity,
  ThresholdType,
  MaintenanceMode,
};
