/**
 * Users Routes (v1)
 * HTTP route definitions for user management endpoints
 */

import { ServerRoute } from '@hapi/hapi';
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
 * User management routes
 */
export const usersRoutes: ServerRoute[] = [
  // List all users
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
              schema: {
                success: true,
                data: {
                  users: 'Array of user objects',
                  pagination: {
                    page: 1,
                    limit: 20,
                    total: 150,
                    totalPages: 8
                  }
                }
              }
            },
            '401': { description: 'Not authenticated' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Get user by ID
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
            '200': { description: 'User retrieved successfully' },
            '404': { description: 'User not found' },
            '401': { description: 'Not authenticated' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Create new user
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
            '201': { description: 'User created successfully' },
            '409': { description: 'User already exists with this email' },
            '403': { description: 'Insufficient permissions' },
            '400': { description: 'Validation error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Update user
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
            '200': { description: 'User updated successfully' },
            '404': { description: 'User not found' },
            '409': { description: 'Email address already in use' },
            '403': { description: 'Insufficient permissions' },
            '400': { description: 'Validation error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Change password
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
            '200': { description: 'Password changed successfully' },
            '404': { description: 'User not found' },
            '400': { description: 'Current password is incorrect or validation error' },
            '403': { description: 'You can only change your own password' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Reset password (admin only)
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
            '200': { description: 'Password reset successfully' },
            '404': { description: 'User not found' },
            '403': { description: 'Insufficient permissions to reset passwords' },
            '400': { description: 'Validation error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Deactivate user
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
            '200': { description: 'User deactivated successfully' },
            '404': { description: 'User not found' },
            '403': { description: 'Insufficient permissions' },
            '400': { description: 'Cannot deactivate your own account' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Reactivate user
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
            '200': { description: 'User reactivated successfully' },
            '404': { description: 'User not found' },
            '403': { description: 'Insufficient permissions' },
            '400': { description: 'Validation error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Get user statistics
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
              schema: {
                success: true,
                data: {
                  total: 150,
                  active: 140,
                  inactive: 10,
                  byRole: {
                    ADMIN: 5,
                    NURSE: 80,
                    COUNSELOR: 30,
                    VIEWER: 35
                  }
                }
              }
            },
            '403': { description: 'Insufficient permissions' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Get users by role
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
            '200': { description: 'Users retrieved successfully' },
            '400': { description: 'Invalid role specified' },
            '401': { description: 'Not authenticated' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // Get available nurses
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
              schema: {
                success: true,
                data: {
                  nurses: 'Array of nurse user objects'
                }
              }
            },
            '401': { description: 'Not authenticated' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
