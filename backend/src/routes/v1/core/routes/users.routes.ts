/**
 * @fileoverview User Management Routes (v1)
 *
 * HTTP route definitions for comprehensive user account management including
 * CRUD operations, password management, role filtering, and user statistics.
 * Implements secure user administration with role-based access control.
 *
 * **Available Endpoints (12 routes):**
 * - GET /api/v1/users - List users with pagination/filtering
 * - GET /api/v1/users/{id} - Get user details by ID
 * - POST /api/v1/users - Create new user (Admin only)
 * - PUT /api/v1/users/{id} - Update user information
 * - POST /api/v1/users/{id}/change-password - Change password (requires current)
 * - POST /api/v1/users/{id}/reset-password - Reset password (Admin only)
 * - POST /api/v1/users/{id}/deactivate - Deactivate user (Admin only)
 * - POST /api/v1/users/{id}/reactivate - Reactivate user (Admin only)
 * - GET /api/v1/users/statistics - Platform user statistics (Admin only)
 * - GET /api/v1/users/role/{role} - Get users by role
 * - GET /api/v1/users/nurses/available - Get active nurses for assignment
 *
 * **Security Features:**
 * - All routes require JWT authentication
 * - Admin-only operations for user creation, role changes, and system management
 * - Self-service operations allow users to update own profile and password
 * - Password validation enforces minimum security requirements
 * - Account activation/deactivation with audit trails
 *
 * **User Roles:**
 * - ADMIN: Full system access and user management
 * - DISTRICT_ADMIN: District-wide user management
 * - SCHOOL_ADMIN: School-level administration
 * - NURSE: Student health management (primary user type)
 * - COUNSELOR: Limited health record access
 * - VIEWER: Read-only access
 *
 * @module routes/v1/core/routes/users.routes
 * @requires @hapi/hapi
 * @requires joi
 * @requires ../controllers/users.controller
 * @requires ../validators/users.validators
 * @see {@link module:routes/v1/core/controllers/users.controller} for business logic
 * @see {@link module:routes/v1/core/validators/users.validators} for validation schemas
 * @since 1.0.0
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { UsersController } from '../controllers/users.controller';
import {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
  userIdParamSchema,
  roleParamSchema
} from '../validators/users.validators';
import { asyncHandler } from '../../../shared/utils';

/**
 * Reusable Swagger schemas for user responses
 */
const UserObjectSchema = Joi.object({
  id: Joi.string().uuid().example('550e8400-e29b-41d4-a716-446655440000').description('User unique identifier (UUID)'),
  email: Joi.string().email().example('nurse@whitecross.health').description('User email address'),
  firstName: Joi.string().example('Sarah').description('User first name'),
  lastName: Joi.string().example('Johnson').description('User last name'),
  role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER').example('NURSE').description('User role'),
  isActive: Joi.boolean().example(true).description('Whether the user account is active'),
  createdAt: Joi.string().isoDate().example('2024-01-15T10:30:00.000Z').description('Account creation timestamp'),
  updatedAt: Joi.string().isoDate().example('2024-01-15T10:30:00.000Z').description('Last update timestamp')
}).label('UserObject');

const UserResponseSchema = Joi.object({
  success: Joi.boolean().valid(true).example(true).description('Operation success indicator'),
  data: Joi.object({
    user: UserObjectSchema
  }).description('User data')
}).label('UserResponse');

const UsersListResponseSchema = Joi.object({
  success: Joi.boolean().valid(true).example(true).description('Operation success indicator'),
  data: Joi.array().items(UserObjectSchema).description('List of users'),
  pagination: Joi.object({
    page: Joi.number().integer().example(1).description('Current page number'),
    limit: Joi.number().integer().example(20).description('Items per page'),
    total: Joi.number().integer().example(150).description('Total number of users'),
    totalPages: Joi.number().integer().example(8).description('Total number of pages')
  }).description('Pagination metadata')
}).label('UsersListResponse');

const UserStatisticsResponseSchema = Joi.object({
  success: Joi.boolean().valid(true).example(true),
  data: Joi.object({
    total: Joi.number().integer().example(150).description('Total number of users'),
    active: Joi.number().integer().example(140).description('Number of active users'),
    inactive: Joi.number().integer().example(10).description('Number of inactive users'),
    byRole: Joi.object().pattern(
      Joi.string(),
      Joi.number().integer()
    ).example({
      ADMIN: 5,
      NURSE: 80,
      COUNSELOR: 30,
      VIEWER: 35
    }).description('User count by role')
  }).description('User statistics')
}).label('UserStatisticsResponse');

const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().valid(false).example(false).description('Operation failure indicator'),
  error: Joi.object({
    message: Joi.string().example('User not found').description('Error message'),
    code: Joi.string().example('NOT_FOUND').description('Error code')
  }).description('Error details')
}).label('ErrorResponse');

/**
 * User management route collection.
 *
 * Complete set of 12 routes for user administration in the White Cross
 * Healthcare Platform. Supports pagination, filtering, password management,
 * and role-based access control.
 *
 * **Route Categories:**
 * - User CRUD: List, get, create, update (4 routes)
 * - Password Management: Change, reset (2 routes)
 * - Account Management: Activate, deactivate (2 routes)
 * - Query & Filter: By role, nurses, statistics (3 routes)
 *
 * **Permission Model:**
 * - Admins: Full access to all operations
 * - Regular users: Can view/update own profile and change own password
 * - Nurses: Can be queried for student assignments
 *
 * **Pagination:**
 * Default 20 items per page, configurable via query parameters.
 * Includes total count and page metadata in responses.
 *
 * @const {ServerRoute[]}
 *
 * @example
 * ```typescript
 * // List all nurses with pagination
 * GET /api/v1/users?role=NURSE&page=1&limit=20
 * Authorization: Bearer <token>
 * // Response: { success: true, data: [...], pagination: {...} }
 *
 * // Create new user (Admin only)
 * POST /api/v1/users
 * Authorization: Bearer <admin-token>
 * {
 *   "email": "nurse@school.edu",
 *   "password": "SecurePass123",
 *   "firstName": "Jane",
 *   "lastName": "Smith",
 *   "role": "NURSE"
 * }
 *
 * // Change own password
 * POST /api/v1/users/{userId}/change-password
 * Authorization: Bearer <token>
 * {
 *   "currentPassword": "OldPass123",
 *   "newPassword": "NewSecurePass456"
 * }
 *
 * // Get user statistics (Admin only)
 * GET /api/v1/users/statistics
 * Authorization: Bearer <admin-token>
 * // Response: { total: 150, active: 140, byRole: {...} }
 *
 * // Get available nurses for assignment
 * GET /api/v1/users/nurses/available
 * Authorization: Bearer <token>
 * // Response: { success: true, data: { nurses: [...] } }
 * ```
 */
export const usersRoutes: ServerRoute[] = [
  /**
   * GET /api/v1/users
   * @description List all users with pagination and filtering
   * @requires Authentication (JWT)
   * @param {number} query.page - Page number (default: 1)
   * @param {number} query.limit - Items per page (default: 20)
   * @param {string} query.search - Search by name or email
   * @param {string} query.role - Filter by role
   * @param {boolean} query.isActive - Filter by active status
   * @returns {UsersListResponse} 200 - Paginated list of users
   * @returns {ErrorResponse} 401 - Not authenticated
   */
  {
    method: 'GET',
    path: '/api/v1/users',
    handler: asyncHandler(UsersController.list),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Get all users with pagination and filters',
      notes: 'Returns paginated list of users. Supports filtering by role, active status, and search by name/email.',
      validate: {
        query: listUsersQuerySchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Users retrieved successfully',
              schema: UsersListResponseSchema
            },
            '401': { description: 'Not authenticated', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * GET /api/v1/users/{id}
   * @description Get detailed information about a specific user
   * @requires Authentication (JWT)
   * @param {string} params.id - User UUID
   * @returns {UserResponse} 200 - User details
   * @returns {ErrorResponse} 401 - Not authenticated
   * @returns {ErrorResponse} 404 - User not found
   */
  {
    method: 'GET',
    path: '/api/v1/users/{id}',
    handler: asyncHandler(UsersController.getById),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Get user by ID',
      notes: 'Returns detailed information about a specific user including their statistics and assignments.',
      validate: {
        params: userIdParamSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'User retrieved successfully', schema: UserResponseSchema },
            '404': { description: 'User not found', schema: ErrorResponseSchema },
            '401': { description: 'Not authenticated', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * POST /api/v1/users
   * @description Create a new user account (Admin only)
   * @requires Authentication (JWT) and ADMIN or DISTRICT_ADMIN role
   * @param {object} payload - User creation data
   * @param {string} payload.email - User email address
   * @param {string} payload.password - User password (min 8 characters)
   * @param {string} payload.firstName - User first name
   * @param {string} payload.lastName - User last name
   * @param {string} payload.role - User role
   * @returns {UserResponse} 201 - User created successfully
   * @returns {ErrorResponse} 400 - Validation error
   * @returns {ErrorResponse} 403 - Insufficient permissions
   * @returns {ErrorResponse} 409 - User already exists with this email
   */
  {
    method: 'POST',
    path: '/api/v1/users',
    handler: asyncHandler(UsersController.create),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Create new user',
      notes: '**ADMIN ONLY** - Creates a new user account. Requires ADMIN or DISTRICT_ADMIN role.',
      validate: {
        payload: createUserSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'User created successfully', schema: UserResponseSchema },
            '409': { description: 'User already exists with this email', schema: ErrorResponseSchema },
            '403': { description: 'Insufficient permissions', schema: ErrorResponseSchema },
            '400': { description: 'Validation error', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * PUT /api/v1/users/{id}
   * @description Update user information
   * @requires Authentication (JWT)
   * @note Admins can update any user. Regular users can only update their own basic info.
   * @param {string} params.id - User UUID
   * @param {object} payload - User update data
   * @returns {UserResponse} 200 - User updated successfully
   * @returns {ErrorResponse} 400 - Validation error
   * @returns {ErrorResponse} 403 - Insufficient permissions
   * @returns {ErrorResponse} 404 - User not found
   * @returns {ErrorResponse} 409 - Email address already in use
   */
  {
    method: 'PUT',
    path: '/api/v1/users/{id}',
    handler: asyncHandler(UsersController.update),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Update user',
      notes: 'Updates user information. Admins can update any user and change role/status. Regular users can only update their own basic info (name, email).',
      validate: {
        params: userIdParamSchema,
        payload: updateUserSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'User updated successfully', schema: UserResponseSchema },
            '404': { description: 'User not found', schema: ErrorResponseSchema },
            '409': { description: 'Email address already in use', schema: ErrorResponseSchema },
            '403': { description: 'Insufficient permissions', schema: ErrorResponseSchema },
            '400': { description: 'Validation error', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * POST /api/v1/users/{id}/change-password
   * @description Change user password (requires current password)
   * @requires Authentication (JWT)
   * @note Users can change their own password. Admins can change any user's password.
   * @param {string} params.id - User UUID
   * @param {object} payload - Password change data
   * @param {string} payload.currentPassword - Current password
   * @param {string} payload.newPassword - New password (min 8 characters)
   * @returns {PasswordChangeResponse} 200 - Password changed successfully
   * @returns {ErrorResponse} 400 - Current password is incorrect or validation error
   * @returns {ErrorResponse} 403 - Can only change own password (non-admin)
   * @returns {ErrorResponse} 404 - User not found
   */
  {
    method: 'POST',
    path: '/api/v1/users/{id}/change-password',
    handler: asyncHandler(UsersController.changePassword),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Change user password',
      notes: 'Allows users to change their own password (requires current password). Admins can change any user password.',
      validate: {
        params: userIdParamSchema,
        payload: changePasswordSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Password changed successfully', schema: Joi.object({
              success: Joi.boolean().valid(true).example(true),
              data: Joi.object({
                message: Joi.string().example('Password changed successfully')
              })
            }).label('PasswordChangeResponse') },
            '404': { description: 'User not found', schema: ErrorResponseSchema },
            '400': { description: 'Current password is incorrect or validation error', schema: ErrorResponseSchema },
            '403': { description: 'You can only change your own password', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * POST /api/v1/users/{id}/reset-password
   * @description Reset user password without requiring current password (Admin only)
   * @requires Authentication (JWT) and ADMIN or DISTRICT_ADMIN role
   * @param {string} params.id - User UUID
   * @param {object} payload - Password reset data
   * @param {string} payload.newPassword - New password (min 8 characters)
   * @returns {PasswordResetResponse} 200 - Password reset successfully
   * @returns {ErrorResponse} 400 - Validation error
   * @returns {ErrorResponse} 403 - Insufficient permissions
   * @returns {ErrorResponse} 404 - User not found
   */
  {
    method: 'POST',
    path: '/api/v1/users/{id}/reset-password',
    handler: asyncHandler(UsersController.resetPassword),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Reset user password',
      notes: '**ADMIN ONLY** - Resets user password without requiring current password. Requires ADMIN or DISTRICT_ADMIN role.',
      validate: {
        params: userIdParamSchema,
        payload: resetPasswordSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Password reset successfully', schema: Joi.object({
              success: Joi.boolean().valid(true).example(true),
              data: Joi.object({
                message: Joi.string().example('Password reset successfully')
              })
            }).label('PasswordResetResponse') },
            '404': { description: 'User not found', schema: ErrorResponseSchema },
            '403': { description: 'Insufficient permissions to reset passwords', schema: ErrorResponseSchema },
            '400': { description: 'Validation error', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * POST /api/v1/users/{id}/deactivate
   * @description Deactivate a user account (Admin only)
   * @requires Authentication (JWT) and ADMIN or DISTRICT_ADMIN role
   * @note Users cannot deactivate themselves
   * @param {string} params.id - User UUID
   * @returns {UserResponse} 200 - User deactivated successfully
   * @returns {ErrorResponse} 400 - Cannot deactivate own account
   * @returns {ErrorResponse} 403 - Insufficient permissions
   * @returns {ErrorResponse} 404 - User not found
   */
  {
    method: 'POST',
    path: '/api/v1/users/{id}/deactivate',
    handler: asyncHandler(UsersController.deactivate),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Deactivate user',
      notes: '**ADMIN ONLY** - Deactivates a user account. Users cannot deactivate themselves. Requires ADMIN or DISTRICT_ADMIN role.',
      validate: {
        params: userIdParamSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'User deactivated successfully', schema: UserResponseSchema },
            '404': { description: 'User not found', schema: ErrorResponseSchema },
            '403': { description: 'Insufficient permissions', schema: ErrorResponseSchema },
            '400': { description: 'Cannot deactivate your own account', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * POST /api/v1/users/{id}/reactivate
   * @description Reactivate a previously deactivated user account (Admin only)
   * @requires Authentication (JWT) and ADMIN or DISTRICT_ADMIN role
   * @param {string} params.id - User UUID
   * @returns {UserResponse} 200 - User reactivated successfully
   * @returns {ErrorResponse} 400 - Validation error
   * @returns {ErrorResponse} 403 - Insufficient permissions
   * @returns {ErrorResponse} 404 - User not found
   */
  {
    method: 'POST',
    path: '/api/v1/users/{id}/reactivate',
    handler: asyncHandler(UsersController.reactivate),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Reactivate user',
      notes: '**ADMIN ONLY** - Reactivates a previously deactivated user account. Requires ADMIN or DISTRICT_ADMIN role.',
      validate: {
        params: userIdParamSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'User reactivated successfully', schema: UserResponseSchema },
            '404': { description: 'User not found', schema: ErrorResponseSchema },
            '403': { description: 'Insufficient permissions', schema: ErrorResponseSchema },
            '400': { description: 'Validation error', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * GET /api/v1/users/statistics
   * @description Get platform-wide user statistics (Admin/School Admin only)
   * @requires Authentication (JWT) and ADMIN, DISTRICT_ADMIN, or SCHOOL_ADMIN role
   * @returns {UserStatisticsResponse} 200 - User statistics including counts by role and status
   * @returns {ErrorResponse} 403 - Insufficient permissions
   */
  {
    method: 'GET',
    path: '/api/v1/users/statistics',
    handler: asyncHandler(UsersController.getStatistics),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'Statistics', 'v1'],
      description: 'Get user statistics',
      notes: '**ADMIN/SCHOOL ADMIN ONLY** - Returns platform-wide user statistics including counts by role, active/inactive users, etc.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Statistics retrieved successfully',
              schema: UserStatisticsResponseSchema
            },
            '403': { description: 'Insufficient permissions', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * GET /api/v1/users/role/{role}
   * @description Get all users with a specific role
   * @requires Authentication (JWT)
   * @param {string} params.role - User role to filter by
   * @returns {UsersByRoleResponse} 200 - List of users with specified role
   * @returns {ErrorResponse} 400 - Invalid role specified
   * @returns {ErrorResponse} 401 - Not authenticated
   */
  {
    method: 'GET',
    path: '/api/v1/users/role/{role}',
    handler: asyncHandler(UsersController.getUsersByRole),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'v1'],
      description: 'Get users by role',
      notes: 'Returns all users with the specified role. Useful for populating dropdowns or assignment interfaces.',
      validate: {
        params: roleParamSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Users retrieved successfully', schema: Joi.object({
              success: Joi.boolean().valid(true).example(true),
              data: Joi.object({
                users: Joi.array().items(UserObjectSchema).description('List of users with specified role')
              })
            }).label('UsersByRoleResponse') },
            '400': { description: 'Invalid role specified', schema: ErrorResponseSchema },
            '401': { description: 'Not authenticated', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  /**
   * GET /api/v1/users/nurses/available
   * @description Get all active nurses available for student assignment
   * @requires Authentication (JWT)
   * @returns {AvailableNursesResponse} 200 - List of active nurse users
   * @returns {ErrorResponse} 401 - Not authenticated
   */
  {
    method: 'GET',
    path: '/api/v1/users/nurses/available',
    handler: asyncHandler(UsersController.getAvailableNurses),
    options: {
      auth: 'jwt',
      tags: ['api', 'Users', 'Nurses', 'v1'],
      description: 'Get available nurses',
      notes: 'Returns all active nurses available for student assignment.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Available nurses retrieved successfully',
              schema: Joi.object({
                success: Joi.boolean().valid(true).example(true),
                data: Joi.object({
                  nurses: Joi.array().items(UserObjectSchema).description('Array of active nurse user objects')
                })
              }).label('AvailableNursesResponse')
            },
            '401': { description: 'Not authenticated', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
