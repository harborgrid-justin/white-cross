/**
 * SyncSession Model
 *
 * Tracks synchronization sessions with external systems (SIS, etc.)
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  HasMany,
} from 'sequelize-typescript';
import { SISSyncConflict } from './sis-sync-conflict.model';

export enum SyncStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

export enum SyncDirection {
  PULL = 'PULL',
  PUSH = 'PUSH',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
}

/**
 * SyncSession Model
 * Tracks synchronization sessions with external systems
 */
@Table({
  tableName: 'sync_sessions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['direction'] },
    { fields: ['started_at'] },
    { fields: ['completed_at'] },
    { fields: ['triggered_by'] },
    { fields: ['created_at'] },
  ],
})
export class SyncSession extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Reference to the sync configuration used',
  })
  configId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'When the sync session started',
  })
  @Index
  startedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the sync session completed',
  })
  @Index
  completedAt: Date | null;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncStatus) as string[])),
    allowNull: false,
    defaultValue: SyncStatus.PENDING,
    comment: 'Current status of the sync session',
  })
  @Index
  status: SyncStatus;

  @Column({
    type: DataType.ENUM(...(Object.values(SyncDirection) as string[])),
    allowNull: false,
    comment: 'Direction of the sync operation',
  })
  @Index
  direction: SyncDirection;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Statistics about the sync operation',
  })
  stats: {
    studentsProcessed: number;
    studentsCreated: number;
    studentsUpdated: number;
    studentsSkipped: number;
    studentsFailed: number;
    errors: string[];
    warnings: string[];
  };

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    comment: 'Types of entities being synchronized',
  })
  entities: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total number of records processed',
  })
  recordsProcessed: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of records processed successfully',
  })
  recordsSuccessful: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of records that failed processing',
  })
  recordsFailed: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'User or system that triggered the sync',
  })
  @Index
  triggeredBy: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Completion message or error details',
  })
  completionMessage: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'When the sync session was created',
  })
  @Index
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the sync session was last updated',
  })
  declare updatedAt: Date | null;

  // Relationships
  @HasMany(() => SISSyncConflict, {
    foreignKey: 'sessionId',
    as: 'conflicts',
  })
  conflicts: SISSyncConflict[];
}