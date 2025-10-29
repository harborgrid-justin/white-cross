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
import { ReportTemplate, ReportType, OutputFormat } from './report-template.model';

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  CUSTOM = 'custom',
}

export interface ReportScheduleAttributes {
  id: string;
  name: string;
  reportType: string;
  templateId?: string;
  frequency: ScheduleFrequency;
  cronExpression?: string;
  outputFormat: string;
  parameters?: Record<string, any>;
  recipients: string[];
  isActive: boolean;
  lastExecutedAt?: Date;
  nextExecutionAt?: Date;
  executionCount: number;
  failureCount: number;
  lastError?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  template?: ReportTemplate;
}

@Table({
  tableName: 'report_schedules',
  timestamps: true,
})
export class ReportSchedule extends Model<ReportScheduleAttributes> implements ReportScheduleAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ReportType) as string[])),
    allowNull: false,
    field: 'report_type',
  })
  reportType: string;

  @AllowNull
  @ForeignKey(() => ReportTemplate)
  @Column({
    type: DataType.UUID,
    field: 'template_id',
  })
  templateId?: string;

  @BelongsTo(() => ReportTemplate, { foreignKey: 'templateId', as: 'template' })
  template?: ReportTemplate;

  @Column({
    type: DataType.ENUM(...(Object.values(ScheduleFrequency) as string[])),
    allowNull: false,
  })
  frequency: ScheduleFrequency;

  @AllowNull
  @Column({
    type: DataType.STRING(100),
    field: 'cron_expression',
  })
  cronExpression?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(OutputFormat) as string[])),
    allowNull: false,
    defaultValue: OutputFormat.PDF,
    field: 'output_format',
  })
  outputFormat: string;

  @AllowNull
  @Column(DataType.JSONB)
  parameters?: Record<string, any>;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  recipients: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'last_executed_at',
  })
  lastExecutedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'next_execution_at',
  })
  nextExecutionAt?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'execution_count',
  })
  executionCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'failure_count',
  })
  failureCount: number;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'last_error',
  })
  lastError?: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'created_by',
  })
  createdBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
