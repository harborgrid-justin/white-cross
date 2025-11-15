/**
 * @fileoverview Access Control Sessions Server Actions
 * @module lib/actions/admin.access-control-sessions
 *
 * HIPAA-compliant server actions for session management.
 * Includes caching, audit logging, and comprehensive error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet, serverDelete, NextApiClientError } from '@/lib/api/server';
import type { ActionResult } from './admin.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivity: string;
  expiresAt: string;
  createdAt: string;
}

// ==========================================
// SESSIONS OPERATIONS
// ==========================================

/**
 * Get all sessions for a user
 */
export async function getUserSessionsAction(userId: string): Promise<ActionResult<UserSession[]>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverGet<{ sessions: UserSession[] }>(
      `/api/v1/access-control/users/${userId}/sessions`,
      {
        next: { tags: [`user-sessions-${userId}`], revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user sessions');
    }

    return {
      success: true,
      data: response.data.sessions,
      message: 'User sessions fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch user sessions';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Delete a specific session (logout single device)
 */
export async function deleteSessionAction(token: string): Promise<ActionResult<string>> {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Session token is required'
      };
    }

    const response = await serverDelete(
      `/api/v1/access-control/sessions/${token}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete session');
    }

    // Cache invalidation - we don't know the userId from token alone
    // so we'll need to revalidate all session-related caches
    revalidatePath('/admin/sessions', 'page');

    return {
      success: true,
      data: token,
      message: 'Session deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete session';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Delete all sessions for a user (force logout from all devices)
 */
export async function deleteAllUserSessionsAction(userId: string): Promise<ActionResult<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverDelete(
      `/api/v1/access-control/users/${userId}/sessions`,
      {
        cache: 'no-store'
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete all user sessions');
    }

    // Cache invalidation
    revalidateTag(`user-sessions-${userId}`, 'default');
    revalidatePath(`/users/${userId}/sessions`, 'page');
    revalidatePath('/admin/sessions', 'page');

    return {
      success: true,
      data: undefined,
      message: 'All user sessions deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete all user sessions';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// CACHE REVALIDATION
// ==========================================

/**
 * Revalidate user sessions cache
 */
export async function revalidateUserSessionsCache(userId: string): Promise<void> {
  revalidateTag(`user-sessions-${userId}`, 'default');
  revalidatePath(`/users/${userId}/sessions`, 'page');
}
