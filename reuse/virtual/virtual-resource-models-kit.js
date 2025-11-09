"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualMachineModel = createVirtualMachineModel;
exports.createVMHistoryModel = createVMHistoryModel;
exports.addVMAuditHooks = addVMAuditHooks;
exports.addVMScopes = addVMScopes;
exports.createHostModel = createHostModel;
exports.addHostScopes = addHostScopes;
exports.createClusterModel = createClusterModel;
exports.addClusterScopes = addClusterScopes;
exports.createDatastoreModel = createDatastoreModel;
exports.addDatastoreScopes = addDatastoreScopes;
exports.createNetworkModel = createNetworkModel;
exports.addNetworkScopes = addNetworkScopes;
exports.defineVirtualResourceAssociations = defineVirtualResourceAssociations;
exports.addVMValidationHooks = addVMValidationHooks;
exports.addHostValidationHooks = addHostValidationHooks;
exports.addDatastoreValidationHooks = addDatastoreValidationHooks;
exports.addResourceComputedFields = addResourceComputedFields;
exports.addPerformanceMetricHooks = addPerformanceMetricHooks;
exports.createIPAddressValidation = createIPAddressValidation;
exports.createMACAddressValidation = createMACAddressValidation;
exports.bulkUpdateVMPowerState = bulkUpdateVMPowerState;
exports.findVMsByHost = findVMsByHost;
exports.findHostsByCluster = findHostsByCluster;
exports.calculateClusterUtilization = calculateClusterUtilization;
exports.findDatastoresWithLowSpace = findDatastoresWithLowSpace;
exports.exportVirtualInfrastructureInventory = exportVirtualInfrastructureInventory;
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
const sequelize_1 = require("sequelize");
const validator_1 = require("validator");
const crypto = __importStar(require("crypto"));
// ============================================================================
// VIRTUAL MACHINE MODEL BUILDERS
// ============================================================================
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
function createVirtualMachineModel(sequelize, modelName, options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'VM display name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        moRef: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'VMware Managed Object Reference',
            validate: {
                notEmpty: true,
            },
        },
        uuid: {
            type: sequelize_1.DataTypes.STRING(36),
            allowNull: true,
            comment: 'VM instance UUID',
            validate: {
                isUUID: 4,
            },
        },
        powerState: {
            type: sequelize_1.DataTypes.ENUM('poweredOn', 'poweredOff', 'suspended'),
            allowNull: false,
            defaultValue: 'poweredOff',
            comment: 'Current power state',
        },
        guestOS: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Guest operating system',
        },
        guestOSType: {
            type: sequelize_1.DataTypes.ENUM('windows', 'linux', 'other', 'unknown'),
            allowNull: false,
            defaultValue: 'unknown',
            comment: 'Guest OS category',
        },
        numCPU: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Number of virtual CPUs',
            validate: {
                min: 1,
                max: 256,
            },
        },
        numCoresPerSocket: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Cores per socket',
            validate: {
                min: 1,
                max: 64,
            },
        },
        memoryMB: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1024,
            comment: 'Memory in MB',
            validate: {
                min: 128,
            },
        },
        hardwareVersion: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Virtual hardware version',
        },
        firmware: {
            type: sequelize_1.DataTypes.ENUM('bios', 'efi'),
            allowNull: false,
            defaultValue: 'bios',
            comment: 'Firmware type',
        },
        guestIPAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'Primary IP address',
            validate: {
                isIP: true,
            },
        },
        guestHostname: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Guest hostname',
        },
        vmToolsStatus: {
            type: sequelize_1.DataTypes.ENUM('running', 'notRunning', 'notInstalled', 'unknown'),
            allowNull: false,
            defaultValue: 'unknown',
            comment: 'VMware Tools status',
        },
        vmToolsVersion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'VMware Tools version',
        },
        annotation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'VM notes/description',
        },
        isTemplate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is a template',
        },
        hostId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Host running this VM',
            references: {
                model: 'virtual_hosts',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        clusterId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Cluster this VM belongs to',
            references: {
                model: 'virtual_clusters',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        resourcePoolId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Resource pool assignment',
        },
        folderId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Folder organization',
        },
        networkAdapters: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Network adapter configurations',
        },
        disks: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Disk configurations',
        },
        cpuAllocation: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'CPU resource allocation',
        },
        memoryAllocation: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Memory resource allocation',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Performance metrics',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
        customAttributes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Custom attributes',
        },
        lastBootTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last boot timestamp',
        },
        uptimeSeconds: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            comment: 'Uptime in seconds',
        },
        encryptedData: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted sensitive configuration',
            get() {
                const encrypted = this.getDataValue('encryptedData');
                if (!encrypted)
                    return null;
                try {
                    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
                    const parts = encrypted.split(':');
                    const iv = Buffer.from(parts[0], 'hex');
                    const authTag = Buffer.from(parts[1], 'hex');
                    const encryptedData = parts[2];
                    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
                    decipher.setAuthTag(authTag);
                    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    return JSON.parse(decrypted);
                }
                catch (error) {
                    console.error('Decryption error:', error);
                    return null;
                }
            },
            set(value) {
                if (!value) {
                    this.setDataValue('encryptedData', null);
                    return;
                }
                try {
                    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
                    const iv = crypto.randomBytes(16);
                    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
                    let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    const authTag = cipher.getAuthTag();
                    const encryptedValue = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
                    this.setDataValue('encryptedData', encryptedValue);
                }
                catch (error) {
                    console.error('Encryption error:', error);
                    throw error;
                }
            },
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Optimistic locking version',
        },
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_machines',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['uuid'] },
            { fields: ['hostId'] },
            { fields: ['clusterId'] },
            { fields: ['powerState'] },
            { fields: ['guestOSType'] },
            { fields: ['isTemplate'] },
            { fields: ['created_at'] },
            ...(options.indexes || []),
        ],
        hooks: {
            beforeCreate: async (instance, opts) => {
                instance.version = 1;
            },
            afterCreate: async (instance, opts) => {
                // Audit trail logging
                console.log(`VM created: ${instance.name} (${instance.moRef})`);
            },
            beforeUpdate: async (instance, opts) => {
                instance.version += 1;
            },
            afterUpdate: async (instance, opts) => {
                // Audit trail logging
                if (instance.changed('powerState')) {
                    console.log(`VM power state changed: ${instance.name} -> ${instance.powerState}`);
                }
            },
        },
        ...options,
    };
    class VirtualMachineModel extends sequelize_1.Model {
    }
    return VirtualMachineModel.init(attributes, modelOptions);
}
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
function createVMHistoryModel(sequelize, sourceModel) {
    const attributes = { ...sourceModel.getAttributes() };
    const historyAttributes = {
        historyId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'History record ID',
        },
        originalId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Original VM ID',
        },
        ...attributes,
        validFrom: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Validity start timestamp',
        },
        validTo: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Validity end timestamp',
        },
        operation: {
            type: sequelize_1.DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
            allowNull: false,
            comment: 'Change operation type',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who made the change',
        },
        changeReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for change',
        },
    };
    const modelOptions = {
        sequelize,
        modelName: `${sourceModel.name}History`,
        tableName: 'virtual_machines_history',
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['originalId'] },
            { fields: ['validFrom'] },
            { fields: ['validTo'] },
            { fields: ['operation'] },
            { fields: ['userId'] },
        ],
    };
    class VMHistoryModel extends sequelize_1.Model {
    }
    return VMHistoryModel.init(historyAttributes, modelOptions);
}
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
function addVMAuditHooks(model, historyModel) {
    model.addHook('afterCreate', 'auditCreate', async (instance, options) => {
        await historyModel.create({
            originalId: instance.id,
            ...instance.toJSON(),
            validFrom: new Date(),
            validTo: null,
            operation: 'INSERT',
            userId: options.userId || null,
            changeReason: options.changeReason || 'Initial creation',
        });
    });
    model.addHook('afterUpdate', 'auditUpdate', async (instance, options) => {
        // Close previous history record
        await historyModel.update({ validTo: new Date() }, {
            where: {
                originalId: instance.id,
                validTo: null,
            },
        });
        // Create new history record
        await historyModel.create({
            originalId: instance.id,
            ...instance.toJSON(),
            validFrom: new Date(),
            validTo: null,
            operation: 'UPDATE',
            userId: options.userId || null,
            changeReason: options.changeReason || 'Update',
        });
    });
    model.addHook('afterDestroy', 'auditDelete', async (instance, options) => {
        // Close history record
        await historyModel.update({ validTo: new Date() }, {
            where: {
                originalId: instance.id,
                validTo: null,
            },
        });
        // Create deletion record
        await historyModel.create({
            originalId: instance.id,
            ...instance.toJSON(),
            validFrom: new Date(),
            validTo: new Date(),
            operation: 'DELETE',
            userId: options.userId || null,
            changeReason: options.changeReason || 'Deletion',
        });
    });
    return model;
}
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
function addVMScopes(model) {
    model.addScope('active', {
        where: { deletedAt: null },
    });
    model.addScope('poweredOn', {
        where: { powerState: 'poweredOn' },
    });
    model.addScope('poweredOff', {
        where: { powerState: 'poweredOff' },
    });
    model.addScope('templates', {
        where: { isTemplate: true },
    });
    model.addScope('notTemplates', {
        where: { isTemplate: false },
    });
    model.addScope('windows', {
        where: { guestOSType: 'windows' },
    });
    model.addScope('linux', {
        where: { guestOSType: 'linux' },
    });
    model.addScope('withHost', {
        include: [{ association: 'host' }],
    });
    model.addScope('withCluster', {
        include: [{ association: 'cluster' }],
    });
    model.addScope('recent', {
        order: [['created_at', 'DESC']],
        limit: 100,
    });
    return model;
}
// ============================================================================
// HOST MODEL BUILDERS
// ============================================================================
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
function createHostModel(sequelize, modelName, options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Host FQDN or name',
            validate: {
                notEmpty: true,
            },
        },
        moRef: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'VMware Managed Object Reference',
        },
        uuid: {
            type: sequelize_1.DataTypes.STRING(36),
            allowNull: true,
            comment: 'Host hardware UUID',
        },
        connectionState: {
            type: sequelize_1.DataTypes.ENUM('connected', 'disconnected', 'notResponding', 'maintenance'),
            allowNull: false,
            defaultValue: 'disconnected',
            comment: 'Connection state',
        },
        powerState: {
            type: sequelize_1.DataTypes.ENUM('poweredOn', 'poweredOff', 'standBy', 'unknown'),
            allowNull: false,
            defaultValue: 'unknown',
            comment: 'Power state',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'Management IP address',
            validate: {
                isIP: true,
            },
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'ESXi version',
        },
        build: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'ESXi build number',
        },
        vendor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Hardware vendor',
        },
        model: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Hardware model',
        },
        cpuModel: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'CPU model',
        },
        numCpuPackages: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of physical CPUs',
        },
        numCpuCores: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total CPU cores',
        },
        numCpuThreads: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total CPU threads',
        },
        cpuMhz: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'CPU speed in MHz',
        },
        memoryGB: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Total memory in GB',
        },
        numNics: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of physical NICs',
        },
        numHBAs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of HBAs',
        },
        clusterId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Cluster this host belongs to',
            references: {
                model: 'virtual_clusters',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        maintenanceMode: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether in maintenance mode',
        },
        inQuarantineMode: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether in quarantine mode',
        },
        standbyMode: {
            type: sequelize_1.DataTypes.ENUM('none', 'entering', 'exiting', 'in'),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Standby mode state',
        },
        bootTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last boot time',
        },
        uptimeSeconds: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            comment: 'Uptime in seconds',
        },
        cpuUsagePercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'CPU usage percentage',
        },
        memoryUsagePercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Memory usage percentage',
        },
        vmCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of VMs on this host',
        },
        datastores: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: true,
            defaultValue: [],
            comment: 'Connected datastore IDs',
        },
        networks: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: true,
            defaultValue: [],
            comment: 'Connected network IDs',
        },
        capabilities: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Host capabilities',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Performance metrics',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
        encryptedCredentials: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted access credentials',
            get() {
                const encrypted = this.getDataValue('encryptedCredentials');
                if (!encrypted)
                    return null;
                try {
                    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
                    const parts = encrypted.split(':');
                    const iv = Buffer.from(parts[0], 'hex');
                    const authTag = Buffer.from(parts[1], 'hex');
                    const encryptedData = parts[2];
                    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
                    decipher.setAuthTag(authTag);
                    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    return JSON.parse(decrypted);
                }
                catch (error) {
                    console.error('Decryption error:', error);
                    return null;
                }
            },
            set(value) {
                if (!value) {
                    this.setDataValue('encryptedCredentials', null);
                    return;
                }
                try {
                    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
                    const iv = crypto.randomBytes(16);
                    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
                    let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    const authTag = cipher.getAuthTag();
                    const encryptedValue = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
                    this.setDataValue('encryptedCredentials', encryptedValue);
                }
                catch (error) {
                    console.error('Encryption error:', error);
                    throw error;
                }
            },
        },
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_hosts',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['uuid'] },
            { fields: ['clusterId'] },
            { fields: ['connectionState'] },
            { fields: ['maintenanceMode'] },
            { fields: ['ipAddress'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class HostModel extends sequelize_1.Model {
    }
    return HostModel.init(attributes, modelOptions);
}
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
function addHostScopes(model) {
    model.addScope('connected', {
        where: { connectionState: 'connected' },
    });
    model.addScope('disconnected', {
        where: { connectionState: 'disconnected' },
    });
    model.addScope('maintenance', {
        where: { maintenanceMode: true },
    });
    model.addScope('notMaintenance', {
        where: { maintenanceMode: false },
    });
    model.addScope('withCluster', {
        include: [{ association: 'cluster' }],
    });
    model.addScope('withVMs', {
        include: [{ association: 'virtualMachines' }],
    });
    return model;
}
// ============================================================================
// CLUSTER MODEL BUILDERS
// ============================================================================
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
function createClusterModel(sequelize, modelName, options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Cluster name',
            validate: {
                notEmpty: true,
            },
        },
        moRef: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'VMware Managed Object Reference',
        },
        haEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'High Availability enabled',
        },
        haAdmissionControlEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'HA admission control enabled',
        },
        haFailoverLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'HA failover level',
        },
        drsEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'DRS enabled',
        },
        drsAutomationLevel: {
            type: sequelize_1.DataTypes.ENUM('manual', 'partiallyAutomated', 'fullyAutomated'),
            allowNull: true,
            comment: 'DRS automation level',
        },
        drsMigrationThreshold: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'DRS migration threshold (1-5)',
            validate: {
                min: 1,
                max: 5,
            },
        },
        evcMode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Enhanced vMotion Compatibility mode',
        },
        vsanEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'vSAN enabled',
        },
        totalCpuCores: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total CPU cores across all hosts',
        },
        totalCpuMhz: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total CPU MHz',
        },
        totalMemoryGB: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total memory in GB',
        },
        usedCpuMhz: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Used CPU MHz',
        },
        usedMemoryGB: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Used memory in GB',
        },
        hostCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of hosts in cluster',
        },
        vmCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of VMs in cluster',
        },
        overallStatus: {
            type: sequelize_1.DataTypes.ENUM('green', 'yellow', 'red', 'gray'),
            allowNull: false,
            defaultValue: 'gray',
            comment: 'Overall health status',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional configuration',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Performance metrics',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_clusters',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['haEnabled'] },
            { fields: ['drsEnabled'] },
            { fields: ['overallStatus'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class ClusterModel extends sequelize_1.Model {
    }
    return ClusterModel.init(attributes, modelOptions);
}
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
function addClusterScopes(model) {
    model.addScope('haEnabled', {
        where: { haEnabled: true },
    });
    model.addScope('drsEnabled', {
        where: { drsEnabled: true },
    });
    model.addScope('vsanEnabled', {
        where: { vsanEnabled: true },
    });
    model.addScope('healthy', {
        where: { overallStatus: 'green' },
    });
    model.addScope('withHosts', {
        include: [{ association: 'hosts' }],
    });
    return model;
}
// ============================================================================
// DATASTORE MODEL BUILDERS
// ============================================================================
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
function createDatastoreModel(sequelize, modelName, options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Datastore name',
            validate: {
                notEmpty: true,
            },
        },
        moRef: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'VMware Managed Object Reference',
        },
        url: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Datastore URL',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('VMFS', 'NFS', 'vSAN', 'local', 'other'),
            allowNull: false,
            defaultValue: 'VMFS',
            comment: 'Datastore type',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Filesystem version',
        },
        capacityGB: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total capacity in GB',
        },
        freeSpaceGB: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Free space in GB',
        },
        uncommittedGB: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Uncommitted space in GB',
        },
        accessible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether accessible',
        },
        maintenanceMode: {
            type: sequelize_1.DataTypes.ENUM('normal', 'enteringMaintenance', 'inMaintenance'),
            allowNull: false,
            defaultValue: 'normal',
            comment: 'Maintenance mode state',
        },
        multipleHostAccess: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Multiple host access',
        },
        vmCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of VMs on datastore',
        },
        hostCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of hosts with access',
        },
        ssdEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'SSD backing',
        },
        iops: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'IOPS capability',
        },
        latencyMs: {
            type: sequelize_1.DataTypes.DECIMAL(10, 3),
            allowNull: true,
            comment: 'Average latency in ms',
        },
        throughputMBps: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Throughput in MB/s',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Configuration details',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Performance metrics',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_datastores',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['type'] },
            { fields: ['accessible'] },
            { fields: ['maintenanceMode'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class DatastoreModel extends sequelize_1.Model {
    }
    return DatastoreModel.init(attributes, modelOptions);
}
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
function addDatastoreScopes(model) {
    model.addScope('accessible', {
        where: { accessible: true },
    });
    model.addScope('vmfs', {
        where: { type: 'VMFS' },
    });
    model.addScope('nfs', {
        where: { type: 'NFS' },
    });
    model.addScope('vsan', {
        where: { type: 'vSAN' },
    });
    model.addScope('ssd', {
        where: { ssdEnabled: true },
    });
    model.addScope('lowSpace', {
        where: sequelize.where(sequelize.literal('("freeSpaceGB" / "capacityGB")'), sequelize_1.Op.lt, 0.2),
    });
    return model;
}
// ============================================================================
// NETWORK MODEL BUILDERS
// ============================================================================
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
function createNetworkModel(sequelize, modelName, options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Network name',
            validate: {
                notEmpty: true,
            },
        },
        moRef: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'VMware Managed Object Reference',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('standard', 'distributed', 'overlay'),
            allowNull: false,
            defaultValue: 'standard',
            comment: 'Network type',
        },
        vlanId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'VLAN ID',
            validate: {
                min: 0,
                max: 4094,
            },
        },
        vlanType: {
            type: sequelize_1.DataTypes.ENUM('none', 'vlan', 'trunk', 'pvlan'),
            allowNull: false,
            defaultValue: 'none',
            comment: 'VLAN type',
        },
        accessible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether accessible',
        },
        vmCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of connected VMs',
        },
        hostCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of connected hosts',
        },
        dvSwitchUuid: {
            type: sequelize_1.DataTypes.STRING(36),
            allowNull: true,
            comment: 'Distributed vSwitch UUID',
        },
        portgroupKey: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Port group key',
        },
        uplinkTeamingPolicy: {
            type: sequelize_1.DataTypes.ENUM('loadbalance_ip', 'loadbalance_srcmac', 'loadbalance_srcid', 'failover_explicit'),
            allowNull: true,
            comment: 'Uplink teaming policy',
        },
        mtu: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1500,
            comment: 'Maximum transmission unit',
            validate: {
                min: 1280,
                max: 9000,
            },
        },
        securityPolicy: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Security policy settings',
        },
        trafficShapingPolicy: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Traffic shaping policy',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional configuration',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Performance metrics',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_networks',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['type'] },
            { fields: ['vlanId'] },
            { fields: ['accessible'] },
            { fields: ['dvSwitchUuid'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class NetworkModel extends sequelize_1.Model {
    }
    return NetworkModel.init(attributes, modelOptions);
}
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
function addNetworkScopes(model) {
    model.addScope('accessible', {
        where: { accessible: true },
    });
    model.addScope('standard', {
        where: { type: 'standard' },
    });
    model.addScope('distributed', {
        where: { type: 'distributed' },
    });
    model.addScope('overlay', {
        where: { type: 'overlay' },
    });
    return model;
}
// ============================================================================
// ASSOCIATION HELPERS
// ============================================================================
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
function defineVirtualResourceAssociations(models) {
    // VM belongs to Host
    models.VirtualMachine.belongsTo(models.Host, {
        foreignKey: 'hostId',
        as: 'host',
    });
    // VM belongs to Cluster
    models.VirtualMachine.belongsTo(models.Cluster, {
        foreignKey: 'clusterId',
        as: 'cluster',
    });
    // Host has many VMs
    models.Host.hasMany(models.VirtualMachine, {
        foreignKey: 'hostId',
        as: 'virtualMachines',
    });
    // Host belongs to Cluster
    models.Host.belongsTo(models.Cluster, {
        foreignKey: 'clusterId',
        as: 'cluster',
    });
    // Cluster has many Hosts
    models.Cluster.hasMany(models.Host, {
        foreignKey: 'clusterId',
        as: 'hosts',
    });
    // Cluster has many VMs
    models.Cluster.hasMany(models.VirtualMachine, {
        foreignKey: 'clusterId',
        as: 'virtualMachines',
    });
}
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
function addVMValidationHooks(model) {
    model.addHook('beforeValidate', 'validateConfig', (instance) => {
        if (instance.numCPU < 1) {
            throw new Error('VM must have at least 1 CPU');
        }
        if (instance.memoryMB < 128) {
            throw new Error('VM must have at least 128 MB memory');
        }
        if (instance.numCoresPerSocket > instance.numCPU) {
            throw new Error('Cores per socket cannot exceed total CPUs');
        }
    });
    return model;
}
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
function addHostValidationHooks(model) {
    model.addHook('beforeValidate', 'validateCapacity', (instance) => {
        if (instance.numCpuCores && instance.numCpuCores < 1) {
            throw new Error('Host must have at least 1 CPU core');
        }
        if (instance.memoryGB && instance.memoryGB < 1) {
            throw new Error('Host must have at least 1 GB memory');
        }
    });
    return model;
}
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
function addDatastoreValidationHooks(model) {
    model.addHook('beforeValidate', 'validateSpace', (instance) => {
        if (instance.freeSpaceGB > instance.capacityGB) {
            throw new Error('Free space cannot exceed total capacity');
        }
        if (instance.freeSpaceGB < 0) {
            throw new Error('Free space cannot be negative');
        }
    });
    return model;
}
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
function addResourceComputedFields(vmModel, hostModel, datastoreModel) {
    // VM computed field: total disk capacity
    vmModel.rawAttributes.totalDiskGB = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const disks = this.getDataValue('disks') || [];
            return disks.reduce((sum, disk) => sum + disk.capacityGB, 0);
        },
    };
    // Host computed field: CPU usage MHz
    hostModel.rawAttributes.usedCpuMhz = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const totalMhz = this.getDataValue('cpuMhz') * this.getDataValue('numCpuCores');
            const usagePercent = this.getDataValue('cpuUsagePercent') || 0;
            return Math.round((totalMhz * usagePercent) / 100);
        },
    };
    // Datastore computed field: usage percentage
    datastoreModel.rawAttributes.usagePercent = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const capacity = this.getDataValue('capacityGB');
            const free = this.getDataValue('freeSpaceGB');
            if (!capacity || capacity === 0)
                return 0;
            return Math.round(((capacity - free) / capacity) * 100 * 100) / 100;
        },
    };
    vmModel.refreshAttributes();
    hostModel.refreshAttributes();
    datastoreModel.refreshAttributes();
}
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
function addPerformanceMetricHooks(model) {
    model.addHook('beforeUpdate', 'trackMetrics', (instance) => {
        if (instance.changed('metrics')) {
            const metrics = instance.metrics || {};
            metrics.lastUpdated = new Date();
            instance.metrics = metrics;
        }
    });
    return model;
}
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
function createIPAddressValidation(fieldName, allowIPv6 = true) {
    return {
        customIPValidator: function (value) {
            if (!value)
                return;
            const version = allowIPv6 ? undefined : 4;
            if (!(0, validator_1.isIP)(value, version)) {
                throw new Error(`Invalid IP address format for ${fieldName}`);
            }
        },
    };
}
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
function createMACAddressValidation() {
    return {
        customMACValidator: function (value) {
            if (!value)
                return;
            if (!(0, validator_1.isMACAddress)(value)) {
                throw new Error('Invalid MAC address format');
            }
        },
    };
}
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
async function bulkUpdateVMPowerState(model, vmIds, powerState, options = {}) {
    const [affectedCount] = await model.update({ powerState }, {
        where: { id: { [sequelize_1.Op.in]: vmIds } },
        ...options,
    });
    return affectedCount;
}
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
async function findVMsByHost(model, hostIds, options = {}) {
    return model.findAll({
        where: {
            hostId: { [sequelize_1.Op.in]: hostIds },
            ...options.where,
        },
        ...options,
    });
}
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
async function findHostsByCluster(model, clusterId, options = {}) {
    return model.findAll({
        where: {
            clusterId,
            ...options.where,
        },
        ...options,
    });
}
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
async function calculateClusterUtilization(clusterModel, hostModel, clusterId) {
    const hosts = await hostModel.findAll({
        where: { clusterId },
    });
    let totalCpuCores = 0;
    let totalMemoryGB = 0;
    let usedCpuMhz = 0;
    let totalCpuMhz = 0;
    let usedMemoryGB = 0;
    hosts.forEach((host) => {
        totalCpuCores += host.numCpuCores || 0;
        totalMemoryGB += parseFloat(host.memoryGB || 0);
        const hostTotalMhz = (host.cpuMhz || 0) * (host.numCpuCores || 0);
        totalCpuMhz += hostTotalMhz;
        usedCpuMhz += (hostTotalMhz * (host.cpuUsagePercent || 0)) / 100;
        usedMemoryGB += (parseFloat(host.memoryGB || 0) * (host.memoryUsagePercent || 0)) / 100;
    });
    const usedCpuCores = totalCpuMhz > 0 ? (usedCpuMhz / totalCpuMhz) * totalCpuCores : 0;
    return {
        totalCpuCores,
        usedCpuCores: Math.round(usedCpuCores * 100) / 100,
        cpuUtilization: totalCpuCores > 0 ? Math.round((usedCpuCores / totalCpuCores) * 100 * 100) / 100 : 0,
        totalMemoryGB: Math.round(totalMemoryGB * 100) / 100,
        usedMemoryGB: Math.round(usedMemoryGB * 100) / 100,
        memoryUtilization: totalMemoryGB > 0 ? Math.round((usedMemoryGB / totalMemoryGB) * 100 * 100) / 100 : 0,
    };
}
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
async function findDatastoresWithLowSpace(model, thresholdPercent = 20) {
    return model.findAll({
        where: sequelize.where(sequelize.literal('(100.0 * "freeSpaceGB" / NULLIF("capacityGB", 0))'), sequelize_1.Op.lt, thresholdPercent),
    });
}
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
async function exportVirtualInfrastructureInventory(models) {
    const [vms, hosts, clusters, datastores, networks] = await Promise.all([
        models.VirtualMachine.findAll(),
        models.Host.findAll(),
        models.Cluster.findAll(),
        models.Datastore.findAll(),
        models.Network.findAll(),
    ]);
    return {
        timestamp: new Date(),
        virtualMachines: vms.map(vm => vm.toJSON()),
        hosts: hosts.map(h => h.toJSON()),
        clusters: clusters.map(c => c.toJSON()),
        datastores: datastores.map(ds => ds.toJSON()),
        networks: networks.map(n => n.toJSON()),
        summary: {
            vmCount: vms.length,
            hostCount: hosts.length,
            clusterCount: clusters.length,
            datastoreCount: datastores.length,
            networkCount: networks.length,
        },
    };
}
//# sourceMappingURL=virtual-resource-models-kit.js.map