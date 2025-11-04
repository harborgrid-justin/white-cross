/**
 * @fileoverview Privacy Settings and Data Export Actions
 * @module lib/actions/settings.privacy
 *
 * Server actions for privacy settings management and user data export.
 * Includes HIPAA-compliant data export functionality.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { updatePrivacySettingsAction } from '@/lib/actions/settings.privacy';
 *
 * function PrivacyForm() {
 *   const [state, formAction, isPending] = useActionState(updatePrivacySettingsAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';
'use cache';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cacheLife, cacheTag } from 'next/cache';
import { type ZodIssue } from 'zod';
import type { ActionResult } from './settings.types';
import {
  getAuthUser,
  createAuditContext,
  enhancedFetch,
  BACKEND_URL
} from './settings.utils';
import {
  updatePrivacySettingsSchema,
} from '@/schemas/settings.schemas';
import { auditLog } from '@/lib/audit';

/**
 * Update privacy settings
 * Handles privacy-related settings including profile visibility,
 * contact information visibility, and data sharing preferences
 * @param prevState - Previous form state
 * @param formData - Form data containing privacy settings
 * @returns Action result with success status and any errors
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
    revalidateTag('user-settings', 'default');
    revalidateTag(`user-${user.id}`, 'default');
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
 * Initiates a comprehensive export of all user data
 * Returns a URL to download the exported data package
 * @returns Action result with export URL
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
 * Retrieves all user settings with Next.js v16 caching
 * Cached for 5 minutes with automatic revalidation
 * @returns Action result with user settings data
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
