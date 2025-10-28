import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  SecurityIncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '../enums';

/**
 * Security Incident Entity
 * Tracks security incidents, threats, and their investigation/resolution
 */
@Entity('security_incidents')
@Index(['type', 'severity', 'status'])
@Index(['userId'])
@Index(['ipAddress'])
@Index(['detectedAt'])
export class SecurityIncidentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SecurityIncidentType,
  })
  type: SecurityIncidentType;

  @Column({
    type: 'enum',
    enum: IncidentSeverity,
  })
  severity: IncidentSeverity;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.DETECTED,
  })
  status: IncidentStatus;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  resourceAccessed?: string;

  @CreateDateColumn()
  detectedAt: Date;

  @Column()
  detectionMethod: string; // 'automated', 'manual', 'pattern_matching', etc.

  @Column({ type: 'simple-array' })
  indicators: string[]; // List of indicators that triggered detection

  @Column({ type: 'text', nullable: true })
  impact?: string;

  @Column({ nullable: true })
  assignedTo?: string; // User ID of security team member

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @Column({ type: 'simple-array', nullable: true })
  preventiveMeasures?: string[];

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Additional context-specific data

  @UpdateDateColumn()
  updatedAt: Date;
}
