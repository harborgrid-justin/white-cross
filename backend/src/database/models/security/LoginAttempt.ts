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
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User agent string',
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Reason for login failure (if applicable)',
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
