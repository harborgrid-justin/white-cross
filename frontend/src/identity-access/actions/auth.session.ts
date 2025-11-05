/**
 * @fileoverview Session Management Operations
 * @module lib/actions/auth.session
 *
 * Server actions for session verification, token refresh, and logout operations.
 *
 * Features:
 * - Session verification and validation
 * - Token rotation on refresh
 * - Logout with cookie cleanup
 * - HIPAA audit logging for session events
 * - Secure cookie management
 */

'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// API integration
import { serverPost } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS, extractIPAddress, extractUserAgent } from '@/lib/audit';

// Security helpers
import { clearCsrfToken } from '../lib/helpers/csrf';
import { actionSuccess, actionError } from '../lib/helpers/action-result';

// Types
import type { ApiResponse } from '@/types';
import type { User } from './auth.types';
import type { ServerActionResult } from '../lib/types/action-result';
import { AUTH_CACHE_TAGS } from './auth.constants';

// ==========================================
// SESSION MANAGEMENT ACTIONS
// ==========================================

/**
 * Logout action with comprehensive cleanup
 *
 * Features:
 * - Clears authentication cookies
 * - Clears CSRF tokens
 * - Audit logging
 * - Path revalidation
 * - Redirects to login
 */
export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Audit logout event
    if (token) {
      const headersList = await headers();
      const mockRequest = {
        headers: {
          get: (name: string) => headersList.get(name)
        }
      } as Request;

      await auditLog({
        action: AUDIT_ACTIONS.LOGOUT,
        resource: 'Authentication',
        details: 'User logged out',
        ipAddress: extractIPAddress(mockRequest),
        userAgent: extractUserAgent(mockRequest),
        success: true
      });
    }

    // Clear authentication cookies
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');

    // Clear CSRF token
    await clearCsrfToken();

    // Revalidate affected paths
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('[Logout Action] Error:', error);
  }

  // Always redirect to login
  redirect('/login');
}

/**
 * Verify current session
 *
 * @returns Session validity and user information
 */
export async function verifySessionAction(): Promise<ServerActionResult<{ valid: boolean; user?: User }>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return actionSuccess({ valid: false });
    }

    const response = await serverPost<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.VERIFY,
      {},
      {
        cache: 'no-store',
        next: { tags: [AUTH_CACHE_TAGS.AUTH] },
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.success || !response.data) {
      return actionSuccess({ valid: false });
    }

    return actionSuccess({ valid: true, user: response.data });
  } catch (error) {
    console.error('[Verify Session Action] Error:', error);
    return actionSuccess({ valid: false });
  }
}

/**
 * Refresh authentication token with rotation
 *
 * Security features:
 * - Token rotation (issues new refresh token)
 * - Invalidates old refresh token
 * - Audit logging
 * - Path revalidation
 *
 * @returns New authentication tokens or error
 */
export async function refreshTokenAction(): Promise<ServerActionResult<{
  accessToken: string;
  refreshToken: string;
}>> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return actionError(['No refresh token available. Please log in again.']);
    }

    // Extract IP for audit logging
    const headersList = await headers();
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as Request;
    const ipAddress = extractIPAddress(mockRequest);
    const userAgent = extractUserAgent(mockRequest);

    // Call backend to refresh token
    const response = await serverPost<ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      {
        cache: 'no-store',
        requiresAuth: false,
        next: { tags: [AUTH_CACHE_TAGS.AUTH] }
      }
    );

    if (!response.success || !response.data) {
      // Audit failed refresh
      await auditLog({
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'Authentication',
        details: 'Token refresh failed',
        ipAddress,
        userAgent,
        success: false,
        errorMessage: response.message || 'Invalid refresh token'
      });

      // Clear invalid tokens
      cookieStore.delete('auth_token');
      cookieStore.delete('refresh_token');

      return actionError(['Session expired. Please log in again.']);
    }

    // Token rotation: Set new tokens (old refresh token is now invalid)
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    cookieStore.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Audit successful token rotation
    await auditLog({
      action: AUDIT_ACTIONS.LOGIN,
      resource: 'Authentication',
      details: 'Token refreshed successfully (token rotation)',
      ipAddress,
      userAgent,
      success: true
    });

    // Revalidate affected paths
    revalidatePath('/', 'layout');

    return actionSuccess(
      { accessToken, refreshToken: newRefreshToken },
      'Session refreshed successfully'
    );
  } catch (error) {
    console.error('[Refresh Token Action] Error:', error);

    // Audit error
    const headersList = await headers();
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as Request;

    await auditLog({
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      resource: 'Authentication',
      details: 'Token refresh error',
      ipAddress: extractIPAddress(mockRequest),
      userAgent: extractUserAgent(mockRequest),
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return actionError(['An error occurred while refreshing your session. Please log in again.']);
  }
}
