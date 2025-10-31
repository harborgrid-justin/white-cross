/**
 * Authentication utilities for Next.js API routes
 * Provides JWT validation, token verification, and user authentication
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || '';

/**
 * Token payload interface
 */
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Authenticated user interface
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Extract token from request headers
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return null;
  }

  // Support both "Bearer <token>" and "<token>" formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Verify JWT access token
 * @throws Error if token is invalid or expired
 */
export function verifyAccessToken(token: string): TokenPayload {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'white-cross-healthcare',
      audience: 'white-cross-api'
    }) as TokenPayload;

    // Verify token type
    if (decoded.type && decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    throw error;
  }
}

/**
 * Verify JWT refresh token
 * @throws Error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): TokenPayload {
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'white-cross-healthcare'
    }) as TokenPayload;

    // Verify token type
    if (decoded.type && decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    throw error;
  }
}

/**
 * Authenticate request and extract user from token
 * Returns null if authentication fails
 */
export function authenticateRequest(request?: NextRequest): AuthenticatedUser | null {
  if (!request) {
    // Server component context - create mock authenticated user
    // In production, this should use next-auth or similar
    return null;
  }

  try {
    const token = extractToken(request);

    if (!token) {
      return null;
    }

    const payload = verifyAccessToken(token);

    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };

    return {
      ...user,
      user // Also expose as nested .user for compatibility
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser, requiredRole: string | string[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

/**
 * Role hierarchy for permission checking
 */
const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  SCHOOL_ADMIN: 80,
  NURSE: 70,
  COUNSELOR: 60,
  VIEWER: 50,
  PARENT: 40,
  STUDENT: 30
};

/**
 * Check if user has minimum role level
 */
export function hasMinimumRole(user: AuthenticatedUser, minimumRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Auth function - alias for authenticateRequest for backward compatibility
 */
export const auth = authenticateRequest;
