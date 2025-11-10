import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum SyncActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
}

export enum SyncEntityType {
  STUDENT = 'STUDENT',
  HEALTH_RECORD = 'HEALTH_RECORD',
  MEDICATION = 'MEDICATION',
  INCIDENT = 'INCIDENT',
  VACCINATION = 'VACCINATION',
  APPOINTMENT = 'APPOINTMENT',
  SCREENING = 'SCREENING',
  ALLERGY = 'ALLERGY',
  CHRONIC_CONDITION = 'CHRONIC_CONDITION',
}

export enum SyncPriority {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
}

export enum ConflictResolution {
  CLIENT_WINS = 'CLIENT_WINS',
  SERVER_WINS = 'SERVER_WINS',
  NEWEST_WINS = 'NEWEST_WINS',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL',
}

export interface SyncQueueItemAttributes {
  id: string;
  deviceId: string;
  userId: string;
  actionType: SyncActionType;
  entityType: SyncEntityType;
  entityId: string;
  data: any;
  timestamp: Date;
  createdAt?: Date;
  syncedAt?: Date;
  synced: boolean;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  conflictDetected: boolean;
  conflictResolution?: ConflictResolution;
  priority: SyncPriority;
  requiresOnline: boolean;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'sync_queue_items',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['deviceId'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['synced'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_sync_queue_item_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_sync_queue_item_updated_at',
    },
  ],
})
export class SyncQueueItem
  extends Model<SyncQueueItemAttributes>
  implements SyncQueueItemAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  @Index
  deviceId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  userId: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncActionType)],
    },
    allowNull: false,
  })
  actionType: SyncActionType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncEntityType)],
    },
    allowNull: false,
  })
  entityType: SyncEntityType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  entityId: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  data: any;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  syncedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Index
  synced: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempts: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3,
  })
  maxAttempts: number;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  lastError?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  conflictDetected: boolean;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ConflictResolution)],
    },
  })
  conflictResolution?: ConflictResolution;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncPriority)],
    },
    allowNull: false,
    defaultValue: SyncPriority.NORMAL,
  })
  @Index
  priority: SyncPriority;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  requiresOnline: boolean;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: SyncQueueItem) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] SyncQueueItem ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
