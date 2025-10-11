import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ActionPriority, ActionStatus } from '../../types/enums';

/**
 * FollowUpAction Model
 * Manages follow-up actions and tasks for incident reports including assignments and completion tracking.
 */

interface FollowUpActionAttributes {
  id: string;
  incidentReportId: string;
  action: string;
  dueDate: Date;
  priority: ActionPriority;
  status: ActionStatus;
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FollowUpActionCreationAttributes
  extends Optional<
    FollowUpActionAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'priority'
    | 'status'
    | 'assignedTo'
    | 'completedAt'
    | 'completedBy'
    | 'notes'
  > {}

export class FollowUpAction
  extends Model<FollowUpActionAttributes, FollowUpActionCreationAttributes>
  implements FollowUpActionAttributes
{
  public id!: string;
  public incidentReportId!: string;
  public action!: string;
  public dueDate!: Date;
  public priority!: ActionPriority;
  public status!: ActionStatus;
  public assignedTo?: string;
  public completedAt?: Date;
  public completedBy?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FollowUpAction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    incidentReportId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(ActionPriority)),
      allowNull: false,
      defaultValue: ActionPriority.MEDIUM,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ActionStatus)),
      allowNull: false,
      defaultValue: ActionStatus.PENDING,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID of assigned person',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who completed the action',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'follow_up_actions',
    timestamps: true,
    indexes: [
      { fields: ['incidentReportId'] },
      { fields: ['status', 'dueDate'] },
      { fields: ['assignedTo', 'status'] },
      { fields: ['priority', 'status'] },
    ],
  }
);
