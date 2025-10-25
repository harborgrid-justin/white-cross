/**
 * LOC: 08A744B6C5
 * WC-GEN-194 | userManagementOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/administration/types.ts)
 *   - auditOperations.ts (services/administration/auditOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/administration/index.ts)
 */

/**
 * WC-GEN-194 | userManagementOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * User Management Operations Module
 *
 * Handles user-related operations for administration
 *
 * @module services/administration/userManagementOperations
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { User } from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { UserData } from './administration.types';
import { createAuditLog } from './auditOperations';

/**
 * Get users with filtering
 */
export async function getUsers(filters?: {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters?.role) {
      whereClause.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    if (filters?.search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Create user
 */
export async function createUser(userData: UserData) {
  try {
    const user = await User.create({
      ...userData,
      role: userData.role as any
    });

    // Create audit log
    await createAuditLog(
      AuditAction.CREATE,
      'User',
      user.id,
      undefined,
      { email: user.email, role: user.role }
    );

    logger.info(`User created: ${user.email}`);
    return user.toSafeObject();
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
    schoolId?: string;
    districtId?: string;
  }
) {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      ...userData,
      role: userData.role ? userData.role as any : undefined
    });

    // Create audit log
    await createAuditLog(AuditAction.UPDATE, 'User', user.id, undefined, userData);

    logger.info(`User updated: ${id}`);
    return user.toSafeObject();
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(id: string) {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ isActive: false });

    // Create audit log
    await createAuditLog(AuditAction.DELETE, 'User', id, undefined, { deactivated: true });

    logger.info(`User deleted: ${id}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}
