/**
 * @fileoverview Profile Management Actions
 * @module lib/actions/settings.profile
 *
 * Server actions for user profile management including profile updates,
 * avatar uploads, and email address changes.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { updateProfileAction } from '@/lib/actions/settings.profile';
 *
 * function ProfileForm() {
 *   const [state, formAction, isPending] = useActionState(updateProfileAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z, type ZodIssue } from 'zod';
import type { ActionResult } from './settings.types';
import {
  getAuthUser,
  getAuthToken,
  createAuditContext,
  enhancedFetch,
  verifyCurrentPassword,
  BACKEND_URL
} from './settings.utils';
import {
  updateProfileSchema,
  changeEmailSchema,
} from '@/schemas/settings.schemas';
import { auditLog } from '@/lib/audit';

/**
 * Update user profile
 * Handles profile information updates including name, phone, title, department, and bio
 * @param prevState - Previous form state
 * @param formData - Form data containing profile fields
 * @returns Action result with success status and any errors
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
    revalidateTag('user-settings', 'default');
    revalidateTag(`user-${user.id}`, 'default');
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
 * Handles avatar image upload with validation for file type and size
 * @param prevState - Previous form state
 * @param formData - Form data containing avatar file
 * @returns Action result with avatar URL and any errors
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
    revalidateTag('user-settings', 'default');
    revalidateTag(`user-${user.id}`, 'default');
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
 * Initiates email change process with verification sent to new email
 * Requires current password confirmation for security
 * @param prevState - Previous form state
 * @param formData - Form data containing new email and current password
 * @returns Action result with status message
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
