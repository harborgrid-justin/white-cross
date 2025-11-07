import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  BeforeCreate,
  CreatedAt,
  UpdatedAt,
  Scopes,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export enum ReportType {
  COMPLIANCE = 'COMPLIANCE',
  HEALTH_TRENDS = 'HEALTH_TRENDS',
  INCIDENT_ANALYSIS = 'INCIDENT_ANALYSIS',
  MEDICATION_USAGE = 'MEDICATION_USAGE',
  APPOINTMENT_UTILIZATION = 'APPOINTMENT_UTILIZATION',
  STUDENT_HEALTH_OVERVIEW = 'STUDENT_HEALTH_OVERVIEW',
  NURSE_WORKLOAD = 'NURSE_WORKLOAD',
  EQUIPMENT_MAINTENANCE = 'EQUIPMENT_MAINTENANCE',
  BUDGET_ANALYSIS = 'BUDGET_ANALYSIS',
  CUSTOM = 'CUSTOM',
}

export enum ReportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  JSON = 'JSON',
  HTML = 'HTML',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export interface AnalyticsReportAttributes {
  id: string;
  reportType: ReportType;
  title: string;
  description?: string;
  periodStart: Date;
  periodEnd: Date;
  generatedDate: Date;
  schoolId?: string;
  schoolName?: string;
  summary: {
    totalRecords: number;
    compliantRecords: number;
    nonCompliantRecords: number;
    complianceRate: number;
    status: ComplianceStatus;
  };
  sections: any[];
  findings: any[];
  recommendations: string[];
  status: ReportStatus;
  format: ReportFormat;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  distributionList?: string[];
  sentAt?: Date;
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
  tableName: 'analytics_reports',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['schoolId', 'reportType'],
    },
    {
      fields: ['generatedDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_analytics_report_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_analytics_report_updated_at',
    },
  ],
})
export class AnalyticsReport
  extends Model<AnalyticsReportAttributes>
  implements AnalyticsReportAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportType)],
    },
    allowNull: false,
  })
  reportType: ReportType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  periodStart: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  periodEnd: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  generatedDate: Date;

  @Column(DataType.UUID)
  schoolId?: string;

  @Column(DataType.STRING(255))
  schoolName?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  summary: {
    totalRecords: number;
    compliantRecords: number;
    nonCompliantRecords: number;
    complianceRate: number;
    status: ComplianceStatus;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  sections: any[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  findings: any[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  recommendations: string[];

  @Default(ReportStatus.PENDING)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportStatus)],
    },
    allowNull: false,
  })
  status: ReportStatus;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportFormat)],
    },
    allowNull: false,
  })
  format: ReportFormat;

  @Column(DataType.STRING(255))
  fileUrl?: string;

  @Column(DataType.INTEGER)
  fileSize?: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  generatedBy: string;

  @Column(DataType.UUID)
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewedAt?: Date;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvalDate?: Date;

  @Column(DataType.JSONB)
  distributionList?: string[];

  @Column(DataType.DATE)
  sentAt?: Date;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: AnalyticsReport) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] AnalyticsReport ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
