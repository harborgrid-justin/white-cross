/**
 * LOC: SAN_DB_KIT_001
 * File: /reuse/san/san-database-schema-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM core)
 *   - sequelize-typescript (decorators)
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - SAN management modules
 *   - Storage infrastructure services
 *   - Database migration files
 *   - SAN monitoring systems
 */

/**
 * File: /reuse/san/san-database-schema-kit.ts
 * Locator: WC-SAN-DBK-001
 * Purpose: SAN Database Schema Kit - Comprehensive database operations for Storage Area Network management
 *
 * Upstream: Sequelize 6.x, Sequelize-TypeScript, NestJS, PostgreSQL
 * Downstream: SAN management services, storage infrastructure, monitoring systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 36 utility functions for SAN schema operations, migrations, seeding, validation, indexing
 *
 * LLM Context: Comprehensive SAN (Storage Area Network) database schema utilities for enterprise storage management.
 * Provides Sequelize model definitions for SAN volumes, LUNs, snapshots, and replication configurations.
 * Includes migration helpers, type-safe schema operations, validation utilities, and performance-optimized indexing
 * strategies. Designed for high-performance storage infrastructure with audit trails, temporal tracking, and
 * comprehensive data integrity constraints. Essential for managing enterprise storage operations with compliance
 * requirements and zero tolerance for data loss.
 */

import {
  Model,
  Column,
  Table,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  Unique,
  BeforeCreate,
  BeforeUpdate,
  AfterCreate,
  AfterUpdate,
  Scopes,
} from 'sequelize-typescript';
import {
  QueryInterface,
  DataTypes,
  Transaction,
  Sequelize,
  Op,
  literal,
  fn,
  col,
  Optional,
  IndexesOptions,
} from 'sequelize';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Volume status enumeration
 */
export enum VolumeStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
}

/**
 * LUN status enumeration
 */
export enum LunStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  FAILED = 'FAILED',
  INITIALIZING = 'INITIALIZING',
}

/**
 * Snapshot status enumeration
 */
export enum SnapshotStatus {
  CREATING = 'CREATING',
  AVAILABLE = 'AVAILABLE',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  RESTORING = 'RESTORING',
}

/**
 * Replication status enumeration
 */
export enum ReplicationStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  SYNCING = 'SYNCING',
  ERROR = 'ERROR',
  STOPPED = 'STOPPED',
}

/**
 * Storage protocol enumeration
 */
export enum StorageProtocol {
  ISCSI = 'ISCSI',
  FC = 'FC',
  FCOE = 'FCOE',
  NFS = 'NFS',
  SMB = 'SMB',
}

/**
 * Replication type enumeration
 */
export enum ReplicationType {
  SYNCHRONOUS = 'SYNCHRONOUS',
  ASYNCHRONOUS = 'ASYNCHRONOUS',
  SNAPSHOT = 'SNAPSHOT',
}

/**
 * SAN Volume attributes
 */
export interface SanVolumeAttributes {
  id: string;
  name: string;
  description?: string;
  capacityGb: number;
  usedCapacityGb: number;
  status: VolumeStatus;
  storagePoolId?: string;
  protocol: StorageProtocol;
  wwn?: string; // World Wide Name
  serialNumber?: string;
  thinProvisioned: boolean;
  compressionEnabled: boolean;
  deduplicationEnabled: boolean;
  encryptionEnabled: boolean;
  iopsLimit?: number;
  throughputMbps?: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SanVolumeCreationAttributes
  extends Optional<
    SanVolumeAttributes,
    | 'id'
    | 'description'
    | 'usedCapacityGb'
    | 'storagePoolId'
    | 'wwn'
    | 'serialNumber'
    | 'thinProvisioned'
    | 'compressionEnabled'
    | 'deduplicationEnabled'
    | 'encryptionEnabled'
    | 'iopsLimit'
    | 'throughputMbps'
    | 'tags'
    | 'metadata'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

/**
 * SAN LUN attributes
 */
export interface SanLunAttributes {
  id: string;
  lunNumber: number;
  name: string;
  description?: string;
  volumeId: string;
  capacityGb: number;
  status: LunStatus;
  targetId?: string;
  initiatorGroup?: string;
  maskedTo?: string[];
  readOnly: boolean;
  blockSizeBytes: number;
  multipath: boolean;
  alua: boolean; // Asymmetric Logical Unit Access
  iopsRead?: number;
  iopsWrite?: number;
  latencyMs?: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SanLunCreationAttributes
  extends Optional<
    SanLunAttributes,
    | 'id'
    | 'description'
    | 'targetId'
    | 'initiatorGroup'
    | 'maskedTo'
    | 'readOnly'
    | 'blockSizeBytes'
    | 'multipath'
    | 'alua'
    | 'iopsRead'
    | 'iopsWrite'
    | 'latencyMs'
    | 'tags'
    | 'metadata'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

/**
 * SAN Snapshot attributes
 */
export interface SanSnapshotAttributes {
  id: string;
  name: string;
  description?: string;
  volumeId?: string;
  lunId?: string;
  status: SnapshotStatus;
  sizeGb: number;
  retentionDays?: number;
  expiresAt?: Date;
  isAutomatic: boolean;
  scheduleId?: string;
  consistencyGroupId?: string;
  sourceSnapshotId?: string; // For clones
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SanSnapshotCreationAttributes
  extends Optional<
    SanSnapshotAttributes,
    | 'id'
    | 'description'
    | 'volumeId'
    | 'lunId'
    | 'retentionDays'
    | 'expiresAt'
    | 'isAutomatic'
    | 'scheduleId'
    | 'consistencyGroupId'
    | 'sourceSnapshotId'
    | 'tags'
    | 'metadata'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

/**
 * SAN Replication attributes
 */
export interface SanReplicationAttributes {
  id: string;
  name: string;
  description?: string;
  sourceVolumeId: string;
  targetVolumeId: string;
  replicationType: ReplicationType;
  status: ReplicationStatus;
  direction: 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' | 'BIDIRECTIONAL';
  priority: number;
  rpoMinutes?: number; // Recovery Point Objective
  rtoMinutes?: number; // Recovery Time Objective
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  syncIntervalMinutes?: number;
  bandwidthLimitMbps?: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  errorCount: number;
  lastError?: string;
  totalBytesSynced?: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SanReplicationCreationAttributes
  extends Optional<
    SanReplicationAttributes,
    | 'id'
    | 'description'
    | 'priority'
    | 'rpoMinutes'
    | 'rtoMinutes'
    | 'lastSyncAt'
    | 'nextSyncAt'
    | 'syncIntervalMinutes'
    | 'bandwidthLimitMbps'
    | 'compressionEnabled'
    | 'encryptionEnabled'
    | 'errorCount'
    | 'lastError'
    | 'totalBytesSynced'
    | 'tags'
    | 'metadata'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * SanVolume Model
 * Represents a storage volume in the SAN infrastructure
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
      status: { [Op.ne]: VolumeStatus.DELETING },
    },
  },
  available: {
    where: {
      status: VolumeStatus.AVAILABLE,
      deletedAt: null,
    },
  },
  inUse: {
    where: {
      status: VolumeStatus.IN_USE,
      deletedAt: null,
    },
  },
  withCapacityAbove: (minGb: number) => ({
    where: {
      capacityGb: { [Op.gte]: minGb },
    },
  }),
  thinProvisioned: {
    where: {
      thinProvisioned: true,
    },
  },
}))
@Table({
  tableName: 'san_volumes',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_san_volumes_status',
      fields: ['status'],
    },
    {
      name: 'idx_san_volumes_wwn',
      fields: ['wwn'],
      unique: true,
      where: { wwn: { [Op.ne]: null } },
    },
    {
      name: 'idx_san_volumes_pool_status',
      fields: ['storage_pool_id', 'status'],
    },
    {
      name: 'idx_san_volumes_created_at',
      fields: ['created_at'],
    },
  ],
})
export class SanVolume extends Model<SanVolumeAttributes, SanVolumeCreationAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  capacityGb!: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  usedCapacityGb!: number;

  @AllowNull(false)
  @Default(VolumeStatus.CREATING)
  @Column(DataType.ENUM(...Object.values(VolumeStatus)))
  status!: VolumeStatus;

  @Column(DataType.UUID)
  storagePoolId?: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageProtocol)))
  protocol!: StorageProtocol;

  @Unique
  @Column(DataType.STRING(32))
  wwn?: string;

  @Column(DataType.STRING(64))
  serialNumber?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  thinProvisioned!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  compressionEnabled!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deduplicationEnabled!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  encryptionEnabled!: boolean;

  @Column(DataType.INTEGER)
  iopsLimit?: number;

  @Column(DataType.INTEGER)
  throughputMbps?: number;

  @Column(DataType.JSONB)
  tags?: Record<string, string>;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  deletedAt?: Date;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @HasMany(() => SanLun)
  luns?: SanLun[];

  @HasMany(() => SanSnapshot)
  snapshots?: SanSnapshot[];

  @HasMany(() => SanReplication, 'sourceVolumeId')
  sourceReplications?: SanReplication[];

  @HasMany(() => SanReplication, 'targetVolumeId')
  targetReplications?: SanReplication[];

  // Hooks
  @BeforeCreate
  static async generateWwn(instance: SanVolume) {
    if (!instance.wwn && instance.protocol === StorageProtocol.FC) {
      instance.wwn = `50:${Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, '0')
      ).join(':')}`;
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validateCapacity(instance: SanVolume) {
    if (instance.usedCapacityGb > instance.capacityGb) {
      throw new Error('Used capacity cannot exceed total capacity');
    }
  }

  // Virtual attributes
  get availableCapacityGb(): number {
    return Number(this.capacityGb) - Number(this.usedCapacityGb);
  }

  get utilizationPercent(): number {
    return (Number(this.usedCapacityGb) / Number(this.capacityGb)) * 100;
  }
}

/**
 * SanLun Model
 * Represents a Logical Unit Number (LUN) in the SAN
 */
@Scopes(() => ({
  online: {
    where: {
      status: LunStatus.ONLINE,
      deletedAt: null,
    },
  },
  byVolume: (volumeId: string) => ({
    where: {
      volumeId,
    },
  }),
  readOnly: {
    where: {
      readOnly: true,
    },
  },
  readWrite: {
    where: {
      readOnly: false,
    },
  },
}))
@Table({
  tableName: 'san_luns',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_san_luns_volume_id',
      fields: ['volume_id'],
    },
    {
      name: 'idx_san_luns_status',
      fields: ['status'],
    },
    {
      name: 'idx_san_luns_volume_lun_number',
      fields: ['volume_id', 'lun_number'],
      unique: true,
    },
    {
      name: 'idx_san_luns_created_at',
      fields: ['created_at'],
    },
  ],
})
export class SanLun extends Model<SanLunAttributes, SanLunCreationAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  lunNumber!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => SanVolume)
  @AllowNull(false)
  @Column(DataType.UUID)
  volumeId!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  capacityGb!: number;

  @AllowNull(false)
  @Default(LunStatus.INITIALIZING)
  @Column(DataType.ENUM(...Object.values(LunStatus)))
  status!: LunStatus;

  @Column(DataType.STRING(64))
  targetId?: string;

  @Column(DataType.STRING(255))
  initiatorGroup?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  maskedTo?: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  readOnly!: boolean;

  @Default(512)
  @Column(DataType.INTEGER)
  blockSizeBytes!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  multipath!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  alua!: boolean;

  @Column(DataType.INTEGER)
  iopsRead?: number;

  @Column(DataType.INTEGER)
  iopsWrite?: number;

  @Column(DataType.DECIMAL(10, 4))
  latencyMs?: number;

  @Column(DataType.JSONB)
  tags?: Record<string, string>;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  deletedAt?: Date;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @BelongsTo(() => SanVolume)
  volume?: SanVolume;

  @HasMany(() => SanSnapshot)
  snapshots?: SanSnapshot[];

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static validateLunNumber(instance: SanLun) {
    if (instance.lunNumber < 0 || instance.lunNumber > 255) {
      throw new Error('LUN number must be between 0 and 255');
    }
  }

  // Virtual attributes
  get totalIops(): number {
    return (this.iopsRead || 0) + (this.iopsWrite || 0);
  }
}

/**
 * SanSnapshot Model
 * Represents a point-in-time snapshot of a volume or LUN
 */
@Scopes(() => ({
  available: {
    where: {
      status: SnapshotStatus.AVAILABLE,
      deletedAt: null,
    },
  },
  byVolume: (volumeId: string) => ({
    where: {
      volumeId,
    },
  },
  byLun: (lunId: string) => ({
    where: {
      lunId,
    },
  },
  automatic: {
    where: {
      isAutomatic: true,
    },
  },
  manual: {
    where: {
      isAutomatic: false,
    },
  },
  notExpired: {
    where: {
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
    },
  },
}))
@Table({
  tableName: 'san_snapshots',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_san_snapshots_volume_id_created_at',
      fields: ['volume_id', 'created_at'],
    },
    {
      name: 'idx_san_snapshots_lun_id_created_at',
      fields: ['lun_id', 'created_at'],
    },
    {
      name: 'idx_san_snapshots_status',
      fields: ['status'],
    },
    {
      name: 'idx_san_snapshots_expires_at',
      fields: ['expires_at'],
      where: { expires_at: { [Op.ne]: null } },
    },
    {
      name: 'idx_san_snapshots_schedule_id',
      fields: ['schedule_id'],
    },
  ],
})
export class SanSnapshot extends Model<SanSnapshotAttributes, SanSnapshotCreationAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => SanVolume)
  @Column(DataType.UUID)
  volumeId?: string;

  @ForeignKey(() => SanLun)
  @Column(DataType.UUID)
  lunId?: string;

  @AllowNull(false)
  @Default(SnapshotStatus.CREATING)
  @Column(DataType.ENUM(...Object.values(SnapshotStatus)))
  status!: SnapshotStatus;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  sizeGb!: number;

  @Column(DataType.INTEGER)
  retentionDays?: number;

  @Column(DataType.DATE)
  expiresAt?: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAutomatic!: boolean;

  @Column(DataType.UUID)
  scheduleId?: string;

  @Column(DataType.UUID)
  consistencyGroupId?: string;

  @Column(DataType.UUID)
  sourceSnapshotId?: string;

  @Column(DataType.JSONB)
  tags?: Record<string, string>;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  deletedAt?: Date;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @BelongsTo(() => SanVolume)
  volume?: SanVolume;

  @BelongsTo(() => SanLun)
  lun?: SanLun;

  // Hooks
  @BeforeCreate
  static setExpirationDate(instance: SanSnapshot) {
    if (instance.retentionDays && !instance.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + instance.retentionDays);
      instance.expiresAt = expiresAt;
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validateVolumeOrLun(instance: SanSnapshot) {
    if (!instance.volumeId && !instance.lunId) {
      throw new Error('Snapshot must be associated with either a volume or LUN');
    }
    if (instance.volumeId && instance.lunId) {
      throw new Error('Snapshot cannot be associated with both volume and LUN');
    }
  }

  // Virtual attributes
  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  get daysUntilExpiration(): number | null {
    if (!this.expiresAt) return null;
    const diffMs = this.expiresAt.getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}

/**
 * SanReplication Model
 * Represents replication configuration between volumes
 */
@Scopes(() => ({
  active: {
    where: {
      status: ReplicationStatus.ACTIVE,
      deletedAt: null,
    },
  },
  bySourceVolume: (volumeId: string) => ({
    where: {
      sourceVolumeId: volumeId,
    },
  }),
  byTargetVolume: (volumeId: string) => ({
    where: {
      targetVolumeId: volumeId,
    },
  }),
  synchronous: {
    where: {
      replicationType: ReplicationType.SYNCHRONOUS,
    },
  },
  asynchronous: {
    where: {
      replicationType: ReplicationType.ASYNCHRONOUS,
    },
  },
  withErrors: {
    where: {
      errorCount: { [Op.gt]: 0 },
    },
  },
}))
@Table({
  tableName: 'san_replications',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_san_replications_source_volume_id',
      fields: ['source_volume_id'],
    },
    {
      name: 'idx_san_replications_target_volume_id',
      fields: ['target_volume_id'],
    },
    {
      name: 'idx_san_replications_status_last_sync',
      fields: ['status', 'last_sync_at'],
    },
    {
      name: 'idx_san_replications_next_sync_at',
      fields: ['next_sync_at'],
      where: { next_sync_at: { [Op.ne]: null } },
    },
  ],
})
export class SanReplication extends Model<
  SanReplicationAttributes,
  SanReplicationCreationAttributes
> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => SanVolume)
  @AllowNull(false)
  @Column(DataType.UUID)
  sourceVolumeId!: string;

  @ForeignKey(() => SanVolume)
  @AllowNull(false)
  @Column(DataType.UUID)
  targetVolumeId!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ReplicationType)))
  replicationType!: ReplicationType;

  @AllowNull(false)
  @Default(ReplicationStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(ReplicationStatus)))
  status!: ReplicationStatus;

  @AllowNull(false)
  @Default('SOURCE_TO_TARGET')
  @Column(DataType.ENUM('SOURCE_TO_TARGET', 'TARGET_TO_SOURCE', 'BIDIRECTIONAL'))
  direction!: 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' | 'BIDIRECTIONAL';

  @Default(5)
  @Column(DataType.INTEGER)
  priority!: number;

  @Column(DataType.INTEGER)
  rpoMinutes?: number;

  @Column(DataType.INTEGER)
  rtoMinutes?: number;

  @Column(DataType.DATE)
  lastSyncAt?: Date;

  @Column(DataType.DATE)
  nextSyncAt?: Date;

  @Column(DataType.INTEGER)
  syncIntervalMinutes?: number;

  @Column(DataType.INTEGER)
  bandwidthLimitMbps?: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  compressionEnabled!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  encryptionEnabled!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  errorCount!: number;

  @Column(DataType.TEXT)
  lastError?: string;

  @Default(0)
  @Column(DataType.BIGINT)
  totalBytesSynced?: number;

  @Column(DataType.JSONB)
  tags?: Record<string, string>;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  deletedAt?: Date;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @BelongsTo(() => SanVolume, 'sourceVolumeId')
  sourceVolume?: SanVolume;

  @BelongsTo(() => SanVolume, 'targetVolumeId')
  targetVolume?: SanVolume;

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static validateVolumes(instance: SanReplication) {
    if (instance.sourceVolumeId === instance.targetVolumeId) {
      throw new Error('Source and target volumes cannot be the same');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static calculateNextSync(instance: SanReplication) {
    if (
      instance.syncIntervalMinutes &&
      instance.replicationType === ReplicationType.ASYNCHRONOUS
    ) {
      const nextSync = new Date();
      nextSync.setMinutes(nextSync.getMinutes() + instance.syncIntervalMinutes);
      instance.nextSyncAt = nextSync;
    }
  }

  // Virtual attributes
  get totalGbSynced(): number {
    return Number(this.totalBytesSynced || 0) / (1024 * 1024 * 1024);
  }

  get isHealthy(): boolean {
    return this.status === ReplicationStatus.ACTIVE && this.errorCount === 0;
  }

  get syncLag(): number | null {
    if (!this.lastSyncAt) return null;
    return Math.floor((Date.now() - this.lastSyncAt.getTime()) / (1000 * 60));
  }
}

// ============================================================================
// MIGRATION HELPER FUNCTIONS
// ============================================================================

/**
 * Function 1: Create SanVolume table
 */
export async function createSanVolumeTable(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.createTable(
    'san_volumes',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: literal('gen_random_uuid()'),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      capacity_gb: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      used_capacity_gb: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(VolumeStatus)),
        allowNull: false,
        defaultValue: VolumeStatus.CREATING,
      },
      storage_pool_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      protocol: {
        type: DataTypes.ENUM(...Object.values(StorageProtocol)),
        allowNull: false,
      },
      wwn: {
        type: DataTypes.STRING(32),
        allowNull: true,
        unique: true,
      },
      serial_number: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      thin_provisioned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      compression_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deduplication_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      encryption_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      iops_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      throughput_mbps: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { transaction }
  );
}

/**
 * Function 2: Create SanLun table
 */
export async function createSanLunTable(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.createTable(
    'san_luns',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: literal('gen_random_uuid()'),
      },
      lun_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      volume_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'san_volumes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      capacity_gb: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(LunStatus)),
        allowNull: false,
        defaultValue: LunStatus.INITIALIZING,
      },
      target_id: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      initiator_group: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      masked_to: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      read_only: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      block_size_bytes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 512,
      },
      multipath: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      alua: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      iops_read: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      iops_write: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      latency_ms: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { transaction }
  );
}

/**
 * Function 3: Create SanSnapshot table
 */
export async function createSanSnapshotTable(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.createTable(
    'san_snapshots',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: literal('gen_random_uuid()'),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      volume_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'san_volumes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lun_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'san_luns',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(SnapshotStatus)),
        allowNull: false,
        defaultValue: SnapshotStatus.CREATING,
      },
      size_gb: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      retention_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_automatic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      schedule_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      consistency_group_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      source_snapshot_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { transaction }
  );
}

/**
 * Function 4: Create SanReplication table
 */
export async function createSanReplicationTable(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.createTable(
    'san_replications',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: literal('gen_random_uuid()'),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      source_volume_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'san_volumes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      target_volume_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'san_volumes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      replication_type: {
        type: DataTypes.ENUM(...Object.values(ReplicationType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ReplicationStatus)),
        allowNull: false,
        defaultValue: ReplicationStatus.ACTIVE,
      },
      direction: {
        type: DataTypes.ENUM('SOURCE_TO_TARGET', 'TARGET_TO_SOURCE', 'BIDIRECTIONAL'),
        allowNull: false,
        defaultValue: 'SOURCE_TO_TARGET',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      rpo_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rto_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_sync_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      next_sync_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sync_interval_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bandwidth_limit_mbps: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      compression_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      encryption_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      error_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_bytes_synced: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { transaction }
  );
}

/**
 * Function 5: Add column to SAN table
 */
export async function addColumnToSanTable(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  columnDefinition: any,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.addColumn(tableName, columnName, columnDefinition, { transaction });
}

/**
 * Function 6: Modify column in SAN table
 */
export async function modifyColumnInSanTable(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  columnDefinition: any,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.changeColumn(tableName, columnName, columnDefinition, { transaction });
}

/**
 * Function 7: Drop column from SAN table
 */
export async function dropColumnFromSanTable(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.removeColumn(tableName, columnName, { transaction });
}

/**
 * Function 8: Create index on SAN table
 */
export async function createIndexOnSanTable(
  queryInterface: QueryInterface,
  tableName: string,
  indexDefinition: IndexesOptions,
  transaction?: Transaction
): Promise<void> {
  await queryInterface.addIndex(tableName, indexDefinition.fields as string[], {
    ...indexDefinition,
    transaction,
  });
}

// ============================================================================
// SCHEMA OPERATION FUNCTIONS
// ============================================================================

/**
 * Function 9: Initialize complete SAN schema
 */
export async function initializeSanSchema(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  await createSanVolumeTable(queryInterface, transaction);
  await createSanLunTable(queryInterface, transaction);
  await createSanSnapshotTable(queryInterface, transaction);
  await createSanReplicationTable(queryInterface, transaction);

  // Create all indexes
  await createSanVolumeIndexes(queryInterface, transaction);
  await createSanLunIndexes(queryInterface, transaction);
  await createSanSnapshotIndexes(queryInterface, transaction);
  await createSanReplicationIndexes(queryInterface, transaction);
}

/**
 * Function 10: Validate SAN schema structure
 */
export async function validateSanSchema(
  queryInterface: QueryInterface
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  const requiredTables = ['san_volumes', 'san_luns', 'san_snapshots', 'san_replications'];

  try {
    const tables = await queryInterface.showAllTables();

    for (const table of requiredTables) {
      if (!tables.includes(table)) {
        errors.push(`Missing required table: ${table}`);
      }
    }

    // Validate foreign key constraints
    for (const table of tables.filter((t) => requiredTables.includes(t))) {
      const tableDescription = await queryInterface.describeTable(table);

      if (table === 'san_luns') {
        if (!tableDescription.volume_id) {
          errors.push('san_luns missing volume_id foreign key');
        }
      }

      if (table === 'san_snapshots') {
        if (!tableDescription.volume_id && !tableDescription.lun_id) {
          errors.push('san_snapshots missing volume_id or lun_id foreign keys');
        }
      }

      if (table === 'san_replications') {
        if (!tableDescription.source_volume_id || !tableDescription.target_volume_id) {
          errors.push('san_replications missing volume foreign keys');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(`Schema validation error: ${error.message}`);
    return { valid: false, errors };
  }
}

/**
 * Function 11: Migrate SAN schema to new version
 */
export async function migrateSanSchema(
  queryInterface: QueryInterface,
  fromVersion: string,
  toVersion: string,
  transaction?: Transaction
): Promise<void> {
  // Version-specific migrations
  if (fromVersion === '1.0' && toVersion === '2.0') {
    // Example migration: Add performance metrics columns
    await addColumnToSanTable(
      queryInterface,
      'san_volumes',
      'performance_tier',
      {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      transaction
    );
  }

  // Add more version migrations as needed
}

/**
 * Function 12: Rollback SAN schema to previous version
 */
export async function rollbackSanSchema(
  queryInterface: QueryInterface,
  toVersion: string,
  transaction?: Transaction
): Promise<void> {
  if (toVersion === '1.0') {
    // Rollback from v2.0 to v1.0
    await dropColumnFromSanTable(queryInterface, 'san_volumes', 'performance_tier', transaction);
  }
}

/**
 * Function 13: Get SAN schema version
 */
export async function getSanSchemaVersion(sequelize: Sequelize): Promise<string> {
  try {
    const [results] = await sequelize.query(
      `SELECT version FROM schema_versions WHERE schema_name = 'san' ORDER BY applied_at DESC LIMIT 1`
    );
    return results.length > 0 ? (results[0] as any).version : '1.0';
  } catch (error) {
    return '1.0';
  }
}

/**
 * Function 14: Compare two SAN schemas
 */
export async function compareSanSchemas(
  queryInterface1: QueryInterface,
  queryInterface2: QueryInterface
): Promise<{ differences: string[]; identical: boolean }> {
  const differences: string[] = [];
  const tables = ['san_volumes', 'san_luns', 'san_snapshots', 'san_replications'];

  for (const table of tables) {
    try {
      const desc1 = await queryInterface1.describeTable(table);
      const desc2 = await queryInterface2.describeTable(table);

      const columns1 = Object.keys(desc1);
      const columns2 = Object.keys(desc2);

      const missingInSchema2 = columns1.filter((c) => !columns2.includes(c));
      const missingInSchema1 = columns2.filter((c) => !columns1.includes(c));

      if (missingInSchema2.length > 0) {
        differences.push(`Table ${table}: Columns missing in schema 2: ${missingInSchema2.join(', ')}`);
      }

      if (missingInSchema1.length > 0) {
        differences.push(`Table ${table}: Columns missing in schema 1: ${missingInSchema1.join(', ')}`);
      }
    } catch (error) {
      differences.push(`Error comparing table ${table}: ${error.message}`);
    }
  }

  return {
    differences,
    identical: differences.length === 0,
  };
}

// ============================================================================
// SEEDING & VALIDATION FUNCTIONS
// ============================================================================

/**
 * Function 15: Seed SAN volumes
 */
export async function seedSanVolumes(
  sequelize: Sequelize,
  count: number = 10
): Promise<SanVolume[]> {
  const volumes: SanVolume[] = [];

  for (let i = 0; i < count; i++) {
    const volume = await SanVolume.create({
      name: `volume-${i + 1}`,
      description: `Test SAN volume ${i + 1}`,
      capacityGb: 100 + i * 50,
      usedCapacityGb: 10 + i * 5,
      status: VolumeStatus.AVAILABLE,
      protocol: i % 2 === 0 ? StorageProtocol.ISCSI : StorageProtocol.FC,
      thinProvisioned: i % 3 === 0,
      compressionEnabled: i % 2 === 0,
      deduplicationEnabled: i % 4 === 0,
      encryptionEnabled: i % 5 === 0,
      tags: { environment: 'test', tier: i % 2 === 0 ? 'premium' : 'standard' },
    });

    volumes.push(volume);
  }

  return volumes;
}

/**
 * Function 16: Seed SAN LUNs
 */
export async function seedSanLuns(
  sequelize: Sequelize,
  volumeIds: string[],
  lunsPerVolume: number = 3
): Promise<SanLun[]> {
  const luns: SanLun[] = [];

  for (const volumeId of volumeIds) {
    for (let i = 0; i < lunsPerVolume; i++) {
      const lun = await SanLun.create({
        lunNumber: i,
        name: `lun-${volumeId.substring(0, 8)}-${i}`,
        description: `Test LUN ${i} for volume ${volumeId}`,
        volumeId,
        capacityGb: 20 + i * 10,
        status: LunStatus.ONLINE,
        readOnly: i === 0,
        blockSizeBytes: 4096,
        multipath: true,
        alua: i % 2 === 0,
        tags: { type: 'test', lun_number: String(i) },
      });

      luns.push(lun);
    }
  }

  return luns;
}

/**
 * Function 17: Validate SAN volume data
 */
export function validateSanVolumeData(data: Partial<SanVolumeAttributes>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Volume name is required');
  }

  if (!data.capacityGb || data.capacityGb <= 0) {
    errors.push('Capacity must be greater than 0');
  }

  if (data.usedCapacityGb && data.capacityGb && data.usedCapacityGb > data.capacityGb) {
    errors.push('Used capacity cannot exceed total capacity');
  }

  if (!data.protocol || !Object.values(StorageProtocol).includes(data.protocol)) {
    errors.push('Invalid storage protocol');
  }

  if (!data.status || !Object.values(VolumeStatus).includes(data.status)) {
    errors.push('Invalid volume status');
  }

  if (data.iopsLimit && data.iopsLimit < 0) {
    errors.push('IOPS limit cannot be negative');
  }

  if (data.throughputMbps && data.throughputMbps < 0) {
    errors.push('Throughput limit cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Function 18: Validate SAN replication configuration
 */
export function validateSanReplicationConfig(data: Partial<SanReplicationAttributes>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Replication name is required');
  }

  if (!data.sourceVolumeId) {
    errors.push('Source volume ID is required');
  }

  if (!data.targetVolumeId) {
    errors.push('Target volume ID is required');
  }

  if (data.sourceVolumeId === data.targetVolumeId) {
    errors.push('Source and target volumes must be different');
  }

  if (!data.replicationType || !Object.values(ReplicationType).includes(data.replicationType)) {
    errors.push('Invalid replication type');
  }

  if (data.priority !== undefined && (data.priority < 1 || data.priority > 10)) {
    errors.push('Priority must be between 1 and 10');
  }

  if (data.rpoMinutes !== undefined && data.rpoMinutes < 0) {
    errors.push('RPO cannot be negative');
  }

  if (data.rtoMinutes !== undefined && data.rtoMinutes < 0) {
    errors.push('RTO cannot be negative');
  }

  if (
    data.replicationType === ReplicationType.ASYNCHRONOUS &&
    (!data.syncIntervalMinutes || data.syncIntervalMinutes <= 0)
  ) {
    errors.push('Sync interval is required for asynchronous replication');
  }

  if (data.bandwidthLimitMbps !== undefined && data.bandwidthLimitMbps < 0) {
    errors.push('Bandwidth limit cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// INDEXING STRATEGY FUNCTIONS
// ============================================================================

/**
 * Function 19: Create SAN volume indexes
 */
export async function createSanVolumeIndexes(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  const indexes: IndexesOptions[] = [
    {
      name: 'idx_san_volumes_status',
      fields: ['status'],
    },
    {
      name: 'idx_san_volumes_wwn',
      fields: ['wwn'],
      unique: true,
      where: { wwn: { [Op.ne]: null } },
    },
    {
      name: 'idx_san_volumes_pool_status',
      fields: ['storage_pool_id', 'status'],
    },
    {
      name: 'idx_san_volumes_created_at',
      fields: ['created_at'],
    },
    {
      name: 'idx_san_volumes_protocol',
      fields: ['protocol'],
    },
    {
      name: 'idx_san_volumes_capacity',
      fields: ['capacity_gb'],
    },
  ];

  for (const index of indexes) {
    try {
      await queryInterface.addIndex('san_volumes', index.fields as string[], {
        ...index,
        transaction,
      });
    } catch (error) {
      console.warn(`Index ${index.name} may already exist: ${error.message}`);
    }
  }
}

/**
 * Function 20: Create SAN LUN indexes
 */
export async function createSanLunIndexes(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  const indexes: IndexesOptions[] = [
    {
      name: 'idx_san_luns_volume_id',
      fields: ['volume_id'],
    },
    {
      name: 'idx_san_luns_status',
      fields: ['status'],
    },
    {
      name: 'idx_san_luns_volume_lun_number',
      fields: ['volume_id', 'lun_number'],
      unique: true,
    },
    {
      name: 'idx_san_luns_created_at',
      fields: ['created_at'],
    },
    {
      name: 'idx_san_luns_target_id',
      fields: ['target_id'],
    },
  ];

  for (const index of indexes) {
    try {
      await queryInterface.addIndex('san_luns', index.fields as string[], {
        ...index,
        transaction,
      });
    } catch (error) {
      console.warn(`Index ${index.name} may already exist: ${error.message}`);
    }
  }
}

/**
 * Function 21: Create SAN snapshot indexes
 */
export async function createSanSnapshotIndexes(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  const indexes: IndexesOptions[] = [
    {
      name: 'idx_san_snapshots_volume_id_created_at',
      fields: ['volume_id', 'created_at'],
    },
    {
      name: 'idx_san_snapshots_lun_id_created_at',
      fields: ['lun_id', 'created_at'],
    },
    {
      name: 'idx_san_snapshots_status',
      fields: ['status'],
    },
    {
      name: 'idx_san_snapshots_expires_at',
      fields: ['expires_at'],
      where: { expires_at: { [Op.ne]: null } },
    },
    {
      name: 'idx_san_snapshots_schedule_id',
      fields: ['schedule_id'],
    },
  ];

  for (const index of indexes) {
    try {
      await queryInterface.addIndex('san_snapshots', index.fields as string[], {
        ...index,
        transaction,
      });
    } catch (error) {
      console.warn(`Index ${index.name} may already exist: ${error.message}`);
    }
  }
}

/**
 * Function 22: Create SAN replication indexes
 */
export async function createSanReplicationIndexes(
  queryInterface: QueryInterface,
  transaction?: Transaction
): Promise<void> {
  const indexes: IndexesOptions[] = [
    {
      name: 'idx_san_replications_source_volume_id',
      fields: ['source_volume_id'],
    },
    {
      name: 'idx_san_replications_target_volume_id',
      fields: ['target_volume_id'],
    },
    {
      name: 'idx_san_replications_status_last_sync',
      fields: ['status', 'last_sync_at'],
    },
    {
      name: 'idx_san_replications_next_sync_at',
      fields: ['next_sync_at'],
      where: { next_sync_at: { [Op.ne]: null } },
    },
  ];

  for (const index of indexes) {
    try {
      await queryInterface.addIndex('san_replications', index.fields as string[], {
        ...index,
        transaction,
      });
    } catch (error) {
      console.warn(`Index ${index.name} may already exist: ${error.message}`);
    }
  }
}

// ============================================================================
// ADVANCED QUERY FUNCTIONS
// ============================================================================

/**
 * Function 23: Get volume capacity statistics
 */
export async function getVolumeCapacityStats(sequelize: Sequelize): Promise<{
  totalCapacityGb: number;
  usedCapacityGb: number;
  availableCapacityGb: number;
  utilizationPercent: number;
}> {
  const [results] = await sequelize.query(`
    SELECT
      COALESCE(SUM(capacity_gb), 0) as total_capacity_gb,
      COALESCE(SUM(used_capacity_gb), 0) as used_capacity_gb,
      COALESCE(SUM(capacity_gb - used_capacity_gb), 0) as available_capacity_gb,
      CASE
        WHEN SUM(capacity_gb) > 0 THEN (SUM(used_capacity_gb) / SUM(capacity_gb) * 100)
        ELSE 0
      END as utilization_percent
    FROM san_volumes
    WHERE deleted_at IS NULL
      AND status != 'DELETING'
  `);

  return results[0] as any;
}

/**
 * Function 24: Get LUN performance metrics
 */
export async function getLunPerformanceMetrics(
  lunId: string,
  sequelize: Sequelize
): Promise<{
  lunId: string;
  avgLatencyMs: number;
  totalIops: number;
  readWriteRatio: number;
} | null> {
  const [results] = await sequelize.query(
    `
    SELECT
      id as lun_id,
      COALESCE(latency_ms, 0) as avg_latency_ms,
      COALESCE(iops_read, 0) + COALESCE(iops_write, 0) as total_iops,
      CASE
        WHEN COALESCE(iops_write, 0) > 0
        THEN COALESCE(iops_read, 0)::FLOAT / iops_write
        ELSE 0
      END as read_write_ratio
    FROM san_luns
    WHERE id = :lunId
      AND deleted_at IS NULL
  `,
    {
      replacements: { lunId },
    }
  );

  return results.length > 0 ? (results[0] as any) : null;
}

/**
 * Function 25: Get snapshot retention compliance
 */
export async function getSnapshotRetentionCompliance(sequelize: Sequelize): Promise<{
  totalSnapshots: number;
  expiredSnapshots: number;
  expiringSoonSnapshots: number;
  compliancePercent: number;
}> {
  const [results] = await sequelize.query(`
    SELECT
      COUNT(*) as total_snapshots,
      COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_snapshots,
      COUNT(CASE WHEN expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days' THEN 1 END) as expiring_soon_snapshots,
      CASE
        WHEN COUNT(*) > 0
        THEN ((COUNT(*) - COUNT(CASE WHEN expires_at < NOW() THEN 1 END))::FLOAT / COUNT(*) * 100)
        ELSE 100
      END as compliance_percent
    FROM san_snapshots
    WHERE deleted_at IS NULL
      AND expires_at IS NOT NULL
  `);

  return results[0] as any;
}

/**
 * Function 26: Get replication health status
 */
export async function getReplicationHealthStatus(sequelize: Sequelize): Promise<{
  totalReplications: number;
  healthyReplications: number;
  unhealthyReplications: number;
  avgSyncLagMinutes: number;
}> {
  const [results] = await sequelize.query(`
    SELECT
      COUNT(*) as total_replications,
      COUNT(CASE WHEN status = 'ACTIVE' AND error_count = 0 THEN 1 END) as healthy_replications,
      COUNT(CASE WHEN status != 'ACTIVE' OR error_count > 0 THEN 1 END) as unhealthy_replications,
      COALESCE(AVG(EXTRACT(EPOCH FROM (NOW() - last_sync_at)) / 60), 0) as avg_sync_lag_minutes
    FROM san_replications
    WHERE deleted_at IS NULL
  `);

  return results[0] as any;
}

/**
 * Function 27: Find volumes by utilization threshold
 */
export async function findVolumesByUtilization(
  minUtilizationPercent: number,
  maxUtilizationPercent: number = 100
): Promise<SanVolume[]> {
  return await SanVolume.findAll({
    where: literal(
      `(used_capacity_gb / capacity_gb * 100) BETWEEN ${minUtilizationPercent} AND ${maxUtilizationPercent}`
    ),
    order: [['used_capacity_gb', 'DESC']],
  });
}

/**
 * Function 28: Find LUNs with high latency
 */
export async function findLunsWithHighLatency(latencyThresholdMs: number): Promise<SanLun[]> {
  return await SanLun.findAll({
    where: {
      latencyMs: {
        [Op.gte]: latencyThresholdMs,
      },
      status: LunStatus.ONLINE,
    },
    include: [
      {
        model: SanVolume,
        as: 'volume',
      },
    ],
    order: [['latencyMs', 'DESC']],
  });
}

/**
 * Function 29: Find expired snapshots
 */
export async function findExpiredSnapshots(): Promise<SanSnapshot[]> {
  return await SanSnapshot.findAll({
    where: {
      expiresAt: {
        [Op.lt]: new Date(),
      },
      status: SnapshotStatus.AVAILABLE,
    },
    include: [
      {
        model: SanVolume,
        as: 'volume',
      },
      {
        model: SanLun,
        as: 'lun',
      },
    ],
    order: [['expiresAt', 'ASC']],
  });
}

/**
 * Function 30: Find stale replications
 */
export async function findStaleReplications(staleLagMinutes: number): Promise<SanReplication[]> {
  const staleThreshold = new Date(Date.now() - staleLagMinutes * 60 * 1000);

  return await SanReplication.findAll({
    where: {
      status: ReplicationStatus.ACTIVE,
      lastSyncAt: {
        [Op.lt]: staleThreshold,
      },
    },
    include: [
      {
        model: SanVolume,
        as: 'sourceVolume',
      },
      {
        model: SanVolume,
        as: 'targetVolume',
      },
    ],
    order: [['lastSyncAt', 'ASC']],
  });
}

// ============================================================================
// BULK OPERATION FUNCTIONS
// ============================================================================

/**
 * Function 31: Bulk create volumes
 */
export async function bulkCreateVolumes(
  volumeData: SanVolumeCreationAttributes[],
  transaction?: Transaction
): Promise<SanVolume[]> {
  return await SanVolume.bulkCreate(volumeData, {
    transaction,
    validate: true,
    returning: true,
  });
}

/**
 * Function 32: Bulk update volume status
 */
export async function bulkUpdateVolumeStatus(
  volumeIds: string[],
  status: VolumeStatus,
  transaction?: Transaction
): Promise<number> {
  const [affectedCount] = await SanVolume.update(
    { status },
    {
      where: {
        id: {
          [Op.in]: volumeIds,
        },
      },
      transaction,
    }
  );

  return affectedCount;
}

/**
 * Function 33: Bulk delete expired snapshots
 */
export async function bulkDeleteExpiredSnapshots(transaction?: Transaction): Promise<number> {
  const expiredSnapshots = await findExpiredSnapshots();
  const snapshotIds = expiredSnapshots.map((s) => s.id);

  if (snapshotIds.length === 0) {
    return 0;
  }

  return await SanSnapshot.destroy({
    where: {
      id: {
        [Op.in]: snapshotIds,
      },
    },
    transaction,
  });
}

/**
 * Function 34: Bulk create snapshots for volumes
 */
export async function bulkCreateSnapshotsForVolumes(
  volumeIds: string[],
  retentionDays: number,
  transaction?: Transaction
): Promise<SanSnapshot[]> {
  const volumes = await SanVolume.findAll({
    where: {
      id: {
        [Op.in]: volumeIds,
      },
    },
  });

  const snapshotData: SanSnapshotCreationAttributes[] = volumes.map((volume) => ({
    name: `${volume.name}-snapshot-${Date.now()}`,
    description: `Automated snapshot for ${volume.name}`,
    volumeId: volume.id,
    status: SnapshotStatus.CREATING,
    sizeGb: volume.usedCapacityGb,
    retentionDays,
    isAutomatic: true,
  }));

  return await SanSnapshot.bulkCreate(snapshotData, {
    transaction,
    validate: true,
    returning: true,
  });
}

// ============================================================================
// MAINTENANCE & CLEANUP FUNCTIONS
// ============================================================================

/**
 * Function 35: Cleanup deleted resources
 */
export async function cleanupDeletedResources(
  olderThanDays: number,
  transaction?: Transaction
): Promise<{
  volumesDeleted: number;
  lunsDeleted: number;
  snapshotsDeleted: number;
  replicationsDeleted: number;
}> {
  const deletionThreshold = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

  const volumesDeleted = await SanVolume.destroy({
    where: {
      deletedAt: {
        [Op.lt]: deletionThreshold,
      },
    },
    force: true,
    transaction,
  });

  const lunsDeleted = await SanLun.destroy({
    where: {
      deletedAt: {
        [Op.lt]: deletionThreshold,
      },
    },
    force: true,
    transaction,
  });

  const snapshotsDeleted = await SanSnapshot.destroy({
    where: {
      deletedAt: {
        [Op.lt]: deletionThreshold,
      },
    },
    force: true,
    transaction,
  });

  const replicationsDeleted = await SanReplication.destroy({
    where: {
      deletedAt: {
        [Op.lt]: deletionThreshold,
      },
    },
    force: true,
    transaction,
  });

  return {
    volumesDeleted,
    lunsDeleted,
    snapshotsDeleted,
    replicationsDeleted,
  };
}

/**
 * Function 36: Optimize SAN database tables
 */
export async function optimizeSanDatabaseTables(sequelize: Sequelize): Promise<{
  tablesOptimized: string[];
  statistics: Record<string, any>;
}> {
  const tables = ['san_volumes', 'san_luns', 'san_snapshots', 'san_replications'];
  const tablesOptimized: string[] = [];
  const statistics: Record<string, any> = {};

  for (const table of tables) {
    try {
      // Run VACUUM ANALYZE for PostgreSQL
      await sequelize.query(`VACUUM ANALYZE ${table}`);

      // Gather table statistics
      const [stats] = await sequelize.query(`
        SELECT
          '${table}' as table_name,
          pg_size_pretty(pg_total_relation_size('${table}')) as total_size,
          pg_size_pretty(pg_relation_size('${table}')) as table_size,
          pg_size_pretty(pg_indexes_size('${table}')) as indexes_size,
          (SELECT COUNT(*) FROM ${table}) as row_count
      `);

      tablesOptimized.push(table);
      statistics[table] = stats[0];
    } catch (error) {
      console.error(`Error optimizing table ${table}:`, error.message);
    }
  }

  return {
    tablesOptimized,
    statistics,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const SanModels = {
  SanVolume,
  SanLun,
  SanSnapshot,
  SanReplication,
};

export const SanMigrationHelpers = {
  createSanVolumeTable,
  createSanLunTable,
  createSanSnapshotTable,
  createSanReplicationTable,
  addColumnToSanTable,
  modifyColumnInSanTable,
  dropColumnFromSanTable,
  createIndexOnSanTable,
};

export const SanSchemaOperations = {
  initializeSanSchema,
  validateSanSchema,
  migrateSanSchema,
  rollbackSanSchema,
  getSanSchemaVersion,
  compareSanSchemas,
};

export const SanSeedingValidation = {
  seedSanVolumes,
  seedSanLuns,
  validateSanVolumeData,
  validateSanReplicationConfig,
};

export const SanIndexing = {
  createSanVolumeIndexes,
  createSanLunIndexes,
  createSanSnapshotIndexes,
  createSanReplicationIndexes,
};

export const SanQueryFunctions = {
  getVolumeCapacityStats,
  getLunPerformanceMetrics,
  getSnapshotRetentionCompliance,
  getReplicationHealthStatus,
  findVolumesByUtilization,
  findLunsWithHighLatency,
  findExpiredSnapshots,
  findStaleReplications,
};

export const SanBulkOperations = {
  bulkCreateVolumes,
  bulkUpdateVolumeStatus,
  bulkDeleteExpiredSnapshots,
  bulkCreateSnapshotsForVolumes,
};

export const SanMaintenance = {
  cleanupDeletedResources,
  optimizeSanDatabaseTables,
};
