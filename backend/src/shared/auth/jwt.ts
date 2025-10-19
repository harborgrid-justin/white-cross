/**
 * LOC: B19899FD1D
 * WC-GEN-299 | jwt.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-299 | jwt.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logging/logger | Dependencies: @hapi/hapi, @hapi/jwt, ../logging/logger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, constants, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * JWT Authentication Utilities
 * Shared JWT configuration and authentication logic
 */

import { Server, Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';
import * as jwt from '@hapi/jwt';
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
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

/**
 * JWT Token Generation and Verification Utilities
 */

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  aud?: string;
  iss?: string;
}

export interface TokenOptions {
  expiresIn?: string;
  audience?: string;
  issuer?: string;
}

/**
 * Generate a JWT token
 * @param payload - Token payload
 * @param options - Token options
 * @returns Generated JWT token
 */
export const generateToken = (
  payload: TokenPayload,
  options: TokenOptions = {}
): string => {
  try {
    const secret = process.env.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET;
    
    const tokenPayload = {
      ...payload,
      aud: options.audience || JWT_CONFIG.AUDIENCE,
      iss: options.issuer || JWT_CONFIG.ISSUER
    };

    const tokenOptions: SignOptions = {};
    
    if (options.expiresIn) {
      // Convert string formats like '24h', '1d' etc to seconds
      const expiresIn = options.expiresIn;
      if (expiresIn.endsWith('h')) {
        tokenOptions.expiresIn = parseInt(expiresIn) * 60 * 60;
      } else if (expiresIn.endsWith('d')) {
        tokenOptions.expiresIn = parseInt(expiresIn) * 24 * 60 * 60;
      } else if (expiresIn.endsWith('m')) {
        tokenOptions.expiresIn = parseInt(expiresIn) * 60;
      } else {
        // Assume it's already in seconds if no suffix
        tokenOptions.expiresIn = parseInt(expiresIn) || 24 * 60 * 60;
      }
    } else {
      tokenOptions.expiresIn = 24 * 60 * 60; // 24 hours in seconds
    }

    const token = jsonwebtoken.sign(tokenPayload, secret, tokenOptions);
    return token;
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): TokenPayload & jsonwebtoken.JwtPayload => {
  try {
    const secret = process.env.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET;
    
    const decoded = jsonwebtoken.verify(token, secret) as TokenPayload & jsonwebtoken.JwtPayload;
    return decoded;
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      throw new Error('Authentication token has expired');
    } else if (error instanceof jsonwebtoken.JsonWebTokenError) {
      throw new Error('Invalid authentication token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode a JWT token without verification (useful for expired tokens)
 * @param token - JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): (TokenPayload & jsonwebtoken.JwtPayload) | null => {
  try {
    const decoded = jsonwebtoken.decode(token) as TokenPayload & jsonwebtoken.JwtPayload;
    return decoded;
  } catch (error) {
    logger.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Refresh a JWT token (even if expired)
 * @param token - Existing JWT token
 * @param newOptions - Options for the new token
 * @returns New JWT token
 */
export const refreshToken = (
  token: string,
  newOptions: TokenOptions = {}
): string => {
  try {
    // First try to verify the token
    let decoded: TokenPayload & jsonwebtoken.JwtPayload;
    
    try {
      decoded = verifyToken(token);
    } catch (error) {
      // If verification fails due to expiration, decode without verification
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        throw new Error('Invalid token format');
      }
      decoded = decodedToken;
    }

    // Generate new token with the same payload but updated expiration
    const newPayload: TokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    return generateToken(newPayload, newOptions);
  } catch (error) {
    logger.error('Error refreshing JWT token:', error);
    throw new Error('Failed to refresh authentication token');
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Extracted token or null
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Check if a token is expired
 * @param token - JWT token to check
 * @returns Boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export default {
  JWT_CONFIG,
  configureAuth,
  authMiddleware,
  generateToken,
  verifyToken,
  decodeToken,
  refreshToken,
  extractTokenFromHeader,
  isTokenExpired
};
