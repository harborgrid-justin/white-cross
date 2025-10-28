import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportSchedule } from './report-schedule.entity';
import { ReportType, OutputFormat, ReportStatus } from '../constants/report.constants';

/**
 * Report Execution Entity
 * Tracks individual report generation executions
 */
@Entity('report_executions')
export class ReportExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  scheduleId: string;

  @ManyToOne(() => ReportSchedule, { nullable: true })
  @JoinColumn({ name: 'scheduleId' })
  schedule: ReportSchedule;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  reportType: ReportType;

  @Column({
    type: 'enum',
    enum: OutputFormat,
  })
  outputFormat: OutputFormat;

  @Column({ type: 'jsonb', nullable: true })
  parameters: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  filePath: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  downloadUrl: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ type: 'int', nullable: true })
  recordCount: number;

  @Column({ type: 'int', nullable: true })
  executionTimeMs: number;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'uuid', nullable: true })
  executedBy: string;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;
}
