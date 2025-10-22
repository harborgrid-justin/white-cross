/**
 * Server Configuration Helpers
 * Provides helper functions for configuring Hapi server with middleware
 */

import { Server } from '@hapi/hapi';
import { createHealthcareMiddleware, HapiMiddlewareAdapter } from '../middleware';
import { User } from '../database/models/User';
import { logger } from '../utils/logger';

/**
 * Configure authentication for Hapi server
 */
export async function configureAuth(server: Server) {
  // User loader function for authentication middleware
  const userLoader = async (userId: string) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role as any,
      permissions: [] // TODO: Load permissions from database
    };
  };

  // Create healthcare middleware suite
  const middleware = createHealthcareMiddleware(userLoader, {
    environment: process.env.NODE_ENV as any
  });

  // Register JWT authentication strategy
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET || 'your-secret-key-here',
    validate: async (decoded: any, request: any) => {
      try {
        const result = await middleware.authenticateRequest(`Bearer ${decoded.token}`);

        if (!result.success) {
          return { isValid: false };
        }

        return {
          isValid: true,
          credentials: result.user
        };
      } catch (error) {
        logger.error('Authentication error:', error);
        return { isValid: false };
      }
    },
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  // Set JWT as default strategy
  server.auth.default('jwt');

  logger.info('Authentication configured');
}

/**
 * Configure security middleware for Hapi server
 */
export async function configureSecurity(server: Server) {
  // Register hapi-auth-jwt2 plugin for JWT authentication
  await server.register(require('hapi-auth-jwt2'));

  logger.info('Security plugins configured');
}

/**
 * Configure error handling for Hapi server
 */
export function errorHandler(request: any, h: any) {
  const response = request.response;

  // Not an error, continue
  if (!response.isBoom) {
    return h.continue;
  }

  const error = response;
  const statusCode = error.output.statusCode;

  // Log error
  logger.error(`HTTP ${statusCode}:`, {
    path: request.path,
    method: request.method,
    error: error.message,
    stack: error.stack
  });

  // Sanitize error response for production
  if (process.env.NODE_ENV === 'production') {
    // Don't expose internal errors in production
    if (statusCode === 500) {
      return h.response({
        success: false,
        error: {
          message: 'Internal Server Error',
          code: 'INTERNAL_ERROR'
        }
      }).code(500);
    }
  }

  // Return formatted error
  return h.response({
    success: false,
    error: {
      message: error.message,
      code: error.output.payload.error?.toUpperCase().replace(/\s+/g, '_') || 'ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  }).code(statusCode);
}
