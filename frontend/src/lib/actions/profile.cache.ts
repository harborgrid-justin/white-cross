/**
 * @fileoverview Profile Cache Operations
 * @module lib/actions/profile.cache
 *
 * Cached data retrieval functions for profile management with Next.js cache integration.
 * All functions use React cache() for automatic memoization within a single request.
 *
 * Features:
 * - Next.js cache integration with revalidation
 * - Proper cache tags for selective invalidation
 * - Error handling with fallback values
 * - HIPAA-compliant data access patterns
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/nextjs-client';
import { CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/core/api/responses';
import type {
  UserProfile,
  ProfileSettings,
  SecurityLog,
  ActiveSession
} from './profile.types';

// NOTE: Cache tags are hardcoded as strings in this file.
// If you need to reference PROFILE_CACHE_TAGS constant, import from './profile.constants'
// (cannot be imported here due to "use server" restrictions on re-exports).

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get user profile by ID with caching
 * Uses Next.js cache() for automatic memoization
 *
 * @param userId - The user ID to fetch profile for
 * @returns User profile or null if not found
 */
export const getUserProfile = cache(async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await serverGet<ApiResponse<UserProfile>>(
      `/api/users/${userId}/profile`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`profile-${userId}`, 'profiles']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
});

/**
 * Get current user profile with caching
 * Uses Next.js cache() for automatic memoization
 *
 * @returns Current user profile or null if not authenticated
 */
export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
  try {
    const response = await serverGet<ApiResponse<UserProfile>>(
      `/api/v1/auth/profile`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: ['current-profile', 'profiles']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get current user profile:', error);
    return null;
  }
});

/**
 * Get profile settings with caching
 * Uses Next.js cache() for automatic memoization
 *
 * @param userId - The user ID to fetch settings for
 * @returns Profile settings or null if not found
 */
export const getProfileSettings = cache(async (userId: string): Promise<ProfileSettings | null> => {
  try {
    // TODO: Backend route doesn't exist - returning default settings for now
    console.warn('Profile settings endpoint not implemented in backend - using defaults');
    
    // Return default settings until backend endpoint is implemented
    return {
      id: userId,
      theme: 'light',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
      emailNotifications: true,
      pushNotifications: false,
      securityAlerts: true,
    } as ProfileSettings;
  } catch (error) {
    console.error('Failed to get profile settings:', error);
    return null;
  }
});

/**
 * Get security logs with caching
 * Uses Next.js cache() for automatic memoization
 *
 * @param userId - The user ID to fetch security logs for
 * @param limit - Maximum number of logs to retrieve (default: 50)
 * @returns Array of security log entries
 */
export const getSecurityLogs = cache(async (userId: string, limit: number = 50): Promise<SecurityLog[]> => {
  try {
    // TODO: Backend route doesn't exist - returning empty array for now
    console.warn('Security logs endpoint not implemented in backend');
    return [];
  } catch (error) {
    console.error('Failed to get security logs:', error);
    return [];
  }
});

/**
 * Get active sessions with caching
 * Uses Next.js cache() for automatic memoization
 *
 * @param userId - The user ID to fetch active sessions for
 * @returns Array of active session information
 */
export const getActiveSessions = cache(async (userId: string): Promise<ActiveSession[]> => {
  try {
    // TODO: Backend route doesn't exist - returning empty array for now
    console.warn('Active sessions endpoint not implemented in backend');
    return [];
  } catch (error) {
    console.error('Failed to get active sessions:', error);
    return [];
  }
});
