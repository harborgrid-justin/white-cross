/**
 * User Model - Authentication and Authorization
 *
 * Manages user accounts for the White Cross Health Management System.
 * Implements comprehensive authentication features including password hashing,
 * two-factor authentication, account lockout, and role-based access control.
 *
 * @module database/models/user
 */

import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

/**
 * User Role Enumeration
 *
 * Defines all available user roles in the system with hierarchical permissions.
 *
 * @enum {string}
 * @property {string} ADMIN - System administrator with full access to all features
 * @property {string} NURSE - School nurse with access to student health records
 * @property {string} SCHOOL_ADMIN - School-level administrator with school-specific access
 * @property {string} DISTRICT_ADMIN - District-level administrator managing multiple schools
 * @property {string} VIEWER - Read-only access to assigned data
 * @property {string} COUNSELOR - School counselor with limited health record access
 *
 * @example
 * ```typescript
 * const user = await User.create({
 *   email: 'nurse@school.edu',
 *   role: UserRole.NURSE,
 *   // ... other fields
 * });
 * ```
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  VIEWER = 'VIEWER',
  COUNSELOR = 'COUNSELOR',
}

/**
 * User Attributes Interface
 *
 * Type definition for user entity attributes including authentication,
 * authorization, and security features.
 *
 * @interface UserAttributes
 */
export interface UserAttributes {
  /** User's unique email address (used for authentication) */
  email: string;
  /** Hashed password (bcrypt with 10 rounds) */
  password: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's role determining access permissions */
  role: UserRole;
  /** Whether the user account is active (can log in) */
  isActive: boolean;
  /** Timestamp of last successful login */
  lastLogin?: Date;
  /** UUID of associated school (for school-level users) */
  schoolId?: string;
  /** UUID of associated district (for district-level users) */
  districtId?: string;
  /** User's contact phone number */
  phone?: string;
  /** Whether email has been verified */
  emailVerified: boolean;
  /** Token for email verification (temporary) */
  emailVerificationToken?: string;
  /** Expiration time for email verification token */
  emailVerificationExpires?: Date;
  /** Token for password reset (temporary) */
  passwordResetToken?: string;
  /** Expiration time for password reset token */
  passwordResetExpires?: Date;
  /** Timestamp when password was last changed */
  passwordChangedAt?: Date;
  /** Whether two-factor authentication is enabled */
  twoFactorEnabled: boolean;
  /** Secret key for two-factor authentication (TOTP) */
  twoFactorSecret?: string;
  /** Number of consecutive failed login attempts */
  failedLoginAttempts: number;
  /** Account locked until this timestamp (after too many failed attempts) */
  lockoutUntil?: Date;
  /** Timestamp of last password change (for policy enforcement) */
  lastPasswordChange?: Date;
  /** Flag requiring password change on next login */
  mustChangePassword: boolean;
}

/**
 * User Model - Sequelize Implementation
 *
 * Manages user authentication, authorization, and account security.
 * Implements password hashing, account lockout, two-factor authentication,
 * and password expiration policies.
 *
 * Security Features:
 * - Automatic password hashing using bcrypt (10 rounds)
 * - Account lockout after 5 failed login attempts (30 minutes)
 * - Password expiration after 90 days
 * - Two-factor authentication support (TOTP)
 * - Email verification workflow
 * - Password reset workflow
 *
 * @extends Model<UserAttributes>
 *
 * @example Create New User
 * ```typescript
 * const user = await User.create({
 *   email: 'nurse@school.edu',
 *   password: 'SecurePassword123!',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: UserRole.NURSE,
 *   schoolId: 'school-uuid'
 * });
 * // Password is automatically hashed before saving
 * ```
 *
 * @example Authenticate User
 * ```typescript
 * const user = await User.findOne({ where: { email: 'nurse@school.edu' } });
 * if (user && await user.comparePassword('password123')) {
 *   if (user.isAccountLocked()) {
 *     throw new Error('Account is locked');
 *   }
 *   await user.resetFailedLoginAttempts();
 *   // Login successful
 * } else {
 *   await user.incrementFailedLoginAttempts();
 * }
 * ```
 *
 * @remarks
 * - Passwords are automatically hashed on create and update
 * - Account locks after 5 failed login attempts for 30 minutes
 * - Passwords must be changed every 90 days
 * - Email verification is required for new accounts
 */
@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<UserAttributes> {
  /**
   * User's unique identifier (UUID v4)
   * @type {string}
   */
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  /**
   * User's email address
   *
   * Must be unique across all users and valid email format.
   * Used as primary authentication credential.
   *
   * @type {string}
   * @unique
   * @required
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.NURSE,
  })
  role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLogin?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  schoolId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  districtId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  emailVerified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emailVerificationToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emailVerificationExpires?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  passwordResetExpires?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  passwordChangedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  twoFactorEnabled: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  twoFactorSecret?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  failedLoginAttempts: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lockoutUntil?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastPasswordChange?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  mustChangePassword: boolean;

  /**
   * Hook: Hash password before creating new user
   *
   * Automatically hashes the password using bcrypt before saving to database.
   * Sets lastPasswordChange timestamp to current time.
   *
   * @param {User} user - User instance being created
   * @returns {Promise<void>}
   *
   * @remarks
   * - Uses bcrypt with 10 salt rounds
   * - Executes synchronously before database insert
   */
  @BeforeCreate
  static async hashPasswordBeforeCreate(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
      user.lastPasswordChange = new Date();
    }
  }

  /**
   * Hook: Hash password before updating user
   *
   * Automatically hashes the password if it was changed during update.
   * Updates both passwordChangedAt and lastPasswordChange timestamps.
   *
   * @param {User} user - User instance being updated
   * @returns {Promise<void>}
   *
   * @remarks
   * - Only hashes if password field changed
   * - Updates password change timestamps for policy enforcement
   */
  @BeforeUpdate
  static async hashPasswordBeforeUpdate(user: User) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
      user.passwordChangedAt = new Date();
      user.lastPasswordChange = new Date();
    }
  }

  /**
   * Compare provided password with hashed password
   *
   * Uses bcrypt to securely compare plaintext password with stored hash.
   * Use this method for authentication instead of direct comparison.
   *
   * @param {string} candidatePassword - Plaintext password to verify
   * @returns {Promise<boolean>} True if password matches, false otherwise
   *
   * @example
   * ```typescript
   * const user = await User.findOne({ where: { email: 'user@example.com' } });
   * const isValid = await user.comparePassword('userPassword123');
   * if (isValid) {
   *   // Password correct, proceed with login
   * }
   * ```
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Get user's full name
   *
   * Computed property combining first and last name.
   *
   * @returns {string} Full name in "FirstName LastName" format
   *
   * @example
   * ```typescript
   * const user = await User.findByPk(userId);
   * console.log(user.fullName); // "Jane Doe"
   * ```
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Convert user to safe object for API responses
   *
   * Removes sensitive fields (password, tokens, secrets) before sending
   * user data to client. Always use this method when returning user data.
   *
   * @returns {Object} User object without sensitive fields
   *
   * @example
   * ```typescript
   * const user = await User.findByPk(userId);
   * res.json(user.toSafeObject());
   * ```
   *
   * @remarks
   * - Removes password, all tokens, and 2FA secret
   * - Ensures ID is always included
   * - Use for all API responses
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
    } = this.get({ plain: true });
    return {
      ...safeData,
      id: this.id!, // Ensure id is always included
    };
  }

  /**
   * Check if account is currently locked
   *
   * Accounts are locked after 5 consecutive failed login attempts for 30 minutes.
   *
   * @returns {boolean} True if account is locked, false otherwise
   *
   * @example
   * ```typescript
   * const user = await User.findOne({ where: { email } });
   * if (user.isAccountLocked()) {
   *   throw new Error('Account is temporarily locked due to too many failed login attempts');
   * }
   * ```
   *
   * @remarks
   * - Lockout duration is 30 minutes
   * - Lockout clears automatically after time expires
   * - Check this before allowing login attempts
   */
  isAccountLocked(): boolean {
    return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
  }

  /**
   * Check if password was changed after a given timestamp
   *
   * Used for JWT token invalidation when password changes.
   * If password changed after token issued, token should be rejected.
   *
   * @param {number} timestamp - Unix timestamp (seconds) to compare against
   * @returns {boolean} True if password changed after timestamp
   *
   * @example
   * ```typescript
   * const tokenIssuedAt = 1234567890; // from JWT payload
   * if (user.passwordChangedAfter(tokenIssuedAt)) {
   *   throw new Error('Password changed, please log in again');
   * }
   * ```
   */
  passwordChangedAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
      return changedTimestamp > timestamp;
    }
    return false;
  }

  /**
   * Increment failed login attempts and lock account if threshold reached
   *
   * Call this method after each failed login attempt. Automatically locks
   * account for 30 minutes after 5 consecutive failures.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```typescript
   * const user = await User.findOne({ where: { email } });
   * const isValid = await user.comparePassword(password);
   * if (!isValid) {
   *   await user.incrementFailedLoginAttempts();
   *   throw new Error('Invalid credentials');
   * }
   * ```
   *
   * @remarks
   * - Locks account after 5 failed attempts
   * - Lockout duration is 30 minutes
   * - Automatically saves to database
   */
  async incrementFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
      this.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  }

  /**
   * Reset failed login attempts after successful login
   *
   * Call this method after successful authentication to reset lockout counter
   * and update last login timestamp.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```typescript
   * const user = await User.findOne({ where: { email } });
   * if (await user.comparePassword(password)) {
   *   await user.resetFailedLoginAttempts();
   *   // Proceed with login
   * }
   * ```
   *
   * @remarks
   * - Clears failed attempt counter
   * - Removes account lockout
   * - Updates lastLogin timestamp
   * - Automatically saves to database
   */
  async resetFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.lastLogin = new Date();
    await this.save();
  }

  /**
   * Check if user is required to change password
   *
   * Password change is required if:
   * - mustChangePassword flag is set (by admin)
   * - Password is older than 90 days (security policy)
   *
   * @returns {boolean} True if password change required
   *
   * @example
   * ```typescript
   * const user = await User.findByPk(userId);
   * if (user.requiresPasswordChange()) {
   *   return res.redirect('/change-password');
   * }
   * ```
   *
   * @remarks
   * - Check this after successful authentication
   * - 90-day password expiration is a security best practice
   * - Admins can force password change via mustChangePassword flag
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
