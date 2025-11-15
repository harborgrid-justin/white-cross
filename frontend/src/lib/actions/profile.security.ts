/**
 * @fileoverview Profile Security Operations
 * @module lib/actions/profile.security
 *
 * Security-related server actions for user profiles including password management,
 * two-factor authentication, and session management.
 *
 * Features:
 * - HIPAA-compliant audit logging
 * - Next.js cache invalidation
 * - Type-safe server actions
 * - Comprehensive validation and error handling
 * - Security event tracking
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, serverDelete, NextApiClientError } from '@/lib/api/server';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types/core/api/responses';
import type {
  ActionResult,
  ChangePasswordData
} from './profile.types';

// ==========================================
// PASSWORD MANAGEMENT
// ==========================================

/**
 * Change password
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID to change password for
 * @param data - Password change data (current, new, confirm)
 * @returns Action result with success status or error
 */
export async function changePasswordAction(
  userId: string,
  data: ChangePasswordData
): Promise<ActionResult<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    // Validate password strength
    if (data.newPassword.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    const response = await serverPost<ApiResponse<void>>(
      `/api/users/${userId}/change-password`,
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      },
      {
        cache: 'no-store',
        next: { tags: ['profile-security'] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }

    // AUDIT LOG - Password change
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserSecurity',
      resourceId: userId,
      details: 'Changed user password',
      success: true
    });

    // Cache invalidation for security logs
    revalidateTag('profile-security', 'default');
    revalidateTag(`security-logs-${userId}`, 'default');
    revalidatePath('/profile/security', 'page');

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to change password';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserSecurity',
      resourceId: userId,
      details: `Failed to change password: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// TWO-FACTOR AUTHENTICATION
// ==========================================

/**
 * Enable two-factor authentication
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID to enable 2FA for
 * @returns Action result with QR code and backup codes or error
 */
export async function enableTwoFactorAction(
  userId: string
): Promise<ActionResult<{ qrCode: string; backupCodes: string[] }>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPost<ApiResponse<{ qrCode: string; backupCodes: string[] }>>(
      `/api/users/${userId}/2fa/enable`,
      {},
      {
        cache: 'no-store',
        next: { tags: ['profile-security', `profile-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to enable two-factor authentication');
    }

    // AUDIT LOG - 2FA enabled
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserSecurity',
      resourceId: userId,
      details: 'Enabled two-factor authentication',
      success: true
    });

    // Cache invalidation
    revalidateTag('profiles', 'default');
    revalidateTag('profile-security', 'default');
    revalidateTag(`profile-${userId}`, 'default');
    revalidateTag(`security-logs-${userId}`, 'default');
    revalidatePath('/profile/security', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Two-factor authentication enabled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to enable two-factor authentication';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserSecurity',
      resourceId: userId,
      details: `Failed to enable two-factor authentication: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Disable two-factor authentication
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID to disable 2FA for
 * @returns Action result with success status or error
 */
export async function disableTwoFactorAction(userId: string): Promise<ActionResult<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPost<ApiResponse<void>>(
      `/api/users/${userId}/2fa/disable`,
      {},
      {
        cache: 'no-store',
        next: { tags: ['profile-security', `profile-${userId}`] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to disable two-factor authentication');
    }

    // AUDIT LOG - 2FA disabled
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserSecurity',
      resourceId: userId,
      details: 'Disabled two-factor authentication',
      success: true
    });

    // Cache invalidation
    revalidateTag('profiles', 'default');
    revalidateTag('profile-security', 'default');
    revalidateTag(`profile-${userId}`, 'default');
    revalidateTag(`security-logs-${userId}`, 'default');
    revalidatePath('/profile/security', 'page');

    return {
      success: true,
      message: 'Two-factor authentication disabled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to disable two-factor authentication';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserSecurity',
      resourceId: userId,
      details: `Failed to disable two-factor authentication: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// SESSION MANAGEMENT
// ==========================================

/**
 * Revoke session
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID whose session to revoke
 * @param sessionId - The session ID to revoke
 * @returns Action result with success status or error
 */
export async function revokeSessionAction(
  userId: string,
  sessionId: string
): Promise<ActionResult<void>> {
  try {
    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'User ID and session ID are required'
      };
    }

    const response = await serverDelete<ApiResponse<void>>(
      `/api/users/${userId}/sessions/${sessionId}`,
      {
        cache: 'no-store',
        next: { tags: ['profile-sessions', `sessions-${userId}`] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to revoke session');
    }

    // AUDIT LOG - Session revoked
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'UserSession',
      resourceId: sessionId,
      details: `Revoked user session`,
      success: true
    });

    // Cache invalidation
    revalidateTag('profile-sessions', 'default');
    revalidateTag('profile-security', 'default');
    revalidateTag(`sessions-${userId}`, 'default');
    revalidateTag(`security-logs-${userId}`, 'default');
    revalidatePath('/profile/security', 'page');

    return {
      success: true,
      message: 'Session revoked successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to revoke session';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'UserSession',
      resourceId: sessionId,
      details: `Failed to revoke session: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
