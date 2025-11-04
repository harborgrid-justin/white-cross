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
} ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';

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
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'sync_sessions',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['status'] },
    { fields: ['direction'] },
    { fields: ['startedAt'] },
    { fields: ['completedAt'] },
    { fields: ['triggeredBy'] },
    { fields: ['createdAt'] },,
    {
      fields: ['createdAt'],
      name: 'idx_sync_session_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_sync_session_updated_at'
    }
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncStatus)]
    },
    allowNull: false,
    defaultValue: SyncStatus.PENDING,
    comment: 'Current status of the sync session',
  })
  @Index
  status: SyncStatus;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SyncDirection)]
    },
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
    type: DataType.ARRAY(DataType.STRING(255)),
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
  @HasMany(() => require('./sis-sync-conflict.model').SISSyncConflict, {
    foreignKey: 'sessionId',
    as: 'conflicts',
  })
  declare conflicts: any[];


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: SyncSession) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] SyncSession ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}