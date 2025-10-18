/**
 * WC-GEN-106 | UserRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../base/BaseRepository, ../../models/core/User, ../../audit/IAuditLogger | Dependencies: sequelize, ../base/BaseRepository, ../../models/core/User
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * User Repository Implementation
 * Authentication and authorization data access
 *
 * Features:
 * - User authentication support
 * - Password management (exclude from responses)
 * - Role-based queries
 * - Multi-tenant support (district/school filtering)
 * - Session tracking
 */

import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { User } from '../../models/core/User';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { ExecutionContext } from '../../types/ExecutionContext';
import { logger } from '../../../utils/logger';

interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
  districtId?: string;
}

interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  schoolId?: string;
  districtId?: string;
  isActive?: boolean;
}

export class UserRepository extends BaseRepository<User, any, any> {
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(User, auditLogger, cacheManager, 'User');
  }

  /**
   * Find user by email (for authentication)
   * @param email User email address
   * @returns User with password hash or null
   */
  async findByEmail(email: string): Promise<any | null> {
    try {
      const user = await this.model.findOne({
        where: { email: email.toLowerCase() }
      });

      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw new RepositoryError(
        'Failed to find user by email',
        'FIND_BY_EMAIL_ERROR',
        500,
        { email, error: (error as Error).message }
      );
    }
  }

  /**
   * Find users by role
   * @param role User role
   * @returns Array of users with the role
   */
  async findByRole(role: string): Promise<any[]> {
    try {
      const users = await this.model.findAll({
        where: {
          role,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return users.map((u) => this.mapToEntitySafe(u));
    } catch (error) {
      logger.error('Error finding users by role:', error);
      throw new RepositoryError(
        'Failed to find users by role',
        'FIND_BY_ROLE_ERROR',
        500,
        { role, error: (error as Error).message }
      );
    }
  }

  /**
   * Find users by school
   * @param schoolId School identifier
   * @returns Array of users at the school
   */
  async findBySchool(schoolId: string): Promise<any[]> {
    try {
      const users = await this.model.findAll({
        where: {
          schoolId,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return users.map((u) => this.mapToEntitySafe(u));
    } catch (error) {
      logger.error('Error finding users by school:', error);
      throw new RepositoryError(
        'Failed to find users by school',
        'FIND_BY_SCHOOL_ERROR',
        500,
        { schoolId, error: (error as Error).message }
      );
    }
  }

  /**
   * Find users by district
   * @param districtId District identifier
   * @returns Array of users in the district
   */
  async findByDistrict(districtId: string): Promise<any[]> {
    try {
      const users = await this.model.findAll({
        where: {
          districtId,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return users.map((u) => this.mapToEntitySafe(u));
    } catch (error) {
      logger.error('Error finding users by district:', error);
      throw new RepositoryError(
        'Failed to find users by district',
        'FIND_BY_DISTRICT_ERROR',
        500,
        { districtId, error: (error as Error).message }
      );
    }
  }

  /**
   * Update last login timestamp
   * @param userId User identifier
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.model.update(
        { lastLogin: new Date() },
        { where: { id: userId } }
      );

      logger.debug(`Updated last login for user ${userId}`);
    } catch (error) {
      logger.error('Error updating last login:', error);
      // Don't throw - login tracking failures shouldn't break login
    }
  }

  /**
   * Search users by name or email
   * @param query Search query
   * @returns Array of matching users
   */
  async search(query: string): Promise<any[]> {
    try {
      const searchTerm = `%${query}%`;

      const users = await this.model.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: searchTerm } },
            { lastName: { [Op.iLike]: searchTerm } },
            { email: { [Op.iLike]: searchTerm } }
          ],
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        limit: 50
      });

      return users.map((u) => this.mapToEntitySafe(u));
    } catch (error) {
      logger.error('Error searching users:', error);
      throw new RepositoryError(
        'Failed to search users',
        'SEARCH_ERROR',
        500,
        { query, error: (error as Error).message }
      );
    }
  }

  /**
   * Get nurses for assignment
   * @param schoolId Optional school filter
   * @returns Array of nurses
   */
  async getNurses(schoolId?: string): Promise<any[]> {
    try {
      const where: any = {
        role: 'NURSE',
        isActive: true
      };

      if (schoolId) {
        where.schoolId = schoolId;
      }

      const nurses = await this.model.findAll({
        where,
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return nurses.map((u) => this.mapToEntitySafe(u));
    } catch (error) {
      logger.error('Error getting nurses:', error);
      throw new RepositoryError(
        'Failed to get nurses',
        'GET_NURSES_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  // ============ Protected Methods ============

  /**
   * Map to entity without password
   */
  private mapToEntitySafe(user: User): any {
    const entity = this.mapToEntity(user);
    const { password, ...safe } = entity;
    return safe;
  }

  /**
   * Override findById to exclude password
   */
  async findById(id: string, options?: any): Promise<any | null> {
    const user = await super.findById(id, options);
    if (user) {
      const { password, ...safe } = user;
      return safe;
    }
    return null;
  }

  /**
   * Validate user data before creation
   */
  protected async validateCreate(data: CreateUserDTO): Promise<void> {
    // Check for duplicate email
    const existing = await this.model.findOne({
      where: { email: data.email.toLowerCase() }
    });

    if (existing) {
      throw new RepositoryError(
        'Email already exists',
        'DUPLICATE_EMAIL',
        409,
        { email: data.email }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new RepositoryError(
        'Invalid email format',
        'INVALID_EMAIL',
        400,
        { email: data.email }
      );
    }
  }

  /**
   * Validate user data before update
   */
  protected async validateUpdate(id: string, data: UpdateUserDTO): Promise<void> {
    // Check for duplicate email if being updated
    if (data.email) {
      const existing = await this.model.findOne({
        where: {
          email: data.email.toLowerCase(),
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        throw new RepositoryError(
          'Email already exists',
          'DUPLICATE_EMAIL',
          409,
          { email: data.email }
        );
      }
    }
  }

  /**
   * Invalidate user-related caches
   */
  protected async invalidateCaches(user: User): Promise<void> {
    try {
      const userData = user.get();

      // Invalidate specific user cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, userData.id)
      );

      // Invalidate email-based cache
      if (userData.email) {
        await this.cacheManager.deletePattern(
          `white-cross:user:email:${userData.email}:*`
        );
      }

      // Invalidate role-based caches
      await this.cacheManager.deletePattern(
        `white-cross:user:role:${userData.role}:*`
      );

      // Invalidate school-based caches
      if (userData.schoolId) {
        await this.cacheManager.deletePattern(
          `white-cross:user:school:${userData.schoolId}:*`
        );
      }
    } catch (error) {
      logger.warn('Error invalidating user caches:', error);
    }
  }

  /**
   * Sanitize user data for audit logging
   * Remove password from audit logs
   */
  protected sanitizeForAudit(data: any): any {
    const { password, ...safe } = data;
    return sanitizeSensitiveData(safe);
  }

  /**
   * Disable caching for users (sensitive data)
   */
  protected shouldCache(): boolean {
    return false; // Users contain sensitive data, minimize caching
  }
}
