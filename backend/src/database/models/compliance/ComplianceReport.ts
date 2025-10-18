/**
 * WC-GEN-048 | ComplianceReport.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ComplianceReportType, ComplianceStatus } from '../../types/enums';

/**
 * ComplianceReport Model
 *
 * HIPAA/FERPA Compliance: Manages compliance reporting for healthcare regulations
 * including HIPAA, FERPA, state health requirements, and medication audits.
 *
 * Key Features:
 * - Structured compliance reporting framework
 * - Tracks findings, recommendations, and submission status
 * - Supports multiple compliance frameworks
 * - Maintains review and approval workflow
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

export class ComplianceReport
  extends Model<ComplianceReportAttributes, ComplianceReportCreationAttributes>
  implements ComplianceReportAttributes
{
  public id!: string;
  public reportType!: ComplianceReportType;
  public title!: string;
  public description?: string;
  public status!: ComplianceStatus;
  public period!: string;
  public findings?: any;
  public recommendations?: any;
  public dueDate?: Date;
  public submittedAt?: Date;
  public submittedBy?: string;
  public reviewedAt?: Date;
  public reviewedBy?: string;
  public createdById!: string;
  public readonly createdAt!: Date;
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
