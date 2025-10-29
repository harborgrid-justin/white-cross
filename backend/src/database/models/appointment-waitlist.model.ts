import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { AppointmentType } from './appointment.model';

export enum WaitlistPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum WaitlistStatus {
  WAITING = 'WAITING',
  NOTIFIED = 'NOTIFIED',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface AppointmentWaitlistAttributes {
  id?: string;
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: Date;
  duration: number;
  priority: WaitlistPriority;
  reason: string;
  notes?: string;
  status: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'appointment_waitlist',
  timestamps: true,
  underscored: true,
})
export class AppointmentWaitlist extends Model<AppointmentWaitlistAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  nurseId?: string;

  @BelongsTo(() => require('./user.model').User)
  declare nurse: any;

  @Column({
    type: DataType.ENUM(...(Object.values(AppointmentType) as string[])),
    allowNull: false,
  })
  type: AppointmentType;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  preferredDate?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
    comment: 'Duration in minutes',
  })
  duration: number;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(WaitlistPriority) as string[])),
    allowNull: false,
    defaultValue: WaitlistPriority.NORMAL,
  })
  priority: WaitlistPriority;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  reason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(WaitlistStatus) as string[])),
    allowNull: false,
    defaultValue: WaitlistStatus.WAITING,
  })
  status: WaitlistStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  notifiedAt?: Date;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt?: Date;

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
