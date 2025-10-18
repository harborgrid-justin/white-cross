/**
 * JWT Authentication Utilities
 * Shared JWT configuration and authentication logic
 */

import { Server, Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';
import * as jwt from '@hapi/jwt';
import { logger } from '../logging/logger';

// Hapi-specific AuthRequest interface
export interface AuthRequest extends HapiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  AUDIENCE: 'white-cross-users',
  ISSUER: 'white-cross-api',
  MAX_AGE_SEC: 24 * 60 * 60, // 24 hours
  TIME_SKEW_SEC: 15,
  DEFAULT_SECRET: 'your-jwt-secret-key-change-in-production'
};

/**
 * Configure JWT authentication for Hapi server
 */
export const configureAuth = async (server: Server) => {
  // Register JWT plugin
  await server.register(jwt);

  // Set JWT secret - ensure it matches what's used in token generation
  const jwtSecret = process.env.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET;

  server.auth.strategy('jwt', 'jwt', {
    keys: jwtSecret,
    verify: {
      aud: JWT_CONFIG.AUDIENCE,
      iss: JWT_CONFIG.ISSUER,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: JWT_CONFIG.MAX_AGE_SEC,
      timeSkewSec: JWT_CONFIG.TIME_SKEW_SEC
    },
    validate: async (artifacts, _request, _h) => {
      try {
        const decoded = artifacts.decoded;
        const payload = decoded.payload as any;

        // In a real implementation, you would verify user still exists and is active
        // For now, we'll just validate the token structure
        if (!payload.userId || !payload.email || !payload.role) {
          return { isValid: false };
        }

        return {
          isValid: true,
          credentials: {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
          }
        };
      } catch (error) {
        logger.error('JWT validation error:', error);
        return { isValid: false };
      }
    }
  });

  // Set default auth strategy
  server.auth.default('jwt');
};

/**
 * Hapi middleware function for routes that need authentication
 */
export const authMiddleware = (request: AuthRequest, h: ResponseToolkit) => {
  const user = request.auth.credentials;

  if (!user) {
    throw new Error('Authentication required');
  }

  request.user = user as {
    userId: string;
    email: string;
    role: string;
  };
  return h.continue;
};

export default {
  JWT_CONFIG,
  configureAuth,
  authMiddleware
};