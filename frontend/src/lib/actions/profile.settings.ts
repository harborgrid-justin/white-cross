/**
 * @fileoverview Profile Settings Management
 * @module lib/actions/profile.settings
 *
 * Server actions for managing user profile settings including notifications,
 * privacy preferences, and display preferences.
 *
 * Features:
 * - HIPAA-compliant audit logging
 * - Next.js cache invalidation
 * - Type-safe server actions
 * - Comprehensive error handling
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPut, NextApiClientError } from '@/lib/api/server';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types/core/api/responses';
import type {
  ActionResult,
  ProfileSettings,
  UpdateProfileSettingsData
} from './profile.types';

// ==========================================
// SETTINGS OPERATIONS
// ==========================================

/**
 * Update profile settings
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID to update settings for
 * @param data - Settings data to update
 * @returns Action result with updated settings or error
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
        next: { tags: ['profile-settings', `profile-settings-${userId}`] }
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
    revalidateTag('profile-settings', 'default');
    revalidateTag(`profile-settings-${userId}`, 'default');
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
