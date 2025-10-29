import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ClinicVisit } from './clinic-visit.model';

export enum FollowUpStatus {
  /** Follow-up is scheduled */
  SCHEDULED = 'scheduled',

  /** Reminder sent to student */
  REMINDED = 'reminded',

  /** Student confirmed attendance */
  CONFIRMED = 'confirmed',

  /** Follow-up completed */
  COMPLETED = 'completed',

  /** Student missed appointment */
  MISSED = 'missed',

  /** Appointment cancelled */
  CANCELLED = 'cancelled',

  /** Appointment rescheduled */
  RESCHEDULED = 'rescheduled',
}

export interface FollowUpAppointmentAttributes {
  id: string;
  studentId: string;
  originalVisitId?: string;
  scheduledBy: string;
  scheduledDate: Date;
  durationMinutes: number;
  reason: string;
  type: string;
  status: FollowUpStatus;
  assignedTo?: string;
  reminderSent: boolean;
  reminderSentAt?: Date;
  confirmedAt?: Date;
  completedVisitId?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  rescheduledFromId?: string;
  rescheduledToId?: string;
  notes?: string;
  priority: string;
  createdAt?: Date;
  updatedAt?: Date;
  originalVisit?: ClinicVisit;
  completedVisit?: ClinicVisit;
}

@Table({
  tableName: 'follow_up_appointments',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id', 'status'],
    },
    {
      fields: ['original_visit_id'],
    },
    {
      fields: ['scheduled_date'],
    },
  ],
})
export class FollowUpAppointment extends Model<FollowUpAppointmentAttributes> implements FollowUpAppointmentAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => ClinicVisit)
  @Column({
    type: DataType.UUID,
    field: 'original_visit_id',
  })
  originalVisitId?: string;

  @BelongsTo(() => ClinicVisit, { foreignKey: 'originalVisitId', as: 'originalVisit' })
  originalVisit?: ClinicVisit;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'scheduled_by',
  })
  scheduledBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'scheduled_date',
  })
  @Index
  scheduledDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
    field: 'duration_minutes',
  })
  durationMinutes: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reason: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.ENUM(...Object.values(FollowUpStatus)),
    allowNull: false,
    defaultValue: FollowUpStatus.SCHEDULED,
  })
  @Index
  status: FollowUpStatus;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'assigned_to',
  })
  assignedTo?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'reminder_sent',
  })
  reminderSent: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'reminder_sent_at',
  })
  reminderSentAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'confirmed_at',
  })
  confirmedAt?: Date;

  @AllowNull
  @ForeignKey(() => ClinicVisit)
  @Column({
    type: DataType.UUID,
    field: 'completed_visit_id',
  })
  completedVisitId?: string;

  @BelongsTo(() => ClinicVisit, { foreignKey: 'completedVisitId', as: 'completedVisit' })
  completedVisit?: ClinicVisit;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'completed_at',
  })
  completedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'cancelled_at',
  })
  cancelledAt?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'cancellation_reason',
  })
  cancellationReason?: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'rescheduled_from_id',
  })
  rescheduledFromId?: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'rescheduled_to_id',
  })
  rescheduledToId?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'normal',
  })
  priority: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

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
