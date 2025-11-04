/**
 * @fileoverview Broadcast CRUD Operations
 * @module lib/actions/broadcasts/crud
 *
 * Create and update operations for broadcasts with HIPAA audit logging
 * and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Utils
import { validateEmail } from '@/utils/validation/userValidation';

// Types
import type { ApiResponse } from '@/types';
import type {
  Broadcast,
  CreateBroadcastData,
  UpdateBroadcastData,
  ActionResult
} from './broadcasts.types';

// Import constant for use
import { BROADCAST_CACHE_TAGS as CACHE_TAGS } from './broadcasts.types';

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create a new broadcast
 * Includes audit logging and cache invalidation
 */
export async function createBroadcastAction(data: CreateBroadcastData): Promise<ActionResult<Broadcast>> {
  try {
    // Validate required fields
    if (!data.title || !data.content || !data.type || !data.targetAudience) {
      return {
        success: false,
        error: 'Missing required fields: title, content, type, targetAudience'
      };
    }

    // Validate email format if type is email
    if (data.type === 'email' && data.customRecipients) {
      const invalidEmails = data.customRecipients.filter(email => !validateEmail(email));
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(', ')}`
        };
      }
    }

    const response = await serverPost<ApiResponse<Broadcast>>(
      API_ENDPOINTS.BROADCASTS.BASE,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.BROADCASTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create broadcast');
    }

    // AUDIT LOG - Broadcast creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: response.data.id,
      details: `Created ${data.type} broadcast: ${data.title} for ${data.targetAudience}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.BROADCASTS, 'default');
    revalidateTag('broadcast-list', 'default');
    revalidatePath('/broadcasts', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create broadcast';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      details: `Failed to create broadcast: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Update broadcast
 * Includes audit logging and cache invalidation
 */
export async function updateBroadcastAction(
  broadcastId: string,
  data: UpdateBroadcastData
): Promise<ActionResult<Broadcast>> {
  try {
    if (!broadcastId) {
      return {
        success: false,
        error: 'Broadcast ID is required'
      };
    }

    // Validate email format if type is email and custom recipients provided
    if (data.type === 'email' && data.customRecipients) {
      const invalidEmails = data.customRecipients.filter(email => !validateEmail(email));
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(', ')}`
        };
      }
    }

    const response = await serverPut<ApiResponse<Broadcast>>(
      API_ENDPOINTS.BROADCASTS.BY_ID(broadcastId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.BROADCASTS, `broadcast-${broadcastId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update broadcast');
    }

    // AUDIT LOG - Broadcast update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: 'Updated broadcast information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.BROADCASTS, 'default');
    revalidateTag(`broadcast-${broadcastId}`, 'default');
    revalidateTag('broadcast-list', 'default');
    revalidatePath('/broadcasts', 'page');
    revalidatePath(`/broadcasts/${broadcastId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update broadcast';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: `Failed to update broadcast: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
