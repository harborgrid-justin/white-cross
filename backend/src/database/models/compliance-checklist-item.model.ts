import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ComplianceReport } from './compliance-report.model';

export enum ComplianceCategory {
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  HIPAA_SECURITY = 'HIPAA_SECURITY',
  FERPA = 'FERPA',
  MEDICATION = 'MEDICATION',
  SAFETY = 'SAFETY',
  TRAINING = 'TRAINING',
  DOCUMENTATION = 'DOCUMENTATION'
}

export enum ChecklistItemStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  FAILED = 'FAILED'
}

export interface ComplianceChecklistItemAttributes {
  id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'compliance_checklist_items',
  timestamps: true,
  indexes: [
    {
      fields: ['category'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['due_date'],
    },
    {
      fields: ['completed_at'],
    },
    {
      fields: ['report_id'],
    },
  ],
})
export class ComplianceChecklistItem extends Model<ComplianceChecklistItemAttributes> implements ComplianceChecklistItemAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  requirement: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ComplianceCategory)),
    allowNull: false,
  })
  category: ComplianceCategory;

  @Column({
    type: DataType.ENUM(...Object.values(ChecklistItemStatus)),
    allowNull: false,
    defaultValue: ChecklistItemStatus.PENDING,
  })
  status: ChecklistItemStatus;

  @AllowNull
  @Column(DataType.TEXT)
  evidence?: string;

  @AllowNull
  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull
  @Column(DataType.DATE)
  dueDate?: Date;

  @AllowNull
  @Column(DataType.DATE)
  completedAt?: Date;

  @AllowNull
  @Column(DataType.UUID)
  completedBy?: string;

  @ForeignKey(() => ComplianceReport)
  @AllowNull
  @Column(DataType.UUID)
  reportId?: string;

  @BelongsTo(() => ComplianceReport)
  report?: ComplianceReport;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
