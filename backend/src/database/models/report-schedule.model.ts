import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ReportTemplate } from './report-template.model';
import { ReportType, OutputFormat } from './report-execution.model';

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  CUSTOM = 'custom'
  }

export interface ReportScheduleAttributes {
  id: string;
  name: string;
  reportType: ReportType;
  templateId?: string;
  frequency: ScheduleFrequency;
  cronExpression?: string;
  outputFormat: OutputFormat;
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
  timestamps: true
  })
export class ReportSchedule extends Model<ReportScheduleAttributes> implements ReportScheduleAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ReportType) as string[])),
    allowNull: false
  })
  reportType: ReportType;

  @AllowNull
  @ForeignKey(() => require('./report-template.model').ReportTemplate)
  @Column({
    type: DataType.UUID
  })
  templateId?: string;

  @BelongsTo(() => require('./report-template.model').ReportTemplate, { foreignKey: 'templateId', as: 'template' })
  declare template?: any;

  @Column({
    type: DataType.ENUM(...(Object.values(ScheduleFrequency) as string[])),
    allowNull: false
  })
  frequency: ScheduleFrequency;

  @AllowNull
  @Column({
    type: DataType.STRING(100)
  })
  cronExpression?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(OutputFormat) as string[])),
    allowNull: false,
    defaultValue: OutputFormat.PDF
  })
  outputFormat: OutputFormat;

  @AllowNull
  @Column(DataType.JSONB)
  parameters?: Record<string, any>;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: []
  })
  recipients: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  lastExecutedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  nextExecutionAt?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  executionCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  failureCount: number;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  lastError?: string;

  @AllowNull
  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
