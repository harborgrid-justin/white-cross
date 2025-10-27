/**
 * @fileoverview Server Actions for User Settings
 * @module actions/settings
 *
 * Next.js Server Actions for user profile and settings management.
 * Provides secure operations for profile updates, security settings,
 * notification preferences, and privacy controls.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { updateProfileAction } from '@/actions/settings.actions';
 *
 * async function handleProfileUpdate(formData: FormData) {
 *   const result = await updateProfileAction(formData);
 *   if (result.success) {
 *     // Profile updated successfully
 *   }
 * }
 * ```
 */

'use server';

import { cookies, headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import {
  auditLog,
  AUDIT_ACTIONS,
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';
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

// ==========================================
// CONSTANTS & CONFIGURATION
// ==========================================

// Use server-side or fallback to public env variable or default
const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// ==========================================
// TYPES
// ==========================================

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get authenticated user from session
 */
async function getAuthUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/auth/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, password }),
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
  formData: FormData
): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
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
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    await auditLog({
      userId: user.id,
      action: 'UPDATE_PROFILE',
      resource: 'users',
      resourceId: user.id,
      changes: validation.data,
      ipAddress,
      userAgent,
      success: true,
    });

    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/profile');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload user avatar
 */
export async function uploadAvatarAction(
  formData: FormData
): Promise<ActionResult<{ avatarUrl: string }>> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const avatarFile = formData.get('avatar') as File;
    if (!avatarFile) {
      return { success: false, error: 'Avatar file is required' };
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(avatarFile.type)) {
      return { success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Create FormData for upload
    const uploadFormData = new FormData();
    uploadFormData.append('avatar', avatarFile);

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    const { avatarUrl } = await response.json();

    await auditLog({
      userId: user.id,
      action: 'UPDATE_AVATAR',
      resource: 'users',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/profile');

    return {
      success: true,
      data: { avatarUrl },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Change email address (requires verification)
 */
export async function changeEmailAction(
  newEmail: string,
  currentPassword: string
): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    // Verify current password
    const passwordValid = await verifyCurrentPassword(user.id, currentPassword);
    if (!passwordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const validation = changeEmailSchema.safeParse({ newEmail });
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ newEmail }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change email');
    }

    await auditLog({
      userId: user.id,
      action: 'REQUEST_EMAIL_CHANGE',
      resource: 'users',
      resourceId: user.id,
      changes: { newEmail },
      ipAddress,
      userAgent,
      success: true,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify email with token
 */
export async function verifyEmailAction(token: string): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify email');
    }

    await auditLog({
      userId: user.id,
      action: 'VERIFY_EMAIL',
      resource: 'users',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    revalidateTag(`user-${user.id}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
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
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // Verify current password
    const passwordValid = await verifyCurrentPassword(user.id, currentPassword);
    if (!passwordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    await auditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'users',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Setup MFA for user account
 */
export async function setupMFAAction(): Promise<ActionResult<{
  secret: string;
  qrCode: string;
  backupCodes: string[];
}>> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/mfa/setup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to setup MFA');
    }

    const mfaData = await response.json();

    await auditLog({
      userId: user.id,
      action: 'SETUP_MFA',
      resource: 'users',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    return {
      success: true,
      data: mfaData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate backup codes for MFA
 */
export async function generateBackupCodesAction(
  mfaToken: string
): Promise<ActionResult<{ backupCodes: string[] }>> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/mfa/backup-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ mfaToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate backup codes');
    }

    const { backupCodes } = await response.json();

    await auditLog({
      userId: user.id,
      action: 'GENERATE_MFA_BACKUP_CODES',
      resource: 'users',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    return {
      success: true,
      data: { backupCodes },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Manage active sessions
 */
export async function terminateSessionAction(
  sessionId: string
): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to terminate session');
    }

    await auditLog({
      userId: user.id,
      action: 'TERMINATE_SESSION',
      resource: 'sessions',
      resourceId: sessionId,
      ipAddress,
      userAgent,
      success: true,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
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
  formData: FormData
): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
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
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/notification-preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update notification preferences');
    }

    await auditLog({
      userId: user.id,
      action: 'UPDATE_NOTIFICATION_PREFERENCES',
      resource: 'users',
      resourceId: user.id,
      changes: validation.data,
      ipAddress,
      userAgent,
      success: true,
    });

    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/notifications');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettingsAction(
  formData: FormData
): Promise<ActionResult> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const rawData = {
      profileVisibility: formData.get('profileVisibility')?.toString() || 'private',
      showEmail: formData.get('showEmail') === 'true',
      showPhone: formData.get('showPhone') === 'true',
      dataSharing: formData.get('dataSharing') === 'true',
    };

    const validation = updatePrivacySettingsSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/privacy-settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update privacy settings');
    }

    await auditLog({
      userId: user.id,
      action: 'UPDATE_PRIVACY_SETTINGS',
      resource: 'users',
      resourceId: user.id,
      changes: validation.data,
      ipAddress,
      userAgent,
      success: true,
    });

    revalidateTag(`user-${user.id}`);
    revalidatePath('/settings/privacy');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export user data (HIPAA compliance)
 */
export async function exportUserDataAction(): Promise<ActionResult<{ exportUrl: string }>> {
  const headersList = await headers();
  const ipAddress = extractIPAddress(headersList);
  const userAgent = extractUserAgent(headersList);

  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const response = await fetch(`${BACKEND_URL}/users/${user.id}/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to export user data');
    }

    const { exportUrl } = await response.json();

    await auditLog({
      userId: user.id,
      action: 'EXPORT_USER_DATA',
      resource: 'users',
      resourceId: user.id,
      ipAddress,
      userAgent,
      success: true,
    });

    return {
      success: true,
      data: { exportUrl },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Export all action types for type safety
export type {
  UpdateProfileInput,
  ChangePasswordInput,
};
