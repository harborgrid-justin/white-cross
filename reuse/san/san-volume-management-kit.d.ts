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
import { Model, ModelStatic, Transaction } from 'sequelize';
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
export declare function createVolume(Volume: ModelStatic<VolumeModel>, config: VolumeCreateConfig): Promise<VolumeModel>;
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
export declare function createVolumeFromTemplate(Volume: ModelStatic<VolumeModel>, templateName: string, volumeName: string, overrides?: Partial<VolumeCreateConfig>): Promise<VolumeModel>;
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
export declare function createVolumeWithSnapshot(Volume: ModelStatic<VolumeModel>, VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, config: VolumeCreateConfig, snapshotConfig: SnapshotConfig): Promise<{
    volume: VolumeModel;
    snapshot: VolumeSnapshotModel;
}>;
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
export declare function bulkCreateVolumes(Volume: ModelStatic<VolumeModel>, configs: VolumeCreateConfig[]): Promise<VolumeModel[]>;
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
export declare function provisionVolumeSet(Volume: ModelStatic<VolumeModel>, environmentName: string, storagePoolId: string, tenantId?: string, transaction?: Transaction): Promise<VolumeModel[]>;
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
export declare function deleteVolume(Volume: ModelStatic<VolumeModel>, volumeId: string, forceDelete?: boolean, transaction?: Transaction): Promise<void>;
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
export declare function softDeleteVolume(Volume: ModelStatic<VolumeModel>, volumeId: string, transaction?: Transaction): Promise<VolumeModel>;
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
export declare function cascadeDeleteVolume(Volume: ModelStatic<VolumeModel>, VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, VolumeReplica: ModelStatic<VolumeReplicaModel>, volumeId: string, transaction?: Transaction): Promise<void>;
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
export declare function purgeDeletedVolumes(Volume: ModelStatic<VolumeModel>, retentionDays?: number, transaction?: Transaction): Promise<number>;
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
export declare function resizeVolume(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, newSizeGb: number, config?: Partial<VolumeResizeConfig>): Promise<VolumeModel>;
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
export declare function autoExpandVolume(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, thresholdPercent?: number, expansionPercent?: number): Promise<VolumeModel | null>;
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
export declare function shrinkVolume(Volume: ModelStatic<VolumeModel>, volumeId: string, newSizeGb: number, transaction?: Transaction): Promise<VolumeModel>;
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
export declare function getVolumeResizeHistory(VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, limit?: number): Promise<VolumeMetricsModel[]>;
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
export declare function cloneVolume(Volume: ModelStatic<VolumeModel>, sourceVolumeId: string, config: VolumeCloneConfig): Promise<VolumeModel>;
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
export declare function cloneVolumeFromSnapshot(Volume: ModelStatic<VolumeModel>, VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, snapshotId: string, config: VolumeCloneConfig): Promise<VolumeModel>;
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
export declare function cloneVolumeWithSnapshots(Volume: ModelStatic<VolumeModel>, VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, sourceVolumeId: string, config: VolumeCloneConfig): Promise<{
    volume: VolumeModel;
    snapshots: VolumeSnapshotModel[];
}>;
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
export declare function createVolumeCloneSet(Volume: ModelStatic<VolumeModel>, sourceVolumeId: string, count: number, namePrefix: string): Promise<VolumeModel[]>;
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
export declare function createSnapshot(VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, volumeId: string, config?: SnapshotConfig): Promise<VolumeSnapshotModel>;
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
export declare function deleteSnapshot(VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, snapshotId: string, transaction?: Transaction): Promise<void>;
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
export declare function restoreVolumeFromSnapshot(Volume: ModelStatic<VolumeModel>, VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, volumeId: string, snapshotId: string, transaction?: Transaction): Promise<VolumeModel>;
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
export declare function getVolumeSnapshots(VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, volumeId: string, includeExpired?: boolean): Promise<VolumeSnapshotModel[]>;
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
export declare function cleanupExpiredSnapshots(VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, transaction?: Transaction): Promise<number>;
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
export declare function createSnapshotChain(VolumeSnapshot: ModelStatic<VolumeSnapshotModel>, volumeId: string, count: number, namePrefix: string): Promise<VolumeSnapshotModel[]>;
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
export declare function migrateVolume(Volume: ModelStatic<VolumeModel>, VolumeMigration: ModelStatic<VolumeMigrationModel>, volumeId: string, targetStoragePoolId: string, config?: Partial<MigrationConfig>): Promise<VolumeMigrationModel>;
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
export declare function getMigrationStatus(VolumeMigration: ModelStatic<VolumeMigrationModel>, migrationId: string): Promise<VolumeMigrationModel>;
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
export declare function cancelMigration(Volume: ModelStatic<VolumeModel>, VolumeMigration: ModelStatic<VolumeMigrationModel>, migrationId: string, transaction?: Transaction): Promise<void>;
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
export declare function getActiveMigrations(VolumeMigration: ModelStatic<VolumeMigrationModel>, tenantId?: string): Promise<VolumeMigrationModel[]>;
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
export declare function batchMigrateVolumes(Volume: ModelStatic<VolumeModel>, VolumeMigration: ModelStatic<VolumeMigrationModel>, volumeIds: string[], targetStoragePoolId: string, config?: Partial<MigrationConfig>): Promise<VolumeMigrationModel[]>;
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
export declare function recordVolumeMetrics(VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, metrics: Partial<VolumeMetricsModel>): Promise<VolumeMetricsModel>;
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
export declare function getVolumeMetrics(VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, startDate: Date, endDate: Date): Promise<VolumeMetricsModel[]>;
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
export declare function getVolumePerformanceStats(VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, hours?: number): Promise<any>;
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
export declare function monitorVolumeCapacity(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, warningThreshold?: number, criticalThreshold?: number): Promise<{
    status: string;
    message: string;
    currentUtilization: number;
}>;
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
export declare function getVolumeIOPSTrend(VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string, days?: number): Promise<Array<{
    date: Date;
    avgIops: number;
}>>;
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
export declare function cleanupOldMetrics(VolumeMetrics: ModelStatic<VolumeMetricsModel>, retentionDays?: number, transaction?: Transaction): Promise<number>;
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
export declare function validateVolumeIntegrity(Volume: ModelStatic<VolumeModel>, volumeId: string): Promise<{
    valid: boolean;
    issues: string[];
}>;
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
export declare function getVolumeHealthStatus(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string): Promise<VolumeHealthStatus>;
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
export declare function checkVolumeEncryption(Volume: ModelStatic<VolumeModel>, volumeId: string): Promise<{
    encrypted: boolean;
    compliant: boolean;
    issues: string[];
}>;
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
export declare function auditVolumeAccess(AuditLog: ModelStatic<any>, volumeId: string, userId: string, action: string, metadata?: Record<string, any>): Promise<any>;
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
export declare function getVolumeAnalytics(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, tenantId?: string): Promise<VolumeAnalytics>;
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
export declare function analyzeStorageCapacity(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, storagePoolId: string): Promise<StorageCapacityAnalysis>;
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
export declare function getVolumeUtilizationReport(Volume: ModelStatic<VolumeModel>, tenantId?: string): Promise<any>;
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
export declare function generateVolumeComplianceReport(Volume: ModelStatic<VolumeModel>, tenantId?: string): Promise<any>;
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
export declare function replicateVolume(Volume: ModelStatic<VolumeModel>, VolumeReplica: ModelStatic<VolumeReplicaModel>, sourceVolumeId: string, targetStoragePoolId: string, replicationMode?: 'sync' | 'async' | 'semi-sync'): Promise<VolumeReplicaModel>;
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
export declare function balanceStoragePool(Volume: ModelStatic<VolumeModel>, VolumeMigration: ModelStatic<VolumeMigrationModel>, storagePoolIds: string[]): Promise<VolumeMigrationModel[]>;
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
export declare function optimizeVolumePerformance(Volume: ModelStatic<VolumeModel>, VolumeMetrics: ModelStatic<VolumeMetricsModel>, volumeId: string): Promise<{
    optimized: boolean;
    changes: string[];
}>;
//# sourceMappingURL=san-volume-management-kit.d.ts.map