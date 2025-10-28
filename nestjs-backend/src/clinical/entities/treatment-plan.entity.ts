import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TreatmentStatus } from '../enums/treatment-status.enum';
import { ClinicVisit } from './clinic-visit.entity';
import { Prescription } from './prescription.entity';

/**
 * Treatment Plan Entity
 * Represents a comprehensive treatment plan for a student
 *
 * @description
 * Treatment plans document the clinical approach for managing a student's
 * health condition, including diagnosis, goals, interventions, and timeline.
 */
@Entity('treatment_plans')
@Index(['studentId', 'status'])
@Index(['visitId'])
export class TreatmentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'visit_id', type: 'uuid', nullable: true })
  visitId?: string;

  @ManyToOne(() => ClinicVisit, { nullable: true })
  @JoinColumn({ name: 'visit_id' })
  visit?: ClinicVisit;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @Column({ name: 'diagnosis', type: 'text' })
  diagnosis: string;

  @Column({ name: 'treatment_goals', type: 'simple-array' })
  treatmentGoals: string[];

  @Column({ name: 'interventions', type: 'simple-array' })
  interventions: string[];

  @Column({ name: 'medications', type: 'simple-array', nullable: true })
  medications?: string[];

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({
    type: 'enum',
    enum: TreatmentStatus,
    default: TreatmentStatus.DRAFT,
  })
  @Index()
  status: TreatmentStatus;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'review_date', type: 'date', nullable: true })
  reviewDate?: Date;

  @OneToMany(() => Prescription, (prescription) => prescription.treatmentPlan)
  prescriptions?: Prescription[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if treatment plan is currently active
   */
  isActive(): boolean {
    return this.status === TreatmentStatus.ACTIVE;
  }

  /**
   * Calculate duration of treatment plan in days
   */
  getDuration(): number | null {
    if (!this.endDate) return null;
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if review is due
   */
  isReviewDue(): boolean {
    if (!this.reviewDate) return false;
    return new Date() >= this.reviewDate;
  }
}
