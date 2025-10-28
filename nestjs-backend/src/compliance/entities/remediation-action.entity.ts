import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum RemediationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RemediationStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  DEFERRED = 'DEFERRED'
}

@Entity('remediation_actions')
export class RemediationAction {
  @ApiProperty({ description: 'Primary key UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Related violation ID' })
  @Column({ type: 'varchar' })
  violationId: string;

  @ApiProperty({ description: 'Action description' })
  @Column({ type: 'text' })
  action: string;

  @ApiProperty({ enum: RemediationPriority, description: 'Priority level' })
  @Column({ type: 'enum', enum: RemediationPriority, default: RemediationPriority.MEDIUM })
  priority: RemediationPriority;

  @ApiProperty({ enum: RemediationStatus, description: 'Current status' })
  @Column({ type: 'enum', enum: RemediationStatus, default: RemediationStatus.PLANNED })
  status: RemediationStatus;

  @ApiProperty({ description: 'User ID responsible for action' })
  @Column({ type: 'varchar' })
  assignedTo: string;

  @ApiProperty({ description: 'Target completion date' })
  @Column({ type: 'timestamp' })
  dueDate: Date;

  @ApiProperty({ description: 'Implementation notes', required: false })
  @Column({ type: 'text', nullable: true })
  implementationNotes?: string;

  @ApiProperty({ description: 'Verification notes', required: false })
  @Column({ type: 'text', nullable: true })
  verificationNotes?: string;

  @ApiProperty({ description: 'When action was completed', required: false })
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ description: 'User ID who verified completion', required: false })
  @Column({ type: 'varchar', nullable: true })
  verifiedBy?: string;

  @ApiProperty({ description: 'When action was verified', required: false })
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
