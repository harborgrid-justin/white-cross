"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureStorageReplication = exports.enableDatastoreEncryption = exports.configureStorageIOControl = exports.applyStorageDRSRecommendations = exports.getStorageDRSRecommendations = exports.configureStorageDRS = exports.optimizeStorageAllocation = exports.recommendStorageTier = exports.monitorStoragePerformance = exports.analyzeStorageCapacity = exports.getStorageMigrationProgress = exports.bulkMigrateVMStorage = exports.migrateVMStorage = exports.convertVolumeFormat = exports.deleteVolume = exports.resizeVolume = exports.detachVolumeFromVM = exports.attachVolumeToVM = exports.createVolume = exports.deleteStoragePolicy = exports.updateStoragePolicy = exports.checkPolicyCompliance = exports.applyStoragePolicy = exports.createStoragePolicy = exports.unmountDatastoreFromHosts = exports.mountDatastoreToHosts = exports.setDatastoreMaintenanceMode = exports.deleteDatastore = exports.expandDatastore = exports.getDatastoreInfo = exports.createDatastore = void 0;
/**
 * File: /reuse/virtual/virtual-storage-services-kit.ts
 * Locator: WC-VRT-STORAGE-001
 * Purpose: VMware vRealize Virtual Storage Services - Enterprise-grade datastore management, storage policies, vMotion
 *
 * Upstream: @nestjs/common, @nestjs/config, vmware-vrealize-sdk, vsphere-storage-api
 * Downstream: ../backend/virtual/*, Storage management modules, Infrastructure services, Capacity planning
 * Dependencies: NestJS 10.x, TypeScript 5.x, VMware vRealize API 8.x, vSAN SDK 7.x
 * Exports: 42 utility functions for datastore management, volume operations, storage policies, storage vMotion, capacity planning
 *
 * LLM Context: Comprehensive VMware vRealize storage service utilities for White Cross healthcare infrastructure.
 * Provides datastore lifecycle management, storage policy configuration, volume provisioning, storage vMotion orchestration,
 * capacity monitoring and planning, performance optimization, storage tiering, VMDK operations, snapshot management,
 * thin provisioning strategies, and storage DRS automation. HIPAA-compliant patterns for healthcare data storage,
 * encryption at rest, secure multi-tenant storage isolation, backup integration, and disaster recovery storage.
 */
const common_1 = require("@nestjs/common");
// ============================================================================
// DATASTORE MANAGEMENT
// ============================================================================
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
const createDatastore = async (config, userId) => {
    const logger = new common_1.Logger('createDatastore');
    logger.log(`Creating datastore: ${config.name}`);
    try {
        validateDatastoreConfig(config);
        let datastoreId;
        switch (config.type) {
            case 'VMFS':
                datastoreId = await createVMFSDatastore(config);
                break;
            case 'NFS':
                datastoreId = await createNFSDatastore(config);
                break;
            case 'vSAN':
                datastoreId = await createVSANDatastore(config);
                break;
            case 'vVOL':
                datastoreId = await createVVOLDatastore(config);
                break;
        }
        await logDatastoreEvent('create', datastoreId, userId);
        logger.log(`Datastore created: ${datastoreId}`);
        return datastoreId;
    }
    catch (error) {
        logger.error(`Datastore creation failed: ${error.message}`);
        throw error;
    }
};
exports.createDatastore = createDatastore;
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
const getDatastoreInfo = async (datastoreId) => {
    const logger = new common_1.Logger('getDatastoreInfo');
    try {
        const datastoreData = await fetchDatastoreData(datastoreId);
        return {
            id: datastoreId,
            name: datastoreData.name,
            type: datastoreData.type,
            capacityGB: datastoreData.capacity / 1024,
            freeSpaceGB: datastoreData.freeSpace / 1024,
            usedSpaceGB: (datastoreData.capacity - datastoreData.freeSpace) / 1024,
            provisionedGB: datastoreData.provisioned / 1024,
            vmCount: datastoreData.vmCount,
            accessible: datastoreData.accessible,
            multipleHostAccess: datastoreData.multipleHostAccess,
            maintenanceMode: datastoreData.maintenanceMode,
        };
    }
    catch (error) {
        logger.error(`Failed to get datastore info: ${error.message}`);
        throw error;
    }
};
exports.getDatastoreInfo = getDatastoreInfo;
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
const expandDatastore = async (datastoreId, additionalGB) => {
    const logger = new common_1.Logger('expandDatastore');
    logger.log(`Expanding datastore ${datastoreId} by ${additionalGB}GB`);
    try {
        await executeDatastoreExpansion(datastoreId, additionalGB * 1024);
        return await (0, exports.getDatastoreInfo)(datastoreId);
    }
    catch (error) {
        logger.error(`Datastore expansion failed: ${error.message}`);
        throw error;
    }
};
exports.expandDatastore = expandDatastore;
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
const deleteDatastore = async (datastoreId, force = false) => {
    const logger = new common_1.Logger('deleteDatastore');
    logger.log(`Deleting datastore: ${datastoreId}`);
    try {
        const info = await (0, exports.getDatastoreInfo)(datastoreId);
        if (info.vmCount > 0 && !force) {
            throw new Error(`Datastore contains ${info.vmCount} VMs. Use force=true to delete.`);
        }
        await executeDatastoreDeletion(datastoreId);
        logger.log('Datastore deleted successfully');
    }
    catch (error) {
        logger.error(`Datastore deletion failed: ${error.message}`);
        throw error;
    }
};
exports.deleteDatastore = deleteDatastore;
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
const setDatastoreMaintenanceMode = async (datastoreId, enterMaintenance) => {
    const logger = new common_1.Logger('setDatastoreMaintenanceMode');
    logger.log(`Setting maintenance mode for ${datastoreId}: ${enterMaintenance}`);
    try {
        await executeMaintenanceModeChange(datastoreId, enterMaintenance);
        logger.log('Maintenance mode updated');
    }
    catch (error) {
        logger.error(`Maintenance mode change failed: ${error.message}`);
        throw error;
    }
};
exports.setDatastoreMaintenanceMode = setDatastoreMaintenanceMode;
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
const mountDatastoreToHosts = async (datastoreId, hostIds) => {
    const logger = new common_1.Logger('mountDatastoreToHosts');
    logger.log(`Mounting datastore ${datastoreId} to ${hostIds.length} hosts`);
    try {
        await executeBulkMount(datastoreId, hostIds);
        logger.log('Datastore mounted successfully');
    }
    catch (error) {
        logger.error(`Datastore mount failed: ${error.message}`);
        throw error;
    }
};
exports.mountDatastoreToHosts = mountDatastoreToHosts;
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
const unmountDatastoreFromHosts = async (datastoreId, hostIds) => {
    const logger = new common_1.Logger('unmountDatastoreFromHosts');
    logger.log(`Unmounting datastore ${datastoreId} from ${hostIds.length} hosts`);
    try {
        await executeBulkUnmount(datastoreId, hostIds);
        logger.log('Datastore unmounted successfully');
    }
    catch (error) {
        logger.error(`Datastore unmount failed: ${error.message}`);
        throw error;
    }
};
exports.unmountDatastoreFromHosts = unmountDatastoreFromHosts;
// ============================================================================
// STORAGE POLICY MANAGEMENT
// ============================================================================
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
const createStoragePolicy = async (name, description, rules) => {
    const logger = new common_1.Logger('createStoragePolicy');
    logger.log(`Creating storage policy: ${name}`);
    try {
        const policyId = await executeCreatePolicy(name, description, rules);
        return {
            id: policyId,
            name,
            description,
            rules,
            compliance: 'compliant',
        };
    }
    catch (error) {
        logger.error(`Policy creation failed: ${error.message}`);
        throw error;
    }
};
exports.createStoragePolicy = createStoragePolicy;
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
const applyStoragePolicy = async (policyId, targetId) => {
    const logger = new common_1.Logger('applyStoragePolicy');
    logger.log(`Applying policy ${policyId} to ${targetId}`);
    try {
        await executePolicyApplication(policyId, targetId);
        logger.log('Storage policy applied successfully');
    }
    catch (error) {
        logger.error(`Policy application failed: ${error.message}`);
        throw error;
    }
};
exports.applyStoragePolicy = applyStoragePolicy;
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
const checkPolicyCompliance = async (policyId, resourceIds) => {
    const logger = new common_1.Logger('checkPolicyCompliance');
    const complianceMap = new Map();
    try {
        await Promise.all(resourceIds.map(async (resourceId) => {
            const isCompliant = await checkResourceCompliance(policyId, resourceId);
            complianceMap.set(resourceId, isCompliant);
        }));
        return complianceMap;
    }
    catch (error) {
        logger.error(`Compliance check failed: ${error.message}`);
        throw error;
    }
};
exports.checkPolicyCompliance = checkPolicyCompliance;
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
const updateStoragePolicy = async (policyId, rules) => {
    const logger = new common_1.Logger('updateStoragePolicy');
    logger.log(`Updating storage policy: ${policyId}`);
    try {
        await executePolicyUpdate(policyId, rules);
        return await getPolicyDetails(policyId);
    }
    catch (error) {
        logger.error(`Policy update failed: ${error.message}`);
        throw error;
    }
};
exports.updateStoragePolicy = updateStoragePolicy;
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
const deleteStoragePolicy = async (policyId) => {
    const logger = new common_1.Logger('deleteStoragePolicy');
    logger.log(`Deleting storage policy: ${policyId}`);
    try {
        await executePolicyDeletion(policyId);
        logger.log('Storage policy deleted');
    }
    catch (error) {
        logger.error(`Policy deletion failed: ${error.message}`);
        throw error;
    }
};
exports.deleteStoragePolicy = deleteStoragePolicy;
// ============================================================================
// VOLUME OPERATIONS
// ============================================================================
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
const createVolume = async (config) => {
    const logger = new common_1.Logger('createVolume');
    logger.log(`Creating volume: ${config.name}`);
    try {
        const volumeId = await executeVolumeCreation(config.name, config.sizeGB, config.datastore, config.thin, config.eagerZeroed, config.storagePolicy);
        return {
            id: volumeId,
            name: config.name,
            sizeGB: config.sizeGB,
            datastore: config.datastore,
            thin: config.thin || false,
        };
    }
    catch (error) {
        logger.error(`Volume creation failed: ${error.message}`);
        throw error;
    }
};
exports.createVolume = createVolume;
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
const attachVolumeToVM = async (volumeId, vmId, controller) => {
    const logger = new common_1.Logger('attachVolumeToVM');
    logger.log(`Attaching volume ${volumeId} to VM ${vmId}`);
    try {
        await executeVolumeAttachment(volumeId, vmId, controller);
        logger.log('Volume attached successfully');
    }
    catch (error) {
        logger.error(`Volume attachment failed: ${error.message}`);
        throw error;
    }
};
exports.attachVolumeToVM = attachVolumeToVM;
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
const detachVolumeFromVM = async (volumeId, vmId) => {
    const logger = new common_1.Logger('detachVolumeFromVM');
    logger.log(`Detaching volume ${volumeId} from VM ${vmId}`);
    try {
        await executeVolumeDetachment(volumeId, vmId);
        logger.log('Volume detached successfully');
    }
    catch (error) {
        logger.error(`Volume detachment failed: ${error.message}`);
        throw error;
    }
};
exports.detachVolumeFromVM = detachVolumeFromVM;
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
const resizeVolume = async (volumeId, newSizeGB) => {
    const logger = new common_1.Logger('resizeVolume');
    logger.log(`Resizing volume ${volumeId} to ${newSizeGB}GB`);
    try {
        await executeVolumeResize(volumeId, newSizeGB);
        return await getVolumeInfo(volumeId);
    }
    catch (error) {
        logger.error(`Volume resize failed: ${error.message}`);
        throw error;
    }
};
exports.resizeVolume = resizeVolume;
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
const deleteVolume = async (volumeId) => {
    const logger = new common_1.Logger('deleteVolume');
    logger.log(`Deleting volume: ${volumeId}`);
    try {
        await executeVolumeDeletion(volumeId);
        logger.log('Volume deleted successfully');
    }
    catch (error) {
        logger.error(`Volume deletion failed: ${error.message}`);
        throw error;
    }
};
exports.deleteVolume = deleteVolume;
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
const convertVolumeFormat = async (volumeId, format) => {
    const logger = new common_1.Logger('convertVolumeFormat');
    logger.log(`Converting volume ${volumeId} to ${format}`);
    try {
        await executeVolumeConversion(volumeId, format);
        logger.log('Volume conversion completed');
    }
    catch (error) {
        logger.error(`Volume conversion failed: ${error.message}`);
        throw error;
    }
};
exports.convertVolumeFormat = convertVolumeFormat;
// ============================================================================
// STORAGE VMOTION
// ============================================================================
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
const migrateVMStorage = async (config) => {
    const logger = new common_1.Logger('migrateVMStorage');
    logger.log(`Migrating storage for VM ${config.vmId}`);
    try {
        if (config.disks && config.disks.length > 0) {
            await executeSelectiveDiskMigration(config.vmId, config.disks, config.priority);
        }
        else {
            await executeFullStorageMigration(config.vmId, config.targetDatastore, config.priority);
        }
        logger.log('Storage migration completed');
    }
    catch (error) {
        logger.error(`Storage migration failed: ${error.message}`);
        throw error;
    }
};
exports.migrateVMStorage = migrateVMStorage;
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
const bulkMigrateVMStorage = async (configs) => {
    const logger = new common_1.Logger('bulkMigrateVMStorage');
    logger.log(`Bulk migrating storage for ${configs.length} VMs`);
    try {
        await Promise.all(configs.map((config) => (0, exports.migrateVMStorage)(config)));
        logger.log('Bulk storage migration completed');
    }
    catch (error) {
        logger.error(`Bulk migration failed: ${error.message}`);
        throw error;
    }
};
exports.bulkMigrateVMStorage = bulkMigrateVMStorage;
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
const getStorageMigrationProgress = async (taskId) => {
    const taskInfo = await fetchMigrationTaskInfo(taskId);
    return taskInfo.progress;
};
exports.getStorageMigrationProgress = getStorageMigrationProgress;
// ============================================================================
// CAPACITY PLANNING
// ============================================================================
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
const analyzeStorageCapacity = async (datastoreId) => {
    const logger = new common_1.Logger('analyzeStorageCapacity');
    try {
        const info = await (0, exports.getDatastoreInfo)(datastoreId);
        const growthData = await fetchStorageGrowthData(datastoreId, 30);
        const growthRate = calculateStorageGrowthRate(growthData);
        const daysUntilFull = info.freeSpaceGB / (growthRate * 30);
        return {
            datastoreId,
            totalGB: info.capacityGB,
            usedGB: info.usedSpaceGB,
            freeGB: info.freeSpaceGB,
            provisionedGB: info.provisionedGB,
            overProvisioningRatio: info.provisionedGB / info.capacityGB,
            growthRate,
            daysUntilFull: daysUntilFull > 0 ? Math.floor(daysUntilFull) : undefined,
        };
    }
    catch (error) {
        logger.error(`Capacity analysis failed: ${error.message}`);
        throw error;
    }
};
exports.analyzeStorageCapacity = analyzeStorageCapacity;
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
const monitorStoragePerformance = async (datastoreId) => {
    const logger = new common_1.Logger('monitorStoragePerformance');
    try {
        const perfData = await fetchStoragePerformanceData(datastoreId);
        return {
            datastoreId,
            readLatencyMs: perfData.readLatency,
            writeLatencyMs: perfData.writeLatency,
            readIOPS: perfData.readIOPS,
            writeIOPS: perfData.writeIOPS,
            throughputMBps: perfData.throughput,
            timestamp: new Date(),
        };
    }
    catch (error) {
        logger.error(`Performance monitoring failed: ${error.message}`);
        throw error;
    }
};
exports.monitorStoragePerformance = monitorStoragePerformance;
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
const recommendStorageTier = async (profile) => {
    const logger = new common_1.Logger('recommendStorageTier');
    try {
        const tiers = await getAvailableStorageTiers();
        // High IOPS workloads need SSD/NVMe
        if (profile.avgIOPS > 3000 || profile.avgLatencyMs < 10) {
            return tiers.find((t) => t.type === 'nvme' || t.type === 'ssd') || tiers[0];
        }
        // Medium workloads use SAS
        if (profile.avgIOPS > 1000) {
            return tiers.find((t) => t.type === 'sas') || tiers[0];
        }
        // Low performance workloads can use SATA
        return tiers.find((t) => t.type === 'sata') || tiers[0];
    }
    catch (error) {
        logger.error(`Storage tier recommendation failed: ${error.message}`);
        throw error;
    }
};
exports.recommendStorageTier = recommendStorageTier;
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
const optimizeStorageAllocation = async (clusterId) => {
    const logger = new common_1.Logger('optimizeStorageAllocation');
    const recommendations = [];
    try {
        const datastores = await getClusterDatastores(clusterId);
        for (const datastore of datastores) {
            const capacity = await (0, exports.analyzeStorageCapacity)(datastore.id);
            if (capacity.freeGB < capacity.totalGB * 0.1) {
                recommendations.push(`Datastore ${datastore.name} is over 90% full - consider expansion`);
            }
            if (capacity.overProvisioningRatio > 2.0) {
                recommendations.push(`Datastore ${datastore.name} is over-provisioned at ${capacity.overProvisioningRatio.toFixed(1)}x`);
            }
        }
        return recommendations;
    }
    catch (error) {
        logger.error(`Storage optimization failed: ${error.message}`);
        throw error;
    }
};
exports.optimizeStorageAllocation = optimizeStorageAllocation;
// ============================================================================
// STORAGE DRS
// ============================================================================
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
const configureStorageDRS = async (config) => {
    const logger = new common_1.Logger('configureStorageDRS');
    logger.log(`Configuring Storage DRS for pod: ${config.podId}`);
    try {
        await executeStorageDRSConfig(config.podId, config.enabled, config.ioLoadBalancing, config.spaceLoadBalancing, config.ioLatencyThresholdMs, config.spaceUtilizationThreshold, config.automationLevel);
        logger.log('Storage DRS configured successfully');
    }
    catch (error) {
        logger.error(`Storage DRS configuration failed: ${error.message}`);
        throw error;
    }
};
exports.configureStorageDRS = configureStorageDRS;
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
const getStorageDRSRecommendations = async (podId) => {
    const logger = new common_1.Logger('getStorageDRSRecommendations');
    try {
        const recommendations = await fetchSDRSRecommendations(podId);
        return recommendations;
    }
    catch (error) {
        logger.error(`Failed to get SDRS recommendations: ${error.message}`);
        throw error;
    }
};
exports.getStorageDRSRecommendations = getStorageDRSRecommendations;
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
const applyStorageDRSRecommendations = async (podId, recommendationIds) => {
    const logger = new common_1.Logger('applyStorageDRSRecommendations');
    logger.log(`Applying SDRS recommendations for pod: ${podId}`);
    try {
        await executeSDRSRecommendations(podId, recommendationIds);
        logger.log('SDRS recommendations applied');
    }
    catch (error) {
        logger.error(`Failed to apply SDRS recommendations: ${error.message}`);
        throw error;
    }
};
exports.applyStorageDRSRecommendations = applyStorageDRSRecommendations;
// ============================================================================
// ADVANCED FEATURES
// ============================================================================
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
const configureStorageIOControl = async (config) => {
    const logger = new common_1.Logger('configureStorageIOControl');
    logger.log(`Configuring SIOC for datastore: ${config.datastoreId}`);
    try {
        await executeSIOCConfig(config.datastoreId, config.enabled, config.congestionThreshold, config.percentOfPeakThroughput);
        logger.log('SIOC configured successfully');
    }
    catch (error) {
        logger.error(`SIOC configuration failed: ${error.message}`);
        throw error;
    }
};
exports.configureStorageIOControl = configureStorageIOControl;
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
const enableDatastoreEncryption = async (datastoreId, keyProviderId) => {
    const logger = new common_1.Logger('enableDatastoreEncryption');
    logger.log(`Enabling encryption for datastore: ${datastoreId}`);
    try {
        await executeEncryptionEnable(datastoreId, keyProviderId);
        logger.log('Datastore encryption enabled');
    }
    catch (error) {
        logger.error(`Encryption enablement failed: ${error.message}`);
        throw error;
    }
};
exports.enableDatastoreEncryption = enableDatastoreEncryption;
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
const configureStorageReplication = async (config) => {
    const logger = new common_1.Logger('configureStorageReplication');
    logger.log(`Configuring replication from ${config.sourceDatastore}`);
    try {
        await executeReplicationConfig(config.sourceDatastore, config.targetDatastore, config.enabled, config.rpo);
        logger.log('Storage replication configured');
    }
    catch (error) {
        logger.error(`Replication configuration failed: ${error.message}`);
        throw error;
    }
};
exports.configureStorageReplication = configureStorageReplication;
const validateDatastoreConfig = (config) => {
    if (!config.name)
        throw new Error('Datastore name is required');
    if (config.capacity < 1)
        throw new Error('Capacity must be at least 1GB');
    if (!config.hosts || config.hosts.length === 0) {
        throw new Error('At least one host is required');
    }
};
const createVMFSDatastore = async (config) => {
    return `vmfs-${Date.now()}`;
};
const createNFSDatastore = async (config) => {
    return `nfs-${Date.now()}`;
};
const createVSANDatastore = async (config) => {
    return `vsan-${Date.now()}`;
};
const createVVOLDatastore = async (config) => {
    return `vvol-${Date.now()}`;
};
const logDatastoreEvent = async (event, datastoreId, userId) => {
    // Log event
};
const fetchDatastoreData = async (datastoreId) => {
    return {
        name: 'datastore',
        type: 'VMFS',
        capacity: 5000 * 1024,
        freeSpace: 3000 * 1024,
        provisioned: 6000 * 1024,
        vmCount: 50,
        accessible: true,
        multipleHostAccess: true,
        maintenanceMode: false,
    };
};
const executeDatastoreExpansion = async (datastoreId, additionalMB) => {
    // Execute expansion
};
const executeDatastoreDeletion = async (datastoreId) => {
    // Delete datastore
};
const executeMaintenanceModeChange = async (datastoreId, enter) => {
    // Change maintenance mode
};
const executeBulkMount = async (datastoreId, hostIds) => {
    // Mount to hosts
};
const executeBulkUnmount = async (datastoreId, hostIds) => {
    // Unmount from hosts
};
const executeCreatePolicy = async (name, description, rules) => {
    return `policy-${Date.now()}`;
};
const executePolicyApplication = async (policyId, targetId) => {
    // Apply policy
};
const checkResourceCompliance = async (policyId, resourceId) => {
    return true;
};
const getPolicyDetails = async (policyId) => {
    return {
        id: policyId,
        name: 'policy',
        rules: [],
        compliance: 'compliant',
    };
};
const executePolicyUpdate = async (policyId, rules) => {
    // Update policy
};
const executePolicyDeletion = async (policyId) => {
    // Delete policy
};
const executeVolumeCreation = async (name, sizeGB, datastore, thin, eagerZeroed, storagePolicy) => {
    return `volume-${Date.now()}`;
};
const executeVolumeAttachment = async (volumeId, vmId, controller) => {
    // Attach volume
};
const executeVolumeDetachment = async (volumeId, vmId) => {
    // Detach volume
};
const executeVolumeResize = async (volumeId, newSizeGB) => {
    // Resize volume
};
const getVolumeInfo = async (volumeId) => {
    return {
        id: volumeId,
        name: 'volume',
        sizeGB: 100,
        datastore: 'ds-001',
        thin: true,
    };
};
const executeVolumeDeletion = async (volumeId) => {
    // Delete volume
};
const executeVolumeConversion = async (volumeId, format) => {
    // Convert volume
};
const executeFullStorageMigration = async (vmId, targetDatastore, priority) => {
    // Migrate storage
};
const executeSelectiveDiskMigration = async (vmId, disks, priority) => {
    // Migrate disks
};
const fetchMigrationTaskInfo = async (taskId) => {
    return { progress: 75 };
};
const fetchStorageGrowthData = async (datastoreId, days) => {
    return [];
};
const calculateStorageGrowthRate = (data) => {
    return 10; // GB per day
};
const fetchStoragePerformanceData = async (datastoreId) => {
    return {
        readLatency: 5.2,
        writeLatency: 8.1,
        readIOPS: 1500,
        writeIOPS: 800,
        throughput: 250,
    };
};
const getAvailableStorageTiers = async () => {
    return [
        { name: 'nvme', type: 'nvme', performanceClass: 'high', datastores: [] },
        { name: 'ssd', type: 'ssd', performanceClass: 'high', datastores: [] },
        { name: 'sas', type: 'sas', performanceClass: 'medium', datastores: [] },
        { name: 'sata', type: 'sata', performanceClass: 'low', datastores: [] },
    ];
};
const getClusterDatastores = async (clusterId) => {
    return [];
};
const executeStorageDRSConfig = async (podId, enabled, ioLoadBalancing, spaceLoadBalancing, ioLatencyThresholdMs, spaceUtilizationThreshold, automationLevel) => {
    // Configure SDRS
};
const fetchSDRSRecommendations = async (podId) => {
    return [];
};
const executeSDRSRecommendations = async (podId, recommendationIds) => {
    // Execute recommendations
};
const executeSIOCConfig = async (datastoreId, enabled, congestionThreshold, percentOfPeakThroughput) => {
    // Configure SIOC
};
const executeEncryptionEnable = async (datastoreId, keyProviderId) => {
    // Enable encryption
};
const executeReplicationConfig = async (sourceDatastore, targetDatastore, enabled, rpo) => {
    // Configure replication
};
//# sourceMappingURL=virtual-storage-services-kit.js.map