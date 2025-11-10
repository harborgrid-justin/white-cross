/**
 * LOC: VRT-COMPUTE-001
 * File: /reuse/virtual/virtual-compute-services-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - vmware-vrealize-sdk
 *   - vsphere-client-lib
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure modules
 *   - VM provisioning services
 *   - Capacity management modules
 *   - Performance monitoring services
 */
interface VMProvisionConfig {
    name: string;
    template?: string;
    cpuCount: number;
    memoryMB: number;
    diskGB: number;
    networkName: string;
    datastore?: string;
    resourcePool?: string;
    folder?: string;
    guestOS?: string;
    customization?: VMCustomizationSpec;
}
interface VMCustomizationSpec {
    hostname?: string;
    domain?: string;
    dnsServers?: string[];
    gateway?: string;
    ipAddress?: string;
    subnetMask?: string;
    timezone?: string;
    adminPassword?: string;
}
interface VMPowerState {
    vmId: string;
    state: 'poweredOn' | 'poweredOff' | 'suspended';
    timestamp: Date;
    uptime?: number;
}
interface VMResourceAllocation {
    vmId: string;
    cpu: ResourceConfig;
    memory: ResourceConfig;
    disk: DiskResourceConfig[];
    network: NetworkResourceConfig[];
}
interface ResourceConfig {
    reserved: number;
    limit: number;
    shares: 'low' | 'normal' | 'high' | 'custom';
    expandable?: boolean;
}
interface DiskResourceConfig {
    label: string;
    capacityGB: number;
    thin?: boolean;
    datastore: string;
    iops?: number;
}
interface NetworkResourceConfig {
    label: string;
    networkName: string;
    macAddress?: string;
    connected: boolean;
    type: 'e1000' | 'vmxnet3' | 'e1000e';
}
interface VMPerformanceMetrics {
    vmId: string;
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    diskReadMBps: number;
    diskWriteMBps: number;
    networkInMbps: number;
    networkOutMbps: number;
    timestamp: Date;
}
interface CapacityAnalysis {
    clusterId: string;
    totalCPU: number;
    totalMemoryMB: number;
    totalStorageGB: number;
    usedCPU: number;
    usedMemoryMB: number;
    usedStorageGB: number;
    availableVMs: number;
    projectedGrowth?: number;
}
interface SnapshotConfig {
    vmId: string;
    name: string;
    description?: string;
    includeMemory: boolean;
    quiesce: boolean;
    retentionDays?: number;
}
interface VMSnapshot {
    id: string;
    vmId: string;
    name: string;
    description?: string;
    createdAt: Date;
    sizeMB: number;
    state: string;
}
interface VMCloneConfig {
    sourceVMId: string;
    name: string;
    linked?: boolean;
    snapshot?: string;
    customization?: VMCustomizationSpec;
    targetDatastore?: string;
    targetHost?: string;
}
interface DRSRecommendation {
    vmId: string;
    sourceHost: string;
    targetHost: string;
    reason: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimatedImprovement: number;
}
interface VMotionConfig {
    vmId: string;
    targetHost: string;
    priority: 'high' | 'normal' | 'low';
    migrateStorage?: boolean;
    targetDatastore?: string;
}
interface HAConfig {
    vmId: string;
    restartPriority: 'disabled' | 'low' | 'medium' | 'high';
    isolationResponse: 'none' | 'powerOff' | 'shutdown';
    vmMonitoring: boolean;
    monitoringInterval?: number;
}
interface HostAffinity {
    vmId: string;
    affinityHosts: string[];
    antiAffinityHosts: string[];
    mandatory: boolean;
}
/**
 * Provisions a new virtual machine from template or scratch.
 *
 * @param {VMProvisionConfig} config - VM provisioning configuration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<string>} New VM identifier
 *
 * @example
 * ```typescript
 * const vmId = await provisionVirtualMachine({
 *   name: 'patient-db-01',
 *   template: 'ubuntu-20.04-template',
 *   cpuCount: 4,
 *   memoryMB: 8192,
 *   diskGB: 100,
 *   networkName: 'production-vlan-100',
 *   customization: {
 *     hostname: 'patient-db-01',
 *     ipAddress: '10.10.100.50',
 *     gateway: '10.10.100.1'
 *   }
 * }, 'admin-user-123');
 * ```
 */
export declare const provisionVirtualMachine: (config: VMProvisionConfig, userId: string) => Promise<string>;
/**
 * Provisions multiple VMs in bulk with parallel execution.
 *
 * @param {VMProvisionConfig[]} configs - Array of VM configurations
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<string[]>} Array of VM identifiers
 *
 * @example
 * ```typescript
 * const vmIds = await bulkProvisionVMs([
 *   { name: 'app-server-01', cpuCount: 2, memoryMB: 4096, diskGB: 50, networkName: 'app-vlan' },
 *   { name: 'app-server-02', cpuCount: 2, memoryMB: 4096, diskGB: 50, networkName: 'app-vlan' }
 * ], 'admin-123');
 * ```
 */
export declare const bulkProvisionVMs: (configs: VMProvisionConfig[], userId: string) => Promise<string[]>;
/**
 * Deploys VM from pre-configured template with customization.
 *
 * @param {string} templateId - Template identifier
 * @param {string} vmName - New VM name
 * @param {VMCustomizationSpec} customization - Customization specification
 * @returns {Promise<string>} Deployed VM ID
 *
 * @example
 * ```typescript
 * const vmId = await deployVMFromTemplate(
 *   'template-ubuntu-2004',
 *   'web-server-03',
 *   { hostname: 'web03', ipAddress: '10.10.200.53' }
 * );
 * ```
 */
export declare const deployVMFromTemplate: (templateId: string, vmName: string, customization?: VMCustomizationSpec) => Promise<string>;
/**
 * Creates VM with advanced resource configurations.
 *
 * @param {VMProvisionConfig} config - Provision configuration
 * @param {VMResourceAllocation} resources - Resource allocation details
 * @returns {Promise<string>} VM identifier
 *
 * @example
 * ```typescript
 * const vmId = await createVMWithResources(
 *   { name: 'db-server', cpuCount: 8, memoryMB: 32768, diskGB: 500, networkName: 'db-vlan' },
 *   { cpu: { reserved: 4000, limit: 8000, shares: 'high' } }
 * );
 * ```
 */
export declare const createVMWithResources: (config: VMProvisionConfig, resources: Partial<VMResourceAllocation>) => Promise<string>;
/**
 * Provisions VM with automated resource pool assignment.
 *
 * @param {VMProvisionConfig} config - VM configuration
 * @param {string} poolName - Resource pool name
 * @returns {Promise<string>} VM identifier
 *
 * @example
 * ```typescript
 * const vmId = await provisionVMToResourcePool(
 *   { name: 'patient-app-01', cpuCount: 4, memoryMB: 8192, diskGB: 100, networkName: 'app-vlan' },
 *   'production-pool'
 * );
 * ```
 */
export declare const provisionVMToResourcePool: (config: VMProvisionConfig, poolName: string) => Promise<string>;
/**
 * Powers on a virtual machine.
 *
 * @param {string} vmId - VM identifier
 * @returns {Promise<VMPowerState>} Power state after operation
 *
 * @example
 * ```typescript
 * const state = await powerOnVM('vm-12345');
 * console.log('VM powered on:', state.state);
 * ```
 */
export declare const powerOnVM: (vmId: string) => Promise<VMPowerState>;
/**
 * Powers off a virtual machine gracefully or forcefully.
 *
 * @param {string} vmId - VM identifier
 * @param {boolean} [force=false] - Force power off without guest shutdown
 * @returns {Promise<VMPowerState>} Power state after operation
 *
 * @example
 * ```typescript
 * const state = await powerOffVM('vm-12345', false); // Graceful shutdown
 * ```
 */
export declare const powerOffVM: (vmId: string, force?: boolean) => Promise<VMPowerState>;
/**
 * Restarts a virtual machine with optional guest tools coordination.
 *
 * @param {string} vmId - VM identifier
 * @param {boolean} [graceful=true] - Use guest tools for graceful restart
 * @returns {Promise<VMPowerState>} Power state after operation
 *
 * @example
 * ```typescript
 * const state = await restartVM('vm-12345', true);
 * ```
 */
export declare const restartVM: (vmId: string, graceful?: boolean) => Promise<VMPowerState>;
/**
 * Suspends a virtual machine to disk.
 *
 * @param {string} vmId - VM identifier
 * @returns {Promise<VMPowerState>} Power state after operation
 *
 * @example
 * ```typescript
 * const state = await suspendVM('vm-12345');
 * ```
 */
export declare const suspendVM: (vmId: string) => Promise<VMPowerState>;
/**
 * Gets current power state of a VM.
 *
 * @param {string} vmId - VM identifier
 * @returns {Promise<VMPowerState>} Current power state
 *
 * @example
 * ```typescript
 * const state = await getVMPowerState('vm-12345');
 * console.log('Current state:', state.state);
 * ```
 */
export declare const getVMPowerState: (vmId: string) => Promise<VMPowerState>;
/**
 * Performs bulk power operations on multiple VMs.
 *
 * @param {string[]} vmIds - Array of VM identifiers
 * @param {'on' | 'off' | 'restart'} operation - Power operation
 * @returns {Promise<VMPowerState[]>} Array of power states
 *
 * @example
 * ```typescript
 * const states = await bulkPowerOperation(['vm-001', 'vm-002'], 'on');
 * ```
 */
export declare const bulkPowerOperation: (vmIds: string[], operation: "on" | "off" | "restart") => Promise<VMPowerState[]>;
/**
 * Configures CPU and memory resource allocation for VM.
 *
 * @param {string} vmId - VM identifier
 * @param {Partial<VMResourceAllocation>} resources - Resource configuration
 * @returns {Promise<VMResourceAllocation>} Updated resource allocation
 *
 * @example
 * ```typescript
 * const allocation = await configureVMResources('vm-12345', {
 *   cpu: { reserved: 2000, limit: 4000, shares: 'high' },
 *   memory: { reserved: 4096, limit: 8192, shares: 'normal' }
 * });
 * ```
 */
export declare const configureVMResources: (vmId: string, resources: Partial<VMResourceAllocation>) => Promise<VMResourceAllocation>;
/**
 * Adds additional disk to existing VM.
 *
 * @param {string} vmId - VM identifier
 * @param {DiskResourceConfig} diskConfig - Disk configuration
 * @returns {Promise<string>} Disk identifier
 *
 * @example
 * ```typescript
 * const diskId = await addVMDisk('vm-12345', {
 *   label: 'data-disk-01',
 *   capacityGB: 500,
 *   thin: true,
 *   datastore: 'datastore-ssd-01'
 * });
 * ```
 */
export declare const addVMDisk: (vmId: string, diskConfig: DiskResourceConfig) => Promise<string>;
/**
 * Expands existing VM disk capacity.
 *
 * @param {string} vmId - VM identifier
 * @param {string} diskLabel - Disk label
 * @param {number} newCapacityGB - New capacity in GB
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await expandVMDisk('vm-12345', 'Hard disk 1', 200);
 * ```
 */
export declare const expandVMDisk: (vmId: string, diskLabel: string, newCapacityGB: number) => Promise<void>;
/**
 * Adds network adapter to VM.
 *
 * @param {string} vmId - VM identifier
 * @param {NetworkResourceConfig} networkConfig - Network configuration
 * @returns {Promise<string>} Network adapter identifier
 *
 * @example
 * ```typescript
 * const adapterId = await addVMNetworkAdapter('vm-12345', {
 *   label: 'Network adapter 2',
 *   networkName: 'backup-vlan',
 *   connected: true,
 *   type: 'vmxnet3'
 * });
 * ```
 */
export declare const addVMNetworkAdapter: (vmId: string, networkConfig: NetworkResourceConfig) => Promise<string>;
/**
 * Modifies CPU count for a VM.
 *
 * @param {string} vmId - VM identifier
 * @param {number} cpuCount - New CPU count
 * @param {boolean} [hotAdd=false] - Hot add CPUs without reboot
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await modifyVMCPUCount('vm-12345', 8, true);
 * ```
 */
export declare const modifyVMCPUCount: (vmId: string, cpuCount: number, hotAdd?: boolean) => Promise<void>;
/**
 * Modifies memory size for a VM.
 *
 * @param {string} vmId - VM identifier
 * @param {number} memoryMB - New memory in MB
 * @param {boolean} [hotAdd=false] - Hot add memory without reboot
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await modifyVMMemory('vm-12345', 16384, true);
 * ```
 */
export declare const modifyVMMemory: (vmId: string, memoryMB: number, hotAdd?: boolean) => Promise<void>;
/**
 * Retrieves real-time performance metrics for a VM.
 *
 * @param {string} vmId - VM identifier
 * @returns {Promise<VMPerformanceMetrics>} Current performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getVMPerformanceMetrics('vm-12345');
 * console.log('CPU Usage:', metrics.cpuUsagePercent);
 * ```
 */
export declare const getVMPerformanceMetrics: (vmId: string) => Promise<VMPerformanceMetrics>;
/**
 * Monitors VM performance over time period.
 *
 * @param {string} vmId - VM identifier
 * @param {number} durationMinutes - Monitoring duration in minutes
 * @param {number} intervalSeconds - Sample interval in seconds
 * @returns {Promise<VMPerformanceMetrics[]>} Array of performance samples
 *
 * @example
 * ```typescript
 * const samples = await monitorVMPerformance('vm-12345', 60, 30);
 * ```
 */
export declare const monitorVMPerformance: (vmId: string, durationMinutes: number, intervalSeconds?: number) => Promise<VMPerformanceMetrics[]>;
/**
 * Gets aggregated performance statistics for multiple VMs.
 *
 * @param {string[]} vmIds - Array of VM identifiers
 * @returns {Promise<Map<string, VMPerformanceMetrics>>} Performance metrics by VM ID
 *
 * @example
 * ```typescript
 * const stats = await getMultiVMPerformance(['vm-001', 'vm-002', 'vm-003']);
 * ```
 */
export declare const getMultiVMPerformance: (vmIds: string[]) => Promise<Map<string, VMPerformanceMetrics>>;
/**
 * Analyzes VM performance and generates recommendations.
 *
 * @param {string} vmId - VM identifier
 * @param {number} analysisDays - Days of historical data to analyze
 * @returns {Promise<string[]>} Performance optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await analyzeVMPerformance('vm-12345', 7);
 * ```
 */
export declare const analyzeVMPerformance: (vmId: string, analysisDays?: number) => Promise<string[]>;
/**
 * Analyzes cluster capacity and resource availability.
 *
 * @param {string} clusterId - Cluster identifier
 * @returns {Promise<CapacityAnalysis>} Capacity analysis results
 *
 * @example
 * ```typescript
 * const capacity = await analyzeClusterCapacity('cluster-prod-01');
 * console.log('Available VMs:', capacity.availableVMs);
 * ```
 */
export declare const analyzeClusterCapacity: (clusterId: string) => Promise<CapacityAnalysis>;
/**
 * Calculates resource requirements for VM provisioning.
 *
 * @param {VMProvisionConfig} config - Planned VM configuration
 * @param {string} clusterId - Target cluster ID
 * @returns {Promise<boolean>} True if resources are available
 *
 * @example
 * ```typescript
 * const canProvision = await checkResourceAvailability(vmConfig, 'cluster-01');
 * ```
 */
export declare const checkResourceAvailability: (config: VMProvisionConfig, clusterId: string) => Promise<boolean>;
/**
 * Predicts future capacity needs based on growth trends.
 *
 * @param {string} clusterId - Cluster identifier
 * @param {number} monthsAhead - Months to project
 * @returns {Promise<CapacityAnalysis>} Projected capacity
 *
 * @example
 * ```typescript
 * const projection = await predictCapacityNeeds('cluster-01', 6);
 * ```
 */
export declare const predictCapacityNeeds: (clusterId: string, monthsAhead: number) => Promise<CapacityAnalysis>;
/**
 * Optimizes resource allocation across cluster.
 *
 * @param {string} clusterId - Cluster identifier
 * @returns {Promise<DRSRecommendation[]>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await optimizeClusterResources('cluster-01');
 * ```
 */
export declare const optimizeClusterResources: (clusterId: string) => Promise<DRSRecommendation[]>;
/**
 * Creates a VM snapshot.
 *
 * @param {SnapshotConfig} config - Snapshot configuration
 * @returns {Promise<VMSnapshot>} Created snapshot details
 *
 * @example
 * ```typescript
 * const snapshot = await createVMSnapshot({
 *   vmId: 'vm-12345',
 *   name: 'pre-upgrade-snapshot',
 *   description: 'Before application upgrade',
 *   includeMemory: true,
 *   quiesce: true
 * });
 * ```
 */
export declare const createVMSnapshot: (config: SnapshotConfig) => Promise<VMSnapshot>;
/**
 * Reverts VM to a snapshot.
 *
 * @param {string} vmId - VM identifier
 * @param {string} snapshotId - Snapshot identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revertVMToSnapshot('vm-12345', 'snapshot-001');
 * ```
 */
export declare const revertVMToSnapshot: (vmId: string, snapshotId: string) => Promise<void>;
/**
 * Deletes a VM snapshot.
 *
 * @param {string} vmId - VM identifier
 * @param {string} snapshotId - Snapshot identifier
 * @param {boolean} [removeChildren=false] - Remove child snapshots
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteVMSnapshot('vm-12345', 'snapshot-001', false);
 * ```
 */
export declare const deleteVMSnapshot: (vmId: string, snapshotId: string, removeChildren?: boolean) => Promise<void>;
/**
 * Consolidates VM snapshots to improve performance.
 *
 * @param {string} vmId - VM identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await consolidateVMSnapshots('vm-12345');
 * ```
 */
export declare const consolidateVMSnapshots: (vmId: string) => Promise<void>;
/**
 * Clones a virtual machine.
 *
 * @param {VMCloneConfig} config - Clone configuration
 * @returns {Promise<string>} Cloned VM identifier
 *
 * @example
 * ```typescript
 * const cloneId = await cloneVM({
 *   sourceVMId: 'vm-12345',
 *   name: 'vm-12345-clone',
 *   linked: false,
 *   customization: { hostname: 'clone-vm' }
 * });
 * ```
 */
export declare const cloneVM: (config: VMCloneConfig) => Promise<string>;
/**
 * Migrates VM using vMotion.
 *
 * @param {VMotionConfig} config - vMotion configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await migrateVMWithVMotion({
 *   vmId: 'vm-12345',
 *   targetHost: 'esxi-host-02',
 *   priority: 'high'
 * });
 * ```
 */
export declare const migrateVMWithVMotion: (config: VMotionConfig) => Promise<void>;
/**
 * Configures VM high availability settings.
 *
 * @param {HAConfig} config - HA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureVMHighAvailability({
 *   vmId: 'vm-12345',
 *   restartPriority: 'high',
 *   vmMonitoring: true
 * });
 * ```
 */
export declare const configureVMHighAvailability: (config: HAConfig) => Promise<void>;
/**
 * Sets VM host affinity rules.
 *
 * @param {HostAffinity} affinity - Affinity configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setVMHostAffinity({
 *   vmId: 'vm-12345',
 *   affinityHosts: ['esxi-01', 'esxi-02'],
 *   antiAffinityHosts: ['esxi-03'],
 *   mandatory: true
 * });
 * ```
 */
export declare const setVMHostAffinity: (affinity: HostAffinity) => Promise<void>;
export {};
//# sourceMappingURL=virtual-compute-services-kit.d.ts.map