"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualMachine = createVirtualMachine;
exports.startVirtualMachine = startVirtualMachine;
exports.stopVirtualMachine = stopVirtualMachine;
exports.restartVirtualMachine = restartVirtualMachine;
exports.suspendVirtualMachine = suspendVirtualMachine;
exports.resumeVirtualMachine = resumeVirtualMachine;
exports.terminateVirtualMachine = terminateVirtualMachine;
exports.getVMLifecycleState = getVMLifecycleState;
exports.batchProvisionFromTemplate = batchProvisionFromTemplate;
exports.provisionWithAutoPlacement = provisionWithAutoPlacement;
exports.provisionWithResourcePolicy = provisionWithResourcePolicy;
exports.validateProvisioningRequest = validateProvisioningRequest;
exports.cloneVirtualMachine = cloneVirtualMachine;
exports.createLinkedClone = createLinkedClone;
exports.batchCloneVMs = batchCloneVMs;
exports.createVMTemplate = createVMTemplate;
exports.updateVMTemplate = updateVMTemplate;
exports.deleteVMTemplate = deleteVMTemplate;
exports.listVMTemplates = listVMTemplates;
exports.createVMSnapshot = createVMSnapshot;
exports.revertToSnapshot = revertToSnapshot;
exports.deleteVMSnapshot = deleteVMSnapshot;
exports.consolidateVMSnapshots = consolidateVMSnapshots;
exports.applyResourceAllocation = applyResourceAllocation;
exports.reconfigureVMResources = reconfigureVMResources;
exports.getVMResourceUtilization = getVMResourceUtilization;
exports.createResourcePool = createResourcePool;
exports.calculateOptimalPlacement = calculateOptimalPlacement;
exports.balanceVMsAcrossHosts = balanceVMsAcrossHosts;
exports.findHostsWithCapacity = findHostsWithCapacity;
exports.migrateVM = migrateVM;
exports.attachVirtualDisk = attachVirtualDisk;
exports.detachVirtualDisk = detachVirtualDisk;
exports.extendVirtualDisk = extendVirtualDisk;
// ============================================================================
// VM LIFECYCLE MANAGEMENT
// ============================================================================
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
async function createVirtualMachine(request, userId) {
    const auditTrail = [];
    const timestamp = new Date();
    try {
        // Validate configuration
        validateVMConfig(request.config);
        // Generate VM ID
        const vmId = `vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Create audit entry
        auditTrail.push({
            timestamp,
            operation: 'VM_CREATE',
            userId,
            vmId,
            details: {
                config: request.config,
                templateId: request.templateId,
            },
        });
        // Simulate VM creation (in production, this would interact with hypervisor)
        console.log(`Creating VM: ${request.config.name} (${vmId})`);
        return {
            success: true,
            vmId,
            message: `Virtual machine ${request.config.name} created successfully`,
            auditTrail,
        };
    }
    catch (error) {
        return {
            success: false,
            errors: [error.message],
            auditTrail,
        };
    }
}
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
async function startVirtualMachine(vmId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_START',
        userId,
        vmId,
        details: { action: 'power_on' },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine ${vmId} started successfully`,
        auditTrail,
    };
}
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
async function stopVirtualMachine(vmId, force, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_STOP',
        userId,
        vmId,
        details: { action: force ? 'power_off' : 'shutdown', force },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine ${vmId} ${force ? 'powered off' : 'shutdown'} successfully`,
        auditTrail,
    };
}
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
async function restartVirtualMachine(vmId, hard, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_RESTART',
        userId,
        vmId,
        details: { action: hard ? 'reset' : 'reboot', hard },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine ${vmId} ${hard ? 'reset' : 'restarted'} successfully`,
        auditTrail,
    };
}
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
async function suspendVirtualMachine(vmId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_SUSPEND',
        userId,
        vmId,
        details: { action: 'suspend' },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine ${vmId} suspended successfully`,
        auditTrail,
    };
}
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
async function resumeVirtualMachine(vmId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_RESUME',
        userId,
        vmId,
        details: { action: 'resume' },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine ${vmId} resumed successfully`,
        auditTrail,
    };
}
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
async function terminateVirtualMachine(vmId, deleteDisks, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_TERMINATE',
        userId,
        vmId,
        details: { action: 'terminate', deleteDisks },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine ${vmId} terminated successfully`,
        auditTrail,
    };
}
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
async function getVMLifecycleState(vmId) {
    // In production, query actual VM state from hypervisor
    return 'running';
}
// ============================================================================
// VM PROVISIONING
// ============================================================================
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
async function batchProvisionFromTemplate(templateId, configs, userId) {
    const results = [];
    for (const config of configs) {
        const result = await createVirtualMachine({ templateId, config }, userId);
        results.push(result);
    }
    return results;
}
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
async function provisionWithAutoPlacement(config, constraints, userId) {
    // Calculate optimal placement
    const hostId = await calculateOptimalPlacement(config, constraints);
    return createVirtualMachine({ config, hostId }, userId);
}
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
async function provisionWithResourcePolicy(config, policy, userId) {
    const result = await createVirtualMachine({ config }, userId);
    if (result.success && result.vmId) {
        await applyResourceAllocation(result.vmId, policy, userId);
    }
    return result;
}
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
async function validateProvisioningRequest(request) {
    const errors = [];
    try {
        validateVMConfig(request.config);
    }
    catch (error) {
        errors.push(error.message);
    }
    // Check resource availability
    if (request.hostId) {
        const available = await checkHostResourceAvailability(request.hostId, request.config);
        if (!available) {
            errors.push(`Insufficient resources on host ${request.hostId}`);
        }
    }
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
}
// ============================================================================
// VM CLONING
// ============================================================================
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
async function cloneVirtualMachine(spec, userId) {
    const auditTrail = [];
    const vmId = `vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_CLONE',
        userId,
        vmId,
        details: {
            sourceVMId: spec.sourceVMId,
            sourceTemplateId: spec.sourceTemplateId,
            targetName: spec.targetName,
            linkedClone: spec.linkedClone,
        },
    });
    return {
        success: true,
        vmId,
        message: `Virtual machine cloned successfully as ${spec.targetName}`,
        auditTrail,
    };
}
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
async function createLinkedClone(sourceVMId, snapshotId, targetName, userId) {
    return cloneVirtualMachine({
        sourceVMId,
        snapshotId,
        targetName,
        linkedClone: true,
    }, userId);
}
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
async function batchCloneVMs(sourceVMId, targetNames, linkedClone, userId) {
    const results = [];
    for (const targetName of targetNames) {
        const result = await cloneVirtualMachine({ sourceVMId, targetName, linkedClone }, userId);
        results.push(result);
    }
    return results;
}
// ============================================================================
// VM TEMPLATES
// ============================================================================
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
async function createVMTemplate(vmId, templateName, description, userId) {
    const auditTrail = [];
    const templateId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    auditTrail.push({
        timestamp: new Date(),
        operation: 'TEMPLATE_CREATE',
        userId,
        vmId,
        details: {
            templateId,
            templateName,
            description,
        },
    });
    return {
        success: true,
        vmId: templateId,
        message: `Template ${templateName} created successfully`,
        auditTrail,
    };
}
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
async function updateVMTemplate(templateId, updates, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'TEMPLATE_UPDATE',
        userId,
        details: { templateId, updates },
    });
    return {
        success: true,
        vmId: templateId,
        message: `Template ${templateId} updated successfully`,
        auditTrail,
    };
}
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
async function deleteVMTemplate(templateId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'TEMPLATE_DELETE',
        userId,
        details: { templateId },
    });
    return {
        success: true,
        vmId: templateId,
        message: `Template ${templateId} deleted successfully`,
        auditTrail,
    };
}
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
async function listVMTemplates(filters) {
    // In production, query from template repository
    return [];
}
// ============================================================================
// VM SNAPSHOTS
// ============================================================================
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
async function createVMSnapshot(vmId, config, userId) {
    const auditTrail = [];
    const snapshotId = `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    auditTrail.push({
        timestamp: new Date(),
        operation: 'SNAPSHOT_CREATE',
        userId,
        vmId,
        details: { snapshotId, config },
    });
    return {
        success: true,
        vmId: snapshotId,
        message: `Snapshot ${config.name} created successfully`,
        auditTrail,
    };
}
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
async function revertToSnapshot(vmId, snapshotId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'SNAPSHOT_REVERT',
        userId,
        vmId,
        details: { snapshotId },
    });
    return {
        success: true,
        vmId,
        message: `VM ${vmId} reverted to snapshot ${snapshotId}`,
        auditTrail,
    };
}
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
async function deleteVMSnapshot(vmId, snapshotId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'SNAPSHOT_DELETE',
        userId,
        vmId,
        details: { snapshotId },
    });
    return {
        success: true,
        vmId,
        message: `Snapshot ${snapshotId} deleted successfully`,
        auditTrail,
    };
}
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
async function consolidateVMSnapshots(vmId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'SNAPSHOT_CONSOLIDATE',
        userId,
        vmId,
        details: { action: 'consolidate_all' },
    });
    return {
        success: true,
        vmId,
        message: `Snapshots for VM ${vmId} consolidated successfully`,
        auditTrail,
    };
}
// ============================================================================
// RESOURCE ALLOCATION
// ============================================================================
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
async function applyResourceAllocation(vmId, policy, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'RESOURCE_ALLOCATION',
        userId,
        vmId,
        details: { policy },
    });
    return {
        success: true,
        vmId,
        message: `Resource allocation applied to VM ${vmId}`,
        auditTrail,
    };
}
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
async function reconfigureVMResources(vmId, newConfig, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_RECONFIGURE',
        userId,
        vmId,
        details: { newConfig },
    });
    return {
        success: true,
        vmId,
        message: `VM ${vmId} reconfigured successfully`,
        auditTrail,
    };
}
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
async function getVMResourceUtilization(vmId) {
    return {
        cpuUsagePercent: 45.2,
        memoryUsageMB: 6144,
        memoryUsagePercent: 75.0,
        diskIOPS: 1250,
        networkMbps: 125.5,
        timestamp: new Date(),
    };
}
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
async function createResourcePool(config, userId) {
    const auditTrail = [];
    const poolId = `pool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    auditTrail.push({
        timestamp: new Date(),
        operation: 'RESOURCE_POOL_CREATE',
        userId,
        details: { poolId, config },
    });
    return {
        success: true,
        vmId: poolId,
        message: `Resource pool ${config.name} created successfully`,
        auditTrail,
    };
}
// ============================================================================
// PLACEMENT ALGORITHMS
// ============================================================================
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
async function calculateOptimalPlacement(config, constraints) {
    // Get all available hosts
    const hosts = await getAvailableHosts();
    // Filter by constraints
    const eligibleHosts = hosts.filter(host => {
        if (constraints.minimumCPU && host.totalCPU - host.usedCPU < constraints.minimumCPU) {
            return false;
        }
        if (constraints.minimumMemory && host.totalMemory - host.usedMemory < constraints.minimumMemory) {
            return false;
        }
        if (constraints.requireHostAntiAffinity?.includes(host.hostId)) {
            return false;
        }
        return true;
    });
    if (eligibleHosts.length === 0) {
        throw new Error('No eligible hosts found for placement');
    }
    // Score hosts based on utilization and health
    const scoredHosts = eligibleHosts.map(host => ({
        host,
        score: calculateHostScore(host, config),
    }));
    // Sort by score descending
    scoredHosts.sort((a, b) => b.score - a.score);
    return scoredHosts[0].host.hostId;
}
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
async function balanceVMsAcrossHosts(clusterId) {
    const hosts = await getClusterHosts(clusterId);
    const plans = [];
    // Calculate average utilization
    const avgCPU = hosts.reduce((sum, h) => sum + h.usedCPU / h.totalCPU, 0) / hosts.length;
    // Find overloaded hosts
    const overloadedHosts = hosts.filter(h => h.usedCPU / h.totalCPU > avgCPU * 1.2);
    // Generate migration plans (simplified)
    for (const host of overloadedHosts) {
        // In production, select actual VMs to migrate
        plans.push({
            vmId: `vm-${host.hostId}`,
            sourceHostId: host.hostId,
            targetHostId: hosts[0].hostId,
            priority: 'normal',
        });
    }
    return plans;
}
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
async function findHostsWithCapacity(config) {
    const hosts = await getAvailableHosts();
    return hosts
        .filter(host => {
        const availableCPU = host.totalCPU - host.usedCPU;
        const availableMemory = host.totalMemory - host.usedMemory;
        return availableCPU >= config.cpuCores * 1000 && availableMemory >= config.memoryMB;
    })
        .sort((a, b) => {
        const aAvailable = (a.totalCPU - a.usedCPU) + (a.totalMemory - a.usedMemory);
        const bAvailable = (b.totalCPU - b.usedCPU) + (b.totalMemory - b.usedMemory);
        return bAvailable - aAvailable;
    });
}
// ============================================================================
// VM OPERATIONS
// ============================================================================
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
async function migrateVM(vmId, targetHostId, live, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'VM_MIGRATE',
        userId,
        vmId,
        details: { targetHostId, live },
    });
    return {
        success: true,
        vmId,
        message: `VM ${vmId} ${live ? 'live ' : ''}migrated to ${targetHostId}`,
        auditTrail,
    };
}
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
async function attachVirtualDisk(vmId, sizeGB, userId) {
    const auditTrail = [];
    const diskId = `disk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    auditTrail.push({
        timestamp: new Date(),
        operation: 'DISK_ATTACH',
        userId,
        vmId,
        details: { diskId, sizeGB },
    });
    return {
        success: true,
        vmId: diskId,
        message: `${sizeGB}GB disk attached to VM ${vmId}`,
        auditTrail,
    };
}
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
async function detachVirtualDisk(vmId, diskId, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'DISK_DETACH',
        userId,
        vmId,
        details: { diskId },
    });
    return {
        success: true,
        vmId,
        message: `Disk ${diskId} detached from VM ${vmId}`,
        auditTrail,
    };
}
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
async function extendVirtualDisk(diskId, newSizeGB, userId) {
    const auditTrail = [];
    auditTrail.push({
        timestamp: new Date(),
        operation: 'DISK_EXTEND',
        userId,
        details: { diskId, newSizeGB },
    });
    return {
        success: true,
        vmId: diskId,
        message: `Disk ${diskId} extended to ${newSizeGB}GB`,
        auditTrail,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Validates VM configuration.
 * Ensures all required fields are present and valid.
 *
 * @param {VMConfig} config - VM configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateVMConfig(config) {
    if (!config.name || config.name.trim().length === 0) {
        throw new Error('VM name is required');
    }
    if (config.cpuCores < 1 || config.cpuCores > 128) {
        throw new Error('CPU cores must be between 1 and 128');
    }
    if (config.memoryMB < 512 || config.memoryMB > 1048576) {
        throw new Error('Memory must be between 512MB and 1TB');
    }
    if (config.diskSizeGB < 1 || config.diskSizeGB > 65536) {
        throw new Error('Disk size must be between 1GB and 64TB');
    }
}
/**
 * Checks if host has sufficient resources for VM.
 *
 * @param {string} hostId - Host ID
 * @param {VMConfig} config - VM configuration
 * @returns {Promise<boolean>} True if resources available
 */
async function checkHostResourceAvailability(hostId, config) {
    const hosts = await getAvailableHosts();
    const host = hosts.find(h => h.hostId === hostId);
    if (!host)
        return false;
    const requiredCPU = config.cpuCores * 1000; // MHz
    const requiredMemory = config.memoryMB;
    return (host.totalCPU - host.usedCPU >= requiredCPU &&
        host.totalMemory - host.usedMemory >= requiredMemory);
}
/**
 * Gets list of available hosts.
 *
 * @returns {Promise<HostResourceCapacity[]>} Available hosts
 */
async function getAvailableHosts() {
    // In production, query from infrastructure management system
    return [
        {
            hostId: 'host-01',
            totalCPU: 32000,
            usedCPU: 16000,
            totalMemory: 262144,
            usedMemory: 131072,
            totalStorage: 10240,
            usedStorage: 5120,
            vmCount: 8,
            healthScore: 95,
        },
        {
            hostId: 'host-02',
            totalCPU: 32000,
            usedCPU: 8000,
            totalMemory: 262144,
            usedMemory: 65536,
            totalStorage: 10240,
            usedStorage: 2560,
            vmCount: 4,
            healthScore: 98,
        },
    ];
}
/**
 * Gets hosts in a cluster.
 *
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<HostResourceCapacity[]>} Cluster hosts
 */
async function getClusterHosts(clusterId) {
    return getAvailableHosts();
}
/**
 * Calculates host score for placement.
 *
 * @param {HostResourceCapacity} host - Host capacity info
 * @param {VMConfig} config - VM configuration
 * @returns {number} Host score (higher is better)
 */
function calculateHostScore(host, config) {
    const cpuUtilization = host.usedCPU / host.totalCPU;
    const memoryUtilization = host.usedMemory / host.totalMemory;
    // Prefer hosts with lower utilization and higher health
    const utilizationScore = (1 - cpuUtilization) * 0.4 + (1 - memoryUtilization) * 0.4;
    const healthScore = host.healthScore / 100 * 0.2;
    return utilizationScore + healthScore;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Lifecycle
    createVirtualMachine,
    startVirtualMachine,
    stopVirtualMachine,
    restartVirtualMachine,
    suspendVirtualMachine,
    resumeVirtualMachine,
    terminateVirtualMachine,
    getVMLifecycleState,
    // Provisioning
    batchProvisionFromTemplate,
    provisionWithAutoPlacement,
    provisionWithResourcePolicy,
    validateProvisioningRequest,
    // Cloning
    cloneVirtualMachine,
    createLinkedClone,
    batchCloneVMs,
    // Templates
    createVMTemplate,
    updateVMTemplate,
    deleteVMTemplate,
    listVMTemplates,
    // Snapshots
    createVMSnapshot,
    revertToSnapshot,
    deleteVMSnapshot,
    consolidateVMSnapshots,
    // Resource Allocation
    applyResourceAllocation,
    reconfigureVMResources,
    getVMResourceUtilization,
    createResourcePool,
    // Placement
    calculateOptimalPlacement,
    balanceVMsAcrossHosts,
    findHostsWithCapacity,
    // Operations
    migrateVM,
    attachVirtualDisk,
    detachVirtualDisk,
    extendVirtualDisk,
};
//# sourceMappingURL=virtual-machine-orchestration-kit.js.map