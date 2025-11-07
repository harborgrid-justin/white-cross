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
  HasMany,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export enum ComplianceReportType {
  HIPAA = 'HIPAA',
  FERPA = 'FERPA',
  PRIVACY = 'PRIVACY',
  SECURITY = 'SECURITY',
  BREACH = 'BREACH',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  TRAINING = 'TRAINING',
  AUDIT = 'AUDIT',
}

export enum ComplianceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
}

export interface ComplianceReportAttributes {
  id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'compliance_reports',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['reportType'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['period'],
    },
    {
      fields: ['dueDate'],
    },
    {
      fields: ['createdById'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_compliance_report_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_compliance_report_updated_at',
    },
  ],
})
export class ComplianceReport
  extends Model<ComplianceReportAttributes>
  implements ComplianceReportAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ComplianceReportType)],
    },
    allowNull: false,
  })
  reportType: ComplianceReportType;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ComplianceStatus)],
    },
    allowNull: false,
    defaultValue: ComplianceStatus.PENDING,
  })
  status: ComplianceStatus;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  period: string;

  @AllowNull
  @Column(DataType.JSONB)
  findings?: any;

  @AllowNull
  @Column(DataType.JSONB)
  recommendations?: any;

  @AllowNull
  @Column(DataType.DATE)
  dueDate?: Date;

  @AllowNull
  @Column(DataType.DATE)
  submittedAt?: Date;

  @AllowNull
  @Column(DataType.UUID)
  submittedBy?: string;

  @AllowNull
  @Column(DataType.DATE)
  reviewedAt?: Date;

  @AllowNull
  @Column(DataType.UUID)
  reviewedBy?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdById: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @HasMany(
    () => require('./compliance-checklist-item.model').ComplianceChecklistItem,
  )
  declare checklistItems?: any[];

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ComplianceReport) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] ComplianceReport ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
