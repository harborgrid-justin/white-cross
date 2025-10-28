/**
 * @fileoverview ComplianceReport Database Model
 * @module database/models/compliance/ComplianceReport
 * @description Sequelize model for structured compliance reporting and audit management.
 * Manages formal compliance reports for HIPAA, FERPA, state health requirements, and
 * medication audits with review workflow and submission tracking.
 *
 * Key Features:
 * - Structured compliance reporting framework for multiple regulations
 * - Tracks findings, recommendations, and corrective actions
 * - Review and approval workflow with timestamps and assignees
 * - Period-based reporting (quarterly, monthly, annual)
 * - Supports HIPAA, FERPA, medication, safety compliance types
 * - Links to ComplianceChecklistItems for detailed requirement tracking
 * - Due date management and submission tracking
 *
 * @security Review workflow ensures report accuracy
 * @security Submitter and reviewer tracking for accountability
 * @compliance HIPAA - Required periodic compliance reporting
 * @compliance FERPA - Educational record compliance reporting
 * @compliance State laws - Medication and safety audits
 *
 * @requires sequelize - ORM for database operations
 * @requires ComplianceReportType - Enum for report classification
 * @requires ComplianceStatus - Enum for workflow status
 *
 * LOC: A1B02AE424
 * WC-GEN-048 | ComplianceReport.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - ComplianceChecklistItem.ts - Links reports to checklist items
 *   - Compliance services - Report generation and submission
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ComplianceReportType, ComplianceStatus } from '../../types/enums';

/**
 * @interface ComplianceReportAttributes
 * @description TypeScript interface defining all ComplianceReport model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {ComplianceReportType} reportType - Type of compliance report
 * @property {string} title - Report title (5-200 chars)
 * @property {string} [description] - Detailed report description (up to 5000 chars)
 * @property {ComplianceStatus} status - Current workflow status
 * @property {string} period - Reporting period (YYYY-QN, YYYY-MM, or YYYY-Month format)
 * @property {any} [findings] - JSONB structured findings data
 * @property {any} [recommendations] - JSONB structured recommendations
 * @property {Date} [dueDate] - Report submission due date
 * @property {Date} [submittedAt] - Submission timestamp
 * @property {string} [submittedBy] - User ID who submitted the report
 * @property {Date} [reviewedAt] - Review completion timestamp
 * @property {string} [reviewedBy] - User ID who reviewed the report
 * @property {string} createdById - User ID who created the report
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
interface ComplianceReportAttributes {
  id: string;
  reportType: ComplianceReportType;
  title: string;
  description?: string;
  status: ComplianceStatus;
  period: string;
  findings?: any;
  recommendations?: any;
  dueDate?: Date;
  submittedAt?: Date;
  submittedBy?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface ComplianceReportCreationAttributes
 * @description Attributes required when creating a new ComplianceReport instance.
 * Extends ComplianceReportAttributes with optional fields that have defaults or are auto-generated.
 */
interface ComplianceReportCreationAttributes
  extends Optional<
    ComplianceReportAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'description'
    | 'findings'
    | 'recommendations'
    | 'dueDate'
    | 'submittedAt'
    | 'submittedBy'
    | 'reviewedAt'
    | 'reviewedBy'
  > {}

/**
 * @class ComplianceReport
 * @extends Model
 * @description ComplianceReport model for formal compliance reporting and audits.
 * Provides structured framework for documenting compliance status, findings,
 * recommendations, and corrective actions for regulatory requirements.
 *
 * @tablename compliance_reports
 *
 * Report Types:
 * - HIPAA: Privacy and Security Rule compliance reports
 * - FERPA: Educational record access compliance
 * - MEDICATION: Medication administration and storage audits
 * - SAFETY: Safety protocol and incident reports
 * - TRAINING: Staff training compliance
 * - GENERAL: General compliance assessments
 *
 * Status Workflow:
 * 1. DRAFT: Report being prepared
 * 2. IN_PROGRESS: Actively collecting data and findings
 * 3. PENDING_REVIEW: Awaiting review and approval
 * 4. APPROVED: Reviewed and approved for submission
 * 5. SUBMITTED: Submitted to regulatory authority or management
 * 6. COMPLETED: Final status after acknowledgment
 *
 * Period Formats:
 * - Quarterly: YYYY-Q1, YYYY-Q2, YYYY-Q3, YYYY-Q4
 * - Monthly: YYYY-01, YYYY-02, etc.
 * - Named: YYYY-January, YYYY-Annual
 *
 * @example
 * // Create quarterly HIPAA compliance report
 * await ComplianceReport.create({
 *   reportType: ComplianceReportType.HIPAA,
 *   title: 'Q1 2024 HIPAA Compliance Report',
 *   description: 'Quarterly assessment of HIPAA Privacy and Security Rule compliance',
 *   status: ComplianceStatus.DRAFT,
 *   period: '2024-Q1',
 *   dueDate: new Date('2024-04-15'),
 *   createdById: 'compliance-officer-uuid'
 * });
 *
 * @example
 * // Submit report for review
 * await report.update({
 *   status: ComplianceStatus.PENDING_REVIEW,
 *   submittedAt: new Date(),
 *   submittedBy: 'compliance-officer-uuid',
 *   findings: { totalIssues: 3, critical: 0, high: 1, medium: 2 },
 *   recommendations: ['Implement MFA', 'Update encryption policy']
 * });
 *
 * @security Tracks submitter and reviewer for accountability
 * @compliance Required for HIPAA and FERPA audits
 */
export class ComplianceReport
  extends Model<ComplianceReportAttributes, ComplianceReportCreationAttributes>
  implements ComplianceReportAttributes
{
  /**
   * @property {string} id - Primary key UUID
   */
  public id!: string;

  /**
   * @property {ComplianceReportType} reportType - Report type
   * @compliance Determines regulatory framework and requirements
   */
  public reportType!: ComplianceReportType;

  /**
   * @property {string} title - Report title
   * @validation 5-200 characters
   */
  public title!: string;

  /**
   * @property {string} description - Detailed description
   * @validation Max 5000 characters
   */
  public description?: string;

  /**
   * @property {ComplianceStatus} status - Workflow status
   * @security Tracks report lifecycle for accountability
   */
  public status!: ComplianceStatus;

  /**
   * @property {string} period - Reporting period
   * @validation Format: YYYY-QN, YYYY-MM, or YYYY-Month
   * @compliance Required for regulatory reporting
   */
  public period!: string;

  /**
   * @property {any} findings - Structured findings
   * @compliance Documents compliance issues and gaps
   */
  public findings?: any;

  /**
   * @property {any} recommendations - Structured recommendations
   * @compliance Documents corrective actions
   */
  public recommendations?: any;

  /**
   * @property {Date} dueDate - Submission due date
   */
  public dueDate?: Date;

  /**
   * @property {Date} submittedAt - Submission timestamp
   * @security Tracks when report was submitted
   */
  public submittedAt?: Date;

  /**
   * @property {string} submittedBy - Submitter user ID
   * @security Accountability for submission
   */
  public submittedBy?: string;

  /**
   * @property {Date} reviewedAt - Review timestamp
   * @security Tracks when report was reviewed
   */
  public reviewedAt?: Date;

  /**
   * @property {string} reviewedBy - Reviewer user ID
   * @security Accountability for review
   */
  public reviewedBy?: string;

  /**
   * @property {string} createdById - Creator user ID
   * @security Accountability for report creation
   */
  public createdById!: string;

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

ComplianceReport.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    reportType: {
      type: DataTypes.ENUM(...Object.values(ComplianceReportType)),
      allowNull: false,
      comment: 'Type of compliance report',
      validate: {
        notNull: {
          msg: 'Report type is required for compliance tracking'
        },
        notEmpty: {
          msg: 'Report type cannot be empty'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Report title',
      validate: {
        notNull: {
          msg: 'Report title is required'
        },
        notEmpty: {
          msg: 'Report title cannot be empty'
        },
        len: {
          args: [5, 200],
          msg: 'Report title must be between 5 and 200 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed report description',
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Report description cannot exceed 5000 characters'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
      allowNull: false,
      comment: 'Current status of the report',
      validate: {
        notNull: {
          msg: 'Report status is required'
        },
        notEmpty: {
          msg: 'Report status cannot be empty'
        }
      }
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Reporting period (e.g., 2024-Q1, 2024-01)',
      validate: {
        notNull: {
          msg: 'Reporting period is required'
        },
        notEmpty: {
          msg: 'Reporting period cannot be empty'
        },
        is: {
          args: /^[0-9]{4}-(Q[1-4]|[0-9]{2}|[A-Za-z]+)$/,
          msg: 'Period must be in format: YYYY-QN (e.g., 2024-Q1) or YYYY-MM (e.g., 2024-01) or YYYY-Month (e.g., 2024-January)'
        }
      }
    },
    findings: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Detailed compliance findings',
    },
    recommendations: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Compliance recommendations',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Report due date',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the report was submitted',
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who submitted the report',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the report was reviewed',
    },
    reviewedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who reviewed the report',
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User ID who created the report',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'compliance_reports',
    timestamps: true,
    indexes: [
      { fields: ['reportType', 'status'] },
      { fields: ['period'] },
      { fields: ['createdById'] },
      { fields: ['dueDate'] },
    ],
  }
);
