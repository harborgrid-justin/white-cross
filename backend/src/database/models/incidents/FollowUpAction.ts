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
      validate: {
        notEmpty: {
          msg: 'Incident report ID is required'
        },
        isUUID: {
          args: 4,
          msg: 'Incident report ID must be a valid UUID'
        }
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Follow-up action description is required'
        },
        len: {
          args: [5, 500],
          msg: 'Action must be between 5 and 500 characters'
        }
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Due date is required for follow-up actions'
        },
        isDate: {
          msg: 'Invalid due date',
          args: true
        },
        isNotPast(value: Date) {
          // Only validate for new records (not updates of completed items)
          if (this.isNewRecord && new Date(value) < new Date()) {
            throw new Error('Due date must be in the future');
          }
        }
      }
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(ActionPriority)),
      allowNull: false,
      defaultValue: ActionPriority.MEDIUM,
      validate: {
        notEmpty: {
          msg: 'Priority is required'
        },
        isIn: {
          args: [Object.values(ActionPriority)],
          msg: `Priority must be one of: ${Object.values(ActionPriority).join(', ')}`
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ActionStatus)),
      allowNull: false,
      defaultValue: ActionStatus.PENDING,
      validate: {
        notEmpty: {
          msg: 'Status is required'
        },
        isIn: {
          args: [Object.values(ActionStatus)],
          msg: `Status must be one of: ${Object.values(ActionStatus).join(', ')}`
        }
      }
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
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Notes cannot exceed 2000 characters'
        }
      }
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
    validate: {
      // Model-level validation: Completed actions must have completion tracking
      completedMustHaveCompletedBy() {
        if (this.status === ActionStatus.COMPLETED && !this.completedBy) {
          throw new Error('Completed actions must have a completedBy user');
        }
      },
      // Model-level validation: Completed actions should have notes
      completedShouldHaveNotes(this: FollowUpAction) {
        if (this.status === ActionStatus.COMPLETED && (!this.notes || this.notes.trim().length === 0)) {
          // This is a soft warning - we'll allow it but log it
          console.warn(`Follow-up action ${this.id} completed without notes`);
        }
      }
    }
  }
);

// Add hooks for completion tracking
FollowUpAction.beforeUpdate((instance) => {
  // Auto-set completion timestamp when status changes to COMPLETED
  if (instance.status === ActionStatus.COMPLETED && !instance.completedAt) {
    instance.completedAt = new Date();
  }

  // Clear completion data if status changes away from COMPLETED
  if (instance.status !== ActionStatus.COMPLETED && instance.changed('status')) {
    instance.completedAt = undefined;
    instance.completedBy = undefined;
  }
});
