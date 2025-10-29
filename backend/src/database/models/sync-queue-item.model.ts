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

export enum SyncActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ'
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
  CHRONIC_CONDITION = 'CHRONIC_CONDITION'
}

export enum SyncPriority {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

export enum ConflictResolution {
  CLIENT_WINS = 'CLIENT_WINS',
  SERVER_WINS = 'SERVER_WINS',
  NEWEST_WINS = 'NEWEST_WINS',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL'
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

@Table({
  tableName: 'sync_queue_items',
  timestamps: true,
  indexes: [
    {
      fields: ['device_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['synced'],
    },
    {
      fields: ['priority'],
    },
  ],
})
export class SyncQueueItem extends Model<SyncQueueItemAttributes> implements SyncQueueItemAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'device_id',
  })
  @Index
  deviceId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  @Index
  userId: string;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncActionType) as string[])),
    allowNull: false,
    field: 'action_type',
  })
  actionType: SyncActionType;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncEntityType) as string[])),
    allowNull: false,
    field: 'entity_type',
  })
  entityType: SyncEntityType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'entity_id',
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
    field: 'synced_at',
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
    field: 'max_attempts',
  })
  maxAttempts: number;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'last_error',
  })
  lastError?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'conflict_detected',
  })
  conflictDetected: boolean;

  @AllowNull
  @Column({
    type: DataType.ENUM(...(Object.values(ConflictResolution) as string[])),
    field: 'conflict_resolution',
  })
  conflictResolution?: ConflictResolution;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncPriority) as string[])),
    allowNull: false,
    defaultValue: SyncPriority.NORMAL,
  })
  @Index
  priority: SyncPriority;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'requires_online',
  })
  requiresOnline: boolean;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
