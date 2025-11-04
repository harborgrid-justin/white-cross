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
  Scopes,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import { Op } from 'sequelize';

export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
  }

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'appointment_reminders',
  timestamps: true,
  underscored: false
  ,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_appointment_reminder_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_appointment_reminder_updated_at'
    }
  ]})
export class AppointmentReminder extends Model<AppointmentReminderAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Index
  @ForeignKey(() => require('./appointment.model').Appointment)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  appointmentId: string;

  @BelongsTo(() => require('./appointment.model').Appointment)
  declare appointment: any;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MessageType)]
    },
    allowNull: false
  })
  type: MessageType;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  scheduledFor: Date;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReminderStatus)]
    },
    allowNull: false,
    defaultValue: ReminderStatus.SCHEDULED
  })
  status: ReminderStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  sentAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  failureReason?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  message: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare updatedAt?: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: AppointmentReminder) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] AppointmentReminder ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
