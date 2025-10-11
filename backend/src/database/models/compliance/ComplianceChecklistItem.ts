import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ComplianceCategory, ChecklistItemStatus } from '../../types/enums';

/**
 * ComplianceChecklistItem Model
 *
 * HIPAA/FERPA Compliance: Individual checklist items for compliance verification.
 * Each item represents a specific requirement that must be met for regulatory compliance.
 *
 * Key Features:
 * - Granular tracking of compliance requirements
 * - Evidence collection and documentation
 * - Completion tracking with assignee and due dates
 * - Links to parent compliance reports
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

export class ComplianceChecklistItem
  extends Model<ComplianceChecklistItemAttributes, ComplianceChecklistItemCreationAttributes>
  implements ComplianceChecklistItemAttributes
{
  public id!: string;
  public requirement!: string;
  public description?: string;
  public category!: ComplianceCategory;
  public status!: ChecklistItemStatus;
  public evidence?: string;
  public notes?: string;
  public dueDate?: Date;
  public completedAt?: Date;
  public completedBy?: string;
  public reportId?: string;
  public readonly createdAt!: Date;
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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed requirement description',
    },
    category: {
      type: DataTypes.ENUM(...Object.values(ComplianceCategory)),
      allowNull: false,
      comment: 'Compliance category',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ChecklistItemStatus)),
      allowNull: false,
      defaultValue: ChecklistItemStatus.PENDING,
      comment: 'Current status of the checklist item',
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
