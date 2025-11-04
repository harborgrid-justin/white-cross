/**
 * @fileoverview Profile Utility Functions
 * @module lib/actions/profile.utils
 *
 * Utility and helper functions for profile management including
 * profile existence checks, overview data aggregation, and cache management.
 *
 * Features:
 * - Profile existence validation
 * - Aggregated profile overview data
 * - Cache invalidation utilities
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import {
  getUserProfile,
  getProfileSettings,
  getActiveSessions,
  getSecurityLogs
} from './profile.cache';
import type { UserProfile, ProfileSettings, PROFILE_CACHE_TAGS } from './profile.types';

// Re-export cache tags for convenience
export { PROFILE_CACHE_TAGS } from './profile.types';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if profile exists
 *
 * @param userId - The user ID to check
 * @returns True if profile exists, false otherwise
 */
export async function profileExists(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile !== null;
}

/**
 * Get profile overview with aggregated data
 * Fetches profile, settings, and activity statistics in parallel
 *
 * @param userId - The user ID to get overview for
 * @returns Aggregated profile overview data
 */
export async function getProfileOverview(userId: string): Promise<{
  profile: UserProfile | null;
  settings: ProfileSettings | null;
  activeSessions: number;
  recentSecurityEvents: number;
}> {
  try {
    const [profile, settings, sessions, securityLogs] = await Promise.all([
      getUserProfile(userId),
      getProfileSettings(userId),
      getActiveSessions(userId),
      getSecurityLogs(userId, 10)
    ]);

    return {
      profile,
      settings,
      activeSessions: sessions.length,
      recentSecurityEvents: securityLogs.length,
    };
  } catch {
    return {
      profile: null,
      settings: null,
      activeSessions: 0,
      recentSecurityEvents: 0,
    };
  }
}

/**
 * Clear profile cache
 * Invalidates all profile-related cache tags and paths
 *
 * @param userId - Optional user ID to clear specific user cache
 */
export async function clearProfileCache(userId?: string): Promise<void> {
  if (userId) {
    revalidateTag(`profile-${userId}`, 'default');
    revalidateTag(`profile-settings-${userId}`, 'default');
    revalidateTag(`security-logs-${userId}`, 'default');
    revalidateTag(`sessions-${userId}`, 'default');
  }

  // Clear all profile caches
  const cacheTags = [
    'profiles',
    'profile-settings',
    'profile-preferences',
    'profile-security',
    'profile-sessions'
  ];

  cacheTags.forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear current profile cache
  revalidateTag('current-profile', 'default');

  // Clear paths
  revalidatePath('/profile', 'page');
  revalidatePath('/profile/settings', 'page');
  revalidatePath('/profile/security', 'page');
}
