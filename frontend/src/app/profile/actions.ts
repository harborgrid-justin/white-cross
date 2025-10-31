/**
 * @fileoverview Profile Management Server Actions - Next.js v14+ Compatible
 * @module app/profile/actions
 *
 * HIPAA-compliant server actions for user profile management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all profile operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for profiles
export const PROFILE_CACHE_TAGS = {
  PROFILES: 'profiles',
  SETTINGS: 'profile-settings',
  PREFERENCES: 'profile-preferences',
  SECURITY: 'profile-security',
  SESSIONS: 'profile-sessions',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  role: 'admin' | 'nurse' | 'staff' | 'viewer';
  permissions: string[];
  avatar?: string;
  timezone: string;
  locale: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  department?: string;
  timezone?: string;
  locale?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  theme?: 'light' | 'dark' | 'system';
}

export interface ProfileSettings {
  id: string;
  userId: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    desktop: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    statusVisible: boolean;
  };
  security: {
    sessionTimeout: number;
    requireReauth: boolean;
    allowMultipleSessions: boolean;
  };
  preferences: {
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileSettingsData {
  notifications?: Partial<ProfileSettings['notifications']>;
  privacy?: Partial<ProfileSettings['privacy']>;
  security?: Partial<ProfileSettings['security']>;
  preferences?: Partial<ProfileSettings['preferences']>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  success: boolean;
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  ipAddress: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get user profile by ID with caching
 * Uses Next.js cache() for automatic memoization
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
          tags: [`profile-${userId}`, PROFILE_CACHE_TAGS.PROFILES] 
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
 */
export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
  try {
    const response = await serverGet<ApiResponse<UserProfile>>(
      `/api/profile`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: ['current-profile', PROFILE_CACHE_TAGS.PROFILES] 
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
 */
export const getProfileSettings = cache(async (userId: string): Promise<ProfileSettings | null> => {
  try {
    const response = await serverGet<ApiResponse<ProfileSettings>>(
      `/api/users/${userId}/settings`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`profile-settings-${userId}`, PROFILE_CACHE_TAGS.SETTINGS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get profile settings:', error);
    return null;
  }
});

/**
 * Get security logs with caching
 */
export const getSecurityLogs = cache(async (userId: string, limit: number = 50): Promise<SecurityLog[]> => {
  try {
    const response = await serverGet<ApiResponse<SecurityLog[]>>(
      `/api/users/${userId}/security-logs`,
      { limit: limit.toString() },
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: [`security-logs-${userId}`, PROFILE_CACHE_TAGS.SECURITY] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get security logs:', error);
    return [];
  }
});

/**
 * Get active sessions with caching
 */
export const getActiveSessions = cache(async (userId: string): Promise<ActiveSession[]> => {
  try {
    const response = await serverGet<ApiResponse<ActiveSession[]>>(
      `/api/users/${userId}/sessions`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: [`sessions-${userId}`, PROFILE_CACHE_TAGS.SESSIONS] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get active sessions:', error);
    return [];
  }
});

// ==========================================
// PROFILE OPERATIONS
// ==========================================

/**
 * Update user profile
 * Includes audit logging and cache invalidation
 */
export async function updateProfileAction(
  userId: string,
  data: UpdateProfileData
): Promise<ActionResult<UserProfile>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    // Validate email if provided
    if (data.firstName && data.firstName.length < 2) {
      return {
        success: false,
        error: 'First name must be at least 2 characters'
      };
    }

    if (data.lastName && data.lastName.length < 2) {
      return {
        success: false,
        error: 'Last name must be at least 2 characters'
      };
    }

    const response = await serverPut<ApiResponse<UserProfile>>(
      `/api/users/${userId}/profile`,
      data,
      {
        cache: 'no-store',
        next: { tags: [PROFILE_CACHE_TAGS.PROFILES, `profile-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update profile');
    }

    // AUDIT LOG - Profile update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserProfile',
      resourceId: userId,
      details: 'Updated user profile',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(PROFILE_CACHE_TAGS.PROFILES);
    revalidateTag(`profile-${userId}`);
    revalidateTag('current-profile');
    revalidatePath('/profile', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update profile';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserProfile',
      resourceId: userId,
      details: `Failed to update profile: ${errorMessage}`,
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
 * Update profile settings
 * Includes audit logging and cache invalidation
 */
export async function updateProfileSettingsAction(
  userId: string,
  data: UpdateProfileSettingsData
): Promise<ActionResult<ProfileSettings>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPut<ApiResponse<ProfileSettings>>(
      `/api/users/${userId}/settings`,
      data,
      {
        cache: 'no-store',
        next: { tags: [PROFILE_CACHE_TAGS.SETTINGS, `profile-settings-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update profile settings');
    }

    // AUDIT LOG - Settings update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ProfileSettings',
      resourceId: userId,
      details: 'Updated profile settings',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(PROFILE_CACHE_TAGS.SETTINGS);
    revalidateTag(`profile-settings-${userId}`);
    revalidatePath('/profile/settings', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Profile settings updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update profile settings';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ProfileSettings',
      resourceId: userId,
      details: `Failed to update profile settings: ${errorMessage}`,
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
 * Change password
 * Includes audit logging and cache invalidation
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
        next: { tags: [PROFILE_CACHE_TAGS.SECURITY] }
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
    revalidateTag(PROFILE_CACHE_TAGS.SECURITY);
    revalidateTag(`security-logs-${userId}`);
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

/**
 * Upload profile avatar
 * Includes audit logging and cache invalidation
 */
export async function uploadAvatarAction(
  userId: string,
  formData: FormData
): Promise<ActionResult<{ avatarUrl: string }>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPost<ApiResponse<{ avatarUrl: string }>>(
      `/api/users/${userId}/avatar`,
      formData,
      {
        cache: 'no-store',
        next: { tags: [PROFILE_CACHE_TAGS.PROFILES, `profile-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload avatar');
    }

    // AUDIT LOG - Avatar upload
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserProfile',
      resourceId: userId,
      details: 'Updated profile avatar',
      success: true
    });

    // Cache invalidation
    revalidateTag(PROFILE_CACHE_TAGS.PROFILES);
    revalidateTag(`profile-${userId}`);
    revalidateTag('current-profile');
    revalidatePath('/profile', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Avatar uploaded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to upload avatar';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'UserProfile',
      resourceId: userId,
      details: `Failed to upload avatar: ${errorMessage}`,
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
 * Enable two-factor authentication
 * Includes audit logging and cache invalidation
 */
export async function enableTwoFactorAction(userId: string): Promise<ActionResult<{ qrCode: string; backupCodes: string[] }>> {
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
        next: { tags: [PROFILE_CACHE_TAGS.SECURITY, `profile-${userId}`] }
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
    revalidateTag(PROFILE_CACHE_TAGS.PROFILES);
    revalidateTag(PROFILE_CACHE_TAGS.SECURITY);
    revalidateTag(`profile-${userId}`);
    revalidateTag(`security-logs-${userId}`);
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
        next: { tags: [PROFILE_CACHE_TAGS.SECURITY, `profile-${userId}`] }
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
    revalidateTag(PROFILE_CACHE_TAGS.PROFILES);
    revalidateTag(PROFILE_CACHE_TAGS.SECURITY);
    revalidateTag(`profile-${userId}`);
    revalidateTag(`security-logs-${userId}`);
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

/**
 * Revoke session
 * Includes audit logging and cache invalidation
 */
export async function revokeSessionAction(userId: string, sessionId: string): Promise<ActionResult<void>> {
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
        next: { tags: [PROFILE_CACHE_TAGS.SESSIONS, `sessions-${userId}`] }
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
    revalidateTag(PROFILE_CACHE_TAGS.SESSIONS);
    revalidateTag(PROFILE_CACHE_TAGS.SECURITY);
    revalidateTag(`sessions-${userId}`);
    revalidateTag(`security-logs-${userId}`);
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

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Update profile from form data
 * Form-friendly wrapper for updateProfileAction
 */
export async function updateProfileFromForm(
  userId: string,
  formData: FormData
): Promise<ActionResult<UserProfile>> {
  const profileData: UpdateProfileData = {
    firstName: formData.get('firstName') as string || undefined,
    lastName: formData.get('lastName') as string || undefined,
    phone: formData.get('phone') as string || undefined,
    title: formData.get('title') as string || undefined,
    department: formData.get('department') as string || undefined,
    timezone: formData.get('timezone') as string || undefined,
    locale: formData.get('locale') as string || undefined,
    dateFormat: formData.get('dateFormat') as string || undefined,
    timeFormat: formData.get('timeFormat') as '12h' | '24h' || undefined,
    theme: formData.get('theme') as 'light' | 'dark' | 'system' || undefined,
  };

  // Filter out undefined values
  const filteredData = Object.entries(profileData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateProfileData] = value;
    }
    return acc;
  }, {} as UpdateProfileData);

  const result = await updateProfileAction(userId, filteredData);
  
  if (result.success && result.data) {
    revalidatePath('/profile', 'page');
  }
  
  return result;
}

/**
 * Change password from form data
 * Form-friendly wrapper for changePasswordAction
 */
export async function changePasswordFromForm(
  userId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const passwordData: ChangePasswordData = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const result = await changePasswordAction(userId, passwordData);
  
  if (result.success) {
    revalidatePath('/profile/security', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if profile exists
 */
export async function profileExists(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile !== null;
}

/**
 * Get profile overview
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
 */
export async function clearProfileCache(userId?: string): Promise<void> {
  if (userId) {
    revalidateTag(`profile-${userId}`);
    revalidateTag(`profile-settings-${userId}`);
    revalidateTag(`security-logs-${userId}`);
    revalidateTag(`sessions-${userId}`);
  }
  
  // Clear all profile caches
  Object.values(PROFILE_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag);
  });

  // Clear current profile cache
  revalidateTag('current-profile');

  // Clear paths
  revalidatePath('/profile', 'page');
  revalidatePath('/profile/settings', 'page');
  revalidatePath('/profile/security', 'page');
}
