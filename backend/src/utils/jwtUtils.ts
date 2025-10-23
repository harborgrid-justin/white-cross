/**
 * @fileoverview JWT Token Management Utilities
 * @module utils/jwtUtils
 * @description Secure JWT token generation and validation with expiration,
 * refresh tokens, and token blacklisting capabilities.
 *
 * SECURITY: Token expiration enforcement
 * SECURITY: Refresh token mechanism
 * SECURITY: Token blacklisting for revocation
 * HIPAA: Session timeout requirements
 *
 * @security JWT token management
 * @security Session timeout enforcement
 */

import jwt from 'jsonwebtoken';
import { logger } from './logger';
import { AuthenticationError } from '../errors/ServiceError';

/**
 * JWT configuration
 */
export const JWT_CONFIG = {
  // Access token - short-lived for API requests
  ACCESS_TOKEN_EXPIRY: '15m', // 15 minutes
  ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || '',

  // Refresh token - longer-lived for obtaining new access tokens
  REFRESH_TOKEN_EXPIRY: '7d', // 7 days
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || '',

  // Token issuer and audience
  ISSUER: 'white-cross-healthcare',
  AUDIENCE: 'white-cross-api'
};

/**
 * Token payload interface
 */
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  type?: 'access' | 'refresh';
}

/**
 * Token blacklist - stores revoked tokens
 * TODO: In production, use Redis for distributed blacklist
 */
const tokenBlacklist = new Set<string>();

/**
 * Generate access token
 *
 * SECURITY: Short-lived token (15 minutes) for API authentication
 * Includes user ID, email, and role in payload
 *
 * @param payload - User data to include in token
 * @returns JWT access token
 *
 * @example
 * const token = generateAccessToken({
 *   id: user.id,
 *   email: user.email,
 *   role: user.role
 * });
 */
export function generateAccessToken(payload: TokenPayload): string {
  if (!JWT_CONFIG.ACCESS_TOKEN_SECRET) {
    throw new Error('JWT_SECRET environment variable not set');
  }

  const token = jwt.sign(
    {
      ...payload,
      type: 'access'
    },
    JWT_CONFIG.ACCESS_TOKEN_SECRET,
    {
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
      jwtid: generateTokenId() // Unique ID for blacklisting
    }
  );

  logger.debug('Access token generated', {
    userId: payload.id,
    email: payload.email,
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY
  });

  return token;
}

/**
 * Generate refresh token
 *
 * SECURITY: Longer-lived token (7 days) for obtaining new access tokens
 * Contains minimal payload (just user ID)
 *
 * @param userId - User ID to include in token
 * @returns JWT refresh token
 *
 * @example
 * const refreshToken = generateRefreshToken(user.id);
 */
export function generateRefreshToken(userId: string): string {
  if (!JWT_CONFIG.REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_REFRESH_SECRET environment variable not set');
  }

  const token = jwt.sign(
    {
      id: userId,
      type: 'refresh'
    },
    JWT_CONFIG.REFRESH_TOKEN_SECRET,
    {
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      jwtid: generateTokenId() // Unique ID for blacklisting
    }
  );

  logger.debug('Refresh token generated', {
    userId,
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY
  });

  return token;
}

/**
 * Verify and decode access token
 *
 * SECURITY: Validates token signature, expiration, and blacklist status
 *
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws AuthenticationError if token is invalid
 *
 * @example
 * try {
 *   const payload = verifyAccessToken(token);
 *   console.log(payload.id, payload.email);
 * } catch (error) {
 *   // Token invalid or expired
 * }
 */
export function verifyAccessToken(token: string): TokenPayload & { jti?: string; iat?: number } {
  if (!JWT_CONFIG.ACCESS_TOKEN_SECRET) {
    throw new Error('JWT_SECRET environment variable not set');
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }) as TokenPayload & { jti?: string; iat?: number };

    // Check if token is blacklisted
    if (decoded.jti && tokenBlacklist.has(decoded.jti)) {
      throw new AuthenticationError('Token has been revoked');
    }

    // Verify token type
    if (decoded.type !== 'access') {
      throw new AuthenticationError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    }

    throw error;
  }
}

/**
 * Verify and decode refresh token
 *
 * @param token - Refresh token to verify
 * @returns Decoded token payload
 * @throws AuthenticationError if token is invalid
 */
export function verifyRefreshToken(token: string): { id: string; jti?: string; iat?: number } {
  if (!JWT_CONFIG.REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_REFRESH_SECRET environment variable not set');
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.REFRESH_TOKEN_SECRET, {
      issuer: JWT_CONFIG.ISSUER
    }) as { id: string; type: string; jti?: string; iat?: number };

    // Check if token is blacklisted
    if (decoded.jti && tokenBlacklist.has(decoded.jti)) {
      throw new AuthenticationError('Refresh token has been revoked');
    }

    // Verify token type
    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Refresh token has expired');
    }

    throw error;
  }
}

/**
 * Revoke token by adding to blacklist
 *
 * SECURITY: Prevents use of compromised or logged-out tokens
 *
 * @param token - Token to revoke
 *
 * @example
 * // On logout
 * revokeToken(accessToken);
 * revokeToken(refreshToken);
 */
export function revokeToken(token: string): void {
  try {
    // Decode without verifying to get JTI
    const decoded = jwt.decode(token) as { jti?: string };

    if (decoded && decoded.jti) {
      tokenBlacklist.add(decoded.jti);

      logger.info('Token revoked', {
        jti: decoded.jti
      });

      // TODO: In production, persist to Redis with TTL matching token expiry
    }
  } catch (error) {
    logger.error('Failed to revoke token', { error });
  }
}

/**
 * Check if token is blacklisted
 *
 * @param jti - JWT ID to check
 * @returns True if token is blacklisted
 */
export function isTokenBlacklisted(jti: string): boolean {
  return tokenBlacklist.has(jti);
}

/**
 * Clear expired tokens from blacklist
 * Should be called periodically to prevent memory leaks
 *
 * TODO: Not needed if using Redis with TTL
 */
export function clearExpiredTokens(): void {
  // In production with Redis, this is handled automatically by TTL
  // In-memory implementation would need to track expiry times

  logger.info('Token blacklist cleanup called', {
    blacklistedCount: tokenBlacklist.size,
    note: 'Implement with Redis TTL in production'
  });
}

/**
 * Generate unique token ID for blacklisting
 */
function generateTokenId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Validate tokens after password change
 *
 * SECURITY: Invalidates all existing tokens when password changes
 * Compare token issued time with password changed time
 *
 * @param tokenIssuedAt - Token issued timestamp (iat claim)
 * @param passwordChangedAt - User's password change timestamp
 * @returns True if token is still valid
 */
export function isTokenValidAfterPasswordChange(
  tokenIssuedAt: number,
  passwordChangedAt: Date | null
): boolean {
  if (!passwordChangedAt) {
    return true; // Password never changed
  }

  const passwordChangedTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);

  // Token must be issued after password change
  return tokenIssuedAt > passwordChangedTimestamp;
}
