/**
 * SIS SyncConflict Model
 *
 * Stores conflicts detected during Student Information System (SIS) synchronization
 */

import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';

export enum ConflictResolution {
  KEEP_LOCAL = 'KEEP_LOCAL',
  KEEP_SIS = 'KEEP_SIS',
}

/**
 * SIS SyncConflict Model
 * Stores conflicts detected during SIS synchronization
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'sis_sync_conflicts',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['sessionId'] },
    { fields: ['studentId'] },
    { fields: ['field'] },
    { fields: ['resolution'] },
    { fields: ['resolvedAt'] },
    { fields: ['createdAt'] },
    {
      fields: ['createdAt'],
      name: 'idx_sis_sync_conflict_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_sis_sync_conflict_updated_at',
    },
  ],
})
export class SISSyncConflict extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./sync-session.model').SyncSession)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Reference to the sync session that detected this conflict',
  })
  @Index
  sessionId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'ID of the student with the conflicting data',
  })
  @Index
  studentId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'The field name that has conflicting values',
  })
  @Index
  field: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Value from the local system',
  })
  localValue: any;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Value from the SIS system',
  })
  sisValue: any;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ConflictResolution)],
    },
    allowNull: true,
    comment: 'How the conflict was resolved',
  })
  @Index
  resolution: ConflictResolution | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the conflict was resolved',
  })
  @Index
  resolvedAt: Date | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User who resolved the conflict',
  })
  resolvedBy: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'When the conflict was detected',
  })
  @Index
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the conflict was last updated',
  })
  declare updatedAt: Date | null;

  // Relationships
  @BelongsTo(() => require('./sync-session.model').SyncSession, {
    foreignKey: 'sessionId',
    as: 'session',
  })
  declare session: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: SISSyncConflict) {
    await createModelAuditHook('SISSyncConflict', instance);
  }
}
