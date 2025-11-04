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
import type { AuthenticatedUser, AuditContext } from './settings.types';
import {
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

// Use server-side or fallback to public env variable or default
export const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    ipAddress: extractIPAddress(request),
    userAgent: extractUserAgent(request)
  };
}

/**
 * Enhanced fetch with Next.js v16 capabilities
 * Automatically adds authentication headers and caching configuration
 * @param url - The URL to fetch
 * @param options - Additional fetch options
 * @returns Fetch response
 */
export async function enhancedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    next: {
      revalidate: 300, // 5 minute cache
      tags: ['user-settings', 'user-data']
    }
  });
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

    const response = await enhancedFetch(`${BACKEND_URL}/auth/verify`, {
      method: 'GET'
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
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
    const response = await enhancedFetch(`${BACKEND_URL}/auth/verify-password`, {
      method: 'POST',
      body: JSON.stringify({ userId, password })
    });

    return response.ok;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}
