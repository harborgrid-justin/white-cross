import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ConditionStatus } from '../enums';

/**
 * ChronicCondition Entity
 *
 * Represents a student's chronic health condition with comprehensive tracking
 * of diagnosis, care management, medications, accommodations, and review scheduling.
 *
 * Supports HIPAA-compliant PHI handling, ICD-10 coding, IEP/504 accommodations,
 * and care plan documentation.
 */
@Entity('chronic_conditions')
@Index(['studentId', 'isActive'])
@Index(['status', 'isActive'])
@Index(['nextReviewDate'])
export class ChronicCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'student_id' })
  @Index()
  studentId: string;

  @Column({ type: 'uuid', name: 'health_record_id', nullable: true })
  healthRecordId: string | null;

  @Column({ type: 'varchar', length: 200 })
  condition: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'icd_code' })
  icdCode: string | null;

  @Column({ type: 'date', name: 'diagnosed_date' })
  diagnosedDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'diagnosed_by' })
  diagnosedBy: string | null;

  @Column({
    type: 'enum',
    enum: ConditionStatus,
    default: ConditionStatus.ACTIVE,
  })
  @Index()
  status: ConditionStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  severity: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true, name: 'care_plan' })
  carePlan: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  medications: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  restrictions: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  triggers: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  accommodations: string[];

  @Column({ type: 'text', nullable: true, name: 'emergency_protocol' })
  emergencyProtocol: string | null;

  @Column({ type: 'date', nullable: true, name: 'last_review_date' })
  lastReviewDate: Date | null;

  @Column({ type: 'date', nullable: true, name: 'next_review_date' })
  @Index()
  nextReviewDate: Date | null;

  @Column({ type: 'boolean', default: false, name: 'requires_iep' })
  @Index()
  requiresIEP: boolean;

  @Column({ type: 'boolean', default: false, name: 'requires_504' })
  @Index()
  requires504: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Note: Relations to Student and HealthRecord will be added when those entities are available
  // @ManyToOne(() => Student, { nullable: false })
  // @JoinColumn({ name: 'student_id' })
  // student: Student;

  // @ManyToOne(() => HealthRecord, { nullable: true })
  // @JoinColumn({ name: 'health_record_id' })
  // healthRecord: HealthRecord | null;
}
