import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { AppointmentType } from './appointment.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'appointment_waitlist',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_appointment_waitlist_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_appointment_waitlist_updated_at',
    },
  ],
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AppointmentType)],
    },
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(WaitlistPriority)],
    },
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(WaitlistStatus)],
    },
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
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt?: Date;

  // Computed property for student relation (will be populated via raw queries)
  student?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: AppointmentWaitlist) {
    await createModelAuditHook('AppointmentWaitlist', instance);
  }
}

// Default export for Sequelize-TypeScript
export default AppointmentWaitlist;
