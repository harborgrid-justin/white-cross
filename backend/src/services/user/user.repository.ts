/**
 * LOC: USER-REPO-001
 * WC-SVC-USER-REPO | User Repository
 *
 * UPSTREAM (imports from):
 *   - database/models/core/User
 *   - database/models/core/Student
 *   - database/services/BaseService
 *
 * DOWNSTREAM (imported by):
 *   - user.service.ts
 */

/**
 * WC-SVC-USER-REPO | User Repository
 * Purpose: Data access layer for User entity with specialized query operations
 * Upstream: database/models/User, BaseService | Dependencies: Sequelize
 * Downstream: UserService | Called by: User service layer
 * Related: BaseService, User model
 * Exports: UserRepository instance
 * Last Updated: 2025-10-25 | File Type: .ts
 * Critical Path: Service → Repository → Database
 * LLM Context: Repository pattern implementation for clean separation of data access logic
 *
 * @module services/user/repository
 */

import { User } from '../../database/models/core/User';
import { Student } from '../../database/models/core/Student';
import { BaseService } from '../../database/services/BaseService';
import { Op } from 'sequelize';

/**
 * User Repository
 *
 * Repository pattern implementation for User entity data access.
 * Extends BaseService to inherit common CRUD operations while providing
 * specialized query methods for user-specific requirements.
 *
 * Responsibilities:
 * - User data retrieval with associations
 * - Role-based user queries
 * - User search functionality
 * - Student-nurse relationship queries
 *
 * @extends {BaseService<User>}
 *
 * @example
 * ```typescript
 * // Get user with associations
 * const user = await userRepository.getUserById('user-uuid');
 *
 * // Search users
 * const results = await userRepository.searchUsers('john');
 *
 * // Get all nurses
 * const nurses = await userRepository.getUsersByRole('NURSE');
 * ```
 *
 * @since 1.0.0
 */
class UserRepository extends BaseService<User> {
  constructor() {
    super(User);
  }

  /**
   * Get users with filters and associations
   *
   * Retrieves users with optional filtering and includes nurse-managed students
   * association. Uses buildWhereClause from BaseService for dynamic filtering.
   *
   * @param {object} [filters={}] - Filter criteria (can include any User model fields)
   * @returns {Promise<User[]>} Users with associations, ordered by creation date
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * // Get active nurses
   * const nurses = await userRepository.getUsers({
   *   role: 'NURSE',
   *   isActive: true
   * });
   * ```
   *
   * @since 1.0.0
   */
  async getUsers(filters: any = {}) {
    const where = this.buildWhereClause(filters);

    return await User.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'nurseManagedStudents',
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get user by ID with associations
   *
   * Retrieves a single user with nurse-managed students association.
   * Returns null if user not found.
   *
   * @param {string} id - User UUID
   * @returns {Promise<User | null>} User with associations or null
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * const user = await userRepository.getUserById('user-uuid');
   * if (user) {
   *   console.log(user.nurseManagedStudents);
   * }
   * ```
   *
   * @since 1.0.0
   */
  async getUserById(id: string) {
    return await this.findById(id, {
      include: [
        {
          model: Student,
          as: 'nurseManagedStudents',
        },
      ],
    });
  }

  /**
   * Create new user
   *
   * Creates a user record using BaseService create method.
   * Password should be hashed before calling this method.
   *
   * @param {object} data - User creation data (email, password, firstName, lastName, role)
   * @returns {Promise<User>} Created user instance
   * @throws {Error} Validation errors or database errors
   *
   * @example
   * ```typescript
   * const user = await userRepository.createUser({
   *   email: 'user@example.com',
   *   password: 'hashed-password',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   role: 'NURSE'
   * });
   * ```
   *
   * @since 1.0.0
   */
  async createUser(data: any) {
    return await this.create(data);
  }

  /**
   * Update user by ID
   *
   * Updates user fields using BaseService update method.
   * Supports partial updates.
   *
   * @param {string} id - User UUID
   * @param {object} data - Fields to update
   * @returns {Promise<User>} Updated user instance
   * @throws {Error} If user not found or validation errors
   *
   * @example
   * ```typescript
   * await userRepository.updateUser('user-uuid', {
   *   firstName: 'Jane',
   *   isActive: true
   * });
   * ```
   *
   * @since 1.0.0
   */
  async updateUser(id: string, data: any) {
    return await this.update(id, data);
  }

  /**
   * Delete user by ID
   *
   * Hard deletes user using BaseService delete method.
   * Consider using deactivation (isActive: false) instead for HIPAA compliance.
   *
   * @param {string} id - User UUID
   * @returns {Promise<void>}
   * @throws {Error} If user not found
   *
   * @example
   * ```typescript
   * await userRepository.deleteUser('user-uuid');
   * ```
   *
   * @since 1.0.0
   * @deprecated Use deactivation (updateUser with isActive: false) instead
   */
  async deleteUser(id: string) {
    return await this.delete(id);
  }

  /**
   * Get users by role
   *
   * Retrieves all active users with a specific role, sorted alphabetically
   * by last name then first name.
   *
   * @param {string} role - User role (ADMIN, NURSE, SCHOOL_ADMIN, etc.)
   * @returns {Promise<User[]>} Active users with specified role
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * const nurses = await userRepository.getUsersByRole('NURSE');
   * const admins = await userRepository.getUsersByRole('ADMIN');
   * ```
   *
   * @since 1.0.0
   */
  async getUsersByRole(role: string) {
    return await User.findAll({
      where: { role, isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
  }

  /**
   * Search users by name or email
   *
   * Performs case-insensitive search across firstName, lastName, and email fields.
   * Only returns active users. Limited to 50 results for performance.
   *
   * @param {string} searchTerm - Search query string
   * @returns {Promise<User[]>} Matching active users (max 50)
   * @throws {Error} Database query errors
   *
   * @example
   * ```typescript
   * // Search by first name
   * const results = await userRepository.searchUsers('john');
   *
   * // Search by email
   * const results = await userRepository.searchUsers('nurse@school.edu');
   *
   * // Partial match
   * const results = await userRepository.searchUsers('do'); // Matches 'Doe', 'John Doe', etc.
   * ```
   *
   * @since 1.0.0
   */
  async searchUsers(searchTerm: string) {
    return await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
        ],
        isActive: true,
      },
      limit: 50,
    });
  }
}

/**
 * User Repository singleton instance
 *
 * Pre-instantiated repository for User entity.
 * Import and use this instance for all user data access operations.
 *
 * @example
 * ```typescript
 * import { userRepository } from './user.repository';
 *
 * const user = await userRepository.getUserById('uuid');
 * ```
 *
 * @since 1.0.0
 */
export const userRepository = new UserRepository();
