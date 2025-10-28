import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PolicyAcknowledgment } from './policy-acknowledgment.entity';

export enum PolicyCategory {
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  HIPAA_SECURITY = 'HIPAA_SECURITY',
  FERPA = 'FERPA',
  DATA_RETENTION = 'DATA_RETENTION',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  TRAINING = 'TRAINING'
}

export enum PolicyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SUPERSEDED = 'SUPERSEDED'
}

@Entity('policy_documents')
export class PolicyDocument {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Policy title (5-200 chars)' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ enum: PolicyCategory, description: 'Policy category' })
  @Column({ type: 'enum', enum: PolicyCategory })
  category: PolicyCategory;

  @ApiProperty({ description: 'Complete policy content (100-100000 chars)' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Policy version number (e.g., 1.0)' })
  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version: string;

  @ApiProperty({ description: 'When the policy becomes effective' })
  @Column({ type: 'timestamp' })
  effectiveDate: Date;

  @ApiProperty({ description: 'Next scheduled review date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  reviewDate?: Date;

  @ApiProperty({ enum: PolicyStatus, description: 'Current policy status' })
  @Column({ type: 'enum', enum: PolicyStatus, default: PolicyStatus.DRAFT })
  status: PolicyStatus;

  @ApiProperty({ description: 'User ID who approved the policy', required: false })
  @Column({ type: 'varchar', nullable: true })
  approvedBy?: string;

  @ApiProperty({ description: 'When the policy was approved', required: false })
  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PolicyAcknowledgment, ack => ack.policy)
  acknowledgments: PolicyAcknowledgment[];
}
