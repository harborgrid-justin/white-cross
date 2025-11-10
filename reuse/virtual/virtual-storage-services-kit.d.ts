/**
 * LOC: VRT-STORAGE-001
 * File: /reuse/virtual/virtual-storage-services-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - vmware-vrealize-sdk
 *   - vsphere-storage-api
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure modules
 *   - Storage management services
 *   - Datastore provisioning modules
 *   - Storage vMotion orchestration
 */
interface DatastoreConfig {
    name: string;
    type: 'VMFS' | 'NFS' | 'vSAN' | 'vVOL';
    capacity: number;
    hosts: string[];
    nfsConfig?: NFSConfig;
    vsanConfig?: VSANConfig;
    vvolConfig?: VVOLConfig;
}
interface NFSConfig {
    server: string;
    exportPath: string;
    version: '3' | '4.1';
    readOnly?: boolean;
    securityType?: 'AUTH_SYS' | 'SEC_KRB5' | 'SEC_KRB5I';
}
interface VSANConfig {
    diskGroups: DiskGroup[];
    deduplication?: boolean;
    compression?: boolean;
    encryption?: boolean;
    faultDomains?: number;
}
interface VVOLConfig {
    storageContainerId: string;
    protocolEndpoints: string[];
}
interface DiskGroup {
    cacheDisks: string[];
    capacityDisks: string[];
    diskMapping: 'hybrid' | 'allFlash';
}
interface DatastoreInfo {
    id: string;
    name: string;
    type: string;
    capacityGB: number;
    freeSpaceGB: number;
    usedSpaceGB: number;
    provisionedGB: number;
    vmCount: number;
    accessible: boolean;
    multipleHostAccess: boolean;
    maintenanceMode: boolean;
}
interface StoragePolicy {
    id: string;
    name: string;
    description?: string;
    rules: StoragePolicyRule[];
    compliance: 'compliant' | 'nonCompliant' | 'unknown';
}
interface StoragePolicyRule {
    capability: string;
    value: any;
    operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}
interface VolumeConfig {
    name: string;
    sizeGB: number;
    datastore: string;
    thin?: boolean;
    eagerZeroed?: boolean;
    storagePolicy?: string;
}
interface VolumeInfo {
    id: string;
    name: string;
    sizeGB: number;
    datastore: string;
    thin: boolean;
    vmId?: string;
    vmName?: string;
}
interface StorageVMotionConfig {
    vmId: string;
    targetDatastore: string;
    disks?: DiskMigrationConfig[];
    priority: 'high' | 'normal' | 'low';
}
interface DiskMigrationConfig {
    diskId: string;
    targetDatastore: string;
    targetFormat?: 'thin' | 'thick' | 'eagerZeroedThick';
}
interface StorageCapacity {
    datastoreId: string;
    totalGB: number;
    usedGB: number;
    freeGB: number;
    provisionedGB: number;
    overProvisioningRatio: number;
    growthRate: number;
    daysUntilFull?: number;
}
interface StoragePerformance {
    datastoreId: string;
    readLatencyMs: number;
    writeLatencyMs: number;
    readIOPS: number;
    writeIOPS: number;
    throughputMBps: number;
    timestamp: Date;
}
interface StorageTier {
    name: string;
    type: 'ssd' | 'sas' | 'sata' | 'nvme';
    performanceClass: 'high' | 'medium' | 'low';
    datastores: string[];
}
interface StorageIOControl {
    datastoreId: string;
    enabled: boolean;
    congestionThreshold?: number;
    percentOfPeakThroughput?: number;
}
interface StorageDRSConfig {
    podId: string;
    enabled: boolean;
    ioLoadBalancing: boolean;
    spaceLoadBalancing: boolean;
    ioLatencyThresholdMs?: number;
    spaceUtilizationThreshold?: number;
    automationLevel: 'manual' | 'partiallyAutomated' | 'fullyAutomated';
}
interface StorageReplication {
    sourceDatastore: string;
    targetDatastore: string;
    enabled: boolean;
    rpo: number;
    lastReplicationTime?: Date;
    status: 'active' | 'paused' | 'error';
}
/**
 * Creates and configures a new datastore.
 *
 * @param {DatastoreConfig} config - Datastore configuration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<string>} Datastore identifier
 *
 * @example
 * ```typescript
 * const datastoreId = await createDatastore({
 *   name: 'patient-data-ssd-01',
 *   type: 'VMFS',
 *   capacity: 5000,
 *   hosts: ['esxi-01', 'esxi-02', 'esxi-03']
 * }, 'admin-123');
 * ```
 */
export declare const createDatastore: (config: DatastoreConfig, userId: string) => Promise<string>;
/**
 * Retrieves detailed information about a datastore.
 *
 * @param {string} datastoreId - Datastore identifier
 * @returns {Promise<DatastoreInfo>} Datastore information
 *
 * @example
 * ```typescript
 * const info = await getDatastoreInfo('datastore-001');
 * console.log('Free space:', info.freeSpaceGB, 'GB');
 * ```
 */
export declare const getDatastoreInfo: (datastoreId: string) => Promise<DatastoreInfo>;
/**
 * Expands datastore capacity.
 *
 * @param {string} datastoreId - Datastore identifier
 * @param {number} additionalGB - Additional capacity in GB
 * @returns {Promise<DatastoreInfo>} Updated datastore info
 *
 * @example
 * ```typescript
 * const updatedInfo = await expandDatastore('datastore-001', 1000);
 * ```
 */
export declare const expandDatastore: (datastoreId: string, additionalGB: number) => Promise<DatastoreInfo>;
/**
 * Deletes a datastore after validation.
 *
 * @param {string} datastoreId - Datastore identifier
 * @param {boolean} [force=false] - Force deletion even if VMs exist
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteDatastore('datastore-old-001', false);
 * ```
 */
export declare const deleteDatastore: (datastoreId: string, force?: boolean) => Promise<void>;
/**
 * Sets datastore to maintenance mode.
 *
 * @param {string} datastoreId - Datastore identifier
 * @param {boolean} enterMaintenance - True to enter, false to exit
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setDatastoreMaintenanceMode('datastore-001', true);
 * ```
 */
export declare const setDatastoreMaintenanceMode: (datastoreId: string, enterMaintenance: boolean) => Promise<void>;
/**
 * Mounts datastore to additional hosts.
 *
 * @param {string} datastoreId - Datastore identifier
 * @param {string[]} hostIds - Host identifiers
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await mountDatastoreToHosts('datastore-001', ['esxi-04', 'esxi-05']);
 * ```
 */
export declare const mountDatastoreToHosts: (datastoreId: string, hostIds: string[]) => Promise<void>;
/**
 * Unmounts datastore from specified hosts.
 *
 * @param {string} datastoreId - Datastore identifier
 * @param {string[]} hostIds - Host identifiers
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unmountDatastoreFromHosts('datastore-001', ['esxi-04']);
 * ```
 */
export declare const unmountDatastoreFromHosts: (datastoreId: string, hostIds: string[]) => Promise<void>;
/**
 * Creates a storage policy with specified rules.
 *
 * @param {string} name - Policy name
 * @param {string} description - Policy description
 * @param {StoragePolicyRule[]} rules - Policy rules
 * @returns {Promise<StoragePolicy>} Created storage policy
 *
 * @example
 * ```typescript
 * const policy = await createStoragePolicy(
 *   'patient-data-policy',
 *   'High performance storage for patient data',
 *   [
 *     { capability: 'VSAN.hostFailuresToTolerate', value: 2 },
 *     { capability: 'VSAN.replicaPreference', value: 'RAID-1' }
 *   ]
 * );
 * ```
 */
export declare const createStoragePolicy: (name: string, description: string, rules: StoragePolicyRule[]) => Promise<StoragePolicy>;
/**
 * Applies storage policy to a VM or disk.
 *
 * @param {string} policyId - Policy identifier
 * @param {string} targetId - VM or disk identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyStoragePolicy('policy-001', 'vm-12345');
 * ```
 */
export declare const applyStoragePolicy: (policyId: string, targetId: string) => Promise<void>;
/**
 * Checks storage policy compliance for resources.
 *
 * @param {string} policyId - Policy identifier
 * @param {string[]} resourceIds - Resource identifiers
 * @returns {Promise<Map<string, boolean>>} Compliance status by resource
 *
 * @example
 * ```typescript
 * const compliance = await checkPolicyCompliance('policy-001', ['vm-001', 'vm-002']);
 * ```
 */
export declare const checkPolicyCompliance: (policyId: string, resourceIds: string[]) => Promise<Map<string, boolean>>;
/**
 * Updates storage policy rules.
 *
 * @param {string} policyId - Policy identifier
 * @param {StoragePolicyRule[]} rules - Updated rules
 * @returns {Promise<StoragePolicy>} Updated policy
 *
 * @example
 * ```typescript
 * const updated = await updateStoragePolicy('policy-001', [
 *   { capability: 'VSAN.stripeWidth', value: 2 }
 * ]);
 * ```
 */
export declare const updateStoragePolicy: (policyId: string, rules: StoragePolicyRule[]) => Promise<StoragePolicy>;
/**
 * Deletes a storage policy.
 *
 * @param {string} policyId - Policy identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteStoragePolicy('policy-old-001');
 * ```
 */
export declare const deleteStoragePolicy: (policyId: string) => Promise<void>;
/**
 * Creates a new virtual disk volume.
 *
 * @param {VolumeConfig} config - Volume configuration
 * @returns {Promise<VolumeInfo>} Created volume information
 *
 * @example
 * ```typescript
 * const volume = await createVolume({
 *   name: 'data-volume-01',
 *   sizeGB: 500,
 *   datastore: 'datastore-ssd-01',
 *   thin: true,
 *   storagePolicy: 'policy-high-performance'
 * });
 * ```
 */
export declare const createVolume: (config: VolumeConfig) => Promise<VolumeInfo>;
/**
 * Attaches volume to a VM.
 *
 * @param {string} volumeId - Volume identifier
 * @param {string} vmId - VM identifier
 * @param {string} [controller] - SCSI controller
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await attachVolumeToVM('volume-001', 'vm-12345', 'SCSI controller 0');
 * ```
 */
export declare const attachVolumeToVM: (volumeId: string, vmId: string, controller?: string) => Promise<void>;
/**
 * Detaches volume from a VM.
 *
 * @param {string} volumeId - Volume identifier
 * @param {string} vmId - VM identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await detachVolumeFromVM('volume-001', 'vm-12345');
 * ```
 */
export declare const detachVolumeFromVM: (volumeId: string, vmId: string) => Promise<void>;
/**
 * Resizes a volume.
 *
 * @param {string} volumeId - Volume identifier
 * @param {number} newSizeGB - New size in GB
 * @returns {Promise<VolumeInfo>} Updated volume info
 *
 * @example
 * ```typescript
 * const updated = await resizeVolume('volume-001', 1000);
 * ```
 */
export declare const resizeVolume: (volumeId: string, newSizeGB: number) => Promise<VolumeInfo>;
/**
 * Deletes a volume.
 *
 * @param {string} volumeId - Volume identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteVolume('volume-old-001');
 * ```
 */
export declare const deleteVolume: (volumeId: string) => Promise<void>;
/**
 * Converts volume between thin and thick provisioning.
 *
 * @param {string} volumeId - Volume identifier
 * @param {'thin' | 'thick' | 'eagerZeroedThick'} format - Target format
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await convertVolumeFormat('volume-001', 'thin');
 * ```
 */
export declare const convertVolumeFormat: (volumeId: string, format: "thin" | "thick" | "eagerZeroedThick") => Promise<void>;
/**
 * Migrates VM storage to different datastore using Storage vMotion.
 *
 * @param {StorageVMotionConfig} config - Migration configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await migrateVMStorage({
 *   vmId: 'vm-12345',
 *   targetDatastore: 'datastore-ssd-02',
 *   priority: 'high'
 * });
 * ```
 */
export declare const migrateVMStorage: (config: StorageVMotionConfig) => Promise<void>;
/**
 * Performs bulk storage migration for multiple VMs.
 *
 * @param {StorageVMotionConfig[]} configs - Array of migration configurations
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await bulkMigrateVMStorage([
 *   { vmId: 'vm-001', targetDatastore: 'ds-ssd-01', priority: 'normal' },
 *   { vmId: 'vm-002', targetDatastore: 'ds-ssd-01', priority: 'normal' }
 * ]);
 * ```
 */
export declare const bulkMigrateVMStorage: (configs: StorageVMotionConfig[]) => Promise<void>;
/**
 * Gets storage migration progress.
 *
 * @param {string} taskId - Migration task identifier
 * @returns {Promise<number>} Progress percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = await getStorageMigrationProgress('task-12345');
 * console.log(`Migration ${progress}% complete`);
 * ```
 */
export declare const getStorageMigrationProgress: (taskId: string) => Promise<number>;
/**
 * Analyzes storage capacity and utilization.
 *
 * @param {string} datastoreId - Datastore identifier
 * @returns {Promise<StorageCapacity>} Capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await analyzeStorageCapacity('datastore-001');
 * console.log('Days until full:', capacity.daysUntilFull);
 * ```
 */
export declare const analyzeStorageCapacity: (datastoreId: string) => Promise<StorageCapacity>;
/**
 * Monitors storage performance metrics.
 *
 * @param {string} datastoreId - Datastore identifier
 * @returns {Promise<StoragePerformance>} Performance metrics
 *
 * @example
 * ```typescript
 * const perf = await monitorStoragePerformance('datastore-001');
 * console.log('Read latency:', perf.readLatencyMs, 'ms');
 * ```
 */
export declare const monitorStoragePerformance: (datastoreId: string) => Promise<StoragePerformance>;
/**
 * Recommends storage tier for workload.
 *
 * @param {VMPerformanceProfile} profile - VM performance profile
 * @returns {Promise<StorageTier>} Recommended storage tier
 *
 * @example
 * ```typescript
 * const tier = await recommendStorageTier({
 *   avgIOPS: 5000,
 *   avgLatencyMs: 5,
 *   workloadType: 'database'
 * });
 * ```
 */
export declare const recommendStorageTier: (profile: VMPerformanceProfile) => Promise<StorageTier>;
/**
 * Optimizes storage allocation across datastores.
 *
 * @param {string} clusterId - Cluster identifier
 * @returns {Promise<string[]>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await optimizeStorageAllocation('cluster-01');
 * ```
 */
export declare const optimizeStorageAllocation: (clusterId: string) => Promise<string[]>;
/**
 * Configures Storage DRS for a datastore cluster.
 *
 * @param {StorageDRSConfig} config - Storage DRS configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureStorageDRS({
 *   podId: 'pod-001',
 *   enabled: true,
 *   ioLoadBalancing: true,
 *   spaceLoadBalancing: true,
 *   automationLevel: 'fullyAutomated'
 * });
 * ```
 */
export declare const configureStorageDRS: (config: StorageDRSConfig) => Promise<void>;
/**
 * Gets Storage DRS recommendations.
 *
 * @param {string} podId - Datastore cluster identifier
 * @returns {Promise<StorageVMotionConfig[]>} Migration recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await getStorageDRSRecommendations('pod-001');
 * ```
 */
export declare const getStorageDRSRecommendations: (podId: string) => Promise<StorageVMotionConfig[]>;
/**
 * Applies Storage DRS recommendations.
 *
 * @param {string} podId - Datastore cluster identifier
 * @param {string[]} [recommendationIds] - Specific recommendation IDs to apply
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyStorageDRSRecommendations('pod-001');
 * ```
 */
export declare const applyStorageDRSRecommendations: (podId: string, recommendationIds?: string[]) => Promise<void>;
/**
 * Configures storage I/O control.
 *
 * @param {StorageIOControl} config - I/O control configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureStorageIOControl({
 *   datastoreId: 'datastore-001',
 *   enabled: true,
 *   congestionThreshold: 30
 * });
 * ```
 */
export declare const configureStorageIOControl: (config: StorageIOControl) => Promise<void>;
/**
 * Enables datastore encryption.
 *
 * @param {string} datastoreId - Datastore identifier
 * @param {string} keyProviderId - Encryption key provider
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableDatastoreEncryption('datastore-001', 'kms-provider-01');
 * ```
 */
export declare const enableDatastoreEncryption: (datastoreId: string, keyProviderId: string) => Promise<void>;
/**
 * Configures storage replication.
 *
 * @param {StorageReplication} config - Replication configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureStorageReplication({
 *   sourceDatastore: 'ds-prod-01',
 *   targetDatastore: 'ds-dr-01',
 *   enabled: true,
 *   rpo: 15
 * });
 * ```
 */
export declare const configureStorageReplication: (config: StorageReplication) => Promise<void>;
interface VMPerformanceProfile {
    avgIOPS: number;
    avgLatencyMs: number;
    workloadType: string;
}
export {};
//# sourceMappingURL=virtual-storage-services-kit.d.ts.map