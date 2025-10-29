/**
 * FollowUpAction Model
 *
 * Sequelize model for tracking follow-up actions related to incident reports
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IncidentReport } from './incident-report.model';

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
@Table({
  tableName: 'follow_up_actions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['incident_report_id', 'status'] },
    { fields: ['assigned_to', 'status'] },
    { fields: ['due_date', 'status'] },
  ],
})
export class FollowUpAction extends Model<FollowUpActionAttributes, CreateFollowUpActionAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => IncidentReport)
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
    type: DataType.ENUM(...Object.values(ActionPriority)),
    allowNull: false,
    defaultValue: ActionPriority.MEDIUM,
    comment: 'Priority level of the action',
  })
  @Index
  priority: ActionPriority;

  @Default(ActionStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(ActionStatus)),
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
  @BelongsTo(() => IncidentReport, {
    foreignKey: 'incidentReportId',
    as: 'incidentReport',
  })
  incidentReport?: IncidentReport;
}