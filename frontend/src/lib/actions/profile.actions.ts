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
 * - Server actions with proper 'use server' directive (in individual modules)
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all profile operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Module Organization:
 * - profile.types.ts - TypeScript type definitions and interfaces
 * - profile.cache.ts - Cached data retrieval functions (marked with 'use server')
 * - profile.crud.ts - Basic profile CRUD operations (marked with 'use server')
 * - profile.settings.ts - Settings management actions (marked with 'use server')
 * - profile.security.ts - Security operations (marked with 'use server')
 * - profile.forms.ts - Form data handling wrappers (marked with 'use server')
 * - profile.utils.ts - Utility and helper functions (marked with 'use server')
 *
 * NOTE: This file does NOT have 'use server' at the file level to allow imports
 * from both Client and Server Components. Individual modules have their own
 * 'use server' directives to mark functions as server actions.
 */

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

// NOTE: PROFILE_CACHE_TAGS cannot be re-exported from this "use server" file.
// Import directly from './profile.constants' when needed in client components.

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
