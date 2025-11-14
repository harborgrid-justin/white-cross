import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum ReportType {
  HEALTH_REPORT = 'HEALTH_REPORT',
  MEDICATION_REPORT = 'MEDICATION_REPORT',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
  ANALYTICS_REPORT = 'ANALYTICS_REPORT',
}

export enum OutputFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  XLSX = 'XLSX',
  JSON = 'JSON',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ReportExecutionAttributes {
  id: string;
  scheduleId?: string;
  reportType: ReportType;
  outputFormat: OutputFormat;
  parameters?: Record<string, any>;
  status: ReportStatus;
  filePath?: string;
  downloadUrl?: string;
  fileSize?: number;
  recordCount?: number;
  executionTimeMs?: number;
  error?: string;
  executedBy?: string;
  startedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  schedule?: any;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['startedAt', 'DESC']],
  },
}))
@Table({
  tableName: 'report_executions',
  timestamps: false,
  indexes: [
    {
      fields: ['startedAt'],
      name: 'idx_report_execution_started_at',
    },
    {
      fields: ['status', 'startedAt'],
      name: 'idx_report_execution_status_started',
    },
  ],
})
export class ReportExecution
  extends Model<ReportExecutionAttributes>
  implements ReportExecutionAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull
  @ForeignKey(() => require('./report-schedule.model').ReportSchedule)
  @Column({
    type: DataType.UUID,
  })
  scheduleId?: string;

  @BelongsTo(() => require('./report-schedule.model').ReportSchedule, {
    foreignKey: 'scheduleId',
    as: 'schedule',
  })
  declare schedule?: any;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportType)],
    },
    allowNull: false,
  })
  reportType: ReportType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(OutputFormat)],
    },
    allowNull: false,
  })
  outputFormat: OutputFormat;

  @AllowNull
  @Column(DataType.JSONB)
  parameters?: Record<string, any>;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportStatus)],
    },
    allowNull: false,
    defaultValue: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @AllowNull
  @Column({
    type: DataType.STRING(500),
  })
  filePath?: string;

  @AllowNull
  @Column({
    type: DataType.STRING(500),
  })
  downloadUrl?: string;

  @AllowNull
  @Column({
    type: DataType.BIGINT,
  })
  fileSize?: number;

  @AllowNull
  @Column({
    type: DataType.INTEGER,
  })
  recordCount?: number;

  @AllowNull
  @Column({
    type: DataType.INTEGER,
  })
  executionTimeMs?: number;

  @AllowNull
  @Column(DataType.TEXT)
  error?: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
  })
  executedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startedAt: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  completedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  expiresAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ReportExecution) {
    await createModelAuditHook('ReportExecution', instance);
  }
}

// Default export for Sequelize-TypeScript
export default ReportExecution;
