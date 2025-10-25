/**
 * LOC: USER-SVC-001
 * WC-SVC-USER-001 | User Service Main
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - shared utilities (password hashing, validation)
 *   - database models (User, Student, Appointment, etc.)
 *   - user.repository.ts (data access layer)
 *
 * DOWNSTREAM (imported by):
 *   - routes/v1/core/users.ts
 *   - routes/v1/core/auth.ts
 */

/**
 * WC-SVC-USER-001 | User Service Main
 * Purpose: Core user management service for authentication, authorization, and user lifecycle
 * Upstream: database/models/User, user.repository, shared utilities | Dependencies: Sequelize, bcrypt
 * Downstream: User routes, Auth routes | Called by: API routes
 * Related: RBACService, AuditService, StudentService
 * Exports: UserService class, user-related types
 * Last Updated: 2025-10-25 | File Type: .ts
 * Critical Path: Authentication → User management → Role-based access control
 * LLM Context: HIPAA-compliant user management with comprehensive audit logging for PHI access
 *
 * @module services/user
 */

import { Op, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { hashPassword, comparePassword } from '../../shared';
import {
  User,
  Student,
  Appointment,
  IncidentReport,
  MedicationLog,
  InventoryTransaction,
  sequelize
} from '../../database/models';
import { UserRole } from '../../database/types/enums';
import { userRepository } from './user.repository';

/**
 * Data structure for creating a new user
 *
 * @property {string} email - User's email address (unique identifier)
 * @property {string} password - Plain text password (will be hashed before storage)
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {UserRole} role - User's role (ADMIN, NURSE, SCHOOL_ADMIN, etc.)
 */
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

/**
 * Data structure for updating user information
 * All fields are optional to support partial updates
 *
 * @property {string} [email] - Updated email address
 * @property {string} [firstName] - Updated first name
 * @property {string} [lastName] - Updated last name
 * @property {UserRole} [role] - Updated user role
 * @property {boolean} [isActive] - Active status (for deactivation/reactivation)
 */
export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Data structure for password change operations
 *
 * @property {string} currentPassword - Current password for verification
 * @property {string} newPassword - New password to set
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Filters for user queries
 *
 * @property {string} [search] - Search term for name or email
 * @property {UserRole} [role] - Filter by specific role
 * @property {boolean} [isActive] - Filter by active status
 */
export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * User statistics aggregation
 *
 * @property {number} total - Total number of users
 * @property {number} active - Number of active users
 * @property {number} inactive - Number of inactive users
 * @property {Record<string, number>} byRole - User count by role
 * @property {number} recentLogins - Users logged in within last 30 days
 */
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  recentLogins: number; // users logged in within last 30 days
}

/**
 * User Service
 *
 * Comprehensive user management service for the White Cross healthcare platform.
 * Handles user lifecycle operations including creation, authentication, role management,
 * and activity tracking. All operations include audit logging for HIPAA compliance.
 *
 * Key Responsibilities:
 * - User CRUD operations with validation
 * - Password management with secure hashing (bcrypt)
 * - Role-based access control integration
 * - User search and filtering
 * - Activity statistics and reporting
 * - Nurse assignment and availability tracking
 *
 * Security Features:
 * - Bcrypt password hashing with salt
 * - Email uniqueness validation
 * - Secure password reset workflow
 * - Comprehensive audit logging
 *
 * @example
 * ```typescript
 * // Create a new nurse user
 * const newUser = await UserService.createUser({
 *   email: 'nurse@school.edu',
 *   password: 'SecurePass123!',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: UserRole.NURSE
 * });
 *
 * // Get paginated users with search
 * const result = await UserService.getUsers(1, 20, {
 *   search: 'jane',
 *   role: UserRole.NURSE,
 *   isActive: true
 * });
 * ```
 *
 * @since 1.0.0
 */
export class UserService {
  /**
   * Get paginated list of users with optional filters
   *
   * Retrieves users with pagination, search, and role-based filtering.
   * Includes related entity counts (students, appointments, incident reports)
   * for each user to provide comprehensive user activity overview.
   *
   * @param {number} [page=1] - Page number for pagination (1-indexed)
   * @param {number} [limit=20] - Number of users per page
   * @param {UserFilters} [filters={}] - Optional filters (search, role, isActive)
   * @returns {Promise<{users: User[], pagination: {total: number, page: number, limit: number, pages: number}}>} Paginated user list with metadata
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * // Get first page of active nurses
   * const result = await UserService.getUsers(1, 20, {
   *   role: UserRole.NURSE,
   *   isActive: true
   * });
   *
   * // Search for users by name or email
   * const searchResults = await UserService.getUsers(1, 10, {
   *   search: 'john'
   * });
   * ```
   *
   * @since 1.0.0
   */
  static async getUsers(
    page: number = 1,
    limit: number = 20,
    filters: UserFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (filters.search) {
        whereClause[Op.or] = [
          { firstName: { [Op.iLike]: `%${filters.search}%` } },
          { lastName: { [Op.iLike]: `%${filters.search}%` } },
          { email: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      if (filters.role) {
        whereClause.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const { count: total, rows: users } = await User.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        attributes: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'isActive',
          'lastLogin',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: Student,
            as: 'nurseManagedStudents',
            attributes: [],
            required: false
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: [],
            required: false
          },
          {
            model: IncidentReport,
            as: 'incidentReports',
            attributes: [],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        subQuery: false,
        group: ['User.id'],
        raw: false
      });

      // Get counts separately for each user
      const usersWithCounts = await Promise.all(
        users.map(async (user) => {
          const [nurseManagedStudentsCount, appointmentsCount, incidentReportsCount] = await Promise.all([
            Student.count({ where: { nurseId: user.id } }),
            Appointment.count({ where: { nurseId: user.id } }),
            IncidentReport.count({ where: { reportedById: user.id } })
          ]);

          return {
            ...user.toJSON(),
            _count: {
              nurseManagedStudents: nurseManagedStudentsCount,
              appointments: appointmentsCount,
              incidentReports: incidentReportsCount
            }
          };
        })
      );

      // When using group, count can be an array of objects, so we need to handle it
      const totalCount = Array.isArray(total) ? total.length : (typeof total === 'number' ? total : 0);

      return {
        users: usersWithCounts,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID with complete activity profile
   *
   * Retrieves a single user with comprehensive activity counts including
   * appointments, incident reports, medication logs, and inventory transactions.
   * Useful for user detail views and activity monitoring.
   *
   * @param {string} id - User UUID
   * @returns {Promise<User & {_count: object}>} User with activity counts
   * @throws {Error} If user not found or database error occurs
   *
   * @example
   * ```typescript
   * const user = await UserService.getUserById('uuid-here');
   * console.log(user._count.appointments); // Number of appointments
   * console.log(user._count.medicationLogs); // Number of medication administrations
   * ```
   *
   * @since 1.0.0
   */
  static async getUserById(id: string) {
    try {
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Get activity counts
      const [appointmentsCount, incidentReportsCount, medicationLogsCount, inventoryTransactionsCount] = await Promise.all([
        Appointment.count({ where: { nurseId: id } }),
        IncidentReport.count({ where: { reportedById: id } }),
        MedicationLog.count({ where: { nurseId: id } }),
        InventoryTransaction.count({ where: { performedById: id } })
      ]);

      return {
        ...user.toJSON(),
        _count: {
          appointments: appointmentsCount,
          incidentReports: incidentReportsCount,
          medicationLogs: medicationLogsCount,
          inventoryTransactions: inventoryTransactionsCount
        }
      };
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user
   *
   * Creates a new user with secure password hashing (bcrypt) and email uniqueness
   * validation. Automatically sets user as active. Logs creation for audit trail.
   *
   * @param {CreateUserData} data - User creation data (email, password, firstName, lastName, role)
   * @returns {Promise<{id: string, email: string, firstName: string, lastName: string, role: UserRole, isActive: boolean, createdAt: Date}>} Created user (password excluded)
   * @throws {Error} If email already exists or validation fails
   *
   * @example
   * ```typescript
   * const newNurse = await UserService.createUser({
   *   email: 'jane.doe@school.edu',
   *   password: 'SecurePass123!',
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   role: UserRole.NURSE
   * });
   * ```
   *
   * @since 1.0.0
   */
  static async createUser(data: CreateUserData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password using shared utility
      const hashedPassword = await hashPassword(data.password);

      const user = await userRepository.createUser({
        ...data,
        password: hashedPassword
      });

      logger.info(`User created: ${user.firstName} ${user.lastName} (${user.email})`);

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   *
   * Updates user information with partial data support. Validates email uniqueness
   * if email is being changed. Excludes password updates (use changePassword instead).
   *
   * @param {string} id - User UUID
   * @param {UpdateUserData} data - Partial user data to update
   * @returns {Promise<{id: string, email: string, firstName: string, lastName: string, role: UserRole, isActive: boolean, updatedAt: Date}>} Updated user
   * @throws {Error} If user not found, email already in use, or validation fails
   *
   * @example
   * ```typescript
   * // Update user role
   * const updated = await UserService.updateUser('user-uuid', {
   *   role: UserRole.SCHOOL_ADMIN
   * });
   *
   * // Update multiple fields
   * const updated = await UserService.updateUser('user-uuid', {
   *   firstName: 'Jane',
   *   email: 'jane.new@school.edu'
   * });
   * ```
   *
   * @since 1.0.0
   */
  static async updateUser(id: string, data: UpdateUserData) {
    try {
      // Check if user exists
      const existingUser = await userRepository.getUserById(id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is taken by another user
      if (data.email && data.email !== existingUser.email) {
        const emailTaken = await User.findOne({
          where: { email: data.email }
        });

        if (emailTaken) {
          throw new Error('Email address is already in use');
        }
      }

      await userRepository.updateUser(id, data);

      const updatedUser = await userRepository.getUserById(id);

      logger.info(`User updated: ${updatedUser.firstName} ${updatedUser.lastName} (${updatedUser.email})`);

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt
      };
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Change user password
   *
   * Allows users to change their password with current password verification.
   * Uses bcrypt for secure password comparison and hashing. Recommended for
   * user-initiated password changes (not admin resets).
   *
   * @param {string} id - User UUID
   * @param {ChangePasswordData} data - Current and new password
   * @returns {Promise<{success: boolean}>} Success indicator
   * @throws {Error} If user not found or current password is incorrect
   *
   * @example
   * ```typescript
   * await UserService.changePassword('user-uuid', {
   *   currentPassword: 'OldPass123!',
   *   newPassword: 'NewSecurePass456!'
   * });
   * ```
   *
   * @since 1.0.0
   */
  static async changePassword(id: string, data: ChangePasswordData) {
    try {
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password using shared utility
      const isValidPassword = await comparePassword(data.currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password using shared utility
      const hashedPassword = await hashPassword(data.newPassword);

      await userRepository.updateUser(id, { password: hashedPassword });

      logger.info(`Password changed for user: ${user.firstName} ${user.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Deactivate user (soft delete)
   *
   * Marks user as inactive without deleting data. Deactivated users cannot
   * log in but their historical data remains for audit and compliance purposes.
   * Preferred over hard deletion for HIPAA compliance.
   *
   * @param {string} id - User UUID
   * @returns {Promise<{id: string, firstName: string, lastName: string, email: string, isActive: boolean}>} Deactivated user
   * @throws {Error} If user not found
   *
   * @example
   * ```typescript
   * const deactivated = await UserService.deactivateUser('user-uuid');
   * console.log(deactivated.isActive); // false
   * ```
   *
   * @since 1.0.0
   */
  static async deactivateUser(id: string) {
    try {
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new Error('User not found');
      }

      await userRepository.updateUser(id, { isActive: false });

      const updatedUser = await userRepository.getUserById(id);

      logger.info(`User deactivated: ${updatedUser.firstName} ${updatedUser.lastName} (${updatedUser.email})`);

      return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isActive: updatedUser.isActive
      };
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Reactivate user
   *
   * Reactivates a previously deactivated user, allowing them to log in again.
   * All historical data and settings are preserved from before deactivation.
   *
   * @param {string} id - User UUID
   * @returns {Promise<{id: string, firstName: string, lastName: string, email: string, isActive: boolean}>} Reactivated user
   * @throws {Error} If user not found
   *
   * @example
   * ```typescript
   * const reactivated = await UserService.reactivateUser('user-uuid');
   * console.log(reactivated.isActive); // true
   * ```
   *
   * @since 1.0.0
   */
  static async reactivateUser(id: string) {
    try {
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new Error('User not found');
      }

      await userRepository.updateUser(id, { isActive: true });

      const updatedUser = await userRepository.getUserById(id);

      logger.info(`User reactivated: ${updatedUser.firstName} ${updatedUser.lastName} (${updatedUser.email})`);

      return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isActive: updatedUser.isActive
      };
    } catch (error) {
      logger.error('Error reactivating user:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   *
   * Provides comprehensive user statistics including total counts, active/inactive
   * breakdown, role distribution, and recent activity metrics. Useful for
   * admin dashboards and system monitoring.
   *
   * @returns {Promise<UserStatistics>} User statistics object
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * const stats = await UserService.getUserStatistics();
   * console.log(`Total users: ${stats.total}`);
   * console.log(`Active nurses: ${stats.byRole.NURSE}`);
   * console.log(`Recent logins: ${stats.recentLogins}`);
   * ```
   *
   * @since 1.0.0
   */
  static async getUserStatistics(): Promise<UserStatistics> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [total, active, inactive, byRoleResults, recentLogins] = await Promise.all([
        User.count(),
        User.count({ where: { isActive: true } }),
        User.count({ where: { isActive: false } }),
        sequelize.query(
          'SELECT role, COUNT(*) as count FROM "Users" GROUP BY role',
          {
            type: QueryTypes.SELECT
          }
        ),
        User.count({
          where: {
            lastLogin: {
              [Op.gte]: thirtyDaysAgo
            }
          }
        })
      ]);

      const roleStats = (byRoleResults as any[]).reduce((acc: Record<string, number>, item: any) => {
        acc[item.role] = parseInt(item.count, 10);
        return acc;
      }, {} as Record<string, number>);

      return {
        total,
        active,
        inactive,
        byRole: roleStats,
        recentLogins
      };
    } catch (error) {
      logger.error('Error fetching user statistics:', error);
      throw error;
    }
  }

  /**
   * Get users by role
   *
   * Retrieves all active users with a specific role. Useful for populating
   * dropdowns, assignment lists, and role-specific operations.
   *
   * @param {UserRole} role - User role to filter by
   * @returns {Promise<User[]>} List of users with the specified role
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * // Get all nurses for student assignment
   * const nurses = await UserService.getUsersByRole(UserRole.NURSE);
   *
   * // Get all admins
   * const admins = await UserService.getUsersByRole(UserRole.ADMIN);
   * ```
   *
   * @since 1.0.0
   */
  static async getUsersByRole(role: UserRole) {
    try {
      const users = await userRepository.getUsersByRole(role.toString());

      return users;
    } catch (error) {
      logger.error('Error fetching users by role:', error);
      throw error;
    }
  }

  /**
   * Reset user password (admin function)
   *
   * Administrative password reset without requiring current password verification.
   * Should only be called by administrators. Does not validate current password.
   * User should be prompted to change password on next login.
   *
   * @param {string} id - User UUID
   * @param {string} newPassword - New password to set (will be hashed)
   * @returns {Promise<{success: boolean}>} Success indicator
   * @throws {Error} If user not found
   *
   * @example
   * ```typescript
   * // Admin resets forgotten password
   * await UserService.resetUserPassword('user-uuid', 'TempPassword123!');
   * // User should be notified to change password on next login
   * ```
   *
   * @since 1.0.0
   */
  static async resetUserPassword(id: string, newPassword: string) {
    try {
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password using shared utility
      const hashedPassword = await hashPassword(newPassword);

      await userRepository.updateUser(id, { password: hashedPassword });

      logger.info(`Password reset for user: ${user.firstName} ${user.lastName} (${user.email})`);
      return { success: true };
    } catch (error) {
      logger.error('Error resetting user password:', error);
      throw error;
    }
  }

  /**
   * Get nurses available for student assignment
   *
   * Retrieves all active nurses with their current student assignment counts.
   * Useful for load balancing when assigning students to nurses and for
   * displaying nurse availability in assignment interfaces.
   *
   * @returns {Promise<Array<User & {_count: {nurseManagedStudents: number}, currentStudentCount: number}>>} Nurses with student counts
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * const nurses = await UserService.getAvailableNurses();
   * const leastBusyNurse = nurses.reduce((min, nurse) =>
   *   nurse.currentStudentCount < min.currentStudentCount ? nurse : min
   * );
   * ```
   *
   * @since 1.0.0
   */
  static async getAvailableNurses() {
    try {
      const nurses = await userRepository.getUsersByRole(UserRole.NURSE.toString());

      // Get student count for each nurse
      const nursesWithCounts = await Promise.all(
        nurses.map(async (nurse) => {
          const currentStudentCount = await Student.count({
            where: {
              nurseId: nurse.id,
              isActive: true
            }
          });

          return {
            ...nurse.toJSON(),
            _count: {
              nurseManagedStudents: currentStudentCount
            },
            currentStudentCount
          };
        })
      );

      return nursesWithCounts;
    } catch (error) {
      logger.error('Error fetching available nurses:', error);
      throw error;
    }
  }
}
