import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN';
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN';
  isActive?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  search?: string;
  role?: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN';
  isActive?: boolean;
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  recentLogins: number; // users logged in within last 30 days
}

export class UserService {
  /**
   * Get paginated list of users with optional filters
   */
  static async getUsers(
    page: number = 1,
    limit: number = 20,
    filters: UserFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause: any = {};
      
      if (filters.search) {
        whereClause.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      
      if (filters.role) {
        whereClause.role = filters.role;
      }
      
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                nurseManagedStudents: true,
                appointments: true,
                incidentReports: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where: whereClause })
      ]);

      return {
        users,
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
   * Get user by ID
   */
  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          nurseManagedStudents: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            },
            where: { isActive: true },
            orderBy: { lastName: 'asc' }
          },
          _count: {
            select: {
              appointments: true,
              incidentReports: true,
              medicationLogs: true,
              inventoryTransactions: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  static async createUser(data: CreateUserData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      logger.info(`User created: ${user.firstName} ${user.lastName} (${user.email})`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UpdateUserData) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is taken by another user
      if (data.email && data.email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: data.email }
        });

        if (emailTaken) {
          throw new Error('Email address is already in use');
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          updatedAt: true
        }
      });

      logger.info(`User updated: ${user.firstName} ${user.lastName} (${user.email})`);
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(id: string, data: ChangePasswordData) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.newPassword, 12);

      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      });

      logger.info(`Password changed for user: ${user.firstName} ${user.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Deactivate user (soft delete)
   */
  static async deactivateUser(id: string) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { isActive: false },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true
        }
      });

      logger.info(`User deactivated: ${user.firstName} ${user.lastName} (${user.email})`);
      return user;
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Reactivate user
   */
  static async reactivateUser(id: string) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { isActive: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true
        }
      });

      logger.info(`User reactivated: ${user.firstName} ${user.lastName} (${user.email})`);
      return user;
    } catch (error) {
      logger.error('Error reactivating user:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics(): Promise<UserStatistics> {
    try {
      const [total, active, inactive, byRole, recentLogins] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: false } }),
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        prisma.user.count({
          where: {
            lastLogin: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
            }
          }
        })
      ]);

      const roleStats = byRole.reduce((acc: Record<string, number>, item: any) => {
        acc[item.role] = item._count.role;
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
   */
  static async getUsersByRole(role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN') {
    try {
      const users = await prisma.user.findMany({
        where: { 
          role,
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          lastLogin: true
        },
        orderBy: { lastName: 'asc' }
      });

      return users;
    } catch (error) {
      logger.error('Error fetching users by role:', error);
      throw error;
    }
  }

  /**
   * Reset user password (admin function)
   */
  static async resetUserPassword(id: string, newPassword: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { firstName: true, lastName: true, email: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      });

      logger.info(`Password reset for user: ${user.firstName} ${user.lastName} (${user.email})`);
      return { success: true };
    } catch (error) {
      logger.error('Error resetting user password:', error);
      throw error;
    }
  }

  /**
   * Get nurses available for student assignment
   */
  static async getAvailableNurses() {
    try {
      const nurses = await prisma.user.findMany({
        where: {
          role: 'NURSE',
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          _count: {
            select: {
              nurseManagedStudents: {
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: { lastName: 'asc' }
      });

      return nurses.map((nurse: any) => ({
        ...nurse,
        currentStudentCount: nurse._count.nurseManagedStudents
      }));
    } catch (error) {
      logger.error('Error fetching available nurses:', error);
      throw error;
    }
  }
}