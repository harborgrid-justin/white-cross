import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface PolicyAcknowledgmentAttributes {
  id?: string;
  policyId: string;
  userId: string;
  acknowledgedAt: Date;
  ipAddress?: string;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['acknowledgedAt', 'DESC']],
  },
}))
@Table({
  tableName: 'policy_acknowledgments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['policyId', 'userId'],
    },
  ],
})
export class PolicyAcknowledgment
  extends Model<PolicyAcknowledgmentAttributes>
  implements PolicyAcknowledgmentAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./policy-document.model').PolicyDocument)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  policyId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
  })
  acknowledgedAt: Date;

  @AllowNull
  @Column(DataType.STRING(45))
  ipAddress?: string;

  @BelongsTo(() => require('./policy-document.model').PolicyDocument)
  declare policy: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: PolicyAcknowledgment) {
    await createModelAuditHook('PolicyAcknowledgment', instance);
  }
}

// Default export for Sequelize-TypeScript
export default PolicyAcknowledgment;
