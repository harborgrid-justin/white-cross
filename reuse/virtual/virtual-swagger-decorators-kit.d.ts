/**
 * LOC: VIRTSWAG001
 * File: /reuse/virtual/virtual-swagger-decorators-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure API controllers
 *   - VMware vRealize API decorators
 *   - DTO validation and documentation
 */
/**
 * File: /reuse/virtual/virtual-swagger-decorators-kit.ts
 * Locator: WC-UTL-VIRTSWAG-001
 * Purpose: Reusable Swagger Decorator Factories for Virtual Infrastructure APIs - Custom decorators, validators, security schemes
 *
 * Upstream: Independent utility module for Swagger decorator composition
 * Downstream: ../backend/*, Virtual infrastructure controllers, VMware vRealize APIs, API DTOs, validation pipes
 * Dependencies: TypeScript 5.x, @nestjs/swagger 7.x, @nestjs/common 10.x, class-validator 0.14.x, Node 18+
 * Exports: 39 decorator factory functions for Swagger documentation, custom validators, security definitions, rate limiting
 *
 * LLM Context: Enterprise-grade Swagger decorator utilities for virtual infrastructure APIs compatible with VMware vSphere,
 * vRealize, and hypervisor management systems. Provides decorator composition, custom validators, security scheme decorators,
 * rate limiting documentation, API versioning decorators, and VMware-compatible response decorators essential for production
 * API documentation and validation.
 */
import { Type } from '@nestjs/common';
import { ValidationOptions } from 'class-validator';
interface SwaggerDecoratorOptions {
    tags?: string[];
    summary?: string;
    description?: string;
    deprecated?: boolean;
    security?: Array<Record<string, string[]>>;
}
interface RateLimitDecoratorOptions {
    limit: number;
    window: string;
    tier?: string;
}
interface PaginationDecoratorOptions {
    defaultLimit?: number;
    maxLimit?: number;
    defaultSort?: string;
}
interface ApiVersionDecoratorOptions {
    version: string;
    deprecated?: boolean;
    sunsetDate?: string;
}
/**
 * 1. Composite decorator for VM resource endpoints.
 *
 * @param {string} operation - Operation type (create, read, update, delete, clone, snapshot)
 * @param {SwaggerDecoratorOptions} [options] - Decorator options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VirtualMachineOperation('clone', {
 *   summary: 'Clone virtual machine',
 *   description: 'Creates a clone of an existing VM with optional customization'
 * })
 * async cloneVM(@Param('id') id: string, @Body() dto: CloneVMDto) {
 *   // Implementation
 * }
 * ```
 */
export declare const VirtualMachineOperation: (operation: "create" | "read" | "update" | "delete" | "clone" | "snapshot" | "migrate" | "power", options?: SwaggerDecoratorOptions) => MethodDecorator;
/**
 * 2. Decorator for VM power state validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PowerOperationDto {
 *   @IsVMPowerState()
 *   targetState: string;
 * }
 * ```
 */
export declare function IsVMPowerState(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 3. Decorator for VM ID validation (VMware format).
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VMRequestDto {
 *   @IsVMwareVMId()
 *   vmId: string;
 * }
 * ```
 */
export declare function IsVMwareVMId(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 4. Decorator for CPU core count validation.
 *
 * @param {number} [min] - Minimum cores
 * @param {number} [max] - Maximum cores
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VMConfigDto {
 *   @IsVMCPUCores(1, 128)
 *   cpuCores: number;
 * }
 * ```
 */
export declare function IsVMCPUCores(min?: number, max?: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 5. Decorator for VM memory size validation (in MB).
 *
 * @param {number} [min] - Minimum memory in MB
 * @param {number} [max] - Maximum memory in MB
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VMConfigDto {
 *   @IsVMMemoryMB(128, 1048576)
 *   memoryMB: number;
 * }
 * ```
 */
export declare function IsVMMemoryMB(min?: number, max?: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 6. Composite decorator for VM resource responses with standard error codes.
 *
 * @param {Type<any>} type - Response DTO type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VirtualMachineResponses(VirtualMachineDto)
 * async getVM(@Param('id') id: string) {
 *   // Automatically documents 200, 404, 403, 500 responses
 * }
 * ```
 */
export declare const VirtualMachineResponses: (type: Type<any>) => MethodDecorator;
/**
 * 7. Composite decorator for ESXi host operations.
 *
 * @param {string} operation - Operation type
 * @param {SwaggerDecoratorOptions} [options] - Decorator options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ESXiHostOperation('maintenance', {
 *   summary: 'Enter maintenance mode',
 *   description: 'Places ESXi host in maintenance mode with VM evacuation'
 * })
 * async enterMaintenanceMode(@Param('hostId') id: string) {
 *   // Implementation
 * }
 * ```
 */
export declare const ESXiHostOperation: (operation: "read" | "update" | "maintenance" | "reboot" | "shutdown", options?: SwaggerDecoratorOptions) => MethodDecorator;
/**
 * 8. Decorator for datastore ID validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class StorageAllocationDto {
 *   @IsDatastoreId()
 *   datastoreId: string;
 * }
 * ```
 */
export declare function IsDatastoreId(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 9. Decorator for cluster ID validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ClusterConfigDto {
 *   @IsClusterId()
 *   clusterId: string;
 * }
 * ```
 */
export declare function IsClusterId(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 10. Decorator for resource pool configuration validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ResourceAllocationDto {
 *   @IsResourcePoolShares()
 *   shares: string;
 * }
 * ```
 */
export declare function IsResourcePoolShares(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 11. Composite decorator for cluster operations with DRS/HA context.
 *
 * @param {string} operation - Operation type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ClusterOperation('configureDRS')
 * async configureDRS(@Param('clusterId') id: string, @Body() config: DRSConfigDto) {
 *   // Implementation with automatic Swagger docs
 * }
 * ```
 */
export declare const ClusterOperation: (operation: "read" | "create" | "update" | "delete" | "configureDRS" | "configureHA") => MethodDecorator;
/**
 * 12. Decorator for vSphere managed object reference (MoRef) validation.
 *
 * @param {string} type - MoRef type (vm, host, cluster, etc.)
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class MigrationDto {
 *   @IsVSphereMoRef('host')
 *   targetHost: string;
 * }
 * ```
 */
export declare function IsVSphereMoRef(type: string, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 13. Decorator for VLAN ID validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PortGroupDto {
 *   @IsVLANId()
 *   vlanId: number;
 * }
 * ```
 */
export declare function IsVLANId(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 14. Decorator for virtual NIC adapter type validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class NetworkAdapterDto {
 *   @IsVirtualNICType()
 *   adapterType: string;
 * }
 * ```
 */
export declare function IsVirtualNICType(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 15. Decorator for disk provisioning type validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DiskConfigDto {
 *   @IsDiskProvisioningType()
 *   diskType: string;
 * }
 * ```
 */
export declare function IsDiskProvisioningType(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 16. Composite decorator for virtual network operations.
 *
 * @param {string} operation - Operation type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VirtualNetworkOperation('createPortGroup')
 * async createPortGroup(@Body() dto: CreatePortGroupDto) {
 *   // Automatic Swagger docs for network operations
 * }
 * ```
 */
export declare const VirtualNetworkOperation: (operation: "read" | "create" | "update" | "delete" | "createPortGroup" | "createvSwitch") => MethodDecorator;
/**
 * 17. Decorator for NSX-T segment validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class NSXSegmentDto {
 *   @IsNSXSegmentType()
 *   segmentType: string;
 * }
 * ```
 */
export declare function IsNSXSegmentType(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 18. Decorator for storage capacity validation (in GB).
 *
 * @param {number} [min] - Minimum capacity in GB
 * @param {number} [max] - Maximum capacity in GB
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DiskDto {
 *   @IsStorageCapacityGB(1, 62000)
 *   capacityGB: number;
 * }
 * ```
 */
export declare function IsStorageCapacityGB(min?: number, max?: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
/**
 * 19. Composite decorator for vSphere session authentication.
 *
 * @param {string[]} [scopes] - Required permission scopes
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VSphereAuth(['VirtualMachine.Inventory.Create', 'Datastore.AllocateSpace'])
 * async createVM(@Body() dto: CreateVMDto) {
 *   // Endpoint protected with vSphere authentication
 * }
 * ```
 */
export declare const VSphereAuth: (scopes?: string[]) => MethodDecorator;
/**
 * 20. Decorator for OAuth2 with VMware Cloud Services.
 *
 * @param {string[]} [scopes] - Required OAuth2 scopes
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VMwareCloudAuth(['csp:org_member', 'vra:catalog_admin'])
 * async deployBlueprint(@Body() dto: DeploymentDto) {
 *   // Protected by VMware Cloud Services OAuth2
 * }
 * ```
 */
export declare const VMwareCloudAuth: (scopes?: string[]) => MethodDecorator;
/**
 * 21. Decorator for API key authentication.
 *
 * @param {string} headerName - API key header name
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ApiKeyAuth('X-API-Key')
 * async getMetrics(@Query() query: MetricsQueryDto) {
 *   // Protected by API key
 * }
 * ```
 */
export declare const ApiKeyAuth: (headerName?: string) => MethodDecorator;
/**
 * 22. Composite decorator for multi-factor authentication requirement.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @RequireMFA()
 * async deleteCluster(@Param('id') id: string) {
 *   // Critical operation requiring MFA
 * }
 * ```
 */
export declare const RequireMFA: () => MethodDecorator;
/**
 * 23. Decorator for role-based access control validation.
 *
 * @param {string[]} roles - Required roles
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @RequireRoles(['admin', 'infrastructure-admin'])
 * async configureCluster(@Body() config: ClusterConfigDto) {
 *   // Only admins can access
 * }
 * ```
 */
export declare const RequireRoles: (roles: string[]) => MethodDecorator;
/**
 * 24. Decorator for vSphere permission validation.
 *
 * @param {string[]} permissions - Required vSphere permissions
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * @RequireVSpherePermissions(['VirtualMachine.Config.AddNewDisk'])
 * async addDisk(@Param('vmId') id: string, @Body() disk: AddDiskDto) {
 *   // Validates vSphere permissions
 * }
 * ```
 */
export declare const RequireVSpherePermissions: (permissions: string[]) => MethodDecorator;
/**
 * 25. Decorator for rate limit documentation.
 *
 * @param {RateLimitDecoratorOptions} options - Rate limit options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @RateLimitDoc({ limit: 1000, window: '1 hour', tier: 'standard' })
 * async listVMs(@Query() query: ListVMsDto) {
 *   // Documents rate limits in API spec
 * }
 * ```
 */
export declare const RateLimitDoc: (options: RateLimitDecoratorOptions) => MethodDecorator;
/**
 * 26. Composite decorator for paginated endpoints.
 *
 * @param {PaginationDecoratorOptions} [options] - Pagination options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @PaginatedEndpoint({ defaultLimit: 20, maxLimit: 100 })
 * async listVMs(@Query() query: PaginationDto) {
 *   // Automatic pagination query docs
 * }
 * ```
 */
export declare const PaginatedEndpoint: (options?: PaginationDecoratorOptions) => MethodDecorator;
/**
 * 27. Decorator for search query parameter documentation.
 *
 * @param {string[]} searchableFields - Fields that can be searched
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @SearchableEndpoint(['name', 'guestOS', 'ipAddress'])
 * async searchVMs(@Query() query: SearchDto) {
 *   // Documents searchable fields
 * }
 * ```
 */
export declare const SearchableEndpoint: (searchableFields: string[]) => MethodDecorator;
/**
 * 28. Decorator for filterable endpoint documentation.
 *
 * @param {Record<string, string[]>} filters - Filter fields and allowed values
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @FilterableEndpoint({
 *   powerState: ['poweredOn', 'poweredOff', 'suspended'],
 *   guestOS: ['ubuntu64Guest', 'windows9Server64Guest']
 * })
 * async filterVMs(@Query() filters: VMFilterDto) {
 *   // Documents available filters
 * }
 * ```
 */
export declare const FilterableEndpoint: (filters: Record<string, string[]>) => MethodDecorator;
/**
 * 29. Decorator for date range filtering documentation.
 *
 * @param {string[]} dateFields - Date fields that support range filtering
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @DateRangeFilter(['createdAt', 'modifiedAt'])
 * async filterByDate(@Query() query: DateRangeDto) {
 *   // Documents date range query params
 * }
 * ```
 */
export declare const DateRangeFilter: (dateFields: string[]) => MethodDecorator;
/**
 * 30. Decorator for cursor-based pagination documentation.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @CursorPagination()
 * async listVMsCursor(@Query() query: CursorPaginationDto) {
 *   // Documents cursor-based pagination
 * }
 * ```
 */
export declare const CursorPagination: () => MethodDecorator;
/**
 * 31. Decorator for async operation responses (202 Accepted).
 *
 * @param {string} operation - Operation name
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @AsyncOperation('VM Clone')
 * async cloneVMAsync(@Param('id') id: string, @Body() dto: CloneVMDto) {
 *   // Returns task ID for tracking
 * }
 * ```
 */
export declare const AsyncOperation: (operation: string) => MethodDecorator;
/**
 * 32. Decorator for task status endpoint documentation.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @TaskStatusEndpoint()
 * async getTaskStatus(@Param('taskId') taskId: string) {
 *   // Documents task status response
 * }
 * ```
 */
export declare const TaskStatusEndpoint: () => MethodDecorator;
/**
 * 33. Decorator for long-running operation timeout documentation.
 *
 * @param {number} timeoutSeconds - Default timeout in seconds
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @LongRunningOperation(3600)
 * async migrateVM(@Body() dto: MigrationDto) {
 *   // Documents operation timeout
 * }
 * ```
 */
export declare const LongRunningOperation: (timeoutSeconds: number) => MethodDecorator;
/**
 * 34. Decorator for batch operation documentation.
 *
 * @param {string} operation - Batch operation name
 * @param {number} maxBatchSize - Maximum batch size
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @BatchOperation('VM Power On', 100)
 * async batchPowerOn(@Body() dto: BatchPowerOnDto) {
 *   // Documents batch constraints
 * }
 * ```
 */
export declare const BatchOperation: (operation: string, maxBatchSize: number) => MethodDecorator;
/**
 * 35. Decorator for scheduled task documentation.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ScheduledTaskEndpoint()
 * async createScheduledSnapshot(@Body() dto: ScheduledTaskDto) {
 *   // Documents scheduled task creation
 * }
 * ```
 */
export declare const ScheduledTaskEndpoint: () => MethodDecorator;
/**
 * 36. Decorator for API version documentation.
 *
 * @param {ApiVersionDecoratorOptions} options - Version options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ApiVersionDoc({ version: 'v2', deprecated: false })
 * @Controller('api/v2/virtual-machines')
 * export class VirtualMachinesV2Controller {
 *   // Controller with version metadata
 * }
 * ```
 */
export declare const ApiVersionDoc: (options: ApiVersionDecoratorOptions) => MethodDecorator;
/**
 * 37. Decorator for VMware vRealize Automation compatibility metadata.
 *
 * @param {boolean} compatible - vRA compatible
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VRealizeCompatible(true)
 * @Controller('api/v1/blueprints')
 * export class BlueprintsController {
 *   // vRealize Automation compatible endpoints
 * }
 * ```
 */
export declare const VRealizeCompatible: (compatible: boolean) => MethodDecorator;
/**
 * 38. Decorator for API capability discovery metadata.
 *
 * @param {string[]} capabilities - Supported capabilities
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ApiCapabilities(['vmotion', 'drs', 'ha', 'snapshots'])
 * async getCapabilities() {
 *   // Documents API capabilities
 * }
 * ```
 */
export declare const ApiCapabilities: (capabilities: string[]) => MethodDecorator;
/**
 * 39. Decorator for export/import format documentation.
 *
 * @param {string[]} formats - Supported export/import formats
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ExportFormats(['ova', 'ovf', 'vmdk'])
 * async exportVM(@Param('id') id: string, @Query('format') format: string) {
 *   // Documents supported export formats
 * }
 * ```
 */
export declare const ExportFormats: (formats: string[]) => MethodDecorator;
declare const _default: {
    VirtualMachineOperation: (operation: "create" | "read" | "update" | "delete" | "clone" | "snapshot" | "migrate" | "power", options?: SwaggerDecoratorOptions) => MethodDecorator;
    IsVMPowerState: typeof IsVMPowerState;
    IsVMwareVMId: typeof IsVMwareVMId;
    IsVMCPUCores: typeof IsVMCPUCores;
    IsVMMemoryMB: typeof IsVMMemoryMB;
    VirtualMachineResponses: (type: Type<any>) => MethodDecorator;
    ESXiHostOperation: (operation: "read" | "update" | "maintenance" | "reboot" | "shutdown", options?: SwaggerDecoratorOptions) => MethodDecorator;
    IsDatastoreId: typeof IsDatastoreId;
    IsClusterId: typeof IsClusterId;
    IsResourcePoolShares: typeof IsResourcePoolShares;
    ClusterOperation: (operation: "read" | "create" | "update" | "delete" | "configureDRS" | "configureHA") => MethodDecorator;
    IsVSphereMoRef: typeof IsVSphereMoRef;
    IsVLANId: typeof IsVLANId;
    IsVirtualNICType: typeof IsVirtualNICType;
    IsDiskProvisioningType: typeof IsDiskProvisioningType;
    VirtualNetworkOperation: (operation: "read" | "create" | "update" | "delete" | "createPortGroup" | "createvSwitch") => MethodDecorator;
    IsNSXSegmentType: typeof IsNSXSegmentType;
    IsStorageCapacityGB: typeof IsStorageCapacityGB;
    VSphereAuth: (scopes?: string[]) => MethodDecorator;
    VMwareCloudAuth: (scopes?: string[]) => MethodDecorator;
    ApiKeyAuth: (headerName?: string) => MethodDecorator;
    RequireMFA: () => MethodDecorator;
    RequireRoles: (roles: string[]) => MethodDecorator;
    RequireVSpherePermissions: (permissions: string[]) => MethodDecorator;
    RateLimitDoc: (options: RateLimitDecoratorOptions) => MethodDecorator;
    PaginatedEndpoint: (options?: PaginationDecoratorOptions) => MethodDecorator;
    SearchableEndpoint: (searchableFields: string[]) => MethodDecorator;
    FilterableEndpoint: (filters: Record<string, string[]>) => MethodDecorator;
    DateRangeFilter: (dateFields: string[]) => MethodDecorator;
    CursorPagination: () => MethodDecorator;
    AsyncOperation: (operation: string) => MethodDecorator;
    TaskStatusEndpoint: () => MethodDecorator;
    LongRunningOperation: (timeoutSeconds: number) => MethodDecorator;
    BatchOperation: (operation: string, maxBatchSize: number) => MethodDecorator;
    ScheduledTaskEndpoint: () => MethodDecorator;
    ApiVersionDoc: (options: ApiVersionDecoratorOptions) => MethodDecorator;
    VRealizeCompatible: (compatible: boolean) => MethodDecorator;
    ApiCapabilities: (capabilities: string[]) => MethodDecorator;
    ExportFormats: (formats: string[]) => MethodDecorator;
};
export default _default;
//# sourceMappingURL=virtual-swagger-decorators-kit.d.ts.map