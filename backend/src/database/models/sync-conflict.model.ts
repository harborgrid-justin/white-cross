import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
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
      fields: ['status'],
    },
    {
      fields: ['entity_type'],
    },
  ],
})
export class SyncConflict extends Model<SyncConflictAttributes> implements SyncConflictAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'queue_item_id',
  })
  queueItemId: string;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncEntityType) as string[])),
    allowNull: false,
    field: 'entity_type',
  })
  @Index
  entityType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'entity_id',
  })
  entityId: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'client_version',
  })
  clientVersion: ConflictVersion;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'server_version',
  })
  serverVersion: ConflictVersion;

  @AllowNull
  @Column({
    type: DataType.ENUM(...(Object.values(ConflictResolution) as string[])),
  })
  resolution?: ConflictResolution;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'resolved_at',
  })
  resolvedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'resolved_by',
  })
  resolvedBy?: string;

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'merged_data',
  })
  mergedData?: any;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncStatus) as string[])),
    allowNull: false,
    defaultValue: SyncStatus.PENDING,
  })
  @Index
  status: SyncStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  declare createdAt?: Date;
}
