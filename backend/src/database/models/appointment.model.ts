import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiHideProperty } from '@nestjs/swagger';
import { Op, Optional } from 'sequelize';
import type { User } from './user.model';
import type { Student } from './student.model';
import type { AppointmentReminder } from './appointment-reminder.model';

export enum AppointmentType {
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  INJURY_ASSESSMENT = 'INJURY_ASSESSMENT',
  ILLNESS_EVALUATION = 'ILLNESS_EVALUATION',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  EMERGENCY = 'EMERGENCY',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface AppointmentAttributes {
  id: string;
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration: number;
  status: AppointmentStatus;
  reason: string;
  notes?: string | null;
  recurringGroupId?: string | null;
  recurringFrequency?: string | null;
  recurringEndDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentCreationAttributes
  extends Optional<
    AppointmentAttributes,
    | 'id'
    | 'duration'
    | 'status'
    | 'notes'
    | 'recurringGroupId'
    | 'recurringFrequency'
    | 'recurringEndDate'
    | 'createdAt'
    | 'updatedAt'
  > {}

@Scopes(() => ({
  upcoming: {
    where: {
      scheduledAt: {
        [Op.gte]: new Date(),
      },
      status: {
        [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
      },
    },
    order: [['scheduledAt', 'ASC']],
  },
  past: {
    where: {
      scheduledAt: {
        [Op.lt]: new Date(),
      },
    },
    order: [['scheduledAt', 'DESC']],
  },
  today: {
    where: {
      scheduledAt: {
        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    order: [['scheduledAt', 'ASC']],
  },
  byStatus: (status: AppointmentStatus) => ({
    where: { status },
    order: [['scheduledAt', 'DESC']],
  }),
  byNurse: (nurseId: string) => ({
    where: { nurseId },
    order: [['scheduledAt', 'ASC']],
  }),
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['scheduledAt', 'DESC']],
  }),
  emergency: {
    where: {
      type: AppointmentType.EMERGENCY,
      status: {
        [Op.ne]: AppointmentStatus.CANCELLED,
      },
    },
    order: [['scheduledAt', 'DESC']],
  },
  recurring: {
    where: {
      recurringGroupId: {
        [Op.ne]: null,
      },
    },
  },
}))
@Table({
  tableName: 'appointments',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    // Composite indexes for common query patterns
    {
      fields: ['studentId', 'scheduledAt'],
      name: 'idx_appointments_student_scheduled',
    },
    {
      fields: ['nurseId', 'scheduledAt'],
      name: 'idx_appointments_nurse_scheduled',
    },
    {
      fields: ['status', 'scheduledAt'],
      name: 'idx_appointments_status_scheduled',
    },
    {
      fields: ['studentId', 'status', 'scheduledAt'],
      name: 'idx_appointments_student_status_scheduled',
    },
    {
      fields: ['type', 'status', 'scheduledAt'],
      name: 'idx_appointments_type_status_scheduled',
    },
    {
      fields: ['recurringGroupId'],
      name: 'idx_appointments_recurring_group',
    },
    {
      fields: ['nurseId', 'scheduledAt', 'status'],
      name: 'idx_appointments_nurse_scheduled_status',
    },
    {
      fields: ['createdAt'],
      name: 'idx_appointments_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_appointments_updated_at',
    },
  ],
})
export class Appointment extends Model<
  AppointmentAttributes,
  AppointmentCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Foreign key to students table - appointment patient',
    references: {
      model: 'students',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  studentId: string;

  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Foreign key to users table - assigned nurse',
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  nurseId: string;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'nurseId',
    as: 'nurse',
    constraints: true,
  })
  declare nurse?: User;

  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
    constraints: true,
  })
  declare student?: Student;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AppointmentType)],
    },
    allowNull: false,
  })
  type: AppointmentType;

  /**
   * Alias for 'type' field - used for DTO compatibility
   * @returns The appointment type
   */
  get appointmentType(): AppointmentType {
    return this.type;
  }

  set appointmentType(value: AppointmentType) {
    this.type = value;
  }

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledAt: Date;

  /**
   * Alias for 'scheduledAt' field - used for DTO compatibility and legacy code
   * @returns The scheduled date and time
   */
  get appointmentDate(): Date {
    return this.scheduledAt;
  }

  set appointmentDate(value: Date) {
    this.scheduledAt = value;
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: 15,
      max: 120,
    },
    comment: 'Duration in minutes',
  })
  duration: number;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AppointmentStatus)],
    },
    allowNull: false,
    defaultValue: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    validate: {
      len: [3, 500],
    },
  })
  reason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    validate: {
      len: [0, 5000],
    },
  })
  notes?: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Group ID for recurring appointments',
  })
  recurringGroupId?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Frequency: DAILY, WEEKLY, MONTHLY, YEARLY',
  })
  recurringFrequency?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'End date for recurring appointments',
  })
  recurringEndDate?: Date;

  @HasMany(() => require('./appointment-reminder.model').AppointmentReminder, {
    foreignKey: 'appointmentId',
    as: 'reminders'
  })
  @ApiHideProperty()
  declare reminders?: any[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  /**
   * Virtual attribute: Check if appointment is upcoming
   */
  get isUpcoming(): boolean {
    return (
      this.scheduledAt > new Date() &&
      [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(
        this.status,
      )
    );
  }

  /**
   * Virtual attribute: Check if appointment is today
   */
  get isToday(): boolean {
    const today = new Date();
    const apptDate = new Date(this.scheduledAt);
    return apptDate.toDateString() === today.toDateString();
  }

  /**
   * Virtual attribute: Minutes until appointment
   */
  get minutesUntil(): number {
    return Math.floor((this.scheduledAt.getTime() - Date.now()) / (1000 * 60));
  }

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Appointment, options: any) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const { logModelPHIAccess } = await import(
        '@/database/services/model-audit-helper.service.js'
      );
      const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
      await logModelPHIAccess(
        'Appointment',
        instance.id,
        action,
        changedFields,
        options?.transaction,
      );
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateScheduledDate(instance: Appointment) {
    if (
      instance.status === AppointmentStatus.SCHEDULED &&
      instance.scheduledAt < new Date()
    ) {
      throw new Error('Cannot schedule appointment in the past');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateRecurringData(instance: Appointment) {
    if (instance.recurringGroupId && !instance.recurringFrequency) {
      throw new Error('Recurring appointments must have a frequency');
    }
    if (
      instance.recurringEndDate &&
      instance.recurringEndDate < instance.scheduledAt
    ) {
      throw new Error('Recurring end date must be after scheduled date');
    }
  }
}
