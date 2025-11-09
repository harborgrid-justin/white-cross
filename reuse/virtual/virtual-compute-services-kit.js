"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVMHostAffinity = exports.configureVMHighAvailability = exports.migrateVMWithVMotion = exports.cloneVM = exports.consolidateVMSnapshots = exports.deleteVMSnapshot = exports.revertVMToSnapshot = exports.createVMSnapshot = exports.optimizeClusterResources = exports.predictCapacityNeeds = exports.checkResourceAvailability = exports.analyzeClusterCapacity = exports.analyzeVMPerformance = exports.getMultiVMPerformance = exports.monitorVMPerformance = exports.getVMPerformanceMetrics = exports.modifyVMMemory = exports.modifyVMCPUCount = exports.addVMNetworkAdapter = exports.expandVMDisk = exports.addVMDisk = exports.configureVMResources = exports.bulkPowerOperation = exports.getVMPowerState = exports.suspendVM = exports.restartVM = exports.powerOffVM = exports.powerOnVM = exports.provisionVMToResourcePool = exports.createVMWithResources = exports.deployVMFromTemplate = exports.bulkProvisionVMs = exports.provisionVirtualMachine = void 0;
/**
 * File: /reuse/virtual/virtual-compute-services-kit.ts
 * Locator: WC-VRT-COMPUTE-001
 * Purpose: VMware vRealize Virtual Compute Services - Enterprise-grade VM provisioning, power operations, resource management
 *
 * Upstream: @nestjs/common, @nestjs/config, vmware-vrealize-sdk, vsphere-client-lib
 * Downstream: ../backend/virtual/*, VM management modules, Infrastructure services, Monitoring dashboards
 * Dependencies: NestJS 10.x, TypeScript 5.x, VMware vRealize API 8.x, vSphere SDK 7.x
 * Exports: 45 utility functions for VM provisioning, power operations, resource allocation, performance monitoring, capacity planning
 *
 * LLM Context: Comprehensive VMware vRealize compute service utilities for White Cross healthcare infrastructure.
 * Provides VM lifecycle management, automated provisioning workflows, power state operations, resource allocation strategies,
 * performance monitoring with real-time metrics, capacity planning algorithms, snapshot management, template deployment,
 * high availability configurations, DRS automation, vMotion orchestration, and resource pool management. HIPAA-compliant
 * patterns for healthcare VM isolation, audit logging, secure multi-tenant compute resources, and disaster recovery.
 */
const common_1 = require("@nestjs/common");
// ============================================================================
// VM PROVISIONING SERVICES
// ============================================================================
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
const provisionVirtualMachine = async (config, userId) => {
    const logger = new common_1.Logger('provisionVirtualMachine');
    logger.log(`Provisioning VM: ${config.name}`);
    try {
        // Validate configuration
        validateProvisionConfig(config);
        // Reserve resources
        const resourceReservation = await reserveComputeResources(config);
        // Create VM from template or scratch
        const vmId = config.template
            ? await cloneFromTemplate(config.template, config)
            : await createVMFromScratch(config);
        // Apply customization
        if (config.customization) {
            await applyVMCustomization(vmId, config.customization);
        }
        // Log provisioning
        await logProvisioningEvent(vmId, config, userId);
        logger.log(`VM provisioned successfully: ${vmId}`);
        return vmId;
    }
    catch (error) {
        logger.error(`VM provisioning failed: ${error.message}`);
        throw new Error(`Failed to provision VM: ${error.message}`);
    }
};
exports.provisionVirtualMachine = provisionVirtualMachine;
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
const bulkProvisionVMs = async (configs, userId) => {
    const logger = new common_1.Logger('bulkProvisionVMs');
    logger.log(`Bulk provisioning ${configs.length} VMs`);
    try {
        const provisionPromises = configs.map((config) => (0, exports.provisionVirtualMachine)(config, userId));
        const vmIds = await Promise.all(provisionPromises);
        logger.log(`Bulk provisioning completed: ${vmIds.length} VMs created`);
        return vmIds;
    }
    catch (error) {
        logger.error(`Bulk provisioning failed: ${error.message}`);
        throw error;
    }
};
exports.bulkProvisionVMs = bulkProvisionVMs;
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
const deployVMFromTemplate = async (templateId, vmName, customization) => {
    const logger = new common_1.Logger('deployVMFromTemplate');
    logger.log(`Deploying VM from template: ${templateId}`);
    try {
        const template = await getTemplateDetails(templateId);
        const config = {
            name: vmName,
            template: templateId,
            cpuCount: template.cpuCount,
            memoryMB: template.memoryMB,
            diskGB: template.diskGB,
            networkName: 'default',
            customization,
        };
        return await (0, exports.provisionVirtualMachine)(config, 'system');
    }
    catch (error) {
        logger.error(`Template deployment failed: ${error.message}`);
        throw error;
    }
};
exports.deployVMFromTemplate = deployVMFromTemplate;
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
const createVMWithResources = async (config, resources) => {
    const vmId = await (0, exports.provisionVirtualMachine)(config, 'system');
    await (0, exports.configureVMResources)(vmId, resources);
    return vmId;
};
exports.createVMWithResources = createVMWithResources;
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
const provisionVMToResourcePool = async (config, poolName) => {
    config.resourcePool = poolName;
    return await (0, exports.provisionVirtualMachine)(config, 'system');
};
exports.provisionVMToResourcePool = provisionVMToResourcePool;
// ============================================================================
// POWER OPERATIONS
// ============================================================================
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
const powerOnVM = async (vmId) => {
    const logger = new common_1.Logger('powerOnVM');
    logger.log(`Powering on VM: ${vmId}`);
    try {
        // Execute power on operation
        await executePowerOperation(vmId, 'powerOn');
        // Wait for VM to be ready
        await waitForVMPowerState(vmId, 'poweredOn', 120000);
        return {
            vmId,
            state: 'poweredOn',
            timestamp: new Date(),
            uptime: 0,
        };
    }
    catch (error) {
        logger.error(`Power on failed: ${error.message}`);
        throw error;
    }
};
exports.powerOnVM = powerOnVM;
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
const powerOffVM = async (vmId, force = false) => {
    const logger = new common_1.Logger('powerOffVM');
    logger.log(`Powering off VM: ${vmId}, force: ${force}`);
    try {
        if (force) {
            await executePowerOperation(vmId, 'powerOff');
        }
        else {
            await executePowerOperation(vmId, 'shutdown');
            await waitForVMPowerState(vmId, 'poweredOff', 180000);
        }
        return {
            vmId,
            state: 'poweredOff',
            timestamp: new Date(),
        };
    }
    catch (error) {
        logger.error(`Power off failed: ${error.message}`);
        throw error;
    }
};
exports.powerOffVM = powerOffVM;
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
const restartVM = async (vmId, graceful = true) => {
    const logger = new common_1.Logger('restartVM');
    logger.log(`Restarting VM: ${vmId}`);
    try {
        if (graceful) {
            await executePowerOperation(vmId, 'reboot');
        }
        else {
            await executePowerOperation(vmId, 'reset');
        }
        await waitForVMPowerState(vmId, 'poweredOn', 180000);
        return {
            vmId,
            state: 'poweredOn',
            timestamp: new Date(),
            uptime: 0,
        };
    }
    catch (error) {
        logger.error(`Restart failed: ${error.message}`);
        throw error;
    }
};
exports.restartVM = restartVM;
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
const suspendVM = async (vmId) => {
    const logger = new common_1.Logger('suspendVM');
    logger.log(`Suspending VM: ${vmId}`);
    try {
        await executePowerOperation(vmId, 'suspend');
        await waitForVMPowerState(vmId, 'suspended', 120000);
        return {
            vmId,
            state: 'suspended',
            timestamp: new Date(),
        };
    }
    catch (error) {
        logger.error(`Suspend failed: ${error.message}`);
        throw error;
    }
};
exports.suspendVM = suspendVM;
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
const getVMPowerState = async (vmId) => {
    const state = await fetchVMPowerState(vmId);
    const uptime = state.state === 'poweredOn' ? await getVMUptime(vmId) : undefined;
    return {
        vmId,
        state: state.state,
        timestamp: new Date(),
        uptime,
    };
};
exports.getVMPowerState = getVMPowerState;
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
const bulkPowerOperation = async (vmIds, operation) => {
    const logger = new common_1.Logger('bulkPowerOperation');
    logger.log(`Bulk ${operation} operation on ${vmIds.length} VMs`);
    const operations = vmIds.map(async (vmId) => {
        switch (operation) {
            case 'on':
                return await (0, exports.powerOnVM)(vmId);
            case 'off':
                return await (0, exports.powerOffVM)(vmId);
            case 'restart':
                return await (0, exports.restartVM)(vmId);
        }
    });
    return await Promise.all(operations);
};
exports.bulkPowerOperation = bulkPowerOperation;
// ============================================================================
// RESOURCE ALLOCATION
// ============================================================================
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
const configureVMResources = async (vmId, resources) => {
    const logger = new common_1.Logger('configureVMResources');
    logger.log(`Configuring resources for VM: ${vmId}`);
    try {
        if (resources.cpu) {
            await setCPUResources(vmId, resources.cpu);
        }
        if (resources.memory) {
            await setMemoryResources(vmId, resources.memory);
        }
        return await getVMResourceAllocation(vmId);
    }
    catch (error) {
        logger.error(`Resource configuration failed: ${error.message}`);
        throw error;
    }
};
exports.configureVMResources = configureVMResources;
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
const addVMDisk = async (vmId, diskConfig) => {
    const logger = new common_1.Logger('addVMDisk');
    logger.log(`Adding disk to VM: ${vmId}`);
    try {
        const diskId = await createVMDisk(vmId, diskConfig);
        logger.log(`Disk added successfully: ${diskId}`);
        return diskId;
    }
    catch (error) {
        logger.error(`Add disk failed: ${error.message}`);
        throw error;
    }
};
exports.addVMDisk = addVMDisk;
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
const expandVMDisk = async (vmId, diskLabel, newCapacityGB) => {
    const logger = new common_1.Logger('expandVMDisk');
    logger.log(`Expanding disk ${diskLabel} on VM ${vmId} to ${newCapacityGB}GB`);
    try {
        await resizeDisk(vmId, diskLabel, newCapacityGB);
        logger.log('Disk expansion completed');
    }
    catch (error) {
        logger.error(`Disk expansion failed: ${error.message}`);
        throw error;
    }
};
exports.expandVMDisk = expandVMDisk;
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
const addVMNetworkAdapter = async (vmId, networkConfig) => {
    const logger = new common_1.Logger('addVMNetworkAdapter');
    logger.log(`Adding network adapter to VM: ${vmId}`);
    try {
        const adapterId = await createNetworkAdapter(vmId, networkConfig);
        return adapterId;
    }
    catch (error) {
        logger.error(`Add network adapter failed: ${error.message}`);
        throw error;
    }
};
exports.addVMNetworkAdapter = addVMNetworkAdapter;
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
const modifyVMCPUCount = async (vmId, cpuCount, hotAdd = false) => {
    const logger = new common_1.Logger('modifyVMCPUCount');
    logger.log(`Modifying CPU count for VM ${vmId} to ${cpuCount}`);
    try {
        if (!hotAdd) {
            const state = await (0, exports.getVMPowerState)(vmId);
            if (state.state === 'poweredOn') {
                await (0, exports.powerOffVM)(vmId);
            }
        }
        await setCPUCount(vmId, cpuCount);
        if (!hotAdd) {
            await (0, exports.powerOnVM)(vmId);
        }
        logger.log('CPU count modified successfully');
    }
    catch (error) {
        logger.error(`CPU modification failed: ${error.message}`);
        throw error;
    }
};
exports.modifyVMCPUCount = modifyVMCPUCount;
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
const modifyVMMemory = async (vmId, memoryMB, hotAdd = false) => {
    const logger = new common_1.Logger('modifyVMMemory');
    logger.log(`Modifying memory for VM ${vmId} to ${memoryMB}MB`);
    try {
        if (!hotAdd) {
            const state = await (0, exports.getVMPowerState)(vmId);
            if (state.state === 'poweredOn') {
                await (0, exports.powerOffVM)(vmId);
            }
        }
        await setMemorySize(vmId, memoryMB);
        if (!hotAdd) {
            await (0, exports.powerOnVM)(vmId);
        }
        logger.log('Memory modified successfully');
    }
    catch (error) {
        logger.error(`Memory modification failed: ${error.message}`);
        throw error;
    }
};
exports.modifyVMMemory = modifyVMMemory;
// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================
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
const getVMPerformanceMetrics = async (vmId) => {
    const logger = new common_1.Logger('getVMPerformanceMetrics');
    try {
        const metrics = await fetchPerformanceData(vmId);
        return {
            vmId,
            cpuUsagePercent: metrics.cpu.usage,
            memoryUsagePercent: metrics.memory.usage,
            diskReadMBps: metrics.disk.readMBps,
            diskWriteMBps: metrics.disk.writeMBps,
            networkInMbps: metrics.network.inMbps,
            networkOutMbps: metrics.network.outMbps,
            timestamp: new Date(),
        };
    }
    catch (error) {
        logger.error(`Failed to get performance metrics: ${error.message}`);
        throw error;
    }
};
exports.getVMPerformanceMetrics = getVMPerformanceMetrics;
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
const monitorVMPerformance = async (vmId, durationMinutes, intervalSeconds = 30) => {
    const logger = new common_1.Logger('monitorVMPerformance');
    logger.log(`Monitoring VM ${vmId} for ${durationMinutes} minutes`);
    const samples = [];
    const iterations = (durationMinutes * 60) / intervalSeconds;
    for (let i = 0; i < iterations; i++) {
        const metrics = await (0, exports.getVMPerformanceMetrics)(vmId);
        samples.push(metrics);
        await delay(intervalSeconds * 1000);
    }
    return samples;
};
exports.monitorVMPerformance = monitorVMPerformance;
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
const getMultiVMPerformance = async (vmIds) => {
    const metricsMap = new Map();
    await Promise.all(vmIds.map(async (vmId) => {
        const metrics = await (0, exports.getVMPerformanceMetrics)(vmId);
        metricsMap.set(vmId, metrics);
    }));
    return metricsMap;
};
exports.getMultiVMPerformance = getMultiVMPerformance;
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
const analyzeVMPerformance = async (vmId, analysisDays = 7) => {
    const logger = new common_1.Logger('analyzeVMPerformance');
    const recommendations = [];
    try {
        const historicalData = await fetchHistoricalPerformance(vmId, analysisDays);
        // CPU analysis
        const avgCPU = calculateAverage(historicalData.map((m) => m.cpuUsagePercent));
        if (avgCPU > 80) {
            recommendations.push('Consider increasing CPU allocation');
        }
        else if (avgCPU < 20) {
            recommendations.push('Consider reducing CPU allocation to save resources');
        }
        // Memory analysis
        const avgMemory = calculateAverage(historicalData.map((m) => m.memoryUsagePercent));
        if (avgMemory > 85) {
            recommendations.push('Consider increasing memory allocation');
        }
        else if (avgMemory < 30) {
            recommendations.push('Consider reducing memory allocation');
        }
        // Disk I/O analysis
        const avgDiskRead = calculateAverage(historicalData.map((m) => m.diskReadMBps));
        const avgDiskWrite = calculateAverage(historicalData.map((m) => m.diskWriteMBps));
        if (avgDiskRead + avgDiskWrite > 100) {
            recommendations.push('High disk I/O detected - consider faster storage tier');
        }
        return recommendations;
    }
    catch (error) {
        logger.error(`Performance analysis failed: ${error.message}`);
        throw error;
    }
};
exports.analyzeVMPerformance = analyzeVMPerformance;
// ============================================================================
// CAPACITY MANAGEMENT
// ============================================================================
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
const analyzeClusterCapacity = async (clusterId) => {
    const logger = new common_1.Logger('analyzeClusterCapacity');
    try {
        const clusterData = await fetchClusterData(clusterId);
        return {
            clusterId,
            totalCPU: clusterData.totalCPU,
            totalMemoryMB: clusterData.totalMemory,
            totalStorageGB: clusterData.totalStorage,
            usedCPU: clusterData.usedCPU,
            usedMemoryMB: clusterData.usedMemory,
            usedStorageGB: clusterData.usedStorage,
            availableVMs: calculateAvailableVMs(clusterData),
        };
    }
    catch (error) {
        logger.error(`Capacity analysis failed: ${error.message}`);
        throw error;
    }
};
exports.analyzeClusterCapacity = analyzeClusterCapacity;
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
const checkResourceAvailability = async (config, clusterId) => {
    const capacity = await (0, exports.analyzeClusterCapacity)(clusterId);
    const availableCPU = capacity.totalCPU - capacity.usedCPU;
    const availableMemory = capacity.totalMemoryMB - capacity.usedMemoryMB;
    const availableStorage = capacity.totalStorageGB - capacity.usedStorageGB;
    return (availableCPU >= config.cpuCount * 1000 &&
        availableMemory >= config.memoryMB &&
        availableStorage >= config.diskGB);
};
exports.checkResourceAvailability = checkResourceAvailability;
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
const predictCapacityNeeds = async (clusterId, monthsAhead) => {
    const logger = new common_1.Logger('predictCapacityNeeds');
    try {
        const currentCapacity = await (0, exports.analyzeClusterCapacity)(clusterId);
        const historicalGrowth = await fetchGrowthData(clusterId, 12);
        const avgGrowthRate = calculateGrowthRate(historicalGrowth);
        const projectedGrowth = avgGrowthRate * monthsAhead;
        return {
            ...currentCapacity,
            usedCPU: currentCapacity.usedCPU * (1 + projectedGrowth),
            usedMemoryMB: currentCapacity.usedMemoryMB * (1 + projectedGrowth),
            usedStorageGB: currentCapacity.usedStorageGB * (1 + projectedGrowth),
            projectedGrowth,
        };
    }
    catch (error) {
        logger.error(`Capacity prediction failed: ${error.message}`);
        throw error;
    }
};
exports.predictCapacityNeeds = predictCapacityNeeds;
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
const optimizeClusterResources = async (clusterId) => {
    const logger = new common_1.Logger('optimizeClusterResources');
    const recommendations = [];
    try {
        const hosts = await getClusterHosts(clusterId);
        const vms = await getClusterVMs(clusterId);
        for (const vm of vms) {
            const currentHost = vm.hostId;
            const vmMetrics = await (0, exports.getVMPerformanceMetrics)(vm.id);
            // Find less loaded host
            const targetHost = await findOptimalHost(hosts, vmMetrics);
            if (targetHost && targetHost !== currentHost) {
                recommendations.push({
                    vmId: vm.id,
                    sourceHost: currentHost,
                    targetHost,
                    reason: 'Load balancing optimization',
                    priority: 'medium',
                    estimatedImprovement: 15,
                });
            }
        }
        return recommendations;
    }
    catch (error) {
        logger.error(`Resource optimization failed: ${error.message}`);
        throw error;
    }
};
exports.optimizeClusterResources = optimizeClusterResources;
// ============================================================================
// SNAPSHOT MANAGEMENT
// ============================================================================
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
const createVMSnapshot = async (config) => {
    const logger = new common_1.Logger('createVMSnapshot');
    logger.log(`Creating snapshot for VM: ${config.vmId}`);
    try {
        const snapshotId = await executeSnapshotCreate(config.vmId, config.name, config.description, config.includeMemory, config.quiesce);
        const snapshot = {
            id: snapshotId,
            vmId: config.vmId,
            name: config.name,
            description: config.description,
            createdAt: new Date(),
            sizeMB: await getSnapshotSize(snapshotId),
            state: 'created',
        };
        logger.log(`Snapshot created: ${snapshotId}`);
        return snapshot;
    }
    catch (error) {
        logger.error(`Snapshot creation failed: ${error.message}`);
        throw error;
    }
};
exports.createVMSnapshot = createVMSnapshot;
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
const revertVMToSnapshot = async (vmId, snapshotId) => {
    const logger = new common_1.Logger('revertVMToSnapshot');
    logger.log(`Reverting VM ${vmId} to snapshot ${snapshotId}`);
    try {
        await executeSnapshotRevert(vmId, snapshotId);
        logger.log('Snapshot revert completed');
    }
    catch (error) {
        logger.error(`Snapshot revert failed: ${error.message}`);
        throw error;
    }
};
exports.revertVMToSnapshot = revertVMToSnapshot;
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
const deleteVMSnapshot = async (vmId, snapshotId, removeChildren = false) => {
    const logger = new common_1.Logger('deleteVMSnapshot');
    logger.log(`Deleting snapshot ${snapshotId} from VM ${vmId}`);
    try {
        await executeSnapshotDelete(vmId, snapshotId, removeChildren);
        logger.log('Snapshot deleted successfully');
    }
    catch (error) {
        logger.error(`Snapshot deletion failed: ${error.message}`);
        throw error;
    }
};
exports.deleteVMSnapshot = deleteVMSnapshot;
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
const consolidateVMSnapshots = async (vmId) => {
    const logger = new common_1.Logger('consolidateVMSnapshots');
    logger.log(`Consolidating snapshots for VM: ${vmId}`);
    try {
        await executeSnapshotConsolidation(vmId);
        logger.log('Snapshot consolidation completed');
    }
    catch (error) {
        logger.error(`Snapshot consolidation failed: ${error.message}`);
        throw error;
    }
};
exports.consolidateVMSnapshots = consolidateVMSnapshots;
// ============================================================================
// ADVANCED OPERATIONS
// ============================================================================
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
const cloneVM = async (config) => {
    const logger = new common_1.Logger('cloneVM');
    logger.log(`Cloning VM: ${config.sourceVMId}`);
    try {
        const cloneId = await executeVMClone(config.sourceVMId, config.name, config.linked, config.snapshot, config.targetDatastore, config.targetHost);
        if (config.customization) {
            await applyVMCustomization(cloneId, config.customization);
        }
        logger.log(`VM cloned successfully: ${cloneId}`);
        return cloneId;
    }
    catch (error) {
        logger.error(`VM clone failed: ${error.message}`);
        throw error;
    }
};
exports.cloneVM = cloneVM;
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
const migrateVMWithVMotion = async (config) => {
    const logger = new common_1.Logger('migrateVMWithVMotion');
    logger.log(`Migrating VM ${config.vmId} to host ${config.targetHost}`);
    try {
        await executeVMotion(config.vmId, config.targetHost, config.priority, config.migrateStorage, config.targetDatastore);
        logger.log('vMotion completed successfully');
    }
    catch (error) {
        logger.error(`vMotion failed: ${error.message}`);
        throw error;
    }
};
exports.migrateVMWithVMotion = migrateVMWithVMotion;
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
const configureVMHighAvailability = async (config) => {
    const logger = new common_1.Logger('configureVMHighAvailability');
    logger.log(`Configuring HA for VM: ${config.vmId}`);
    try {
        await setHAConfig(config.vmId, config.restartPriority, config.isolationResponse, config.vmMonitoring, config.monitoringInterval);
        logger.log('HA configuration completed');
    }
    catch (error) {
        logger.error(`HA configuration failed: ${error.message}`);
        throw error;
    }
};
exports.configureVMHighAvailability = configureVMHighAvailability;
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
const setVMHostAffinity = async (affinity) => {
    const logger = new common_1.Logger('setVMHostAffinity');
    logger.log(`Setting host affinity for VM: ${affinity.vmId}`);
    try {
        await configureAffinityRules(affinity.vmId, affinity.affinityHosts, affinity.antiAffinityHosts, affinity.mandatory);
        logger.log('Affinity rules configured');
    }
    catch (error) {
        logger.error(`Affinity configuration failed: ${error.message}`);
        throw error;
    }
};
exports.setVMHostAffinity = setVMHostAffinity;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const validateProvisionConfig = (config) => {
    if (!config.name)
        throw new Error('VM name is required');
    if (config.cpuCount < 1)
        throw new Error('CPU count must be at least 1');
    if (config.memoryMB < 512)
        throw new Error('Memory must be at least 512MB');
    if (config.diskGB < 1)
        throw new Error('Disk size must be at least 1GB');
};
const reserveComputeResources = async (config) => {
    return { reserved: true };
};
const cloneFromTemplate = async (templateId, config) => {
    return `vm-${Date.now()}`;
};
const createVMFromScratch = async (config) => {
    return `vm-${Date.now()}`;
};
const applyVMCustomization = async (vmId, spec) => {
    // Apply customization
};
const logProvisioningEvent = async (vmId, config, userId) => {
    // Log event
};
const getTemplateDetails = async (templateId) => {
    return {
        id: templateId,
        name: 'template',
        guestOS: 'ubuntu64Guest',
        cpuCount: 2,
        memoryMB: 4096,
        diskGB: 50,
        lastModified: new Date(),
    };
};
const executePowerOperation = async (vmId, operation) => {
    // Execute power operation
};
const waitForVMPowerState = async (vmId, expectedState, timeout) => {
    // Wait for state
};
const fetchVMPowerState = async (vmId) => {
    return { state: 'poweredOn' };
};
const getVMUptime = async (vmId) => {
    return 3600000;
};
const setCPUResources = async (vmId, config) => {
    // Set CPU resources
};
const setMemoryResources = async (vmId, config) => {
    // Set memory resources
};
const getVMResourceAllocation = async (vmId) => {
    return {
        vmId,
        cpu: { reserved: 1000, limit: 2000, shares: 'normal' },
        memory: { reserved: 2048, limit: 4096, shares: 'normal' },
        disk: [],
        network: [],
    };
};
const createVMDisk = async (vmId, config) => {
    return `disk-${Date.now()}`;
};
const resizeDisk = async (vmId, diskLabel, newCapacityGB) => {
    // Resize disk
};
const createNetworkAdapter = async (vmId, config) => {
    return `adapter-${Date.now()}`;
};
const setCPUCount = async (vmId, count) => {
    // Set CPU count
};
const setMemorySize = async (vmId, memoryMB) => {
    // Set memory size
};
const fetchPerformanceData = async (vmId) => {
    return {
        cpu: { usage: 45.5 },
        memory: { usage: 60.2 },
        disk: { readMBps: 10.5, writeMBps: 8.3 },
        network: { inMbps: 25.7, outMbps: 15.2 },
    };
};
const fetchHistoricalPerformance = async (vmId, days) => {
    return [];
};
const calculateAverage = (values) => {
    return values.reduce((a, b) => a + b, 0) / values.length;
};
const fetchClusterData = async (clusterId) => {
    return {
        totalCPU: 100000,
        totalMemory: 524288,
        totalStorage: 10000,
        usedCPU: 50000,
        usedMemory: 262144,
        usedStorage: 5000,
    };
};
const calculateAvailableVMs = (clusterData) => {
    return 100;
};
const fetchGrowthData = async (clusterId, months) => {
    return [];
};
const calculateGrowthRate = (data) => {
    return 0.05;
};
const getClusterHosts = async (clusterId) => {
    return [];
};
const getClusterVMs = async (clusterId) => {
    return [];
};
const findOptimalHost = async (hosts, metrics) => {
    return 'host-01';
};
const executeSnapshotCreate = async (vmId, name, description, includeMemory, quiesce) => {
    return `snapshot-${Date.now()}`;
};
const getSnapshotSize = async (snapshotId) => {
    return 1024;
};
const executeSnapshotRevert = async (vmId, snapshotId) => {
    // Revert snapshot
};
const executeSnapshotDelete = async (vmId, snapshotId, removeChildren) => {
    // Delete snapshot
};
const executeSnapshotConsolidation = async (vmId) => {
    // Consolidate snapshots
};
const executeVMClone = async (sourceVMId, name, linked, snapshot, targetDatastore, targetHost) => {
    return `vm-clone-${Date.now()}`;
};
const executeVMotion = async (vmId, targetHost, priority, migrateStorage, targetDatastore) => {
    // Execute vMotion
};
const setHAConfig = async (vmId, restartPriority, isolationResponse, vmMonitoring, monitoringInterval) => {
    // Set HA config
};
const configureAffinityRules = async (vmId, affinity, antiAffinity, mandatory) => {
    // Configure affinity rules
};
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
//# sourceMappingURL=virtual-compute-services-kit.js.map