/**
 * @fileoverview Server Actions for User Settings
 * @module app/settings/actions
 *
 * Next.js v16 App Router Server Actions for user profile and settings management.
 * Provides secure operations for profile updates, security settings, notification preferences, and privacy controls.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
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
'use cache';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z, type ZodIssue } from 'zod';
import { cacheLife, cacheTag } from 'next/cache';

// Import settings schemas
import {
  updateProfileSchema,
  changeEmailSchema,
  verifyEmailSchema,
  changePasswordSchema,
  setupMFASchema,
  updateNotificationPreferencesSchema,
  updatePrivacySettingsSchema,
  exportUserDataSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/schemas/settings.schemas';

// Import audit logging utilities
import {
  auditLog,
  AUDIT_ACTIONS,
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

// Use server-side or fallback to public env variable or default
const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success?: boolean;
  data?: T;
  errors?: Record<string, string[]> & {
    _form?: string[];
  };
  message?: string;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
}

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

/**
 * Get current user ID from cookies
 */
async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}

/**
 * Create audit context from headers
 */
async function createAuditContext() {
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
 */
async function enhancedFetch(url: string, options: RequestInit = {}) {
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
 */
async function getAuthUser(): Promise<AuthenticatedUser | null> {
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
 */
async function verifyCurrentPassword(
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

// ==========================================
// PROFILE MANAGEMENT ACTIONS
// ==========================================

/**
 * Update user profile
 */
export async function updateProfileAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const rawData = {
      firstName: formData.get('firstName')?.toString(),
      lastName: formData.get('lastName')?.toString(),
      phone: formData.get('phone')?.toString() || undefined,
      title: formData.get('title')?.toString() || undefined,
      department: formData.get('department')?.toString() || undefined,
      bio: formData.get('bio')?.toString() || undefined,
    };

    const validation = updateProfileSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(validation.data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    await auditLog({
      ...auditContext,
      action: 'UPDATE_PROFILE',
      resource: 'User',
      resourceId: user.id,
      changes: validation.data,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('user-settings');
    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/profile');

    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Upload user avatar
 */
export async function uploadAvatarAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const avatarFile = formData.get('avatar') as File;
    if (!avatarFile) {
      return {
        errors: {
          _form: ['Avatar file is required']
        }
      };
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(avatarFile.type)) {
      return {
        errors: {
          _form: ['Invalid file type. Allowed: JPEG, PNG, WebP']
        }
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      return {
        errors: {
          _form: ['File size must be less than 5MB']
        }
      };
    }

    // Create FormData for upload
    const uploadFormData = new FormData();
    uploadFormData.append('avatar', avatarFile);

    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/users/${user.id}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    const { avatarUrl } = await response.json();

    await auditLog({
      ...auditContext,
      action: 'UPDATE_AVATAR',
      resource: 'User',
      resourceId: user.id,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('user-settings');
    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/profile');

    return {
      success: true,
      data: { avatarUrl },
      message: 'Avatar uploaded successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Change email address (requires verification)
 */
export async function changeEmailAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const newEmail = formData.get('newEmail')?.toString();
    const currentPassword = formData.get('currentPassword')?.toString();

    if (!newEmail || !currentPassword) {
      return {
        errors: {
          _form: ['Email and current password are required']
        }
      };
    }

    // Verify current password
    const passwordValid = await verifyCurrentPassword(user.id, currentPassword);
    if (!passwordValid) {
      return {
        errors: {
          _form: ['Current password is incorrect']
        }
      };
    }

    const validation = changeEmailSchema.safeParse({ newEmail });
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/email`, {
      method: 'POST',
      body: JSON.stringify({ newEmail })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change email');
    }

    await auditLog({
      ...auditContext,
      action: 'REQUEST_EMAIL_CHANGE',
      resource: 'User',
      resourceId: user.id,
      changes: { newEmail },
      success: true
    });

    return {
      success: true,
      message: 'Email change request sent. Please check your new email for verification.'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

// ==========================================
// SECURITY SETTINGS ACTIONS
// ==========================================

/**
 * Change password
 */
export async function changePasswordAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const currentPassword = formData.get('currentPassword')?.toString();
    const newPassword = formData.get('newPassword')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        errors: {
          _form: ['All password fields are required']
        }
      };
    }

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // Verify current password
    const passwordValid = await verifyCurrentPassword(user.id, currentPassword);
    if (!passwordValid) {
      return {
        errors: {
          _form: ['Current password is incorrect']
        }
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'User',
      resourceId: user.id,
      success: true
    });

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Setup MFA for user account
 */
export async function setupMFAAction(): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/mfa/setup`, {
      method: 'POST'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to setup MFA');
    }

    const mfaData = await response.json();

    await auditLog({
      ...auditContext,
      action: 'SETUP_MFA',
      resource: 'User',
      resourceId: user.id,
      success: true
    });

    return {
      success: true,
      data: mfaData,
      message: 'MFA setup initiated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

// ==========================================
// NOTIFICATION & PRIVACY ACTIONS
// ==========================================

/**
 * Update notification preferences
 */
export async function updateNotificationPreferencesAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const rawData = {
      emailNotifications: formData.get('emailNotifications') === 'true',
      smsNotifications: formData.get('smsNotifications') === 'true',
      pushNotifications: formData.get('pushNotifications') === 'true',
      notificationTypes: JSON.parse(formData.get('notificationTypes')?.toString() || '[]'),
      quietHours: formData.get('quietHours') ? JSON.parse(formData.get('quietHours')!.toString()) : undefined,
    };

    const validation = updateNotificationPreferencesSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/notification-preferences`, {
      method: 'PATCH',
      body: JSON.stringify(validation.data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update notification preferences');
    }

    await auditLog({
      ...auditContext,
      action: 'UPDATE_NOTIFICATION_PREFERENCES',
      resource: 'User',
      resourceId: user.id,
      changes: validation.data,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('user-settings');
    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/notifications');

    return {
      success: true,
      message: 'Notification preferences updated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettingsAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const rawData = {
      profileVisibility: formData.get('profileVisibility')?.toString() || 'private',
      showEmail: formData.get('showEmail') === 'true',
      showPhone: formData.get('showPhone') === 'true',
      dataSharing: formData.get('dataSharing') === 'true',
    };

    const validation = updatePrivacySettingsSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/privacy-settings`, {
      method: 'PATCH',
      body: JSON.stringify(validation.data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update privacy settings');
    }

    await auditLog({
      ...auditContext,
      action: 'UPDATE_PRIVACY_SETTINGS',
      resource: 'User',
      resourceId: user.id,
      changes: validation.data,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('user-settings');
    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/privacy');

    return {
      success: true,
      message: 'Privacy settings updated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Export user data (HIPAA compliance)
 */
export async function exportUserDataAction(): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/export`, {
      method: 'POST'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to export user data');
    }

    const { exportUrl } = await response.json();

    await auditLog({
      ...auditContext,
      action: 'EXPORT_USER_DATA',
      resource: 'User',
      resourceId: user.id,
      success: true
    });

    return {
      success: true,
      data: { exportUrl },
      message: 'User data export initiated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Get user settings with enhanced caching
 */
export async function getUserSettingsAction() {
  cacheLife('max');
  cacheTag('user-settings');

  try {
    const user = await getAuthUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const response = await enhancedFetch(`${BACKEND_URL}/users/${user.id}/settings`, {
      method: 'GET',
      next: {
        revalidate: 300, // 5 minute cache
        tags: ['user-settings', `user-${user.id}`]
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user settings');
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user settings'
    };
  }
}

// Export all action types for type safety
export type {
  UpdateProfileInput,
  ChangePasswordInput,
};
