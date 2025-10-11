import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * PolicyAcknowledgment Model
 *
 * HIPAA Compliance: Tracks staff acknowledgment of policy documents.
 * Required to demonstrate that all staff members have reviewed and understood
 * policies, especially HIPAA privacy and security policies.
 *
 * Key Features:
 * - One acknowledgment per user per policy
 * - IP address logging for audit trail
 * - Timestamp tracking for compliance reporting
 * - Links users to specific policy versions
 */
interface PolicyAcknowledgmentAttributes {
  id: string;
  policyId: string;
  userId: string;
  acknowledgedAt: Date;
  ipAddress?: string;
}

interface PolicyAcknowledgmentCreationAttributes
  extends Optional<PolicyAcknowledgmentAttributes, 'id' | 'acknowledgedAt' | 'ipAddress'> {}

export class PolicyAcknowledgment
  extends Model<PolicyAcknowledgmentAttributes, PolicyAcknowledgmentCreationAttributes>
  implements PolicyAcknowledgmentAttributes
{
  public id!: string;
  public policyId!: string;
  public userId!: string;
  public acknowledgedAt!: Date;
  public ipAddress?: string;
}

PolicyAcknowledgment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    policyId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Associated policy document ID',
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User who acknowledged the policy',
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the policy was acknowledged',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address from which acknowledgment was made',
    },
  },
  {
    sequelize,
    tableName: 'policy_acknowledgments',
    timestamps: false,
    indexes: [
      { fields: ['policyId', 'userId'], unique: true },
      { fields: ['userId'] },
      { fields: ['acknowledgedAt'] },
    ],
  }
);
