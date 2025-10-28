import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FollowUpStatus } from '../enums/follow-up-status.enum';
import { ClinicVisit } from './clinic-visit.entity';

/**
 * Follow-up Appointment Entity
 * Manages scheduled follow-up appointments for students
 *
 * @description
 * Tracks follow-up appointments that result from clinical visits,
 * including scheduling, reminders, confirmations, and completion status.
 */
@Entity('follow_up_appointments')
@Index(['studentId', 'status'])
@Index(['originalVisitId'])
@Index(['scheduledDate'])
export class FollowUpAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'original_visit_id', type: 'uuid', nullable: true })
  originalVisitId?: string;

  @ManyToOne(() => ClinicVisit, { nullable: true })
  @JoinColumn({ name: 'original_visit_id' })
  originalVisit?: ClinicVisit;

  @Column({ name: 'scheduled_by', type: 'uuid' })
  scheduledBy: string;

  @Column({ name: 'scheduled_date', type: 'timestamp' })
  scheduledDate: Date;

  @Column({ name: 'duration_minutes', type: 'int', default: 30 })
  durationMinutes: number;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'type', type: 'varchar', length: 100 })
  type: string; // routine, urgent, post-treatment, recheck, etc.

  @Column({
    type: 'enum',
    enum: FollowUpStatus,
    default: FollowUpStatus.SCHEDULED,
  })
  @Index()
  status: FollowUpStatus;

  @Column({ name: 'assigned_to', type: 'uuid', nullable: true })
  assignedTo?: string;

  @Column({ name: 'reminder_sent', type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ name: 'reminder_sent_at', type: 'timestamp', nullable: true })
  reminderSentAt?: Date;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ name: 'completed_visit_id', type: 'uuid', nullable: true })
  completedVisitId?: string;

  @ManyToOne(() => ClinicVisit, { nullable: true })
  @JoinColumn({ name: 'completed_visit_id' })
  completedVisit?: ClinicVisit;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ name: 'rescheduled_from_id', type: 'uuid', nullable: true })
  rescheduledFromId?: string;

  @Column({ name: 'rescheduled_to_id', type: 'uuid', nullable: true })
  rescheduledToId?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'priority', type: 'varchar', length: 50, default: 'normal' })
  priority: string; // low, normal, high, urgent

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if appointment is in the past
   */
  isPast(): boolean {
    return new Date() > this.scheduledDate;
  }

  /**
   * Check if appointment is upcoming
   */
  isUpcoming(): boolean {
    return (
      new Date() < this.scheduledDate &&
      (this.status === FollowUpStatus.SCHEDULED ||
       this.status === FollowUpStatus.CONFIRMED ||
       this.status === FollowUpStatus.REMINDED)
    );
  }

  /**
   * Check if reminder should be sent
   * @param reminderHours Hours before appointment to send reminder
   */
  shouldSendReminder(reminderHours: number = 24): boolean {
    if (this.reminderSent) return false;
    if (this.status !== FollowUpStatus.SCHEDULED) return false;

    const reminderTime = new Date(this.scheduledDate.getTime() - reminderHours * 60 * 60 * 1000);
    return new Date() >= reminderTime;
  }

  /**
   * Mark reminder as sent
   */
  markReminderSent(): void {
    this.reminderSent = true;
    this.reminderSentAt = new Date();
    this.status = FollowUpStatus.REMINDED;
  }

  /**
   * Confirm appointment
   */
  confirm(): void {
    this.status = FollowUpStatus.CONFIRMED;
    this.confirmedAt = new Date();
  }

  /**
   * Complete appointment
   */
  complete(visitId: string): void {
    this.status = FollowUpStatus.COMPLETED;
    this.completedAt = new Date();
    this.completedVisitId = visitId;
  }

  /**
   * Cancel appointment
   */
  cancel(reason: string): void {
    this.status = FollowUpStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
  }

  /**
   * Get appointment end time
   */
  getEndTime(): Date {
    return new Date(this.scheduledDate.getTime() + this.durationMinutes * 60 * 1000);
  }
}
