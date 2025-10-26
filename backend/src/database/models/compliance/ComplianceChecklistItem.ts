/**
 * @fileoverview ComplianceChecklistItem Database Model
 * @module database/models/compliance/ComplianceChecklistItem
 * @description Sequelize model for tracking individual compliance checklist items.
 * Provides granular compliance requirement tracking with evidence collection, due date
 * management, and completion verification for HIPAA, FERPA, and regulatory compliance.
 *
 * Key Features:
 * - Granular tracking of individual compliance requirements
 * - Evidence collection and documentation storage
 * - Completion tracking with assignee and timestamp
 * - Due date management for timely compliance
 * - Links to parent compliance reports for aggregation
 * - Status workflow (PENDING → IN_PROGRESS → COMPLETED)
 * - Category-based organization (HIPAA, FERPA, medication, safety)
 *
 * @security Evidence tracking for compliance verification
 * @security Completion timestamp and user tracking for accountability
 * @compliance HIPAA - Tracks specific HIPAA requirement compliance
 * @compliance FERPA - Tracks educational record compliance
 * @compliance Used for audit preparation and regulatory reporting
 *
 * @requires sequelize - ORM for database operations
 * @requires ComplianceCategory - Enum for categorizing requirements
 * @requires ChecklistItemStatus - Enum for tracking item status
 *
 * LOC: DEC8643068
 * WC-GEN-047 | ComplianceChecklistItem.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Compliance reporting services
 *   - Audit preparation services
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ComplianceCategory, ChecklistItemStatus } from '../../types/enums';

/**
 * @interface ComplianceChecklistItemAttributes
 * @description TypeScript interface defining all ComplianceChecklistItem model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} requirement - Short requirement description (5-500 chars)
 * @property {string} [description] - Detailed requirement explanation (up to 5000 chars)
 * @property {ComplianceCategory} category - Compliance category (HIPAA, FERPA, etc.)
 * @property {ChecklistItemStatus} status - Current status (PENDING, IN_PROGRESS, COMPLETED)
 * @property {string} [evidence] - URL or description of compliance evidence
 * @property {string} [notes] - Additional notes for implementation or completion
 * @property {Date} [dueDate] - Due date for completion
 * @property {Date} [completedAt] - Completion timestamp
 * @property {string} [completedBy] - User ID who completed the item
 * @property {string} [reportId] - Associated ComplianceReport ID
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
interface ComplianceChecklistItemAttributes {
  id: string;
  requirement: string;
  description?: string;
  category: ComplianceCategory;
  status: ChecklistItemStatus;
  evidence?: string;
  notes?: string;
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  reportId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface ComplianceChecklistItemCreationAttributes
 * @description Attributes required when creating a new ComplianceChecklistItem instance.
 * Extends ComplianceChecklistItemAttributes with optional fields that have defaults or are auto-generated.
 */
interface ComplianceChecklistItemCreationAttributes
  extends Optional<
    ComplianceChecklistItemAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'description'
    | 'status'
    | 'evidence'
    | 'notes'
    | 'dueDate'
    | 'completedAt'
    | 'completedBy'
    | 'reportId'
  > {}

/**
 * @class ComplianceChecklistItem
 * @extends Model
 * @description ComplianceChecklistItem model for tracking individual compliance requirements.
 * Provides detailed tracking of specific compliance tasks with evidence collection and
 * completion verification for regulatory compliance and audit preparation.
 *
 * @tablename compliance_checklist_items
 *
 * Compliance Categories:
 * - HIPAA: Privacy Rule, Security Rule, Breach Notification requirements
 * - FERPA: Educational record access and privacy requirements
 * - MEDICATION: Medication administration and storage compliance
 * - SAFETY: School safety and emergency preparedness
 * - TRAINING: Staff training and certification requirements
 * - DOCUMENTATION: Record-keeping and documentation requirements
 *
 * Status Workflow:
 * - PENDING: Requirement identified, not yet started
 * - IN_PROGRESS: Actively working on compliance
 * - COMPLETED: Requirement met with evidence
 * - OVERDUE: Past due date without completion
 *
 * Evidence Types:
 * - Document URLs (policy documents, training certificates)
 * - Audit trail references (audit log queries, access reports)
 * - Implementation notes (configuration details, procedures)
 * - External system references (third-party compliance tools)
 *
 * @example
 * // Create a HIPAA compliance checklist item
 * await ComplianceChecklistItem.create({
 *   requirement: 'Implement password complexity requirements',
 *   description: 'Configure system to require 12+ char passwords with mixed case, numbers, symbols',
 *   category: ComplianceCategory.HIPAA,
 *   status: ChecklistItemStatus.PENDING,
 *   dueDate: new Date('2024-12-31'),
 *   reportId: 'compliance-report-uuid'
 * });
 *
 * @example
 * // Mark item as completed with evidence
 * const item = await ComplianceChecklistItem.findByPk('item-uuid');
 * await item.update({
 *   status: ChecklistItemStatus.COMPLETED,
 *   completedAt: new Date(),
 *   completedBy: 'admin-user-uuid',
 *   evidence: 'https://docs.example.com/password-policy.pdf'
 * });
 *
 * @example
 * // Query overdue items for a specific category
 * const overdueItems = await ComplianceChecklistItem.findAll({
 *   where: {
 *     category: ComplianceCategory.HIPAA,
 *     status: { [Op.ne]: ChecklistItemStatus.COMPLETED },
 *     dueDate: { [Op.lt]: new Date() }
 *   }
 * });
 *
 * @security Evidence tracking for audit trails
 * @compliance Used for HIPAA and FERPA audit preparation
 */
export class ComplianceChecklistItem
  extends Model<ComplianceChecklistItemAttributes, ComplianceChecklistItemCreationAttributes>
  implements ComplianceChecklistItemAttributes
{
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for checklist item
   */
  public id!: string;

  /**
   * @property {string} requirement - Requirement description
   * @validation 5-500 characters
   * @compliance Brief summary of compliance requirement
   */
  public requirement!: string;

  /**
   * @property {string} description - Detailed requirement explanation
   * @validation Max 5000 characters
   * @compliance Detailed implementation guidance
   */
  public description?: string;

  /**
   * @property {ComplianceCategory} category - Compliance category
   * @compliance Used to group requirements by regulatory framework
   */
  public category!: ComplianceCategory;

  /**
   * @property {ChecklistItemStatus} status - Current status
   * @default ChecklistItemStatus.PENDING
   * @security Tracks completion for audit readiness
   */
  public status!: ChecklistItemStatus;

  /**
   * @property {string} evidence - Compliance evidence
   * @compliance URL or description of proof of compliance
   * @security Required for audit verification
   */
  public evidence?: string;

  /**
   * @property {string} notes - Additional notes
   * @compliance Implementation notes or special considerations
   */
  public notes?: string;

  /**
   * @property {Date} dueDate - Completion due date
   * @compliance Used to ensure timely compliance
   */
  public dueDate?: Date;

  /**
   * @property {Date} completedAt - Completion timestamp
   * @security Tracks when requirement was met
   */
  public completedAt?: Date;

  /**
   * @property {string} completedBy - Completer user ID
   * @security Accountability for compliance verification
   */
  public completedBy?: string;

  /**
   * @property {string} reportId - Associated report ID
   * @compliance Links to parent ComplianceReport for aggregation
   */
  public reportId?: string;

  /**
   * @property {Date} createdAt - Creation timestamp
   * @readonly
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly
   */
  public readonly updatedAt!: Date;
}

ComplianceChecklistItem.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Compliance requirement description',
      validate: {
        notNull: {
          msg: 'Requirement description is required'
        },
        notEmpty: {
          msg: 'Requirement description cannot be empty'
        },
        len: {
          args: [5, 500],
          msg: 'Requirement description must be between 5 and 500 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed requirement description',
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Detailed description cannot exceed 5000 characters'
        }
      }
    },
    category: {
      type: DataTypes.ENUM(...Object.values(ComplianceCategory)),
      allowNull: false,
      comment: 'Compliance category',
      validate: {
        notNull: {
          msg: 'Compliance category is required'
        },
        notEmpty: {
          msg: 'Compliance category cannot be empty'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ChecklistItemStatus)),
      allowNull: false,
      defaultValue: ChecklistItemStatus.PENDING,
      comment: 'Current status of the checklist item',
      validate: {
        notNull: {
          msg: 'Checklist item status is required'
        },
        notEmpty: {
          msg: 'Checklist item status cannot be empty'
        }
      }
    },
    evidence: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL or description of compliance evidence',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Due date for completion',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the item was completed',
    },
    completedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who completed the item',
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Associated compliance report ID',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'compliance_checklist_items',
    timestamps: true,
    indexes: [
      { fields: ['reportId'] },
      { fields: ['category', 'status'] },
      { fields: ['dueDate'] },
      { fields: ['status'] },
    ],
  }
);
