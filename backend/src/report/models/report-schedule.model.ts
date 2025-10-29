import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ReportTemplate } from './report-template.model';
import { ReportType, OutputFormat, ScheduleFrequency } from '../constants/report.constants';

/**
 * Report Schedule Model
 * Manages scheduled/automated report generation
 */
@Table({
  tableName: 'report_schedules',
  timestamps: true,
})
export class ReportSchedule extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ReportType) as string[])),
    allowNull: false,
  })
  reportType: ReportType;

  @ForeignKey(() => ReportTemplate)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  templateId?: string;

  @BelongsTo(() => ReportTemplate)
  template?: ReportTemplate;

  @Column({
    type: DataType.ENUM(...(Object.values(ScheduleFrequency) as string[])),
    allowNull: false,
  })
  frequency: ScheduleFrequency;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  cronExpression?: string;

  @Default(OutputFormat.PDF)
  @Column({
    type: DataType.ENUM(...(Object.values(OutputFormat) as string[])),
    allowNull: false,
  })
  outputFormat: OutputFormat;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  parameters?: Record<string, any>;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  recipients: string[];

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastExecutedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  nextExecutionAt?: Date;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  executionCount: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  failureCount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  lastError?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdBy?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;
}