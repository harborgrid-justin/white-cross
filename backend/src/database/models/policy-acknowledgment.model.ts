import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { PolicyDocument } from './policy-document.model';

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
      fields: ['policy_id', 'user_id'],
    },
  ],
})
export class PolicyAcknowledgment extends Model<PolicyAcknowledgmentAttributes> implements PolicyAcknowledgmentAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => PolicyDocument)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'policy_id',
  })
  policyId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
    field: 'acknowledged_at',
  })
  acknowledgedAt: Date;

  @AllowNull
  @Column(DataType.STRING(45))
  ipAddress?: string;

  @BelongsTo(() => PolicyDocument)
  policy: PolicyDocument;
}
