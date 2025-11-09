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
 * Resource types for virtual infrastructure
 */
export declare enum VirtualResourceType {
    COMPUTE = "compute",
    STORAGE = "storage",
    NETWORK = "network",
    VOLUME = "volume",
    SNAPSHOT = "snapshot",
    TEMPLATE = "template"
}
/**
 * Resource power states
 */
export declare enum ResourcePowerState {
    POWERED_ON = "powered_on",
    POWERED_OFF = "powered_off",
    SUSPENDED = "suspended",
    PAUSED = "paused",
    UNKNOWN = "unknown"
}
/**
 * Resource allocation modes
 */
export declare enum AllocationMode {
    STATIC = "static",
    DYNAMIC = "dynamic",
    ELASTIC = "elastic",
    RESERVED = "reserved"
}
/**
 * Storage types
 */
export declare enum StorageType {
    SSD = "ssd",
    HDD = "hdd",
    NVME = "nvme",
    NETWORK = "network",
    OBJECT = "object"
}
/**
 * Network interface types
 */
export declare enum NetworkInterfaceType {
    VMXNET3 = "vmxnet3",
    E1000 = "e1000",
    E1000E = "e1000e",
    VIRTIO = "virtio"
}
/**
 * Quota enforcement levels
 */
export declare enum QuotaEnforcement {
    SOFT = "soft",
    HARD = "hard",
    ADVISORY = "advisory"
}
/**
 * DTO for creating virtual compute resource
 */
export declare class CreateComputeResourceDto {
    name: string;
    description?: string;
    cpuCores: number;
    memoryMB: number;
    templateId?: string;
    allocationMode?: AllocationMode;
    tags?: string[];
    metadata?: Record<string, any>;
    tenantId?: string;
    autoStart?: boolean;
}
/**
 * DTO for creating storage resource
 */
export declare class CreateStorageResourceDto {
    name: string;
    description?: string;
    sizeGB: number;
    storageType: StorageType;
    encrypted?: boolean;
    encryptionKeyId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    tenantId?: string;
    iopsLimit?: number;
    throughputMBps?: number;
}
/**
 * DTO for creating network resource
 */
export declare class CreateNetworkResourceDto {
    name: string;
    description?: string;
    cidr: string;
    gateway?: string;
    vlanId?: number;
    dhcpEnabled?: boolean;
    dnsServers?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
    tenantId?: string;
}
/**
 * DTO for updating resource
 */
export declare class UpdateResourceDto {
    name?: string;
    description?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    enabled?: boolean;
}
/**
 * DTO for resource quota configuration
 */
export declare class ResourceQuotaDto {
    resourceType: VirtualResourceType;
    tenantId?: string;
    maxCpuCores?: number;
    maxMemoryMB?: number;
    maxStorageGB?: number;
    maxNetworks?: number;
    maxInstances?: number;
    enforcement?: QuotaEnforcement;
    enabled?: boolean;
}
/**
 * DTO for bulk resource operations
 */
export declare class BulkResourceOperationDto {
    resourceIds: string[];
    operation?: string;
    parameters?: Record<string, any>;
}
/**
 * DTO for resource tagging
 */
export declare class ResourceTagDto {
    key: string;
    value: string;
    category?: string;
}
/**
 * DTO for attaching network interface
 */
export declare class AttachNetworkInterfaceDto {
    networkId: string;
    interfaceType?: NetworkInterfaceType;
    macAddress?: string;
    connected?: boolean;
    deviceIndex?: number;
}
/**
 * DTO for creating snapshot
 */
export declare class CreateSnapshotDto {
    name: string;
    description?: string;
    includeMemory?: boolean;
    quiesce?: boolean;
    retentionDays?: number;
    tags?: string[];
}
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
export declare function AuditLog(action: string): MethodDecorator;
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
export declare const TenantId: any;
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
export declare function CreateComputeResourceDecorators(): MethodDecorator;
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
export declare function ListComputeResourcesDecorators(): MethodDecorator;
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
export declare function GetComputeResourceDecorators(): MethodDecorator;
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
export declare function UpdateComputeResourceDecorators(): MethodDecorator;
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
export declare function DeleteComputeResourceDecorators(): MethodDecorator;
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
export declare function ComputePowerControlDecorators(): MethodDecorator;
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
export declare function ResizeComputeResourceDecorators(): MethodDecorator;
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
export declare function CreateStorageResourceDecorators(): MethodDecorator;
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
export declare function ListStorageResourcesDecorators(): MethodDecorator;
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
export declare function GetStorageResourceDecorators(): MethodDecorator;
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
export declare function AttachStorageDecorators(): MethodDecorator;
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
export declare function DetachStorageDecorators(): MethodDecorator;
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
export declare function ResizeStorageDecorators(): MethodDecorator;
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
export declare function CreateStorageSnapshotDecorators(): MethodDecorator;
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
export declare function CreateNetworkResourceDecorators(): MethodDecorator;
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
export declare function ListNetworkResourcesDecorators(): MethodDecorator;
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
export declare function GetNetworkResourceDecorators(): MethodDecorator;
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
export declare function AttachNetworkInterfaceDecorators(): MethodDecorator;
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
export declare function DetachNetworkInterfaceDecorators(): MethodDecorator;
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
export declare function SetResourceQuotaDecorators(): MethodDecorator;
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
export declare function GetResourceQuotaDecorators(): MethodDecorator;
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
export declare function CheckQuotaAvailabilityDecorators(): MethodDecorator;
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
export declare function AddResourceTagDecorators(): MethodDecorator;
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
export declare function ListResourceTagsDecorators(): MethodDecorator;
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
export declare function RemoveResourceTagDecorators(): MethodDecorator;
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
export declare function BulkTagResourcesDecorators(): MethodDecorator;
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
export declare function GetResourceMetricsDecorators(): MethodDecorator;
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
export declare function GetRealtimeResourceStatsDecorators(): MethodDecorator;
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
export declare function BulkDeleteResourcesDecorators(): MethodDecorator;
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
export declare function BulkPowerControlDecorators(): MethodDecorator;
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
export declare function CloneResourceDecorators(): MethodDecorator;
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
export declare function CreateResourceTemplateDecorators(): MethodDecorator;
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
export declare function DeployFromTemplateDecorators(): MethodDecorator;
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
export declare function MigrateComputeResourceDecorators(): MethodDecorator;
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
export declare function ConsolidateStorageDecorators(): MethodDecorator;
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
export declare function ListSnapshotsDecorators(): MethodDecorator;
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
export declare function RestoreFromSnapshotDecorators(): MethodDecorator;
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
export declare function DeleteSnapshotDecorators(): MethodDecorator;
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
export declare function GetComputeConsoleDecorators(): MethodDecorator;
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
export declare function UpdateNetworkResourceDecorators(): MethodDecorator;
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
export declare function DeleteNetworkResourceDecorators(): MethodDecorator;
declare const _default: {
    CreateComputeResourceDecorators: typeof CreateComputeResourceDecorators;
    ListComputeResourcesDecorators: typeof ListComputeResourcesDecorators;
    GetComputeResourceDecorators: typeof GetComputeResourceDecorators;
    UpdateComputeResourceDecorators: typeof UpdateComputeResourceDecorators;
    DeleteComputeResourceDecorators: typeof DeleteComputeResourceDecorators;
    ComputePowerControlDecorators: typeof ComputePowerControlDecorators;
    ResizeComputeResourceDecorators: typeof ResizeComputeResourceDecorators;
    CreateStorageResourceDecorators: typeof CreateStorageResourceDecorators;
    ListStorageResourcesDecorators: typeof ListStorageResourcesDecorators;
    GetStorageResourceDecorators: typeof GetStorageResourceDecorators;
    AttachStorageDecorators: typeof AttachStorageDecorators;
    DetachStorageDecorators: typeof DetachStorageDecorators;
    ResizeStorageDecorators: typeof ResizeStorageDecorators;
    CreateStorageSnapshotDecorators: typeof CreateStorageSnapshotDecorators;
    CreateNetworkResourceDecorators: typeof CreateNetworkResourceDecorators;
    ListNetworkResourcesDecorators: typeof ListNetworkResourcesDecorators;
    GetNetworkResourceDecorators: typeof GetNetworkResourceDecorators;
    AttachNetworkInterfaceDecorators: typeof AttachNetworkInterfaceDecorators;
    DetachNetworkInterfaceDecorators: typeof DetachNetworkInterfaceDecorators;
    SetResourceQuotaDecorators: typeof SetResourceQuotaDecorators;
    GetResourceQuotaDecorators: typeof GetResourceQuotaDecorators;
    CheckQuotaAvailabilityDecorators: typeof CheckQuotaAvailabilityDecorators;
    AddResourceTagDecorators: typeof AddResourceTagDecorators;
    ListResourceTagsDecorators: typeof ListResourceTagsDecorators;
    RemoveResourceTagDecorators: typeof RemoveResourceTagDecorators;
    BulkTagResourcesDecorators: typeof BulkTagResourcesDecorators;
    GetResourceMetricsDecorators: typeof GetResourceMetricsDecorators;
    GetRealtimeResourceStatsDecorators: typeof GetRealtimeResourceStatsDecorators;
    BulkDeleteResourcesDecorators: typeof BulkDeleteResourcesDecorators;
    BulkPowerControlDecorators: typeof BulkPowerControlDecorators;
    CloneResourceDecorators: typeof CloneResourceDecorators;
    CreateResourceTemplateDecorators: typeof CreateResourceTemplateDecorators;
    DeployFromTemplateDecorators: typeof DeployFromTemplateDecorators;
    MigrateComputeResourceDecorators: typeof MigrateComputeResourceDecorators;
    ConsolidateStorageDecorators: typeof ConsolidateStorageDecorators;
    ListSnapshotsDecorators: typeof ListSnapshotsDecorators;
    RestoreFromSnapshotDecorators: typeof RestoreFromSnapshotDecorators;
    DeleteSnapshotDecorators: typeof DeleteSnapshotDecorators;
    GetComputeConsoleDecorators: typeof GetComputeConsoleDecorators;
    UpdateNetworkResourceDecorators: typeof UpdateNetworkResourceDecorators;
    DeleteNetworkResourceDecorators: typeof DeleteNetworkResourceDecorators;
    AuditLog: typeof AuditLog;
    TenantId: any;
    CreateComputeResourceDto: typeof CreateComputeResourceDto;
    CreateStorageResourceDto: typeof CreateStorageResourceDto;
    CreateNetworkResourceDto: typeof CreateNetworkResourceDto;
    UpdateResourceDto: typeof UpdateResourceDto;
    ResourceQuotaDto: typeof ResourceQuotaDto;
    BulkResourceOperationDto: typeof BulkResourceOperationDto;
    ResourceTagDto: typeof ResourceTagDto;
    AttachNetworkInterfaceDto: typeof AttachNetworkInterfaceDto;
    CreateSnapshotDto: typeof CreateSnapshotDto;
    VirtualResourceType: typeof VirtualResourceType;
    ResourcePowerState: typeof ResourcePowerState;
    AllocationMode: typeof AllocationMode;
    StorageType: typeof StorageType;
    NetworkInterfaceType: typeof NetworkInterfaceType;
    QuotaEnforcement: typeof QuotaEnforcement;
};
export default _default;
//# sourceMappingURL=virtual-resource-controllers-kit.d.ts.map