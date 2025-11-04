/**
 * @fileoverview Profile Management Server Actions - Main Entry Point
 * @module lib/actions/profile.actions
 *
 * HIPAA-compliant server actions for user profile management with comprehensive
 * caching, audit logging, and error handling.
 *
 * This file serves as the main entry point, re-exporting all profile-related
 * functionality from specialized modules for better organization and maintainability.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all profile operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Module Organization:
 * - profile.types.ts - TypeScript type definitions and interfaces
 * - profile.cache.ts - Cached data retrieval functions
 * - profile.crud.ts - Basic profile CRUD operations
 * - profile.settings.ts - Settings management actions
 * - profile.security.ts - Security operations (passwords, 2FA, sessions)
 * - profile.forms.ts - Form data handling wrappers
 * - profile.utils.ts - Utility and helper functions
 */

'use server';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type {
  ActionResult,
  UserProfile,
  UpdateProfileData,
  ProfileSettings,
  UpdateProfileSettingsData,
  ChangePasswordData,
  SecurityLog,
  ActiveSession,
} from './profile.types';

export { PROFILE_CACHE_TAGS } from './profile.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

export {
  getUserProfile,
  getCurrentUserProfile,
  getProfileSettings,
  getSecurityLogs,
  getActiveSessions,
} from './profile.cache';

// ==========================================
// PROFILE CRUD OPERATIONS
// ==========================================

export {
  updateProfileAction,
  uploadAvatarAction,
} from './profile.crud';

// ==========================================
// SETTINGS OPERATIONS
// ==========================================

export {
  updateProfileSettingsAction,
} from './profile.settings';

// ==========================================
// SECURITY OPERATIONS
// ==========================================

export {
  changePasswordAction,
  enableTwoFactorAction,
  disableTwoFactorAction,
  revokeSessionAction,
} from './profile.security';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

export {
  updateProfileFromForm,
  changePasswordFromForm,
} from './profile.forms';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  profileExists,
  getProfileOverview,
  clearProfileCache,
} from './profile.utils';
