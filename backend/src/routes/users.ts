/**
 * WC-RTE-USR-024 | User Management API Routes with Role-Based Access Control
 * Purpose: Complete user lifecycle management API with role-based permissions, password management, and user statistics
 * Upstream: ../services/userService, JWT auth middleware | Dependencies: @hapi/hapi, joi validation, JWT authentication
 * Downstream: Admin dashboard, user management interface, role assignment system | Called by: Frontend user management components
 * Related: Authentication routes, permission middleware, audit logging
 * Exports: userRoutes (12 route handlers) | Key Services: CRUD operations, password management, role management, user statistics
 * Last Updated: 2025-10-18 | File Type: .ts | Security: Role-based access control (ADMIN/DISTRICT_ADMIN required for most operations)
 * Critical Path: JWT validation → Role permission check → User service operations → Response formatting
 * LLM Context: User management API with hierarchical permissions (ADMIN > DISTRICT_ADMIN > SCHOOL_ADMIN > NURSE/COUNSELOR > VIEWER), supports user creation, updates, password management, activation/deactivation, statistics, and role-based filtering
 */

import { ServerRoute } from '@hapi/hapi';
import { UserService } from '../services/userService';
import Joi from 'joi';

// Get all users
const getUsersHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.search) filters.search = request.query.search;
    if (request.query.role) filters.role = request.query.role;
    if (request.query.isActive !== undefined) filters.isActive = request.query.isActive === 'true';

    const result = await UserService.getUsers(page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get user by ID
const getUserByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const user = await UserService.getUserById(id);

    return h.response({
      success: true,
      data: { user }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return h.response({
        success: false,
        error: { message: 'User not found' }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new user
const createUserHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check if user has permission to create users (ADMIN or DISTRICT_ADMIN only)
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: { message: 'Insufficient permissions to create users' }
      }).code(403);
    }

    const newUser = await UserService.createUser(request.payload);

    return h.response({
      success: true,
      data: { user: newUser }
    }).code(201);
  } catch (error) {
    if ((error as Error).message === 'User already exists with this email') {
      return h.response({
        success: false,
        error: { message: 'User already exists with this email' }
      }).code(409);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update user
const updateUserHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const user = request.auth.credentials;

    // Check if user has permission to update users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role) && user.userId !== id) {
      return h.response({
        success: false,
        error: { message: 'Insufficient permissions to update this user' }
      }).code(403);
    }

    // Non-admins can only update their own basic info, not role or active status
    const updateData = { ...request.payload };
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      delete updateData.role;
      delete updateData.isActive;
    }

    const updatedUser = await UserService.updateUser(id, updateData);

    return h.response({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return h.response({
        success: false,
        error: { message: 'User not found' }
      }).code(404);
    }

    if ((error as Error).message === 'Email address is already in use') {
      return h.response({
        success: false,
        error: { message: 'Email address is already in use' }
      }).code(409);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Change password
const changePasswordHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const user = request.auth.credentials;

    // Users can only change their own password unless they're admin
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role) && user.userId !== id) {
      return h.response({
        success: false,
        error: { message: 'You can only change your own password' }
      }).code(403);
    }

    const result = await UserService.changePassword(id, request.payload);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return h.response({
        success: false,
        error: { message: 'User not found' }
      }).code(404);
    }

    if ((error as Error).message === 'Current password is incorrect') {
      return h.response({
        success: false,
        error: { message: 'Current password is incorrect' }
      }).code(400);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Reset user password (admin only)
const resetPasswordHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Only admins can reset passwords
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: { message: 'Insufficient permissions to reset passwords' }
      }).code(403);
    }

    const { id } = request.params;
    const { newPassword } = request.payload;

    const result = await UserService.resetUserPassword(id, newPassword);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return h.response({
        success: false,
        error: { message: 'User not found' }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Deactivate user
const deactivateUserHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Only admins can deactivate users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: { message: 'Insufficient permissions to deactivate users' }
      }).code(403);
    }

    const { id } = request.params;

    // Prevent users from deactivating themselves
    if (user.userId === id) {
      return h.response({
        success: false,
        error: { message: 'You cannot deactivate your own account' }
      }).code(400);
    }

    const deactivatedUser = await UserService.deactivateUser(id);

    return h.response({
      success: true,
      data: { user: deactivatedUser }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return h.response({
        success: false,
        error: { message: 'User not found' }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Reactivate user
const reactivateUserHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Only admins can reactivate users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: { message: 'Insufficient permissions to reactivate users' }
      }).code(403);
    }

    const { id } = request.params;
    const reactivatedUser = await UserService.reactivateUser(id);

    return h.response({
      success: true,
      data: { user: reactivatedUser }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return h.response({
        success: false,
        error: { message: 'User not found' }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get user statistics
const getUserStatisticsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Only admins can view user statistics
    if (!['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: { message: 'Insufficient permissions to view user statistics' }
      }).code(403);
    }

    const stats = await UserService.getUserStatistics();

    return h.response({
      success: true,
      data: stats
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get users by role
const getUsersByRoleHandler = async (request: any, h: any) => {
  try {
    const { role } = request.params;

    if (!['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER'].includes(role)) {
      return h.response({
        success: false,
        error: { message: 'Invalid role specified' }
      }).code(400);
    }

    const users = await UserService.getUsersByRole(role);

    return h.response({
      success: true,
      data: { users }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get available nurses for student assignment
const getAvailableNursesHandler = async (request: any, h: any) => {
  try {
    const nurses = await UserService.getAvailableNurses();

    return h.response({
      success: true,
      data: { nurses }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define user routes for Hapi
export const userRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/users',
    handler: getUsersHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          search: Joi.string().optional(),
          role: Joi.string().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/admin/users',
    handler: getUsersHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          search: Joi.string().optional(),
          role: Joi.string().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: getUserByIdHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/users',
    handler: createUserHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
          firstName: Joi.string().trim().required(),
          lastName: Joi.string().trim().required(),
          role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER').required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/users/{id}',
    handler: updateUserHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().optional(),
          firstName: Joi.string().trim().optional(),
          lastName: Joi.string().trim().optional(),
          role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER').optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/users/{id}/change-password',
    handler: changePasswordHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          currentPassword: Joi.string().required(),
          newPassword: Joi.string().min(8).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/users/{id}/reset-password',
    handler: resetPasswordHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          newPassword: Joi.string().min(8).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/users/{id}/deactivate',
    handler: deactivateUserHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/users/{id}/reactivate',
    handler: reactivateUserHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/users/statistics/overview',
    handler: getUserStatisticsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/users/role/{role}',
    handler: getUsersByRoleHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/users/nurses/available',
    handler: getAvailableNursesHandler,
    options: {
      auth: 'jwt'
    }
  }
];
