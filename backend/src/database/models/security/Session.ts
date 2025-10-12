import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * Session Model
 *
 * HIPAA Compliance: Manages user authentication sessions with security tracking.
 * Essential for maintaining secure access to PHI and enabling session-based auditing.
 *
 * Key Features:
 * - Unique session tokens for authentication
 * - Expiration tracking for automatic timeout
 * - IP address and user agent logging for security
 * - Last activity tracking for idle timeout
 * - Supports multiple concurrent sessions per user
 */
interface SessionAttributes {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  lastActivity: Date;
  createdAt: Date;
}

interface SessionCreationAttributes
  extends Optional<SessionAttributes, 'id' | 'createdAt' | 'lastActivity' | 'ipAddress' | 'userAgent'> {}

export class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: string;
  public userId!: string;
  public token!: string;
  public ipAddress?: string;
  public userAgent?: string;
  public expiresAt!: Date;
  public lastActivity!: Date;
  public readonly createdAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User ID for this session',
      validate: {
        notEmpty: {
          msg: 'User ID cannot be empty'
        },
        isUUID: {
          args: 4,
          msg: 'User ID must be a valid UUID'
        },
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique session token',
      validate: {
        notEmpty: {
          msg: 'Session token cannot be empty'
        },
        len: {
          args: [32, 512],
          msg: 'Session token must be between 32 and 512 characters'
        },
      },
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the session',
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
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the session expires',
      validate: {
        isDate: true,
        isFutureDate(value: Date) {
          if (new Date(value) <= new Date()) {
            throw new Error('Session expiration must be in the future');
          }
        },
        isReasonableExpiration(value: Date) {
          const maxExpirationDays = 30;
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + maxExpirationDays);
          if (new Date(value) > maxDate) {
            throw new Error(`Session expiration cannot be more than ${maxExpirationDays} days in the future`);
          }
        },
      },
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Last activity timestamp for idle timeout',
      validate: {
        isDate: true,
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
    tableName: 'sessions',
    timestamps: false,
    indexes: [
      { fields: ['token'], unique: true },
      { fields: ['userId'] },
      { fields: ['expiresAt'] },
      { fields: ['lastActivity'] },
    ],
  }
);
