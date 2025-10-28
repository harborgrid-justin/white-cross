import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ViolationType {
  HIPAA_BREACH = 'HIPAA_BREACH',
  FERPA_VIOLATION = 'FERPA_VIOLATION',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_LEAK = 'DATA_LEAK',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  PROCEDURE_VIOLATION = 'PROCEDURE_VIOLATION',
  TRAINING_DEFICIENCY = 'TRAINING_DEFICIENCY'
}

export enum ViolationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ViolationStatus {
  REPORTED = 'REPORTED',
  INVESTIGATING = 'INVESTIGATING',
  REMEDIATION_IN_PROGRESS = 'REMEDIATION_IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

@Entity('compliance_violations')
export class ComplianceViolation {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: ViolationType, description: 'Type of violation' })
  @Column({ type: 'enum', enum: ViolationType })
  violationType: ViolationType;

  @ApiProperty({ description: 'Violation title/summary' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ description: 'Detailed description of violation' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ enum: ViolationSeverity, description: 'Severity level' })
  @Column({ type: 'enum', enum: ViolationSeverity })
  severity: ViolationSeverity;

  @ApiProperty({ enum: ViolationStatus, description: 'Current status' })
  @Column({ type: 'enum', enum: ViolationStatus, default: ViolationStatus.REPORTED })
  status: ViolationStatus;

  @ApiProperty({ description: 'User ID who reported the violation' })
  @Column({ type: 'varchar' })
  reportedBy: string;

  @ApiProperty({ description: 'When the violation was discovered' })
  @Column({ type: 'timestamp' })
  discoveredAt: Date;

  @ApiProperty({ description: 'Affected student IDs', required: false })
  @Column({ type: 'jsonb', nullable: true })
  affectedStudents?: string[];

  @ApiProperty({ description: 'Affected data categories', required: false })
  @Column({ type: 'jsonb', nullable: true })
  affectedDataCategories?: string[];

  @ApiProperty({ description: 'Root cause analysis', required: false })
  @Column({ type: 'text', nullable: true })
  rootCause?: string;

  @ApiProperty({ description: 'User ID assigned to investigate', required: false })
  @Column({ type: 'varchar', nullable: true })
  assignedTo?: string;

  @ApiProperty({ description: 'Resolution notes', required: false })
  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;

  @ApiProperty({ description: 'When the violation was resolved', required: false })
  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
