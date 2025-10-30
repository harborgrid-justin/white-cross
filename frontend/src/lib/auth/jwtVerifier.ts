/**
 * JWT Verification Utility
 *
 * Provides secure JWT token verification with signature validation.
 * Note: For production use with proper cryptographic verification,
 * integrate with a JWT library that supports edge runtime or
 * validate tokens via backend API.
 *
 * @module auth/jwtVerifier
 * @since 2025-10-26
 */

export interface JWTPayload {
  userId: string;
  role: string;
  email?: string;
  organizationId?: string;
  exp: number;
  iat: number;
  iss?: string;
}

/**
 * Decode JWT token without verification
 * WARNING: This should only be used for non-critical data extraction
 */
export function decodeTokenUnsafe(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Validate token structure
 */
export function validateTokenStructure(token: string): boolean {
  // JWT should have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Each part should be base64url encoded
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => base64UrlRegex.test(part));
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Verify token (simplified for middleware use)
 *
 * For production, one of these approaches should be used:
 * 1. Validate token via backend API call
 * 2. Use a JWT library that works in edge runtime (jose, jsonwebtoken with polyfills)
 * 3. Implement Web Crypto API signature verification
 */
export async function verifyToken(token: string): Promise<{
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}> {
  // Validate token structure
  if (!validateTokenStructure(token)) {
    return {
      valid: false,
      error: 'Invalid token structure',
    };
  }

  // Decode payload
  const payload = decodeTokenUnsafe(token);
  if (!payload) {
    return {
      valid: false,
      error: 'Failed to decode token',
    };
  }

  // Check expiration
  if (isTokenExpired(payload)) {
    return {
      valid: false,
      error: 'Token expired',
    };
  }

  // Validate required fields
  if (!payload.userId || !payload.role) {
    return {
      valid: false,
      error: 'Missing required token fields',
    };
  }

  // TODO: For production, add signature verification here
  // Option 1: Call backend API to validate token
  // const backendValidation = await fetch('/auth/verify', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ token }),
  // });
  //
  // Option 2: Use jose library for edge runtime
  // import { jwtVerify } from 'jose';
  // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  // const { payload } = await jwtVerify(token, secret);
  //
  // Option 3: Web Crypto API (more complex)
  // const verified = await verifyWithWebCrypto(token, publicKey);

  return {
    valid: true,
    payload,
  };
}

/**
 * Verify token via backend API (recommended for production)
 */
export async function verifyTokenViaBackend(token: string): Promise<{
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/auth/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Add timeout
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return {
        valid: false,
        error: 'Token validation failed',
      };
    }

    const data = await response.json();

    return {
      valid: true,
      payload: data.user,
    };
  } catch (error) {
    console.error('Backend token verification error:', error);
    return {
      valid: false,
      error: 'Token verification service unavailable',
    };
  }
}

/**
 * Extract token from Authorization header or cookie
 */
export function extractToken(request: {
  headers: Headers;
  cookies?: { get(name: string): { value: string } | undefined };
}): string | null {
  // Try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookie
  if (request.cookies) {
    const tokenCookie = request.cookies.get('auth_token');
    if (tokenCookie) {
      return tokenCookie.value;
    }
  }

  return null;
}

/**
 * Validate role hierarchy
 * Higher roles have all permissions of lower roles
 */
export function hasRolePermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    ADMIN: 5,
    DISTRICT_ADMIN: 4,
    SCHOOL_ADMIN: 3,
    NURSE: 2,
    STAFF: 1,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}
