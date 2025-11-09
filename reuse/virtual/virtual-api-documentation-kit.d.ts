/**
 * LOC: VIRTAPIDOC001
 * File: /reuse/virtual/virtual-api-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure API controllers
 *   - VMware vRealize API documentation
 *   - Hypervisor management API documentation
 */
/**
 * File: /reuse/virtual/virtual-api-documentation-kit.ts
 * Locator: WC-UTL-VIRTAPIDOC-001
 * Purpose: Comprehensive Virtual Infrastructure API Documentation Utilities - OpenAPI 3.0 schema generators for VMs, hypervisors, storage, networking
 *
 * Upstream: Independent utility module for virtual infrastructure API documentation
 * Downstream: ../backend/*, Virtual infrastructure controllers, VMware vRealize APIs, API documentation generators
 * Dependencies: TypeScript 5.x, @nestjs/swagger 7.x, Node 18+, OpenAPI 3.0+
 * Exports: 43 utility functions for OpenAPI schema generation, virtual infrastructure documentation, response builders, validation helpers
 *
 * LLM Context: Enterprise-grade virtual infrastructure API documentation utilities for generating production-ready OpenAPI 3.0
 * specifications compatible with VMware vRealize, vSphere, and enterprise hypervisor management systems. Provides comprehensive
 * schema builders, resource documentation, versioning strategies, rate limiting docs, and security scheme definitions essential
 * for scalable virtualization API infrastructure.
 */
import { Type } from '@nestjs/common';
/**
 * 1. Creates OpenAPI schema for virtual machine resource.
 *
 * @param {boolean} [includeMetrics] - Include performance metrics
 * @returns {Record<string, any>} VM schema object
 *
 * @example
 * ```typescript
 * const vmSchema = createVirtualMachineSchema(true);
 * // Returns comprehensive VM schema with CPU, memory, storage, network, and metrics
 * ```
 */
export declare const createVirtualMachineSchema: (includeMetrics?: boolean) => Record<string, any>;
/**
 * 2. Creates OpenAPI schema for VM power operations.
 *
 * @param {'start' | 'stop' | 'restart' | 'suspend' | 'reset'} operation - Power operation type
 * @returns {Record<string, any>} Power operation schema
 *
 * @example
 * ```typescript
 * const powerOpSchema = createVMPowerOperationSchema('start');
 * // Returns schema for VM power start operation with force and timeout options
 * ```
 */
export declare const createVMPowerOperationSchema: (operation: "start" | "stop" | "restart" | "suspend" | "reset") => Record<string, any>;
/**
 * 3. Creates OpenAPI schema for VM snapshot operations.
 *
 * @param {boolean} [includeMemory] - Include memory state in snapshot
 * @returns {Record<string, any>} Snapshot schema
 *
 * @example
 * ```typescript
 * const snapshotSchema = createVMSnapshotSchema(true);
 * // Returns snapshot schema with memory, disk, and quiesce options
 * ```
 */
export declare const createVMSnapshotSchema: (includeMemory?: boolean) => Record<string, any>;
/**
 * 4. Creates OpenAPI schema for VM clone operation.
 *
 * @param {boolean} [template] - Clone as template
 * @returns {Record<string, any>} Clone operation schema
 *
 * @example
 * ```typescript
 * const cloneSchema = createVMCloneSchema(false);
 * // Returns clone schema with target datastore, customization, and resource pool options
 * ```
 */
export declare const createVMCloneSchema: (template?: boolean) => Record<string, any>;
/**
 * 5. Creates OpenAPI schema for VM migration (vMotion) operation.
 *
 * @param {boolean} [storage] - Include storage migration
 * @returns {Record<string, any>} Migration schema
 *
 * @example
 * ```typescript
 * const migrationSchema = createVMMigrationSchema(true);
 * // Returns vMotion schema with host, datastore, and priority options
 * ```
 */
export declare const createVMMigrationSchema: (storage?: boolean) => Record<string, any>;
/**
 * 6. Creates OpenAPI schema for VM resource allocation.
 *
 * @returns {Record<string, any>} Resource allocation schema
 *
 * @example
 * ```typescript
 * const resourceSchema = createVMResourceAllocationSchema();
 * // Returns schema for CPU/memory shares, reservation, and limits
 * ```
 */
export declare const createVMResourceAllocationSchema: () => Record<string, any>;
/**
 * 7. Creates OpenAPI schema for VM guest OS customization.
 *
 * @param {'windows' | 'linux'} osType - Operating system type
 * @returns {Record<string, any>} Guest customization schema
 *
 * @example
 * ```typescript
 * const customizationSchema = createVMGuestCustomizationSchema('linux');
 * // Returns Linux-specific customization schema with network, hostname, timezone
 * ```
 */
export declare const createVMGuestCustomizationSchema: (osType: "windows" | "linux") => Record<string, any>;
/**
 * 8. Creates OpenAPI schema for VM console access.
 *
 * @param {'vnc' | 'rdp' | 'vmrc' | 'webmks'} protocol - Console protocol
 * @returns {Record<string, any>} Console access schema
 *
 * @example
 * ```typescript
 * const consoleSchema = createVMConsoleSchema('webmks');
 * // Returns WebMKS console connection schema with ticket and URL
 * ```
 */
export declare const createVMConsoleSchema: (protocol: "vnc" | "rdp" | "vmrc" | "webmks") => Record<string, any>;
/**
 * 9. Creates OpenAPI schema for ESXi host resource.
 *
 * @param {boolean} [includeHardware] - Include hardware details
 * @returns {Record<string, any>} ESXi host schema
 *
 * @example
 * ```typescript
 * const hostSchema = createHypervisorHostSchema(true);
 * // Returns comprehensive ESXi host schema with CPU, memory, storage, and hardware info
 * ```
 */
export declare const createHypervisorHostSchema: (includeHardware?: boolean) => Record<string, any>;
/**
 * 10. Creates OpenAPI schema for host maintenance mode operations.
 *
 * @returns {Record<string, any>} Maintenance mode schema
 *
 * @example
 * ```typescript
 * const maintenanceSchema = createHostMaintenanceModeSchema();
 * // Returns schema for entering/exiting maintenance mode with evacuation options
 * ```
 */
export declare const createHostMaintenanceModeSchema: () => Record<string, any>;
/**
 * 11. Creates OpenAPI schema for cluster resource.
 *
 * @param {boolean} [includeDRS] - Include DRS configuration
 * @param {boolean} [includeHA] - Include HA configuration
 * @returns {Record<string, any>} Cluster schema
 *
 * @example
 * ```typescript
 * const clusterSchema = createClusterSchema(true, true);
 * // Returns cluster schema with DRS, HA, and resource pool configuration
 * ```
 */
export declare const createClusterSchema: (includeDRS?: boolean, includeHA?: boolean) => Record<string, any>;
/**
 * 12. Creates OpenAPI schema for datastore resource.
 *
 * @param {'vmfs' | 'nfs' | 'vsan' | 'vvol'} type - Datastore type
 * @returns {Record<string, any>} Datastore schema
 *
 * @example
 * ```typescript
 * const datastoreSchema = createDatastoreSchema('vmfs');
 * // Returns VMFS datastore schema with capacity, provisioning, and performance metrics
 * ```
 */
export declare const createDatastoreSchema: (type: "vmfs" | "nfs" | "vsan" | "vvol") => Record<string, any>;
/**
 * 13. Creates OpenAPI schema for resource pool.
 *
 * @returns {Record<string, any>} Resource pool schema
 *
 * @example
 * ```typescript
 * const poolSchema = createResourcePoolSchema();
 * // Returns resource pool schema with CPU/memory allocation and limits
 * ```
 */
export declare const createResourcePoolSchema: () => Record<string, any>;
/**
 * 14. Creates OpenAPI schema for vCenter Server information.
 *
 * @returns {Record<string, any>} vCenter schema
 *
 * @example
 * ```typescript
 * const vcenterSchema = createVCenterSchema();
 * // Returns vCenter Server schema with version, build, and license info
 * ```
 */
export declare const createVCenterSchema: () => Record<string, any>;
/**
 * 15. Creates OpenAPI schema for virtual switch (vSwitch).
 *
 * @param {'standard' | 'distributed'} type - vSwitch type
 * @returns {Record<string, any>} vSwitch schema
 *
 * @example
 * ```typescript
 * const vswitchSchema = createVirtualSwitchSchema('distributed');
 * // Returns distributed vSwitch schema with port groups and uplinks
 * ```
 */
export declare const createVirtualSwitchSchema: (type: "standard" | "distributed") => Record<string, any>;
/**
 * 16. Creates OpenAPI schema for port group.
 *
 * @param {'standard' | 'distributed'} switchType - Parent switch type
 * @returns {Record<string, any>} Port group schema
 *
 * @example
 * ```typescript
 * const portGroupSchema = createPortGroupSchema('distributed');
 * // Returns distributed port group schema with VLAN, teaming, and security policies
 * ```
 */
export declare const createPortGroupSchema: (switchType: "standard" | "distributed") => Record<string, any>;
/**
 * 17. Creates OpenAPI schema for virtual NIC configuration.
 *
 * @param {'vmxnet3' | 'e1000' | 'e1000e' | 'vmxnet2'} adapterType - NIC adapter type
 * @returns {Record<string, any>} Virtual NIC schema
 *
 * @example
 * ```typescript
 * const vnicSchema = createVirtualNICSchema('vmxnet3');
 * // Returns vmxnet3 NIC schema with network, MAC, and connection settings
 * ```
 */
export declare const createVirtualNICSchema: (adapterType: "vmxnet3" | "e1000" | "e1000e" | "vmxnet2") => Record<string, any>;
/**
 * 18. Creates OpenAPI schema for NSX-T network configuration.
 *
 * @returns {Record<string, any>} NSX-T network schema
 *
 * @example
 * ```typescript
 * const nsxtSchema = createNSXNetworkSchema();
 * // Returns NSX-T logical switch schema with overlay configuration
 * ```
 */
export declare const createNSXNetworkSchema: () => Record<string, any>;
/**
 * 19. Creates OpenAPI schema for distributed firewall rule.
 *
 * @returns {Record<string, any>} DFW rule schema
 *
 * @example
 * ```typescript
 * const dfwRuleSchema = createDistributedFirewallRuleSchema();
 * // Returns NSX distributed firewall rule schema with source, destination, and services
 * ```
 */
export declare const createDistributedFirewallRuleSchema: () => Record<string, any>;
/**
 * 20. Creates OpenAPI schema for async task status.
 *
 * @returns {Record<string, any>} Task status schema
 *
 * @example
 * ```typescript
 * const taskSchema = createTaskStatusSchema();
 * // Returns async task schema with status, progress, and result tracking
 * ```
 */
export declare const createTaskStatusSchema: () => Record<string, any>;
/**
 * 21. Creates OpenAPI schema for task cancellation.
 *
 * @returns {Record<string, any>} Task cancel schema
 *
 * @example
 * ```typescript
 * const cancelSchema = createTaskCancelSchema();
 * // Returns task cancellation request schema
 * ```
 */
export declare const createTaskCancelSchema: () => Record<string, any>;
/**
 * 22. Creates OpenAPI schema for batch operation request.
 *
 * @param {string} operation - Operation type
 * @returns {Record<string, any>} Batch operation schema
 *
 * @example
 * ```typescript
 * const batchSchema = createBatchOperationSchema('powerOn');
 * // Returns batch VM power-on schema with multiple VM targets
 * ```
 */
export declare const createBatchOperationSchema: (operation: string) => Record<string, any>;
/**
 * 23. Creates OpenAPI schema for batch operation result.
 *
 * @returns {Record<string, any>} Batch result schema
 *
 * @example
 * ```typescript
 * const batchResultSchema = createBatchOperationResultSchema();
 * // Returns batch operation result with per-target status
 * ```
 */
export declare const createBatchOperationResultSchema: () => Record<string, any>;
/**
 * 24. Creates OpenAPI schema for scheduled task.
 *
 * @returns {Record<string, any>} Scheduled task schema
 *
 * @example
 * ```typescript
 * const scheduledTaskSchema = createScheduledTaskSchema();
 * // Returns scheduled task schema with cron expression and recurrence
 * ```
 */
export declare const createScheduledTaskSchema: () => Record<string, any>;
/**
 * 25. Creates OpenAPI schema for task history entry.
 *
 * @returns {Record<string, any>} Task history schema
 *
 * @example
 * ```typescript
 * const historySchema = createTaskHistorySchema();
 * // Returns task execution history schema with audit trail
 * ```
 */
export declare const createTaskHistorySchema: () => Record<string, any>;
/**
 * 26. Creates OpenAPI schema for API version information.
 *
 * @returns {Record<string, any>} Version info schema
 *
 * @example
 * ```typescript
 * const versionSchema = createApiVersionSchema();
 * // Returns API version schema with compatibility information
 * ```
 */
export declare const createApiVersionSchema: () => Record<string, any>;
/**
 * 27. Creates OpenAPI schema for API health check.
 *
 * @returns {Record<string, any>} Health check schema
 *
 * @example
 * ```typescript
 * const healthSchema = createApiHealthCheckSchema();
 * // Returns health check schema with component status
 * ```
 */
export declare const createApiHealthCheckSchema: () => Record<string, any>;
/**
 * 28. Creates OpenAPI schema for API rate limit information.
 *
 * @returns {Record<string, any>} Rate limit schema
 *
 * @example
 * ```typescript
 * const rateLimitSchema = createRateLimitSchema();
 * // Returns rate limit schema with tier limits and current usage
 * ```
 */
export declare const createRateLimitSchema: () => Record<string, any>;
/**
 * 29. Creates OpenAPI schema for API capability discovery.
 *
 * @returns {Record<string, any>} Capability schema
 *
 * @example
 * ```typescript
 * const capabilitySchema = createApiCapabilitySchema();
 * // Returns API capability schema listing supported operations and features
 * ```
 */
export declare const createApiCapabilitySchema: () => Record<string, any>;
/**
 * 30. Creates OpenAPI schema for API deprecation notice.
 *
 * @returns {Record<string, any>} Deprecation notice schema
 *
 * @example
 * ```typescript
 * const deprecationSchema = createApiDeprecationNoticeSchema();
 * // Returns deprecation notice with sunset date and migration path
 * ```
 */
export declare const createApiDeprecationNoticeSchema: () => Record<string, any>;
/**
 * 31. Creates OpenAPI schema for vRealize compatible API metadata.
 *
 * @returns {Record<string, any>} vRealize metadata schema
 *
 * @example
 * ```typescript
 * const vRealizeSchema = createVRealizeMetadataSchema();
 * // Returns vRealize API metadata for integration with vRA/vRO
 * ```
 */
export declare const createVRealizeMetadataSchema: () => Record<string, any>;
/**
 * 32. Creates OpenAPI schema for virtual infrastructure error response.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {Record<string, any>} Error response schema
 *
 * @example
 * ```typescript
 * const errorSchema = createVirtualErrorSchema(404);
 * // Returns 404 error schema with VMware-compatible error codes
 * ```
 */
export declare const createVirtualErrorSchema: (statusCode: number) => Record<string, any>;
/**
 * 33. Creates OpenAPI schema for validation error response.
 *
 * @returns {Record<string, any>} Validation error schema
 *
 * @example
 * ```typescript
 * const validationSchema = createValidationErrorSchema();
 * // Returns validation error schema with field-level errors
 * ```
 */
export declare const createValidationErrorSchema: () => Record<string, any>;
/**
 * 34. Creates OpenAPI schema for VMware fault response.
 *
 * @param {string} faultType - VMware fault type
 * @returns {Record<string, any>} VMware fault schema
 *
 * @example
 * ```typescript
 * const faultSchema = createVMwareFaultSchema('InvalidPowerState');
 * // Returns VMware InvalidPowerState fault schema
 * ```
 */
export declare const createVMwareFaultSchema: (faultType: string) => Record<string, any>;
/**
 * 35. Creates OpenAPI schema for resource quota exceeded error.
 *
 * @returns {Record<string, any>} Quota error schema
 *
 * @example
 * ```typescript
 * const quotaSchema = createResourceQuotaErrorSchema();
 * // Returns quota exceeded error with current usage and limits
 * ```
 */
export declare const createResourceQuotaErrorSchema: () => Record<string, any>;
/**
 * 36. Creates OpenAPI schema for concurrent modification error.
 *
 * @returns {Record<string, any>} Conflict error schema
 *
 * @example
 * ```typescript
 * const conflictSchema = createConcurrentModificationErrorSchema();
 * // Returns 409 conflict error for optimistic locking failures
 * ```
 */
export declare const createConcurrentModificationErrorSchema: () => Record<string, any>;
/**
 * 37. Creates OpenAPI schema for insufficient permissions error.
 *
 * @returns {Record<string, any>} Permission error schema
 *
 * @example
 * ```typescript
 * const permissionSchema = createInsufficientPermissionsErrorSchema();
 * // Returns 403 error with required permissions and current role
 * ```
 */
export declare const createInsufficientPermissionsErrorSchema: () => Record<string, any>;
/**
 * 38. Creates standard paginated response for virtual resources.
 *
 * @param {Type<any>} itemType - Resource item type
 * @param {string} description - Response description
 * @returns {Record<string, any>} Paginated response schema
 *
 * @example
 * ```typescript
 * const paginatedVMs = createVirtualPaginatedResponse(VirtualMachineDto, 'Paginated list of VMs');
 * ```
 */
export declare const createVirtualPaginatedResponse: (itemType: Type<any>, description: string) => Record<string, any>;
/**
 * 39. Creates async operation accepted response (202).
 *
 * @param {string} operation - Operation name
 * @returns {Record<string, any>} Accepted response schema
 *
 * @example
 * ```typescript
 * const acceptedResponse = createAsyncOperationAcceptedResponse('VM Clone');
 * // Returns 202 response with task tracking information
 * ```
 */
export declare const createAsyncOperationAcceptedResponse: (operation: string) => Record<string, any>;
/**
 * 40. Creates bulk operation response schema.
 *
 * @param {string} operation - Operation name
 * @returns {Record<string, any>} Bulk response schema
 *
 * @example
 * ```typescript
 * const bulkResponse = createBulkOperationResponse('VM Power On');
 * // Returns bulk operation result with per-item status
 * ```
 */
export declare const createBulkOperationResponse: (operation: string) => Record<string, any>;
/**
 * 41. Creates export operation response schema.
 *
 * @param {'ova' | 'ovf' | 'vmdk' | 'json'} format - Export format
 * @returns {Record<string, any>} Export response schema
 *
 * @example
 * ```typescript
 * const exportResponse = createExportOperationResponse('ova');
 * // Returns export response with download URL and expiration
 * ```
 */
export declare const createExportOperationResponse: (format: "ova" | "ovf" | "vmdk" | "json") => Record<string, any>;
/**
 * 42. Creates import validation response schema.
 *
 * @returns {Record<string, any>} Import validation schema
 *
 * @example
 * ```typescript
 * const importValidation = createImportValidationResponse();
 * // Returns import validation result with warnings and compatibility checks
 * ```
 */
export declare const createImportValidationResponse: () => Record<string, any>;
/**
 * 43. Creates metrics collection response schema.
 *
 * @param {string} metricType - Type of metrics
 * @returns {Record<string, any>} Metrics response schema
 *
 * @example
 * ```typescript
 * const metricsResponse = createMetricsCollectionResponse('performance');
 * // Returns time-series performance metrics with statistical aggregations
 * ```
 */
export declare const createMetricsCollectionResponse: (metricType: string) => Record<string, any>;
declare const _default: {
    createVirtualMachineSchema: (includeMetrics?: boolean) => Record<string, any>;
    createVMPowerOperationSchema: (operation: "start" | "stop" | "restart" | "suspend" | "reset") => Record<string, any>;
    createVMSnapshotSchema: (includeMemory?: boolean) => Record<string, any>;
    createVMCloneSchema: (template?: boolean) => Record<string, any>;
    createVMMigrationSchema: (storage?: boolean) => Record<string, any>;
    createVMResourceAllocationSchema: () => Record<string, any>;
    createVMGuestCustomizationSchema: (osType: "windows" | "linux") => Record<string, any>;
    createVMConsoleSchema: (protocol: "vnc" | "rdp" | "vmrc" | "webmks") => Record<string, any>;
    createHypervisorHostSchema: (includeHardware?: boolean) => Record<string, any>;
    createHostMaintenanceModeSchema: () => Record<string, any>;
    createClusterSchema: (includeDRS?: boolean, includeHA?: boolean) => Record<string, any>;
    createDatastoreSchema: (type: "vmfs" | "nfs" | "vsan" | "vvol") => Record<string, any>;
    createResourcePoolSchema: () => Record<string, any>;
    createVCenterSchema: () => Record<string, any>;
    createVirtualSwitchSchema: (type: "standard" | "distributed") => Record<string, any>;
    createPortGroupSchema: (switchType: "standard" | "distributed") => Record<string, any>;
    createVirtualNICSchema: (adapterType: "vmxnet3" | "e1000" | "e1000e" | "vmxnet2") => Record<string, any>;
    createNSXNetworkSchema: () => Record<string, any>;
    createDistributedFirewallRuleSchema: () => Record<string, any>;
    createTaskStatusSchema: () => Record<string, any>;
    createTaskCancelSchema: () => Record<string, any>;
    createBatchOperationSchema: (operation: string) => Record<string, any>;
    createBatchOperationResultSchema: () => Record<string, any>;
    createScheduledTaskSchema: () => Record<string, any>;
    createTaskHistorySchema: () => Record<string, any>;
    createApiVersionSchema: () => Record<string, any>;
    createApiHealthCheckSchema: () => Record<string, any>;
    createRateLimitSchema: () => Record<string, any>;
    createApiCapabilitySchema: () => Record<string, any>;
    createApiDeprecationNoticeSchema: () => Record<string, any>;
    createVRealizeMetadataSchema: () => Record<string, any>;
    createVirtualErrorSchema: (statusCode: number) => Record<string, any>;
    createValidationErrorSchema: () => Record<string, any>;
    createVMwareFaultSchema: (faultType: string) => Record<string, any>;
    createResourceQuotaErrorSchema: () => Record<string, any>;
    createConcurrentModificationErrorSchema: () => Record<string, any>;
    createInsufficientPermissionsErrorSchema: () => Record<string, any>;
    createVirtualPaginatedResponse: (itemType: Type<any>, description: string) => Record<string, any>;
    createAsyncOperationAcceptedResponse: (operation: string) => Record<string, any>;
    createBulkOperationResponse: (operation: string) => Record<string, any>;
    createExportOperationResponse: (format: "ova" | "ovf" | "vmdk" | "json") => Record<string, any>;
    createImportValidationResponse: () => Record<string, any>;
    createMetricsCollectionResponse: (metricType: string) => Record<string, any>;
};
export default _default;
//# sourceMappingURL=virtual-api-documentation-kit.d.ts.map