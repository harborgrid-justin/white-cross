/**
 * WC-GEN-056 | User.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums, ../../../shared | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { UserRole } from '../../types/enums';
import { hashPassword, comparePassword } from '../../../shared';

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

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'lastLogin' | 'schoolId' | 'districtId' | 'phone' | 'emailVerified' | 'emailVerificationToken' | 'emailVerificationExpires' | 'passwordResetToken' | 'passwordResetExpires' | 'passwordChangedAt' | 'twoFactorEnabled' | 'twoFactorSecret' | 'failedLoginAttempts' | 'lockoutUntil' | 'lastPasswordChange' | 'mustChangePassword'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: UserRole;
  public isActive!: boolean;
  public lastLogin?: Date;
  public schoolId?: string;
  public districtId?: string;
  public phone?: string;
  public emailVerified!: boolean;
  public emailVerificationToken?: string;
  public emailVerificationExpires?: Date;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public passwordChangedAt?: Date;
  public twoFactorEnabled!: boolean;
  public twoFactorSecret?: string;
  public failedLoginAttempts!: number;
  public lockoutUntil?: Date;
  public lastPasswordChange?: Date;
  public mustChangePassword!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async hashPassword() {
    if (this.changed('password')) {
      this.password = await hashPassword(this.password);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return comparePassword(candidatePassword, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

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
   * Check if account is locked due to failed login attempts
   */
  isAccountLocked(): boolean {
    return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
  }

  /**
   * Check if password was changed after given timestamp
   * Used for invalidating old tokens after password change
   */
  passwordChangedAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
      return changedTimestamp > timestamp;
    }
    return false;
  }

  /**
   * Check if password reset token is valid and not expired
   */
  isPasswordResetTokenValid(token: string): boolean {
    if (!this.passwordResetToken || !this.passwordResetExpires) {
      return false;
    }
    return this.passwordResetToken === token && this.passwordResetExpires > new Date();
  }

  /**
   * Check if email verification token is valid and not expired
   */
  isEmailVerificationTokenValid(token: string): boolean {
    if (!this.emailVerificationToken || !this.emailVerificationExpires) {
      return false;
    }
    return this.emailVerificationToken === token && this.emailVerificationExpires > new Date();
  }

  /**
   * Increment failed login attempts and lock account if threshold exceeded
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
   * Reset failed login attempts on successful login
   */
  async resetFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.lastLogin = new Date();
    await this.save();
  }

  /**
   * Check if password needs to be changed
   * Healthcare compliance often requires password changes every 90 days
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
    schoolId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    districtId: {
      type: DataTypes.STRING,
      allowNull: true,
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
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lockoutUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastPasswordChange: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
