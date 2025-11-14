/**
 * FollowUpAction Model
 *
 * Sequelize model for tracking follow-up actions related to incident reports
 */

import {
  AllowNull,
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
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum ActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ActionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface FollowUpActionAttributes {
  id?: string;
  incidentReportId: string;
  action: string;
  dueDate: Date;
  priority: ActionPriority;
  status?: ActionStatus;
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFollowUpActionAttributes {
  incidentReportId: string;
  action: string;
  dueDate: Date;
  priority: ActionPriority;
  status?: ActionStatus;
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

/**
 * FollowUpAction Model
 *
 * Tracks follow-up actions for incident reports
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
  tableName: 'follow_up_actions',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['incidentReportId', 'status'] },
    { fields: ['assignedTo', 'status'] },
    { fields: ['dueDate', 'status'] },
    {
      fields: ['createdAt'],
      name: 'idx_follow_up_action_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_follow_up_action_updated_at',
    },
  ],
})
export class FollowUpAction extends Model<
  FollowUpActionAttributes,
  CreateFollowUpActionAttributes
> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./incident-report.model').IncidentReport)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'ID of the incident report this action belongs to',
  })
  @Index
  incidentReportId: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Description of the follow-up action to be taken',
  })
  action: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Date and time when this action is due',
  })
  @Index
  dueDate: Date;

  @Default(ActionPriority.MEDIUM)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ActionPriority)],
    },
    allowNull: false,
    defaultValue: ActionPriority.MEDIUM,
    comment: 'Priority level of the action',
  })
  @Index
  priority: ActionPriority;

  @Default(ActionStatus.PENDING)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ActionStatus)],
    },
    allowNull: false,
    defaultValue: ActionStatus.PENDING,
    comment: 'Current status of the action',
  })
  @Index
  status?: ActionStatus;

  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of the user assigned to complete this action',
  })
  @Index
  assignedTo?: string;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Date and time when the action was completed',
  })
  completedAt?: Date;

  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of the user who completed the action',
  })
  completedBy?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Additional notes about the action or completion',
  })
  notes?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the action was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the action was last updated',
  })
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./incident-report.model').IncidentReport, {
    foreignKey: 'incidentReportId',
    as: 'incidentReport',
  })
  declare incidentReport?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: FollowUpAction) {
    await createModelAuditHook('FollowUpAction', instance);
  }
}

// Default export for Sequelize-TypeScript
export default FollowUpAction;
