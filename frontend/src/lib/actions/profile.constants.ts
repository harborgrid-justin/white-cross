/**
 * @fileoverview Profile Constants and Configuration
 * @module lib/actions/profile.constants
 *
 * Shared constants and configuration values for profile management.
 * This file does NOT use "use server" so constants can be safely
 * imported in both client and server components.
 */

// ==========================================
// CACHE TAGS
// ==========================================

/**
 * Custom cache tags for profile-related operations
 */
export const PROFILE_CACHE_TAGS = {
  PROFILES: 'profiles',
  SETTINGS: 'profile-settings',
  PREFERENCES: 'profile-preferences',
  SECURITY: 'profile-security',
  SESSIONS: 'profile-sessions',
} as const;
