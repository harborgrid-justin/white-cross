/**
 * Users Controller
 * Business logic for user management operations
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
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

export class UsersController {
  /**
   * Get all users with pagination and filters
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
      buildPaginationMeta(page, limit, result.total)
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

    const newUser = await UserService.createUser(request.payload);

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
    const updateData = { ...request.payload };
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
      const result = await UserService.changePassword(id, request.payload);
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
    const { newPassword } = request.payload;

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
