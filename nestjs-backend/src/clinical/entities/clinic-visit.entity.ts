import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { VisitDisposition } from '../enums/visit-disposition.enum';

/**
 * Clinic Visit Entity
 * Tracks student clinic visits with check-in/check-out workflow
 */
@Entity('clinic_visits')
export class ClinicVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'check_in_time', type: 'timestamp' })
  @Index()
  checkInTime: Date;

  @Column({ name: 'check_out_time', type: 'timestamp', nullable: true })
  @Index()
  checkOutTime?: Date;

  @Column({ name: 'reason_for_visit', type: 'simple-array' })
  reasonForVisit: string[];

  @Column({ name: 'symptoms', type: 'simple-array', nullable: true })
  symptoms?: string[];

  @Column({ name: 'treatment', type: 'text', nullable: true })
  treatment?: string;

  @Column({
    type: 'enum',
    enum: VisitDisposition,
    name: 'disposition',
  })
  @Index()
  disposition: VisitDisposition;

  @Column({ name: 'classes_missed', type: 'simple-array', nullable: true })
  classesMissed?: string[];

  @Column({ name: 'minutes_missed', type: 'int', nullable: true })
  minutesMissed?: number;

  @Column({ name: 'attended_by', type: 'uuid' })
  @Index()
  attendedBy: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Calculate visit duration in minutes
   * @returns duration in minutes or null if not checked out
   */
  getDuration(): number | null {
    if (!this.checkOutTime) return null;
    return Math.floor((this.checkOutTime.getTime() - this.checkInTime.getTime()) / 60000);
  }

  /**
   * Check if student is still in clinic
   * @returns true if visit is active (not checked out)
   */
  isStillInClinic(): boolean {
    return !this.checkOutTime;
  }
}
