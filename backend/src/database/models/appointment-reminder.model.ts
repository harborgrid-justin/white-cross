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
import { Appointment } from './appointment.model';

export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
}

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface AppointmentReminderAttributes {
  id?: string;
  appointmentId: string;
  type: MessageType;
  scheduledFor: Date;
  status: ReminderStatus;
  sentAt?: Date;
  failureReason?: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'appointment_reminders',
  timestamps: true,
  underscored: true,
})
export class AppointmentReminder extends Model<AppointmentReminderAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Index
  @ForeignKey(() => Appointment)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  appointmentId: string;

  @BelongsTo(() => Appointment)
  appointment: Appointment;

  @Column({
    type: DataType.ENUM(...(Object.values(MessageType) as string[])),
    allowNull: false,
  })
  type: MessageType;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledFor: Date;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(ReminderStatus) as string[])),
    allowNull: false,
    defaultValue: ReminderStatus.SCHEDULED,
  })
  status: ReminderStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  sentAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  failureReason?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

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
}
