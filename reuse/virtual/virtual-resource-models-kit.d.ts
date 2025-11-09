/**
 * LOC: V1I2R3T4U5
 * File: /reuse/virtual/virtual-resource-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure models
 *   - VMware vRealize integration
 *   - Resource management services
 */
/**
 * File: /reuse/virtual/virtual-resource-models-kit.ts
 * Locator: WC-UTL-VIRT-RES-001
 * Purpose: Virtual Resource Models Kit - VM, host, cluster, datastore, and network models for VMware vRealize
 *
 * Upstream: sequelize v6.x, @types/validator, crypto
 * Downstream: Virtual infrastructure management, vRealize Operations, vSphere integration
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 44 model utilities for VMs, hosts, clusters, datastores, networks, with associations, validations, hooks, and temporal tracking
 *
 * LLM Context: Production-grade Sequelize v6.x virtual infrastructure model kit for White Cross healthcare platform.
 * Provides comprehensive models for VMware vRealize inventory including VMs, ESXi hosts, clusters, datastores, and networks.
 * HIPAA-compliant with audit trails, temporal tracking, encrypted sensitive data, and comprehensive validation.
 */
import { ModelStatic, Sequelize, ModelOptions, ValidationOptions, FindOptions } from 'sequelize';
/**
 * Virtual Machine power state
 */
export type VMPowerState = 'poweredOn' | 'poweredOff' | 'suspended';
/**
 * Virtual Machine guest OS type
 */
export type VMGuestOSType = 'windows' | 'linux' | 'other' | 'unknown';
/**
 * Host connection state
 */
export type HostConnectionState = 'connected' | 'disconnected' | 'notResponding' | 'maintenance';
/**
 * Datastore type
 */
export type DatastoreType = 'VMFS' | 'NFS' | 'vSAN' | 'local' | 'other';
/**
 * Network type
 */
export type NetworkType = 'standard' | 'distributed' | 'overlay';
/**
 * Cluster HA state
 */
export type ClusterHAState = 'enabled' | 'disabled' | 'configuring';
/**
 * Resource allocation configuration
 */
export interface ResourceAllocation {
    shares: number;
    reservation: number;
    limit: number;
    expandableReservation: boolean;
}
/**
 * VM hardware configuration
 */
export interface VMHardwareConfig {
    numCPU: number;
    numCoresPerSocket: number;
    memoryMB: number;
    version: string;
    firmware: 'bios' | 'efi';
}
/**
 * Network adapter configuration
 */
export interface NetworkAdapter {
    key: number;
    type: string;
    macAddress: string;
    connected: boolean;
    networkId: string;
}
/**
 * Disk configuration
 */
export interface DiskConfig {
    key: number;
    capacityGB: number;
    diskMode: 'persistent' | 'independent_persistent' | 'independent_nonpersistent';
    thinProvisioned: boolean;
    datastoreId: string;
}
/**
 * Performance metrics
 */
export interface PerformanceMetrics {
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    diskIOPS: number;
    networkMbps: number;
    timestamp: Date;
}
/**
 * Temporal tracking for compliance
 */
export interface TemporalTracking {
    validFrom: Date;
    validTo: Date | null;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    userId: string;
    changeReason?: string;
}
/**
 * Creates a comprehensive Virtual Machine model.
 * Tracks VMs with power state, configuration, and performance metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Virtual Machine model
 *
 * @example
 * ```typescript
 * const VirtualMachine = createVirtualMachineModel(sequelize, 'VirtualMachine', {
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['moRef'], unique: true },
 *     { fields: ['hostId'] },
 *     { fields: ['powerState'] }
 *   ]
 * });
 *
 * const vm = await VirtualMachine.create({
 *   name: 'prod-web-01',
 *   moRef: 'vm-1234',
 *   powerState: 'poweredOn',
 *   guestOS: 'linux',
 *   numCPU: 4,
 *   memoryMB: 16384,
 *   hostId: 'host-uuid'
 * });
 * ```
 */
export declare function createVirtualMachineModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Creates a Virtual Machine History model for temporal tracking.
 * Maintains complete change history for compliance and audit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>} sourceModel - Source VM model
 * @returns {ModelStatic<any>} VM History model
 *
 * @example
 * ```typescript
 * const VMHistory = createVMHistoryModel(sequelize, VirtualMachine);
 *
 * // Automatically populated via hooks
 * const history = await VMHistory.findAll({
 *   where: { original_id: vmId },
 *   order: [['validFrom', 'DESC']]
 * });
 * ```
 */
export declare function createVMHistoryModel(sequelize: Sequelize, sourceModel: ModelStatic<any>): ModelStatic<any>;
/**
 * Adds VM lifecycle hooks for audit trail.
 * Automatically tracks power state changes and configuration updates.
 *
 * @param {ModelStatic<any>} model - VM model
 * @param {ModelStatic<any>} historyModel - VM history model
 * @returns {ModelStatic<any>} Model with audit hooks
 *
 * @example
 * ```typescript
 * addVMAuditHooks(VirtualMachine, VMHistory);
 *
 * // Now all changes are automatically tracked
 * await vm.update({ powerState: 'poweredOn' });
 * ```
 */
export declare function addVMAuditHooks(model: ModelStatic<any>, historyModel: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates VM scopes for common queries.
 * Simplifies querying for active, powered on, template VMs, etc.
 *
 * @param {ModelStatic<any>} model - VM model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addVMScopes(VirtualMachine);
 *
 * const activeVMs = await VirtualMachine.scope('active').findAll();
 * const poweredOnLinux = await VirtualMachine.scope(['poweredOn', 'linux']).findAll();
 * ```
 */
export declare function addVMScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive ESXi Host model.
 * Tracks physical hosts with connection state, hardware, and capacity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Host model
 *
 * @example
 * ```typescript
 * const Host = createHostModel(sequelize, 'Host', {
 *   paranoid: true
 * });
 *
 * const host = await Host.create({
 *   name: 'esxi-01.domain.com',
 *   moRef: 'host-123',
 *   connectionState: 'connected',
 *   cpuModel: 'Intel Xeon Gold 6248R',
 *   numCpuCores: 48,
 *   cpuMhz: 3000,
 *   memoryGB: 384
 * });
 * ```
 */
export declare function createHostModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds host scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Host model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addHostScopes(Host);
 * const connectedHosts = await Host.scope('connected').findAll();
 * ```
 */
export declare function addHostScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive Cluster model.
 * Tracks vSphere clusters with HA/DRS configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Cluster model
 *
 * @example
 * ```typescript
 * const Cluster = createClusterModel(sequelize, 'Cluster');
 *
 * const cluster = await Cluster.create({
 *   name: 'Production-Cluster',
 *   moRef: 'domain-c123',
 *   haEnabled: true,
 *   drsEnabled: true,
 *   drsAutomationLevel: 'fullyAutomated'
 * });
 * ```
 */
export declare function createClusterModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds cluster scopes.
 *
 * @param {ModelStatic<any>} model - Cluster model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addClusterScopes(Cluster);
 * const haClusters = await Cluster.scope('haEnabled').findAll();
 * ```
 */
export declare function addClusterScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive Datastore model.
 * Tracks storage with capacity, type, and performance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Datastore model
 *
 * @example
 * ```typescript
 * const Datastore = createDatastoreModel(sequelize, 'Datastore');
 *
 * const ds = await Datastore.create({
 *   name: 'SAN-LUN-001',
 *   moRef: 'datastore-123',
 *   type: 'VMFS',
 *   capacityGB: 5000,
 *   freeSpaceGB: 2500
 * });
 * ```
 */
export declare function createDatastoreModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds datastore scopes.
 *
 * @param {ModelStatic<any>} model - Datastore model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addDatastoreScopes(Datastore);
 * const accessibleStores = await Datastore.scope('accessible').findAll();
 * ```
 */
export declare function addDatastoreScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive Network model.
 * Tracks virtual networks with VLAN and configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Network model
 *
 * @example
 * ```typescript
 * const Network = createNetworkModel(sequelize, 'Network');
 *
 * const net = await Network.create({
 *   name: 'Production-VLAN-100',
 *   moRef: 'network-123',
 *   type: 'distributed',
 *   vlanId: 100
 * });
 * ```
 */
export declare function createNetworkModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds network scopes.
 *
 * @param {ModelStatic<any>} model - Network model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addNetworkScopes(Network);
 * const distributedNetworks = await Network.scope('distributed').findAll();
 * ```
 */
export declare function addNetworkScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Defines associations between VM, Host, Cluster, Datastore, and Network models.
 * Creates complete relational model structure.
 *
 * @param {object} models - Object containing all models
 * @returns {void}
 *
 * @example
 * ```typescript
 * const models = {
 *   VirtualMachine,
 *   Host,
 *   Cluster,
 *   Datastore,
 *   Network
 * };
 * defineVirtualResourceAssociations(models);
 *
 * // Now you can query with includes
 * const vm = await VirtualMachine.findByPk(id, {
 *   include: ['host', 'cluster']
 * });
 * ```
 */
export declare function defineVirtualResourceAssociations(models: {
    VirtualMachine: ModelStatic<any>;
    Host: ModelStatic<any>;
    Cluster: ModelStatic<any>;
    Datastore?: ModelStatic<any>;
    Network?: ModelStatic<any>;
}): void;
/**
 * Validates VM configuration before save.
 * Ensures CPU, memory, and resource allocation are valid.
 *
 * @param {ModelStatic<any>} model - VM model
 * @returns {ModelStatic<any>} Model with validation hooks
 *
 * @example
 * ```typescript
 * addVMValidationHooks(VirtualMachine);
 *
 * // This will fail validation
 * await VirtualMachine.create({
 *   numCPU: 0,  // Invalid
 *   memoryMB: 64  // Too low
 * });
 * ```
 */
export declare function addVMValidationHooks(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Validates host resource capacity.
 * Ensures host has sufficient resources.
 *
 * @param {ModelStatic<any>} model - Host model
 * @returns {ModelStatic<any>} Model with validation hooks
 *
 * @example
 * ```typescript
 * addHostValidationHooks(Host);
 * ```
 */
export declare function addHostValidationHooks(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Validates datastore capacity.
 * Ensures space calculations are correct.
 *
 * @param {ModelStatic<any>} model - Datastore model
 * @returns {ModelStatic<any>} Model with validation hooks
 *
 * @example
 * ```typescript
 * addDatastoreValidationHooks(Datastore);
 * ```
 */
export declare function addDatastoreValidationHooks(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates computed virtual fields for resource models.
 * Adds calculated fields like usage percentages.
 *
 * @param {ModelStatic<any>} vmModel - VM model
 * @param {ModelStatic<any>} hostModel - Host model
 * @param {ModelStatic<any>} datastoreModel - Datastore model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addResourceComputedFields(VirtualMachine, Host, Datastore);
 *
 * const ds = await Datastore.findByPk(id);
 * console.log(ds.usagePercent);  // Computed field
 * ```
 */
export declare function addResourceComputedFields(vmModel: ModelStatic<any>, hostModel: ModelStatic<any>, datastoreModel: ModelStatic<any>): void;
/**
 * Adds performance metric tracking hooks.
 * Automatically updates metrics on changes.
 *
 * @param {ModelStatic<any>} model - Model to add metric tracking
 * @returns {ModelStatic<any>} Model with metric hooks
 *
 * @example
 * ```typescript
 * addPerformanceMetricHooks(VirtualMachine);
 *
 * vm.metrics = { cpuUsagePercent: 75, memoryUsagePercent: 60 };
 * await vm.save();  // Metrics tracked
 * ```
 */
export declare function addPerformanceMetricHooks(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates IP address validation for hosts and VMs.
 * Validates IP format and optionally checks for duplicates.
 *
 * @param {string} fieldName - Field name to validate
 * @param {boolean} allowIPv6 - Whether to allow IPv6 addresses
 * @returns {ValidationOptions} Validation options
 *
 * @example
 * ```typescript
 * const ipValidation = createIPAddressValidation('ipAddress', true);
 * ```
 */
export declare function createIPAddressValidation(fieldName: string, allowIPv6?: boolean): ValidationOptions;
/**
 * Creates MAC address validation for network adapters.
 * Validates MAC format.
 *
 * @returns {ValidationOptions} Validation options
 *
 * @example
 * ```typescript
 * const macValidation = createMACAddressValidation();
 * ```
 */
export declare function createMACAddressValidation(): ValidationOptions;
/**
 * Bulk updates VM power states.
 * Efficiently changes power state for multiple VMs.
 *
 * @param {ModelStatic<any>} model - VM model
 * @param {string[]} vmIds - VM IDs to update
 * @param {VMPowerState} powerState - New power state
 * @param {object} options - Update options
 * @returns {Promise<number>} Number of VMs updated
 *
 * @example
 * ```typescript
 * const count = await bulkUpdateVMPowerState(
 *   VirtualMachine,
 *   ['vm1', 'vm2', 'vm3'],
 *   'poweredOff',
 *   { userId: 'admin-123' }
 * );
 * ```
 */
export declare function bulkUpdateVMPowerState(model: ModelStatic<any>, vmIds: string[], powerState: VMPowerState, options?: any): Promise<number>;
/**
 * Finds VMs by host with optional filters.
 * Retrieves all VMs on specific hosts.
 *
 * @param {ModelStatic<any>} model - VM model
 * @param {string[]} hostIds - Host IDs
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<any[]>} VMs on specified hosts
 *
 * @example
 * ```typescript
 * const vms = await findVMsByHost(VirtualMachine, ['host1', 'host2'], {
 *   where: { powerState: 'poweredOn' }
 * });
 * ```
 */
export declare function findVMsByHost(model: ModelStatic<any>, hostIds: string[], options?: FindOptions): Promise<any[]>;
/**
 * Finds hosts by cluster with capacity info.
 * Retrieves hosts in clusters with resource details.
 *
 * @param {ModelStatic<any>} model - Host model
 * @param {string} clusterId - Cluster ID
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<any[]>} Hosts in cluster
 *
 * @example
 * ```typescript
 * const hosts = await findHostsByCluster(Host, clusterId, {
 *   where: { connectionState: 'connected' }
 * });
 * ```
 */
export declare function findHostsByCluster(model: ModelStatic<any>, clusterId: string, options?: FindOptions): Promise<any[]>;
/**
 * Calculates cluster resource utilization.
 * Computes total and used resources across cluster.
 *
 * @param {ModelStatic<any>} clusterModel - Cluster model
 * @param {ModelStatic<any>} hostModel - Host model
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<object>} Resource utilization stats
 *
 * @example
 * ```typescript
 * const stats = await calculateClusterUtilization(Cluster, Host, clusterId);
 * console.log(stats.cpuUtilization, stats.memoryUtilization);
 * ```
 */
export declare function calculateClusterUtilization(clusterModel: ModelStatic<any>, hostModel: ModelStatic<any>, clusterId: string): Promise<{
    totalCpuCores: number;
    usedCpuCores: number;
    cpuUtilization: number;
    totalMemoryGB: number;
    usedMemoryGB: number;
    memoryUtilization: number;
}>;
/**
 * Finds datastores with low space warning.
 * Identifies datastores below threshold.
 *
 * @param {ModelStatic<any>} model - Datastore model
 * @param {number} thresholdPercent - Free space threshold (default 20%)
 * @returns {Promise<any[]>} Datastores with low space
 *
 * @example
 * ```typescript
 * const lowSpace = await findDatastoresWithLowSpace(Datastore, 15);
 * ```
 */
export declare function findDatastoresWithLowSpace(model: ModelStatic<any>, thresholdPercent?: number): Promise<any[]>;
/**
 * Exports virtual infrastructure inventory to JSON.
 * Creates complete snapshot of all resources.
 *
 * @param {object} models - All resource models
 * @returns {Promise<object>} Complete inventory snapshot
 *
 * @example
 * ```typescript
 * const inventory = await exportVirtualInfrastructureInventory({
 *   VirtualMachine,
 *   Host,
 *   Cluster,
 *   Datastore,
 *   Network
 * });
 * ```
 */
export declare function exportVirtualInfrastructureInventory(models: {
    VirtualMachine: ModelStatic<any>;
    Host: ModelStatic<any>;
    Cluster: ModelStatic<any>;
    Datastore: ModelStatic<any>;
    Network: ModelStatic<any>;
}): Promise<{
    timestamp: Date;
    virtualMachines: any[];
    hosts: any[];
    clusters: any[];
    datastores: any[];
    networks: any[];
    summary: object;
}>;
//# sourceMappingURL=virtual-resource-models-kit.d.ts.map