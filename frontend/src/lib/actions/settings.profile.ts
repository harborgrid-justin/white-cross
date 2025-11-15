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
import { serverPost, serverPut, nextFetch } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import type { ActionResult } from './settings.types';
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
  try {
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

    const response = await serverPut(
      API_ENDPOINTS.USERS.PROFILE,
      validation.data,
      {
        cache: 'no-store',
        next: { tags: ['user-settings', 'user-profile'] }
      }
    );

    // Enhanced cache invalidation
    revalidateTag('user-settings', 'default');
    revalidateTag('user-profile', 'default');
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
  try {
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

    const response = await nextFetch<{ avatarUrl: string }>(
      `${API_ENDPOINTS.USERS.BASE}/avatar`,
      {
        method: 'POST',
        body: uploadFormData,
        headers: {
          // Don't set Content-Type - let browser set it for multipart/form-data
        },
        cache: 'no-store',
        next: { tags: ['user-settings', 'user-profile'] }
      }
    );

    // Enhanced cache invalidation
    revalidateTag('user-settings', 'default');
    revalidateTag('user-profile', 'default');
    revalidatePath('/settings/profile');

    return {
      success: true,
      data: response,
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
  try {
    const newEmail = formData.get('newEmail')?.toString();
    const currentPassword = formData.get('currentPassword')?.toString();

    if (!newEmail || !currentPassword) {
      return {
        errors: {
          _form: ['Email and current password are required']
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

    // First verify current password
    const passwordResponse = await serverPost(
      API_ENDPOINTS.AUTH.VERIFY,
      { password: currentPassword },
      {
        cache: 'no-store'
      }
    );

    if (!passwordResponse) {
      return {
        errors: {
          _form: ['Current password is incorrect']
        }
      };
    }

    // Change email
    const response = await serverPost(
      `${API_ENDPOINTS.USERS.BASE}/email`,
      { newEmail },
      {
        cache: 'no-store',
        next: { tags: ['user-settings', 'user-profile'] }
      }
    );

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
