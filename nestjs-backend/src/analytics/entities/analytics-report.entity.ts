import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ReportType, ReportFormat, ReportStatus, ComplianceStatus } from '../enums';

/**
 * Analytics Report Entity
 * Stores generated compliance and analytics reports
 */
@Entity('analytics_reports')
@Index(['schoolId', 'reportType'])
@Index(['generatedDate'])
export class AnalyticsReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  reportType: ReportType;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('timestamp')
  periodStart: Date;

  @Column('timestamp')
  periodEnd: Date;

  @Column('timestamp')
  @Index()
  generatedDate: Date;

  @Column({ nullable: true })
  @Index()
  schoolId?: string;

  @Column({ nullable: true })
  schoolName?: string;

  @Column('json')
  summary: {
    totalRecords: number;
    compliantRecords: number;
    nonCompliantRecords: number;
    complianceRate: number;
    status: ComplianceStatus;
  };

  @Column('json')
  sections: any[];

  @Column('json')
  findings: any[];

  @Column('json')
  recommendations: string[];

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({
    type: 'enum',
    enum: ReportFormat,
  })
  format: ReportFormat;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column('int', { nullable: true })
  fileSize?: number;

  @Column()
  generatedBy: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column('timestamp', { nullable: true })
  reviewedAt?: Date;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column('timestamp', { nullable: true })
  approvalDate?: Date;

  @Column('json', { nullable: true })
  distributionList?: string[];

  @Column('timestamp', { nullable: true })
  sentAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
