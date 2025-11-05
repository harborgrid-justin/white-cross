/**
 * Server-Only Authentication Utilities
 *
 * CRITICAL: This file MUST only be imported by server-side code.
 * JWT secrets are NEVER exposed to the client.
 *
 * @module identity-access/lib/server/auth
 * @since 2025-11-05
 */

import 'server-only'; // Prevents client-side import

import jwt from 'jsonwebtoken';

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

/**
 * Get JWT secret (server-side only)
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
        'This is required for authentication. Set it in your .env file.'
    );
  }

  return secret;
}

/**
 * Get JWT refresh secret (server-side only)
 */
function getJwtRefreshSecret(): string {
  return process.env.JWT_REFRESH_SECRET || getJwtSecret();
}

/**
 * Verify access token (server-side only)
 *
 * @param token - JWT access token from cookie
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  try {
    const secret = getJwtSecret();

    const decoded = jwt.verify(token, secret, {
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api',
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Verify refresh token (server-side only)
 *
 * @param token - JWT refresh token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  try {
    const secret = getJwtRefreshSecret();

    const decoded = jwt.verify(token, secret, {
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api',
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
}

/**
 * Generate access token (server-side only)
 *
 * @param payload - User data to encode in token
 * @returns Signed JWT access token
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string {
  const secret = getJwtSecret();

  return jwt.sign(payload, secret, {
    expiresIn: '15m', // Short-lived access token
    issuer: 'white-cross-healthcare',
    audience: 'white-cross-api',
  });
}

/**
 * Generate refresh token (server-side only)
 *
 * @param payload - User data to encode in token
 * @returns Signed JWT refresh token
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string {
  const secret = getJwtRefreshSecret();

  return jwt.sign(payload, secret, {
    expiresIn: '7d', // Long-lived refresh token
    issuer: 'white-cross-healthcare',
    audience: 'white-cross-api',
  });
}

/**
 * Decode token without verification (for debugging only - server-side)
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
