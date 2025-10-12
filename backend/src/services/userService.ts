import { Op, QueryTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';
import {
  User,
  Student,
  Appointment,
  IncidentReport,
  MedicationLog,
  InventoryTransaction,
  sequelize
} from '../database/models';
import { UserRole } from '../database/types/enums';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
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
   * Get user by ID
   */
  static async getUserById(id: string) {
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
            order: [['lastName', 'ASC']]
          }
        ]
      });

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

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      const user = await User.create({
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
   */
  static async updateUser(id: string, data: UpdateUserData) {
    try {
      // Check if user exists
      const existingUser = await User.findByPk(id);

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

      await existingUser.update(data);

      logger.info(`User updated: ${existingUser.firstName} ${existingUser.lastName} (${existingUser.email})`);

      return {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
        isActive: existingUser.isActive,
        updatedAt: existingUser.updatedAt
      };
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
      const user = await User.findByPk(id);

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
   */
  static async deactivateUser(id: string) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: false });

      logger.info(`User deactivated: ${user.firstName} ${user.lastName} (${user.email})`);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive
      };
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
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: true });

      logger.info(`User reactivated: ${user.firstName} ${user.lastName} (${user.email})`);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive
      };
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
   */
  static async getUsersByRole(role: UserRole) {
    try {
      const users = await User.findAll({
        where: {
          role,
          isActive: true
        },
        attributes: ['id', 'firstName', 'lastName', 'email', 'lastLogin'],
        order: [['lastName', 'ASC']]
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
      const user = await User.findByPk(id, {
        attributes: ['id', 'firstName', 'lastName', 'email']
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await user.update({ password: hashedPassword });

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
      const nurses = await User.findAll({
        where: {
          role: UserRole.NURSE,
          isActive: true
        },
        attributes: ['id', 'firstName', 'lastName', 'email'],
        order: [['lastName', 'ASC']]
      });

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
