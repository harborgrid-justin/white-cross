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
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface PolicyAcknowledgmentAttributes {
  id?: string;
  policyId: string;
  userId: string;
  acknowledgedAt: Date;
  ipAddress?: string;
}

@Table({
  tableName: 'policy_acknowledgments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['policyId', 'userId']
  },
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
}
