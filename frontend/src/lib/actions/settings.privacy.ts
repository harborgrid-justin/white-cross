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

import { revalidatePath, revalidateTag } from 'next/cache';
import type { ZodError } from 'zod';
import type { ActionResult } from './settings.types';
import {
  getAuthUser,
  createAuditContext
} from './settings.utils';
import { API_ENDPOINTS } from '@/constants/api';
import { serverGet, serverPost, serverPut } from '@/lib/api/server';
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
  _prevState: ActionResult,
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
      validation.error.issues.forEach((err) => {
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

    await serverPut(`${API_ENDPOINTS.USERS.BASE}/${user.id}/privacy-settings`, validation.data, {
      cache: 'no-store',
      next: {
        tags: ['user-settings', `user-${user.id}`]
      }
    });

    await auditLog({
      action: 'UPDATE_PRIVACY_SETTINGS',
      resource: 'User',
      resourceId: user.id,
      changes: validation.data,
      success: true,
      userId: auditContext.userId ?? undefined,
      ipAddress: auditContext.ipAddress ?? undefined,
      userAgent: auditContext.userAgent ?? undefined
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

    const result = await serverPost<{ exportUrl: string }>(`${API_ENDPOINTS.USERS.BASE}/${user.id}/export`);

    await auditLog({
      action: 'EXPORT_USER_DATA',
      resource: 'User',
      resourceId: user.id,
      success: true,
      userId: auditContext.userId ?? undefined,
      ipAddress: auditContext.ipAddress ?? undefined,
      userAgent: auditContext.userAgent ?? undefined
    });

    return {
      success: true,
      data: { exportUrl: result.exportUrl },
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
 * Retrieves all user settings with Next.js caching
 * Cached for 5 minutes with automatic revalidation
 * @returns Action result with user settings data
 */
export async function getUserSettingsAction() {
  try {
    const user = await getAuthUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const result = await serverGet<{ data?: unknown }>(
      `${API_ENDPOINTS.USERS.BASE}/${user.id}/settings`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: 300, // 5 minutes
          tags: ['user-settings', `user-${user.id}`]
        }
      }
    );

    return {
      success: true,
      data: result.data ?? result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user settings'
    };
  }
}
