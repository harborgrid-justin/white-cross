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
;
;
;
;

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
  appointmentType?: AppointmentType; // Alias for type
  scheduledAt: Date;
  appointmentDate?: Date; // Alias for scheduledAt
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
    field: 'studentId',
    comment: 'Foreign key to students table - appointment patient',
  })
  studentId: string;

  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'nurseId',
    comment: 'Foreign key to users table - assigned nurse',
  })
  nurseId: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
  declare nurse: any;

  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student: any;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(AppointmentType) as string[])),
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
    field: 'scheduledAt',
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
    type: DataType.ENUM(...(Object.values(AppointmentStatus) as string[])),
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
    field: 'recurringGroupId',
    comment: 'Group ID for recurring appointments',
  })
  recurringGroupId?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'recurringFrequency',
    comment: 'Frequency: DAILY, WEEKLY, MONTHLY, YEARLY',
  })
  recurringFrequency?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'recurringEndDate',
    comment: 'End date for recurring appointments',
  })
  recurringEndDate?: Date;

  @HasMany(() => require('./appointment-reminder.model').AppointmentReminder)
  declare reminders: any[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  declare updatedAt?: Date;


}
