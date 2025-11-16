/**
 * Secure Login Action - Example with Secure Logging
 *
 * This file demonstrates how to replace console.log with secure logging
 * that automatically redacts PHI and tokens.
 *
 * REPLACES: auth.login.ts with PHI-safe logging
 *
 * @module identity-access/actions/auth.login.secure
 * @since 2025-11-05
 */

'use server';

import { serverPost, getApiBaseUrl } from '@/lib/api/server';
import { redirect } from 'next/navigation';
import { createSecureLogger, auditLogger } from '@/lib/logger/secure-logger';

const logger = createSecureLogger('LoginAction');

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Login action with secure logging
 */
export async function loginAction(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    // ✅ SECURE: Credentials are automatically redacted by logger
    logger.info('Login attempt', { email: credentials.email });

    // Call authentication API
    const data = await serverPost(
      '/api/v1/auth/login',
      credentials,
      {
        cache: 'no-store',
        requiresAuth: false
      }
    );

    // ✅ SECURE: Token is automatically redacted by logger
    logger.info('Login successful', {
      userId: data.user.id,
      token: data.accessToken, // Automatically redacted!
    });

    // Set httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set('auth_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ SECURE: No token data logged
    logger.info('Auth cookies set successfully');

    // Audit log for HIPAA compliance
    auditLogger.authEvent({
      action: 'login',
      userId: data.user.id,
      success: true,
      timestamp: new Date().toISOString(),
      // IP and user agent should come from request headers in real implementation
    });

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    logger.error('Login action failed', error);

    auditLogger.securityEvent({
      event: 'login_exception',
      severity: 'medium',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
}

/**
 * COMPARISON:
 *
 * ❌ INSECURE (OLD):
 * ```typescript
 * console.log('[Login Action] Setting auth token:', {
 *   tokenLength: token?.length,
 *   tokenStart: token?.substring(0, 20),  // LOGS TOKEN!
 *   cookieName: COOKIE_NAMES.ACCESS_TOKEN
 * });
 * ```
 *
 * ✅ SECURE (NEW):
 * ```typescript
 * logger.info('Auth token set', {
 *   token: token  // Automatically redacted!
 * });
 * // Logs: { token: '[REDACTED 245 chars]' }
 * ```
 */
