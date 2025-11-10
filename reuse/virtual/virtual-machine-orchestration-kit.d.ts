/**
 * LOC: V1M2O3R4C5
 * File: /reuse/virtual/virtual-machine-orchestration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - VM management modules
 *   - Orchestration services
 *   - Infrastructure provisioning
 *   - Resource allocation services
 */
/**
 * Virtual machine configuration
 */
export interface VMConfig {
    name: string;
    description?: string;
    cpuCores: number;
    memoryMB: number;
    diskSizeGB: number;
    osType: 'linux' | 'windows' | 'other';
    network?: VMNetworkConfig;
    storage?: VMStorageConfig;
    metadata?: Record<string, any>;
}
/**
 * VM network configuration
 */
export interface VMNetworkConfig {
    networkId: string;
    ipAddress?: string;
    subnetMask?: string;
    gateway?: string;
    dnsServers?: string[];
    vlanId?: number;
}
/**
 * VM storage configuration
 */
export interface VMStorageConfig {
    datastoreId: string;
    diskType: 'thin' | 'thick' | 'thick-eager';
    iops?: number;
    storagePolicy?: string;
}
/**
 * VM lifecycle state
 */
export type VMLifecycleState = 'provisioning' | 'running' | 'stopped' | 'suspended' | 'failed' | 'terminated' | 'migrating' | 'cloning';
/**
 * VM provisioning request
 */
export interface VMProvisioningRequest {
    templateId?: string;
    config: VMConfig;
    hostId?: string;
    clusterId?: string;
    autoStart?: boolean;
    tags?: string[];
    customization?: VMCustomization;
}
/**
 * VM customization options
 */
export interface VMCustomization {
    hostname?: string;
    domainName?: string;
    timezone?: string;
    script?: string;
    cloudInitData?: string;
}
/**
 * VM snapshot configuration
 */
export interface VMSnapshotConfig {
    name: string;
    description?: string;
    includeMemory?: boolean;
    quiesce?: boolean;
    retentionDays?: number;
}
/**
 * Resource allocation policy
 */
export interface ResourceAllocationPolicy {
    cpuReservationMHz?: number;
    cpuLimit?: number;
    cpuShares?: 'low' | 'normal' | 'high' | number;
    memoryReservationMB?: number;
    memoryLimit?: number;
    memoryShares?: 'low' | 'normal' | 'high' | number;
}
/**
 * VM placement constraints
 */
export interface VMPlacementConstraints {
    requireHostAffinity?: string[];
    requireHostAntiAffinity?: string[];
    requireDatastoreAffinity?: string[];
    requireDatastoreAntiAffinity?: string[];
    minimumCPU?: number;
    minimumMemory?: number;
    minimumStorage?: number;
}
/**
 * Host resource capacity
 */
export interface HostResourceCapacity {
    hostId: string;
    totalCPU: number;
    usedCPU: number;
    totalMemory: number;
    usedMemory: number;
    totalStorage: number;
    usedStorage: number;
    vmCount: number;
    healthScore: number;
}
/**
 * VM operation result
 */
export interface VMOperationResult {
    success: boolean;
    vmId?: string;
    message?: string;
    errors?: string[];
    auditTrail?: AuditEntry[];
}
/**
 * Audit entry for HIPAA compliance
 */
export interface AuditEntry {
    timestamp: Date;
    operation: string;
    userId: string;
    vmId?: string;
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * VM migration plan
 */
export interface VMMigrationPlan {
    vmId: string;
    sourceHostId: string;
    targetHostId: string;
    priority: 'low' | 'normal' | 'high';
    scheduledTime?: Date;
    validateOnly?: boolean;
}
/**
 * VM template definition
 */
export interface VMTemplate {
    id: string;
    name: string;
    description?: string;
    osType: string;
    baseConfig: VMConfig;
    customizationSpec?: VMCustomization;
    tags?: string[];
    isPublic?: boolean;
}
/**
 * VM clone specification
 */
export interface VMCloneSpec {
    sourceVMId?: string;
    sourceTemplateId?: string;
    targetName: string;
    linkedClone?: boolean;
    snapshotId?: string;
    customization?: VMCustomization;
    targetHostId?: string;
}
/**
 * Resource pool configuration
 */
export interface ResourcePoolConfig {
    name: string;
    cpuAllocation: ResourceAllocationPolicy;
    memoryAllocation: ResourceAllocationPolicy;
    parentPoolId?: string;
}
/**
 * Creates a new virtual machine with full configuration.
 * Handles provisioning, resource allocation, and initial setup.
 *
 * @param {VMProvisioningRequest} request - Provisioning request
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result with VM ID
 *
 * @example
 * ```typescript
 * const result = await createVirtualMachine({
 *   config: {
 *     name: 'web-server-01',
 *     cpuCores: 4,
 *     memoryMB: 8192,
 *     diskSizeGB: 100,
 *     osType: 'linux'
 *   },
 *   autoStart: true,
 *   tags: ['web', 'production']
 * }, 'user-123');
 * ```
 */
export declare function createVirtualMachine(request: VMProvisioningRequest, userId: string): Promise<VMOperationResult>;
/**
 * Starts a virtual machine.
 * Handles power-on operations with health checks.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await startVirtualMachine('vm-12345', 'user-123');
 * if (result.success) {
 *   console.log('VM started successfully');
 * }
 * ```
 */
export declare function startVirtualMachine(vmId: string, userId: string): Promise<VMOperationResult>;
/**
 * Stops a virtual machine gracefully.
 * Attempts graceful shutdown before forcing power-off.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {boolean} force - Force immediate power-off
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await stopVirtualMachine('vm-12345', false, 'user-123');
 * ```
 */
export declare function stopVirtualMachine(vmId: string, force: boolean, userId: string): Promise<VMOperationResult>;
/**
 * Restarts a virtual machine.
 * Performs graceful restart or hard reset.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {boolean} hard - Hard reset instead of graceful restart
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await restartVirtualMachine('vm-12345', false, 'user-123');
 * ```
 */
export declare function restartVirtualMachine(vmId: string, hard: boolean, userId: string): Promise<VMOperationResult>;
/**
 * Suspends a virtual machine to disk.
 * Saves VM state for later resumption.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await suspendVirtualMachine('vm-12345', 'user-123');
 * ```
 */
export declare function suspendVirtualMachine(vmId: string, userId: string): Promise<VMOperationResult>;
/**
 * Resumes a suspended virtual machine.
 * Restores VM from suspended state.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await resumeVirtualMachine('vm-12345', 'user-123');
 * ```
 */
export declare function resumeVirtualMachine(vmId: string, userId: string): Promise<VMOperationResult>;
/**
 * Terminates and deletes a virtual machine.
 * Permanently removes VM and associated resources.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {boolean} deleteDisks - Delete associated virtual disks
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await terminateVirtualMachine('vm-12345', true, 'user-123');
 * ```
 */
export declare function terminateVirtualMachine(vmId: string, deleteDisks: boolean, userId: string): Promise<VMOperationResult>;
/**
 * Gets current lifecycle state of a virtual machine.
 * Returns detailed state information.
 *
 * @param {string} vmId - Virtual machine ID
 * @returns {Promise<VMLifecycleState>} Current lifecycle state
 *
 * @example
 * ```typescript
 * const state = await getVMLifecycleState('vm-12345');
 * console.log(`VM is ${state}`);
 * ```
 */
export declare function getVMLifecycleState(vmId: string): Promise<VMLifecycleState>;
/**
 * Provisions multiple VMs from a template in batch.
 * Optimized for bulk provisioning operations.
 *
 * @param {string} templateId - Source template ID
 * @param {VMConfig[]} configs - Array of VM configurations
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult[]>} Array of operation results
 *
 * @example
 * ```typescript
 * const results = await batchProvisionFromTemplate('template-123', [
 *   { name: 'web-01', cpuCores: 2, memoryMB: 4096, diskSizeGB: 50, osType: 'linux' },
 *   { name: 'web-02', cpuCores: 2, memoryMB: 4096, diskSizeGB: 50, osType: 'linux' }
 * ], 'user-123');
 * ```
 */
export declare function batchProvisionFromTemplate(templateId: string, configs: VMConfig[], userId: string): Promise<VMOperationResult[]>;
/**
 * Provisions VM with automatic placement selection.
 * Uses intelligent placement algorithm to select optimal host.
 *
 * @param {VMConfig} config - VM configuration
 * @param {VMPlacementConstraints} constraints - Placement constraints
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await provisionWithAutoPlacement(config, {
 *   minimumCPU: 4000,
 *   minimumMemory: 8192,
 *   requireHostAntiAffinity: ['host-01']
 * }, 'user-123');
 * ```
 */
export declare function provisionWithAutoPlacement(config: VMConfig, constraints: VMPlacementConstraints, userId: string): Promise<VMOperationResult>;
/**
 * Provisions VM with custom resource allocation.
 * Applies specific resource policies during provisioning.
 *
 * @param {VMConfig} config - VM configuration
 * @param {ResourceAllocationPolicy} policy - Resource allocation policy
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await provisionWithResourcePolicy(config, {
 *   cpuReservationMHz: 2000,
 *   memoryReservationMB: 4096,
 *   cpuShares: 'high'
 * }, 'user-123');
 * ```
 */
export declare function provisionWithResourcePolicy(config: VMConfig, policy: ResourceAllocationPolicy, userId: string): Promise<VMOperationResult>;
/**
 * Validates VM provisioning request before execution.
 * Checks resource availability and constraint satisfaction.
 *
 * @param {VMProvisioningRequest} request - Provisioning request
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateProvisioningRequest(request);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateProvisioningRequest(request: VMProvisioningRequest): Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * Clones a virtual machine from source VM or template.
 * Supports full and linked clones.
 *
 * @param {VMCloneSpec} spec - Clone specification
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await cloneVirtualMachine({
 *   sourceVMId: 'vm-12345',
 *   targetName: 'vm-clone-01',
 *   linkedClone: false,
 *   customization: { hostname: 'clone-01' }
 * }, 'user-123');
 * ```
 */
export declare function cloneVirtualMachine(spec: VMCloneSpec, userId: string): Promise<VMOperationResult>;
/**
 * Creates linked clone from snapshot.
 * Space-efficient cloning using COW (copy-on-write).
 *
 * @param {string} sourceVMId - Source VM ID
 * @param {string} snapshotId - Snapshot ID
 * @param {string} targetName - Target VM name
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await createLinkedClone(
 *   'vm-12345',
 *   'snapshot-67890',
 *   'linked-clone-01',
 *   'user-123'
 * );
 * ```
 */
export declare function createLinkedClone(sourceVMId: string, snapshotId: string, targetName: string, userId: string): Promise<VMOperationResult>;
/**
 * Batch clones multiple VMs from a single source.
 * Optimized for creating multiple clones simultaneously.
 *
 * @param {string} sourceVMId - Source VM ID
 * @param {string[]} targetNames - Array of target VM names
 * @param {boolean} linkedClone - Create linked clones
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult[]>} Array of operation results
 *
 * @example
 * ```typescript
 * const results = await batchCloneVMs(
 *   'vm-12345',
 *   ['clone-01', 'clone-02', 'clone-03'],
 *   false,
 *   'user-123'
 * );
 * ```
 */
export declare function batchCloneVMs(sourceVMId: string, targetNames: string[], linkedClone: boolean, userId: string): Promise<VMOperationResult[]>;
/**
 * Creates VM template from existing virtual machine.
 * Converts VM to reusable template.
 *
 * @param {string} vmId - Source VM ID
 * @param {string} templateName - Template name
 * @param {string} description - Template description
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result with template ID
 *
 * @example
 * ```typescript
 * const result = await createVMTemplate(
 *   'vm-12345',
 *   'ubuntu-22.04-base',
 *   'Ubuntu 22.04 LTS base template',
 *   'user-123'
 * );
 * ```
 */
export declare function createVMTemplate(vmId: string, templateName: string, description: string, userId: string): Promise<VMOperationResult>;
/**
 * Updates VM template configuration.
 * Modifies template settings and metadata.
 *
 * @param {string} templateId - Template ID
 * @param {Partial<VMTemplate>} updates - Template updates
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await updateVMTemplate('template-123', {
 *   description: 'Updated base template',
 *   tags: ['linux', 'ubuntu', 'base']
 * }, 'user-123');
 * ```
 */
export declare function updateVMTemplate(templateId: string, updates: Partial<VMTemplate>, userId: string): Promise<VMOperationResult>;
/**
 * Deletes VM template.
 * Removes template from library.
 *
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await deleteVMTemplate('template-123', 'user-123');
 * ```
 */
export declare function deleteVMTemplate(templateId: string, userId: string): Promise<VMOperationResult>;
/**
 * Lists available VM templates with filtering.
 * Retrieves templates based on criteria.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<VMTemplate[]>} Array of templates
 *
 * @example
 * ```typescript
 * const templates = await listVMTemplates({
 *   osType: 'linux',
 *   tags: ['production']
 * });
 * ```
 */
export declare function listVMTemplates(filters?: {
    osType?: string;
    tags?: string[];
    isPublic?: boolean;
}): Promise<VMTemplate[]>;
/**
 * Creates snapshot of virtual machine.
 * Captures current VM state for backup or cloning.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {VMSnapshotConfig} config - Snapshot configuration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result with snapshot ID
 *
 * @example
 * ```typescript
 * const result = await createVMSnapshot('vm-12345', {
 *   name: 'pre-upgrade-snapshot',
 *   description: 'Snapshot before system upgrade',
 *   includeMemory: true,
 *   quiesce: true
 * }, 'user-123');
 * ```
 */
export declare function createVMSnapshot(vmId: string, config: VMSnapshotConfig, userId: string): Promise<VMOperationResult>;
/**
 * Reverts VM to previous snapshot.
 * Restores VM to snapshot state.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} snapshotId - Snapshot ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await revertToSnapshot(
 *   'vm-12345',
 *   'snapshot-67890',
 *   'user-123'
 * );
 * ```
 */
export declare function revertToSnapshot(vmId: string, snapshotId: string, userId: string): Promise<VMOperationResult>;
/**
 * Deletes VM snapshot.
 * Removes snapshot and consolidates disks.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} snapshotId - Snapshot ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await deleteVMSnapshot('vm-12345', 'snapshot-67890', 'user-123');
 * ```
 */
export declare function deleteVMSnapshot(vmId: string, snapshotId: string, userId: string): Promise<VMOperationResult>;
/**
 * Consolidates all snapshots for a VM.
 * Merges snapshot chain to improve performance.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await consolidateVMSnapshots('vm-12345', 'user-123');
 * ```
 */
export declare function consolidateVMSnapshots(vmId: string, userId: string): Promise<VMOperationResult>;
/**
 * Applies resource allocation policy to VM.
 * Configures CPU and memory reservations, limits, and shares.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {ResourceAllocationPolicy} policy - Resource allocation policy
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await applyResourceAllocation('vm-12345', {
 *   cpuReservationMHz: 2000,
 *   cpuLimit: 4000,
 *   cpuShares: 'high',
 *   memoryReservationMB: 4096,
 *   memoryShares: 'normal'
 * }, 'user-123');
 * ```
 */
export declare function applyResourceAllocation(vmId: string, policy: ResourceAllocationPolicy, userId: string): Promise<VMOperationResult>;
/**
 * Reconfigures VM hardware resources.
 * Hot-add/remove CPU and memory if supported.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {Partial<VMConfig>} newConfig - New resource configuration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await reconfigureVMResources('vm-12345', {
 *   cpuCores: 8,
 *   memoryMB: 16384
 * }, 'user-123');
 * ```
 */
export declare function reconfigureVMResources(vmId: string, newConfig: Partial<VMConfig>, userId: string): Promise<VMOperationResult>;
/**
 * Gets current resource utilization for VM.
 * Returns real-time CPU, memory, disk, and network metrics.
 *
 * @param {string} vmId - Virtual machine ID
 * @returns {Promise<object>} Resource utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await getVMResourceUtilization('vm-12345');
 * console.log(`CPU: ${metrics.cpuUsagePercent}%`);
 * ```
 */
export declare function getVMResourceUtilization(vmId: string): Promise<{
    cpuUsagePercent: number;
    memoryUsageMB: number;
    memoryUsagePercent: number;
    diskIOPS: number;
    networkMbps: number;
    timestamp: Date;
}>;
/**
 * Creates resource pool for VM grouping.
 * Configures hierarchical resource management.
 *
 * @param {ResourcePoolConfig} config - Resource pool configuration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result with pool ID
 *
 * @example
 * ```typescript
 * const result = await createResourcePool({
 *   name: 'production-vms',
 *   cpuAllocation: { cpuShares: 'high', cpuReservationMHz: 10000 },
 *   memoryAllocation: { memoryShares: 'high', memoryReservationMB: 32768 }
 * }, 'user-123');
 * ```
 */
export declare function createResourcePool(config: ResourcePoolConfig, userId: string): Promise<VMOperationResult>;
/**
 * Calculates optimal host placement for VM.
 * Uses weighted scoring algorithm considering multiple factors.
 *
 * @param {VMConfig} config - VM configuration
 * @param {VMPlacementConstraints} constraints - Placement constraints
 * @returns {Promise<string>} Optimal host ID
 *
 * @example
 * ```typescript
 * const hostId = await calculateOptimalPlacement(vmConfig, {
 *   minimumCPU: 4000,
 *   minimumMemory: 8192,
 *   requireHostAntiAffinity: ['host-01']
 * });
 * ```
 */
export declare function calculateOptimalPlacement(config: VMConfig, constraints: VMPlacementConstraints): Promise<string>;
/**
 * Balances VMs across hosts for optimal resource distribution.
 * Recommends migration operations to improve balance.
 *
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<VMMigrationPlan[]>} Recommended migration plans
 *
 * @example
 * ```typescript
 * const migrations = await balanceVMsAcrossHosts('cluster-123');
 * console.log(`${migrations.length} migrations recommended`);
 * ```
 */
export declare function balanceVMsAcrossHosts(clusterId: string): Promise<VMMigrationPlan[]>;
/**
 * Finds hosts with sufficient capacity for VM.
 * Returns sorted list by available resources.
 *
 * @param {VMConfig} config - VM configuration
 * @returns {Promise<HostResourceCapacity[]>} Available hosts
 *
 * @example
 * ```typescript
 * const hosts = await findHostsWithCapacity({
 *   cpuCores: 4,
 *   memoryMB: 8192,
 *   diskSizeGB: 100,
 *   osType: 'linux'
 * });
 * ```
 */
export declare function findHostsWithCapacity(config: VMConfig): Promise<HostResourceCapacity[]>;
/**
 * Migrates VM to different host (live or cold migration).
 * Supports vMotion-style live migration.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} targetHostId - Target host ID
 * @param {boolean} live - Perform live migration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await migrateVM('vm-12345', 'host-02', true, 'user-123');
 * ```
 */
export declare function migrateVM(vmId: string, targetHostId: string, live: boolean, userId: string): Promise<VMOperationResult>;
/**
 * Attaches virtual disk to VM.
 * Adds additional storage to existing VM.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {number} sizeGB - Disk size in GB
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result with disk ID
 *
 * @example
 * ```typescript
 * const result = await attachVirtualDisk('vm-12345', 500, 'user-123');
 * ```
 */
export declare function attachVirtualDisk(vmId: string, sizeGB: number, userId: string): Promise<VMOperationResult>;
/**
 * Detaches virtual disk from VM.
 * Removes disk without deleting data.
 *
 * @param {string} vmId - Virtual machine ID
 * @param {string} diskId - Disk ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await detachVirtualDisk('vm-12345', 'disk-67890', 'user-123');
 * ```
 */
export declare function detachVirtualDisk(vmId: string, diskId: string, userId: string): Promise<VMOperationResult>;
/**
 * Extends virtual disk size.
 * Increases disk capacity without downtime.
 *
 * @param {string} diskId - Disk ID
 * @param {number} newSizeGB - New size in GB
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<VMOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await extendVirtualDisk('disk-67890', 1000, 'user-123');
 * ```
 */
export declare function extendVirtualDisk(diskId: string, newSizeGB: number, userId: string): Promise<VMOperationResult>;
declare const _default: {
    createVirtualMachine: typeof createVirtualMachine;
    startVirtualMachine: typeof startVirtualMachine;
    stopVirtualMachine: typeof stopVirtualMachine;
    restartVirtualMachine: typeof restartVirtualMachine;
    suspendVirtualMachine: typeof suspendVirtualMachine;
    resumeVirtualMachine: typeof resumeVirtualMachine;
    terminateVirtualMachine: typeof terminateVirtualMachine;
    getVMLifecycleState: typeof getVMLifecycleState;
    batchProvisionFromTemplate: typeof batchProvisionFromTemplate;
    provisionWithAutoPlacement: typeof provisionWithAutoPlacement;
    provisionWithResourcePolicy: typeof provisionWithResourcePolicy;
    validateProvisioningRequest: typeof validateProvisioningRequest;
    cloneVirtualMachine: typeof cloneVirtualMachine;
    createLinkedClone: typeof createLinkedClone;
    batchCloneVMs: typeof batchCloneVMs;
    createVMTemplate: typeof createVMTemplate;
    updateVMTemplate: typeof updateVMTemplate;
    deleteVMTemplate: typeof deleteVMTemplate;
    listVMTemplates: typeof listVMTemplates;
    createVMSnapshot: typeof createVMSnapshot;
    revertToSnapshot: typeof revertToSnapshot;
    deleteVMSnapshot: typeof deleteVMSnapshot;
    consolidateVMSnapshots: typeof consolidateVMSnapshots;
    applyResourceAllocation: typeof applyResourceAllocation;
    reconfigureVMResources: typeof reconfigureVMResources;
    getVMResourceUtilization: typeof getVMResourceUtilization;
    createResourcePool: typeof createResourcePool;
    calculateOptimalPlacement: typeof calculateOptimalPlacement;
    balanceVMsAcrossHosts: typeof balanceVMsAcrossHosts;
    findHostsWithCapacity: typeof findHostsWithCapacity;
    migrateVM: typeof migrateVM;
    attachVirtualDisk: typeof attachVirtualDisk;
    detachVirtualDisk: typeof detachVirtualDisk;
    extendVirtualDisk: typeof extendVirtualDisk;
};
export default _default;
//# sourceMappingURL=virtual-machine-orchestration-kit.d.ts.map