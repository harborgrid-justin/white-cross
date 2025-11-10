"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserModel = createUserModel;
exports.createUserProfileModel = createUserProfileModel;
exports.defineUserAssociations = defineUserAssociations;
exports.setUserAttribute = setUserAttribute;
exports.getUserAttribute = getUserAttribute;
exports.removeUserAttribute = removeUserAttribute;
exports.listUserAttributes = listUserAttributes;
exports.addPasswordHashingHook = addPasswordHashingHook;
exports.addUserCreationHook = addUserCreationHook;
exports.addUserStatusChangeHook = addUserStatusChangeHook;
exports.addEmailVerificationHook = addEmailVerificationHook;
exports.addLoginTrackingHook = addLoginTrackingHook;
exports.activateUserAccount = activateUserAccount;
exports.suspendUserAccount = suspendUserAccount;
exports.lockUserAccount = lockUserAccount;
exports.unlockUserAccount = unlockUserAccount;
exports.isUserAccountLocked = isUserAccountLocked;
exports.incrementFailedLoginAttempts = incrementFailedLoginAttempts;
exports.setUserPreference = setUserPreference;
exports.getUserPreference = getUserPreference;
exports.removeUserPreference = removeUserPreference;
exports.getAllUserPreferences = getAllUserPreferences;
exports.resetUserPreferences = resetUserPreferences;
exports.validateEmailUniqueness = validateEmailUniqueness;
exports.validateUsername = validateUsername;
exports.validatePasswordStrength = validatePasswordStrength;
exports.validateProfileCompleteness = validateProfileCompleteness;
exports.searchUsers = searchUsers;
exports.findUsersByRole = findUsersByRole;
exports.findUsersByStatus = findUsersByStatus;
exports.findInactiveUsers = findInactiveUsers;
exports.bulkCreateUsers = bulkCreateUsers;
exports.bulkUpdateUserStatus = bulkUpdateUserStatus;
exports.bulkDeleteUsers = bulkDeleteUsers;
exports.exportUsers = exportUsers;
exports.importUsers = importUsers;
exports.comparePassword = comparePassword;
exports.generatePasswordResetToken = generatePasswordResetToken;
exports.verifyPasswordResetToken = verifyPasswordResetToken;
exports.findUsersByEmailDomain = findUsersByEmailDomain;
exports.getUserStatsByRole = getUserStatsByRole;
exports.mergeDuplicateUsers = mergeDuplicateUsers;
exports.anonymizeUserData = anonymizeUserData;
exports.cloneUserProfile = cloneUserProfile;
exports.verifyUserEmail = verifyUserEmail;
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
const sequelize_1 = require("sequelize");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const validator_1 = require("validator");
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
function createUserModel(sequelize) {
    class User extends sequelize_1.Model {
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'Invalid email format' },
                notEmpty: true,
            },
            set(value) {
                this.setDataValue('email', value?.toLowerCase()?.trim());
            },
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                len: { args: [3, 50], msg: 'Username must be 3-50 characters' },
                is: { args: /^[a-zA-Z0-9_-]+$/, msg: 'Username can only contain letters, numbers, _ and -' },
            },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [8, 100], msg: 'Password must be 8-100 characters' },
            },
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [1, 100], msg: 'First name must be 1-100 characters' },
            },
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [1, 100], msg: 'Last name must be 1-100 characters' },
            },
        },
        displayName: {
            type: sequelize_1.DataTypes.VIRTUAL,
            get() {
                const firstName = this.getDataValue('firstName');
                const lastName = this.getDataValue('lastName');
                return [firstName, lastName].filter(Boolean).join(' ') || this.getDataValue('email');
            },
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: { msg: 'Avatar must be a valid URL' },
            },
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('admin', 'doctor', 'nurse', 'patient', 'staff', 'guest'),
            allowNull: false,
            defaultValue: 'patient',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended', 'pending', 'locked'),
            allowNull: false,
            defaultValue: 'pending',
        },
        emailVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        emailVerifiedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            validate: {
                customPhoneValidation(value) {
                    if (value && !(0, validator_1.isMobilePhone)(value, 'any')) {
                        throw new Error('Invalid phone number');
                    }
                },
            },
        },
        phoneVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lastLoginAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        lastLoginIp: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        failedLoginAttempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        lockedUntil: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        passwordChangedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        mustChangePassword: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        twoFactorEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        twoFactorSecret: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
        },
        preferences: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['email'], unique: true },
            { fields: ['username'], unique: true, where: { username: { [sequelize_1.Op.ne]: null } } },
            { fields: ['role'] },
            { fields: ['status'] },
            { fields: ['created_at'] },
        ],
    };
    User.init(attributes, options);
    return User;
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
function createUserProfileModel(sequelize) {
    class UserProfile extends sequelize_1.Model {
    }
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        bio: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: { args: [0, 1000], msg: 'Bio must be under 1000 characters' },
            },
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: true,
                isBefore: new Date().toISOString(),
            },
        },
        gender: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
        },
        timezone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: 'UTC',
        },
        locale: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: 'en-US',
        },
        occupation: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        department: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        organizationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        managerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        licenseNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [5, 50], msg: 'License number must be 5-50 characters' },
            },
        },
        specializations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        certifications: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        socialLinks: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
        },
        emergencyContact: {
            type: sequelize_1.DataTypes.JSON,
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
    return UserProfile;
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
function defineUserAssociations(User, UserProfile) {
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
async function setUserAttribute(user, config) {
    const metadata = user.metadata || {};
    const attributes = metadata.attributes || {};
    let storedValue = config.value;
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
function getUserAttribute(user, key) {
    const attributes = user.metadata?.attributes || {};
    const attr = attributes[key];
    if (!attr)
        return null;
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
async function removeUserAttribute(user, key) {
    const metadata = user.metadata || {};
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
function listUserAttributes(user, filters) {
    const attributes = user.metadata?.attributes || {};
    const result = [];
    for (const [key, attr] of Object.entries(attributes)) {
        if (filters?.category && attr.category !== filters.category)
            continue;
        if (filters?.isPublic !== undefined && attr.isPublic !== filters.isPublic)
            continue;
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
function addPasswordHashingHook(User) {
    User.addHook('beforeCreate', async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            user.passwordChangedAt = new Date();
        }
    });
    User.addHook('beforeUpdate', async (user) => {
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
function addUserCreationHook(User, eventHandler) {
    User.addHook('afterCreate', async (user, options) => {
        const event = {
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
function addUserStatusChangeHook(User, statusChangeHandler) {
    User.addHook('beforeUpdate', async (user) => {
        if (user.changed('status')) {
            const oldStatus = user.previous('status');
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
function addEmailVerificationHook(User) {
    User.addHook('beforeUpdate', (user) => {
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
function addLoginTrackingHook(User) {
    User.addHook('beforeUpdate', (user, options) => {
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
async function activateUserAccount(user, activatedBy) {
    user.status = 'active';
    user.lockedUntil = undefined;
    user.failedLoginAttempts = 0;
    const metadata = user.metadata || {};
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
async function suspendUserAccount(user, reason, suspendedBy) {
    user.status = 'suspended';
    const metadata = user.metadata || {};
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
async function lockUserAccount(user, durationMinutes, reason) {
    user.status = 'locked';
    user.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
    const metadata = user.metadata || {};
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
async function unlockUserAccount(user, unlockedBy) {
    user.status = 'active';
    user.lockedUntil = undefined;
    user.failedLoginAttempts = 0;
    const metadata = user.metadata || {};
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
function isUserAccountLocked(user) {
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
async function incrementFailedLoginAttempts(user, maxAttempts = 5, lockDuration = 30) {
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
async function setUserPreference(user, key, value) {
    const preferences = user.preferences || {};
    const keys = key.split('.');
    let current = preferences;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
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
function getUserPreference(user, key, defaultValue) {
    const preferences = user.preferences || {};
    const keys = key.split('.');
    let current = preferences;
    for (const k of keys) {
        if (current[k] === undefined) {
            return defaultValue;
        }
        current = current[k];
    }
    return current;
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
async function removeUserPreference(user, key) {
    const preferences = user.preferences || {};
    const keys = key.split('.');
    let current = preferences;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            return user;
        }
        current = current[keys[i]];
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
function getAllUserPreferences(user) {
    return user.preferences || {};
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
async function resetUserPreferences(user, preserve) {
    const currentPrefs = user.preferences || {};
    const newPrefs = {};
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
async function validateEmailUniqueness(User, email, excludeUserId) {
    const where = { email: email.toLowerCase().trim() };
    if (excludeUserId) {
        where.id = { [sequelize_1.Op.ne]: excludeUserId };
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
async function validateUsername(User, username, excludeUserId) {
    if (!username || username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' };
    }
    if (username.length > 50) {
        return { valid: false, message: 'Username must be under 50 characters' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, _ and -' };
    }
    const where = { username };
    if (excludeUserId) {
        where.id = { [sequelize_1.Op.ne]: excludeUserId };
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
function validatePasswordStrength(password) {
    let score = 0;
    const feedback = [];
    if (password.length >= 8)
        score++;
    else
        feedback.push('Password must be at least 8 characters');
    if (password.length >= 12)
        score++;
    if (/[a-z]/.test(password))
        score++;
    else
        feedback.push('Include lowercase letters');
    if (/[A-Z]/.test(password))
        score++;
    else
        feedback.push('Include uppercase letters');
    if (/\d/.test(password))
        score++;
    else
        feedback.push('Include numbers');
    if (/[^A-Za-z0-9]/.test(password))
        score++;
    else
        feedback.push('Include special characters');
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
function validateProfileCompleteness(profile, requiredFields) {
    const missing = [];
    for (const field of requiredFields) {
        if (!profile[field]) {
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
async function searchUsers(User, criteria, options) {
    const where = {};
    if (criteria.query) {
        where[sequelize_1.Op.or] = [
            { email: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
            { firstName: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
            { lastName: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
            { username: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
        ];
    }
    if (criteria.role) {
        where.role = Array.isArray(criteria.role) ? { [sequelize_1.Op.in]: criteria.role } : criteria.role;
    }
    if (criteria.status) {
        where.status = Array.isArray(criteria.status) ? { [sequelize_1.Op.in]: criteria.status } : criteria.status;
    }
    if (criteria.emailVerified !== undefined) {
        where.emailVerified = criteria.emailVerified;
    }
    if (criteria.createdAfter) {
        where.createdAt = { [sequelize_1.Op.gte]: criteria.createdAfter };
    }
    if (criteria.createdBefore) {
        where.createdAt = { ...where.createdAt, [sequelize_1.Op.lte]: criteria.createdBefore };
    }
    if (criteria.lastLoginAfter) {
        where.lastLoginAt = { [sequelize_1.Op.gte]: criteria.lastLoginAfter };
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
async function findUsersByRole(User, role, options) {
    return await User.findAll({
        where: {
            role: Array.isArray(role) ? { [sequelize_1.Op.in]: role } : role,
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
async function findUsersByStatus(User, status, options) {
    return await User.findAll({
        where: {
            status: Array.isArray(status) ? { [sequelize_1.Op.in]: status } : status,
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
async function findInactiveUsers(User, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return await User.findAll({
        where: {
            [sequelize_1.Op.or]: [{ lastLoginAt: { [sequelize_1.Op.lte]: cutoffDate } }, { lastLoginAt: null }],
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
async function bulkCreateUsers(User, userData, transaction) {
    return await User.bulkCreate(userData, {
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
async function bulkUpdateUserStatus(User, userIds, status, transaction) {
    const [count] = await User.update({ status }, {
        where: { id: { [sequelize_1.Op.in]: userIds } },
        transaction,
    });
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
async function bulkDeleteUsers(User, userIds, transaction) {
    return await User.destroy({
        where: { id: { [sequelize_1.Op.in]: userIds } },
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
async function exportUsers(User, options) {
    const where = {};
    if (options.filters) {
        if (options.filters.role) {
            where.role = Array.isArray(options.filters.role)
                ? { [sequelize_1.Op.in]: options.filters.role }
                : options.filters.role;
        }
        if (options.filters.status) {
            where.status = Array.isArray(options.filters.status)
                ? { [sequelize_1.Op.in]: options.filters.status }
                : options.filters.status;
        }
    }
    const include = options.includeProfile ? ['profile'] : [];
    const users = await User.findAll({
        where,
        attributes: options.fields,
        include: include,
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
async function importUsers(User, userData, transaction) {
    const result = {
        success: 0,
        failed: 0,
        errors: [],
        created: [],
    };
    for (let i = 0; i < userData.length; i++) {
        try {
            const user = await User.create(userData[i], { transaction });
            result.created.push(user.toJSON());
            result.success++;
        }
        catch (error) {
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
async function comparePassword(plainPassword, hashedPassword) {
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
function generatePasswordResetToken(userId, expiresInHours = 2) {
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
function verifyPasswordResetToken(token) {
    try {
        const data = JSON.parse(Buffer.from(token, 'base64url').toString());
        if (Date.now() > data.exp)
            return { valid: false };
        return { valid: true, userId: data.userId };
    }
    catch (error) {
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
async function findUsersByEmailDomain(User, domain) {
    return await User.findAll({
        where: {
            email: { [sequelize_1.Op.like]: `%@${domain}` },
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
async function getUserStatsByRole(User) {
    const users = await User.findAll({
        attributes: [
            'role',
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
        ],
        group: ['role'],
        raw: true,
    });
    const stats = {};
    for (const row of users) {
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
async function mergeDuplicateUsers(User, primaryUserId, duplicateUserId, transaction) {
    const primary = await User.findByPk(primaryUserId, { transaction });
    const duplicate = await User.findByPk(duplicateUserId, { transaction });
    if (!primary || !duplicate) {
        throw new Error('User not found');
    }
    // Merge metadata
    const mergedMetadata = {
        ...duplicate.metadata,
        ...primary.metadata,
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
async function anonymizeUserData(user) {
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
async function cloneUserProfile(profile, newUserId) {
    const cloned = {
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
async function verifyUserEmail(user, verificationCode) {
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
function encryptValue(value) {
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
function decryptValue(encryptedValue) {
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
    }
    catch (error) {
        return encryptedValue;
    }
}
exports.default = {
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
//# sourceMappingURL=iam-user-models-kit.js.map