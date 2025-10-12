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
      validate: {
        notNull: {
          msg: 'Policy ID is required'
        },
        notEmpty: {
          msg: 'Policy ID cannot be empty'
        },
        isUUID: {
          args: 4,
          msg: 'Policy ID must be a valid UUID'
        }
      }
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User who acknowledged the policy',
      validate: {
        notNull: {
          msg: 'User ID is required for acknowledgment tracking'
        },
        notEmpty: {
          msg: 'User ID cannot be empty'
        },
        isUUID: {
          args: 4,
          msg: 'User ID must be a valid UUID'
        }
      }
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the policy was acknowledged',
      validate: {
        notNull: {
          msg: 'Acknowledgment timestamp is required for compliance'
        },
        isDate: {
          msg: 'Acknowledgment timestamp must be a valid date',
          args: true,
        },
        notInFuture(value: Date) {
          if (value && value > new Date()) {
            throw new Error('Acknowledgment timestamp cannot be in the future');
          }
        }
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address from which acknowledgment was made',
      validate: {
        isValidIP(value: string | null) {
          if (value) {
            const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
            if (!ipv4Pattern.test(value) && !ipv6Pattern.test(value)) {
              throw new Error('IP address must be in valid IPv4 or IPv6 format');
            }
          }
        }
      }
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
