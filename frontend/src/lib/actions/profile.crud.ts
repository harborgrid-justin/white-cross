/**
 * @fileoverview Profile CRUD Operations
 * @module lib/actions/profile.crud
 *
 * Basic Create, Read, Update operations for user profiles.
 * Includes profile updates and avatar management.
 *
 * Features:
 * - HIPAA-compliant audit logging
 * - Next.js cache invalidation
 * - Type-safe server actions
 * - Comprehensive error handling
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPut, serverPost, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types/core/api/responses';
import type {
  ActionResult,
  UserProfile,
  UpdateProfileData
} from './profile.types';

// ==========================================
// PROFILE CRUD OPERATIONS
// ==========================================

/**
 * Update user profile
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID to update
 * @param data - Profile data to update
 * @returns Action result with updated profile or error
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

    // Validate first name if provided
    if (data.firstName && data.firstName.length < 2) {
      return {
        success: false,
        error: 'First name must be at least 2 characters'
      };
    }

    // Validate last name if provided
    if (data.lastName && data.lastName.length < 2) {
      return {
        success: false,
        error: 'Last name must be at least 2 characters'
      };
    }

    const response = await serverPut<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.PROFILE,
      data,
      {
        cache: 'no-store',
        next: { tags: ['profiles', `profile-${userId}`] }
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
    revalidateTag('profiles', 'default');
    revalidateTag(`profile-${userId}`, 'default');
    revalidateTag('current-profile', 'default');
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
 * Upload profile avatar
 * Includes audit logging and cache invalidation
 *
 * @param userId - The user ID to upload avatar for
 * @param formData - Form data containing avatar file
 * @returns Action result with avatar URL or error
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
      `${API_ENDPOINTS.USERS.BASE}/avatar`,
      formData,
      {
        cache: 'no-store',
        next: { tags: ['profiles', `profile-${userId}`] }
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
    revalidateTag('profiles', 'default');
    revalidateTag(`profile-${userId}`, 'default');
    revalidateTag('current-profile', 'default');
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
