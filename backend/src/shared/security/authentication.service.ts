/**
 * LOC: AUTH_SERVICE_CONSOLIDATED
 * WC-SEC-AUTH-001 | Enterprise Authentication Service
 *
 * UPSTREAM (imports from):
 *   - jsonwebtoken library
 *   - bcrypt library
 *   - shared utilities
 *
 * DOWNSTREAM (imported by):
 *   - middleware/authentication/*
 *   - services/auth/*
 *   - routes/auth/*
 */

/**
 * WC-SEC-AUTH-001 | Enterprise Authentication Service
 * Purpose: Centralized authentication logic, JWT management, password validation
 * Upstream: JWT library, bcrypt, database models | Dependencies: Framework-agnostic
 * Downstream: Authentication middleware, auth routes | Called by: Framework adapters
 * Related: middleware/authentication/*, security/*, utilities/password.utils.ts
 * Exports: AuthenticationService class, JWT utilities | Key Services: Token management, user validation
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic
 * Critical Path: Authentication request → Token validation → User lookup → Permission check
 * LLM Context: Healthcare platform authentication, HIPAA compliance, enterprise security
 */

import * as jsonwebtoken from 'jsonwebtoken';
import { logger } from '../logging/logger';

/**
 * User profile interface for authentication
 */
export interface UserProfile {
  userId: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions?: string[];
  facilityId?: string;
  lastLoginAt?: Date;
}

/**
 * JWT token payload interface
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}

/**
 * Authentication configuration interface
 */
export interface AuthenticationConfig {
  jwtSecret: string;
  jwtAudience?: string;
  jwtIssuer?: string;
  maxAgeSec: number;
  timeSkewSec?: number;
  userLoader: (userId: string) => Promise<UserProfile | null>;
}

/**
 * Authentication result interface
 */
export interface AuthenticationResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
  token?: string;
}

/**
 * Enterprise Authentication Service
 * 
 * Provides centralized authentication logic that can be used across
 * different frameworks and middleware implementations.
 */
export class AuthenticationService {
  private config: AuthenticationConfig;

  constructor(config: AuthenticationConfig) {
    this.config = config;
  }

  /**
   * Extract token from authorization header
   */
  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    // Support both "Bearer token" and "token" formats
    const match = authHeader.match(/^(?:Bearer\s+)?(.+)$/i);
    return match ? match[1].trim() : null;
  }

  /**
   * Generate JWT token for user
   */
  async generateToken(user: UserProfile): Promise<string> {
    try {
      const payload: TokenPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const options: jsonwebtoken.SignOptions = {
        expiresIn: this.config.maxAgeSec,
        audience: this.config.jwtAudience,
        issuer: this.config.jwtIssuer
      };

      return jsonwebtoken.sign(payload, this.config.jwtSecret, options);
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  /**
   * Verify and decode JWT token
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const options: jsonwebtoken.VerifyOptions = {
        audience: this.config.jwtAudience,
        issuer: this.config.jwtIssuer,
        clockTolerance: this.config.timeSkewSec || 30
      };

      const decoded = jsonwebtoken.verify(token, this.config.jwtSecret, options) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        throw new Error('Authentication token has expired');
      } else if (error instanceof jsonwebtoken.JsonWebTokenError) {
        throw new Error('Invalid authentication token');
      } else {
        logger.error('JWT verification error:', error);
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Validate user and token claims
   */
  async validateUser(decoded: TokenPayload): Promise<UserProfile> {
    try {
      // Load user from database
      const user = await this.config.userLoader(decoded.userId);
      
      if (!user) {
        logger.warn('JWT validation failed: User not found', {
          userId: decoded.userId,
          email: decoded.email
        });
        throw new Error('User not found');
      }

      if (!user.isActive) {
        logger.warn('JWT validation failed: User inactive', {
          userId: decoded.userId,
          email: decoded.email
        });
        throw new Error('User account is inactive');
      }

      // Validate token claims against current user data
      if (decoded.email !== user.email || decoded.role !== user.role) {
        logger.warn('JWT validation failed: Token claims mismatch', {
          userId: decoded.userId,
          tokenEmail: decoded.email,
          userEmail: user.email,
          tokenRole: decoded.role,
          userRole: user.role
        });
        throw new Error('Token claims do not match user data');
      }

      logger.debug('JWT validation successful', {
        userId: user.userId,
        email: user.email,
        role: user.role
      });

      return user;
    } catch (error) {
      logger.error('User validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: decoded.userId
      });
      throw error;
    }
  }

  /**
   * Authenticate request using authorization header
   */
  async authenticate(authHeader: string | undefined): Promise<AuthenticationResult> {
    try {
      // Extract token
      const token = this.extractToken(authHeader);
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token provided'
        };
      }

      // Verify token
      const decoded = await this.verifyToken(token);

      // Validate user
      const user = await this.validateUser(decoded);

      return {
        success: true,
        user,
        token
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  /**
   * Refresh JWT token for user
   */
  async refreshToken(user: UserProfile): Promise<string> {
    try {
      return await this.generateToken(user);
    } catch (error) {
      logger.error('Error refreshing JWT token:', error);
      throw new Error('Failed to refresh authentication token');
    }
  }
}

/**
 * Factory function for creating authentication service
 */
export function createAuthenticationService(config: AuthenticationConfig): AuthenticationService {
  return new AuthenticationService(config);
}

/**
 * Default export for convenience
 */
export default {
  AuthenticationService,
  createAuthenticationService
};
