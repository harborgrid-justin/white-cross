"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetricsCollectionResponse = exports.createImportValidationResponse = exports.createExportOperationResponse = exports.createBulkOperationResponse = exports.createAsyncOperationAcceptedResponse = exports.createVirtualPaginatedResponse = exports.createInsufficientPermissionsErrorSchema = exports.createConcurrentModificationErrorSchema = exports.createResourceQuotaErrorSchema = exports.createVMwareFaultSchema = exports.createValidationErrorSchema = exports.createVirtualErrorSchema = exports.createVRealizeMetadataSchema = exports.createApiDeprecationNoticeSchema = exports.createApiCapabilitySchema = exports.createRateLimitSchema = exports.createApiHealthCheckSchema = exports.createApiVersionSchema = exports.createTaskHistorySchema = exports.createScheduledTaskSchema = exports.createBatchOperationResultSchema = exports.createBatchOperationSchema = exports.createTaskCancelSchema = exports.createTaskStatusSchema = exports.createDistributedFirewallRuleSchema = exports.createNSXNetworkSchema = exports.createVirtualNICSchema = exports.createPortGroupSchema = exports.createVirtualSwitchSchema = exports.createVCenterSchema = exports.createResourcePoolSchema = exports.createDatastoreSchema = exports.createClusterSchema = exports.createHostMaintenanceModeSchema = exports.createHypervisorHostSchema = exports.createVMConsoleSchema = exports.createVMGuestCustomizationSchema = exports.createVMResourceAllocationSchema = exports.createVMMigrationSchema = exports.createVMCloneSchema = exports.createVMSnapshotSchema = exports.createVMPowerOperationSchema = exports.createVirtualMachineSchema = void 0;
// ============================================================================
// 1. VIRTUAL MACHINE SCHEMA BUILDERS (1-8)
// ============================================================================
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
const createVirtualMachineSchema = (includeMetrics = false) => {
    const schema = {
        type: 'object',
        description: 'Virtual machine resource representation',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'VM unique identifier', example: 'vm-123' },
            name: { type: 'string', minLength: 1, maxLength: 80, description: 'VM display name', example: 'web-server-01' },
            state: { type: 'string', enum: ['running', 'stopped', 'suspended', 'paused', 'error'], example: 'running' },
            powerState: { type: 'string', enum: ['poweredOn', 'poweredOff', 'suspended'], example: 'poweredOn' },
            guestOS: { type: 'string', description: 'Guest operating system', example: 'ubuntu64Guest' },
            cpu: {
                type: 'object',
                properties: {
                    cores: { type: 'integer', minimum: 1, maximum: 128, example: 4 },
                    sockets: { type: 'integer', minimum: 1, maximum: 16, example: 2 },
                    coresPerSocket: { type: 'integer', minimum: 1, maximum: 64, example: 2 },
                    reservation: { type: 'integer', description: 'CPU reservation in MHz', example: 1000 },
                    limit: { type: 'integer', description: 'CPU limit in MHz', example: -1 },
                },
                required: ['cores'],
            },
            memory: {
                type: 'object',
                properties: {
                    sizeMB: { type: 'integer', minimum: 128, maximum: 1048576, description: 'Memory size in MB', example: 8192 },
                    reservation: { type: 'integer', description: 'Memory reservation in MB', example: 4096 },
                    limit: { type: 'integer', description: 'Memory limit in MB', example: -1 },
                },
                required: ['sizeMB'],
            },
            storage: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        diskId: { type: 'string', example: 'disk-0' },
                        capacityGB: { type: 'integer', minimum: 1, example: 100 },
                        diskType: { type: 'string', enum: ['thick', 'thin', 'eagerZeroedThick'], example: 'thin' },
                        datastore: { type: 'string', example: 'datastore1' },
                    },
                },
            },
            network: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        nicId: { type: 'string', example: 'nic-0' },
                        networkName: { type: 'string', example: 'VM Network' },
                        macAddress: { type: 'string', pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$', example: '00:50:56:a1:b2:c3' },
                        ipAddresses: { type: 'array', items: { type: 'string', format: 'ipv4' }, example: ['192.168.1.100'] },
                        connected: { type: 'boolean', example: true },
                    },
                },
            },
            host: { type: 'string', description: 'ESXi host identifier', example: 'host-42' },
            cluster: { type: 'string', description: 'Cluster identifier', example: 'cluster-prod' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            modifiedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
        },
        required: ['id', 'name', 'state', 'powerState', 'cpu', 'memory'],
    };
    if (includeMetrics) {
        schema.properties.metrics = {
            type: 'object',
            properties: {
                cpuUsage: { type: 'number', minimum: 0, maximum: 100, description: 'CPU usage percentage', example: 45.5 },
                memoryUsage: { type: 'number', minimum: 0, maximum: 100, description: 'Memory usage percentage', example: 62.3 },
                diskReadRate: { type: 'number', description: 'Disk read rate in KB/s', example: 1024 },
                diskWriteRate: { type: 'number', description: 'Disk write rate in KB/s', example: 512 },
                networkTxRate: { type: 'number', description: 'Network transmit rate in KB/s', example: 256 },
                networkRxRate: { type: 'number', description: 'Network receive rate in KB/s', example: 128 },
            },
        };
    }
    return schema;
};
exports.createVirtualMachineSchema = createVirtualMachineSchema;
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
const createVMPowerOperationSchema = (operation) => {
    const baseSchema = {
        type: 'object',
        description: `Virtual machine ${operation} operation parameters`,
        properties: {
            force: { type: 'boolean', default: false, description: `Force ${operation} without guest OS cooperation` },
            timeout: { type: 'integer', minimum: 0, maximum: 3600, description: 'Timeout in seconds', example: 300 },
        },
    };
    if (operation === 'stop' || operation === 'restart') {
        baseSchema.properties.graceful = { type: 'boolean', default: true, description: 'Attempt graceful shutdown' };
    }
    return baseSchema;
};
exports.createVMPowerOperationSchema = createVMPowerOperationSchema;
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
const createVMSnapshotSchema = (includeMemory = false) => {
    return {
        type: 'object',
        description: 'Virtual machine snapshot configuration',
        properties: {
            name: { type: 'string', minLength: 1, maxLength: 80, description: 'Snapshot name', example: 'pre-patch-snapshot' },
            description: { type: 'string', maxLength: 256, description: 'Snapshot description', example: 'Before OS patching' },
            memory: { type: 'boolean', default: includeMemory, description: 'Include memory state' },
            quiesce: { type: 'boolean', default: false, description: 'Quiesce filesystem (requires VMware Tools)' },
            consolidate: { type: 'boolean', default: true, description: 'Consolidate disk snapshots' },
        },
        required: ['name'],
    };
};
exports.createVMSnapshotSchema = createVMSnapshotSchema;
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
const createVMCloneSchema = (template = false) => {
    return {
        type: 'object',
        description: `Clone virtual machine${template ? ' as template' : ''}`,
        properties: {
            name: { type: 'string', minLength: 1, maxLength: 80, description: 'Clone name', example: 'web-server-02' },
            targetDatastore: { type: 'string', description: 'Target datastore identifier', example: 'datastore1' },
            targetHost: { type: 'string', description: 'Target ESXi host identifier', example: 'host-42' },
            targetCluster: { type: 'string', description: 'Target cluster identifier', example: 'cluster-prod' },
            linkedClone: { type: 'boolean', default: false, description: 'Create linked clone (requires snapshot)' },
            diskType: { type: 'string', enum: ['thick', 'thin', 'eagerZeroedThick'], default: 'thin' },
            powerOn: { type: 'boolean', default: false, description: 'Power on after clone' },
            template: { type: 'boolean', default: template, description: 'Mark as template' },
            customization: {
                type: 'object',
                properties: {
                    hostname: { type: 'string', description: 'Guest hostname', example: 'web-02' },
                    ipAddress: { type: 'string', format: 'ipv4', example: '192.168.1.101' },
                    netmask: { type: 'string', format: 'ipv4', example: '255.255.255.0' },
                    gateway: { type: 'string', format: 'ipv4', example: '192.168.1.1' },
                    dnsServers: { type: 'array', items: { type: 'string', format: 'ipv4' }, example: ['8.8.8.8', '8.8.4.4'] },
                },
            },
        },
        required: ['name', 'targetDatastore'],
    };
};
exports.createVMCloneSchema = createVMCloneSchema;
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
const createVMMigrationSchema = (storage = false) => {
    const schema = {
        type: 'object',
        description: 'Virtual machine migration (vMotion) configuration',
        properties: {
            targetHost: { type: 'string', description: 'Target ESXi host identifier', example: 'host-43' },
            priority: { type: 'string', enum: ['default', 'high', 'low'], default: 'default', description: 'Migration priority' },
            timeout: { type: 'integer', minimum: 0, maximum: 7200, description: 'Migration timeout in seconds', example: 3600 },
        },
        required: ['targetHost'],
    };
    if (storage) {
        schema.properties.targetDatastore = { type: 'string', description: 'Target datastore for storage vMotion', example: 'datastore2' };
        schema.properties.diskType = { type: 'string', enum: ['thick', 'thin', 'eagerZeroedThick'], description: 'Target disk type' };
    }
    return schema;
};
exports.createVMMigrationSchema = createVMMigrationSchema;
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
const createVMResourceAllocationSchema = () => {
    return {
        type: 'object',
        description: 'Virtual machine resource allocation configuration',
        properties: {
            cpu: {
                type: 'object',
                properties: {
                    shares: { type: 'string', enum: ['low', 'normal', 'high', 'custom'], default: 'normal' },
                    customShares: { type: 'integer', minimum: 0, description: 'Custom CPU shares value' },
                    reservation: { type: 'integer', minimum: 0, description: 'CPU reservation in MHz' },
                    limit: { type: 'integer', minimum: -1, description: 'CPU limit in MHz (-1 for unlimited)' },
                    expandableReservation: { type: 'boolean', default: true },
                },
            },
            memory: {
                type: 'object',
                properties: {
                    shares: { type: 'string', enum: ['low', 'normal', 'high', 'custom'], default: 'normal' },
                    customShares: { type: 'integer', minimum: 0, description: 'Custom memory shares value' },
                    reservation: { type: 'integer', minimum: 0, description: 'Memory reservation in MB' },
                    limit: { type: 'integer', minimum: -1, description: 'Memory limit in MB (-1 for unlimited)' },
                    expandableReservation: { type: 'boolean', default: true },
                },
            },
        },
    };
};
exports.createVMResourceAllocationSchema = createVMResourceAllocationSchema;
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
const createVMGuestCustomizationSchema = (osType) => {
    const baseSchema = {
        type: 'object',
        description: `Guest OS customization specification for ${osType}`,
        properties: {
            hostname: { type: 'string', pattern: '^[a-zA-Z0-9-]+$', maxLength: 63, example: osType === 'windows' ? 'WIN-SERVER-01' : 'linux-vm-01' },
            domain: { type: 'string', description: 'Domain name', example: 'example.com' },
            timezone: { type: 'string', description: 'Timezone identifier', example: osType === 'windows' ? 'Pacific Standard Time' : 'America/Los_Angeles' },
            network: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        dhcp: { type: 'boolean', default: false },
                        ipAddress: { type: 'string', format: 'ipv4', example: '192.168.1.100' },
                        netmask: { type: 'string', format: 'ipv4', example: '255.255.255.0' },
                        gateway: { type: 'string', format: 'ipv4', example: '192.168.1.1' },
                        dnsServers: { type: 'array', items: { type: 'string', format: 'ipv4' }, example: ['8.8.8.8'] },
                    },
                },
            },
        },
        required: ['hostname'],
    };
    if (osType === 'windows') {
        baseSchema.properties.workgroup = { type: 'string', description: 'Windows workgroup', example: 'WORKGROUP' };
        baseSchema.properties.adminPassword = { type: 'string', format: 'password', description: 'Administrator password' };
        baseSchema.properties.licenseKey = { type: 'string', description: 'Windows license key' };
        baseSchema.properties.autoLogon = { type: 'boolean', default: false };
    }
    else {
        baseSchema.properties.rootPassword = { type: 'string', format: 'password', description: 'Root password' };
        baseSchema.properties.sshKeys = { type: 'array', items: { type: 'string' }, description: 'SSH public keys' };
    }
    return baseSchema;
};
exports.createVMGuestCustomizationSchema = createVMGuestCustomizationSchema;
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
const createVMConsoleSchema = (protocol) => {
    return {
        type: 'object',
        description: `Virtual machine console access via ${protocol.toUpperCase()}`,
        properties: {
            protocol: { type: 'string', enum: ['vnc', 'rdp', 'vmrc', 'webmks'], example: protocol },
            ticket: { type: 'string', description: 'Authentication ticket', example: 'cst-VCT-...' },
            url: { type: 'string', format: 'uri', description: 'Console connection URL', example: `wss://vcenter.example.com/ticket/${protocol}` },
            port: { type: 'integer', minimum: 1, maximum: 65535, description: 'Connection port' },
            expiresAt: { type: 'string', format: 'date-time', description: 'Ticket expiration time', example: '2024-01-15T11:30:00Z' },
        },
        required: ['protocol', 'ticket', 'url', 'expiresAt'],
    };
};
exports.createVMConsoleSchema = createVMConsoleSchema;
// ============================================================================
// 2. HYPERVISOR & HOST SCHEMAS (9-14)
// ============================================================================
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
const createHypervisorHostSchema = (includeHardware = false) => {
    const schema = {
        type: 'object',
        description: 'ESXi hypervisor host resource',
        properties: {
            id: { type: 'string', description: 'Host identifier', example: 'host-42' },
            name: { type: 'string', description: 'Host name', example: 'esxi-01.example.com' },
            connectionState: { type: 'string', enum: ['connected', 'disconnected', 'notResponding'], example: 'connected' },
            powerState: { type: 'string', enum: ['poweredOn', 'poweredOff', 'standBy', 'unknown'], example: 'poweredOn' },
            version: { type: 'string', description: 'ESXi version', example: '8.0.2' },
            build: { type: 'string', description: 'ESXi build number', example: '22380479' },
            cpu: {
                type: 'object',
                properties: {
                    model: { type: 'string', example: 'Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz' },
                    sockets: { type: 'integer', example: 2 },
                    coresPerSocket: { type: 'integer', example: 24 },
                    threads: { type: 'integer', example: 96 },
                    speedMHz: { type: 'integer', example: 3000 },
                    totalMHz: { type: 'integer', example: 288000 },
                    usageMHz: { type: 'integer', example: 144000 },
                },
            },
            memory: {
                type: 'object',
                properties: {
                    totalMB: { type: 'integer', description: 'Total memory in MB', example: 524288 },
                    usedMB: { type: 'integer', description: 'Used memory in MB', example: 262144 },
                    availableMB: { type: 'integer', description: 'Available memory in MB', example: 262144 },
                },
            },
            vms: { type: 'integer', description: 'Number of VMs on host', example: 42 },
            cluster: { type: 'string', description: 'Cluster membership', example: 'cluster-prod' },
            maintenanceMode: { type: 'boolean', description: 'Host in maintenance mode', example: false },
        },
        required: ['id', 'name', 'connectionState', 'powerState', 'cpu', 'memory'],
    };
    if (includeHardware) {
        schema.properties.hardware = {
            type: 'object',
            properties: {
                vendor: { type: 'string', example: 'Dell Inc.' },
                model: { type: 'string', example: 'PowerEdge R750' },
                biosVersion: { type: 'string', example: '2.18.0' },
                uuid: { type: 'string', format: 'uuid', example: '4c4c4544-0052-4a10-8050-b7c04f545031' },
                serialNumber: { type: 'string', example: 'DRJP0X3' },
                numNics: { type: 'integer', example: 4 },
                numHbas: { type: 'integer', example: 2 },
            },
        };
    }
    return schema;
};
exports.createHypervisorHostSchema = createHypervisorHostSchema;
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
const createHostMaintenanceModeSchema = () => {
    return {
        type: 'object',
        description: 'Host maintenance mode operation configuration',
        properties: {
            enter: { type: 'boolean', description: 'Enter (true) or exit (false) maintenance mode', example: true },
            evacuate: { type: 'boolean', default: true, description: 'Evacuate VMs before entering maintenance' },
            timeout: { type: 'integer', minimum: 0, maximum: 14400, description: 'Timeout in seconds', example: 3600 },
            evacuationMode: { type: 'string', enum: ['ensureAccessibility', 'evacuateAllData', 'noDataEvacuation'], default: 'ensureAccessibility' },
        },
        required: ['enter'],
    };
};
exports.createHostMaintenanceModeSchema = createHostMaintenanceModeSchema;
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
const createClusterSchema = (includeDRS = false, includeHA = false) => {
    const schema = {
        type: 'object',
        description: 'VMware cluster resource',
        properties: {
            id: { type: 'string', description: 'Cluster identifier', example: 'cluster-prod' },
            name: { type: 'string', description: 'Cluster name', example: 'Production Cluster' },
            totalHosts: { type: 'integer', minimum: 0, description: 'Total hosts in cluster', example: 8 },
            totalCpu: { type: 'integer', description: 'Total CPU in MHz', example: 2304000 },
            totalMemory: { type: 'integer', description: 'Total memory in MB', example: 4194304 },
            totalVMs: { type: 'integer', minimum: 0, description: 'Total VMs in cluster', example: 336 },
            overallStatus: { type: 'string', enum: ['green', 'yellow', 'red', 'gray'], example: 'green' },
        },
        required: ['id', 'name', 'totalHosts'],
    };
    if (includeDRS) {
        schema.properties.drs = {
            type: 'object',
            description: 'Distributed Resource Scheduler configuration',
            properties: {
                enabled: { type: 'boolean', example: true },
                defaultVmBehavior: { type: 'string', enum: ['manual', 'partiallyAutomated', 'fullyAutomated'], example: 'fullyAutomated' },
                vmotionRate: { type: 'integer', minimum: 1, maximum: 5, description: 'Migration threshold (1=conservative, 5=aggressive)', example: 3 },
            },
        };
    }
    if (includeHA) {
        schema.properties.ha = {
            type: 'object',
            description: 'High Availability configuration',
            properties: {
                enabled: { type: 'boolean', example: true },
                admissionControlEnabled: { type: 'boolean', example: true },
                admissionControlPolicy: { type: 'string', enum: ['resourcePercentage', 'slotPolicy', 'dedicatedFailoverHosts'], example: 'resourcePercentage' },
                vmMonitoring: { type: 'string', enum: ['disabled', 'vmMonitoringOnly', 'vmAndAppMonitoring'], example: 'vmAndAppMonitoring' },
                hostMonitoring: { type: 'string', enum: ['enabled', 'disabled'], example: 'enabled' },
            },
        };
    }
    return schema;
};
exports.createClusterSchema = createClusterSchema;
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
const createDatastoreSchema = (type) => {
    const schema = {
        type: 'object',
        description: `${type.toUpperCase()} datastore resource`,
        properties: {
            id: { type: 'string', description: 'Datastore identifier', example: 'datastore-42' },
            name: { type: 'string', description: 'Datastore name', example: 'prod-vmfs-01' },
            type: { type: 'string', enum: ['vmfs', 'nfs', 'vsan', 'vvol'], example: type },
            capacityGB: { type: 'integer', minimum: 0, description: 'Total capacity in GB', example: 10240 },
            freeGB: { type: 'integer', minimum: 0, description: 'Free space in GB', example: 5120 },
            provisionedGB: { type: 'integer', minimum: 0, description: 'Provisioned space in GB (includes thin)', example: 15360 },
            accessible: { type: 'boolean', description: 'Datastore accessible', example: true },
            multipleHostAccess: { type: 'boolean', description: 'Shared across multiple hosts', example: true },
            uncommitted: { type: 'integer', minimum: 0, description: 'Uncommitted space in GB', example: 5120 },
        },
        required: ['id', 'name', 'type', 'capacityGB', 'freeGB'],
    };
    if (type === 'nfs') {
        schema.properties.nfsServer = { type: 'string', description: 'NFS server address', example: '192.168.1.50' };
        schema.properties.nfsPath = { type: 'string', description: 'NFS export path', example: '/export/datastore1' };
        schema.properties.nfsVersion = { type: 'string', enum: ['3', '4.1'], example: '4.1' };
    }
    else if (type === 'vmfs') {
        schema.properties.vmfsVersion = { type: 'string', description: 'VMFS version', example: '6' };
        schema.properties.blockSizeMB = { type: 'integer', description: 'Block size in MB', example: 1 };
        schema.properties.ssd = { type: 'boolean', description: 'SSD backed', example: true };
    }
    return schema;
};
exports.createDatastoreSchema = createDatastoreSchema;
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
const createResourcePoolSchema = () => {
    return {
        type: 'object',
        description: 'VMware resource pool configuration',
        properties: {
            id: { type: 'string', description: 'Resource pool identifier', example: 'resgroup-42' },
            name: { type: 'string', description: 'Resource pool name', example: 'Production' },
            parent: { type: 'string', description: 'Parent resource pool or cluster', example: 'cluster-prod' },
            cpu: {
                type: 'object',
                properties: {
                    shares: { type: 'string', enum: ['low', 'normal', 'high', 'custom'], example: 'high' },
                    reservation: { type: 'integer', minimum: 0, description: 'CPU reservation in MHz', example: 10000 },
                    limit: { type: 'integer', minimum: -1, description: 'CPU limit in MHz (-1 unlimited)', example: -1 },
                    expandableReservation: { type: 'boolean', example: true },
                },
            },
            memory: {
                type: 'object',
                properties: {
                    shares: { type: 'string', enum: ['low', 'normal', 'high', 'custom'], example: 'high' },
                    reservation: { type: 'integer', minimum: 0, description: 'Memory reservation in MB', example: 51200 },
                    limit: { type: 'integer', minimum: -1, description: 'Memory limit in MB (-1 unlimited)', example: -1 },
                    expandableReservation: { type: 'boolean', example: true },
                },
            },
            vms: { type: 'integer', minimum: 0, description: 'Number of VMs in pool', example: 24 },
        },
        required: ['id', 'name', 'cpu', 'memory'],
    };
};
exports.createResourcePoolSchema = createResourcePoolSchema;
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
const createVCenterSchema = () => {
    return {
        type: 'object',
        description: 'VMware vCenter Server information',
        properties: {
            instanceUuid: { type: 'string', format: 'uuid', description: 'vCenter instance UUID' },
            name: { type: 'string', description: 'vCenter server name', example: 'vcenter.example.com' },
            version: { type: 'string', description: 'vCenter version', example: '8.0.2' },
            build: { type: 'string', description: 'vCenter build number', example: '22617221' },
            osType: { type: 'string', description: 'Operating system type', example: 'linux-x64' },
            apiVersion: { type: 'string', description: 'API version', example: '8.0.2.0' },
            productLineId: { type: 'string', description: 'Product line ID', example: 'vpx' },
            licenseProductName: { type: 'string', description: 'License product name', example: 'VMware vCenter Server 8 Standard' },
            licenseProductVersion: { type: 'string', description: 'License version', example: '8.0' },
        },
        required: ['instanceUuid', 'name', 'version', 'build', 'apiVersion'],
    };
};
exports.createVCenterSchema = createVCenterSchema;
// ============================================================================
// 3. VIRTUAL NETWORK SCHEMAS (15-19)
// ============================================================================
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
const createVirtualSwitchSchema = (type) => {
    const schema = {
        type: 'object',
        description: `${type === 'distributed' ? 'Distributed' : 'Standard'} virtual switch`,
        properties: {
            id: { type: 'string', description: 'vSwitch identifier', example: type === 'distributed' ? 'dvs-42' : 'vSwitch0' },
            name: { type: 'string', description: 'vSwitch name', example: type === 'distributed' ? 'DSwitch-Prod' : 'vSwitch0' },
            type: { type: 'string', enum: ['standard', 'distributed'], example: type },
            mtu: { type: 'integer', minimum: 1500, maximum: 9000, description: 'Maximum transmission unit', example: 1500 },
            numPorts: { type: 'integer', minimum: 8, maximum: 8192, description: 'Number of ports', example: 128 },
            numPortsAvailable: { type: 'integer', minimum: 0, description: 'Available ports', example: 64 },
            uplinks: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'vmnic0' },
                        speedMbps: { type: 'integer', example: 10000 },
                        mac: { type: 'string', example: '00:50:56:a1:b2:c3' },
                        status: { type: 'string', enum: ['up', 'down'], example: 'up' },
                    },
                },
            },
        },
        required: ['id', 'name', 'type', 'mtu', 'numPorts'],
    };
    if (type === 'distributed') {
        schema.properties.version = { type: 'string', description: 'DVS version', example: '8.0.0' };
        schema.properties.maxPorts = { type: 'integer', description: 'Maximum ports', example: 8192 };
        schema.properties.networkIOControl = { type: 'boolean', description: 'Network I/O Control enabled', example: true };
    }
    return schema;
};
exports.createVirtualSwitchSchema = createVirtualSwitchSchema;
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
const createPortGroupSchema = (switchType) => {
    return {
        type: 'object',
        description: `${switchType === 'distributed' ? 'Distributed' : 'Standard'} port group`,
        properties: {
            id: { type: 'string', description: 'Port group identifier', example: 'dvportgroup-42' },
            name: { type: 'string', description: 'Port group name', example: 'Production-VLAN100' },
            vlanId: { type: 'integer', minimum: 0, maximum: 4094, description: 'VLAN ID (0=none, 4095=trunk)', example: 100 },
            vlanType: { type: 'string', enum: ['none', 'vlan', 'trunk', 'pvlan'], example: 'vlan' },
            numPorts: { type: 'integer', minimum: 0, description: 'Number of ports in group', example: 32 },
            vSwitch: { type: 'string', description: 'Parent vSwitch identifier', example: 'dvs-42' },
            teaming: {
                type: 'object',
                properties: {
                    policy: { type: 'string', enum: ['loadbalance_ip', 'loadbalance_srcmac', 'loadbalance_srcid', 'failover_explicit'], example: 'loadbalance_ip' },
                    notifySwitches: { type: 'boolean', example: true },
                    rollingOrder: { type: 'boolean', example: false },
                    failback: { type: 'boolean', example: true },
                },
            },
            security: {
                type: 'object',
                properties: {
                    allowPromiscuous: { type: 'boolean', example: false },
                    macChanges: { type: 'boolean', example: false },
                    forgedTransmits: { type: 'boolean', example: false },
                },
            },
            trafficShaping: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean', example: false },
                    averageBandwidth: { type: 'integer', description: 'Average bandwidth in Kbps', example: 100000 },
                    peakBandwidth: { type: 'integer', description: 'Peak bandwidth in Kbps', example: 200000 },
                    burstSize: { type: 'integer', description: 'Burst size in KB', example: 102400 },
                },
            },
        },
        required: ['id', 'name', 'vlanId', 'vSwitch'],
    };
};
exports.createPortGroupSchema = createPortGroupSchema;
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
const createVirtualNICSchema = (adapterType) => {
    return {
        type: 'object',
        description: 'Virtual network interface card configuration',
        properties: {
            key: { type: 'integer', description: 'NIC key', example: 4000 },
            label: { type: 'string', description: 'NIC label', example: 'Network adapter 1' },
            adapterType: { type: 'string', enum: ['vmxnet3', 'e1000', 'e1000e', 'vmxnet2'], example: adapterType },
            macAddress: { type: 'string', pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$', example: '00:50:56:a1:b2:c3' },
            macAddressType: { type: 'string', enum: ['manual', 'generated', 'assigned'], example: 'generated' },
            networkName: { type: 'string', description: 'Port group name', example: 'Production-VLAN100' },
            connected: { type: 'boolean', description: 'Connect at power on', example: true },
            startConnected: { type: 'boolean', description: 'Connect at power on', example: true },
            allowGuestControl: { type: 'boolean', description: 'Allow guest OS to control', example: true },
            wakeOnLanEnabled: { type: 'boolean', description: 'Wake on LAN enabled', example: true },
            addressType: { type: 'string', description: 'IP address type', example: 'assigned' },
            ipAddresses: { type: 'array', items: { type: 'string' }, description: 'Assigned IP addresses', example: ['192.168.1.100'] },
        },
        required: ['adapterType', 'macAddress', 'networkName'],
    };
};
exports.createVirtualNICSchema = createVirtualNICSchema;
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
const createNSXNetworkSchema = () => {
    return {
        type: 'object',
        description: 'NSX-T logical network segment',
        properties: {
            id: { type: 'string', description: 'Segment identifier', example: 'segment-prod-web' },
            displayName: { type: 'string', description: 'Segment display name', example: 'Production Web Tier' },
            type: { type: 'string', enum: ['overlay', 'vlan'], example: 'overlay' },
            transportZone: { type: 'string', description: 'Transport zone identifier', example: 'tz-overlay-01' },
            vlan: { type: 'integer', minimum: 0, maximum: 4094, description: 'VLAN ID (for VLAN backed segments)' },
            subnets: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        gatewayAddress: { type: 'string', format: 'ipv4', example: '192.168.100.1/24' },
                        dhcpRanges: { type: 'array', items: { type: 'string' }, example: ['192.168.100.10-192.168.100.200'] },
                    },
                },
            },
            connectivity: { type: 'string', enum: ['on', 'off'], description: 'Segment connectivity', example: 'on' },
            adminState: { type: 'string', enum: ['UP', 'DOWN'], example: 'UP' },
            tags: { type: 'array', items: { type: 'object', properties: { scope: { type: 'string' }, tag: { type: 'string' } } } },
        },
        required: ['id', 'displayName', 'type', 'transportZone'],
    };
};
exports.createNSXNetworkSchema = createNSXNetworkSchema;
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
const createDistributedFirewallRuleSchema = () => {
    return {
        type: 'object',
        description: 'NSX distributed firewall rule',
        properties: {
            id: { type: 'string', description: 'Rule identifier', example: 'rule-1001' },
            displayName: { type: 'string', description: 'Rule name', example: 'Allow Web to App' },
            sequenceNumber: { type: 'integer', minimum: 0, description: 'Rule sequence number', example: 10 },
            action: { type: 'string', enum: ['ALLOW', 'DROP', 'REJECT'], example: 'ALLOW' },
            direction: { type: 'string', enum: ['IN', 'OUT', 'IN_OUT'], example: 'IN_OUT' },
            ipProtocol: { type: 'string', enum: ['IPV4', 'IPV6', 'IPV4_IPV6'], example: 'IPV4_IPV6' },
            logged: { type: 'boolean', description: 'Log rule hits', example: true },
            disabled: { type: 'boolean', description: 'Rule disabled', example: false },
            sources: { type: 'array', items: { type: 'string' }, description: 'Source security groups/IPs', example: ['sg-web-tier'] },
            destinations: { type: 'array', items: { type: 'string' }, description: 'Destination security groups/IPs', example: ['sg-app-tier'] },
            services: { type: 'array', items: { type: 'string' }, description: 'Service definitions', example: ['HTTPS', 'HTTP'] },
            scope: { type: 'array', items: { type: 'string' }, description: 'Rule scope', example: ['/infra/domains/default'] },
            tags: { type: 'array', items: { type: 'object', properties: { scope: { type: 'string' }, tag: { type: 'string' } } } },
        },
        required: ['displayName', 'action', 'sources', 'destinations', 'services'],
    };
};
exports.createDistributedFirewallRuleSchema = createDistributedFirewallRuleSchema;
// ============================================================================
// 4. TASK & ASYNC OPERATION SCHEMAS (20-25)
// ============================================================================
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
const createTaskStatusSchema = () => {
    return {
        type: 'object',
        description: 'Asynchronous task status and result',
        properties: {
            taskId: { type: 'string', format: 'uuid', description: 'Task unique identifier', example: 'task-12345678-1234-1234-1234-123456789012' },
            status: { type: 'string', enum: ['queued', 'running', 'success', 'error', 'cancelled'], example: 'running' },
            operation: { type: 'string', description: 'Operation being performed', example: 'VirtualMachine.clone' },
            target: { type: 'string', description: 'Target resource identifier', example: 'vm-123' },
            progress: { type: 'integer', minimum: 0, maximum: 100, description: 'Progress percentage', example: 45 },
            startTime: { type: 'string', format: 'date-time', description: 'Task start time', example: '2024-01-15T10:30:00Z' },
            endTime: { type: 'string', format: 'date-time', description: 'Task completion time', example: '2024-01-15T10:35:00Z' },
            queueTime: { type: 'string', format: 'date-time', description: 'Time task was queued' },
            result: { type: 'object', description: 'Operation result (available on success)', additionalProperties: true },
            error: {
                type: 'object',
                description: 'Error details (available on error)',
                properties: {
                    code: { type: 'string', example: 'RESOURCE_NOT_FOUND' },
                    message: { type: 'string', example: 'Virtual machine not found' },
                    details: { type: 'array', items: { type: 'object' } },
                },
            },
            cancelable: { type: 'boolean', description: 'Task can be cancelled', example: true },
        },
        required: ['taskId', 'status', 'operation', 'progress', 'startTime'],
    };
};
exports.createTaskStatusSchema = createTaskStatusSchema;
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
const createTaskCancelSchema = () => {
    return {
        type: 'object',
        description: 'Task cancellation request',
        properties: {
            taskId: { type: 'string', format: 'uuid', description: 'Task ID to cancel', example: 'task-12345678-1234-1234-1234-123456789012' },
            force: { type: 'boolean', default: false, description: 'Force cancellation even if not cleanly cancelable' },
        },
        required: ['taskId'],
    };
};
exports.createTaskCancelSchema = createTaskCancelSchema;
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
const createBatchOperationSchema = (operation) => {
    return {
        type: 'object',
        description: `Batch ${operation} operation request`,
        properties: {
            operation: { type: 'string', enum: ['powerOn', 'powerOff', 'suspend', 'delete', 'snapshot'], example: operation },
            targets: {
                type: 'array',
                items: { type: 'string', description: 'Resource identifier' },
                minItems: 1,
                maxItems: 100,
                description: 'Target resource IDs',
                example: ['vm-123', 'vm-456', 'vm-789'],
            },
            parameters: { type: 'object', description: 'Operation-specific parameters', additionalProperties: true },
            continueOnError: { type: 'boolean', default: false, description: 'Continue batch if individual operations fail' },
            maxConcurrent: { type: 'integer', minimum: 1, maximum: 10, default: 5, description: 'Max concurrent operations' },
        },
        required: ['operation', 'targets'],
    };
};
exports.createBatchOperationSchema = createBatchOperationSchema;
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
const createBatchOperationResultSchema = () => {
    return {
        type: 'object',
        description: 'Batch operation result summary',
        properties: {
            batchId: { type: 'string', format: 'uuid', description: 'Batch operation ID', example: 'batch-12345678' },
            operation: { type: 'string', description: 'Operation type', example: 'powerOn' },
            totalTargets: { type: 'integer', description: 'Total number of targets', example: 10 },
            successCount: { type: 'integer', description: 'Number of successful operations', example: 8 },
            errorCount: { type: 'integer', description: 'Number of failed operations', example: 2 },
            status: { type: 'string', enum: ['running', 'completed', 'partial', 'failed'], example: 'partial' },
            results: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        target: { type: 'string', description: 'Target resource ID', example: 'vm-123' },
                        status: { type: 'string', enum: ['success', 'error', 'pending'], example: 'success' },
                        result: { type: 'object', description: 'Operation result' },
                        error: { type: 'object', description: 'Error details if failed' },
                    },
                },
            },
        },
        required: ['batchId', 'operation', 'totalTargets', 'successCount', 'errorCount', 'status', 'results'],
    };
};
exports.createBatchOperationResultSchema = createBatchOperationResultSchema;
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
const createScheduledTaskSchema = () => {
    return {
        type: 'object',
        description: 'Scheduled task configuration',
        properties: {
            id: { type: 'string', description: 'Scheduled task ID', example: 'sched-snapshot-weekly' },
            name: { type: 'string', description: 'Task name', example: 'Weekly VM Snapshots' },
            description: { type: 'string', description: 'Task description' },
            enabled: { type: 'boolean', default: true, description: 'Schedule enabled' },
            operation: { type: 'string', description: 'Operation to perform', example: 'createSnapshot' },
            targets: { type: 'array', items: { type: 'string' }, description: 'Target resources', example: ['vm-123', 'vm-456'] },
            schedule: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['once', 'recurring'], example: 'recurring' },
                    startTime: { type: 'string', format: 'date-time', description: 'Start time for once or first execution' },
                    cronExpression: { type: 'string', description: 'Cron expression for recurring tasks', example: '0 2 * * 0' },
                    timezone: { type: 'string', description: 'Timezone for schedule', example: 'America/Los_Angeles' },
                },
                required: ['type'],
            },
            parameters: { type: 'object', description: 'Operation parameters', additionalProperties: true },
            lastRun: { type: 'string', format: 'date-time', description: 'Last execution time' },
            nextRun: { type: 'string', format: 'date-time', description: 'Next scheduled execution' },
        },
        required: ['name', 'operation', 'targets', 'schedule'],
    };
};
exports.createScheduledTaskSchema = createScheduledTaskSchema;
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
const createTaskHistorySchema = () => {
    return {
        type: 'object',
        description: 'Task execution history entry',
        properties: {
            executionId: { type: 'string', format: 'uuid', description: 'Execution ID', example: 'exec-12345678' },
            taskId: { type: 'string', description: 'Task or scheduled task ID', example: 'task-123' },
            operation: { type: 'string', description: 'Operation performed', example: 'VirtualMachine.powerOn' },
            target: { type: 'string', description: 'Target resource', example: 'vm-123' },
            startTime: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            endTime: { type: 'string', format: 'date-time', example: '2024-01-15T10:31:00Z' },
            duration: { type: 'integer', description: 'Duration in seconds', example: 60 },
            status: { type: 'string', enum: ['success', 'error', 'cancelled'], example: 'success' },
            user: { type: 'string', description: 'User who initiated task', example: 'admin@example.com' },
            result: { type: 'object', description: 'Execution result' },
            error: { type: 'object', description: 'Error details if failed' },
        },
        required: ['executionId', 'taskId', 'operation', 'target', 'startTime', 'status', 'user'],
    };
};
exports.createTaskHistorySchema = createTaskHistorySchema;
// ============================================================================
// 5. API VERSIONING & METADATA (26-31)
// ============================================================================
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
const createApiVersionSchema = () => {
    return {
        type: 'object',
        description: 'Virtual infrastructure API version information',
        properties: {
            version: { type: 'string', description: 'API version', example: 'v1' },
            apiVersion: { type: 'string', description: 'Full API version', example: '1.2.0' },
            vSphereVersion: { type: 'string', description: 'vSphere version', example: '8.0.2' },
            buildNumber: { type: 'string', description: 'Build number', example: '22380479' },
            productLineId: { type: 'string', description: 'Product line', example: 'vpx' },
            compatibleVersions: { type: 'array', items: { type: 'string' }, description: 'Compatible API versions', example: ['v1', 'v2'] },
            deprecatedVersions: { type: 'array', items: { type: 'string' }, description: 'Deprecated versions', example: ['v0'] },
            supportedFeatures: { type: 'array', items: { type: 'string' }, description: 'Supported features', example: ['vmotion', 'drs', 'ha'] },
        },
        required: ['version', 'apiVersion', 'vSphereVersion'],
    };
};
exports.createApiVersionSchema = createApiVersionSchema;
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
const createApiHealthCheckSchema = () => {
    return {
        type: 'object',
        description: 'API health check status',
        properties: {
            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'], example: 'healthy' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            uptime: { type: 'integer', description: 'Uptime in seconds', example: 86400 },
            version: { type: 'string', description: 'API version', example: '1.2.0' },
            components: {
                type: 'object',
                properties: {
                    vCenter: {
                        type: 'object',
                        properties: {
                            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'], example: 'healthy' },
                            responseTime: { type: 'integer', description: 'Response time in ms', example: 50 },
                            lastCheck: { type: 'string', format: 'date-time' },
                        },
                    },
                    database: {
                        type: 'object',
                        properties: {
                            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'], example: 'healthy' },
                            responseTime: { type: 'integer', description: 'Response time in ms', example: 10 },
                            connections: { type: 'integer', description: 'Active connections', example: 5 },
                        },
                    },
                    cache: {
                        type: 'object',
                        properties: {
                            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'], example: 'healthy' },
                            hitRate: { type: 'number', minimum: 0, maximum: 1, description: 'Cache hit rate', example: 0.85 },
                        },
                    },
                },
            },
        },
        required: ['status', 'timestamp', 'uptime', 'version'],
    };
};
exports.createApiHealthCheckSchema = createApiHealthCheckSchema;
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
const createRateLimitSchema = () => {
    return {
        type: 'object',
        description: 'API rate limit information',
        properties: {
            tier: { type: 'string', enum: ['free', 'standard', 'premium', 'enterprise'], description: 'Rate limit tier', example: 'standard' },
            limit: { type: 'integer', description: 'Requests allowed per window', example: 1000 },
            remaining: { type: 'integer', description: 'Requests remaining in window', example: 750 },
            window: { type: 'string', description: 'Time window', example: '1 hour' },
            reset: { type: 'string', format: 'date-time', description: 'Time when limit resets', example: '2024-01-15T11:00:00Z' },
            retryAfter: { type: 'integer', description: 'Seconds to wait before retry (on 429)', example: 60 },
        },
        required: ['tier', 'limit', 'remaining', 'window', 'reset'],
    };
};
exports.createRateLimitSchema = createRateLimitSchema;
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
const createApiCapabilitySchema = () => {
    return {
        type: 'object',
        description: 'API capabilities and feature support',
        properties: {
            operations: {
                type: 'object',
                properties: {
                    virtualMachines: { type: 'array', items: { type: 'string' }, example: ['create', 'read', 'update', 'delete', 'clone', 'snapshot'] },
                    hosts: { type: 'array', items: { type: 'string' }, example: ['read', 'update', 'maintenance'] },
                    datastores: { type: 'array', items: { type: 'string' }, example: ['read', 'create', 'delete'] },
                    networks: { type: 'array', items: { type: 'string' }, example: ['read', 'create', 'update', 'delete'] },
                },
            },
            features: {
                type: 'object',
                properties: {
                    vmotion: { type: 'boolean', description: 'vMotion support', example: true },
                    drs: { type: 'boolean', description: 'DRS support', example: true },
                    ha: { type: 'boolean', description: 'HA support', example: true },
                    snapshots: { type: 'boolean', description: 'Snapshot support', example: true },
                    linkedClones: { type: 'boolean', description: 'Linked clone support', example: true },
                    nsx: { type: 'boolean', description: 'NSX integration', example: true },
                },
            },
            limits: {
                type: 'object',
                properties: {
                    maxVMsPerHost: { type: 'integer', example: 1024 },
                    maxVMsPerCluster: { type: 'integer', example: 8000 },
                    maxCPUsPerVM: { type: 'integer', example: 128 },
                    maxMemoryPerVMGB: { type: 'integer', example: 6144 },
                },
            },
        },
        required: ['operations', 'features', 'limits'],
    };
};
exports.createApiCapabilitySchema = createApiCapabilitySchema;
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
const createApiDeprecationNoticeSchema = () => {
    return {
        type: 'object',
        description: 'API deprecation notice',
        properties: {
            deprecated: { type: 'boolean', description: 'Endpoint is deprecated', example: true },
            sunsetDate: { type: 'string', format: 'date', description: 'Date when endpoint will be removed', example: '2024-12-31' },
            deprecationDate: { type: 'string', format: 'date', description: 'Date when deprecated', example: '2024-06-01' },
            alternativeEndpoint: { type: 'string', description: 'Recommended alternative endpoint', example: '/api/v2/virtual-machines' },
            migrationGuide: { type: 'string', format: 'uri', description: 'URL to migration guide', example: 'https://docs.example.com/migration/v1-to-v2' },
            reason: { type: 'string', description: 'Deprecation reason', example: 'Replaced by improved v2 API with better performance' },
            breakingChanges: { type: 'array', items: { type: 'string' }, description: 'List of breaking changes in new version' },
        },
        required: ['deprecated', 'sunsetDate', 'alternativeEndpoint'],
    };
};
exports.createApiDeprecationNoticeSchema = createApiDeprecationNoticeSchema;
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
const createVRealizeMetadataSchema = () => {
    return {
        type: 'object',
        description: 'VMware vRealize API integration metadata',
        properties: {
            vRACompatible: { type: 'boolean', description: 'Compatible with vRealize Automation', example: true },
            vROCompatible: { type: 'boolean', description: 'Compatible with vRealize Orchestrator', example: true },
            vRLICompatible: { type: 'boolean', description: 'Compatible with vRealize Log Insight', example: true },
            blueprintActions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Provision VM' },
                        operation: { type: 'string', example: 'POST /virtual-machines' },
                        category: { type: 'string', example: 'Compute' },
                    },
                },
            },
            workflowMappings: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        workflowName: { type: 'string', example: 'Create and Configure VM' },
                        apiEndpoints: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        },
    };
};
exports.createVRealizeMetadataSchema = createVRealizeMetadataSchema;
// ============================================================================
// 6. ERROR & VALIDATION SCHEMAS (32-37)
// ============================================================================
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
const createVirtualErrorSchema = (statusCode) => {
    return {
        type: 'object',
        description: 'Virtual infrastructure API error response',
        properties: {
            statusCode: { type: 'integer', example: statusCode },
            error: { type: 'string', example: statusCode === 404 ? 'Not Found' : 'Error' },
            message: { type: 'string', example: 'Virtual machine not found' },
            code: { type: 'string', description: 'Error code', example: 'VM_NOT_FOUND' },
            vmwareErrorCode: { type: 'string', description: 'VMware vSphere error code', example: 'com.vmware.vapi.std.errors.not_found' },
            details: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string', description: 'Field name', example: 'vmId' },
                        message: { type: 'string', description: 'Field error message', example: 'VM with ID vm-123 does not exist' },
                        code: { type: 'string', description: 'Field error code', example: 'INVALID_ID' },
                    },
                },
            },
            remediation: { type: 'string', description: 'Suggested remediation', example: 'Verify VM ID and ensure VM exists in inventory' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            path: { type: 'string', description: 'Request path', example: '/api/v1/virtual-machines/vm-123' },
            requestId: { type: 'string', format: 'uuid', description: 'Request tracking ID' },
        },
        required: ['statusCode', 'error', 'message', 'code', 'timestamp'],
    };
};
exports.createVirtualErrorSchema = createVirtualErrorSchema;
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
const createValidationErrorSchema = () => {
    return {
        type: 'object',
        description: 'Request validation error response',
        properties: {
            statusCode: { type: 'integer', example: 422 },
            error: { type: 'string', example: 'Unprocessable Entity' },
            message: { type: 'string', example: 'Request validation failed' },
            validationErrors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string', description: 'Field path', example: 'cpu.cores' },
                        value: { description: 'Invalid value provided' },
                        constraint: { type: 'string', description: 'Validation constraint violated', example: 'minimum' },
                        message: { type: 'string', description: 'Validation error message', example: 'cpu.cores must be at least 1' },
                    },
                    required: ['field', 'constraint', 'message'],
                },
            },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
        },
        required: ['statusCode', 'error', 'message', 'validationErrors', 'timestamp'],
    };
};
exports.createValidationErrorSchema = createValidationErrorSchema;
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
const createVMwareFaultSchema = (faultType) => {
    return {
        type: 'object',
        description: `VMware vSphere ${faultType} fault`,
        properties: {
            faultCause: { type: 'string', description: 'Fault cause' },
            faultMessage: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        key: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
            },
            fault: {
                type: 'object',
                properties: {
                    faultType: { type: 'string', example: faultType },
                    invalidProperty: { type: 'string', description: 'Invalid property name' },
                    requestedState: { type: 'string', description: 'Requested state' },
                    existingState: { type: 'string', description: 'Current state' },
                },
            },
        },
        required: ['fault'],
    };
};
exports.createVMwareFaultSchema = createVMwareFaultSchema;
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
const createResourceQuotaErrorSchema = () => {
    return {
        type: 'object',
        description: 'Resource quota exceeded error',
        properties: {
            statusCode: { type: 'integer', example: 403 },
            error: { type: 'string', example: 'Forbidden' },
            message: { type: 'string', example: 'Resource quota exceeded' },
            code: { type: 'string', example: 'QUOTA_EXCEEDED' },
            resource: { type: 'string', description: 'Resource type', example: 'virtualMachines' },
            quota: {
                type: 'object',
                properties: {
                    limit: { type: 'integer', description: 'Quota limit', example: 100 },
                    used: { type: 'integer', description: 'Current usage', example: 100 },
                    requested: { type: 'integer', description: 'Requested amount', example: 1 },
                    unit: { type: 'string', description: 'Quota unit', example: 'count' },
                },
            },
            remediation: { type: 'string', example: 'Delete existing VMs or request quota increase' },
            timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['statusCode', 'error', 'message', 'code', 'resource', 'quota'],
    };
};
exports.createResourceQuotaErrorSchema = createResourceQuotaErrorSchema;
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
const createConcurrentModificationErrorSchema = () => {
    return {
        type: 'object',
        description: 'Concurrent modification conflict error',
        properties: {
            statusCode: { type: 'integer', example: 409 },
            error: { type: 'string', example: 'Conflict' },
            message: { type: 'string', example: 'Resource has been modified by another request' },
            code: { type: 'string', example: 'CONCURRENT_MODIFICATION' },
            resourceId: { type: 'string', description: 'Conflicting resource ID', example: 'vm-123' },
            expectedVersion: { type: 'string', description: 'Expected resource version', example: 'v42' },
            actualVersion: { type: 'string', description: 'Current resource version', example: 'v43' },
            modifiedBy: { type: 'string', description: 'User who made conflicting modification', example: 'admin@example.com' },
            modifiedAt: { type: 'string', format: 'date-time', description: 'Time of conflicting modification' },
            remediation: { type: 'string', example: 'Retrieve latest version and retry operation' },
            timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['statusCode', 'error', 'message', 'code', 'resourceId', 'expectedVersion', 'actualVersion'],
    };
};
exports.createConcurrentModificationErrorSchema = createConcurrentModificationErrorSchema;
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
const createInsufficientPermissionsErrorSchema = () => {
    return {
        type: 'object',
        description: 'Insufficient permissions error',
        properties: {
            statusCode: { type: 'integer', example: 403 },
            error: { type: 'string', example: 'Forbidden' },
            message: { type: 'string', example: 'Insufficient permissions to perform this operation' },
            code: { type: 'string', example: 'INSUFFICIENT_PERMISSIONS' },
            operation: { type: 'string', description: 'Attempted operation', example: 'VirtualMachine.delete' },
            resource: { type: 'string', description: 'Target resource', example: 'vm-123' },
            requiredPermissions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Required permissions',
                example: ['VirtualMachine.Inventory.Delete', 'Datastore.DeleteFile'],
            },
            userRole: { type: 'string', description: 'Current user role', example: 'read-only' },
            remediation: { type: 'string', example: 'Contact administrator to grant required permissions' },
            timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['statusCode', 'error', 'message', 'code', 'operation', 'requiredPermissions'],
    };
};
exports.createInsufficientPermissionsErrorSchema = createInsufficientPermissionsErrorSchema;
// ============================================================================
// 7. RESPONSE DOCUMENTATION HELPERS (38-43)
// ============================================================================
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
const createVirtualPaginatedResponse = (itemType, description) => {
    return {
        type: 'object',
        description,
        properties: {
            items: { type: 'array', items: { $ref: `#/components/schemas/${itemType.name}` } },
            total: { type: 'integer', description: 'Total items matching query', example: 250 },
            page: { type: 'integer', description: 'Current page (1-indexed)', example: 1 },
            pageSize: { type: 'integer', description: 'Items per page', example: 20 },
            totalPages: { type: 'integer', description: 'Total pages', example: 13 },
            hasNext: { type: 'boolean', description: 'Has next page', example: true },
            hasPrevious: { type: 'boolean', description: 'Has previous page', example: false },
            links: {
                type: 'object',
                properties: {
                    first: { type: 'string', format: 'uri', example: '/api/v1/virtual-machines?page=1&pageSize=20' },
                    prev: { type: 'string', format: 'uri', nullable: true },
                    self: { type: 'string', format: 'uri', example: '/api/v1/virtual-machines?page=1&pageSize=20' },
                    next: { type: 'string', format: 'uri', example: '/api/v1/virtual-machines?page=2&pageSize=20' },
                    last: { type: 'string', format: 'uri', example: '/api/v1/virtual-machines?page=13&pageSize=20' },
                },
            },
        },
        required: ['items', 'total', 'page', 'pageSize', 'totalPages'],
    };
};
exports.createVirtualPaginatedResponse = createVirtualPaginatedResponse;
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
const createAsyncOperationAcceptedResponse = (operation) => {
    return {
        type: 'object',
        description: `${operation} operation accepted and queued for processing`,
        properties: {
            statusCode: { type: 'integer', example: 202 },
            message: { type: 'string', example: `${operation} operation accepted` },
            taskId: { type: 'string', format: 'uuid', description: 'Task ID for status tracking', example: 'task-12345678-1234-1234-1234-123456789012' },
            statusUrl: { type: 'string', format: 'uri', description: 'URL to check task status', example: '/api/v1/tasks/task-12345678' },
            estimatedCompletion: { type: 'string', format: 'date-time', description: 'Estimated completion time' },
            operation: { type: 'string', description: 'Operation type', example: operation },
        },
        required: ['statusCode', 'message', 'taskId', 'statusUrl', 'operation'],
    };
};
exports.createAsyncOperationAcceptedResponse = createAsyncOperationAcceptedResponse;
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
const createBulkOperationResponse = (operation) => {
    return {
        type: 'object',
        description: `Bulk ${operation} operation results`,
        properties: {
            operation: { type: 'string', example: operation },
            totalRequests: { type: 'integer', description: 'Total number of items', example: 10 },
            successCount: { type: 'integer', description: 'Successful operations', example: 8 },
            failureCount: { type: 'integer', description: 'Failed operations', example: 2 },
            results: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Item ID', example: 'vm-123' },
                        status: { type: 'string', enum: ['success', 'error'], example: 'success' },
                        message: { type: 'string', description: 'Result message' },
                        error: { type: 'object', description: 'Error details if failed' },
                    },
                },
            },
        },
        required: ['operation', 'totalRequests', 'successCount', 'failureCount', 'results'],
    };
};
exports.createBulkOperationResponse = createBulkOperationResponse;
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
const createExportOperationResponse = (format) => {
    return {
        type: 'object',
        description: `VM export to ${format.toUpperCase()} format`,
        properties: {
            exportId: { type: 'string', format: 'uuid', description: 'Export operation ID', example: 'export-12345678' },
            format: { type: 'string', enum: ['ova', 'ovf', 'vmdk', 'json'], example: format },
            status: { type: 'string', enum: ['preparing', 'ready', 'expired'], example: 'ready' },
            downloadUrl: { type: 'string', format: 'uri', description: 'Download URL (temporary)', example: `https://storage.example.com/exports/vm-123.${format}` },
            expiresAt: { type: 'string', format: 'date-time', description: 'Download URL expiration', example: '2024-01-15T18:30:00Z' },
            sizeBytes: { type: 'integer', description: 'Export file size in bytes', example: 10737418240 },
            checksum: { type: 'string', description: 'SHA256 checksum', example: 'a1b2c3d4...' },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['exportId', 'format', 'status', 'downloadUrl', 'expiresAt', 'sizeBytes'],
    };
};
exports.createExportOperationResponse = createExportOperationResponse;
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
const createImportValidationResponse = () => {
    return {
        type: 'object',
        description: 'VM import validation results',
        properties: {
            valid: { type: 'boolean', description: 'Import is valid', example: true },
            warnings: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', example: 'HARDWARE_VERSION_MISMATCH' },
                        message: { type: 'string', example: 'Source hardware version 14 will be upgraded to 19' },
                        severity: { type: 'string', enum: ['info', 'warning', 'error'], example: 'warning' },
                    },
                },
            },
            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', example: 'INSUFFICIENT_STORAGE' },
                        message: { type: 'string', example: 'Datastore has insufficient space for import' },
                        remediation: { type: 'string', example: 'Free up 100GB on target datastore or select different datastore' },
                    },
                },
            },
            compatibility: {
                type: 'object',
                properties: {
                    sourceFormat: { type: 'string', example: 'OVF 2.0' },
                    targetVersion: { type: 'string', example: 'vSphere 8.0' },
                    compatible: { type: 'boolean', example: true },
                },
            },
            estimatedImportTime: { type: 'integer', description: 'Estimated import time in seconds', example: 600 },
        },
        required: ['valid', 'warnings', 'errors', 'compatibility'],
    };
};
exports.createImportValidationResponse = createImportValidationResponse;
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
const createMetricsCollectionResponse = (metricType) => {
    return {
        type: 'object',
        description: `${metricType} metrics collection`,
        properties: {
            resourceId: { type: 'string', description: 'Resource identifier', example: 'vm-123' },
            resourceType: { type: 'string', enum: ['vm', 'host', 'datastore', 'cluster'], example: 'vm' },
            metricType: { type: 'string', example: metricType },
            interval: { type: 'integer', description: 'Metric collection interval in seconds', example: 20 },
            startTime: { type: 'string', format: 'date-time', description: 'Metrics start time', example: '2024-01-15T10:00:00Z' },
            endTime: { type: 'string', format: 'date-time', description: 'Metrics end time', example: '2024-01-15T11:00:00Z' },
            dataPoints: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00Z' },
                        metrics: {
                            type: 'object',
                            properties: {
                                'cpu.usage.average': { type: 'number', description: 'Average CPU usage %', example: 45.5 },
                                'mem.usage.average': { type: 'number', description: 'Average memory usage %', example: 62.3 },
                                'disk.read.average': { type: 'number', description: 'Average disk read KB/s', example: 1024 },
                                'disk.write.average': { type: 'number', description: 'Average disk write KB/s', example: 512 },
                                'net.transmitted.average': { type: 'number', description: 'Average network TX KB/s', example: 256 },
                                'net.received.average': { type: 'number', description: 'Average network RX KB/s', example: 128 },
                            },
                        },
                    },
                },
            },
            aggregations: {
                type: 'object',
                properties: {
                    average: { type: 'object', additionalProperties: { type: 'number' } },
                    minimum: { type: 'object', additionalProperties: { type: 'number' } },
                    maximum: { type: 'object', additionalProperties: { type: 'number' } },
                    percentile95: { type: 'object', additionalProperties: { type: 'number' } },
                },
            },
        },
        required: ['resourceId', 'resourceType', 'metricType', 'interval', 'startTime', 'endTime', 'dataPoints'],
    };
};
exports.createMetricsCollectionResponse = createMetricsCollectionResponse;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // VM Schemas
    createVirtualMachineSchema: exports.createVirtualMachineSchema,
    createVMPowerOperationSchema: exports.createVMPowerOperationSchema,
    createVMSnapshotSchema: exports.createVMSnapshotSchema,
    createVMCloneSchema: exports.createVMCloneSchema,
    createVMMigrationSchema: exports.createVMMigrationSchema,
    createVMResourceAllocationSchema: exports.createVMResourceAllocationSchema,
    createVMGuestCustomizationSchema: exports.createVMGuestCustomizationSchema,
    createVMConsoleSchema: exports.createVMConsoleSchema,
    // Hypervisor & Host Schemas
    createHypervisorHostSchema: exports.createHypervisorHostSchema,
    createHostMaintenanceModeSchema: exports.createHostMaintenanceModeSchema,
    createClusterSchema: exports.createClusterSchema,
    createDatastoreSchema: exports.createDatastoreSchema,
    createResourcePoolSchema: exports.createResourcePoolSchema,
    createVCenterSchema: exports.createVCenterSchema,
    // Virtual Network Schemas
    createVirtualSwitchSchema: exports.createVirtualSwitchSchema,
    createPortGroupSchema: exports.createPortGroupSchema,
    createVirtualNICSchema: exports.createVirtualNICSchema,
    createNSXNetworkSchema: exports.createNSXNetworkSchema,
    createDistributedFirewallRuleSchema: exports.createDistributedFirewallRuleSchema,
    // Task & Async Operations
    createTaskStatusSchema: exports.createTaskStatusSchema,
    createTaskCancelSchema: exports.createTaskCancelSchema,
    createBatchOperationSchema: exports.createBatchOperationSchema,
    createBatchOperationResultSchema: exports.createBatchOperationResultSchema,
    createScheduledTaskSchema: exports.createScheduledTaskSchema,
    createTaskHistorySchema: exports.createTaskHistorySchema,
    // API Versioning & Metadata
    createApiVersionSchema: exports.createApiVersionSchema,
    createApiHealthCheckSchema: exports.createApiHealthCheckSchema,
    createRateLimitSchema: exports.createRateLimitSchema,
    createApiCapabilitySchema: exports.createApiCapabilitySchema,
    createApiDeprecationNoticeSchema: exports.createApiDeprecationNoticeSchema,
    createVRealizeMetadataSchema: exports.createVRealizeMetadataSchema,
    // Error & Validation
    createVirtualErrorSchema: exports.createVirtualErrorSchema,
    createValidationErrorSchema: exports.createValidationErrorSchema,
    createVMwareFaultSchema: exports.createVMwareFaultSchema,
    createResourceQuotaErrorSchema: exports.createResourceQuotaErrorSchema,
    createConcurrentModificationErrorSchema: exports.createConcurrentModificationErrorSchema,
    createInsufficientPermissionsErrorSchema: exports.createInsufficientPermissionsErrorSchema,
    // Response Helpers
    createVirtualPaginatedResponse: exports.createVirtualPaginatedResponse,
    createAsyncOperationAcceptedResponse: exports.createAsyncOperationAcceptedResponse,
    createBulkOperationResponse: exports.createBulkOperationResponse,
    createExportOperationResponse: exports.createExportOperationResponse,
    createImportValidationResponse: exports.createImportValidationResponse,
    createMetricsCollectionResponse: exports.createMetricsCollectionResponse,
};
//# sourceMappingURL=virtual-api-documentation-kit.js.map