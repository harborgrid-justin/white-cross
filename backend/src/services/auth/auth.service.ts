/**
 * @fileoverview Authentication Service
 * @module services/auth/auth.service
 * @description Centralized authentication service for user registration, login, verification, and token management.
 * Provides abstraction layer over direct User model access with built-in audit logging.
 *
 * Key Features:
 * - User registration with password hashing
 * - User authentication with credentials validation
 * - Token verification and refresh
 * - Test user management for development/testing
 * - Comprehensive audit logging for all authentication operations
 * - HIPAA-compliant audit trail for PHI access
 *
 * @security All authentication operations are logged for compliance
 * @security Passwords are hashed using bcrypt before storage
 * @compliance HIPAA - Authentication audit trail required
 * @compliance SOC2 - Access control and authentication monitoring
 */

import { User } from '../../database/models';
import { AuditLogService } from '../audit/auditLogService';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface UserRegistrationData
 * @description Data required for user registration
 */
export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

/**
 * @interface UserAuthenticationData
 * @description Data required for user authentication
 */
export interface UserAuthenticationData {
  email: string;
  password: string;
}

/**
 * @interface AuthServiceOptions
 * @description Configuration options for AuthService
 */
export interface AuthServiceOptions {
  /** Whether to log authentication operations to audit log */
  enableAuditLogging?: boolean;
  /** Bcrypt salt rounds for password hashing */
  saltRounds?: number;
}

/**
 * @class AuthService
 * @description Service layer for authentication operations
 *
 * Provides centralized authentication logic with:
 * - User registration and validation
 * - Credential verification
 * - Token management
 * - Audit logging for compliance
 * - Test user management
 *
 * @example
 * ```typescript
 * const authService = new AuthService();
 *
 * // Register new user
 * const user = await authService.registerUser({
 *   email: 'nurse@school.edu',
 *   password: 'SecurePass123!',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: 'nurse'
 * });
 *
 * // Authenticate user
 * const authenticatedUser = await authService.authenticateUser({
 *   email: 'nurse@school.edu',
 *   password: 'SecurePass123!'
 * });
 *
 * // Verify user by ID
 * const user = await authService.verifyUser(userId);
 * ```
 */
export class AuthService {
  private auditLogService: AuditLogService;
  private saltRounds: number;
  private enableAuditLogging: boolean;

  /**
   * Create new AuthService instance
   *
   * @param {AuthServiceOptions} [options] - Service configuration options
   */
  constructor(options: AuthServiceOptions = {}) {
    this.auditLogService = new AuditLogService();
    this.saltRounds = options.saltRounds || 10;
    this.enableAuditLogging = options.enableAuditLogging !== false;
  }

  /**
   * Register a new user in the system
   *
   * @param {UserRegistrationData} data - User registration data
   * @returns {Promise<User>} Created user instance
   * @throws {Error} If email already exists or validation fails
   *
   * @audit Logs user registration attempt and result
   *
   * @example
   * ```typescript
   * const user = await authService.registerUser({
   *   email: 'nurse@school.edu',
   *   password: 'SecurePass123!',
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   role: 'nurse'
   * });
   * ```
   */
  async registerUser(data: UserRegistrationData): Promise<User> {
    const { email, password, firstName, lastName, role } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (this.enableAuditLogging) {
        await this.auditLogService.logAction({
          action: 'user_registration_failed',
          performedBy: null,
          resourceType: 'User',
          resourceId: null,
          changes: { email, reason: 'Email already exists' },
          ipAddress: null,
        });
      }
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'nurse',
    });

    // Audit log
    if (this.enableAuditLogging) {
      await this.auditLogService.logAction({
        action: 'user_registered',
        performedBy: user.id,
        resourceType: 'User',
        resourceId: user.id,
        changes: { email, firstName, lastName, role },
        ipAddress: null,
      });
    }

    return user;
  }

  /**
   * Authenticate user with email and password
   *
   * @param {UserAuthenticationData} data - Authentication credentials
   * @returns {Promise<User>} Authenticated user instance
   * @throws {Error} If credentials are invalid
   *
   * @audit Logs authentication attempt (success or failure)
   *
   * @example
   * ```typescript
   * const user = await authService.authenticateUser({
   *   email: 'nurse@school.edu',
   *   password: 'SecurePass123!'
   * });
   * ```
   */
  async authenticateUser(data: UserAuthenticationData): Promise<User> {
    const { email, password } = data;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      if (this.enableAuditLogging) {
        await this.auditLogService.logAction({
          action: 'login_failed',
          performedBy: null,
          resourceType: 'User',
          resourceId: null,
          changes: { email, reason: 'User not found' },
          ipAddress: null,
        });
      }
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      if (this.enableAuditLogging) {
        await this.auditLogService.logAction({
          action: 'login_failed',
          performedBy: user.id,
          resourceType: 'User',
          resourceId: user.id,
          changes: { email, reason: 'Invalid password' },
          ipAddress: null,
        });
      }
      throw new Error('Invalid email or password');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Audit log
    if (this.enableAuditLogging) {
      await this.auditLogService.logAction({
        action: 'user_login',
        performedBy: user.id,
        resourceType: 'User',
        resourceId: user.id,
        changes: { email, lastLogin: new Date() },
        ipAddress: null,
      });
    }

    return user;
  }

  /**
   * Verify user by ID (for token verification)
   *
   * @param {string} userId - User UUID
   * @returns {Promise<User>} User instance
   * @throws {Error} If user not found
   *
   * @example
   * ```typescript
   * const user = await authService.verifyUser('user-uuid-here');
   * ```
   */
  async verifyUser(userId: string): Promise<User> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Refresh user token (validate existing user and return fresh data)
   *
   * @param {string} userId - User UUID
   * @returns {Promise<User>} Updated user instance
   * @throws {Error} If user not found
   *
   * @example
   * ```typescript
   * const user = await authService.refreshToken('user-uuid-here');
   * ```
   */
  async refreshToken(userId: string): Promise<User> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update last activity
    await user.update({ lastLogin: new Date() });

    return user;
  }

  /**
   * Get or create test user for development/testing
   *
   * @param {string} [role='nurse'] - User role
   * @returns {Promise<User>} Test user instance
   *
   * @security Should only be used in development/testing environments
   *
   * @example
   * ```typescript
   * const testUser = await authService.getOrCreateTestUser('admin');
   * ```
   */
  async getOrCreateTestUser(role: string = 'nurse'): Promise<User> {
    const testEmail = `test-${role}@whitecross.test`;

    let user = await User.findOne({ where: { email: testEmail } });

    if (!user) {
      const hashedPassword = await bcrypt.hash('test123', this.saltRounds);

      user = await User.create({
        email: testEmail,
        password: hashedPassword,
        firstName: 'Test',
        lastName: role.charAt(0).toUpperCase() + role.slice(1),
        role,
      });

      if (this.enableAuditLogging) {
        await this.auditLogService.logAction({
          action: 'test_user_created',
          performedBy: user.id,
          resourceType: 'User',
          resourceId: user.id,
          changes: { email: testEmail, role },
          ipAddress: null,
        });
      }
    }

    return user;
  }

  /**
   * Change user password
   *
   * @param {string} userId - User UUID
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   * @throws {Error} If current password is invalid
   *
   * @audit Logs password change
   *
   * @example
   * ```typescript
   * await authService.changePassword(
   *   'user-uuid',
   *   'OldPass123!',
   *   'NewPass456!'
   * );
   * ```
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      if (this.enableAuditLogging) {
        await this.auditLogService.logAction({
          action: 'password_change_failed',
          performedBy: userId,
          resourceType: 'User',
          resourceId: userId,
          changes: { reason: 'Invalid current password' },
          ipAddress: null,
        });
      }
      throw new Error('Current password is invalid');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
    await user.update({ password: hashedPassword });

    // Audit log
    if (this.enableAuditLogging) {
      await this.auditLogService.logAction({
        action: 'password_changed',
        performedBy: userId,
        resourceType: 'User',
        resourceId: userId,
        changes: { passwordChanged: true },
        ipAddress: null,
      });
    }
  }

  /**
   * Reset user password (admin function, no current password required)
   *
   * @param {string} userId - User UUID
   * @param {string} newPassword - New password
   * @param {string} [adminUserId] - Admin user performing the reset
   * @returns {Promise<void>}
   * @throws {Error} If user not found
   *
   * @audit Logs password reset
   *
   * @example
   * ```typescript
   * await authService.resetPassword('user-uuid', 'NewPass456!', 'admin-uuid');
   * ```
   */
  async resetPassword(
    userId: string,
    newPassword: string,
    adminUserId?: string
  ): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
    await user.update({ password: hashedPassword });

    // Audit log
    if (this.enableAuditLogging) {
      await this.auditLogService.logAction({
        action: 'password_reset',
        performedBy: adminUserId || null,
        resourceType: 'User',
        resourceId: userId,
        changes: { passwordReset: true, resetBy: adminUserId },
        ipAddress: null,
      });
    }
  }

  /**
   * Validate email format
   *
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   *
   * @example
   * ```typescript
   * const isValid = authService.validateEmail('nurse@school.edu');
   * ```
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   *
   * @param {string} password - Password to validate
   * @returns {boolean} Whether password meets strength requirements
   *
   * Requirements:
   * - At least 8 characters
   * - Contains uppercase letter
   * - Contains lowercase letter
   * - Contains number
   *
   * @example
   * ```typescript
   * const isStrong = authService.validatePasswordStrength('SecurePass123!');
   * ```
   */
  validatePasswordStrength(password: string): boolean {
    if (password.length < 8) {
      return false;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUppercase && hasLowercase && hasNumber;
  }
}

// Export singleton instance
export const authService = new AuthService();
