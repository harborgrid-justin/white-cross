/**
 * @fileoverview System Settings Management Operations
 * @module lib/actions/admin.settings
 *
 * HIPAA-compliant server actions for system settings management with
 * comprehensive caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for configuration changes
 * - Type-safe settings operations
 * - Comprehensive error handling and validation
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPut, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import type {
  ActionResult,
  SystemSettings,
  ApiResponse,
} from './admin.types';

// ==========================================
// SYSTEM SETTINGS OPERATIONS
// ==========================================

/**
 * Update system setting
 * Includes audit logging and cache invalidation
 */
export async function updateSystemSettingAction(
  key: string,
  value: string
): Promise<ActionResult<SystemSettings>> {
  try {
    if (!key) {
      return {
        success: false,
        error: 'Setting key is required'
      };
    }

    const response = await serverPut<ApiResponse<SystemSettings>>(
      API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key),
      { value },
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_SETTINGS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update system setting');
    }

    // AUDIT LOG - System setting update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_CONFIGURATION,
      resource: 'SystemSettings',
      resourceId: key,
      details: `Updated system setting: ${key}`,
      changes: { value },
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_SETTINGS, 'default');
    revalidatePath('/admin/settings', 'page');

    return {
      success: true,
      data: response.data,
      message: 'System setting updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update system setting';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_CONFIGURATION,
      resource: 'SystemSettings',
      resourceId: key,
      details: `Failed to update system setting: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
