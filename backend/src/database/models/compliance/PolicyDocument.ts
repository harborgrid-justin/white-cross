import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { PolicyCategory, PolicyStatus } from '../../types/enums';

/**
 * PolicyDocument Model
 *
 * HIPAA/FERPA Compliance: Manages organizational policies and procedures required
 * for healthcare compliance. Includes version control, approval workflow, and
 * review scheduling.
 *
 * Key Features:
 * - Version-controlled policy documents
 * - Multiple policy categories (HIPAA, FERPA, medication, safety)
 * - Approval workflow tracking
 * - Effective and review date management
 * - Complete policy content storage
 */
interface PolicyDocumentAttributes {
  id: string;
  title: string;
  category: PolicyCategory;
  content: string;
  version: string;
  effectiveDate: Date;
  reviewDate?: Date;
  status: PolicyStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface PolicyDocumentCreationAttributes
  extends Optional<
    PolicyDocumentAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'reviewDate' | 'approvedBy' | 'approvedAt'
  > {}

export class PolicyDocument
  extends Model<PolicyDocumentAttributes, PolicyDocumentCreationAttributes>
  implements PolicyDocumentAttributes
{
  public id!: string;
  public title!: string;
  public category!: PolicyCategory;
  public content!: string;
  public version!: string;
  public effectiveDate!: Date;
  public reviewDate?: Date;
  public status!: PolicyStatus;
  public approvedBy?: string;
  public approvedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PolicyDocument.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Policy title',
      validate: {
        notNull: {
          msg: 'Policy title is required'
        },
        notEmpty: {
          msg: 'Policy title cannot be empty'
        },
        len: {
          args: [5, 200],
          msg: 'Policy title must be between 5 and 200 characters'
        }
      }
    },
    category: {
      type: DataTypes.ENUM(...Object.values(PolicyCategory)),
      allowNull: false,
      comment: 'Policy category',
      validate: {
        notNull: {
          msg: 'Policy category is required for compliance classification'
        },
        notEmpty: {
          msg: 'Policy category cannot be empty'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Complete policy content',
      validate: {
        notNull: {
          msg: 'Policy content is required'
        },
        notEmpty: {
          msg: 'Policy content cannot be empty'
        },
        len: {
          args: [100, 100000],
          msg: 'Policy content must be between 100 and 100000 characters'
        }
      }
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
      comment: 'Policy version number',
      validate: {
        notNull: {
          msg: 'Version number is required for policy tracking'
        },
        notEmpty: {
          msg: 'Version number cannot be empty'
        },
        is: {
          args: /^[0-9]+\.[0-9]+(\.[0-9]+)?$/,
          msg: 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)'
        }
      }
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the policy becomes effective',
      validate: {
        notNull: {
          msg: 'Effective date is required for policy compliance'
        },
        isDate: {
          msg: 'Effective date must be a valid date'
        }
      }
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Next scheduled review date',
      validate: {
        isDate: {
          msg: 'Review date must be a valid date'
        },
        isAfterEffective(value: Date | null) {
          if (value && this.effectiveDate && value < this.effectiveDate) {
            throw new Error('Review date cannot be before effective date');
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PolicyStatus)),
      allowNull: false,
      defaultValue: PolicyStatus.DRAFT,
      comment: 'Current policy status',
      validate: {
        notNull: {
          msg: 'Policy status is required'
        },
        notEmpty: {
          msg: 'Policy status cannot be empty'
        }
      }
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who approved the policy',
      validate: {
        isUUID: {
          args: 4,
          msg: 'Approved by must be a valid UUID'
        }
      }
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the policy was approved',
      validate: {
        isDate: {
          msg: 'Approval date must be a valid date'
        },
        requiresApprover(value: Date | null) {
          if (value && !this.approvedBy) {
            throw new Error('Approver ID is required when approval date is set');
          }
        },
        notInFuture(value: Date | null) {
          if (value && value > new Date()) {
            throw new Error('Approval date cannot be in the future');
          }
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'policy_documents',
    timestamps: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['effectiveDate'] },
      { fields: ['reviewDate'] },
    ],
  }
);
