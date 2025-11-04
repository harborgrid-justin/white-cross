import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo
  } ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'policy_acknowledgments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['policyId', 'userId']
  },,
    {
      fields: ['createdAt'],
      name: 'idx_policy_acknowledgment_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_policy_acknowledgment_updated_at'
    }
  ]
  })
export class PolicyAcknowledgment extends Model<PolicyAcknowledgmentAttributes> implements PolicyAcknowledgmentAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./policy-document.model').PolicyDocument)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  policyId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date()
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
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] PolicyAcknowledgment ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
