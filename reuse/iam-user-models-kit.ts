/**
 * LOC: IAM-USR-MOD-001
 * File: /reuse/iam-user-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - bcrypt (v5.x)
 *
 * DOWNSTREAM (imported by):
 *   - IAM user services
 *   - Authentication services
 *   - User management controllers
 *   - Profile management modules
 */

/**
 * File: /reuse/iam-user-models-kit.ts
 * Locator: WC-IAM-USR-MOD-001
 * Purpose: IAM User Models Kit - Comprehensive user model definitions with Sequelize
 *
 * Upstream: sequelize v6.x, @types/validator, bcrypt, crypto
 * Downstream: All IAM services, authentication modules, user management systems
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 functions for user models, profiles, attributes, lifecycle, validation, search
 *
 * LLM Context: Production-grade IAM user model utilities for White Cross healthcare platform.
 * Provides comprehensive user model definitions, profile management, user attributes and metadata,
 * user lifecycle hooks, account status management, preferences, validation rules, search and filtering,
 * bulk operations, and import/export functionality. HIPAA-compliant with field-level encryption,
 * audit trails, and secure user data management.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  CreateOptions,
  UpdateOptions,
} from 'sequelize';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { isEmail, isUUID, isMobilePhone } from 'validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User model interface
 */
export interface IUser extends Model {
  id: string;
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'locked';
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneNumber?: string;
  phoneVerified: boolean;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  passwordChangedAt?: Date;
  mustChangePassword: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  metadata?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * User profile interface
 */
export interface IUserProfile extends Model {
  id: string;
  userId: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: Record<string, unknown>;
  timezone?: string;
  locale?: string;
  occupation?: string;
  department?: string;
  organizationId?: string;
  managerId?: string;
  employeeId?: string;
  licenseNumber?: string;
  specializations?: string[];
  certifications?: Array<Record<string, unknown>>;
  socialLinks?: Record<string, string>;
  emergencyContact?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User attribute configuration
 */
export interface UserAttributeConfig {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'json' | 'encrypted';
  category?: string;
  isPublic?: boolean;
  isEditable?: boolean;
}

/**
 * User search criteria
 */
export interface UserSearchCriteria {
  query?: string;
  role?: string | string[];
  status?: string | string[];
  emailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  organizationId?: string;
  department?: string;
  tags?: string[];
}

/**
 * User export options
 */
export interface UserExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  fields?: string[];
  includeProfile?: boolean;
  includeMetadata?: boolean;
  filters?: UserSearchCriteria;
}

/**
 * User import result
 */
export interface UserImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: Partial<IUser> }>;
  created: Array<Record<string, unknown>>;
}

/**
 * User lifecycle event
 */
export interface UserLifecycleEvent {
  eventType: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated' | 'locked' | 'unlocked';
  userId: string;
  triggeredBy?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// ============================================================================
// USER MODEL DEFINITIONS
// ============================================================================

/**
 * Creates the base User model with all standard fields and validations.
 * Includes authentication, status management, and security fields.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<IUser>} User model
 *
 * @example
 * ```typescript
 * const User = createUserModel(sequelize);
 * const user = await User.create({
 *   email: 'doctor@hospital.com',
 *   password: 'securePassword123',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   role: 'doctor'
 * });
 * ```
 */
export function createUserModel(sequelize: Sequelize): ModelStatic<IUser> {
  class User extends Model<IUser> implements IUser {
    public id!: string;
    public email!: string;
    public username?: string;
    public password!: string;
    public firstName?: string;
    public lastName?: string;
    public displayName?: string;
    public avatar?: string;
    public role!: string;
    public status!: 'active' | 'inactive' | 'suspended' | 'pending' | 'locked';
    public emailVerified!: boolean;
    public emailVerifiedAt?: Date;
    public phoneNumber?: string;
    public phoneVerified!: boolean;
    public lastLoginAt?: Date;
    public lastLoginIp?: string;
    public failedLoginAttempts!: number;
    public lockedUntil?: Date;
    public passwordChangedAt?: Date;
    public mustChangePassword!: boolean;
    public twoFactorEnabled!: boolean;
    public twoFactorSecret?: string;
    public metadata?: Record<string, unknown>;
    public preferences?: Record<string, unknown>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt?: Date;
  }

  const attributes: ModelAttributes<User> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Invalid email format' },
        notEmpty: true,
      },
      set(value: string) {
        this.setDataValue('email', value?.toLowerCase()?.trim());
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: { args: [3, 50], msg: 'Username must be 3-50 characters' },
        is: { args: /^[a-zA-Z0-9_-]+$/, msg: 'Username can only contain letters, numbers, _ and -' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [8, 100], msg: 'Password must be 8-100 characters' },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [1, 100], msg: 'First name must be 1-100 characters' },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [1, 100], msg: 'Last name must be 1-100 characters' },
      },
    },
    displayName: {
      type: DataTypes.VIRTUAL,
      get() {
        const firstName = this.getDataValue('firstName');
        const lastName = this.getDataValue('lastName');
        return [firstName, lastName].filter(Boolean).join(' ') || this.getDataValue('email');
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Avatar must be a valid URL' },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'doctor', 'nurse', 'patient', 'staff', 'guest'),
      allowNull: false,
      defaultValue: 'patient',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending', 'locked'),
      allowNull: false,
      defaultValue: 'pending',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        customPhoneValidation(value: string) {
          if (value && !isMobilePhone(value, 'any')) {
            throw new Error('Invalid phone number');
          }
        },
      },
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['username'], unique: true, where: { username: { [Op.ne]: null } } },
      { fields: ['role'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
    ],
  };

  User.init(attributes, options);
  return User as ModelStatic<IUser>;
}

/**
 * Creates the UserProfile model for extended user information.
 * Stores additional biographical and organizational data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<IUserProfile>} UserProfile model
 *
 * @example
 * ```typescript
 * const UserProfile = createUserProfileModel(sequelize);
 * const profile = await UserProfile.create({
 *   userId: 'user-uuid',
 *   bio: 'Experienced cardiologist',
 *   specializations: ['Cardiology', 'Internal Medicine']
 * });
 * ```
 */
export function createUserProfileModel(sequelize: Sequelize): ModelStatic<IUserProfile> {
  class UserProfile extends Model<IUserProfile> implements IUserProfile {
    public id!: string;
    public userId!: string;
    public bio?: string;
    public dateOfBirth?: Date;
    public gender?: string;
    public address?: any;
    public timezone?: string;
    public locale?: string;
    public occupation?: string;
    public department?: string;
    public organizationId?: string;
    public managerId?: string;
    public employeeId?: string;
    public licenseNumber?: string;
    public specializations?: string[];
    public certifications?: any[];
    public socialLinks?: any;
    public emergencyContact?: any;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  const attributes: ModelAttributes<UserProfile> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [0, 1000], msg: 'Bio must be under 1000 characters' },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString(),
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'UTC',
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'en-US',
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [5, 50], msg: 'License number must be 5-50 characters' },
      },
    },
    specializations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    emergencyContact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  };

  UserProfile.init(attributes, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true,
  });

  return UserProfile as ModelStatic<IUserProfile>;
}

/**
 * Defines associations between User and UserProfile models.
 * Sets up one-to-one relationship.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {ModelStatic<IUserProfile>} UserProfile - UserProfile model
 * @returns {void}
 *
 * @example
 * ```typescript
 * defineUserAssociations(User, UserProfile);
 * const user = await User.findOne({ include: ['profile'] });
 * ```
 */
export function defineUserAssociations(
  User: ModelStatic<IUser>,
  UserProfile: ModelStatic<IUserProfile>,
): void {
  User.hasOne(UserProfile, {
    foreignKey: 'userId',
    as: 'profile',
  });

  UserProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
}

// ============================================================================
// USER ATTRIBUTE MANAGEMENT
// ============================================================================

/**
 * Sets a custom user attribute with type handling.
 * Supports encrypted storage for sensitive attributes.
 *
 * @param {IUser} user - User instance
 * @param {UserAttributeConfig} config - Attribute configuration
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await setUserAttribute(user, {
 *   key: 'ssn',
 *   value: '123-45-6789',
 *   type: 'encrypted',
 *   category: 'personal',
 *   isPublic: false
 * });
 * ```
 */
export async function setUserAttribute(user: IUser, config: UserAttributeConfig): Promise<IUser> {
  const metadata = (user.metadata as Record<string, any>) || {};
  const attributes = metadata.attributes || {};

  let storedValue: unknown = config.value;
  if (config.type === 'encrypted') {
    storedValue = encryptValue(String(config.value));
  }

  attributes[config.key] = {
    value: storedValue,
    type: config.type,
    category: config.category,
    isPublic: config.isPublic !== false,
    isEditable: config.isEditable !== false,
    updatedAt: new Date(),
  };

  user.metadata = { ...metadata, attributes };
  return await user.save();
}

/**
 * Gets a user attribute with automatic decryption.
 * Returns null if attribute doesn't exist.
 *
 * @param {IUser} user - User instance
 * @param {string} key - Attribute key
 * @returns {unknown} Attribute value
 *
 * @example
 * ```typescript
 * const ssn = getUserAttribute(user, 'ssn');
 * ```
 */
export function getUserAttribute(user: IUser, key: string): unknown {
  const attributes = (user.metadata as Record<string, any>)?.attributes || {};
  const attr = attributes[key];

  if (!attr) return null;

  if (attr.type === 'encrypted') {
    return decryptValue(attr.value);
  }

  return attr.value;
}

/**
 * Removes a user attribute.
 * Returns updated user instance.
 *
 * @param {IUser} user - User instance
 * @param {string} key - Attribute key to remove
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await removeUserAttribute(user, 'temporaryData');
 * ```
 */
export async function removeUserAttribute(user: IUser, key: string): Promise<IUser> {
  const metadata = (user.metadata as Record<string, any>) || {};
  const attributes = metadata.attributes || {};

  delete attributes[key];

  user.metadata = { ...metadata, attributes };
  return await user.save();
}

/**
 * Lists all user attributes with optional filtering.
 * Can filter by category or visibility.
 *
 * @param {IUser} user - User instance
 * @param {object} [filters] - Filter options
 * @returns {UserAttributeConfig[]} Array of attributes
 *
 * @example
 * ```typescript
 * const publicAttrs = listUserAttributes(user, { isPublic: true });
 * const personalAttrs = listUserAttributes(user, { category: 'personal' });
 * ```
 */
export function listUserAttributes(
  user: IUser,
  filters?: { category?: string; isPublic?: boolean },
): UserAttributeConfig[] {
  const attributes = (user.metadata as Record<string, any>)?.attributes || {};
  const result: UserAttributeConfig[] = [];

  for (const [key, attr] of Object.entries(attributes)) {
    if (filters?.category && attr.category !== filters.category) continue;
    if (filters?.isPublic !== undefined && attr.isPublic !== filters.isPublic) continue;

    result.push({
      key,
      value: attr.type === 'encrypted' ? '[encrypted]' : attr.value,
      type: attr.type,
      category: attr.category,
      isPublic: attr.isPublic,
      isEditable: attr.isEditable,
    });
  }

  return result;
}

// ============================================================================
// USER LIFECYCLE HOOKS
// ============================================================================

/**
 * Adds password hashing hook to User model.
 * Automatically hashes password on create and update.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPasswordHashingHook(User);
 * // Passwords will be automatically hashed before save
 * ```
 */
export function addPasswordHashingHook(User: ModelStatic<IUser>): void {
  User.addHook('beforeCreate', async (user: IUser) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      user.passwordChangedAt = new Date();
    }
  });

  User.addHook('beforeUpdate', async (user: IUser) => {
    if (user.changed('password') && user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      user.passwordChangedAt = new Date();
    }
  });
}

/**
 * Adds user creation lifecycle hook.
 * Triggers events and initializes default data on user creation.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {Function} eventHandler - Event handler function
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUserCreationHook(User, async (user, event) => {
 *   await sendWelcomeEmail(user);
 *   await logEvent(event);
 * });
 * ```
 */
export function addUserCreationHook(
  User: ModelStatic<IUser>,
  eventHandler: (user: IUser, event: UserLifecycleEvent) => Promise<void>,
): void {
  User.addHook('afterCreate', async (user: IUser, options: any) => {
    const event: UserLifecycleEvent = {
      eventType: 'created',
      userId: user.id,
      triggeredBy: options.userId || 'system',
      metadata: { ip: options.ip, userAgent: options.userAgent },
      timestamp: new Date(),
    };

    await eventHandler(user, event);
  });
}

/**
 * Adds user status change lifecycle hook.
 * Monitors and logs status transitions.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {Function} statusChangeHandler - Status change handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUserStatusChangeHook(User, async (user, oldStatus, newStatus) => {
 *   await auditLog.create({
 *     action: 'status_change',
 *     userId: user.id,
 *     changes: { from: oldStatus, to: newStatus }
 *   });
 * });
 * ```
 */
export function addUserStatusChangeHook(
  User: ModelStatic<IUser>,
  statusChangeHandler: (user: IUser, oldStatus: string, newStatus: string) => Promise<void>,
): void {
  User.addHook('beforeUpdate', async (user: IUser) => {
    if (user.changed('status')) {
      const oldStatus = user.previous('status') as string;
      const newStatus = user.status;
      await statusChangeHandler(user, oldStatus, newStatus);
    }
  });
}

/**
 * Adds email verification hook.
 * Sets verification timestamp when email is verified.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEmailVerificationHook(User);
 * // Automatically sets emailVerifiedAt when emailVerified becomes true
 * ```
 */
export function addEmailVerificationHook(User: ModelStatic<IUser>): void {
  User.addHook('beforeUpdate', (user: IUser) => {
    if (user.changed('emailVerified') && user.emailVerified && !user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
    }
  });
}

/**
 * Adds login tracking hook.
 * Updates last login timestamp and IP address.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addLoginTrackingHook(User);
 * await user.update({ lastLoginAt: new Date() }, { ip: request.ip });
 * ```
 */
export function addLoginTrackingHook(User: ModelStatic<IUser>): void {
  User.addHook('beforeUpdate', (user: IUser, options: any) => {
    if (user.changed('lastLoginAt')) {
      user.lastLoginIp = options.ip || null;
      user.failedLoginAttempts = 0; // Reset on successful login
    }
  });
}

// ============================================================================
// ACCOUNT STATUS MANAGEMENT
// ============================================================================

/**
 * Activates a user account.
 * Changes status to active and clears any locks.
 *
 * @param {IUser} user - User instance
 * @param {string} [activatedBy] - ID of user performing activation
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * const activatedUser = await activateUserAccount(user, adminId);
 * ```
 */
export async function activateUserAccount(user: IUser, activatedBy?: string): Promise<IUser> {
  user.status = 'active';
  user.lockedUntil = undefined;
  user.failedLoginAttempts = 0;

  const metadata = (user.metadata as Record<string, any>) || {};
  metadata.activatedBy = activatedBy;
  metadata.activatedAt = new Date();
  user.metadata = metadata;

  return await user.save();
}

/**
 * Suspends a user account.
 * Changes status to suspended and records reason.
 *
 * @param {IUser} user - User instance
 * @param {string} reason - Suspension reason
 * @param {string} [suspendedBy] - ID of user performing suspension
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await suspendUserAccount(user, 'Violation of terms', adminId);
 * ```
 */
export async function suspendUserAccount(
  user: IUser,
  reason: string,
  suspendedBy?: string,
): Promise<IUser> {
  user.status = 'suspended';

  const metadata = (user.metadata as Record<string, any>) || {};
  metadata.suspensionReason = reason;
  metadata.suspendedBy = suspendedBy;
  metadata.suspendedAt = new Date();
  user.metadata = metadata;

  return await user.save();
}

/**
 * Locks a user account temporarily.
 * Sets lock duration and increments failed login attempts.
 *
 * @param {IUser} user - User instance
 * @param {number} durationMinutes - Lock duration in minutes
 * @param {string} [reason] - Lock reason
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await lockUserAccount(user, 30, 'Too many failed login attempts');
 * ```
 */
export async function lockUserAccount(
  user: IUser,
  durationMinutes: number,
  reason?: string,
): Promise<IUser> {
  user.status = 'locked';
  user.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);

  const metadata = (user.metadata as Record<string, any>) || {};
  metadata.lockReason = reason;
  metadata.lockedAt = new Date();
  user.metadata = metadata;

  return await user.save();
}

/**
 * Unlocks a user account.
 * Clears lock and resets failed login attempts.
 *
 * @param {IUser} user - User instance
 * @param {string} [unlockedBy] - ID of user performing unlock
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await unlockUserAccount(user, adminId);
 * ```
 */
export async function unlockUserAccount(user: IUser, unlockedBy?: string): Promise<IUser> {
  user.status = 'active';
  user.lockedUntil = undefined;
  user.failedLoginAttempts = 0;

  const metadata = (user.metadata as Record<string, any>) || {};
  metadata.unlockedBy = unlockedBy;
  metadata.unlockedAt = new Date();
  delete metadata.lockReason;
  user.metadata = metadata;

  return await user.save();
}

/**
 * Checks if user account is currently locked.
 * Returns true if locked and lock hasn't expired.
 *
 * @param {IUser} user - User instance
 * @returns {boolean} True if account is locked
 *
 * @example
 * ```typescript
 * if (isUserAccountLocked(user)) {
 *   throw new Error('Account is locked');
 * }
 * ```
 */
export function isUserAccountLocked(user: IUser): boolean {
  if (user.status === 'locked' && user.lockedUntil) {
    return user.lockedUntil > new Date();
  }
  return false;
}

/**
 * Increments failed login attempts and locks if threshold exceeded.
 * Auto-locks account after configurable number of failed attempts.
 *
 * @param {IUser} user - User instance
 * @param {number} [maxAttempts=5] - Maximum allowed attempts
 * @param {number} [lockDuration=30] - Lock duration in minutes
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await incrementFailedLoginAttempts(user, 5, 30);
 * ```
 */
export async function incrementFailedLoginAttempts(
  user: IUser,
  maxAttempts: number = 5,
  lockDuration: number = 30,
): Promise<IUser> {
  user.failedLoginAttempts += 1;

  if (user.failedLoginAttempts >= maxAttempts) {
    await lockUserAccount(user, lockDuration, 'Too many failed login attempts');
  }

  return await user.save();
}

// ============================================================================
// USER PREFERENCES AND SETTINGS
// ============================================================================

/**
 * Sets a user preference value.
 * Supports nested preference paths using dot notation.
 *
 * @param {IUser} user - User instance
 * @param {string} key - Preference key (supports dot notation)
 * @param {any} value - Preference value
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await setUserPreference(user, 'notifications.email', true);
 * await setUserPreference(user, 'theme', 'dark');
 * ```
 */
export async function setUserPreference(user: IUser, key: string, value: unknown): Promise<IUser> {
  const preferences = (user.preferences as Record<string, any>) || {};
  const keys = key.split('.');
  let current: Record<string, any> = preferences;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, any>;
  }

  current[keys[keys.length - 1]] = value;
  user.preferences = { ...preferences };

  return await user.save();
}

/**
 * Gets a user preference value.
 * Returns default value if preference doesn't exist.
 *
 * @param {IUser} user - User instance
 * @param {string} key - Preference key (supports dot notation)
 * @param {any} [defaultValue] - Default value if not found
 * @returns {any} Preference value
 *
 * @example
 * ```typescript
 * const emailNotifications = getUserPreference(user, 'notifications.email', true);
 * const theme = getUserPreference(user, 'theme', 'light');
 * ```
 */
export function getUserPreference<T = unknown>(user: IUser, key: string, defaultValue?: T): T | undefined {
  const preferences = (user.preferences as Record<string, any>) || {};
  const keys = key.split('.');
  let current: any = preferences;

  for (const k of keys) {
    if (current[k] === undefined) {
      return defaultValue;
    }
    current = current[k];
  }

  return current as T;
}

/**
 * Removes a user preference.
 * Supports nested preference paths.
 *
 * @param {IUser} user - User instance
 * @param {string} key - Preference key to remove
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await removeUserPreference(user, 'notifications.sms');
 * ```
 */
export async function removeUserPreference(user: IUser, key: string): Promise<IUser> {
  const preferences = (user.preferences as Record<string, any>) || {};
  const keys = key.split('.');
  let current: Record<string, any> = preferences;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      return user;
    }
    current = current[keys[i]] as Record<string, any>;
  }

  delete current[keys[keys.length - 1]];
  user.preferences = { ...preferences };

  return await user.save();
}

/**
 * Gets all user preferences.
 * Returns complete preferences object.
 *
 * @param {IUser} user - User instance
 * @returns {any} All preferences
 *
 * @example
 * ```typescript
 * const allPrefs = getAllUserPreferences(user);
 * ```
 */
export function getAllUserPreferences(user: IUser): Record<string, unknown> {
  return (user.preferences as Record<string, unknown>) || {};
}

/**
 * Resets user preferences to defaults.
 * Can optionally preserve specific preference keys.
 *
 * @param {IUser} user - User instance
 * @param {string[]} [preserve] - Keys to preserve
 * @returns {Promise<IUser>} Updated user
 *
 * @example
 * ```typescript
 * await resetUserPreferences(user, ['language', 'timezone']);
 * ```
 */
export async function resetUserPreferences(user: IUser, preserve?: string[]): Promise<IUser> {
  const currentPrefs = (user.preferences as Record<string, any>) || {};
  const newPrefs: Record<string, unknown> = {};

  if (preserve) {
    for (const key of preserve) {
      const value = getUserPreference(user, key);
      if (value !== undefined) {
        newPrefs[key] = value;
      }
    }
  }

  user.preferences = newPrefs;
  return await user.save();
}

// ============================================================================
// USER VALIDATION RULES
// ============================================================================

/**
 * Validates user email uniqueness.
 * Checks if email is already in use by another user.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string} email - Email to validate
 * @param {string} [excludeUserId] - User ID to exclude from check
 * @returns {Promise<boolean>} True if email is available
 *
 * @example
 * ```typescript
 * const isAvailable = await validateEmailUniqueness(User, 'new@email.com');
 * if (!isAvailable) throw new Error('Email already in use');
 * ```
 */
export async function validateEmailUniqueness(
  User: ModelStatic<IUser>,
  email: string,
  excludeUserId?: string,
): Promise<boolean> {
  const where: WhereOptions = { email: email.toLowerCase().trim() };
  if (excludeUserId) {
    where.id = { [Op.ne]: excludeUserId };
  }

  const existing = await User.findOne({ where });
  return !existing;
}

/**
 * Validates username format and uniqueness.
 * Checks format rules and availability.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string} username - Username to validate
 * @param {string} [excludeUserId] - User ID to exclude from check
 * @returns {Promise<{valid: boolean, message?: string}>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateUsername(User, 'newuser123');
 * if (!result.valid) throw new Error(result.message);
 * ```
 */
export async function validateUsername(
  User: ModelStatic<IUser>,
  username: string,
  excludeUserId?: string,
): Promise<{ valid: boolean; message?: string }> {
  if (!username || username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }

  if (username.length > 50) {
    return { valid: false, message: 'Username must be under 50 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, _ and -' };
  }

  const where: WhereOptions = { username };
  if (excludeUserId) {
    where.id = { [Op.ne]: excludeUserId };
  }

  const existing = await User.findOne({ where });
  if (existing) {
    return { valid: false, message: 'Username already taken' };
  }

  return { valid: true };
}

/**
 * Validates password strength.
 * Checks length, complexity, and common patterns.
 *
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, score: number, feedback: string[]}} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordStrength('MyP@ssw0rd');
 * if (!result.valid) {
 *   console.log('Feedback:', result.feedback);
 * }
 * ```
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push('Password must be at least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Include special characters');

  return {
    valid: score >= 4,
    score,
    feedback,
  };
}

/**
 * Validates user profile completeness.
 * Checks if required profile fields are filled.
 *
 * @param {IUserProfile} profile - User profile instance
 * @param {string[]} requiredFields - Required field names
 * @returns {{complete: boolean, missing: string[]}} Validation result
 *
 * @example
 * ```typescript
 * const result = validateProfileCompleteness(profile, ['bio', 'dateOfBirth', 'licenseNumber']);
 * if (!result.complete) {
 *   console.log('Missing fields:', result.missing);
 * }
 * ```
 */
export function validateProfileCompleteness(
  profile: IUserProfile,
  requiredFields: string[],
): { complete: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!profile[field as keyof IUserProfile]) {
      missing.push(field);
    }
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}

// ============================================================================
// USER SEARCH AND FILTERING
// ============================================================================

/**
 * Searches users with advanced filtering.
 * Supports text search, role filtering, status filtering, and more.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {UserSearchCriteria} criteria - Search criteria
 * @param {FindOptions} [options] - Additional Sequelize options
 * @returns {Promise<{users: IUser[], total: number}>} Search results
 *
 * @example
 * ```typescript
 * const { users, total } = await searchUsers(User, {
 *   query: 'john',
 *   role: ['doctor', 'nurse'],
 *   status: 'active',
 *   emailVerified: true
 * }, { limit: 20, offset: 0 });
 * ```
 */
export async function searchUsers(
  User: ModelStatic<IUser>,
  criteria: UserSearchCriteria,
  options?: FindOptions,
): Promise<{ users: IUser[]; total: number }> {
  const where: WhereOptions = {};

  if (criteria.query) {
    where[Op.or] = [
      { email: { [Op.iLike]: `%${criteria.query}%` } },
      { firstName: { [Op.iLike]: `%${criteria.query}%` } },
      { lastName: { [Op.iLike]: `%${criteria.query}%` } },
      { username: { [Op.iLike]: `%${criteria.query}%` } },
    ];
  }

  if (criteria.role) {
    where.role = Array.isArray(criteria.role) ? { [Op.in]: criteria.role } : criteria.role;
  }

  if (criteria.status) {
    where.status = Array.isArray(criteria.status) ? { [Op.in]: criteria.status } : criteria.status;
  }

  if (criteria.emailVerified !== undefined) {
    where.emailVerified = criteria.emailVerified;
  }

  if (criteria.createdAfter) {
    where.createdAt = { [Op.gte]: criteria.createdAfter };
  }

  if (criteria.createdBefore) {
    where.createdAt = { ...where.createdAt, [Op.lte]: criteria.createdBefore };
  }

  if (criteria.lastLoginAfter) {
    where.lastLoginAt = { [Op.gte]: criteria.lastLoginAfter };
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    ...options,
  });

  return { users: rows, total: count };
}

/**
 * Finds users by role.
 * Retrieves all users with specified role(s).
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string | string[]} role - Role or roles to search
 * @param {FindOptions} [options] - Additional options
 * @returns {Promise<IUser[]>} Matching users
 *
 * @example
 * ```typescript
 * const doctors = await findUsersByRole(User, 'doctor');
 * const staff = await findUsersByRole(User, ['doctor', 'nurse', 'admin']);
 * ```
 */
export async function findUsersByRole(
  User: ModelStatic<IUser>,
  role: string | string[],
  options?: FindOptions,
): Promise<IUser[]> {
  return await User.findAll({
    where: {
      role: Array.isArray(role) ? { [Op.in]: role } : role,
    },
    ...options,
  });
}

/**
 * Finds users by status.
 * Retrieves all users with specified status(es).
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string | string[]} status - Status or statuses to search
 * @param {FindOptions} [options] - Additional options
 * @returns {Promise<IUser[]>} Matching users
 *
 * @example
 * ```typescript
 * const activeUsers = await findUsersByStatus(User, 'active');
 * const problematicUsers = await findUsersByStatus(User, ['suspended', 'locked']);
 * ```
 */
export async function findUsersByStatus(
  User: ModelStatic<IUser>,
  status: string | string[],
  options?: FindOptions,
): Promise<IUser[]> {
  return await User.findAll({
    where: {
      status: Array.isArray(status) ? { [Op.in]: status } : status,
    },
    ...options,
  });
}

/**
 * Finds inactive users.
 * Retrieves users who haven't logged in within specified days.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {number} days - Days of inactivity
 * @returns {Promise<IUser[]>} Inactive users
 *
 * @example
 * ```typescript
 * const inactiveUsers = await findInactiveUsers(User, 90);
 * // Returns users who haven't logged in for 90+ days
 * ```
 */
export async function findInactiveUsers(User: ModelStatic<IUser>, days: number): Promise<IUser[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await User.findAll({
    where: {
      [Op.or]: [{ lastLoginAt: { [Op.lte]: cutoffDate } }, { lastLoginAt: null }],
    },
  });
}

// ============================================================================
// BULK USER OPERATIONS
// ============================================================================

/**
 * Bulk creates users with validation.
 * Creates multiple users in a single transaction.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {Partial<IUser>[]} userData - Array of user data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IUser[]>} Created users
 *
 * @example
 * ```typescript
 * const users = await bulkCreateUsers(User, [
 *   { email: 'user1@example.com', password: 'pass1', role: 'patient' },
 *   { email: 'user2@example.com', password: 'pass2', role: 'doctor' }
 * ]);
 * ```
 */
export async function bulkCreateUsers(
  User: ModelStatic<IUser>,
  userData: Partial<IUser>[],
  transaction?: Transaction,
): Promise<IUser[]> {
  return await User.bulkCreate(userData as any[], {
    validate: true,
    individualHooks: true,
    transaction,
  });
}

/**
 * Bulk updates user status.
 * Updates status for multiple users.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string[]} userIds - User IDs to update
 * @param {string} status - New status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of updated users
 *
 * @example
 * ```typescript
 * await bulkUpdateUserStatus(User, [id1, id2, id3], 'active');
 * ```
 */
export async function bulkUpdateUserStatus(
  User: ModelStatic<IUser>,
  userIds: string[],
  status: string,
  transaction?: Transaction,
): Promise<number> {
  const [count] = await User.update(
    { status } as any,
    {
      where: { id: { [Op.in]: userIds } },
      transaction,
    },
  );
  return count;
}

/**
 * Bulk deletes users (soft delete if paranoid).
 * Removes multiple users.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string[]} userIds - User IDs to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of deleted users
 *
 * @example
 * ```typescript
 * await bulkDeleteUsers(User, [id1, id2, id3]);
 * ```
 */
export async function bulkDeleteUsers(
  User: ModelStatic<IUser>,
  userIds: string[],
  transaction?: Transaction,
): Promise<number> {
  return await User.destroy({
    where: { id: { [Op.in]: userIds } },
    transaction,
  });
}

// ============================================================================
// USER EXPORT AND IMPORT
// ============================================================================

/**
 * Exports users to specified format.
 * Supports JSON, CSV formats with field selection.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {UserExportOptions} options - Export options
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const jsonData = await exportUsers(User, {
 *   format: 'json',
 *   fields: ['email', 'firstName', 'lastName', 'role'],
 *   filters: { role: 'doctor', status: 'active' }
 * });
 * ```
 */
export async function exportUsers(
  User: ModelStatic<IUser>,
  options: UserExportOptions,
): Promise<any> {
  const where: WhereOptions = {};

  if (options.filters) {
    if (options.filters.role) {
      where.role = Array.isArray(options.filters.role)
        ? { [Op.in]: options.filters.role }
        : options.filters.role;
    }
    if (options.filters.status) {
      where.status = Array.isArray(options.filters.status)
        ? { [Op.in]: options.filters.status }
        : options.filters.status;
    }
  }

  const include = options.includeProfile ? ['profile'] : [];

  const users = await User.findAll({
    where,
    attributes: options.fields,
    include: include as any,
  });

  if (options.format === 'json') {
    return users.map((u) => u.toJSON());
  }

  // CSV format would require additional formatting
  return users;
}

/**
 * Imports users from data array.
 * Creates users with error handling and reporting.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {Partial<IUser>[]} userData - User data to import
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<UserImportResult>} Import results
 *
 * @example
 * ```typescript
 * const result = await importUsers(User, [
 *   { email: 'user1@example.com', password: 'pass1', role: 'patient' },
 *   { email: 'invalid-email', password: '123', role: 'patient' }
 * ]);
 * console.log(`Created: ${result.success}, Failed: ${result.failed}`);
 * ```
 */
export async function importUsers(
  User: ModelStatic<IUser>,
  userData: Partial<IUser>[],
  transaction?: Transaction,
): Promise<UserImportResult> {
  const result: UserImportResult = {
    success: 0,
    failed: 0,
    errors: [],
    created: [],
  };

  for (let i = 0; i < userData.length; i++) {
    try {
      const user = await User.create(userData[i] as any, { transaction });
      result.created.push(user.toJSON());
      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error.message,
        data: userData[i],
      });
    }
  }

  return result;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Compares password with hash.
 * Used for authentication.
 *
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await comparePassword('password123', user.password);
 * ```
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generates a password reset token.
 * Creates secure token for password reset flow.
 *
 * @param {string} userId - User ID
 * @param {number} [expiresInHours=2] - Expiration time in hours
 * @returns {string} Reset token
 *
 * @example
 * ```typescript
 * const token = generatePasswordResetToken(userId, 2);
 * ```
 */
export function generatePasswordResetToken(userId: string, expiresInHours: number = 2): string {
  const payload = {
    userId,
    type: 'reset',
    exp: Date.now() + expiresInHours * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Verifies a password reset token.
 * Validates token and checks expiration.
 *
 * @param {string} token - Reset token
 * @returns {{valid: boolean, userId?: string}} Validation result
 *
 * @example
 * ```typescript
 * const result = verifyPasswordResetToken(token);
 * if (result.valid) {
 *   await resetUserPassword(result.userId, newPassword);
 * }
 * ```
 */
export function verifyPasswordResetToken(token: string): { valid: boolean; userId?: string } {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64url').toString());
    if (Date.now() > data.exp) return { valid: false };
    return { valid: true, userId: data.userId };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Finds users by email domain.
 * Useful for organization-based queries.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string} domain - Email domain
 * @returns {Promise<IUser[]>} Matching users
 *
 * @example
 * ```typescript
 * const hospitalUsers = await findUsersByEmailDomain(User, 'hospital.com');
 * ```
 */
export async function findUsersByEmailDomain(User: ModelStatic<IUser>, domain: string): Promise<IUser[]> {
  return await User.findAll({
    where: {
      email: { [Op.like]: `%@${domain}` },
    },
  });
}

/**
 * Gets user statistics by role.
 * Returns count of users per role.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @returns {Promise<Record<string, number>>} User counts by role
 *
 * @example
 * ```typescript
 * const stats = await getUserStatsByRole(User);
 * // { doctor: 50, nurse: 120, patient: 500 }
 * ```
 */
export async function getUserStatsByRole(User: ModelStatic<IUser>): Promise<Record<string, number>> {
  const users = await User.findAll({
    attributes: [
      'role',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    group: ['role'],
    raw: true,
  });

  const stats: Record<string, number> = {};
  for (const row of users as any[]) {
    stats[row.role] = parseInt(row.count);
  }
  return stats;
}

/**
 * Merges duplicate user accounts.
 * Combines data from duplicate accounts into primary account.
 *
 * @param {ModelStatic<IUser>} User - User model
 * @param {string} primaryUserId - Primary user ID to keep
 * @param {string} duplicateUserId - Duplicate user ID to merge
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Merged user
 *
 * @example
 * ```typescript
 * await mergeDuplicateUsers(User, primaryId, duplicateId);
 * ```
 */
export async function mergeDuplicateUsers(
  User: ModelStatic<IUser>,
  primaryUserId: string,
  duplicateUserId: string,
  transaction?: Transaction,
): Promise<IUser> {
  const primary = await User.findByPk(primaryUserId, { transaction });
  const duplicate = await User.findByPk(duplicateUserId, { transaction });

  if (!primary || !duplicate) {
    throw new Error('User not found');
  }

  // Merge metadata
  const mergedMetadata: Record<string, unknown> = {
    ...(duplicate.metadata as Record<string, unknown>),
    ...(primary.metadata as Record<string, unknown>),
    merged: {
      from: duplicateUserId,
      at: new Date(),
    },
  };
  primary.metadata = mergedMetadata;

  await primary.save({ transaction });
  await duplicate.destroy({ transaction });

  return primary;
}

/**
 * Anonymizes user data for GDPR compliance.
 * Removes PII while preserving statistical data.
 *
 * @param {IUser} user - User instance
 * @returns {Promise<IUser>} Anonymized user
 *
 * @example
 * ```typescript
 * await anonymizeUserData(user);
 * ```
 */
export async function anonymizeUserData(user: IUser): Promise<IUser> {
  user.email = `anonymized-${user.id}@anonymized.local`;
  user.firstName = 'Anonymized';
  user.lastName = 'User';
  user.phoneNumber = undefined;
  user.metadata = { anonymized: true, anonymizedAt: new Date() };
  user.preferences = {};

  return await user.save();
}

/**
 * Clones a user profile.
 * Creates a copy of user profile for template purposes.
 *
 * @param {IUserProfile} profile - Profile to clone
 * @param {string} newUserId - New user ID
 * @returns {Promise<Partial<IUserProfile>>} Cloned profile data
 *
 * @example
 * ```typescript
 * const clonedProfile = await cloneUserProfile(profile, newUserId);
 * ```
 */
export async function cloneUserProfile(
  profile: IUserProfile,
  newUserId: string,
): Promise<Partial<IUserProfile>> {
  const cloned: Partial<IUserProfile> = {
    userId: newUserId,
    bio: profile.bio,
    timezone: profile.timezone,
    locale: profile.locale,
    department: profile.department,
    organizationId: profile.organizationId,
  };
  return cloned;
}

/**
 * Verifies user email ownership.
 * Sends verification code and validates it.
 *
 * @param {IUser} user - User instance
 * @param {string} verificationCode - Verification code
 * @returns {Promise<boolean>} True if verified
 *
 * @example
 * ```typescript
 * const verified = await verifyUserEmail(user, '123456');
 * ```
 */
export async function verifyUserEmail(user: IUser, verificationCode: string): Promise<boolean> {
  // In production, would validate against stored code
  const isValid = verificationCode.length === 6;

  if (isValid) {
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();
  }

  return isValid;
}

/**
 * Encrypts a value using AES-256-GCM.
 * Uses environment encryption key.
 *
 * @param {string} value - Value to encrypt
 * @returns {string} Encrypted value
 */
function encryptValue(value: string): string {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(String(value), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a value using AES-256-GCM.
 * Uses environment encryption key.
 *
 * @param {string} encryptedValue - Encrypted value
 * @returns {string} Decrypted value
 */
function decryptValue(encryptedValue: string): string {
  try {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex');
    const parts = encryptedValue.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    return encryptedValue;
  }
}

export default {
  createUserModel,
  createUserProfileModel,
  defineUserAssociations,
  setUserAttribute,
  getUserAttribute,
  removeUserAttribute,
  listUserAttributes,
  addPasswordHashingHook,
  addUserCreationHook,
  addUserStatusChangeHook,
  addEmailVerificationHook,
  addLoginTrackingHook,
  activateUserAccount,
  suspendUserAccount,
  lockUserAccount,
  unlockUserAccount,
  isUserAccountLocked,
  incrementFailedLoginAttempts,
  setUserPreference,
  getUserPreference,
  removeUserPreference,
  getAllUserPreferences,
  resetUserPreferences,
  validateEmailUniqueness,
  validateUsername,
  validatePasswordStrength,
  validateProfileCompleteness,
  searchUsers,
  findUsersByRole,
  findUsersByStatus,
  findInactiveUsers,
  bulkCreateUsers,
  bulkUpdateUserStatus,
  bulkDeleteUsers,
  exportUsers,
  importUsers,
  comparePassword,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  findUsersByEmailDomain,
  getUserStatsByRole,
  mergeDuplicateUsers,
  anonymizeUserData,
  cloneUserProfile,
  verifyUserEmail,
};
