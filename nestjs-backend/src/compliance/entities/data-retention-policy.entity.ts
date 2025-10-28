import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum DataRetentionCategory {
  STUDENT_RECORDS = 'STUDENT_RECORDS',
  HEALTH_RECORDS = 'HEALTH_RECORDS',
  MEDICATION_LOGS = 'MEDICATION_LOGS',
  AUDIT_LOGS = 'AUDIT_LOGS',
  CONSENT_FORMS = 'CONSENT_FORMS',
  INCIDENT_REPORTS = 'INCIDENT_REPORTS',
  TRAINING_RECORDS = 'TRAINING_RECORDS'
}

export enum RetentionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

@Entity('data_retention_policies')
export class DataRetentionPolicy {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: DataRetentionCategory, description: 'Data category' })
  @Column({ type: 'enum', enum: DataRetentionCategory })
  category: DataRetentionCategory;

  @ApiProperty({ description: 'Policy description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Retention period in days' })
  @Column({ type: 'int' })
  retentionPeriodDays: number;

  @ApiProperty({ description: 'Legal or regulatory basis for retention period' })
  @Column({ type: 'text' })
  legalBasis: string;

  @ApiProperty({ enum: RetentionStatus, description: 'Policy status' })
  @Column({ type: 'enum', enum: RetentionStatus, default: RetentionStatus.ACTIVE })
  status: RetentionStatus;

  @ApiProperty({ description: 'Auto-delete after retention period' })
  @Column({ type: 'boolean', default: false })
  autoDelete: boolean;

  @ApiProperty({ description: 'Last review date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt?: Date;

  @ApiProperty({ description: 'User ID who last reviewed', required: false })
  @Column({ type: 'varchar', nullable: true })
  lastReviewedBy?: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
