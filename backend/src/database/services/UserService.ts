/**
 * LOC: A039EDA3B9
 * WC-GEN-127 | UserService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - index.ts (shared/index.ts)
 *   - BaseService.ts (database/services/BaseService.ts)
 *   - User.ts (database/models/core/User.ts)
 *   - Student.ts (database/models/core/Student.ts)
 *   - Appointment.ts (database/models/healthcare/Appointment.ts)
 *   - ... and 3 more
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-127 | UserService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared, ./BaseService, ../models/core/User | Dependencies: sequelize, ../../shared, ./BaseService
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * UserService - User management with authentication helpers
 * Sequelize-based service for White Cross Healthcare Platform
 *
 * Handles user CRUD operations, password management, role-based filtering,
 * and nurse availability tracking for student assignment.
 */

import { Op, FindOptions, Attributes } from 'sequelize';
import { hashPassword, comparePassword } from '../../shared';
import { BaseService } from './BaseService';
import { User } from '../models/core/User';
import { Student } from '../models/core/Student';
import { Appointment } from '../models/healthcare/Appointment';
import { IncidentReport } from '../models/incidents/IncidentReport';
import { UserRole } from '../types/enums';
import { logger } from '../../utils/logger';

/**
 * Data transfer objects for User operations
 */
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  districtId?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  schoolId?: string;
  districtId?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  schoolId?: string;
  districtId?: string;
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  recentLogins: number; // users logged in within last 30 days
}

export interface PaginationResult<T> {
  rows: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * UserService class extending BaseService
 * Provides comprehensive user management functionality for healthcare platform
 */
export class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  /**
   * Get paginated list of users with optional filters
   *
   * @param page - Page number (1-indexed)
   * @param limit - Number of records per page
   * @param filters - Optional search and filter criteria
   * @returns Paginated user list with counts
   */
  async getUsers(
    page: number = 1,
    limit: number = 20,
    filters: UserFilters = {}
  ): Promise<PaginationResult<any>> {
    try {
      const offset = (page - 1) * limit;

      // Build where clause from filters
      const where: any = {};

      // Search across multiple fields
      if (filters.search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${filters.search}%` } },
          { lastName: { [Op.iLike]: `%${filters.search}%` } },
          { email: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      // Filter by role
      if (filters.role) {
        where.role = filters.role;
      }

      // Filter by active status
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      // Filter by school
      if (filters.schoolId) {
        where.schoolId = filters.schoolId;
      }

      // Filter by district
      if (filters.districtId) {
        where.districtId = filters.districtId;
      }

      // Execute query with count
      const { rows: users, count: total } = await User.findAndCountAll({
        where,
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
          'schoolId',
          'districtId',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: Student,
            as: 'nurseManagedStudents',
            attributes: ['id'],
            where: { isActive: true },
            required: false,
            duplicating: false
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: ['id'],
            required: false,
            duplicating: false
          },
          {
            model: IncidentReport,
            as: 'incidentReports',
            attributes: ['id'],
            required: false,
            duplicating: false
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
        subQuery: false
      });

      // Transform results to include counts
      const transformedUsers = users.map((user: any) => {
        const userData = user.get({ plain: true });
        return {
          ...userData,
          _count: {
            nurseManagedStudents: userData.nurseManagedStudents?.length || 0,
            appointments: userData.appointments?.length || 0,
            incidentReports: userData.incidentReports?.length || 0
          },
          // Remove the included arrays after counting
          nurseManagedStudents: undefined,
          appointments: undefined,
          incidentReports: undefined
        };
      });

      return {
        rows: transformedUsers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID with related entity counts
   *
   * @param id - User ID (UUID)
   * @returns User with nested student data and activity counts
   * @throws Error if user not found
   */
  async getUserById(id: string): Promise<any> {
    try {
      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'isActive',
          'lastLogin',
          'schoolId',
          'districtId',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: Student,
            as: 'nurseManagedStudents',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: { isActive: true },
            required: false,
            separate: true,
            order: [['lastName', 'ASC']]
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: ['id'],
            required: false,
            separate: true
          },
          {
            model: IncidentReport,
            as: 'incidentReports',
            attributes: ['id'],
            required: false,
            separate: true
          }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      const userData = user.get({ plain: true }) as any;

      // Build counts
      const result = {
        ...userData,
        _count: {
          appointments: userData.appointments?.length || 0,
          incidentReports: userData.incidentReports?.length || 0,
          medicationLogs: 0, // TODO: Add when MedicationLog model is available
          inventoryTransactions: 0 // TODO: Add when InventoryTransaction model is available
        },
        // Keep nurseManagedStudents as-is for display
        appointments: undefined,
        incidentReports: undefined
      };

      return result;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user with password hashing
   *
   * @param data - User creation data
   * @returns Created user (without password)
   * @throws Error if email already exists
   */
  async createUser(data: CreateUserData): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password - Note: User model has beforeCreate hook for this
      // But we'll do it explicitly for clarity
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await User.create({
        ...data,
        password: hashedPassword
      });

      logger.info(`User created: ${user.firstName} ${user.lastName} (${user.email})`);

      // Return user without password
      return user.toSafeObject();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user with email uniqueness validation
   *
   * @param id - User ID
   * @param data - Update data
   * @returns Updated user
   * @throws Error if user not found or email taken
   */
  async updateUser(id: string, data: UpdateUserData): Promise<any> {
    try {
      // Check if user exists
      const existingUser = await User.findByPk(id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is taken by another user
      if (data.email && data.email !== existingUser.email) {
        const emailTaken = await User.findOne({
          where: {
            email: data.email,
            id: { [Op.ne]: id }
          }
        });

        if (emailTaken) {
          throw new Error('Email address is already in use');
        }
      }

      // Update user
      await existingUser.update(data);

      logger.info(`User updated: ${existingUser.firstName} ${existingUser.lastName} (${existingUser.email})`);

      return existingUser.toSafeObject();
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Change user password with verification
   *
   * @param id - User ID
   * @param data - Current and new password
   * @returns Success status
   * @throws Error if current password is incorrect
   */
  async changePassword(id: string, data: ChangePasswordData): Promise<{ success: boolean }> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(data.currentPassword);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await hashPassword(data.newPassword);

      // Update password
      await user.update({ password: hashedPassword });

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
   * @param id - User ID
   * @returns Deactivated user
   */
  async deactivateUser(id: string): Promise<any> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: false });

      logger.info(`User deactivated: ${user.firstName} ${user.lastName} (${user.email})`);
      return user.toSafeObject();
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Reactivate user
   *
   * @param id - User ID
   * @returns Reactivated user
   */
  async reactivateUser(id: string): Promise<any> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: true });

      logger.info(`User reactivated: ${user.firstName} ${user.lastName} (${user.email})`);
      return user.toSafeObject();
    } catch (error) {
      logger.error('Error reactivating user:', error);
      throw error;
    }
  }

  /**
   * Get user statistics aggregated by role and activity
   *
   * @returns Statistical summary of users
   */
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Execute multiple queries in parallel
      const [total, active, inactive, allUsers, recentLogins] = await Promise.all([
        User.count(),
        User.count({ where: { isActive: true } }),
        User.count({ where: { isActive: false } }),
        User.findAll({ attributes: ['role'] }),
        User.count({
          where: {
            lastLogin: { [Op.gte]: thirtyDaysAgo }
          }
        })
      ]);

      // Group by role manually
      const byRole: Record<string, number> = {};
      allUsers.forEach((user) => {
        const role = user.role;
        byRole[role] = (byRole[role] || 0) + 1;
      });

      return {
        total,
        active,
        inactive,
        byRole,
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
   * @param role - User role to filter by
   * @returns List of users with specified role
   */
  async getUsersByRole(role: UserRole): Promise<any[]> {
    try {
      const users = await User.findAll({
        where: {
          role,
          isActive: true
        },
        attributes: ['id', 'firstName', 'lastName', 'email', 'lastLogin'],
        order: [['lastName', 'ASC']]
      });

      return users.map(user => user.toSafeObject());
    } catch (error) {
      logger.error('Error fetching users by role:', error);
      throw error;
    }
  }

  /**
   * Reset user password (admin function)
   *
   * @param id - User ID
   * @param newPassword - New password to set
   * @returns Success status
   */
  async resetUserPassword(id: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      await user.update({ password: hashedPassword });

      logger.info(`Password reset for user: ${user.firstName} ${user.lastName} (${user.email})`);
      return { success: true };
    } catch (error) {
      logger.error('Error resetting user password:', error);
      throw error;
    }
  }

  /**
   * Get nurses available for student assignment with current student counts
   *
   * @returns List of active nurses with their current student load
   */
  async getAvailableNurses(): Promise<any[]> {
    try {
      const nurses = await User.findAll({
        where: {
          role: UserRole.NURSE,
          isActive: true
        },
        attributes: ['id', 'firstName', 'lastName', 'email'],
        include: [
          {
            model: Student,
            as: 'nurseManagedStudents',
            attributes: ['id'],
            where: { isActive: true },
            required: false,
            separate: true
          }
        ],
        order: [['lastName', 'ASC']]
      });

      return nurses.map((nurse: any) => {
        const nurseData = nurse.get({ plain: true });
        return {
          id: nurseData.id,
          firstName: nurseData.firstName,
          lastName: nurseData.lastName,
          email: nurseData.email,
          currentStudentCount: nurseData.nurseManagedStudents?.length || 0,
          _count: {
            nurseManagedStudents: nurseData.nurseManagedStudents?.length || 0
          }
        };
      });
    } catch (error) {
      logger.error('Error fetching available nurses:', error);
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   *
   * @param id - User ID
   */
  async updateLastLogin(id: string): Promise<void> {
    try {
      await User.update(
        { lastLogin: new Date() },
        { where: { id } }
      );
    } catch (error) {
      logger.error('Error updating last login:', error);
      throw error;
    }
  }
}

export default UserService;
