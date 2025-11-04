import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  Scopes,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
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
    {
      fields: ['createdAt'],
      name: 'idx_sync_conflict_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_sync_conflict_updated_at'
    }
  ]
  })
export class SyncConflict extends Model<SyncConflictAttributes> implements SyncConflictAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  queueItemId: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncEntityType)]
    },
    allowNull: false
  })
  @Index
  entityType: string;

  @Column({
    type: DataType.STRING(255),
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ConflictResolution)]
    }
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncStatus)]
    },
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


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: SyncConflict) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] SyncConflict ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
