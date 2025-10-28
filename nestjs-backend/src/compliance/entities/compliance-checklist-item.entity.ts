import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ComplianceReport } from './compliance-report.entity';

export enum ComplianceCategory {
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  HIPAA_SECURITY = 'HIPAA_SECURITY',
  FERPA = 'FERPA',
  MEDICATION = 'MEDICATION',
  SAFETY = 'SAFETY',
  TRAINING = 'TRAINING',
  DOCUMENTATION = 'DOCUMENTATION'
}

export enum ChecklistItemStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  FAILED = 'FAILED'
}

@Entity('compliance_checklist_items')
export class ComplianceChecklistItem {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Compliance requirement description (5-500 chars)' })
  @Column({ type: 'varchar', length: 500 })
  requirement: string;

  @ApiProperty({ description: 'Detailed requirement explanation', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: ComplianceCategory, description: 'Compliance category' })
  @Column({ type: 'enum', enum: ComplianceCategory })
  category: ComplianceCategory;

  @ApiProperty({ enum: ChecklistItemStatus, description: 'Current status' })
  @Column({ type: 'enum', enum: ChecklistItemStatus, default: ChecklistItemStatus.PENDING })
  status: ChecklistItemStatus;

  @ApiProperty({ description: 'URL or description of compliance evidence', required: false })
  @Column({ type: 'text', nullable: true })
  evidence?: string;

  @ApiProperty({ description: 'Additional implementation notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Completion due date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @ApiProperty({ description: 'Completion timestamp', required: false })
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ description: 'User ID who completed the item', required: false })
  @Column({ type: 'varchar', nullable: true })
  completedBy?: string;

  @ApiProperty({ description: 'Associated compliance report ID', required: false })
  @Column({ type: 'varchar', nullable: true })
  reportId?: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ComplianceReport, report => report.checklistItems, { nullable: true })
  @JoinColumn({ name: 'reportId' })
  report?: ComplianceReport;
}
