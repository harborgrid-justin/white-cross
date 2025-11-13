/**
 * User Entity
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
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

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
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['schoolId'] },
    { fields: ['districtId'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    { fields: ['emailVerificationToken'] },
    { fields: ['passwordResetToken'] },
    { fields: ['lockoutUntil'] },
  ],
})
export class User extends Model<UserAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Index({ unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isEmail: true },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'firstName',
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'lastName',
  })
  lastName!: string;

  @Column({
    type: DataType.ENUM(...(Object.values(UserRole) as string[])),
    allowNull: false,
    defaultValue: UserRole.ADMIN,
  })
  role!: UserRole;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'isActive',
  })
  isActive!: boolean;

  @Column({
    type: DataType.DATE,
    field: 'lastLogin',
  })
  lastLogin?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'schoolId',
  })
  schoolId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'districtId',
  })
  districtId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    },
  })
  phone?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'emailVerified',
  })
  emailVerified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'emailVerificationToken',
  })
  emailVerificationToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'emailVerificationExpires',
  })
  emailVerificationExpires?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'passwordResetToken',
  })
  passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'passwordResetExpires',
  })
  passwordResetExpires?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'passwordChangedAt',
  })
  passwordChangedAt?: Date;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'twoFactorEnabled',
  })
  twoFactorEnabled!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'twoFactorSecret',
  })
  twoFactorSecret?: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'failedLoginAttempts',
  })
  failedLoginAttempts!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lockoutUntil',
  })
  lockoutUntil?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lastPasswordChange',
  })
  lastPasswordChange?: Date;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'mustChangePassword',
  })
  mustChangePassword!: boolean;

  /**
   * Hash password before creating user
   */
  @BeforeCreate
  static async hashPasswordOnCreate(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
      instance.lastPasswordChange = new Date();
    }
  }

  /**
   * Hash password before updating if changed
   */
  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
      instance.passwordChangedAt = new Date();
      instance.lastPasswordChange = new Date();
    }
  }

  /**
   * Compare password with hashed password
   * @param candidatePassword Plain text password to compare
   * @returns True if passwords match
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
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
   */
  toSafeObject(): Partial<UserAttributes> {
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      twoFactorSecret,
      ...safeData
    } = this.get({ plain: true });
    return safeData;
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

  @Column({
    type: DataType.DATE,
    field: 'createdAt',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updatedAt',
  })
  declare updatedAt: Date;
}
