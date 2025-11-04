/**
 * BackupLog Model
 *
 * Sequelize model for tracking database backup operations
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  AllowNull,
} ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';

/**
 * Backup types
 */
export enum BackupType {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
}

/**
 * Backup status
 */
export enum BackupStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * BackupLog attributes interface
 */
export interface BackupLogAttributes {
  id?: string;
  type: BackupType;
  status: BackupStatus;
  fileName?: string;
  fileSize?: number;
  location?: string;
  triggeredBy?: string;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * BackupLog creation attributes interface
 */
export interface CreateBackupLogAttributes {
  type: BackupType;
  status: BackupStatus;
  fileName?: string;
  fileSize?: number;
  location?: string;
  triggeredBy?: string;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

/**
 * BackupLog Model
 *
 * Tracks database backup operations and their status
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
  tableName: 'backup_logs',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['status'] },
    { fields: ['startedAt'] },
    { fields: ['type'] },,
    {
      fields: ['createdAt'],
      name: 'idx_backup_log_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_backup_log_updated_at'
    }
  ],
})
export class BackupLog extends Model<BackupLogAttributes, CreateBackupLogAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(BackupType)]
    },
    allowNull: false,
    comment: 'Type of backup operation',
  })
  type: BackupType;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(BackupStatus)]
    },
    allowNull: false,
    comment: 'Current status of the backup',
  })
  @Index
  status: BackupStatus;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Name of the backup file',
  })
  fileName?: string;

  @AllowNull(true)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'Size of the backup file in bytes',
  })
  fileSize?: number;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Location/path where the backup is stored',
  })
  location?: string;

  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of the user who triggered the backup',
  })
  triggeredBy?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Error message if the backup failed',
  })
  error?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Timestamp when the backup started',
  })
  @Index
  startedAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp when the backup completed',
  })
  completedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the backup log was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the backup log was last updated',
  })
  declare updatedAt?: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: BackupLog) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] BackupLog ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}