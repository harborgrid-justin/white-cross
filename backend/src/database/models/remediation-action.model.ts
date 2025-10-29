import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum RemediationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RemediationStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  DEFERRED = 'DEFERRED'
}

export interface RemediationActionAttributes {
  id?: string;
  violationId: string;
  action: string;
  priority: RemediationPriority;
  status: RemediationStatus;
  assignedTo: string;
  dueDate: Date;
  implementationNotes?: string;
  verificationNotes?: string;
  completedAt?: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'remediation_actions',
  timestamps: true,
  indexes: [
    {
      fields: ['violation_id'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['assigned_to'],
    },
    {
      fields: ['due_date'],
    },
    {
      fields: ['completed_at'],
    },
  ],
})
export class RemediationAction extends Model<RemediationActionAttributes> implements RemediationActionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'violation_id',
  })
  violationId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  action: string;

  @Column({
    type: DataType.ENUM(...Object.values(RemediationPriority)),
    allowNull: false,
    defaultValue: RemediationPriority.MEDIUM,
  })
  priority: RemediationPriority;

  @Column({
    type: DataType.ENUM(...Object.values(RemediationStatus)),
    allowNull: false,
    defaultValue: RemediationStatus.PLANNED,
  })
  status: RemediationStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'assigned_to',
  })
  assignedTo: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'due_date',
  })
  dueDate: Date;

  @AllowNull
  @Column(DataType.TEXT)
  implementationNotes?: string;

  @AllowNull
  @Column(DataType.TEXT)
  verificationNotes?: string;

  @AllowNull
  @Column(DataType.DATE)
  completedAt?: Date;

  @AllowNull
  @Column(DataType.UUID)
  verifiedBy?: string;

  @AllowNull
  @Column(DataType.DATE)
  verifiedAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}