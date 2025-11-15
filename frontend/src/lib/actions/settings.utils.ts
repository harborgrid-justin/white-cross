/**
 * @fileoverview Utility Functions for Settings Actions
 * @module lib/actions/settings.utils
 *
 * Shared utility functions for authentication, API communication, and audit logging.
 * These utilities support all settings-related server actions.
 */

'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { serverGet, serverPost } from '@/lib/api/nextjs-client';
import type { AuthenticatedUser, AuditContext } from './settings.types';
import {
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

/**
 * Get auth token from cookies
 * @returns The auth token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

/**
 * Get current user ID from cookies
 * @returns The user ID or null if not found
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}

/**
 * Create audit context from headers
 * Extracts IP address, user agent, and user ID for audit logging
 * @returns Audit context object with user information
 */
export async function createAuditContext(): Promise<AuditContext> {
  const headersList = await headers();
  const request = {
    headers: headersList
  } as Request;

  const userId = await getCurrentUserId();
  return {
    userId,
    ipAddress: extractIPAddress(request) ?? null,
    userAgent: extractUserAgent(request) ?? null
  };
}


/**
 * Get authenticated user from session
 * Verifies the auth token and returns user data
 * @returns Authenticated user object or null if not authenticated
 */
export async function getAuthUser(): Promise<AuthenticatedUser | null> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return null;
    }

    const response = await serverGet<AuthenticatedUser>(
      '/auth/verify',
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: 300, // 5 minute cache
          tags: ['user-settings', 'user-data']
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Failed to get authenticated user:', error);
    return null;
  }
}

/**
 * Verify current password
 * Used for sensitive operations that require password confirmation
 * @param userId - The user ID to verify
 * @param password - The password to verify
 * @returns True if password is valid, false otherwise
 */
export async function verifyCurrentPassword(
  userId: string,
  password: string
): Promise<boolean> {
  try {
    await serverPost<{ success: boolean }>(
      '/auth/verify-password',
      { userId, password },
      {
        cache: 'no-store',
        next: {
          tags: ['user-settings']
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}
