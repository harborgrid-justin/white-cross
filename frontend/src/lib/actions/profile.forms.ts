/**
 * @fileoverview Profile Form Handlers
 * @module lib/actions/profile.forms
 *
 * Form-friendly wrapper functions for profile actions.
 * Converts FormData to typed objects and delegates to core action functions.
 *
 * Features:
 * - FormData to typed object conversion
 * - Automatic path revalidation
 * - Integration with core action modules
 */

'use server';

import { revalidatePath } from 'next/cache';
import { updateProfileAction } from './profile.crud';
import { changePasswordAction } from './profile.security';
import type {
  ActionResult,
  UserProfile,
  UpdateProfileData,
  ChangePasswordData
} from './profile.types';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Update profile from form data
 * Form-friendly wrapper for updateProfileAction
 *
 * @param userId - The user ID to update
 * @param formData - FormData from form submission
 * @returns Action result with updated profile or error
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc as any)[key] = value;
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
 *
 * @param userId - The user ID to change password for
 * @param formData - FormData from form submission
 * @returns Action result with success status or error
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
