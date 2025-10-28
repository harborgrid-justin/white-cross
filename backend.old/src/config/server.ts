/**
 * @fileoverview Server Configuration Helpers
 * @module config/server
 * @description Hapi server configuration utilities for authentication, security, and error handling
 * @requires @hapi/hapi - Hapi server framework
 * @requires ../middleware - Healthcare middleware suite
 * @requires ../database/models/User - User model for authentication
 * @requires ../utils/logger - Application logging
 */

/**
 * Server Configuration Helpers
 *
 * This module provides configuration utilities for the Hapi server including:
 * - JWT authentication strategy setup
 * - Security plugin registration
 * - Global error handling
 * - User authorization middleware
 *
 * @description Key features:
 * - JWT-based authentication with user validation
 * - Role-based access control (RBAC)
 * - HIPAA-compliant audit logging
 * - Production-ready error handling
 * - Secure token management
 *
 * @example
 * // Configure server during initialization
 * await configureSecurity(server);
 * await configureAuth(server);
 * server.ext('onPreResponse', errorHandler);
 */

import { Server } from '@hapi/hapi';
import { createHealthcareMiddleware, HapiMiddlewareAdapter } from '../middleware';
import { User } from '../database/models/core/User';
import { logger } from '../utils/logger';

/**
 * @constant {string} JWT_SECRET
 * @description JWT signing secret from environment
 * @env JWT_SECRET
 * @default 'your-secret-key-here'
 * @security CRITICAL - Must be set in production, never use default value
 * @example
 * // In .env file:
 * JWT_SECRET=your-256-bit-secret-key-here
 */

/**
 * Configure JWT authentication strategy for Hapi server
 *
 * @async
 * @function configureAuth
 * @param {Server} server - Hapi server instance
 * @returns {Promise<void>}
 *
 * @description Sets up JWT authentication strategy with:
 * - Bearer token validation
 * - User credential loading from database
 * - Healthcare middleware integration
 * - HS256 algorithm verification
 *
 * @example
 * const server = Hapi.server({ port: 3000 });
 * await configureSecurity(server); // Must be called first
 * await configureAuth(server);
 *
 * // Routes now require authentication by default
 * server.route({
 *   method: 'GET',
 *   path: '/protected',
 *   handler: (request, h) => {
 *     // request.auth.credentials contains authenticated user
 *     return { user: request.auth.credentials };
 *   }
 * });
 *
 * @throws {Error} When authentication setup fails
 * @requires configureSecurity must be called first to register hapi-auth-jwt2
 * @security Validates JWT tokens and loads user permissions
 */
export async function configureAuth(server: Server) {
  // User loader function for authentication middleware
  const userLoader = async (userId: string) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      role: user.role as any,
      isActive: user.isActive,
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
        // Decoded contains the JWT payload: {id, email, role, type, iat, exp, aud, iss, jti}
        // Load user from database using the ID from the token
        const user = await User.findByPk(decoded.id);

        if (!user || !user.isActive) {
          return { isValid: false };
        }

        // Return user credentials
        return {
          isValid: true,
          credentials: {
            userId: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            firstName: user.firstName,
            lastName: user.lastName
          }
        };
      } catch (error) {
        logger.error('Authentication error:', error);
        return { isValid: false };
      }
    },
    verifyOptions: {
      algorithms: ['HS256'],
      audience: 'white-cross-api',
      issuer: 'white-cross-healthcare'
    }
  });

  // Set JWT as default strategy
  server.auth.default('jwt');

  logger.info('Authentication configured');
}

/**
 * Configure security plugins for Hapi server
 *
 * @async
 * @function configureSecurity
 * @param {Server} server - Hapi server instance
 * @returns {Promise<void>}
 *
 * @description Registers essential security plugins including:
 * - hapi-auth-jwt2: JWT authentication support
 *
 * @example
 * const server = Hapi.server({ port: 3000 });
 * await configureSecurity(server);
 * await configureAuth(server); // Call after security setup
 *
 * @throws {Error} When plugin registration fails
 * @requires hapi-auth-jwt2 package must be installed
 * @security Must be called before configureAuth
 */
export async function configureSecurity(server: Server) {
  // Register hapi-auth-jwt2 plugin for JWT authentication
  await server.register(require('hapi-auth-jwt2'));

  logger.info('Security plugins configured');
}

/**
 * Global error handler for Hapi server
 *
 * @function errorHandler
 * @param {Object} request - Hapi request object
 * @param {Object} h - Hapi response toolkit
 * @returns {Object} Formatted error response or h.continue
 *
 * @description Handles all uncaught errors in the request lifecycle:
 * - Logs errors with request context
 * - Sanitizes error messages in production
 * - Returns standardized error format
 * - Prevents internal error exposure
 *
 * @example
 * // Register as onPreResponse extension
 * server.ext('onPreResponse', errorHandler);
 *
 * // Error responses follow standard format:
 * // {
 * //   success: false,
 * //   error: {
 * //     message: 'Error description',
 * //     code: 'ERROR_CODE',
 * //     stack: '...' // Only in development
 * //   }
 * // }
 *
 * @security Production mode hides internal error details (500 errors)
 * @performance Minimal overhead - only processes error responses
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
