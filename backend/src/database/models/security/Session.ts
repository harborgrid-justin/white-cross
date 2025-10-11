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
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique session token',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the session',
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User agent string',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the session expires',
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Last activity timestamp for idle timeout',
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
