/**
 * Authentication Routes (v1)
 * HTTP route definitions for authentication endpoints
 */

import { ServerRoute } from '@hapi/hapi';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { asyncHandler } from '../../../shared/utils';

/**
 * Authentication routes
 */
export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    handler: asyncHandler(AuthController.register),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Register a new user',
      notes: 'Creates a new user account with the specified role. Password must be at least 8 characters. Returns JWT token and user object.',
      validate: {
        payload: registerSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'User registered successfully',
              schema: {
                success: true,
                data: {
                  user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'NURSE'
                  }
                }
              }
            },
            '409': { description: 'User already exists with this email' },
            '400': { description: 'Validation error' }
          },
          security: []
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    handler: asyncHandler(AuthController.login),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Login user',
      notes: 'Authenticates user credentials and returns JWT token (24-hour expiration) with user profile.',
      validate: {
        payload: loginSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Login successful',
              schema: {
                success: true,
                data: {
                  token: 'jwt.token.here',
                  user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'NURSE'
                  }
                }
              }
            },
            '401': { description: 'Invalid credentials' },
            '400': { description: 'Validation error' }
          },
          security: []
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/verify',
    handler: asyncHandler(AuthController.verify),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Verify JWT token',
      notes: 'Validates JWT token and returns user information if token is valid.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token is valid',
              schema: {
                success: true,
                data: {
                  id: 'uuid',
                  email: 'user@example.com',
                  firstName: 'John',
                  lastName: 'Doe',
                  role: 'NURSE'
                }
              }
            },
            '401': { description: 'Invalid or expired token' }
          },
          security: []
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/refresh',
    handler: asyncHandler(AuthController.refresh),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Refresh JWT token',
      notes: 'Exchanges existing token for a new one with extended expiration.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token refreshed successfully',
              schema: {
                success: true,
                data: {
                  token: 'new.jwt.token',
                  user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'NURSE'
                  }
                }
              }
            },
            '401': { description: 'Invalid or expired token' }
          },
          security: []
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/auth/me',
    handler: asyncHandler(AuthController.me),
    options: {
      auth: 'jwt',
      tags: ['api', 'Authentication', 'v1'],
      description: 'Get current authenticated user',
      notes: 'Returns profile information for the currently authenticated user.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Current user retrieved',
              schema: {
                success: true,
                data: {
                  id: 'uuid',
                  email: 'user@example.com',
                  firstName: 'John',
                  lastName: 'Doe',
                  role: 'NURSE'
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
