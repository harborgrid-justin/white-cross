/**
 * @fileoverview Follow-Up Action Database Model
 * @module database/models/incidents/FollowUpAction
 * @description Sequelize model for managing follow-up actions and tasks related to incident reports.
 * Provides task assignment, priority management, and completion tracking for incident resolution.
 *
 * Key Features:
 * - Action assignment to staff members
 * - Priority-based task management (LOW, MEDIUM, HIGH, URGENT)
 * - Due date tracking with validation
 * - Status workflow (PENDING → IN_PROGRESS → COMPLETED/CANCELLED)
 * - Completion tracking with timestamps and user references
 * - Integration with incident reports
 *
 * Business Rules:
 * - Due dates must be in the future for new actions
 * - Completed actions require completedBy user reference
 * - High priority actions should have due dates within 48 hours
 * - Urgent priority actions should have due dates within 24 hours
 * - Completion notes strongly recommended for audit trail
 *
 * @compliance HIPAA - Follow-up actions may reference PHI
 * @compliance State regulations - Required tracking for injury incidents
 *
 * @legal Retention requirement: 7 years (tied to parent incident report)
 * @legal Demonstrates due diligence in incident response
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: 7119D192A5
 * Last Updated: 2025-10-17
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ActionPriority, ActionStatus } from '../../types/enums';

/**
 * @interface FollowUpActionAttributes
 * @description Defines the complete structure of a follow-up action record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} incidentReportId - Reference to parent incident report
 * @business Links action to originating incident for tracking and reporting
 *
 * @property {string} action - Description of the follow-up action required (5-500 characters)
 * @business Must be specific and actionable for assignment
 *
 * @property {Date} dueDate - When the action must be completed
 * @business Must be in the future for new actions
 * @business URGENT priority: typically within 24 hours
 * @business HIGH priority: typically within 48 hours
 * @business MEDIUM priority: typically within 1 week
 * @business LOW priority: typically within 2 weeks
 *
 * @property {ActionPriority} priority - Priority level of the action
 * @enum {ActionPriority} ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
 * @business URGENT: Immediate attention required (e.g., critical injury follow-up)
 * @business HIGH: Prompt attention needed (e.g., parent meeting scheduling)
 * @business MEDIUM: Normal business priority (e.g., documentation review)
 * @business LOW: Can be addressed when time permits (e.g., general notifications)
 *
 * @property {ActionStatus} status - Current status of the action
 * @enum {ActionStatus} ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
 * @business Workflow: PENDING → IN_PROGRESS → COMPLETED
 * @business Actions can be CANCELLED at any stage if no longer needed
 *
 * @property {string} [assignedTo] - User ID of assigned staff member
 * @business Optional for unassigned actions; required before moving to IN_PROGRESS
 *
 * @property {Date} [completedAt] - Timestamp when action was completed
 * @business Auto-set when status changes to COMPLETED
 *
 * @property {string} [completedBy] - User ID who completed the action
 * @business Required when status is COMPLETED
 * @compliance Provides accountability and audit trail
 *
 * @property {string} [notes] - Additional notes about the action (max 2000 characters)
 * @business Strongly recommended for COMPLETED actions
 * @compliance Provides context for compliance reviews
 *
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
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

/**
 * @interface FollowUpActionCreationAttributes
 * @description Defines optional fields when creating a new follow-up action
 * @extends FollowUpActionAttributes
 */
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

/**
 * @class FollowUpAction
 * @extends Model
 * @description Sequelize model class for follow-up actions
 *
 * Workflow Summary:
 * 1. Action created linked to incident report (auto-status: PENDING)
 * 2. Action assigned to staff member (assignedTo set)
 * 3. Staff begins work (status → IN_PROGRESS)
 * 4. Staff completes action (status → COMPLETED, auto-timestamps applied)
 * 5. System validates completedBy is set
 * 6. Action retained with incident report for 7 years
 *
 * Priority Guidelines:
 * - URGENT: Medical follow-up, immediate safety concerns (< 24 hours)
 * - HIGH: Parent meetings, insurance claims, compliance reviews (< 48 hours)
 * - MEDIUM: Documentation updates, routine follow-ups (< 1 week)
 * - LOW: General notifications, administrative tasks (< 2 weeks)
 *
 * Associations:
 * - belongsTo: IncidentReport (parent incident)
 * - belongsTo: User (assignedTo - assigned staff member)
 * - belongsTo: User (completedBy - completing staff member)
 *
 * Hooks:
 * - beforeUpdate: Auto-timestamp completedAt when status → COMPLETED
 * - beforeUpdate: Clear completion data if status changes away from COMPLETED
 *
 * @example
 * // Create a follow-up action
 * const action = await FollowUpAction.create({
 *   incidentReportId: 'incident-uuid',
 *   action: 'Schedule follow-up appointment with school nurse',
 *   dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
 *   priority: ActionPriority.HIGH,
 *   assignedTo: 'nurse-uuid'
 * });
 *
 * @example
 * // Complete an action
 * await action.update({
 *   status: ActionStatus.COMPLETED,
 *   completedBy: 'nurse-uuid',
 *   notes: 'Follow-up appointment completed. Student condition stable.'
 * });
 */
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
