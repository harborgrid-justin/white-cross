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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  InitOptions,
  IndexOptions,
  ValidationOptions,
  Hooks,
  CreateOptions,
  FindOptions,
  WhereOptions,
  Op,
  Association,
  ScopeOptions,
  QueryInterface,
  Transaction,
  Identifier,
  Utils,
  ModelAttributeColumnOptions,
  AddScopeOptions,
} from 'sequelize';
import { isEmail, isUUID, isURL, isMobilePhone, isPostalCode, isISO8601 } from 'validator';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Resource pool share level
 */
export type ShareLevel = 'low' | 'normal' | 'high' | 'custom';

/**
 * Snapshot state
 */
export type SnapshotState = 'creating' | 'ready' | 'reverting' | 'deleting' | 'error';

/**
 * Template provisioning type
 */
export type ProvisioningType = 'thin' | 'thick' | 'eagerZeroedThick';

/**
 * Folder type
 */
export type FolderType = 'vm' | 'host' | 'datastore' | 'network' | 'root';

/**
 * Inventory item type
 */
export type InventoryItemType = 'vm' | 'host' | 'cluster' | 'datastore' | 'network' | 'resourcePool' | 'folder' | 'datacenter';

/**
 * Resource allocation shares
 */
export interface ResourceShares {
  level: ShareLevel;
  shares: number;
}

/**
 * Resource allocation spec
 */
export interface ResourceAllocationSpec {
  cpuAllocation: {
    shares: ResourceShares;
    reservation: number;
    limit: number;
    expandableReservation: boolean;
  };
  memoryAllocation: {
    shares: ResourceShares;
    reservation: number;
    limit: number;
    expandableReservation: boolean;
  };
}

/**
 * Snapshot tree node
 */
export interface SnapshotTreeNode {
  id: string;
  name: string;
  description: string;
  createTime: Date;
  state: SnapshotState;
  quiesced: boolean;
  children: SnapshotTreeNode[];
}

/**
 * Template customization spec
 */
export interface CustomizationSpec {
  name: string;
  type: 'windows' | 'linux';
  hostname?: string;
  domain?: string;
  timezone?: string;
  adminPassword?: string;
  networkSettings?: object;
}

/**
 * Inventory change tracking
 */
export interface InventoryChange {
  timestamp: Date;
  operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE';
  userId: string;
  fromValue?: any;
  toValue?: any;
  reason?: string;
}

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
export function createResourcePoolModel(
  sequelize: Sequelize,
  modelName: string,
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Resource pool name',
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    moRef: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'VMware Managed Object Reference',
    },
    parentId: {
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Cluster this pool belongs to',
    },
    cpuSharesLevel: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'custom'),
      allowNull: false,
      defaultValue: 'normal',
      comment: 'CPU shares level',
    },
    cpuShares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4000,
      comment: 'CPU shares value',
    },
    cpuReservationMhz: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'CPU reservation in MHz',
    },
    cpuLimitMhz: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'CPU limit in MHz (-1 for unlimited)',
    },
    cpuExpandableReservation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'CPU expandable reservation',
    },
    memorySharesLevel: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'custom'),
      allowNull: false,
      defaultValue: 'normal',
      comment: 'Memory shares level',
    },
    memoryShares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 163840,
      comment: 'Memory shares value',
    },
    memoryReservationMB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Memory reservation in MB',
    },
    memoryLimitMB: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Memory limit in MB (-1 for unlimited)',
    },
    memoryExpandableReservation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Memory expandable reservation',
    },
    vmCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of VMs in pool',
    },
    childPoolCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of child pools',
    },
    overallStatus: {
      type: DataTypes.ENUM('green', 'yellow', 'red', 'gray'),
      allowNull: false,
      defaultValue: 'gray',
      comment: 'Overall health status',
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional configuration',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Tags for categorization',
    },
    customAttributes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Custom attributes',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Optimistic locking version',
    },
  };

  const modelOptions: ModelOptions<any> = {
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
      beforeCreate: async (instance: any) => {
        instance.version = 1;
      },
      beforeUpdate: async (instance: any) => {
        instance.version += 1;
      },
    },
    ...options,
  };

  class ResourcePoolModel extends Model {}
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
export function createResourcePoolHistoryModel(
  sequelize: Sequelize,
  sourceModel: ModelStatic<any>,
): ModelStatic<any> {
  const attributes = { ...sourceModel.getAttributes() };

  const historyAttributes: ModelAttributes<any> = {
    historyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'History record ID',
    },
    originalId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Original pool ID',
    },
    ...attributes,
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Validity start timestamp',
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Validity end timestamp',
    },
    operation: {
      type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
      allowNull: false,
      comment: 'Change operation type',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who made the change',
    },
    changeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for change',
    },
  };

  const modelOptions: ModelOptions<any> = {
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

  class PoolHistoryModel extends Model {}
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
export function addResourcePoolScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function createFolderModel(
  sequelize: Sequelize,
  modelName: string,
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Folder name',
      validate: {
        notEmpty: true,
      },
    },
    moRef: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'VMware Managed Object Reference',
    },
    type: {
      type: DataTypes.ENUM('vm', 'host', 'datastore', 'network', 'root'),
      allowNull: false,
      comment: 'Folder type',
    },
    parentId: {
      type: DataTypes.UUID,
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
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'Full folder path',
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Depth in hierarchy',
    },
    childCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of child folders',
    },
    itemCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of items in folder',
    },
    overallStatus: {
      type: DataTypes.ENUM('green', 'yellow', 'red', 'gray'),
      allowNull: false,
      defaultValue: 'gray',
      comment: 'Overall health status',
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Folder permissions',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Tags for categorization',
    },
    customAttributes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Custom attributes',
    },
  };

  const modelOptions: ModelOptions<any> = {
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
      beforeSave: async (instance: any) => {
        // Update path based on parent
        if (instance.changed('parentId') || instance.changed('name')) {
          await updateFolderPath(instance);
        }
      },
    },
    ...options,
  };

  class FolderModel extends Model {}
  return FolderModel.init(attributes, modelOptions);
}

/**
 * Updates folder path based on hierarchy.
 * Internal helper for maintaining folder paths.
 *
 * @param {any} instance - Folder instance
 * @returns {Promise<void>}
 */
async function updateFolderPath(instance: any): Promise<void> {
  if (!instance.parentId) {
    instance.path = `/${instance.name}`;
    instance.depth = 0;
  } else {
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
export function addFolderScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function createTemplateModel(
  sequelize: Sequelize,
  modelName: string,
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Template name',
      validate: {
        notEmpty: true,
      },
    },
    moRef: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'VMware Managed Object Reference',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Template description',
    },
    guestOS: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Guest OS identifier',
    },
    guestOSType: {
      type: DataTypes.ENUM('windows', 'linux', 'other', 'unknown'),
      allowNull: false,
      defaultValue: 'unknown',
      comment: 'Guest OS category',
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Template version',
    },
    numCPU: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: 'Number of virtual CPUs',
      validate: {
        min: 1,
        max: 256,
      },
    },
    numCoresPerSocket: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Cores per socket',
    },
    memoryMB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4096,
      comment: 'Memory in MB',
    },
    hardwareVersion: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Virtual hardware version',
    },
    provisioningType: {
      type: DataTypes.ENUM('thin', 'thick', 'eagerZeroedThick'),
      allowNull: false,
      defaultValue: 'thin',
      comment: 'Provisioning type',
    },
    folderId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Folder organization',
    },
    datastoreId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Default datastore',
    },
    networkAdapters: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Network adapter configurations',
    },
    disks: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Disk configurations',
    },
    customizationSpec: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Guest customization specification',
    },
    vmToolsVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'VMware Tools version',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether published for use',
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether approved for production',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who approved template',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Approval timestamp',
    },
    deploymentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of VMs deployed from template',
    },
    lastDeployedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last deployment timestamp',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Tags for categorization',
    },
    customAttributes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Custom attributes',
    },
    encryptedSecrets: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted template secrets',
      get() {
        const encrypted = this.getDataValue('encryptedSecrets');
        if (!encrypted) return null;
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
        } catch (error) {
          console.error('Decryption error:', error);
          return null;
        }
      },
      set(value: any) {
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
        } catch (error) {
          console.error('Encryption error:', error);
          throw error;
        }
      },
    },
  };

  const modelOptions: ModelOptions<any> = {
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

  class TemplateModel extends Model {}
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
export function addTemplateScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function createSnapshotModel(
  sequelize: Sequelize,
  modelName: string,
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Snapshot name',
      validate: {
        notEmpty: true,
      },
    },
    moRef: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'VMware Managed Object Reference',
    },
    vmId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Virtual Machine ID',
    },
    parentSnapshotId: {
      type: DataTypes.UUID,
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
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Snapshot description',
    },
    state: {
      type: DataTypes.ENUM('creating', 'ready', 'reverting', 'deleting', 'error'),
      allowNull: false,
      defaultValue: 'creating',
      comment: 'Snapshot state',
    },
    quiesced: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether guest filesystem was quiesced',
    },
    memorySnapshot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether memory state was captured',
    },
    sizeGB: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Snapshot size in GB',
    },
    powerState: {
      type: DataTypes.ENUM('poweredOn', 'poweredOff', 'suspended'),
      allowNull: false,
      comment: 'VM power state at snapshot time',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created snapshot',
    },
    revertedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last revert timestamp',
    },
    revertCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times reverted',
    },
    isCurrentSnapshot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the current snapshot',
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Depth in snapshot tree',
    },
    childCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of child snapshots',
    },
    retentionDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Retention period in days',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Expiration timestamp',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Tags for categorization',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional metadata',
    },
  };

  const modelOptions: ModelOptions<any> = {
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

  class SnapshotModel extends Model {}
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
export function addSnapshotScopes(model: ModelStatic<any>): ModelStatic<any> {
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
      expiresAt: { [Op.lt]: new Date() },
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
export function createInventoryItemModel(
  sequelize: Sequelize,
  modelName: string,
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    moRef: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'VMware Managed Object Reference',
    },
    type: {
      type: DataTypes.ENUM('vm', 'host', 'cluster', 'datastore', 'network', 'resourcePool', 'folder', 'datacenter'),
      allowNull: false,
      comment: 'Item type',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Item name',
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Parent item ID',
    },
    parentType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Parent item type',
    },
    path: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'Full inventory path',
    },
    overallStatus: {
      type: DataTypes.ENUM('green', 'yellow', 'red', 'gray'),
      allowNull: false,
      defaultValue: 'gray',
      comment: 'Overall health status',
    },
    discoveredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Discovery timestamp',
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Last seen timestamp',
    },
    isOrphaned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether item is orphaned',
    },
    properties: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Item properties',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Tags for categorization',
    },
  };

  const modelOptions: ModelOptions<any> = {
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

  class InventoryItemModel extends Model {}
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
export function addInventoryItemScopes(model: ModelStatic<any>): ModelStatic<any> {
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
        [Op.lt]: sequelize.literal("NOW() - INTERVAL '24 hours'"),
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
export function addSoftDelete(model: ModelStatic<any>): ModelStatic<any> {
  model.addHook('beforeDestroy', 'softDeleteHook', async (instance: any, opts: any) => {
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
export async function restoreSoftDeleted(instance: any): Promise<any> {
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
export async function findSoftDeleted(
  model: ModelStatic<any>,
  options: FindOptions = {},
): Promise<any[]> {
  return model.findAll({
    ...options,
    paranoid: false,
    where: {
      ...options.where,
      deletedAt: { [Op.ne]: null },
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
export async function bulkRestore(
  model: ModelStatic<any>,
  where: WhereOptions,
): Promise<number> {
  const [affectedCount] = await model.update(
    { deletedAt: null } as any,
    { where, paranoid: false },
  );
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
export function addTemporalTracking(
  model: ModelStatic<any>,
  historyModel: ModelStatic<any>,
): ModelStatic<any> {
  model.addHook('afterCreate', 'temporalCreate', async (instance: any, options: any) => {
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

  model.addHook('afterUpdate', 'temporalUpdate', async (instance: any, options: any) => {
    await historyModel.update(
      { validTo: new Date() },
      {
        where: {
          originalId: instance.id,
          validTo: null,
        },
      },
    );

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

  model.addHook('afterDestroy', 'temporalDelete', async (instance: any, options: any) => {
    await historyModel.update(
      { validTo: new Date() },
      {
        where: {
          originalId: instance.id,
          validTo: null,
        },
      },
    );

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
export async function getTemporalHistory(
  historyModel: ModelStatic<any>,
  itemId: string,
  options: FindOptions = {},
): Promise<any[]> {
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
export async function getTemporalState(
  historyModel: ModelStatic<any>,
  itemId: string,
  timestamp: Date,
): Promise<any | null> {
  return historyModel.findOne({
    where: {
      originalId: itemId,
      validFrom: { [Op.lte]: timestamp },
      [Op.or]: [
        { validTo: null },
        { validTo: { [Op.gt]: timestamp } },
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
export function defineInventoryAssociations(models: {
  ResourcePool: ModelStatic<any>;
  Folder: ModelStatic<any>;
  Template?: ModelStatic<any>;
  Snapshot?: ModelStatic<any>;
}): void {
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
export async function buildSnapshotTree(
  model: ModelStatic<any>,
  vmId: string,
): Promise<SnapshotTreeNode[]> {
  const snapshots = await model.findAll({
    where: { vmId },
    order: [['created_at', 'ASC']],
  });

  const snapshotMap = new Map<string, SnapshotTreeNode>();
  const rootSnapshots: SnapshotTreeNode[] = [];

  snapshots.forEach((snap: any) => {
    const node: SnapshotTreeNode = {
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

  snapshots.forEach((snap: any) => {
    const node = snapshotMap.get(snap.id);
    if (!node) return;

    if (snap.parentSnapshotId) {
      const parent = snapshotMap.get(snap.parentSnapshotId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
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
export async function findTemplates(
  model: ModelStatic<any>,
  criteria: {
    guestOSType?: string;
    isPublished?: boolean;
    isApproved?: boolean;
    minDeployments?: number;
    maxDeployments?: number;
  },
): Promise<any[]> {
  const where: WhereOptions = {};

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
    where.deploymentCount = { [Op.gte]: criteria.minDeployments };
  }

  if (criteria.maxDeployments !== undefined) {
    where.deploymentCount = {
      ...where.deploymentCount,
      [Op.lte]: criteria.maxDeployments,
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
export async function findExpiredSnapshots(
  model: ModelStatic<any>,
  beforeDate: Date = new Date(),
): Promise<any[]> {
  return model.findAll({
    where: {
      expiresAt: { [Op.lt]: beforeDate },
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
export async function calculatePoolUtilization(
  poolModel: ModelStatic<any>,
  poolId: string,
): Promise<{
  cpuReservationMhz: number;
  cpuLimitMhz: number;
  memoryReservationMB: number;
  memoryLimitMB: number;
  vmCount: number;
  childPoolCount: number;
}> {
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
export async function exportInventory(models: {
  ResourcePool: ModelStatic<any>;
  Folder: ModelStatic<any>;
  Template: ModelStatic<any>;
  Snapshot: ModelStatic<any>;
}): Promise<{
  timestamp: Date;
  resourcePools: any[];
  folders: any[];
  templates: any[];
  snapshots: any[];
  summary: object;
}> {
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
export async function validateFolderHierarchy(
  model: ModelStatic<any>,
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];
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
export async function cleanupOrphanedItems(
  model: ModelStatic<any>,
  daysOld: number = 30,
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const deletedCount = await model.destroy({
    where: {
      isOrphaned: true,
      lastSeenAt: { [Op.lt]: cutoffDate },
    },
  });

  return deletedCount;
}
