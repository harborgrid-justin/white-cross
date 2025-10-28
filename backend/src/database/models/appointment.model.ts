import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { User } from './user.model';
import { AppointmentReminder } from './appointment-reminder.model';
import { AppointmentWaitlist } from './appointment-waitlist.model';

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
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration: number;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  recurringGroupId?: string;
  recurringFrequency?: string;
  recurringEndDate?: Date;
}

@Table({
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
})
export class Appointment extends Model<AppointmentAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Foreign key to students table - appointment patient',
  })
  studentId: string;

  @Index
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Foreign key to users table - assigned nurse',
  })
  nurseId: string;

  @BelongsTo(() => User)
  nurse: User;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(AppointmentType)),
    allowNull: false,
  })
  type: AppointmentType;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledAt: Date;

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
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
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

  @HasMany(() => AppointmentReminder)
  reminders: AppointmentReminder[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  // Computed property for student relation (will be populated via raw queries)
  student?: any;
}
