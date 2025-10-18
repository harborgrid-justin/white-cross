/**
 * LOC: 415BD5A60F
 * WC-RTE-AUTH-029 | Enhanced Authentication API Routes with Shared Utilities
 *
 * UPSTREAM (imports from):
 *   - User.ts (database/models/core/User.ts)
 *   - index.ts (constants/index.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - index.ts (shared/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-AUTH-029 | Enhanced Authentication API Routes with Shared Utilities
 * Purpose: Advanced authentication system with comprehensive JWT management, token refresh, user verification, and Swagger documentation using shared utility functions
 * Upstream: ../database/models/core/User, ../shared auth utilities, Sequelize error handler | Dependencies: @hapi/hapi, Sequelize User model, joi, shared utilities
 * Downstream: All authenticated endpoints, frontend auth system, API documentation | Called by: Login/registration forms, token management, API consumers
 * Related: Access control routes, user management, audit logging, API documentation
 * Exports: authRoutes (5 Hapi route handlers with Swagger docs) | Key Services: Registration, login, token verification, refresh, current user
 * Last Updated: 2025-10-18 | File Type: .ts | Security: Shared password utilities, JWT management, role validation, comprehensive error handling
 * Critical Path: Request validation → Authentication processing → Token management → User session handling → Swagger documentation
 * LLM Context: Production-ready authentication system for healthcare platform with comprehensive JWT token management, password security, role-based access, token refresh capabilities, and full API documentation for secure medical data access
 */

import { ServerRoute } from '@hapi/hapi';
import { User } from '../database/models/core/User';
import Joi from 'joi';
import { ENVIRONMENT, JWT_CONFIG } from '../constants';
import { createErrorResponse } from '../utils/sequelizeErrorHandler';
import { hashPassword, comparePassword, generateToken, verifyToken, refreshToken, extractTokenFromHeader, decodeToken } from '../shared';

// Register endpoint
const registerHandler = async (request: any, h: any) => {
  try {
    const { email, password, firstName, lastName, role } = request.payload;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return h.response({
        success: false,
        error: { message: 'User already exists with this email' }
      }).code(409);
    }

    // Hash password using shared utility
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role
    });

    // Use the model's toSafeObject method to exclude sensitive fields
    const safeUser = user.toSafeObject();

    return h.response({
      success: true,
      data: { user: safeUser }
    }).code(201);

  } catch (error) {
    // Use Sequelize error handler for consistent error responses
    return createErrorResponse(h, error as Error);
  }
};

// Login endpoint
const loginHandler = async (request: any, h: any) => {
  try {
    const { email, password } = request.payload;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return h.response({
        success: false,
        error: { message: 'Invalid credentials' }
      }).code(401);
    }

    // Verify password using shared utility
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return h.response({
        success: false,
        error: { message: 'Invalid credentials' }
      }).code(401);
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT for API access using shared utility
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Use the model's toSafeObject method
    const safeUser = user.toSafeObject();

    return h.response({
      success: true,
      data: {
        token,
        user: safeUser
      }
    });

  } catch (error) {
    return createErrorResponse(h, error as Error);
  }
};

// Verify token endpoint
const verifyHandler = async (request: any, h: any) => {
  try {
    const token = extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      return h.response({
        success: false,
        error: { message: 'Access token required' }
      }).code(401);
    }

    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
    });

    if (!user || !user.isActive) {
      return h.response({
        success: false,
        error: { message: 'User not found or inactive' }
      }).code(401);
    }

    return h.response({
      success: true,
      data: user.toSafeObject()
    });

  } catch (error) {
    return h.response({
      success: false,
      error: { message: 'Invalid or expired token' }
    }).code(401);
  }
};

// Refresh token endpoint
const refreshHandler = async (request: any, h: any) => {
  try {
    const token = extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      return h.response({
        success: false,
        error: { message: 'Access token required' }
      }).code(401);
    }

    // Use shared utility to refresh token
    const newToken = refreshToken(token);
    const decoded = decodeToken(newToken);

    if (!decoded || !decoded.userId) {
      return h.response({
        success: false,
        error: { message: 'Invalid token format' }
      }).code(401);
    }

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
    });

    if (!user || !user.isActive) {
      return h.response({
        success: false,
        error: { message: 'User not found or inactive' }
      }).code(401);
    }

    return h.response({
      success: true,
      data: {
        token: newToken,
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    return createErrorResponse(h, error as Error);
  }
};

// Get current user endpoint
const meHandler = async (request: any, h: any) => {
  const user = request.auth.credentials;

  if (user) {
    return h.response({
      success: true,
      data: user
    });
  } else {
    return h.response({
      success: false,
      error: { message: 'Not authenticated' }
    }).code(401);
  }
};

// Define auth routes for Hapi
export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: registerHandler,
    options: {
      auth: false,
      tags: ['api', 'Authentication'],
      description: 'Register a new user',
      notes: 'Creates a new user account with the specified role. Password must be at least 8 characters.',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('User email address'),
          password: Joi.string().min(8).required().description('Password (min 8 characters)'),
          firstName: Joi.string().trim().required().description('User first name'),
          lastName: Joi.string().trim().required().description('User last name'),
          role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER').required().description('User role')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'User successfully created',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  user: Joi.object({
                    id: Joi.string().example('user-123'),
                    email: Joi.string().email().example('nurse@school.edu'),
                    firstName: Joi.string().example('Jane'),
                    lastName: Joi.string().example('Smith'),
                    role: Joi.string().example('NURSE'),
                    createdAt: Joi.string().isoDate()
                  })
                })
              })
            },
            '409': {
              description: 'User already exists'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: loginHandler,
    options: {
      auth: false, // Disable auth for login
      tags: ['api', 'Authentication'],
      description: 'User login',
      notes: 'Authenticates a user and returns a JWT token valid for 24 hours. Use this token in the Authorization header for subsequent requests.',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('User email address'),
          password: Joi.string().required().description('User password')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Login successful',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
                  user: Joi.object({
                    id: Joi.string().example('user-123'),
                    email: Joi.string().email().example('nurse@school.edu'),
                    firstName: Joi.string().example('Jane'),
                    lastName: Joi.string().example('Smith'),
                    role: Joi.string().example('NURSE')
                  })
                })
              })
            },
            '401': {
              description: 'Invalid credentials or user inactive'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/auth/verify',
    handler: verifyHandler,
    options: {
      auth: false, // Disable auth for token verification
      tags: ['api', 'Authentication'],
      description: 'Verify JWT token',
      notes: 'Validates a JWT token and returns the associated user information. Pass the token in the Authorization header.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token is valid',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  id: Joi.string().example('user-123'),
                  email: Joi.string().email().example('nurse@school.edu'),
                  firstName: Joi.string().example('Jane'),
                  lastName: Joi.string().example('Smith'),
                  role: Joi.string().example('NURSE'),
                  isActive: Joi.boolean().example(true)
                })
              })
            },
            '401': {
              description: 'Invalid, expired, or missing token'
            }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/refresh',
    handler: refreshHandler,
    options: {
      auth: false, // Disable auth for token refresh
      tags: ['api', 'Authentication'],
      description: 'Refresh JWT token',
      notes: 'Refreshes an existing JWT token (even if expired) and returns a new token with updated expiration. Pass the old token in the Authorization header.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token refreshed successfully',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
                  user: Joi.object({
                    id: Joi.string().example('user-123'),
                    email: Joi.string().email().example('nurse@school.edu'),
                    firstName: Joi.string().example('Jane'),
                    lastName: Joi.string().example('Smith'),
                    role: Joi.string().example('NURSE')
                  })
                })
              })
            },
            '401': {
              description: 'Invalid token, user not found, or user inactive'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    handler: meHandler,
    options: {
      auth: 'jwt', // Require authentication
      tags: ['api', 'Authentication'],
      description: 'Get current user',
      notes: 'Returns the authenticated user\'s profile information. Requires valid JWT token in Authorization header.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Current user information',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  id: Joi.string().example('user-123'),
                  email: Joi.string().email().example('nurse@school.edu'),
                  firstName: Joi.string().example('Jane'),
                  lastName: Joi.string().example('Smith'),
                  role: Joi.string().example('NURSE')
                })
              })
            },
            '401': {
              description: 'Not authenticated or invalid token'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
