import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum RemediationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum RemediationStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  DEFERRED = 'DEFERRED',
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'remediation_actions',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['violationId'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['assignedTo'],
    },
    {
      fields: ['dueDate'],
    },
    {
      fields: ['completedAt'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_remediation_action_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_remediation_action_updated_at',
    },
  ],
})
export class RemediationAction
  extends Model<RemediationActionAttributes>
  implements RemediationActionAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  violationId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  action: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RemediationPriority)],
    },
    allowNull: false,
    defaultValue: RemediationPriority.MEDIUM,
  })
  priority: RemediationPriority;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RemediationStatus)],
    },
    allowNull: false,
    defaultValue: RemediationStatus.PLANNED,
  })
  status: RemediationStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  assignedTo: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: RemediationAction) {
    await createModelAuditHook('RemediationAction', instance);
  }
}
