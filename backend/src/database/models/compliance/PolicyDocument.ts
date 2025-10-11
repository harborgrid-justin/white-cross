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
    },
    category: {
      type: DataTypes.ENUM(...Object.values(PolicyCategory)),
      allowNull: false,
      comment: 'Policy category',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Complete policy content',
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
      comment: 'Policy version number',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the policy becomes effective',
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Next scheduled review date',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PolicyStatus)),
      allowNull: false,
      defaultValue: PolicyStatus.DRAFT,
      comment: 'Current policy status',
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who approved the policy',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the policy was approved',
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
