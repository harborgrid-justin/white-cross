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
import { Model, ModelStatic, Sequelize, FindOptions, Transaction } from 'sequelize';
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
    errors: Array<{
        row: number;
        error: string;
        data: Partial<IUser>;
    }>;
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
export declare function createUserModel(sequelize: Sequelize): ModelStatic<IUser>;
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
export declare function createUserProfileModel(sequelize: Sequelize): ModelStatic<IUserProfile>;
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
export declare function defineUserAssociations(User: ModelStatic<IUser>, UserProfile: ModelStatic<IUserProfile>): void;
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
export declare function setUserAttribute(user: IUser, config: UserAttributeConfig): Promise<IUser>;
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
export declare function getUserAttribute(user: IUser, key: string): unknown;
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
export declare function removeUserAttribute(user: IUser, key: string): Promise<IUser>;
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
export declare function listUserAttributes(user: IUser, filters?: {
    category?: string;
    isPublic?: boolean;
}): UserAttributeConfig[];
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
export declare function addPasswordHashingHook(User: ModelStatic<IUser>): void;
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
export declare function addUserCreationHook(User: ModelStatic<IUser>, eventHandler: (user: IUser, event: UserLifecycleEvent) => Promise<void>): void;
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
export declare function addUserStatusChangeHook(User: ModelStatic<IUser>, statusChangeHandler: (user: IUser, oldStatus: string, newStatus: string) => Promise<void>): void;
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
export declare function addEmailVerificationHook(User: ModelStatic<IUser>): void;
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
export declare function addLoginTrackingHook(User: ModelStatic<IUser>): void;
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
export declare function activateUserAccount(user: IUser, activatedBy?: string): Promise<IUser>;
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
export declare function suspendUserAccount(user: IUser, reason: string, suspendedBy?: string): Promise<IUser>;
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
export declare function lockUserAccount(user: IUser, durationMinutes: number, reason?: string): Promise<IUser>;
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
export declare function unlockUserAccount(user: IUser, unlockedBy?: string): Promise<IUser>;
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
export declare function isUserAccountLocked(user: IUser): boolean;
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
export declare function incrementFailedLoginAttempts(user: IUser, maxAttempts?: number, lockDuration?: number): Promise<IUser>;
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
export declare function setUserPreference(user: IUser, key: string, value: unknown): Promise<IUser>;
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
export declare function getUserPreference<T = unknown>(user: IUser, key: string, defaultValue?: T): T | undefined;
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
export declare function removeUserPreference(user: IUser, key: string): Promise<IUser>;
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
export declare function getAllUserPreferences(user: IUser): Record<string, unknown>;
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
export declare function resetUserPreferences(user: IUser, preserve?: string[]): Promise<IUser>;
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
export declare function validateEmailUniqueness(User: ModelStatic<IUser>, email: string, excludeUserId?: string): Promise<boolean>;
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
export declare function validateUsername(User: ModelStatic<IUser>, username: string, excludeUserId?: string): Promise<{
    valid: boolean;
    message?: string;
}>;
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
export declare function validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
};
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
export declare function validateProfileCompleteness(profile: IUserProfile, requiredFields: string[]): {
    complete: boolean;
    missing: string[];
};
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
export declare function searchUsers(User: ModelStatic<IUser>, criteria: UserSearchCriteria, options?: FindOptions): Promise<{
    users: IUser[];
    total: number;
}>;
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
export declare function findUsersByRole(User: ModelStatic<IUser>, role: string | string[], options?: FindOptions): Promise<IUser[]>;
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
export declare function findUsersByStatus(User: ModelStatic<IUser>, status: string | string[], options?: FindOptions): Promise<IUser[]>;
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
export declare function findInactiveUsers(User: ModelStatic<IUser>, days: number): Promise<IUser[]>;
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
export declare function bulkCreateUsers(User: ModelStatic<IUser>, userData: Partial<IUser>[], transaction?: Transaction): Promise<IUser[]>;
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
export declare function bulkUpdateUserStatus(User: ModelStatic<IUser>, userIds: string[], status: string, transaction?: Transaction): Promise<number>;
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
export declare function bulkDeleteUsers(User: ModelStatic<IUser>, userIds: string[], transaction?: Transaction): Promise<number>;
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
export declare function exportUsers(User: ModelStatic<IUser>, options: UserExportOptions): Promise<any>;
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
export declare function importUsers(User: ModelStatic<IUser>, userData: Partial<IUser>[], transaction?: Transaction): Promise<UserImportResult>;
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
export declare function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
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
export declare function generatePasswordResetToken(userId: string, expiresInHours?: number): string;
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
export declare function verifyPasswordResetToken(token: string): {
    valid: boolean;
    userId?: string;
};
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
export declare function findUsersByEmailDomain(User: ModelStatic<IUser>, domain: string): Promise<IUser[]>;
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
export declare function getUserStatsByRole(User: ModelStatic<IUser>): Promise<Record<string, number>>;
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
export declare function mergeDuplicateUsers(User: ModelStatic<IUser>, primaryUserId: string, duplicateUserId: string, transaction?: Transaction): Promise<IUser>;
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
export declare function anonymizeUserData(user: IUser): Promise<IUser>;
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
export declare function cloneUserProfile(profile: IUserProfile, newUserId: string): Promise<Partial<IUserProfile>>;
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
export declare function verifyUserEmail(user: IUser, verificationCode: string): Promise<boolean>;
declare const _default: {
    createUserModel: typeof createUserModel;
    createUserProfileModel: typeof createUserProfileModel;
    defineUserAssociations: typeof defineUserAssociations;
    setUserAttribute: typeof setUserAttribute;
    getUserAttribute: typeof getUserAttribute;
    removeUserAttribute: typeof removeUserAttribute;
    listUserAttributes: typeof listUserAttributes;
    addPasswordHashingHook: typeof addPasswordHashingHook;
    addUserCreationHook: typeof addUserCreationHook;
    addUserStatusChangeHook: typeof addUserStatusChangeHook;
    addEmailVerificationHook: typeof addEmailVerificationHook;
    addLoginTrackingHook: typeof addLoginTrackingHook;
    activateUserAccount: typeof activateUserAccount;
    suspendUserAccount: typeof suspendUserAccount;
    lockUserAccount: typeof lockUserAccount;
    unlockUserAccount: typeof unlockUserAccount;
    isUserAccountLocked: typeof isUserAccountLocked;
    incrementFailedLoginAttempts: typeof incrementFailedLoginAttempts;
    setUserPreference: typeof setUserPreference;
    getUserPreference: typeof getUserPreference;
    removeUserPreference: typeof removeUserPreference;
    getAllUserPreferences: typeof getAllUserPreferences;
    resetUserPreferences: typeof resetUserPreferences;
    validateEmailUniqueness: typeof validateEmailUniqueness;
    validateUsername: typeof validateUsername;
    validatePasswordStrength: typeof validatePasswordStrength;
    validateProfileCompleteness: typeof validateProfileCompleteness;
    searchUsers: typeof searchUsers;
    findUsersByRole: typeof findUsersByRole;
    findUsersByStatus: typeof findUsersByStatus;
    findInactiveUsers: typeof findInactiveUsers;
    bulkCreateUsers: typeof bulkCreateUsers;
    bulkUpdateUserStatus: typeof bulkUpdateUserStatus;
    bulkDeleteUsers: typeof bulkDeleteUsers;
    exportUsers: typeof exportUsers;
    importUsers: typeof importUsers;
    comparePassword: typeof comparePassword;
    generatePasswordResetToken: typeof generatePasswordResetToken;
    verifyPasswordResetToken: typeof verifyPasswordResetToken;
    findUsersByEmailDomain: typeof findUsersByEmailDomain;
    getUserStatsByRole: typeof getUserStatsByRole;
    mergeDuplicateUsers: typeof mergeDuplicateUsers;
    anonymizeUserData: typeof anonymizeUserData;
    cloneUserProfile: typeof cloneUserProfile;
    verifyUserEmail: typeof verifyUserEmail;
};
export default _default;
//# sourceMappingURL=iam-user-models-kit.d.ts.map