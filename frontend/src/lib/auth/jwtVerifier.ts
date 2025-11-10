/**
 * JWT Verification Utilities
 *
 * Provides JWT token verification and validation for authentication middleware.
 * Supports role-based access control and token extraction from headers.
 *
 * @module lib/auth/jwtVerifier
 */

import { NextRequest } from 'next/server';

/**
 * JWT Payload structure
 */
export interface JWTPayload {
  userId: string;
  role: string;
  email: string;
  exp: number;
  iat: number;
  permissions?: string[];
}

/**
 * JWT Verification result
 */
export interface JWTVerificationResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

/**
 * Role hierarchy for permission checking
 */
const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  SCHOOL_ADMIN: 60,
  NURSE: 40,
  DOCTOR: 35,
  STAFF: 20,
  GUARDIAN: 10,
  STUDENT: 5,
};

/**
 * Extract JWT token from request headers
 *
 * Supports:
 * - Authorization: Bearer <token>
 * - Cookie: token=<token>
 *
 * @param request - Next.js request object
 * @returns Token string or null if not found
 */
export function extractToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Verify JWT token
 *
 * In production, this should use a proper JWT library like jsonwebtoken
 * and verify against your secret key.
 *
 * @param token - JWT token string
 * @returns Verification result with payload or error
 */
export async function verifyToken(token: string): Promise<JWTVerificationResult> {
  try {
    // In a real implementation, use jsonwebtoken or jose library
    // For now, this is a placeholder that should be replaced with actual verification

    if (!token || token.length === 0) {
      return {
        valid: false,
        error: 'Token is empty',
      };
    }

    // Basic structure check
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        valid: false,
        error: 'Invalid token format',
      };
    }

    // Decode payload (in production, verify signature first!)
    try {
      const payloadBase64 = parts[1];
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload: JWTPayload = JSON.parse(payloadJson);

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return {
          valid: false,
          error: 'Token expired',
        };
      }

      return {
        valid: true,
        payload,
      };
    } catch (decodeError) {
      return {
        valid: false,
        error: 'Failed to decode token',
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Token verification failed',
    };
  }
}

/**
 * Check if user role has permission for minimum required role
 *
 * Uses role hierarchy to determine if user's role meets or exceeds the minimum.
 *
 * @param userRole - User's current role
 * @param minimumRole - Minimum required role
 * @returns True if user has sufficient permissions
 */
export function hasRolePermission(userRole: string, minimumRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Check if user has any of the specified roles
 *
 * @param userRole - User's current role
 * @param allowedRoles - Array of allowed roles
 * @returns True if user has one of the allowed roles
 */
export function hasAnyRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Validate token and extract user information
 *
 * Convenience function that combines token extraction and verification.
 *
 * @param request - Next.js request object
 * @returns Verification result or null if no token found
 */
export async function validateRequest(request: NextRequest): Promise<JWTVerificationResult | null> {
  const token = extractToken(request);

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

/**
 * Get role level from hierarchy
 *
 * @param role - Role name
 * @returns Numeric level or 0 if not found
 */
export function getRoleLevel(role: string): number {
  return ROLE_HIERARCHY[role] || 0;
}
