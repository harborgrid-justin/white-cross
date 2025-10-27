/**
 * @fileoverview User Database Model
 * @module database/models/core/User
 * @description Sequelize model definition for system users with comprehensive authentication and security features.
 * Supports multi-role access control, account security, password management, and two-factor authentication.
 *
 * Key Security Features:
 * - Bcrypt password hashing (10 rounds) - NEVER store plain text passwords
 * - Account lockout after 5 failed login attempts (30 minutes)
 * - Password expiration (90 days for healthcare compliance)
 * - Two-factor authentication (TOTP) support
 * - Email verification workflow
 * - Password reset with expiring tokens
 * - JWT token invalidation on password change
 * - Session management via Session model
 *
 * @security CRITICAL - Password field must NEVER be exposed in API responses
 * @security Use toSafeObject() method to exclude sensitive fields
 * @security Password hashing: bcrypt with 10 rounds (configured in shared/index.ts)
 * @security Account lockout: 5 failed attempts → 30 minute lockout
 * @security Password expiration: 90 days (healthcare compliance requirement)
 * @security 2FA secrets must be encrypted at rest
 * @compliance HIPAA - Secure authentication for PHI access
 * @compliance HIPAA - 90-day password expiration requirement
 *
 * @requires sequelize - ORM library for database operations
 * @requires enums - UserRole enumeration
 * @requires shared - Password hashing and comparison utilities (bcrypt)
 *
 * LOC: 1EB58B57C1
 * WC-GEN-056 | User.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - index.ts (shared/index.ts) - hashPassword, comparePassword
 *
 * DOWNSTREAM (imported by):
 *   - AppointmentWaitlist.ts, IncidentReport.ts, UserRepository.ts, UserService.ts
 *   - Authentication middleware, Authorization services
 *   - UserRoleAssignment.ts - RBAC implementation
 *   - Session.ts - Session management
 *   - LoginAttempt.ts - Login tracking
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { UserRole } from '../../types/enums';
import { hashPassword, comparePassword } from '../../../shared';

/**
 * @interface UserAttributes
 * @description TypeScript interface defining all User model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} email - User email address, unique, validated format
 * @property {string} password - Hashed password, never returned in safe object
 * @property {string} firstName - User's first name, required
 * @property {string} lastName - User's last name, required
 * @property {UserRole} role - User role (NURSE, ADMIN, SUPER_ADMIN, etc.)
 * @property {boolean} isActive - Account active status, defaults to true
 * @property {Date} [lastLogin] - Timestamp of last successful login
 * @property {string} [schoolId] - Associated school UUID (nullable)
 * @property {string} [districtId] - Associated district UUID (nullable)
 * @property {string} [phone] - Phone number, validated format
 * @property {boolean} emailVerified - Email verification status, defaults to false
 * @property {string} [emailVerificationToken] - Token for email verification
 * @property {Date} [emailVerificationExpires] - Email verification token expiration
 * @property {string} [passwordResetToken] - Token for password reset
 * @property {Date} [passwordResetExpires] - Password reset token expiration
 * @property {Date} [passwordChangedAt] - Timestamp of last password change
 * @property {boolean} twoFactorEnabled - 2FA enabled status, defaults to false
 * @property {string} [twoFactorSecret] - TOTP secret for 2FA (sensitive)
 * @property {number} failedLoginAttempts - Count of failed login attempts
 * @property {Date} [lockoutUntil] - Account lockout expiration timestamp
 * @property {Date} [lastPasswordChange] - Last password change timestamp
 * @property {boolean} mustChangePassword - Force password change flag
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  schoolId?: string;
  districtId?: string;
  phone?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  lastPasswordChange?: Date;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface UserCreationAttributes
 * @description Attributes required when creating a new User instance.
 * Extends UserAttributes with optional fields that have defaults or are auto-generated.
 */
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'lastLogin' | 'schoolId' | 'districtId' | 'phone' | 'emailVerified' | 'emailVerificationToken' | 'emailVerificationExpires' | 'passwordResetToken' | 'passwordResetExpires' | 'passwordChangedAt' | 'twoFactorEnabled' | 'twoFactorSecret' | 'failedLoginAttempts' | 'lockoutUntil' | 'lastPasswordChange' | 'mustChangePassword'> {}

/**
 * @class User
 * @extends Model
 * @description User model representing system users with authentication and security features.
 * Includes account management, password security, 2FA, email verification, and lockout protection.
 *
 * @tablename users
 *
 * Security Features:
 * - Automatic password hashing (bcrypt)
 * - Account lockout after 5 failed attempts (30 minutes)
 * - Password expiration (90 days for healthcare compliance)
 * - Two-factor authentication support
 * - Email verification workflow
 * - Password reset with expiring tokens
 *
 * @example
 * // Create a new user
 * const user = await User.create({
 *   email: 'nurse@school.edu',
 *   password: 'SecurePass123!',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: UserRole.NURSE,
 *   schoolId: 'school-uuid'
 * });
 *
 * @example
 * // Authenticate user
 * const user = await User.findOne({ where: { email: 'nurse@school.edu' } });
 * const isValid = await user.comparePassword('SecurePass123!');
 *
 * @example
 * // Check if account is locked
 * if (user.isAccountLocked()) {
 *   throw new Error('Account is temporarily locked');
 * }
 */
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  /**
   * @property {string} id - Primary key UUID
   * @security Used for foreign key relationships and user identification
   */
  public id!: string;

  /**
   * @property {string} email - User email address
   * @security Must be unique across entire system
   * @validation Must be valid email format
   */
  public email!: string;

  /**
   * @property {string} password - Bcrypt hashed password
   * @security CRITICAL - NEVER expose in API responses
   * @security NEVER log or display password field
   * @security Automatically hashed via beforeCreate/beforeUpdate hooks
   * @security Hash algorithm: bcrypt with 10 rounds
   * @security Minimum requirements: 8 chars, uppercase, lowercase, number, special char
   * @security Use comparePassword() method for authentication, NEVER compare directly
   */
  public password!: string;

  /**
   * @property {string} firstName - User's first name
   */
  public firstName!: string;

  /**
   * @property {string} lastName - User's last name
   */
  public lastName!: string;

  /**
   * @property {UserRole} role - User role for RBAC
   * @security Deprecated - Use UserRoleAssignment for multi-role support
   * @security Legacy field maintained for backward compatibility
   */
  public role!: UserRole;

  /**
   * @property {boolean} isActive - Account active status
   * @security Inactive accounts cannot login
   * @default true
   */
  public isActive!: boolean;

  /**
   * @property {Date} lastLogin - Last successful login timestamp
   * @security Updated on successful authentication
   */
  public lastLogin?: Date;

  /**
   * @property {string} schoolId - Foreign key to School model
   * @security Defines school-level data access scope
   */
  public schoolId?: string;

  /**
   * @property {string} districtId - Foreign key to District model
   * @security Defines district-level data access scope
   */
  public districtId?: string;

  /**
   * @property {string} phone - Phone number
   * @validation Format: (xxx) xxx-xxxx or xxx-xxx-xxxx or international
   */
  public phone?: string;

  /**
   * @property {boolean} emailVerified - Email verification status
   * @security Unverified emails may have restricted access
   * @default false
   */
  public emailVerified!: boolean;

  /**
   * @property {string} emailVerificationToken - Email verification token
   * @security SENSITIVE - Exclude from API responses via toSafeObject()
   * @security Token expires after emailVerificationExpires timestamp
   */
  public emailVerificationToken?: string;

  /**
   * @property {Date} emailVerificationExpires - Email verification token expiration
   * @security Token invalid after this timestamp
   */
  public emailVerificationExpires?: Date;

  /**
   * @property {string} passwordResetToken - Password reset token
   * @security SENSITIVE - Exclude from API responses via toSafeObject()
   * @security Token expires after passwordResetExpires timestamp
   * @security Typically valid for 1 hour
   */
  public passwordResetToken?: string;

  /**
   * @property {Date} passwordResetExpires - Password reset token expiration
   * @security Token invalid after this timestamp
   */
  public passwordResetExpires?: Date;

  /**
   * @property {Date} passwordChangedAt - Last password change timestamp
   * @security Used to invalidate JWT tokens issued before password change
   * @security See passwordChangedAfter() method
   */
  public passwordChangedAt?: Date;

  /**
   * @property {boolean} twoFactorEnabled - 2FA enabled status
   * @security Enables TOTP-based two-factor authentication
   * @default false
   */
  public twoFactorEnabled!: boolean;

  /**
   * @property {string} twoFactorSecret - TOTP secret for 2FA
   * @security CRITICAL - Exclude from API responses via toSafeObject()
   * @security Must be encrypted at rest
   * @security Never log or expose this value
   */
  public twoFactorSecret?: string;

  /**
   * @property {number} failedLoginAttempts - Failed login attempt counter
   * @security Incremented on failed login via incrementFailedLoginAttempts()
   * @security Reset to 0 on successful login
   * @security Account locked after 5 failed attempts
   * @default 0
   */
  public failedLoginAttempts!: number;

  /**
   * @property {Date} lockoutUntil - Account lockout expiration timestamp
   * @security Account locked if lockoutUntil > current time
   * @security Set to 30 minutes after 5 failed login attempts
   * @security Check with isAccountLocked() method
   */
  public lockoutUntil?: Date;

  /**
   * @property {Date} lastPasswordChange - Last password change timestamp
   * @security Used for 90-day password expiration enforcement
   * @security See requiresPasswordChange() method
   */
  public lastPasswordChange?: Date;

  /**
   * @property {boolean} mustChangePassword - Force password change flag
   * @security Set to true when admin requires password change
   * @security Checked via requiresPasswordChange() method
   * @default false
   */
  public mustChangePassword!: boolean;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Record last update timestamp
   * @readonly
   */
  public readonly updatedAt!: Date;

  /**
   * @method hashPassword
   * @description Hashes the password using bcrypt if password field was modified.
   * Called automatically by beforeCreate and beforeUpdate hooks.
   * @returns {Promise<void>}
   * @instance
   * @memberof User
   * @private
   */
  async hashPassword() {
    if (this.changed('password')) {
      this.password = await hashPassword(this.password);
    }
  }

  /**
   * @method comparePassword
   * @description Compares a plain-text password with the stored hashed password.
   * @param {string} candidatePassword - Plain-text password to compare
   * @returns {Promise<boolean>} True if passwords match, false otherwise
   * @instance
   * @memberof User
   * @example
   * const isValid = await user.comparePassword('userEnteredPassword');
   * if (isValid) {
   *   // Authentication successful
   * }
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return comparePassword(candidatePassword, this.password);
  }

  /**
   * @member {string} fullName
   * @description Computed property returning user's full name.
   * @returns {string} Full name (firstName + lastName)
   * @instance
   * @memberof User
   * @example
   * console.log(user.fullName); // "Jane Doe"
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * @method toSafeObject
   * @description Returns user object with sensitive fields removed (password, tokens, secrets).
   * Use this method when returning user data to client.
   * @returns {Object} User object without sensitive fields
   * @instance
   * @memberof User
   * @example
   * res.json({ user: user.toSafeObject() });
   */
  toSafeObject() {
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      twoFactorSecret,
      ...safeData
    } = this.get();
    return safeData;
  }

  /**
   * @method isAccountLocked
   * @description Checks if account is currently locked due to failed login attempts.
   * Account locks after 5 failed attempts for 30 minutes.
   * @returns {boolean} True if account is locked, false otherwise
   * @instance
   * @memberof User
   * @example
   * if (user.isAccountLocked()) {
   *   throw new Error('Account locked. Try again later.');
   * }
   */
  isAccountLocked(): boolean {
    return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
  }

  /**
   * @method passwordChangedAfter
   * @description Checks if password was changed after a given timestamp (typically JWT issued time).
   * Used for invalidating old tokens after password change for security.
   * @param {number} timestamp - Unix timestamp to compare against (seconds)
   * @returns {boolean} True if password changed after timestamp, false otherwise
   * @instance
   * @memberof User
   * @example
   * const jwtTimestamp = 1640000000; // JWT issued at
   * if (user.passwordChangedAfter(jwtTimestamp)) {
   *   throw new Error('Password changed. Please login again.');
   * }
   */
  passwordChangedAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
      return changedTimestamp > timestamp;
    }
    return false;
  }

  /**
   * @method isPasswordResetTokenValid
   * @description Validates password reset token and checks expiration.
   * @param {string} token - Password reset token to validate
   * @returns {boolean} True if token is valid and not expired, false otherwise
   * @instance
   * @memberof User
   * @example
   * if (user.isPasswordResetTokenValid(requestToken)) {
   *   // Allow password reset
   * }
   */
  isPasswordResetTokenValid(token: string): boolean {
    if (!this.passwordResetToken || !this.passwordResetExpires) {
      return false;
    }
    return this.passwordResetToken === token && this.passwordResetExpires > new Date();
  }

  /**
   * @method isEmailVerificationTokenValid
   * @description Validates email verification token and checks expiration.
   * @param {string} token - Email verification token to validate
   * @returns {boolean} True if token is valid and not expired, false otherwise
   * @instance
   * @memberof User
   * @example
   * if (user.isEmailVerificationTokenValid(requestToken)) {
   *   user.emailVerified = true;
   *   await user.save();
   * }
   */
  isEmailVerificationTokenValid(token: string): boolean {
    if (!this.emailVerificationToken || !this.emailVerificationExpires) {
      return false;
    }
    return this.emailVerificationToken === token && this.emailVerificationExpires > new Date();
  }

  /**
   * @method incrementFailedLoginAttempts
   * @description Increments failed login counter and locks account after 5 attempts.
   * Account is locked for 30 minutes after threshold is exceeded.
   * @returns {Promise<void>}
   * @instance
   * @memberof User
   * @example
   * await user.incrementFailedLoginAttempts();
   * if (user.isAccountLocked()) {
   *   // Notify user of lockout
   * }
   */
  async incrementFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (this.failedLoginAttempts >= 5) {
      this.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  }

  /**
   * @method resetFailedLoginAttempts
   * @description Resets failed login counter and lockout on successful authentication.
   * Updates lastLogin timestamp.
   * @returns {Promise<void>}
   * @instance
   * @memberof User
   * @example
   * await user.resetFailedLoginAttempts();
   */
  async resetFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.lastLogin = new Date();
    await this.save();
  }

  /**
   * @method requiresPasswordChange
   * @description Checks if user must change password (forced or expired).
   * Healthcare compliance requires password changes every 90 days.
   * @returns {boolean} True if password change required, false otherwise
   * @instance
   * @memberof User
   * @example
   * if (user.requiresPasswordChange()) {
   *   // Redirect to password change page
   * }
   */
  requiresPasswordChange(): boolean {
    if (this.mustChangePassword) {
      return true;
    }

    if (this.lastPasswordChange) {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      return this.lastPasswordChange < ninetyDaysAgo;
    }

    return false;
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.NURSE,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    /**
     * Foreign key reference to School
     *
     * @type {string|null}
     * @description Associates user with a specific school for context and permissions
     * @foreignKey references schools(id) ON DELETE SET NULL
     */
    schoolId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'schoolid', // Map to lowercase database column
      references: {
        model: 'schools',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Foreign key to schools table'
    },
    /**
     * Foreign key reference to District
     *
     * @type {string|null}
     * @description Associates user with a district for multi-school management
     * @foreignKey references districts(id) ON DELETE SET NULL
     */
    districtId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'districtid', // Map to lowercase database column
      references: {
        model: 'districts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Foreign key to districts table'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      },
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'emailverified', // Map to lowercase database column
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'emailverificationtoken', // Map to lowercase database column
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'emailverificationexpires', // Map to lowercase database column
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'passwordresettoken', // Map to lowercase database column
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'passwordresetexpires', // Map to lowercase database column
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'passwordchangedat', // Map to lowercase database column
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'twofactorenabled', // Map to lowercase database column
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'twofactorsecret', // Map to lowercase database column
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'failedloginattempts', // Map to lowercase database column
    },
    lockoutUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'lockoutuntil', // Map to lowercase database column
    },
    lastPasswordChange: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'lastpasswordchange', // Map to lowercase database column
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'mustchangepassword', // Map to lowercase database column
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['schoolId'] },
      { fields: ['districtId'] },
      { fields: ['role'] },
      { fields: ['isActive'] },
      { fields: ['emailVerificationToken'] },
      { fields: ['passwordResetToken'] },
      { fields: ['lockoutUntil'] },
    ],
    hooks: {
      beforeCreate: async (user: User) => {
        await user.hashPassword();
        user.lastPasswordChange = new Date();
      },
      beforeUpdate: async (user: User) => {
        await user.hashPassword();
        // Update passwordChangedAt if password was changed
        if (user.changed('password')) {
          user.passwordChangedAt = new Date();
          user.lastPasswordChange = new Date();
        }
      },
    },
  }
);
