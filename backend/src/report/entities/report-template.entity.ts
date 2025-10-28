import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportType, OutputFormat } from '../constants/report.constants';

/**
 * Report Template Entity
 * Stores reusable report templates with query configurations
 */
@Entity('report_templates')
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  reportType: ReportType;

  @Column({ type: 'jsonb', nullable: true })
  queryConfiguration: Record<string, any>;

  @Column({
    type: 'enum',
    enum: OutputFormat,
    default: OutputFormat.PDF,
  })
  defaultOutputFormat: OutputFormat;

  @Column({ type: 'jsonb', nullable: true })
  formatOptions: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
