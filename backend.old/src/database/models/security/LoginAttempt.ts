/**
 * @fileoverview LoginAttempt Database Model
 * @module database/models/security/LoginAttempt
 * @description Sequelize model for tracking all login attempts (successful and failed).
 * Critical for security monitoring, brute force detection, and compliance reporting
 * on unauthorized access attempts to PHI systems.
 *
 * Key Features:
 * - Records ALL login attempts (both successful and failed)
 * - IP address and user agent tracking for forensic analysis
 * - Failure reason logging for security analysis and debugging
 * - Supports brute force attack detection via rate limiting
 * - Enables compliance reporting on access patterns
 * - Works with User.failedLoginAttempts for account lockout
 *
 * @security Tracks unauthorized access attempts for security monitoring
 * @security Enables brute force detection and prevention
 * @compliance HIPAA - Tracks access attempts to PHI systems
 * @compliance HIPAA - Security monitoring and incident detection
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: DE63A06151
 * WC-GEN-089 | LoginAttempt.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Authentication services - Login tracking
 *   - Security monitoring - Brute force detection
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface LoginAttemptAttributes
 * @description TypeScript interface defining all LoginAttempt model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} email - Email address used for login attempt
 * @property {boolean} success - Whether login attempt succeeded
 * @property {string} [ipAddress] - IP address of login attempt
 * @property {string} [userAgent] - User agent string (browser/device)
 * @property {string} [failureReason] - Reason for login failure (required for failed attempts)
 * @property {Date} createdAt - Timestamp when login attempt occurred
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

/**
 * @interface LoginAttemptCreationAttributes
 * @description Attributes required when creating a new LoginAttempt instance.
 * Extends LoginAttemptAttributes with optional fields that have defaults or are auto-generated.
 */
interface LoginAttemptCreationAttributes
  extends Optional<LoginAttemptAttributes, 'id' | 'createdAt' | 'ipAddress' | 'userAgent' | 'failureReason'> {}

/**
 * @class LoginAttempt
 * @extends Model
 * @description LoginAttempt model for comprehensive login tracking and security monitoring.
 * Records all authentication attempts for brute force detection and compliance reporting.
 *
 * @tablename login_attempts
 *
 * Security Monitoring:
 * - All login attempts logged (success and failure)
 * - Failed attempts trigger User.failedLoginAttempts increment
 * - 5 failed attempts within timeframe → account lockout (30 minutes)
 * - Brute force detection via IP-based rate limiting
 * - Unusual login patterns detected via IP/user agent analysis
 *
 * Account Lockout Mechanism:
 * 1. Failed login → LoginAttempt created with failureReason
 * 2. User.failedLoginAttempts incremented
 * 3. After 5 failures → User.lockoutUntil set to 30 minutes
 * 4. Successful login → User.failedLoginAttempts reset to 0
 *
 * Common Failure Reasons:
 * - "Invalid credentials" - Wrong password
 * - "Account not found" - Email doesn't exist
 * - "Account locked" - Too many failed attempts
 * - "Account inactive" - User.isActive = false
 * - "Email not verified" - User.emailVerified = false
 *
 * @example
 * // Record failed login attempt
 * await LoginAttempt.create({
 *   email: 'user@example.com',
 *   success: false,
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   failureReason: 'Invalid credentials'
 * });
 *
 * @example
 * // Record successful login
 * await LoginAttempt.create({
 *   email: 'user@example.com',
 *   success: true,
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...'
 * });
 *
 * @example
 * // Detect brute force attack (multiple failures from same IP)
 * const recentAttempts = await LoginAttempt.findAll({
 *   where: {
 *     ipAddress: '192.168.1.100',
 *     success: false,
 *     createdAt: { [Op.gte]: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 mins
 *   }
 * });
 * if (recentAttempts.length >= 10) {
 *   // Block IP temporarily
 * }
 *
 * @security Failure reason required for failed attempts (validation)
 * @security IP and email indexed for efficient brute force queries
 */
export class LoginAttempt
  extends Model<LoginAttemptAttributes, LoginAttemptCreationAttributes>
  implements LoginAttemptAttributes
{
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for login attempt
   */
  public id!: string;

  /**
   * @property {string} email - Email address used for login
   * @security Indexed for efficient user login history queries
   * @validation Must be valid email format, 5-255 characters
   */
  public email!: string;

  /**
   * @property {boolean} success - Whether login succeeded
   * @security Used to filter failed vs successful attempts
   */
  public success!: boolean;

  /**
   * @property {string} ipAddress - IP address of login attempt
   * @security Critical for brute force detection
   * @security Indexed for efficient IP-based queries
   * @validation Must be valid IPv4 or IPv6 address
   */
  public ipAddress?: string;

  /**
   * @property {string} userAgent - User agent string
   * @security Used for device/browser identification
   * @security Helps detect account compromise (different device)
   * @validation Max 500 characters
   */
  public userAgent?: string;

  /**
   * @property {string} failureReason - Reason for login failure
   * @security REQUIRED for failed attempts (validation enforced)
   * @security Helps distinguish attack types (brute force, account enumeration, etc.)
   * @validation Max 255 characters
   */
  public failureReason?: string;

  /**
   * @property {Date} createdAt - Timestamp when login attempt occurred
   * @security Indexed for time-based brute force queries
   * @readonly
   */
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
