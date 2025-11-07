/**
 * IntegrationLog Model
 *
 * Logs all integration operations and their results
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  ForeignKey,
  BelongsTo,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';

/**
 * IntegrationLog Model
 * Logs all integration operations and their results
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
  tableName: 'integration_logs',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['integrationId'] },
    { fields: ['integrationType'] },
    { fields: ['action'] },
    { fields: ['status'] },
    { fields: ['startedAt'] },
    { fields: ['completedAt'] },
    { fields: ['createdAt'] },
    {
      fields: ['createdAt'],
      name: 'idx_integration_log_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_integration_log_updated_at',
    },
  ],
})
export class IntegrationLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./integration-config.model').IntegrationConfig)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Reference to the integration configuration',
  })
  @Index
  integrationId: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Type of integration (SIS, EHR, etc.)',
  })
  @Index
  integrationType: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Action performed (sync, test, etc.)',
  })
  @Index
  action: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    comment: 'Status of the operation (success, error, etc.)',
  })
  @Index
  status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Total number of records processed',
  })
  recordsProcessed: number | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Number of records processed successfully',
  })
  recordsSucceeded: number | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Number of records that failed processing',
  })
  recordsFailed: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the operation started',
  })
  @Index
  startedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the operation completed',
  })
  @Index
  completedAt: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Duration of the operation in milliseconds',
  })
  duration: number | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Error message if operation failed',
  })
  errorMessage: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Additional details about the operation',
  })
  details: Record<string, any> | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'When this log entry was created',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When this log entry was last updated',
  })
  declare updatedAt: Date | null;

  // Relationships
  @BelongsTo(() => require('./integration-config.model').IntegrationConfig, {
    foreignKey: 'integrationId',
    as: 'integration',
  })
  declare integration: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: IntegrationLog) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] IntegrationLog ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
