/**
 * @fileoverview Server Actions for User Settings (Barrel File)
 * @module app/settings/actions
 *
 * Next.js v14+ App Router Server Actions for user profile and settings management.
 * Provides secure operations for profile updates, security settings, notification preferences, and privacy controls.
 * Enhanced with Next.js caching capabilities and revalidation patterns.
 *
 * This file serves as a barrel export for all settings-related actions and types.
 * For implementation details, see the individual module files:
 * - settings.types.ts - Type definitions
 * - settings.utils.ts - Utility functions
 * - settings.profile.ts - Profile management actions
 * - settings.security.ts - Security settings actions
 * - settings.notifications.ts - Notification preferences
 * - settings.privacy.ts - Privacy settings and data export
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { updateProfileAction } from '@/lib/actions/settings.actions';
 *
 * function ProfileForm() {
 *   const [state, formAction, isPending] = useActionState(updateProfileAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  AuthenticatedUser,
  AuditContext,
  UpdateProfileInput,
  ChangePasswordInput,
} from './settings.types';

// ==========================================
// PROFILE MANAGEMENT ACTIONS
// ==========================================

export {
  updateProfileAction,
  uploadAvatarAction,
  changeEmailAction,
} from './settings.profile';

// ==========================================
// SECURITY SETTINGS ACTIONS
// ==========================================

export {
  changePasswordAction,
  setupMFAAction,
} from './settings.security';

// ==========================================
// NOTIFICATION PREFERENCES ACTIONS
// ==========================================

export {
  updateNotificationPreferencesAction,
} from './settings.notifications';

// ==========================================
// PRIVACY SETTINGS & DATA EXPORT ACTIONS
// ==========================================

export {
  updatePrivacySettingsAction,
  exportUserDataAction,
  getUserSettingsAction,
} from './settings.privacy';

// ==========================================
// UTILITY FUNCTION EXPORTS
// ==========================================

export {
  getAuthToken,
  getCurrentUserId,
  createAuditContext,
  getAuthUser,
  verifyCurrentPassword,
  enhancedFetch,
  BACKEND_URL
} from './settings.utils';
