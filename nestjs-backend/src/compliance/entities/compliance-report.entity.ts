import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ComplianceChecklistItem } from './compliance-checklist-item.entity';

export enum ComplianceReportType {
  HIPAA = 'HIPAA',
  FERPA = 'FERPA',
  PRIVACY = 'PRIVACY',
  SECURITY = 'SECURITY',
  BREACH = 'BREACH',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  TRAINING = 'TRAINING',
  AUDIT = 'AUDIT'
}

export enum ComplianceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  NEEDS_REVIEW = 'NEEDS_REVIEW'
}

@Entity('compliance_reports')
export class ComplianceReport {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: ComplianceReportType, description: 'Type of compliance report' })
  @Column({ type: 'enum', enum: ComplianceReportType })
  reportType: ComplianceReportType;

  @ApiProperty({ description: 'Report title (5-200 chars)' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ description: 'Detailed report description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: ComplianceStatus, description: 'Current workflow status' })
  @Column({ type: 'enum', enum: ComplianceStatus, default: ComplianceStatus.PENDING })
  status: ComplianceStatus;

  @ApiProperty({ description: 'Reporting period (e.g., 2024-Q1, 2024-01)' })
  @Column({ type: 'varchar', length: 50 })
  period: string;

  @ApiProperty({ description: 'Structured findings data', required: false })
  @Column({ type: 'jsonb', nullable: true })
  findings?: any;

  @ApiProperty({ description: 'Structured recommendations', required: false })
  @Column({ type: 'jsonb', nullable: true })
  recommendations?: any;

  @ApiProperty({ description: 'Report submission due date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @ApiProperty({ description: 'Submission timestamp', required: false })
  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @ApiProperty({ description: 'User ID who submitted the report', required: false })
  @Column({ type: 'varchar', nullable: true })
  submittedBy?: string;

  @ApiProperty({ description: 'Review completion timestamp', required: false })
  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @ApiProperty({ description: 'User ID who reviewed the report', required: false })
  @Column({ type: 'varchar', nullable: true })
  reviewedBy?: string;

  @ApiProperty({ description: 'User ID who created the report' })
  @Column({ type: 'varchar' })
  createdById: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ComplianceChecklistItem, item => item.report)
  checklistItems: ComplianceChecklistItem[];
}
