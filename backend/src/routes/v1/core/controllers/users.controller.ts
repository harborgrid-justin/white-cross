/**
 * @fileoverview Users Controller
 *
 * Business logic for user account management operations including CRUD, password
 * management, account activation/deactivation, and user statistics. Implements
 * role-based access control with self-service capabilities for profile management.
 *
 * **Controller Responsibilities:**
 * - User CRUD: List, get, create, update users
 * - Password Management: Change password (self-service), reset password (admin)
 * - Account Lifecycle: Activate, deactivate user accounts
 * - Query Operations: Filter by role, search, statistics
 * - Permission Enforcement: Admin-only vs self-service operations
 *
 * **Permission Model:**
 * - ADMIN/DISTRICT_ADMIN: Full user management capabilities
 * - Regular Users: Can view/update own profile and change own password
 * - SCHOOL_ADMIN: Can view user statistics
 * - Self-service operations: Users cannot deactivate themselves
 *
 * **Security Features:**
 * - Password validation with minimum requirements
 * - Current password verification for password changes
 * - Admin-only password reset (bypasses current password)
 * - Account status management with audit trails
 * - Role-based access control for sensitive operations
 *
 * **Response Patterns:**
 * - 200: Successful GET/PUT operations
 * - 201: User created successfully
 * - 400: Validation error or business logic violation
 * - 401: Unauthorized (authentication required)
 * - 403: Forbidden (insufficient permissions)
 * - 404: User not found
 * - 409: Conflict (duplicate email)
 *
 * @module routes/v1/core/controllers/users.controller
 * @requires @hapi/hapi
 * @requires ../../../../services
 * @requires ../../../shared/types/route.types
 * @requires ../../../shared/utils
 * @see {@link module:services/UserService} for business logic implementation
 * @see {@link module:routes/v1/core/routes/users.routes} for route definitions
 * @since 1.0.0
 */

import { ResponseToolkit } from '@hapi/hapi';
import { UserService } from '../../../../services';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  conflictResponse,
  forbiddenResponse,
  badRequestResponse,
  paginatedResponse,
  extractPayloadSafe,
  extractPayload
} from '../../../shared/utils';
import { ResetPasswordPayload } from '../../../shared/types/payloadTypes';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

/**
 * Users Controller class.
 *
 * Static controller methods for handling user management operations. Implements
 * dual permission model: admin-only operations and self-service operations.
 *
 * **Method Categories:**
 * - Query: list, getById, getUsersByRole, getAvailableNurses
 * - Mutation: create, update, deactivate, reactivate
 * - Password: changePassword, resetPassword
 * - Analytics: getStatistics
 *
 * **Permission Patterns:**
 * - Admin operations: create, resetPassword, deactivate, reactivate
 * - Self-service operations: update own profile, change own password
 * - Mixed operations: update (admins can update anyone, users can update self)
 *
 * @class UsersController
 *
 * @example
 * ```typescript
 * // Usage in route definition
 * {
 *   method: 'GET',
 *   path: '/api/v1/users',
 *   handler: asyncHandler(UsersController.list)
 * }
 * ```
 */
export class UsersController {
  /**
   * List users with pagination and filtering.
   *
   * Returns paginated list of users with optional filtering by role,
   * active status, and search query. Supports sorting and pagination.
   *
   * @route GET /api/v1/users
   * @authentication JWT required
   * @authorization Any authenticated user
   *
   * @param {AuthenticatedRequest} request - Hapi request with query params
   * @param {number} [request.query.page=1] - Page number
   * @param {number} [request.query.limit=20] - Items per page
   * @param {string} [request.query.search] - Search by name or email
   * @param {string} [request.query.role] - Filter by role
   * @param {boolean} [request.query.isActive] - Filter by active status
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 200 with paginated users
   * @throws {Boom.unauthorized} When not authenticated (401)
   *
   * @example
   * ```typescript
   * // Request
   * GET /api/v1/users?role=NURSE&page=1&limit=20&isActive=true
   * Authorization: Bearer <token>
   *
   * // Response (200)
   * {
   *   success: true,
   *   data: [
   *     { id: "uuid", email: "nurse1@school.edu", role: "NURSE", ... },
   *     { id: "uuid", email: "nurse2@school.edu", role: "NURSE", ... }
   *   ],
   *   pagination: {
   *     page: 1,
   *     limit: 20,
   *     total: 80,
   *     totalPages: 4
   *   }
   * }
   * ```
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      search: { type: 'string' },
      role: { type: 'string' },
      isActive: { type: 'boolean' }
    });

    const result = await UserService.getUsers(page, limit, filters);

    return paginatedResponse(
      h,
      result.users,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get user by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const user = await UserService.getUserById(id);

    return successResponse(h, { user });
  }

  /**
   * Create new user (Admin only)
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;

    // Check permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(currentUser.role)) {
      return forbiddenResponse(h, 'Insufficient permissions to create users');
    }

    const payload = request.payload as any;

    // Extract and type the data according to CreateUserData interface
    const userData: import('../../../../services/user/user.service').CreateUserData = {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role
    };

    const newUser = await UserService.createUser(userData);

    return createdResponse(h, { user: newUser });
  }

  /**
   * Update user
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const currentUser = request.auth.credentials;

    // Check permissions
    const canUpdateAnyUser = ['ADMIN', 'DISTRICT_ADMIN'].includes(currentUser.role);
    const isOwnProfile = currentUser.userId === id;

    if (!canUpdateAnyUser && !isOwnProfile) {
      return forbiddenResponse(h, 'Insufficient permissions to update this user');
    }

    // Non-admins can only update their own basic info
    const updateData = extractPayloadSafe(request.payload);
    if (!canUpdateAnyUser) {
      delete updateData.role;
      delete updateData.isActive;
    }

    const updatedUser = await UserService.updateUser(id, updateData);

    return successResponse(h, { user: updatedUser });
  }

  /**
   * Change password (user or admin)
   */
  static async changePassword(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const currentUser = request.auth.credentials;

    // Users can only change their own password unless they're admin
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(currentUser.role) && currentUser.userId !== id) {
      return forbiddenResponse(h, 'You can only change your own password');
    }

    try {
      const payload = request.payload as any;

      // Extract and type the data according to ChangePasswordData interface
      const passwordData: import('../../../../services/user/user.service').ChangePasswordData = {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword
      };

      const result = await UserService.changePassword(id, passwordData);
      return successResponse(h, result);
    } catch (error) {
      const message = (error as Error).message;

      if (message === 'Current password is incorrect') {
        return badRequestResponse(h, message);
      }

      throw error;
    }
  }

  /**
   * Reset user password (Admin only)
   */
  static async resetPassword(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;

    // Only admins can reset passwords
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(currentUser.role)) {
      return forbiddenResponse(h, 'Insufficient permissions to reset passwords');
    }

    const { id } = request.params;
    const payload = request.payload as any;
    const newPassword = payload.newPassword as string;

    const result = await UserService.resetUserPassword(id, newPassword);

    return successResponse(h, result);
  }

  /**
   * Deactivate user (Admin only)
   */
  static async deactivate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;

    // Only admins can deactivate users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(currentUser.role)) {
      return forbiddenResponse(h, 'Insufficient permissions to deactivate users');
    }

    const { id } = request.params;

    // Prevent users from deactivating themselves
    if (currentUser.userId === id) {
      return badRequestResponse(h, 'You cannot deactivate your own account');
    }

    const deactivatedUser = await UserService.deactivateUser(id);

    return successResponse(h, { user: deactivatedUser });
  }

  /**
   * Reactivate user (Admin only)
   */
  static async reactivate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;

    // Only admins can reactivate users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(currentUser.role)) {
      return forbiddenResponse(h, 'Insufficient permissions to reactivate users');
    }

    const { id } = request.params;
    const reactivatedUser = await UserService.reactivateUser(id);

    return successResponse(h, { user: reactivatedUser });
  }

  /**
   * Get user statistics (Admin/School Admin only)
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;

    // Only admins and school admins can view user statistics
    if (!['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'].includes(currentUser.role)) {
      return forbiddenResponse(h, 'Insufficient permissions to view user statistics');
    }

    const stats = await UserService.getUserStatistics();

    return successResponse(h, stats);
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { role } = request.params;

    const validRoles = ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return badRequestResponse(h, 'Invalid role specified');
    }

    const users = await UserService.getUsersByRole(role);

    return successResponse(h, { users });
  }

  /**
   * Get available nurses for student assignment
   */
  static async getAvailableNurses(request: AuthenticatedRequest, h: ResponseToolkit) {
    const nurses = await UserService.getAvailableNurses();

    return successResponse(h, { nurses });
  }
}
