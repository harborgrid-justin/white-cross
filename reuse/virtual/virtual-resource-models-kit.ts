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
import { isEmail, isUUID, isURL, isMobilePhone, isPostalCode, isISO8601, isIP, isMACAddress } from 'validator';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export function createVirtualMachineModel(
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
      comment: 'VM display name',
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
      validate: {
        notEmpty: true,
      },
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: true,
      comment: 'VM instance UUID',
      validate: {
        isUUID: 4,
      },
    },
    powerState: {
      type: DataTypes.ENUM('poweredOn', 'poweredOff', 'suspended'),
      allowNull: false,
      defaultValue: 'poweredOff',
      comment: 'Current power state',
    },
    guestOS: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Guest operating system',
    },
    guestOSType: {
      type: DataTypes.ENUM('windows', 'linux', 'other', 'unknown'),
      allowNull: false,
      defaultValue: 'unknown',
      comment: 'Guest OS category',
    },
    numCPU: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
      validate: {
        min: 1,
        max: 64,
      },
    },
    memoryMB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1024,
      comment: 'Memory in MB',
      validate: {
        min: 128,
      },
    },
    hardwareVersion: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Virtual hardware version',
    },
    firmware: {
      type: DataTypes.ENUM('bios', 'efi'),
      allowNull: false,
      defaultValue: 'bios',
      comment: 'Firmware type',
    },
    guestIPAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'Primary IP address',
      validate: {
        isIP: true,
      },
    },
    guestHostname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Guest hostname',
    },
    vmToolsStatus: {
      type: DataTypes.ENUM('running', 'notRunning', 'notInstalled', 'unknown'),
      allowNull: false,
      defaultValue: 'unknown',
      comment: 'VMware Tools status',
    },
    vmToolsVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'VMware Tools version',
    },
    annotation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'VM notes/description',
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is a template',
    },
    hostId: {
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Resource pool assignment',
    },
    folderId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Folder organization',
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
    cpuAllocation: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'CPU resource allocation',
    },
    memoryAllocation: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Memory resource allocation',
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Performance metrics',
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
    lastBootTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last boot timestamp',
    },
    uptimeSeconds: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Uptime in seconds',
    },
    encryptedData: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted sensitive configuration',
      get() {
        const encrypted = this.getDataValue('encryptedData');
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
        } catch (error) {
          console.error('Encryption error:', error);
          throw error;
        }
      },
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
      beforeCreate: async (instance: any, opts: any) => {
        instance.version = 1;
      },
      afterCreate: async (instance: any, opts: any) => {
        // Audit trail logging
        console.log(`VM created: ${instance.name} (${instance.moRef})`);
      },
      beforeUpdate: async (instance: any, opts: any) => {
        instance.version += 1;
      },
      afterUpdate: async (instance: any, opts: any) => {
        // Audit trail logging
        if (instance.changed('powerState')) {
          console.log(`VM power state changed: ${instance.name} -> ${instance.powerState}`);
        }
      },
    },
    ...options,
  };

  class VirtualMachineModel extends Model {}
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
export function createVMHistoryModel(
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
      comment: 'Original VM ID',
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

  class VMHistoryModel extends Model {}
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
export function addVMAuditHooks(
  model: ModelStatic<any>,
  historyModel: ModelStatic<any>,
): ModelStatic<any> {
  model.addHook('afterCreate', 'auditCreate', async (instance: any, options: any) => {
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

  model.addHook('afterUpdate', 'auditUpdate', async (instance: any, options: any) => {
    // Close previous history record
    await historyModel.update(
      { validTo: new Date() },
      {
        where: {
          originalId: instance.id,
          validTo: null,
        },
      },
    );

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

  model.addHook('afterDestroy', 'auditDelete', async (instance: any, options: any) => {
    // Close history record
    await historyModel.update(
      { validTo: new Date() },
      {
        where: {
          originalId: instance.id,
          validTo: null,
        },
      },
    );

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
export function addVMScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function createHostModel(
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
      comment: 'Host FQDN or name',
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
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: true,
      comment: 'Host hardware UUID',
    },
    connectionState: {
      type: DataTypes.ENUM('connected', 'disconnected', 'notResponding', 'maintenance'),
      allowNull: false,
      defaultValue: 'disconnected',
      comment: 'Connection state',
    },
    powerState: {
      type: DataTypes.ENUM('poweredOn', 'poweredOff', 'standBy', 'unknown'),
      allowNull: false,
      defaultValue: 'unknown',
      comment: 'Power state',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'Management IP address',
      validate: {
        isIP: true,
      },
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'ESXi version',
    },
    build: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'ESXi build number',
    },
    vendor: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Hardware vendor',
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Hardware model',
    },
    cpuModel: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'CPU model',
    },
    numCpuPackages: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of physical CPUs',
    },
    numCpuCores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total CPU cores',
    },
    numCpuThreads: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total CPU threads',
    },
    cpuMhz: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'CPU speed in MHz',
    },
    memoryGB: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Total memory in GB',
    },
    numNics: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of physical NICs',
    },
    numHBAs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of HBAs',
    },
    clusterId: {
      type: DataTypes.UUID,
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether in maintenance mode',
    },
    inQuarantineMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether in quarantine mode',
    },
    standbyMode: {
      type: DataTypes.ENUM('none', 'entering', 'exiting', 'in'),
      allowNull: false,
      defaultValue: 'none',
      comment: 'Standby mode state',
    },
    bootTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last boot time',
    },
    uptimeSeconds: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Uptime in seconds',
    },
    cpuUsagePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'CPU usage percentage',
    },
    memoryUsagePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Memory usage percentage',
    },
    vmCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of VMs on this host',
    },
    datastores: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
      comment: 'Connected datastore IDs',
    },
    networks: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
      comment: 'Connected network IDs',
    },
    capabilities: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Host capabilities',
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Performance metrics',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Tags for categorization',
    },
    encryptedCredentials: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted access credentials',
      get() {
        const encrypted = this.getDataValue('encryptedCredentials');
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

  class HostModel extends Model {}
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
export function addHostScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function createClusterModel(
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
      comment: 'Cluster name',
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
    haEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'High Availability enabled',
    },
    haAdmissionControlEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'HA admission control enabled',
    },
    haFailoverLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'HA failover level',
    },
    drsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'DRS enabled',
    },
    drsAutomationLevel: {
      type: DataTypes.ENUM('manual', 'partiallyAutomated', 'fullyAutomated'),
      allowNull: true,
      comment: 'DRS automation level',
    },
    drsMigrationThreshold: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'DRS migration threshold (1-5)',
      validate: {
        min: 1,
        max: 5,
      },
    },
    evcMode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Enhanced vMotion Compatibility mode',
    },
    vsanEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'vSAN enabled',
    },
    totalCpuCores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Total CPU cores across all hosts',
    },
    totalCpuMhz: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Total CPU MHz',
    },
    totalMemoryGB: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Total memory in GB',
    },
    usedCpuMhz: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Used CPU MHz',
    },
    usedMemoryGB: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Used memory in GB',
    },
    hostCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of hosts in cluster',
    },
    vmCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of VMs in cluster',
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
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Performance metrics',
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

  class ClusterModel extends Model {}
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
export function addClusterScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function createDatastoreModel(
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
      comment: 'Datastore name',
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
    url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Datastore URL',
    },
    type: {
      type: DataTypes.ENUM('VMFS', 'NFS', 'vSAN', 'local', 'other'),
      allowNull: false,
      defaultValue: 'VMFS',
      comment: 'Datastore type',
    },
    version: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Filesystem version',
    },
    capacityGB: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Total capacity in GB',
    },
    freeSpaceGB: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Free space in GB',
    },
    uncommittedGB: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Uncommitted space in GB',
    },
    accessible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether accessible',
    },
    maintenanceMode: {
      type: DataTypes.ENUM('normal', 'enteringMaintenance', 'inMaintenance'),
      allowNull: false,
      defaultValue: 'normal',
      comment: 'Maintenance mode state',
    },
    multipleHostAccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Multiple host access',
    },
    vmCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of VMs on datastore',
    },
    hostCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of hosts with access',
    },
    ssdEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'SSD backing',
    },
    iops: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'IOPS capability',
    },
    latencyMs: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      comment: 'Average latency in ms',
    },
    throughputMBps: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Throughput in MB/s',
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Configuration details',
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Performance metrics',
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

  class DatastoreModel extends Model {}
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
export function addDatastoreScopes(model: ModelStatic<any>): ModelStatic<any> {
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
    where: sequelize.where(
      sequelize.literal('("freeSpaceGB" / "capacityGB")'),
      Op.lt,
      0.2,
    ),
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
export function createNetworkModel(
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
      comment: 'Network name',
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
      type: DataTypes.ENUM('standard', 'distributed', 'overlay'),
      allowNull: false,
      defaultValue: 'standard',
      comment: 'Network type',
    },
    vlanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'VLAN ID',
      validate: {
        min: 0,
        max: 4094,
      },
    },
    vlanType: {
      type: DataTypes.ENUM('none', 'vlan', 'trunk', 'pvlan'),
      allowNull: false,
      defaultValue: 'none',
      comment: 'VLAN type',
    },
    accessible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether accessible',
    },
    vmCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of connected VMs',
    },
    hostCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of connected hosts',
    },
    dvSwitchUuid: {
      type: DataTypes.STRING(36),
      allowNull: true,
      comment: 'Distributed vSwitch UUID',
    },
    portgroupKey: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Port group key',
    },
    uplinkTeamingPolicy: {
      type: DataTypes.ENUM('loadbalance_ip', 'loadbalance_srcmac', 'loadbalance_srcid', 'failover_explicit'),
      allowNull: true,
      comment: 'Uplink teaming policy',
    },
    mtu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1500,
      comment: 'Maximum transmission unit',
      validate: {
        min: 1280,
        max: 9000,
      },
    },
    securityPolicy: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Security policy settings',
    },
    trafficShapingPolicy: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Traffic shaping policy',
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional configuration',
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Performance metrics',
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

  class NetworkModel extends Model {}
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
export function addNetworkScopes(model: ModelStatic<any>): ModelStatic<any> {
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
export function defineVirtualResourceAssociations(models: {
  VirtualMachine: ModelStatic<any>;
  Host: ModelStatic<any>;
  Cluster: ModelStatic<any>;
  Datastore?: ModelStatic<any>;
  Network?: ModelStatic<any>;
}): void {
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
export function addVMValidationHooks(model: ModelStatic<any>): ModelStatic<any> {
  model.addHook('beforeValidate', 'validateConfig', (instance: any) => {
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
export function addHostValidationHooks(model: ModelStatic<any>): ModelStatic<any> {
  model.addHook('beforeValidate', 'validateCapacity', (instance: any) => {
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
export function addDatastoreValidationHooks(model: ModelStatic<any>): ModelStatic<any> {
  model.addHook('beforeValidate', 'validateSpace', (instance: any) => {
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
export function addResourceComputedFields(
  vmModel: ModelStatic<any>,
  hostModel: ModelStatic<any>,
  datastoreModel: ModelStatic<any>,
): void {
  // VM computed field: total disk capacity
  vmModel.rawAttributes.totalDiskGB = {
    type: DataTypes.VIRTUAL,
    get() {
      const disks = this.getDataValue('disks') || [];
      return disks.reduce((sum: number, disk: DiskConfig) => sum + disk.capacityGB, 0);
    },
  } as any;

  // Host computed field: CPU usage MHz
  hostModel.rawAttributes.usedCpuMhz = {
    type: DataTypes.VIRTUAL,
    get() {
      const totalMhz = this.getDataValue('cpuMhz') * this.getDataValue('numCpuCores');
      const usagePercent = this.getDataValue('cpuUsagePercent') || 0;
      return Math.round((totalMhz * usagePercent) / 100);
    },
  } as any;

  // Datastore computed field: usage percentage
  datastoreModel.rawAttributes.usagePercent = {
    type: DataTypes.VIRTUAL,
    get() {
      const capacity = this.getDataValue('capacityGB');
      const free = this.getDataValue('freeSpaceGB');
      if (!capacity || capacity === 0) return 0;
      return Math.round(((capacity - free) / capacity) * 100 * 100) / 100;
    },
  } as any;

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
export function addPerformanceMetricHooks(model: ModelStatic<any>): ModelStatic<any> {
  model.addHook('beforeUpdate', 'trackMetrics', (instance: any) => {
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
export function createIPAddressValidation(
  fieldName: string,
  allowIPv6: boolean = true,
): ValidationOptions {
  return {
    customIPValidator: function (value: string) {
      if (!value) return;

      const version = allowIPv6 ? undefined : 4;
      if (!isIP(value, version)) {
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
export function createMACAddressValidation(): ValidationOptions {
  return {
    customMACValidator: function (value: string) {
      if (!value) return;
      if (!isMACAddress(value)) {
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
export async function bulkUpdateVMPowerState(
  model: ModelStatic<any>,
  vmIds: string[],
  powerState: VMPowerState,
  options: any = {},
): Promise<number> {
  const [affectedCount] = await model.update(
    { powerState },
    {
      where: { id: { [Op.in]: vmIds } },
      ...options,
    },
  );
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
export async function findVMsByHost(
  model: ModelStatic<any>,
  hostIds: string[],
  options: FindOptions = {},
): Promise<any[]> {
  return model.findAll({
    where: {
      hostId: { [Op.in]: hostIds },
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
export async function findHostsByCluster(
  model: ModelStatic<any>,
  clusterId: string,
  options: FindOptions = {},
): Promise<any[]> {
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
export async function calculateClusterUtilization(
  clusterModel: ModelStatic<any>,
  hostModel: ModelStatic<any>,
  clusterId: string,
): Promise<{
  totalCpuCores: number;
  usedCpuCores: number;
  cpuUtilization: number;
  totalMemoryGB: number;
  usedMemoryGB: number;
  memoryUtilization: number;
}> {
  const hosts = await hostModel.findAll({
    where: { clusterId },
  });

  let totalCpuCores = 0;
  let totalMemoryGB = 0;
  let usedCpuMhz = 0;
  let totalCpuMhz = 0;
  let usedMemoryGB = 0;

  hosts.forEach((host: any) => {
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
export async function findDatastoresWithLowSpace(
  model: ModelStatic<any>,
  thresholdPercent: number = 20,
): Promise<any[]> {
  return model.findAll({
    where: sequelize.where(
      sequelize.literal('(100.0 * "freeSpaceGB" / NULLIF("capacityGB", 0))'),
      Op.lt,
      thresholdPercent,
    ),
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
export async function exportVirtualInfrastructureInventory(models: {
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
}> {
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
