/**
 * User Model
 * Sequelize model for system users with comprehensive authentication and security features
 *
 * @security CRITICAL - Password field must NEVER be exposed in API responses
 * @security Use toSafeObject() method to exclude sensitive fields
 * @compliance HIPAA - Secure authentication for PHI access
 */

import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
  DeletedAt,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/user-role.enum';

/**
 * User model attributes interface
 */
export interface UserAttributes {
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
  mfaEnabled: boolean;
  mfaSecret?: string | null;
  mfaBackupCodes?: string | null;
  mfaEnabledAt?: Date | null;
  oauthProvider?: string | null;
  oauthProviderId?: string | null;
  profilePictureUrl?: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['schoolId'] },
    { fields: ['districtId'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    { fields: ['emailVerificationToken'] },
    { fields: ['passwordResetToken'] },
    { fields: ['lockoutUntil'] },
    { fields: ['createdAt'], name: 'idx_users_created_at' },
    { fields: ['updatedAt'], name: 'idx_users_updated_at' },
  ],
})
export class User extends Model<UserAttributes> {
  @ApiProperty({
    description: 'Unique identifier for the user (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ApiProperty({
    description: 'User email address (unique, used for login)',
    example: 'nurse.smith@school.edu',
  })
  @Index({ unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isEmail: true },
  })
  email!: string;

  @ApiProperty({
    description: 'Hashed password (bcrypt) - NEVER expose in API responses',
    example: '$2b$12$...',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Sarah',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'firstName',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Smith',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'lastName',
  })
  lastName!: string;

  @ApiProperty({
    description: 'User role for authorization',
    enum: UserRole,
    example: UserRole.NURSE,
  })
  @Column({
    type: DataType.ENUM(...(Object.values(UserRole) as string[])),
    allowNull: false,
    defaultValue: UserRole.ADMIN,
  })
  role!: UserRole;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'isActive',
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Timestamp of last successful login',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    field: 'lastLogin',
  })
  lastLogin?: Date;

  @ApiProperty({
    description: 'ID of the school this user is associated with',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'schoolId',
  })
  schoolId?: string;

  @ApiProperty({
    description: 'ID of the district this user is associated with',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'districtId',
  })
  districtId?: string;

  @ApiProperty({
    description: 'User phone number in E.164 format',
    example: '+12125551234',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    },
  })
  phone?: string;

  @ApiProperty({
    description: 'Legacy email verification status (deprecated - use isEmailVerified)',
    example: false,
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'emailVerified',
  })
  emailVerified!: boolean;

  @ApiProperty({
    description: 'Email verification token - NEVER expose in API responses',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'emailVerificationToken',
  })
  emailVerificationToken?: string;

  @ApiProperty({
    description: 'Email verification token expiration date',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'emailVerificationExpires',
  })
  emailVerificationExpires?: Date;

  @ApiProperty({
    description: 'Password reset token - NEVER expose in API responses',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'passwordResetToken',
  })
  passwordResetToken?: string;

  @ApiProperty({
    description: 'Password reset token expiration date',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'passwordResetExpires',
  })
  passwordResetExpires?: Date;

  @ApiProperty({
    description: 'Timestamp when password was last changed (for token invalidation)',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'passwordChangedAt',
  })
  passwordChangedAt?: Date;

  @ApiProperty({
    description: 'Legacy 2FA status (deprecated - use mfaEnabled)',
    example: false,
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'twoFactorEnabled',
  })
  twoFactorEnabled!: boolean;

  @ApiProperty({
    description: 'Legacy 2FA secret (deprecated - use mfaSecret) - NEVER expose in API responses',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'twoFactorSecret',
  })
  twoFactorSecret?: string;

  @ApiProperty({
    description: 'Number of consecutive failed login attempts',
    example: 0,
  })
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'failedLoginAttempts',
  })
  failedLoginAttempts!: number;

  @ApiProperty({
    description: 'Account lockout expiration timestamp (set after 5 failed login attempts)',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lockoutUntil',
  })
  lockoutUntil?: Date;

  @ApiProperty({
    description: 'Timestamp when password was last changed (for password rotation policy)',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lastPasswordChange',
  })
  lastPasswordChange?: Date;

  @ApiProperty({
    description: 'Whether user must change password on next login',
    example: false,
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'mustChangePassword',
  })
  mustChangePassword!: boolean;

  // MFA fields
  @ApiProperty({
    description: 'Whether multi-factor authentication is enabled',
    example: false,
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'mfaEnabled',
    comment: 'Whether multi-factor authentication is enabled',
  })
  mfaEnabled!: boolean;

  @ApiProperty({
    description: 'TOTP secret for MFA (encrypted) - NEVER expose in API responses',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'mfaSecret',
    comment: 'TOTP secret for MFA (encrypted)',
  })
  mfaSecret?: string | null;

  @ApiProperty({
    description: 'JSON array of hashed backup codes for MFA recovery - NEVER expose in API responses',
    required: false,
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'mfaBackupCodes',
    comment: 'JSON array of hashed backup codes for MFA recovery',
  })
  mfaBackupCodes?: string | null;

  @ApiProperty({
    description: 'Timestamp when MFA was enabled',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'mfaEnabledAt',
    comment: 'Timestamp when MFA was enabled',
  })
  mfaEnabledAt?: Date | null;

  // OAuth fields
  @ApiProperty({
    description: 'OAuth provider (google, microsoft, etc.)',
    example: 'google',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'oauthProvider',
    comment: 'OAuth provider (google, microsoft, etc.)',
  })
  oauthProvider?: string | null;

  @ApiProperty({
    description: 'User ID from OAuth provider',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'oauthProviderId',
    comment: 'User ID from OAuth provider',
  })
  oauthProviderId?: string | null;

  @ApiProperty({
    description: 'URL to user profile picture',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'profilePictureUrl',
    comment: 'URL to user profile picture',
  })
  profilePictureUrl?: string | null;

  // Enhanced email verification fields
  @ApiProperty({
    description: 'Whether email address has been verified',
    example: false,
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'isEmailVerified',
    comment: 'Whether email address has been verified',
  })
  isEmailVerified!: boolean;

  @ApiProperty({
    description: 'Timestamp when email was verified',
    required: false,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'emailVerifiedAt',
    comment: 'Timestamp when email was verified',
  })
  emailVerifiedAt?: Date | null;

  // Soft delete timestamp (paranoid mode)
  @ApiProperty({
    description: 'Soft delete timestamp for paranoid mode',
    required: false,
  })
  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deletedAt',
    comment: 'Soft delete timestamp for paranoid mode',
  })
  deletedAt?: Date | null;

  /**
   * SECURITY FIX: Configurable bcrypt salt rounds
   *
   * Before: Hardcoded 10 rounds (inconsistent with AuthService using 12)
   * After: Reads from BCRYPT_SALT_ROUNDS environment variable (default 12)
   *
   * Salt Rounds Guidance:
   * - 10 rounds: Fast, acceptable for general use
   * - 12 rounds: Balanced, recommended for healthcare (PHI protection)
   * - 14 rounds: Very secure, slower (consider for admin accounts)
   *
   * IMPORTANT: Must match AuthService configuration
   */
  @BeforeCreate
  static async hashPasswordOnCreate(instance: User) {
    if (instance.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

      // Validate salt rounds
      if (saltRounds < 10 || saltRounds > 14) {
        throw new Error(
          `SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`,
        );
      }

      instance.password = await bcrypt.hash(instance.password, saltRounds);
      instance.lastPasswordChange = new Date();
    }
  }

  /**
   * SECURITY FIX: Configurable bcrypt salt rounds
   */
  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User) {
    if (instance.changed('password')) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

      // Validate salt rounds
      if (saltRounds < 10 || saltRounds > 14) {
        throw new Error(
          `SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`,
        );
      }

      instance.password = await bcrypt.hash(instance.password, saltRounds);
      instance.passwordChangedAt = new Date();
      instance.lastPasswordChange = new Date();
    }
  }

  /**
   * PHI Audit Logging Hook
   * Logs changes to Protected Health Information (PHI) fields
   * @compliance HIPAA - Audit trail for PHI access
   */
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(user: User) {
    if (user.changed()) {
      const changedFields = user.changed() as string[];
      const phiFields = ['email', 'firstName', 'lastName', 'phone'];

      // Import the helper function dynamically to avoid circular dependencies
      const { logModelPHIFieldChanges } = await import(
        '@/database/services/model-audit-helper.service.js'
      );

      // Get the transaction if available
      const transaction = (user as any).sequelize?.transaction || undefined;

      await logModelPHIFieldChanges(
        'User',
        user.id,
        changedFields,
        phiFields,
        transaction,
      );
    }
  }

  /**
   * Compare password with hashed password
   * @param candidatePassword Plain text password to compare
   * @returns True if passwords match
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    // Validate arguments to prevent bcrypt errors
    if (!candidatePassword) {
      console.error(`[User.comparePassword] candidatePassword is null/undefined for user ${this.email}`);
      return false;
    }
    
    if (!this.password) {
      console.error(`[User.comparePassword] this.password is null/undefined for user ${this.email}`);
      console.error(`[User.comparePassword] User attributes:`, Object.keys(this.dataValues || {}));
      console.error(`[User.comparePassword] Password field value:`, this.password);
      return false;
    }

    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      console.error(`[User.comparePassword] bcrypt.compare failed for user ${this.email}:`, error.message);
      return false;
    }
  }

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Return user object without sensitive fields
   * Use this for API responses
   * @security Excludes all sensitive fields including passwords, tokens, and MFA secrets
   */
  toSafeObject(): Partial<UserAttributes> {
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      twoFactorSecret,
      mfaSecret,
      mfaBackupCodes,
      ...safeData
    } = this.get({ plain: true });
    return {
      ...safeData,
      id: this.id, // Ensure id is always included
    };
  }

  /**
   * Check if account is currently locked
   * @returns True if account is locked
   */
  isAccountLocked(): boolean {
    return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
  }

  /**
   * Check if password was changed after given timestamp
   * @param timestamp Unix timestamp in seconds
   * @returns True if password changed after timestamp
   */
  passwordChangedAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        this.passwordChangedAt.getTime() / 1000,
      );
      return changedTimestamp > timestamp;
    }
    return false;
  }

  /**
   * Validate password reset token
   * @param token Token to validate
   * @returns True if token is valid and not expired
   */
  isPasswordResetTokenValid(token: string): boolean {
    if (!this.passwordResetToken || !this.passwordResetExpires) {
      return false;
    }
    return (
      this.passwordResetToken === token &&
      this.passwordResetExpires > new Date()
    );
  }

  /**
   * Validate email verification token
   * @param token Token to validate
   * @returns True if token is valid and not expired
   */
  isEmailVerificationTokenValid(token: string): boolean {
    if (!this.emailVerificationToken || !this.emailVerificationExpires) {
      return false;
    }
    return (
      this.emailVerificationToken === token &&
      this.emailVerificationExpires > new Date()
    );
  }

  /**
   * Increment failed login attempts and lock account if threshold reached
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
   * Reset failed login attempts on successful authentication
   */
  async resetFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.lastLogin = new Date();
    await this.save();
  }

  /**
   * Check if user must change password
   * @returns True if password change required
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

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({
    type: DataType.DATE,
    field: 'createdAt',
  })
  declare createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({
    type: DataType.DATE,
    field: 'updatedAt',
  })
  declare updatedAt: Date;
}

// Default export for Sequelize-TypeScript
export default User;
