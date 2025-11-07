import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ReportSchedule } from './report-schedule.model';
import { OutputFormat, ReportStatus, ReportType } from '../constants/report.constants';

/**
 * Report Execution Model
 * Tracks individual report generation executions
 */
@Table({
  tableName: 'report_executions',
  timestamps: false, // Custom timestamps
})
export class ReportExecution extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @ForeignKey(() => ReportSchedule)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  scheduleId?: string;

  @BelongsTo(() => ReportSchedule)
  schedule?: ReportSchedule;

  @Column({
    type: DataType.ENUM(...(Object.values(ReportType) as string[])),
    allowNull: false,
  })
  reportType!: ReportType;

  @Column({
    type: DataType.ENUM(...(Object.values(OutputFormat) as string[])),
    allowNull: false,
  })
  outputFormat!: OutputFormat;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  parameters?: Record<string, any>;

  @Default(ReportStatus.PENDING)
  @Column({
    type: DataType.ENUM(...(Object.values(ReportStatus) as string[])),
    allowNull: false,
  })
  status!: ReportStatus;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  filePath?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  downloadUrl?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  fileSize?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  recordCount?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  executionTimeMs?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  error?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  executedBy?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startedAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt?: Date;
}
