import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { SyncEntityType, ConflictResolution } from './sync-queue-item.model';

/**
 * Sync Conflict Version Interface
 */
export interface ConflictVersion {
  data: any;
  timestamp: Date;
  userId: string;
}

export enum SyncStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DEFERRED = 'DEFERRED'
}

export interface SyncConflictAttributes {
  id: string;
  queueItemId: string;
  entityType: string;
  entityId: string;
  clientVersion: ConflictVersion;
  serverVersion: ConflictVersion;
  resolution?: ConflictResolution;
  resolvedAt?: Date;
  resolvedBy?: string;
  mergedData?: any;
  status: SyncStatus;
  createdAt?: Date;
}

@Table({
  tableName: 'sync_conflicts',
  timestamps: false,
  indexes: [
    {
      fields: ['status']
  },
    {
      fields: ['entityType']
  },
  ]
  })
export class SyncConflict extends Model<SyncConflictAttributes> implements SyncConflictAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  queueItemId: string;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncEntityType) as string[])),
    allowNull: false
  })
  @Index
  entityType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  entityId: string;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  clientVersion: ConflictVersion;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  serverVersion: ConflictVersion;

  @AllowNull
  @Column({
    type: DataType.ENUM(...(Object.values(ConflictResolution) as string[]))
  })
  resolution?: ConflictResolution;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  resolvedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.UUID
  })
  resolvedBy?: string;

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  mergedData?: any;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncStatus) as string[])),
    allowNull: false,
    defaultValue: SyncStatus.PENDING
  })
  @Index
  status: SyncStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare createdAt?: Date;
}
