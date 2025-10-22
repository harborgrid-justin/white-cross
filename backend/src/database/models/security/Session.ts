/**
 * @fileoverview Session Database Model
 * @module database/models/security/Session
 * @description Sequelize model for user authentication session management.
 * Manages active user sessions with JWT tokens, expiration tracking, and security monitoring
 * for secure PHI access control and compliance auditing.
 *
 * Key Features:
 * - Unique session tokens for JWT-based authentication
 * - Expiration tracking for automatic timeout (configurable, max 30 days)
 * - IP address and user agent logging for security monitoring
 * - Last activity tracking for idle timeout detection
 * - Supports multiple concurrent sessions per user
 * - Session invalidation on password change or logout
 *
 * @security Sessions expire automatically based on configured timeout
 * @security IP address and user agent tracked for anomaly detection
 * @security Session tokens must be cryptographically secure (32-512 characters)
 * @compliance HIPAA - Secure session management for PHI access
 * @compliance HIPAA - Automatic timeout to prevent unauthorized access
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: 4C58ADD7C0
 * WC-GEN-094 | Session.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - User.ts - Sessions belong to users
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Authentication middleware - Session validation
 *   - Authorization services - User session verification
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface SessionAttributes
 * @description TypeScript interface defining all Session model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} userId - Foreign key to User model
 * @property {string} token - Unique JWT session token (cryptographically secure)
 * @property {string} [ipAddress] - IP address where session was created
 * @property {string} [userAgent] - User agent string for device/browser identification
 * @property {Date} expiresAt - Session expiration timestamp (max 30 days from creation)
 * @property {Date} lastActivity - Last activity timestamp for idle timeout detection
 * @property {Date} createdAt - Session creation timestamp
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

/**
 * @interface SessionCreationAttributes
 * @description Attributes required when creating a new Session instance.
 * Extends SessionAttributes with optional fields that have defaults or are auto-generated.
 */
interface SessionCreationAttributes
  extends Optional<SessionAttributes, 'id' | 'createdAt' | 'lastActivity' | 'ipAddress' | 'userAgent'> {}

/**
 * @class Session
 * @extends Model
 * @description Session model for JWT-based authentication and session management.
 * Tracks active user sessions with security monitoring and automatic expiration.
 *
 * @tablename sessions
 *
 * Session Management:
 * - JWT tokens stored in this table for server-side validation
 * - Sessions expire automatically based on expiresAt timestamp
 * - Idle timeout detected via lastActivity timestamp
 * - Sessions invalidated on password change (via User.passwordChangedAfter)
 * - Manual logout removes session from database
 * - Multiple concurrent sessions supported per user
 *
 * Security Features:
 * - Session tokens are cryptographically secure (32-512 characters)
 * - IP address tracking detects login from unusual locations
 * - User agent tracking identifies device/browser changes
 * - Automatic expiration prevents indefinite access
 * - Max 30-day session duration enforced
 *
 * Token Lifecycle:
 * 1. User logs in → Session created with JWT token
 * 2. Each request validates session exists and not expired
 * 3. lastActivity updated on each authenticated request
 * 4. Session expires after expiresAt timestamp
 * 5. Session deleted on logout or password change
 *
 * @example
 * // Create a new session
 * const session = await Session.create({
 *   userId: 'user-uuid',
 *   token: 'jwt-token-here',
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
 * });
 *
 * @example
 * // Find active session by token
 * const session = await Session.findOne({
 *   where: {
 *     token: 'jwt-token',
 *     expiresAt: { [Op.gt]: new Date() }
 *   }
 * });
 *
 * @example
 * // Invalidate all sessions for user (e.g., on password change)
 * await Session.destroy({
 *   where: { userId: 'user-uuid' }
 * });
 *
 * @security Session tokens must be unique across entire system
 * @security Maximum 30-day expiration enforced via validation
 * @security IP and user agent changes may trigger security alerts
 */
export class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for session record
   */
  public id!: string;

  /**
   * @property {string} userId - Foreign key to User model
   * @security Links session to authenticated user
   * @validation Must be valid User UUID
   */
  public userId!: string;

  /**
   * @property {string} token - JWT session token
   * @security CRITICAL - Must be cryptographically secure
   * @security Must be unique across all sessions
   * @validation 32-512 characters
   */
  public token!: string;

  /**
   * @property {string} ipAddress - IP address where session was created
   * @security Used for anomaly detection (login from unusual location)
   * @validation Must be valid IPv4 or IPv6 address
   */
  public ipAddress?: string;

  /**
   * @property {string} userAgent - User agent string
   * @security Used for device/browser identification
   * @validation Max 500 characters
   */
  public userAgent?: string;

  /**
   * @property {Date} expiresAt - Session expiration timestamp
   * @security Sessions automatically expire after this time
   * @validation Must be future date, max 30 days from creation
   */
  public expiresAt!: Date;

  /**
   * @property {Date} lastActivity - Last activity timestamp
   * @security Used for idle timeout detection
   * @default Current timestamp on creation
   */
  public lastActivity!: Date;

  /**
   * @property {Date} createdAt - Session creation timestamp
   * @readonly
   */
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
