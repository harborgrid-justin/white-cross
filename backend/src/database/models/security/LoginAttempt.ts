import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * LoginAttempt Model
 *
 * HIPAA Compliance: Tracks all login attempts (successful and failed) for security
 * monitoring and compliance reporting. Required for detecting unauthorized access
 * attempts and implementing account lockout policies.
 *
 * Key Features:
 * - Records all login attempts (success and failure)
 * - IP address and user agent tracking
 * - Failure reason logging for security analysis
 * - Supports brute force attack detection
 * - Enables compliance reporting on access patterns
 */
interface LoginAttemptAttributes {
  id: string;
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
  createdAt: Date;
}

interface LoginAttemptCreationAttributes
  extends Optional<LoginAttemptAttributes, 'id' | 'createdAt' | 'ipAddress' | 'userAgent' | 'failureReason'> {}

export class LoginAttempt
  extends Model<LoginAttemptAttributes, LoginAttemptCreationAttributes>
  implements LoginAttemptAttributes
{
  public id!: string;
  public email!: string;
  public success!: boolean;
  public ipAddress?: string;
  public userAgent?: string;
  public failureReason?: string;
  public readonly createdAt!: Date;
}

LoginAttempt.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Email address used for login attempt',
      validate: {
        notEmpty: {
          msg: 'Email cannot be empty'
        },
        isEmail: {
          msg: 'Must be a valid email address'
        },
        len: {
          args: [5, 255],
          msg: 'Email must be between 5 and 255 characters'
        },
      },
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: 'Whether the login attempt was successful',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the login attempt',
      validate: {
        isValidIp(value: string | undefined) {
          if (!value) return;
          // IPv4 or IPv6 validation
          const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
          const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
          if (!ipv4Regex.test(value) && !ipv6Regex.test(value)) {
            throw new Error('Invalid IP address format');
          }
        },
      },
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User agent string',
      validate: {
        len: {
          args: [0, 500],
          msg: 'User agent string must not exceed 500 characters'
        },
      },
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Reason for login failure (if applicable)',
      validate: {
        len: {
          args: [0, 255],
          msg: 'Failure reason must not exceed 255 characters'
        },
        requiredForFailedAttempts(value: string | undefined) {
          if (!this.success && !value) {
            throw new Error('Failure reason is required for failed login attempts');
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'login_attempts',
    timestamps: false,
    indexes: [
      { fields: ['email', 'createdAt'] },
      { fields: ['ipAddress', 'createdAt'] },
      { fields: ['success'] },
      { fields: ['createdAt'] },
    ],
  }
);
