import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MessageType, ReminderStatus } from '../../types/enums';

/**
 * AppointmentReminder Model
 * Manages automated appointment reminders sent via email, SMS, or push notifications.
 */

interface AppointmentReminderAttributes {
  id: string;
  appointmentId: string;
  type: MessageType;
  scheduledFor: Date;
  status: ReminderStatus;
  sentAt?: Date;
  failureReason?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentReminderCreationAttributes
  extends Optional<
    AppointmentReminderAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'status' | 'sentAt' | 'failureReason'
  > {}

export class AppointmentReminder
  extends Model<AppointmentReminderAttributes, AppointmentReminderCreationAttributes>
  implements AppointmentReminderAttributes
{
  public id!: string;
  public appointmentId!: string;
  public type!: MessageType;
  public scheduledFor!: Date;
  public status!: ReminderStatus;
  public sentAt?: Date;
  public failureReason?: string;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AppointmentReminder.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    appointmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MessageType)),
      allowNull: false,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ReminderStatus)),
      allowNull: false,
      defaultValue: ReminderStatus.SCHEDULED,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'appointment_reminders',
    timestamps: true,
    indexes: [
      { fields: ['appointmentId'] },
      { fields: ['status', 'scheduledFor'] },
      { fields: ['scheduledFor'] },
    ],
  }
);
