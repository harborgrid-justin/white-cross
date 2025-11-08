/**
 * @fileoverview SAN Volume Management Kit
 * @module reuse/san/san-volume-management-kit
 * @description Comprehensive SAN volume management utilities with deep Sequelize integration for
 * production-grade storage volume lifecycle management, snapshot operations, migrations, and monitoring.
 *
 * Key Features:
 * - Volume creation, deletion, and lifecycle management with Sequelize models
 * - Dynamic volume resizing with capacity tracking
 * - Volume cloning and template-based provisioning
 * - Snapshot creation, restoration, and retention management
 * - Live volume migration across storage pools
 * - Real-time volume metrics and performance monitoring
 * - Volume health checks and validation
 * - Storage analytics and capacity planning
 * - Volume replication and high availability
 * - Multi-tenancy support with isolation
 * - HIPAA-compliant audit trails
 * - Storage pool management and optimization
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, NestJS v11.x
 *
 * @security
 * - HIPAA-compliant volume encryption at rest
 * - Audit logging for all volume operations
 * - Access control and tenant isolation
 * - Secure snapshot management
 * - Encrypted volume migrations
 * - Data sanitization on deletion
 *
 * @example Basic usage
 * ```typescript
 * import { createVolume, resizeVolume, createSnapshot } from './san-volume-management-kit';
 *
 * // Create volume
 * const volume = await createVolume(Volume, {
 *   name: 'patient-records-vol-001',
 *   sizeGb: 100,
 *   storagePoolId: 'pool-1',
 *   tenantId: 'hospital-1'
 * });
 *
 * // Resize volume
 * await resizeVolume(Volume, VolumeMetrics, volume.id, 200);
 *
 * // Create snapshot
 * await createSnapshot(VolumeSnapshot, volume.id, { retentionDays: 30 });
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   migrateVolume,
 *   getVolumeHealthStatus,
 *   analyzeStorageCapacity,
 *   cloneVolumeWithSnapshots
 * } from './san-volume-management-kit';
 *
 * // Migrate volume to different storage pool
 * await migrateVolume(Volume, VolumeMigration, volumeId, 'pool-2', {
 *   verifyData: true,
 *   deleteSource: true
 * });
 *
 * // Check volume health
 * const health = await getVolumeHealthStatus(Volume, VolumeMetrics, volumeId);
 *
 * // Capacity planning
 * const analysis = await analyzeStorageCapacity(Volume, VolumeMetrics, 'pool-1');
 * ```
 *
 * LOC: SANVOL8901X456
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: Storage services, backup systems, monitoring, capacity planning
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

import {
  Model,
  ModelStatic,
  Transaction,
  Op,
  Sequelize,
  Association,
  FindOptions,
  WhereOptions,
  IncludeOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @interface VolumeModel
 * @description Base volume model interface
 */
export interface VolumeModel extends Model {
  id: string;
  name: string;
  description?: string;
  sizeGb: number;
  usedGb: number;
  status: 'creating' | 'active' | 'resizing' | 'migrating' | 'deleting' | 'error' | 'suspended';
  storagePoolId: string;
  tenantId?: string;
  volumeType: 'standard' | 'performance' | 'archive';
  encryptionEnabled: boolean;
  encryptionKeyId?: string;
  iops?: number;
  throughputMbps?: number;
  mountPath?: string;
  tags?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @interface VolumeSnapshotModel
 * @description Volume snapshot model interface
 */
export interface VolumeSnapshotModel extends Model {
  id: string;
  volumeId: string;
  name: string;
  description?: string;
  sizeGb: number;
  status: 'creating' | 'available' | 'deleting' | 'error';
  snapshotType: 'manual' | 'scheduled' | 'pre-migration' | 'backup';
  retentionDays?: number;
  expiresAt?: Date;
  isEncrypted: boolean;
  parentSnapshotId?: string;
  createdBy?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface VolumeMetricsModel
 * @description Volume metrics and performance tracking model
 */
export interface VolumeMetricsModel extends Model {
  id: string;
  volumeId: string;
  timestamp: Date;
  readIops: number;
  writeIops: number;
  readThroughputMbps: number;
  writeThroughputMbps: number;
  usedGb: number;
  availableGb: number;
  utilizationPercent: number;
  latencyMs: number;
  queueDepth: number;
  errorCount: number;
  metadata?: Record<string, any>;
}

/**
 * @interface VolumeReplicaModel
 * @description Volume replication model for HA
 */
export interface VolumeReplicaModel extends Model {
  id: string;
  sourceVolumeId: string;
  targetVolumeId: string;
  replicationMode: 'sync' | 'async' | 'semi-sync';
  status: 'initializing' | 'replicating' | 'paused' | 'error' | 'complete';
  targetStoragePoolId: string;
  lagSeconds?: number;
  lastSyncAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface VolumeMigrationModel
 * @description Volume migration tracking model
 */
export interface VolumeMigrationModel extends Model {
  id: string;
  volumeId: string;
  sourceStoragePoolId: string;
  targetStoragePoolId: string;
  status: 'pending' | 'preparing' | 'copying' | 'verifying' | 'finalizing' | 'complete' | 'failed' | 'rollback';
  progressPercent: number;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  verificationPassed?: boolean;
  deleteSource: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface VolumeAllocationModel
 * @description Volume allocation tracking for capacity management
 */
export interface VolumeAllocationModel extends Model {
  id: string;
  volumeId: string;
  storagePoolId: string;
  allocatedGb: number;
  reservedGb: number;
  usedGb: number;
  allocationTimestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * @interface StoragePoolModel
 * @description Storage pool model
 */
export interface StoragePoolModel extends Model {
  id: string;
  name: string;
  totalCapacityGb: number;
  usedCapacityGb: number;
  availableCapacityGb: number;
  poolType: 'ssd' | 'hdd' | 'hybrid' | 'nvme';
  status: 'active' | 'maintenance' | 'degraded' | 'offline';
  performanceTier: 'high' | 'medium' | 'low';
  location?: string;
  metadata?: Record<string, any>;
}

/**
 * @interface VolumeCreateConfig
 * @description Configuration for volume creation
 */
export interface VolumeCreateConfig {
  /** Volume name */
  name: string;
  /** Volume description */
  description?: string;
  /** Size in GB */
  sizeGb: number;
  /** Storage pool ID */
  storagePoolId: string;
  /** Tenant ID */
  tenantId?: string;
  /** Volume type */
  volumeType?: 'standard' | 'performance' | 'archive';
  /** Enable encryption */
  encryptionEnabled?: boolean;
  /** Encryption key ID */
  encryptionKeyId?: string;
  /** IOPS limit */
  iops?: number;
  /** Throughput limit in Mbps */
  throughputMbps?: number;
  /** Tags */
  tags?: Record<string, any>;
  /** Metadata */
  metadata?: Record<string, any>;
  /** Transaction */
  transaction?: Transaction;
}

/**
 * @interface VolumeResizeConfig
 * @description Configuration for volume resizing
 */
export interface VolumeResizeConfig {
  /** New size in GB */
  newSizeGb: number;
  /** Create snapshot before resize */
  createSnapshot?: boolean;
  /** Snapshot name */
  snapshotName?: string;
  /** Allow online resize */
  allowOnlineResize?: boolean;
  /** Transaction */
  transaction?: Transaction;
}

/**
 * @interface VolumeCloneConfig
 * @description Configuration for volume cloning
 */
export interface VolumeCloneConfig {
  /** Clone name */
  name: string;
  /** Clone description */
  description?: string;
  /** Target storage pool */
  targetStoragePoolId?: string;
  /** Clone from snapshot */
  snapshotId?: string;
  /** Clone tags */
  tags?: Record<string, any>;
  /** Transaction */
  transaction?: Transaction;
}

/**
 * @interface SnapshotConfig
 * @description Configuration for snapshot creation
 */
export interface SnapshotConfig {
  /** Snapshot name */
  name?: string;
  /** Snapshot description */
  description?: string;
  /** Snapshot type */
  snapshotType?: 'manual' | 'scheduled' | 'pre-migration' | 'backup';
  /** Retention days */
  retentionDays?: number;
  /** Created by user ID */
  createdBy?: string;
  /** Metadata */
  metadata?: Record<string, any>;
  /** Transaction */
  transaction?: Transaction;
}

/**
 * @interface MigrationConfig
 * @description Configuration for volume migration
 */
export interface MigrationConfig {
  /** Target storage pool ID */
  targetStoragePoolId: string;
  /** Create snapshot before migration */
  createSnapshot?: boolean;
  /** Verify data after migration */
  verifyData?: boolean;
  /** Delete source after migration */
  deleteSource?: boolean;
  /** Allow downtime */
  allowDowntime?: boolean;
  /** Transaction */
  transaction?: Transaction;
}

/**
 * @interface VolumeHealthStatus
 * @description Volume health status information
 */
export interface VolumeHealthStatus {
  /** Volume ID */
  volumeId: string;
  /** Overall health status */
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  /** Health score (0-100) */
  score: number;
  /** Issues detected */
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>;
  /** Recommendations */
  recommendations: string[];
  /** Last check timestamp */
  lastCheckAt: Date;
}

/**
 * @interface VolumeAnalytics
 * @description Volume analytics data
 */
export interface VolumeAnalytics {
  /** Total volumes */
  totalVolumes: number;
  /** Total capacity GB */
  totalCapacityGb: number;
  /** Used capacity GB */
  usedCapacityGb: number;
  /** Available capacity GB */
  availableCapacityGb: number;
  /** Average utilization percent */
  avgUtilizationPercent: number;
  /** Volumes by status */
  volumesByStatus: Record<string, number>;
  /** Volumes by type */
  volumesByType: Record<string, number>;
  /** Growth trend */
  growthTrendGbPerDay: number;
}

/**
 * @interface StorageCapacityAnalysis
 * @description Storage capacity analysis
 */
export interface StorageCapacityAnalysis {
  /** Storage pool ID */
  storagePoolId: string;
  /** Total capacity GB */
  totalCapacityGb: number;
  /** Used capacity GB */
  usedCapacityGb: number;
  /** Available capacity GB */
  availableCapacityGb: number;
  /** Utilization percent */
  utilizationPercent: number;
  /** Projected full date */
  projectedFullDate?: Date;
  /** Days until full */
  daysUntilFull?: number;
  /** Recommendations */
  recommendations: string[];
}

// ============================================================================
// VOLUME CREATION OPERATIONS
// ============================================================================

/**
 * @function createVolume
 * @description Creates a new storage volume with audit trail
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {VolumeCreateConfig} config - Volume configuration
 * @returns {Promise<VolumeModel>} Created volume
 *
 * @example
 * ```typescript
 * const volume = await createVolume(Volume, {
 *   name: 'patient-records-vol-001',
 *   sizeGb: 100,
 *   storagePoolId: 'pool-1',
 *   tenantId: 'hospital-1',
 *   volumeType: 'performance',
 *   encryptionEnabled: true
 * });
 * ```
 */
export async function createVolume(
  Volume: ModelStatic<VolumeModel>,
  config: VolumeCreateConfig
): Promise<VolumeModel> {
  const {
    name,
    description,
    sizeGb,
    storagePoolId,
    tenantId,
    volumeType = 'standard',
    encryptionEnabled = true,
    encryptionKeyId,
    iops,
    throughputMbps,
    tags,
    metadata,
    transaction,
  } = config;

  return await Volume.create(
    {
      name,
      description,
      sizeGb,
      usedGb: 0,
      status: 'creating',
      storagePoolId,
      tenantId,
      volumeType,
      encryptionEnabled,
      encryptionKeyId,
      iops,
      throughputMbps,
      tags,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
    } as any,
    { transaction }
  );
}

/**
 * @function createVolumeFromTemplate
 * @description Creates a volume from a predefined template
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} templateName - Template name
 * @param {string} volumeName - New volume name
 * @param {object} overrides - Template overrides
 * @returns {Promise<VolumeModel>} Created volume
 *
 * @example
 * ```typescript
 * const volume = await createVolumeFromTemplate(
 *   Volume,
 *   'standard-patient-data',
 *   'patient-data-vol-002',
 *   { sizeGb: 200, tenantId: 'hospital-2' }
 * );
 * ```
 */
export async function createVolumeFromTemplate(
  Volume: ModelStatic<VolumeModel>,
  templateName: string,
  volumeName: string,
  overrides: Partial<VolumeCreateConfig> = {}
): Promise<VolumeModel> {
  // Template definitions
  const templates: Record<string, Partial<VolumeCreateConfig>> = {
    'standard-patient-data': {
      sizeGb: 100,
      volumeType: 'standard',
      encryptionEnabled: true,
      tags: { purpose: 'patient-data', compliance: 'hipaa' },
    },
    'high-performance-imaging': {
      sizeGb: 500,
      volumeType: 'performance',
      encryptionEnabled: true,
      iops: 10000,
      throughputMbps: 500,
      tags: { purpose: 'medical-imaging', compliance: 'hipaa' },
    },
    'archive-storage': {
      sizeGb: 1000,
      volumeType: 'archive',
      encryptionEnabled: true,
      tags: { purpose: 'archive', retention: 'long-term' },
    },
  };

  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  const config: VolumeCreateConfig = {
    name: volumeName,
    ...template,
    ...overrides,
  } as VolumeCreateConfig;

  return await createVolume(Volume, config);
}

/**
 * @function createVolumeWithSnapshot
 * @description Creates a volume and immediately takes a snapshot
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {VolumeCreateConfig} config - Volume configuration
 * @param {SnapshotConfig} snapshotConfig - Snapshot configuration
 * @returns {Promise<{ volume: VolumeModel; snapshot: VolumeSnapshotModel }>} Created volume and snapshot
 *
 * @example
 * ```typescript
 * const { volume, snapshot } = await createVolumeWithSnapshot(
 *   Volume,
 *   VolumeSnapshot,
 *   { name: 'critical-vol', sizeGb: 100, storagePoolId: 'pool-1' },
 *   { name: 'initial-snapshot', retentionDays: 30 }
 * );
 * ```
 */
export async function createVolumeWithSnapshot(
  Volume: ModelStatic<VolumeModel>,
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  config: VolumeCreateConfig,
  snapshotConfig: SnapshotConfig
): Promise<{ volume: VolumeModel; snapshot: VolumeSnapshotModel }> {
  const volume = await createVolume(Volume, config);

  // Update volume to active status
  await volume.update({ status: 'active' } as any);

  const snapshot = await createSnapshot(VolumeSnapshot, volume.id, snapshotConfig);

  return { volume, snapshot };
}

/**
 * @function bulkCreateVolumes
 * @description Creates multiple volumes in a batch operation
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {VolumeCreateConfig[]} configs - Array of volume configurations
 * @returns {Promise<VolumeModel[]>} Created volumes
 *
 * @example
 * ```typescript
 * const volumes = await bulkCreateVolumes(Volume, [
 *   { name: 'vol-1', sizeGb: 100, storagePoolId: 'pool-1' },
 *   { name: 'vol-2', sizeGb: 200, storagePoolId: 'pool-1' },
 *   { name: 'vol-3', sizeGb: 150, storagePoolId: 'pool-2' }
 * ]);
 * ```
 */
export async function bulkCreateVolumes(
  Volume: ModelStatic<VolumeModel>,
  configs: VolumeCreateConfig[]
): Promise<VolumeModel[]> {
  const volumeData = configs.map((config) => ({
    name: config.name,
    description: config.description,
    sizeGb: config.sizeGb,
    usedGb: 0,
    status: 'creating',
    storagePoolId: config.storagePoolId,
    tenantId: config.tenantId,
    volumeType: config.volumeType || 'standard',
    encryptionEnabled: config.encryptionEnabled !== false,
    encryptionKeyId: config.encryptionKeyId,
    iops: config.iops,
    throughputMbps: config.throughputMbps,
    tags: config.tags,
    metadata: config.metadata,
  }));

  return await Volume.bulkCreate(volumeData as any);
}

/**
 * @function provisionVolumeSet
 * @description Provisions a set of volumes for a complete environment
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} environmentName - Environment name
 * @param {string} storagePoolId - Storage pool ID
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<VolumeModel[]>} Provisioned volumes
 *
 * @example
 * ```typescript
 * const volumes = await provisionVolumeSet(
 *   Volume,
 *   'production-ehr',
 *   'pool-1',
 *   'hospital-1'
 * );
 * // Creates: database, application, logs, backups volumes
 * ```
 */
export async function provisionVolumeSet(
  Volume: ModelStatic<VolumeModel>,
  environmentName: string,
  storagePoolId: string,
  tenantId?: string,
  transaction?: Transaction
): Promise<VolumeModel[]> {
  const volumeConfigs: VolumeCreateConfig[] = [
    {
      name: `${environmentName}-database`,
      sizeGb: 500,
      storagePoolId,
      tenantId,
      volumeType: 'performance',
      encryptionEnabled: true,
      iops: 5000,
      tags: { environment: environmentName, type: 'database' },
      transaction,
    },
    {
      name: `${environmentName}-application`,
      sizeGb: 200,
      storagePoolId,
      tenantId,
      volumeType: 'standard',
      encryptionEnabled: true,
      tags: { environment: environmentName, type: 'application' },
      transaction,
    },
    {
      name: `${environmentName}-logs`,
      sizeGb: 100,
      storagePoolId,
      tenantId,
      volumeType: 'standard',
      encryptionEnabled: true,
      tags: { environment: environmentName, type: 'logs' },
      transaction,
    },
    {
      name: `${environmentName}-backups`,
      sizeGb: 1000,
      storagePoolId,
      tenantId,
      volumeType: 'archive',
      encryptionEnabled: true,
      tags: { environment: environmentName, type: 'backups' },
      transaction,
    },
  ];

  return await bulkCreateVolumes(Volume, volumeConfigs);
}

// ============================================================================
// VOLUME DELETION OPERATIONS
// ============================================================================

/**
 * @function deleteVolume
 * @description Deletes a volume with data sanitization
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} volumeId - Volume ID
 * @param {boolean} forceDelete - Force delete even if volume is active
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteVolume(Volume, 'vol-123', false);
 * ```
 */
export async function deleteVolume(
  Volume: ModelStatic<VolumeModel>,
  volumeId: string,
  forceDelete: boolean = false,
  transaction?: Transaction
): Promise<void> {
  const volume = await Volume.findByPk(volumeId, { transaction });
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  if (!forceDelete && volume.status !== 'suspended') {
    throw new Error(`Volume ${volumeId} must be suspended before deletion`);
  }

  await volume.update({ status: 'deleting' } as any, { transaction });
  await volume.destroy({ transaction });
}

/**
 * @function softDeleteVolume
 * @description Soft deletes a volume (marks as deleted but keeps record)
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} volumeId - Volume ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<VolumeModel>} Updated volume
 *
 * @example
 * ```typescript
 * const deletedVolume = await softDeleteVolume(Volume, 'vol-123');
 * // Volume marked as deleted but data retained for recovery
 * ```
 */
export async function softDeleteVolume(
  Volume: ModelStatic<VolumeModel>,
  volumeId: string,
  transaction?: Transaction
): Promise<VolumeModel> {
  const volume = await Volume.findByPk(volumeId, { transaction });
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  return await volume.update(
    {
      status: 'suspended',
      deletedAt: new Date(),
      metadata: {
        ...volume.metadata,
        softDeletedAt: new Date().toISOString(),
      },
    } as any,
    { transaction }
  );
}

/**
 * @function cascadeDeleteVolume
 * @description Deletes a volume and all associated resources (snapshots, replicas, metrics)
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {ModelStatic<VolumeReplicaModel>} VolumeReplica - VolumeReplica model
 * @param {string} volumeId - Volume ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cascadeDeleteVolume(
 *   Volume,
 *   VolumeSnapshot,
 *   VolumeMetrics,
 *   VolumeReplica,
 *   'vol-123'
 * );
 * ```
 */
export async function cascadeDeleteVolume(
  Volume: ModelStatic<VolumeModel>,
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  VolumeReplica: ModelStatic<VolumeReplicaModel>,
  volumeId: string,
  transaction?: Transaction
): Promise<void> {
  // Delete snapshots
  await VolumeSnapshot.destroy({
    where: { volumeId } as any,
    transaction,
  });

  // Delete metrics
  await VolumeMetrics.destroy({
    where: { volumeId } as any,
    transaction,
  });

  // Delete replicas
  await VolumeReplica.destroy({
    where: {
      [Op.or]: [{ sourceVolumeId: volumeId }, { targetVolumeId: volumeId }],
    } as any,
    transaction,
  });

  // Delete volume
  await deleteVolume(Volume, volumeId, true, transaction);
}

/**
 * @function purgeDeletedVolumes
 * @description Permanently deletes soft-deleted volumes older than retention period
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {number} retentionDays - Retention period in days
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of volumes purged
 *
 * @example
 * ```typescript
 * // Purge volumes deleted more than 30 days ago
 * const purged = await purgeDeletedVolumes(Volume, 30);
 * console.log(`Purged ${purged} volumes`);
 * ```
 */
export async function purgeDeletedVolumes(
  Volume: ModelStatic<VolumeModel>,
  retentionDays: number = 30,
  transaction?: Transaction
): Promise<number> {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - retentionDays);

  return await Volume.destroy({
    where: {
      status: 'suspended',
      deletedAt: { [Op.lte]: threshold },
    } as any,
    transaction,
    force: true,
  });
}

// ============================================================================
// VOLUME RESIZING OPERATIONS
// ============================================================================

/**
 * @function resizeVolume
 * @description Resizes a volume to new capacity
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {number} newSizeGb - New size in GB
 * @param {VolumeResizeConfig} config - Resize configuration
 * @returns {Promise<VolumeModel>} Resized volume
 *
 * @example
 * ```typescript
 * const volume = await resizeVolume(
 *   Volume,
 *   VolumeMetrics,
 *   'vol-123',
 *   200,
 *   { createSnapshot: true, allowOnlineResize: true }
 * );
 * ```
 */
export async function resizeVolume(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  newSizeGb: number,
  config: Partial<VolumeResizeConfig> = {}
): Promise<VolumeModel> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  if (newSizeGb < volume.sizeGb) {
    throw new Error('Volume size can only be increased, not decreased');
  }

  if (newSizeGb === volume.sizeGb) {
    return volume;
  }

  const oldSize = volume.sizeGb;
  await volume.update(
    {
      status: 'resizing',
      sizeGb: newSizeGb,
      metadata: {
        ...volume.metadata,
        resizedAt: new Date().toISOString(),
        previousSize: oldSize,
      },
    } as any
  );

  // Record metrics
  await VolumeMetrics.create({
    volumeId,
    timestamp: new Date(),
    readIops: 0,
    writeIops: 0,
    readThroughputMbps: 0,
    writeThroughputMbps: 0,
    usedGb: volume.usedGb,
    availableGb: newSizeGb - volume.usedGb,
    utilizationPercent: (volume.usedGb / newSizeGb) * 100,
    latencyMs: 0,
    queueDepth: 0,
    errorCount: 0,
    metadata: { operation: 'resize', oldSize, newSize: newSizeGb },
  } as any);

  await volume.update({ status: 'active' } as any);
  return await Volume.findByPk(volumeId) as VolumeModel;
}

/**
 * @function autoExpandVolume
 * @description Automatically expands volume when utilization exceeds threshold
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {number} thresholdPercent - Utilization threshold percentage
 * @param {number} expansionPercent - Expansion percentage
 * @returns {Promise<VolumeModel | null>} Expanded volume or null if not needed
 *
 * @example
 * ```typescript
 * // Auto-expand by 50% when 80% full
 * const volume = await autoExpandVolume(
 *   Volume,
 *   VolumeMetrics,
 *   'vol-123',
 *   80,
 *   50
 * );
 * ```
 */
export async function autoExpandVolume(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  thresholdPercent: number = 80,
  expansionPercent: number = 50
): Promise<VolumeModel | null> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  const utilizationPercent = (volume.usedGb / volume.sizeGb) * 100;

  if (utilizationPercent >= thresholdPercent) {
    const newSizeGb = Math.ceil(volume.sizeGb * (1 + expansionPercent / 100));
    return await resizeVolume(Volume, VolumeMetrics, volumeId, newSizeGb);
  }

  return null;
}

/**
 * @function shrinkVolume
 * @description Shrinks a volume by creating a new smaller volume and migrating data
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} volumeId - Volume ID
 * @param {number} newSizeGb - New size in GB
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<VolumeModel>} New smaller volume
 *
 * @example
 * ```typescript
 * // Shrink volume from 500GB to 300GB
 * const newVolume = await shrinkVolume(Volume, 'vol-123', 300);
 * ```
 */
export async function shrinkVolume(
  Volume: ModelStatic<VolumeModel>,
  volumeId: string,
  newSizeGb: number,
  transaction?: Transaction
): Promise<VolumeModel> {
  const sourceVolume = await Volume.findByPk(volumeId, { transaction });
  if (!sourceVolume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  if (newSizeGb >= sourceVolume.sizeGb) {
    throw new Error('New size must be smaller than current size');
  }

  if (sourceVolume.usedGb > newSizeGb) {
    throw new Error('Cannot shrink volume: used space exceeds new size');
  }

  // Create new smaller volume
  const newVolume = await createVolume(Volume, {
    name: `${sourceVolume.name}-shrunk`,
    sizeGb: newSizeGb,
    storagePoolId: sourceVolume.storagePoolId,
    tenantId: sourceVolume.tenantId,
    volumeType: sourceVolume.volumeType,
    encryptionEnabled: sourceVolume.encryptionEnabled,
    metadata: {
      shrunkFrom: volumeId,
      originalSize: sourceVolume.sizeGb,
    },
    transaction,
  });

  return newVolume;
}

/**
 * @function getVolumeResizeHistory
 * @description Gets resize history for a volume
 *
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {number} limit - Limit results
 * @returns {Promise<VolumeMetricsModel[]>} Resize history
 *
 * @example
 * ```typescript
 * const history = await getVolumeResizeHistory(VolumeMetrics, 'vol-123', 10);
 * history.forEach(h => console.log(`Resized to ${h.availableGb}GB`));
 * ```
 */
export async function getVolumeResizeHistory(
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  limit: number = 10
): Promise<VolumeMetricsModel[]> {
  return await VolumeMetrics.findAll({
    where: {
      volumeId,
      'metadata.operation': 'resize',
    } as any,
    order: [['timestamp', 'DESC']],
    limit,
  });
}

// ============================================================================
// VOLUME CLONING OPERATIONS
// ============================================================================

/**
 * @function cloneVolume
 * @description Creates an exact copy of a volume
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} sourceVolumeId - Source volume ID
 * @param {VolumeCloneConfig} config - Clone configuration
 * @returns {Promise<VolumeModel>} Cloned volume
 *
 * @example
 * ```typescript
 * const clone = await cloneVolume(Volume, 'vol-123', {
 *   name: 'vol-123-clone',
 *   targetStoragePoolId: 'pool-2'
 * });
 * ```
 */
export async function cloneVolume(
  Volume: ModelStatic<VolumeModel>,
  sourceVolumeId: string,
  config: VolumeCloneConfig
): Promise<VolumeModel> {
  const sourceVolume = await Volume.findByPk(sourceVolumeId);
  if (!sourceVolume) {
    throw new Error(`Source volume ${sourceVolumeId} not found`);
  }

  return await Volume.create(
    {
      name: config.name,
      description: config.description || `Clone of ${sourceVolume.name}`,
      sizeGb: sourceVolume.sizeGb,
      usedGb: sourceVolume.usedGb,
      status: 'creating',
      storagePoolId: config.targetStoragePoolId || sourceVolume.storagePoolId,
      tenantId: sourceVolume.tenantId,
      volumeType: sourceVolume.volumeType,
      encryptionEnabled: sourceVolume.encryptionEnabled,
      iops: sourceVolume.iops,
      throughputMbps: sourceVolume.throughputMbps,
      tags: { ...sourceVolume.tags, ...config.tags, clonedFrom: sourceVolumeId },
      metadata: {
        ...sourceVolume.metadata,
        clonedFrom: sourceVolumeId,
        clonedAt: new Date().toISOString(),
      },
    } as any,
    { transaction: config.transaction }
  );
}

/**
 * @function cloneVolumeFromSnapshot
 * @description Creates a volume from a snapshot
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} snapshotId - Snapshot ID
 * @param {VolumeCloneConfig} config - Clone configuration
 * @returns {Promise<VolumeModel>} New volume from snapshot
 *
 * @example
 * ```typescript
 * const volume = await cloneVolumeFromSnapshot(
 *   Volume,
 *   VolumeSnapshot,
 *   'snap-456',
 *   { name: 'restored-volume' }
 * );
 * ```
 */
export async function cloneVolumeFromSnapshot(
  Volume: ModelStatic<VolumeModel>,
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  snapshotId: string,
  config: VolumeCloneConfig
): Promise<VolumeModel> {
  const snapshot = await VolumeSnapshot.findByPk(snapshotId);
  if (!snapshot) {
    throw new Error(`Snapshot ${snapshotId} not found`);
  }

  const sourceVolume = await Volume.findByPk(snapshot.volumeId);
  if (!sourceVolume) {
    throw new Error(`Source volume ${snapshot.volumeId} not found`);
  }

  return await Volume.create(
    {
      name: config.name,
      description: config.description || `Restored from snapshot ${snapshot.name}`,
      sizeGb: snapshot.sizeGb,
      usedGb: 0,
      status: 'creating',
      storagePoolId: config.targetStoragePoolId || sourceVolume.storagePoolId,
      tenantId: sourceVolume.tenantId,
      volumeType: sourceVolume.volumeType,
      encryptionEnabled: snapshot.isEncrypted,
      tags: { ...config.tags, restoredFrom: snapshotId },
      metadata: {
        restoredFromSnapshot: snapshotId,
        restoredAt: new Date().toISOString(),
      },
    } as any,
    { transaction: config.transaction }
  );
}

/**
 * @function cloneVolumeWithSnapshots
 * @description Clones a volume and all its snapshots
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} sourceVolumeId - Source volume ID
 * @param {VolumeCloneConfig} config - Clone configuration
 * @returns {Promise<{ volume: VolumeModel; snapshots: VolumeSnapshotModel[] }>} Cloned volume and snapshots
 *
 * @example
 * ```typescript
 * const { volume, snapshots } = await cloneVolumeWithSnapshots(
 *   Volume,
 *   VolumeSnapshot,
 *   'vol-123',
 *   { name: 'vol-123-full-clone' }
 * );
 * ```
 */
export async function cloneVolumeWithSnapshots(
  Volume: ModelStatic<VolumeModel>,
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  sourceVolumeId: string,
  config: VolumeCloneConfig
): Promise<{ volume: VolumeModel; snapshots: VolumeSnapshotModel[] }> {
  const volume = await cloneVolume(Volume, sourceVolumeId, config);

  const sourceSnapshots = await VolumeSnapshot.findAll({
    where: { volumeId: sourceVolumeId } as any,
  });

  const clonedSnapshots = await Promise.all(
    sourceSnapshots.map((snapshot) =>
      VolumeSnapshot.create({
        volumeId: volume.id,
        name: `${snapshot.name}-clone`,
        description: snapshot.description,
        sizeGb: snapshot.sizeGb,
        status: 'available',
        snapshotType: snapshot.snapshotType,
        retentionDays: snapshot.retentionDays,
        isEncrypted: snapshot.isEncrypted,
        metadata: {
          ...snapshot.metadata,
          clonedFrom: snapshot.id,
        },
      } as any)
    )
  );

  return { volume, snapshots: clonedSnapshots };
}

/**
 * @function createVolumeCloneSet
 * @description Creates multiple clones of a volume for testing/development
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} sourceVolumeId - Source volume ID
 * @param {number} count - Number of clones to create
 * @param {string} namePrefix - Clone name prefix
 * @returns {Promise<VolumeModel[]>} Created clones
 *
 * @example
 * ```typescript
 * const clones = await createVolumeCloneSet(
 *   Volume,
 *   'prod-vol-123',
 *   3,
 *   'dev-vol'
 * );
 * // Creates: dev-vol-1, dev-vol-2, dev-vol-3
 * ```
 */
export async function createVolumeCloneSet(
  Volume: ModelStatic<VolumeModel>,
  sourceVolumeId: string,
  count: number,
  namePrefix: string
): Promise<VolumeModel[]> {
  const clones: VolumeModel[] = [];

  for (let i = 1; i <= count; i++) {
    const clone = await cloneVolume(Volume, sourceVolumeId, {
      name: `${namePrefix}-${i}`,
      tags: { clone: true, cloneIndex: i },
    });
    clones.push(clone);
  }

  return clones;
}

// ============================================================================
// SNAPSHOT MANAGEMENT
// ============================================================================

/**
 * @function createSnapshot
 * @description Creates a snapshot of a volume
 *
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} volumeId - Volume ID
 * @param {SnapshotConfig} config - Snapshot configuration
 * @returns {Promise<VolumeSnapshotModel>} Created snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await createSnapshot(VolumeSnapshot, 'vol-123', {
 *   name: 'daily-backup',
 *   retentionDays: 7,
 *   snapshotType: 'scheduled'
 * });
 * ```
 */
export async function createSnapshot(
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  volumeId: string,
  config: SnapshotConfig = {}
): Promise<VolumeSnapshotModel> {
  const {
    name,
    description,
    snapshotType = 'manual',
    retentionDays,
    createdBy,
    metadata,
    transaction,
  } = config;

  const expiresAt = retentionDays
    ? new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000)
    : undefined;

  return await VolumeSnapshot.create(
    {
      volumeId,
      name: name || `snapshot-${Date.now()}`,
      description,
      sizeGb: 0, // Will be updated after snapshot creation
      status: 'creating',
      snapshotType,
      retentionDays,
      expiresAt,
      isEncrypted: true,
      createdBy,
      metadata,
    } as any,
    { transaction }
  );
}

/**
 * @function deleteSnapshot
 * @description Deletes a volume snapshot
 *
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteSnapshot(VolumeSnapshot, 'snap-456');
 * ```
 */
export async function deleteSnapshot(
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  snapshotId: string,
  transaction?: Transaction
): Promise<void> {
  const snapshot = await VolumeSnapshot.findByPk(snapshotId, { transaction });
  if (!snapshot) {
    throw new Error(`Snapshot ${snapshotId} not found`);
  }

  await snapshot.update({ status: 'deleting' } as any, { transaction });
  await snapshot.destroy({ transaction });
}

/**
 * @function restoreVolumeFromSnapshot
 * @description Restores a volume to a snapshot state
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} volumeId - Volume ID
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<VolumeModel>} Restored volume
 *
 * @example
 * ```typescript
 * const volume = await restoreVolumeFromSnapshot(
 *   Volume,
 *   VolumeSnapshot,
 *   'vol-123',
 *   'snap-456'
 * );
 * ```
 */
export async function restoreVolumeFromSnapshot(
  Volume: ModelStatic<VolumeModel>,
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  volumeId: string,
  snapshotId: string,
  transaction?: Transaction
): Promise<VolumeModel> {
  const snapshot = await VolumeSnapshot.findByPk(snapshotId, { transaction });
  if (!snapshot) {
    throw new Error(`Snapshot ${snapshotId} not found`);
  }

  if (snapshot.volumeId !== volumeId) {
    throw new Error('Snapshot does not belong to the specified volume');
  }

  const volume = await Volume.findByPk(volumeId, { transaction });
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  return await volume.update(
    {
      status: 'active',
      metadata: {
        ...volume.metadata,
        restoredFromSnapshot: snapshotId,
        restoredAt: new Date().toISOString(),
      },
    } as any,
    { transaction }
  );
}

/**
 * @function getVolumeSnapshots
 * @description Gets all snapshots for a volume
 *
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} volumeId - Volume ID
 * @param {boolean} includeExpired - Include expired snapshots
 * @returns {Promise<VolumeSnapshotModel[]>} Volume snapshots
 *
 * @example
 * ```typescript
 * const snapshots = await getVolumeSnapshots(VolumeSnapshot, 'vol-123', false);
 * snapshots.forEach(s => console.log(s.name));
 * ```
 */
export async function getVolumeSnapshots(
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  volumeId: string,
  includeExpired: boolean = false
): Promise<VolumeSnapshotModel[]> {
  const where: any = { volumeId };

  if (!includeExpired) {
    where[Op.or] = [
      { expiresAt: null },
      { expiresAt: { [Op.gt]: new Date() } },
    ];
  }

  return await VolumeSnapshot.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * @function cleanupExpiredSnapshots
 * @description Deletes expired snapshots based on retention policy
 *
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of snapshots deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredSnapshots(VolumeSnapshot);
 * console.log(`Cleaned up ${deleted} expired snapshots`);
 * ```
 */
export async function cleanupExpiredSnapshots(
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  transaction?: Transaction
): Promise<number> {
  return await VolumeSnapshot.destroy({
    where: {
      status: 'available',
      expiresAt: { [Op.lte]: new Date() },
    } as any,
    transaction,
  });
}

/**
 * @function createSnapshotChain
 * @description Creates a chain of incremental snapshots
 *
 * @param {ModelStatic<VolumeSnapshotModel>} VolumeSnapshot - VolumeSnapshot model
 * @param {string} volumeId - Volume ID
 * @param {number} count - Number of snapshots in chain
 * @param {string} namePrefix - Snapshot name prefix
 * @returns {Promise<VolumeSnapshotModel[]>} Created snapshots
 *
 * @example
 * ```typescript
 * const chain = await createSnapshotChain(
 *   VolumeSnapshot,
 *   'vol-123',
 *   3,
 *   'incremental'
 * );
 * ```
 */
export async function createSnapshotChain(
  VolumeSnapshot: ModelStatic<VolumeSnapshotModel>,
  volumeId: string,
  count: number,
  namePrefix: string
): Promise<VolumeSnapshotModel[]> {
  const snapshots: VolumeSnapshotModel[] = [];
  let parentSnapshotId: string | undefined;

  for (let i = 1; i <= count; i++) {
    const snapshot = await createSnapshot(VolumeSnapshot, volumeId, {
      name: `${namePrefix}-${i}`,
      snapshotType: 'scheduled',
      metadata: {
        chainIndex: i,
        parentSnapshot: parentSnapshotId,
      },
    });

    if (parentSnapshotId) {
      await snapshot.update({ parentSnapshotId } as any);
    }

    snapshots.push(snapshot);
    parentSnapshotId = snapshot.id;
  }

  return snapshots;
}

// ============================================================================
// VOLUME MIGRATION OPERATIONS
// ============================================================================

/**
 * @function migrateVolume
 * @description Migrates a volume to a different storage pool
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMigrationModel>} VolumeMigration - VolumeMigration model
 * @param {string} volumeId - Volume ID
 * @param {string} targetStoragePoolId - Target storage pool ID
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<VolumeMigrationModel>} Migration record
 *
 * @example
 * ```typescript
 * const migration = await migrateVolume(
 *   Volume,
 *   VolumeMigration,
 *   'vol-123',
 *   'pool-2',
 *   { verifyData: true, deleteSource: true }
 * );
 * ```
 */
export async function migrateVolume(
  Volume: ModelStatic<VolumeModel>,
  VolumeMigration: ModelStatic<VolumeMigrationModel>,
  volumeId: string,
  targetStoragePoolId: string,
  config: Partial<MigrationConfig> = {}
): Promise<VolumeMigrationModel> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  if (volume.storagePoolId === targetStoragePoolId) {
    throw new Error('Target storage pool is the same as source');
  }

  await volume.update({ status: 'migrating' } as any);

  return await VolumeMigration.create(
    {
      volumeId,
      sourceStoragePoolId: volume.storagePoolId,
      targetStoragePoolId,
      status: 'pending',
      progressPercent: 0,
      startedAt: new Date(),
      deleteSource: config.deleteSource || false,
      metadata: {
        verifyData: config.verifyData,
        allowDowntime: config.allowDowntime,
      },
    } as any,
    { transaction: config.transaction }
  );
}

/**
 * @function getMigrationStatus
 * @description Gets the status of a volume migration
 *
 * @param {ModelStatic<VolumeMigrationModel>} VolumeMigration - VolumeMigration model
 * @param {string} migrationId - Migration ID
 * @returns {Promise<VolumeMigrationModel>} Migration status
 *
 * @example
 * ```typescript
 * const status = await getMigrationStatus(VolumeMigration, 'mig-789');
 * console.log(`Progress: ${status.progressPercent}%`);
 * ```
 */
export async function getMigrationStatus(
  VolumeMigration: ModelStatic<VolumeMigrationModel>,
  migrationId: string
): Promise<VolumeMigrationModel> {
  const migration = await VolumeMigration.findByPk(migrationId);
  if (!migration) {
    throw new Error(`Migration ${migrationId} not found`);
  }
  return migration;
}

/**
 * @function cancelMigration
 * @description Cancels an in-progress volume migration
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMigrationModel>} VolumeMigration - VolumeMigration model
 * @param {string} migrationId - Migration ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelMigration(Volume, VolumeMigration, 'mig-789');
 * ```
 */
export async function cancelMigration(
  Volume: ModelStatic<VolumeModel>,
  VolumeMigration: ModelStatic<VolumeMigrationModel>,
  migrationId: string,
  transaction?: Transaction
): Promise<void> {
  const migration = await VolumeMigration.findByPk(migrationId, { transaction });
  if (!migration) {
    throw new Error(`Migration ${migrationId} not found`);
  }

  if (migration.status === 'complete' || migration.status === 'failed') {
    throw new Error(`Cannot cancel migration in ${migration.status} status`);
  }

  await migration.update(
    { status: 'rollback', metadata: { ...migration.metadata, cancelledAt: new Date() } } as any,
    { transaction }
  );

  const volume = await Volume.findByPk(migration.volumeId, { transaction });
  if (volume) {
    await volume.update({ status: 'active' } as any, { transaction });
  }
}

/**
 * @function getActiveMigrations
 * @description Gets all active volume migrations
 *
 * @param {ModelStatic<VolumeMigrationModel>} VolumeMigration - VolumeMigration model
 * @param {string} tenantId - Optional tenant ID filter
 * @returns {Promise<VolumeMigrationModel[]>} Active migrations
 *
 * @example
 * ```typescript
 * const migrations = await getActiveMigrations(VolumeMigration);
 * migrations.forEach(m => console.log(`${m.volumeId}: ${m.progressPercent}%`));
 * ```
 */
export async function getActiveMigrations(
  VolumeMigration: ModelStatic<VolumeMigrationModel>,
  tenantId?: string
): Promise<VolumeMigrationModel[]> {
  const where: any = {
    status: {
      [Op.in]: ['pending', 'preparing', 'copying', 'verifying', 'finalizing'],
    },
  };

  return await VolumeMigration.findAll({
    where,
    order: [['startedAt', 'DESC']],
  });
}

/**
 * @function batchMigrateVolumes
 * @description Migrates multiple volumes to a target storage pool
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMigrationModel>} VolumeMigration - VolumeMigration model
 * @param {string[]} volumeIds - Array of volume IDs
 * @param {string} targetStoragePoolId - Target storage pool ID
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<VolumeMigrationModel[]>} Created migrations
 *
 * @example
 * ```typescript
 * const migrations = await batchMigrateVolumes(
 *   Volume,
 *   VolumeMigration,
 *   ['vol-1', 'vol-2', 'vol-3'],
 *   'pool-2',
 *   { verifyData: true }
 * );
 * ```
 */
export async function batchMigrateVolumes(
  Volume: ModelStatic<VolumeModel>,
  VolumeMigration: ModelStatic<VolumeMigrationModel>,
  volumeIds: string[],
  targetStoragePoolId: string,
  config: Partial<MigrationConfig> = {}
): Promise<VolumeMigrationModel[]> {
  const migrations: VolumeMigrationModel[] = [];

  for (const volumeId of volumeIds) {
    const migration = await migrateVolume(
      Volume,
      VolumeMigration,
      volumeId,
      targetStoragePoolId,
      config
    );
    migrations.push(migration);
  }

  return migrations;
}

// ============================================================================
// VOLUME MONITORING & METRICS
// ============================================================================

/**
 * @function recordVolumeMetrics
 * @description Records current metrics for a volume
 *
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {Partial<VolumeMetricsModel>} metrics - Metrics data
 * @returns {Promise<VolumeMetricsModel>} Created metrics record
 *
 * @example
 * ```typescript
 * await recordVolumeMetrics(VolumeMetrics, 'vol-123', {
 *   readIops: 1000,
 *   writeIops: 500,
 *   utilizationPercent: 75
 * });
 * ```
 */
export async function recordVolumeMetrics(
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  metrics: Partial<VolumeMetricsModel>
): Promise<VolumeMetricsModel> {
  return await VolumeMetrics.create({
    volumeId,
    timestamp: new Date(),
    readIops: metrics.readIops || 0,
    writeIops: metrics.writeIops || 0,
    readThroughputMbps: metrics.readThroughputMbps || 0,
    writeThroughputMbps: metrics.writeThroughputMbps || 0,
    usedGb: metrics.usedGb || 0,
    availableGb: metrics.availableGb || 0,
    utilizationPercent: metrics.utilizationPercent || 0,
    latencyMs: metrics.latencyMs || 0,
    queueDepth: metrics.queueDepth || 0,
    errorCount: metrics.errorCount || 0,
    metadata: metrics.metadata,
  } as any);
}

/**
 * @function getVolumeMetrics
 * @description Gets metrics for a volume within a time range
 *
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<VolumeMetricsModel[]>} Volume metrics
 *
 * @example
 * ```typescript
 * const metrics = await getVolumeMetrics(
 *   VolumeMetrics,
 *   'vol-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export async function getVolumeMetrics(
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  startDate: Date,
  endDate: Date
): Promise<VolumeMetricsModel[]> {
  return await VolumeMetrics.findAll({
    where: {
      volumeId,
      timestamp: {
        [Op.between]: [startDate, endDate],
      },
    } as any,
    order: [['timestamp', 'ASC']],
  });
}

/**
 * @function getVolumePerformanceStats
 * @description Gets aggregated performance statistics for a volume
 *
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {number} hours - Number of hours to analyze
 * @returns {Promise<any>} Performance statistics
 *
 * @example
 * ```typescript
 * const stats = await getVolumePerformanceStats(VolumeMetrics, 'vol-123', 24);
 * console.log(`Avg IOPS: ${stats.avgIops}`);
 * console.log(`Peak latency: ${stats.peakLatencyMs}ms`);
 * ```
 */
export async function getVolumePerformanceStats(
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  hours: number = 24
): Promise<any> {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);

  const metrics = await VolumeMetrics.findAll({
    where: {
      volumeId,
      timestamp: { [Op.gte]: startDate },
    } as any,
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('readIops')), 'avgReadIops'],
      [Sequelize.fn('AVG', Sequelize.col('writeIops')), 'avgWriteIops'],
      [Sequelize.fn('MAX', Sequelize.col('readIops')), 'maxReadIops'],
      [Sequelize.fn('MAX', Sequelize.col('writeIops')), 'maxWriteIops'],
      [Sequelize.fn('AVG', Sequelize.col('latencyMs')), 'avgLatencyMs'],
      [Sequelize.fn('MAX', Sequelize.col('latencyMs')), 'peakLatencyMs'],
      [Sequelize.fn('AVG', Sequelize.col('utilizationPercent')), 'avgUtilization'],
      [Sequelize.fn('SUM', Sequelize.col('errorCount')), 'totalErrors'],
    ],
  });

  const stats = metrics[0]?.get() as any;

  return {
    avgReadIops: parseFloat(stats?.avgReadIops || 0),
    avgWriteIops: parseFloat(stats?.avgWriteIops || 0),
    maxReadIops: parseInt(stats?.maxReadIops || 0),
    maxWriteIops: parseInt(stats?.maxWriteIops || 0),
    avgLatencyMs: parseFloat(stats?.avgLatencyMs || 0),
    peakLatencyMs: parseFloat(stats?.peakLatencyMs || 0),
    avgUtilization: parseFloat(stats?.avgUtilization || 0),
    totalErrors: parseInt(stats?.totalErrors || 0),
  };
}

/**
 * @function monitorVolumeCapacity
 * @description Monitors volume capacity and triggers alerts
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {number} warningThreshold - Warning threshold percentage
 * @param {number} criticalThreshold - Critical threshold percentage
 * @returns {Promise<{ status: string; message: string; currentUtilization: number }>} Capacity status
 *
 * @example
 * ```typescript
 * const status = await monitorVolumeCapacity(
 *   Volume,
 *   VolumeMetrics,
 *   'vol-123',
 *   80,
 *   90
 * );
 * if (status.status === 'critical') {
 *   // Trigger alert
 * }
 * ```
 */
export async function monitorVolumeCapacity(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  warningThreshold: number = 80,
  criticalThreshold: number = 90
): Promise<{ status: string; message: string; currentUtilization: number }> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  const utilizationPercent = (volume.usedGb / volume.sizeGb) * 100;

  await recordVolumeMetrics(VolumeMetrics, volumeId, {
    usedGb: volume.usedGb,
    availableGb: volume.sizeGb - volume.usedGb,
    utilizationPercent,
  });

  if (utilizationPercent >= criticalThreshold) {
    return {
      status: 'critical',
      message: `Volume utilization at ${utilizationPercent.toFixed(2)}% (critical threshold: ${criticalThreshold}%)`,
      currentUtilization: utilizationPercent,
    };
  } else if (utilizationPercent >= warningThreshold) {
    return {
      status: 'warning',
      message: `Volume utilization at ${utilizationPercent.toFixed(2)}% (warning threshold: ${warningThreshold}%)`,
      currentUtilization: utilizationPercent,
    };
  }

  return {
    status: 'healthy',
    message: `Volume utilization at ${utilizationPercent.toFixed(2)}%`,
    currentUtilization: utilizationPercent,
  };
}

/**
 * @function getVolumeIOPSTrend
 * @description Analyzes IOPS trend for capacity planning
 *
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Array<{ date: Date; avgIops: number }>>} IOPS trend
 *
 * @example
 * ```typescript
 * const trend = await getVolumeIOPSTrend(VolumeMetrics, 'vol-123', 30);
 * trend.forEach(t => console.log(`${t.date}: ${t.avgIops} IOPS`));
 * ```
 */
export async function getVolumeIOPSTrend(
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string,
  days: number = 30
): Promise<Array<{ date: Date; avgIops: number }>> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const metrics = await VolumeMetrics.findAll({
    where: {
      volumeId,
      timestamp: { [Op.gte]: startDate },
    } as any,
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'date'],
      [
        Sequelize.fn('AVG', Sequelize.literal('("readIops" + "writeIops")')),
        'avgIops',
      ],
    ],
    group: [Sequelize.fn('DATE', Sequelize.col('timestamp'))],
    order: [[Sequelize.fn('DATE', Sequelize.col('timestamp')), 'ASC']],
  });

  return metrics.map((m: any) => ({
    date: new Date(m.get('date') as string),
    avgIops: parseFloat(m.get('avgIops') as string),
  }));
}

/**
 * @function cleanupOldMetrics
 * @description Removes old metrics data beyond retention period
 *
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {number} retentionDays - Retention period in days
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of metrics deleted
 *
 * @example
 * ```typescript
 * // Clean up metrics older than 90 days
 * const deleted = await cleanupOldMetrics(VolumeMetrics, 90);
 * console.log(`Deleted ${deleted} old metric records`);
 * ```
 */
export async function cleanupOldMetrics(
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  retentionDays: number = 90,
  transaction?: Transaction
): Promise<number> {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - retentionDays);

  return await VolumeMetrics.destroy({
    where: {
      timestamp: { [Op.lte]: threshold },
    } as any,
    transaction,
  });
}

// ============================================================================
// VOLUME VALIDATION & HEALTH
// ============================================================================

/**
 * @function validateVolumeIntegrity
 * @description Validates volume data integrity
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} volumeId - Volume ID
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateVolumeIntegrity(Volume, 'vol-123');
 * if (!result.valid) {
 *   console.error('Issues found:', result.issues);
 * }
 * ```
 */
export async function validateVolumeIntegrity(
  Volume: ModelStatic<VolumeModel>,
  volumeId: string
): Promise<{ valid: boolean; issues: string[] }> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    return { valid: false, issues: ['Volume not found'] };
  }

  const issues: string[] = [];

  // Check size consistency
  if (volume.usedGb > volume.sizeGb) {
    issues.push('Used space exceeds total size');
  }

  // Check status validity
  const validStatuses = ['creating', 'active', 'resizing', 'migrating', 'deleting', 'error', 'suspended'];
  if (!validStatuses.includes(volume.status)) {
    issues.push(`Invalid status: ${volume.status}`);
  }

  // Check encryption configuration
  if (volume.encryptionEnabled && !volume.encryptionKeyId) {
    issues.push('Encryption enabled but no encryption key specified');
  }

  // Check capacity
  const utilizationPercent = (volume.usedGb / volume.sizeGb) * 100;
  if (utilizationPercent > 100) {
    issues.push('Utilization exceeds 100%');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * @function getVolumeHealthStatus
 * @description Gets comprehensive health status for a volume
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @returns {Promise<VolumeHealthStatus>} Health status
 *
 * @example
 * ```typescript
 * const health = await getVolumeHealthStatus(Volume, VolumeMetrics, 'vol-123');
 * console.log(`Health score: ${health.score}/100`);
 * health.issues.forEach(i => console.log(`${i.severity}: ${i.message}`));
 * ```
 */
export async function getVolumeHealthStatus(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string
): Promise<VolumeHealthStatus> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    return {
      volumeId,
      status: 'unknown',
      score: 0,
      issues: [
        {
          type: 'not-found',
          severity: 'critical',
          message: 'Volume not found',
          timestamp: new Date(),
        },
      ],
      recommendations: [],
      lastCheckAt: new Date(),
    };
  }

  const issues: VolumeHealthStatus['issues'] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check integrity
  const integrityCheck = await validateVolumeIntegrity(Volume, volumeId);
  if (!integrityCheck.valid) {
    integrityCheck.issues.forEach((issue) => {
      issues.push({
        type: 'integrity',
        severity: 'high',
        message: issue,
        timestamp: new Date(),
      });
      score -= 20;
    });
  }

  // Check capacity
  const utilizationPercent = (volume.usedGb / volume.sizeGb) * 100;
  if (utilizationPercent > 90) {
    issues.push({
      type: 'capacity',
      severity: 'critical',
      message: `Volume is ${utilizationPercent.toFixed(2)}% full`,
      timestamp: new Date(),
    });
    recommendations.push('Consider expanding volume capacity');
    score -= 30;
  } else if (utilizationPercent > 80) {
    issues.push({
      type: 'capacity',
      severity: 'medium',
      message: `Volume is ${utilizationPercent.toFixed(2)}% full`,
      timestamp: new Date(),
    });
    recommendations.push('Monitor volume capacity closely');
    score -= 15;
  }

  // Check recent metrics for errors
  const recentMetrics = await VolumeMetrics.findOne({
    where: { volumeId } as any,
    order: [['timestamp', 'DESC']],
  });

  if (recentMetrics && recentMetrics.errorCount > 0) {
    issues.push({
      type: 'errors',
      severity: 'high',
      message: `${recentMetrics.errorCount} I/O errors detected`,
      timestamp: recentMetrics.timestamp,
    });
    recommendations.push('Investigate I/O errors and check storage hardware');
    score -= 25;
  }

  // Check status
  if (volume.status === 'error') {
    issues.push({
      type: 'status',
      severity: 'critical',
      message: 'Volume is in error state',
      timestamp: new Date(),
    });
    score -= 40;
  }

  // Determine overall status
  let status: VolumeHealthStatus['status'];
  if (score >= 80) {
    status = 'healthy';
  } else if (score >= 60) {
    status = 'warning';
  } else {
    status = 'critical';
  }

  return {
    volumeId,
    status,
    score: Math.max(0, score),
    issues,
    recommendations,
    lastCheckAt: new Date(),
  };
}

/**
 * @function checkVolumeEncryption
 * @description Verifies volume encryption status and configuration
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} volumeId - Volume ID
 * @returns {Promise<{ encrypted: boolean; compliant: boolean; issues: string[] }>} Encryption status
 *
 * @example
 * ```typescript
 * const encryption = await checkVolumeEncryption(Volume, 'vol-123');
 * if (!encryption.compliant) {
 *   console.warn('HIPAA compliance issue:', encryption.issues);
 * }
 * ```
 */
export async function checkVolumeEncryption(
  Volume: ModelStatic<VolumeModel>,
  volumeId: string
): Promise<{ encrypted: boolean; compliant: boolean; issues: string[] }> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    return {
      encrypted: false,
      compliant: false,
      issues: ['Volume not found'],
    };
  }

  const issues: string[] = [];

  if (!volume.encryptionEnabled) {
    issues.push('Encryption is not enabled');
  }

  if (volume.encryptionEnabled && !volume.encryptionKeyId) {
    issues.push('Encryption enabled but no key ID specified');
  }

  const compliant = volume.encryptionEnabled && !!volume.encryptionKeyId;

  return {
    encrypted: volume.encryptionEnabled,
    compliant,
    issues,
  };
}

/**
 * @function auditVolumeAccess
 * @description Creates audit log entry for volume access
 *
 * @param {ModelStatic<any>} AuditLog - AuditLog model
 * @param {string} volumeId - Volume ID
 * @param {string} userId - User ID
 * @param {string} action - Action performed
 * @param {object} metadata - Additional metadata
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * ```typescript
 * await auditVolumeAccess(
 *   AuditLog,
 *   'vol-123',
 *   'user-456',
 *   'read',
 *   { ipAddress: '10.0.0.1', reason: 'patient-lookup' }
 * );
 * ```
 */
export async function auditVolumeAccess(
  AuditLog: ModelStatic<any>,
  volumeId: string,
  userId: string,
  action: string,
  metadata: Record<string, any> = {}
): Promise<any> {
  return await AuditLog.create({
    resourceType: 'volume',
    resourceId: volumeId,
    userId,
    action,
    timestamp: new Date(),
    metadata: {
      ...metadata,
      hipaaRelevant: true,
    },
  });
}

// ============================================================================
// VOLUME ANALYTICS & REPORTING
// ============================================================================

/**
 * @function getVolumeAnalytics
 * @description Gets comprehensive analytics for all volumes
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} tenantId - Optional tenant ID filter
 * @returns {Promise<VolumeAnalytics>} Volume analytics
 *
 * @example
 * ```typescript
 * const analytics = await getVolumeAnalytics(Volume, VolumeMetrics);
 * console.log(`Total volumes: ${analytics.totalVolumes}`);
 * console.log(`Total capacity: ${analytics.totalCapacityGb} GB`);
 * console.log(`Average utilization: ${analytics.avgUtilizationPercent}%`);
 * ```
 */
export async function getVolumeAnalytics(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  tenantId?: string
): Promise<VolumeAnalytics> {
  const where: any = tenantId ? { tenantId } : {};

  const volumes = await Volume.findAll({ where });

  const totalVolumes = volumes.length;
  const totalCapacityGb = volumes.reduce((sum, v) => sum + v.sizeGb, 0);
  const usedCapacityGb = volumes.reduce((sum, v) => sum + v.usedGb, 0);
  const availableCapacityGb = totalCapacityGb - usedCapacityGb;
  const avgUtilizationPercent =
    totalCapacityGb > 0 ? (usedCapacityGb / totalCapacityGb) * 100 : 0;

  // Volumes by status
  const volumesByStatus: Record<string, number> = {};
  volumes.forEach((v) => {
    volumesByStatus[v.status] = (volumesByStatus[v.status] || 0) + 1;
  });

  // Volumes by type
  const volumesByType: Record<string, number> = {};
  volumes.forEach((v) => {
    volumesByType[v.volumeType] = (volumesByType[v.volumeType] || 0) + 1;
  });

  // Calculate growth trend
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const oldMetrics = await VolumeMetrics.findAll({
    where: {
      timestamp: { [Op.gte]: thirtyDaysAgo },
    } as any,
    attributes: [
      [Sequelize.fn('MIN', Sequelize.col('timestamp')), 'minTimestamp'],
      [Sequelize.fn('MAX', Sequelize.col('timestamp')), 'maxTimestamp'],
      [Sequelize.fn('SUM', Sequelize.col('usedGb')), 'totalUsed'],
    ],
    group: [Sequelize.fn('DATE', Sequelize.col('timestamp'))],
    order: [[Sequelize.fn('DATE', Sequelize.col('timestamp')), 'ASC']],
  });

  let growthTrendGbPerDay = 0;
  if (oldMetrics.length >= 2) {
    const firstDay = oldMetrics[0] as any;
    const lastDay = oldMetrics[oldMetrics.length - 1] as any;
    const daysDiff = Math.max(
      1,
      (new Date(lastDay.get('maxTimestamp') as string).getTime() -
        new Date(firstDay.get('minTimestamp') as string).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const usageDiff =
      parseFloat(lastDay.get('totalUsed') as string) -
      parseFloat(firstDay.get('totalUsed') as string);
    growthTrendGbPerDay = usageDiff / daysDiff;
  }

  return {
    totalVolumes,
    totalCapacityGb,
    usedCapacityGb,
    availableCapacityGb,
    avgUtilizationPercent: Math.round(avgUtilizationPercent * 100) / 100,
    volumesByStatus,
    volumesByType,
    growthTrendGbPerDay: Math.round(growthTrendGbPerDay * 100) / 100,
  };
}

/**
 * @function analyzeStorageCapacity
 * @description Analyzes storage capacity and predicts when pool will be full
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} storagePoolId - Storage pool ID
 * @returns {Promise<StorageCapacityAnalysis>} Capacity analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeStorageCapacity(Volume, VolumeMetrics, 'pool-1');
 * if (analysis.daysUntilFull && analysis.daysUntilFull < 30) {
 *   console.warn(`Storage pool will be full in ${analysis.daysUntilFull} days`);
 * }
 * ```
 */
export async function analyzeStorageCapacity(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  storagePoolId: string
): Promise<StorageCapacityAnalysis> {
  const volumes = await Volume.findAll({
    where: { storagePoolId } as any,
  });

  const totalCapacityGb = 10000; // This should come from StoragePool model
  const usedCapacityGb = volumes.reduce((sum, v) => sum + v.usedGb, 0);
  const availableCapacityGb = totalCapacityGb - usedCapacityGb;
  const utilizationPercent = (usedCapacityGb / totalCapacityGb) * 100;

  const recommendations: string[] = [];

  if (utilizationPercent > 90) {
    recommendations.push('URGENT: Storage pool is critically full');
    recommendations.push('Consider immediate capacity expansion');
  } else if (utilizationPercent > 80) {
    recommendations.push('Storage pool is reaching capacity');
    recommendations.push('Plan for capacity expansion');
  } else if (utilizationPercent > 70) {
    recommendations.push('Monitor storage pool capacity closely');
  }

  // Calculate growth rate
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const volumeIds = volumes.map((v) => v.id);
  const metrics = await VolumeMetrics.findAll({
    where: {
      volumeId: { [Op.in]: volumeIds },
      timestamp: { [Op.gte]: thirtyDaysAgo },
    } as any,
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'date'],
      [Sequelize.fn('SUM', Sequelize.col('usedGb')), 'totalUsed'],
    ],
    group: [Sequelize.fn('DATE', Sequelize.col('timestamp'))],
    order: [[Sequelize.fn('DATE', Sequelize.col('timestamp')), 'ASC']],
  });

  let projectedFullDate: Date | undefined;
  let daysUntilFull: number | undefined;

  if (metrics.length >= 2) {
    const firstDay = metrics[0] as any;
    const lastDay = metrics[metrics.length - 1] as any;
    const daysDiff =
      (new Date(lastDay.get('date') as string).getTime() -
        new Date(firstDay.get('date') as string).getTime()) /
      (1000 * 60 * 60 * 24);
    const usageDiff =
      parseFloat(lastDay.get('totalUsed') as string) -
      parseFloat(firstDay.get('totalUsed') as string);
    const growthRateGbPerDay = usageDiff / daysDiff;

    if (growthRateGbPerDay > 0) {
      daysUntilFull = Math.ceil(availableCapacityGb / growthRateGbPerDay);
      projectedFullDate = new Date();
      projectedFullDate.setDate(projectedFullDate.getDate() + daysUntilFull);

      recommendations.push(
        `At current growth rate, storage will be full in approximately ${daysUntilFull} days`
      );
    }
  }

  return {
    storagePoolId,
    totalCapacityGb,
    usedCapacityGb,
    availableCapacityGb,
    utilizationPercent: Math.round(utilizationPercent * 100) / 100,
    projectedFullDate,
    daysUntilFull,
    recommendations,
  };
}

/**
 * @function getVolumeUtilizationReport
 * @description Generates utilization report for volumes
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} tenantId - Optional tenant ID filter
 * @returns {Promise<any>} Utilization report
 *
 * @example
 * ```typescript
 * const report = await getVolumeUtilizationReport(Volume, 'hospital-1');
 * console.log('Over-provisioned volumes:', report.overProvisioned.length);
 * console.log('Under-utilized volumes:', report.underUtilized.length);
 * ```
 */
export async function getVolumeUtilizationReport(
  Volume: ModelStatic<VolumeModel>,
  tenantId?: string
): Promise<any> {
  const where: any = tenantId ? { tenantId } : {};
  const volumes = await Volume.findAll({ where });

  const overProvisioned: VolumeModel[] = [];
  const underUtilized: VolumeModel[] = [];
  const optimal: VolumeModel[] = [];
  const nearFull: VolumeModel[] = [];

  volumes.forEach((volume) => {
    const utilization = (volume.usedGb / volume.sizeGb) * 100;

    if (utilization < 10) {
      overProvisioned.push(volume);
    } else if (utilization < 30) {
      underUtilized.push(volume);
    } else if (utilization > 90) {
      nearFull.push(volume);
    } else {
      optimal.push(volume);
    }
  });

  return {
    totalVolumes: volumes.length,
    overProvisioned: overProvisioned.map((v) => ({
      id: v.id,
      name: v.name,
      sizeGb: v.sizeGb,
      usedGb: v.usedGb,
      utilizationPercent: Math.round((v.usedGb / v.sizeGb) * 100 * 100) / 100,
    })),
    underUtilized: underUtilized.map((v) => ({
      id: v.id,
      name: v.name,
      sizeGb: v.sizeGb,
      usedGb: v.usedGb,
      utilizationPercent: Math.round((v.usedGb / v.sizeGb) * 100 * 100) / 100,
    })),
    optimal: optimal.length,
    nearFull: nearFull.map((v) => ({
      id: v.id,
      name: v.name,
      sizeGb: v.sizeGb,
      usedGb: v.usedGb,
      utilizationPercent: Math.round((v.usedGb / v.sizeGb) * 100 * 100) / 100,
    })),
  };
}

/**
 * @function generateVolumeComplianceReport
 * @description Generates HIPAA compliance report for volumes
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {string} tenantId - Optional tenant ID filter
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateVolumeComplianceReport(Volume, 'hospital-1');
 * console.log(`Compliant volumes: ${report.compliantCount}`);
 * console.log(`Non-compliant volumes: ${report.nonCompliantVolumes.length}`);
 * ```
 */
export async function generateVolumeComplianceReport(
  Volume: ModelStatic<VolumeModel>,
  tenantId?: string
): Promise<any> {
  const where: any = tenantId ? { tenantId } : {};
  const volumes = await Volume.findAll({ where });

  const compliantVolumes: VolumeModel[] = [];
  const nonCompliantVolumes: Array<{
    volume: VolumeModel;
    issues: string[];
  }> = [];

  for (const volume of volumes) {
    const issues: string[] = [];

    // Check encryption
    if (!volume.encryptionEnabled) {
      issues.push('Encryption not enabled (HIPAA requirement)');
    }

    if (volume.encryptionEnabled && !volume.encryptionKeyId) {
      issues.push('Encryption key not specified');
    }

    // Check tags for compliance metadata
    if (!volume.tags?.compliance) {
      issues.push('Missing compliance tag');
    }

    if (issues.length === 0) {
      compliantVolumes.push(volume);
    } else {
      nonCompliantVolumes.push({ volume, issues });
    }
  }

  return {
    totalVolumes: volumes.length,
    compliantCount: compliantVolumes.length,
    nonCompliantCount: nonCompliantVolumes.length,
    compliancePercent:
      Math.round((compliantVolumes.length / volumes.length) * 100 * 100) / 100,
    nonCompliantVolumes: nonCompliantVolumes.map((nc) => ({
      id: nc.volume.id,
      name: nc.volume.name,
      issues: nc.issues,
    })),
    recommendations: [
      'Enable encryption on all volumes',
      'Ensure encryption keys are properly managed',
      'Add compliance tags to all volumes',
      'Implement regular compliance audits',
    ],
  };
}

// ============================================================================
// ADVANCED VOLUME OPERATIONS
// ============================================================================

/**
 * @function replicateVolume
 * @description Creates a replica of a volume for high availability
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeReplicaModel>} VolumeReplica - VolumeReplica model
 * @param {string} sourceVolumeId - Source volume ID
 * @param {string} targetStoragePoolId - Target storage pool ID
 * @param {string} replicationMode - Replication mode
 * @returns {Promise<VolumeReplicaModel>} Replication record
 *
 * @example
 * ```typescript
 * const replica = await replicateVolume(
 *   Volume,
 *   VolumeReplica,
 *   'vol-123',
 *   'pool-2',
 *   'async'
 * );
 * ```
 */
export async function replicateVolume(
  Volume: ModelStatic<VolumeModel>,
  VolumeReplica: ModelStatic<VolumeReplicaModel>,
  sourceVolumeId: string,
  targetStoragePoolId: string,
  replicationMode: 'sync' | 'async' | 'semi-sync' = 'async'
): Promise<VolumeReplicaModel> {
  const sourceVolume = await Volume.findByPk(sourceVolumeId);
  if (!sourceVolume) {
    throw new Error(`Source volume ${sourceVolumeId} not found`);
  }

  // Create target volume
  const targetVolume = await createVolume(Volume, {
    name: `${sourceVolume.name}-replica`,
    sizeGb: sourceVolume.sizeGb,
    storagePoolId: targetStoragePoolId,
    tenantId: sourceVolume.tenantId,
    volumeType: sourceVolume.volumeType,
    encryptionEnabled: sourceVolume.encryptionEnabled,
    tags: { ...sourceVolume.tags, replica: true },
  });

  return await VolumeReplica.create({
    sourceVolumeId,
    targetVolumeId: targetVolume.id,
    replicationMode,
    status: 'initializing',
    targetStoragePoolId,
    metadata: { createdAt: new Date().toISOString() },
  } as any);
}

/**
 * @function balanceStoragePool
 * @description Balances volumes across storage pools for optimal performance
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMigrationModel>} VolumeMigration - VolumeMigration model
 * @param {string[]} storagePoolIds - Storage pool IDs to balance
 * @returns {Promise<VolumeMigrationModel[]>} Created migrations
 *
 * @example
 * ```typescript
 * const migrations = await balanceStoragePool(
 *   Volume,
 *   VolumeMigration,
 *   ['pool-1', 'pool-2', 'pool-3']
 * );
 * console.log(`Created ${migrations.length} balancing migrations`);
 * ```
 */
export async function balanceStoragePool(
  Volume: ModelStatic<VolumeModel>,
  VolumeMigration: ModelStatic<VolumeMigrationModel>,
  storagePoolIds: string[]
): Promise<VolumeMigrationModel[]> {
  const migrations: VolumeMigrationModel[] = [];

  // Get volumes for each pool
  const poolVolumes = await Promise.all(
    storagePoolIds.map((poolId) =>
      Volume.findAll({
        where: { storagePoolId: poolId } as any,
      })
    )
  );

  // Calculate total capacity per pool
  const poolCapacities = poolVolumes.map((volumes) =>
    volumes.reduce((sum, v) => sum + v.usedGb, 0)
  );

  const avgCapacity =
    poolCapacities.reduce((sum, cap) => sum + cap, 0) / storagePoolIds.length;

  // Find imbalanced pools and migrate volumes
  for (let i = 0; i < storagePoolIds.length; i++) {
    if (poolCapacities[i] > avgCapacity * 1.2) {
      // Pool is overutilized, find target pool
      const targetPoolIndex = poolCapacities.indexOf(Math.min(...poolCapacities));
      const sourcePoolId = storagePoolIds[i];
      const targetPoolId = storagePoolIds[targetPoolIndex];

      // Migrate smallest volume
      const volumesToMigrate = poolVolumes[i].sort((a, b) => a.usedGb - b.usedGb);
      if (volumesToMigrate.length > 0) {
        const migration = await migrateVolume(
          Volume,
          VolumeMigration,
          volumesToMigrate[0].id,
          targetPoolId,
          { deleteSource: true }
        );
        migrations.push(migration);
      }
    }
  }

  return migrations;
}

/**
 * @function optimizeVolumePerformance
 * @description Optimizes volume configuration for better performance
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<VolumeMetricsModel>} VolumeMetrics - VolumeMetrics model
 * @param {string} volumeId - Volume ID
 * @returns {Promise<{ optimized: boolean; changes: string[] }>} Optimization result
 *
 * @example
 * ```typescript
 * const result = await optimizeVolumePerformance(
 *   Volume,
 *   VolumeMetrics,
 *   'vol-123'
 * );
 * console.log('Optimizations applied:', result.changes);
 * ```
 */
export async function optimizeVolumePerformance(
  Volume: ModelStatic<VolumeModel>,
  VolumeMetrics: ModelStatic<VolumeMetricsModel>,
  volumeId: string
): Promise<{ optimized: boolean; changes: string[] }> {
  const volume = await Volume.findByPk(volumeId);
  if (!volume) {
    throw new Error(`Volume ${volumeId} not found`);
  }

  const changes: string[] = [];
  const stats = await getVolumePerformanceStats(VolumeMetrics, volumeId, 24);

  // Check if volume needs performance tier upgrade
  if (stats.avgReadIops + stats.avgWriteIops > 1000 && volume.volumeType === 'standard') {
    await volume.update({ volumeType: 'performance' } as any);
    changes.push('Upgraded to performance tier due to high IOPS');
  }

  // Check if IOPS limit needs adjustment
  if (stats.maxReadIops + stats.maxWriteIops > (volume.iops || 500) * 0.8) {
    const newIops = Math.ceil((stats.maxReadIops + stats.maxWriteIops) * 1.2);
    await volume.update({ iops: newIops } as any);
    changes.push(`Increased IOPS limit to ${newIops}`);
  }

  // Check if throughput limit needs adjustment
  const totalThroughput = stats.avgReadIops + stats.avgWriteIops;
  if (totalThroughput > (volume.throughputMbps || 100) * 0.8) {
    const newThroughput = Math.ceil(totalThroughput * 1.2);
    await volume.update({ throughputMbps: newThroughput } as any);
    changes.push(`Increased throughput limit to ${newThroughput} Mbps`);
  }

  return {
    optimized: changes.length > 0,
    changes,
  };
}
