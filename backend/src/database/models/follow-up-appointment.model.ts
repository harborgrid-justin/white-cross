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
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { FollowUpStatus } from '../../clinical/enums/follow-up-status.enum';

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
  originalVisit?: any;
  completedVisit?: any;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'follow_up_appointments',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['studentId', 'status'],
    },
    {
      fields: ['originalVisitId'],
    },
    {
      fields: ['scheduledDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_follow_up_appointment_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_follow_up_appointment_updated_at',
    },
  ],
})
export class FollowUpAppointment
  extends Model<FollowUpAppointmentAttributes>
  implements FollowUpAppointmentAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => require('./clinic-visit.model').ClinicVisit)
  @Column({
    type: DataType.UUID,
  })
  originalVisitId?: string;

  @BelongsTo(() => require('./clinic-visit.model').ClinicVisit, {
    foreignKey: 'originalVisitId',
    as: 'originalVisit',
  })
  declare originalVisit?: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  scheduledBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  scheduledDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(FollowUpStatus)],
    },
    allowNull: false,
    defaultValue: FollowUpStatus.SCHEDULED,
  })
  @Index
  status: FollowUpStatus;

  @AllowNull
  @Column({
    type: DataType.UUID,
  })
  assignedTo?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  reminderSent: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  reminderSentAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  confirmedAt?: Date;

  @AllowNull
  @ForeignKey(() => require('./clinic-visit.model').ClinicVisit)
  @Column({
    type: DataType.UUID,
  })
  completedVisitId?: string;

  @BelongsTo(() => require('./clinic-visit.model').ClinicVisit, {
    foreignKey: 'completedVisitId',
    as: 'completedVisit',
  })
  declare completedVisit?: any;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  completedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  cancelledAt?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  cancellationReason?: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
  })
  rescheduledFromId?: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
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

    const reminderTime = new Date(
      this.scheduledDate.getTime() - reminderHours * 60 * 60 * 1000,
    );
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
    return new Date(
      this.scheduledDate.getTime() + this.durationMinutes * 60 * 1000,
    );
  }

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: FollowUpAppointment) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] FollowUpAppointment ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
