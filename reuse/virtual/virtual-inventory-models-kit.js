"use strict";
/**
 * LOC: I1N2V3E4N5
 * File: /reuse/virtual/virtual-inventory-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual inventory services
 *   - VMware vRealize integration
 *   - Template management
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
exports.createResourcePoolModel = createResourcePoolModel;
exports.createResourcePoolHistoryModel = createResourcePoolHistoryModel;
exports.addResourcePoolScopes = addResourcePoolScopes;
exports.createFolderModel = createFolderModel;
exports.addFolderScopes = addFolderScopes;
exports.createTemplateModel = createTemplateModel;
exports.addTemplateScopes = addTemplateScopes;
exports.createSnapshotModel = createSnapshotModel;
exports.addSnapshotScopes = addSnapshotScopes;
exports.createInventoryItemModel = createInventoryItemModel;
exports.addInventoryItemScopes = addInventoryItemScopes;
exports.addSoftDelete = addSoftDelete;
exports.restoreSoftDeleted = restoreSoftDeleted;
exports.findSoftDeleted = findSoftDeleted;
exports.bulkRestore = bulkRestore;
exports.addTemporalTracking = addTemporalTracking;
exports.getTemporalHistory = getTemporalHistory;
exports.getTemporalState = getTemporalState;
exports.defineInventoryAssociations = defineInventoryAssociations;
exports.buildSnapshotTree = buildSnapshotTree;
exports.findTemplates = findTemplates;
exports.findExpiredSnapshots = findExpiredSnapshots;
exports.calculatePoolUtilization = calculatePoolUtilization;
exports.exportInventory = exportInventory;
exports.validateFolderHierarchy = validateFolderHierarchy;
exports.cleanupOrphanedItems = cleanupOrphanedItems;
/**
 * File: /reuse/virtual/virtual-inventory-models-kit.ts
 * Locator: WC-UTL-VIRT-INV-001
 * Purpose: Virtual Inventory Models Kit - Resource pools, folders, templates, snapshots for VMware vRealize
 *
 * Upstream: sequelize v6.x, @types/validator, crypto
 * Downstream: Virtual inventory management, template provisioning, snapshot management
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 model utilities for resource pools, folders, templates, snapshots with soft deletes and temporal tracking
 *
 * LLM Context: Production-grade Sequelize v6.x virtual inventory model kit for White Cross healthcare platform.
 * Provides comprehensive models for VMware vRealize inventory management including resource pools, organizational folders,
 * VM templates, and snapshots. HIPAA-compliant with soft deletes, temporal tracking, audit trails, and encrypted data.
 */
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// RESOURCE POOL MODEL BUILDERS
// ============================================================================
/**
 * Creates a comprehensive Resource Pool model.
 * Tracks resource allocation pools with CPU/memory shares.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Resource Pool model
 *
 * @example
 * ```typescript
 * const ResourcePool = createResourcePoolModel(sequelize, 'ResourcePool', {
 *   paranoid: true
 * });
 *
 * const pool = await ResourcePool.create({
 *   name: 'Production-Pool',
 *   moRef: 'resgroup-123',
 *   cpuReservationMhz: 10000,
 *   cpuLimitMhz: 50000,
 *   memoryReservationMB: 16384,
 *   memoryLimitMB: 65536,
 *   clusterId: 'cluster-uuid'
 * });
 * ```
 */
function createResourcePoolModel(sequelize, modelName, options = {}) {
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
            comment: 'Resource pool name',
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
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Parent resource pool ID',
            references: {
                model: 'virtual_resource_pools',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        clusterId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Cluster this pool belongs to',
        },
        cpuSharesLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'normal', 'high', 'custom'),
            allowNull: false,
            defaultValue: 'normal',
            comment: 'CPU shares level',
        },
        cpuShares: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 4000,
            comment: 'CPU shares value',
        },
        cpuReservationMhz: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'CPU reservation in MHz',
        },
        cpuLimitMhz: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'CPU limit in MHz (-1 for unlimited)',
        },
        cpuExpandableReservation: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'CPU expandable reservation',
        },
        memorySharesLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'normal', 'high', 'custom'),
            allowNull: false,
            defaultValue: 'normal',
            comment: 'Memory shares level',
        },
        memoryShares: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 163840,
            comment: 'Memory shares value',
        },
        memoryReservationMB: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Memory reservation in MB',
        },
        memoryLimitMB: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Memory limit in MB (-1 for unlimited)',
        },
        memoryExpandableReservation: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Memory expandable reservation',
        },
        vmCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of VMs in pool',
        },
        childPoolCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of child pools',
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
        tableName: options.tableName || 'virtual_resource_pools',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['parentId'] },
            { fields: ['clusterId'] },
            { fields: ['overallStatus'] },
            ...(options.indexes || []),
        ],
        hooks: {
            beforeCreate: async (instance) => {
                instance.version = 1;
            },
            beforeUpdate: async (instance) => {
                instance.version += 1;
            },
        },
        ...options,
    };
    class ResourcePoolModel extends sequelize_1.Model {
    }
    return ResourcePoolModel.init(attributes, modelOptions);
}
/**
 * Creates a Resource Pool History model for temporal tracking.
 * Maintains complete change history for compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>} sourceModel - Source resource pool model
 * @returns {ModelStatic<any>} Resource Pool History model
 *
 * @example
 * ```typescript
 * const PoolHistory = createResourcePoolHistoryModel(sequelize, ResourcePool);
 *
 * const history = await PoolHistory.findAll({
 *   where: { originalId: poolId },
 *   order: [['validFrom', 'DESC']]
 * });
 * ```
 */
function createResourcePoolHistoryModel(sequelize, sourceModel) {
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
            comment: 'Original pool ID',
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
        tableName: 'virtual_resource_pools_history',
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['originalId'] },
            { fields: ['validFrom'] },
            { fields: ['validTo'] },
            { fields: ['operation'] },
        ],
    };
    class PoolHistoryModel extends sequelize_1.Model {
    }
    return PoolHistoryModel.init(historyAttributes, modelOptions);
}
/**
 * Adds resource pool scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Resource Pool model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addResourcePoolScopes(ResourcePool);
 * const rootPools = await ResourcePool.scope('root').findAll();
 * ```
 */
function addResourcePoolScopes(model) {
    model.addScope('root', {
        where: { parentId: null },
    });
    model.addScope('withParent', {
        include: [{ association: 'parent' }],
    });
    model.addScope('withChildren', {
        include: [{ association: 'children' }],
    });
    model.addScope('healthy', {
        where: { overallStatus: 'green' },
    });
    return model;
}
// ============================================================================
// FOLDER MODEL BUILDERS
// ============================================================================
/**
 * Creates a comprehensive Folder model for organizational hierarchy.
 * Tracks vSphere folders with hierarchical structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Folder model
 *
 * @example
 * ```typescript
 * const Folder = createFolderModel(sequelize, 'Folder', {
 *   paranoid: true
 * });
 *
 * const folder = await Folder.create({
 *   name: 'Production VMs',
 *   moRef: 'group-v123',
 *   type: 'vm',
 *   parentId: 'root-folder-id'
 * });
 * ```
 */
function createFolderModel(sequelize, modelName, options = {}) {
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
            comment: 'Folder name',
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
            type: sequelize_1.DataTypes.ENUM('vm', 'host', 'datastore', 'network', 'root'),
            allowNull: false,
            comment: 'Folder type',
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Parent folder ID',
            references: {
                model: 'virtual_folders',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        path: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: true,
            comment: 'Full folder path',
        },
        depth: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Depth in hierarchy',
        },
        childCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of child folders',
        },
        itemCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of items in folder',
        },
        overallStatus: {
            type: sequelize_1.DataTypes.ENUM('green', 'yellow', 'red', 'gray'),
            allowNull: false,
            defaultValue: 'gray',
            comment: 'Overall health status',
        },
        permissions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Folder permissions',
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
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_folders',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['type'] },
            { fields: ['parentId'] },
            { fields: ['path'] },
            { fields: ['depth'] },
            ...(options.indexes || []),
        ],
        hooks: {
            beforeSave: async (instance) => {
                // Update path based on parent
                if (instance.changed('parentId') || instance.changed('name')) {
                    await updateFolderPath(instance);
                }
            },
        },
        ...options,
    };
    class FolderModel extends sequelize_1.Model {
    }
    return FolderModel.init(attributes, modelOptions);
}
/**
 * Updates folder path based on hierarchy.
 * Internal helper for maintaining folder paths.
 *
 * @param {any} instance - Folder instance
 * @returns {Promise<void>}
 */
async function updateFolderPath(instance) {
    if (!instance.parentId) {
        instance.path = `/${instance.name}`;
        instance.depth = 0;
    }
    else {
        const parent = await instance.constructor.findByPk(instance.parentId);
        if (parent) {
            instance.path = `${parent.path}/${instance.name}`;
            instance.depth = parent.depth + 1;
        }
    }
}
/**
 * Adds folder scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Folder model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addFolderScopes(Folder);
 * const vmFolders = await Folder.scope('vmFolders').findAll();
 * ```
 */
function addFolderScopes(model) {
    model.addScope('root', {
        where: { parentId: null },
    });
    model.addScope('vmFolders', {
        where: { type: 'vm' },
    });
    model.addScope('hostFolders', {
        where: { type: 'host' },
    });
    model.addScope('datastoreFolders', {
        where: { type: 'datastore' },
    });
    model.addScope('withParent', {
        include: [{ association: 'parent' }],
    });
    model.addScope('withChildren', {
        include: [{ association: 'children' }],
    });
    return model;
}
// ============================================================================
// TEMPLATE MODEL BUILDERS
// ============================================================================
/**
 * Creates a comprehensive VM Template model.
 * Tracks VM templates for rapid provisioning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Template model
 *
 * @example
 * ```typescript
 * const Template = createTemplateModel(sequelize, 'Template', {
 *   paranoid: true
 * });
 *
 * const template = await Template.create({
 *   name: 'Windows-Server-2022-Template',
 *   moRef: 'vm-template-123',
 *   guestOS: 'windows2022srv_64Guest',
 *   numCPU: 4,
 *   memoryMB: 16384,
 *   provisioningType: 'thin'
 * });
 * ```
 */
function createTemplateModel(sequelize, modelName, options = {}) {
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
            comment: 'Template name',
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
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Template description',
        },
        guestOS: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Guest OS identifier',
        },
        guestOSType: {
            type: sequelize_1.DataTypes.ENUM('windows', 'linux', 'other', 'unknown'),
            allowNull: false,
            defaultValue: 'unknown',
            comment: 'Guest OS category',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Template version',
        },
        numCPU: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
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
        },
        memoryMB: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 4096,
            comment: 'Memory in MB',
        },
        hardwareVersion: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Virtual hardware version',
        },
        provisioningType: {
            type: sequelize_1.DataTypes.ENUM('thin', 'thick', 'eagerZeroedThick'),
            allowNull: false,
            defaultValue: 'thin',
            comment: 'Provisioning type',
        },
        folderId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Folder organization',
        },
        datastoreId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Default datastore',
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
        customizationSpec: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Guest customization specification',
        },
        vmToolsVersion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'VMware Tools version',
        },
        isPublished: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether published for use',
        },
        isApproved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether approved for production',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who approved template',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        deploymentCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of VMs deployed from template',
        },
        lastDeployedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last deployment timestamp',
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
        encryptedSecrets: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted template secrets',
            get() {
                const encrypted = this.getDataValue('encryptedSecrets');
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
                    this.setDataValue('encryptedSecrets', null);
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
                    this.setDataValue('encryptedSecrets', encryptedValue);
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
        tableName: options.tableName || 'virtual_templates',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['guestOSType'] },
            { fields: ['isPublished'] },
            { fields: ['isApproved'] },
            { fields: ['folderId'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class TemplateModel extends sequelize_1.Model {
    }
    return TemplateModel.init(attributes, modelOptions);
}
/**
 * Adds template scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Template model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addTemplateScopes(Template);
 * const publishedTemplates = await Template.scope('published').findAll();
 * ```
 */
function addTemplateScopes(model) {
    model.addScope('published', {
        where: { isPublished: true },
    });
    model.addScope('approved', {
        where: { isApproved: true },
    });
    model.addScope('windows', {
        where: { guestOSType: 'windows' },
    });
    model.addScope('linux', {
        where: { guestOSType: 'linux' },
    });
    model.addScope('recent', {
        order: [['created_at', 'DESC']],
        limit: 50,
    });
    return model;
}
// ============================================================================
// SNAPSHOT MODEL BUILDERS
// ============================================================================
/**
 * Creates a comprehensive Snapshot model.
 * Tracks VM snapshots with hierarchical tree structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Snapshot model
 *
 * @example
 * ```typescript
 * const Snapshot = createSnapshotModel(sequelize, 'Snapshot', {
 *   paranoid: true
 * });
 *
 * const snapshot = await Snapshot.create({
 *   name: 'Before-Upgrade',
 *   moRef: 'snapshot-123',
 *   vmId: 'vm-uuid',
 *   description: 'Snapshot before OS upgrade',
 *   state: 'ready',
 *   quiesced: true
 * });
 * ```
 */
function createSnapshotModel(sequelize, modelName, options = {}) {
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
            comment: 'Snapshot name',
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
        vmId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Virtual Machine ID',
        },
        parentSnapshotId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Parent snapshot ID',
            references: {
                model: 'virtual_snapshots',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Snapshot description',
        },
        state: {
            type: sequelize_1.DataTypes.ENUM('creating', 'ready', 'reverting', 'deleting', 'error'),
            allowNull: false,
            defaultValue: 'creating',
            comment: 'Snapshot state',
        },
        quiesced: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether guest filesystem was quiesced',
        },
        memorySnapshot: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether memory state was captured',
        },
        sizeGB: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Snapshot size in GB',
        },
        powerState: {
            type: sequelize_1.DataTypes.ENUM('poweredOn', 'poweredOff', 'suspended'),
            allowNull: false,
            comment: 'VM power state at snapshot time',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who created snapshot',
        },
        revertedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last revert timestamp',
        },
        revertCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times reverted',
        },
        isCurrentSnapshot: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is the current snapshot',
        },
        depth: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Depth in snapshot tree',
        },
        childCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of child snapshots',
        },
        retentionDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Retention period in days',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration timestamp',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    };
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || 'virtual_snapshots',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['vmId'] },
            { fields: ['parentSnapshotId'] },
            { fields: ['state'] },
            { fields: ['isCurrentSnapshot'] },
            { fields: ['expiresAt'] },
            { fields: ['created_at'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class SnapshotModel extends sequelize_1.Model {
    }
    return SnapshotModel.init(attributes, modelOptions);
}
/**
 * Adds snapshot scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Snapshot model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addSnapshotScopes(Snapshot);
 * const currentSnapshots = await Snapshot.scope('current').findAll();
 * ```
 */
function addSnapshotScopes(model) {
    model.addScope('ready', {
        where: { state: 'ready' },
    });
    model.addScope('current', {
        where: { isCurrentSnapshot: true },
    });
    model.addScope('root', {
        where: { parentSnapshotId: null },
    });
    model.addScope('withMemory', {
        where: { memorySnapshot: true },
    });
    model.addScope('expired', {
        where: {
            expiresAt: { [sequelize_1.Op.lt]: new Date() },
        },
    });
    model.addScope('recent', {
        order: [['created_at', 'DESC']],
        limit: 100,
    });
    return model;
}
// ============================================================================
// INVENTORY TRACKING MODEL BUILDERS
// ============================================================================
/**
 * Creates a comprehensive Inventory Item model.
 * Generic inventory tracking for all vCenter objects.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Inventory Item model
 *
 * @example
 * ```typescript
 * const InventoryItem = createInventoryItemModel(sequelize, 'InventoryItem');
 *
 * const item = await InventoryItem.create({
 *   moRef: 'vm-123',
 *   type: 'vm',
 *   name: 'web-server-01',
 *   parentId: 'folder-uuid',
 *   discoveredAt: new Date()
 * });
 * ```
 */
function createInventoryItemModel(sequelize, modelName, options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key',
        },
        moRef: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'VMware Managed Object Reference',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('vm', 'host', 'cluster', 'datastore', 'network', 'resourcePool', 'folder', 'datacenter'),
            allowNull: false,
            comment: 'Item type',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Item name',
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Parent item ID',
        },
        parentType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Parent item type',
        },
        path: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: true,
            comment: 'Full inventory path',
        },
        overallStatus: {
            type: sequelize_1.DataTypes.ENUM('green', 'yellow', 'red', 'gray'),
            allowNull: false,
            defaultValue: 'gray',
            comment: 'Overall health status',
        },
        discoveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Discovery timestamp',
        },
        lastSeenAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last seen timestamp',
        },
        isOrphaned: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether item is orphaned',
        },
        properties: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Item properties',
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
        tableName: options.tableName || 'virtual_inventory_items',
        timestamps: true,
        paranoid: options.paranoid !== false,
        underscored: true,
        freezeTableName: true,
        indexes: [
            { fields: ['moRef'], unique: true },
            { fields: ['type'] },
            { fields: ['parentId'] },
            { fields: ['overallStatus'] },
            { fields: ['isOrphaned'] },
            { fields: ['lastSeenAt'] },
            ...(options.indexes || []),
        ],
        ...options,
    };
    class InventoryItemModel extends sequelize_1.Model {
    }
    return InventoryItemModel.init(attributes, modelOptions);
}
/**
 * Adds inventory item scopes.
 *
 * @param {ModelStatic<any>} model - Inventory Item model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addInventoryItemScopes(InventoryItem);
 * const orphanedItems = await InventoryItem.scope('orphaned').findAll();
 * ```
 */
function addInventoryItemScopes(model) {
    model.addScope('orphaned', {
        where: { isOrphaned: true },
    });
    model.addScope('vms', {
        where: { type: 'vm' },
    });
    model.addScope('hosts', {
        where: { type: 'host' },
    });
    model.addScope('clusters', {
        where: { type: 'cluster' },
    });
    model.addScope('stale', {
        where: {
            lastSeenAt: {
                [sequelize_1.Op.lt]: sequelize.literal("NOW() - INTERVAL '24 hours'"),
            },
        },
    });
    return model;
}
// ============================================================================
// SOFT DELETE UTILITIES
// ============================================================================
/**
 * Adds soft delete functionality to inventory models.
 * Configures paranoid mode with deletedAt tracking.
 *
 * @param {ModelStatic<any>} model - Model to add soft delete
 * @returns {ModelStatic<any>} Model with soft delete
 *
 * @example
 * ```typescript
 * addSoftDelete(Template);
 *
 * await template.destroy();  // Soft delete
 * await template.destroy({ force: true });  // Hard delete
 * ```
 */
function addSoftDelete(model) {
    model.addHook('beforeDestroy', 'softDeleteHook', async (instance, opts) => {
        if (!opts.force) {
            instance.setDataValue('deletedAt', new Date());
            await instance.save({ hooks: false });
            opts.softDeleted = true;
        }
    });
    return model;
}
/**
 * Restores a soft-deleted inventory item.
 * Sets deletedAt to null.
 *
 * @param {any} instance - Instance to restore
 * @returns {Promise<any>} Restored instance
 *
 * @example
 * ```typescript
 * const template = await Template.findByPk(id, { paranoid: false });
 * await restoreSoftDeleted(template);
 * ```
 */
async function restoreSoftDeleted(instance) {
    instance.setDataValue('deletedAt', null);
    return instance.save();
}
/**
 * Finds all soft-deleted items.
 * Queries with paranoid: false.
 *
 * @param {ModelStatic<any>} model - Model to query
 * @param {FindOptions} options - Additional options
 * @returns {Promise<any[]>} Soft-deleted items
 *
 * @example
 * ```typescript
 * const deleted = await findSoftDeleted(Template);
 * ```
 */
async function findSoftDeleted(model, options = {}) {
    return model.findAll({
        ...options,
        paranoid: false,
        where: {
            ...options.where,
            deletedAt: { [sequelize_1.Op.ne]: null },
        },
    });
}
/**
 * Bulk restores multiple soft-deleted items.
 *
 * @param {ModelStatic<any>} model - Model to restore
 * @param {WhereOptions} where - Conditions
 * @returns {Promise<number>} Number of restored items
 *
 * @example
 * ```typescript
 * const count = await bulkRestore(Template, {
 *   deleted_at: { [Op.gte]: new Date('2024-01-01') }
 * });
 * ```
 */
async function bulkRestore(model, where) {
    const [affectedCount] = await model.update({ deletedAt: null }, { where, paranoid: false });
    return affectedCount;
}
// ============================================================================
// TEMPORAL TRACKING UTILITIES
// ============================================================================
/**
 * Adds temporal tracking hooks to a model.
 * Automatically creates history records on changes.
 *
 * @param {ModelStatic<any>} model - Source model
 * @param {ModelStatic<any>} historyModel - History model
 * @returns {ModelStatic<any>} Model with temporal tracking
 *
 * @example
 * ```typescript
 * addTemporalTracking(ResourcePool, ResourcePoolHistory);
 *
 * // All changes now tracked automatically
 * await pool.update({ cpuLimitMhz: 60000 });
 * ```
 */
function addTemporalTracking(model, historyModel) {
    model.addHook('afterCreate', 'temporalCreate', async (instance, options) => {
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
    model.addHook('afterUpdate', 'temporalUpdate', async (instance, options) => {
        await historyModel.update({ validTo: new Date() }, {
            where: {
                originalId: instance.id,
                validTo: null,
            },
        });
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
    model.addHook('afterDestroy', 'temporalDelete', async (instance, options) => {
        await historyModel.update({ validTo: new Date() }, {
            where: {
                originalId: instance.id,
                validTo: null,
            },
        });
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
 * Retrieves temporal history for an item.
 * Gets all historical versions.
 *
 * @param {ModelStatic<any>} historyModel - History model
 * @param {string} itemId - Item ID
 * @param {FindOptions} options - Additional options
 * @returns {Promise<any[]>} Historical records
 *
 * @example
 * ```typescript
 * const history = await getTemporalHistory(ResourcePoolHistory, poolId, {
 *   order: [['validFrom', 'DESC']],
 *   limit: 10
 * });
 * ```
 */
async function getTemporalHistory(historyModel, itemId, options = {}) {
    return historyModel.findAll({
        where: { originalId: itemId },
        order: [['validFrom', 'DESC']],
        ...options,
    });
}
/**
 * Gets item state at a specific point in time.
 * Temporal query for historical state.
 *
 * @param {ModelStatic<any>} historyModel - History model
 * @param {string} itemId - Item ID
 * @param {Date} timestamp - Point in time
 * @returns {Promise<any | null>} Historical state
 *
 * @example
 * ```typescript
 * const state = await getTemporalState(
 *   ResourcePoolHistory,
 *   poolId,
 *   new Date('2024-01-01')
 * );
 * ```
 */
async function getTemporalState(historyModel, itemId, timestamp) {
    return historyModel.findOne({
        where: {
            originalId: itemId,
            validFrom: { [sequelize_1.Op.lte]: timestamp },
            [sequelize_1.Op.or]: [
                { validTo: null },
                { validTo: { [sequelize_1.Op.gt]: timestamp } },
            ],
        },
    });
}
// ============================================================================
// ASSOCIATION HELPERS
// ============================================================================
/**
 * Defines associations for inventory models.
 *
 * @param {object} models - All inventory models
 * @returns {void}
 *
 * @example
 * ```typescript
 * defineInventoryAssociations({
 *   ResourcePool,
 *   Folder,
 *   Template,
 *   Snapshot
 * });
 * ```
 */
function defineInventoryAssociations(models) {
    // Resource Pool self-referential
    models.ResourcePool.belongsTo(models.ResourcePool, {
        foreignKey: 'parentId',
        as: 'parent',
    });
    models.ResourcePool.hasMany(models.ResourcePool, {
        foreignKey: 'parentId',
        as: 'children',
    });
    // Folder self-referential
    models.Folder.belongsTo(models.Folder, {
        foreignKey: 'parentId',
        as: 'parent',
    });
    models.Folder.hasMany(models.Folder, {
        foreignKey: 'parentId',
        as: 'children',
    });
    // Snapshot self-referential
    if (models.Snapshot) {
        models.Snapshot.belongsTo(models.Snapshot, {
            foreignKey: 'parentSnapshotId',
            as: 'parent',
        });
        models.Snapshot.hasMany(models.Snapshot, {
            foreignKey: 'parentSnapshotId',
            as: 'children',
        });
    }
}
// ============================================================================
// QUERY UTILITIES
// ============================================================================
/**
 * Builds snapshot tree for a VM.
 * Constructs hierarchical snapshot structure.
 *
 * @param {ModelStatic<any>} model - Snapshot model
 * @param {string} vmId - VM ID
 * @returns {Promise<SnapshotTreeNode[]>} Snapshot tree
 *
 * @example
 * ```typescript
 * const tree = await buildSnapshotTree(Snapshot, vmId);
 * console.log(JSON.stringify(tree, null, 2));
 * ```
 */
async function buildSnapshotTree(model, vmId) {
    const snapshots = await model.findAll({
        where: { vmId },
        order: [['created_at', 'ASC']],
    });
    const snapshotMap = new Map();
    const rootSnapshots = [];
    snapshots.forEach((snap) => {
        const node = {
            id: snap.id,
            name: snap.name,
            description: snap.description,
            createTime: snap.createdAt,
            state: snap.state,
            quiesced: snap.quiesced,
            children: [],
        };
        snapshotMap.set(snap.id, node);
    });
    snapshots.forEach((snap) => {
        const node = snapshotMap.get(snap.id);
        if (!node)
            return;
        if (snap.parentSnapshotId) {
            const parent = snapshotMap.get(snap.parentSnapshotId);
            if (parent) {
                parent.children.push(node);
            }
        }
        else {
            rootSnapshots.push(node);
        }
    });
    return rootSnapshots;
}
/**
 * Finds templates by criteria with deployment stats.
 *
 * @param {ModelStatic<any>} model - Template model
 * @param {object} criteria - Search criteria
 * @returns {Promise<any[]>} Matching templates
 *
 * @example
 * ```typescript
 * const templates = await findTemplates(Template, {
 *   guestOSType: 'linux',
 *   isPublished: true,
 *   minDeployments: 5
 * });
 * ```
 */
async function findTemplates(model, criteria) {
    const where = {};
    if (criteria.guestOSType) {
        where.guestOSType = criteria.guestOSType;
    }
    if (criteria.isPublished !== undefined) {
        where.isPublished = criteria.isPublished;
    }
    if (criteria.isApproved !== undefined) {
        where.isApproved = criteria.isApproved;
    }
    if (criteria.minDeployments !== undefined) {
        where.deploymentCount = { [sequelize_1.Op.gte]: criteria.minDeployments };
    }
    if (criteria.maxDeployments !== undefined) {
        where.deploymentCount = {
            ...where.deploymentCount,
            [sequelize_1.Op.lte]: criteria.maxDeployments,
        };
    }
    return model.findAll({
        where,
        order: [['deploymentCount', 'DESC']],
    });
}
/**
 * Finds expired snapshots for cleanup.
 *
 * @param {ModelStatic<any>} model - Snapshot model
 * @param {Date} beforeDate - Cutoff date
 * @returns {Promise<any[]>} Expired snapshots
 *
 * @example
 * ```typescript
 * const expired = await findExpiredSnapshots(Snapshot, new Date());
 * for (const snap of expired) {
 *   await snap.destroy();
 * }
 * ```
 */
async function findExpiredSnapshots(model, beforeDate = new Date()) {
    return model.findAll({
        where: {
            expiresAt: { [sequelize_1.Op.lt]: beforeDate },
            state: 'ready',
        },
    });
}
/**
 * Calculates resource pool utilization.
 *
 * @param {ModelStatic<any>} poolModel - Resource Pool model
 * @param {string} poolId - Pool ID
 * @returns {Promise<object>} Utilization statistics
 *
 * @example
 * ```typescript
 * const stats = await calculatePoolUtilization(ResourcePool, poolId);
 * console.log(stats.cpuUtilization, stats.memoryUtilization);
 * ```
 */
async function calculatePoolUtilization(poolModel, poolId) {
    const pool = await poolModel.findByPk(poolId);
    if (!pool) {
        throw new Error('Resource pool not found');
    }
    return {
        cpuReservationMhz: pool.cpuReservationMhz,
        cpuLimitMhz: pool.cpuLimitMhz || -1,
        memoryReservationMB: pool.memoryReservationMB,
        memoryLimitMB: pool.memoryLimitMB || -1,
        vmCount: pool.vmCount,
        childPoolCount: pool.childPoolCount,
    };
}
/**
 * Exports inventory to JSON format.
 *
 * @param {object} models - All inventory models
 * @returns {Promise<object>} Inventory snapshot
 *
 * @example
 * ```typescript
 * const inventory = await exportInventory({
 *   ResourcePool,
 *   Folder,
 *   Template,
 *   Snapshot
 * });
 * ```
 */
async function exportInventory(models) {
    const [pools, folders, templates, snapshots] = await Promise.all([
        models.ResourcePool.findAll(),
        models.Folder.findAll(),
        models.Template.findAll(),
        models.Snapshot.findAll(),
    ]);
    return {
        timestamp: new Date(),
        resourcePools: pools.map(p => p.toJSON()),
        folders: folders.map(f => f.toJSON()),
        templates: templates.map(t => t.toJSON()),
        snapshots: snapshots.map(s => s.toJSON()),
        summary: {
            resourcePoolCount: pools.length,
            folderCount: folders.length,
            templateCount: templates.length,
            snapshotCount: snapshots.length,
        },
    };
}
/**
 * Validates folder hierarchy integrity.
 *
 * @param {ModelStatic<any>} model - Folder model
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateFolderHierarchy(Folder);
 * if (!validation.isValid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
async function validateFolderHierarchy(model) {
    const errors = [];
    const folders = await model.findAll();
    for (const folder of folders) {
        if (folder.parentId) {
            const parent = await model.findByPk(folder.parentId);
            if (!parent) {
                errors.push(`Folder ${folder.name} (${folder.id}) has invalid parent ${folder.parentId}`);
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Cleans up orphaned inventory items.
 *
 * @param {ModelStatic<any>} model - Inventory Item model
 * @param {number} daysOld - Days since last seen
 * @returns {Promise<number>} Number of items deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupOrphanedItems(InventoryItem, 30);
 * console.log(`Deleted ${deleted} orphaned items`);
 * ```
 */
async function cleanupOrphanedItems(model, daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const deletedCount = await model.destroy({
        where: {
            isOrphaned: true,
            lastSeenAt: { [sequelize_1.Op.lt]: cutoffDate },
        },
    });
    return deletedCount;
}
//# sourceMappingURL=virtual-inventory-models-kit.js.map